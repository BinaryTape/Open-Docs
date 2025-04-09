---
title: "iOS 整合方法 (iOS integration methods)"
---
您可以將 Kotlin Multiplatform 共用模組整合到您的 iOS 應用程式中。為此，您可以從共用模組產生一個 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)（iOS 框架），然後將其作為相依性新增到 iOS 專案：

<img src="/img/ios-integration-scheme.svg" alt="iOS integration scheme" style={{verticalAlign: 'middle'}}/>

可以將此框架作為本機或遠端相依性使用。如果您想完全控制整個程式碼庫，並在通用程式碼變更時立即更新到最終應用程式，請選擇本機整合。

如果您想將最終應用程式的程式碼庫與通用程式碼庫明確分開，請設定遠端整合。在這種情況下，共用程式碼將像常規的第三方 (third-party) 相依性一樣整合到最終應用程式中。

## 本機整合 (Local integration)

在本機設定中，有兩個主要的整合選項。您可以使用透過特殊腳本的直接整合，這會使 Kotlin 建置成為 iOS 建置的一部分。如果您的 Kotlin Multiplatform 專案中有 Pod 相依性，請採用 CocoaPods 整合方法。

### 直接整合 (Direct integration)

您可以透過將特殊腳本新增到 Xcode 專案，直接從 Kotlin Multiplatform 專案連線 iOS 框架。該腳本已整合到專案建置設定的建置階段中。

如果您**沒有**在 Kotlin Multiplatform 專案中匯入 CocoaPods 相依性，則此整合方法可能適用於您。

如果您在 Android Studio 中建立專案，請選擇 **Regular framework**（常規框架）選項以自動產生此設定。如果您使用 [Kotlin Multiplatform web wizard](https://kmp.jetbrains.com/)（Kotlin Multiplatform 網路精靈），則預設情況下會套用直接整合。

有關更多資訊，請參閱 [Direct integration](multiplatform-direct-integration)（直接整合）。

### 透過本機 podspec 進行 CocoaPods 整合 (CocoaPods integration)

您可以透過 [CocoaPods](https://cocoapods.org/)（一種流行的 Swift 和 Objective-C 專案相依性管理器）從 Kotlin Multiplatform 專案連線 iOS 框架。

如果符合以下條件，則此整合方法適用於您：

* 您有一個包含使用 CocoaPods 的 iOS 專案的單一程式碼庫 (mono repository) 設定
* 您在 Kotlin Multiplatform 專案中匯入 CocoaPods 相依性

要設定具有本機 CocoaPods 相依性的工作流程，您可以手動編輯腳本，也可以使用 Android Studio 中的精靈產生專案。

有關更多資訊，請參閱 [CocoaPods overview and setup](native-cocoapods)（CocoaPods 概述和設定）。

## 遠端整合 (Remote integration)

對於遠端整合，您的專案可以使用 Swift Package Manager (SPM) 或 CocoaPods 相依性管理器來連線 Kotlin Multiplatform 專案中的 iOS 框架。

### 具有 XCFrameworks 的 Swift 套件管理器 (Swift package manager)

您可以使用 Swift 套件管理器 (SPM) 相依性，透過 XCFrameworks 連線 Kotlin Multiplatform 專案中的 iOS 框架。

有關更多資訊，請參閱 [Swift package export setup](native-spm)（Swift 套件匯出設定）。

### 具有 XCFrameworks 的 CocoaPods 整合 (CocoaPods integration)

您可以使用 Kotlin CocoaPods Gradle 外掛程式建置 XCFrameworks，然後透過 CocoaPods 將專案的共用部分與行動應用程式分開發布。

有關更多資訊，請參閱 [Build final native binaries](multiplatform-build-native-binaries#build-frameworks)（建置最終原生二進位檔案）。