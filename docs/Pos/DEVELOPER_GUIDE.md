# Developer Guide: Microtec POS

This document provides essential information for developers contributing to or maintaining the Microtec POS project.

## 1. Development Environment

### Prerequisites
- **Flutter SDK:** Ensure you are using the latest stable version of Flutter.
- **Dart SDK:** Integrated with Flutter.
- **ObjectBox Binary:** Some systems may require additional libraries for ObjectBox; refer to [ObjectBox docs](https://docs.objectbox.io/getting-started).

### Code Generation
The project relies heavily on code generation for models, dependency injection, and data storage. After making changes to any files using these libraries, run:
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```
This command generates files for:
- **Freezed:** Models and states (`*.freezed.dart`).
- **Injectable:** Dependency injection mapping (`service_locator.config.dart`).
- **ObjectBox:** Database schema and mappings (`objectbox.g.dart`).
- **JSON Serializable:** Data Transfer Objects (`*.g.dart`).

---

## 2. Dependency Injection (DI)

We use **GetIt** as our service locator and **Injectable** for automatic registration.
- **Setup:** Initialized in `lib/main.dart` calling `configureDependencies()` from `lib/di/service_locator.dart`.
- **Usage:** Register services with annotations like `@LazySingleton(as: InterfaceName)` or `@injectable`. Use `serviceLocator<Type>()` to retrieve instances.

---

## 3. Extending the Project

When adding a new feature, follow the Clean Architecture layers:

### 1. Domain Layer (`lib/domain/`)
- Define the **Entity** (using Freezed).
- Define the **Repository Interface** (abstract class).
- Define any **Value Objects** or **Failures** specific to the feature.

### 2. Infrastructure Layer (`lib/infra/`)
- Implement the repository interface.
- Create **DTOs** if external data (API or DB) differs from the Domain entity.
- Add an `@LazySingleton(as: InterfaceName)` annotation for the implementation.

### 3. Application Layer (`lib/application/`)
- Create a **BLoC** (using `flutter_bloc`).
- Define Events and States.
- The BLoC should depend only on the Domain interfaces, injected via the constructor.

### 4. Presentation Layer (`lib/presentation/`)
- Create the UI components and pages.
- Use `BlocBuilder` or `BlocListener` to react to state changes.

---

## 4. Coding Standards

- **Naming Conventions:** Use PascalCase for classes, camelCase for variables and methods.
- **Immutability:** Use `freezed` for all models and BLoC states to ensure immutability and state safety.
- **Error Handling:** Use the `dartz` package's `Either<Failure, Success>` pattern. **Never throw exceptions for business errors;** return a `Failure` instead.
- **Documentation:** Document all public interfaces and complex business logic using triple-slash (`///`) comments.

---
*For build and packaging instructions, see [BUILD_DEPLOYMENT.md](BUILD_DEPLOYMENT.md).*
