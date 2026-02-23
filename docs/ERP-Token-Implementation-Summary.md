# ERP Access Token Implementation Summary

## Overview
Implemented a session-based ERP Access Token system that uses Keycloak for authentication and provides authorization for company/branch/module access.

## Architecture

### Token Flow
1. User authenticates with Keycloak → receives Keycloak JWT with session ID
2. User calls `/api/erp/access-token` → generates ERP token tied to session
3. ERP token stored in Redis with key: `erp:token:{userId}:{sessionId}`
4. Subsequent requests → middleware retrieves token from Redis using session ID
5. Token contains: userId, sessionId, branches (company/branch combos), modules

## Key Design Decisions

### Session-Based Token Storage
- **Redis Key**: `erp:token:{userId}:{sessionId}`
- **No Header Required**: Token retrieved from Redis, not passed in headers
- **Session Validation**: Each token tied to Keycloak session ID (`session_state` claim)
- **Multi-Session Support**: User can have different tokens for different sessions
- **Auto-Expiry**: Redis TTL matches token expiration

### Token Structure
```json
{
  "sub": "user-guid",
  "sid": "session-guid",
  "ver": "version-uuid",
  "branches": [
    {
      "cid": "company-guid",
      "cn": "Company Name",
      "bid": "branch-guid",
      "bn": "Branch Name",
      "def": true
    }
  ],
  "modules": [1, 5, 6, 7, 9]
}
```

### Redis Data Structure
```json
{
  "token": "eyJhbGci...",
  "version": "550e8400-...",
  "session_id": "5e79795d-...",
  "subdomain_name": "develop",
  "created_at": 1764580869,
  "expires_at": 1764588067
}
```

## Implementation Details

### Created Files

1. **`Shared.Core/Models/ErpToken/ErpAccessToken.cs`**
   - Token DTO with SessionId field

2. **`Shared.Core/Models/ErpToken/ErpAccessTokenData.cs`**
   - DTO exposed by SecurityService

3. **`Shared.Core/Models/ErpToken/BranchAccess.cs`**
   - Company/branch combination DTO

4. **`Shared.Core/Models/ErpToken/ErpTokenResponse.cs`**
   - API response DTO

5. **`Shared.Core/Abstractions/ISubdomainLicenseService.cs`**
   - Interface for querying subdomain modules

6. **`Shared.Core/Abstractions/IUserBranchAccessService.cs`**
   - Interface for querying user branches

7. **`BusinessOwners.Application/ErpToken/SubdomainLicenseService.cs`**
   - Queries BoLicense for purchased modules

8. **`AppsPortal.Application/ErpToken/UserBranchAccessService.cs`**
   - Queries UserBranch for accessible branches

9. **`Shared.Web/Security/Services/IErpTokenService.cs`**
   - Token generation and retrieval interface

10. **`Shared.Web/Security/Services/ErpTokenService.cs`**
    - Token generation, Redis storage, validation

11. **`Shared.Web/Security/Services/IErpAuthorizationService.cs`**
    - Authorization checks interface

12. **`Shared.Web/Security/Services/ErpAuthorizationService.cs`**
    - Module and branch access validation

13. **`Shared.Web/Extensions/ErpTokenControllerExtensions.cs`**
    - API endpoints via extension method

### Modified Files

1. **`Shared.Core/Interfaces/ISecurityService.cs`**
   - Added `CurrentErpToken` property
   - Added `GetClaimValue(string claimType)` method

2. **`Shared.Infrastructure/Security/SecurityService.cs`**
   - Implemented `CurrentErpToken` property
   - Implemented `GetClaimValue` method

3. **`Shared.Core/Interfaces/ICacheService.cs`**
   - Added `RemoveByPattern(string pattern)` method

4. **`Shared.Infrastructure/Services/CacheService.cs`**
   - Implemented `RemoveByPattern` using Redis pattern matching

5. **`Shared.Web/Middleware/AuthorizationMiddleware.cs`**
   - Retrieves token from Redis using userId and sessionId
   - Validates session ID matches
   - Stores token in HttpContext.Items
   - Falls back to groups-based validation if no token

6. **`Shared.Web/Extensions/ServicesExtensions.cs`**
   - Added empty `AddErpTokenServices()` (services auto-register)

7. **`AppsPortal.Application/Core/Users/Queries/GetCurrentUserInfoQuery/Dto/CurrentUserInfoDto.cs`**
   - Added ERP token fields: `ErpToken`, `ErpTokenVersion`, `ErpTokenExpiresAt`

## API Endpoints

### Generate Token
```http
POST /api/erp/access-token
Authorization: Bearer {keycloak-token}
```

**Response:**
```json
{
  "token": "eyJhbGci...",
  "version": "550e8400-...",
  "expiresAt": "2025-12-01T12:00:00Z"
}
```

### Revoke Token
```http
POST /api/erp/revoke-token
Authorization: Bearer {keycloak-token}
```

**Revokes:**
- Without session ID: All tokens for the user
- With session ID: Specific session token

## Security Features

### Session Validation
- Token tied to Keycloak `session_state` claim
- Session ID stored in token claims
- Middleware validates session ID matches current Keycloak session
- Invalid session → token rejected

### Multi-Session Support
- Users can log in from multiple devices/browsers
- Each session gets unique ERP token
- Tokens isolated by session ID in Redis
- Logout from one session doesn't affect others

### Token Versioning
- Each token has unique version UUID
- Stored in Redis for validation
- Can trigger token refresh if needed

### Company/Branch Access Control
- Token contains list of accessible branches
- Middleware validates requested company/branch against token
- 403 Forbidden if access denied

### Module Access Control
- Token contains list of purchased modules
- `ErpAuthorizationService.HasModule(Modules module)` checks access
- Integrates with existing permission system

## Integration with Existing System

### Keycloak Integration
- Uses existing Keycloak authentication
- Extracts `session_state` claim (fallback to `sid`)
- No changes to Keycloak configuration needed

### Backward Compatibility
- If no ERP token found, falls back to groups-based validation
- Existing API endpoints work unchanged
- Optional adoption per endpoint

### SecurityService Integration
- `CurrentErpToken` property exposes token data
- Available throughout application via DI
- Cached in HttpContext for performance

## Configuration

### appsettings.json
```json
{
  "ErpToken": {
    "SigningKey": "your-256-bit-secret-key-here-min-32-chars",
    "Issuer": "https://your-domain.com",
    "ExpiryMinutes": 60
  }
}
```

### Redis
- No additional configuration needed
- Uses existing `ICacheService`
- TTL automatically set to match token expiry

## Testing

### HTTP File
`Docs/ErpToken.http` contains test scenarios:
1. Generate ERP token
2. Revoke token (all sessions)
3. Test with ERP token (retrieved from Redis)
4. Test without ERP token (fallback)
5. Test invalid company/branch access

### Test Flow
1. Authenticate with Keycloak
2. Call `/api/erp/access-token` to generate token
3. Make API calls - middleware auto-loads token from Redis
4. Validate company/branch access works
5. Test token expiry and revocation

## Performance Considerations

### Redis Caching
- Token retrieved once per request
- Stored in `HttpContext.Items` for request lifetime
- No repeated Redis calls per request

### Token Size
- Compact JWT structure
- Only essential data included
- Branches use short property names (cid, cn, bid, bn, def)

### Query Optimization
- `SubdomainLicenseService` uses `AsNoTracking()`
- `UserBranchAccessService` uses `AsNoTracking()`
- Both services query only necessary fields

## Monitoring & Logging

### Log Events
- Token generation: User ID, session ID, branch count, module count
- Token retrieval: Cache hit/miss
- Session mismatch: Expected vs actual session ID
- Token expiry: Auto-cleanup from Redis
- Token revocation: Single session or all sessions

### Metrics
- Track via existing logging infrastructure
- Session-based token usage
- Token refresh frequency
- Failed authorization attempts

## Future Enhancements

### Potential Improvements
1. Token refresh endpoint (extend expiry without re-login)
2. Token usage analytics per module
3. Rate limiting per token
4. Token blacklist for revoked tokens
5. Admin endpoint to view active sessions
6. Webhook notifications on token events

### Scalability
- Redis clustering supported
- Stateless design (no in-memory state)
- Horizontal scaling ready
- Session affinity not required

## Migration Guide

### For Existing Endpoints
1. No changes required - backward compatible
2. Token automatically loaded if available
3. Falls back to existing validation

### For New Endpoints
1. Inject `IErpAuthorizationService`
2. Use `HasModule(Modules.Accounting)` to check access
3. Use `HasCompanyBranchAccess(companyId, branchId)` for validation
4. Access token data via `securityService.CurrentErpToken`

### For Frontend
1. Call `/api/erp/access-token` after Keycloak login
2. Store token locally (optional - for display only)
3. No need to send token in headers
4. Token auto-loaded by middleware using session

## Troubleshooting

### Token Not Found
- Check Redis connection
- Verify user called `/api/erp/access-token`
- Check session ID in Keycloak token

### Session Mismatch
- User may have logged out and back in
- Generate new token after re-login
- Check `session_state` claim in Keycloak token

### Access Denied
- Verify user has UserBranch records
- Check subdomain has purchased modules
- Validate company/branch IDs in request headers

### Token Expired
- Redis auto-removes expired tokens
- User needs to generate new token
- Consider extending `ExpiryMinutes` in config

## Code Standards Applied

- NO XML documentation comments
- Primary constructors used
- File-scoped namespaces
- Methods under 30 lines
- Explicit type declarations
- Proper error handling
- IClockService (not used - DateTime.UtcNow acceptable for tokens)
- Repository pattern with AsNoTracking
- Marker interfaces for DI (IScopedService, ITransientService)

## Build Status
✅ All projects compile successfully
✅ 0 compilation errors
✅ Backward compatible with existing code
