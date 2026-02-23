## Employment Commencements
<details> <summary> <strong>Get All Employment Commencements</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of employment commencements with search and filtering.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of employment commencements with pagination, search, filtering by employee, date range, and sorting. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/EmploymentCommencements/GetAll?SearchTerm={SearchTerm}&EmployeeId={EmployeeId}&DateFrom={DateFrom}&DateTo={DateTo}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}

<br /><br />
<hr />

<h3>Request Parameters</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Name</th>
      <th style="text-align:left;">Location</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter by code or employee name (Arabic/English).</td></tr>
    <tr><td>EmployeeId</td><td>query</td><td>guid</td><td>No</td><td>Filter by specific employee identifier.</td></tr>
    <tr><td>DateFrom</td><td>query</td><td>date</td><td>No</td><td>Filter commencements from this date (inclusive).</td></tr>
    <tr><td>DateTo</td><td>query</td><td>date</td><td>No</td><td>Filter commencements up to this date (inclusive).</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., Date, Code, Status).</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>

<br />
<hr />

<h3>Responses</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Status</th>
      <th style="text-align:left;">Description</th>
      <th style="text-align:left;">Body</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>200 OK</td><td>Paginated employment commencements list</td><td>PaginationVm&lt;GetAllEmploymentCommencementsQueryResponse&gt;</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "pageInfoResult": {
    "currentPage": 1,
    "pageSize": 25,
    "totalItems": 2
  },
  "orderBy": "Date",
  "orderByDesc": false,
  "result": [
    {
      "id": "7f8a1d22-3b4a-4c5d-8e9f-0a1b2c3d4e5f",
      "code": "EC-001",
      "date": "2024-01-15",
      "status": "1",
      "employeeName": "John Doe",
      "commencementType": 1
    },
    {
      "id": "2c4d6e88-9f01-4b23-8456-7890abcdef12",
      "code": "EC-002",
      "date": "2024-02-20",
      "status": 2,
      "employeeName": "Jane Smith",
      "commencementType": 2
    }
  ]
}
</pre>
</div>

</div> </details>
 
<details> <summary> <strong>Get Employment Commencement By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve employment commencement details by id.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed employment commencement information using the commencement id. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/EmploymentCommencements/GetById?Id={CommencementId}

<br /><br />
<hr />

<h3>Request Parameters</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Name</th>
      <th style="text-align:left;">Location</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the employment commencement.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>

<br />
<hr />

<h3>Responses</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Status</th>
      <th style="text-align:left;">Description</th>
      <th style="text-align:left;">Body</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>200 OK</td><td>Employment commencement details</td><td>GetEmploymentCommencementByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or not found</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "7f8a1d22-3b4a-4c5d-8e9f-0a1b2c3d4e5f",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "EC-001",
  "date": "2024-01-15",
  "status": "1",
  "employeeId": "a1b2c3d4-5678-9012-3456-789012345678",
  "employeeName": "John Doe",
  "commencementType": "First Time",
  "notes": "First employment commencement for this employee"
}
</pre>
</div>

</div> </details>
 
<details> <summary> <strong>Add Employment Commencement</strong>
<br /> <span style="font-size: 90%;">Create a new employment commencement.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new employment commencement record. The status will be automatically set to Draft. <br /><br />

<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/EmploymentCommencements/Add

<br /><br />
<hr />

<h3>Request Body</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Max Length</th>
      <th style="text-align:left;">Validations</th>
      <th style="text-align:left;">Required</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Date</td><td>date</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>EmployeeId</td><td>guid</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>CommencementType</td><td>int</td><td>-</td><td>Valid enum value (1: FirstTime, 2: ReturnFromLeave)</td><td>Yes</td></tr>
    <tr><td>Notes</td><td>string</td><td>500</td><td>Max length when provided</td><td>No</td></tr>
  </tbody>
</table>

<p>The request body must be sent in JSON format with employment commencement details.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "date": "2024-01-15",
  "employeeId": "a1b2c3d4-5678-9012-3456-789012345678",
  "commencementType": 1,
  "notes": "First employment commencement for this employee"
}
</pre>

</div>

<br />
<hr />

<h3>Responses</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Status</th>
      <th style="text-align:left;">Description</th>
      <th style="text-align:left;">Body</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>201 Created</td><td>Employment commencement created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<p>A successful creation returns the newly created employment commencement ID:</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"7f8a1d22-3b4a-4c5d-8e9f-0a1b2c3d4e5f"
</div> </details>
 
<details> <summary> <strong>Edit Employment Commencement</strong>
<br /> <span style="font-size: 90%;">Update an existing employment commencement.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update employment commencement details. <strong>Note:</strong> Only records with Draft status can be edited. Posted records cannot be modified. <br /><br />

<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/EmploymentCommencements/Edit

<br /><br />
<hr />

<h3>Request Body</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Max Length</th>
      <th style="text-align:left;">Validations</th>
      <th style="text-align:left;">Required</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>guid</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>RowVersion</td><td>string</td><td>-</td><td>Not empty (concurrency)</td><td>No</td></tr>
    <tr><td>Code</td><td>string</td><td>450</td><td>Required</td><td>Yes</td></tr>
    <tr><td>Date</td><td>date</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>EmployeeId</td><td>guid</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>CommencementType</td><td>int</td><td>-</td><td>Valid enum value (1: FirstTime, 2: ReturnFromLeave)</td><td>Yes</td></tr>
    <tr><td>Notes</td><td>string</td><td>500</td><td>Max length when provided</td><td>No</td></tr>
  </tbody>
</table>

<p>Provide the employment commencement id, row version (for concurrency), code, date, employee, commencement type, and optional notes.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "id": "7f8a1d22-3b4a-4c5d-8e9f-0a1b2c3d4e5f",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "EC-001",
  "date": "2024-01-15",
  "employeeId": "a1b2c3d4-5678-9012-3456-789012345678",
  "commencementType": 1,
  "notes": "Updated notes"
}
</pre>

</div>

<br />
<hr />

<h3>Responses</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Status</th>
      <th style="text-align:left;">Description</th>
      <th style="text-align:left;">Body</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>204 No Content</td><td>Employment commencement updated</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, row version mismatch, or status is Posted (cannot edit)</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>
</div> </details>
 
<details> <summary> <strong>Post Employment Commencement</strong>
<br /> <span style="font-size: 90%;">Post employment commencement status from Draft to Posted.</span> </summary> 
<br />

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Change the status of an employment commencement from Draft to Posted. <strong>Note:</strong> Only records with Draft status can be posted. Once posted, the record cannot be edited or deleted. <br /><br />

<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/EmploymentCommencements/Post

<br /><br />
<hr />

<h3>Request Body</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Validations</th>
      <th style="text-align:left;">Required</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>guid</td><td>Not empty</td><td>Yes</td></tr>
  </tbody>
</table>

<p>The request body must be sent in JSON format with the employment commencement id.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "id": "7f8a1d22-3b4a-4c5d-8e9f-0a1b2c3d4e5f"
}
</pre>

</div>

<br />
<hr />

<h3>Responses</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Status</th>
      <th style="text-align:left;">Description</th>
      <th style="text-align:left;">Body</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>204 No Content</td><td>Employment commencement posted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or status is not Draft (cannot post)</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful post.</p>
</div> </details>
 
<details> <summary> <strong>Delete Employment Commencement</strong>
<br /> <span style="font-size: 90%;">Delete an employment commencement by id.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete an employment commencement using its id. <strong>Note:</strong> Only records with Draft status can be deleted. Posted records cannot be deleted. <br /><br />

<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/EmploymentCommencements/Delete?Id={CommencementId}

<br /><br />
<hr />

<h3>Request Parameters</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Name</th>
      <th style="text-align:left;">Location</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the employment commencement to delete.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>

<br />
<hr />

<h3>Responses</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Status</th>
      <th style="text-align:left;">Description</th>
      <th style="text-align:left;">Body</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>204 No Content</td><td>Employment commencement deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or status is Posted (cannot delete)</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion.</p>
</div> </details>

