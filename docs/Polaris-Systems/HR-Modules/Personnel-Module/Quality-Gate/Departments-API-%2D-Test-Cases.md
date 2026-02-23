# Departments API - Test Cases Documentation

  

## 📋 Overview

  

**API Module:** Department Management System  

**Base URL:** `/v{version}/Departments`  

**Total Test Cases:** 21  

**Success Scenarios:** 7 | **Failure Scenarios:** 14

  

---

  

## 🔍 Endpoints

  

<details open>

<summary><strong>📥 GET /v{version}/Departments/GetAll</strong></summary>

<br>

  

**Description:** Retrieve a paginated list of departments with search and sorting capabilities

  

**Query Parameters:**

- `PageNumber` (required) - Page number for pagination

- `PageSize` (required) - Number of records per page

- `SearchTerm` (optional) - Filter by department name/code

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

<td>Get paginated list with valid parameters</td>

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

<td>GetAll - With Sorting</td>

<td>Apply sorting by department name (asc/desc)</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-004</strong></td>

<td>GetAll - With Search</td>

<td>Apply SearchTerm filter to find specific departments</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-005</strong></td>

<td>GetAll - Invalid Pagination</td>

<td>Send invalid PageNumber=0 or PageSize=-5</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>🔎 GET /v{version}/Departments/GetById</strong></summary>

<br>

  

**Description:** Retrieve detailed information for a specific department by its unique identifier

  

**Query Parameters:**

- `Id` (required) - Department GUID identifier

  

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

<td>Get department details using valid existing ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-007</strong></td>

<td>GetById - Invalid ID Format</td>

<td>Send malformed GUID or invalid format</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-008</strong></td>

<td>GetById - Non-Existent ID</td>

<td>Attempt to get department with fake/invalid ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>➕ POST /v{version}/Departments/Add</strong></summary>

<br>

  

**Description:** Create a new department record in the system

  

**Required Fields:** departmentCode, departmentNameEn, departmentNameAr

  

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

<td>Add Department - Happy Path</td>

<td>Create department with all valid required data</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-010</strong></td>

<td>Add Department - Missing Required</td>

<td>Submit request without required fields</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-011</strong></td>

<td>Add Department - Duplicate Code</td>

<td>Attempt to add department with existing code</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400/409 Conflict</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-012</strong></td>

<td>Add Department - Invalid Data Types</td>

<td>Send incorrect data types for fields</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>✏️ PUT /v{version}/Departments/Edit</strong></summary>

<br>

  

**Description:** Update existing department information (requires rowVersion for concurrency control)

  

**Required Fields:** id, rowVersion, departmentCode, departmentNameEn, departmentNameAr

  

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

<td><strong>TC-013</strong></td>

<td>Edit Department - Happy Path</td>

<td>Update department with valid data and correct rowVersion</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-014</strong></td>

<td>Edit Department - Non-Existent ID</td>

<td>Attempt to update department with invalid ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-015</strong></td>

<td>Edit Department - Missing ID</td>

<td>Submit request without department ID</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>🗑️ DELETE /v{version}/Departments/Delete</strong></summary>

<br>

  

**Description:** Soft delete a department record from the system

  

**Query Parameters:**

- `Id` (required) - Department GUID identifier to delete

  

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

<td><strong>TC-016</strong></td>

<td>Delete Department - Happy Path</td>

<td>Delete existing department with valid ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-017</strong></td>

<td>Delete Department - Invalid ID Format</td>

<td>Send malformed GUID or invalid format</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-018</strong></td>

<td>Delete Department - Already Deleted</td>

<td>Try to delete the same department twice</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-019</strong></td>

<td>Delete Department - With Employees</td>

<td>Attempt to delete department with assigned employees</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

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

<td>19</td>

</tr>

<tr>

<td><strong>GET Endpoints</strong></td>

<td>8 tests</td>

</tr>

<tr>

<td><strong>POST Endpoints</strong></td>

<td>4 tests</td>

</tr>

<tr>

<td><strong>PUT Endpoints</strong></td>

<td>3 tests</td>

</tr>

<tr>

<td><strong>DELETE Endpoints</strong></td>

<td>4 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Priority 1 (P1)</strong></td>

<td>9 tests</td>

</tr>

<tr style="background-color: #fff3e0;">

<td><strong>Priority 2 (P2)</strong></td>

<td>10 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Success Cases</strong></td>

<td>7 tests</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>Failure Cases</strong></td>

<td>12 tests</td>

</tr>

</tbody>

</table>

  

---

  

## 🧪 Testing Notes

  

### Pre-requisites

- ✅ Valid authentication token

- ✅ Test data seeded in database

- ✅ Valid department IDs for GetById/Edit/Delete operations

  

### Business Rules

- ⚠️ Departments with assigned employees cannot be deleted

- ⚠️ Department codes must be unique

- ⚠️ Both English and Arabic names are required

  

### Data Cleanup

- 🔄 Delete test departments after test execution

- 🔄 Ensure no employees are assigned to test departments

  

### Performance Benchmarks

- ⚡ GetAll response time: < 500ms

- ⚡ GetById response time: < 100ms

- ⚡ Add/Edit/Delete: < 200ms

  

---

  

**Last Updated:** December 22, 2025  

**Maintained By:** QA Team  

**Version:** 1.0