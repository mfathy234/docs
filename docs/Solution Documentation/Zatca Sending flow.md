# ZATCA Sending Options – Technical Diagrams

  

This document provides a set of diagrams using Mermaid (wrapped with `::: mermaid` blocks) so they render directly in VS Code Markdown preview, without needing a PlantUML server.

  

You can still copy the logical flows into any diagram tool if needed.

  

---

  

## 📋 Executive Summary

  

### Core Behavior Rules

  

#### 🤖 Automatic Mode

When `SendingMode = AUTOMATIC`, the system sends documents to ZATCA automatically based on the configured trigger:

- **ON_SAVE**: Document sends immediately when user clicks Save

- **ON_POST**: Document sends immediately when user clicks Post

- **ON_FIRST_PRINT**: Document sends on first print (with fallback to Post if never printed)

  

#### 🖱️ Manual Mode

When `SendingMode = MANUAL`, user must explicitly click the **[Send to ZATCA]** button.

  

#### 🔒 Edit and Post Restrictions Based on Status

  

| ZatcaStatus | Can Edit? | Can Post? | Can Send? | User Message |

|-------------|-----------|-----------|-----------|--------------|

| **NOT_SENT** | ✅ Yes | ✅ Yes | ✅ Yes | - |

| **SENDING** | ❌ No | ❌ No | ❌ No | "العملية قيد الإرسال" (Operation in progress) |

| **SENT_SUCCESSFULLY** | ❌ No | ❌ No | ❌ No | "تم الإرسال بنجاح" (Sent successfully) |

| **SEND_FAILED** | ✅ Yes | ✅ Yes | ✅ Yes (Retry) | Error details shown |

  

#### 🔄 Retry Logic

- Failed documents can be **edited** to fix validation errors

- Failed documents can be **retried** without editing (manual or automatic based on configuration)

- Multiple retry attempts allowed until successful

  

#### 🎯 Configuration Per Document Scope

Each document type has independent configuration:

- ERP Sales Invoice

- ERP Credit Note

- ERP Advanced Payment

- ERP Project Invoice

- VAN Sales Invoice

- VAN Credit Note

  

---

  

## 🎯 Quick Reference: ZATCA Flow Decision Tree

  

::: mermaid

flowchart TD

    Start([📄 Document Action]) --> Action{Action Type?}

    Action -->|💾 Save| CheckSaveMode{SendingMode?}

    Action -->|📊 Post| CheckPostMode{SendingMode?}

    Action -->|🖨️ Print| CheckPrintMode{SendingMode?}

    Action -->|✏️ Edit| CheckStatus1{ZatcaStatus?}

    Action -->|👁️ View| AlwaysAllow[✅ Always Allowed]

    CheckSaveMode -->|AUTOMATIC| CheckSaveTrigger{TriggerAction<br/>== ON_SAVE?}

    CheckSaveMode -->|MANUAL| SaveNoSend[💾 Save only<br/>Show [Send to ZATCA] button]

    CheckSaveTrigger -->|Yes| AutoSend1[🚀 Auto-send to ZATCA]

    CheckSaveTrigger -->|No| SaveNoSend

    CheckPostMode -->|AUTOMATIC| CheckPostTrigger{TriggerAction<br/>== ON_POST?}

    CheckPostMode -->|MANUAL| PostNoSend[📊 Post only<br/>Show [Send to ZATCA] button]

    CheckPostTrigger -->|Yes| CheckPostStatus{ZatcaStatus?}

    CheckPostTrigger -->|No| PostNoSend

    CheckPostStatus -->|SENDING or<br/>SENT_SUCCESSFULLY| DenyPost[❌ Deny Post<br/>'العملية قيد الإرسال'<br/>or already sent]

    CheckPostStatus -->|NOT_SENT or<br/>SEND_FAILED| PostThenSend[📊 Post then<br/>🚀 Auto-send to ZATCA]

    CheckPrintMode -->|AUTOMATIC| CheckPrintTrigger{TriggerAction<br/>== ON_FIRST_PRINT?}

    CheckPrintMode -->|MANUAL| PrintNoSend[🖨️ Print only]

    CheckPrintTrigger -->|Yes| CheckFirstPrint{FirstPrintFlag<br/>== false?}

    CheckPrintTrigger -->|No| PrintNoSend

    CheckFirstPrint -->|Yes| PrintAndSend[🖨️ Print and<br/>🚀 Auto-send to ZATCA<br/>Set FirstPrintFlag = true]

    CheckFirstPrint -->|No| PrintNoSend

    CheckStatus1 -->|SENDING or<br/>SENT_SUCCESSFULLY| DenyEdit[❌ Deny Edit<br/>Only View/Print allowed]

    CheckStatus1 -->|NOT_SENT or<br/>SEND_FAILED| AllowEditAction[✅ Allow Edit]

    AutoSend1 --> SendResult{ZATCA Result}

    PostThenSend --> SendResult

    PrintAndSend --> SendResult

    SendResult -->|Success| StatusSuccess[✅ Status = SENT_SUCCESSFULLY<br/>🔒 Lock from editing]

    SendResult -->|Failure| StatusFailed[❌ Status = SEND_FAILED<br/>📝 Allow edit/retry]

    AlwaysAllow --> End1([End])

    SaveNoSend --> End2([End])

    PostNoSend --> End3([End])

    PrintNoSend --> End4([End])

    DenyPost --> End5([End])

    DenyEdit --> End6([End])

    AllowEditAction --> End7([End])

    StatusSuccess --> End8([End])

    StatusFailed --> End9([End])

    style AutoSend1 fill:#cce5ff

    style PostThenSend fill:#cce5ff

    style PrintAndSend fill:#cce5ff

    style StatusSuccess fill:#ccffcc

    style StatusFailed fill:#ffcccc

    style DenyPost fill:#ffcccc

    style DenyEdit fill:#ffcccc

    style AllowEditAction fill:#ccffcc

    style AlwaysAllow fill:#ccffcc

:::

  

---

  

## 1. High-Level Context Diagram

  

::: mermaid

flowchart LR

    subgraph ERP["🏢 ERP System"]

        CFG["⚙️ Config: ZATCA Sending Options"]

        ERP_TX["📄 ERP Transactions<br/>(Sales Invoice, Credit Note,<br/>Advanced Payment, Project Invoice)"]

        VAN_TX["🚚 Van Sales Transactions<br/>(Sales Invoice, Credit Note)"]

    end

  

    User["👤 Business User"]

    Owner["👨‍💼 System Business Owner<br/>(مدير النظام)"]

    ZATCA["🏛️ ZATCA Platform"]

  

    Owner -->|"Configure Sending Mode & Trigger"| CFG

  

    User -->|"Create / Edit / Save<br/>Post / Print<br/>Send to ZATCA (manual)"| ERP_TX

    User -->|"Same as above"| VAN_TX

  

    ERP_TX -->|"📤 Send Invoice / Credit Note<br/>(JSON / XML over API)"| ZATCA

    VAN_TX -->|"📤 Send Invoice / Credit Note<br/>(JSON / XML over API)"| ZATCA

    style ERP fill:#e1f5ff

    style CFG fill:#fff4cc

    style ERP_TX fill:#ffe1f0

    style VAN_TX fill:#ffe1f0

    style ZATCA fill:#ccffcc

:::

  

---

  

## 2. Configuration Screen – Class & Data Model

  

::: mermaid

classDiagram

    class Company {

        +Guid CompanyId

        +string CRN

        +string TIN

    }

  

    class ZatcaSendingOption {

        +Guid OptionId

        +Guid CompanyId

        +string DocumentScope

        +string SendingMode

        +string TriggerAction

        +bool IsActive

    }

  

    class DocumentBase {

        +Guid DocumentId

        +Guid CompanyId

        +string DocumentScope

        +string ZatcaStatus

        +bool FirstPrintFlag

        +string ZatcaErrorDetails

    }

  

    Company "1" --> "*" ZatcaSendingOption

    Company "1" --> "*" DocumentBase

:::

  

---

  

## 10. Edit Lock Logic – Activity Diagram (User Story 7)

  

::: mermaid

flowchart TD

    Start([👤 User attempts to edit document]) --> CheckSending{"🔍 ZatcaStatus<br/>== SENDING?"}

  

    CheckSending -->|Yes| DenySending["❌ Deny edit<br/>✅ Allow only View/Print<br/>Show: 'العملية قيد الإرسال'"]

    DenySending --> End1([End])

  

    CheckSending -->|No| CheckSuccess{"🔍 ZatcaStatus<br/>== SENT_SUCCESSFULLY?"}

    CheckSuccess -->|Yes| DenySuccess["❌ Deny edit<br/>✅ Allow only View/Print<br/>(+ ZATCA cancel flow if any)"]

    DenySuccess --> End2([End])

  

    CheckSuccess -->|No| CheckOthers{"🔍 ZatcaStatus in<br/>(SEND_FAILED, NOT_SENT)?"}

    CheckOthers -->|Yes| AllowEdit["✅ Allow edit"]

    AllowEdit --> End3([End])

  

    CheckOthers -->|No| Fallback["⚠️ Fallback – treat as NOT_SENT"]

    Fallback --> End4([End])

    style DenySending fill:#ffcccc

    style DenySuccess fill:#ffcccc

    style AllowEdit fill:#ccffcc

    style Fallback fill:#fff4cc

:::

  

---

  

## 11. Default Seeding on ZATCA Activation – Activity Diagram (User Story 8)

  

::: mermaid

flowchart TD

    Start([Admin activates ZATCA module\nfor a Company]) --> SeedOptions["Create ZatcaSendingOption rows\nfor each DocumentScope"]

  

    SeedOptions --> ERPSeed["For ERP Transactions\n- SendingMode = AUTOMATIC\n- TriggerAction = ON_POST"]

    SeedOptions --> VanSeed["For VAN Sales Transactions\n- SendingMode = AUTOMATIC\n- TriggerAction = ON_SAVE"]

  

    ERPSeed --> Persist[Persist to DB]

    VanSeed --> Persist

    Persist --> End([End])

    style Start fill:#e1f5ff

    style Persist fill:#ccffcc

    style End fill:#e1f5ff

:::

  

---

  

## 12. Complete ZATCA Flow - Edit, Post, and Send Logic

  

::: mermaid

flowchart TB

    Start([User Action on Document]) --> CheckAction{What Action?}

    CheckAction -->|Edit| CheckEditAllowed{Check ZatcaStatus}

    CheckAction -->|Post| CheckPostAllowed{Check ZatcaStatus}

    CheckAction -->|View/Print| AllowView[✅ Allow View/Print<br/>Always Allowed]

    CheckEditAllowed -->|SENDING| DenyEdit1["❌ Deny Edit<br/>Show: 'العملية قيد الإرسال'<br/>Allow: View/Print only"]

    CheckEditAllowed -->|SENT_SUCCESSFULLY| DenyEdit2["❌ Deny Edit<br/>Show: 'تم الإرسال بنجاح'<br/>Allow: View/Print only"]

    CheckEditAllowed -->|SEND_FAILED or NOT_SENT| AllowEdit["✅ Allow Edit<br/>User can modify document"]

    CheckPostAllowed -->|SENDING| DenyPost1["❌ Deny Post<br/>Show: 'العملية قيد الإرسال'<br/>Allow: View/Print only"]

    CheckPostAllowed -->|SENT_SUCCESSFULLY| DenyPost2["❌ Deny Post<br/>Document already sent<br/>Allow: View/Print only"]

    CheckPostAllowed -->|SEND_FAILED or NOT_SENT| AllowPost["✅ Allow Post<br/>Proceed to posting"]

    AllowPost --> PostDoc[Post Document to Accounting]

    PostDoc --> CheckAutoSend{SendingMode<br/>== AUTOMATIC?}

    CheckAutoSend -->|No - MANUAL| ManualMode["Set button visible<br/>User must click [Send to ZATCA]"]

    CheckAutoSend -->|Yes| CheckTrigger{What is<br/>TriggerAction?}

    CheckTrigger -->|ON_POST| AutoSendNow["🚀 Auto-Send to ZATCA<br/>Status: SENDING"]

    CheckTrigger -->|ON_SAVE| NoSendOnPost["Skip send on Post<br/>Will send on Save"]

    CheckTrigger -->|ON_FIRST_PRINT| NoSendOnPost2["Skip send on Post<br/>Will send on First Print"]

    AutoSendNow --> SendToZATCA[Call ZATCA API]

    SendToZATCA --> ZatcaResponse{ZATCA Response}

    ZatcaResponse -->|Success| UpdateSuccess["✅ Status = SENT_SUCCESSFULLY<br/>Lock document from editing"]

    ZatcaResponse -->|Failure| UpdateFailed["❌ Status = SEND_FAILED<br/>Store error details<br/>Allow retry/edit"]

    AllowView --> End1([End])

    DenyEdit1 --> End2([End])

    DenyEdit2 --> End3([End])

    AllowEdit --> End4([End])

    DenyPost1 --> End5([End])

    DenyPost2 --> End6([End])

    ManualMode --> End7([End])

    NoSendOnPost --> End8([End])

    NoSendOnPost2 --> End9([End])

    UpdateSuccess --> End10([End])

    UpdateFailed --> End11([End])

    style AllowEdit fill:#ccffcc

    style AllowPost fill:#ccffcc

    style AllowView fill:#ccffcc

    style DenyEdit1 fill:#ffcccc

    style DenyEdit2 fill:#ffcccc

    style DenyPost1 fill:#ffcccc

    style DenyPost2 fill:#ffcccc

    style UpdateSuccess fill:#ccffcc

    style UpdateFailed fill:#ffe6cc

    style AutoSendNow fill:#cce5ff

    style ManualMode fill:#fff4cc

:::

  

---

  

## 13. ZATCA Status Lifecycle and Permissions

  

::: mermaid

stateDiagram-v2

    [*] --> NOT_SENT: Document Created

    state NOT_SENT {

        [*] --> CanEdit

        [*] --> CanPost

        [*] --> CanSend

    }

    NOT_SENT --> SENDING: Manual Send<br/>or Auto-Trigger

    state SENDING {

        [*] --> NoEdit: ❌ Edit Locked

        [*] --> NoPost: ❌ Post Locked

        [*] --> OnlyView: ✅ View/Print Only

    }

    SENDING --> SENT_SUCCESSFULLY: ✅ ZATCA Success

    SENDING --> SEND_FAILED: ❌ ZATCA Error

    state SENT_SUCCESSFULLY {

        [*] --> NoEdit2: ❌ Edit Locked

        [*] --> NoPost2: ❌ Post Locked

        [*] --> OnlyView2: ✅ View/Print Only

        [*] --> CanCancel: ⚠️ Can Request ZATCA Cancel

    }

    state SEND_FAILED {

        [*] --> CanEdit2: ✅ Edit Allowed

        [*] --> CanPost2: ✅ Post Allowed

        [*] --> CanRetry: ✅ Retry Send

    }

    SEND_FAILED --> SENDING: Retry Send

    SEND_FAILED --> NOT_SENT: Reset Status<br/>(if allowed)

    SENT_SUCCESSFULLY --> [*]: Document Lifecycle Complete

    note right of NOT_SENT

        Initial state

        All actions allowed

    end note

    note right of SENDING

        In-flight state

        Read-only mode

        "العملية قيد الإرسال"

    end note

    note right of SENT_SUCCESSFULLY

        Final success state

        Locked from changes

        "تم الإرسال بنجاح"

    end note

    note right of SEND_FAILED

        Error state

        Allows corrections

        Can retry or edit

    end note

:::

  

---

  

## 14. Automatic Sending Configuration Matrix

  

::: mermaid

flowchart LR

    subgraph Config["📋 Configuration Options"]

        Mode["SendingMode"]

        Trigger["TriggerAction"]

    end

    subgraph ModeOptions["SendingMode Options"]

        Manual["MANUAL<br/>🖱️ Button Click Required"]

        Auto["AUTOMATIC<br/>🤖 System Auto-Sends"]

    end

    subgraph TriggerOptions["TriggerAction Options<br/>(When SendingMode = AUTOMATIC)"]

        OnSave["ON_SAVE<br/>📝 Send when user clicks Save"]

        OnPost["ON_POST<br/>📊 Send when user clicks Post"]

        OnPrint["ON_FIRST_PRINT<br/>🖨️ Send on first print<br/>(fallback to Post if not printed)"]

    end

    subgraph DocumentScopes["📄 Document Scopes"]

        ERP["ERP Transactions:<br/>- Sales Invoice<br/>- Credit Note<br/>- Advanced Payment<br/>- Project Invoice"]

        VAN["VAN Sales:<br/>- Sales Invoice<br/>- Credit Note"]

    end

    Mode --> Manual

    Mode --> Auto

    Auto --> Trigger

    Trigger --> OnSave

    Trigger --> OnPost

    Trigger --> OnPrint

    Config --> DocumentScopes

    DocumentScopes --> ERP

    DocumentScopes --> VAN

    style Manual fill:#fff4cc

    style Auto fill:#cce5ff

    style OnSave fill:#e1ffe1

    style OnPost fill:#e1ffe1

    style OnPrint fill:#e1ffe1

    style ERP fill:#ffe1f0

    style VAN fill:#ffe1f0

:::

  

---

  

## 15. Send Retry Logic (Failed Status Handling)

  

::: mermaid

flowchart TD

    Start([Document Status = SEND_FAILED]) --> UserChoice{User Decision}

    UserChoice -->|Option 1: Edit Document| EditDoc["User edits document<br/>to fix validation errors<br/>or data issues"]

    UserChoice -->|Option 2: Retry Send| DirectRetry["Click [Send to ZATCA]<br/>without editing"]

    UserChoice -->|Option 3: View Error| ViewError["View error details:<br/>- Error code<br/>- Error message<br/>- Validation details"]

    EditDoc --> SaveChanges["Save changes"]

    SaveChanges --> CheckAutoMode{Is SendingMode<br/>AUTOMATIC?}

    CheckAutoMode -->|Yes| CheckSaveTrigger{TriggerAction<br/>== ON_SAVE?}

    CheckAutoMode -->|No - MANUAL| WaitManual["Wait for manual send"]

    CheckSaveTrigger -->|Yes| AutoRetry["🚀 Auto-send immediately<br/>Status: SENDING"]

    CheckSaveTrigger -->|No| WaitTrigger["Wait for other trigger<br/>(POST or FIRST_PRINT)"]

    DirectRetry --> RetryValidation["Re-validate document"]

    RetryValidation --> ValidationOK{Validation<br/>Passed?}

    ValidationOK -->|No| BackToFailed["Status: SEND_FAILED<br/>Show validation errors"]

    ValidationOK -->|Yes| SendAgain["Status: SENDING<br/>Call ZATCA API"]

    AutoRetry --> SendAgain

    WaitManual --> ManualSend["User clicks [Send to ZATCA]"]

    ManualSend --> SendAgain

    SendAgain --> ZatcaResult{ZATCA Result}

    ZatcaResult -->|Success| Success["✅ Status: SENT_SUCCESSFULLY<br/>Lock document"]

    ZatcaResult -->|Failure| Failed["❌ Status: SEND_FAILED<br/>Update error details<br/>Allow retry again"]

    ViewError --> UserChoice

    BackToFailed --> End1([End - Can retry again])

    WaitTrigger --> End2([End - Will send on trigger])

    Success --> End3([End - Complete])

    Failed --> End4([End - Can retry again])

    style EditDoc fill:#cce5ff

    style DirectRetry fill:#cce5ff

    style ViewError fill:#fff4cc

    style Success fill:#ccffcc

    style Failed fill:#ffcccc

    style BackToFailed fill:#ffcccc

    style AutoRetry fill:#e1ffe1

:::

  

---

  

## 3. ZATCA Status State Diagram (Simple)

  

::: mermaid

stateDiagram-v2

    [*] --> NOT_SENT: 📄 Document Created

    NOT_SENT --> SENDING: 🚀 Trigger Send

    SENDING --> SENT_SUCCESSFULLY: ✅ ZATCA Success

    SENDING --> SEND_FAILED: ❌ ZATCA Failure

    SEND_FAILED --> SENDING: 🔄 Retry Send

    SENT_SUCCESSFULLY --> [*]: 🏁 Complete

    note right of NOT_SENT

        ✅ Can Edit

        ✅ Can Post

        ✅ Can Send

    end note

    note right of SENDING

        ❌ Cannot Edit

        ❌ Cannot Post

        ⏳ In Progress

    end note

    note right of SENT_SUCCESSFULLY

        ❌ Cannot Edit

        ❌ Cannot Post

        🔒 Locked

    end note

    note right of SEND_FAILED

        ✅ Can Edit

        ✅ Can Post

        ✅ Can Retry

    end note

:::

  

---

  

## 4. Document Scope Enumeration

  

::: mermaid

classDiagram

    class DocumentScope {

        <<enumeration>>

        ERP_SALES_INVOICE

        ERP_CREDIT_NOTE

        ERP_ADVANCED_PAYMENT

        ERP_PROJECT_INVOICE

        VAN_SALES_INVOICE

        VAN_CREDIT_NOTE

    }

:::

  

---

  

## 5. Manual Send – User Story 2

  

::: mermaid

sequenceDiagram

    actor User

    participant UI as Transaction Screen<br/>(Sales Invoice/Credit Note/<br/>Advanced Payment/Project Invoice)

    participant Svc as ZATCA Send Service

    participant CfgDB as Config DB

    participant DB as ERP DB

    participant ZATCA as ZATCA API

  

    User->>UI: Open document

    UI->>DB: GetDocument(docId)

    DB-->>UI: Document with ZatcaStatus

    UI->>CfgDB: GetZatcaSendingOption(companyId, doc.DocumentScope)

    CfgDB-->>UI: option (or null)

    UI->>UI: Determine visibility of<br/>[Send to ZATCA] button<br/>(based on permission & config)

    User->>UI: Click [Send to ZATCA]

    UI->>UI: Validate preconditions<br/>- Option exists<br/>- ZatcaStatus in {NotSent, SendFailed}<br/>- Not Sending<br/>- Not SentSuccessfully

    alt Preconditions fail

        UI-->>User: Show proper error<br/>(e.g. "العملية قيد الإرسال" or<br/>"تم الإرسال بنجاح")

    else Preconditions OK

        UI->>Svc: SendDocument(docId)

        Svc->>DB: Load document

        DB-->>Svc: Document

        Svc->>Svc: Validate ZATCA data<br/>(mandatory fields etc.)

        alt Validation fails

            Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ store error details

            DB-->>Svc: ok

            Svc-->>UI: ValidationError(error)

            UI-->>User: Show validation error

        else Validation ok

            Svc->>DB: Update ZatcaStatus = Sending

            DB-->>Svc: ok

            Svc->>ZATCA: Send Invoice/CN<br/>(sync or async)

            alt ZATCA Success

                ZATCA-->>Svc: Success response

                Svc->>DB: Update ZatcaStatus = SentSuccessfully<br/>+ clear/set response info

                DB-->>Svc: ok

                Svc-->>UI: SendSuccess

                UI-->>User: Show success

            else ZATCA Failure

                ZATCA-->>Svc: Error response

                Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ store error code, message,<br/>validation details

                DB-->>Svc: ok

                Svc-->>UI: SendFailed

                UI-->>User: Show failure message

            end

        end

    end

:::

  

---

  

## 6. Automatic Send on Save – User Story 3

  

::: mermaid

sequenceDiagram

    actor User

    participant UI as Transaction Screen

    participant Svc as ZATCA Auto-Send Service

    participant CfgDB as Config DB

    participant DB as ERP DB

    participant ZATCA as ZATCA API

  

    User->>UI: Click [Save]

    UI->>DB: Save document changes

    DB-->>UI: Saved

    UI->>CfgDB: GetZatcaSendingOption(companyId, docScope)

    CfgDB-->>UI: option

    UI->>UI: Check if<br/>SendingMode = AUTOMATIC<br/>TriggerAction = ON_SAVE<br/>ZatcaStatus in {NotSent, SendFailed}

    alt Conditions NOT met

        UI-->>User: Complete Save only<br/>(no sending)

    else Conditions met

        UI->>Svc: AutoSendOnSave(docId)

        Svc->>DB: Load document

        DB-->>Svc: Document

        Svc->>Svc: Validate ZATCA data

        alt Validation fails

            Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ error details

            DB-->>Svc: ok

            Svc-->>UI: ValidationError

            UI-->>User: Show validation messages

        else Validation ok

            Svc->>DB: Update ZatcaStatus = Sending

            DB-->>Svc: ok

            UI->>UI: Hide [Send to ZATCA]<br/>(button not visible in AUTO mode)

            Svc->>ZATCA: Send document

            alt Success

                ZATCA-->>Svc: Success

                Svc->>DB: Update ZatcaStatus = SentSuccessfully

                DB-->>Svc: ok

                Svc-->>UI: AutoSendSuccess

            else Failure

                ZATCA-->>Svc: Error

                Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ error details

                DB-->>Svc: ok

                Svc-->>UI: AutoSendFailed

            end

        end

    end

:::

  

---

  

## 7. Automatic Send on Post – User Story 4

  

::: mermaid

sequenceDiagram

    actor User

    participant UI as Transaction Screen

    participant Svc as ZATCA Auto-Send Service

    participant CfgDB as Config DB

    participant DB as ERP DB

    participant ZATCA as ZATCA API

  

    User->>UI: Click [Post]

    UI->>DB: Post document<br/>(accounting posting)

    DB-->>UI: Posted

    UI->>CfgDB: GetZatcaSendingOption(companyId, docScope)

    CfgDB-->>UI: option

    UI->>UI: Check<br/>SendingMode = AUTOMATIC<br/>TriggerAction = ON_POST<br/>ZatcaStatus in {NotSent, SendFailed}

    alt Conditions NOT met

        UI-->>User: Complete posting only

    else Conditions met

        UI->>Svc: AutoSendOnPost(docId)

        Svc->>DB: Load document

        DB-->>Svc: Document

        Svc->>Svc: Validate ZATCA data

        alt Validation fails

            Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ error details

            DB-->>Svc: ok

            Svc-->>UI: ValidationError

        else Validation ok

            Svc->>DB: Update ZatcaStatus = Sending

            DB-->>Svc: ok

            UI->>UI: Hide [Send to ZATCA]

            Svc->>ZATCA: Send document

            alt Success

                ZATCA-->>Svc: Success

                Svc->>DB: Update ZatcaStatus = SentSuccessfully

                DB-->>Svc: ok

                Svc-->>UI: AutoSendSuccess

            else Failure

                ZATCA-->>Svc: Error

                Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ error details

                DB-->>Svc: ok

                Svc-->>UI: AutoSendFailed

            end

        end

    end

:::

  

---

  

## 8. Automatic Send on First Print + Fallback on Post – User Story 5

  

::: mermaid

sequenceDiagram

    actor User

    participant UI as Transaction Screen

    participant Svc as ZATCA Auto-Send Service

    participant CfgDB as Config DB

    participant DB as ERP DB

    participant ZATCA as ZATCA API

  

    Note over User,ZATCA: On Print

  

    User->>UI: Click [Print]

    UI->>DB: Load document

    DB-->>UI: Document(FirstPrintFlag, ZatcaStatus)

    UI->>CfgDB: GetZatcaSendingOption(companyId, docScope)

    CfgDB-->>UI: option

    UI->>UI: Check<br/>SendingMode = AUTOMATIC<br/>TriggerAction = ON_FIRST_PRINT<br/>FirstPrintFlag == false<br/>ZatcaStatus in {NotSent, SendFailed}

    alt Conditions NOT met

        UI-->>User: Print only<br/>(no send)

    else Conditions met

        UI->>Svc: AutoSendOnFirstPrint(docId)

        Svc->>DB: Load document

        DB-->>Svc: Document

        Svc->>Svc: Validate ZATCA data

        alt Validation fails

            Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ error

            DB-->>Svc: ok

            Svc-->>UI: ValidationError

        else Validation ok

            Svc->>DB: Update<br/>- ZatcaStatus = Sending<br/>- FirstPrintFlag = true

            DB-->>Svc: ok

            Svc->>ZATCA: Send

            alt Success

                ZATCA-->>Svc: Success

                Svc->>DB: Update ZatcaStatus = SentSuccessfully

                DB-->>Svc: ok

                Svc-->>UI: AutoSendSuccess

            else Failure

                ZATCA-->>Svc: Error

                Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ details

                DB-->>Svc: ok

                Svc-->>UI: AutoSendFailed

            end

        end

    end

  

    Note over User,ZATCA: Fallback on Post (no print occurred)

  

    User->>UI: Click [Post]

    UI->>DB: Post document

    DB-->>UI: Posted

    UI->>DB: Load document

    DB-->>UI: Document(FirstPrintFlag, ZatcaStatus)

    UI->>CfgDB: GetZatcaSendingOption(companyId, docScope)

    CfgDB-->>UI: option

    UI->>UI: Check<br/>SendingMode = AUTOMATIC<br/>TriggerAction = ON_FIRST_PRINT<br/>FirstPrintFlag == false<br/>ZatcaStatus in {NotSent, SendFailed}

    alt Conditions NOT met

        UI-->>User: Posting only

    else Conditions met

        UI->>Svc: AutoSendOnPostFallback(docId)

        Svc->>DB: Load document

        DB-->>Svc: Document

        Svc->>Svc: Validate ZATCA data

        alt Validation fails

            Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ error

            DB-->>Svc: ok

            Svc-->>UI: ValidationError

        else Validation ok

            Svc->>DB: Update ZatcaStatus = Sending

            DB-->>Svc: ok

            Svc->>ZATCA: Send

            alt Success

                ZATCA-->>Svc: Success

                Svc->>DB: Update ZatcaStatus = SentSuccessfully

                DB-->>Svc: ok

                Svc-->>UI: AutoSendSuccess

            else Failure

                ZATCA-->>Svc: Error

                Svc->>DB: Update ZatcaStatus = SendFailed<br/>+ details

                DB-->>Svc: ok

                Svc-->>UI: AutoSendFailed

            end

        end

    end

:::

  

---

  

Use and customize these diagrams to fit your exact architecture (sync vs async send, message bus, microservices, etc.).