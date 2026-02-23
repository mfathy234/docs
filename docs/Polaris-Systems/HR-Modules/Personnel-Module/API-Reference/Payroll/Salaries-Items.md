## SalariesItems
<details> <summary> <strong>Get All Salary Items</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of salary items with search and sorting.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of salary items with pagination, search, and sorting. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SalariesItems/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}

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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter salary items by code or name.</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, NameEn).</td></tr>
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
    <tr><td>200 OK</td><td>Paginated salary items list</td><td>PaginationVm&lt;GetAllSalariesItemsQueryResponse&gt;</td></tr>
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
      "id": "c1111111-1111-1111-1111-111111111111",
      "code": "SAL-001",
      "nameAr": "بدل سكن",
      "nameEn": "Housing Allowance",
      "availableToUse": true,
      "salaryItemType": "1",
      "salaryUnitId": "a1111111-1111-1111-1111-111111111111",
      "unitName": "Monthly"
    },
    {
      "id": "c2222222-2222-2222-2222-222222222222",
      "code": "SAL-002",
      "nameAr": "بدل نقل",
      "nameEn": "Transportation Allowance",
      "availableToUse": true,
      "salaryItemType": "1",
      "salaryUnitId": "a2222222-2222-2222-2222-222222222222",
      "unitName": "PerTrip"
    }
  ]
}
</pre>
</div>

</div> </details>
 
<details> <summary> <strong>Get Salary Item By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve salary item details by id.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed salary item information using the id. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SalariesItems/GetById?Id={SalaryItemId}

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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the salary item.</td></tr>
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
    <tr><td>200 OK</td><td>Salary item details</td><td>GetSalaryItemByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or not found</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "c1111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "SAL-001",
  "nameAr": "بدل سكن",
  "nameEn": "Housing Allowance",
  "availableToUse": true,
  "salaryItemType": "Earning",
  "salaryUnitId": "a1111111-1111-1111-1111-111111111111"
}
</pre>
</div>

</div> </details>
 
<details> <summary> <strong>Add Salary Item</strong>
<br /> <span style="font-size: 90%;">Create a new salary item.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new salary item by providing multilingual names, availability status, item type, and unit. Code is automatically generated. <br /><br />

<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/SalariesItems/Add

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
    <tr><td>NameAr</td><td>string</td><td>150</td><td>Not empty, only Arabic letters</td><td>Yes</td></tr>
    <tr><td>NameEn</td><td>string</td><td>150</td><td>Not empty, only English letters</td><td>Yes</td></tr>
    <tr><td>AvailableToUse</td><td>bool</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>SalaryItemType</td><td>int</td><td>-</td><td>Valid enum value (1: Earning, 2: Deduction)</td><td>Yes</td></tr>
    <tr><td>SalaryUnitId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
  </tbody>
</table>

<p>The request body must be sent in JSON format with multilingual names, availability status, item type, and unit id. Code is automatically generated.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "nameAr": "بدل سكن",
  "nameEn": "Housing Allowance",
  "availableToUse": true,
  "salaryItemType": 1,
  "salaryUnitId": "a1111111-1111-1111-1111-111111111111"
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
    <tr><td>201 Created</td><td>Salary item created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<p>A successful creation returns the newly created salary item ID:</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"c1111111-1111-1111-1111-111111111111"
</div>

<h3>Business Rules</h3>
<ul>
  <li><strong>Code Generation</strong>: Automatically generated using sequence service.</li>
  <li><strong>Name Validation</strong>: NameEn must contain only English letters. NameAr must contain only Arabic letters.</li>
  <li><strong>Salary Item Type</strong>: Must be a valid enum value: <code>Earning</code> or <code>Deduction</code>.</li>
  <li><strong>Available To Use</strong>: Indicates whether the salary item is available for use in salary templates and contracts.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Edit Salary Item</strong>
<br /> <span style="font-size: 90%;">Update an existing salary item.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update salary item code, names, availability status, item type, and unit. <br /><br />

<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/SalariesItems/Edit

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
    <tr><td>Code</td><td>string</td><td>50</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>NameAr</td><td>string</td><td>150</td><td>Not empty, only Arabic letters</td><td>Yes</td></tr>
    <tr><td>NameEn</td><td>string</td><td>150</td><td>Not empty, only English letters</td><td>Yes</td></tr>
    <tr><td>AvailableToUse</td><td>bool</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>SalaryItemType</td><td>int</td><td>-</td><td>Valid enum value (1: Earning, 2: Deduction)</td><td>Yes</td></tr>
    <tr><td>SalaryUnitId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
  </tbody>
</table>

<p>Provide id, row version, code, multilingual names, availability status, item type, and unit id.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "id": "c1111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "SAL-001",
  "nameAr": "بدل سكن",
  "nameEn": "Housing Allowance",
  "availableToUse": true,
  "salaryItemType": "Earning",
  "salaryUnitId": "a1111111-1111-1111-1111-111111111111"
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
    <tr><td>201 Created</td><td>Salary item updated</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or row-version mismatch</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<p>A successful update returns the salary item ID:</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"c1111111-1111-1111-1111-111111111111"
</div>

<h3>Business Rules</h3>
<ul>
  <li><strong>Name Validation</strong>: NameEn must contain only English letters. NameAr must contain only Arabic letters.</li>
  <li><strong>Salary Item Type</strong>: Must be a valid enum value: <code>Earning</code> or <code>Deduction</code>.</li>
  <li><strong>Available To Use</strong>: Indicates whether the salary item is available for use in salary templates and contracts.</li>
  <li><strong>Concurrency</strong>: Uses RowVersion for optimistic concurrency control.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Delete Salary Item</strong>
<br /> <span style="font-size: 90%;">Delete a salary item by id.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a salary item using its id. <br /><br />

<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/SalariesItems/Delete?Id={SalaryItemId}

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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the salary item to delete.</td></tr>
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
    <tr><td>204 No Content</td><td>Salary item deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or not found</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion.</p>
</div> </details>
