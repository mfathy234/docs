## SocialInsurance

<details> <summary> <strong>Load Social Insurance Settings</strong>
<br /> <span style="font-size: 90%;">Retrieve the current social insurance settings configuration.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve the latest social insurance settings including citizen and resident insurance configurations, percentages, and payroll indicators period. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SocialInsurance/Load
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
    <tr><td>200 OK</td><td>Social insurance settings retrieved</td><td>GetSocialInsuranceQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "citizenInsuranceTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "citizenTotalPercentage": 22.0,
  "citizenCompanyShare": 12.0,
  "citizenEmployeeShare": 10.0,
  "residentInsuranceTypeId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "residentTotalPercentage": 18.0,
  "residentCompanyShare": 10.0,
  "residentEmployeeShare": 8.0,
  "fromDate": "2024-01-01",
  "toDate": "2024-12-31",
  "payrollDate": "2024-01-15",
  "isAdvanceRequestAutoConversionEnabled": true
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Save Social Insurance Settings</strong>
<br /> <span style="font-size: 90%;">Create or update social insurance settings configuration.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Save or update social insurance settings including citizen and resident insurance types, percentages, company and employee shares, and payroll indicators period. Use <code>Guid.Empty</code> for <code>id</code> and empty string for <code>rowVersion</code> when creating a new record. For updates, provide the actual <code>id</code> and <code>rowVersion</code> from the Load endpoint. <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/SocialInsurance/Save
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
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>guid</td><td>Guid.Empty for new, valid GUID for updates</td><td>Yes</td><td>Identifier of the social insurance setting. Use Guid.Empty for new records, actual GUID for updates.</td></tr>
    <tr><td>RowVersion</td><td>string</td><td>Base64 encoded, empty string for new records</td><td>Yes</td><td>Concurrency token for optimistic locking. Use empty string for new records, base64 string for updates.</td></tr>
    <tr><td>CitizenInsuranceTypeId</td><td>guid?</td><td>Valid lookup value</td><td>No</td><td>Insurance type identifier for citizens. If provided, all citizen fields (TotalPercentage, CompanyShare, EmployeeShare) are required.</td></tr>
    <tr><td>CitizenTotalPercentage</td><td>decimal?</td><td>0-100</td><td>Conditional</td><td>Total social insurance percentage for citizens. Required if CitizenInsuranceTypeId is provided.</td></tr>
    <tr><td>CitizenCompanyShare</td><td>decimal?</td><td>0-100</td><td>Conditional</td><td>Company share percentage for citizen insurance. Required if CitizenInsuranceTypeId is provided.</td></tr>
    <tr><td>CitizenEmployeeShare</td><td>decimal?</td><td>0-100</td><td>Conditional</td><td>Employee share percentage for citizen insurance. Required if CitizenInsuranceTypeId is provided.</td></tr>
    <tr><td>ResidentInsuranceTypeId</td><td>guid?</td><td>Valid lookup value</td><td>No</td><td>Insurance type identifier for residents. If provided, all resident fields (TotalPercentage, CompanyShare, EmployeeShare) are required.</td></tr>
    <tr><td>ResidentTotalPercentage</td><td>decimal?</td><td>0-100</td><td>Conditional</td><td>Total social insurance percentage for residents. Required if ResidentInsuranceTypeId is provided.</td></tr>
    <tr><td>ResidentCompanyShare</td><td>decimal?</td><td>0-100</td><td>Conditional</td><td>Company share percentage for resident insurance. Required if ResidentInsuranceTypeId is provided.</td></tr>
    <tr><td>ResidentEmployeeShare</td><td>decimal?</td><td>0-100</td><td>Conditional</td><td>Employee share percentage for resident insurance. Required if ResidentInsuranceTypeId is provided.</td></tr>
    <tr><td>FromDate</td><td>DateOnly</td><td>Valid date</td><td>Yes</td><td>Start date of the payroll indicators period.</td></tr>
    <tr><td>ToDate</td><td>DateOnly</td><td>Valid date, must be greater than or equal to FromDate</td><td>Yes</td><td>End date of the payroll indicators period.</td></tr>
    <tr><td>PayrollDate</td><td>DateOnly</td><td>Valid date</td><td>Yes</td><td>Payroll processing date.</td></tr>
    <tr><td>IsAdvanceRequestAutoConversionEnabled</td><td>bool</td><td>-</td><td>Yes</td><td>Flag indicating if advance request auto conversion is enabled.</td></tr>
  </tbody>
</table>
<p>The request body must be sent in JSON format. For new records, use <code>Guid.Empty</code> (00000000-0000-0000-0000-000000000000) for <code>id</code> and empty string for <code>rowVersion</code>.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "id": "00000000-0000-0000-0000-000000000000",
  "rowVersion": "",
  "citizenInsuranceTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "citizenTotalPercentage": 22.0,
  "citizenCompanyShare": 12.0,
  "citizenEmployeeShare": 10.0,
  "residentInsuranceTypeId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "residentTotalPercentage": 18.0,
  "residentCompanyShare": 10.0,
  "residentEmployeeShare": 8.0,
  "fromDate": "2024-01-01",
  "toDate": "2024-12-31",
  "payrollDate": "2024-01-15",
  "isAdvanceRequestAutoConversionEnabled": true
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
    <tr><td>201 Created</td><td>Social insurance settings saved</td><td>SaveSocialInsuranceCommandResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation error or row-version mismatch</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "citizenInsuranceTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "citizenTotalPercentage": 22.0,
  "citizenCompanyShare": 12.0,
  "citizenEmployeeShare": 10.0,
  "residentInsuranceTypeId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "residentTotalPercentage": 18.0,
  "residentCompanyShare": 10.0,
  "residentEmployeeShare": 8.0,
  "fromDate": "2024-01-01",
  "toDate": "2024-12-31",
  "payrollDate": "2024-01-15",
  "isAdvanceRequestAutoConversionEnabled": true
}
</pre>
</div>
<h3>Business Rules</h3>
<ul>
  <li><strong>New Record</strong>: Use <code>Guid.Empty</code> (00000000-0000-0000-0000-000000000000) for <code>id</code> and empty string for <code>rowVersion</code> when creating a new record.</li>
  <li><strong>Update Record</strong>: Use the actual <code>id</code> and <code>rowVersion</code> values retrieved from the Load endpoint when updating an existing record.</li>
  <li><strong>Conditional Validation - Citizen</strong>: If <code>CitizenInsuranceTypeId</code> is provided, all citizen fields (<code>CitizenTotalPercentage</code>, <code>CitizenCompanyShare</code>, <code>CitizenEmployeeShare</code>) are required.</li>
  <li><strong>Conditional Validation - Resident</strong>: If <code>ResidentInsuranceTypeId</code> is provided, all resident fields (<code>ResidentTotalPercentage</code>, <code>ResidentCompanyShare</code>, <code>ResidentEmployeeShare</code>) are required.</li>
  <li><strong>Date Validation</strong>: <code>ToDate</code> must be greater than or equal to <code>FromDate</code>.</li>
  <li><strong>Required Fields</strong>: <code>FromDate</code>, <code>ToDate</code>, <code>PayrollDate</code>, and <code>IsAdvanceRequestAutoConversionEnabled</code> are always required.</li>
</ul>
</div> </details>
 
<details> <summary> <strong>Get GOSI Information</strong>
<br /> <span style="font-size: 90%;">Retrieve GOSI (General Organization for Social Insurance) information for an employee.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve the company and employee parts of social insurance (GOSI) for a specific employee based on the application country code and employee ID. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SocialInsurance/GetGosiInformation?EmployeeId={EmployeeId}
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
    <tr><td>EmployeeId</td><td>query</td><td>guid?</td><td>No</td><td>Identifier of the employee. If not provided, returns general GOSI information based on default settings.</td></tr>
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
    <tr><td>200 OK</td><td>GOSI information retrieved</td><td>GetGosiInformationQueryResponse</td></tr>
    <tr><td>400 Bad Request</td><td>Validation or input error</td><td>DefaultExceptionModel</td></tr>
    <tr><td>500 Internal Server Error</td><td>Unexpected server error</td><td>DefaultExceptionModel</td></tr>
  </tbody>
</table>
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "companyPart": 12.0,
  "employeePart": 10.0
}
</pre>
</div>
<h3>Business Rules</h3>
<ul>
  <li><strong>GOSI Calculation</strong>: The GOSI information is calculated based on the application country code and employee's insurance type (citizen or resident).</li>
  <li><strong>Employee-Specific</strong>: If an employee ID is provided, the system retrieves employee-specific GOSI parts based on their insurance type and nationality.</li>
  <li><strong>General Information</strong>: If no employee ID is provided, general GOSI information is returned based on default settings from the social insurance configuration.</li>
  <li><strong>Stored Procedure</strong>: The calculation uses the stored procedure <code>Hr.GetSocialInsuranceParts</code> which considers the employee's nationality and current insurance settings.</li>
</ul>
</div> </details>

