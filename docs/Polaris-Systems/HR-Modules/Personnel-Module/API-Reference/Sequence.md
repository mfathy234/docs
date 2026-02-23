## Sequence

<details> <summary> <strong>Has Sequence Settings</strong>
<br /> <span style="font-size: 90%;">Check if sequence settings exist for a specific screen.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Check whether sequence settings are configured for a specific screen. This endpoint is used to determine if automatic code generation is available for a given screen/module. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Sequence/HasSequenceSettings?Screen={Screen}

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
    <tr><td>Screen</td><td>query</td><td>Screens</td><td>Yes</td><td>The screen identifier to check sequence settings for. Valid values include: Employee, Departments, Jobs, Contracts, LoanTypes, LoanRequests, EmployeeLoans, EmploymentCommencements, WorkLocation, SalaryTemplates, SalariesItems, Positions, Salaries, etc.</td></tr>
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
    <tr><td>200 OK</td><td>Sequence settings check result</td><td>bool</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>

<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
true
</pre>
</div>

<h3>Business Rules</h3>
<ul>
  <li><strong>Purpose</strong>: This endpoint checks if sequence settings are configured for the specified screen in the General Settings module.</li>
  <li><strong>Return Value</strong>: Returns <code>true</code> if sequence settings exist and can generate a code, <code>false</code> otherwise.</li>
  <li><strong>Screen Parameter</strong>: Must be a valid <code>Screens</code> enum value. Common HR module screens include:
    <ul>
      <li><code>Employee</code> (119) - Employee records</li>
      <li><code>Departments</code> (143) - Department records</li>
      <li><code>Jobs</code> (142) - Job records</li>
      <li><code>Contracts</code> (144) - Contract records</li>
      <li><code>LoanTypes</code> (147) - Loan type records</li>
      <li><code>LoanRequests</code> (149) - Loan request records</li>
      <li><code>EmployeeLoans</code> (151) - Employee loan records</li>
      <li><code>EmploymentCommencements</code> (150) - Employment commencement records</li>
      <li><code>WorkLocation</code> (141) - Work location records</li>
      <li><code>SalaryTemplates</code> (145) - Salary template records</li>
      <li><code>SalariesItems</code> (146) - Salary item records</li>
      <li><code>Positions</code> (140) - Position records</li>
      <li><code>Salaries</code> (148) - Salary records</li>
    </ul>
  </li>
  <li><strong>Internal Behavior</strong>: The endpoint calls the General Settings Public API to attempt generating a sequence code. If a code can be generated (non-empty string), it returns <code>true</code>; otherwise, it returns <code>false</code>.</li>
  <li><strong>Module Context</strong>: The check is performed within the HR module context (<code>Modules.Hr</code>).</li>
  <li><strong>No Persistence</strong>: The sequence check does not save or increment the sequence counter (<code>SaveToContext = false</code>).</li>
</ul>

</div> </details>
