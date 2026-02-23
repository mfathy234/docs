## Employees

<details> <summary> <strong>Get All Employees</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of employees with search and sorting.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of employees with pagination, search, and sorting. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Employees/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}&DepartmentId={DepartmentId}&JobId={JobId}&JobLevelId={JobLevelId}&ReportToId={ReportToId}&EmploymentTypeId={EmploymentTypeId}&CountryCode={CountryCode}&Gender={Gender}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter employees.</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting.</td></tr>
    <tr><td>DepartmentId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Department ID.</td></tr>
    <tr><td>JobId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Job ID.</td></tr>
    <tr><td>JobLevelId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Job Level ID.</td></tr>
    <tr><td>ReportToId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Reporting Manager ID.</td></tr>
    <tr><td>EmploymentTypeId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Employment Type ID.</td></tr>
    <tr><td>CountryCode</td><td>query</td><td>string</td><td>No</td><td>Filter by Country Code.</td></tr>
    <tr><td>Gender</td><td>query</td><td>string</td><td>No</td><td>Filter by Gender (Male / Female).</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
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
    "pageSize": 10,
    "totalItems": 1
  },
  "result": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Mohamed Ali",
      "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
      "employeeSerialNumber": "EMP-00912",
      "mobile": "+201001234567",
      "birthDate": "1985-09-12",
      "jobName": "Senior Software Engineer",
      "employmentTypeName": "Full Time",
      "jobLevelName": "Senior",
      "departmentName": "IT Department",
      "reportToName": "Ahmed Hassan"
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Get Employee By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve detailed employee information by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve all the information about an employee using the employee id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Employees/GetById?Id={Id}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Unique identifier of the employee.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
  "rowVersion": "AAAAAAAAB9E=",
  "nameAr": "محمد علي",
  "nameEn": "Mohamed Ali",
  "attendanceCode": 125,
  "employeeSerialNumber": "EMP-00912",
  "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
  "birthDate": "1985-09-12",
  "birthCountryCode": "EG",
  "birthCity": "Cairo",
  "nationalityCode": "EG",
  "maritalStatus": "Married",
  "bloodGroup": "A+",
  "religion": "Muslim",
  "gender": "Male",
  "hasDisability": false,
  "nationalIdNumber": "29809011234567",
  "nationalIdIssuedOn": "2010-02-01",
  "nationalIdExpiresOn": "2030-02-01",
  "nationalIdIssuingAuthority": "Civil Registry",
  "passportNumber": "A12345678",
  "passportIssuedOn": "2015-01-15",
  "passportExpiresOn": "2025-01-15",
  "passportIssuingAuthority": "Ministry of Interior",
  "countryCode": "EG",
  "city": "Cairo",
  "region": "Dokki",
  "address": "15 El Tahrir St.",
  "buildingNumber": "15",
  "postalCode": 12345,
  "mailBox": "PO123",
  "email": "m.ali@example.com",
  "mobile": "+201001234567",
  "mobileCountryCode": "EG",
  "phone": "23900123",
  "phoneCountryCode": "EG",
  "landLine": "023900123",
  "landLineCountryCode": "EG",
  "officePhoneNumber": "200",
  "officePhoneNumberCountryCode": "EG",
  "extension": "125",
  "departmentId": "6f7cbf47-6b49-4230-9bc8-098045c20020",
  "reportToId": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
  "employmentTypeId": "de04d91f-996e-4b1d-a4cf-8c64d65c69e4",
  "jobLevelId": "e1018c57-5b85-4ad3-8b03-f6febc7c5e47",
  "jobName": "Senior Software Engineer",
  "insured": true,
  "gosiStartDate": "2023-01-01",
  "totalSalary": 10000.00,
  "employeePart": 500.00,
  "companyPart": 500.00,
  "educationalInfos": [
    {
      "id": "6ce8a0d4-00d5-4f82-a4c4-1e2e5f6bb5be",
      "rowVersion": "AAAAAAAAB8M=",
      "educationLevel": "Bachelor",
      "qualificationName": "Computer Science",
      "educationInstitution": "Cairo University",
      "specialization": "Software Engineering",
      "grade": "Excellent",
      "graduationYear": 2006,
      "attachmentId": "attachment-id-123"
    }
  ],
  "depentantInfos": [
    {
      "id": "58aedff8-cc85-4b8d-bdc1-51adbbf92f7e",
      "rowVersion": "AAAAAAAAB8Q=",
      "name": "Omar Mohamed",
      "nationalityCode": "EG",
      "relationshipType": "Son",
      "phoneNumber": "+201001234568",
      "birthDate": "2015-05-20"
    }
  ],
  "hierarchyResults": [
    {
      "level": 1,
      "employeeId": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
      "name": "Mohamed Ali",
      "reportToId": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
      "directReportsCount": 4,
      "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
      "jobName": "Senior Software Engineer"
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>View Employee By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve optimized employee information by id using SQL view.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve employee information using optimized SQL view with all related entity names (returns both Arabic and English names, selected based on current language). <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Employees/ViewById?Id={Id}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Unique identifier of the employee.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
  "rowVersion": "AAAAAAAAB9E=",
  "nameAr": "محمد علي",
  "nameEn": "Mohamed Ali",
  "attendanceCode": 125,
  "employeeSerialNumber": "EMP-00912",
  "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
  "birthDate": "1985-09-12",
  "birthCountryCode": "EG",
  "birthCountryName": "Egypt",
  "birthCity": "Cairo",
  "nationalityCode": "EG",
  "nationalityName": "Egyptian",
  "maritalStatus": "Married",
  "bloodGroup": "A+",
  "religion": "Muslim",
  "gender": "Male",
  "hasDisability": false,
  "nationalIdNumber": "29809011234567",
  "nationalIdIssuedOn": "2010-02-01",
  "nationalIdExpiresOn": "2030-02-01",
  "nationalIdIssuingAuthority": "Civil Registry",
  "passportNumber": "A12345678",
  "passportIssuedOn": "2015-01-15",
  "passportExpiresOn": "2025-01-15",
  "passportIssuingAuthority": "Ministry of Interior",
  "countryCode": "EG",
  "countryName": "Egypt",
  "city": "Cairo",
  "region": "Dokki",
  "address": "15 El Tahrir St.",
  "buildingNumber": "15",
  "postalCode": 12345,
  "mailBox": "PO123",
  "email": "m.ali@example.com",
  "mobile": "+201001234567",
  "mobileCountryCode": "EG",
  "mobilePhoneCode": "+20",
  "phone": "23900123",
  "phoneCountryCode": "EG",
  "phonePhoneCode": "+20",
  "landLine": "023900123",
  "landLineCountryCode": "EG",
  "landLinePhoneCode": "+20",
  "officePhoneNumber": "200",
  "officePhoneNumberCountryCode": "EG",
  "officePhoneNumberPhoneCode": "+20",
  "extension": "125",
  "departmentId": "6f7cbf47-6b49-4230-9bc8-098045c20020",
  "departmentName": "IT Department",
  "reportToId": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
  "reportToName": "Ahmed Hassan",
  "employmentTypeId": "de04d91f-996e-4b1d-a4cf-8c64d65c69e4",
  "employmentTypeName": "Full Time",
  "jobLevelId": "e1018c57-5b85-4ad3-8b03-f6febc7c5e47",
  "jobLevelName": "Senior",
  "jobId": "f8e9d7c6-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
  "jobName": "Senior Software Engineer",
  "insured": true,
  "gosiStartDate": "2023-01-01",
  "totalSalary": 10000.00,
  "employeePart": 500.00,
  "companyPart": 500.00,
  "educationalInfos": [
    {
      "id": "6ce8a0d4-00d5-4f82-a4c4-1e2e5f6bb5be",
      "rowVersion": "AAAAAAAAB8M=",
      "educationLevel": "Bachelor",
      "qualificationName": "Computer Science",
      "educationInstitution": "Cairo University",
      "specialization": "Software Engineering",
      "grade": "Excellent",
      "graduationYear": 2006,
      "attachmentId": "attachment-id-123"
    }
  ],
  "depentantInfos": [
    {
      "id": "58aedff8-cc85-4b8d-bdc1-51adbbf92f7e",
      "rowVersion": "AAAAAAAAB8Q=",
      "name": "Omar Mohamed",
      "nationalityCode": "EG",
      "relationshipType": "Son",
      "phoneNumber": "+201001234568",
      "birthDate": "2015-05-20"
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Get Organization Chart</strong>
<br /> <span style="font-size: 90%;">Retrieve organization chart hierarchy for a manager.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve the organization chart showing all direct and indirect reports for a given manager. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Employees/GetOrgChart?ReportToId={ReportToId}
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
    <tr><td>ReportToId</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the manager to get organization chart for.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "level": 1,
    "employeeId": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
    "name": "Mohamed Ali",
    "reportToId": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
    "directReportsCount": 4,
    "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
    "jobName": "Senior Software Engineer"
  },
  {
    "level": 2,
    "employeeId": "d3e18bf2-478f-5b4b-9dg0-a1ef4f1d5cbf",
    "name": "Ahmed Hassan",
    "reportToId": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
    "directReportsCount": 2,
    "photoId": "ce23ga02-b5bf-58f3-a3e3-a6bd5626be31",
    "jobName": "Software Engineer"
  }
]
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Get All Managers In Department</strong>
<br /> <span style="font-size: 90%;">Retrieve all managers in a specific department.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of all employees who are managers (have direct reports) in a specific department. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Employees/AllManagersInDepartment?DepartmentId={DepartmentId}
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
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
[
  {
    "id": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
    "name": "Mohamed Ali"
  },
  {
    "id": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
    "name": "Ahmed Hassan"
  }
]
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Export Employees</strong>
<br /> <span style="font-size: 90%;">Export employees data to Excel file.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Export employees data with filtering options to an Excel file. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Employees/Export?SearchTerm={SearchTerm}&DepartmentId={DepartmentId}&JobId={JobId}&JobLevelId={JobLevelId}&ReportToId={ReportToId}&EmploymentTypeId={EmploymentTypeId}&CountryCode={CountryCode}&Gender={Gender}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter employees.</td></tr>
    <tr><td>DepartmentId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Department ID.</td></tr>
    <tr><td>JobId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Job ID.</td></tr>
    <tr><td>JobLevelId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Job Level ID.</td></tr>
    <tr><td>ReportToId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Reporting Manager ID.</td></tr>
    <tr><td>EmploymentTypeId</td><td>query</td><td>guid</td><td>No</td><td>Filter by Employment Type ID.</td></tr>
    <tr><td>CountryCode</td><td>query</td><td>string</td><td>No</td><td>Filter by Country Code.</td></tr>
    <tr><td>Gender</td><td>query</td><td>string</td><td>No</td><td>Filter by Gender (Male / Female).</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response</h3>
<p>Returns an Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) containing the exported employee data.</p>
</div>
</details>

<details> <summary> <strong>Add Employee</strong>
<br /> <span style="font-size: 90%;">Create a new employee record.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new employee with all personal, contact, functional, and GOSI information. <br /><br />
<span style="background-color:#28a745; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/Employees/Add
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "nameAr": "محمد علي",
  "nameEn": "Mohamed Ali",
  "attendanceCode": 125,
  "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
  "birthDate": "1985-09-12",
  "birthCountryCode": "EG",
  "birthCity": "Cairo",
  "nationalityCode": "EG",
  "maritalStatus": "Married",
  "bloodGroup": "A+",
  "religion": "Muslim",
  "gender": "Male",
  "hasDisability": false,
  "nationalIdNumber": "29809011234567",
  "nationalIdIssuedOn": "2010-02-01",
  "nationalIdExpiresOn": "2030-02-01",
  "nationalIdIssuingAuthority": "Civil Registry",
  "passportNumber": "A12345678",
  "passportIssuedOn": "2015-01-15",
  "passportExpiresOn": "2025-01-15",
  "passportIssuingAuthority": "Ministry of Interior",
  "countryCode": "EG",
  "city": "Cairo",
  "region": "Dokki",
  "address": "15 El Tahrir St.",
  "buildingNumber": "15",
  "postalCode": 12345,
  "mailBox": "PO123",
  "email": "m.ali@example.com",
  "mobile": "+201001234567",
  "mobileCountryCode": "EG",
  "phone": "23900123",
  "phoneCountryCode": "EG",
  "landLine": "023900123",
  "landLineCountryCode": "EG",
  "officePhoneNumber": "200",
  "officePhoneNumberCountryCode": "EG",
  "extension": "125",
  "departmentId": "6f7cbf47-6b49-4230-9bc8-098045c20020",
  "reportToId": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
  "employmentTypeId": "de04d91f-996e-4b1d-a4cf-8c64d65c69e4",
  "jobLevelId": "e1018c57-5b85-4ad3-8b03-f6febc7c5e47",
  "insured": true,
  "gosiStartDate": "2023-01-01",
  "totalSalary": 10000.00,
  "employeePart": 500.00,
  "companyPart": 500.00,
  "educationalInfos": [
    {
      "educationLevel": "Bachelor",
      "qualificationName": "Computer Science",
      "educationInstitution": "Cairo University",
      "specialization": "Software Engineering",
      "grade": "Excellent",
      "graduationYear": 2006,
      "attachmentId": "attachment-id-123"
    }
  ],
  "depentantInfos": [
    {
      "name": "Omar Mohamed",
      "nationalityCode": "EG",
      "relationshipType": "Son",
      "phoneNumber": "+201001234568",
      "birthDate": "2015-05-20"
    }
  ]
}
</pre>
</div>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>201 Created</strong> with the created employee ID (GUID) in the response body.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>"c2f07af1-367e-4a3a-8cf9-90df3e0c4bae"</pre>
</div>
</div>
</details>

<details> <summary> <strong>Edit Employee</strong>
<br /> <span style="font-size: 90%;">Update an existing employee record.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update an existing employee with all personal, contact, functional, and GOSI information. <br /><br />
<span style="background-color:#007bff; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/Employees/Edit
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "c2f07af1-367e-4a3a-8cf9-90df3e0c4bae",
  "rowVersion": "AAAAAAAAB9E=",
  "nameAr": "محمد علي",
  "nameEn": "Mohamed Ali",
  "attendanceCode": 125,
  "employeeSerialNumber": "EMP-00912",
  "photoId": "bd12f991-a4ae-47e2-92d2-95ac4515ad20",
  "birthDate": "1985-09-12",
  "birthCountryCode": "EG",
  "birthCity": "Cairo",
  "nationalityCode": "EG",
  "maritalStatus": "Married",
  "bloodGroup": "A+",
  "religion": "Muslim",
  "gender": "Male",
  "hasDisability": false,
  "nationalIdNumber": "29809011234567",
  "nationalIdIssuedOn": "2010-02-01",
  "nationalIdExpiresOn": "2030-02-01",
  "nationalIdIssuingAuthority": "Civil Registry",
  "passportNumber": "A12345678",
  "passportIssuedOn": "2015-01-15",
  "passportExpiresOn": "2025-01-15",
  "passportIssuingAuthority": "Ministry of Interior",
  "countryCode": "EG",
  "city": "Cairo",
  "region": "Dokki",
  "address": "15 El Tahrir St.",
  "buildingNumber": "15",
  "postalCode": 12345,
  "mailBox": "PO123",
  "email": "m.ali@example.com",
  "mobile": "+201001234567",
  "mobileCountryCode": "EG",
  "phone": "23900123",
  "phoneCountryCode": "EG",
  "landLine": "023900123",
  "landLineCountryCode": "EG",
  "officePhoneNumber": "200",
  "officePhoneNumberCountryCode": "EG",
  "extension": "125",
  "departmentId": "6f7cbf47-6b49-4230-9bc8-098045c20020",
  "reportToId": "aa2b99e1-9261-4d4e-8279-32118bf69b09",
  "employmentTypeId": "de04d91f-996e-4b1d-a4cf-8c64d65c69e4",
  "jobLevelId": "e1018c57-5b85-4ad3-8b03-f6febc7c5e47",
  "insured": true,
  "gosiStartDate": "2023-01-01",
  "totalSalary": 10000.00,
  "employeePart": 500.00,
  "companyPart": 500.00,
  "educationalInfos": [
    {
      "id": "6ce8a0d4-00d5-4f82-a4c4-1e2e5f6bb5be",
      "rowVersion": "AAAAAAAAB8M=",
      "educationLevel": "Bachelor",
      "qualificationName": "Computer Science",
      "educationInstitution": "Cairo University",
      "specialization": "Software Engineering",
      "grade": "Excellent",
      "graduationYear": 2006,
      "attachmentId": "attachment-id-123"
    }
  ],
  "depentantInfos": [
    {
      "id": "58aedff8-cc85-4b8d-bdc1-51adbbf92f7e",
      "rowVersion": "AAAAAAAAB8Q=",
      "name": "Omar Mohamed",
      "nationalityCode": "EG",
      "relationshipType": "Son",
      "phoneNumber": "+201001234568",
      "birthDate": "2015-05-20"
    }
  ]
}
</pre>
</div>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>204 No Content</strong> on successful update.</p>
</div>
</details>

<details> <summary> <strong>Delete Employee</strong>
<br /> <span style="font-size: 90%;">Delete an employee record (soft delete).</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Soft delete an employee record by setting IsDeleted flag. <br /><br />
<span style="background-color:#dc3545; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/Employees/Delete?Id={Id}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Unique identifier of the employee to delete.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>204 No Content</strong> on successful deletion.</p>
</div>
</details>
