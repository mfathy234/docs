# Microtec POS Application Specifications & Business Logic

This document provides a comprehensive overview of the **Microtec POS** application, a professional-grade Point of Sale system built with Flutter.

## 1. Technical Specifications (Technical Stack)
*   **Framework:** Flutter (Targeting Windows, Android, and iOS).
*   **Architecture:** Clean Architecture with **BLOC** for state management.
*   **Local Database:** **ObjectBox** (High-performance NoSQL database for offline-first capabilities).
*   **Communication:** 
    *   **gRPC & Protobuf:** Used for high-speed, real-time communication (KDS, CDS, and local network).
    *   **REST API (Dio):** For synchronization with the main web backend.
*   **Peripherals & Integrations:**
    *   **Printing:** ESC/POS printer support via a custom manager.
    *   **Payments:** Integration with external payment terminals.
    *   **Hardware:** Support for Barcode Scanners and Weighing Scales.
    *   **Multi-Display:** Support for Customer Display Systems (CDS) and multi-window desktop setups.
*   **Monitoring:** Sentry for error tracking and performance monitoring.

---

## 2. Business Features
The application is a hybrid system supporting both **Retail** and **Restaurant** business models.

### Core POS Features:
*   **Sales Operations:** Item scanning (barcode), manual search, and category-based selection.
*   **Restaurant Management:**
    *   **Floor & Table Management:** Visual representation of tables and floors.
    *   **Kitchen Flow:** Sending orders to Kitchen Display Systems (KDS) or kitchen printers.
    *   **Menu Customization:** Support for "Options" (addons) and "Ingredients" (modifications).
*   **Transaction Types:** Support for Invoices, Returns (Full/Partial), and Reservations.
*   **Customer Management (CRM):** Customer profiles, groups, and loyalty points system.
*   **Discounts & Promotions:** 
    *   Manual and automatic discounts.
    *   Surcharges and service charges.
    *   Offer/Promotion engine.

### Backend & Management:
*   **Shift Management:** Opening/Closing sessions with cash drawer reconciliation (Tender counting).
*   **Offline-First Sync:** Advanced sync managers that handle data consistency between local storage and the cloud.
*   **Reporting:** On-device business date reports and transaction history.
*   **Barcode Printing:** Utility for generating and printing product barcodes.

---

## 3. Business Logic & Calculations
*   **Pricing Engine:** Calculates prices based on base price, addons/options, item-level vs. order-level discounts, and tax (VAT) per item or order.
*   **Order Lifecycle:** Orders move through states: `Draft` -> `Hold` (Sent to Kitchen) -> `Unpaid/Partial` -> `Paid` -> `Closed`.
*   **Audit Trail:** The system tracks "Removed Items" from orders for security and auditing purposes.
*   **Business Date Logic:** Decouples the "Business Date" from the "System Date," allowing shifts to span across midnight without breaking reports.

---

## 4. Application Flow (User Journey)

### Phase 1: Authentication & Setup
1.  **Login:** User authenticates via credentials.
2.  **Initialization:** App syncs latest data (products, prices, settings).
3.  **Session Start:** User opens a "Session" (Shift) by entering the opening cash balance.

### Phase 2: The Sales Process
1.  **Entry Point:** User selects "Sell" (Retail) or a Table (Restaurant) from the main dashboard.
2.  **Cart Building:** 
    *   Scan items or pick from categories.
    *   Configure modifiers (addons/ingredients).
    *   Add order-level notes.
3.  **Order Handling:** Save order and send to kitchen (**Hold**) or proceed to payment.

### Phase 3: Payment & Finalization
1.  **Payment Screen:** Choose payment method (Cash, Credit Card, Loyalty Points, or Split Payment).
2.  **Terminal Integration:** If card is selected, the app triggers the physical payment terminal.
3.  **Finalization:** Invoice is generated, local DB is updated, and a receipt is printed.
4.  **Sync:** The order is queued for background synchronization to the cloud.

### Phase 4: Closing the Loop
1.  **End of Shift:** User closes the session.
2.  **Reconciliation:** User enters actual cash/card totals; system identifies variances.
3.  **Reporting:** Shift report is printed, and the user is logged out.
