# Jobs API - Test Cases Documentation

  

## 📋 Overview

  

**API Module:** Job Management System  

**Base URL:** `/v{version}/Jobs`  

**Total Test Cases:** 22  

**Success Scenarios:** 8 | **Failure Scenarios:** 14

  

---

  

## 🔍 Endpoints

  

<details open>

<summary><strong>📥 GET /v{version}/Jobs/GetAll</strong></summary>

<br>

  

**Description:** Retrieve a paginated list of jobs with search and sorting capabilities

  

**Query Parameters:**

- `PageNumber` (required) - Page number for pagination

- `PageSize` (required) - Number of records per page

- `SearchTerm` (optional) - Filter by job name/code

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

<td>GetAll - With Search</td>

<td>Apply SearchTerm filter to find specific jobs</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-004</strong></td>

<td>GetAll - Invalid Pagination</td>

<td>Send invalid PageNumber=0 or PageSize=-5</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-005</strong></td>

<td>GetAll - Response Structure</td>

<td>Verify response contains pageInfo and data array</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>🔎 GET /v{version}/Jobs/GetById</strong></summary>

<br>

  

**Description:** Retrieve detailed information for a specific job by its unique identifier

  

**Query Parameters:**

- `Id` (required) - Job GUID identifier

  

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

<td>Get job details using valid existing ID</td>

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

<td>Attempt to get job with fake/invalid ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-009</strong></td>

<td>GetById - Data Completeness</td>

<td>Verify all job fields are returned correctly</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>➕ POST /v{version}/Jobs/Add</strong></summary>

<br>

  

**Description:** Create a new job record in the system

  

**Required Fields:** jobCode, jobNameEn, jobNameAr

  

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

<td>Add Job - Happy Path</td>

<td>Create job with all valid required data</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-011</strong></td>

<td>Add Job - Missing Required</td>

<td>Submit request without required fields</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-012</strong></td>

<td>Add Job - Duplicate Code</td>

<td>Attempt to add job with existing jobCode</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400/409 Conflict</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-013</strong></td>

<td>Add Job - Empty Strings</td>

<td>Send empty strings for required fields</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-014</strong></td>

<td>Add Job - Long Strings</td>

<td>Test field length validation (exceed max length)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>✏️ PUT /v{version}/Jobs/Edit</strong></summary>

<br>

  

**Description:** Update existing job information (requires rowVersion for concurrency control)

  

**Required Fields:** id, rowVersion, jobCode, jobNameEn, jobNameAr

  

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

<td><strong>TC-015</strong></td>

<td>Edit Job - Happy Path</td>

<td>Update job with valid data and correct rowVersion</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-016</strong></td>

<td>Edit Job - Non-Existent ID</td>

<td>Attempt to update job with invalid ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-017</strong></td>

<td>Edit Job - Missing ID</td>

<td>Submit request without job ID</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-018</strong></td>

<td>Edit Job - Invalid RowVersion</td>

<td>Send outdated or incorrect rowVersion</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-019</strong></td>

<td>Edit Job - Verify Changes</td>

<td>Confirm job data is updated after edit</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>🗑️ DELETE /v{version}/Jobs/Delete</strong></summary>

<br>

  

**Description:** Soft delete a job record from the system

  

**Query Parameters:**

- `Id` (required) - Job GUID identifier to delete

  

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

<td><strong>TC-020</strong></td>

<td>Delete - Happy Path</td>

<td>Delete existing job with valid ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-021</strong></td>

<td>Delete - Already Deleted</td>

<td>Try to delete the same job twice</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-022</strong></td>

<td>Delete - Invalid ID Format</td>

<td>Send malformed GUID or invalid format</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

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

<td>22</td>

</tr>

<tr>

<td><strong>GET Endpoints</strong></td>

<td>9 tests</td>

</tr>

<tr>

<td><strong>POST Endpoints</strong></td>

<td>5 tests</td>

</tr>

<tr>

<td><strong>PUT Endpoints</strong></td>

<td>5 tests</td>

</tr>

<tr>

<td><strong>DELETE Endpoints</strong></td>

<td>3 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Priority 1 (P1)</strong></td>

<td>9 tests</td>

</tr>

<tr style="background-color: #fff3e0;">

<td><strong>Priority 2 (P2)</strong></td>

<td>13 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Success Cases</strong></td>

<td>8 tests</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>Failure Cases</strong></td>

<td>14 tests</td>

</tr>

</tbody>

</table>

  

---

  

## 🧪 Testing Notes

  

### Pre-requisites

- ✅ Valid authentication token

- ✅ Test data seeded in database

- ✅ Valid job IDs for GetById/Edit/Delete operations

  

### Data Cleanup

- 🔄 Delete test jobs after test execution

- 🔄 Reset counters if needed

  

### Performance Benchmarks

- ⚡ GetAll response time: < 500ms

- ⚡ GetById response time: < 100ms

- ⚡ Add/Edit/Delete: < 200ms

  

---

  

**Last Updated:** December 22, 2025  

**Maintained By:** QA Team  

**Version:** 1.0