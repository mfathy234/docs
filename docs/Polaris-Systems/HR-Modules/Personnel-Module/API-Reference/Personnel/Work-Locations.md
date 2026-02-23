## WorkLocations
<details> <summary> <strong>Get All Work Locations</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of work locations with search and sorting.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of work locations with pagination, search, and sorting. Search filters by work area name, work area code, or responsible employee name (Arabic/English). <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/WorkLocations/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter work locations by work area name, work area code, or responsible employee name (case-insensitive).</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, WorkAreaName).</td></tr>
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
    <tr><td>200 OK</td><td>Paginated work locations list</td><td>PaginationVm&lt;GetAllWorkLocationsQueryResponse&gt;</td></tr>
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
  "orderBy": "CreatedOn",
  "orderByDesc": true,
  "result": [
    {
      "id": "71fd0c49-3b3c-4f43-96e1-9c3c9a71f4b2",
      "workAreaCode": "WL-001",
      "workAreaName": "Headquarters",
      "responsibleEmployeeName": "Lina Farouk",
      "errorRangeInMeters": 50
    },
    {
      "id": "cb5e1d2c-4e2a-4c11-9f1d-8d8a7c6b5e4f",
      "workAreaCode": "WL-002",
      "workAreaName": "Warehouse A",
      "responsibleEmployeeName": "Mostafa Emad",
      "errorRangeInMeters": 100
    }
  ]
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get Work Location By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve work location details by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed work location information using the id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/WorkLocations/GetById?Id={WorkLocationId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the work location.</td></tr>
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
    <tr><td>200 OK</td><td>Work location details</td><td>GetWorkLocationByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or related to positions (code: 9008)</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "71fd0c49-3b3c-4f43-96e1-9c3c9a71f4b2",
  "rowVersion": "AAAAAAAAB9E=",
  "workAreaName": "Headquarters",
  "errorRangeInMeters": 50,
  "longitude": 31.2357,
  "latitude": 30.0444,
  "responsibleEmployeeId": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
  "workAreaCode": "WL-001"
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Add Work Location</strong>
<br /> <span style="font-size: 90%;">Create a new work location.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new work location by providing area name, coordinates, and optional responsible employee. <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/WorkLocations/Add
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
    <tr><td>WorkAreaName</td><td>string</td><td>150</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>ErrorRangeInMeters</td><td>number</td><td>-</td><td>&gt;= 1</td><td>Yes</td></tr>
    <tr><td>Longitude</td><td>number</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>Latitude</td><td>number</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>ResponsibleEmployeeId</td><td>guid</td><td>-</td><td>-</td><td>No</td></tr>
  </tbody>
</table>
<p>The request body must be sent in JSON format with location name, coordinates, error range, and responsible employee if any.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "workAreaName": "Headquarters",
  "errorRangeInMeters": 50,
  "longitude": 31.2357,
  "latitude": 30.0444,
  "responsibleEmployeeId": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae"
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
    <tr><td>201 Created</td><td>Work location created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<p>A successful creation returns the newly created work location ID:</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"71fd0c49-3b3c-4f43-96e1-9c3c9a71f4b2"
</div> </div></details>
 
<details> <summary> <strong>Edit Work Location</strong>
<br /> <span style="font-size: 90%;">Update an existing work location.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update work location details including coordinates and code. <br /><br />
<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/WorkLocations/Edit
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
    <tr><td>RowVersion</td><td>string</td><td>-</td><td>Not empty (concurrency)</td><td>Yes</td></tr>
    <tr><td>WorkAreaName</td><td>string</td><td>150</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>ErrorRangeInMeters</td><td>number</td><td>-</td><td>&gt;= 1</td><td>Yes</td></tr>
    <tr><td>Longitude</td><td>number</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>Latitude</td><td>number</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>WorkAreaCode</td><td>string</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>ResponsibleEmployeeId</td><td>guid</td><td>-</td><td>-</td><td>No</td></tr>
  </tbody>
</table>
<p>Provide the work location id, row version, name, code, coordinates, error range, and responsible employee.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "id": "71fd0c49-3b3c-4f43-96e1-9c3c9a71f4b2",
  "rowVersion": "AAAAAAAAB9E=",
  "workAreaName": "Headquarters",
  "errorRangeInMeters": 50,
  "longitude": 31.2357,
  "latitude": 30.0444,
  "workAreaCode": "WL-001",
  "responsibleEmployeeId": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae"
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
    <tr><td>204 No Content</td><td>Work location updated</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or row-version mismatch</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>
</div> </details>
 
<details> <summary> <strong>Delete Work Location</strong>
<br /> <span style="font-size: 90%;">Delete a work location by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a work location using its id. <br /><br />
<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/WorkLocations/Delete?Id={WorkLocationId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the work location to delete.</td></tr>
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
    <tr><td>204 No Content</td><td>Work location deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or related to positions (code: 9008)</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion.</p>
</div> </details>
