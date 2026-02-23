# Authorization Token Design - Company, Branch & Module Access

## Executive Summary

This document outlines the design for introducing a **second authorization token** (separate from the authentication token) to handle:
- **Company & Branch Access Control**
- **Module Subscription & Feature Entitlements**
- **License Validation**

The second token will be called an **Access Context Token** and will replace/supplement the current `CurrentUserInfo` endpoint.

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Problems with Current Approach](#problems-with-current-approach)
3. [Proposed Solution: Access Context Token](#proposed-solution-access-context-token)
4. [Token Structure](#token-structure)
5. [Implementation Strategy](#implementation-strategy)
6. [Keycloak Configuration Changes](#keycloak-configuration-changes)
7. [API Changes](#api-changes)
8. [Migration Path](#migration-path)

---

## Current Architecture Analysis

### Current Authentication Token (JWT)

**Token Source**: Keycloak realm (tenant-specific)

**Current Claims** (from `ClaimNames.cs`):
```csharp
{
  "sub": "keycloak-user-id",              // Keycloak SSO ID
  "tenant": "tenant-guid",                // Tenant ID
  "email": "user@example.com",
  "name": "John Doe",
  "fullname": "John Doe",
  "phone_number": "+966xxxxxxxxx",
  "client_id": "angular-client",
  "subdomain": "tenant1",
  "subdomainid": "subdomain-guid",
  "companyid": "company-guid",            // ⚠️ Single company only
  "branchId": "branch-guid",              // ⚠️ Single branch only
  "company_branches": "{\"default\":{\"companyId\":\"...\",\"branchId\":\"...\"}}",  // ⚠️ JSON in claim
  "jti": "token-id",
  "deviceId": "device-guid",
  "erp_policies": "action1,action2,...",  // ⚠️ Flat list, no context
  "user_license": "Advanced",             // User license level
  "erp_id": "erp-user-guid"              // ERP database User.Id
}
```

### Current `CurrentUserInfo` Endpoint

**Endpoint**: `GET /api/CurrentUserInfo?companyId={id}&branchId={id}`

**Response** (`CurrentUserInfoDto`):
```json
{
  "companies": [
    {
      "id": "company-guid",
      "name": "Company Name",
      "nameAr": "اسم الشركة",
      "companyType": "Holding",
      "isDefault": true,
      "branches": [
        {
          "id": "branch-guid",
          "name": "Branch Name",
          "nameAr": "اسم الفرع",
          "isDefault": true
        }
      ]
    }
  ],
  "token": "original-jwt-token",
  "userPreferences": {
    "userId": "user-guid",
    "userName": "John Doe",
    "userPreferenceBranchId": "branch-guid",
    "branchName": "Main Branch",
    "treasuryId": 1,
    "treasuryName": "Main Treasury",
    "warehouseId": 1,
    "warehouseName": "Main Warehouse",
    "bankId": 1,
    "bankName": "Bank Account",
    "language": { "1": "English" }
  }
}
```

**Current Flow**:
1. User authenticates → Gets JWT with basic company/branch
2. Frontend calls `CurrentUserInfo` → Gets full company/branch list
3. User selects company/branch → Frontend includes in API calls
4. Backend validates access via `UserCompany` and `UserBranch` tables

---

## Problems with Current Approach

### 1. **Multiple Round Trips**
- Initial authentication
- Separate call to `CurrentUserInfo`
- Additional calls when switching company/branch

### 2. **Token Contains Limited Context**
- Only ONE company/branch in main token claims
- JSON embedded in `company_branches` claim (poor practice)
- No module/feature information in token

### 3. **Database Dependency for Authorization**
- Every request queries `UserCompany`, `UserBranch`, `UserFullAccess` tables
- Performance overhead
- No offline capability

### 4. **No Module Subscription Information**
- Module access checked via database queries
- No visibility into purchased modules in token
- Feature limits not accessible without DB query

### 5. **Inflexible Permission Structure**
- Flat `erp_policies` claim with comma-separated action IDs
- No company/branch/module context
- Difficult to implement "access X in company A but not B"

### 6. **Poor Naming**
- `CurrentUserInfo` is vague
- Mixes authentication, authorization, and user preferences

---

## Proposed Solution: Access Context Token

### Concept

Introduce a **second token** that represents the **user's current working context**:
- Selected Company
- Selected Branch
- Available Modules in that company
- Permissions scoped to company/branch
- Feature limits and entitlements

### Token Type: Custom JWT

**Issuer**: Your application (not Keycloak)
**Lifetime**: Short-lived (15-60 minutes)
**Refresh**: Via refresh endpoint when switching context or expiring

---

## Token Structure

### Recommended Name: `AccessContextToken`

**Why this name?**
- **Access**: Relates to authorization (what you can access)
- **Context**: Represents the current working context (company/branch/module)
- **Token**: Clear that it's a security token

**Alternative Names**:
- `WorkspaceToken` (if you think of company+branch as workspace)
- `ScopeToken` (represents authorization scope)
- `EntitlementToken` (emphasizes what user is entitled to)

### Token Claims Structure

```json
{
  "iss": "https://yourapp.com",
  "sub": "erp-user-guid",                    // ERP User.Id
  "sso_id": "keycloak-user-id",              // Keycloak SSO ID
  "tenant_id": "tenant-guid",
  "subdomain": "tenant1",

  "jti": "context-token-id",
  "iat": 1638360000,
  "exp": 1638363600,                         // 1 hour expiry

  "context": {
    "company_id": "company-guid",
    "company_name": "Acme Corp",
    "company_name_ar": "شركة أكمي",
    "company_type": "Holding",

    "branch_id": "branch-guid",
    "branch_name": "Riyadh Branch",
    "branch_name_ar": "فرع الرياض",
    "is_default_branch": true
  },

  "entitlements": {
    "user_license": "Advanced",              // Basic, Contributor, Advanced, BusinessOwner
    "is_owner": false,

    "modules": [                             // Purchased modules for this company
      {
        "id": 1,
        "name": "Accounting",
        "features": [
          {
            "id": 1,
            "name": "LimitAccounts",
            "limit": 1000,                   // Max accounts allowed
            "current": 245                   // Current usage (optional)
          },
          {
            "id": 2,
            "name": "LimitCostCenter",
            "limit": 50,
            "current": 12
          }
        ]
      },
      {
        "id": 5,
        "name": "Sales",
        "features": [
          {
            "id": 7,
            "name": "SalesLimitInvoices",
            "limit": 5000,
            "current": 1234
          },
          {
            "id": 8,
            "name": "LimitCustomers",
            "limit": 500,
            "current": 89
          }
        ]
      },
      {
        "id": 6,
        "name": "Purchase",
        "features": [
          {
            "id": 9,
            "name": "PurchaseLimitInvoices",
            "limit": 3000,
            "current": 567
          },
          {
            "id": 10,
            "name": "LimitVendor",
            "limit": 300,
            "current": 45
          }
        ]
      },
      {
        "id": 7,
        "name": "Inventory",
        "features": [
          {
            "id": 11,
            "name": "LimitItems",
            "limit": 10000,
            "current": 2345
          },
          {
            "id": 12,
            "name": "LimitWarehouse",
            "limit": 10,
            "current": 3
          }
        ]
      }
    ],

    "permissions": [                         // Scoped to this company/branch
      "accounting.accounts.view",
      "accounting.accounts.create",
      "accounting.accounts.edit",
      "sales.invoices.view",
      "sales.invoices.create",
      "sales.customers.view"
    ]
  },

  "preferences": {
    "treasury_id": 1,
    "treasury_name": "Main Treasury",
    "warehouse_id": 1,
    "warehouse_name": "Main Warehouse",
    "bank_id": 1,
    "bank_name": "Al Rajhi Bank",
    "language": "en"
  },

  "available_contexts": [                    // Quick reference for context switching
    {
      "company_id": "company-guid-1",
      "company_name": "Acme Corp",
      "company_type": "Holding",
      "branches": [
        {
          "branch_id": "branch-guid-1",
          "branch_name": "Riyadh Branch",
          "is_default": true
        },
        {
          "branch_id": "branch-guid-2",
          "branch_name": "Jeddah Branch",
          "is_default": false
        }
      ]
    },
    {
      "company_id": "company-guid-2",
      "company_name": "Subsidiary Inc",
      "company_type": "Subsidiary",
      "branches": [
        {
          "branch_id": "branch-guid-3",
          "branch_name": "Main Office",
          "is_default": true
        }
      ]
    }
  ]
}
```

### Compact Version (for smaller payload)

If token size is a concern, use compact format with lookup tables:

```json
{
  "iss": "https://yourapp.com",
  "sub": "erp-user-guid",
  "sso_id": "keycloak-user-id",
  "tenant_id": "tenant-guid",

  "ctx": {
    "cid": "company-guid",                   // company_id
    "bid": "branch-guid"                     // branch_id
  },

  "ent": {
    "lic": "Advanced",                       // user_license
    "own": false,                            // is_owner
    "mod": [1, 5, 6, 7],                     // module IDs
    "feat": {                                // features by module
      "1": [{"id": 1, "lim": 1000}, {"id": 2, "lim": 50}],
      "5": [{"id": 7, "lim": 5000}, {"id": 8, "lim": 500}],
      "6": [{"id": 9, "lim": 3000}, {"id": 10, "lim": 300}],
      "7": [{"id": 11, "lim": 10000}, {"id": 12, "lim": 10}]
    },
    "perm": [                                // permission IDs (reference to DB)
      "acc.acc.v", "acc.acc.c", "acc.acc.e",
      "sal.inv.v", "sal.inv.c", "sal.cus.v"
    ]
  }
}
```

**Recommendation**: Use verbose version. Token size is acceptable with modern compression.

---

## Implementation Strategy

### Phase 1: Data Model Changes

#### 1.1 Add `CompanyModule` Entity

Track which modules are purchased per company:

```csharp
// File: Src/AppsPortal/Accounting/AppsPortal.Domain/Entities/CompanyModules/CompanyModule.cs

namespace AppsPortal.Domain.Entities.CompanyModules;

public class CompanyModule : FullAuditedEntityBase<Guid>
{
    public Guid CompanyId { get; private set; }
    public Modules Module { get; private set; }
    public DateTime PurchaseDate { get; private set; }
    public DateTime? ExpiryDate { get; private set; }
    public bool IsActive { get; private set; }

    // Navigation
    public Company Company { get; private set; }
    public ICollection<CompanyModuleFeature> Features { get; private set; }

    // Factory method
    public static CompanyModule Create(
        Guid companyId,
        Modules module,
        DateTime purchaseDate,
        DateTime? expiryDate = null)
    {
        return new CompanyModule
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            Module = module,
            PurchaseDate = purchaseDate,
            ExpiryDate = expiryDate,
            IsActive = true
        };
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;
}
```

#### 1.2 Add `CompanyModuleFeature` Entity

Track feature limits per module:

```csharp
// File: Src/AppsPortal/Accounting/AppsPortal.Domain/Entities/CompanyModules/CompanyModuleFeature.cs

namespace AppsPortal.Domain.Entities.CompanyModules;

public class CompanyModuleFeature : FullAuditedEntityBase<Guid>
{
    public Guid CompanyModuleId { get; private set; }
    public SystemFeature Feature { get; private set; }
    public int LimitValue { get; private set; }

    // Navigation
    public CompanyModule CompanyModule { get; private set; }

    // Factory method
    public static CompanyModuleFeature Create(
        Guid companyModuleId,
        SystemFeature feature,
        int limitValue)
    {
        return new CompanyModuleFeature
        {
            Id = Guid.NewGuid(),
            CompanyModuleId = companyModuleId,
            Feature = feature,
            LimitValue = limitValue
        };
    }

    public void UpdateLimit(int newLimit)
    {
        if (newLimit < 0)
            throw new ArgumentException("Limit cannot be negative");

        LimitValue = newLimit;
    }
}
```

#### 1.3 Update Company Configuration

```csharp
// File: Src/AppsPortal/Accounting/AppsPortal.Persistence/Configurations/CompanyModuleConfiguration.cs

public class CompanyModuleConfiguration : IEntityTypeConfiguration<CompanyModule>
{
    public void Configure(EntityTypeBuilder<CompanyModule> builder)
    {
        builder.ToTable("CompanyModules", "General");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CompanyId).IsRequired();
        builder.Property(x => x.Module).IsRequired();
        builder.Property(x => x.PurchaseDate).IsRequired();
        builder.Property(x => x.IsActive).IsRequired();

        builder.HasOne(x => x.Company)
            .WithMany()
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Features)
            .WithOne(x => x.CompanyModule)
            .HasForeignKey(x => x.CompanyModuleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.CompanyId, x.Module })
            .IsUnique()
            .HasDatabaseName("IX_CompanyModules_CompanyId_Module");
    }
}

public class CompanyModuleFeatureConfiguration : IEntityTypeConfiguration<CompanyModuleFeature>
{
    public void Configure(EntityTypeBuilder<CompanyModuleFeature> builder)
    {
        builder.ToTable("CompanyModuleFeatures", "General");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CompanyModuleId).IsRequired();
        builder.Property(x => x.Feature).IsRequired();
        builder.Property(x => x.LimitValue).IsRequired();

        builder.HasIndex(x => new { x.CompanyModuleId, x.Feature })
            .IsUnique()
            .HasDatabaseName("IX_CompanyModuleFeatures_CompanyModuleId_Feature");
    }
}
```

### Phase 2: Token Service Implementation

#### 2.1 Create Token DTOs

```csharp
// File: Src/Shared/Shared.Core/Models/AccessContext/AccessContextToken.cs

namespace Shared.Core.Models.AccessContext;

public sealed class AccessContextToken
{
    public string Issuer { get; set; }
    public Guid UserId { get; set; }              // ERP User.Id
    public string SSOId { get; set; }             // Keycloak ID
    public Guid TenantId { get; set; }
    public string Subdomain { get; set; }
    public Guid TokenId { get; set; }
    public DateTime IssuedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public ContextInfo Context { get; set; }
    public EntitlementsInfo Entitlements { get; set; }
    public PreferencesInfo Preferences { get; set; }
    public List<AvailableContext> AvailableContexts { get; set; }
}

public sealed class ContextInfo
{
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; }
    public string CompanyNameAr { get; set; }
    public CompanyTypes CompanyType { get; set; }

    public Guid BranchId { get; set; }
    public string BranchName { get; set; }
    public string BranchNameAr { get; set; }
    public bool IsDefaultBranch { get; set; }
}

public sealed class EntitlementsInfo
{
    public string UserLicense { get; set; }       // "Advanced"
    public bool IsOwner { get; set; }

    public List<ModuleEntitlement> Modules { get; set; }
    public List<string> Permissions { get; set; }
}

public sealed class ModuleEntitlement
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<FeatureLimit> Features { get; set; }
}

public sealed class FeatureLimit
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Limit { get; set; }
    public int? Current { get; set; }             // Optional usage tracking
}

public sealed class PreferencesInfo
{
    public int? TreasuryId { get; set; }
    public string TreasuryName { get; set; }
    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public int? BankId { get; set; }
    public string BankName { get; set; }
    public string Language { get; set; }          // "en" or "ar"
}

public sealed class AvailableContext
{
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; }
    public CompanyTypes CompanyType { get; set; }
    public List<AvailableBranch> Branches { get; set; }
}

public sealed class AvailableBranch
{
    public Guid BranchId { get; set; }
    public string BranchName { get; set; }
    public bool IsDefault { get; set; }
}
```

#### 2.2 Create Token Generator Service

```csharp
// File: Src/Shared/Shared.Web/Security/Services/AccessContextTokenService.cs

namespace Shared.Web.Security.Services;

public interface IAccessContextTokenService
{
    /// <summary>
    /// Generates an Access Context Token for the specified user, company, and branch
    /// </summary>
    Task<string> GenerateTokenAsync(
        Guid userId,
        Guid companyId,
        Guid branchId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates and decodes an Access Context Token
    /// </summary>
    AccessContextToken ValidateAndDecodeToken(string token);

    /// <summary>
    /// Refreshes an existing token (used when switching company/branch)
    /// </summary>
    Task<string> RefreshTokenAsync(
        string currentToken,
        Guid newCompanyId,
        Guid newBranchId,
        CancellationToken cancellationToken = default);
}

public sealed class AccessContextTokenService : IAccessContextTokenService
{
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly ICompanyModuleRepository _companyModuleRepository;
    private readonly IUserPreferenceRepository _userPreferenceRepository;
    private readonly IUserFullAccessRepository _userFullAccessRepository;
    private readonly ISecurityService _securityService;

    private string SigningKey => _configuration["AccessContextToken:SigningKey"];
    private string Issuer => _configuration["AccessContextToken:Issuer"];
    private int ExpiryMinutes => int.Parse(_configuration["AccessContextToken:ExpiryMinutes"] ?? "60");

    public async Task<string> GenerateTokenAsync(
        Guid userId,
        Guid companyId,
        Guid branchId,
        CancellationToken cancellationToken = default)
    {
        // 1. Validate user access to company/branch
        var hasAccess = await ValidateUserAccessAsync(userId, companyId, branchId, cancellationToken);
        if (!hasAccess)
            throw new UnauthorizedAccessException("User does not have access to specified company/branch");

        // 2. Build token data
        var tokenData = await BuildTokenDataAsync(userId, companyId, branchId, cancellationToken);

        // 3. Generate JWT
        var token = GenerateJWT(tokenData);

        return token;
    }

    private async Task<AccessContextToken> BuildTokenDataAsync(
        Guid userId,
        Guid companyId,
        Guid branchId,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        var company = await _companyRepository.GetByIdAsync(companyId, cancellationToken);
        var branch = await _branchRepository.GetByIdAsync(branchId, cancellationToken);

        // Get user's companies and branches
        var availableContexts = await GetAvailableContextsAsync(userId, cancellationToken);

        // Get modules purchased for this company
        var modules = await GetCompanyModulesAsync(companyId, cancellationToken);

        // Get user permissions
        var permissions = await GetUserPermissionsAsync(userId, companyId, branchId, cancellationToken);

        // Get user preferences
        var preferences = await GetUserPreferencesAsync(userId, branchId, cancellationToken);

        return new AccessContextToken
        {
            Issuer = Issuer,
            UserId = userId,
            SSOId = user.SSOId,
            TenantId = _securityService.CurrentTenantId,
            Subdomain = _securityService.CurrentSubdomainName,
            TokenId = Guid.NewGuid(),
            IssuedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(ExpiryMinutes),

            Context = new ContextInfo
            {
                CompanyId = companyId,
                CompanyName = company.Name,
                CompanyNameAr = company.NameAr,
                CompanyType = company.CompanyType,
                BranchId = branchId,
                BranchName = branch.Name,
                BranchNameAr = branch.NameAr,
                IsDefaultBranch = branch.IsDefault
            },

            Entitlements = new EntitlementsInfo
            {
                UserLicense = user.UserLicense.ToString(),
                IsOwner = user.UserLicense == Licenses.BusinessOwner,
                Modules = modules,
                Permissions = permissions
            },

            Preferences = preferences,
            AvailableContexts = availableContexts
        };
    }

    private string GenerateJWT(AccessContextToken tokenData)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim("iss", tokenData.Issuer),
            new Claim("sub", tokenData.UserId.ToString()),
            new Claim("sso_id", tokenData.SSOId),
            new Claim("tenant_id", tokenData.TenantId.ToString()),
            new Claim("subdomain", tokenData.Subdomain),
            new Claim("jti", tokenData.TokenId.ToString()),
            new Claim("iat", new DateTimeOffset(tokenData.IssuedAt).ToUnixTimeSeconds().ToString()),

            // Context
            new Claim("context", JsonSerializer.Serialize(tokenData.Context)),

            // Entitlements
            new Claim("entitlements", JsonSerializer.Serialize(tokenData.Entitlements)),

            // Preferences
            new Claim("preferences", JsonSerializer.Serialize(tokenData.Preferences)),

            // Available Contexts
            new Claim("available_contexts", JsonSerializer.Serialize(tokenData.AvailableContexts))
        };

        var token = new JwtSecurityToken(
            issuer: tokenData.Issuer,
            claims: claims,
            expires: tokenData.ExpiresAt,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public AccessContextToken ValidateAndDecodeToken(string token)
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

        var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

        // Extract claims
        var context = JsonSerializer.Deserialize<ContextInfo>(
            principal.FindFirst("context")?.Value);
        var entitlements = JsonSerializer.Deserialize<EntitlementsInfo>(
            principal.FindFirst("entitlements")?.Value);
        var preferences = JsonSerializer.Deserialize<PreferencesInfo>(
            principal.FindFirst("preferences")?.Value);
        var availableContexts = JsonSerializer.Deserialize<List<AvailableContext>>(
            principal.FindFirst("available_contexts")?.Value);

        return new AccessContextToken
        {
            Issuer = principal.FindFirst("iss")?.Value,
            UserId = Guid.Parse(principal.FindFirst("sub")?.Value),
            SSOId = principal.FindFirst("sso_id")?.Value,
            TenantId = Guid.Parse(principal.FindFirst("tenant_id")?.Value),
            Subdomain = principal.FindFirst("subdomain")?.Value,
            TokenId = Guid.Parse(principal.FindFirst("jti")?.Value),
            IssuedAt = DateTimeOffset.FromUnixTimeSeconds(
                long.Parse(principal.FindFirst("iat")?.Value)).DateTime,
            ExpiresAt = validatedToken.ValidTo,

            Context = context,
            Entitlements = entitlements,
            Preferences = preferences,
            AvailableContexts = availableContexts
        };
    }

    // Helper methods

    private async Task<bool> ValidateUserAccessAsync(
        Guid userId,
        Guid companyId,
        Guid branchId,
        CancellationToken cancellationToken)
    {
        var hasCompanyAccess = await _userRepository.GetQueryable()
            .AnyAsync(u => u.Id == userId &&
                          u.UserCompanies.Any(uc => uc.CompanyId == companyId),
                     cancellationToken);

        if (!hasCompanyAccess)
            return false;

        var hasBranchAccess = await _userRepository.GetQueryable()
            .AnyAsync(u => u.Id == userId &&
                          u.UserBranches.Any(ub => ub.BranchId == branchId),
                     cancellationToken);

        return hasBranchAccess;
    }

    private async Task<List<AvailableContext>> GetAvailableContextsAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var userCompanies = await _userRepository.GetQueryable()
            .Where(u => u.Id == userId)
            .SelectMany(u => u.UserCompanies)
            .Select(uc => new
            {
                CompanyId = uc.CompanyId,
                CompanyName = uc.Company.Name,
                CompanyType = uc.Company.CompanyType,
                Branches = uc.Company.Branches
                    .Where(b => u.UserBranches.Any(ub => ub.BranchId == b.Id))
                    .Select(b => new AvailableBranch
                    {
                        BranchId = b.Id,
                        BranchName = b.Name,
                        IsDefault = b.IsDefault
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return userCompanies
            .Select(c => new AvailableContext
            {
                CompanyId = c.CompanyId,
                CompanyName = c.CompanyName,
                CompanyType = c.CompanyType,
                Branches = c.Branches
            })
            .ToList();
    }

    private async Task<List<ModuleEntitlement>> GetCompanyModulesAsync(
        Guid companyId,
        CancellationToken cancellationToken)
    {
        var modules = await _companyModuleRepository.GetQueryable()
            .Where(cm => cm.CompanyId == companyId && cm.IsActive)
            .Include(cm => cm.Features)
            .Select(cm => new ModuleEntitlement
            {
                Id = (int)cm.Module,
                Name = cm.Module.ToString(),
                Features = cm.Features.Select(f => new FeatureLimit
                {
                    Id = (int)f.Feature,
                    Name = f.Feature.ToString(),
                    Limit = f.LimitValue,
                    Current = null  // Optionally query usage
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return modules;
    }

    private async Task<List<string>> GetUserPermissionsAsync(
        Guid userId,
        Guid companyId,
        Guid branchId,
        CancellationToken cancellationToken)
    {
        // Check if user is business owner
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user.UserLicense == Licenses.BusinessOwner)
        {
            // Full access - return all permissions
            return new List<string> { "*" };
        }

        // Get user's specific permissions
        var permissions = await _userFullAccessRepository.GetQueryable()
            .Where(ufa => ufa.UserId == userId)
            .Select(ufa => ufa.ActionId)
            .ToListAsync(cancellationToken);

        return permissions;
    }

    private async Task<PreferencesInfo> GetUserPreferencesAsync(
        Guid userId,
        Guid branchId,
        CancellationToken cancellationToken)
    {
        var preference = await _userPreferenceRepository.GetQueryable()
            .Where(up => up.UserId == userId && up.BranchId == branchId)
            .Select(up => new PreferencesInfo
            {
                TreasuryId = up.TreasuryId,
                TreasuryName = up.Treasury.Name,
                WarehouseId = up.WarehouseId,
                WarehouseName = up.Warehouse.Name,
                BankId = up.BankId,
                BankName = up.Bank.Name,
                Language = up.Language  // Assuming stored as "en" or "ar"
            })
            .FirstOrDefaultAsync(cancellationToken);

        return preference ?? new PreferencesInfo { Language = "en" };
    }
}
```

### Phase 3: API Endpoints

#### 3.1 Create Access Context Controller

```csharp
// File: Src/AppsPortal/Accounting/AppsPortal.Apis/Controllers/Auth/AccessContextController.cs

namespace AppsPortal.Apis.Controllers.Auth;

[Route("api/[controller]")]
[ApiController]
public class AccessContextController : ControllerBase
{
    private readonly IAccessContextTokenService _tokenService;
    private readonly ISecurityService _securityService;

    public AccessContextController(
        IAccessContextTokenService tokenService,
        ISecurityService securityService)
    {
        _tokenService = tokenService;
        _securityService = securityService;
    }

    /// <summary>
    /// Generates an Access Context Token for the authenticated user
    /// </summary>
    /// <param name="request">Company and branch selection</param>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(AccessContextResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GenerateAccessContext(
        [FromBody] GenerateAccessContextRequest request,
        CancellationToken cancellationToken)
    {
        var userId = _securityService.CurrentUserId;

        var token = await _tokenService.GenerateTokenAsync(
            userId,
            request.CompanyId,
            request.BranchId,
            cancellationToken);

        var decodedToken = _tokenService.ValidateAndDecodeToken(token);

        return Ok(new AccessContextResponse
        {
            Token = token,
            ExpiresAt = decodedToken.ExpiresAt,
            Context = decodedToken.Context,
            Entitlements = decodedToken.Entitlements,
            Preferences = decodedToken.Preferences,
            AvailableContexts = decodedToken.AvailableContexts
        });
    }

    /// <summary>
    /// Switches to a different company/branch context
    /// </summary>
    [HttpPost("switch")]
    [ProducesResponseType(typeof(AccessContextResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> SwitchContext(
        [FromBody] SwitchContextRequest request,
        CancellationToken cancellationToken)
    {
        var currentToken = Request.Headers["X-Access-Context"].FirstOrDefault();

        if (string.IsNullOrEmpty(currentToken))
            return BadRequest("Access context token not provided");

        var newToken = await _tokenService.RefreshTokenAsync(
            currentToken,
            request.CompanyId,
            request.BranchId,
            cancellationToken);

        var decodedToken = _tokenService.ValidateAndDecodeToken(newToken);

        return Ok(new AccessContextResponse
        {
            Token = newToken,
            ExpiresAt = decodedToken.ExpiresAt,
            Context = decodedToken.Context,
            Entitlements = decodedToken.Entitlements,
            Preferences = decodedToken.Preferences,
            AvailableContexts = decodedToken.AvailableContexts
        });
    }

    /// <summary>
    /// Validates the current Access Context Token
    /// </summary>
    [HttpGet("validate")]
    [ProducesResponseType(typeof(AccessContextToken), StatusCodes.Status200OK)]
    public IActionResult ValidateContext()
    {
        var token = Request.Headers["X-Access-Context"].FirstOrDefault();

        if (string.IsNullOrEmpty(token))
            return BadRequest("Access context token not provided");

        try
        {
            var decodedToken = _tokenService.ValidateAndDecodeToken(token);
            return Ok(decodedToken);
        }
        catch (SecurityTokenException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}

// Request/Response DTOs

public class GenerateAccessContextRequest
{
    public Guid CompanyId { get; set; }
    public Guid BranchId { get; set; }
}

public class SwitchContextRequest
{
    public Guid CompanyId { get; set; }
    public Guid BranchId { get; set; }
}

public class AccessContextResponse
{
    public string Token { get; set; }
    public DateTime ExpiresAt { get; set; }
    public ContextInfo Context { get; set; }
    public EntitlementsInfo Entitlements { get; set; }
    public PreferencesInfo Preferences { get; set; }
    public List<AvailableContext> AvailableContexts { get; set; }
}
```

### Phase 4: Middleware & Authorization

#### 4.1 Access Context Middleware

```csharp
// File: Src/Shared/Shared.Web/Middleware/AccessContextMiddleware.cs

namespace Shared.Web.Middleware;

public class AccessContextMiddleware
{
    private readonly RequestDelegate _next;

    public AccessContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context,
        IAccessContextTokenService tokenService)
    {
        var accessToken = context.Request.Headers["X-Access-Context"].FirstOrDefault();

        if (!string.IsNullOrEmpty(accessToken))
        {
            try
            {
                var decodedToken = tokenService.ValidateAndDecodeToken(accessToken);

                // Store in HttpContext for later use
                context.Items["AccessContext"] = decodedToken;
            }
            catch (SecurityTokenException)
            {
                // Invalid or expired token - let request continue
                // Authorization will fail if endpoint requires it
            }
        }

        await _next(context);
    }
}

// Extension method
public static class AccessContextMiddlewareExtensions
{
    public static IApplicationBuilder UseAccessContext(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AccessContextMiddleware>();
    }
}
```

#### 4.2 Access Context Service (for consuming the token)

```csharp
// File: Src/Shared/Shared.Web/Security/Services/IAccessContextService.cs

namespace Shared.Web.Security.Services;

public interface IAccessContextService
{
    AccessContextToken GetCurrentContext();
    Guid CurrentCompanyId { get; }
    Guid CurrentBranchId { get; }
    bool HasModule(Modules module);
    bool HasFeature(SystemFeature feature, out int limit);
    bool HasPermission(string permission);
    bool IsOwner { get; }
}

public sealed class AccessContextService : IAccessContextService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AccessContextService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public AccessContextToken GetCurrentContext()
    {
        var context = _httpContextAccessor.HttpContext?.Items["AccessContext"] as AccessContextToken;

        if (context == null)
            throw new UnauthorizedAccessException("No access context available");

        return context;
    }

    public Guid CurrentCompanyId => GetCurrentContext().Context.CompanyId;

    public Guid CurrentBranchId => GetCurrentContext().Context.BranchId;

    public bool HasModule(Modules module)
    {
        var context = GetCurrentContext();
        return context.Entitlements.Modules.Any(m => m.Id == (int)module);
    }

    public bool HasFeature(SystemFeature feature, out int limit)
    {
        var context = GetCurrentContext();

        var featureLimit = context.Entitlements.Modules
            .SelectMany(m => m.Features)
            .FirstOrDefault(f => f.Id == (int)feature);

        if (featureLimit != null)
        {
            limit = featureLimit.Limit;
            return true;
        }

        limit = 0;
        return false;
    }

    public bool HasPermission(string permission)
    {
        var context = GetCurrentContext();

        if (context.Entitlements.IsOwner)
            return true;

        return context.Entitlements.Permissions.Contains("*") ||
               context.Entitlements.Permissions.Contains(permission);
    }

    public bool IsOwner => GetCurrentContext().Entitlements.IsOwner;
}
```

#### 4.3 Authorization Attributes

```csharp
// File: Src/Shared/Shared.Web/Authorization/RequireModuleAttribute.cs

namespace Shared.Web.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireModuleAttribute : Attribute, IAuthorizationFilter
{
    private readonly Modules _requiredModule;

    public RequireModuleAttribute(Modules requiredModule)
    {
        _requiredModule = requiredModule;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var accessContextService = context.HttpContext.RequestServices
            .GetRequiredService<IAccessContextService>();

        try
        {
            if (!accessContextService.HasModule(_requiredModule))
            {
                context.Result = new ForbidResult();
            }
        }
        catch (UnauthorizedAccessException)
        {
            context.Result = new UnauthorizedResult();
        }
    }
}

// Usage:
// [RequireModule(Modules.Sales)]
// public class SalesInvoiceController : ControllerBase { ... }
```

```csharp
// File: Src/Shared/Shared.Web/Authorization/RequireFeatureAttribute.cs

namespace Shared.Web.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireFeatureAttribute : Attribute, IAuthorizationFilter
{
    private readonly SystemFeature _requiredFeature;

    public RequireFeatureAttribute(SystemFeature requiredFeature)
    {
        _requiredFeature = requiredFeature;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var accessContextService = context.HttpContext.RequestServices
            .GetRequiredService<IAccessContextService>();

        try
        {
            if (!accessContextService.HasFeature(_requiredFeature, out _))
            {
                context.Result = new ForbidResult();
            }
        }
        catch (UnauthorizedAccessException)
        {
            context.Result = new UnauthorizedResult();
        }
    }
}

// Usage:
// [RequireFeature(SystemFeature.LimitCustomers)]
// public async Task<IActionResult> CreateCustomer(...) { ... }
```

### Phase 5: Tenant Provisioning Integration

#### 5.1 Add Step to Create Default Modules

```csharp
// File: Src/BusinessOwners/BusinessOwners.Application/AdminPortal/TenantProvisioning/Steps/CreateCompanyModulesStep.cs

namespace BusinessOwners.Application.AdminPortal.TenantProvisioning.Steps;

public class CreateCompanyModulesStep : SagaStepBase<CreateCompanyModulesStep>
{
    private readonly ICompanyModuleRepository _companyModuleRepository;
    private readonly IClockService _clockService;

    public override KeycloakProvisioningStep Step => KeycloakProvisioningStep.CreateCompanyModules;

    public CreateCompanyModulesStep(
        ICompanyModuleRepository companyModuleRepository,
        IClockService clockService)
    {
        _companyModuleRepository = companyModuleRepository;
        _clockService = clockService;
    }

    protected override async Task<bool> ExecuteStepLogicAsync(
        KeycloakProvisioningSagaState state,
        CancellationToken ct)
    {
        // Get modules from invoice
        var moduleLicenses = state.OfflineRequest.Modules;

        if (moduleLicenses == null || !moduleLicenses.Any())
        {
            // No modules purchased - use default free modules
            await CreateDefaultModulesAsync(state.CompanyGuid, ct);
            return true;
        }

        // Create company modules based on purchased licenses
        foreach (var moduleDto in moduleLicenses)
        {
            var companyModule = CompanyModule.Create(
                state.CompanyGuid,
                (Modules)moduleDto.ModuleId,
                _clockService.UtcNow,
                expiryDate: null  // Or calculate from subscription
            );

            // Add features with limits
            foreach (var featureDto in moduleDto.Features)
            {
                var feature = CompanyModuleFeature.Create(
                    companyModule.Id,
                    (SystemFeature)featureDto.FeatureId,
                    featureDto.LimitValue
                );

                companyModule.Features.Add(feature);
            }

            await _companyModuleRepository.AddAsync(companyModule, ct);
        }

        await _companyModuleRepository.SaveChangesAsync(ct);

        return true;
    }

    private async Task CreateDefaultModulesAsync(Guid companyId, CancellationToken ct)
    {
        // Default modules for free tier
        var defaultModules = new[]
        {
            (Modules.GeneralSettings, new[]
            {
                (SystemFeature.LimitAccounts, 100),
                (SystemFeature.LimitCostCenter, 10)
            }),
            (Modules.Accounting, new[]
            {
                (SystemFeature.LimitAccounts, 100),
                (SystemFeature.LimitCostCenter, 10),
                (SystemFeature.LimitPaymentIn, 50),
                (SystemFeature.LimitPaymentOut, 50)
            })
        };

        foreach (var (module, features) in defaultModules)
        {
            var companyModule = CompanyModule.Create(
                companyId,
                module,
                _clockService.UtcNow
            );

            foreach (var (feature, limit) in features)
            {
                companyModule.Features.Add(CompanyModuleFeature.Create(
                    companyModule.Id,
                    feature,
                    limit
                ));
            }

            await _companyModuleRepository.AddAsync(companyModule, ct);
        }

        await _companyModuleRepository.SaveChangesAsync(ct);
    }
}
```

#### 5.2 Update Saga State

```csharp
// Add to KeycloakProvisioningSagaState.cs

public List<ModuleLicenseDto> PurchasedModules { get; set; }

// Add to KeycloakProvisioningStep enum
public enum KeycloakProvisioningStep
{
    // ... existing steps
    CreateCompanyModules = 35,  // Insert before CreateInvoice
    CreateInvoice = 36,
    // ...
}
```

---

## Keycloak Configuration Changes

### Option 1: Keep Current Keycloak Token (Recommended)

**No changes needed to Keycloak**. The Access Context Token is application-managed and independent of Keycloak.

**Pros:**
- Simpler implementation
- Keycloak remains focused on authentication
- More flexibility in token structure
- No Keycloak version dependencies

**Cons:**
- Two separate token validation mechanisms

### Option 2: Extend Keycloak Token (Advanced)

Add custom claims to Keycloak token via mappers. **Not recommended** due to:
- Token size bloat
- Keycloak reload on every company/branch switch
- Complexity of syncing company modules to Keycloak

---

## API Changes

### Deprecate `CurrentUserInfo` Endpoint

**Old Endpoint:**
```
GET /api/CurrentUserInfo?companyId={id}&branchId={id}
```

**New Endpoints:**
```
POST /api/AccessContext/generate
POST /api/AccessContext/switch
GET /api/AccessContext/validate
```

### Client Flow

#### 1. Initial Login

```typescript
// 1. Authenticate with Keycloak
const authToken = await keycloak.login(username, password);

// 2. Generate Access Context Token (default company/branch)
const response = await fetch('/api/AccessContext/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    companyId: null,  // null = use default
    branchId: null
  })
});

const { token, context, entitlements, availableContexts } = await response.json();

// 3. Store both tokens
localStorage.setItem('auth_token', authToken);
localStorage.setItem('access_context_token', token);

// 4. Use Access Context Token in subsequent requests
fetch('/api/Sales/Invoices', {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'X-Access-Context': token
  }
});
```

#### 2. Switch Company/Branch

```typescript
const response = await fetch('/api/AccessContext/switch', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'X-Access-Context': currentAccessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    companyId: newCompanyId,
    branchId: newBranchId
  })
});

const { token } = await response.json();
localStorage.setItem('access_context_token', token);
```

#### 3. Check Module Access (Client-Side)

```typescript
function hasModule(moduleName: string): boolean {
  const token = localStorage.getItem('access_context_token');
  const decoded = JSON.parse(atob(token.split('.')[1]));

  const entitlements = JSON.parse(decoded.entitlements);
  return entitlements.modules.some(m => m.name === moduleName);
}

// Usage
if (!hasModule('Sales')) {
  // Redirect to upgrade page
  router.push('/upgrade');
}
```

---

## Migration Path

### Phase 1: Parallel Operation (Weeks 1-2)

1. **Deploy new tables**: `CompanyModules`, `CompanyModuleFeatures`
2. **Migrate existing data**: Populate modules from `BoLicense` records
3. **Deploy new APIs**: `/api/AccessContext/*` endpoints
4. **Keep old endpoint**: `/api/CurrentUserInfo` still works

### Phase 2: Client Migration (Weeks 3-4)

1. **Update Angular client** to use new flow
2. **Update Mobile client** to use new flow
3. **Monitor both endpoints** for usage

### Phase 3: Deprecation (Week 5)

1. **Log warnings** when old endpoint is called
2. **Notify clients** to migrate
3. **Set deprecation deadline**

### Phase 4: Removal (Week 6+)

1. **Remove old endpoint**
2. **Clean up old code**

---

## Benefits Summary

### 1. **Performance**
- ✅ Reduced database queries (modules/permissions in token)
- ✅ Faster company/branch switching (no full reload)
- ✅ Cacheable authorization decisions

### 2. **Security**
- ✅ Separation of concerns (auth vs. authz)
- ✅ Short-lived context tokens
- ✅ Scoped permissions per company/branch

### 3. **Developer Experience**
- ✅ Clear API semantics
- ✅ Easy to validate module access client-side
- ✅ Standardized token structure

### 4. **Business Logic**
- ✅ Module subscription enforcement
- ✅ Feature limits visible in token
- ✅ Easy to implement usage tracking

### 5. **Scalability**
- ✅ Reduced database load
- ✅ Horizontal scaling (stateless tokens)
- ✅ CDN-friendly (token validation via public key)

---

## Recommended Naming

### Primary Recommendation: `AccessContextToken`

**Rationale:**
- "Access" clearly indicates authorization/permissions
- "Context" represents current working environment (company/branch/modules)
- "Token" indicates it's a security credential

### Alternative Names (Ranked):

1. **EntitlementToken** - Emphasizes what user is entitled to
2. **WorkspaceToken** - If company+branch is conceptualized as "workspace"
3. **ScopeToken** - Represents authorization scope
4. **SessionContextToken** - Emphasizes session-specific context

### Rename `CurrentUserInfo` to:

**Option 1**: Deprecate entirely (recommended)
**Option 2**: Rename to `UserContextInfo` (if keeping for legacy support)

---

## Configuration

### appsettings.json

```json
{
  "AccessContextToken": {
    "SigningKey": "your-256-bit-secret-key-here-make-it-long-and-random",
    "Issuer": "https://yourapp.com",
    "ExpiryMinutes": 60
  }
}
```

### Environment Variables (Production)

```bash
ACCESS_CONTEXT_TOKEN__SIGNING_KEY=<strong-secret-from-keyvault>
ACCESS_CONTEXT_TOKEN__ISSUER=https://production.yourapp.com
ACCESS_CONTEXT_TOKEN__EXPIRY_MINUTES=30
```

---

## Testing Strategy

### Unit Tests

```csharp
public class AccessContextTokenServiceTests
{
    [Fact]
    public async Task GenerateTokenAsync_WithValidUser_ReturnsValidToken()
    {
        // Arrange
        var service = CreateService();
        var userId = Guid.NewGuid();
        var companyId = Guid.NewGuid();
        var branchId = Guid.NewGuid();

        // Act
        var token = await service.GenerateTokenAsync(userId, companyId, branchId);

        // Assert
        Assert.NotNull(token);
        var decoded = service.ValidateAndDecodeToken(token);
        Assert.Equal(companyId, decoded.Context.CompanyId);
    }

    [Fact]
    public async Task GenerateTokenAsync_WithUnauthorizedUser_ThrowsException()
    {
        // Arrange
        var service = CreateService();
        var userId = Guid.NewGuid();
        var companyId = Guid.NewGuid();  // User not assigned to this company
        var branchId = Guid.NewGuid();

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.GenerateTokenAsync(userId, companyId, branchId));
    }
}
```

### Integration Tests

```csharp
public class AccessContextControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GenerateAccessContext_WithValidRequest_ReturnsToken()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new GenerateAccessContextRequest
        {
            CompanyId = TestData.CompanyId,
            BranchId = TestData.BranchId
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/AccessContext/generate", request);

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<AccessContextResponse>();
        Assert.NotNull(result.Token);
    }
}
```

---

## Appendix: Complete File Structure

```
Src/
├── Shared/
│   └── Shared.Core/
│       ├── Models/
│       │   └── AccessContext/
│       │       ├── AccessContextToken.cs
│       │       ├── ContextInfo.cs
│       │       ├── EntitlementsInfo.cs
│       │       ├── ModuleEntitlement.cs
│       │       ├── FeatureLimit.cs
│       │       ├── PreferencesInfo.cs
│       │       └── AvailableContext.cs
│       └── Constants/
│           └── ClaimNames.cs (updated)
│
├── Shared/
│   └── Shared.Web/
│       ├── Security/
│       │   └── Services/
│       │       ├── IAccessContextTokenService.cs
│       │       ├── AccessContextTokenService.cs
│       │       ├── IAccessContextService.cs
│       │       └── AccessContextService.cs
│       ├── Middleware/
│       │   └── AccessContextMiddleware.cs
│       └── Authorization/
│           ├── RequireModuleAttribute.cs
│           └── RequireFeatureAttribute.cs
│
├── AppsPortal/
│   └── Accounting/
│       ├── AppsPortal.Domain/
│       │   └── Entities/
│       │       └── CompanyModules/
│       │           ├── CompanyModule.cs
│       │           └── CompanyModuleFeature.cs
│       ├── AppsPortal.Persistence/
│       │   ├── Configurations/
│       │   │   ├── CompanyModuleConfiguration.cs
│       │   │   └── CompanyModuleFeatureConfiguration.cs
│       │   └── Repositories/
│       │       └── CompanyModuleRepository.cs
│       └── AppsPortal.Apis/
│           └── Controllers/
│               └── Auth/
│                   └── AccessContextController.cs
│
└── BusinessOwners/
    └── BusinessOwners.Application/
        └── AdminPortal/
            └── TenantProvisioning/
                └── Steps/
                    └── CreateCompanyModulesStep.cs
```

---

## Conclusion

The **Access Context Token** provides a robust, scalable solution for managing company/branch/module access control. By separating authentication (Keycloak JWT) from authorization context (Access Context Token), you gain:

1. **Better performance** through reduced database queries
2. **Clearer semantics** with explicit access context
3. **Flexible authorization** scoped to company/branch/module
4. **Easier client-side** module/feature checking
5. **Scalable architecture** with stateless tokens

The implementation follows the established patterns in your codebase (saga steps, domain entities, repositories) and integrates cleanly with existing Keycloak authentication.
