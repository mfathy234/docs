## Contracts

This section covers all the contracts master data endpoints and the **validation rules** that apply to request data. Ensure your payloads satisfy these rules to avoid `400 Bad Request` or business-rule errors.

---

### Validations and required data

The following rules are enforced by validators and handlers. Use them to build valid request bodies and to understand error messages.

#### Add Contract

| Area | Rule | Required / Constraint |
|------|------|------------------------|
| **Contract** | ContractDate | Required. |
| | ContractStartDate | Required; must be **≥ ContractDate**. |
| | RenewalType | Required; one of: `Automatic`, `Manual`, `NotRenewable`. |
| | ContractType | Required; one of: `FullTime`, `PartTime`, `Internship`. |
| | TrialPeriodDayId | Required **when** HasTrialPeriod is true; must reference an existing trial period. |
| | VacationDays | Required; **≥ 0**. |
| | VacationAccrualMonths | Required; **> 0**. |
| | TicketsCount | Required; **≥ 0**. |
| | TicketsAccrualMonths | Required; **> 0**. |
| | NoticePeriodDays | Required; **≥ 0**. |
| | EmployeeId | Required; must reference an existing employee. |
| | ContractDurationId | Required; must reference an existing contract duration. |
| **Position** | **Required.** One position per contract. | |
| | JobId | Required; must reference an existing job. |
| | DepartmentId | Required; must reference an existing department. |
| | WorkLocationId | Required; must reference an existing work location. |
| **Salary** | **Required.** One salary per contract. | |
| | PaymentFrequency | Required; e.g. `Monthly`, `Yearly`. |
| | PaymentMethod | Required; e.g. `Cash`, `BankTransfer`, `Cheque`, `CreditCard`, `DebitCard`, `MobileWallet`. |
| | SalaryTemplateId | Required; must reference an existing salary template. |
| | ContractSalaryItems | Required; **at least one** item. |
| | ContractSalaryItems[].Value | Required; **> 0**. |
| | ContractSalaryItems[].SalaryTemplateItemId | Required; must reference an existing salary template item. |

**Handler rules (Add):**

- The employee must **not** already have a contract (one contract per employee).
- Position and salary are mandatory; the handler will fail if either is missing.
- Position and salary **StartDate** and **EndDate** are set from the contract (start date and contract end based on duration).

---

#### Edit Contract

Same validation rules as **Add Contract** for contract header, position, and salary. Additionally:

| Field | Rule |
|-------|------|
| Id | Required (contract to update). |
| RowVersion | Required (for concurrency). |
| Position | Required; JobId, DepartmentId, WorkLocationId required. |
| Salary | Required; PaymentFrequency, PaymentMethod, SalaryTemplateId required; at least one ContractSalaryItem with Value > 0 and SalaryTemplateItemId. |

---

#### Upgrade Contract

At least one of **Salary** or **Position** must be sent. Each part sent is validated as below.

| Area | Rule | Required / Constraint |
|------|------|------------------------|
| **Request** | ContractId | Required. |
| | Salary **or** Position | At least one must be provided. |
| **Salary (if sent)** | LastRecordEndDate | Required. |
| | StartDate | Required; must be **≥ LastRecordEndDate**. |
| | PaymentFrequency | Required. |
| | PaymentMethod | Required. |
| | SalaryTemplateId | Required; must exist (checked in handler). |
| | ContractSalaryItems | Required; **at least one** item. |
| | ContractSalaryItems[].Value | Required; **> 0**. |
| | ContractSalaryItems[].SalaryTemplateItemId | Required; must exist (checked in handler). |
| **Position (if sent)** | LastRecordEndDate | Required. |
| | StartDate | Required; must be **≥ LastRecordEndDate**. |
| | JobId | Required; must reference an existing job. |
| | DepartmentId | Required; must reference an existing department. |
| | WorkLocationId | Required; must reference an existing work location. |

**Handler rules (Upgrade):**

- Contract must **exist** and be **Active**. Draft or Closed contracts cannot be upgraded.
- SalaryTemplateId and each SalaryTemplateItemId are validated to exist in the database.
- **Date rules:** New record EndDate (derived from StartDate + contract duration) must **not exceed** the contract end date; StartDate must **not be before** the contract start date; StartDate must **not be after** the new record EndDate.
- The previous salary or position record is closed (EndDate set to LastRecordEndDate, status set to Closed).

**Note:** Position does **not** include `reportToId`. Salary items do **not** include `itemType`; only `value` and `salaryTemplateItemId` are used.

---

#### Renew Contract

| Field | Rule |
|-------|------|
| ContractId | Required. |
| ContractDurationId | Required. |
| RenewalType | Required; one of: `Automatic`, `Manual`, `NotRenewable`. |
| ContractDate | Required. |
| StartDate | Required. |

---

### Endpoints

<details> <summary> <strong>Get All Contracts</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of all contracts with filtering and sorting options.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of all employee contracts with advanced filtering, pagination, search, and sorting. Filter by contract code, employee information, dates, job position, department, manager, or work location. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Contracts/GetAll?SearchTerm={SearchTerm}&ContractCode={ContractCode}&EmployeeCode={EmployeeCode}&EmployeeName={EmployeeName}&ContractDateFrom={ContractDateFrom}&ContractDateTo={ContractDateTo}&ContractStartDateFrom={ContractStartDateFrom}&ContractStartDateTo={ContractStartDateTo}&JobPositionName={JobPositionName}&DepartmentName={DepartmentName}&DirectManagerName={DirectManagerName}&WorkLocationName={WorkLocationName}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
      <td>SearchTerm</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Keyword to search across multiple fields: contract code, employee code, employee name (Arabic/English), job position, department, direct manager, and work location.</td>
    </tr>
    <tr>
      <td>ContractCode</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by contract code (partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>EmployeeCode</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by employee code (partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>EmployeeName</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by employee name (searches both Arabic and English names, partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>ContractDateFrom</td>
      <td>query</td>
      <td>DateOnly</td>
      <td>No</td>
      <td>Filter contracts with contract date from this date (inclusive). Format: YYYY-MM-DD</td>
    </tr>
    <tr>
      <td>ContractDateTo</td>
      <td>query</td>
      <td>DateOnly</td>
      <td>No</td>
      <td>Filter contracts with contract date up to this date (inclusive). Format: YYYY-MM-DD</td>
    </tr>
    <tr>
      <td>ContractStartDateFrom</td>
      <td>query</td>
      <td>DateOnly</td>
      <td>No</td>
      <td>Filter contracts with start date from this date (inclusive). Format: YYYY-MM-DD</td>
    </tr>
    <tr>
      <td>ContractStartDateTo</td>
      <td>query</td>
      <td>DateOnly</td>
      <td>No</td>
      <td>Filter contracts with start date up to this date (inclusive). Format: YYYY-MM-DD</td>
    </tr>
    <tr>
      <td>JobPositionName</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by job position name (partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>DepartmentName</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by department name (partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>DirectManagerName</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by direct manager name (searches both Arabic and English names, partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>WorkLocationName</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Filter by work location name (partial match, case-insensitive).</td>
    </tr>
    <tr>
      <td>PageNumber</td>
      <td>query</td>
      <td>int</td>
      <td>Yes</td>
      <td>The page number for paginated results.</td>
    </tr>
    <tr>
      <td>PageSize</td>
      <td>query</td>
      <td>int</td>
      <td>Yes</td>
      <td>The number of items per page.</td>
    </tr>
    <tr>
      <td>SortBy</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>Sorting direction (Ascending / Descending).</td>
    </tr>
    <tr>
      <td>SortColumn</td>
      <td>query</td>
      <td>string</td>
      <td>No</td>
      <td>The column used for sorting (e.g., CreatedOn, ContractDate).</td>
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
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "pageInfoResult": {
    "currentPage": 1,
    "pageSize": 25,
    "totalItems": 5
  },
  "result": [
    {
      "contractId": "988a8ae5-4044-494c-3075-08de30d9bd48",
      "contractCode": "HR-2645",
      "employeeCode": "EMP009",
      "employeeName": "Yousef Nasser",
      "contractDate": "1992-03-10",
      "contractStartDate": "1998-11-01",
      "jobPosition": "Software Developer",
      "department": "IT Department",
      "directManager": "Ahmed Mohammed",
      "workLocation": "Main Office"
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Get Contract By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve detailed contract information by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve all the information about a contract using the contract id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Contracts/GetById?Id={Id}
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
      <td>Id</td>
      <td>query</td>
      <td>guid</td>
      <td>Yes</td>
      <td>Unique identifier of the contract.</td>
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
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "988a8ae5-4044-494c-3075-08de30d9bd48",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "HR-2645",
  "contractDate": "1992-03-10",
  "status": "Active",
  "renewalType": "Manual",
  "contractType": "PartTime",
  "contractStartDate": "1998-11-01",
  "hasTrialPeriod": true,
  "trialPeriodDayId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "vacationDays": 21,
  "vacationAccrualMonths": 12,
  "ticketsCount": 2,
  "ticketsAccrualMonths": 12,
  "noticePeriodDays": 30,
  "employeeId": "08842F92-F718-400B-B730-011CCA22E3A1",
  "contractDurationId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "histories": [
    {
      "id": "182707c1-9c1a-4fb6-56d4-08de30d358fd",
      "rowVersion": "AAAAAAAAB8M=",
      "code": "HR-3982",
      "renewalType": "Automatic",
      "status": "Expired",
      "contractDate": "1990-01-01",
      "contractStartDate": "1990-01-01",
      "contractEndDate": "1992-02-28",
      "contractDurationId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
      "contractDurationName": "2 Years"
    }
  ],
  "positions": [
    {
      "id": "6ce8a0d4-00d5-4f82-a4c4-1e2e5f6bb5be",
      "rowVersion": "AAAAAAAAB8Q=",
      "startDate": "1998-11-01",
      "endDate": null,
      "jobId": "BCEBEF9A-37FD-4F5C-96F3-BC3270F4139B",
      "reportToId": "44444444-4444-4444-4444-444444444444",
      "departmentId": "43F4FAC7-9A06-42B2-1553-08DE1F7A149A",
      "workLocationId": "314478C2-5AAB-4B9F-8313-8A8429EBD7F1"
    }
  ],
  "salaries": [
    {
      "id": "58aedff8-cc85-4b8d-bdc1-51adbbf92f7e",
      "rowVersion": "AAAAAAAAB8R=",
      "paymentFrequency": "Monthly",
      "paymentMethod": "Cash",
      "status": "Active",
      "totalSalary": 10000.00,
      "startDate": "1998-11-01",
      "endDate": null,
      "salaryTemplateId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "contractSalaryItems": [
        {
          "id": "7bf9e0e5-df96-4c8e-9e0f-62fc7d8e9f0a",
          "itemType": "Allowance",
          "value": 5000.00,
          "salaryTemplateItemId": "8cf0f1f6-eg07-5d9f-af1g-73gd8e9f0g1b"
        }
      ]
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>View Contract By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve optimized contract information by id using SQL view.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve contract information using optimized SQL view with all related entity names (returns both Arabic and English names, selected based on current language). <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Contracts/ViewById?Id={Id}
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
      <td>Id</td>
      <td>query</td>
      <td>guid</td>
      <td>Yes</td>
      <td>Unique identifier of the contract.</td>
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
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "988a8ae5-4044-494c-3075-08de30d9bd48",
  "code": "HR-2645",
  "contractDate": "1992-03-10",
  "status": "Active",
  "renewalType": "Manual",
  "contractType": "PartTime",
  "contractStartDate": "1998-11-01",
  "endDate": null,
  "hasTrialPeriod": true,
  "vacationDays": 21,
  "vacationAccrualMonths": 12,
  "ticketsCount": 2,
  "ticketsAccrualMonths": 12,
  "noticePeriodDays": 30,
  "employeeCode": "EMP009",
  "employeeName": "Yousef Nasser",
  "contractDuration": "2 Years",
  "trialPeriodDays": "90 Days",
  "positions": [
    {
      "code": "POS-001",
      "startDate": "1998-11-01",
      "endDate": null,
      "jobName": "Software Developer",
      "reportToName": "Ahmed Mohammed",
      "departmentName": "IT Department",
      "workLocationName": "Main Office"
    }
  ],
  "histories": [
    {
      "code": "HR-3982",
      "renewalType": "Automatic",
      "status": "Expired",
      "contractDate": "1990-01-01",
      "contractStartDate": "1990-01-01",
      "contractEndDate": "1992-02-28",
      "contractDurationName": "2 Years"
    }
  ],
  "salaries": [
    {
      "code": "SAL-001",
      "paymentFrequency": "Monthly",
      "paymentMethod": "Cash",
      "status": "Active",
      "totalSalary": 10000.00,
      "startDate": "1998-11-01",
      "endDate": null,
      "salaryTemplateName": "Standard Template",
      "contractSalaryItems": [
        {
          "id": "7bf9e0e5-df96-4c8e-9e0f-62fc7d8e9f0a",
          "itemType": "Allowance",
          "value": 5000.00,
          "salaryTemplateItemId": "8cf0f1f6-eg07-5d9f-af1g-73gd8e9f0g1b",
          "salaryTemplateItemName": "Basic Salary"
        }
      ]
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Add Contract</strong>
<br /> <span style="font-size: 90%;">Create a new employee contract.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Add a new contract for an employee by providing contract details, duration, and job position. <br /><br />
<span style="background-color:#28a745; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/Contracts/Add
<br /><br />
<hr />
<h3>Request Body</h3>
<p>The request body must be sent in JSON format, containing contract metadata, employment details, and job position information.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "contractDate": "1992-03-10",
  "renewalType": "Manual",
  "contractType": "PartTime",
  "contractStartDate": "1998-11-01",
  "hasTrialPeriod": true,
  "trialPeriodDayId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "vacationDays": 21,
  "vacationAccrualMonths": 12,
  "ticketsCount": 2,
  "ticketsAccrualMonths": 12,
  "noticePeriodDays": 30,
  "employeeId": "08842F92-F718-400B-B730-011CCA22E3A1",
  "contractDurationId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "position": {
    "jobId": "BCEBEF9A-37FD-4F5C-96F3-BC3270F4139B",
    "departmentId": "43F4FAC7-9A06-42B2-1553-08DE1F7A149A",
    "workLocationId": "314478C2-5AAB-4B9F-8313-8A8429EBD7F1"
  },
  "salary": {
    "paymentFrequency": "Monthly",
    "paymentMethod": "Cash",
    "salaryTemplateId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "totalSalary": 10000.00,
    "contractSalaryItems": [
      {
        "value": 5000.00,
        "salaryTemplateItemId": "8cf0f1f6-eg07-5d9f-af1g-73gd8e9f0g1b"
      }
    ]
  }
}
</pre>
</div>
<p><strong>Required:</strong> Both <code>position</code> and <code>salary</code> are required. Each contract must have exactly one position and one salary. <code>contractSalaryItems</code> must contain at least one item with <code>value</code> &gt; 0 and a valid <code>salaryTemplateItemId</code>. See <em>Validations and required data</em> above.</p>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>201 Created</strong> with the newly created contract ID (GUID) in the response body.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>"988a8ae5-4044-494c-3075-08de30d9bd48"</pre>
</div>
</div>
</details>

<details> <summary> <strong>Edit Contract</strong>
<br /> <span style="font-size: 90%;">Update an existing contract record.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update an existing contract with all contract details, position, and salary information. <br /><br />
<span style="background-color:#007bff; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/Contracts/Edit
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "988a8ae5-4044-494c-3075-08de30d9bd48",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "HR-2645",
  "contractDate": "1992-03-10",
  "renewalType": "Manual",
  "contractType": "PartTime",
  "contractStartDate": "1998-11-01",
  "hasTrialPeriod": true,
  "trialPeriodDayId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "vacationDays": 21,
  "vacationAccrualMonths": 12,
  "ticketsCount": 2,
  "ticketsAccrualMonths": 12,
  "noticePeriodDays": 30,
  "employeeId": "08842F92-F718-400B-B730-011CCA22E3A1",
  "contractDurationId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "position": {
    "jobId": "BCEBEF9A-37FD-4F5C-96F3-BC3270F4139B",
    "departmentId": "43F4FAC7-9A06-42B2-1553-08DE1F7A149A",
    "workLocationId": "314478C2-5AAB-4B9F-8313-8A8429EBD7F1"
  },
  "salary": {
    "paymentFrequency": "Monthly",
    "paymentMethod": "Cash",
    "salaryTemplateId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "totalSalary": 10000.00,
    "contractSalaryItems": [
      {
        "id": "7bf9e0e5-df96-4c8e-9e0f-62fc7d8e9f0a",
        "value": 5000.00,
        "salaryTemplateItemId": "8cf0f1f6-eg07-5d9f-af1g-73gd8e9f0g1b"
      }
    ]
  }
}
</pre>
</div>
<p>Same validation rules as Add Contract. <code>id</code> and <code>rowVersion</code> are required for the contract; position and salary remain required with at least one salary item.</p>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>204 No Content</strong> on successful update.</p>
</div>
</details>

<details> <summary> <strong>Renew Contract</strong>
<br /> <span style="font-size: 90%;">Renew an existing contract with new duration and dates.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Renew an existing contract by creating a new contract record with updated duration and start date. <br /><br />
<span style="background-color:#28a745; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/Contracts/Renew
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "contractId": "988a8ae5-4044-494c-3075-08de30d9bd48",
  "contractDurationId": "45528B98-7B1C-42C8-9343-3271B4AAD674",
  "renewalType": "Automatic",
  "contractDate": "2024-01-01",
  "startDate": "2024-01-01"
}
</pre>
</div>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>201 Created</strong> with the newly created contract ID (GUID) in the response body.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>"c00cdeeb-0698-41e7-f687-08de30d60e6b"</pre>
</div>
</div>
</details>

<details> <summary> <strong>Upgrade Contract</strong>
<br /> <span style="font-size: 90%;">Upgrade an existing contract with new position or salary.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Upgrade an existing contract by creating new position or salary records with updated information. <br /><br />
<span style="background-color:#28a745; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/Contracts/Upgrade
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "contractId": "988a8ae5-4044-494c-3075-08de30d9bd48",
  "position": {
    "lastRecordEndDate": "2023-12-31",
    "startDate": "2024-01-01",
    "jobId": "BCEBEF9A-37FD-4F5C-96F3-BC3270F4139B",
    "departmentId": "43F4FAC7-9A06-42B2-1553-08DE1F7A149A",
    "workLocationId": "314478C2-5AAB-4B9F-8313-8A8429EBD7F1"
  },
  "salary": {
    "lastRecordEndDate": "2023-12-31",
    "startDate": "2024-01-01",
    "paymentFrequency": "Monthly",
    "paymentMethod": "Cash",
    "salaryTemplateId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "totalSalary": 12000.00,
    "contractSalaryItems": [
      {
        "value": 5000.00,
        "salaryTemplateItemId": "8cf0f1f6-eg07-5d9f-af1g-73gd8e9f0g1b"
      },
      {
        "value": 7000.00,
        "salaryTemplateItemId": "9dg1g2g7-fh18-6e0g-bg2h-84he9f0g1h2c"
      }
    ]
  }
}
</pre>
</div>
<p>At least one of <code>salary</code> or <code>position</code> is required. Contract must be <strong>Active</strong>. <code>startDate</code> must be ≥ <code>lastRecordEndDate</code>. Position does not use <code>reportToId</code>. Salary items use only <code>value</code> and <code>salaryTemplateItemId</code> (no <code>itemType</code>). See <em>Validations and required data → Upgrade Contract</em>.</p>
<br />
<hr />
            <h3>Response</h3>
            <p>Returns <strong>204 No Content</strong> when the contract is successfully upgraded.</p>
</div>
</details>
