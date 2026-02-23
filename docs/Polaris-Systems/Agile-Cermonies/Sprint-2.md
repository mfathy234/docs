:::mermaid
gantt
    dateFormat  DD-MM-YYYY
    title Project Sprint Progress
    axisFormat  %d-%b         
    tickInterval 7day          


    %% Section 1 — Onboarding
    section Onboarding
    Planned (100%)     :done,   t1, 14-09-2025, 28d
    Actual (100%)      :active, t2, 14-09-2025, 17d

    %% Section 2 — UX Design
    section UX Design
    Planned (40% → 100%)  :done,   t3, 14-09-2025, 06-11-2025
    Actual (120%)      :active,    t4, 16-09-2025, 06-11-2025

    %% Section 3 — Backend
    section Backend
    Planned (40%  → 80% → 100%)  :done,   t5, 14-09-2025, 06-11-2025
    Actual (100%) :active,    t6, 14-09-2025, 06-11-2025

    %% Section 4 — Frontend 
    section Frontend 
    Planned (40%  → 80% → 100%)  :done,   t5, 14-09-2025, 07-11-2025
    Actual (100%)      :active,    t6, 06-11-2025, 23-10-2025

    %% Section 5 — Infrastructure and Architecture  
    section Architecture
    Planned (not planned)  :done,   t5, 14-09-2025, 14-09-2025
    Actual (75%)      :active,    t6, 14-09-2025, 06-11-2025

:::