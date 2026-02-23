# Data Persistence: Microtec POS

This document explains the data persistence strategy of Microtec POS, an **offline-first** application built with Flutter.

## 1. Local Database: ObjectBox

Microtec POS uses **ObjectBox** (a high-performance NoSQL database for Flutter/Dart) for all local data storage. This ensures high-speed operations and complete offline functionality.

### Core Persistence Concepts
- **Offline-First:** All writes (sales, shifts, customer updates) occur locally first.
- **Data Transfer Objects (DTOs):** Reside in the `lib/infra` layer. These objects (e.g., `OrderModelDto`) are annotated with `@Entity()` for ObjectBox.
- **Interface Inversion:** The `lib/infra` layer implements repository interfaces defined in `lib/domain`.

### Entity Relationships in ObjectBox
- **ToOne/ToMany Relations:** Used to model complex business entities. For example:
    - `OrderModelDto` has a `ToMany<OrderItemDto>` relation.
    - `OrderModelDto` has a `ToOne<UserDto>` for tracking who opened/closed it.
- **JSON Serialization:** Some deeply nested or highly dynamic objects (like pricing logic or complex modifiers) are stored as JSON strings in ObjectBox properties for flexibility.

---

## 2. Repository Pattern Implementation

The persistence logic is encapsulated in repository implementations in `lib/infra`.

### `OrderModelDBOperationImpl`
The primary implementation for database operations related to orders.
- **Transactions:** Uses `_store.runInTransaction` to ensure atomicity when saving complex order trees (Order + Items + Payments).
- **Search & Filtering:** Utilizes `QueryBuilder` and `Condition` (via `OrderModelRepoDBQuery`) to handle advanced filtering by date range, status, and custom search queries.
- **Pagination:** Implemented via `offset` and `limit` in `QueryBuilder` to maintain UI performance with thousands of transactions.

### Key Data Stores
- **Order Store:** Tracks all transactions, returns, and reservations.
- **Product Store:** Local cache of the product catalog (synced from the cloud).
- **Session Store:** Manages shift data and cash drawer reconciliation.
- **Counter Store:** Maintains local invoice and order numbering to prevent gaps when offline.

---

## 3. Data Integrity & Maintenance

- **Automatic Numbering:** The `OrderCounterDto` tracks the last used invoice number per device and business date, ensuring unique IDs across the entire branch.
- **Sync Status Tracking:** Every entity has a `SyncStatus` property (e.g., `notSynced`, `synced`, `error`) used by the background synchronization manager.
- **Data Pruning:** The system includes logic to remove old synced orders and sessions to manage local storage usage (found in `removeOldOrdersByUidS`).

---
*For behavioral logic and synchronization details, see [SYNC_STRATEGY.md](SYNC_STRATEGY.md).*
