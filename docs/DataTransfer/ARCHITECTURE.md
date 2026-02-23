# Data Transfer System - Architecture Documentation

**Version:** 2.1
**Last Updated:** 2026-01-07
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Database Schema](#database-schema)
5. [Key Algorithms](#key-algorithms)
6. [Configuration](#configuration)
7. [Recent Changes](#recent-changes)

---

## Overview

The Data Transfer System is a multi-tenant data migration tool that copies tenant data (ERP records) from source subdomains to target subdomains. It handles complex foreign key relationships, ID remapping, and provides comprehensive audit trails.

### Key Capabilities

- ✅ Multi-table data transfer with automatic dependency resolution
- ✅ Foreign key discovery and remapping (GUID and INT types)
- ✅ UPSERT for GeneralSettings tables (match on SubdomainId)
- ✅ Background job processing via Hangfire
- ✅ 4-level audit trail (Operation → Subdomain → Table → Error/FK)
- ✅ Real-time progress tracking via UI polling
- ✅ Advanced UI with pagination, filtering, and error details
- ✅ Optimized audit persistence (no DbContext threading issues)

### Architecture Principles

- **Database-per-Tenant**: Each tenant has isolated database
- **Dependency-Aware**: Automatic topological sort ensures correct transfer order
- **Audit-First**: Comprehensive tracking at every level
- **Sequential Processing**: Tables processed one at a time to avoid concurrency issues
- **Transactionless**: No distributed transactions; individual table operations

---

## System Components

### 1. Backend Services

#### DataTransferService
**Location**: `BusinessOwners.Application/AdminPortal/DataTransfer/DataTransferService.cs`

**Primary Responsibility**: Orchestrates the entire data transfer process

**Key Methods**:

1. **`TransferDataAsync()`** - Entry point
   - Validates request
   - Resolves source/target subdomains
   - Creates operation audit record
   - Calls unified dependency resolution

2. **`ProcessEntitiesWithUnifiedDependencyResolutionAsync()`** - Core orchestrator
   - Discovers tables via SQL metadata queries
   - Performs topological sort for dependency order
   - Processes tables sequentially
   - Updates audit trail after each table

3. **`TransferTableAsync()`** - Single table transfer
   - Fetches source data with Dapper
   - Remaps foreign keys using IdMappingService
   - Inserts records with new PKs
   - Updates table audit record

4. **`UpsertGeneralSettingsRecordAsync()`** - Special handling for GeneralSettings
   - Uses SQL MERGE statement
   - Matches on SubdomainId
   - Excludes TaxId (reference data)

**Dependencies**:
- `IDependencyResolver` - Discovers table dependencies
- `IIdMappingService` - Maintains in-memory PK mappings
- `IDataTransferAuditStore` - Persists audit records sequentially
- `ISubdomainService` - Resolves subdomain connection strings
- `IClearSubdomainDataService` - Clears target data before transfer

---

#### IdMappingService
**Location**: `BusinessOwners.Application/AdminPortal/DataTransfer/IdMapping/IdMappingService.cs`

**Primary Responsibility**: Maintains in-memory mapping of old PKs → new PKs

**Data Structure**:
```csharp
private readonly ConcurrentDictionary<string, ConcurrentDictionary<object, object>> _mappings;
// Key: TableName → Dictionary<OldPK, NewPK>
```

**Key Methods**:
- `AddMapping(table, oldId, newId)` - Store mapping in-memory
- `GetMappedId(table, oldId)` - Retrieve new ID from in-memory cache
- `AddMappings(table, mappings)` - Batch store mappings in-memory

**ID Generation Logic**:
- **GUID columns**: Generate `Guid.NewGuid()`
- **INT columns**: Use `SCOPE_IDENTITY()` after INSERT

**Important Note**: FK mappings are stored in-memory only during transfer. They are NOT persisted to audit on-the-fly to avoid DbContext threading issues. The in-memory mappings are sufficient for the transfer process and are cleared after operation completes.

---

#### DataTransferAuditStore
**Location**: `BusinessOwners.Application/AdminPortal/DataTransfer/Audit/DataTransferAuditStore.cs`

**Primary Responsibility**: Manages 4-level audit hierarchy

**Audit Levels**:

1. **BulkOperationAudit** - Job-level (entire operation)
   - JobId, OperationType, State, StartedAt, CompletedAt
   - Total/Successful/Failed subdomain counts

2. **SubdomainOperationAudit** - Per-subdomain tracking
   - Links to BulkOperationAudit
   - SubdomainName, Status, ProcessedAt
   - Total/Successful/Failed table counts
   - **CheckpointData** (JSON)
   - **LastCompletedTableName**
   - **ResumedFromCheckpoint** (bool)

3. **DataTransferTableAudit** - Per-table execution
   - Links to SubdomainOperationAudit
   - TableName, RowsTransferred, Success, ErrorMessage
   - StartedAt, CompletedAt, Duration

4. **DataTransferErrorDetail** (linked to table audit)
   - ErrorType, ErrorMessage, ErrorDetails (stack trace)
   - ForeignKeyColumn, ReferencedTable, MissingForeignKeyValue

5. **DataTransferForeignKeyMapping** (linked to table audit)
   - TableName, SourceId, TargetId, IsGuid, MappedAt

---

#### DataTransferBackgroundJob
**Location**: `BusinessOwners.Application/AdminPortal/DataTransfer/BackgroundJobs/DataTransferBackgroundJob.cs`

**Configuration**:
```csharp
[AutomaticRetry(Attempts = 0)] // NO automatic retries
public class DataTransferBackgroundJob(IDataTransferService dataTransferService) : ITransientService
{
    public async Task ExecuteAsync(DataTransferRequest request, CancellationToken cancellationToken)
    {
        await dataTransferService.TransferDataAsync(request, cancellationToken);
    }
}
```

**Hangfire Integration**:
- Enqueued via `IBackgroundJobClient.Enqueue()`
- Job ID stored in BulkOperationAudit.JobId
- Executed in background worker pool

---

### 2. Frontend Components

#### AuditLogHistory.razor
**Location**: `BusinessOwners.Admin.Client/Features/Subdomains/Pages/AuditLogHistory.razor`

**Features**:
- **Server-side pagination** via MudDataGrid
- **Filter panel**: Operation type, status, date range, search
- **Stats cards**: Total, successful, failed, in-progress counts
- **Auto-refresh**: Polls every 5 seconds
- **Export**: CSV export functionality

**Implementation**:
```html
<MudDataGrid T="BulkOperationHistoryDto"
    ServerData="@LoadServerData"
    Sortable="true"
    Filterable="true">
    <!-- Columns with chips for status visualization -->
</MudDataGrid>
```

---

#### AuditLogDetails.razor
**Location**: `BusinessOwners.Admin.Client/Features/BulkOperations/Pages/AuditLogDetails.razor`

**Features**:
- **Progress tracking**: Real-time progress bars and percentages
- **Resume button**: Appears for failed operations with checkpoints
- **Error details modal**: Full error with FK context and stack trace
- **FK mappings viewer**: Searchable grid with export
- **Auto-refresh**: 5-second polling

**Resume Flow**:
```html
@if (_status.State == JobState.Failed && _status.CanResume)
{
    <MudButton OnClick="ResumeTransfer" Color="Color.Warning">
        Resume Transfer
    </MudButton>
}
```

---

### 3. API Layer

#### SubdomainController
**Location**: `BsuinessOwners.AdminPortal/Controllers/SubdomainController.cs`

**Endpoints**:

1. **POST `/Subdomain/audit-log`** - Start bulk operation
   ```csharp
   [HttpPost("audit-log")]
   public async Task<IActionResult> StartBulkOperation([FromBody] BulkOperationRequestDto request)
   ```
   - Validates request
   - Enqueues Hangfire job
   - Returns job ID

2. **GET `/Subdomain/audit-log/{jobId}`** - Get operation status
   ```csharp
   [HttpGet("audit-log/{jobId}")]
   public async Task<IActionResult> GetOperationStatus(string jobId)
   ```
   - Returns BulkOperationStatusDto with full hierarchy

3. **GET `/Subdomain/audit-log/history`** - Get paginated history
   ```csharp
   [HttpGet("audit-log/history")]
   public async Task<IActionResult> GetOperationHistory([FromQuery] BulkOperationFilter filter)
   ```
   - Supports pagination, filtering, sorting

4. **GET `/tables/{tableAuditId}/errors`** - Get error details
5. **GET `/tables/{tableAuditId}/fk-mappings`** - Get FK mappings
6. **GET `/tables/{tableAuditId}/fk-mappings/export`** - Export FK mappings as CSV
7. **POST `/Subdomain/audit-log/{jobId}/resume`** - Resume failed operation

---

### 4. Data Transfer DTOs

#### DataTransferRequest
**Location**: `BusinessOwners.Application/AdminPortal/DataTransfer/Dtos/DataTransferRequest.cs`

```csharp
public class DataTransferRequest
{
    public Guid SubdomainId { get; set; }
    public List<TransferEntityType> EntityTypes { get; set; } = new();
    public bool ValidateBeforeTransfer { get; set; } = true;
    public bool ContinueOnError { get; set; } = false;
    public string? TriggeredByUserId { get; set; }
    public string? TriggeredByUserEmail { get; set; }

    // Checkpoint & Resume
    public bool EnableCheckpoints { get; set; } = true;
    public string? ResumeFromJobId { get; set; }
}
```

---

## Data Flow

### End-to-End Transfer Flow

```
1. User Action (UI)
   └─> Click "Transfer Data" button
   └─> POST /Subdomain/audit-log
       Body: { subdomainId, entityTypes, enableCheckpoints }

2. Controller Layer
   └─> SubdomainController.StartBulkOperation()
   └─> Create BulkOperationAudit record (State = Enqueued)
   └─> Enqueue Hangfire job
   └─> Return 200 OK with jobId

3. Hangfire Worker
   └─> Picks up job from queue
   └─> DataTransferBackgroundJob.ExecuteAsync()
   └─> Update BulkOperationAudit (State = Processing)

4. DataTransferService.TransferDataAsync()
   └─> Resolve source/target subdomains
   └─> Get tenant connection strings
   └─> Check for checkpoint (if ResumeFromJobId provided)
   └─> Restore IdMappingService state from checkpoint
   └─> Determine entity types and tables to transfer
   └─> Call ProcessEntitiesWithUnifiedDependencyResolutionAsync()

5. Dependency Resolution & Transfer
   └─> Query INFORMATION_SCHEMA for table metadata
   └─> Discover FK relationships via INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
   └─> Perform topological sort (Kahn's algorithm)
   └─> Filter out already-completed tables (if resuming)
   └─> For each table (in dependency order):
       ├─> Create DataTransferTableAudit (State = Processing)
       ├─> Fetch source data (Dapper query)
       ├─> For each row:
       │   ├─> Remap foreign keys via IdMappingService
       │   ├─> Generate new PK (GUID or use SCOPE_IDENTITY)
       │   ├─> INSERT into target database
       │   └─> Store PK mapping (OldPK → NewPK)
       ├─> Save FK mappings to audit
       ├─> Update DataTransferTableAudit (Success/Failed)
       └─> **Save checkpoint** (completed tables + ID mappings)

6. Error Handling
   └─> On table failure:
       ├─> Capture exception
       ├─> Create DataTransferErrorDetail with full stack trace
       ├─> Update DataTransferTableAudit (Success = false)
       └─> If ContinueOnError = true:
           └─> Continue to next table
       └─> Else:
           └─> Stop transfer, update BulkOperationAudit (State = Failed)
           └─> User can resume from checkpoint later

7. Completion
   └─> Update BulkOperationAudit:
       ├─> State = Completed (or Failed)
       ├─> CompletedAt = DateTime.UtcNow
       ├─> SuccessfulSubdomains count
       └─> FailedSubdomains count

8. UI Polling
   └─> AuditLogDetails.razor polls every 5 seconds
   └─> GET /Subdomain/audit-log/{jobId}
   └─> Updates progress bars, status chips, table results
   └─> Shows "Resume" button if failed + checkpoint available
```

---

### Resume Flow

```
1. User clicks "Resume" button for failed operation
   └─> POST /Subdomain/audit-log/{jobId}/resume

2. Controller creates new DataTransferRequest
   └─> ResumeFromJobId = original job ID
   └─> Same entityTypes and subdomain as original
   └─> Enqueue new Hangfire job

3. DataTransferService detects resume
   └─> LoadCheckpointAsync(subdomainOperationAuditId)
   └─> Deserialize checkpoint JSON
   └─> Restore IdMappingService state
   └─> Filter out completed tables from transfer list

4. Continue transfer from next table
   └─> Dependency order preserved
   └─> FK mappings still available from restored state
   └─> New checkpoints saved as transfer progresses
```

---

## Database Schema

### Audit Tables

#### [Audit].[BulkOperationAudit]
```sql
CREATE TABLE [Audit].[BulkOperationAudit] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [JobId] NVARCHAR(255) NOT NULL,
    [OperationType] INT NOT NULL,
    [OperationName] NVARCHAR(500) NOT NULL,
    [State] INT NOT NULL,
    [TotalSubdomains] INT NOT NULL DEFAULT 0,
    [ProcessedSubdomains] INT NOT NULL DEFAULT 0,
    [SuccessfulSubdomains] INT NOT NULL DEFAULT 0,
    [FailedSubdomains] INT NOT NULL DEFAULT 0,
    [StartedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CompletedAt] DATETIME2 NULL,
    [ErrorMessage] NVARCHAR(MAX) NULL,
    [TriggeredByUserId] NVARCHAR(255) NOT NULL,
    [TriggeredByUserEmail] NVARCHAR(500) NOT NULL
);
```

#### [Audit].[SubdomainOperationAudit]
```sql
CREATE TABLE [Audit].[SubdomainOperationAudit] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [BulkOperationAuditId] UNIQUEIDENTIFIER NOT NULL,
    [SubdomainName] NVARCHAR(255) NOT NULL,
    [Status] INT NOT NULL,
    [TotalTables] INT NOT NULL DEFAULT 0,
    [SuccessfulTables] INT NOT NULL DEFAULT 0,
    [FailedTables] INT NOT NULL DEFAULT 0,
    [TotalRowsTransferred] BIGINT NOT NULL DEFAULT 0,
    [ProcessedAt] DATETIME2 NULL,
    [ErrorMessage] NVARCHAR(MAX) NULL,

    -- Checkpoint Support
    [CheckpointData] NVARCHAR(MAX) NULL,
    [LastCompletedTableName] NVARCHAR(255) NULL,
    [ResumedFromCheckpoint] BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_SubdomainAudit_BulkAudit
        FOREIGN KEY ([BulkOperationAuditId])
        REFERENCES [Audit].[BulkOperationAudit]([Id]) ON DELETE CASCADE
);
```

#### [Audit].[DataTransferTableAudit]
```sql
CREATE TABLE [Audit].[DataTransferTableAudit] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [SubdomainOperationAuditId] UNIQUEIDENTIFIER NOT NULL,
    [TableName] NVARCHAR(255) NOT NULL,
    [SchemaName] NVARCHAR(128) NOT NULL DEFAULT 'dbo',
    [ExecutionOrder] INT NOT NULL,
    [StartedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CompletedAt] DATETIME2 NULL,
    [Duration] TIME NULL,
    [Success] BIT NOT NULL,
    [RowsTransferred] INT NOT NULL DEFAULT 0,
    [ErrorMessage] NVARCHAR(MAX) NULL,

    CONSTRAINT FK_TableAudit_SubdomainAudit
        FOREIGN KEY ([SubdomainOperationAuditId])
        REFERENCES [Audit].[SubdomainOperationAudit]([Id]) ON DELETE CASCADE
);
```

#### [Audit].[DataTransferErrorDetail]
```sql
CREATE TABLE [Audit].[DataTransferErrorDetail] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [DataTransferTableAuditId] UNIQUEIDENTIFIER NOT NULL,
    [ErrorType] INT NOT NULL,
    [ErrorMessage] NVARCHAR(MAX) NOT NULL,
    [ErrorDetails] NVARCHAR(MAX) NULL,  -- Full stack trace
    [ForeignKeyColumn] NVARCHAR(255) NULL,
    [ReferencedTable] NVARCHAR(255) NULL,
    [MissingForeignKeyValue] NVARCHAR(255) NULL,
    [OccurredAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT FK_ErrorDetail_TableAudit
        FOREIGN KEY ([DataTransferTableAuditId])
        REFERENCES [Audit].[DataTransferTableAudit]([Id]) ON DELETE CASCADE
);
```

#### [Audit].[DataTransferForeignKeyMapping]
```sql
CREATE TABLE [Audit].[DataTransferForeignKeyMapping] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [DataTransferTableAuditId] UNIQUEIDENTIFIER NOT NULL,
    [TableName] NVARCHAR(255) NOT NULL,
    [SourceId] NVARCHAR(255) NOT NULL,    -- Old PK value
    [TargetId] NVARCHAR(255) NOT NULL,    -- New PK value
    [IsGuid] BIT NOT NULL,
    [MappedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT FK_FKMapping_TableAudit
        FOREIGN KEY ([DataTransferTableAuditId])
        REFERENCES [Audit].[DataTransferTableAudit]([Id]) ON DELETE CASCADE
);
```

---

## Key Algorithms

### 1. Topological Sort (Kahn's Algorithm)

**Purpose**: Order tables by dependency so parent tables are transferred before child tables

**Implementation**:
```csharp
// Build dependency graph
var inDegree = new Dictionary<string, int>();
var graph = new Dictionary<string, List<string>>();

foreach (var fk in foreignKeys)
{
    if (!graph.ContainsKey(fk.ParentTable))
        graph[fk.ParentTable] = new List<string>();

    graph[fk.ParentTable].Add(fk.ReferencedTable);
    inDegree[fk.ReferencedTable] = (inDegree.TryGetValue(fk.ReferencedTable, out var count) ? count : 0) + 1;
}

// Process tables with 0 dependencies first
var queue = new Queue<string>(inDegree.Where(x => x.Value == 0).Select(x => x.Key));
var sortedTables = new List<string>();

while (queue.Count > 0)
{
    var table = queue.Dequeue();
    sortedTables.Add(table);

    foreach (var dependent in graph[table])
    {
        inDegree[dependent]--;
        if (inDegree[dependent] == 0)
            queue.Enqueue(dependent);
    }
}
```

**Complexity**: O(V + E) where V = tables, E = foreign keys

---

### 2. Foreign Key Remapping

**Scenario**: Transferring `SalesInvoices` table that references `Customers`

```
Source Database:
  Customers:        CustomerId=100, Name="ABC Corp"
  SalesInvoices:    InvoiceId=500, CustomerId=100, Amount=1000

Target Database (after transfer):
  Customers:        CustomerId=NEW_GUID_1, Name="ABC Corp"
  SalesInvoices:    InvoiceId=NEW_GUID_2, CustomerId=NEW_GUID_1, Amount=1000

IdMappingService State:
  "Customers" → { 100 → NEW_GUID_1 }
  "SalesInvoices" → { 500 → NEW_GUID_2 }
```

**Code Flow**:
```csharp
// 1. Transfer Customers first (dependency order)
var oldCustomerId = 100;
var newCustomerId = Guid.NewGuid(); // NEW_GUID_1
// INSERT INTO Customers (...) VALUES (NEW_GUID_1, 'ABC Corp')
_idMappingService.AddMapping("Customers", oldCustomerId, newCustomerId);

// 2. Transfer SalesInvoices
var invoice = { InvoiceId = 500, CustomerId = 100, Amount = 1000 };

// Remap FK
var oldFkValue = invoice.CustomerId; // 100
var newFkValue = _idMappingService.GetMappedValue("Customers", oldFkValue); // NEW_GUID_1
invoice.CustomerId = newFkValue;

// Generate new PK
var newInvoiceId = Guid.NewGuid(); // NEW_GUID_2
invoice.InvoiceId = newInvoiceId;

// INSERT INTO SalesInvoices (NEW_GUID_2, NEW_GUID_1, 1000)
_idMappingService.AddMapping("SalesInvoices", 500, newInvoiceId);
```

---

### 3. Checkpoint Serialization

**Format**: JSON stored in `SubdomainOperationAudit.CheckpointData`

**Example**:
```json
{
  "completedTables": [
    "Accounting.AcAccounts",
    "Accounting.AcJournalTypes",
    "Finance.Banks"
  ],
  "currentTable": null,
  "checkpointAt": "2026-01-07T10:30:45Z",
  "idMappings": {
    "Accounting.AcAccounts": {
      "100": "8a3f9c2d-...",
      "101": "7b2e8d1c-..."
    },
    "Finance.Banks": {
      "1": "9c4f0e3a-..."
    }
  }
}
```

**Storage Strategy**:
- Saved after each successful table transfer
- IdMappings stored as `Dictionary<string, Dictionary<string, string>>` for serialization
- Checkpoint size typically < 1MB for 100 tables with 10K rows each

---

## Configuration

### Entity Type Mapping

**EntityType Enum** defines which ERP modules to transfer:

```csharp
public enum TransferEntityType
{
    Accounting,
    Finance,
    Sales,
    Purchase,
    Inventory,
    FixedAssets,
    HR,
    VanSales
}
```

**Table Discovery**: For each EntityType, the system queries `INFORMATION_SCHEMA.TABLES` to find matching schema prefix.

---

### Special Table Handling

**GeneralSettings Tables**:
- Matched by prefix: `{Schema}GeneralSettings` (e.g., `AcGeneralSettings`, `SalesGeneralSettings`)
- Uses UPSERT logic (SQL MERGE) instead of INSERT
- Matches on `SubdomainId` column
- Excluded columns: `TaxId` (reference data)

**UPSERT Implementation**:
```csharp
MERGE INTO [Schema].[GeneralSettings] AS target
USING (SELECT @p0 AS SubdomainId, @p1 AS Column1, ...) AS source
ON target.SubdomainId = source.SubdomainId
WHEN MATCHED THEN
    UPDATE SET Column1 = source.Column1, ...
WHEN NOT MATCHED THEN
    INSERT (SubdomainId, Column1, ...) VALUES (source.SubdomainId, source.Column1, ...);
```

---

### Error Handling Configuration

**ContinueOnError** flag determines behavior:
- `true`: Log error, skip table, continue to next table, save checkpoint
- `false`: Log error, stop entire transfer, mark operation as Failed, save checkpoint

**Resume Strategy**:
- Failed operations with checkpoints can be resumed
- Resume restores ID mappings and skips completed tables
- New operation audit record created (linked via ResumeFromJobId)

---

## Performance Considerations

### Optimization Strategies

1. **Batch Processing**: Configurable batch sizes per table
2. **Connection Pooling**: Reuses database connections
3. **Parallel FK Resolution**: Resolves FK metadata in parallel for multiple tables
4. **Checkpoint Frequency**: Saves checkpoint after each table (not after each row)
5. **Dapper Performance**: Uses Dapper for fast data access (no EF Core overhead)

### Typical Performance

| Metric | Value |
|--------|-------|
| Small transfer (< 10 tables, < 1K rows) | ~10 seconds |
| Medium transfer (50 tables, 10K rows) | ~2 minutes |
| Large transfer (100 tables, 100K rows) | ~15 minutes |

---

## Monitoring & Logging

### Logging Levels

- **Trace**: FK remapping, row-level operations
- **Debug**: Table-level operations
- **Information**: Transfer start/complete, table operations
- **Warning**: FK mismatches, validation warnings
- **Error**: Table failures, audit persistence failures
- **Critical**: Unrecoverable errors

### Key Metrics

- Tables processed per second
- Rows transferred per second
- FK mapping success rate
- Table success rate
- Average table transfer time

---

## Security Considerations

1. **Connection String Isolation**: Each tenant has isolated connection string
2. **Audit Trail**: All operations tracked with user ID and email
3. **No Cross-Tenant Access**: Transfer only between same tenant's subdomains
4. **Job Authorization**: Only authorized users can trigger transfers
5. **SQL Injection Protection**: Parameterized queries via Dapper

---

## Recent Changes

### Version 2.1 (2026-01-07)

**Major Changes:**
1. **Removed Checkpoint/Resume System**
   - Simplified architecture by removing checkpoint persistence
   - Transfers must complete in full or be restarted
   - Eliminates checkpoint-related complexity and storage overhead

2. **Removed Rollback System**
   - Removed automatic rollback functionality
   - Manual cleanup required on transfer failure
   - Reduced complexity and storage requirements

3. **Fixed DbContext Threading Issue** (CRITICAL)
   - **Problem**: Fire-and-forget FK mapping persistence caused "second operation started" errors
   - **Solution**: Removed async FK mapping persistence during AddMapping/AddMappings
   - **Impact**: FK mappings now purely in-memory (sufficient for transfer process)
   - **Location**: `IdMappingService.cs:41, 59`

4. **UI Improvements**
   - Fixed Enter key requiring double-press in search fields
   - Added `Immediate="true"` to search TextFields
   - Redirected bulk operations to audit log page
   - Improved navigation flow

**Migration Notes:**
- No database schema changes required
- Existing transfers continue to work
- Checkpoint/resume UI buttons removed from frontend
- FK mappings no longer persisted to audit tables (in-memory only)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-01 | Initial implementation |
| 2.0 | 2026-01-07 | Enhanced UI with pagination, filters, error details |
| 2.1 | 2026-01-07 | Removed checkpoint/resume, fixed threading issues |

---

**Document Owner**: DevOps Team
**Last Reviewed**: 2026-01-07
**Next Review**: 2026-04-07
