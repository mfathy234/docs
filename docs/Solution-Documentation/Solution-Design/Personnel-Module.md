# Introduction
## Context
### _Problem Statement_
The current **Microtec ERP** platform is a **monolithic system**, large and complex, requiring significant effort and resources to maintain and extend. This complexity creates bottlenecks in feature delivery, increases the risk of regression with every change, and reduces overall agility.
The monolithic architecture also poses scalability and resilience challenges, as all modules are tightly coupled and must scale together, regardless of individual module demand. This leads to higher infrastructure costs, reduced efficiency, and difficulty adopting modern DevOps practices such as continuous deployment.
To overcome these limitations, a **transition to a modular, service-oriented (microservices) architecture** is necessary. This shift will enable independent module development, faster delivery cycles, and better alignment with modern business needs.
### _Current State_
The **Microtec ERP** system is currently built as a **monolithic application**, where all business modules—such as Accounting, Inventory, Sales, Fixed Assets, Finance, and Purchase — are tightly coupled within a single codebase and database.
*   **Deployment & Release Management**
    *   Any feature or bug fix requires rebuilding and redeploying the entire application.
        
    *   Releases are slow, high-risk, and prone to regression across unrelated modules.
        
*   **Scalability & Performance**
    *   The system scales as a whole rather than by module demand.
        
    *   High-usage modules (e.g., Payroll during end of month) strain the entire system.
        
*   **Maintainability & Development Velocity**
    *   Shared database schema increases coupling between modules.
        
    *   Small changes often require coordination across multiple teams.
        
    *   Onboarding new developers is time-consuming due to system complexity.
        
*   **Technology Constraints**
    *   Technology upgrades (frameworks, libraries, databases) require changes across the entire system.
        
    *   Adoption of modern practices like CI/CD pipelines and containerization is limited by monolithic structure.
        
*   **Business Impact**
    *   Feature delivery is slowed, creating delays for clients.
        
    *   Operational risks increase with every deployment.
        
    *   Cost of ownership is rising due to infrastructure inefficiency and development overhead. 
### _Business Drivers (Intent & Objectives)_
*   **Faster Time-to-Market**
    *   Enable independent delivery of features without waiting on large, risky full-system releases.
        
    *   Reduce lead time for business-critical modules such as Payroll and Finance.
        
*   **Operational Agility**
    *   Allow teams to work in parallel across different services with minimal cross-dependencies.
        
    *   Support agile development practices and continuous integration/continuous delivery (CI/CD).
        
*   **Scalability & Cost Efficiency**
    *   Scale modules independently (e.g., high demand on Payroll during month-end) instead of scaling the entire ERP.
        
    *   Optimize infrastructure usage, reducing total cost of ownership.
        
*   **Resilience & Reliability**
    *   Contain failures within isolated services to avoid full-system outages.
        
    *   Improve disaster recovery and fault tolerance.
        
*   **Technology Evolution**
    *   Enable gradual adoption of modern frameworks, cloud-native tools, and DevOps practices without full-system rewrites.
        
    *   Reduce vendor lock-in by decoupling services and interfaces.
        
*   **Better Business Alignment**
## Solution Overview 
### _Solution Component Diagram_
![Component Diagram.drawio.png](/.attachments/Component%20Diagram.drawio-6e93cadc-2f25-4f8a-9c1e-a6ccf931f814.png)
### Assertions
This solution will only be accessed by the logged users via HTTPS and APIM for protection 
## Integration
## Security & Risks Overview
### Release Checklist
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th>Requirement</th>
      <th>(M)andatory or (P)referred</th>
      <th>Yes</th>
      <th>No</th>
      <th>N/A</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Solution includes logging (using App Insights where possible)</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td>
      <td style="text-align:center;">☐</td>
      <td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td>Secrets are appropriately managed (using Key Vault where possible)</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td>
      <td style="text-align:center;">☐</td>
      <td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td>All connections between components are authenticated</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td>
      <td style="text-align:center;">☐</td>
      <td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td>Azure components use <a href="#">Managed Identities</a> to authenticate</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td>
      <td style="text-align:center;">☐</td>
      <td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td>All data is encrypted in flight (HTTPS / TLS / SSL / etc)</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td>
      <td style="text-align:center;">☐</td>
      <td style="text-align:center;">☐</td>
    </tr>
<tr>
      <td>All <a href="#">PII</a> data is encrypted at rest</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td><td style="text-align:center;">☐</td><td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td>All data is encrypted at rest</td>
      <td style="text-align:center;">P</td>
      <td style="text-align:center;">☑</td><td style="text-align:center;">☐</td><td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td>Solution is <a href="#">PCI compliant</a></td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☐</td><td style="text-align:center;">☐</td><td style="text-align:center;">☑</td>
    </tr>
    <tr>
      <td>Do any components need to be exposed to the public internet?</td>
      <td style="text-align:center;">&nbsp;</td>
      <td style="text-align:center;">☐</td><td style="text-align:center;">☐</td><td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td style="padding-left:24px; color:#444;">If so, are those components appropriately secured (WAF / Front Door / etc)?</td>
      <td style="text-align:center;">M</td>
      <td style="text-align:center;">☑</td><td style="text-align:center;">☐</td><td style="text-align:center;">☐</td>
    </tr>
    <tr>
      <td style="padding-left:24px; color:#444;">If not, are private endpoints used to restrict access to components?</td>
      <td style="text-align:center;">P</td>
      <td style="text-align:center;">☐</td><td style="text-align:center;">☐</td><td style="text-align:center;">☐</td>
    </tr>

  </tbody>
</table>

## Infrastructure Map & Cost Breakdown
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <tbody>
    <tr>
      <td style="background-color: #e0e0e0; font-weight: bold;">Purpose (brief)</td>
      <td>Resource Group to host azure resources for Personnel Module</td>
    </tr>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Change Type</td>
      <td>New</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th style="width: 25%;">Environment</th>
      <th>DEV</th>
      <th>UAT</th>
      <th>PROD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Physical Name</td>
      <td>rg-d-Personnel-XXXXX</td>
      <td>rg-u-Personnel-XXXXX</td>
      <td>rg-Personnel-XXXXX</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Service Tier</td>
      <td>NA</td>
      <td>NA</td>
      <td>NA</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Monthly Cost Charge</td>
      <td>$0.00</td>
      <td>$0.00</td>
      <td>$0.00</td>
    </tr>
  </tbody>
</table>
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <tbody>
    <tr>
      <td style="background-color: #e0e0e0; font-weight: bold;">Purpose (brief)</td>
      <td>Required to host Personnel Service</td>
    </tr>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Change Type</td>
      <td>New</td>
    </tr>
  </tbody>
</table>

<br/>

<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th style="width: 25%;">Environment</th>
      <th>DEV</th>
      <th>UAT</th>
      <th>PROD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Physical Name</td>
      <td>aps-d-Personnel-XXXXX</td>
      <td>aps-u-Personnel-XXXXX</td>
      <td>aps-Personnel-XXXXX</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Service Tier</td>
      <td>Basic Tier; 1 B1 (1 Core(s), 1.75 GB RAM, 10 GB Storage) x 730 Hours; Linux OS</td>
      <td>Basic Tier; 1 B1 (1 Core(s), 1.75 GB RAM, 10 GB Storage) x 730 Hours; Linux OS</td>
      <td>POV3 (1 Core(s), 4 GB RAM, 250 GB Storage); 3 year reserved; Linux OS</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Monthly Cost Charge</td>
      <td>$19.71</td>
      <td>$19.71</td>
      <td>$45.35</td>
    </tr>
  </tbody>
</table>
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <tbody>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Purpose (brief)</td>
      <td>To collect logs, performance and error data from app service</td>
    </tr>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Change Type</td>
      <td>New</td>
    </tr>
  </tbody>
</table>

<br/>

<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th style="width: 25%;">Environment</th>
      <th>DEV</th>
      <th>UAT</th>
      <th>PROD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Physical Name</td>
      <td>ai-d-Personnel-XXXXX</td>
      <td>ai-u-Personnel-XXXXX</td>
      <td>ai-p-Personnel-XXXXX</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Service Tier</td>
      <td>Basic</td>
      <td>Basic</td>
      <td>Basic</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Monthly Cost Charge</td>
      <td>$0.00<br/>The first 5 GB of data ingested per month is free,<br/>Data is retained for 90 days by default</td>
      <td>$0.00<br/>The first 5 GB of data ingested per month is free,<br/>Data is retained for 90 days by default</td>
      <td>$0.00<br/>The first 5 GB of data ingested per month is free,<br/>Data is retained for 90 days by default</td>
    </tr>
  </tbody>
</table>
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <tbody>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Purpose (brief)</td>
      <td>Required to store Secrets like connection string etc</td>
    </tr>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Change Type</td>
      <td>New</td>
    </tr>
  </tbody>
</table>

<br/>

<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th style="width: 25%;">Environment</th>
      <th>DEV</th>
      <th>UAT</th>
      <th>PROD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Physical Name</td>
      <td>kv-d-Personnel-XXXXX</td>
      <td>kv-u-Personnel-XXXXX</td>
      <td>kv-p-Personnel-XXXXX</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Service Tier</td>
      <td>Standard</td>
      <td>Standard</td>
      <td>Standard</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Monthly Cost Charge</td>
      <td>$4.00</td>
      <td>$4.00</td>
      <td>$4.00</td>
    </tr>
  </tbody>
</table>
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <tbody>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Purpose (brief)</td>
      <td>Service used for securing, monitoring, and optimizing APIs that will be calling CRM endpoints</td>
    </tr>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Change Type</td>
      <td>Existing</td>
    </tr>
  </tbody>
</table>

<br/>

<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th style="width: 25%;">Environment</th>
      <th>DEV</th>
      <th>UAT</th>
      <th>PROD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Physical Name</td>
      <td>devapimicrotec</td>
      <td>uatapimicrotec</td>
      <td>apimicrotec</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Service Tier</td>
      <td>Developer</td>
      <td>Developer</td>
      <td>Production</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; font-weight: bold;">Monthly Cost Charge</td>
      <td>$0.00</td>
      <td>$0.00</td>
      <td>$0.00</td>
    </tr>
  </tbody>
</table>
<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 50%;">
  <tbody>
    <tr >
      <td style="background-color: #e0e0e0; font-weight: bold;">Dev</td>
      <td>$23.71</td>
    </tr>
    <tr>
      <td style="background-color: #e0e0e0; font-weight: bold;">UAT</td>
      <td>$23.71</td>
    </tr>
    <tr>
      <td style="background-color: #e0e0e0; font-weight: bold;">Prod</td>
      <td>$49.35</td>
    </tr>
  </tbody>
</table>

##DRB Sign Off
 <table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 70%;">
  <thead>
    <tr style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
      <th style="width: 30%;">People</th>
      <th style="width: 20%;">Date</th>
      <th style="width: 50%;">Comments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Presented by:</td>
      <td>28/03/2025</td>
      <td>Kareem</td>
    </tr>
    <tr>
      <td>Design Review Board</td>
      <td>28/03/2025</td>
      <td>Approved by Ahmed Abo ELmagd</td>
    </tr>
    <tr>
      <td>Design Review Board</td>
      <td>28/03/2025</td>
      <td>Approved by Yasser Sallam</td>
    </tr>
    <tr>
      <td>Design Review Board</td>
      <td>28/03/2025</td>
      <td>Approved by AbdullAh</td>
    </tr>
    <tr>
      <td>Design Review Board</td>
      <td>28/03/2025</td>
      <td>Approved by Abo Sultan</td>
    </tr>
  </tbody>
</table>

 
