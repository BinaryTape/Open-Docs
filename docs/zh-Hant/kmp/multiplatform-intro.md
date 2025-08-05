[//]: # (title: Kotlin Multiplatform 介紹)

Kotlin 對多平台程式設計的支援是其主要優勢之一。它減少了為 [不同平台](multiplatform-dsl-reference.md#targets) 編寫和維護相同程式碼所需的時間，同時保留了原生程式設計的靈活性和優勢。

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 學習關鍵概念

Kotlin Multiplatform 允許您在不同平台（無論是行動裝置、網頁還是桌面）之間共用程式碼。程式碼編譯到的平台由 _targets_ 列表定義。

每個 target 都有一個相對應的 *source set*，它代表了一組具有自己依賴項和編譯器選項的原始碼檔案。平台特定的 source set，例如 JVM 的 `jvmMain`，可以使用平台特定的函式庫和 API。

為了在 target 的子集中共用程式碼，會使用 *intermediate source sets*。例如，`appleMain` source set 代表在所有 Apple 平台之間共用的程式碼。在所有平台之間共用並編譯到所有宣告的 target 的程式碼有它自己的 source set，即 `commonMain`。它不能使用平台特定的 API，但可以利用多平台函式庫。

當為特定 target 編譯時，Kotlin 會結合 common source set、相關的 intermediate source sets 和 target 專用的 source set。

欲了解更多相關資訊，請參閱：

* [Kotlin Multiplatform 專案結構的基礎](multiplatform-discover-project.md)
* [多平台專案結構的進階概念](multiplatform-advanced-project-structure.md)

## 使用程式碼共用機制

有時在類似 target 的子集之間共用程式碼會更方便。Kotlin Multiplatform 提供了一種透過 *default hierarchy template* 來簡化其建立的方式。它包含一個預先定義的 intermediate source set 列表，這些 source set 是根據您在專案中指定的 target 建立的。

若要從共用程式碼中存取平台特定的 API，您可以使用另一種 Kotlin 機制，即 *expected and actual declarations*。這樣，您可以在 common code 中宣告您 `expect` 某個平台特定的 API，但為每個 target 平台提供單獨的 `actual` 實作。您可以使用此機制與不同的 Kotlin 概念一起使用，包括函式、類別和介面。例如，您可以在 common code 中定義一個函式，但使用平台特定的函式庫在相應的 source set 中提供其實作。

欲了解更多相關資訊，請參閱：

* [在平台上共用程式碼](multiplatform-share-on-platforms.md)
* [Expected 和 actual 宣告](multiplatform-expect-actual.md)
* [階層式專案結構](multiplatform-hierarchy.md)

## 新增依賴項

Kotlin Multiplatform 專案可以依賴於外部函式庫和其他多平台專案。對於 common code，您可以在 common source set 中新增對多平台函式庫的依賴項。Kotlin 會自動解析並將適當的平台特定部分新增到其他 source set 中。如果只需要平台特定的 API，則將依賴項新增到相應的 source set。

將 Android 專用的依賴項新增到 Kotlin Multiplatform 專案中，與將其新增到純 Android 專案中類似。當處理 iOS 專用的依賴項時，您可以無縫整合 Apple SDK 框架，無需額外配置。對於外部函式庫和框架，Kotlin 提供了與 Objective-C 和 Swift 的互通性。

欲了解更多相關資訊，請參閱：

* [新增對多平台函式庫的依賴項](multiplatform-add-dependencies.md)
* [新增對 Android 函式庫的依賴項](multiplatform-android-dependencies.md)
* [新增對 iOS 函式庫的依賴項](multiplatform-ios-dependencies.md)

## 設定與 iOS 的整合

如果您的多平台專案目標是 iOS，您可以設定 Kotlin Multiplatform 共用模組與您的 iOS 應用程式的整合。

為此，您需要產生一個 iOS 框架，然後將其作為本地或遠端依賴項新增到 iOS 專案中：

*   **本地整合**：透過特殊腳本直接連接您的多平台和 Xcode 專案，或在使用本地 Pod 依賴項的設定中使用 CocoaPods 依賴項管理器。
*   **遠端整合**：使用 XCFrameworks 設定 SPM 依賴項，或透過 CocoaPods 分發共用模組。

欲了解更多相關資訊，請參閱 [iOS 整合方法](multiplatform-ios-integration-overview.md)。

## 設定編譯

每個 target 可以有多個編譯，用於不同目的，通常是生產或測試，但您也可以定義自訂編譯。

透過 Kotlin Multiplatform，您可以配置專案中的所有編譯，在 target 內部設定特定編譯，甚至建立個別編譯。配置編譯時，您可以修改編譯器選項、管理依賴項或配置與原生語言的互通性。

欲了解更多相關資訊，請參閱 [設定編譯](multiplatform-configure-compilations.md)。

## 建構最終二進位檔

預設情況下，target 會被編譯為 `.klib` artifact，它可以被 Kotlin/Native 本身作為依賴項使用，但不能執行或用作原生函式庫。然而，Kotlin Multiplatform 提供了額外的機制來建構最終的原生二進位檔。

您可以建立可執行二進位檔、共用函式庫和靜態函式庫，或 Objective-C 框架，每個都可以為不同的建構類型進行配置。Kotlin 也提供了一種為 iOS 整合建構通用（fat）框架和 XCFrameworks 的方式。

欲了解更多相關資訊，請參閱 [建構原生二進位檔](multiplatform-build-native-binaries.md)。

## 建立多平台函式庫

您可以建立一個包含 common code 及其適用於 JVM、網頁和原生平台的平台特定實作的多平台函式庫。

發佈 Kotlin Multiplatform 函式庫需要在您的 Gradle 建構腳本中進行特定配置。您可以使用 Maven 儲存庫和 `maven-publish` 外掛程式進行發佈。發佈後，多平台函式庫可以在其他跨平台專案中作為依賴項使用。

欲了解更多相關資訊，請參閱 [發佈多平台函式庫](multiplatform-publish-lib-setup.md)。

## 參考資料

* [Kotlin Multiplatform Gradle 外掛程式的 DSL 參考](multiplatform-dsl-reference.md)
* [Kotlin Multiplatform 相容性指南](multiplatform-compatibility-guide.md)