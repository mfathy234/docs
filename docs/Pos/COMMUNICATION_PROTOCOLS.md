# Communication Protocols: Microtec POS

Microtec POS uses a multi-layered communication strategy to balance high-speed local network performance with reliable cloud synchronization.

## 1. REST API (Cloud Sync)

The primary channel for master data synchronization and order persistence to the cloud.

### Implementation: `Dio`
- **Library:** Uses the `Dio` HTTP client with custom interceptors for authentication and logging.
- **Data Transfer:** Uses JSON format for all payloads.
- **Sync Logic:**
    - **GET:** Pulls updates for Products, Customers, Discounts, and Settings.
    - **POST/PUT:** Pushes Orders, Sessions, and Customer profile updates.
- **Persistence:** All REST data is mapped into local **ObjectBox** DTOs in the `lib/infra` layer.

---

## 2. gRPC & Protobuf (Local Real-Time)

For high-speed, real-time communication between local devices (KDS/CDS/POS), the app uses gRPC.

### Use Cases:
- **KDS (Kitchen Display System):** When a POS sends an order to the kitchen, the KDS receives a gRPC message instantly, avoiding the latency and dependency of a cloud round-trip.
- **CDS (Customer Display System):** Real-time item updates and totals are pushed to customer-facing tablets on the same local network.

### Advantages:
- **Efficiency:** Protobuf's binary format is significantly smaller and faster to parse than JSON.
- **Bidirectional Streaming:** Enables real-time, low-latency updates without continuous polling.
- **Type Safety:** Generated Dart code from `.proto` files ensures strict data contracts between devices.

---

## 3. TCP Sockets (Printers)

Direct socket communication for ESC/POS printer control.

### Implementation:
- **Standard:** Connects to port 9100 for network-based thermal printers.
- **Workflow:** The POS generates the ESC/POS binary command stream (via `pos_printer_manager`) and sends it directly to the printer's IP address.
- **Error Handling:** Retries are handled at the socket level to manage transient network drops.

---

## 4. Multi-Window IPC (Windows Desktop)

For dual-monitor Windows setups, the app uses Inter-Process Communication (IPC) between the main sales window and the customer display window.

### Implementation: `desktop_multi_window`
- **Mechanism:** The main window sends JSON-formatted messages to the secondary window's handle.
- **Sync:** Both windows share the same application memory space but run distinct UI isolates, ensuring that the sales UI remains responsive even during complex rendering on the customer display.

---
*For development standards and project architecture, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).*
