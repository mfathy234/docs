# Protocol of Engagement - Workflow

::: mermaid
flowchart TD
    classDef microtec fill:#E3F2FD,stroke:#1565C0,stroke-width:2px;
    classDef polaris fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px;
    classDef approval fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px;

    A[Test on Stage]:::microtec --> B[Capture Screenshots]:::microtec
    B --> C[Send it to HR Team in The HR Delivery Channel]:::microtec
    C --> D[Review with Polaris Quality Team]:::microtec
    D -->|Test And Triage| E[Create Ticket and Assign it to the Responsible Team Member]:::polaris
    E --> |Fix & Push to Dev| F[Fix the bug as reported]:::polaris

    %% Branch for HLSD
    F --> G{Is Bug Fixed?}

    G -->|Yes| H[Push to Stage]:::polaris
    G -->|No| F
    H --> I[Microtec Reviews Fix]:::microtec
    I --> J{Is Bug Fixed?}
    J -->|Yes| K[Bug Sign-Off]:::approval
    J -->|No| E

:::
