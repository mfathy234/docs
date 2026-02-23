## Lookup

<details> <summary> <strong>Get Lookup List</strong>
<br /> <span style="font-size: 90%;">Retrieve lookup values (tables and enums) by type.</span> </summary> 
<br /> 

<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Fetch lookup entries for dropdowns and selectors. <br /><br />

<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Lookup/GetList?Lookup={Lookup}

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
    <tr>
      <td>Lookup</td>
      <td>query</td>
      <td>string</td>
      <td>Yes</td>
      <td>Lookup type. See <strong>Available Lookup Types</strong> section below for all allowed values.</td>
    </tr>
    <tr>
      <td>apiVersion</td>
      <td>path</td>
      <td>string</td>
      <td>Yes</td>
      <td>API version included in the URL.</td>
    </tr>
  </tbody>
</table>

<br />
<hr />

<h3>Available Lookup Types</h3>

<h4>Table Lookups</h4>
<p>The following lookups return data from database tables:</p>
<ul>
  <li><strong>Jobs</strong> - List of job positions</li>
  <li><strong>Countries</strong> - List of countries (includes phoneCode)</li>
  <li><strong>Employees</strong> - List of employees</li>
  <li><strong>JobLevels</strong> - List of job levels</li>
  <li><strong>Departments</strong> - List of departments</li>
  <li><strong>Nationalities</strong> - List of nationalities</li>
  <li><strong>WorkLocations</strong> - List of work locations</li>
  <li><strong>EmploymentTypes</strong> - List of employment types</li>
  <li><strong>InsuranceTypes</strong> - List of insurance types</li>
  <li><strong>ContractDurations</strong> - List of contract durations</li>
  <li><strong>SalaryTemplates</strong> - List of salary templates</li>
  <li><strong>SalariesUnits</strong> - List of salary units</li>
  <li><strong>TrialPeriodDays</strong> - List of trial period day options</li>
  <li><strong>SalariesItems</strong> - List of salary items (includes salaryUnitId)</li>
  <li><strong>LoanRequests</strong> - List of loan requests</li>
</ul>

<h4>Enum Lookups</h4>
<p>The following lookups return enum values with localized names:</p>
<ul>
  <li><strong>Gender</strong> - Gender options</li>
  <li><strong>Religions</strong> - Religion options</li>
  <li><strong>BloodTypes</strong> - Blood type options</li>
  <li><strong>RenewalTypes</strong> - Contract renewal type options</li>
  <li><strong>ContractTypes</strong> - Contract type options</li>
  <li><strong>MaritalStatus</strong> - Marital status options</li>
  <li><strong>ContractStatus</strong> - Contract status options</li>
  <li><strong>PaymentMethods</strong> - Payment method options</li>
  <li><strong>RelationshipTypes</strong> - Relationship type options</li>
  <li><strong>PaymentFrequencies</strong> - Payment frequency options</li>
  <li><strong>LoanCalculationTypes</strong> - Loan calculation type options</li>
  <li><strong>CommencementTypes</strong> - Employment commencement type options</li>
  <li><strong>SalaryItemTypes</strong> - Salary item type options</li>
  <li><strong>LoanSources</strong> - Loan source options</li>
</ul>

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
    <tr>
      <td>200 OK</td>
      <td>Lookup list for the requested type</td>
      <td>IEnumerable&lt;object&gt; (usually Id/Name; some lookups include extra fields)</td>
    </tr>
    <tr>
      <td>400 Bad Request</td>
      <td>Validation error or unknown lookup type</td>
      <td>DefaultExceptionModel</td>
    </tr>
    <tr>
      <td>500 Internal Server Error</td>
      <td>Unexpected server error</td>
      <td>DefaultExceptionModel</td>
    </tr>
  </tbody>
</table>

<br />
<hr />

<h3>Response Examples</h3>

<h4>Table Lookup Example (Countries)</h4>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "id": "SA",
    "name": "Saudi Arabia",
    "phoneCode": "+966"
  },
  {
    "id": "AE",
    "name": "United Arab Emirates",
    "phoneCode": "+971"
  }
]
</pre>
</div>

<h4>Enum Lookup Example (Gender)</h4>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "id": "Male",
    "name": "Male"
  },
  {
    "id": "Female",
    "name": "Female"
  }
]
</pre>
</div>

<br />
<hr />

<h3>Response Notes</h3>
<ul>
  <li><strong>Enum lookups</strong> return items with string <code>id</code> (enum name) and localized <code>name</code> (based on current language).</li>
  <li><strong>Table lookups</strong> generally return <code>id</code> (GUID or string) and <code>name</code>.</li>
  <li><strong>Countries</strong> lookup also includes <code>phoneCode</code> field.</li>
  <li><strong>SalariesItems</strong> lookup also includes <code>salaryUnitId</code> field.</li>
</ul>

<br />
<hr />

<h3>Enum Values Reference</h3>

<p>The following sections list all enum values that can be returned by enum lookups. The <code>id</code> field in the response will be the enum name (e.g., "Male", "Monthly"), and the <code>name</code> field will be the localized name based on the current language.</p>

<h4>Gender</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Male = 1</td><td>"Male"</td><td>"ذكر"</td><td>"Male"</td></tr>
    <tr><td>Female = 2</td><td>"Female"</td><td>"أنثى"</td><td>"Female"</td></tr>
  </tbody>
</table>

<h4>Religions</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Muslim = 1</td><td>"Muslim"</td><td>"مسلم"</td><td>"Muslim"</td></tr>
    <tr><td>Christian = 2</td><td>"Christian"</td><td>"مسيحي"</td><td>"Christian"</td></tr>
    <tr><td>Other = 3</td><td>"Other"</td><td>"أخرى"</td><td>"Other"</td></tr>
  </tbody>
</table>

<h4>BloodTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>APositive</td><td>"APositive"</td><td>"A+"</td></tr>
    <tr><td>ANegative</td><td>"ANegative"</td><td>"A-"</td></tr>
    <tr><td>BPositive</td><td>"BPositive"</td><td>"B+"</td></tr>
    <tr><td>BNegative</td><td>"BNegative"</td><td>"B-"</td></tr>
    <tr><td>ABPositive</td><td>"ABPositive"</td><td>"AB+"</td></tr>
    <tr><td>ABNegative</td><td>"ABNegative"</td><td>"AB-"</td></tr>
    <tr><td>OPositive</td><td>"OPositive"</td><td>"O+"</td></tr>
    <tr><td>ONegative</td><td>"ONegative"</td><td>"O-"</td></tr>
  </tbody>
</table>

<h4>RenewalTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Automatic = 1</td><td>"Automatic"</td><td>"تلقائي"</td><td>"Automatic"</td></tr>
    <tr><td>Manual = 2</td><td>"Manual"</td><td>"يدوي"</td><td>"Manual"</td></tr>
    <tr><td>NotRenewable = 3</td><td>"NotRenewable"</td><td>"غير قابل للتجديد"</td><td>"Not Renewable"</td></tr>
  </tbody>
</table>

<h4>ContractTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>FullTime = 1</td><td>"FullTime"</td><td>"دوام كامل"</td><td>"Full-time"</td></tr>
    <tr><td>PartTime = 2</td><td>"PartTime"</td><td>"دوام جزئي"</td><td>"Part-time"</td></tr>
    <tr><td>Internship = 3</td><td>"Internship"</td><td>"تدريب"</td><td>"Internship"</td></tr>
  </tbody>
</table>

<h4>MaritalStatus</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Single = 1</td><td>"Single"</td><td>"أعزب"</td><td>"Single"</td></tr>
    <tr><td>Married = 2</td><td>"Married"</td><td>"متزوج"</td><td>"Married"</td></tr>
    <tr><td>Divorced = 3</td><td>"Divorced"</td><td>"مطلق"</td><td>"Divorced"</td></tr>
    <tr><td>Widower = 4</td><td>"Widower"</td><td>"أرمل"</td><td>"Widower"</td></tr>
  </tbody>
</table>

<h4>ContractStatus</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Draft</td><td>"Draft"</td><td>"مسودة"</td><td>"Draft"</td></tr>
    <tr><td>Active</td><td>"Active"</td><td>"نشط"</td><td>"Active"</td></tr>
    <tr><td>Closed</td><td>"Closed"</td><td>"مغلق"</td><td>"Closed"</td></tr>
  </tbody>
</table>

<h4>RelationshipTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Father = 1</td><td>"Father"</td><td>"أب"</td><td>"Father"</td></tr>
    <tr><td>Mother = 2</td><td>"Mother"</td><td>"أم"</td><td>"Mother"</td></tr>
    <tr><td>Wife = 3</td><td>"Wife"</td><td>"زوجة"</td><td>"Wife"</td></tr>
    <tr><td>Son = 4</td><td>"Son"</td><td>"ابن"</td><td>"Son"</td></tr>
    <tr><td>Daughter = 5</td><td>"Daughter"</td><td>"ابنة"</td><td>"Daughter"</td></tr>
    <tr><td>Brother = 6</td><td>"Brother"</td><td>"أخ"</td><td>"Brother"</td></tr>
    <tr><td>Sister = 7</td><td>"Sister"</td><td>"أخت"</td><td>"Sister"</td></tr>
  </tbody>
</table>

<h4>PaymentFrequencies</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Monthly = 1</td><td>"Monthly"</td><td>"شهري"</td><td>"Monthly"</td></tr>
    <tr><td>Yearly = 2</td><td>"Yearly"</td><td>"سنوي"</td><td>"Yearly"</td></tr>
  </tbody>
</table>

<h4>PaymentMethods</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Cash = 1</td><td>"Cash"</td><td>"نقدي"</td><td>"Cash"</td></tr>
    <tr><td>CreditCard = 2</td><td>"CreditCard"</td><td>"بطاقة ائتمان"</td><td>"Credit Card"</td></tr>
    <tr><td>DebitCard = 3</td><td>"DebitCard"</td><td>"بطاقة خصم مباشر"</td><td>"Debit Card"</td></tr>
    <tr><td>BankTransfer = 4</td><td>"BankTransfer"</td><td>"تحويل بنكي"</td><td>"Bank Transfer"</td></tr>
    <tr><td>Cheque = 5</td><td>"Cheque"</td><td>"شيك"</td><td>"Cheque"</td></tr>
    <tr><td>MobileWallet = 6</td><td>"MobileWallet"</td><td>"محفظة إلكترونية"</td><td>"Mobile Wallet"</td></tr>
  </tbody>
</table>

<h4>LoanCalculationTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Installments = 1</td><td>"Installments"</td><td>"أقساط"</td><td>"Installments"</td></tr>
    <tr><td>Monthly = 2</td><td>"Monthly"</td><td>"شهرى"</td><td>"Monthly"</td></tr>
  </tbody>
</table>

<h4>CommencementTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>FirstTime = 1</td><td>"FirstTime"</td><td>"أول مرة"</td><td>"First Time"</td></tr>
    <tr><td>ReturnFromLeave = 2</td><td>"ReturnFromLeave"</td><td>"عودة من إجازة"</td><td>"Return From Leave"</td></tr>
  </tbody>
</table>

<h4>SalaryItemTypes</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Earning = 1</td><td>"Earning"</td><td>"استحقاق"</td><td>"Earning"</td></tr>
    <tr><td>Deduction = 2</td><td>"Deduction"</td><td>"استقطاع"</td><td>"Deduction"</td></tr>
  </tbody>
</table>

<h4>LoanSources</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Enum Value</th>
      <th style="text-align:left;">ID (String)</th>
      <th style="text-align:left;">Name (Arabic)</th>
      <th style="text-align:left;">Name (English)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Direct = 1</td><td>"Direct"</td><td>"مباشر"</td><td>"Direct"</td></tr>
    <tr><td>FromRequest = 2</td><td>"FromRequest"</td><td>"من طلب"</td><td>"From Request"</td></tr>
  </tbody>
</table>

</div>
</details>
