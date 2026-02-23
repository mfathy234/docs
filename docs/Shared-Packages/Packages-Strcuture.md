# Shared Packages Breakdown Guide

## Executive Summary

This guide provides a step-by-step plan to decompose the existing monolithic shared packages (`Shared.Core`, `Shared.Infrastructure`, `Shared.Web`) into smaller, focused NuGet packages with single responsibilities.

---

## Current State Analysis

### Current Packages
| Package | Files | Problems |
|---------|-------|----------|
| Shared.Core | 404 files | Contains 50+ NuGet dependencies, mixing domain, infrastructure abstractions, DTOs, utilities |
| Shared.Infrastructure | 60 files | Good size but mixed responsibilities (reports, data access, HTTP clients) |
| Shared.Web | 36 files | Reasonable size, could be split slightly |

### Package References in Shared.Core (The Problem)
```xml
<!-- CQRS/Messaging -->
MediatR, MassTransit, MassTransit.RabbitMQ

<!-- Validation -->
FluentValidation, FluentValidation.AspNetCore, FluentValidation.DependencyInjectionExtensions

<!-- ORM (Why is this in Core?) -->
EntityFrameworkCore, EntityFrameworkCore.Relational, EntityFrameworkCore.SqlServer,
EntityFrameworkCore.InMemory, EntityFrameworkCore.Design, EntityFrameworkCore.Tools,
EntityFrameworkCore.DynamicLinq

<!-- Mapping -->
AutoMapper, AutoMapper.Extensions.Microsoft.DependencyInjection

<!-- Security -->
AspNetCore.Authentication.JwtBearer, AspNetCore.Identity.EntityFrameworkCore, AspNetCore.Identity.UI

<!-- PDF/Excel -->
QuestPDF, ClosedXML, EPPlus, DinkToPdf, DotNetCorePdf

<!-- Observability -->
OpenTelemetry.*, Serilog.*

<!-- Caching -->
StackExchange.Redis.Extensions.*

<!-- Background Jobs -->
Hangfire.AspNetCore, Hangfire.SqlServer

<!-- API -->
Swashbuckle.AspNetCore, Microsoft.OpenApi, OwaspHeaders.Core

<!-- Misc -->
Scrutor, Humanizer, libphonenumber-csharp, HtmlSanitizer, SixLaborsCaptcha
```

**This is a "God Package"** - any service referencing Shared.Core gets ALL these dependencies.

---

## Proposed Package Structure (Consolidated - 8 Packages)

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIER 1: FOUNDATION (No Dependencies)          │
├─────────────────────────────────────────────────────────────────┤
│  Platform.Domain              │  Platform.Contracts             │
│  - Base entities              │  - DTOs & Response models       │
│  - Value objects              │  - API contracts                │
│  - Enums                      │  - Pagination models            │
│  - Constants                  │  - Integration events           │
│  - Exceptions                 │  - Message contracts            │
│  - Interfaces (abstractions)  │                                 │
│  - Utilities (helpers)        │                                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              TIER 2: PUBLIC API (Service-to-Service)            │
├─────────────────────────────────────────────────────────────────┐
│  Platform.PublicApi                                             │
│  - AdminPortal (DTOs + Client)                                  │
│  - AppsPortal (DTOs + Client) - Accounting, Finance, Inventory  │
│  - Workflow (DTOs + Client)                                     │
│  - Notification (DTOs + Client)                                 │
│  - Attachment (DTOs + Client)                                   │
│  - Base REST client, Polly resilience policies                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TIER 3: INFRASTRUCTURE                        │
├─────────────────────────────────────────────────────────────────┤
│  Platform.Persistence         │  Platform.Messaging             │
│  - EF Core repository         │  - MediatR CQRS                 │
│  - Unit of work               │  - MassTransit integration      │
│  - Interceptors               │  - Event publishing             │
│  - Multi-tenancy DB           │  - Pipeline behaviors           │
│                               │  - Redis caching                │
├───────────────────────────────┴─────────────────────────────────┤
│  Platform.Reporting                                             │
│  - PDF generation (QuestPDF)                                    │
│  - Excel export (ClosedXML)                                     │
│  - QR code generation                                           │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TIER 4: WEB LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Platform.Web.Core            │  Platform.Web.Hosting           │
│  - Base controllers           │  - OpenTelemetry setup          │
│  - Authentication/JWT         │  - Serilog configuration        │
│  - Authorization middleware   │  - Swagger setup                │
│  - Exception handling         │  - Hangfire setup               │
│  - Localization               │  - Health checks                │
│  - API key middleware         │  - Startup extensions           │
└─────────────────────────────────────────────────────────────────┘
```

**Note**: Keycloak remains a separate existing project (`InfrastructureServices/Keycloak`) - not part of this breakdown.

---

## Detailed Package Breakdown

### 1. Platform.Domain

**Purpose**: Core domain types with ZERO external NuGet dependencies

**Contains**:
```
/Base
    EntityBase.cs
    EntityBase<TKey>.cs
    FullAuditedEntityBase.cs
    MultiTenantEntityBase.cs
    SoftDeleteEntity.cs
    DomainEntity.cs
    ValueObject.cs
/Interfaces
    IEntity.cs
    IEntity<TKey>.cs
    IScopedService.cs
    ITransientService.cs
    ISingletonService.cs
    IRepository<T>.cs
    IUnitOfWork.cs
    ICacheService.cs
    ISecurityService.cs
    IClockService.cs
    IConfigService.cs
    IEncryptionService.cs
    IWorkflowService.cs
    IWorkflowEntity.cs
    IApplicationLogger.cs
    IRestClient.cs
    ITokenService.cs
    ILicenseService.cs
    IPdfService.cs
    ... (all interfaces)
/Enums
    /Accounting
    /Authorization
    /Finance
    /Inventory
    /Sequence
    /Transaction
    /Workflow
    /Common
/Constants
    CacheKeys.cs
    ConfigKeys.cs
    CronKeys.cs
    ErrorMessages.cs
    RabbitMqQueues.cs
    SecurityConstants.cs
    ServiceUrls.cs
    ...
/Exceptions
    DefaultException.cs
    BusinessRuleException.cs
    NotFoundException.cs
    ValidationException.cs
    UnauthorizedClientException.cs
    ForbiddenAccessException.cs
    ...
/Attributes
    PolicyMapperAttribute.cs
    QueueNameAttribute.cs
    WebhookQueueAttribute.cs
/Authorization
    SystemAction.cs
    TokenValidationDto.cs
/Utilities
    FileSizeHelper.cs
    RoundingHelper.cs
    VatCalculation.cs
    UrlTool.cs
/Services
    ClockService.cs
    EncryptionService.cs
    ApplicationLogger.cs
```

**NuGet Dependencies**: NONE (only Microsoft.Extensions.DependencyInjection.Abstractions if needed)

**Source Mapping**:
- `Shared.Core/Base/` → `Platform.Domain/Base/`
- `Shared.Core/Interfaces/` → `Platform.Domain/Interfaces/`
- `Shared.Core/Enums/` → `Platform.Domain/Enums/`
- `Shared.Core/Constants/` → `Platform.Domain/Constants/`
- `Shared.Core/Exceptions/` → `Platform.Domain/Exceptions/`
- `Shared.Core/Attributes/` → `Platform.Domain/Attributes/`
- `Shared.Core/Authorization/` → `Platform.Domain/Authorization/`
- `Shared.Core/ValueObjects/` → `Platform.Domain/ValueObjects/`
- `Shared.Core/Utilities/` → `Platform.Domain/Utilities/`
- `Shared.Infrastructure/Services/ClockService.cs` → `Platform.Domain/Services/`
- `Shared.Infrastructure/Services/EncryptionService.cs` → `Platform.Domain/Services/`
- `Shared.Infrastructure/Services/ApplicationLogger.cs` → `Platform.Domain/Services/`

---

### 2. Platform.Contracts

**Purpose**: Shared DTOs, API contracts, events - No business logic

**Contains**:
```
/Responses
    APIResponse.cs
    APIResponse<T>.cs
    ErrorResponse.cs
    ValidationResponse.cs
    ValidationError.cs
    BooleanResponse.cs
/Models
    CurrentUser.cs
    TenantContext.cs
    TenantDto.cs
    FilterDto.cs
    ConfigureOptions.cs
    WorkflowAllowedDto.cs
    ApiKeyClient.cs
/Pagination
    BaseQuery.cs
    BaseSortQuery.cs
    BaseExportQuery.cs
    PagedListDto.cs
    PaginationVm<T>.cs
/Events
    /DomainEvents
        DomainEvent.cs
        OutboxMessage.cs
    /IntegrationEvents
        IntegrationEvent.cs
        /AdminPortal
        /AppsPortal
        /BusinessOwners
        /Workflow
    /WebhookEvents
        WebhookEvent.cs
        (webhook contracts)
/MessageContracts
    IBaseConsumer.cs
    IFaultConsumer.cs
/CQRS
    ICommand.cs
    ICommand<TResult>.cs
    IQuery<TResult>.cs
    ICommandHandler<T>.cs
    IQueryHandler<T, TResult>.cs
    IAppSender.cs
    IEventPublisher.cs
/Options
    /ApiUrls
    /Mail
    /Redis
```

**NuGet Dependencies**:
- `MediatR.Contracts` (just the interfaces, not implementation)

**Source Mapping**:
- `Shared.Core/Response/` → `Platform.Contracts/Responses/`
- `Shared.Core/Models/` → `Platform.Contracts/Models/`
- `Shared.Core/DomainEvents/` → `Platform.Contracts/Events/DomainEvents/`
- `Shared.Core/Events/` → `Platform.Contracts/Events/`
- `Shared.Core/MessageContracts/` → `Platform.Contracts/MessageContracts/`
- `Shared.Core/CQRS/` (interfaces only) → `Platform.Contracts/CQRS/`
- `Shared.Core/OptionsSetup/` → `Platform.Contracts/Options/`

---

### 3. Platform.PublicApi

**Purpose**: Service-to-service communication - contracts, DTOs, and HTTP clients in one package

**Contains**:
```
/Base
    AppRestClient.cs
    BasePublicApiClient.cs
/AdminPortal
    IAdminPortalPublicApi.cs
    AdminPortalClient.cs
    /Dtos
        CreateUserDto.cs
        CreateUserResult.cs
/AppsPortal
    /Accounting
        IAccountingPublicApi.cs
        AccountingClient.cs
        /Dtos
            (journal entry DTOs, chart of accounts DTOs)
    /Finance
        IFinancePublicApi.cs
        FinanceClient.cs
        /Dtos
            (payment DTOs, treasury DTOs)
    /GeneralSettings
        IGeneralSettingsPublicApi.cs
        IGeneralSettingRestClient.cs
        GeneralSettingsClient.cs
        /Dtos
            (sequence DTOs, branch DTOs, currency DTOs)
    /Inventory
        IInventoryPublicApi.cs
        InventoryClient.cs
        /Dtos
            (stock DTOs, item DTOs)
/Attachment
    IAttachmentPublicApi.cs
    AttachmentClient.cs
    /Dtos
        ConfirmAttachmentDto.cs
        UploadAttachmentDto.cs
/Notification
    INotificationPublicApi.cs
    NotificationClient.cs
    /Dtos
/Workflow
    IWorkflowPublicApi.cs
    WorkflowClient.cs
    /Dtos
/Extensions
    DependencyInjection.cs
    HttpClientExtensions.cs
```

**NuGet Dependencies**:
- `Platform.Domain` (project reference)
- `Platform.Contracts` (project reference)
- `Microsoft.Extensions.Http`
- `Microsoft.Extensions.Http.Polly`

**Source Mapping**:
- `Shared.Core/PublicApi/` → `Platform.PublicApi/` (DTOs and interfaces)
- `Shared.Infrastructure/PublicApi/` → `Platform.PublicApi/` (client implementations)
- `Shared.Infrastructure/Services/AppRestClient.cs` → `Platform.PublicApi/Base/`

---

### 4. Platform.Persistence

**Purpose**: Data access layer with EF Core

**Contains**:
```
/Repository
    RepositoryBase<T>.cs
    IReadOnlyRepository<T>.cs
/UnitOfWork
    UnitOfWork.cs
    TenantDbScopeFactory.cs
/Interceptors
    AuditInterceptor.cs
/Extensions
    EntityTypeBuilderExtensions.cs
    ModelBuilderExtensions.cs
    QueryableExtensions.cs
/Schema
    SchemaNames.cs
/MultiTenancy
    TenantProvider.cs
    TenantDbContext.cs
/Configuration
    DependencyInjection.cs
```

**NuGet Dependencies**:
- `Platform.Domain` (project reference)
- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Relational`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.DynamicLinq`

**Source Mapping**:
- `Shared.Infrastructure/Base/` → `Platform.Persistence/`
- `Shared.Infrastructure/Interceptors/` → `Platform.Persistence/Interceptors/`
- `Shared.Infrastructure/Extensions/` → `Platform.Persistence/Extensions/`
- `Shared.Core/Services/TenantDbScopeFactory.cs` → `Platform.Persistence/UnitOfWork/`
- `Shared.Core/TenantProviders/` → `Platform.Persistence/MultiTenancy/`

---

### 5. Platform.Messaging

**Purpose**: CQRS with MediatR + Event publishing with MassTransit + Redis caching

**Contains**:
```
/CQRS
    /Behaviors
        RequestLoggingPipelineBehavior.cs
        ValidationBehaviour.cs
        UnhandledExceptionBehaviour.cs
        WorkflowBehavior.cs
    /Services
        AppSender.cs
/Events
    EventPublisher.cs
/Caching
    CacheService.cs
    RedisConfiguration.cs
/Configuration
    DependencyInjection.cs
    MassTransitConfiguration.cs
    MediatRConfiguration.cs
```

**NuGet Dependencies**:
- `Platform.Domain` (project reference)
- `Platform.Contracts` (project reference)
- `MediatR`
- `MassTransit`
- `MassTransit.RabbitMQ`
- `FluentValidation`
- `FluentValidation.DependencyInjectionExtensions`
- `StackExchange.Redis.Extensions.AspNetCore`
- `StackExchange.Redis.Extensions.Core`
- `StackExchange.Redis.Extensions.Newtonsoft`

**Source Mapping**:
- `Shared.Core/CQRS/Behaviours/` → `Platform.Messaging/CQRS/Behaviors/`
- `Shared.Infrastructure/Services/AppSender.cs` → `Platform.Messaging/CQRS/Services/`
- `Shared.Infrastructure/Services/EventPublisher.cs` → `Platform.Messaging/Events/`
- `Shared.Infrastructure/Services/CacheService.cs` → `Platform.Messaging/Caching/`

---

### 6. Platform.Reporting

**Purpose**: PDF and Excel report generation

**Contains**:
```
/Pdf
    /Services
        PdfGenerateService.cs
        ReportGenerationService.cs
    /Templates
        BaseDocument.cs
    /Components
        ApprovalFooter.cs
        HeaderTable.cs
        InfoCard.cs
        SummaryTable.cs
    /Configuration
        QuestSettings.cs
    /Models
        ReportHeader.cs
        ReportOptions.cs
    /Extensions
        ArabicMoneyHumanizerExtensions.cs
        ReportTextExtensions.cs
    /Helpers
        SkiaSharpHelpers.cs
/Excel
    /Services
        ClosedXmlExportService.cs
    /Templates
        BaseExportTemplate.cs
    /Attributes
        ExcelHeaderAttribute.cs
    /Options
        ExcelExportOptions.cs
/QRCode
    QRCode_generator.cs
    IQRManager.cs
    QRManager.cs
/Configuration
    DependencyInjection.cs
```

**NuGet Dependencies**:
- `Platform.Domain` (project reference)
- `Platform.Contracts` (project reference)
- `QuestPDF`
- `ClosedXML`
- `QRCoder`
- `SkiaSharp`
- `Humanizer.Core`
- `Humanizer.Core.ar`

**Source Mapping**:
- `Shared.Infrastructure/GenerateReport/` → `Platform.Reporting/`
- `Shared.Infrastructure/GenerateQRCode/` → `Platform.Reporting/QRCode/`
- `Shared.Infrastructure/Services/QRManager.cs` → `Platform.Reporting/QRCode/`
- `Shared.Core/Utilities/ExcelHelper.cs` → `Platform.Reporting/Excel/Helpers/`

---

### 7. Platform.Web.Core

**Purpose**: Core web API infrastructure

**Contains**:
```
/Controllers
    BaseController.cs
    InternalBaseController.cs
/Authentication
    JwtOptions.cs
    JwtOptionsSetup.cs
    JwtProvider.cs
    PolicyNameGenerator.cs
/Authorization
    AuthorizationMiddleware.cs
/Security
    SecurityService.cs
    GroupAccessService.cs
/Middleware
    ExceptionHandlingMiddleware.cs
    ApiKeyMiddleware.cs
    CorrelationIdMiddleware.cs
    AutoLogMiddleware.cs
    FeatureFlagsMiddleware.cs
    SanitizerMiddleware.cs
/Localization
    JsonStringLocalizer.cs
    JsonStringLocalizerFactory.cs
    JsonStringLocalizerWrapper.cs
    LocalizationMiddleware.cs
    LocalizationExtensions.cs
    LocalizedRequiredAttribute.cs
/Filters
    InboundCallApiAttribute.cs
/Options
    AutoLogOptions.cs
/Configuration
    DependencyInjection.cs
```

**NuGet Dependencies**:
- `Platform.Domain` (project reference)
- `Platform.Contracts` (project reference)
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- `AutoMapper`
- `AutoMapper.Extensions.Microsoft.DependencyInjection`
- `Scrutor`

**Source Mapping**:
- `Shared.Web/Base/` → `Platform.Web.Core/Controllers/`
- `Shared.Web/Authentication/` → `Platform.Web.Core/Authentication/`
- `Shared.Web/Security/` → `Platform.Web.Core/Security/`
- `Shared.Web/Middleware/` → `Platform.Web.Core/Middleware/`
- `Shared.Web/Localization/` → `Platform.Web.Core/Localization/`
- `Shared.Web/Filters/` → `Platform.Web.Core/Filters/`

---

### 8. Platform.Web.Hosting

**Purpose**: Application hosting, observability, and infrastructure setup

**Contains**:
```
/OpenTelemetry
    OpenTelemetryExtensions.cs
/Serilog
    SerilogExtensions.cs
/Swagger
    SwaggerExtensions.cs
    SwaggerOptions.cs
/Hangfire
    HangfireExtensions.cs
/HealthChecks
    HealthCheckExtensions.cs
    HealthCheckDto.cs
/Extensions
    WebApplicationExtensions.cs
    WebHostExtensions.cs
    ServicesExtensions.cs
/Configuration
    DependencyInjection.cs
```

**NuGet Dependencies**:
- `Platform.Web.Core` (project reference)
- `OpenTelemetry.Exporter.OpenTelemetryProtocol`
- `OpenTelemetry.Extensions.Hosting`
- `OpenTelemetry.Instrumentation.AspNetCore`
- `OpenTelemetry.Instrumentation.Http`
- `OpenTelemetry.Exporter.Prometheus.AspNetCore`
- `Serilog.AspNetCore`
- `Serilog.Sinks.Seq`
- `Serilog.Sinks.File`
- `Serilog.Settings.Configuration`
- `Swashbuckle.AspNetCore`
- `Microsoft.OpenApi`
- `OwaspHeaders.Core`
- `Hangfire.AspNetCore`
- `Hangfire.SqlServer`
- `AspNetCore.HealthChecks.UI.Client`

**Source Mapping**:
- `Shared.Web/Extensions/ServicesExtensions.cs` (split) → `Platform.Web.Hosting/`
- `Shared.Web/Extensions/WebApplicationExtensions.cs` → `Platform.Web.Hosting/Extensions/`
- `Shared.Web/Extensions/WebHostExtensions.cs` → `Platform.Web.Hosting/Extensions/`
- `Shared.Web/Common/HealthCheckDto.cs` → `Platform.Web.Hosting/HealthChecks/`

---

## Package Dependency Graph

```
                    ┌──────────────────┐
                    │ Platform.Domain  │  (No dependencies)
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │Platform.Contracts│           │Platform.        │
    │                 │           │Persistence      │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             ▼                             │
    ┌─────────────────────────┐            │
    │Platform.PublicApi       │            │
    │(DTOs + Clients)         │            │
    └─────────────────────────┘            │
                                           │
    ┌──────────────────────────────────────┤
    │                                      │
    ▼                                      ▼
┌───────────────────────┐       ┌───────────────────┐
│Platform.Messaging     │       │Platform.Reporting │
│(CQRS + Events + Cache)│       │                   │
└───────────┬───────────┘       └─────────┬─────────┘
            │                             │
            └──────────────┬──────────────┘
                           │
                           ▼
                 ┌─────────────────┐
                 │Platform.Web.Core│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────────┐
                 │Platform.Web.Hosting │
                 └─────────────────────┘
```

**Note**: Keycloak remains as existing separate project (`InfrastructureServices/Keycloak`)

---

## What Services Need

### Typical API Service
```xml
<PackageReference Include="Platform.Domain" Version="1.0.0" />
<PackageReference Include="Platform.Contracts" Version="1.0.0" />
<PackageReference Include="Platform.Persistence" Version="1.0.0" />
<PackageReference Include="Platform.Messaging" Version="1.0.0" />
<PackageReference Include="Platform.Web.Core" Version="1.0.0" />
<PackageReference Include="Platform.Web.Hosting" Version="1.0.0" />
```

### Service That Calls Other Services
```xml
<!-- Add this to above -->
<PackageReference Include="Platform.PublicApi" Version="1.0.0" />
```

### Service That Generates Reports
```xml
<!-- Add this to above -->
<PackageReference Include="Platform.Reporting" Version="1.0.0" />
```

### Background Worker Service
```xml
<PackageReference Include="Platform.Domain" Version="1.0.0" />
<PackageReference Include="Platform.Contracts" Version="1.0.0" />
<PackageReference Include="Platform.Messaging" Version="1.0.0" />
<PackageReference Include="Platform.Persistence" Version="1.0.0" />
<!-- No Web packages needed -->
```

---

## Implementation Steps

### Phase 1: Foundation (Week 1)

1. **Create Platform.Domain**
   - Extract all interfaces from `Shared.Core/Interfaces/`
   - Extract base entities from `Shared.Core/Base/`
   - Extract enums from `Shared.Core/Enums/`
   - Extract constants from `Shared.Core/Constants/`
   - Extract exceptions from `Shared.Core/Exceptions/`
   - Extract attributes from `Shared.Core/Attributes/`
   - Extract utilities from `Shared.Core/Utilities/`
   - Move service implementations (ClockService, EncryptionService, ApplicationLogger)
   - **Ensure ZERO NuGet dependencies**

2. **Create Platform.Contracts**
   - Extract DTOs from `Shared.Core/Models/`
   - Extract responses from `Shared.Core/Response/`
   - Extract events from `Shared.Core/Events/` and `Shared.Core/DomainEvents/`
   - Extract CQRS interfaces from `Shared.Core/CQRS/`
   - Extract message contracts from `Shared.Core/MessageContracts/`
   - Extract options from `Shared.Core/OptionsSetup/`

### Phase 2: PublicApi (Week 2)

3. **Create Platform.PublicApi**
   - Move ALL DTOs and interfaces from `Shared.Core/PublicApi/`
   - Move HTTP clients from `Shared.Infrastructure/PublicApi/`
   - Move `AppRestClient` from `Shared.Infrastructure/Services/`
   - Organize by service (AdminPortal, AppsPortal, etc.)
   - Add Polly for resilience

### Phase 3: Infrastructure (Week 3)

4. **Create Platform.Persistence**
   - Move repository from `Shared.Infrastructure/Base/`
   - Move interceptors from `Shared.Infrastructure/Interceptors/`
   - Move EF extensions from `Shared.Infrastructure/Extensions/`
   - Move tenant providers from `Shared.Core/TenantProviders/`

5. **Create Platform.Messaging** (includes Caching)
   - Move CQRS behaviors from `Shared.Core/CQRS/Behaviours/`
   - Move `AppSender` from `Shared.Infrastructure/Services/`
   - Move `EventPublisher` from `Shared.Infrastructure/Services/`
   - Move `CacheService` from `Shared.Infrastructure/Services/`

6. **Create Platform.Reporting**
   - Move entire `Shared.Infrastructure/GenerateReport/`
   - Move QR code generation from `Shared.Infrastructure/GenerateQRCode/`

### Phase 4: Web Layer (Week 4)

7. **Create Platform.Web.Core**
    - Move controllers from `Shared.Web/Base/`
    - Move authentication from `Shared.Web/Authentication/`
    - Move security from `Shared.Web/Security/`
    - Move middleware from `Shared.Web/Middleware/`
    - Move localization from `Shared.Web/Localization/`
    - Move LanguageProvider from `Shared.Infrastructure/Services/`

8. **Create Platform.Web.Hosting**
    - Split `ServicesExtensions.cs` - extract OpenTelemetry, Serilog, Swagger, Hangfire setup
    - Move health checks
    - Move host extensions

### Phase 5: Migration & Cleanup (Week 5)

9. **Update all consuming projects**
    - Replace old references with new packages
    - Update using statements

10. **Delete old Shared.* projects**
    - Remove `Shared.Core`
    - Remove `Shared.Infrastructure`
    - Remove `Shared.Web`

---

## Migration Checklist

### Phase 1: Foundation
- [ ] Create `Platform.Domain` project
- [ ] Move interfaces (IScopedService, IRepository, ISecurityService, etc.)
- [ ] Move base entities (EntityBase, FullAuditedEntityBase, etc.)
- [ ] Move value objects
- [ ] Move enums (all 30+ enum files)
- [ ] Move constants (all 16 constant files)
- [ ] Move exceptions (all 15 exception files)
- [ ] Move attributes
- [ ] Move utilities (FileSizeHelper, RoundingHelper, VatCalculation, UrlTool)
- [ ] Move service implementations (ClockService, EncryptionService, ApplicationLogger)
- [ ] Verify ZERO NuGet dependencies
- [ ] Create `Platform.Contracts` project
- [ ] Move response models
- [ ] Move DTOs and models
- [ ] Move events and message contracts
- [ ] Move CQRS interfaces
- [ ] Move options setup classes

### Phase 2: PublicApi
- [ ] Create `Platform.PublicApi` project
- [ ] Move AdminPortal DTOs, interfaces, and client
- [ ] Move AppsPortal DTOs, interfaces, and clients (Accounting, Finance, GeneralSettings, Inventory)
- [ ] Move Attachment DTOs, interfaces, and client
- [ ] Move Notification DTOs, interfaces, and client
- [ ] Move Workflow DTOs, interfaces, and client
- [ ] Move AppRestClient base class
- [ ] Configure Polly resilience policies

### Phase 3: Infrastructure
- [ ] Create `Platform.Persistence` project
- [ ] Move RepositoryBase
- [ ] Move UnitOfWork
- [ ] Move AuditInterceptor
- [ ] Move EF Core extensions
- [ ] Move tenant providers
- [ ] Create `Platform.Messaging` project (includes Caching)
- [ ] Move MediatR behaviors
- [ ] Move AppSender
- [ ] Move EventPublisher
- [ ] Move CacheService (Redis)
- [ ] Create `Platform.Reporting` project
- [ ] Move PDF generation
- [ ] Move Excel export
- [ ] Move QR code generation

### Phase 4: Web Layer
- [ ] Create `Platform.Web.Core` project
- [ ] Move BaseController, InternalBaseController
- [ ] Move JWT authentication
- [ ] Move security services
- [ ] Move all middleware
- [ ] Move localization
- [ ] Move LanguageProvider
- [ ] Create `Platform.Web.Hosting` project
- [ ] Extract OpenTelemetry setup
- [ ] Extract Serilog setup
- [ ] Extract Swagger setup
- [ ] Extract Hangfire setup
- [ ] Move health checks

### Phase 5: Finalization
- [ ] Update all consuming projects
- [ ] Run full test suite
- [ ] Delete old Shared.* projects
- [ ] Setup NuGet publishing pipeline
- [ ] Document package dependencies

---

## NuGet Package Configuration

### Sample .csproj for Platform.Domain
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>

    <!-- NuGet Package Properties -->
    <PackageId>Platform.Domain</PackageId>
    <Version>1.0.0</Version>
    <Authors>YourCompany</Authors>
    <Description>Core domain types, interfaces, entities, enums, and exceptions</Description>
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
  </PropertyGroup>

  <!-- NO PackageReferences - this is intentional -->

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="8.0.0" />
  </ItemGroup>
</Project>
```

### Sample .csproj for Platform.Persistence
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>

    <PackageId>Platform.Persistence</PackageId>
    <Version>1.0.0</Version>
    <Authors>YourCompany</Authors>
    <Description>Data access layer with Entity Framework Core</Description>
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\Platform.Domain\Platform.Domain.csproj" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Relational" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.DynamicLinq" Version="8.0.0" />
  </ItemGroup>
</Project>
```

---

## Benefits Summary

| Before | After |
|--------|-------|
| 3 packages with 500+ files | 8 focused packages |
| 50+ NuGet dependencies in Shared.Core | Dependencies only where needed |
| All services get all dependencies | Services pick only what they need |
| Single version for everything | Independent versioning per package |
| One team owns everything | Clear ownership boundaries |
| Change PDF → rebuild everything | Change PDF → rebuild only reporting consumers |

---

## Folder Structure After Refactoring

```
/src
  /Platform.Domain/           <- Entities, interfaces, enums, constants, exceptions, utilities
  /Platform.Contracts/        <- DTOs, responses, events, CQRS interfaces
  /Platform.PublicApi/        <- Service-to-service DTOs + HTTP clients
  /Platform.Persistence/      <- EF Core repository, UoW, interceptors
  /Platform.Messaging/        <- MediatR + MassTransit + Redis caching
  /Platform.Reporting/        <- PDF, Excel, QR code generation
  /Platform.Web.Core/         <- Controllers, JWT, middleware, localization
  /Platform.Web.Hosting/      <- OpenTelemetry, Serilog, Swagger, Hangfire
```

**Existing separate projects (unchanged):**
- `InfrastructureServices/Keycloak/` - Identity/authentication

---

## Questions to Decide Before Starting

1. **Package naming**: `Platform.*` or `YourCompany.*` or keep `Shared.*`?
2. **Versioning strategy**: Start all at 1.0.0 or use date-based versions?
3. **NuGet feed**: Azure Artifacts, GitHub Packages, or private NuGet server?
4. **Meta-package**: Create a `Platform.All` package for projects that need everything?
