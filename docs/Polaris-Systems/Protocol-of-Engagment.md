# Protocol of Engagement - Workflow

::: mermaid
flowchart TD
    classDef microtec fill:#E3F2FD,stroke:#1565C0,stroke-width:2px;
    classDef polaris fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px;
    classDef approval fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px;

    A[Requirements Gathering]:::microtec --> B[Business Analysis]:::microtec
    B --> C[Create Wireframes]:::microtec
    C --> D[Review with Polaris]:::microtec
    D -->|Feedback| E[Amendments & Validation]:::polaris
    D -->|Approved| F[Wireframe Sign-Off]:::approval

    E --> D

    %% Branch for HLSD
    F --> G{Is HLSD Required?}

    G -->|Yes| H[Polaris Creates HLSD]:::polaris
    H --> I[Microtec Reviews HLSD]:::microtec
    I -->|Approved| J[HLSD Sign-Off]:::approval
    I -->|Feedback| H

    J --> K[Polaris Creates Figma Design]:::polaris

    G -->|No| K

    K --> L[Microtec Reviews Figma Design]:::microtec
    L -->|Feedback| M[Amend & Update Design]:::polaris
    L -->|Approved| N[Design Sign-Off]:::approval

    M --> L

    N --> O[Polaris Development + Internal Test]:::polaris
    O --> P{Microtec Reviews Pull Requests}:::microtec

    P -->|Approved| Q[Ship Build for UAT]:::polaris
    P -->|Request Changes| O

    Q --> R[Microtec UAT]:::microtec

    R -->|Feedback| S[Fix Issues]:::polaris
    R -->|Approved| T[Final Sign-Off]:::approval

    S --> Q
:::

## 📑 Protocol of Engagement (Step-by-Step)

1. **Requirements Gathering** [Microtec]  
   - Microtec Business Team gathers requirements from stakeholders.  

2. **Business Analysis** [Microtec]  
   - Defines functional and non-functional requirements.  

3. **Wireframes** [Microtec]  
   - Prepares wireframes to represent intended user experience and layout.  

4. **Review with Polaris** [Microtec → Polaris]  
   - Microtec presents requirements and wireframes to Polaris for feedback.  

5. **Amendments** [Microtec]  
   - Updates wireframes based on feedback.  

6. **Wireframe Sign-Off** ✅ [Microtec]  
   - Approved wireframes become the **Definition of Ready (Design)**.  

7. **Decision: Is HLSD Required?**  
   - If **Yes** →  
     - **HLSD Creation** [Polaris] → Creates High-Level Solution Design.  
     - **HLSD Review** [Microtec] → Reviews HLSD and provides feedback.  
     - **HLSD Sign-Off** ✅ [Microtec] → Approval before proceeding.  
   - If **No** → Skip directly to Figma Design.  

8. **Figma Design** [Polaris]  
   - Creates detailed Figma designs.  

9. **Design Review** [Microtec]  
   - Reviews Figma designs and provides feedback.  

10. **Design Sign-Off** ✅ [Microtec]  
    - Approved Figma becomes the **Definition of Ready (Development)**.  

11. **Development & Internal Testing** [Polaris]  
    - Polaris implements the solution and conducts internal QA.  

12. **Pull Request Review** [Microtec]  
    - Microtec reviews Polaris pull requests.  
    - **If Approved** → Code is merged and work proceeds to UAT.  
    - **If Changes Requested** → Code is sent back to Polaris for fixes, then re-tested and resubmitted for review.  

13. **User Acceptance Testing (UAT)** [Microtec]  
    - Receives a build from Polaris.  
    - Conducts UAT and produces a feedback report.  

14. **Bug Fixes & Enhancements** [Polaris]  
    - Addresses UAT comments and resubmits the build.  

15. **Final Sign-Off** ✅ [Microtec]  
    - Reviews the Sprint Showcase/Demo.  
    - Upon approval, sprint tasks are closed.  
