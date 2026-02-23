# Domain Models: Microtec POS

This document outlines the core business entities used in the Microtec POS system. These entities reside in the `lib/domain` layer and represent the "Source of Truth" for business logic, independent of UI or data storage implementations.

## 1. Order Management

### `OrderModel`
The central entity representing a sales transaction (Retail or Restaurant).
- **UID**: Unique identifier for synchronization and local tracking.
- **Invoice Number**: Generated based on branch, device, year, and a local counter.
- **Type**: `Sale`, `Return`, `Reservation`, `ReturnDish`.
- **Status**: `Draft`, `Hold`, `Paid`, `Closed`, etc.
- **Business Date**: Decoupled from system date to handle shifts correctly.
- **Components**:
    - `OrderItemList`: Collection of items in the cart.
    - `OrderPaymentList`: List of payments (supports split payments).
    - `OrderOffer` & `OrderDiscount`: Applied promotions.
    - `RemovedOrderItem`: Audit trail of items removed after being sent to the kitchen.

### `OrderItem`
Represents an individual product entry in an order.
- **Quantity**: Tracks original and adjusted quantities (for returns/offers).
- **Price Details**: Handled by `OrderItemPrice`, tracking taxes and discounts per line.
- **Modifiers**:
    - `OrderItemOption`: Add-ons with their own pricing and tax logic.
    - `OrderItemIngredient`: Removable ingredients (e.g., "No Onions").

---

## 2. Product Catalog

### `Product`
The base definition of an item available for sale.
- **Attributes**: Code, Barcode, Names (Arabic/Latin), Calories, Preparation Time.
- **Taxation**: Linked to a `Tax` entity; supports VAT-inclusive or exclusive pricing.
- **Structure**:
    - `OptionGroup`: Defines available add-ons (selection modes: Single/Multiple).
    - `ProductIngredient`: Standard ingredients that can be modified.
    - `ProductSelectedPrice`: Dynamically calculated price based on the active price policy.

---

## 3. Customer & Loyalty

### `CustomersModel`
Represents a client profile.
- **Loyalty**: Tracks `pointsBalance` and `pendingPoints`.
- **Pricing**: Linked to a `customerGroupId` which can trigger specific price policies.
- **LoyaltyExchange**: Defines the conversion rate between points and monetary value.

---

## 4. Sessions & Shifts

### `Session`
Manages the lifecycle of a cashier's work period.
- **Balance Tracking**: Tracks `openingBalance` and various ending balances (`endingCashBalance`, `endingVisaBalance`).
- **Tender**: A list of `Tender` objects representing counted cash/card amounts during reconciliation.
- **Sync State**: Tracks whether the shift has been synchronized to the cloud.

---
*For data storage details, see [DATA_PERSISTENCE.md](DATA_PERSISTENCE.md).*
