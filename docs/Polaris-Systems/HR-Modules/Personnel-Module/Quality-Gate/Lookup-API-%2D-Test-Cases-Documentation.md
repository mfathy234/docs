# Lookup API - Test Cases Documentation

  

## 📋 Overview

  

**API Module:** Lookup Service (Master Data)  

**Base URL:** `/v{version}/Lookup`  

**Total Test Cases:** 30  

**Success Scenarios:** 24 | **Failure Scenarios:** 6  

**Coverage:** 100% (All 24 lookup types tested)

  

---

  

## 🎯 API Description

  

The Lookup API provides access to system master data through a single endpoint that returns different data sets based on the lookup type parameter. It supports both **database table lookups** (11 types) and **enum value lookups** (13 types).

  

**Endpoint:** `GET /v{version}/Lookup/GetList`

  

**Query Parameters:**

- `Lookup` (required) - Name of the lookup table or enum (case-sensitive)

  

**Authentication:** Bearer token required

  

---

  

## 🔍 Test Cases by Category

  

<details open>
<summary><strong>📊 Table Lookups - Success Cases (11 Tests)</strong></summary>
<br>
  
**Description:** Tests for database table lookups that return dynamic data from the database
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="25%">Test Case Name</th>
<th width="18%">Lookup Name</th>
<th width="10%">Code</th>
<th width="24%">Description</th>
<th width="10%">Expected Result</th>
<th width="5%">Priority</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-001</strong></td>
<td>GetList - Jobs Lookup</td>
<td>Jobs</td>
<td>1001</td>
<td>Job titles and positions</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-002</strong></td>
<td>GetList - Countries Lookup</td>
<td>Countries</td>
<td>1002</td>
<td>Country selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-003</strong></td>
<td>GetList - Employees Lookup</td>
<td>Employees</td>
<td>1003</td>
<td>Employee dropdowns</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-004</strong></td>
<td>GetList - JobLevels Lookup</td>
<td>JobLevels</td>
<td>1004</td>
<td>Seniority levels</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-005</strong></td>
<td>GetList - Departments Lookup</td>
<td>Departments</td>
<td>1005</td>
<td>Department selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-006</strong></td>
<td>GetList - Nationalities Lookup</td>
<td>Nationalities</td>
<td>1006</td>
<td>Nationality selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-007</strong></td>
<td>GetList - WorkLocations Lookup</td>
<td>WorkLocations</td>
<td>1007</td>
<td>Work location selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-008</strong></td>
<td>GetList - EmploymentTypes Lookup</td>
<td>EmploymentTypes</td>
<td>1008</td>
<td>Full-time, Part-time, etc</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-009</strong></td>
<td>GetList - ContractDurations Lookup</td>
<td>ContractDurations</td>
<td>1009</td>
<td>Contract duration options</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-010</strong></td>
<td>GetList - SalaryTemplates Lookup</td>
<td>SalaryTemplates</td>
<td>1010</td>
<td>Salary template selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-011</strong></td>
<td>GetList - SalariesUnits Lookup</td>
<td>SalariesUnits</td>
<td>1011</td>
<td>Salary unit types</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

<details>
<summary><strong>🔢 Enum Lookups - Success Cases (13 Tests)</strong></summary>
<br>
  
**Description:** Tests for enum value lookups that return fixed predefined values
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="25%">Test Case Name</th>
<th width="18%">Lookup Name</th>
<th width="10%">Code</th>
<th width="24%">Description</th>
<th width="10%">Expected Result</th>
<th width="5%">Priority</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-012</strong></td>
<td>GetList - Gender Enum</td>
<td>Gender</td>
<td>2001</td>
<td>Male/Female</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-013</strong></td>
<td>GetList - Religions Enum</td>
<td>Religions</td>
<td>2002</td>
<td>Religion selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-014</strong></td>
<td>GetList - BloodTypes Enum</td>
<td>BloodTypes</td>
<td>2003</td>
<td>Blood type selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-015</strong></td>
<td>GetList - RenewalTypes Enum</td>
<td>RenewalTypes</td>
<td>2004</td>
<td>Contract renewal types</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-016</strong></td>
<td>GetList - ContractTypes Enum</td>
<td>ContractTypes</td>
<td>2005</td>
<td>Contract type selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-017</strong></td>
<td>GetList - MaritalStatus Enum</td>
<td>MaritalStatus</td>
<td>2006</td>
<td>Single, Married, etc</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-018</strong></td>
<td>GetList - ContractStatus Enum</td>
<td>ContractStatus</td>
<td>2007</td>
<td>Contract status options</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-019</strong></td>
<td>GetList - EducationLevels Enum</td>
<td>EducationLevels</td>
<td>2008</td>
<td>Education level selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-020</strong></td>
<td>GetList - RelationshipTypes Enum</td>
<td>RelationshipTypes</td>
<td>2009</td>
<td>Dependent relationships</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-021</strong></td>
<td>GetList - PaymentFrequencies Enum</td>
<td>PaymentFrequencies</td>
<td>2010</td>
<td>Payment frequency options</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-022</strong></td>
<td>GetList - PaymentMethods Enum</td>
<td>PaymentMethods</td>
<td>2011</td>
<td>Payment method selection</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-023</strong></td>
<td>GetList - LoanCalculationTypes Enum</td>
<td>LoanCalculationTypes</td>
<td>2012</td>
<td>Loan calculation methods</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
<tr style="background-color: #e8f5e9;">
<td><strong>TC-024</strong></td>
<td>GetList - SalariesItems Enum</td>
<td>SalariesItems</td>
<td>2013</td>
<td>Salary item types</td>
<td><code style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 3px;">200 OK</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

<details>
<summary><strong>❌ Failure Scenarios (6 Tests)</strong></summary>
<br>
  
**Description:** Tests for error handling and validation
  
### Test Cases
  
<table>
<thead>
<tr style="background-color: #0078d4; color: white;">
<th width="8%">TC ID</th>
<th width="30%">Test Case Name</th>
<th width="35%">Description</th>
<th width="15%">Expected Result</th>
<th width="7%">Priority</th>
<th width="5%">Category</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #ffebee;">
<td><strong>TC-025</strong></td>
<td>GetList - Missing Parameter</td>
<td>Call API without Lookup parameter</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-026</strong></td>
<td>GetList - Invalid Lookup Name</td>
<td>Test with non-existent lookup name (e.g., "InvalidName")</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-027</strong></td>
<td>GetList - Empty Parameter</td>
<td>Test with empty lookup parameter value</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-028</strong></td>
<td>GetList - Case Sensitivity</td>
<td>Test case sensitivity with lowercase "gender" (should be "Gender")</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-029</strong></td>
<td>GetList - Special Characters</td>
<td>Test with special characters in parameter (e.g., "Gender@#$")</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">400 Bad Request</code></td>
<td><span style="background-color: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P2</span></td>
<td>❌ Failure</td>
</tr>
<tr style="background-color: #ffebee;">
<td><strong>TC-030</strong></td>
<td>GetList - Without Authentication</td>
<td>Test without Bearer token in request header</td>
<td><code style="background-color: #f44336; color: white; padding: 3px 8px; border-radius: 3px;">401 Unauthorized</code></td>
<td><span style="background-color: #ff5252; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">P1</span></td>
<td>❌ Failure</td>
</tr>
</tbody>
</table>
  
</details>

  

---

  

## 📚 Complete Lookup Reference

  

### Table Lookups (Codes 1001-1011)

  

| Code | Lookup Name | Description | Priority |

|------|-------------|-------------|----------|

| **1001** | Jobs | Job titles and positions available in the system | P1 |

| **1002** | Countries | List of countries for address and nationality | P1 |

| **1003** | Employees | Active employees list for dropdowns and references | P1 |

| **1004** | JobLevels | Organizational seniority levels (Junior, Senior, etc.) | P1 |

| **1005** | Departments | Company departments and organizational units | P1 |

| **1006** | Nationalities | Nationality options for employee records | P2 |

| **1007** | WorkLocations | Physical work locations and offices | P2 |

| **1008** | EmploymentTypes | Employment categories (Full-time, Part-time, Contract) | P1 |

| **1009** | ContractDurations | Available contract duration options | P2 |

| **1010** | SalaryTemplates | Predefined salary structure templates | P2 |

| **1011** | SalariesUnits | Salary calculation units (Monthly, Annual, Hourly) | P2 |

  

### Enum Lookups (Codes 2001-2013)

  

| Code | Lookup Name | Description | Priority |

|------|-------------|-------------|----------|

| **2001** | Gender | Gender options: Male, Female | P1 |

| **2002** | Religions | Religious affiliation options | P2 |

| **2003** | BloodTypes | Blood type classification (A+, B+, O-, etc.) | P2 |

| **2004** | RenewalTypes | Contract renewal type options | P2 |

| **2005** | ContractTypes | Contract classification types | P1 |

| **2006** | MaritalStatus | Marital status: Single, Married, Divorced, Widowed | P1 |

| **2007** | ContractStatus | Contract status states (Active, Expired, Terminated) | P1 |

| **2008** | EducationLevels | Education qualification levels | P2 |

| **2009** | RelationshipTypes | Dependent relationship types (Spouse, Child, Parent) | P2 |

| **2010** | PaymentFrequencies | Payment schedule options (Monthly, Quarterly, etc.) | P2 |

| **2011** | PaymentMethods | Payment delivery methods (Bank Transfer, Cash, Check) | P1 |

| **2012** | LoanCalculationTypes | Loan interest calculation methods | P2 |

| **2013** | SalariesItems | Salary component types and allowances | P2 |

  

---

  

## 🔐 Authentication

  

**All requests require Bearer token authentication**

  

**Header:** `Authorization: Bearer {token}`

  

**Example Request:**

```

GET /v1/Lookup/GetList?Lookup=Gender

Authorization: Bearer {your-token}

```

  

---

  

## 📝 Response Structures

  

### Success Response (200 OK)

  

**Example - Enum Lookup (Gender):**

```json

[

  "Male",

  "Female"

]

```

  

**Example - Table Lookup (Employees):**

```json

[

  {

    "id": "uuid",

    "name": "Employee Name"

  }

]

```

  

### Error Responses

  

**400 Bad Request - Invalid Lookup:**

```json

{

  "messageCode": 8174,

  "message": "Invalid lookup type specified",

  "correlationId": "uuid",

  "validationErrors": [...]

}

```

  

**401 Unauthorized - Missing Token:**

```json

{

  "messageCode": 4011,

  "message": "Missing or invalid authentication token",

  "correlationId": "uuid"

}

```

  

---

  

## 📊 Test Summary

  

<table>

<thead>

<tr style="background-color: #0078d4; color: white;">

<th>Metric</th>

<th>Count</th>

</tr>

</thead>

<tbody>

<tr>

<td><strong>Total Test Cases</strong></td>

<td>30</td>

</tr>

<tr>

<td><strong>Table Lookup Tests</strong></td>

<td>11</td>

</tr>

<tr>

<td><strong>Enum Lookup Tests</strong></td>

<td>13</td>

</tr>

<tr>

<td><strong>Failure Scenario Tests</strong></td>

<td>6</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Success Cases</strong></td>

<td>24 (100% coverage)</td>

</tr>

<tr style="background-color: #ffebee;">

<td><strong>Failure Cases</strong></td>

<td>6</td>

</tr>

<tr style="background-color: #e8f5e9;">

<td><strong>Priority 1 (P1) Cases</strong></td>

<td>14</td>

</tr>

<tr style="background-color: #fff3e0;">

<td><strong>Priority 2 (P2) Cases</strong></td>

<td>16</td>

</tr>

</tbody>

</table>

  

---

  

## 🧪 Testing Notes

  

### Pre-requisites

- ✅ Valid authentication token

- ✅ Database seeded with master data for table lookups

- ✅ All lookup types defined in system enum

  

### Important Rules

- ⚠️ Lookup parameter is **case-sensitive** (e.g., "Gender" not "gender")

- ⚠️ Table lookups return dynamic data from database

- ⚠️ Enum lookups return fixed predefined values

- ⚠️ Empty tables return empty array `[]`, not an error

- ⚠️ Invalid lookup names return 400 error

  

### Test Coverage

- ✅ **100% Coverage**: All 24 lookup types tested

- ✅ **11 Table Lookups**: Complete database table coverage

- ✅ **13 Enum Lookups**: Complete enum value coverage

- ✅ **Error Scenarios**: All validation and error cases covered

  

### Performance Benchmarks

- ⚡ Response time: < 200ms for all lookups

- ⚡ Enum lookups: < 50ms (cached)

- ⚡ Table lookups: < 200ms (database query)

  

---

  

**Last Updated:** December 22, 2025  

**Maintained By:** QA Team  

**Version:** 1.0