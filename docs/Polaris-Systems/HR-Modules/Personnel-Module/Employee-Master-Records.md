# 🗂 Employee Master Records

The **Employee Master Records** feature is the core of the Personnel module.  
It provides HR with a centralized view of all employee details and supports the full lifecycle of staff management.  

---
## 🖼 Wireframes

👉 [Employee Master Records – Wireframes (PDF)](https://saudimicrotec-my.sharepoint.com/personal/kareem_mersal_microtec_com_eg/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkareem%5Fmersal%5Fmicrotec%5Fcom%5Feg%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2FHRM%2D2025%5F2%2Epdf&parent=%2Fpersonal%2Fkareem%5Fmersal%5Fmicrotec%5Fcom%5Feg%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files&ga=1)  

These wireframes illustrate the initial layout and flow before Figma design.

## 🎨 Design (Figma)

👉 [Employee Master Records – List View (Figma)](https://www.figma.com/design/KGidxks4Ix4G8zAnytf2QT/HRM-Admin---Polaris?node-id=4-2&t=bIOSnMM5gXlO3PYS-1)

## 📚 Business Requirements & Data base field Information

👉 [Database Field Information]([field info .xlsx](https://saudimicrotec.sharepoint.com/:x:/s/HRModule/EaFKN1MX5fVKqcfuEc66Ni8BK6-dufxn1bgkgmzpULueOw?e=UzKZRx))

This view will allow HR users to:  
- Browse and search employee records.  
- View key details such as employee name, department, position, and status.  

---

## 🔧 Core Functions

1. **Add Employee**  
   - Capture personal information (name, contact, DOB, etc.).  
   - Record employment details (position, department, start date, contract type).  
   - Upload key documents (ID, contract, certificates).  

2. **Edit Employee**  
   - Update personal details (address, phone, emergency contacts).  
   - Change employment status (promotion, department transfer, contract renewal).  
   - Track position history.  

3. **Delete Employee**  
   - Allow removal only with confirmation and audit logging.  
   - Deletion triggers archival (to maintain compliance).  

---

## 📑 Inner Pages for This Feature

- **High-Level Solution Design (HLSD)**  
  - Data model for Employee entity.  
  - API endpoints for Add/Edit/Delete.  
  - Integration with Payroll & Attendance modules.  

- **User Stories & Requirements**  
  - As an HR officer, I want to **add a new employee**, so that I can onboard staff quickly.  
  - As an HR officer, I want to **edit employee details**, so that records remain accurate.  
  - As an HR officer, I want to **delete/terminate an employee**, so that records reflect current staff.  

- **Sign-Off Records**  
  - **Definition of Ready (DOR)** → Approved HLSD and Figma designs.  
  - **Definition of Done (DOD)** → Approved after UAT and demo.  

---

## 🗂 Next Steps

1. Microtec Business Team to validate the Figma list view and fields.  
2. Polaris Team to prepare HLSD (entity model, APIs, workflows).  
3. Review & sign-off → proceed to development.  