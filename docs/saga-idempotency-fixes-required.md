# Saga Idempotency Fixes - Action Items

## CRITICAL FIXES REQUIRED (Blocking Safe Retries)

### Keycloak Saga Steps That WILL FAIL on Retry

#### 1. CreateRealmStep ❌ HIGH PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/Steps/CreateRealmsStep.cs`

**Problem:** No realm existence check - will fail with "realm already exists" error

**Fix Required:**
```csharp
// Add at start of ExecuteStepLogicAsync:
var existingRealm = await keycloakProvider.GetRealmAsync(state.SubdomainName, ct);
if (existingRealm != null)
{
    Logger.LogInformation("Realm {RealmName} already exists, skipping creation", state.SubdomainName);
    state.RealmCreated = true;
    return true;
}
```

---

#### 2. CreateAngularClientStep ❌ HIGH PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/Steps/CreateAngularClientStep.cs`

**Problem:** No client existence check - may create duplicate clients

**Fix Required:**
```csharp
// Add at start of ExecuteStepLogicAsync:
var clientId = $"{state.SubdomainName}-angular-client";
var existingClient = await keycloakProvider.GetClientByClientIdAsync(
    state.SubdomainName, clientId, ct);

if (existingClient != null)
{
    Logger.LogInformation("Angular client already exists, using existing ID");
    state.AngularClientId = existingClient.Id;
    state.AngularClientCreated = true;
    return true;
}
```

---

#### 3. CreateMobileClientStep ❌ HIGH PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/Steps/CreateMobileClientStep.cs`

**Problem:** Same as Angular client

**Fix Required:** Same pattern as CreateAngularClientStep

---

#### 4. CreateGroupsStep ❌ HIGH PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Migration/Steps/CreateGroupsStep.cs`

**Problem:** Creates groups without checking if they exist

**Fix Required:**
```csharp
// For each company/branch group:
var existingCompanyGroup = await keycloakProvider.GetGroupByNameAsync(
    state.SubdomainName, company.NameEn, ct);

if (existingCompanyGroup == null)
{
    companyGroupId = await keycloakProvider.CreateGroupAsync(...);
}
else
{
    companyGroupId = existingCompanyGroup.Id;
    Logger.LogInformation("Company group already exists, skipping");
}
```

---

#### 5. CreateUsersStep ❌ HIGH PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Migration/Steps/CreateUsersStep.cs`

**Problem:** Creates users without checking if they exist

**Fix Required:**
```csharp
// For each user:
var existingUser = await keycloakProvider.GetUserByEmailAsync(
    state.SubdomainName, user.Email, ct);

if (existingUser == null)
{
    keycloakUserId = await keycloakProvider.CreateUserAsync(...);
}
else
{
    keycloakUserId = existingUser.Id;
    Logger.LogInformation("User already exists, skipping");
}
```

---

#### 6. CreateClientScopesStep ⚠️ MEDIUM PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/Steps/CreateClientScopesStep.cs`

**Problem:** Creates scopes without existence check

**Fix Required:**
```csharp
// For each scope (email, profile, roles):
var existingScope = await keycloakProvider.GetClientScopeByNameAsync(
    state.SubdomainName, scopeName, ct);

if (existingScope == null)
{
    var scopeId = await keycloakProvider.CreateClientScopeAsync(...);
}
else
{
    var scopeId = existingScope.Id;
}
```

---

#### 7. CreateAuthenticationFlowStep ⚠️ MEDIUM PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/Steps/CreateAuthenticationFlow.cs`

**Problem:** Creates authentication flow without checking existence

**Fix Required:**
```csharp
var existingFlowId = await authenticationFlowService.GetFlowIdByAliasAsync(
    state.SubdomainName, KeycloakConstants.AuthenticationFlows.UserIdFlow, ct);

if (!string.IsNullOrEmpty(existingFlowId))
{
    Logger.LogInformation("UserIdFlow already exists, skipping");
    return true;
}
```

---

#### 8. ConfigureIdentityBrokeringStep ⚠️ MEDIUM PRIORITY
**File:** `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Invoices/Saga/Steps/ConfigureIdentityBrokeringStep.cs`

**Problem:** Creates broker client without existence check (line 160-165)

**Fix Required:**
```csharp
// Before creating broker client:
var existingBrokerClient = await keycloakProvider.GetClientByClientIdAsync(
    KeycloakConstants.Realms.BusinessOwner,
    clientId,
    ct);

if (existingBrokerClient != null)
{
    state.BrokerClientUuid = existingBrokerClient.Id;
    Logger.LogInformation("Broker client already exists");
}
else
{
    state.BrokerClientUuid = await keycloakProvider.CreateClientAsync(...);
}
```

---

## SAFE STEPS (No Action Required) ✅

### Already Idempotent
- CreateBusinessOwner (skip if InvoiceAlreadyCreated)
- CreateInvoice (skip if InvoiceAlreadyCreated)
- AddPackage (skip if no package data)
- SendInvoiceEmail (skip if offline/already sent)
- SyncUserToBusinessOwnerRealmStep (checks user existence, updates if exists)
- CreateFirstBrokerLoginFlowStep (checks flow existence)
- TriggerErpProvisioningStep (only publishes event)
- WaitingForErpProvisioningStep (only checks state flag)

### Configuration Updates (Idempotent by Nature)
- EnableEventListeners (updates realm config)
- ConfigureRealmEvents (updates realm config)
- ConfigureLoginSettings (updates realm config)
- ConfigureEmailSettings (updates realm config)
- ConfigureSecurityHeaders (updates realm config)
- UpdateTheme (updates realm config)
- BindAuthFlow (updates client config)
- AddDeviceMapper (adds protocol mapper - may create duplicate but not critical)
- ConfigureTenantClientScope (updates scope config)

### ERP Saga (All Steps Fully Idempotent) ✅
- DatabaseMigration (EF migrations are idempotent)
- ZatcaMigration (migration framework)
- ImportMigration (migration framework)
- SeedCompany (checks existence)
- SeedBranch (checks existence)
- SeedUser (checks existence)
- SeedBusinessData (delegate to seeding orchestrator)

---

## IMPLEMENTATION PRIORITY

### Phase 1: Block Immediate Failures (Week 1)
1. ✅ CreateRealmStep - Most common failure point
2. ✅ CreateAngularClientStep - Required for frontend auth
3. ✅ CreateMobileClientStep - Required for mobile auth
4. ✅ CreateGroupsStep - Required for company/branch structure
5. ✅ CreateUsersStep - Required for user access

### Phase 2: Complete Keycloak Idempotency (Week 2)
6. CreateClientScopesStep
7. CreateAuthenticationFlowStep
8. ConfigureIdentityBrokeringStep (broker client creation)

### Phase 3: Additional Safety Features (Week 3)
- Automatic retry with exponential backoff
- Circuit breaker for Keycloak API calls
- Compensation transactions for failed steps
- Saga timeout mechanism

---

## VERIFICATION CHECKLIST

After implementing fixes, verify:

```bash
# Test 1: Create subdomain normally
POST /Invoice/AddOfflineInvoice
→ Should complete successfully

# Test 2: Retry from CreateRealm (realm exists)
# Manually set LastCompletedStep = CreateBusinessOwner in database
POST /Subdomain/{subdomainName}/retry
→ Should skip realm creation and continue

# Test 3: Retry from CreateAngularClient (client exists)
# Manually set LastCompletedStep = CreateRealm
POST /Subdomain/{subdomainName}/retry
→ Should skip client creation and continue

# Test 4: Retry from CreateGroups (groups exist)
POST /Subdomain/{subdomainName}/retry
→ Should skip group creation and continue

# Test 5: Retry from CreateUsers (users exist)
POST /Subdomain/{subdomainName}/retry
→ Should skip user creation and continue

# Test 6: Complete end-to-end retry
# Kill process during step execution
# Resume saga
→ Should complete from last successful step
```

---

## KEYCLOAK API METHODS NEEDED

Check if these exist in `IKeycloakProvider`:

```csharp
// Realm
Task<RealmRepresentation?> GetRealmAsync(string realmName, CancellationToken ct);

// Clients
Task<ClientRepresentation?> GetClientByClientIdAsync(string realmName, string clientId, CancellationToken ct);

// Groups
Task<GroupRepresentation?> GetGroupByNameAsync(string realmName, string groupName, CancellationToken ct);

// Users
Task<UserRepresentation?> GetUserByEmailAsync(string realmName, string email, CancellationToken ct);

// Client Scopes
Task<ClientScopeRepresentation?> GetClientScopeByNameAsync(string realmName, string scopeName, CancellationToken ct);

// Authentication Flows
Task<string?> GetFlowIdByAliasAsync(string realmName, string flowAlias, CancellationToken ct);
```

If any are missing, implement them first.

---

## ESTIMATED EFFORT

- **Phase 1 (Critical Fixes):** 2-3 days
  - Add missing Keycloak provider methods: 1 day
  - Implement idempotency checks in 5 steps: 1-2 days
  - Testing and verification: 1 day

- **Phase 2 (Complete Idempotency):** 2 days
  - Remaining 3 steps: 1 day
  - Testing: 1 day

- **Phase 3 (Advanced Features):** 3-5 days
  - Retry policies: 1-2 days
  - Circuit breaker: 1 day
  - Compensation logic: 1-2 days

**Total:** 1-2 weeks for full implementation

---

## RISK MITIGATION

Until fixes are implemented:

1. **Monitor saga failures** - Check logs for step failures
2. **Manual intervention** - Have operations team ready to clean up failed resources
3. **Document rollback procedures** - How to delete partially created realms/clients
4. **Alert on failures** - Set up monitoring for saga step failures
5. **Backup before retry** - Take database snapshot before retrying failed sagas

---

## SUCCESS CRITERIA

✅ All 8 critical steps have existence checks
✅ Zero failures on retry after network interruption
✅ Zero duplicate resources created on retry
✅ All unit tests pass with retry scenarios
✅ Integration tests verify end-to-end retry safety
✅ Documentation updated with retry procedures
