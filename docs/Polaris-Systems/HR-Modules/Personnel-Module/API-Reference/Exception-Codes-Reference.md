# Exception Codes Reference

This document provides a reference for all exception codes returned by the API. Frontend developers can use these codes to display appropriate error messages to users.

## Code Ranges

- **1000-1999**: CRM Integration Errors
- **3000-3999**: General Business Logic Errors
- **4000-4999**: Validation Errors
- **5000-5999**: System Errors
- **6000-6999**: Authentication & Authorization Errors
- **7000-7999**: Deletion Errors
- **8000-8999**: Balance/Financial Errors
- **9000-9999**: Business Rule Violations

---

## CRM Integration Errors (1000-1999)

| Code | Name | Description |
|------|------|-------------|
| 1001 | `CrmConnectionFailed` | Failed to connect to CRM system |
| 1002 | `CrmOperationFailed` | CRM operation failed |

---

## General Business Logic Errors (3000-3999)

| Code | Name | Description |
|------|------|-------------|
| 3001 | `NotFound` | The requested resource was not found |
| 3002 | `CaptchaNotValid` | The captcha validation failed |
| 3003 | `CaptchaGenerationError` | Error generating captcha |
| 3004 | `QrGenerationError` | Error generating QR code |
| 3005 | `AlreadyExist` | The resource already exists (duplicate entry) |
| 3006 | `InvalidData` | The provided data is invalid |
| 3007 | `IdentityCreationFaild` | Failed to create user identity |
| 3008 | `InvalidOperation` | The requested operation is invalid |

---

## Validation Errors (4000-4999)

| Code | Name | Description |
|------|------|-------------|
| 4001 | `FluentValidation` | FluentValidation validation failed (check ValidationErrors array) |
| 4002 | `ModelStateValidation` | Model state validation failed |
| 4003 | `XssViolation` | Cross-site scripting (XSS) violation detected |

---

## System Errors (5000-5999)

| Code | Name | Description |
|------|------|-------------|
| 5001 | `Unhandled` | An unhandled exception occurred |
| 5003 | `Unhealthy` | The system is unhealthy or unavailable |

---

## Authentication & Authorization Errors (6000-6999)

| Code | Name | Description |
|------|------|-------------|
| 6000 | `Unauthorized` | User is not authenticated |
| 6001 | `Forbidden` | User is authenticated but not authorized for this action |
| 6002 | `InvalidCredentials` | Invalid username or password |
| 6003 | `DisabledRoute` | The requested route is disabled |

---

## Deletion Errors (7000-7999)

| Code | Name | Description |
|------|------|-------------|
| 7000 | `DeleteFailed` | Failed to delete the resource (likely due to dependencies) |

---

## Balance/Financial Errors (8000-8999)

| Code | Name | Description |
|------|------|-------------|
| 8000 | `InvalidBalance` | Invalid balance calculation or amount |

---

## Business Rule Violations (9000-9999)

### Sequence & Configuration (9000-9004)

| Code | Name | Description |
|------|------|-------------|
| 9000 | `NoSequenceConfiguration` | No sequence configuration found |
| 9001 | `MaxSequenceReached` | Maximum sequence number has been reached |
| 9002 | `CostIsZero` | Cost cannot be zero |
| 9003 | `PostedStatusRequired` | Record must be in posted status |
| 9004 | `SequenceExist` | Sequence already exists |

### Entity Relationships (9005-9008)

| Code | Name | Description |
|------|------|-------------|
| 9005 | `JobRelatedWithPositions` | Cannot delete job because it's related to positions |
| 9006 | `DepartmentRelatedWithEmployees` | Cannot delete department because it has employees |
| 9007 | `DepartmentRelatedWithAnotherDepartment` | Cannot delete department because it's related to another department |
| 9008 | `WorklocationRelatedWithPositions` | Cannot delete work location because it's related to positions |

### Contract Rules (9009-9018)

| Code | Name | Description |
|------|------|-------------|
| 9009 | `ContractShouldHavePosition` | Contract must have a position assigned |
| 9010 | `ContractShouldHaveSalary` | Contract must have a salary configuration |
| 9011 | `CantRenewDraftedContract` | Cannot renew a contract that is in draft status |
| 9012 | `CantUpgradeDraftedContract` | Cannot upgrade a contract that is in draft status |
| 9013 | `LastRecordEndDateExceedsContractEndDate` | Last record's end date exceeds the contract end date |
| 9014 | `StartDateCannotBeBeforeContractStartDate` | Start date cannot be before the contract start date |
| 9015 | `StartDateCannotBeAfterContractEndDate` | Start date cannot be after the contract end date |
| 9016 | `SalaryOrPositionShouldHaveValue` | Either salary or position must have a value |
| 9017 | `EmployeeAlreadyHasContract` | Employee already has an active contract |
| 9018 | `DraftedContractOnlyCanEdit` | Only drafted contracts can be edited |

### Salary & Template Rules (9019-9021)

| Code | Name | Description |
|------|------|-------------|
| 9019 | `SalaryTemplateRelatedWithContracts` | Cannot delete salary template because it's related to contracts |
| 9020 | `InvalidCalculationFormula` | The calculation formula is invalid |
| 9021 | `SalaryItemRelatedWithSalaryTemplateItem` | Cannot delete salary item because it's related to salary template items |

### Employee Rules (9022-9023)

| Code | Name | Description |
|------|------|-------------|
| 9022 | `EmoployeeShouldReportToAnotherEmployee` | Employee must report to another employee |
| 9023 | `EmployeeHasnotContract` | Employee does not have a contract |

### Record Status Rules (9024-9027)

| Code | Name | Description |
|------|------|-------------|
| 9024 | `CantEditOrDeletePostedRecord` | Cannot edit or delete a record that has been posted |
| 9025 | `LoanAmountExceedsLimit` | Loan amount exceeds the allowed limit |
| 9026 | `InstallmentAmountExceedsSalary` | Installment amount exceeds the employee's salary |
| 9027 | `RecordPostedBefore` | Record was already posted previously |

### Dependency & Workflow Rules (9028-9029)

| Code | Name | Description |
|------|------|-------------|
| 9028 | `TheNewItemDependOnAnotherItemYouDontSelectedYet` | The new item depends on another item that hasn't been selected yet |
| 9029 | `EmploymentCommencementPosted` | Employment commencement has already been posted |

---

## Notes

- **4001 (FluentValidation)**: When this code is returned, check the `validationErrors` array in the response for field-specific error messages.
- **6000-6003**: These codes typically correspond to HTTP status codes (401, 403) but provide more specific context.
- **9000-9029**: These are business rule violations that require user action or correction of data.

---

## TypeScript Enum

Copy this enum into your frontend TypeScript/JavaScript project:

```typescript
export enum ExceptionCodes {
  // CRM Integration Errors (1000-1999)
  CrmConnectionFailed = 1001,
  CrmOperationFailed = 1002,

  // General Business Logic Errors (3000-3999)
  NotFound = 3001,
  CaptchaNotValid = 3002,
  CaptchaGenerationError = 3003,
  QrGenerationError = 3004,
  AlreadyExist = 3005,
  InvalidData = 3006,
  IdentityCreationFaild = 3007,
  InvalidOperation = 3008,

  // Validation Errors (4000-4999)
  FluentValidation = 4001,
  ModelStateValidation = 4002,
  XssViolation = 4003,

  // System Errors (5000-5999)
  Unhandled = 5001,
  Unhealthy = 5003,

  // Authentication & Authorization Errors (6000-6999)
  Unauthorized = 6000,
  Forbidden = 6001,
  InvalidCredentials = 6002,
  DisabledRoute = 6003,

  // Deletion Errors (7000-7999)
  DeleteFailed = 7000,

  // Balance/Financial Errors (8000-8999)
  InvalidBalance = 8000,

  // Business Rule Violations (9000-9999)
  // Sequence & Configuration
  NoSequenceConfiguration = 9000,
  MaxSequenceReached = 9001,
  CostIsZero = 9002,
  PostedStatusRequired = 9003,
  SequenceExist = 9004,

  // Entity Relationships
  JobRelatedWithPositions = 9005,
  DepartmentRelatedWithEmployees = 9006,
  DepartmentRelatedWithAnotherDepartment = 9007,
  WorklocationRelatedWithPositions = 9008,

  // Contract Rules
  ContractShouldHavePosition = 9009,
  ContractShouldHaveSalary = 9010,
  CantRenewDraftedContract = 9011,
  CantUpgradeDraftedContract = 9012,
  LastRecordEndDateExceedsContractEndDate = 9013,
  StartDateCannotBeBeforeContractStartDate = 9014,
  StartDateCannotBeAfterContractEndDate = 9015,
  SalaryOrPositionShouldHaveValue = 9016,
  EmployeeAlreadyHasContract = 9017,
  DraftedContractOnlyCanEdit = 9018,

  // Salary & Template Rules
  SalaryTemplateRelatedWithContracts = 9019,
  InvalidCalculationFormula = 9020,
  SalaryItemRelatedWithSalaryTemplateItem = 9021,

  // Employee Rules
  EmoployeeShouldReportToAnotherEmployee = 9022,
  EmployeeHasnotContract = 9023,

  // Record Status Rules
  CantEditOrDeletePostedRecord = 9024,
  LoanAmountExceedsLimit = 9025,
  InstallmentAmountExceedsSalary = 9026,
  RecordPostedBefore = 9027,

  // Dependency & Workflow Rules
  TheNewItemDependOnAnotherItemYouDontSelectedYet = 9028,
  EmploymentCommencementPosted = 9029
}
```

### Usage Example

```typescript
import { ExceptionCodes } from './enums/ExceptionCodes';

// Handle error responses
if (error.response?.data?.messageCode === ExceptionCodes.NotFound) {
  showError('The requested item was not found');
} else if (error.response?.data?.messageCode === ExceptionCodes.EmployeeAlreadyHasContract) {
  showError('This employee already has an active contract');
} else if (error.response?.data?.messageCode === ExceptionCodes.FluentValidation) {
  // FluentValidation errors
  const validationErrors = error.response?.data?.validationErrors;
  // Display field-specific validation errors
}
```

