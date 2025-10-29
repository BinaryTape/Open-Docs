[//]: # (title: iOS 整合方法)

您可以將 Kotlin Multiplatform 共享模組整合到您的 iOS 應用程式中。為此，您可以從共享模組產生一個 [iOS 框架](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)，然後將其作為依賴項新增到 iOS 專案中：

![iOS 整合方案](ios-integration-scheme.svg)

此框架可以作為本地或遠端依賴項來使用。如果您希望對整個程式碼庫擁有完全控制權，並且在常用程式碼變更時，最終應用程式能夠立即獲得更新，請選擇本地整合。

如果您想將最終應用程式的程式碼庫與常用程式碼庫明確分離，請設定遠端整合。在這種情況下，共享程式碼將像常規的第三方依賴項一樣整合到最終應用程式中。

## 本地整合

在本地設定中，有兩種主要的整合選項。您可以透過特殊腳本使用直接整合，這會讓 Kotlin 建置成為 iOS 建置的一部分。如果您的 Kotlin Multiplatform 專案中包含 Pod 依賴項，請採用 CocoaPods 整合方法。

### 直接整合

您可以透過向您的 Xcode 專案新增一個特殊腳本，直接從 Kotlin Multiplatform 專案連結 iOS 框架。該腳本會整合到您專案建置設定的建置階段中。

如果您的 Kotlin Multiplatform 專案中**沒有**匯入 CocoaPods 依賴項，此整合方法則適用於您。

如果您使用 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，則會預設應用直接整合。

如需更多資訊，請參閱 [直接整合](multiplatform-direct-integration.md)。

### CocoaPods 整合與本地 podspec

您可以透過 [CocoaPods](https://cocoapods.org/)（一個適用於 Swift 和 Objective-C 專案的流行依賴項管理器）從 Kotlin Multiplatform 專案連結 iOS 框架。

此整合方法適用於以下情況：

*   您有一個使用 CocoaPods 的 iOS 專案的單一儲存庫設定
*   您在 Kotlin Multiplatform 專案中匯入 CocoaPods 依賴項

要設定一個包含本地 CocoaPods 依賴項的工作流程，您可以手動編輯腳本。

如需更多資訊，請參閱 [CocoaPods 概覽與設定](multiplatform-cocoapods-overview.md)。

## 遠端整合

對於遠端整合，您的專案可能會使用 Swift Package Manager (SPM) 或 CocoaPods 依賴項管理器來連結來自 Kotlin Multiplatform 專案的 iOS 框架。

### Swift Package Manager 與 XCFrameworks

您可以設定一個使用 XCFrameworks 的 Swift Package Manager (SPM) 依賴項，以連結來自 Kotlin Multiplatform 專案的 iOS 框架。

如需更多資訊，請參閱 [Swift 套件匯出設定](multiplatform-spm-export.md)。

### CocoaPods 整合與 XCFrameworks

您可以使用 Kotlin CocoaPods Gradle 外掛程式建置 XCFrameworks，然後透過 CocoaPods 將專案的共享部分與行動應用程式分開分發。

如需更多資訊，請參閱 [建置最終原生二進位檔](multiplatform-build-native-binaries.md#build-frameworks)。