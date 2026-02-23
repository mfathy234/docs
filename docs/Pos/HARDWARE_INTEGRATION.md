# Hardware Integration: Microtec POS

Microtec POS is designed to interface with a variety of retail and restaurant hardware. This document describes the architecture of these integrations.

## 1. Printing System (ESC/POS)

The printing system is built on the ESC/POS standard, supporting thermal receipt printers and impact kitchen printers.

### `EscPrintingOperationBloc`
This BLoC orchestrates all printing tasks:
- **Automatic Routing:** Orders are routed to different printers based on product groups (e.g., "Drinks" to the Bar, "Main Course" to the Kitchen).
- **Templates:** Uses `LocalPrintTemplateDto` to define what information appears on receipts versus kitchen slips.
- **Multi-Printer Support:** A single transaction can trigger multiple print jobs (e.g., one customer receipt and two kitchen copies).

### Communication
- **Network Printers:** Uses `EscPrinterSocketOperation` to communicate over TCP/IP (port 9100).
- **USB/Bluetooth:** Handled via the `pos_printer_manager` package (integrated as a local dependency).

---

## 2. Payment Terminals (Bank/Visa)

Integration with physical payment terminals ensures that card transactions are automatically reconciled in the POS.

### `OrderPayByDeviceOperationBloc`
- **Workflow:** When a "Card" payment is initiated, the POS sends the amount to the terminal via a local network or serial connection.
- **Verification:** The POS waits for a success signal from the terminal before finalizing the `OrderModel` and emitting the success state.
- **Failure Recovery:** If the terminal transaction fails, the BLoC provides the failure reason and allows the cashier to retry or change the payment method.

---

## 3. Peripheral Devices

### Barcode Scanners
- **Integration:** Handled via custom listeners that capture HID (Keyboard) input and standard camera-based scanning via the `flutter_barcode_scanner` package.
- **Logic:** Scanned barcodes are matched against the local `ItemBarcode` store to instantly add products to the cart.

### Customer Display Systems (CDS)
- **Multi-Window (Windows):** For dual-screen setups, the app launches a secondary window using `desktop_multi_window`.
- **Tablet CDS:** For secondary tablets, real-time data is pushed via **gRPC** to ensure the customer sees item updates and totals instantly.

### Weighing Scales
- **Logic:** Integrated via `ScalesSyncBloc` and specialized managers to read weight data directly into the POS, automatically calculating prices for "Weight-based" products.

---
*For details on the networking protocols used for these devices, see [COMMUNICATION_PROTOCOLS.md](COMMUNICATION_PROTOCOLS.md).*
