# Microtec Platform Packages

  

A comprehensive collection of .NET 8.0 packages providing core infrastructure for enterprise applications including authentication, messaging, persistence, reporting, and specialized integrations.

  

## 📦 Repository Overview

  

This monorepo contains **16 packages** organized across **4 major categories**:

- **9 Shared Packages** - Core infrastructure and domain logic

- **2 Web Packages** - ASP.NET Core hosting and middleware

- **3 Import Packages** - Data import functionality

- **2 ZATCA Packages** - Saudi Arabia e-invoicing compliance

  

### Repository Statistics

  

| Metric | Count |

|--------|-------|

| Total Packages | 16 |

| Total Classes | 300+ |

| Total Interfaces | 150+ |

| Total Services | 40+ |

| Total DTOs | 200+ |

| Total Enums | 50+ |

| Total Extension Methods | 50+ |

| Total Integration Events | 25+ |

  

---

  

## 📚 Package Catalog

  

### Shared Packages (Core Infrastructure)

  

| Package | Version | Description | Documentation |

|---------|---------|-------------|---------------|

| **[Microtec.Domain](Shared/Microtec.Domain/README.md)** | .NET 8.0 | Foundation package - base entities, interfaces, enums, constants, exceptions | [📖 README](Shared/Microtec.Domain/README.md) |

| **[Microtec.Contracts](Shared/Microtec.Contracts/README.md)** | .NET 8.0 | CQRS patterns, integration events, messaging contracts, DTOs | [📖 README](Shared/Microtec.Contracts/README.md) |

| **[Microtec.Persistence](Shared/Microtec.Persistence/README.md)** | .NET 8.0 | EF Core repositories, unit of work, audit interceptors | [📖 README](Shared/Microtec.Persistence/README.md) |

| **[Microtec.Messaging](Shared/Microtec.Messaging/README.md)** | .NET 8.0 | MassTransit, Redis caching, event publishing, encryption | [📖 README](Shared/Microtec.Messaging/README.md) |

| **[Microtec.Keycloak](Shared/Microtec.Keycloak/README.md)** | .NET 8.0 | Keycloak integration - authentication, user/realm/role management | [📖 README](Shared/Microtec.Keycloak/README.md) |

| **[Microtec.PublicApi](Shared/Microtec.PublicApi/README.md)** | .NET 8.0 | Service-to-service HTTP clients (Admin Portal, Workflow) | [📖 README](Shared/Microtec.PublicApi/README.md) |

| **[Microtec.Reporting](Shared/Microtec.Reporting/README.md)** | .NET 8.0 | PDF/Excel generation, QR codes, ZATCA-compliant invoices | [📖 README](Shared/Microtec.Reporting/README.md) |

| **[Microtec.Attachment.Client](Shared/Microtec.Attachment.Client/README.md)** | .NET 8.0 | HTTP client for Attachment microservice | [📖 README](Shared/Microtec.Attachment.Client/README.md) |

| **[Microtec.Notifications.Client](Shared/Microtec.Notifications.Client/README.md)** | .NET 8.0 | HTTP client for Notifications microservice (Email, SMS, Push) | [📖 README](Shared/Microtec.Notifications.Client/README.md) |

  

### Web Packages (ASP.NET Core)

  

| Package | Version | Description | Documentation |

|---------|---------|-------------|---------------|

| **[Microtec.Web.Core](Web/Microtec.Web.Core/README.md)** | .NET 8.0 | Middleware, JWT, localization, base controllers, security services | [📖 README](Web/Microtec.Web.Core/README.md) |

| **[Microtec.Web.Hosting](Web/Microtec.Web.Hosting/README.md)** | .NET 8.0 | Full API hosting stack - OpenTelemetry, Serilog, Swagger, Hangfire | [📖 README](Web/Microtec.Web.Hosting/README.md) |

  

### Import Packages (Data Import)

  

| Package | Version | Description | Documentation |

|---------|---------|-------------|---------------|

| **[Microtec.Import.Domain](Import/Microtec.Import.Domain/README.md)** | .NET 8.0 | Import domain models, interfaces, enums | [📖 README](Import/Microtec.Import.Domain/README.md) |

| **[Microtec.Import.Infrastructure](Import/Microtec.Import.Infrastructure/README.md)** | .NET 8.0 | Excel handling, EF Core repositories, storage providers | [📖 README](Import/Microtec.Import.Infrastructure/README.md) |

| **[Microtec.Import.Integration](Import/Microtec.Import.Integration/README.md)** | .NET 8.0 | Import strategies, validation, background processing | [📖 README](Import/Microtec.Import.Integration/README.md) |

  

### ZATCA Packages (Saudi Arabia E-Invoicing)

  

| Package | Version | Description | Documentation |

|---------|---------|-------------|---------------|

| **[Microtec.Zatca.Infrastructure](Zatca/Microtec.Zatca.Infrastructure/README.md)** | .NET 8.0 | ZATCA database models, EF Core configurations | [📖 README](Zatca/Microtec.Zatca.Infrastructure/README.md) |

| **[Microtec.Zatca.Integration](Zatca/Microtec.Zatca.Integration/README.md)** | .NET 8.0 | ZATCA API integration - device onboarding, invoice submission | [📖 README](Zatca/Microtec.Zatca.Integration/README.md) |

  

---

  

## 🚀 Quick Start Examples

  

### Example 1: Full Web API (Production-Ready)

  

```csharp

var builder = WebApplication.CreateBuilder(args);

  

// Full stack - includes everything for a production API

builder.Services.AddSharedWeb(builder.Configuration, builder.Environment, options =>

{

    options.EnableAuthorization = true;        // JWT + Keycloak

    options.EnableCorsDefaultPolicy = true;    // CORS policy

    options.EnableFeatureFlags = false;        // Feature flags

    options.EnableSanitizerMiddleware = true;  // XSS prevention

});

  

builder.Services.AddMediator(typeof(Program).Assembly);

builder.Services.ConfigureMassTransit(builder.Configuration, typeof(Program).Assembly);

builder.Services.AddKeycloakServices(builder.Configuration);

  

var app = builder.Build();

app.UseSharedWeb(builder.Configuration);

app.Run();

```

  

**What `AddSharedWeb()` includes:**

- ✅ HttpContextAccessor, HttpClient factory

- ✅ JWT authentication (Keycloak)

- ✅ Swagger with Bearer + XApiKey auth

- ✅ Exception handling middleware

- ✅ CORS policy

- ✅ Response compression (Brotli/Gzip)

- ✅ Correlation ID middleware

- ✅ JSON localization

- ✅ OpenTelemetry (tracing + metrics)

- ✅ Auto-log middleware

- ✅ Sanitizer middleware (XSS prevention)

- ✅ OWASP security headers

  

**Required Configuration:**

```json

{

  "Keycloak": { "BaseUrl": "...", "Realm": "...", "ClientId": "..." },

  "RedisConfiguration": { "Hosts": [{ "Host": "localhost", "Port": 6379 }] },

  "RabbitMQ:Host": "amqp://localhost"

}

```

  

### Example 2: Lightweight API (No External Dependencies)

  

```csharp

var builder = WebApplication.CreateBuilder(args);

  

// Lightweight - no Redis/RabbitMQ/Keycloak required

builder.Services.AddWebCoreServices();

builder.Services.AddMediator(typeof(Program).Assembly);

builder.Services.AddCoreMiddleware();

  

var app = builder.Build();

app.UseExceptionHandling();

app.UseCorrelationId();

app.MapControllers();

app.Run();

```

  

### Example 3: Background Worker (Messaging Only)

  

```csharp

var builder = Host.CreateApplicationBuilder(args);

  

// Only messaging infrastructure

builder.Services.AddMessagingServices();

builder.Services.ConfigureMassTransit(builder.Configuration, typeof(Program).Assembly);

  

var host = builder.Build();

host.Run();

```

  

**Required Configuration:**

```json

{

  "RedisConfiguration": { "Hosts": [{ "Host": "localhost", "Port": 6379 }] },

  "RabbitMQ:Host": "amqp://localhost"

}

```

  

### Example 4: With Import Feature

  

```csharp

var builder = WebApplication.CreateBuilder(args);

  

builder.Services.AddSharedWeb(builder.Configuration, builder.Environment);

builder.Services.AddImportInfrastructure(builder.Configuration);

builder.Services.AddImportIntegration(builder.Configuration);

  

var app = builder.Build();

app.UseSharedWeb(builder.Configuration);

app.Run();

```

  

### Example 5: With ZATCA Integration

  

```csharp

var builder = WebApplication.CreateBuilder(args);

  

builder.Services.AddSharedWeb(builder.Configuration, builder.Environment);

builder.Services.AddZatcaInfrastructure(builder.Configuration);

builder.Services.AddZatcaIntegration(builder.Configuration);

  

var app = builder.Build();

app.UseSharedWeb(builder.Configuration);

app.Run();

```

  

---

  

## 🏗️ Architecture & Design Patterns

  

### CQRS (Command Query Responsibility Segregation)

  

All application logic uses CQRS with MediatR:

  

```csharp

// Command

public class CreateInvoiceCommand : ICommand<Result<Guid>>

{

    public string InvoiceNumber { get; set; }

    public decimal Amount { get; set; }

}

  

// Query

public class GetInvoicesQuery : IQuery<PaginationVm<InvoiceDto>>

{

    public FilterDto Filter { get; set; }

}

  

// Handler

public class CreateInvoiceCommandHandler : ICommandHandler<CreateInvoiceCommand, Result<Guid>>

{

    public async Task<Result<Guid>> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)

    {

        // Business logic

    }

}

```

  

### Multi-Tenancy

  

Built-in multi-tenancy support at the entity and query level:

  

```csharp

public class Invoice : FullAuditedEntityBase, IMultiTenantEntity

{

    public Guid TenantId { get; set; }

    public string InvoiceNumber { get; set; }

}

  

// Queries automatically filtered by TenantId

var invoices = await dbContext.Invoices.ToListAsync();

```

  

### Repository Pattern

  

Generic repository implementation with unit of work:

  

```csharp

public class InvoiceRepository : RepositoryBase<Invoice>, IInvoiceRepository

{

    public InvoiceRepository(DbContext context) : base(context) { }

}

  

// Usage

await using var scope = await _unitOfWork.BeginTransactionAsync();

await _invoiceRepository.AddAsync(invoice);

await _unitOfWork.SaveChangesAsync();

await scope.CommitAsync();

```

  

### Service Auto-Registration

  

Marker interfaces enable automatic DI registration:

  

```csharp

// Automatically registered as Scoped

public class InvoiceService : IInvoiceService, IScopedService { }

  

// Automatically registered as Singleton

public class CacheService : ICacheService, ISingletonService { }

  

// Automatically registered as Transient

public class DateTimeService : IDateTimeService, ITransientService { }

```

  

### Messaging & Events

  

MassTransit with RabbitMQ for inter-service communication:

  

```csharp

// Integration Event

public sealed class InvoiceCreatedEvent : IntegrationEvent

{

    public Guid InvoiceId { get; set; }

    public decimal Amount { get; set; }

}

  

// Consumer

[QueueName(RabbitMqQueues.InvoiceProcessing)]

public sealed class InvoiceCreatedConsumer : IConsumer<InvoiceCreatedEvent>, IBaseConsumer<InvoiceCreatedEvent>

{

    public async Task Consume(ConsumeContext<InvoiceCreatedEvent> context)

    {

        // Handle event

    }

}

```

  

### Audit Trail

  

Automatic audit field population via EF Core interceptor:

  

```csharp

public class Invoice : FullAuditedEntityBase

{

    // Automatically populated:

    // - CreatedBy, CreatedOn

    // - UpdatedBy, UpdatedOn

    // - IsActive, IsDeleted

}

```

  

---

  

## 🔌 Extension Methods Reference

  

### Service Registration

  

| Extension Method | Package | What It Registers | Prerequisites |

|------------------|---------|-------------------|---------------|

| `AddSharedWeb()` | Web.Hosting | Full web API stack (recommended) | Keycloak, Redis, RabbitMQ |

| `AddWebCoreServices()` | Web.Core | Core services + AutoMapper | None |

| `AddCoreMiddleware()` | Web.Core | All middleware services | None |

| `AddMessagingServices()` | Messaging | Cache, Clock, Encryption, EventPublisher | Redis |

| `AddPlatformMessaging()` | Messaging | Messaging + Redis + Language provider | Redis |

| `AddKeycloakServices()` | Keycloak | All Keycloak services | Keycloak server |

| `AddMediator()` | Contracts | MediatR + pipeline behaviors | None |

| `ConfigureMassTransit()` | Messaging | MassTransit + RabbitMQ consumers | RabbitMQ |

| `AddImportInfrastructure()` | Import.Infrastructure | Import DbContext, repositories | Database |

| `AddImportIntegration()` | Import.Integration | Import strategies, services | Redis |

| `AddZatcaInfrastructure()` | Zatca.Infrastructure | ZATCA DbContext, repositories | Database |

| `AddZatcaIntegration()` | Zatca.Integration | ZATCA services, HTTP clients | ZATCA API |

  

### Microtec.Contracts Extensions

  

```csharp

// Auto-register services with marker interfaces

services.AutoRegisterServices(assemblies);

  

// Register AutoMapper profiles

services.AddAutoMapperProfiles(assemblies);

  

// Configure MediatR with pipeline behaviors

services.AddMediator(assembly, enableWorkflowBehavior: false);

  

// Configure FluentValidation

services.AddFluentValidation(assemblies, enableAutoValidation: true);

```

  

### Microtec.Messaging Extensions

  

```csharp

// Register Redis cache

services.AddRedisCacheDb(configuration);

  

// Register language provider

services.AddLanguageProvider();

  

// Register all messaging services

services.AddMessagingServices();

  

// Full platform messaging setup

services.AddPlatformMessaging(configuration);

  

// Configure MassTransit with RabbitMQ

services.ConfigureMassTransit(configuration, assembly);

```

  

### Microtec.Persistence Extensions

  

```csharp

// On EntityTypeBuilder<T>

entity.ConfigureAuditFields();      // Configure audit columns

entity.ConfigureSoftDelete();        // Configure soft delete

entity.ConfigureMultiTenancy();      // Configure TenantId

  

// On ModelBuilder

modelBuilder.ApplyGlobalQueryFilters();  // Apply IsDeleted and TenantId filters

modelBuilder.ConfigureDecimalPrecision(); // Set decimal precision (18,4)

```

  

### Microtec.Web.Core Extensions

  

```csharp

// Register all core services

services.AddWebCoreServices();

  

// Register middleware individually

services.AddExceptionHandling();

services.AddCorrelationIdMiddleware();

services.AddErpAuthorization();

services.AddApiKeyMiddleware();

services.AddSanitizerMiddleware();

services.AddFeatureFlagsMiddleware();

services.AddAutoLogMiddleware();

  

// Or all at once

services.AddCoreMiddleware();

  

// Use middleware in pipeline

app.UseExceptionHandling();

app.UseCorrelationId();

app.UseErpAuthorization();

```

  

---

  

## ⚙️ Configuration Reference

  

### Complete appsettings.json

  

```json

{

  "Keycloak": {

    "BaseUrl": "https://keycloak.example.com/",

    "Realm": "master",

    "ClientId": "admin-cli",

    "Username": "admin",

    "Password": "admin-password",

    "SessionValidation": {

      "Enabled": true,

      "EnforceSingleSession": true,

      "EnableTokenIntrospection": true,

      "CacheDurationSeconds": 60

    }

  },

  

  "ApiUrls": {

    "AdminPortalUrl": "https://admin-api.example.com",

    "AppsPortalURL": "https://apps-api.example.com",

    "NotificationServiceURL": "https://notification-api.example.com",

    "WorkflowURL": "https://workflow-api.example.com"

  },

  

  "RedisConfiguration": {

    "Hosts": [{ "Host": "localhost", "Port": 6379 }],

    "AllowAdmin": true,

    "Database": 0,

    "KeyPrefix": "app:"

  },

  

  "RabbitMQ:Host": "amqp://localhost",

  "RabbitMQ:UserName": "guest",

  "RabbitMQ:Password": "guest",

  

  "ReportOptions": {

    "DefaultPageSize": "A4",

    "DefaultMargin": 20,

    "FontFamily": "Arial"

  },

  

  "Import": {

    "StorageProvider": "Redis",

    "MaxFileSize": 10485760,

    "AllowedExtensions": [".xlsx", ".xls"]

  },

  

  "Zatca": {

    "BaseUrl": "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal",

    "Environment": "Sandbox"

  },

  

  "AllowedCors": "https://app.example.com,https://*.example.com",

  "EnableLogging": true,

  "EnableTracing": true,

  "EnableMetrics": true

}

```

  

### Prerequisites by Feature

  

| Feature | Required Infrastructure | Configuration Section |

|---------|------------------------|----------------------|

| **Caching** | Redis Server | `RedisConfiguration` |

| **Messaging** | RabbitMQ Server | `RabbitMQ:Host`, `RabbitMQ:UserName`, `RabbitMQ:Password` |

| **Authentication** | Keycloak Server | `Keycloak` |

| **Session Validation** | Keycloak + Redis | `Keycloak:SessionValidation` |

| **Import** | Redis (for staging) | `Import` |

| **ZATCA** | ZATCA Portal Access | `Zatca` |

| **Hangfire** | SQL Server | Connection string |

| **Tracing** | OTLP Collector (optional) | `EnableTracing` |

| **Metrics** | Prometheus (optional) | `EnableMetrics` |

  

---

  

## 📊 Package Dependencies Hierarchy

  

```

TIER 1 (Foundation):

├── Microtec.Domain                    (NO dependencies)

└── Microtec.Contracts                 (→ Domain)

  

TIER 2 (Infrastructure):

├── Microtec.Persistence               (→ Domain, Contracts)

├── Microtec.Messaging                 (→ Domain, Contracts)

├── Microtec.PublicApi                 (→ Domain, Contracts)

├── Microtec.Reporting                 (→ Domain, Contracts, Messaging)

├── Microtec.Keycloak                  (→ Domain)

├── Microtec.Attachment.Client         (standalone)

└── Microtec.Notifications.Client      (standalone)

  

TIER 3 (Web):

├── Microtec.Web.Core                  (→ Domain, Contracts, Messaging, Keycloak)

└── Microtec.Web.Hosting               (→ Web.Core, Messaging, Persistence)

  

TIER 4 (Feature Modules):

├── Microtec.Import.Domain             (→ Domain)

├── Microtec.Import.Infrastructure     (→ Import.Domain, Persistence, Reporting)

├── Microtec.Import.Integration        (→ All Import, Domain, Contracts, PublicApi, Messaging)

├── Microtec.Zatca.Infrastructure      (→ Domain, Persistence)

└── Microtec.Zatca.Integration         (→ Zatca.Infrastructure, Domain, Contracts)

```

  

---

  

## 🛠️ Technology Stack

  

| Category | Technologies |

|----------|-------------|

| **Framework** | .NET 8.0, ASP.NET Core 8.0 |

| **Database** | Entity Framework Core 8, SQL Server |

| **CQRS** | MediatR |

| **Messaging** | MassTransit, RabbitMQ |

| **Caching** | Redis (StackExchange.Redis) |

| **Authentication** | JWT Bearer, Keycloak |

| **Reporting** | QuestPDF (PDF), ClosedXML (Excel), QRCoder |

| **Logging** | Serilog (Seq, File, HTTP sinks) |

| **Observability** | OpenTelemetry, Prometheus, Jaeger |

| **Background Jobs** | Hangfire |

| **Validation** | FluentValidation |

| **API Documentation** | Swagger/OpenAPI (Swashbuckle) |

| **Security** | OWASP Headers, HtmlSanitizer |

| **Mapping** | AutoMapper |

| **Resilience** | Polly (retry policies, circuit breakers) |

  

---

  

## 📝 Best Practices

  

### 1. Entity Design

  

```csharp

// ✅ Good - Multi-tenant entity with audit trail

public class Invoice : FullAuditedEntityBase, IMultiTenantEntity

{

    public Guid TenantId { get; set; }

    public string InvoiceNumber { get; set; }

    public decimal Amount { get; set; }

}

  

// ❌ Bad - No audit trail, no multi-tenancy

public class Invoice

{

    public Guid Id { get; set; }

    public string InvoiceNumber { get; set; }

}

```

  

### 2. Service Registration

  

```csharp

// ✅ Good - Auto-registration with marker interface

public class InvoiceService : IInvoiceService, IScopedService { }

  

// ❌ Bad - Manual registration required

public class InvoiceService : IInvoiceService { }

```

  

### 3. Exception Handling

  

```csharp

// ✅ Good - Use standard exceptions

if (invoice == null)

    throw new NotFoundException($"Invoice {id} not found");

  

if (amount < 0)

    throw new BusinessRuleException("Amount cannot be negative");

  

// ❌ Bad - Generic exceptions

throw new Exception("Error occurred");

```

  

### 4. API Responses

  

```csharp

// ✅ Good - Standard response format

return new APIResponse<InvoiceDto>

{

    Data = invoice,

    Success = true,

    Message = "Invoice retrieved successfully"

};

  

// ❌ Bad - Inconsistent response

return invoice;

```

  

### 5. CQRS Pattern

  

```csharp

// ✅ Good - Separate command and query

public class CreateInvoiceCommand : ICommand<Result<Guid>> { }

public class GetInvoiceQuery : IQuery<InvoiceDto> { }

  

// ❌ Bad - Mixed responsibilities

public class InvoiceService

{

    public void CreateInvoice() { }

    public Invoice GetInvoice() { }

}

```

  

---

  

## 📦 NuGet Feed Setup

  

The Microtec packages are hosted on **Azure Artifacts**. For detailed setup instructions, see:

  

**[NUGET-SETUP.md](./NUGET-SETUP.md)** - Complete guide including:

- Personal Access Token (PAT) generation

- Visual Studio / VS Code / Rider configuration

- nuget.config setup

- Azure Artifacts Credential Provider

- CI/CD pipeline configuration

- Troubleshooting

  

### Quick Start

  

```bash

# 1. Install Azure Artifacts Credential Provider

iex "& { $(irm https://aka.ms/install-artifacts-credprovider.ps1) }"

  

# 2. Add the feed

dotnet nuget add source "https://pkgs.dev.azure.com/[organization]/Microtec%20Packages/_packaging/Microtec/nuget/v3/index.json" --name Microtec

  

# 3. Install packages

dotnet add package Microtec.Web.Hosting

```

  

---

  

## 🧪 Build & Test

  

```bash

# Restore and build all packages

dotnet build Microtec.Shared.sln

  

# Build specific package

dotnet build Shared/Microtec.Domain/Microtec.Domain.csproj

  

# Run tests (if available)

dotnet test Microtec.Shared.sln

  

# Pack for NuGet

dotnet pack Microtec.Shared.sln -c Release

```

  

---

  

## 📄 Documentation

  

Each package has comprehensive documentation:

  

- **[Microtec.Domain](Shared/Microtec.Domain/README.md)** - Base entities, interfaces, enums

- **[Microtec.Contracts](Shared/Microtec.Contracts/README.md)** - CQRS, events, DTOs

- **[Microtec.Persistence](Shared/Microtec.Persistence/README.md)** - EF Core, repositories

- **[Microtec.Messaging](Shared/Microtec.Messaging/README.md)** - MassTransit, Redis, events

- **[Microtec.Keycloak](Shared/Microtec.Keycloak/README.md)** - Keycloak integration

- **[Microtec.PublicApi](Shared/Microtec.PublicApi/README.md)** - Service-to-service clients

- **[Microtec.Reporting](Shared/Microtec.Reporting/README.md)** - PDF, Excel, QR codes

- **[Microtec.Attachment.Client](Shared/Microtec.Attachment.Client/README.md)** - Attachment service client

- **[Microtec.Notifications.Client](Shared/Microtec.Notifications.Client/README.md)** - Notification service client

- **[Microtec.Web.Core](Web/Microtec.Web.Core/README.md)** - Middleware, JWT, localization

- **[Microtec.Web.Hosting](Web/Microtec.Web.Hosting/README.md)** - Full API hosting stack

- **[Microtec.Import.*](Import/Microtec.Import.Domain/README.md)** - Data import functionality

- **[Microtec.Zatca.*](Zatca/Microtec.Zatca.Infrastructure/README.md)** - ZATCA e-invoicing

  

**Additional Documentation:**

- **[CLAUDE.md](CLAUDE.md)** - Claude Code AI assistant guidelines

- **[NUGET-SETUP.md](NUGET-SETUP.md)** - NuGet feed configuration

  

---

  

## 🤝 Contributing

  

This is a private repository for Microtec platform packages. For contributions:

  

1. Follow the established architecture patterns

2. Maintain comprehensive documentation

3. Write unit tests for new features

4. Update package READMEs

5. Follow .NET coding conventions

  

---

  

## 📜 License

  

Proprietary - Microtec Platform Team

  

---

  

## 📧 Support

  

For questions or issues, contact the Microtec Platform Team.