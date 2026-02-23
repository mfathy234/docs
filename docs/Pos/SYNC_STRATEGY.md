# Synchronization Strategy: Microtec POS

Microtec POS employs an **offline-first** synchronization strategy to ensure business continuity in environments with unstable internet connections. This document details the mechanisms for both cloud (Web) and local network synchronization.

## 1. Cloud Synchronization (Web Sync)

The Web Sync process is responsible for keeping the local database in parity with the central cloud server.

### Sync Orchestration: `RetailSyncManagerBloc`
The `RetailSyncManagerBloc` (and its counterparts for Restaurant/KDS) acts as the central controller for data flowing from the cloud.
- **Gateway Check:** Before starting, it calls `SyncGatewayManager.syncGateway()` to fetch a `SyncResponse`. This response indicates which modules (Products, Customers, Offers, etc.) have updates available.
- **Dependency Management:** The sync is not entirely parallel. For example, `ItemBarcodes` only start syncing after `ItemDefinitions` have successfully finished.
- **Retry Mechanism:** Failed module syncs are automatically retried up to a configurable maximum (`Config.maxSyncRetry`).

### Order Synchronization
Unlike master data (which is pulled), orders are **pushed** to the cloud.
1. **Local Save:** Orders are immediately committed to ObjectBox.
2. **Post-Save Sync:** In `OrderOperationsBloc`, specific order types (like paid orders or those with loyalty points) trigger an immediate call to `OrderRepoApi.syncOrderModel`.
3. **Sync State Tracking:** The `OrderSyncStatus` (`synced`, `notSynced`, `error`) ensures that background managers can identify and retry orders that failed their initial push.

---

## 2. Local Network Sync (RPC)

For real-time features like Kitchen Display Systems (KDS) and Customer Display Systems (CDS), the app uses a local network protocol.

### gRPC & Protobuf
- **Real-time Updates:** When an order is "Hold" (sent to kitchen), the app uses gRPC to notify KDS devices on the same local network.
- **Local Connection Management:** `CacheController` monitors if a local server is available. If connected, `OrderRPCOperation` is used instead of standard DB/API paths for specific real-time tasks.

---

## 3. Conflict Resolution & Integrity

### Business Date Logic
The system uses a `businessDate` separate from the hardware clock. This prevents synchronization issues during shifts that span past midnight, ensuring all transactions are grouped correctly in the cloud reports.

### Counter Management
To prevent duplicate invoice numbers across multiple devices, each device has its own segment of the numbering scheme. The `OrderCounterDbOperation` manages these local counters, and they are periodically reconciled with the server.

---
*For details on the UI logic driving these actions, see [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md).*
