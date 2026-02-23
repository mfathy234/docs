# Technical Documentation Index: Microtec POS

This index serves as a roadmap for the full technical documentation of the Microtec POS system. The documentation is organized by architectural layers, behavioral patterns, and infrastructure integrations.

## 🏗️ Phase 1: Structural Documentation (The "What")
- [**Domain Models**](DOMAIN_MODELS.md): Core business entities (Orders, Products, Customers, etc.) and their business logic roles.
- [**Data Persistence**](DATA_PERSISTENCE.md): ObjectBox schema, entity relationships, and the Repository pattern implementation.

## 🧠 Phase 2: Behavioral Documentation (The "How")
- [**Synchronization Strategy**](SYNC_STRATEGY.md): Detailed explanation of the offline-first strategy, conflict resolution, and background sync (Web & Local).
- [**State Management**](STATE_MANAGEMENT.md): Patterns, events, and states using BLoC across the application.

## 🔌 Phase 3: Integration & Infrastructure (The "Where")
- [**Hardware Integration**](HARDWARE_INTEGRATION.md): Interfaces and managers for Printers, Barcode Scanners, and Payment Terminals.
- [**Communication Protocols**](COMMUNICATION_PROTOCOLS.md): gRPC for local network (KDS/CDS) and REST for cloud synchronization.

## 🛠️ Phase 4: Developer Operations (The "Who")
- [**Developer Guide**](DEVELOPER_GUIDE.md): Coding standards, Dependency Injection (GetIt/Injectable), and how to extend the project.
- [**Build & Deployment**](BUILD_DEPLOYMENT.md): Multi-platform build processes (Windows MSIX, Android, iOS) and CI/CD overview.

---
*Maintained by Gemini CLI - last updated: February 2026*
