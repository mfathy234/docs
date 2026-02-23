## Departments
<details> <summary> <strong>Get All Departments</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of departments with search and sorting.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of departments with pagination, search, and sorting. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Departments/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter departments by name or code.</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, Name).</td></tr>
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
    <tr><td>200 OK</td><td>Paginated departments list</td><td>PaginationVm&lt;GetAllDepartmentsQueryResponse&gt;</td></tr>
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
      "id": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
      "code": "DEP-001",
      "name": "Human Resources",
      "parentId": null,
      "parentName": "",
      "employeesCount": 15,
      "hasEmployees": true,
      "responsibleEmployeeName": "Sara Ibrahim"
    },
    {
      "id": "2b1f7a77-2c79-4bde-9c2d-1f9e2a76e8ab",
      "code": "DEP-002",
      "name": "IT Support",
      "parentId": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
      "parentName": "Human Resources",
      "employeesCount": 8,
      "hasEmployees": true,
      "responsibleEmployeeName": "Omar Nasser"
    }
  ]
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get Employees Of Department</strong>
<br /> <span style="font-size: 90%;">Retrieve employees for a specific department.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve employees assigned to a department by department id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Departments/GetEmployeesOfDepartment?DepartmentId={DepartmentId}
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
    <tr><td>DepartmentId</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the department.</td></tr>
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
    <tr><td>200 OK</td><td>Employees for department</td><td>IEnumerable&lt;GetEmployeesOfDepartmentQueryResponse&gt;</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "employeeId": "3c8c2b7f-6f4e-4b8e-9c5a-1f5e2c3d4b6a",
    "photoId": "b1f3a14c-9a2c-4b11-8c7d-6c8a47c9e2d3",
    "departmentId": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
    "name": "Mahmoud Adel",
    "jobName": "HR Specialist",
    "parentId": null
  },
  {
    "employeeId": "6f3a8c21-4b5d-4e6f-a7c8-2d3e4f5a6b7c",
    "photoId": null,
    "departmentId": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
    "name": "Heba Kamal",
    "jobName": "HR Coordinator",
    "parentId": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5"
  }
]
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get All Departments For Menu</strong>
<br /> <span style="font-size: 90%;">Retrieve all departments for menu selection.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve lightweight department list for menu/dropdown use. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Departments/GetAllForMenu
<br /><br />
<hr />
<h3>Request Parameters</h3>
<p>No parameters required.</p>
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
    <tr><td>200 OK</td><td>Departments for menu</td><td>PaginationVm&lt;GetAllDepartmentsForMenueQueryResponse&gt;</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "id": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
    "name": "Human Resources",
    "parentId": null,
    "employeesCount": 15,
    "parentIsCompany": true
  },
  {
    "id": "2b1f7a77-2c79-4bde-9c2d-1f9e2a76e8ab",
    "name": "IT Support",
    "parentId": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
    "employeesCount": 8,
    "parentIsCompany": false
  }
]
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get Department By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve department details by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed department information using the department id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Departments/GetById?Id={DepartmentId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the department.</td></tr>
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
    <tr><td>200 OK</td><td>Department details</td><td>GetDepartmentByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
  "rowVersion": "AAAAAAAAB9E=",
  "employeesCount": 15,
  "code": "DEP-001",
  "nameAr": "??? ??????? ???????",
  "nameEn": "Human Resources",
  "hasEmployees": true,
  "parentId": "00000000-0000-0000-0000-000000000000",
  "responsibleEmployeeId": "3c8c2b7f-6f4e-4b8e-9c5a-1f5e2c3d4b6a"
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>View Department</strong>
<br /> <span style="font-size: 90%;">View department summary details.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> View summarized department information using the department id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Departments/View?Id={DepartmentId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the department.</td></tr>
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
    <tr><td>200 OK</td><td>Department summary</td><td>ViewDepartmentByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "code": "DEP-001",
  "name": "Human Resources",
  "parentId": null,
  "parentName": "Company",
  "responsibleEmployeeName": "Sara Ibrahim",
  "hasEmployees": true,
  "employeesCount": 15
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Add Department</strong>
<br /> <span style="font-size: 90%;">Create a new department.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new department by providing department names, responsible employee, and hierarchy information. <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/Departments/Add
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
    <tr><td>NameAr</td><td>string</td><td>150</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>NameEn</td><td>string</td><td>150</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>ResponsibleEmployeeId</td><td>guid</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>HasEmployees</td><td>bool</td><td>-</td><td>-</td><td>No</td></tr>
    <tr><td>ParentId</td><td>guid</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>ParentIsCompany</td><td>bool</td><td>-</td><td>-</td><td>No</td></tr>
  </tbody>
</table>
<p>The request body must be sent in JSON format with department names, responsible employee id, and parent hierarchy details.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "nameAr": "HR Department AR",
  "nameEn": "HR Department",
  "responsibleEmployeeId": "11111111-2222-3333-4444-555555555555",
  "hasEmployees": true,
  "parentId": "00000000-0000-0000-0000-000000000000",
  "parentIsCompany": true
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
    <tr><td>201 Created</td><td>Department created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<p>A successful creation returns the newly created department ID:</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"b2d5f9f3-1234-4a5b-89cd-0123456789ab"
</div> </div></details>
 
<details> <summary> <strong>Edit Department</strong>
<br /> <span style="font-size: 90%;">Update an existing department.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update department details such as names, responsible employee, and hierarchy. <br /><br />
<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/Departments/Edit
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
    <tr><td>RowVersion</td><td>string</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>Code</td><td>string</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>NameAr</td><td>string</td><td>150</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>NameEn</td><td>string</td><td>150</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>ResponsibleEmployeeId</td><td>guid</td><td>-</td><td>Required</td><td>Yes</td></tr>
    <tr><td>HasEmployees</td><td>bool</td><td>-</td><td>-</td><td>No</td></tr>
    <tr><td>ParentId</td><td>guid</td><td>-</td><td>Required</td><td>Yes</td></tr>
  </tbody>
</table>
<p>Provide the department id, row version, names, responsible employee, and parent data.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "id": "d11c8a52-4c23-4c2b-8e16-02b6d4fce2c5",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "DEP-001",
  "nameAr": "??? ??????? ???????",
  "nameEn": "Human Resources",
  "responsibleEmployeeId": "3c8c2b7f-6f4e-4b8e-9c5a-1f5e2c3d4b6a",
  "hasEmployees": true,
  "parentId": "00000000-0000-0000-0000-000000000000"
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
    <tr><td>204 No Content</td><td>Department updated</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or row version mismatch</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>
</div> </details>
 
<details> <summary> <strong>Delete Department</strong>
<br /> <span style="font-size: 90%;">Delete a department by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a department using its id. <br /><br />
<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/Departments/Delete?Id={DepartmentId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the department to delete.</td></tr>
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
    <tr><td>204 No Content</td><td>Department deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or delete blocked (has employees/child departments)</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion.</p>
</div> </details>

