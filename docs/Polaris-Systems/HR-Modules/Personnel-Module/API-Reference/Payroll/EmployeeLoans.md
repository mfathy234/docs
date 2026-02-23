## EmployeeLoans

API for employee loans: list (paginated, filter by employee, loan source, date range, status), get by id, add, edit, post, and delete. Employee loans can be created from a posted loan request (FromRequest) or directly (Direct). They are created as Draft and can be posted; only Draft loans can be edited or deleted. Code is generated via the sequence service; installments are generated automatically.

<details> <summary> <strong>Get All Employee Loans</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of employee loans with filtering and sorting options.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of employee loans with pagination, search, filtering by employee, loan source, date range, and status, with sorting capabilities. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/EmployeeLoans/GetAll?SearchTerm={SearchTerm}&EmployeeId={EmployeeId}&LoanSource={LoanSource}&DateFrom={DateFrom}&DateTo={DateTo}&Status={Status}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
    <tr><td>SearchTerm</td><td>query</td><td>string?</td><td>No</td><td>Keyword to filter employee loans by code or employee name.</td></tr>
    <tr><td>EmployeeId</td><td>query</td><td>guid?</td><td>No</td><td>Filter by specific employee identifier.</td></tr>
    <tr><td>LoanSource</td><td>query</td><td>LoanSource?</td><td>No</td><td>Filter by loan source (Direct | FromRequest).</td></tr>
    <tr><td>DateFrom</td><td>query</td><td>string (date)</td><td>No</td><td>Filter employee loans from this date (inclusive). YYYY-MM-DD.</td></tr>
    <tr><td>DateTo</td><td>query</td><td>string (date)</td><td>No</td><td>Filter employee loans up to this date (inclusive). YYYY-MM-DD.</td></tr>
    <tr><td>Status</td><td>query</td><td>EmployeeLoanStatus?</td><td>No</td><td>Filter by status (Draft | Posted).</td></tr>
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
    <tr><td>200 OK</td><td>Paginated employee loans list</td><td>PaginationVm&lt;GetAllEmployeeLoansQueryResponse&gt;</td></tr>
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
      "code": "EL-001",
      "employeeName": "Ahmed Mohammed",
      "loanSourceName": "Direct",
      "loanRequestCode": null,
      "date": "2024-01-15",
      "installmentAmount": 1000.00,
      "loanAmount": 10000.00,
      "numberOfInstallments": 10,
      "status": "Draft",
      "totalPaidAmount": 0.00,
      "firstInstallmentDueDate": "2024-02-01"
    }
  ]
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get Employee Loan By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve detailed employee loan information by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve complete employee loan details including all properties, installments, and attachments (full record data). <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/EmployeeLoans/GetById?Id={EmployeeLoanId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the employee loan.</td></tr>
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
    <tr><td>200 OK</td><td>Employee loan details</td><td>GetEmployeeLoanByIdQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or not found</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response model (GetEmployeeLoanByIdQueryResponse)</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>id</td><td>guid</td><td>Employee loan identifier.</td></tr>
    <tr><td>rowVersion</td><td>string?</td><td>Base64 concurrency token.</td></tr>
    <tr><td>code</td><td>string</td><td>Employee loan code.</td></tr>
    <tr><td>date</td><td>string (date)</td><td>Loan date (YYYY-MM-DD).</td></tr>
    <tr><td>status</td><td>EmployeeLoanStatus</td><td>Draft | Posted.</td></tr>
    <tr><td>notes</td><td>string?</td><td>Optional notes.</td></tr>
    <tr><td>employeeId</td><td>guid</td><td>Employee identifier.</td></tr>
    <tr><td>employeeName</td><td>string</td><td>Employee display name (may be empty if not loaded).</td></tr>
    <tr><td>loanSource</td><td>string?</td><td>Direct | FromRequest.</td></tr>
    <tr><td>loanRequestId</td><td>guid?</td><td>Linked loan request id when loan source is FromRequest.</td></tr>
    <tr><td>loanRequestCode</td><td>string?</td><td>Linked loan request code.</td></tr>
    <tr><td>loanAmount</td><td>decimal</td><td>Total loan amount.</td></tr>
    <tr><td>employeeSalary</td><td>decimal</td><td>Employee salary at loan date.</td></tr>
    <tr><td>firstInstallmentDueDate</td><td>string (date)</td><td>First installment due date (YYYY-MM-DD).</td></tr>
    <tr><td>numberOfInstallments</td><td>int</td><td>Number of installments.</td></tr>
    <tr><td>installmentAmount</td><td>decimal</td><td>Amount per installment.</td></tr>
    <tr><td>installments</td><td>List&lt;EmployeeLoanInstallmentDto&gt;</td><td>All installments (id, installmentNumber, installmentAmount, dueDate, payrollTransaction (date?), paidAmount).</td></tr>
    <tr><td>attachments</td><td>List&lt;EmployeeLoanAttachmentDto&gt;</td><td>All attachments (id, rowVersion, attachmentId, employeeLoanId).</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "EL-001",
  "date": "2024-01-15",
  "status": "Draft",
  "notes": "Personal loan",
  "employeeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "employeeName": "Ahmed Mohammed",
  "loanSource": "Direct",
  "loanRequestId": null,
  "loanRequestCode": null,
  "loanAmount": 10000.00,
  "employeeSalary": 5000.00,
  "firstInstallmentDueDate": "2024-02-01",
  "numberOfInstallments": 10,
  "installmentAmount": 1000.00,
  "installments": [
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "installmentNumber": 1,
      "installmentAmount": 1000.00,
      "dueDate": "2024-02-01",
      "payrollTransaction": "2024-02-01",
      "paidAmount": 0.00
    },
    {
      "id": "33333333-3333-3333-3333-333333333333",
      "installmentNumber": 2,
      "installmentAmount": 1000.00,
      "dueDate": "2024-03-01",
      "payrollTransaction": "2024-03-01",
      "paidAmount": 0.00
    }
  ],
  "attachments": [
    {
      "id": "44444444-4444-4444-4444-444444444444",
      "rowVersion": "AAAAAAAAB9E=",
      "attachmentId": "attachment-guid-from-files-service",
      "employeeLoanId": "11111111-1111-1111-1111-111111111111"
    }
  ]
}
</pre>
</div>
<p><strong>Note:</strong> Date fields (<code>date</code>, <code>firstInstallmentDueDate</code>, <code>dueDate</code>, <code>payrollTransaction</code>) are returned as date strings (YYYY-MM-DD). <code>employeeName</code> may be empty when employee data is not loaded; use <code>employeeId</code> to resolve from the Employees API if needed.</p>
</div> </details>
 
<details> <summary> <strong>Add Employee Loan</strong>
<br /> <span style="font-size: 90%;">Create a new employee loan.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new employee loan with automatic code generation, business rule validation, and installment generation. The employee loan is created with status "Draft". <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/EmployeeLoans/Add
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
    <tr><td>LoanSource</td><td>LoanSource</td><td>-</td><td>Direct | FromRequest</td><td>Yes</td></tr>
    <tr><td>LoanRequestId</td><td>guid?</td><td>-</td><td>Required if LoanSource is FromRequest; loan request must exist and be Posted</td><td>Conditional</td></tr>
    <tr><td>LoanAmount</td><td>decimal</td><td>-</td><td>Greater than 0; handler enforces &lt;= CurrentSalary * 2</td><td>Yes</td></tr>
    <tr><td>FirstInstallmentDueDate</td><td>string (date)</td><td>-</td><td>Required; YYYY-MM-DD</td><td>Yes</td></tr>
    <tr><td>NumberOfInstallments</td><td>int</td><td>-</td><td>Greater than 0</td><td>Yes</td></tr>
    <tr><td>InstallmentAmount</td><td>decimal</td><td>-</td><td>Greater than 0; must equal LoanAmount / NumberOfInstallments (tolerance 0.01)</td><td>Yes</td></tr>
    <tr><td>Notes</td><td>string?</td><td>1000</td><td>Optional, max length 1000</td><td>No</td></tr>
    <tr><td>Attachments</td><td>List&lt;string&gt;?</td><td>-</td><td>Optional list of attachment IDs</td><td>No</td></tr>
  </tbody>
</table>
<p>The request body must be sent in JSON format. Date fields use YYYY-MM-DD. Employee salary is set from the employee's active contract by the server.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "date": "2024-01-15",
  "employeeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "loanSource": "Direct",
  "loanRequestId": null,
  "loanAmount": 10000.00,
  "firstInstallmentDueDate": "2024-02-01",
  "numberOfInstallments": 10,
  "installmentAmount": 1000.00,
  "notes": "Personal loan",
  "attachments": []
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
    <tr><td>201 Created</td><td>Employee loan created</td><td>GUID string</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error or business rule violation</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<p>Returns <strong>201 Created</strong> with the newly created employee loan ID (GUID string) in the response body. The <code>Location</code> header may point to the Get By Id resource.</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"11111111-1111-1111-1111-111111111111"
</div>
<h3>Business Rules</h3>
<ul>
  <li><strong>Code Generation</strong>: Automatically generated using sequence service.</li>
  <li><strong>Status</strong>: Set to "Draft" upon creation.</li>
  <li><strong>Employee Salary</strong>: Set from the employee's current active contract (not from request body).</li>
  <li><strong>Installment Match</strong>: <code>InstallmentAmount * NumberOfInstallments</code> must equal <code>LoanAmount</code> (tolerance 0.01). Throws <code>InstallmentAmountMismatch</code> if violated.</li>
  <li><strong>Loan Amount Limit</strong>: Cannot exceed <code>CurrentSalary * 2</code>. Throws <code>LoanAmountExceedsLimit</code> if violated.</li>
  <li><strong>Employee Contract</strong>: Employee must have an active contract. Throws <code>EmployeeHasnotContract</code> if not found.</li>
  <li><strong>Loan Source: FromRequest</strong>: If <code>LoanSource</code> is "FromRequest", <code>LoanRequestId</code> is required. The loan request must exist and be Posted (not Draft).</li>
  <li><strong>Loan Source: Direct</strong>: If <code>LoanSource</code> is "Direct", the employee loan is created without a linked loan request.</li>
  <li><strong>Installment Generation</strong>: Installments are generated automatically from <code>NumberOfInstallments</code>, <code>FirstInstallmentDueDate</code>, and <code>InstallmentAmount</code> (monthly from first due date).</li>
  <li><strong>Notes</strong>: Maximum length 1000 characters.</li>
</ul>
</div> </details>
 
<details> <summary> <strong>Edit Employee Loan</strong>
<br /> <span style="font-size: 90%;">Update an existing employee loan.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update an existing employee loan. Only employee loans with status "Draft" can be edited. Posted employee loans cannot be modified. <br /><br />
<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/EmployeeLoans/Edit
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
    <tr><td>LoanSource</td><td>LoanSource</td><td>-</td><td>Direct | FromRequest</td><td>Yes</td></tr>
    <tr><td>LoanRequestId</td><td>guid?</td><td>-</td><td>Optional; required when LoanSource is FromRequest</td><td>Conditional</td></tr>
    <tr><td>LoanAmount</td><td>decimal</td><td>-</td><td>Greater than 0; handler enforces &lt;= CurrentSalary * 2</td><td>Yes</td></tr>
    <tr><td>FirstInstallmentDueDate</td><td>string (date)</td><td>-</td><td>Required; YYYY-MM-DD</td><td>Yes</td></tr>
    <tr><td>NumberOfInstallments</td><td>int</td><td>-</td><td>Greater than 0</td><td>Yes</td></tr>
    <tr><td>InstallmentAmount</td><td>decimal</td><td>-</td><td>Greater than 0; must equal LoanAmount / NumberOfInstallments (tolerance 0.01)</td><td>Yes</td></tr>
    <tr><td>Notes</td><td>string?</td><td>1000</td><td>Optional, max length 1000</td><td>No</td></tr>
    <tr><td>Attachments</td><td>List&lt;string&gt;?</td><td>-</td><td>Optional list of attachment IDs</td><td>No</td></tr>
  </tbody>
</table>
<p>Provide id, row version (from Get By Id), code, and all employee loan details. Installments are regenerated when loan details change. Employee salary is updated from the employee's active contract.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "EL-001",
  "date": "2024-01-15",
  "employeeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "loanSource": "Direct",
  "loanRequestId": null,
  "loanAmount": 10000.00,
  "firstInstallmentDueDate": "2024-02-01",
  "numberOfInstallments": 10,
  "installmentAmount": 1000.00,
  "notes": "Updated personal loan",
  "attachments": []
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
    <tr><td>204 No Content</td><td>Employee loan updated</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error, not found, posted record, or business rule violation</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>
<h3>Business Rules</h3>
<ul>
  <li><strong>Status Check</strong>: Only employee loans with status "Draft" can be edited. Throws <code>CantEditOrDeletePostedRecord</code> exception if status is "Posted".</li>
  <li><strong>Employee Salary</strong>: Automatically retrieved and updated from the employee's current active contract.</li>
  <li><strong>Loan Amount Limit</strong>: Cannot exceed <code>CurrentSalary * 2</code>. Throws <code>LoanAmountExceedsLimit</code> exception if violated.</li>
  <li><strong>Installment Match</strong>: <code>InstallmentAmount * NumberOfInstallments</code> must equal <code>LoanAmount</code> (tolerance 0.01). Throws <code>InstallmentAmountMismatch</code> if violated.</li>
  <li><strong>Employee Contract</strong>: Employee must have an active contract. Throws <code>EmployeeHasnotContract</code> if not found.</li>
  <li><strong>Installments</strong>: Installments are regenerated when loan amount, count, or first due date changes.</li>
  <li><strong>Concurrency</strong>: Provide <code>RowVersion</code> from Get By Id for optimistic concurrency.</li>
</ul>
</div> </details>
 
<details> <summary> <strong>Post Employee Loan</strong>
<br /> <span style="font-size: 90%;">Change employee loan status from Draft to Posted.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Post an employee loan, changing its status from "Draft" to "Posted". Once posted, the employee loan cannot be edited or deleted. <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/EmployeeLoans/Post
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
    <tr><td>204 No Content</td><td>Employee loan posted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error, not found, or already posted</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful posting.</p>
<h3>Business Rules</h3>
<ul>
  <li><strong>Status Check</strong>: Only employee loans with status "Draft" can be posted.</li>
  <li><strong>Status Change</strong>: Changes status from "Draft" to "Posted".</li>
  <li><strong>Immutability</strong>: Once posted, the employee loan cannot be edited or deleted.</li>
</ul>
</div> </details>
 
<details> <summary> <strong>Delete Employee Loan</strong>
<br /> <span style="font-size: 90%;">Delete an employee loan by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete an employee loan using its id. Only employee loans with status "Draft" can be deleted. Posted employee loans cannot be deleted. <br /><br />
<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/EmployeeLoans/Delete?Id={EmployeeLoanId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the employee loan to delete.</td></tr>
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
    <tr><td>204 No Content</td><td>Employee loan deleted</td><td>-</td></tr>
    <tr><td>400 Bad Request</td><td>Validation, not found, or posted record</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion. If the employee loan does not exist or is already Posted, the API returns an error.</p>
<h3>Business Rules</h3>
<ul>
  <li><strong>Status Check</strong>: Only employee loans with status "Draft" can be deleted. Throws <code>CantEditOrDeletePostedRecord</code> (or similar) if status is "Posted".</li>
  <li><strong>Soft Delete</strong>: Performs a soft delete (e.g. <code>IsDeleted = true</code>, <code>IsActive = false</code>). Associated installments are also soft-deleted.</li>
</ul>
</div> </details>

