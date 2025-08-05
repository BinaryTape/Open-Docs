[//]: # (title: iOS 整合方式)

您可以將 Kotlin Multiplatform 共享模組整合到您的 iOS 應用程式中。為此，您需要從該共享模組產生一個 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)，然後將其作為依賴項添加到 iOS 專案中：

![iOS 整合方案示意圖](ios-integration-scheme.svg)

此 framework 可以作為本地或遠端依賴項來使用。如果您想完全控制整個程式碼庫並在共同程式碼變更時即時更新最終應用程式，請選擇本地整合。

如果您想明確地將最終應用程式的程式碼庫與共同程式碼庫分離，請設定遠端整合。在此情況下，共享程式碼將作為常規的第三方依賴項整合到最終應用程式中。

## 本地整合

在本地設定中，有兩種主要的整合選項。您可以通過一個特殊指令碼來使用直接整合，這會使 Kotlin 建構成為 iOS 建構的一部分。如果您的 Kotlin Multiplatform 專案中有 Pod 依賴項，請採用 CocoaPods 整合方法。

### 直接整合

您可以通過將一個特殊指令碼添加到您的 Xcode 專案中，直接從 Kotlin Multiplatform 專案連接 iOS framework。該指令碼被整合到專案建構設定的建構階段中。

如果您在 Kotlin Multiplatform 專案中**不**導入 CocoaPods 依賴項，則此整合方法適用於您。

如果您在 Android Studio 中建立專案，請選擇 **Regular framework** 選項以自動產生此設定。如果您使用 [Kotlin Multiplatform 網路精靈](https://kmp.jetbrains.com/)，預設會應用直接整合。

欲了解更多資訊，請參閱 [直接整合](multiplatform-direct-integration.md)。

### 使用本地 podspec 的 CocoaPods 整合

您可以通過 [CocoaPods](https://cocoapods.org/) 連接來自 Kotlin Multiplatform 專案的 iOS framework，CocoaPods 是一個常用於 Swift 和 Objective-C 專案的依賴項管理器。

此整合方法適用於以下情況：

* 您有一個使用 CocoaPods 的 iOS 專案的單一儲存庫設定
* 您在 Kotlin Multiplatform 專案中導入 CocoaPods 依賴項

若要設定包含本地 CocoaPods 依賴項的工作流程，您可以手動編輯指令碼，或在 Android Studio 中使用精靈產生專案。

欲了解更多資訊，請參閱 [CocoaPods 概述與設定](multiplatform-cocoapods-overview.md)。

## 遠端整合

對於遠端整合，您的專案可能會使用 Swift Package Manager (SPM) 或 CocoaPods 依賴項管理器來連接來自 Kotlin Multiplatform 專案的 iOS framework。

### 結合 XCFrameworks 的 Swift package manager

您可以使用 XCFrameworks 設定 Swift Package Manager (SPM) 依賴項，以連接來自 Kotlin Multiplatform 專案的 iOS framework。

欲了解更多資訊，請參閱 [Swift package 匯出設定](multiplatform-spm-export.md)。

### 使用 XCFrameworks 的 CocoaPods 整合

您可以使用 Kotlin CocoaPods Gradle 外掛程式建構 XCFrameworks，然後通過 CocoaPods 將專案的共享部分與行動應用程式分開分發。

欲了解更多資訊，請參閱 [建構最終原生二進位檔](multiplatform-build-native-binaries.md#build-frameworks)。