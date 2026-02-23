# Contracts API - Test Cases Documentation

  

## 📋 Overview

  

**API Module:** Contract Management System  

**Base URL:** `/v{version}/Contracts`  

**Total Test Cases:** 18  

**Success Scenarios:** 5 | **Failure Scenarios:** 13  

**Coverage:** Complete CRUD operations with validation

  

---

  

## 🎯 API Description

  

The Contracts API manages employee contract lifecycle including creation, retrieval, updates, and deletion. It handles contract metadata, trial periods, position assignments, salary information, and vacation/ticket accruals.

  

**Authentication:** Bearer token required for all operations

  

---

  

## 🔍 Endpoints Overview

  

| Endpoint | Method | Description | Test Cases |

|----------|--------|-------------|------------|

| `/GetAll` | GET | Retrieve paginated contracts | 5 tests |

| `/GetById` | GET | Get contract by ID | 3 tests |

| `/Add` | POST | Create new contract | 5 tests |

| `/Edit` | PUT | Update existing contract | 3 tests |

| `/Delete` | DELETE | Remove contract | 2 tests |

  

---

  

## 🔍 Test Cases by Endpoint

  

<details open>
<summary><strong>📥 GET /v{version}/Contracts/GetAll</strong></summary>
<br>
  
**Description:** Retrieve a paginated list of contracts with optional filters and sorting
  
**Query Parameters:**
- `PageNumber` (required) - Page number for pagination (must be >= 1)
- `PageSize` (required) - Number of records per page (must be >= 1)
- `SearchTerm` (optional) - Filter by employee name or contract details
- `SortBy` (optional) - Field name to sort by
- `SortOrder` (optional) - Sort direction (asc/desc)
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="28%">Test Case Name</th>
<th width="37%">Description</th>
<th width="12%">Expected Result</th>
<th width="8%">Priority</th>
<th width="7%">Category</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-001</strong></td>
<td>GetAll - Happy Path</td>
<td>Get paginated list with PageNumber=1, PageSize=25</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-002</strong></td>
<td>GetAll - With Pagination</td>
<td>Test pagination with PageNumber=2, PageSize=10</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-003</strong></td>
<td>GetAll - With Search</td>
<td>Apply SearchTerm filter to find specific contracts</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-004</strong></td>
<td>GetAll - Missing PageNumber</td>
<td>Request without required PageNumber parameter</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-005</strong></td>
<td>GetAll - Without Authentication</td>
<td>Request without Bearer token</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">401 Unauthorized</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

<details>
<summary><strong>🔎 GET /v{version}/Contracts/GetById</strong></summary>
<br>
  
**Description:** Retrieve detailed information for a specific contract by its unique identifier
  
**Query Parameters:**
- `Id` (required) - Contract GUID identifier
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="28%">Test Case Name</th>
<th width="37%">Description</th>
<th width="12%">Expected Result</th>
<th width="8%">Priority</th>
<th width="7%">Category</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-006</strong></td>
<td>GetById - Happy Path</td>
<td>Get contract details using valid existing ID</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-007</strong></td>
<td>GetById - Invalid GUID Format</td>
<td>Send malformed GUID or invalid format</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-008</strong></td>
<td>GetById - Non-Existent ID</td>
<td>Attempt to get contract with non-existing ID</td>
<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>❌ Failure</td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

<details>
<summary><strong>➕ POST /v{version}/Contracts/Add</strong></summary>
<br>
  
**Description:** Create a new contract record with complete contract details, position, and salary information
  
**Required Fields:**
- `contractDate` (DateTime) - Contract signing date
- `renewalType` (enum) - Automatic/Manual
- `contractType` (enum) - FullTime/PartTime/Temporary
- `contractStartDate` (DateTime) - Contract start date (>= contractDate)
- `employeeId` (GUID) - Employee identifier
- `contractDurationId` (GUID) - Contract duration lookup
- `position` (object) - Job position details
  - `jobId` (GUID) - Job lookup
  - `reportToId` (GUID) - Reporting manager
  - `departmentId` (GUID) - Department lookup
  - `workLocationId` (GUID) - Work location lookup
- `salary` (object) - Salary configuration
  - `paymentFrequency` (enum) - Monthly/Quarterly/etc
  - `paymentMethod` (enum) - Cash/BankTransfer/Check
  - `salaryTemplateId` (GUID) - Salary template lookup
  - `totalSalary` (decimal) - Total salary amount
  
**Optional Fields:**
- `hasTrialPeriod` (boolean) - Enable trial period
- `trialPeriodDayId` (GUID) - Trial period lookup (required if hasTrialPeriod=true)
- `vacationDays` (int) - Annual vacation days (>= 0)
- `vacationAccrualMonths` (int) - Vacation accrual period (> 0)
- `ticketsCount` (int) - Annual tickets count (>= 0)
- `ticketsAccrualMonths` (int) - Tickets accrual period (> 0)
- `noticePeriodDays` (int) - Notice period in days (>= 0)
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="28%">Test Case Name</th>
<th width="37%">Description</th>
<th width="12%">Expected Result</th>
<th width="8%">Priority</th>
<th width="7%">Category</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-009</strong></td>
<td>Add Contract - Happy Path</td>
<td>Create contract with all valid required and optional data</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-010</strong></td>
<td>Add Contract - Missing Required Fields</td>
<td>Submit request without contractDate or employeeId</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-011</strong></td>
<td>Add Contract - Invalid Date Range</td>
<td>contractStartDate before contractDate</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-012</strong></td>
<td>Add Contract - Invalid Trial Period</td>
<td>hasTrialPeriod=true without trialPeriodDayId</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-013</strong></td>
<td>Add Contract - Duplicate Contract</td>
<td>Employee already has active contract</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400/409 Conflict</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

<details>
<summary><strong>✏️ PUT /v{version}/Contracts/Edit</strong></summary>
<br>
  
**Description:** Update existing contract information (requires rowVersion for concurrency control)
  
**Required Fields:** Same as Add endpoint, plus:
- `id` (GUID) - Contract identifier
- `rowVersion` (string) - Concurrency control token
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="28%">Test Case Name</th>
<th width="37%">Description</th>
<th width="12%">Expected Result</th>
<th width="8%">Priority</th>
<th width="7%">Category</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-014</strong></td>
<td>Edit Contract - Happy Path</td>
<td>Update contract with valid data and correct rowVersion</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-015</strong></td>
<td>Edit Contract - Missing RowVersion</td>
<td>Request without required rowVersion field</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-016</strong></td>
<td>Edit Contract - Non-Existent ID</td>
<td>Attempt to update contract with non-existing ID</td>
<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>❌ Failure</td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

<details>
<summary><strong>🗑️ DELETE /v{version}/Contracts/Delete</strong></summary>
<br>
  
**Description:** Soft delete a contract record from the system
  
**Query Parameters:**
- `Id` (required) - Contract GUID identifier to delete
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="28%">Test Case Name</th>
<th width="37%">Description</th>
<th width="12%">Expected Result</th>
<th width="8%">Priority</th>
<th width="7%">Category</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-017</strong></td>
<td>Delete - Happy Path</td>
<td>Delete existing contract with valid ID</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>✅ Success</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-018</strong></td>
<td>Delete - Non-Existent ID</td>
<td>Attempt to delete contract with non-existing ID</td>
<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>❌ Failure</td>
</tr>
</tbody>
</table>
  
</details>

  

---

  
  

---

  

## 📊 Test Summary

  

<table>

<thead>

<tr style="background-color: #0078d4; color: white;">

<th>Metric</th>

<th>Count</th>

</tr>

</thead>

<tbody>

<tr>

<td><strong>Total Test Cases</strong></td>

<td>18</td>

</tr>

<tr>

<td><strong>GET Endpoints</strong></td>

<td>8 tests (5 GetAll + 3 GetById)</td>

</tr>

<tr>

<td><strong>POST Endpoints</strong></td>

<td>5 tests</td>

</tr>

<tr>

<td><strong>PUT Endpoints</strong></td>

<td>3 tests</td>

</tr>

<tr>

<td><strong>DELETE Endpoints</strong></td>

<td>2 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Priority 1 (P1) Cases</strong></td>

<td>12 tests</td>

</tr>

<tr style="background-color: #fff3e0;">

<td><strong>Priority 2 (P2) Cases</strong></td>

<td>6 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Success Cases</strong></td>

<td>5 tests</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>Failure Cases</strong></td>

<td>13 tests</td>

</tr>

</tbody>

</table>

  

---

  


  

**Last Updated:** December 22, 2025  

**Maintained By:** QA Team  

**Version:** 1.0