## LoanRequests

API for loan requests: list (paginated, filter by employee, date range, status), get by id, get managed employees, get employee salary data, add, edit, post, and delete. Loan requests are created as Draft and can be posted; only Draft requests can be edited or deleted. Code is generated via the sequence service.

<details> <summary> <strong>Get All Loan Requests</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of loan requests with filtering and sorting options.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of loan requests with pagination, search, filtering by employee, date range, and status, with sorting capabilities. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/LoanRequests/GetAll?SearchTerm={SearchTerm}&EmployeeId={EmployeeId}&DateFrom={DateFrom}&DateTo={DateTo}&Status={Status}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}

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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter loan requests by code or employee name.</td></tr>
    <tr><td>EmployeeId</td><td>query</td><td>guid?</td><td>No</td><td>Filter by specific employee identifier.</td></tr>
    <tr><td>DateFrom</td><td>query</td><td>string (date)</td><td>No</td><td>Filter loan requests from this date (inclusive). YYYY-MM-DD.</td></tr>
    <tr><td>DateTo</td><td>query</td><td>string (date)</td><td>No</td><td>Filter loan requests up to this date (inclusive). YYYY-MM-DD.</td></tr>
    <tr><td>Status</td><td>query</td><td>LoanRequestStatus?</td><td>No</td><td>Filter by status (Draft | Posted).</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results (greater than 0).</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page (greater than 0).</td></tr>
    <tr><td>SortBy</td><td>query</td><td>SortBy</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, Code, Date).</td></tr>
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
    <tr><td>200 OK</td><td>Paginated loan requests list</td><td>PaginationVm&lt;GetAllLoanRequestsQueryResponse&gt;</td></tr>
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
    "pageSize": 10,
    "totalItems": 5
  },
  "orderBy": "CreatedOn",
  "orderByDesc": true,
  "result": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "code": "LR-001",
      "date": "2024-01-15",
      "status": "Draft",
      "loanTypeName": "Personal Loan",
      "employeeName": "Ahmed Mohammed",
      "amount": 10000.00,
      "numberOfInstallments": 10,
      "firstInstallmentDueDate": "2024-02-01"
    }
  ]
}
</pre>
</div>

</div> </details>
 
<details> <summary> <strong>Get Loan Request By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve detailed loan request information by id.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve complete loan request details including all properties and attachments. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/LoanRequests/GetById?Id={LoanRequestId}

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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the loan request.</td></tr>
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
    <tr><td>200 OK</td><td>Loan request details</td><td>GetLoanRequestByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or not found</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<p><code>date</code> and <code>firstInstallmentDueDate</code> are returned as date strings (YYYY-MM-DD). <code>attachments</code> is a list of attachment IDs.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "LR-001",
  "date": "2024-01-15",
  "status": "Draft",
  "employeeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "loanTypeId": "4f7a1c1b-46f7-43d8-8e16-111111111111",
  "amount": 10000.00,
  "firstInstallmentDueDate": "2024-02-01",
  "numberOfInstallments": 10,
  "installmentAmount": 1000.00,
  "reason": "Personal loan request",
  "attachments": ["attachment-id-1", "attachment-id-2"]
}
</pre>
</div>

</div> </details>
 
<details> <summary> <strong>Get Managed Employees</strong>
<br /> <span style="font-size: 90%;">Retrieve list of employees managed by the current employee.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Get a list of employees that are managed by the specified manager, including their names, IDs, and current salaries. This is used when selecting an employee for a loan request to validate business rules. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/LoanRequests/GetManagedEmployees?ManagerId={ManagerId}

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
    <tr><td>ManagerId</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the manager/current employee.</td></tr>
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
    <tr><td>200 OK</td><td>List of managed employees</td><td>IEnumerable&lt;GetManagedEmployeesQueryResponse&gt;</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "name": "Ahmed Mohammed",
    "currentSalary": 5000.00,
    "previousAdvanceBalance": 0.00
  },
  {
    "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "name": "Sara Ali",
    "currentSalary": 6000.00,
    "previousAdvanceBalance": 0.00
  }
]
</pre>
</div>

<h3>Business Rules</h3>
<ul>
  <li>Uses stored procedure <code>Hr.GetManagedEmployees</code> to retrieve the employee hierarchy.</li>
  <li>Returns employees that report directly or indirectly to the specified manager.</li>
  <li>Current salary is retrieved from the employee's active contract.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Get Employee Salary Data</strong>
<br /> <span style="font-size: 90%;">Retrieve salary and advance balance data for an employee for loan request flows.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Get previous advance balance, current salary, and available amount for an employee. Data is read from stored procedure <code>Hr.GetEmployeeSalaryData</code>. Used when creating or validating loan requests to show salary context and remaining available amount. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/LoanRequests/GetEmployeeSalaryData?employeeId={EmployeeId}

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
    <tr><td>employeeId</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the employee.</td></tr>
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
    <tr><td>200 OK</td><td>Salary data returned</td><td>GetEmployeeSalaryDataQueryResponse</td></tr>
    <tr><td>204 No Content</td><td>No data found for the employee</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response body (200 OK)</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>previousAdvanceBalance</td><td>decimal</td><td>Sum of unpaid employee loan installments (advance balance).</td></tr>
    <tr><td>currentSalary</td><td>decimal</td><td>Latest salary from the employee's active contract.</td></tr>
    <tr><td>availableAmount</td><td>decimal</td><td>Current salary minus previous advance balance.</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "previousAdvanceBalance": 1500.00,
  "currentSalary": 10000.00,
  "availableAmount": 8500.00
}
</pre>
</div>

<h3>Business Rules</h3>
<ul>
  <li>Uses stored procedure <code>Hr.GetEmployeeSalaryData</code>.</li>
  <li>Current salary comes from the latest active contract salary.</li>
  <li>Previous advance balance is the sum of unpaid installments (InstallmentAmount − PaidAmount) for active employee loans.</li>
  <li>Available amount = CurrentSalary − PreviousAdvanceBalance.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Add Loan Request</strong>
<br /> <span style="font-size: 90%;">Create a new loan request.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new loan request with automatic code generation, business rule validation, and attachment handling. The loan request is created with status "Draft". <br /><br />

<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/LoanRequests/Add

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
    <tr><td>Date</td><td>string (date)</td><td>-</td><td>Required; YYYY-MM-DD</td><td>Yes</td></tr>
    <tr><td>EmployeeId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
    <tr><td>LoanTypeId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
    <tr><td>Amount</td><td>decimal</td><td>-</td><td>Greater than 0; handler enforces &lt;= CurrentSalary * 2</td><td>Yes</td></tr>
    <tr><td>InstallmentAmount</td><td>decimal</td><td>-</td><td>Greater than 0; must equal Amount / NumberOfInstallments (tolerance 0.01)</td><td>Yes</td></tr>
    <tr><td>NumberOfInstallments</td><td>int</td><td>-</td><td>Greater than 0</td><td>Yes</td></tr>
    <tr><td>FirstInstallmentDueDate</td><td>string (date)</td><td>-</td><td>Required; YYYY-MM-DD</td><td>Yes</td></tr>
    <tr><td>Reason</td><td>string?</td><td>500</td><td>Optional, max length 500</td><td>No</td></tr>
    <tr><td>Attachments</td><td>List&lt;string&gt;?</td><td>-</td><td>Optional list of attachment IDs</td><td>No</td></tr>
  </tbody>
</table>

<p>The request body must be sent in JSON format. Date fields use YYYY-MM-DD.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "date": "2024-01-15",
  "employeeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "loanTypeId": "4f7a1c1b-46f7-43d8-8e16-111111111111",
  "amount": 10000.00,
  "installmentAmount": 1000.00,
  "numberOfInstallments": 10,
  "firstInstallmentDueDate": "2024-02-01",
  "reason": "Personal loan request",
  "attachments": [
    "attachment-id-1",
    "attachment-id-2"
  ]
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
    <tr><td>201 Created</td><td>Loan request created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error or business rule violation</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<p>Returns <strong>201 Created</strong> with the newly created loan request ID (GUID string) in the response body. The <code>Location</code> header may point to the created resource.</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"11111111-1111-1111-1111-111111111111"
</div>

<h3>Business Rules</h3>
<ul>
  <li><strong>Code Generation</strong>: Automatically generated using sequence service.</li>
  <li><strong>Status</strong>: Set to "Draft" upon creation.</li>
  <li><strong>Installment Match</strong>: <code>InstallmentAmount * NumberOfInstallments</code> must equal <code>Amount</code> (tolerance 0.01 for rounding).</li>
  <li><strong>Loan Type</strong>: Must reference an existing loan type (validated in handler). The loan type defines business rules (request date range, max installments, max % from salary, etc.), enforced in handler.</li>
  <li><strong>Loan Amount Limit</strong>: Cannot exceed <code>CurrentSalary * 2</code>. Throws <code>LoanAmountExceedsLimit</code> if violated.</li>
  <li><strong>Total Installments vs Salary</strong>: <code>InstallmentAmount * NumberOfInstallments</code> cannot exceed <code>CurrentSalary</code>. Throws <code>TotalInstallmentAmountExceedsSalary</code> if violated.</li>
  <li><strong>Employee Contract</strong>: Employee must have an active contract. Throws <code>EmployeeHasnotContract</code> if not found.</li>
  <li><strong>Attachments</strong>: Attachment IDs are confirmed via attachment service before being associated with the loan request.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Edit Loan Request</strong>
<br /> <span style="font-size: 90%;">Update an existing loan request.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update an existing loan request. Only loan requests with status "Draft" can be edited. Posted loan requests cannot be modified. <br /><br />

<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/LoanRequests/Edit

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
    <tr><td>Id</td><td>guid</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>RowVersion</td><td>string?</td><td>-</td><td>Base64 concurrency token (from Get By Id); used for optimistic concurrency</td><td>No</td></tr>
    <tr><td>Code</td><td>string</td><td>-</td><td>Not empty</td><td>Yes</td></tr>
    <tr><td>Date</td><td>string (date)</td><td>-</td><td>Required; YYYY-MM-DD</td><td>Yes</td></tr>
    <tr><td>EmployeeId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
    <tr><td>LoanTypeId</td><td>guid</td><td>-</td><td>Not empty, must exist</td><td>Yes</td></tr>
    <tr><td>Amount</td><td>decimal</td><td>-</td><td>Greater than 0; handler enforces &lt;= CurrentSalary * 2</td><td>Yes</td></tr>
    <tr><td>FirstInstallmentDueDate</td><td>string (date)</td><td>-</td><td>Required; YYYY-MM-DD</td><td>Yes</td></tr>
    <tr><td>NumberOfInstallments</td><td>int</td><td>-</td><td>Greater than 0</td><td>Yes</td></tr>
    <tr><td>InstallmentAmount</td><td>decimal</td><td>-</td><td>Greater than 0; must equal Amount / NumberOfInstallments (tolerance 0.01)</td><td>Yes</td></tr>
    <tr><td>Reason</td><td>string?</td><td>500</td><td>Optional, max length 500</td><td>No</td></tr>
    <tr><td>Attachments</td><td>List&lt;string&gt;?</td><td>-</td><td>Optional list of attachment IDs</td><td>No</td></tr>
  </tbody>
</table>

<p>Provide id, code, row version (from Get By Id), and all loan request details. Attachments can be updated by providing a new list of attachment IDs.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "LR-001",
  "date": "2024-01-15",
  "employeeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "loanTypeId": "4f7a1c1b-46f7-43d8-8e16-111111111111",
  "amount": 10000.00,
  "firstInstallmentDueDate": "2024-02-01",
  "numberOfInstallments": 10,
  "installmentAmount": 1000.00,
  "reason": "Updated personal loan request",
  "attachments": ["attachment-id-1", "attachment-id-3"]
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
    <tr><td>204 No Content</td><td>Loan request updated</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error, not found, posted record, or business rule violation</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>

<h3>Business Rules</h3>
<ul>
  <li><strong>Status Check</strong>: Only loan requests with status "Draft" can be edited. Throws <code>CantEditOrDeletePostedRecord</code> exception if status is "Posted".</li>
  <li><strong>Loan Type</strong>: Must reference an existing loan type. The loan type defines business rules for the loan request.</li>
  <li><strong>Loan Amount Limit</strong>: Cannot exceed <code>CurrentSalary * 2</code>. Throws <code>LoanAmountExceedsLimit</code> exception if violated.</li>
  <li><strong>Installment Match</strong>: <code>InstallmentAmount * NumberOfInstallments</code> must equal <code>Amount</code> (tolerance 0.01).</li>
  <li><strong>Total Installments vs Salary</strong>: <code>InstallmentAmount * NumberOfInstallments</code> cannot exceed <code>CurrentSalary</code>. Throws <code>TotalInstallmentAmountExceedsSalary</code> if violated.</li>
  <li><strong>Employee Contract</strong>: Employee must have an active contract. Throws <code>EmployeeHasnotContract</code> if not found.</li>
  <li><strong>Attachments</strong>: New attachments are confirmed via attachment service. Removed attachments are soft-deleted.</li>
  <li><strong>Concurrency</strong>: Provide <code>RowVersion</code> from Get By Id for optimistic concurrency when updating.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Post Loan Request</strong>
<br /> <span style="font-size: 90%;">Change loan request status from Draft to Posted.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Post a loan request, changing its status from "Draft" to "Posted". Once posted, the loan request cannot be edited or deleted. <br /><br />

<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/LoanRequests/Post

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
    <tr><td>Id</td><td>guid</td><td>Not empty, must exist</td><td>Yes</td></tr>
  </tbody>
</table>

<p>The request body must be sent in JSON format.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 

<pre>
{
  "id": "11111111-1111-1111-1111-111111111111"
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
    <tr><td>204 No Content</td><td>Loan request posted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error, not found, or already posted</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful posting.</p>

<h3>Business Rules</h3>
<ul>
  <li><strong>Status Check</strong>: Only loan requests with status "Draft" can be posted.</li>
  <li><strong>Status Change</strong>: Changes status from "Draft" to "Posted".</li>
  <li><strong>Immutability</strong>: Once posted, the loan request cannot be edited or deleted.</li>
</ul>

</div> </details>
 
<details> <summary> <strong>Delete Loan Request</strong>
<br /> <span style="font-size: 90%;">Delete a loan request by id.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a loan request using its id. Only loan requests with status "Draft" can be deleted. Posted loan requests cannot be deleted. <br /><br />

<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/LoanRequests/Delete?Id={LoanRequestId}

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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the loan request to delete.</td></tr>
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
    <tr><td>204 No Content</td><td>Loan request deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or posted record</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion. If the loan request does not exist or is already Posted, the API returns an error.</p>

<h3>Business Rules</h3>
<ul>
  <li><strong>Status Check</strong>: Only loan requests with status "Draft" can be deleted. Throws <code>CantEditOrDeletePostedRecord</code> (or similar) if status is "Posted".</li>
  <li><strong>Soft Delete</strong>: Performs a soft delete (e.g. <code>IsDeleted = true</code>, <code>IsActive = false</code>).</li>
</ul>

</div> </details>

