# Complete Saga Architecture Guide

## Overview

This system implements a **distributed saga pattern** with two coordinated orchestrators:
- **Keycloak Provisioning Saga** (30 steps) - Tenant identity & authorization setup
- **ERP Provisioning Saga** (8 steps) - Business application database & data seeding

**Integration:** Event-driven coordination via RabbitMQ MassTransit

---

## 1. KEYCLOAK PROVISIONING SAGA

### Orchestrator
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/TenantProvisioningSagaOrchestrator.cs`

### Complete Step Order (30 Steps)

```
Phase 1: Invoice & Business Owner (Steps 1-4)
├─ 1. CreateBusinessOwner          ✅ Idempotent (skip if InvoiceAlreadyCreated)
├─ 2. CreateInvoice                ✅ Idempotent (skip if InvoiceAlreadyCreated)
├─ 3. AddPackage                   ✅ Idempotent (skip if no package data)
└─ 4. SendInvoiceEmail             ✅ Idempotent (skip if offline/already sent)

Phase 2: Keycloak Realm Setup (Steps 5-11)
├─ 5. CreateRealm                  ❌ NOT IDEMPOTENT - needs existence check
├─ 6. EnableEventListeners         ⚠️  CONDITIONAL - updates existing realm
├─ 7. ConfigureRealmEvents         ⚠️  CONDITIONAL - updates existing realm
├─ 8. ConfigureLoginSettings       ⚠️  CONDITIONAL - updates existing realm
├─ 9. ConfigureEmailSettings       ⚠️  CONDITIONAL - updates existing realm
├─ 10. ConfigureSecurityHeaders    ⚠️  CONDITIONAL - updates existing realm
└─ 11. UpdateTheme                 ⚠️  CONDITIONAL - updates existing realm

Phase 3: Client Registration (Steps 12-15)
├─ 12. CreateAngularClient         ❌ NOT IDEMPOTENT - needs existence check
├─ 13. CreateMobileClient          ❌ NOT IDEMPOTENT - needs existence check
├─ 14. CreateAuthenticationFlow    ❌ NOT IDEMPOTENT - needs existence check
└─ 15. CreateClientScopes          ❌ NOT IDEMPOTENT - needs existence check

Phase 4: Groups & Users (Steps 16-18)
├─ 16. CreateGroupsAndAdmin        ❌ NOT IDEMPOTENT - needs existence check
├─ 17. CreateCompanyAndBranch      ❌ NOT IDEMPOTENT - needs existence check
└─ 18. SyncUserToBusinessOwnerRealm ✅ Idempotent (checks user existence)

Phase 5: Identity Brokering (Steps 19-21)
├─ 19. CreateFirstBrokerLoginFlow  ✅ Idempotent (checks flow existence)
├─ 20. ConfigureIdentityBrokering  ⚠️  PARTIAL - broker creation not checked
└─ 21. ConfigureTenantClientScope  ⚠️  CONDITIONAL - depends on broker client

Phase 6: User Provisioning (Steps 22-24)
├─ 22. CreateKeycloakUser          ❌ NOT IDEMPOTENT - needs existence check
├─ 23. BindAuthFlow                ⚠️  CONDITIONAL - updates client
└─ 24. AddDeviceMapper             ⚠️  CONDITIONAL - adds protocol mapper

Phase 7: ERP Integration (Steps 25-27)
├─ 25. TriggerErpProvisioning      ✅ Idempotent (only publishes event)
├─ 26. WaitingForErpProvisioning   ✅ Idempotent (waits for completion flag)
└─ 27. SendNotification            ⚠️  CONDITIONAL - sends email (may duplicate)

Phase 8: Completion
└─ 28. Completed                   ✅ Always safe
```

### State Management

**Database Entity:** `SubdomainState`
```csharp
public class SubdomainState
{
    public Guid Id { get; set; }
    public string SubdomainName { get; set; }
    public Guid? SubdomainId { get; set; }
    public Guid? InvoiceId { get; set; }

    // Saga execution state
    public KeycloakProvisioningStep CurrentStep { get; set; }
    public KeycloakProvisioningStep? LastCompletedStep { get; set; }
    public bool IsCompleted { get; set; }

    // Serialized state object (JSON)
    public string? StateObject { get; set; }  // → KeycloakProvisioningSagaState

    // Online payment fields
    public bool IsOnlinePayment { get; set; }
    public string? CheckoutId { get; set; }

    // Step execution tracking
    public ICollection<SagaStepExecution> Steps { get; set; }
}
```

**In-Memory State Object:** `KeycloakProvisioningSagaState`
```csharp
public class KeycloakProvisioningSagaState
{
    // Flow control
    public KeycloakProvisioningStep? StartFromStep { get; set; }
    public bool IsResumed { get; set; }
    public bool InvoiceAlreadyCreated { get; set; }

    // Keycloak resource IDs
    public string? RealmName { get; set; }
    public string? AngularClientId { get; set; }
    public string? MobileClientId { get; set; }
    public string? BusinessOwnerIdentityId { get; set; }
    public string? CompanyId { get; set; }
    public string? BranchId { get; set; }
    public string? BrokerClientUuid { get; set; }  // CRITICAL for ConfigureTenantClientScope

    // Persistence flags (for idempotency)
    public bool RealmCreated { get; set; }
    public bool AngularClientCreated { get; set; }
    public bool MobileClientCreated { get; set; }
    public bool CompanyGroupCreated { get; set; }

    // ERP coordination
    public bool ErpProvisioningTriggered { get; set; }
    public bool ErpProvisioningCompleted { get; set; }
    public bool ErpProvisioningFailed { get; set; }
    public string? ErpProvisioningError { get; set; }

    // Step tracking
    public Dictionary<KeycloakProvisioningStep, bool> StepResults { get; set; }
    public Dictionary<KeycloakProvisioningStep, string> StepErrors { get; set; }
}
```

### Retry Safety Patterns

#### ✅ Safe Retry Pattern (Example: SyncUserToBusinessOwnerRealmStep)
```csharp
public override async Task<bool> ExecuteStepLogicAsync(KeycloakProvisioningSagaState state, CancellationToken ct)
{
    // 1. Check if resource already exists
    var existingUser = await keycloakProvider.GetUserByEmailAsync(
        KeycloakConstants.Realms.BusinessOwner,
        state.BusinessOwnerEmail, ct);

    if (existingUser == null)
    {
        // 2. Create new resource
        var userId = await keycloakProvider.CreateUserAsync(...);
        state.BusinessOwnerIdentityId = userId;
    }
    else
    {
        // 3. Update existing resource (idempotent operation)
        await keycloakProvider.UpdateUserAttributesAsync(...);
        state.BusinessOwnerIdentityId = existingUser.Id;
    }

    return true;
}
```

#### ❌ Unsafe Retry Pattern (Example: CreateRealmStep - NEEDS FIX)
```csharp
public override async Task<bool> ExecuteStepLogicAsync(KeycloakProvisioningSagaState state, CancellationToken ct)
{
    // NO EXISTENCE CHECK - Will fail on retry!
    await keycloakProvider.CreateRealmAsync(state.SubdomainName, ct);

    state.RealmName = state.SubdomainName;
    state.RealmCreated = true;

    return true;
}
```

### Special Features

#### 1. Online Payment Flow (Resume Capability)
```csharp
// Phase 1: Create Invoice & Send Email → STOP
var invoice = await onlineInvoiceService.CreateOnlineInvoiceAsync(dto, ct);
// Saga pauses after SendInvoiceEmail (step 4)

// User pays...

// Phase 2: Resume from CreateRealm (step 5)
state.StartFromStep = KeycloakProvisioningStep.CreateRealm;
state.IsResumed = true;
state.InvoiceAlreadyCreated = true;

var result = await orchestrator.ExecuteNextStepAsync(state, ct);
// Saga continues: CreateRealm → ... → Completed
```

#### 2. Waitable Steps (ERP Coordination)
```csharp
public interface IWaitableStep
{
    Task<WaitStatus> CheckWaitConditionAsync(KeycloakProvisioningSagaState state, CancellationToken ct);
}

public enum WaitStatus
{
    StillWaiting,      // Pause saga execution
    ReadyToContinue,   // Mark completed and advance
    Failed             // Stop saga with error
}

// Implementation in WaitingForErpProvisioningStep
public Task<WaitStatus> CheckWaitConditionAsync(KeycloakProvisioningSagaState state, CancellationToken ct)
{
    if (state.ErpProvisioningCompleted) return Task.FromResult(WaitStatus.ReadyToContinue);
    if (state.ErpProvisioningFailed) return Task.FromResult(WaitStatus.Failed);
    return Task.FromResult(WaitStatus.StillWaiting);
}
```

#### 3. Persistence Handlers (Post-Step Actions)
```csharp
public interface ISagaStepPersistenceHandler
{
    KeycloakProvisioningStep Step { get; }
    Task HandleAsync(KeycloakProvisioningSagaState state, CancellationToken ct);
}

// Example: Save Keycloak config after CreateAngularClient
public class CreateAngularClientPersistenceHandler : ISagaStepPersistenceHandler
{
    public async Task HandleAsync(KeycloakProvisioningSagaState state, CancellationToken ct)
    {
        // Save KeycloakConfig to database with client IDs
        var keycloakConfig = new KeycloakConfig
        {
            Realm = state.SubdomainName,
            RealmClients = new List<RealmClient>
            {
                new() { ClientId = state.AngularClientId, ClientSource = ClientSource.Angular },
                new() { ClientId = state.MobileClientId, ClientSource = ClientSource.Vansales }
            }
        };
        await repository.AddAsync(keycloakConfig, ct);
    }
}
```

---

## 2. ERP PROVISIONING SAGA

### Orchestrator
**File:** `Src/AppsPortal/Accounting/AppsPortal.Application/Core/State/ErpSubdomainOrchestrator.cs`

### Complete Step Order (8 Steps)

```
Phase 1: Database Provisioning (Steps 1-3)
├─ 1. DatabaseMigration            ✅ Idempotent (EF migrations)
├─ 2. ZatcaMigration              ✅ Idempotent (migration framework)
└─ 3. ImportMigration             ✅ Idempotent (migration framework)

Phase 2: Master Data Seeding (Steps 4-6)
├─ 4. SeedCompany                 ✅ Idempotent (checks existence)
├─ 5. SeedBranch                  ✅ Idempotent (checks existence)
└─ 6. SeedUser                    ✅ Idempotent (checks existence)

Phase 3: Business Data Seeding (Steps 7-8)
├─ 7. SeedBusinessData            ✅ Idempotent (delegate to ISeedingOrchestrator)
└─ 8. Completed                   ✅ Always safe
```

### State Management

**Database Entity:** `SubdomainProvisioningState`
```csharp
public class SubdomainProvisioningState
{
    public Guid Id { get; set; }
    public string SubdomainName { get; set; }
    public Guid SubdomainId { get; set; }

    // Saga execution state
    public ErpProvisioningStep CurrentStep { get; set; }
    public ErpProvisioningStep? LastCompletedStep { get; set; }
    public bool IsCompleted { get; set; }

    // Serialized state object (JSON)
    public string StateObject { get; set; }  // → ErpProvisioningSagaState

    // Step execution tracking
    public ICollection<ErpSagaStepExecution> Steps { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**In-Memory State Object:** `ErpProvisioningSagaState`
```csharp
public class ErpProvisioningSagaState
{
    // Tenant info
    public string SubdomainName { get; set; }
    public Guid SubdomainId { get; set; }
    public string TenantId { get; set; }
    public string ConnectionString { get; set; }

    // Company/Branch
    public Guid CompanyId { get; set; }
    public string CompanyNameEn { get; set; }
    public string CompanyNameAr { get; set; }
    public Guid BranchId { get; set; }
    public string BranchNameEn { get; set; }
    public string BranchNameAr { get; set; }

    // User info
    public string IdentityId { get; set; }
    public string OwnerName { get; set; }
    public string OwnerEmail { get; set; }

    // Persistence flags
    public bool DatabaseMigrated { get; set; }
    public bool CompanySeeded { get; set; }
    public bool BranchSeeded { get; set; }
    public bool UserSeeded { get; set; }
    public bool BusinessDataSeeded { get; set; }

    // Step tracking
    public Dictionary<ErpProvisioningStep, bool> StepResults { get; set; }
    public Dictionary<ErpProvisioningStep, string> StepErrors { get; set; }
}
```

### Idempotency Pattern (All ERP Steps Follow This)

```csharp
// Example: SeedCompanyStep
public override async Task<bool> ExecuteStepLogicAsync(ErpProvisioningSagaState state, CancellationToken ct)
{
    // 1. Check persistence flag first
    if (state.CompanySeeded)
    {
        logger.LogInformation("Company already seeded (from state flag), skipping");
        return true;
    }

    // 2. Check if resource exists in database
    var existingCompany = await companyRepository
        .GetQueryable()
        .FirstOrDefaultAsync(c => c.Id == state.CompanyId, ct);

    if (existingCompany != null)
    {
        logger.LogWarning("Company {CompanyId} already exists, skipping creation", state.CompanyId);
        state.CompanySeeded = true;  // Update flag for future retries
        return true;
    }

    // 3. Create resource
    var company = Company.Create(state.CompanyId, state.CompanyNameEn, state.CompanyNameAr, ...);
    await companyRepository.AddAsync(company, ct);

    // 4. Mark as completed
    state.CompanySeeded = true;

    return true;
}
```

### Special Architecture

#### 1. First Step Special Handling (DatabaseMigration)
```csharp
// DatabaseMigration runs BEFORE database exists
// Cannot use normal step execution pattern
private async Task<ErpProvisioningSagaState?> ExecuteFirstStepAsync(...)
{
    // 1. Execute migration (creates database)
    var step = scopeProvider.GetRequiredService<DatabaseMigrationStep>();
    await step.ExecuteAsync(state, ct);

    // 2. NOW set connection string and create saga state record
    var appsContext = scopeProvider.GetRequiredService<IMicrotecAppsDbContext>();
    appsContext.HasConnectionString = true;
    appsContext.Context.Database.SetConnectionString(state.ConnectionString);

    // 3. Create SubdomainProvisioningState record in the new database
    var sagaState = new SubdomainProvisioningState
    {
        SubdomainName = state.SubdomainName,
        CurrentStep = ErpProvisioningStep.ZatcaMigration,  // Next step
        StateObject = JsonSerializer.Serialize(state)
    };
    await repository.AddAsync(sagaState, ct);

    return state;
}
```

#### 2. Dual-Scope Error Recovery
```csharp
public async Task<ErpProvisioningSagaState?> ExecuteNextStepAsync(...)
{
    using var scope = scopeFactory.CreateScope();

    try
    {
        // Execute step with current scope
        var result = await ExecuteStepInternalAsync(scope, state, ct);
        return result;
    }
    catch (Exception ex)
    {
        // Scope may be corrupted - dispose it
        scope.Dispose();

        // Create fresh scope to persist failure
        using var errorScope = scopeFactory.CreateScope();
        var appsContext = errorScope.ServiceProvider.GetRequiredService<IMicrotecAppsDbContext>();
        appsContext.HasConnectionString = true;
        appsContext.Context.Database.SetConnectionString(state.ConnectionString);

        // Reload saga state and mark as failed
        var repository = errorScope.ServiceProvider.GetRequiredService<IRepository<SubdomainProvisioningState>>();
        var sagaState = await repository.FirstOrDefaultAsync(
            filter: s => s.SubdomainName == state.SubdomainName, ct);

        sagaState.StateObject = JsonSerializer.Serialize(state);
        await repository.SaveChangesAsync(ct);

        // Publish failure event
        await PublishCompletionEventAsync(state, success: false, ex.Message, ct);

        return null;
    }
}
```

---

## 3. SAGA COORDINATION (Keycloak ↔ ERP)

### Event Flow

```
┌─────────────────────────────────────────────────────────────┐
│ KEYCLOAK SAGA (BusinessOwners Service)                      │
├─────────────────────────────────────────────────────────────┤
│ Steps 1-24: Invoice, Realm, Clients, Groups, Users         │
│                                                             │
│ Step 25: TriggerErpProvisioningStep                        │
│    └─ Publishes: SubdomainCreatedIntegrationEvent          │
│       ├─ Queue: CreatedSubdomainQueue                      │
│       ├─ Event Data: Company, Branch, User, Subdomain info │
│       └─ Sets: state.ErpProvisioningTriggered = true       │
│                                                             │
│ Step 26: WaitingForErpProvisioningStep (IWaitableStep)     │
│    └─ Checks: state.ErpProvisioningCompleted ?             │
│       ├─ true  → WaitStatus.ReadyToContinue                │
│       ├─ false → WaitStatus.StillWaiting (pause saga)      │
│       └─ error → WaitStatus.Failed                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ RabbitMQ Event
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ERP SAGA (AppsPortal Service)                               │
├─────────────────────────────────────────────────────────────┤
│ SubdomainCreatedConsumer                                    │
│    └─ Receives: SubdomainCreatedIntegrationEvent           │
│       └─ Calls: orchestrator.ExecuteAllStepsAsync()        │
│                                                             │
│ Steps 1-8: Database, Migrations, Company, Branch, User     │
│                                                             │
│ On Completion (success or failure):                        │
│    └─ Publishes: SubdomainSeedingCompletedEvent            │
│       ├─ Queue: Default                                    │
│       ├─ Event Data: Success flag, Error message, Details  │
│       └─ Fields: SubdomainName, StepDetailsJson            │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ RabbitMQ Event
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ KEYCLOAK SAGA RESUME (BusinessOwners Service)               │
├─────────────────────────────────────────────────────────────┤
│ SubdomainSeedingCompletedConsumer                          │
│    └─ Receives: SubdomainSeedingCompletedEvent             │
│       ├─ If Success:                                       │
│       │  ├─ Sets: state.ErpProvisioningCompleted = true   │
│       │  └─ Resumes saga (ExecuteNextStepAsync loop)      │
│       │     └─ WaitingForErpProvisioning → SendNotification│
│       └─ If Failed:                                        │
│          ├─ Sets: state.ErpProvisioningFailed = true      │
│          ├─ Sets: state.ErpProvisioningError = message    │
│          └─ Stops saga (manual retry required)            │
└─────────────────────────────────────────────────────────────┘
```

### Integration Event Contracts

**SubdomainCreatedIntegrationEvent** (Keycloak → ERP)
```csharp
public class SubdomainCreatedIntegrationEvent : IntegrationEvent
{
    public Guid SubdomainId { get; set; }
    public string SubDomainName { get; set; }
    public string TenantId { get; set; }

    // Company
    public Guid Id { get; set; }  // CompanyId
    public string NameEn { get; set; }
    public string NameAr { get; set; }

    // Branch
    public Guid BranchId { get; set; }
    public string BranchNameEn { get; set; }
    public string BranchNameAr { get; set; }

    // User
    public string IdentityId { get; set; }
    public string OwnerName { get; set; }
    public string OwnerEmail { get; set; }
    public string Phone { get; set; }

    // Queue configuration
    public override string SourceService => SystemServices.BusinessOwners;
    public override string TargetService => SystemServices.AppsPortal;
}
```

**SubdomainSeedingCompletedEvent** (ERP → Keycloak)
```csharp
public class SubdomainSeedingCompletedEvent : IntegrationEvent
{
    public string SubDomainName { get; set; }
    public Guid SubdomainId { get; set; }

    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }

    public DateTime CompletedAt { get; set; }
    public int TotalStepsAttempted { get; set; }
    public string? FailedAtStep { get; set; }
    public string? StepDetailsJson { get; set; }

    public override string SourceService => SystemServices.AppsPortal;
    public override string TargetService => SystemServices.BusinessOwners;
}
```

---

## 4. RETRY & RECOVERY STRATEGIES

### Manual Retry (Current Implementation)

**Keycloak Saga Retry:**
```csharp
// Endpoint: POST /Subdomain/{subdomainName}/retry
public async Task<bool> RetrySagaAsync(string subdomainName, CancellationToken ct)
{
    // 1. Load current saga state
    var saga = await repository.FirstOrDefaultAsync(
        filter: s => s.SubdomainName == subdomainName, ct);

    // 2. Deserialize state
    var state = JsonSerializer.Deserialize<KeycloakProvisioningSagaState>(saga.StateObject);

    // 3. Resume from last completed step + 1
    state.StartFromStep = null;  // Will auto-resume from LastCompletedStep

    // 4. Execute saga
    var result = await orchestrator.ExecuteNextStepAsync(state, ct);

    return result?.IsCompleted ?? false;
}
```

**ERP Saga Retry:**
```csharp
// Option 1: Re-trigger from Keycloak saga
// Endpoint: POST /Subdomain/{subdomainName}/retry-erp
public async Task RetriggerErpProvisioningAsync(string subdomainName, CancellationToken ct)
{
    var saga = await repository.FirstOrDefaultAsync(
        filter: s => s.SubdomainName == subdomainName, ct);

    var state = JsonSerializer.Deserialize<KeycloakProvisioningSagaState>(saga.StateObject);

    // Re-publish SubdomainCreatedIntegrationEvent
    await publisher.Publish(new SubdomainCreatedIntegrationEvent
    {
        SubdomainId = state.SubdomainId,
        SubDomainName = state.SubdomainName,
        // ... populate from state
    }, ct);
}

// Option 2: Direct ERP orchestrator call (for debugging)
// AppsPortal endpoint
public async Task RetryErpSagaAsync(string subdomainName, CancellationToken ct)
{
    var saga = await repository.FirstOrDefaultAsync(
        filter: s => s.SubdomainName == subdomainName, ct);

    var state = JsonSerializer.Deserialize<ErpProvisioningSagaState>(saga.StateObject);

    // Execute from last completed step
    await orchestrator.ExecuteNextStepAsync(state, ct);
}
```

### Error Detection

**Keycloak Saga:**
```csharp
// Query saga status
var status = await subdomainStateService.GetSubdomainStatusAsync(subdomainName, ct);

if (status.HasErrors)
{
    // Check specific step errors
    var failedStep = status.Steps.FirstOrDefault(s => s.HasError);
    Console.WriteLine($"Failed at: {failedStep.StepName}");
    Console.WriteLine($"Error: {failedStep.ErrorMessage}");
}

// Check ERP coordination
if (status.ErpStatus.HasFailed)
{
    Console.WriteLine($"ERP failed: {status.ErpStatus.ErrorMessage}");
    // Retry ERP saga specifically
}
```

**ERP Saga:**
```csharp
// Check SubdomainSeedingCompletedEvent in Keycloak saga state
if (state.ErpProvisioningFailed)
{
    Console.WriteLine($"ERP Error: {state.ErpProvisioningError}");
    // Retry ERP saga
}
```

---

## 5. IDEMPOTENCY REQUIREMENTS

### Critical Improvements Needed

#### Priority 1: Resource Creation Steps

**CreateRealmStep** - Add realm existence check
```csharp
// BEFORE (Not Idempotent)
await keycloakProvider.CreateRealmAsync(state.SubdomainName, ct);

// AFTER (Idempotent)
var existingRealm = await keycloakProvider.GetRealmAsync(state.SubdomainName, ct);
if (existingRealm == null)
{
    await keycloakProvider.CreateRealmAsync(state.SubdomainName, ct);
}
state.RealmCreated = true;
```

**CreateAngularClientStep** - Check client existence
```csharp
// BEFORE (Not Idempotent)
var clientId = await keycloakProvider.CreateClientAsync(...);

// AFTER (Idempotent)
var existingClient = await keycloakProvider.GetClientByClientIdAsync(
    state.SubdomainName,
    $"{state.SubdomainName}-angular-client",
    ct);

if (existingClient == null)
{
    var clientId = await keycloakProvider.CreateClientAsync(...);
    state.AngularClientId = clientId;
}
else
{
    state.AngularClientId = existingClient.Id;
}
state.AngularClientCreated = true;
```

**CreateMobileClientStep** - Same pattern as Angular client

**CreateGroupsAndAdminStep** - Check group/user existence
```csharp
// BEFORE (Not Idempotent)
var groupId = await keycloakProvider.CreateGroupAsync(realm, "admin", ...);

// AFTER (Idempotent)
var existingGroup = await keycloakProvider.GetGroupByNameAsync(realm, "admin", ct);
if (existingGroup == null)
{
    var groupId = await keycloakProvider.CreateGroupAsync(realm, "admin", ...);
}
else
{
    // Group exists, skip creation
}
```

#### Priority 2: Configuration Steps

**CreateClientScopesStep** - Check scope existence before creation
**CreateAuthenticationFlowStep** - Check flow existence (may already work due to Keycloak API)
**ConfigureIdentityBrokeringStep** - Add broker client existence check

### Idempotency Checklist

```
✅ Phase 1: Invoice & Business Owner
   ├─ CreateBusinessOwner - Skip if InvoiceAlreadyCreated
   ├─ CreateInvoice - Skip if InvoiceAlreadyCreated
   ├─ AddPackage - Skip if no package data
   └─ SendInvoiceEmail - Skip if offline/already sent

❌ Phase 2: Realm Setup (NEEDS WORK)
   ├─ CreateRealm - ADD existence check
   ├─ EnableEventListeners - Should be safe (update operation)
   ├─ ConfigureRealmEvents - Should be safe (update operation)
   ├─ ConfigureLoginSettings - Should be safe (update operation)
   ├─ ConfigureEmailSettings - Should be safe (update operation)
   ├─ ConfigureSecurityHeaders - Should be safe (update operation)
   └─ UpdateTheme - Should be safe (update operation)

❌ Phase 3: Clients (NEEDS WORK)
   ├─ CreateAngularClient - ADD existence check
   ├─ CreateMobileClient - ADD existence check
   ├─ CreateAuthenticationFlow - ADD existence check or verify API behavior
   └─ CreateClientScopes - ADD existence check

❌ Phase 4: Groups & Users (NEEDS WORK)
   ├─ CreateGroupsAndAdmin - ADD existence check
   ├─ CreateCompanyAndBranch - ADD existence check
   └─ SyncUserToBusinessOwnerRealm - Already idempotent ✅

⚠️  Phase 5: Identity Brokering (PARTIAL)
   ├─ CreateFirstBrokerLoginFlow - Already idempotent ✅
   ├─ ConfigureIdentityBrokering - ADD broker client check
   └─ ConfigureTenantClientScope - Depends on broker client

❌ Phase 6: User Provisioning (NEEDS WORK)
   ├─ CreateKeycloakUser - ADD existence check
   ├─ BindAuthFlow - Should be safe (update operation)
   └─ AddDeviceMapper - Should be safe (update operation)

✅ Phase 7: ERP Integration
   ├─ TriggerErpProvisioning - Already idempotent (event publish)
   ├─ WaitingForErpProvisioning - Already idempotent (state check)
   └─ SendNotification - May duplicate emails but not critical

✅ ALL ERP SAGA STEPS - Fully idempotent
```

---

## 6. PROGRESS TRACKING

### Weighted Progress Calculation

```csharp
// Keycloak Saga: 80% of total progress
public int GetProgressPercentage()
{
    var totalSteps = 26;  // Active steps (excluding NotStarted, Completed, disabled steps)
    var completedSteps = StepResults.Count(r => r.Value == true);
    return (completedSteps * 100) / totalSteps;
}

// Combined Progress: Keycloak (80%) + ERP (20%)
public int GetOverallProgressPercentage()
{
    var keycloakProgress = GetProgressPercentage();
    var erpProgress = ErpCurrentProgress;  // From ERP saga state

    return (int)((keycloakProgress * 0.8) + (erpProgress * 0.2));
}

// ERP Saga: 20% of total progress
public int GetProgressPercentage()
{
    var totalSteps = 7;  // Excluding NotStarted and Completed
    var completedSteps = StepResults.Count(r => r.Value == true);
    return (completedSteps * 100) / totalSteps;
}
```

### Step Status Display

```csharp
public class StepExecutionDto
{
    public string StepName { get; set; }
    public int StepNumber { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsCurrent { get; set; }
    public bool HasError { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    // For WaitingForErpProvisioning step
    public ErpStepDetailsDto? ErpDetails { get; set; }
}

// ERP nested details
public class ErpStepDetailsDto
{
    public int Progress { get; set; }
    public string CurrentStep { get; set; }
    public bool IsCompleted { get; set; }
    public bool HasFailed { get; set; }
    public string? ErrorMessage { get; set; }
}
```

---

## 7. MIGRATION SAGA (Keycloak Migration for Existing Tenants)

**Purpose:** Migrate legacy tenants to Keycloak without creating new invoices/companies

**Key Differences from Provisioning Saga:**
- Uses `MigrationStep` enum (not `KeycloakProvisioningStep`)
- Skips: CreateBusinessOwner, CreateInvoice, AddPackage, SendInvoiceEmail
- Includes: PublishAppsPortalSync step (updates AppsPortal with new Keycloak IDs)
- Steps 1-19: Keycloak setup (realm, clients, groups, users, identity brokering)
- Step 20: PublishAppsPortalSync (fire BoUserIdentityUpdatedIntegrationEvent)

**Migration Flow:**
```
1. Read existing subdomain, companies, branches, users from database
2. CreateRealm → Configure realm settings → Create clients
3. Create groups matching existing companies/branches
4. Create Keycloak users for existing database users
5. Save Keycloak IDs to database (User.IdentityId, Company/Branch group attributes)
6. Publish events to AppsPortal to update their User.IdentityId references
7. AppsPortal updates all audit fields (CreatedBy, UpdatedBy) to use new IDs
```

**Not covered in detail in this guide - separate orchestrator with different step set.**

---

## SUMMARY

### Architecture Strengths
✅ Distributed saga pattern with persistent state
✅ Event-driven coordination between services
✅ Waitable steps for cross-saga dependencies
✅ Progress tracking with weighted calculations
✅ Step execution history for debugging
✅ Support for online payment pause/resume
✅ ERP saga is fully idempotent

### Critical Improvements Required
❌ Keycloak saga lacks idempotency in resource creation steps (Priority 1)
❌ No automatic retry mechanism (manual intervention required)
❌ No compensation logic for partial failures
❌ SendNotification may send duplicate emails on retry

### Retry Safety Score
- **ERP Saga:** 10/10 (All steps fully idempotent)
- **Keycloak Saga:** 4/10 (Many steps will fail on retry)
- **Overall:** 6/10

### Recommended Next Steps
1. Implement idempotency for all Keycloak resource creation steps
2. Add automatic retry with exponential backoff
3. Add compensation transactions for critical steps
4. Implement circuit breaker for external API calls (Keycloak, Email)
5. Add saga timeout mechanism
6. Implement saga versioning for schema evolution
