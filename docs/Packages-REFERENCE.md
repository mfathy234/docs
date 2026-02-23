# Microtec Packages - Quick Reference with File Catalog

**Last Updated:** 2026-01-11
**Total Packages:** 16
**Total Classes:** 300+
**Total Services:** 40+

---

## 📦 1. Microtec.Domain (Foundation)

**Purpose:** Foundation package with base entities, interfaces, enums, constants, and exceptions
**Dependencies:** NONE
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Base Entities** | Entities/ | |
| `EntityBase<TKey>` | Entities/EntityBase.cs | Base entity with typed primary key |
| `FullAuditedEntityBase` | Entities/FullAuditedEntityBase.cs | Entity with CreatedBy, UpdatedBy, IsActive, IsDeleted |
| `MultiTenantEntity` | Entities/MultiTenantEntity.cs | Entity with TenantId support |
| `SoftDeleteEntity<T>` | Entities/SoftDeleteEntity.cs | Soft delete support |
| `LookupEntityBase` | Entities/LookupEntityBase.cs | Reference data with Name/NameAr |
| **Service Markers** | Interfaces/ | |
| `IScopedService` | Interfaces/IScopedService.cs | Auto-registration marker for scoped lifetime |
| `ISingletonService` | Interfaces/ISingletonService.cs | Auto-registration marker for singleton lifetime |
| `ITransientService` | Interfaces/ISingletonService.cs | Auto-registration marker for transient lifetime |
| **Core Interfaces** | Interfaces/ | |
| `IRepository<TEntity>` | Interfaces/IRepository.cs | Generic repository pattern contract |
| `IUnitOfWork<TContext>` | Interfaces/IUnitOfWork.cs | Unit of work pattern contract |
| `ICacheService` | Interfaces/ICacheService.cs | Redis caching abstraction |
| `ISecurityService` | Interfaces/ISecurityService.cs | Current user and tenant context |
| `IMultiTenantEntity` | Interfaces/IMultiTenantEntity.cs | Multi-tenant entity marker |
| **Enums** | Enums/ | |
| `ActionTypes` | Enums/ActionTypes.cs | CRUD action types (View, Add, Edit, Delete) |
| `Apps` | Enums/Apps.cs | Application types (ERP, Workflow, AdminPortal) |
| `Modules` | Enums/Modules.cs | Module identifiers (Inventory, Sales, etc.) |
| `PaymentMethodType` | Enums/PaymentMethodType.cs | Cash, Card, Transfer, etc. |
| `TrackingType` | Enums/TrackingType.cs | Serial, Batch, None |
| **Constants** | Constants/ | |
| `CacheKeys` | Constants/CacheKeys.cs | Redis cache key constants |
| `ClaimNames` | Constants/ClaimNames.cs | JWT claim names |
| `RabbitMqQueues` | Constants/RabbitMqQueues.cs | RabbitMQ queue names |
| `ErrorMessages` | Constants/ErrorMessages.cs | Standard error messages |
| **Exceptions** | Exceptions/ | |
| `BusinessRuleException` | Exceptions/BusinessRuleException.cs | Business rule violations (400) |
| `NotFoundException` | Exceptions/NotFoundException.cs | Resource not found (404) |
| `ValidationException` | Exceptions/ValidationException.cs | Validation errors (400) |
| `ForbiddenAccessException` | Exceptions/ForbiddenAccessException.cs | Access forbidden (403) |
| **Extensions** | Extensions/ | |
| `QueryExtensions` | Extensions/QueryExtensions.cs | LINQ query helpers |
| `StringExtensions` | Extensions/StringExtensions.cs | String utility methods |
| `DateExtensions` | Extensions/DateExtensions.cs | Date/time utilities |
| `EnumExtensions` | Extensions/EnumExtensions.cs | Enum helpers |
| `JsonExtensions` | Extensions/JsonExtensions.cs | JSON serialization |

**Common Usage:**
```csharp
// Multi-tenant entity with audit trail
public class Invoice : FullAuditedEntityBase, IMultiTenantEntity
{
    public Guid TenantId { get; set; }
    public string InvoiceNumber { get; set; }
}

// Auto-registered service
public class InvoiceService : IInvoiceService, IScopedService { }
```

---

## 📦 2. Microtec.Contracts (CQRS & Events)

**Purpose:** CQRS patterns, integration events, DTOs, and application layer contracts
**Dependencies:** Microtec.Domain
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **CQRS Base** | CQRS/Base/ | |
| `ICommand<TResult>` | CQRS/Base/ICommand.cs | Command interface with return type |
| `ICommandHandler<T>` | CQRS/Base/ICommandHandler.cs | Command handler interface |
| `IQuery<TResult>` | CQRS/Base/IQuery.cs | Query interface with return type |
| `IQueryHandler<T>` | CQRS/Base/IQueryHandler.cs | Query handler interface |
| **CQRS Interfaces** | CQRS/ | |
| `IEventPublisher` | CQRS/IEventPublisher.cs | Integration event publishing via MassTransit |
| `IAppSender` | CQRS/IAppSender.cs | Send commands to other services |
| **Pipeline Behaviors** | CQRS/Behaviours/ | |
| `ValidationBehaviour` | CQRS/Behaviours/ValidationBehaviour.cs | FluentValidation pipeline behavior |
| `WorkflowBehavior` | CQRS/Behaviours/WorkflowBehavior.cs | Workflow integration behavior |
| `RequestLoggingPipelineBehavior` | CQRS/Behaviours/RequestLoggingPipelineBehavior.cs | Request/response logging |
| `UnhandledExceptionBehaviour` | CQRS/Behaviours/UnhandledExceptionBehaviour.cs | Exception catching and logging |
| **Message Contracts** | MessageContracts/ | |
| `IntegrationEvent` | MessageContracts/IntegrationEvent.cs | Base class for all integration events |
| `WebhookEvent` | MessageContracts/WebhookEvent.cs | Base class for webhook events |
| `IBaseConsumer<T>` | MessageContracts/IBaseConsumer.cs | Base consumer interface |
| **Attributes** | Attributes/ | |
| `PolicyMapperAttribute` | Attributes/PolicyMapperAttribute.cs | Authorization policy mapping (ActionType, Service, License) |
| `QueueNameAttribute` | Attributes/QueueNameAttribute.cs | RabbitMQ queue name for consumers |
| **Integration Events** | Events/IntegrationEvents/ | |
| `SubdomainCreatedIntegrationEvent` | Events/.../SubdomainCreatedIntegrationEvent.cs | Subdomain creation event |
| `ErpBranchCreatedIntegrationEvent` | Events/.../ErpBranchCreatedIntegrationEvent.cs | Branch creation event |
| `SendNotificationEvent` | Events/.../SendNotificationEvent.cs | Notification trigger event |
| **Response Models** | Response/ | |
| `APIResponse<T>` | Response/APIResponse.cs | Standard API response wrapper |
| `ErrorResponse` | Response/ErrorResponse.cs | Error response model |
| **Extension Methods** | Extensions/ | |
| `ApplicationExtensions` | Extensions/ApplicationExtensions.cs | `AutoRegisterServices()`, `AddAutoMapperProfiles()` |
| `MediatorExtensions` | Extensions/MediatorExtensions.cs | `AddMediator()`, `AddFluentValidation()` |

**Common Usage:**
```csharp
// Command
public class CreateInvoiceCommand : ICommand<Result<Guid>>
{
    public string InvoiceNumber { get; set; }
    public decimal Amount { get; set; }
}

// Handler
public class CreateInvoiceCommandHandler : ICommandHandler<CreateInvoiceCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateInvoiceCommand request, CancellationToken ct)
    {
        // Implementation
    }
}

// Integration Event
[QueueName(RabbitMqQueues.InvoiceProcessing)]
public sealed class InvoiceCreatedConsumer : IConsumer<InvoiceCreatedEvent>, IBaseConsumer<InvoiceCreatedEvent> { }
```

---

## 📦 3. Microtec.Persistence (Data Access)

**Purpose:** EF Core repositories, unit of work, audit interceptors
**Dependencies:** Microtec.Domain, Microtec.Contracts
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Repository** | Base/ | |
| `RepositoryBase<TEntity>` | Base/RepositoryBase.cs | Generic repository with CRUD and querying (20+ methods) |
| `UnitOfWork<TContext>` | Base/UnitOfWork.cs | Unit of work with transaction management |
| **Interceptors** | Interceptors/ | |
| `AuditInterceptor` | Interceptors/AuditInterceptor.cs | Auto-populates CreatedBy, UpdatedBy, etc. |
| **Extensions** | Extensions/ | |
| `EntityTypeBuilderExtensions` | Extensions/EntityTypeBuilderExtensions.cs | `ConfigureAuditFields()`, `ConfigureSoftDelete()`, `ConfigureMultiTenancy()` |
| `ModelBuilderExtensions` | Extensions/ModelBuilderExtensions.cs | `ApplyGlobalQueryFilters()`, `ConfigureDecimalPrecision()` |
| **Constants** | Base/ | |
| `SchemaNames` | Base/SchemaNames.cs | Database schema name constants (inv, sales, fin, etc.) |

**Common Usage:**
```csharp
// Repository
public class ProductRepository : RepositoryBase<Product>, IProductRepository
{
    public ProductRepository(DbContext context) : base(context) { }

    // Inherits: GetByIdAsync, GetAllAsync, AddAsync, UpdateAsync, SoftRemove, etc.
}

// EF Configuration
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products", SchemaNames.Inventory);
        builder.ConfigureAuditFields();
        builder.ConfigureSoftDelete();
        builder.ConfigureMultiTenancy();
    }
}

// Usage with Unit of Work
await using var scope = await _unitOfWork.BeginTransactionAsync();
await _repository.AddAsync(product);
await _unitOfWork.SaveChangesAsync();
await scope.CommitAsync();
```

---

## 📦 4. Microtec.Messaging (RabbitMQ & Redis)

**Purpose:** MassTransit, Redis caching, event publishing, encryption
**Dependencies:** Microtec.Domain, Microtec.Contracts
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Services** | Services/ | |
| `CacheService` | Services/CacheService.cs | Redis caching (Get, Set, Remove, Exists, GetOrSet) - Singleton |
| `ClockService` | Services/ClockService.cs | Time/date provider (Now, UtcNow, Today) - Singleton |
| `EncryptionService` | Services/EncryptionService.cs | AES encryption/decryption - Singleton |
| `EventPublisher` | Services/EventPublisher.cs | Publish integration events via MassTransit - Scoped |
| `WebhookEventPublisher` | Services/WebhookEventPublisher.cs | Publish webhook events - Scoped |
| `AppSender` | Services/AppSender.cs | Send commands to other services - Scoped |
| `AppRestClient` | Services/AppRestClient.cs | HTTP REST client for service-to-service calls - Transient |
| `LanguageProvider` | Services/LanguageProvider.cs | Current request language and localization - Scoped |
| `ApplicationLogger<T>` | Services/ApplicationLogger.cs | Structured logging with correlation ID - Scoped |
| **Extensions** | Extensions/ | |
| `MassTransitExtensions` | Extensions/MassTransitExtensions.cs | `ConfigureMassTransit()` - RabbitMQ setup |
| `DependencyInjection` | DependencyInjection.cs | `AddRedisCacheDb()`, `AddMessagingServices()`, `AddPlatformMessaging()` |

**Common Usage:**
```csharp
// Caching
var product = await _cache.GetOrSetAsync($"product:{id}", async () =>
{
    return await _repository.GetByIdAsync(id);
}, TimeSpan.FromMinutes(30));

// Event Publishing
await _eventPublisher.PublishAsync(new OrderCreatedEvent
{
    OrderId = order.Id,
    CustomerId = order.CustomerId
});

// Encryption
var encrypted = _encryption.Encrypt(sensitiveData);
var decrypted = _encryption.Decrypt(encrypted);
```

---

## 📦 5. Microtec.Keycloak (Authentication)

**Purpose:** Keycloak integration for user/realm/role/session management
**Dependencies:** None (standalone)
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Service Interfaces** | Services/ | |
| `IKeycloakProvider` | Services/IKeycloakProvider.cs | Main provider aggregating all services |
| `IUserService` | Services/User/IUserService.cs | User CRUD, password, sessions (20+ methods) |
| `IRealmService` | Services/Realm/IRealmService.cs | Realm creation, configuration |
| `IRoleService` | Services/Role/IRoleService.cs | Role management and assignments |
| `IGroupService` | Services/Group/IGroupService.cs | Group management |
| `IClientService` | Services/Client/IClientService.cs | OAuth client management |
| `ISessionValidationService` | Services/Session/ISessionValidationService.cs | Token introspection, session enforcement |
| **Options** | Options/ | |
| `KeycloakOptions` | Options/KeycloakOptions.cs | BaseUrl, Realm, ClientId, Username, Password |
| `SessionValidationOptions` | Options/SessionValidationOptions.cs | EnforceSingleSession, EnableTokenIntrospection |
| **Constants** | Constants/ | |
| `KeycloakUserAttributes` | Constants/KeycloakUserAttributes.cs | TenantId, BranchId, CompanyId, etc. |

**Common Usage:**
```csharp
// Create user with roles
var userId = await _keycloak.CreateUserAsync(realm, new KeycloakUserDto
{
    Username = email,
    Email = email,
    Enabled = true,
    Attributes = new Dictionary<string, string[]>
    {
        { KeycloakUserAttributes.TenantId, new[] { tenantId.ToString() } }
    }
});

await _keycloak.SetUserPasswordAsync(realm, userId, password, temporary: false);
await _keycloak.AssignRoleToUserAsync(realm, userId, "admin");
```

---

## 📦 6. Microtec.Reporting (PDF & Excel)

**Purpose:** PDF/Excel generation, QR codes
**Dependencies:** Microtec.Domain, Microtec.Contracts, Microtec.Messaging
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Services** | GenerateReport/ | |
| `ReportGenerationService` | GenerateReport/ReportGenerationService.cs | Main orchestrator for reports |
| `PdfGenerateService` | GenerateReport/Pdf/PdfGenerateService.cs | QuestPDF document generation |
| `ClosedXmlExportService` | GenerateReport/Excel/ClosedXmlExportService.cs | Excel export with ClosedXML |
| `QRManager` | QRManager.cs | QR code generation (Generate, GenerateBase64) |
| **PDF Components** | GenerateReport/Pdf/Components/ | |
| `BaseDocument` | GenerateReport/Pdf/BaseDocument.cs | Base PDF document with header/footer |
| `HeaderTable` | Components/HeaderTable.cs | Document header table component |
| `InfoCard` | Components/InfoCard.cs | Info card (customer, vendor) |
| `SummaryTable` | Components/SummaryTable.cs | Summary/totals table |
| `ApprovalFooter` | Components/ApprovalFooter.cs | Signature boxes |
| **Excel Attributes** | GenerateReport/Excel/ | |
| `ExcelHeaderAttribute` | Excel/ExcelHeaderAttribute.cs | Column configuration (Name, NameAr, Order, Width, Format) |
| `ExcelExportOptions` | Excel/ExcelExportOptions.cs | Export options (SheetName, Language, AutoFitColumns) |
| **Configuration** | GenerateReport/Pdf/Configuration/ | |
| `ReportOptions` | Configuration/ReportOptions.cs | Global report configuration |
| `ArabicMoneyHumanizerExtensions` | Configuration/ArabicMoneyHumanizerExtensions.cs | Number to Arabic words |

**Common Usage:**
```csharp
// Excel Export
public class ProductDto
{
    [ExcelHeader(Name = "Code", NameAr = "الكود", Order = 1, Width = 15)]
    public string Code { get; set; }

    [ExcelHeader(Name = "Price", NameAr = "السعر", Order = 2, Format = "#,##0.00")]
    public decimal Price { get; set; }
}

var excel = await _excelService.ExportAsync(products, new ExcelExportOptions
{
    SheetName = "Products",
    Language = "ar"
});

// PDF Generation
public class InvoiceDocument : BaseDocument
{
    protected override void ComposeContent(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Component(new HeaderTable(invoice));
            column.Item().Component(new SummaryTable(totals));
        });
    }
}

var pdf = await _pdfService.GenerateAsync(new InvoiceDocument(invoice, header, options));
```

---

## 📦 7. Microtec.Web.Core (ASP.NET Core)

**Purpose:** Base controllers, JWT, middleware, localization, security services
**Dependencies:** Microtec.Domain, Microtec.Contracts, Microtec.Messaging
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Base Controllers** | Base/ | |
| `BaseController` | Base/BaseController.cs | Base API controller with ErrorResponse, ExportResult helpers |
| `InternalBaseController` | Base/InternalBaseController.cs | Internal service-to-service APIs with API key validation |
| **Middleware** | Middleware/ | |
| `ExceptionHandlingMiddleware` | Middleware/ExceptionHandlingMiddleware.cs | Global exception handling |
| `CorrelationIdMiddleware` | Middleware/CorrelationIdMiddleware.cs | Correlation ID generation and propagation |
| `AuthorizationMiddleware` | Middleware/AuthorizationMiddleware.cs | ERP authorization with permission checking |
| `ApiKeyMiddleware` | Middleware/ApiKeyMiddleware.cs | API key validation |
| `SanitizerMiddleware` | Middleware/SanitizerMiddleware.cs | XSS prevention |
| `FeatureFlagsMiddleware` | Middleware/FeatureFlagsMiddleware.cs | Feature flag enforcement |
| `AutoLogMiddleWare` | Middleware/AutoLogMiddleWare.cs | Request/response logging |
| **Security Services** | Security/Services/ | |
| `SecurityService` | Security/Services/SecurityService.cs | Current user/tenant context (CurrentUserId, CurrentTenantId, etc.) - Scoped |
| `ErpAuthorizationService` | Security/Services/ErpAuthorizationService.cs | Permission checking - Scoped |
| **Authentication** | Authentication/ | |
| `JwtProvider` | Authentication/JwtProvider.cs | JWT token generation and validation |
| `JwtOptions` | Authentication/JwtOptions.cs | Issuer, Audience, SecretKey, ExpiryMinutes |
| **Localization** | Localization/ | |
| `JsonStringLocalizer` | Localization/JsonStringLocalizer.cs | JSON file-based localization |
| `JsonStringLocalizerFactory` | Localization/JsonStringLocalizerFactory.cs | Localizer factory |
| `LocalizationMiddleware` | Localization/LocalizationMiddleware.cs | Culture detection |
| **Extension Methods** | Extensions/ | |
| `WebCoreExtensions` | Extensions/WebCoreExtensions.cs | `AddWebCoreServices()`, `AddWebCoreServicesLite()` |
| `MiddlewareExtensions` | Extensions/MiddlewareExtensions.cs | Middleware registration and pipeline setup |

**Common Usage:**
```csharp
// Base Controller
[ApiController]
[Route("api/[controller]")]
public class ProductsController : BaseController
{
    [HttpGet("{id}")]
    [PolicyMapper(ActionTypes.Get, "Products", Licenses.Basic)]
    public async Task<APIResponse<ProductDto>> GetProduct(Guid id)
    {
        var result = await _sender.Send(new GetProductQuery { Id = id });
        return result.IsSuccess ? APIResponse<ProductDto>.Success(result.Value) : ErrorResponse(result.Error);
    }
}

// Security Service
var order = new Order
{
    TenantId = _security.CurrentTenantId,
    CreatedBy = _security.CurrentUserId
};
```

---

## 📦 8. Microtec.Web.Hosting (Complete Stack)

**Purpose:** OpenTelemetry, Serilog, Swagger, Hangfire, complete API stack
**Dependencies:** Microtec.Web.Core, Microtec.Messaging, Microtec.Persistence
**Target:** .NET 8.0

### Key Files & Purposes

| File/Type | Location | Purpose |
|-----------|----------|---------|
| **Extension Methods** | Extensions/ | |
| `HostingExtensions` | Extensions/HostingExtensions.cs | `AddSharedWeb()` - Main API stack configuration |
| `WebApplicationExtensions` | Extensions/WebApplicationExtensions.cs | `UseSharedWeb()` - Middleware pipeline setup |
| `IntegrationExtensions` | Extensions/IntegrationExtensions.cs | `AddHangFire()`, `LoadPrintOutFonts()` |
| **Services** | Services/ | |
| `HangfireBackgroundJobService` | Services/HangfireBackgroundJobService.cs | IBackgroundJobService implementation - Scoped |
| **Options** | OptionsSetup/ | |
| `ApiUrlOptions` | OptionsSetup/ApiUrls/ApiUrlOptions.cs | External API URL configuration |
| `ConfigureOptions` | Extensions/ConfigureOptions.cs | Service startup configuration (EnableAuthorization, EnableCors, etc.) |

**Common Usage:**
```csharp
var builder = WebApplication.CreateBuilder(args);

// Full API stack
builder.Services.AddSharedWeb(builder.Configuration, builder.Environment, opt =>
{
    opt.EnableAuthorization = true;
    opt.EnableCorsDefaultPolicy = true;
    opt.EnableSanitizerMiddleware = true;
});

builder.Services.AddMediator(typeof(Program).Assembly);
builder.Services.ConfigureMassTransit(builder.Configuration, typeof(Program).Assembly);

var app = builder.Build();
app.UseSharedWeb(builder.Configuration);
app.Run();

// What AddSharedWeb() includes:
// - HttpContextAccessor, HttpClient
// - JWT authentication
// - Swagger with Bearer + XApiKey
// - Exception handling
// - CORS, Compression
// - Correlation ID
// - JSON localization
// - OpenTelemetry (tracing + metrics)
// - Serilog logging
// - OWASP security headers
```

---

## 📦 9-11. Import Packages (Data Import)

**Dependencies:** Import.Domain → Import.Infrastructure → Import.Integration

### Microtec.Import.Domain
- Import domain models, interfaces, enums
- Base import entity, import status enums
- Import validation rules

### Microtec.Import.Infrastructure
- Excel file handling with EPPlus
- EF Core repositories for import data
- Storage providers (Redis, Database)

### Microtec.Import.Integration
- Import strategies and orchestration
- Validation pipeline
- Background processing support

**Common Usage:**
```csharp
builder.Services.AddImportInfrastructure(configuration);
builder.Services.AddImportIntegration(configuration);
```

---

## 📦 12-13. ZATCA Packages (Saudi E-Invoicing)

**Dependencies:** Zatca.Infrastructure → Zatca.Integration

### Microtec.Zatca.Infrastructure
- ZATCA database models
- EF Core configurations
- Device onboarding entities

### Microtec.Zatca.Integration
- ZATCA API integration
- Invoice submission
- Compliance certificate management
- QR code generation (TLV format)

**Common Usage:**
```csharp
builder.Services.AddZatcaInfrastructure(configuration);
builder.Services.AddZatcaIntegration(configuration);
```

---

## 🔑 Key Extension Methods Reference

| Extension Method | Package | Prerequisites | Purpose |
|------------------|---------|---------------|---------|
| `AddSharedWeb()` | Web.Hosting | Keycloak, Redis, RabbitMQ | Full API stack (recommended) |
| `AddWebCoreServices()` | Web.Core | MediatR, MassTransit, Redis | Auto-register all services |
| `AddWebCoreServicesLite()` | Web.Core | None | Lightweight (excludes Messaging) |
| `AddMediator()` | Contracts | None | MediatR + pipeline behaviors |
| `ConfigureMassTransit()` | Messaging | RabbitMQ | RabbitMQ messaging |
| `AddMessagingServices()` | Messaging | MediatR, MassTransit, Redis | Cache, encryption, events |
| `AddKeycloakServices()` | Keycloak | Keycloak server | All Keycloak services |
| `AddJSONLocalization()` | Web.Core | None | JSON-based localization |
| `AddHangFire()` | Web.Hosting | SQL Server | Background job processing |

---

## 🏗️ Essential Patterns

### 1. Multi-Tenant Entity
```csharp
public class Invoice : FullAuditedEntityBase, IMultiTenantEntity
{
    public Guid TenantId { get; set; }
    public string InvoiceNumber { get; set; }
}
```

### 2. Service Auto-Registration
```csharp
public class InvoiceService : IInvoiceService, IScopedService { }
// Automatically registered as Scoped - no manual registration needed
```

### 3. CQRS Command
```csharp
public class CreateInvoiceCommand : ICommand<Result<Guid>>
{
    public string InvoiceNumber { get; set; }
}

public class CreateInvoiceCommandHandler : ICommandHandler<CreateInvoiceCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateInvoiceCommand request, CancellationToken ct)
    {
        // Implementation
    }
}
```

### 4. Integration Event Publishing
```csharp
await _eventPublisher.PublishAsync(new OrderCreatedEvent
{
    OrderId = order.Id,
    CustomerId = order.CustomerId
});
```

### 5. Integration Event Consumer
```csharp
[QueueName(RabbitMqQueues.OrderProcessing)]
public sealed class OrderCreatedConsumer : IConsumer<OrderCreatedEvent>, IBaseConsumer<OrderCreatedEvent>
{
    public async Task Consume(ConsumeContext<OrderCreatedEvent> context)
    {
        // Handle event
    }
}
```

### 6. Repository with Unit of Work
```csharp
await using var scope = await _unitOfWork.BeginTransactionAsync();
await _repository.AddAsync(entity);
await _unitOfWork.SaveChangesAsync();
await scope.CommitAsync();
```

### 7. Standard API Response
```csharp
return new APIResponse<ProductDto>
{
    Data = product,
    Success = true,
    Message = "Product retrieved successfully"
};
```

---

## 📖 Complete Documentation Links

- **[README.md](README.md)** - Repository overview and quick start
- **[CLAUDE.md](CLAUDE.md)** - AI assistant guidelines
- **Package READMEs:**
  - [Microtec.Domain](Shared/Microtec.Domain/README.md)
  - [Microtec.Contracts](Shared/Microtec.Contracts/README.md)
  - [Microtec.Persistence](Shared/Microtec.Persistence/README.md)
  - [Microtec.Messaging](Shared/Microtec.Messaging/README.md)
  - [Microtec.Keycloak](Shared/Microtec.Keycloak/README.md)
  - [Microtec.PublicApi](Shared/Microtec.PublicApi/README.md)
  - [Microtec.Reporting](Shared/Microtec.Reporting/README.md)
  - [Microtec.Web.Core](Web/Microtec.Web.Core/README.md)
  - [Microtec.Web.Hosting](Web/Microtec.Web.Hosting/README.md)
  - [Import Packages](Import/Microtec.Import.Domain/README.md)
  - [ZATCA Packages](Zatca/Microtec.Zatca.Infrastructure/README.md)

---

## 🎯 Quick Decision Guide

**Need full-featured API?**
→ Use `AddSharedWeb()` from Microtec.Web.Hosting

**Need lightweight gateway?**
→ Use `AddWebCoreServicesLite()` from Microtec.Web.Core

**Need CQRS pattern?**
→ Use `AddMediator()` from Microtec.Contracts

**Need messaging?**
→ Use `ConfigureMassTransit()` from Microtec.Messaging

**Need authentication?**
→ Use `AddKeycloakServices()` from Microtec.Keycloak

**Need PDF/Excel reports?**
→ Use services from Microtec.Reporting

**Need background jobs?**
→ Use `AddHangFire()` from Microtec.Web.Hosting

---

**For detailed implementation examples, configuration, and best practices, refer to individual package READMEs.**
