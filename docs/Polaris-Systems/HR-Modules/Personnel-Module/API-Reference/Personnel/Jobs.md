

---

## Jobs 

<details> <summary> <strong>Get All Jobs</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of jobs with search and sorting.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of jobs with pagination, search, and sorting. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Jobs/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter jobs by name or code.</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, Name).</td></tr>
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
    "pageSize": 25,
    "totalItems": 2
  },
  "orderBy": "CreatedOn",
  "orderByDesc": true,
  "result": [
    {
      "id": "b2d5f9f3-1234-4a5b-89cd-0123456789ab",
      "code": "JOB-001",
      "name": "Software Engineer",
      "employeesCount": 10
    },
    {
      "id": "a1b2c3d4-5678-9012-3456-789012345678",
      "code": "JOB-002",
      "name": "Product Manager",
      "employeesCount": 5
    }
  ]
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Get Job By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve job details by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed job information using the id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/Jobs/GetById?Id={JobId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the job.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "b2d5f9f3-1234-4a5b-89cd-0123456789ab",
  "rowVersion": "AAAAAAAACCo=",
  "employeesCount": 10,
  "code": "JOB-001",
  "nameAr": "????? ???????",
  "nameEn": "Software Engineer",
  "description": "Designs, develops, and maintains software applications.",
  "responsibilities": "Write clean code, debug applications, and collaborate with team members.",
  "requirements": "Bachelor's degree in Computer Science, 3+ years of experience.",
  "requiredSkills": "C#, .NET, SQL, Azure"
}
</pre>
</div>
</div> </details>
 
<details> <summary> <strong>Add Job</strong>
<br /> <span style="font-size: 90%;">Create a new job.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new job by providing job names and details. <br /><br />
<span style="background-color:#e8f5e9; color:#1b5e20; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/Jobs/Add
<br /><br />
<hr />
<h3>Request Body</h3>
<p>The request body must be sent in JSON format with job names and descriptions.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "nameAr": "???? ????",
  "nameEn": "Product Manager",
  "description": "Responsible for product planning and execution.",
  "responsibilities": "Define product vision, strategy, and roadmap.",
  "requirements": "5+ years of product management experience.",
  "requiredSkills": "Agile, Scrum, JIRA"
}
</pre>
</div>
<br />
<hr />
<h3>Response Example</h3>
<p>A successful creation returns the newly created job ID:</p>
<div style="background-color:#1e1e1e; color:#98c379; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
"a1b2c3d4-5678-9012-3456-789012345678"
</div> </div></details>
 
<details> <summary> <strong>Edit Job</strong>
<br /> <span style="font-size: 90%;">Update an existing job.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update job details such as names and descriptions. <br /><br />
<span style="background-color:#fff3e0; color:#e65100; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/Jobs/Edit
<br /><br />
<hr />
<h3>Request Body</h3>
<p>Provide the job id, row version, names, and other details to update.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;"> 
<pre>
{
  "id": "b2d5f9f3-1234-4a5b-89cd-0123456789ab",
  "rowVersion": "AAAAAAAACCo=",
  "code": "JOB-001",
  "nameAr": "????? ??????? ???",
  "nameEn": "Senior Software Engineer",
  "description": "Designs, develops, and maintains complex software applications.",
  "responsibilities": "Lead development projects, mentor junior developers.",
  "requirements": "Master's degree in Computer Science, 5+ years of experience.",
  "requiredSkills": "C#, .NET, Microservices, Docker"
}
</pre>
</div>
<br />
<hr />
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful update.</p>
</div> </details>
 
<details> <summary> <strong>Delete Job</strong>
<br /> <span style="font-size: 90%;">Delete a job by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a job using its id. <br /><br />
<span style="background-color:#ffebee; color:#c62828; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/Jobs/Delete?Id={JobId}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the job to delete.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response</h3>
<p>Returns HTTP 204 No Content on successful deletion.</p>
</div> </details>
