# Namespace Mapping Reference

This document provides a mapping between the old `Shared.*` namespaces and the new `Microtec.*` namespaces for migration reference.

## Core Packages

### Shared.Core → Microtec.Domain

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Core` | `Microtec.Domain` |
| `Shared.Core.Base` | `Microtec.Domain.Base` |
| `Shared.Core.Models` | `Microtec.Domain.Models` |
| `Shared.Core.Interfaces` | `Microtec.Domain.Interfaces` |
| `Shared.Core.Enums` | `Microtec.Domain.Enums` |
| `Shared.Core.Constants` | `Microtec.Domain.Constants` |
| `Shared.Core.Exceptions` | `Microtec.Domain.Exceptions` |
| `Shared.Core.Exceptions.Constants` | `Microtec.Domain.Exceptions.Constants` |
| `Shared.Core.Extensions` | `Microtec.Domain.Extensions` |
| `Shared.Core.TenantProviders` | `Microtec.Domain.TenantProviders` |
| `Shared.Core.Attributes` | `Microtec.Domain.Attributes` |
| `Shared.Core.Helpers` | `Microtec.Domain.Helpers` |

### Shared.Core → Microtec.Contracts (DTOs & CQRS)

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Core.Dtos` | `Microtec.Contracts.Dtos` |
| `Shared.Core.Dtos.Common` | `Microtec.Contracts.Dtos.Common` |
| `Shared.Core.Dtos.Pagination` | `Microtec.Contracts.Dtos.Pagination` |
| `Shared.Core.CQRS` | `Microtec.Contracts.CQRS` |
| `Shared.Core.CQRS.Command` | `Microtec.Contracts.CQRS.Command` |
| `Shared.Core.CQRS.Query` | `Microtec.Contracts.CQRS.Query` |

### Shared.Core → Microtec.PublicApi (Service-to-Service)

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Core.PublicApi` | `Microtec.PublicApi` |
| `Shared.Core.PublicApi.Attachment` | `Microtec.PublicApi.Attachment` |
| `Shared.Core.PublicApi.Common` | `Microtec.PublicApi.Common` |

### Platform.PublicApi.AppsPortal → Microtec.PublicApi.AppsPortal

| Old Namespace | New Namespace |
|---------------|---------------|
| `Platform.PublicApi.AppsPortal` | `Microtec.PublicApi.AppsPortal` |
| `Platform.PublicApi.AppsPortal.Accounting` | `Microtec.PublicApi.AppsPortal.Accounting` |
| `Platform.PublicApi.AppsPortal.Accounting.Dtos` | `Microtec.PublicApi.AppsPortal.Accounting.Dtos` |
| `Platform.PublicApi.AppsPortal.Accounting.Dtos.ChartOfAccounts` | `Microtec.PublicApi.AppsPortal.Accounting.Dtos.ChartOfAccounts` |
| `Platform.PublicApi.AppsPortal.Accounting.Dtos.JournalEntries` | `Microtec.PublicApi.AppsPortal.Accounting.Dtos.JournalEntries` |
| `Platform.PublicApi.AppsPortal.Finance` | `Microtec.PublicApi.AppsPortal.Finance` |
| `Platform.PublicApi.AppsPortal.Finance.Dtos` | `Microtec.PublicApi.AppsPortal.Finance.Dtos` |
| `Platform.PublicApi.AppsPortal.GeneralSettings` | `Microtec.PublicApi.AppsPortal.GeneralSettings` |
| `Platform.PublicApi.AppsPortal.GeneralSettings.Dtos` | `Microtec.PublicApi.AppsPortal.GeneralSettings.Dtos` |
| `Platform.PublicApi.AppsPortal.GeneralSettings.Dtos.Sequence` | `Microtec.PublicApi.AppsPortal.GeneralSettings.Dtos.Sequence` |
| `Platform.PublicApi.AppsPortal.GeneralSettings.Dtos.Tax` | `Microtec.PublicApi.AppsPortal.GeneralSettings.Dtos.Tax` |
| `Platform.PublicApi.AppsPortal.GeneralSettings.Dtos.GeneralSettingRestClientDtos` | `Microtec.PublicApi.AppsPortal.GeneralSettings.Dtos.GeneralSettingRestClientDtos` |
| `Platform.PublicApi.AppsPortal.Inventory` | `Microtec.PublicApi.AppsPortal.Inventory` |
| `Platform.PublicApi.AppsPortal.Inventory.Dtos` | `Microtec.PublicApi.AppsPortal.Inventory.Dtos` |
| `Platform.PublicApi.AppsPortal.Purchase` | `Microtec.PublicApi.AppsPortal.Purchase` |
| `Platform.PublicApi.AppsPortal.Purchase.Dtos` | `Microtec.PublicApi.AppsPortal.Purchase.Dtos` |
| `Platform.PublicApi.AppsPortal.Sales` | `Microtec.PublicApi.AppsPortal.Sales` |
| `Platform.PublicApi.AppsPortal.Sales.Dtos` | `Microtec.PublicApi.AppsPortal.Sales.Dtos` |
| `Platform.PublicApi.AppsPortal.VanSale` | `Microtec.PublicApi.AppsPortal.VanSale` |
| `Platform.PublicApi.AppsPortal.VanSale.Dtos` | `Microtec.PublicApi.AppsPortal.VanSale.Dtos` |

## Infrastructure Packages

### Shared.Infrastructure → Microtec.Persistence (Data Access)

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Infrastructure.Base` | `Microtec.Persistence.Base` |
| `Shared.Infrastructure.Extensions` | `Microtec.Persistence.Extensions` |
| `Shared.Infrastructure.Interceptors` | `Microtec.Persistence.Interceptors` |

### Shared.Infrastructure → Microtec.Messaging (Caching & Events)

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Infrastructure.Services` | `Microtec.Messaging.Services` |
| `Shared.Infrastructure.Services.CacheService` | `Microtec.Messaging.Services.CacheService` |
| `Shared.Infrastructure.Services.EventPublisher` | `Microtec.Messaging.Services.EventPublisher` |

### Shared.Infrastructure → Microtec.Reporting (Reports & QR)

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Infrastructure.GenerateQRCode` | `Microtec.Reporting.GenerateQRCode` |
| `Shared.Infrastructure.GenerateReport` | `Microtec.Reporting.GenerateReport` |
| `Shared.Infrastructure.GenerateReport.Excel` | `Microtec.Reporting.GenerateReport.Excel` |
| `Shared.Infrastructure.GenerateReport.Pdf` | `Microtec.Reporting.GenerateReport.Pdf` |
| `Shared.Infrastructure.GenerateReport.Pdf.Components` | `Microtec.Reporting.GenerateReport.Pdf.Components` |
| `Shared.Infrastructure.GenerateReport.Pdf.Configuration` | `Microtec.Reporting.GenerateReport.Pdf.Configuration` |
| `Shared.Infrastructure.GenerateReport.Pdf.Templates` | `Microtec.Reporting.GenerateReport.Pdf.Templates` |

## Web Packages

### Shared.Web → Microtec.Web.Core

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Web` | `Microtec.Web.Core` |
| `Shared.Web.Authentication` | `Microtec.Web.Core.Authentication` |
| `Shared.Web.Authorization` | `Microtec.Web.Core.Authorization` |
| `Shared.Web.Base` | `Microtec.Web.Core.Base` |
| `Shared.Web.Common` | `Microtec.Web.Core.Common` |
| `Shared.Web.Filters` | `Microtec.Web.Core.Filters` |
| `Shared.Web.Localization` | `Microtec.Web.Core.Localization` |
| `Shared.Web.Middleware` | `Microtec.Web.Core.Middleware` |
| `Shared.Web.Options` | `Microtec.Web.Core.Options` |
| `Shared.Web.Security.Services` | `Microtec.Web.Core.Security.Services` |

### Shared.Web → Microtec.Web.Hosting

| Old Namespace | New Namespace |
|---------------|---------------|
| `Shared.Web.Extensions` | `Microtec.Web.Hosting.Extensions` |
| `Shared.Web.OptionsSetup` | `Microtec.Web.Hosting.OptionsSetup` |
| `Shared.Web.OptionsSetup.ApiUrls` | `Microtec.Web.Hosting.OptionsSetup.ApiUrls` |
| `Shared.Web.OptionsSetup.Mail` | `Microtec.Web.Hosting.OptionsSetup.Mail` |
| `Shared.Web.OptionsSetup.Redis` | `Microtec.Web.Hosting.OptionsSetup.Redis` |

## Import Packages

### Import.* → Microtec.Import.*

| Old Namespace | New Namespace |
|---------------|---------------|
| `Import.Domain` | `Microtec.Import.Domain` |
| `Import.Domain.Common` | `Microtec.Import.Domain.Common` |
| `Import.Domain.Entities` | `Microtec.Import.Domain.Entities` |
| `Import.Domain.Enums` | `Microtec.Import.Domain.Enums` |
| `Import.Domain.Interfaces` | `Microtec.Import.Domain.Interfaces` |
| `Import.Domain.Interfaces.BackgroundJob` | `Microtec.Import.Domain.Interfaces.BackgroundJob` |
| `Import.Domain.Interfaces.Repositories` | `Microtec.Import.Domain.Interfaces.Repositories` |
| `Import.Domain.Interfaces.Services` | `Microtec.Import.Domain.Interfaces.Services` |
| `Import.Infrastructure` | `Microtec.Import.Infrastructure` |
| `Import.Infrastructure.Db` | `Microtec.Import.Infrastructure.Db` |
| `Import.Infrastructure.Db.Configurations` | `Microtec.Import.Infrastructure.Db.Configurations` |
| `Import.Infrastructure.Db.Repositories` | `Microtec.Import.Infrastructure.Db.Repositories` |
| `Import.Infrastructure.FileHandlers` | `Microtec.Import.Infrastructure.FileHandlers` |
| `Import.Infrastructure.Storage` | `Microtec.Import.Infrastructure.Storage` |
| `Import.Integration` | `Microtec.Import.Integration` |
| `Import.Integration.BackgroundJob` | `Microtec.Import.Integration.BackgroundJob` |
| `Import.Integration.Configuration` | `Microtec.Import.Integration.Configuration` |
| `Import.Integration.Helpers` | `Microtec.Import.Integration.Helpers` |
| `Import.Integration.Interfaces` | `Microtec.Import.Integration.Interfaces` |
| `Import.Integration.Models` | `Microtec.Import.Integration.Models` |
| `Import.Integration.Models.Commands` | `Microtec.Import.Integration.Models.Commands` |
| `Import.Integration.Models.Queries` | `Microtec.Import.Integration.Models.Queries` |
| `Import.Integration.Strategies` | `Microtec.Import.Integration.Strategies` |
| `Import.Integration.Strategies.Services` | `Microtec.Import.Integration.Strategies.Services` |

## Zatca Packages

### Zatca.* → Microtec.Zatca.*

| Old Namespace | New Namespace |
|---------------|---------------|
| `Zatca.Infrastructure` | `Microtec.Zatca.Infrastructure` |
| `Zatca.Infrastructure.Db` | `Microtec.Zatca.Infrastructure.Db` |
| `Zatca.Infrastructure.Db.Configurations` | `Microtec.Zatca.Infrastructure.Db.Configurations` |
| `Zatca.Infrastructure.Entities` | `Microtec.Zatca.Infrastructure.Entities` |
| `Zatca.Integration` | `Microtec.Zatca.Integration` |
| `Zatca.Integration.Auth` | `Microtec.Zatca.Integration.Auth` |
| `Zatca.Integration.Configurations` | `Microtec.Zatca.Integration.Configurations` |
| `Zatca.Integration.Dtos` | `Microtec.Zatca.Integration.Dtos` |
| `Zatca.Integration.Dtos.Invoices` | `Microtec.Zatca.Integration.Dtos.Invoices` |
| `Zatca.Integration.Dtos.Response` | `Microtec.Zatca.Integration.Dtos.Response` |
| `Zatca.Integration.Enums` | `Microtec.Zatca.Integration.Enums` |
| `Zatca.Integration.Enums.Converters` | `Microtec.Zatca.Integration.Enums.Converters` |
| `Zatca.Integration.Services` | `Microtec.Zatca.Integration.Services` |

## Assembly Markers

| Old Assembly Marker | New Assembly Marker |
|---------------------|---------------------|
| `SharedCoreAssembly.AssemblyName` | `MicrotecDomainAssembly.AssemblyName` |
| `SharedInfrastructureAssembly.AssemblyName` | `MicrotecContractsAssembly.AssemblyName` |
| `SharedWebAssembly.AssemblyName` | `MicrotecWebCoreAssembly.AssemblyName` |
| `ImportDomain.AssemblyName` | `MicrotecImportDomainAssembly.AssemblyName` |
| `ImportInfrastructure.AssemblyName` | `MicrotecImportInfrastructureAssembly.AssemblyName` |
| `ImportApplication.AssemblyName` | `MicrotecImportIntegrationAssembly.AssemblyName` |
| `ZatcaInfrastructure.AssemblyName` | `MicrotecZatcaInfrastructureAssembly.AssemblyName` |
| `ZatcaIntegration.AssemblyName` | `MicrotecZatcaIntegrationAssembly.AssemblyName` |
| N/A (new package) | `MicrotecPublicApiAppsPortalAssembly.AssemblyName` |

## Common Using Statement Conversions

```csharp
// Old
using Shared.Core.Base;
using Shared.Core.Interfaces;
using Shared.Core.Models;
using Shared.Core.Extensions;
using Shared.Core.TenantProviders;
using Shared.Core.Constants;
using Shared.Core.Exceptions;
using Shared.Infrastructure.Base;
using Shared.Infrastructure.Extensions;
using Shared.Infrastructure.Interceptors;
using Shared.Infrastructure.Services;
using Shared.Infrastructure.GenerateReport.Excel;
using Shared.Web.Middleware;
using Shared.Web.Extensions;

// New
using Microtec.Domain.Base;
using Microtec.Domain.Interfaces;
using Microtec.Domain.Models;
using Microtec.Domain.Extensions;
using Microtec.Domain.TenantProviders;
using Microtec.Domain.Constants;
using Microtec.Domain.Exceptions;
using Microtec.Persistence.Base;
using Microtec.Persistence.Extensions;
using Microtec.Persistence.Interceptors;
using Microtec.Messaging.Services;
using Microtec.Reporting.GenerateReport.Excel;
using Microtec.Web.Core.Middleware;
using Microtec.Web.Hosting.Extensions;
```

## Project Reference Conversions

```xml
<!-- Old -->
<ProjectReference Include="..\Shared\Shared.Core\Shared.Core.csproj" />
<ProjectReference Include="..\Shared\Shared.Infrastructure\Shared.Infrastructure.csproj" />
<ProjectReference Include="..\Shared\Shared.Web\Shared.Web.csproj" />

<!-- New (choose based on what you need) -->
<ProjectReference Include="..\Shared\Microtec.Domain\Microtec.Domain.csproj" />
<ProjectReference Include="..\Shared\Microtec.Contracts\Microtec.Contracts.csproj" />
<ProjectReference Include="..\Shared\Microtec.PublicApi\Microtec.PublicApi.csproj" />
<ProjectReference Include="..\Shared\Microtec.PublicApi.AppsPortal\Microtec.PublicApi.AppsPortal.csproj" />
<ProjectReference Include="..\Shared\Microtec.Persistence\Microtec.Persistence.csproj" />
<ProjectReference Include="..\Shared\Microtec.Messaging\Microtec.Messaging.csproj" />
<ProjectReference Include="..\Shared\Microtec.Reporting\Microtec.Reporting.csproj" />
<ProjectReference Include="..\Shared\Microtec.Web.Core\Microtec.Web.Core.csproj" />
<ProjectReference Include="..\Shared\Microtec.Web.Hosting\Microtec.Web.Hosting.csproj" />
```

## Package Dependency Hierarchy

```
Microtec.Domain (no dependencies)
    ↓
Microtec.Contracts (depends on Microtec.Domain)
    ↓
Microtec.PublicApi (depends on Microtec.Domain, Microtec.Contracts)
Microtec.PublicApi.AppsPortal (depends on Microtec.Domain, Microtec.Contracts)
Microtec.Persistence (depends on Microtec.Domain, Microtec.Contracts)
Microtec.Messaging (depends on Microtec.Domain, Microtec.Contracts)
Microtec.Reporting (depends on Microtec.Domain, Microtec.Contracts, Microtec.Messaging)
    ↓
Microtec.Web.Core (depends on Microtec.Domain, Microtec.Contracts, Microtec.Messaging)
    ↓
Microtec.Web.Hosting (depends on Microtec.Web.Core, Microtec.Messaging, Microtec.Persistence)
```

## Import & Zatca Package Dependencies

```
Microtec.Import.Domain (depends on Microtec.Domain)
    ↓
Microtec.Import.Infrastructure (depends on Microtec.Import.Domain, Microtec.Persistence, Microtec.Reporting)
    ↓
Microtec.Import.Integration (depends on all Import packages + Microtec.Web.Hosting)

Microtec.Zatca.Infrastructure (depends on Microtec.Domain, Microtec.Persistence)
    ↓
Microtec.Zatca.Integration (depends on Microtec.Zatca.Infrastructure, Microtec.Domain, Microtec.Contracts)
```
