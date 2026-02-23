## SalaryTemplates

<details> <summary> <strong>Get All Salary Templates</strong>
<br /> <span style="font-size: 90%;">Retrieve a paginated list of salary templates with search and sorting.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of salary templates with pagination, search, and sorting. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SalaryTemplates/GetAll?SearchTerm={SearchTerm}&PageNumber={PageNumber}&PageSize={PageSize}&SortBy={SortBy}&SortColumn={SortColumn}
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
    <tr><td>SearchTerm</td><td>query</td><td>string</td><td>No</td><td>Keyword to filter templates by code or name.</td></tr>
    <tr><td>PageNumber</td><td>query</td><td>int</td><td>Yes</td><td>Page number for paginated results.</td></tr>
    <tr><td>PageSize</td><td>query</td><td>int</td><td>Yes</td><td>Number of items per page.</td></tr>
    <tr><td>SortBy</td><td>query</td><td>string</td><td>No</td><td>Sorting direction (Ascending / Descending).</td></tr>
    <tr><td>SortColumn</td><td>query</td><td>string</td><td>No</td><td>Column used for sorting (e.g., CreatedOn, Code, NameEn).</td></tr>
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
    "totalItems": 2
  },
  "result": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "code": "TMP-001",
      "nameAr": "قوالب الراتب الشهرية",
      "nameEn": "Monthly Payroll",
      "paymentFrequency": "Monthly",
      "description": "Base monthly template"
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "code": "TMP-002",
      "nameAr": "مكافأة سنوية",
      "nameEn": "Annual Bonus",
      "paymentFrequency": "Yearly",
      "description": "Annual bonus template"
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Get Salary Template By Id</strong>
<br /> <span style="font-size: 90%;">Retrieve salary template details by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve detailed salary template information using the id. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SalaryTemplates/GetById?Id={Id}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the salary template.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "TMP-001",
  "nameAr": "قوالب الراتب الشهرية",
  "nameEn": "Monthly Payroll",
  "paymentFrequency": "Monthly",
  "description": "Base monthly template",
  "salaryTemplateItems": [
    {
      "id": "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "rowVersion": "AAAAAAAAB8M=",
      "description": "Base salary",
      "isCalculated": false,
      "calculationFormula": null,
      "isTaxable": true,
      "showInContract": true,
      "salaryUnitId": "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "salaryItemId": "ccccccc1-cccc-cccc-cccc-cccccccccccc"
    }
  ]
}
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Get All Items By Template Id</strong>
<br /> <span style="font-size: 90%;">Retrieve all salary template items for a specific template.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Retrieve a list of all salary template items associated with a specific template. <br /><br />
<span style="background-color:#f3f3f3; color:#4a24b4; padding:3px 8px; border-radius:4px; font-weight:bold;"> GET </span>
./v{apiVersion}/SalaryTemplates/GetAllItemsByTepmlateId?SalaryTemplateId={SalaryTemplateId}
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
    <tr><td>SalaryTemplateId</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the salary template.</td></tr>
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
    "id": "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "name": "Base Salary",
    "isCalculated": false
  },
  {
    "id": "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "name": "Allowance",
    "isCalculated": true
  }
]
</pre>
</div>
</div>
</details>

<details> <summary> <strong>Add Salary Template</strong>
<br /> <span style="font-size: 90%;">Create a new salary template with payment frequency and items.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Create a new salary template by providing multilingual names, payment frequency, and optional template items. <br /><br />
<span style="background-color:#28a745; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/SalaryTemplates/Add
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "nameAr": "قوالب الراتب الشهرية",
  "nameEn": "Monthly Payroll",
  "description": "Base monthly template",
  "paymentFrequency": "Monthly",
  "salaryTemplateItems": [
    {
      "description": "Base salary",
      "isTaxable": true,
      "isCalculated": false,
      "calculationFormula": null,
      "showInContract": true,
      "salaryUnitId": "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "salaryItemId": "ccccccc1-cccc-cccc-cccc-cccccccccccc"
    }
  ]
}
</pre>
</div>
<br />
<hr />
<h3>Request Body Properties</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>NameAr</td><td>string</td><td>Yes</td><td>Arabic name of the template (max 256 characters).</td></tr>
    <tr><td>NameEn</td><td>string</td><td>Yes</td><td>English name of the template (max 256 characters).</td></tr>
    <tr><td>Description</td><td>string</td><td>Yes</td><td>Description of the template (max 500 characters).</td></tr>
    <tr><td>PaymentFrequency</td><td>string</td><td>Yes</td><td>Payment frequency (Monthly or Yearly).</td></tr>
    <tr><td>SalaryTemplateItems</td><td>array</td><td>No</td><td>Optional collection of salary template items.</td></tr>
  </tbody>
</table>
<h4>SalaryTemplateItem Properties (Add)</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Description</td><td>string?</td><td>No</td><td>Description of the item (max 150 characters).</td></tr>
    <tr><td>IsTaxable</td><td>bool</td><td>Yes</td><td>Whether the item is taxable.</td></tr>
    <tr><td>IsCalculated</td><td>bool</td><td>Yes</td><td>Whether the item value is calculated.</td></tr>
    <tr><td>CalculationFormula</td><td>string?</td><td>Conditional</td><td>Required when IsCalculated is true. Formula with placeholders (e.g., __code__).</td></tr>
    <tr><td>ShowInContract</td><td>bool</td><td>Yes</td><td>Whether to display this item in contract documents.</td></tr>
    <tr><td>SalaryUnitId</td><td>guid</td><td>Yes</td><td>Identifier of the salary unit.</td></tr>
    <tr><td>SalaryItemId</td><td>guid</td><td>Yes</td><td>Identifier of the salary item.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>201 Created</strong> with the newly created salary template ID (GUID) in the response body.</p>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>"11111111-1111-1111-1111-111111111111"</pre>
</div>
</div>
</details>

<details> <summary> <strong>Edit Salary Template</strong>
<br /> <span style="font-size: 90%;">Update an existing salary template with full collection management.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Update salary template code, names, frequency, description, and items. The system automatically manages the collection: items with an <code>Id</code> are updated, items without an <code>Id</code> are added as new, and items not included in the request are removed. <br /><br />
<span style="background-color:#007bff; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> PUT </span>
./v{apiVersion}/SalaryTemplates/Edit
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "id": "11111111-1111-1111-1111-111111111111",
  "rowVersion": "AAAAAAAAB9E=",
  "code": "TMP-001",
  "nameAr": "قوالب الراتب الشهرية",
  "nameEn": "Monthly Payroll",
  "description": "Base monthly template",
  "paymentFrequency": "Monthly",
  "salaryTemplateItems": [
    {
      "id": "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "rowVersion": "AAAAAAAAB8M=",
      "description": "Base salary",
      "isCalculated": false,
      "calculationFormula": null,
      "isTaxable": true,
      "showInContract": true,
      "salaryUnitId": "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "salaryItemId": "ccccccc1-cccc-cccc-cccc-cccccccccccc"
    },
    {
      "id": null,
      "description": "New allowance item",
      "isCalculated": false,
      "calculationFormula": null,
      "isTaxable": false,
      "showInContract": true,
      "salaryUnitId": "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "salaryItemId": "ccccccc2-cccc-cccc-cccc-cccccccccccc"
    }
  ]
}
</pre>
</div>
<br />
<hr />
<h3>Request Body Properties</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>guid</td><td>Yes</td><td>Identifier of the salary template to update.</td></tr>
    <tr><td>RowVersion</td><td>string</td><td>No</td><td>Concurrency token for optimistic locking.</td></tr>
    <tr><td>Code</td><td>string</td><td>Yes</td><td>Code of the template (max 50 characters).</td></tr>
    <tr><td>NameAr</td><td>string</td><td>Yes</td><td>Arabic name of the template (max 256 characters).</td></tr>
    <tr><td>NameEn</td><td>string</td><td>Yes</td><td>English name of the template (max 256 characters).</td></tr>
    <tr><td>Description</td><td>string</td><td>Yes</td><td>Description of the template (max 500 characters).</td></tr>
    <tr><td>PaymentFrequency</td><td>string</td><td>Yes</td><td>Payment frequency (Monthly or Yearly).</td></tr>
    <tr><td>SalaryTemplateItems</td><td>array</td><td>No</td><td>Optional collection of salary template items.</td></tr>
  </tbody>
</table>
<h4>SalaryTemplateItem Properties (Edit)</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Id</td><td>guid?</td><td>No</td><td>Identifier of the salary template item. If provided, updates existing item; if null or omitted, creates new item.</td></tr>
    <tr><td>RowVersion</td><td>string?</td><td>No</td><td>Concurrency token for optimistic locking. Required when updating existing items.</td></tr>
    <tr><td>Description</td><td>string?</td><td>No</td><td>Description of the item (max 150 characters).</td></tr>
    <tr><td>IsCalculated</td><td>bool</td><td>Yes</td><td>Whether the item value is calculated.</td></tr>
    <tr><td>CalculationFormula</td><td>string?</td><td>Conditional</td><td>Required when IsCalculated is true. Formula with placeholders (e.g., __code__).</td></tr>
    <tr><td>IsTaxable</td><td>bool</td><td>Yes</td><td>Whether the item is taxable.</td></tr>
    <tr><td>ShowInContract</td><td>bool</td><td>Yes</td><td>Whether to display this item in contract documents.</td></tr>
    <tr><td>SalaryUnitId</td><td>guid</td><td>Yes</td><td>Identifier of the salary unit.</td></tr>
    <tr><td>SalaryItemId</td><td>guid</td><td>Yes</td><td>Identifier of the salary item.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Collection Update Behavior</h3>
<p>The system automatically manages the <code>SalaryTemplateItems</code> collection:</p>
<ul>
  <li><strong>Update:</strong> Items with a valid <code>Id</code> are updated with the provided values.</li>
  <li><strong>Add:</strong> Items with <code>Id</code> set to <code>null</code> or omitted are created as new items.</li>
  <li><strong>Delete:</strong> Items that exist in the database but are not included in the request are removed.</li>
</ul>
<p><strong>Note:</strong> Duplicate <code>SalaryItemId</code> values are automatically deduplicated (only the first occurrence is kept).</p>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>204 No Content</strong> on successful update.</p>
</div>
</details>

<details> <summary> <strong>Delete Salary Template</strong>
<br /> <span style="font-size: 90%;">Delete a salary template by id.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Delete a salary template using its id. <br /><br />
<span style="background-color:#dc3545; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> DELETE </span>
./v{apiVersion}/SalaryTemplates/Delete?Id={Id}
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
    <tr><td>Id</td><td>query</td><td>guid</td><td>Yes</td><td>Identifier of the salary template to delete.</td></tr>
    <tr><td>apiVersion</td><td>path</td><td>string</td><td>Yes</td><td>API version included in the URL.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response</h3>
<p>Returns <strong>204 No Content</strong> on successful deletion.</p>
</div>
</details>

<details> <summary> <strong>Calculate Salary Template Item</strong>
<br /> <span style="font-size: 90%;">Calculate the value of a calculated salary template item.</span> </summary> 
<br /> 
<div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;"> Calculate the value of a calculated salary template item based on its formula and the current list of items. <br /><br />
<span style="background-color:#28a745; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;"> POST </span>
./v{apiVersion}/SalaryTemplates/Calculate
<br /><br />
<hr />
<h3>Request Body</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "salaryTemplateItemId": "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "currentList": [
    {
      "salaryTemplateItemId": "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "salaryTemplateItemName": "Base Salary",
      "value": 5000.00,
      "isCalculated": false
    },
    {
      "salaryTemplateItemId": "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "salaryTemplateItemName": "Allowance",
      "value": 1000.00,
      "isCalculated": false
    }
  ]
}
</pre>
</div>
<br />
<hr />
<h3>Request Body Properties</h3>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>SalaryTemplateItemId</td><td>guid</td><td>Yes</td><td>Identifier of the salary template item to calculate.</td></tr>
    <tr><td>CurrentList</td><td>array</td><td>Yes</td><td>List of current salary template items with their values.</td></tr>
  </tbody>
</table>
<h4>CurrentList Item Properties</h4>
<table>
  <thead>
    <tr>
      <th style="text-align:left;">Property</th>
      <th style="text-align:left;">Type</th>
      <th style="text-align:left;">Required</th>
      <th style="text-align:left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>SalaryTemplateItemId</td><td>guid</td><td>Yes</td><td>Identifier of the salary template item.</td></tr>
    <tr><td>SalaryTemplateItemName</td><td>string</td><td>No</td><td>Name of the salary template item.</td></tr>
    <tr><td>Value</td><td>decimal</td><td>Yes</td><td>Current value of the item.</td></tr>
    <tr><td>IsCalculated</td><td>bool</td><td>Yes</td><td>Whether the item is calculated.</td></tr>
  </tbody>
</table>
<br />
<hr />
<h3>Response Example</h3>
<div style="background-color:#1e1e1e; color:#d19a66; padding:12px; border-radius:6px; font-family:Consolas, monospace; font-size:14px; overflow-x:auto;">
<pre>
{
  "message": "Calculation completed successfully",
  "currentList": [
    {
      "salaryTemplateItemId": "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "salaryTemplateItemName": "Base Salary",
      "value": 5000.00,
      "isCalculated": false
    },
    {
      "salaryTemplateItemId": "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "salaryTemplateItemName": "Allowance",
      "value": 1000.00,
      "isCalculated": false
    },
    {
      "salaryTemplateItemId": "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "salaryTemplateItemName": "Total",
      "value": 6000.00,
      "isCalculated": true
    }
  ]
}
</pre>
</div>
</div>
</details>
