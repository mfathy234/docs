# Work Locations API - Test Cases Documentation

  

## 📋 Overview

  

**API Module:** Work Locations Management System  

**Base URL:** `/v{version}/WorkLocations`  

**Total Test Cases:** 50  

**Success Scenarios:** 16 | **Failure Scenarios:** 34

  

---

  

## 🔍 Endpoints

  

<details open>

<summary><strong>📥 GET /v{version}/WorkLocations/GetAll</strong></summary>

<br>

  

**Description:** Retrieve a paginated list of work locations with search and sorting capabilities

  

**Query Parameters:**

- `PageNumber` (required) - Page number for pagination (must be >= 1)

- `PageSize` (required) - Number of records per page (must be >= 1)

- `SearchTerm` (optional) - Filter by work location name

- `SortBy` (optional) - Sort direction (Ascending/Descending)

- `SortColumn` (optional) - Field name to sort by (WorkAreaName, CreatedOn, etc.)

  

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

<td>GetAll - Valid Request</td>

<td>Retrieve all work locations with valid pagination (PageNumber=1, PageSize=25)</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-002</strong></td>

<td>GetAll - With Search Term</td>

<td>Retrieve work locations filtered by SearchTerm="Headquarters"</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-003</strong></td>

<td>GetAll - With Sorting Ascending</td>

<td>Retrieve work locations sorted by WorkAreaName ascending</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-004</strong></td>

<td>GetAll - With Sorting Descending</td>

<td>Retrieve work locations sorted by CreatedOn descending</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-005</strong></td>

<td>GetAll - Different Page Size</td>

<td>Retrieve work locations with PageSize=10</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-006</strong></td>

<td>GetAll - Second Page</td>

<td>Retrieve second page of work locations (PageNumber=2)</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-007</strong></td>

<td>GetAll - Empty Result</td>

<td>Search with non-existing term returns empty list (totalItems=0)</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #9e9e9e; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P3</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-008</strong></td>

<td>GetAll - Missing PageNumber</td>

<td>Request without required PageNumber parameter</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-009</strong></td>

<td>GetAll - Missing PageSize</td>

<td>Request without required PageSize parameter</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-010</strong></td>

<td>GetAll - Invalid PageNumber (Zero)</td>

<td>Request with PageNumber=0 (must be >= 1)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-011</strong></td>

<td>GetAll - Invalid PageSize (Zero)</td>

<td>Request with PageSize=0 (must be >= 1)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-012</strong></td>

<td>GetAll - Negative PageNumber</td>

<td>Request with negative PageNumber (-1)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>🔎 GET /v{version}/WorkLocations/GetById</strong></summary>

<br>

  

**Description:** Retrieve detailed information for a specific work location by its unique identifier

  

**Query Parameters:**

- `Id` (required) - Work Location GUID identifier

  

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

<td>GetById - Valid Request</td>

<td>Retrieve specific work location by valid GUID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-014</strong></td>

<td>GetById - Invalid GUID Format</td>

<td>Request with invalid GUID format (e.g., "invalid-guid-123")</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-015</strong></td>

<td>GetById - Non-Existing ID</td>

<td>Request with valid GUID but non-existing record</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-016</strong></td>

<td>GetById - Missing ID Parameter</td>

<td>Request without required Id parameter</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>➕ POST /v{version}/WorkLocations/Add</strong></summary>

<br>

  

**Description:** Create a new work location record in the system

  

**Required Fields:**

- `workAreaName` (string, max 150 chars) - Name of the work location

- `errorRangeInMeters` (integer, >= 1) - Geofence error range in meters

- `longitude` (decimal) - GPS longitude coordinate

- `latitude` (decimal) - GPS latitude coordinate

  

**Optional Fields:**

- `responsibleEmployeeId` (GUID) - Employee responsible for this location

  

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

<td>Add - Valid Request with All Fields</td>

<td>Create work location with all required and optional fields</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-018</strong></td>

<td>Add - Without Optional Employee</td>

<td>Create work location without responsible employee ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-019</strong></td>

<td>Add - Minimum Error Range</td>

<td>Create work location with errorRangeInMeters=1 (minimum)</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-020</strong></td>

<td>Add - Maximum Length Name</td>

<td>Create work location with 150 character workAreaName</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">201 Created</code></td>

<td><span style="background-color: #9e9e9e; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P3</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-021</strong></td>

<td>Add - Missing WorkAreaName</td>

<td>Request without required workAreaName field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-022</strong></td>

<td>Add - Empty WorkAreaName</td>

<td>Request with empty string for workAreaName</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-023</strong></td>

<td>Add - Missing ErrorRangeInMeters</td>

<td>Request without required errorRangeInMeters field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-024</strong></td>

<td>Add - ErrorRange Less Than 1</td>

<td>Request with errorRangeInMeters=0 (must be >= 1)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-025</strong></td>

<td>Add - Negative ErrorRange</td>

<td>Request with negative errorRangeInMeters (-50)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-026</strong></td>

<td>Add - Missing Longitude</td>

<td>Request without required longitude field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-027</strong></td>

<td>Add - Missing Latitude</td>

<td>Request without required latitude field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-028</strong></td>

<td>Add - Name Exceeds Max Length</td>

<td>Request with workAreaName > 150 characters</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-029</strong></td>

<td>Add - Invalid Employee GUID</td>

<td>Request with invalid responsibleEmployeeId GUID format</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-030</strong></td>

<td>Add - Non-Existing Employee ID</td>

<td>Request with valid GUID but non-existing employee</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>✏️ PUT /v{version}/WorkLocations/Edit</strong></summary>

<br>

  

**Description:** Update existing work location information (requires rowVersion for concurrency control)

  

**Required Fields:**

- `id` (GUID) - Work location identifier

- `rowVersion` (string) - Concurrency control token

- `workAreaName` (string, max 150 chars)

- `errorRangeInMeters` (integer, >= 1)

- `longitude` (decimal)

- `latitude` (decimal)

  

**Optional Fields:**

- `responsibleEmployeeId` (GUID)

  

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

<td><strong>TC-031</strong></td>

<td>Edit - Valid Request with All Fields</td>

<td>Update work location with valid data and correct rowVersion</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-032</strong></td>

<td>Edit - Update Name Only</td>

<td>Update only workAreaName field, keep other fields unchanged</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-033</strong></td>

<td>Edit - Update Coordinates</td>

<td>Update longitude and latitude coordinates</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-034</strong></td>

<td>Edit - Remove Responsible Employee</td>

<td>Update with responsibleEmployeeId set to null</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>TC-035</strong></td>

<td>Edit - Minimum Error Range</td>

<td>Update with errorRangeInMeters=1 (minimum allowed)</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #9e9e9e; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P3</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-036</strong></td>

<td>Edit - Missing ID</td>

<td>Request without required id field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-037</strong></td>

<td>Edit - Invalid ID Format</td>

<td>Request with invalid GUID format for id</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-038</strong></td>

<td>Edit - Non-Existing ID</td>

<td>Attempt to update work location with non-existing ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-039</strong></td>

<td>Edit - Missing RowVersion</td>

<td>Request without required rowVersion field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-040</strong></td>

<td>Edit - Invalid RowVersion</td>

<td>Request with outdated or incorrect rowVersion</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-041</strong></td>

<td>Edit - Missing WorkAreaName</td>

<td>Request without required workAreaName field</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-042</strong></td>

<td>Edit - Empty WorkAreaName</td>

<td>Request with empty string for workAreaName</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-043</strong></td>

<td>Edit - Name Exceeds Max Length</td>

<td>Request with workAreaName > 150 characters</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-044</strong></td>

<td>Edit - ErrorRange Less Than 1</td>

<td>Request with errorRangeInMeters=0 (must be >= 1)</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-045</strong></td>

<td>Edit - Invalid Employee GUID</td>

<td>Request with invalid responsibleEmployeeId format</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

</tbody>

</table>

  

</details>

  

---

  

<details>

<summary><strong>🗑️ DELETE /v{version}/WorkLocations/Delete</strong></summary>

<br>

  

**Description:** Soft delete a work location record from the system

  

**Query Parameters:**

- `Id` (required) - Work Location GUID identifier to delete

  

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

<td><strong>TC-046</strong></td>

<td>Delete - Valid Request</td>

<td>Delete existing work location with valid ID</td>

<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">204 No Content</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>✅ Success</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-047</strong></td>

<td>Delete - Invalid ID Format</td>

<td>Send malformed GUID or invalid format</td>

<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-048</strong></td>

<td>Delete - Non-Existing ID</td>

<td>Attempt to delete work location with non-existing ID</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-049</strong></td>

<td>Delete - Already Deleted</td>

<td>Try to delete the same work location twice</td>

<td><code style="background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px;">404 Not Found</code></td>

<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>

<td>❌ Failure</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>TC-050</strong></td>

<td>Delete - Missing ID Parameter</td>

<td>Request without required Id parameter</td>

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

<td>50</td>

</tr>

<tr>

<td><strong>GET Endpoints</strong></td>

<td>16 tests</td>

</tr>

<tr>

<td><strong>POST Endpoints</strong></td>

<td>14 tests</td>

</tr>

<tr>

<td><strong>PUT Endpoints</strong></td>

<td>15 tests</td>

</tr>

<tr>

<td><strong>DELETE Endpoints</strong></td>

<td>5 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Priority 1 (High)</strong></td>

<td>29 tests</td>

</tr>

<tr style="background-color: #fff3e0;">

<td><strong>Priority 2 (Medium)</strong></td>

<td>19 tests</td>

</tr>

<tr style="background-color: #f5f5f5;">

<td><strong>Priority 3 (Low)</strong></td>

<td>2 tests</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Success Cases</strong></td>

<td>16 tests</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>Failure Cases</strong></td>

<td>34 tests</td>

</tr>

</tbody>

</table>

  

---

  

## 🧪 Testing Notes

  

### Pre-requisites

- ✅ Valid authentication token

- ✅ Test data seeded in database

- ✅ Valid work location IDs for GetById/Edit/Delete operations

- ✅ Valid employee IDs for testing responsible employee assignment

  

### Field Validation Rules

- **workAreaName**: Required, max 150 characters, non-empty

- **errorRangeInMeters**: Required, integer, must be >= 1

- **longitude**: Required, decimal (GPS coordinate)

- **latitude**: Required, decimal (GPS coordinate)

- **responsibleEmployeeId**: Optional, valid GUID format if provided

  

### Business Rules

- ⚠️ Work locations use geofencing with configurable error range

- ⚠️ Minimum error range is 1 meter

- ⚠️ Responsible employee is optional but must be valid if provided

- ⚠️ Both longitude and latitude are mandatory for location tracking

  

### Data Cleanup

- 🔄 Delete test work locations after test execution

- 🔄 Verify no dependencies before deletion

  

### Performance Benchmarks

- ⚡ GetAll response time: < 500ms for 1000 records

- ⚡ GetById response time: < 100ms

- ⚡ Add/Edit/Delete: < 200ms

  

---

  

**Last Updated:** December 22, 2025  

**Maintained By:** QA Team  

**Version:** 1.0