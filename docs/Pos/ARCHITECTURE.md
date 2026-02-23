# Architecture Overview: Microtec POS

This document provides a technical deep-dive into the architecture of **Microtec POS**, an offline-first POS application built with **Flutter**. It explains the layers, state management, and specialized multi-window logic used to support Customer Display Systems (CDS).

---

## 🏗️ 1. Clean Architecture Layers

The project follows a standard Clean Architecture approach, ensuring separation of concerns and testability.

### 🏢 **Presentation Layer (`lib/presentation/`)**
- **UI:** Flutter Widgets, pages, and components.
- **State Management:** **BLOC** (via `flutter_bloc`). BLOCs interact with Domain layer use-cases and emit states for the UI to consume.
- **Views:** Includes specialized views for CDS (Customer Display Systems) on both Windows and Tablet platforms.

### 🧠 **Domain Layer (`lib/domain/`)**
- **Entities:** Pure business logic objects.
- **Use Cases:** Application-specific business rules.
- **Repository Interfaces:** Abstract definitions of data operations, to be implemented in the Infra layer.

### 💾 **Infrastructure Layer (`lib/infra/`)**
- **Repositories:** Concrete implementations of Domain repositories.
- **Data Sources:** 
    - **Local:** **ObjectBox** (NoSQL) for high-performance offline storage.
    - **Remote:** **REST API** (via `Dio`) for cloud sync.
    - **Real-time:** **gRPC/Protobuf** for KDS/CDS communication.

---

## 🧪 2. State Management & DI

### **BLOC Pattern**
We use **BLOC** for all state-heavy features. Each business module (Auth, Sales, Tables, Sync) has its own BLOC.
- **Events:** Represent user actions or system triggers.
- **States:** Immutable representations of the UI at a specific point in time.

### **Dependency Injection**
- **GetIt & Injectable:** Used for automatic dependency injection.
- **Service Locator:** Initialized in `lib/di/service_locator.dart`.
- **`configureDependencies()`:** Asynchronous setup called at app startup to register all services and repositories.

---

## 🖥️ 3. Multi-Display & CDS Logic

The application supports dual-screen setups (Windows Desktop) and secondary tablets for Customer Display Systems (CDS).

### **Windows Multi-Window**
- Managed via the `desktop_multi_window` package.
- The entry point (`lib/main.dart`) detects the `multi_window` argument and launches a separate `WindowsCdsView` instance.
- **Communication:** Local JSON-based messages are used to sync the main sale window with the customer display.

### **Tablet CDS**
- A dedicated `TabletCdsView` is provided for cases where the customer display is a separate Android tablet.
- **Sync:** Real-time communication is handled via **gRPC** to ensure the customer sees item updates instantly.

---

## 📡 4. Data Synchronization

The app uses an **offline-first** strategy:
1. **Local Writes:** All transactions are first written to the **ObjectBox** store.
2. **Background Sync:** Dedicated sync managers (`lib/application/web_sync/`) monitor local changes and push them to the cloud via REST APIs.
3. **Conflict Resolution:** Business-date-based logic ensures that shifts spanning across midnight are synchronized accurately without data loss.

---

## ⚙️ 5. Monitoring & Error Handling

- **Sentry:** integrated into `lib/main.dart` via `runZonedGuarded`. It captures all unhandled exceptions and performance traces.
- **Custom Logging:** A `LogManager` tracks application events locally for diagnostic purposes.

---
*For business-level feature descriptions, see [APP_SPECIFICATIONS.md](APP_SPECIFICATIONS.md).*
