# Session Limiting Feature

## Overview

The session limiting feature allows you to control the maximum number of concurrent active sessions per user or per tenant. When a user exceeds the configured limit, the oldest session is automatically revoked to make room for the new one.

This feature is fully integrated with the existing ERP token generation flow and uses Redis for efficient session tracking.

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    ErpTokenService                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ GenerateTokenAsync()                                   │  │
│  │ 1. Check session limit                                │  │
│  │ 2. Get active sessions from Redis                     │  │
│  │ 3. If limit exceeded → Revoke oldest session          │  │
│  │ 4. Generate new token                                 │  │
│  │ 5. Track new session in Redis                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ActiveSessionService                            │
│  • GetActiveSessionsAsync()       → Fetch from Redis        │
│  • AddSessionAsync()              → Add to Redis            │
│  • RemoveOldestSessionAsync()     → Remove + Revoke token   │
│  • GetSessionLimitAsync()         → Check DB config         │
│  • RevokeSessionAsync()           → Manual revocation       │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴──────────────┐
            ▼                              ▼
┌──────────────────────┐      ┌──────────────────────────┐
│   Redis Cache        │      │  Database                │
│                      │      │                          │
│  session:active:     │      │  • TenantConfiguration   │
│    {subdomain}:      │      │    - MaxSessionsPerUser  │
│    {userId}          │      │                          │
│                      │      │  • UserSessionConfig     │
│  [SessionData[]]     │      │    - UserId              │
│    - SessionId       │      │    - MaxSessions         │
│    - Version         │      │                          │
│    - CreatedAt       │      │  • RevokedToken          │
│    - ExpiresAt       │      │    (for revocations)     │
└──────────────────────┘      └──────────────────────────┘
```

### Flow Diagram

#### Tenant Provisioning (Saga)
```
New Tenant Request → ERP Provisioning Saga
                          │
                          ▼
              SeedBusinessDataStep.ExecuteAsync()
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
   Seed Business Data        Read appsettings.json
   (orchestrator.SeedAllAsync)    "SessionLimiting" section
            │                           │
            └─────────────┬─────────────┘
                          ▼
         ConfigureSessionLimitingAsync()
                          │
                          ▼
            Update TenantConfiguration
            - MaxSessionsPerUser
            - EnableUserLevelSessionLimits
                          │
                          ▼
              Tenant Ready with Session Limits
```

#### Token Generation (Runtime)
```
User Login → Keycloak Auth → ErpTokenService.GenerateTokenAsync()
                                      │
                                      ▼
                          Get Session Limit (User > Tenant)
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
              Limit Exists?                        No Limit
                    │                                   │
                    ▼                                   ▼
          Get Active Sessions              Generate Token (Normal Flow)
                    │
       ┌────────────┴────────────┐
       │                         │
  Count < Limit          Count >= Limit
       │                         │
       ▼                         ▼
  Generate Token      Remove Oldest Session
       │              Create RevokedToken Record
       │                         │
       │                         ▼
       │              Generate New Token
       │                         │
       └────────────┬────────────┘
                    ▼
          Track Session in Redis
                    │
                    ▼
            Return Token to User
```

## Configuration

### 1. Tenant-Level Configuration

Set the default session limit for all users in a tenant by updating the `TenantConfiguration` table:

```sql
-- Set max sessions per user for a specific tenant
UPDATE TenantConfiguration
SET MaxSessionsPerUser = 3,
    EnableUserLevelSessionLimits = 1  -- Allow user-specific overrides
WHERE SubDomainName = 'your-tenant-subdomain';
```

**Fields:**
- `MaxSessionsPerUser` (int?, nullable): Maximum sessions allowed per user. `NULL` = unlimited sessions.
- `EnableUserLevelSessionLimits` (bool): Whether to allow user-specific overrides.

### 2. User-Level Configuration (Overrides)

Override the tenant default for specific users by creating records in the `UserSessionConfiguration` table:

```sql
-- Insert a user-specific session limit
INSERT INTO UserSessionConfiguration (Id, UserId, MaxSessions, SubdomainName, SubdomainId, CreatedDate, ModifiedDate)
VALUES (
    NEWID(),
    'user-guid-here',
    5,  -- This user can have 5 concurrent sessions
    'your-tenant-subdomain',
    'subdomain-guid-here',
    GETUTCDATE(),
    GETUTCDATE()
);
```

**Priority (Hierarchical Fallback):**
1. **User-level limit** (`UserSessionConfiguration.MaxSessions`) - Highest priority
2. **Tenant-level limit** (`TenantConfiguration.MaxSessionsPerUser`) - Second priority
3. **Global default** (`appsettings.json:SessionLimiting.GlobalDefaultMaxSessions`) - Third priority
4. **Hard-coded fallback** (5 sessions) - If nothing is configured

**Note:** Session limiting is **always active** with a minimum default of 5 sessions, even if no configuration exists.

### 3. Application Settings (appsettings.json)

Configure default session limits that will be automatically applied to new tenants during the provisioning saga:

**appsettings.Development.json** (Development environment):
```json
"SessionLimiting": {
  "DefaultMaxSessionsPerUser": 3,
  "GlobalDefaultMaxSessions": 5,
  "EnableSessionTracking": true,
  "EnableUserLevelOverrides": true
}
```

**appsettings.json** (Production - always active):
```json
"SessionLimiting": {
  "DefaultMaxSessionsPerUser": null,
  "GlobalDefaultMaxSessions": 5,
  "EnableSessionTracking": true,
  "EnableUserLevelOverrides": false
}
```

**Configuration Fields:**

- **`DefaultMaxSessionsPerUser`** (int?, nullable):
  - Default session limit applied to **new tenants** during provisioning saga
  - Used by `SeedBusinessDataStep` to populate `TenantConfiguration.MaxSessionsPerUser`
  - `null` = new tenants won't have a tenant-level limit (will use GlobalDefault)

- **`GlobalDefaultMaxSessions`** (int?, nullable):
  - **Global fallback** session limit when no user or tenant limit is configured
  - Used at **runtime** by `ActiveSessionService.GetSessionLimitAsync()`
  - Default: `5` if not specified (hard-coded in `ActiveSessionService.cs:127`)
  - **This ensures session limiting is ALWAYS active**

- **`EnableSessionTracking`** (bool):
  - Whether to enable session tracking in Redis globally
  - Should be `true` for session limiting to work

- **`EnableUserLevelOverrides`** (bool):
  - Whether new tenants allow user-specific session limit overrides
  - Controls `TenantConfiguration.EnableUserLevelSessionLimits` during provisioning

**When Applied:**
During the ERP provisioning saga, the `SeedBusinessDataStep` reads these values from appsettings and automatically configures the `TenantConfiguration` table for the new tenant.

**Code Location:** `AppsPortal.Application/Core/State/Steps/SeedBusinessDataStep.cs:59-103`

#### Session Limit Resolution (Priority Order)

When a user attempts to generate an ERP token, the system resolves the session limit using this priority chain:

```
ActiveSessionService.GetSessionLimitAsync()
        ↓
1. Check UserSessionConfiguration table
   └─ WHERE UserId = {userId} AND Subdomain = {subdomain}
        ↓
   Found? → Return UserSessionConfiguration.MaxSessions
        ↓
2. Check TenantConfiguration table
   └─ WHERE SubDomainName = {subdomain}
        ↓
   Found AND MaxSessionsPerUser != null? → Return TenantConfiguration.MaxSessionsPerUser
        ↓
3. Read appsettings.json
   └─ SessionLimiting:GlobalDefaultMaxSessions
        ↓
   Configured? → Return GlobalDefaultMaxSessions
        ↓
4. Hard-coded fallback → Return 5
```

**Example Scenarios:**

| User Config | Tenant Config | Global Default | **Result** |
|------------|---------------|----------------|------------|
| 10         | 3             | 5              | **10** (user override) |
| null       | 3             | 5              | **3** (tenant limit) |
| null       | null          | 5              | **5** (global default) |
| null       | null          | null           | **5** (hard-coded fallback) |
| 1          | null          | null           | **1** (user override, single sign-on) |

**Key Insight:** Session limiting is **ALWAYS enforced**, even for existing tenants with no configuration. The minimum is 5 concurrent sessions unless explicitly configured higher or lower.

### 4. Database Schema Changes

You need to manually add these columns and table to your database:

#### TenantConfiguration Table

```sql
-- Add columns to existing TenantConfiguration table
ALTER TABLE TenantConfiguration
ADD MaxSessionsPerUser INT NULL,
    EnableUserLevelSessionLimits BIT NOT NULL DEFAULT 0;
```

#### UserSessionConfiguration Table (New)

```sql
-- Create new table for user-specific session limits
CREATE TABLE UserSessionConfiguration (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    MaxSessions INT NOT NULL,
    SubdomainId UNIQUEIDENTIFIER NULL,
    SubdomainName NVARCHAR(255) NOT NULL,

    -- Multi-tenant fields (inherited from base entity)
    TenantId UNIQUEIDENTIFIER NULL,
    Subdomain NVARCHAR(255) NULL,

    -- Audit fields (inherited from FullAuditedEntityBase)
    CreatedBy NVARCHAR(255) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedBy NVARCHAR(255) NULL,
    ModifiedDate DATETIME2 NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedBy NVARCHAR(255) NULL,
    DeletedDate DATETIME2 NULL,

    -- Indexes
    INDEX IX_UserSessionConfiguration_UserId_SubdomainName (UserId, SubdomainName)
);
```

## Redis Cache Structure

### Key Pattern

```
session:active:{subdomainName}:{userId}
```

**Example:**
```
session:active:acme-corp:3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Value Structure

JSON array of active sessions:

```json
[
  {
    "sessionId": "a1b2c3d4-5678-90ab-cdef-123456789abc",
    "version": "e5f6g7h8-9012-34ij-klmn-567890123def",
    "createdAt": 1703001234,
    "expiresAt": 1703004834
  },
  {
    "sessionId": "b2c3d4e5-6789-01bc-defg-234567890bcd",
    "version": "f6g7h8i9-0123-45jk-lmno-678901234efg",
    "createdAt": 1703002345,
    "expiresAt": 1703005945
  }
]
```

**Fields:**
- `sessionId` (Guid): Keycloak session ID
- `version` (Guid): Unique token version (used as key in `erp:token:{version}`)
- `createdAt` (long): Unix timestamp (seconds) when session was created
- `expiresAt` (long): Unix timestamp (seconds) when session expires

**TTL (Time-To-Live):**
- Automatically set to match the longest `expiresAt` in the session list
- Expired sessions are automatically cleaned up by Redis
- Default: Matches `ErpToken:ExpiryMinutes` (60 minutes)

## How Session Validation Works

### 1. Middleware Integration

The session validation is handled by middleware in the Microtec packages. The middleware:

1. Extracts the ERP token from the request header
2. Validates the token using `ErpTokenService.ValidateAndDecodeToken()`
3. Checks if the token is revoked using `RevokedTokenService.IsRevokedAsync()`
4. If revoked, returns `401 Unauthorized`

### 2. Revocation Mechanism

When a session limit is exceeded:

```
ErpTokenService.GenerateTokenAsync()
    ↓
ActiveSessionService.RemoveOldestSessionAsync()
    ↓
RevokedTokenService.RevokeByUserIdAsync()
    ↓
INSERT INTO RevokedToken (UserId, RevokedAt, Reason, SubdomainName)
```

The `RevokedToken` table uses timestamp comparison:
- If `RevokedToken.RevokedAt > Token.IssuedDate`, the token is considered revoked
- This automatically invalidates all tokens issued before the revocation timestamp

### 3. Validation Logic

```csharp
// Pseudo-code from RevokedTokenService.IsRevokedAsync()
bool IsRevoked(Token token)
{
    var revokedRecord = db.RevokedTokens
        .Where(rt => rt.UserId == token.UserId)
        .Where(rt => rt.RevokedAt > token.IssuedDate)
        .Where(rt => rt.SubdomainName == token.SubdomainName)
        .Any();

    return revokedRecord;
}
```

## Manual Session Revocation

### Revoke a Specific Session

```csharp
// Inject IActiveSessionService
await activeSessionService.RevokeSessionAsync(
    userId: Guid.Parse("user-guid"),
    sessionId: Guid.Parse("session-guid"),
    subdomainName: "acme-corp",
    reason: "ManualRevocation",
    cancellationToken: cancellationToken);
```

### Revoke All Sessions for a User

```csharp
// Get all active sessions
var sessions = await activeSessionService.GetActiveSessionsAsync(
    userId: Guid.Parse("user-guid"),
    subdomainName: "acme-corp",
    cancellationToken: cancellationToken);

// Revoke each session
foreach (var session in sessions)
{
    await activeSessionService.RevokeSessionAsync(
        userId: Guid.Parse("user-guid"),
        sessionId: session.SessionId,
        subdomainName: "acme-corp",
        reason: "AdminRevocation",
        cancellationToken: cancellationToken);
}
```

### Query Active Sessions

```csharp
// Get all active sessions for a user
var sessions = await activeSessionService.GetActiveSessionsAsync(
    userId: Guid.Parse("user-guid"),
    subdomainName: "acme-corp",
    cancellationToken: cancellationToken);

// Display session info
foreach (var session in sessions)
{
    Console.WriteLine($"Session ID: {session.SessionId}");
    Console.WriteLine($"Created: {DateTimeOffset.FromUnixTimeSeconds(session.CreatedAt)}");
    Console.WriteLine($"Expires: {DateTimeOffset.FromUnixTimeSeconds(session.ExpiresAt)}");
}
```

## Usage Examples

### Example 1: Enable Session Limiting for a Tenant

```sql
-- Allow max 3 sessions per user for tenant "acme-corp"
UPDATE TenantConfiguration
SET MaxSessionsPerUser = 3,
    EnableUserLevelSessionLimits = 0  -- Don't allow user overrides
WHERE SubDomainName = 'acme-corp';
```

**Result:**
- Each user in "acme-corp" can have max 3 concurrent sessions
- When a 4th session is created, the oldest is revoked automatically

### Example 2: User-Specific Override

```sql
-- Tenant default: 3 sessions
UPDATE TenantConfiguration
SET MaxSessionsPerUser = 3,
    EnableUserLevelSessionLimits = 1
WHERE SubDomainName = 'acme-corp';

-- VIP user gets 10 sessions
INSERT INTO UserSessionConfiguration (Id, UserId, MaxSessions, SubdomainName)
VALUES (NEWID(), 'vip-user-guid', 10, 'acme-corp');

-- Restricted user gets only 1 session
INSERT INTO UserSessionConfiguration (Id, UserId, MaxSessions, SubdomainName)
VALUES (NEWID(), 'restricted-user-guid', 1, 'acme-corp');
```

**Result:**
- VIP user: max 10 sessions
- Restricted user: max 1 session (single sign-on)
- Other users: max 3 sessions (tenant default)

### Example 3: Use Global Default (Minimal Configuration)

```sql
-- Remove tenant-level session limit (will use global default)
UPDATE TenantConfiguration
SET MaxSessionsPerUser = NULL
WHERE SubDomainName = 'acme-corp';

-- Remove user-specific limits
DELETE FROM UserSessionConfiguration
WHERE SubdomainName = 'acme-corp';
```

**Result:**
- Tenant and user-specific limits removed
- Users will have the **global default limit** (5 sessions from `appsettings.json`)
- Session limiting is **still active** - it cannot be completely disabled
- Session tracking continues in Redis

**To increase the limit for all tenants without specific config:**
```json
// In appsettings.json
"SessionLimiting": {
  "GlobalDefaultMaxSessions": 10  // All unconfigured tenants get 10 sessions
}
```

## Monitoring & Debugging

### Check Redis Cache

```bash
# Connect to Redis CLI
redis-cli

# List all session keys for a tenant
KEYS session:active:acme-corp:*

# View sessions for a specific user
GET session:active:acme-corp:3fa85f64-5717-4562-b3fc-2c963f66afa6

# Check TTL (time-to-live) of a session key
TTL session:active:acme-corp:3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Query Database for Revoked Sessions

```sql
-- View recently revoked sessions
SELECT TOP 100
    UserId,
    RevokedAt,
    Reason,
    SubdomainName
FROM RevokedToken
WHERE SubdomainName = 'acme-corp'
ORDER BY RevokedAt DESC;

-- Count revocations due to session limit
SELECT
    COUNT(*) AS TotalRevocations,
    SubdomainName
FROM RevokedToken
WHERE Reason = 'SessionLimitExceeded'
GROUP BY SubdomainName;
```

### Application Logs

Look for log messages from `ActiveSessionService`:

```
[Information] Added new session {SessionId} for user {UserId} in tenant {Subdomain}. Total active sessions: {Count}

[Information] Removed oldest session {SessionId} for user {UserId} in tenant {Subdomain} due to session limit

[Information] Session limit ({Limit}) reached for user {UserId} in tenant {Subdomain}. Oldest session revoked.
```

## Performance Considerations

### Redis Cache Benefits

- **Fast lookups**: O(1) retrieval by user ID
- **Automatic cleanup**: Expired sessions removed via TTL
- **Memory efficient**: Only stores minimal session metadata

### Database Impact

- **Minimal writes**: Only creates `RevokedToken` record when limit is exceeded
- **No additional reads**: Session limits cached in `TenantConfiguration` queries
- **Indexed queries**: `UserSessionConfiguration` has composite index on `(UserId, SubdomainName)`

### Optimization Tips

1. **Set appropriate limits**: Higher limits = more Redis memory usage
2. **Monitor Redis memory**: Each session ~150 bytes JSON
3. **Clean up old revocations**: Archive `RevokedToken` records older than token expiry period
4. **Use tenant-level limits**: Reduces database queries vs. per-user lookups

## Troubleshooting

### Issue: Sessions not being limited

**Check:**
1. Is `MaxSessionsPerUser` set in database?
   ```sql
   SELECT MaxSessionsPerUser FROM TenantConfiguration WHERE SubDomainName = 'your-tenant';
   ```
2. Is Redis running and accessible?
   ```bash
   redis-cli PING
   ```
3. Check application logs for errors from `ActiveSessionService`

### Issue: User getting logged out unexpectedly

**Possible causes:**
1. Session limit too low (check config)
2. User logging in from multiple devices
3. Token expiry (check `ErpToken:ExpiryMinutes`)

**Debug:**
```csharp
// Check effective session limit
var limit = await activeSessionService.GetSessionLimitAsync(userId, subdomainName);
Console.WriteLine($"Session limit: {limit}");

// Check active sessions
var sessions = await activeSessionService.GetActiveSessionsAsync(userId, subdomainName);
Console.WriteLine($"Active sessions: {sessions.Count}");
```

### Issue: Redis key not expiring

**Check:**
- TTL is set correctly: `TTL session:active:tenant:user-id`
- Redis eviction policy: `maxmemory-policy volatile-ttl`
- Application is calling `AddSessionAsync()` with correct `ttlMinutes`

## Security Considerations

- **Session hijacking**: Session IDs are Keycloak-generated GUIDs (high entropy)
- **Token revocation**: Immediate via database timestamp check
- **Multi-tenant isolation**: All queries filtered by `SubdomainName`
- **Audit trail**: `RevokedToken` records include reason and timestamp
- **Admin access**: Manual revocation requires `IActiveSessionService` injection (authorization needed)

## Future Enhancements

Potential improvements (not currently implemented):

- [ ] Session management UI for end users
- [ ] Grace period before revoking oldest session (warn user first)
- [ ] Session metadata (IP address, device type, location)
- [ ] Analytics dashboard (session counts per tenant/user)
- [ ] Configurable revocation strategy (oldest vs. least recently used)
- [ ] WebSocket notifications for session revocation
- [ ] Role-based session limits (admin=10, user=3, etc.)

## Dependencies

This feature relies on the following packages and services:

- **Redis**: Session cache storage
- **Microtec.Core.Abstractions.Cache**: `ICacheService` interface
- **Microtec.Domain.Abstractions**: `IRepository<T>`, `IUnitOfWork`
- **Microtec.Web.Core.Security**: `ISecurityService`
- **Entity Framework Core**: Database access
- **RevokedTokenService**: Token revocation logic

## Contact & Support

For questions or issues:
- Check application logs in Seq (port 1234)
- Review Redis cache keys
- Verify database configuration
- Consult `ErpTokenService.cs:32-117` for implementation details
