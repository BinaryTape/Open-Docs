[//]: # (title: Kotlin Multiplatform 介紹)

Kotlin 對多平台程式設計的支援是其主要優勢之一。它能減少編寫和維護針對[不同平台](multiplatform-dsl-reference.md#targets)相同程式碼的時間，同時保留原生程式設計的靈活性和優勢。

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 學習關鍵概念

Kotlin Multiplatform 允許您在不同平台（無論是行動裝置、網頁或桌面）之間共享程式碼。程式碼所編譯的平台由 _targets_ 列表定義。

每個 target 都會對應一個 *source set*，它代表一組具有其自身依賴項和編譯器選項的原始碼檔案。平台專屬的原始碼集，例如 JVM 的 `jvmMain`，可以使用平台專屬的函式庫和 API。

為了在 targets 子集之間共享程式碼，會使用中間原始碼集。例如，`appleMain` 原始碼集代表在所有 Apple 平台之間共享的程式碼。在所有平台之間共享並編譯到所有已宣告 target 的程式碼具有其自身的原始碼集 `commonMain`。它不能使用平台專屬的 API，但可以利用多平台函式庫。

為特定 target 進行編譯時，Kotlin 會結合通用原始碼集、相關的中間原始碼集以及 target 專屬的原始碼集。

有關此主題的更多詳細資訊，請參閱：

*   [Kotlin Multiplatform 專案結構基礎](multiplatform-discover-project.md)
*   [多平台專案結構進階概念](multiplatform-advanced-project-structure.md)

## 使用程式碼共享機制

有時，在相似 target 的子集之間共享程式碼會更方便。Kotlin Multiplatform 提供了一種透過 *default hierarchy template* 簡化其建立的方式。它包含一個預定義的中間原始碼集列表，這些原始碼集是根據您在專案中指定的 target 建立的。

若要從共享程式碼存取平台專屬的 API，您可以使用另一種 Kotlin 機制：*expected and actual declarations*。透過這種方式，您可以在通用程式碼中宣告 `expect` 一個平台專屬的 API，但為每個目標平台提供單獨的 `actual` 實作。您可以將此機制與不同的 Kotlin 概念一起使用，包括函式、類別和介面。例如，您可以在通用程式碼中定義一個函式，但使用對應原始碼集中的平台專屬函式庫提供其實作。

有關此主題的更多詳細資訊，請參閱：

*   [在平台上共享程式碼](multiplatform-share-on-platforms.md)
*   [預期與實際宣告](multiplatform-expect-actual.md)
*   [階層式專案結構](multiplatform-hierarchy.md)

## 新增依賴項

Kotlin Multiplatform 專案可以依賴外部函式庫和其他多平台專案。對於通用程式碼，您可以在通用原始碼集中新增多平台函式庫的依賴項。Kotlin 會自動解析並將適當的平台專屬部分新增到其他原始碼集。如果只需要平台專屬的 API，請將依賴項新增到對應的原始碼集。

將 Android 專屬依賴項新增到 Kotlin Multiplatform 專案與在純 Android 專案中新增它們類似。當使用 iOS 專屬依賴項時，您可以無縫整合 Apple SDK 框架，無需額外配置。對於外部函式庫和框架，Kotlin 提供了與 Objective-C 和 Swift 的互通性。

有關此主題的更多詳細資訊，請參閱：

*   [新增多平台函式庫依賴項](multiplatform-add-dependencies.md)
*   [新增 Android 函式庫依賴項](multiplatform-android-dependencies.md)
*   [新增 iOS 函式庫依賴項](multiplatform-ios-dependencies.md)

## 設定與 iOS 的整合

如果您的多平台專案目標為 iOS，您可以設定 Kotlin Multiplatform 共享模組與您的 iOS 應用程式的整合。

為此，您需要產生一個 iOS 框架，然後將其作為本機或遠端依賴項新增到 iOS 專案中：

*   **本機整合**：透過特殊腳本直接連接您的多平台專案和 Xcode 專案，或使用 CocoaPods 依賴項管理器來設定涉及本機 Pod 依賴項的環境。
*   **遠端整合**：使用 XCFrameworks 設定 SPM 依賴項，或透過 CocoaPods 分發共享模組。

有關此主題的更多詳細資訊，請參閱 [iOS 整合方法](multiplatform-ios-integration-overview.md)。

## 配置編譯

每個 target 都可以有多個不同目的的編譯，通常用於生產或測試，但您也可以定義自訂編譯。

透過 Kotlin Multiplatform，您可以配置專案中的所有編譯，在 target 內設定特定編譯，甚至建立個別編譯。在配置編譯時，您可以修改編譯器選項、管理依賴項或配置與原生語言的互通性。

有關此主題的更多詳細資訊，請參閱 [配置編譯](multiplatform-configure-compilations.md)。

## 建構最終二進位檔

預設情況下，target 會編譯成一個 `.klib` 成品，該成品可由 Kotlin/Native 本身作為依賴項消耗，但不能作為原生函式庫執行或使用。然而，Kotlin Multiplatform 提供了額外機制來建構最終原生二進位檔。

您可以建立可執行二進位檔、共享和靜態函式庫或 Objective-C 框架，每個都可以針對不同的建構類型進行配置。Kotlin 還提供了一種方式來為 iOS 整合建構通用 (fat) 框架和 XCFrameworks。

有關此主題的更多詳細資訊，請參閱 [建構原生二進位檔](multiplatform-build-native-binaries.md)。

## 建立多平台函式庫

您可以建立一個多平台函式庫，其中包含通用程式碼及其針對 JVM、網頁和原生平台的平台專屬實作。

發佈 Kotlin Multiplatform 函式庫涉及在您的 Gradle 建構腳本中進行特定配置。您可以使用 Maven 儲存庫和 `maven-publish` 外掛程式進行發佈。一旦發佈，多平台函式庫就可以作為依賴項在其他跨平台專案中使用。

有關此主題的更多詳細資訊，請參閱 [發佈多平台函式庫](multiplatform-publish-lib-setup.md)。

## 參考資料

*   [Kotlin Multiplatform Gradle 外掛程式的 DSL 參考](multiplatform-dsl-reference.md)
*   [Kotlin Multiplatform 相容性指南](multiplatform-compatibility-guide.md)