# Build & Deployment Guide: Microtec POS

This document outlines the multi-platform build and deployment processes for the Microtec POS system.

## 1. Multi-Platform Build Commands

Microtec POS is optimized for three primary platforms: Windows, Android, and iOS.

### Windows (MSIX Packaging)
The Windows build uses the `msix` package to generate a self-signed or store-ready installer.
```bash
# Clean and get dependencies
flutter clean
flutter pub get

# Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# Build MSIX package
flutter pub run msix:create
```
*Note: Ensure the `msix_config` section in `pubspec.yaml` is updated with the correct `msix_version` and certificate before building.*

### Android (APK & App Bundle)
Android builds are configured for both direct installation and Google Play Store distribution.
```bash
# Build APK for direct installation
flutter build apk --release

# Build App Bundle for Play Store
flutter build appbundle
```
*Tip: Android build signatures are managed in `android/app/build.gradle`.*

### iOS (App Store)
iOS builds follow the standard Flutter/Xcode flow.
```bash
# Build iOS IPA
flutter build ipa --release
```
*Note: Xcode setup and signing identities must be configured on a macOS machine.*

---

## 2. CI/CD: Bitbucket Pipelines

The project includes a `bitbucket-pipelines.yml` configuration for automated Android builds.
- **Workflow:** On every commit, the pipeline:
    1. Installs Flutter.
    2. Runs `build_runner`.
    3. Builds the APK and App Bundle.
    4. Uploads artifacts to the Bitbucket repository.
- **Automated Deployment:** The `Deploy-to-Production` step uses a custom `curl` command to push the APK to a custom update server for auto-updates on devices.

---

## 3. Versioning Strategy

The application version is managed in `pubspec.yaml`:
- **Format:** `version: 1.4.10+54` (Semantic Version + Build Number).
- **Update Frequency:** The build number (`+54`) should be incremented for every release to ensure update mechanisms (like Android's `versionCode` and MSIX's versioning) function correctly.

---

## 4. Platform-Specific Assets

- **App Icons:** Icons for all platforms are generated from `assets/images/new_logo.png` using the `flutter_launcher_icons` package.
- **Splash Screen:** Splash screens are generated using the `flutter_native_splash` package.
- **CDS Images:** Marketing images for Customer Display Systems (CDS) are located in `assets/images/` and configured in `assets/config/log_capabilities.json`.

---
*For development-specific details, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).*
