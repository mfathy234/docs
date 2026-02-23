# Employees API - Test Cases Documentation

  

## 📋 Overview

  

**API Module:** Employee Management System  

**Base URL:** `/v{version}/Employees`  

**Total Test Cases:** 15  

**Success Scenarios:** 6 | **Failure Scenarios:** 9

  

---

  

## 📥 GET /v{version}/Employees/GetAll

  

**Description:** Retrieve paginated list of employees with optional search and sorting

  

**Query Parameters:**

- `PageNumber` (required) - Page number for pagination

- `PageSize` (required) - Number of records per page

- `SearchTerm` (optional) - Filter by employee name

- `Gender` (optional) - Filter by gender (Male/Female)

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

<td>Get paginated list with valid PageNumber=1, PageSize=25</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-002</strong></td>

<td>GetAll - With Filters</td>

<td>Apply SearchTerm="ahmed" and Gender=Male filters</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-003</strong></td>

<td>GetAll - Invalid Pagination</td>

<td>Send invalid PageNumber=0, PageSize=-5</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

---

  

## 🔎 GET /v{version}/Employees/GetById

  

**Description:** Retrieve detailed information for a specific employee by their unique identifier

  

**Query Parameters:**

- `Id` (required) - Employee GUID identifier

  

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

<td><strong>TC-004</strong></td>

<td>GetById - Happy Path</td>

<td>Get employee details using valid existing ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-005</strong></td>

<td>GetById - Non-Existent ID</td>

<td>Attempt to get employee with fake/invalid ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

---

  

## ➕ POST /v{version}/Employees/Add

  

**Description:** Create a new employee record in the system

  

**Required Fields:** nameEn, nameAr, email, gender, maritalStatus, dateOfBirth, nationalId

  

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

<td>Add Employee - Happy Path</td>

<td>Create employee with all valid required data</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-007</strong></td>

<td>Add Employee - Missing Required</td>

<td>Submit request without required field (nameEn)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-008</strong></td>

<td>Add Employee - Invalid Enum</td>

<td>Send invalid enum values for Gender/MaritalStatus</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-009</strong></td>

<td>Add Employee - Duplicate Data</td>

<td>Attempt to add employee with existing email/nationalId</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400/409 Conflict</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

---

  

## ✏️ PUT /v{version}/Employees/Edit

  

**Description:** Update existing employee information (requires rowVersion for concurrency control)

  

**Required Fields:** id, rowVersion, nameEn, nameAr, email, gender, maritalStatus, dateOfBirth, nationalId

  

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

<td><strong>TC-010</strong></td>

<td>Edit Employee - Happy Path</td>

<td>Update employee with valid data and correct rowVersion</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-011</strong></td>

<td>Edit Employee - Invalid Data</td>

<td>Submit invalid email format or missing required fields</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

---

  

## 🗑️ DELETE /v{version}/Employees/Delete

  

**Description:** Soft delete an employee record from the system

  

**Query Parameters:**

- `Id` (required) - Employee GUID identifier to delete

  

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

<td><strong>TC-012</strong></td>

<td>Delete - Happy Path</td>

<td>Delete existing employee with valid ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-013</strong></td>

<td>Delete - Non-Existent ID</td>

<td>Attempt to delete employee with invalid/fake ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-014</strong></td>

<td>Delete - Already Deleted</td>

<td>Try to delete the same employee twice</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-015</strong></td>

<td>Delete - Without Authorization</td>

<td>Delete request without Bearer authentication token</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">401 Unauthorized</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

---

  

## 🔐 Authentication

  

**All endpoints require Bearer token authentication**

  

**Header:** `Authorization: Bearer {token}`

  

---

  

## 📝 Common Error Codes

  

| Code | Message | Description |

|------|---------|-------------|

| **4001** | Validation Error | Request data validation failed |

| **4004** | Not Found | Resource not found |

| **4009** | Conflict | Duplicate or conflicting data |

| **4011** | Unauthorized | Missing or invalid authentication |

| **5000** | Internal Server Error | Unexpected server error |

  

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

<td>15</td>

</tr>

<tr>

<td><strong>GET Endpoints</strong></td>

<td>5 tests</td>

</tr>

<tr>

<td><strong>POST Endpoints</strong></td>

<td>4 tests</td>

</tr>

<tr>

<td><strong>PUT Endpoints</strong></td>

<td>2 tests</td>

</tr>

<tr>

<td><strong>DELETE Endpoints</strong></td>

<td>4 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Priority 1 (P1)</strong></td>

<td>8 tests</td>

</tr>

<tr style="background-color: #fff3e0;">

<td><strong>Priority 2 (P2)</strong></td>

<td>7 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Success Cases</strong></td>

<td>6 tests</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>Failure Cases</strong></td>

<td>9 tests</td>

</tr>

</tbody>

</table>

  

---

  

## 🧪 Testing Notes

  

### Pre-requisites

- ✅ Valid authentication token

- ✅ Test data seeded in database

- ✅ Valid employee IDs for GetById/Edit/Delete operations

  

### Data Cleanup

- 🔄 Delete test employees after test execution

- 🔄 Reset auto-increment counters if needed

  

### Performance Benchmarks

- ⚡ GetAll response time: < 500ms for 1000 records

- ⚡ GetById response time: < 100ms

- ⚡ Add/Edit/Delete: < 200ms

  

---

  

**Last Updated:** December 22, 2025  

**Maintained By:** QA Team  

**Version:** 1.0