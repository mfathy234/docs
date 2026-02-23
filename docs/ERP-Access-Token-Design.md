# ERP Access Token Design - Lightweight Authorization Token

## Executive Summary

This document outlines the design for implementing a **lightweight second authorization token** for the ERP system that:
- **Minimal payload** - only essential data (version, user, branches, modules)
- **Consumes the Keycloak JWT** (doesn't contain it)
- **Generates a new ERP-specific token** for authorization
- **Uses subdomain-based licensing** from `BoLicense`
- **Integrates with existing `PolicyMapper` and `AuthorizationMiddleware`**
- **Implements Redis-based token versioning**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Token Structure](#token-structure)
3. [Token Flow](#token-flow)
4. [Implementation Components](#implementation-components)
5. [Integration with Existing Authorization](#integration-with-existing-authorization)
6. [Redis Token Versioning](#redis-token-versioning)
7. [API Extension Methods](#api-extension-methods)
8. [Configuration](#configuration)

---

## Architecture Overview

### Two-Token Architecture

1. **Keycloak Token** (Authentication - "Who you are")
   - User identity and basic permissions
   - Validates user is authenticated
   - Passed in `Authorization: Bearer <token>`

2. **ERP Access Token** (Authorization - "What you can do")
   - **Minimal payload**: version, userId, branches, modules
   - Generated from Keycloak token
   - Contains subdomain-level module licenses from `BoLicense`
   - Stored in Redis with version control
   - Passed in `X-ERP-Token: <token>` header

---

## Token Structure

### ERP Access Token Claims (Compact)

```json
{
  "sub": "erp-user-guid",
  "ver": "550e8400-e29b-41d4-a716-446655440000",

  "branches": [
    {
      "cid": "company-guid-1",
      "cn": "Acme Corporation",
      "bid": "branch-guid-1",
      "bn": "Riyadh Branch",
      "def": true
    },
    {
      "cid": "company-guid-1",
      "cn": "Acme Corporation",
      "bid": "branch-guid-2",
      "bn": "Jeddah Branch",
      "def": false
    },
    {
      "cid": "company-guid-2",
      "cn": "Subsidiary Inc",
      "bid": "branch-guid-3",
      "bn": "Main Office",
      "def": true
    }
  ],

  "modules": [1, 5, 6, 7, 9]
}
```

### Token Claims Explanation

| Claim | Full Name | Type | Description | Example |
|-------|-----------|------|-------------|---------|
| `sub` | Subject | GUID string | ERP User ID (from `erp_id` in Keycloak) | `"123e4567-e89b-12d3-a456-426614174000"` |
| `ver` | Version | UUID string | Token version identifier (for Redis validation) | `"550e8400-e29b-41d4-a716-446655440000"` |
| `branches` | Branches | Array | User's accessible company/branch combinations | See structure below |
| `modules` | Modules | Integer array | Module IDs from `Modules` enum | `[1, 5, 6, 7, 9]` |

### Branch Object Structure

| Field | Full Name | Type | Description | Example |
|-------|-----------|------|-------------|---------|
| `cid` | Company ID | GUID string | Company identifier | `"company-guid-1"` |
| `cn` | Company Name | String | Company display name | `"Acme Corporation"` |
| `bid` | Branch ID | GUID string | Branch identifier | `"branch-guid-1"` |
| `bn` | Branch Name | String | Branch display name | `"Riyadh Branch"` |
| `def` | Is Default | Boolean | Whether this branch is the default for the company | `true` or `false` |

### Module IDs (from `Modules` enum)

```csharp
1  = Accounting
2  = Hr
3  = GeneralSettings
4  = Finance
5  = Sales
6  = Purchase
7  = Inventory
8  = Distribution
9  = FixedAssets
1000 = Shared
```

### Example Token Payload

```json
{
  "sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "ver": "550e8400-e29b-41d4-a716-446655440000",

  "branches": [
    {
      "cid": "c1a2b3c4-d5e6-7890-1234-567890abcdef",
      "cn": "Acme Corporation",
      "bid": "b1a2b3c4-d5e6-7890-1234-567890abcdef",
      "bn": "Riyadh Branch",
      "def": true
    },
    {
      "cid": "c1a2b3c4-d5e6-7890-1234-567890abcdef",
      "cn": "Acme Corporation",
      "bid": "b2a2b3c4-d5e6-7890-1234-567890abcdef",
      "bn": "Jeddah Branch",
      "def": false
    }
  ],

  "modules": [1, 3, 4, 5, 6, 7]
}
```

**Estimated Token Size**: ~400-800 bytes (depending on branch count)

---

## Token Flow

### Sequence Diagram

```
User → Keycloak: 1. Authenticate
Keycloak → User: 2. Keycloak JWT

User → Frontend: 3. Redirect to after-login

Frontend → ERP API: 4. POST /api/erp/access-token
                        Authorization: Bearer <keycloak-token>

ERP API → JWT Validator: 5. Validate Keycloak Token

ERP API → License Service: 6. Get modules for subdomain from BoLicense

ERP API → User Service: 7. Get user's accessible companies/branches

ERP API → Token Service: 8. Generate compact ERP token
                            {userId, version, branches, modules}

Token Service → Redis: 9. SETEX erp:token:{userId}
                          {version, subdomain_id, TTL: 3600s}

ERP API → Frontend: 10. {erpToken, version, expiresAt}

Frontend → SessionStorage: 11. Store token + version

--- Subsequent API Requests ---

Frontend → ERP API: 12. GET /api/sales/invoices
                        Authorization: Bearer <keycloak-token>
                        X-ERP-Token: <erp-token>
                        X-Token-Version: <version-uuid>
                        X-Company-Id: <company-guid>
                        X-Branch-Id: <branch-guid>

ERP API → Auth Middleware: 13. Validate Keycloak Token

Auth Middleware → Redis: 14. GET version for userId
                            Compare with X-Token-Version

Auth Middleware: 15. If version mismatch →
                     Set X-Token-Refresh-Required: true

Auth Middleware → ERP Token: 16. Decode token, store in HttpContext

Auth Middleware: 17. Validate X-Company-Id/X-Branch-Id
                     against branches in token

Authorization Middleware: 18. Check PolicyMapper + module access

Controller → Frontend: 19. 200 OK + Data
```

---

## Implementation Components

### 1. Token DTOs

```csharp
// File: Src/Shared/Shared.Core/Models/ErpToken/ErpAccessToken.cs

namespace Shared.Core.Models.ErpToken;

/// <summary>
/// Compact ERP Access Token containing only essential authorization data
/// </summary>
public sealed class ErpAccessToken
{
    /// <summary>
    /// ERP User ID (from erp_id claim in Keycloak)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Token version (UUID) for Redis-based invalidation
    /// </summary>
    public string Version { get; set; }

    /// <summary>
    /// User's accessible company/branch combinations
    /// </summary>
    public List<BranchAccess> Branches { get; set; }

    /// <summary>
    /// Subdomain's purchased module IDs (from Modules enum)
    /// </summary>
    public List<int> Modules { get; set; }
}

/// <summary>
/// Represents a company/branch combination the user has access to
/// </summary>
public sealed class BranchAccess
{
    /// <summary>
    /// Company ID
    /// </summary>
    public Guid CompanyId { get; set; }

    /// <summary>
    /// Company Name
    /// </summary>
    public string CompanyName { get; set; }

    /// <summary>
    /// Branch ID
    /// </summary>
    public Guid BranchId { get; set; }

    /// <summary>
    /// Branch Name
    /// </summary>
    public string BranchName { get; set; }

    /// <summary>
    /// Is this the default branch for the company
    /// </summary>
    public bool IsDefault { get; set; }
}
```

### 2. License Service (Queries BoLicense)

```csharp
// File: Src/Shared/Shared.Application/Services/SubdomainLicenseService.cs

namespace Shared.Application.Services;

public interface ISubdomainLicenseService
{
    /// <summary>
    /// Gets purchased module IDs for a subdomain from BoLicense table
    /// </summary>
    Task<List<int>> GetSubdomainModulesAsync(
        Guid subdomainId,
        CancellationToken cancellationToken = default);
}

public sealed class SubdomainLicenseService : ISubdomainLicenseService
{
    private readonly IBusinessOwnersDbContext _context;
    private readonly ILogger<SubdomainLicenseService> _logger;

    public SubdomainLicenseService(
        IBusinessOwnersDbContext context,
        ILogger<SubdomainLicenseService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<int>> GetSubdomainModulesAsync(
        Guid subdomainId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Query BoLicense for Module type licenses
            var moduleIds = await _context.BoLicenses
                .Where(bl => bl.TenantInfo.SubdomainId == subdomainId &&
                            bl.LicenceType == LicenceType.Module &&
                            bl.PaymentStatus == PaymentStatus.Completed)
                .SelectMany(bl => bl.LicenceResources
                    .Where(r => r.ParentId == null && r.ResourceId != null)
                    .Select(r => r.ResourceId))
                .Distinct()
                .ToListAsync(cancellationToken);

            // Parse ResourceId as module ID
            var modules = moduleIds
                .Where(id => int.TryParse(id, out _))
                .Select(id => int.Parse(id))
                .ToList();

            _logger.LogInformation(
                "Retrieved {Count} modules for subdomain {SubdomainId}",
                modules.Count, subdomainId);

            return modules;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error retrieving modules for subdomain {SubdomainId}",
                subdomainId);

            // Return empty list on error (fail-safe)
            return new List<int>();
        }
    }
}
```

### 3. Branch Access Service

```csharp
// File: Src/Shared/Shared.Application/Services/UserBranchAccessService.cs

namespace Shared.Application.Services;

public interface IUserBranchAccessService
{
    /// <summary>
    /// Gets all company/branch combinations the user has access to
    /// </summary>
    Task<List<BranchAccess>> GetUserBranchesAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}

public sealed class UserBranchAccessService : IUserBranchAccessService
{
    private readonly IErpDbContext _context; // Your ERP database context
    private readonly ILogger<UserBranchAccessService> _logger;

    public UserBranchAccessService(
        IErpDbContext context,
        ILogger<UserBranchAccessService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<BranchAccess>> GetUserBranchesAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Query user's accessible branches via UserBranch relationship
            var branches = await _context.UserBranches
                .Where(ub => ub.UserId == userId)
                .Select(ub => new BranchAccess
                {
                    CompanyId = ub.Branch.CompanyId,
                    CompanyName = ub.Branch.Company.Name,
                    BranchId = ub.BranchId,
                    BranchName = ub.Branch.Name,
                    IsDefault = ub.Branch.IsDefault
                })
                .OrderBy(b => b.CompanyName)
                .ThenBy(b => b.BranchName)
                .ToListAsync(cancellationToken);

            _logger.LogInformation(
                "Retrieved {Count} branches for user {UserId}",
                branches.Count, userId);

            return branches;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error retrieving branches for user {UserId}",
                userId);

            return new List<BranchAccess>();
        }
    }
}
```

### 4. ERP Token Service

```csharp
// File: Src/Shared/Shared.Web/Security/Services/ErpTokenService.cs

namespace Shared.Web.Security.Services;

public interface IErpTokenService
{
    /// <summary>
    /// Generates a compact ERP Access Token
    /// </summary>
    Task<(string Token, string Version, DateTime ExpiresAt)> GenerateTokenAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates and decodes an ERP Access Token
    /// </summary>
    ErpAccessToken ValidateAndDecodeToken(string token);

    /// <summary>
    /// Validates token version against Redis
    /// </summary>
    Task<bool> ValidateTokenVersionAsync(
        Guid userId,
        string clientVersion,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Revokes all tokens for a user
    /// </summary>
    Task RevokeUserTokensAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}

public sealed class ErpTokenService : IErpTokenService
{
    private readonly IConfiguration _configuration;
    private readonly ISecurityService _securityService;
    private readonly ISubdomainLicenseService _licenseService;
    private readonly IUserBranchAccessService _branchAccessService;
    private readonly ICacheService _cacheService;
    private readonly ILogger<ErpTokenService> _logger;

    private string SigningKey => _configuration["ErpToken:SigningKey"];
    private string Issuer => _configuration["ErpToken:Issuer"];
    private int ExpiryMinutes => int.Parse(_configuration["ErpToken:ExpiryMinutes"] ?? "60");

    public ErpTokenService(
        IConfiguration configuration,
        ISecurityService securityService,
        ISubdomainLicenseService licenseService,
        IUserBranchAccessService branchAccessService,
        ICacheService cacheService,
        ILogger<ErpTokenService> logger)
    {
        _configuration = configuration;
        _securityService = securityService;
        _licenseService = licenseService;
        _branchAccessService = branchAccessService;
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<(string Token, string Version, DateTime ExpiresAt)> GenerateTokenAsync(
        CancellationToken cancellationToken = default)
    {
        // Extract from Keycloak token (already validated by AuthorizationMiddleware)
        var userId = _securityService.CurrentUserId;
        var subdomainId = _securityService.CurrentSubdomainId;

        // Get user's accessible branches
        var branches = await _branchAccessService.GetUserBranchesAsync(
            userId,
            cancellationToken);

        // Get subdomain's purchased modules
        var modules = await _licenseService.GetSubdomainModulesAsync(
            subdomainId,
            cancellationToken);

        // Generate version UUID
        var version = Guid.NewGuid().ToString();

        // Build compact token
        var tokenData = new ErpAccessToken
        {
            UserId = userId,
            Version = version,
            Branches = branches,
            Modules = modules
        };

        // Generate JWT
        var token = GenerateJWT(tokenData);

        // Calculate expiry
        var expiresAt = DateTime.UtcNow.AddMinutes(ExpiryMinutes);

        // Store in Redis
        await StoreTokenInRedisAsync(userId, version, subdomainId, expiresAt, cancellationToken);

        _logger.LogInformation(
            "Generated ERP token for user {UserId}, version {Version}, {BranchCount} branches, {ModuleCount} modules",
            userId, version, branches.Count, modules.Count);

        return (token, version, expiresAt);
    }

    private string GenerateJWT(ErpAccessToken tokenData)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim("sub", tokenData.UserId.ToString()),
            new Claim("ver", tokenData.Version),
            new Claim("branches", JsonSerializer.Serialize(tokenData.Branches.Select(b => new
            {
                cid = b.CompanyId,
                cn = b.CompanyName,
                bid = b.BranchId,
                bn = b.BranchName,
                def = b.IsDefault
            }))),
            new Claim("modules", JsonSerializer.Serialize(tokenData.Modules))
        };

        var token = new JwtSecurityToken(
            issuer: Issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(ExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task StoreTokenInRedisAsync(
        Guid userId,
        string version,
        Guid subdomainId,
        DateTime expiresAt,
        CancellationToken cancellationToken)
    {
        var key = $"erp:token:{userId}";

        var data = new
        {
            version,
            subdomain_id = subdomainId,
            created_at = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            expires_at = new DateTimeOffset(expiresAt).ToUnixTimeSeconds()
        };

        var ttl = (int)(expiresAt - DateTime.UtcNow).TotalSeconds;

        await _cacheService.SetValueAsync(
            key,
            data,
            TimeSpan.FromSeconds(ttl),
            cancellationToken);
    }

    public ErpAccessToken ValidateAndDecodeToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey));

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = Issuer,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey,
            ClockSkew = TimeSpan.Zero
        };

        var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

        // Deserialize branches
        var branchesJson = principal.FindFirst("branches")?.Value;
        var branchesData = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(branchesJson);
        var branches = branchesData?.Select(b => new BranchAccess
        {
            CompanyId = Guid.Parse(b["cid"].GetString()),
            CompanyName = b["cn"].GetString(),
            BranchId = Guid.Parse(b["bid"].GetString()),
            BranchName = b["bn"].GetString(),
            IsDefault = b["def"].GetBoolean()
        }).ToList() ?? new List<BranchAccess>();

        return new ErpAccessToken
        {
            UserId = Guid.Parse(principal.FindFirst("sub")?.Value),
            Version = principal.FindFirst("ver")?.Value,
            Branches = branches,
            Modules = JsonSerializer.Deserialize<List<int>>(
                principal.FindFirst("modules")?.Value) ?? new List<int>()
        };
    }

    public async Task<bool> ValidateTokenVersionAsync(
        Guid userId,
        string clientVersion,
        CancellationToken cancellationToken = default)
    {
        var key = $"erp:token:{userId}";

        var data = await _cacheService.GetValue<dynamic>(key);

        if (data == null)
        {
            _logger.LogWarning("Token not found in Redis for user {UserId}", userId);
            return false;
        }

        var redisVersion = data.version?.ToString();
        var isValid = redisVersion == clientVersion;

        if (!isValid)
        {
            _logger.LogWarning(
                "Token version mismatch for user {UserId}. Redis: {RedisVersion}, Client: {ClientVersion}",
                userId, redisVersion, clientVersion);
        }

        return isValid;
    }

    public async Task RevokeUserTokensAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var key = $"erp:token:{userId}";
        await _cacheService.RemoveAsync(key, cancellationToken);

        _logger.LogInformation("Revoked ERP tokens for user {UserId}", userId);
    }
}
```

### 5. ERP Authorization Service

```csharp
// File: Src/Shared/Shared.Web/Security/Services/ErpAuthorizationService.cs

namespace Shared.Web.Security.Services;

public interface IErpAuthorizationService
{
    /// <summary>
    /// Gets the current ERP token from HttpContext
    /// </summary>
    ErpAccessToken GetCurrentToken();

    /// <summary>
    /// Checks if the subdomain has a specific module
    /// </summary>
    bool HasModule(Modules module);

    /// <summary>
    /// Validates that user has access to the specified company/branch
    /// </summary>
    bool HasCompanyBranchAccess(Guid companyId, Guid branchId);

    /// <summary>
    /// Checks if user has permission using Keycloak token
    /// </summary>
    bool HasPermission(string actionId);

    /// <summary>
    /// Gets all accessible branches
    /// </summary>
    List<BranchAccess> GetAccessibleBranches();
}

public sealed class ErpAuthorizationService : IErpAuthorizationService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ISecurityService _securityService;
    private readonly ILogger<ErpAuthorizationService> _logger;

    public ErpAuthorizationService(
        IHttpContextAccessor httpContextAccessor,
        ISecurityService securityService,
        ILogger<ErpAuthorizationService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _securityService = securityService;
        _logger = logger;
    }

    public ErpAccessToken GetCurrentToken()
    {
        var token = _httpContextAccessor.HttpContext?.Items["ErpToken"] as ErpAccessToken;

        if (token == null)
            throw new UnauthorizedAccessException("No ERP access token available");

        return token;
    }

    public bool HasModule(Modules module)
    {
        var token = GetCurrentToken();
        var hasModule = token.Modules.Contains((int)module);

        if (!hasModule)
        {
            _logger.LogWarning(
                "User {UserId} does not have module {Module}",
                token.UserId, module);
        }

        return hasModule;
    }

    public bool HasCompanyBranchAccess(Guid companyId, Guid branchId)
    {
        var token = GetCurrentToken();

        var hasAccess = token.Branches.Any(b =>
            b.CompanyId == companyId && b.BranchId == branchId);

        if (!hasAccess)
        {
            _logger.LogWarning(
                "User {UserId} does not have access to company {CompanyId}, branch {BranchId}",
                token.UserId, companyId, branchId);
        }

        return hasAccess;
    }

    public bool HasPermission(string actionId)
    {
        // Delegate to existing SecurityService which reads from Keycloak token
        return _securityService.AuthorizedToAction(actionId);
    }

    public List<BranchAccess> GetAccessibleBranches()
    {
        var token = GetCurrentToken();
        return token.Branches;
    }
}
```

### 6. Update AuthorizationMiddleware

```csharp
// File: Src/Shared/Shared.Web/Middleware/AuthorizationMiddleware.cs
// UPDATE: Add ERP token extraction and validation

public class AuthorizationMiddleware(
    IAnonymousEndpointsService anonymousEndpointsService,
    ILogger<AuthorizationMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(
        HttpContext context,
        RequestDelegate next)
    {
        var endpoint = context.GetEndpoint();

        // Skip anonymous endpoints
        if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() is not null)
        {
            await next(context);
            return;
        }

        if (anonymousEndpointsService.IsAnonymous(context))
        {
            await next(context);
            return;
        }

        var securityService = context.RequestServices.GetRequiredService<ISecurityService>();
        var revokedTokenService = context.RequestServices.GetRequiredService<IRevokedTokenService>();
        var erpTokenService = context.RequestServices.GetRequiredService<IErpTokenService>();
        var erpAuthService = context.RequestServices.GetRequiredService<IErpAuthorizationService>();

        // Validate Keycloak token (existing logic)
        var tokenId = securityService.TokenId;
        var issuedDate = securityService.IssuedDate;
        var currentUserId = securityService.CurrentUserId;

        Guid.TryParse(securityService.CurrentDeviceId, out var deviceId);

        var isRevoked = await revokedTokenService.IsRevokedAsync(
            tokenId: tokenId,
            userId: currentUserId,
            issuedDate: issuedDate,
            deviceId: deviceId,
            cancellationToken: context.RequestAborted);

        if (isRevoked)
        {
            context.Response.StatusCode = 498;
            await context.Response.WriteAsync("Token Revoked");
            return;
        }

        // ===== NEW: Extract and validate ERP token =====
        var erpToken = context.Request.Headers["X-ERP-Token"].FirstOrDefault();

        if (!string.IsNullOrEmpty(erpToken))
        {
            try
            {
                // Decode ERP token
                var decodedToken = erpTokenService.ValidateAndDecodeToken(erpToken);

                // Store in HttpContext for later use
                context.Items["ErpToken"] = decodedToken;

                // Validate version against Redis
                var clientVersion = context.Request.Headers["X-Token-Version"].FirstOrDefault();

                if (!string.IsNullOrEmpty(clientVersion))
                {
                    var isVersionValid = await erpTokenService.ValidateTokenVersionAsync(
                        decodedToken.UserId,
                        clientVersion,
                        context.RequestAborted);

                    if (!isVersionValid)
                    {
                        // Version mismatch - set refresh header but continue
                        context.Response.Headers["X-Token-Refresh-Required"] = "true";
                        logger.LogWarning(
                            "Token version mismatch for user {UserId}",
                            decodedToken.UserId);
                    }
                }

                // Validate company/branch access from headers
                var companyIdHeader = context.Request.Headers[SecurityConstants.CompanyIdHeaderName].FirstOrDefault();
                var branchIdHeader = context.Request.Headers[SecurityConstants.BranchIdHeaderName].FirstOrDefault();

                if (!string.IsNullOrEmpty(companyIdHeader) && !string.IsNullOrEmpty(branchIdHeader))
                {
                    if (Guid.TryParse(companyIdHeader, out var companyId) &&
                        Guid.TryParse(branchIdHeader, out var branchId))
                    {
                        if (!erpAuthService.HasCompanyBranchAccess(companyId, branchId))
                        {
                            context.Response.StatusCode = StatusCodes.Status403Forbidden;
                            await context.Response.WriteAsync(
                                "Forbidden: You do not have access to the requested company/branch.");
                            return;
                        }
                    }
                }
            }
            catch (SecurityTokenExpiredException)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("ERP token expired");
                return;
            }
            catch (SecurityTokenException ex)
            {
                logger.LogWarning(ex, "Invalid ERP token");
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Invalid ERP token");
                return;
            }
        }
        // ===== END NEW =====

        var internalCall = endpoint?.Metadata?.OfType<InboundCallApiAttribute>().FirstOrDefault();

        if (internalCall is not null)
        {
            await next(context);
            return;
        }

        if (deviceId != Guid.Empty)
        {
            await next(context);
            return;
        }

        // Existing PolicyMapper logic
        var policyAttribute = endpoint?.Metadata?.OfType<PolicyMapperAttribute>().FirstOrDefault();
        var methodAttribute = endpoint?.Metadata?.OfType<PolicyMapperAttribute>()
            .FirstOrDefault(a => a.ActionName != null);

        if (policyAttribute is null)
        {
            await next(context);
            return;
        }

        var actionId = PolicyNameGenerator.GenerateActionTypeId(
            policyAttribute.Service!.Value.ToInt(),
            methodAttribute!.ActionType!.Value.ToInt());

        // Use ErpAuthorizationService (which delegates to SecurityService)
        var hasAccess = erpAuthService.HasPermission(actionId);

        if (!hasAccess)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsync(
                "Forbidden: You do not have permission to access this resource.");
            return;
        }

        await next(context);
    }
}
```

---

## Integration with Existing Authorization

### Using PolicyMapper (No Changes Needed)

```csharp
[PolicyMapper(Service = Services.Sales, ActionType = ActionTypes.Create)]
public async Task<IActionResult> CreateInvoice([FromBody] CreateSalesInvoiceCommand command)
{
    // AuthorizationMiddleware automatically validates:
    // 1. Keycloak token
    // 2. ERP token
    // 3. Version (sets refresh header if needed)
    // 4. Company/branch access
    // 5. PolicyMapper permission

    // Optional: Explicit module check
    if (!_erpAuthService.HasModule(Modules.Sales))
    {
        return Forbid("Sales module not available");
    }

    var result = await _mediator.Send(command);
    return Ok(result);
}
```

---

## Redis Token Versioning

### Storage Structure

```
Key: erp:token:{userId}
Value: {
  "version": "550e8400-e29b-41d4-a716-446655440000",
  "subdomain_id": "subdomain-guid",
  "created_at": 1701349200,
  "expires_at": 1701352800
}
TTL: 3600 seconds
```

**Note**: The actual token JWT is NOT stored in Redis, only the version identifier. This keeps Redis storage minimal.

---

## API Extension Methods

### Extension for AppsPortal and Inventory

```csharp
// File: Src/Shared/Shared.Web/Extensions/ErpTokenControllerExtensions.cs

namespace Shared.Web.Extensions;

public static class ErpTokenControllerExtensions
{
    /// <summary>
    /// Maps ERP token endpoints to the application
    /// </summary>
    public static IEndpointRouteBuilder MapErpTokenEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/erp");

        group.MapPost("/access-token", GenerateAccessToken)
            .WithName("GenerateErpAccessToken")
            .WithOpenApi();

        group.MapPost("/revoke-token", RevokeToken)
            .WithName("RevokeErpAccessToken")
            .WithOpenApi();

        return endpoints;
    }

    private static async Task<IResult> GenerateAccessToken(
        IErpTokenService tokenService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        try
        {
            var (token, version, expiresAt) = await tokenService.GenerateTokenAsync(cancellationToken);

            httpContext.Response.Headers["X-Token-Version"] = version;
            httpContext.Response.Headers["X-Token-Expires-In"] =
                ((int)(expiresAt - DateTime.UtcNow).TotalSeconds).ToString();

            return Results.Ok(new
            {
                erpToken = token,
                tokenVersion = version,
                expiresAt
            });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Failed to generate ERP token",
                detail: ex.Message,
                statusCode: 500);
        }
    }

    private static async Task<IResult> RevokeToken(
        IErpTokenService tokenService,
        ISecurityService securityService,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = securityService.CurrentUserId;
            await tokenService.RevokeUserTokensAsync(userId, cancellationToken);

            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Failed to revoke ERP token",
                detail: ex.Message,
                statusCode: 500);
        }
    }
}
```

### Usage in AppsPortal

```csharp
// File: Src/AppsPortal/Accounting/AppsPortal.Apis/Program.cs

var builder = WebApplication.CreateBuilder(args);

// Existing services
builder.Services.AddSharedWeb(builder.Configuration, builder.Environment);
builder.Services.ConfigureKeycloak(builder.Configuration);

// Add ERP token services
builder.Services.AddErpTokenServices(builder.Configuration);

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AuthorizationMiddleware>(); // Updated middleware

// Map ERP token endpoints using extension
app.MapErpTokenEndpoints();

app.MapControllers();
app.Run();
```

### Usage in Inventory

```csharp
// File: Src/AppsPortal/Inventory/Inventory.Apis/Program.cs

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSharedWeb(builder.Configuration, builder.Environment);
builder.Services.ConfigureKeycloak(builder.Configuration);

// Add ERP token services
builder.Services.AddErpTokenServices(builder.Configuration);

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AuthorizationMiddleware>();

// Map ERP token endpoints using extension
app.MapErpTokenEndpoints();

app.MapControllers();
app.Run();
```

---

## Configuration

### appsettings.json

```json
{
  "ErpToken": {
    "SigningKey": "your-256-bit-secret-key-minimum-32-characters-long-and-secure",
    "Issuer": "https://yourapp.com/erp",
    "ExpiryMinutes": 60
  },
  "Redis": {
    "Configuration": "localhost:6379",
    "InstanceName": "erp:"
  }
}
```

### Service Registration

```csharp
// File: Src/Shared/Shared.Web/DependencyInjection.cs

public static IServiceCollection AddErpTokenServices(
    this IServiceCollection services,
    IConfiguration configuration)
{
    // Register services
    services.AddScoped<IErpTokenService, ErpTokenService>();
    services.AddScoped<IErpAuthorizationService, ErpAuthorizationService>();
    services.AddScoped<ISubdomainLicenseService, SubdomainLicenseService>();
    services.AddScoped<IUserBranchAccessService, UserBranchAccessService>();

    return services;
}
```

---

## Frontend Integration

### Login Flow

```typescript
// 1. Authenticate with Keycloak
const keycloakToken = await keycloak.login(username, password);
localStorage.setItem('keycloak_token', keycloakToken);

// 2. Generate ERP Access Token
const response = await fetch('/api/erp/access-token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${keycloakToken}`
  }
});

const { erpToken, tokenVersion, expiresAt } = await response.json();

// 3. Store tokens
sessionStorage.setItem('erp_token', erpToken);
sessionStorage.setItem('erp_token_version', tokenVersion);
sessionStorage.setItem('erp_token_expires_at', expiresAt);

// 4. Decode token to get branches
const payload = JSON.parse(atob(erpToken.split('.')[1]));
const branches = payload.branches;

// 5. Set default company/branch
const defaultBranch = branches.find(b => b.def === true) || branches[0];
sessionStorage.setItem('current_company_id', defaultBranch.cid);
sessionStorage.setItem('current_branch_id', defaultBranch.bid);
```

### API Request with Token

```typescript
async function apiRequest(url: string, options: RequestInit = {}) {
  const keycloakToken = localStorage.getItem('keycloak_token');
  const erpToken = sessionStorage.getItem('erp_token');
  const erpVersion = sessionStorage.getItem('erp_token_version');
  const companyId = sessionStorage.getItem('current_company_id');
  const branchId = sessionStorage.getItem('current_branch_id');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${keycloakToken}`,
      'X-ERP-Token': erpToken,
      'X-Token-Version': erpVersion,
      'X-Company-Id': companyId,
      'X-Branch-Id': branchId
    }
  });

  // Check if token refresh is required
  if (response.headers.get('X-Token-Refresh-Required') === 'true') {
    await refreshErpToken();
  }

  return response;
}

async function refreshErpToken() {
  const keycloakToken = localStorage.getItem('keycloak_token');

  const response = await fetch('/api/erp/access-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${keycloakToken}`
    }
  });

  const { erpToken, tokenVersion, expiresAt } = await response.json();

  sessionStorage.setItem('erp_token', erpToken);
  sessionStorage.setItem('erp_token_version', tokenVersion);
  sessionStorage.setItem('erp_token_expires_at', expiresAt);
}
```

---

## File Structure

```
Src/
├── Shared/
│   ├── Shared.Core/
│   │   └── Models/
│   │       └── ErpToken/
│   │           ├── ErpAccessToken.cs
│   │           └── BranchAccess.cs
│   │
│   ├── Shared.Application/
│   │   └── Services/
│   │       ├── ISubdomainLicenseService.cs
│   │       ├── SubdomainLicenseService.cs
│   │       ├── IUserBranchAccessService.cs
│   │       └── UserBranchAccessService.cs
│   │
│   └── Shared.Web/
│       ├── Extensions/
│       │   └── ErpTokenControllerExtensions.cs
│       ├── Middleware/
│       │   └── AuthorizationMiddleware.cs (UPDATED)
│       ├── Security/
│       │   └── Services/
│       │       ├── IErpTokenService.cs
│       │       ├── ErpTokenService.cs
│       │       ├── IErpAuthorizationService.cs
│       │       └── ErpAuthorizationService.cs
│       └── DependencyInjection.cs (UPDATED)
│
├── AppsPortal/
│   ├── Accounting/
│   │   └── AppsPortal.Apis/
│   │       └── Program.cs (UPDATED)
│   │
│   └── Inventory/
│       └── Inventory.Apis/
│           └── Program.cs (UPDATED)
```

---

## Summary of Changes

### ✅ **Token Simplification**

- **Removed**: All Keycloak-related claims (already in Keycloak JWT)
- **Removed**: `jti`, `iat`, `exp`, `auth_time` (managed by JWT library)
- **Removed**: License details (counts, prices)
- **Removed**: Features/limits per module
- **Removed**: `user_license` (read from Keycloak token)

### ✅ **Compact Payload**

Token now contains only:
- `sub`: User ID
- `ver`: Version UUID
- `branches`: Array of company/branch combinations (with names and default flag)
- `modules`: Array of module IDs

**Result**: ~400-800 bytes depending on branch count

### ✅ **No Separate Middleware**

- **Removed**: `ErpTokenMiddleware`
- **Updated**: `AuthorizationMiddleware` now handles ERP token validation directly

### ✅ **Extension Method for Endpoints**

- **Added**: `MapErpTokenEndpoints()` extension method
- **Usage**: Can be used in both AppsPortal and Inventory
- **Removes**: Need for separate controller classes

### ✅ **Redis Storage**

Stores only version metadata (not the full token):
```json
{
  "version": "uuid",
  "subdomain_id": "guid",
  "created_at": timestamp,
  "expires_at": timestamp
}
```

---

## Benefits

1. ✅ **Minimal token size** (~400-800 bytes)
2. ✅ **No duplicate data** (Keycloak claims stay in Keycloak token)
3. ✅ **Simple integration** (extension method for endpoints)
4. ✅ **Lightweight Redis storage** (only version metadata)
5. ✅ **Clean architecture** (single updated middleware)
6. ✅ **Reusable** (works for AppsPortal and Inventory)