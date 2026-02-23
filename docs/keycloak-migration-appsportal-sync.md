# Keycloak Migration: AppsPortal Data Synchronization Plan

## Overview

After Keycloak migration completes in BusinessOwners and updates `User.IdentityId` with new Keycloak IDs, this system synchronizes AppsPortal databases to match.

### What Gets Updated
- ✅ **User.IdentityId** - Updated to new Keycloak ID
- ✅ **Audit Fields** - All CreatedBy/UpdatedBy fields across 100+ tables
- ❌ **Company/Branch IDs** - Remain unchanged (use database GUIDs, not Keycloak IDs)

### Architecture
1. **Pre-Migration**: Capture old User.IdentityId values before migration
2. **Post-Migration**: Publish integration events with old → new ID mapping
3. **AppsPortal**: Consume events and bulk update all tables automatically

---

## Phase 0: Pre-Migration - Capture Old User IDs

### Purpose
Save current `User.IdentityId` values **before** Keycloak migration overwrites them, so we have old → new mapping for AppsPortal updates.

### Implementation

#### 1. UserIdentityMapping Entity
**File**: `Src/BusinessOwners/BusinessOwners.Domain/Entities/UserIdentityMapping.cs`

```csharp
public class UserIdentityMapping
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }              // User.Id (database GUID, never changes)
    public string Email { get; set; }             // User.Email (correlation key)
    public string? OldIdentityId { get; set; }    // Current IdentityId BEFORE migration (may be null)
    public string? NewIdentityId { get; set; }    // Populated AFTER migration by PublishStep
    public Guid SubdomainId { get; set; }
    public DateTime CapturedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public bool IsProcessed { get; set; }

    // Navigation
    public User User { get; set; }
}
```

#### 2. CaptureUserIdentitiesStep (Migration Step 17)
**File**: `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Migration/Steps/CaptureUserIdentitiesStep.cs`

**Purpose**: Runs BEFORE CreateKeycloakUser step to capture current state

**Logic**:
```csharp
1. Query all users for subdomain (UserCompanies/UserBranches)
2. For each user:
   - Create UserIdentityMapping record
   - Set UserId = user.Id
   - Set Email = user.Email
   - Set OldIdentityId = user.IdentityId (current value, may be null)
   - Set SubdomainId = context.SubdomainId
   - Set CapturedAt = DateTime.UtcNow
3. Save to database
4. Log count of captured users
```

---

## Phase 1: Integration Event Infrastructure

### 1. Add Queue Constant
**File**: `Src/Shared/Shared.Core/Constants/RabbitMqQueues.cs`

```csharp
public const string UserIdentityUpdatedQueue = "user-identity-updated";
```

### 2. Create Integration Event
**File**: `Src/Shared/Shared.Core/Events/IntegrationEvents/BusinessOwnersEvents/BoUserIdentityUpdatedIntegrationEvent.cs`

```csharp
public class BoUserIdentityUpdatedIntegrationEvent : IntegrationEvent
{
    public override string SourceService => SystemServices.BusinessOwners;
    public override string TargetService => SystemServices.AppsPortal;

    // Correlation keys
    public Guid UserId { get; set; }           // BusinessOwners User.Id (database GUID)
    public string Email { get; set; }          // User.Email

    // Identity mapping
    public string? OldIdentityId { get; set; } // Old Keycloak ID (from capture step)
    public string NewIdentityId { get; set; }  // New Keycloak ID (from migration)

    // Context
    public Guid CompanyId { get; set; }
    public List<Guid> BranchIds { get; set; }
    public DateTime MigratedAt { get; set; }
}
```

---

## Phase 2: Publish Events from BusinessOwners

### PublishAppsPortalSyncEventStep (Migration Step 21)
**File**: `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Migration/Steps/PublishAppsPortalSyncEventStep.cs`

**Purpose**: Runs AFTER SyncUserToBusinessOwnerRealm to publish events with old → new ID mapping

**Dependencies**:
- `IAdminUnitOfWork` - Database access
- `IPublishEndpoint` - MassTransit event publisher
- `ILogger<PublishAppsPortalSyncEventStep>` - Logging

**Logic**:
```csharp
1. Query UserIdentityMapping for subdomain where IsProcessed = false
2. Include User navigation property (to get updated IdentityId)
3. For each mapping:
   - Create BoUserIdentityUpdatedIntegrationEvent
   - Set UserId, Email from mapping
   - Set OldIdentityId from mapping.OldIdentityId
   - Set NewIdentityId from mapping.User.IdentityId (updated by migration)
   - Set CompanyId, BranchIds from User.UserCompanies/UserBranches
   - Set MigratedAt = DateTime.UtcNow
   - Set SubdomainId, SubDomainName from context
4. Publish events in batches of 100
5. Update mapping: NewIdentityId = user.IdentityId, PublishedAt = now, IsProcessed = true
6. Save changes
7. Log total events published
```

**Batch Processing**:
- Process 100 users at a time
- Publish events in batches to avoid overwhelming RabbitMQ
- Commit after each batch for progress tracking

---

## Phase 3: Consume Events in AppsPortal

### 1. BulkAuditFieldUpdater Service
**File**: `Src/AppsPortal/Accounting/AppsPortal.Application/Core/Services/IBulkAuditFieldUpdater.cs`

```csharp
public interface IBulkAuditFieldUpdater
{
    Task<BulkUpdateResult> UpdateAuditFieldsAsync(
        string? oldIdentityId,
        string newIdentityId,
        CancellationToken cancellationToken = default);
}

public class BulkUpdateResult
{
    public int TablesScanned { get; set; }
    public int RowsUpdated { get; set; }
    public Dictionary<string, int> UpdatesByTable { get; set; }
    public TimeSpan Duration { get; set; }
}
```

**File**: `Src/AppsPortal/Accounting/AppsPortal.Application/Core/Services/BulkAuditFieldUpdater.cs`

**Implementation**:
```csharp
public class BulkAuditFieldUpdater : IBulkAuditFieldUpdater
{
    private readonly IMicrotecAppsDbContext _context;
    private readonly ILogger<BulkAuditFieldUpdater> _logger;

    public async Task<BulkUpdateResult> UpdateAuditFieldsAsync(
        string? oldIdentityId,
        string newIdentityId,
        CancellationToken ct)
    {
        var stopwatch = Stopwatch.StartNew();
        var result = new BulkUpdateResult
        {
            UpdatesByTable = new Dictionary<string, int>()
        };

        // 1. Get all entity types with audit fields using EF Core metadata
        var auditedEntityTypes = _context.Model.GetEntityTypes()
            .Where(et =>
                et.ClrType.IsAssignableTo(typeof(FullAuditedEntityBase<>)) ||
                et.GetProperties().Any(p => p.Name == "CreatedBy" || p.Name == "UpdatedBy"))
            .ToList();

        result.TablesScanned = auditedEntityTypes.Count;

        // 2. For each table, generate and execute update SQL
        foreach (var entityType in auditedEntityTypes)
        {
            var tableName = entityType.GetTableName();
            var schema = entityType.GetSchema() ?? "dbo";
            var fullTableName = $"[{schema}].[{tableName}]";

            // Skip if oldIdentityId is null (user had no previous Keycloak ID)
            if (string.IsNullOrEmpty(oldIdentityId))
                continue;

            // Generate SQL to update both CreatedBy and UpdatedBy
            var sql = $@"
                UPDATE {fullTableName}
                SET CreatedBy = @newId
                WHERE CreatedBy = @oldId;

                UPDATE {fullTableName}
                SET UpdatedBy = @newId
                WHERE UpdatedBy = @oldId;

                SELECT @@ROWCOUNT;
            ";

            try
            {
                var rowsUpdated = await _context.Database.ExecuteSqlRawAsync(
                    sql,
                    new SqlParameter("@oldId", oldIdentityId),
                    new SqlParameter("@newId", newIdentityId),
                    ct);

                if (rowsUpdated > 0)
                {
                    result.UpdatesByTable[tableName] = rowsUpdated;
                    result.RowsUpdated += rowsUpdated;
                    _logger.LogDebug(
                        "Updated {RowCount} rows in {Table}",
                        rowsUpdated,
                        fullTableName);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to update audit fields in {Table}",
                    fullTableName);
                // Continue with other tables
            }
        }

        stopwatch.Stop();
        result.Duration = stopwatch.Elapsed;

        _logger.LogInformation(
            "Bulk audit field update completed: {TablesScanned} tables scanned, {RowsUpdated} rows updated in {Duration}ms",
            result.TablesScanned,
            result.RowsUpdated,
            result.Duration.TotalMilliseconds);

        return result;
    }
}
```

**Key Features**:
- ✅ **Automatic Discovery**: Uses EF Core metadata to find all audited entities
- ✅ **No Manual SQL**: No need to list tables manually
- ✅ **Future-Proof**: Automatically handles new tables added later
- ✅ **Detailed Logging**: Tracks which tables updated and row counts
- ✅ **Error Handling**: Continues on table-level errors

### 2. UserIdentityUpdatedConsumer
**File**: `Src/AppsPortal/Accounting/AppsPortal.Application/Core/Users/Consumers/UserIdentityUpdatedConsumer.cs`

```csharp
[QueueName(RabbitMqQueues.UserIdentityUpdatedQueue)]
public class UserIdentityUpdatedConsumer : IBaseConsumer<BoUserIdentityUpdatedIntegrationEvent>
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ITenantProvider _tenantProvider;
    private readonly IBulkAuditFieldUpdater _bulkAuditFieldUpdater;
    private readonly ILogger<UserIdentityUpdatedConsumer> _logger;

    public async Task Consume(ConsumeContext<BoUserIdentityUpdatedIntegrationEvent> context)
    {
        var evt = context.Message;

        _logger.LogInformation(
            "Processing user identity update for {Email}: {OldId} → {NewId}",
            evt.Email,
            evt.OldIdentityId ?? "null",
            evt.NewIdentityId);

        using var scope = _serviceProvider.CreateScope();
        var appsContext = scope.ServiceProvider.GetRequiredService<IMicrotecAppsDbContext>();

        // 1. Set tenant connection string
        appsContext.HasConnectionString = true;
        var connectionString = await _tenantProvider.GetSubDomainConnectionString(
            evt.SubDomainName,
            context.CancellationToken);
        appsContext.Context.Database.SetConnectionString(connectionString);

        var unitOfWork = scope.ServiceProvider.GetRequiredService<IAppsUnitOfWork>();
        var userRepository = unitOfWork.GetRepository<User>();

        // 2. Get user by email
        var user = await userRepository.GetQueryable()
            .FirstOrDefaultAsync(u => u.Email == evt.Email, context.CancellationToken);

        if (user == null)
        {
            _logger.LogWarning(
                "User {Email} not found in AppsPortal for subdomain {Subdomain}",
                evt.Email,
                evt.SubDomainName);
            return;
        }

        // 3. Check if already updated (idempotency)
        if (user.IdentityId == evt.NewIdentityId)
        {
            _logger.LogInformation(
                "User {Email} already has IdentityId {NewId}, skipping User table update",
                evt.Email,
                evt.NewIdentityId);
        }
        else
        {
            // Update User.IdentityId
            user.IdentityId = evt.NewIdentityId;
            _logger.LogInformation(
                "Updated User.IdentityId for {Email}: {OldId} → {NewId}",
                evt.Email,
                evt.OldIdentityId ?? "null",
                evt.NewIdentityId);
        }

        // 4. Bulk update all audit fields across all tables
        var updateResult = await _bulkAuditFieldUpdater.UpdateAuditFieldsAsync(
            oldIdentityId: evt.OldIdentityId,
            newIdentityId: evt.NewIdentityId,
            context.CancellationToken);

        // 5. Save User table changes
        await unitOfWork.SaveChangesAsync(context.CancellationToken);

        _logger.LogInformation(
            "Successfully processed user identity update for {Email}: " +
            "{TablesScanned} tables scanned, {RowsUpdated} audit fields updated in {Duration}ms",
            evt.Email,
            updateResult.TablesScanned,
            updateResult.RowsUpdated,
            updateResult.Duration.TotalMilliseconds);
    }
}
```

**Features**:
- ✅ **Idempotency**: Checks if User.IdentityId already updated
- ✅ **Tenant Isolation**: Sets connection string per subdomain
- ✅ **Comprehensive Logging**: Tracks all updates with details
- ✅ **Error Recovery**: MassTransit handles retries/dead-letter queue

---

## Phase 4: Registration and Configuration

### 1. Register Migration Steps
**File**: `Src/BusinessOwners/BusinessOwners.Application/AdminPortal/Migration/MigrationDependencyInjection.cs`

```csharp
// Add after ConfigureSecurityHeadersStep
services.AddScoped<MigrationStepBase, CaptureUserIdentitiesStep>();
services.AddScoped<MigrationStepBase, CreateGroupsStep>();
services.AddScoped<MigrationStepBase, CreateUsersStep>();
services.AddScoped<MigrationStepBase, SyncBusinessOwnersStep>();
services.AddScoped<MigrationStepBase, PublishAppsPortalSyncEventStep>();
```

### 2. Add MigrationStep Enum Values
**File**: `Src/BusinessOwners/BusinessOwners.Domain/Entities/State/MigrationStep.cs`

```csharp
ConfigureSecurityHeaders = 16,
CaptureUserIdentities = 17,         // NEW - Capture old IDs before migration
CreateGroupsAndAdmin = 18,
CreateKeycloakUser = 19,
SyncUserToBusinessOwnerRealm = 20,
PublishAppsPortalSync = 21,         // NEW - Publish events to AppsPortal
Completed = 22
```

### 3. Register BulkAuditFieldUpdater in AppsPortal
**File**: `Src/AppsPortal/Accounting/AppsPortal.Application/DependencyInjection.cs` (or wherever services are registered)

```csharp
services.AddScoped<IBulkAuditFieldUpdater, BulkAuditFieldUpdater>();
```

### 4. Register Consumer in AppsPortal
**File**: `Src/AppsPortal/Accounting/AppsPortal.Apis/Program.cs`

MassTransit configuration should automatically discover consumers with `[QueueName]` attribute. Verify:

```csharp
builder.Services.AddMassTransit(x =>
{
    x.AddConsumers(typeof(UserIdentityUpdatedConsumer).Assembly);
    // ... rest of configuration
});
```

---

## Phase 5: Database Migration

### BusinessOwners Database
Create migration for `UserIdentityMapping` table:

```bash
cd Src/BusinessOwners/BusinessOwners.Infrastructure
dotnet ef migrations add AddUserIdentityMappingTable
```

---

## Testing Strategy

### 1. Unit Tests

**BulkAuditFieldUpdater Tests**:
```csharp
- Test entity type discovery (verify all expected tables found)
- Test SQL generation
- Mock DbContext and verify SQL execution
```

**PublishAppsPortalSyncEventStep Tests**:
```csharp
- Test event creation from UserIdentityMapping
- Test batch processing logic
- Verify mapping marked as processed
```

**UserIdentityUpdatedConsumer Tests**:
```csharp
- Test idempotency (skip if already updated)
- Test User.IdentityId update
- Test bulk updater integration
```

### 2. Integration Tests

**End-to-End Flow**:
```csharp
1. Create test tenant with sample data
2. Run CaptureUserIdentitiesStep
3. Simulate migration (update User.IdentityId)
4. Run PublishAppsPortalSyncEventStep
5. Verify events published to RabbitMQ
6. Verify consumer processes events
7. Verify AppsPortal database updated
```

### 3. Staging Testing

**Pre-Production Validation**:
1. Select small test tenant (< 100 users)
2. Run full migration in staging
3. Verify AppsPortal data:
   - User.IdentityId updated
   - Audit fields updated across all tables
   - No broken foreign keys
   - Counts match expected
4. Test user login with new Keycloak ID
5. Test queries relying on audit fields

### 4. Performance Testing

**Load Test**:
- Large tenant: 10,000 users, 1M+ rows
- Measure processing time per user
- Monitor RabbitMQ queue depth
- Check database CPU/IO during bulk updates
- Optimize batch sizes if needed

---

## Monitoring and Observability

### Metrics to Track

**Per Subdomain**:
- Total users to migrate
- Users captured (Step 17)
- Events published (Step 21)
- Events processed in AppsPortal
- Failed events (dead letter queue)
- Average processing time per event
- Total rows updated in AppsPortal

### Logging

**BusinessOwners - CaptureUserIdentitiesStep**:
```
INFO: Capturing user identities for subdomain {SubdomainName}
INFO: Found {UserCount} users to capture
INFO: Captured {CapturedCount} user identities
```

**BusinessOwners - PublishAppsPortalSyncEventStep**:
```
INFO: Publishing AppsPortal sync events for subdomain {SubdomainName}
INFO: Found {MappingCount} user identity mappings
INFO: Publishing batch {BatchNumber}/{TotalBatches}
INFO: Published {EventCount} events successfully
```

**AppsPortal - UserIdentityUpdatedConsumer**:
```
INFO: Processing user identity update for {Email}: {OldId} → {NewId}
INFO: Updated User.IdentityId for {Email}
INFO: Bulk update: {TablesScanned} tables scanned, {RowsUpdated} rows updated in {Duration}ms
```

### Alerts

**Set up alerts for**:
- Consumer exceptions (retry exhausted → dead letter queue)
- Processing time > threshold (e.g., > 5 seconds per user)
- AppsPortal database connection failures
- Mismatch between events published vs processed

---

## Rollback Strategy

### If Migration Fails Mid-Process

**Consumer Idempotency Handles Retry**:
- User.IdentityId update is idempotent (checks current value)
- Audit field updates are idempotent (WHERE old value)
- Safe to reprocess events

**Manual Rollback** (if needed):
```sql
-- Rollback User.IdentityId in AppsPortal (if needed)
UPDATE Users
SET IdentityId = @oldIdentityId
WHERE Email = @email;

-- Rollback audit fields (reverse update)
UPDATE TableName
SET CreatedBy = @oldIdentityId
WHERE CreatedBy = @newIdentityId;
```

**Note**: Rollback should rarely be needed due to idempotent design.

---

## Production Deployment Checklist

### Pre-Deployment
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Staging environment tested successfully
- [ ] Performance benchmarks acceptable
- [ ] Monitoring/alerting configured

### Deployment
- [ ] Deploy Shared.Core changes (event, queue constant)
- [ ] Deploy BusinessOwners.Application (migration steps)
- [ ] Deploy BusinessOwners.Infrastructure (database migration)
- [ ] Deploy AppsPortal.Application (consumer, updater)
- [ ] Deploy AppsPortal.Apis (consumer registration)
- [ ] Verify RabbitMQ queue created

### Post-Deployment
- [ ] Run test migration on small tenant
- [ ] Monitor logs for errors
- [ ] Check RabbitMQ metrics (queue depth, throughput)
- [ ] Verify AppsPortal data updated correctly
- [ ] Test user login with new Keycloak ID

### Production Migration
- [ ] Start with smallest tenants first
- [ ] Monitor closely during first few migrations
- [ ] Gradually increase batch size
- [ ] Keep manual rollback scripts ready (just in case)

---

## Summary

This plan provides a complete, production-ready solution for synchronizing AppsPortal user IDs after Keycloak migration:

✅ **Pre-migration capture** ensures we never lose old ID information
✅ **Automated table discovery** eliminates manual SQL maintenance
✅ **Generic bulk updater** handles current and future tables
✅ **Event-driven architecture** provides loose coupling and scalability
✅ **Idempotent design** allows safe retries without data corruption
✅ **Comprehensive monitoring** enables tracking and troubleshooting

**Estimated Implementation Time**: 16 hours (2-3 days)
