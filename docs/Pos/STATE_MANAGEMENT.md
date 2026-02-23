# State Management: Microtec POS

This document explains the state management patterns and architectures used in Microtec POS, centered around the **BLoC (Business Logic Component)** library.

## 1. The BLoC Architecture

The application is built on a modular, event-driven architecture where each business feature is controlled by a dedicated BLoC. This ensures a clean separation between the UI (Flutter Widgets) and the application's business rules.

### Core Components
- **Events:** Represent user actions (e.g., `PayOrder`, `CancelOrder`) or system triggers.
- **States:** Immutable representations of the UI at a given moment (e.g., `Loading`, `Success`, `Failure`).
- **Blocs:** The orchestrators that transform incoming events into new states by interacting with domain-layer use cases and repositories.

---

## 2. Global & Shared States

Global states are managed through `MultiBlocProvider` at the root of the application or at the scope level to ensure availability across multiple pages.

### Key Global Blocs:
- `CurrentAuthBloc`: Manages the authenticated user session and permissions.
- `CurrentDeviceBloc`: Holds hardware configuration (branch ID, device ID, default settings).
- `CurrentSessionBloc`: Tracks the active business shift (opening balance, business date).
- `CurrentCustomerBloc`: Manages the customer selected for the current transaction.

---

## 3. Transaction Lifecycle: `OrderOperationsBloc`

The most critical BLoC in the application, `OrderOperationsBloc`, handles the entire lifecycle of a sale.

### Event Processing Pattern
When an event like `PayOrder` is received:
1. **Emit Loading:** The UI shows a progress indicator.
2. **Business Validation:** The BLoC checks if the order is valid (e.g., sufficient payment, correct customer data).
3. **Data Transformation:** An `OrderModel` is created or updated using `OrderCreateRepo`.
4. **Repository Call:** The order is stored locally via `OrderModelDBOperation` or synced via `OrderRepoApi`.
5. **Emit Final State:** The UI is notified of success (clearing the cart and printing the receipt) or failure (displaying an error message).

---

## 4. State Communication (Cross-Bloc)

Some BLoCs need to react to changes in other BLoCs. This is handled using **StreamSubscriptions**.
- **Example:** `OrderOperationsBloc` listens to `OrderPayByDeviceOperationBloc`. When a card payment terminal successfully completes a transaction, `OrderOperationsBloc` receives a notification to proceed with finalizing the order.

---

## 5. Functional Error Handling

The app uses the **dartz** package for functional programming patterns:
- **`Either<Failure, Success>`:** Blocs return this type from repository calls, making error handling explicit and preventing unhandled exceptions.
- **`Option<T>`:** Used in states to represent optional values (like the result of the last operation) without using `null`.

---
*For infrastructure and hardware integration details, see [HARDWARE_INTEGRATION.md](HARDWARE_INTEGRATION.md).*
