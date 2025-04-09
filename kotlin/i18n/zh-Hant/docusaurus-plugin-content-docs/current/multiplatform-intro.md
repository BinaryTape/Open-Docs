---
title: "Kotlin Multiplatform 簡介"
---
Kotlin 的主要優勢之一是支援多平台程式設計（Multiplatform programming）。它減少了為[不同平台](multiplatform-dsl-reference#targets)編寫和維護相同程式碼的時間，同時保留了原生程式設計的靈活性和優勢。

<img src="/img/kotlin-multiplatform.svg" alt="Kotlin Multiplatform" width="700" style={{verticalAlign: 'middle'}}/>

## 學習主要概念

Kotlin Multiplatform 允許你在不同平台（無論是行動裝置、Web 或桌面）之間共享程式碼。程式碼編譯到的平台由 _targets_ 列表定義。

每個 target 都有一個對應的 *source set*，它代表一組具有自己依賴關係和編譯器選項的原始檔。特定於平台的 source set，例如 JVM 的 `jvmMain`，可以使用特定於平台的函式庫和 API。

為了在 targets 的子集之間共享程式碼，可以使用中間 source set。例如，`appleMain` source set 代表所有 Apple 平台之間共享的程式碼。在所有平台之間共享並編譯到所有宣告 targets 的程式碼都有自己的 source set `commonMain`。它不能使用特定於平台的 API，但可以利用多平台函式庫。

當為特定 target 編譯時，Kotlin 會組合 common source set、相關的中間 source set 和特定於 target 的 source set。

有關此主題的更多詳細資訊，請參閱：

* [Kotlin Multiplatform 專案結構的基礎知識](multiplatform-discover-project)
* [多平台專案結構的進階概念](multiplatform-advanced-project-structure)

## 使用程式碼共享機制

有時在相似的 targets 子集之間共享程式碼更方便。Kotlin Multiplatform 提供了一種方法，可以使用*預設層次結構範本（default hierarchy template）*簡化它們的建立。它包括一個基於你在專案中指定的 targets 建立的預定義的中間 source set 列表。

若要從共享程式碼存取特定於平台的 API，你可以使用另一種 Kotlin 機制，*預期和實際宣告（expected and actual declarations）*。這樣，你可以宣告在通用程式碼中 `expect` 特定於平台的 API，但為每個 target 平台提供單獨的 `actual` 實現。你可以將此機制與不同的 Kotlin 概念一起使用，包括函數、類別和介面。例如，你可以在通用程式碼中定義一個函數，但使用相應 source set 中特定於平台的函式庫來提供其實現。

有關此主題的更多詳細資訊，請參閱：

* [在平台上共享程式碼](multiplatform-share-on-on platforms)
* [預期和實際宣告](multiplatform-expect-actual)
* [分層專案結構](multiplatform-hierarchy)

## 新增依賴項

Kotlin Multiplatform 專案可以依賴外部函式庫和其他多平台專案。對於通用程式碼，你可以在 common source set 中新增對多平台函式庫的依賴項。Kotlin 會自動解析並將適當的特定於平台的部分新增到其他 source set。如果只需要特定於平台的 API，請將依賴項新增到相應的 source set。

將特定於 Android 的依賴項新增到 Kotlin Multiplatform 專案與在純 Android 專案中新增它們類似。使用特定於 iOS 的依賴項時，你可以無縫整合 Apple SDK 框架，而無需額外配置。對於外部函式庫和框架，Kotlin 提供與 Objective-C 和 Swift 的互操作性。

有關此主題的更多詳細資訊，請參閱：

* [新增對多平台函式庫的依賴項](multiplatform-add-dependencies)
* [新增對 Android 函式庫的依賴項](multiplatform-android-dependencies)
* [新增對 iOS 函式庫的依賴項](multiplatform-ios-dependencies)

## 設定與 iOS 的整合

如果你的多平台專案以 iOS 為目標，你可以設定 Kotlin Multiplatform 共享模組與你的 iOS 應用程式的整合。

為此，你產生一個 iOS 框架，然後將其作為本地或遠端依賴項新增到 iOS 專案：

* **本地整合（Local integration）**：使用特殊腳本直接連接你的多平台專案和 Xcode 專案，或者使用 CocoaPods 依賴項管理器來設定涉及本地 Pod 依賴項的設定。
* **遠端整合（Remote integration）**：使用 XCFramework 設定 SPM 依賴項，或透過 CocoaPods 分發共享模組。

有關此主題的更多詳細資訊，請參閱[iOS 整合方法](multiplatform-ios-integration-overview)。

## 配置編譯（Configure compilations）

每個 target 可以有多個用於不同目的的編譯，通常用於生產或測試，但你也可以定義自定義編譯。

使用 Kotlin Multiplatform，你可以配置專案中的所有編譯，在 target 中設定特定編譯，甚至建立單獨的編譯。配置編譯時，你可以修改編譯器選項、管理依賴項或配置與原生語言的互操作性。

有關此主題的更多詳細資訊，請參閱[配置編譯](multiplatform-configure-compilations)。

## 建置最終二進位檔（Build final binaries）

預設情況下，target 會編譯為 `.klib` 構件，Kotlin/Native 本身可以將其作為依賴項使用，但不能執行或用作原生函式庫。但是，Kotlin Multiplatform 提供了其他機制來建置最終原生二進位檔。

你可以建立可執行二進位檔、共享和靜態函式庫或 Objective-C 框架，每個都可針對不同的建置類型進行配置。Kotlin 還提供了一種建置通用（fat）框架和用於 iOS 整合的 XCFramework 的方法。

有關此主題的更多詳細資訊，請參閱[建置原生二進位檔](multiplatform-build-native-binaries)。

## 建立多平台函式庫

你可以建立一個多平台函式庫，其中包含通用程式碼及其針對 JVM、Web 和原生平台的特定於平台的實現。

發布 Kotlin Multiplatform 函式庫涉及 Gradle 建置腳本中的特定配置。你可以使用 Maven 儲存庫和 `maven-publish` 外掛程式進行發布。發布後，多平台函式庫可以用作其他跨平台專案中的依賴項。

有關此主題的更多詳細資訊，請參閱[發布多平台函式庫](multiplatform-publish-lib)。

## 參考

* [Kotlin Multiplatform Gradle 外掛程式的 DSL 參考](multiplatform-dsl-reference)
* [Kotlin Multiplatform 的相容性指南](multiplatform-compatibility-guide)