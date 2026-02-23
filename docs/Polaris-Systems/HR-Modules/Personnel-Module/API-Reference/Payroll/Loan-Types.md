## LoanTypes

API for managing loan types: list (paginated), get by id, add, edit, and delete. Loan types define rules for loan requests (salary item, max % from salary, request date range, max installments, relocation). Code is generated via the sequence service on add.

<details> <summary> <strong>Get All Loan Types</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of loan types with search and sorting.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of loan types with pagination, search, and sorting. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/LoanTypes/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter loan types by code or name.</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>SortBy</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, Code, NameEn, NameAr).</td></tr>
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
    <tr><td>200 OK</td><td>Paginated loan types list</td><td>PaginationVm&lt;GetAllLoanTypesQueryResponse&gt;</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<p>The list returns a summary per loan type. <code>name</code> is locale-based (Arabic or English).</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "pageInfoResult": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 2
  },
  "orderBy": "CreatedOn",
  "orderByDesc": true,
  "result": [
    {
      "id": "4f7a1c1b-46f7-43d8-8e16-111111111111",
      "code": "LN-001",
      "name": "Personal Loan",
      "salaryItemName": "Loan Deduction",
      "maxPercentFromSalary": 30,
      "maxInstallments": 12,
      "requestDayFrom": "2024-01-01",
      "requestDayTo": "2024-01-10"
    },
    {
      "id": "2d5b6f7c-98a4-4e11-9c2d-222222222222",
      "code": "LN-002",
      "name": "Car Loan",
      "salaryItemName": "Loan Deduction",
      "maxPercentFromSalary": null,
      "maxInstallments": 24,
      "requestDayFrom": null,
      "requestDayTo": null
    }
  ]
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get Loan Type By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve loan type details by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed loan type information using the id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/LoanTypes/GetById?Id={LoanTypeId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the loan type.</td></tr>
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
    <tr><td>200 OK</td><td>Loan type details</td><td>GetLoanTypeByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "4f7a1c1b-46f7-43d8-8e16-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "LN-001",
  "nameEn": "Personal Loan",
  "nameAr": "قرض شخصي",
  "description": "Short term personal loan",
  "salaryItemId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "isRelocatable": true,
  "maxRelocatableTimes": 2,
  "isPercentFromSalaryEnabled": true,
  "maxPercentFromSalary": 30,
  "isRequestRangeEnabled": true,
  "requestDayFrom": "2024-01-01",
  "requestDayTo": "2024-01-10",
  "isMaxInstallmentsEnabled": true,
  "maxInstallments": 12
}
</pre>
</div>
<p><code>requestDayFrom</code> and <code>requestDayTo</code> are returned as date strings (YYYY-MM-DD).</p>
</div> </details>
 
<details> <summary> <strong>Add Loan Type</strong>
<br /> <span style="font-size: 90%;">Create a new loan type.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new loan type by providing Arabic/English names, salary item reference, and rule configuration flags (relocation, percent from salary, request window, max installments). Code is automatically generated. <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/LoanTypes/Add
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
    <tr><td>NameEn</td><td>string</td><td>150</td><td>Not empty, only English letters</td><td>Yes</td></tr>
    <tr><td>NameAr</td><td>string</td><td>150</td><td>Not empty, only Arabic letters</td><td>Yes</td></tr>
    <tr><td>Description</td><td>string</td><td>250</td><td>Max length</td><td>No</td></tr>
    <tr><td>SalaryItemId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
    <tr><td>IsRelocatable</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>MaxRelocatableTimes</td><td>int?</td><td>-</td><td>&gt; 0 when IsRelocatable</td><td>Conditional</td></tr>
    <tr><td>IsPercentFromSalaryEnabled</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>MaxPercentFromSalary</td><td>decimal?</td><td>-</td><td>1-100 when enabled</td><td>Conditional</td></tr>
    <tr><td>IsRequestRangeEnabled</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>RequestDayFrom</td><td>string (date)</td><td>-</td><td>Required when range enabled; date YYYY-MM-DD; must be ≤ RequestDayTo</td><td>Conditional</td></tr>
    <tr><td>RequestDayTo</td><td>string (date)</td><td>-</td><td>Required when range enabled; date YYYY-MM-DD; must be ≥ RequestDayFrom</td><td>Conditional</td></tr>
    <tr><td>IsMaxInstallmentsEnabled</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>MaxInstallments</td><td>int?</td><td>-</td><td>&gt; 0 when enabled</td><td>Conditional</td></tr>
  </tbody>
</table>
<h3>Request Body Example</h3>
<p>The request body must be sent in JSON format with multilingual names, salary item reference, and rule settings. Code is automatically generated via the sequence service.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "nameEn": "Housing Loan",
  "nameAr": "قرض سكني",
  "description": "Mortgage financing",
  "salaryItemId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "isRelocatable": false,
  "maxRelocatableTimes": null,
  "isPercentFromSalaryEnabled": true,
  "maxPercentFromSalary": 25,
  "isRequestRangeEnabled": true,
  "requestDayFrom": "2024-01-01",
  "requestDayTo": "2024-01-07",
  "isMaxInstallmentsEnabled": true,
  "maxInstallments": 18
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
    <tr><td>201 Created</td><td>Loan type created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<p>Returns <strong>201 Created</strong> with the newly created loan type ID in the response body (GUID string). The <code>Location</code> header may point to the created resource.</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"8a3d55a4-3f7e-4f51-9c2d-333333333333"
</div>
<h3>Business Rules</h3>
<ul>
  <li><strong>Code Generation</strong>: Automatically generated using sequence service.</li>
  <li><strong>Salary Item</strong>: Must reference an existing salary item. The salary item is used to post loan installments.</li>
  <li><strong>Name Validation</strong>: NameEn must contain only English letters. NameAr must contain only Arabic letters.</li>
  <li><strong>Relocation Rules</strong>: If <code>IsRelocatable</code> is true, <code>MaxRelocatableTimes</code> must be greater than 0.</li>
  <li><strong>Percent From Salary</strong>: If <code>IsPercentFromSalaryEnabled</code> is true, <code>MaxPercentFromSalary</code> must be between 1 and 100.</li>
  <li><strong>Request Range</strong>: If <code>IsRequestRangeEnabled</code> is true, both <code>RequestDayFrom</code> and <code>RequestDayTo</code> are required (date strings YYYY-MM-DD), and <code>RequestDayFrom</code> must be less than or equal to <code>RequestDayTo</code>.</li>
  <li><strong>Max Installments</strong>: If <code>IsMaxInstallmentsEnabled</code> is true, <code>MaxInstallments</code> must be greater than 0.</li>
</ul>
</div> </details>
 
<details> <summary> <strong>Edit Loan Type</strong>
<br /> <span style="font-size: 90%;">Update an existing loan type.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update loan type fields including names, salary item reference, and rule configuration values. <br /><br />
<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/LoanTypes/Edit
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
    <tr><td>NameEn</td><td>string</td><td>150</td><td>Not empty, only English letters</td><td>Yes</td></tr>
    <tr><td>NameAr</td><td>string</td><td>150</td><td>Not empty, only Arabic letters</td><td>Yes</td></tr>
    <tr><td>Description</td><td>string</td><td>250</td><td>Max length</td><td>No</td></tr>
    <tr><td>SalaryItemId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
    <tr><td>IsRelocatable</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>MaxRelocatableTimes</td><td>int?</td><td>-</td><td>&gt; 0 when IsRelocatable</td><td>Conditional</td></tr>
    <tr><td>IsPercentFromSalaryEnabled</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>MaxPercentFromSalary</td><td>decimal?</td><td>-</td><td>1-100 when enabled</td><td>Conditional</td></tr>
    <tr><td>IsRequestRangeEnabled</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>RequestDayFrom</td><td>string (date)</td><td>-</td><td>Required when range enabled; date YYYY-MM-DD; must be ≤ RequestDayTo</td><td>Conditional</td></tr>
    <tr><td>RequestDayTo</td><td>string (date)</td><td>-</td><td>Required when range enabled; date YYYY-MM-DD; must be ≥ RequestDayFrom</td><td>Conditional</td></tr>
    <tr><td>IsMaxInstallmentsEnabled</td><td>bool</td><td>-</td><td>-</td><td>Yes</td></tr>
    <tr><td>MaxInstallments</td><td>int?</td><td>-</td><td>&gt; 0 when enabled</td><td>Conditional</td></tr>
  </tbody>
</table>
<h3>Request Body Example</h3>
<p>Provide the loan type id, row version, code, multilingual names, salary item reference, and rule settings.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "id": "4f7a1c1b-46f7-43d8-8e16-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "LN-001",
  "nameEn": "Personal Loan",
  "nameAr": "قرض شخصي",
  "description": "Updated description",
  "salaryItemId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "isRelocatable": true,
  "maxRelocatableTimes": 2,
  "isPercentFromSalaryEnabled": true,
  "maxPercentFromSalary": 30,
  "isRequestRangeEnabled": true,
  "requestDayFrom": "2024-01-01",
  "requestDayTo": "2024-01-10",
  "isMaxInstallmentsEnabled": true,
  "maxInstallments": 12
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
    <tr><td>204 No Content</td><td>Loan type updated</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or row-version mismatch</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>
<h3>Business Rules</h3>
<ul>
  <li><strong>Salary Item</strong>: Must reference an existing salary item. The salary item is used to post loan installments.</li>
  <li><strong>Name Validation</strong>: NameEn must contain only English letters. NameAr must contain only Arabic letters.</li>
  <li><strong>Relocation Rules</strong>: If <code>IsRelocatable</code> is true, <code>MaxRelocatableTimes</code> must be greater than 0.</li>
  <li><strong>Percent From Salary</strong>: If <code>IsPercentFromSalaryEnabled</code> is true, <code>MaxPercentFromSalary</code> must be between 1 and 100.</li>
  <li><strong>Request Range</strong>: If <code>IsRequestRangeEnabled</code> is true, both <code>RequestDayFrom</code> and <code>RequestDayTo</code> are required (date strings YYYY-MM-DD), and <code>RequestDayFrom</code> must be less than or equal to <code>RequestDayTo</code>.</li>
  <li><strong>Max Installments</strong>: If <code>IsMaxInstallmentsEnabled</code> is true, <code>MaxInstallments</code> must be greater than 0.</li>
  <li><strong>Concurrency</strong>: <code>RowVersion</code> is required for optimistic concurrency; return the value from Get By Id when editing.</li>
</ul>
</div> </details>
 
<details> <summary> <strong>Delete Loan Type</strong>
<br /> <span style="font-size: 90%;">Delete a loan type by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a loan type using its id. <br /><br />
<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/LoanTypes/Delete?Id={LoanTypeId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the loan type to delete.</td></tr>
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
    <tr><td>204 No Content</td><td>Loan type deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or not found</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion. If the loan type does not exist, the API returns an error (e.g. 400/404).</p>
</div> </details>
