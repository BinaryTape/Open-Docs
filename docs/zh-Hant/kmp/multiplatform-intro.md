[//]: # (title: Kotlin Multiplatform 簡介)

支援多平台程式設計是 Kotlin 的核心優勢之一。它減少了為[不同平台](multiplatform-dsl-reference.md#targets)編寫和維護相同程式碼的時間，同時保留了原生程式設計的靈活性和優點。

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 學習核心概念

Kotlin Multiplatform 讓你可以在不同平台之間共享程式碼，無論是行動裝置、Web 還是桌面端。程式碼編譯到的平台是由目標 (targets) 清單定義的。

每個目標都有對應的*原始碼集*，代表一組具有自己相依性和編譯器選項的原始檔。平台特定原始碼集（例如 JVM 的 `jvmMain`）可以使用平台特定的程式庫和 API。

為了在目標子集之間共享程式碼，會使用中間原始碼集。例如，`appleMain` 原始碼集代表在所有 Apple 平台之間共享的程式碼。在所有平台之間共享並編譯到所有宣告目標的程式碼有其自己的原始碼集 `commonMain`。它不能使用平台特定的 API，但可以利用多平台程式庫。

當為特定目標編譯時，Kotlin 會結合共通原始碼集、相關的中間原始碼集以及目標特定的原始碼集。

有關此主題的更多詳細資訊，請參閱：

* [Kotlin Multiplatform 專案結構基礎](multiplatform-discover-project.md)
* [多平台專案結構的高級概念](multiplatform-advanced-project-structure.md)

## 使用程式碼共享機制

有時在相似目標的子集之間共享程式碼會更方便。Kotlin Multiplatform 提供了一種透過*預設階層樣板*來簡化其建立的方法。它包含一個預先定義的中間原始碼集清單，這些原始碼集是根據你在專案中指定的目標建立的。

若要從共享程式碼存取平台特定的 API，你可以使用另一種 Kotlin 機制：*預期宣告與實際宣告*。透過這種方式，你可以宣告在共通程式碼中 `expect` 一個平台特定的 API，但為每個目標平台提供個別的 `actual` 實作。你可以將此機制與不同的 Kotlin 概念結合使用，包括函式、類別和介面。例如，你可以在共通程式碼中定義一個函式，但在對應的原始碼集中使用平台特定的程式庫提供其實作。

有關此主題的更多詳細資訊，請參閱：

* [在平台間共享程式碼](multiplatform-share-on-platforms.md)
* [預期宣告與實際宣告](multiplatform-expect-actual.md)
* [階層式專案結構](multiplatform-hierarchy.md)

## 新增相依性

Kotlin Multiplatform 專案可以依賴外部程式庫和其他多平台專案。對於共通程式碼，你可以在共通原始碼集中新增對多平台程式庫的相依性。Kotlin 會自動解析並將適當的平台特定部分新增到其他原始碼集中。如果只需要平台特定的 API，請將相依性新增到對應的原始碼集中。

在 Kotlin Multiplatform 專案中新增 Android 特定的相依性，與在純 Android 專案中新增它們類似。當處理 iOS 特定的相依性時，你可以無縫整合 Apple SDK 框架，無需額外配置。對於外部程式庫和框架，Kotlin 提供了與 Objective-C 和 Swift 的互通性。

有關此主題的更多詳細資訊，請參閱：

* [新增多平台程式庫的相依性](multiplatform-add-dependencies.md)
* [新增 Android 程式庫的相依性](multiplatform-android-dependencies.md)
* [新增 iOS 程式庫的相依性](multiplatform-ios-dependencies.md)

## 設定與 iOS 的整合

如果你的多平台專案目標是 iOS，你可以設定 Kotlin Multiplatform 共享模組與你的 iOS 應用程式的整合。

為此，你需要產生一個 iOS 框架，然後將其作為本機或遠端相依性新增到 iOS 專案中：

* **本機整合**：使用特殊指令碼直接連接你的多平台和 Xcode 專案，或使用 CocoaPods 封裝管理員進行涉及本機 Pod 相依性的設定。
* **遠端整合**：使用 XCFrameworks 設定 SPM 相依性，或透過 CocoaPods 發佈共享模組。

有關此主題的更多詳細資訊，請參閱 [iOS 整合方法](multiplatform-ios-integration-overview.md)。

## 配置編譯

每個目標可以有多個用於不同用途的編譯，通常用於生產或測試，但你也可以定義自訂編譯。

使用 Kotlin Multiplatform，你可以配置專案中的所有編譯、在目標內設定特定編譯，甚至建立個別的編譯。在配置編譯時，你可以修改編譯器選項、管理相依性或配置與原生語言的互通性。

有關此主題的更多詳細資訊，請參閱[配置編譯](multiplatform-configure-compilations.md)。

## 組建最終二進制檔

預設情況下，目標會編譯為 `.klib` 構件，它可以被 Kotlin/Native 本身作為相依性使用，但不能被執行或作為原生程式庫使用。然而，Kotlin Multiplatform 提供了額外的機制來組建最終的原生二進制檔。

你可以建立可執行二進制檔、共享與靜態程式庫或 Objective-C 框架，每個都可以針對不同的組建類型進行配置。Kotlin 還提供了一種組建用於 iOS 整合的通用 (fat) 框架和 XCFrameworks 的方法。

有關此主題的更多詳細資訊，請參閱[組建原生二進制檔](multiplatform-build-native-binaries.md)。

## 建立多平台程式庫

你可以建立一個包含共通程式碼及其針對 JVM、Web 和原生平台之特定實作的多平台程式庫。

發佈 Kotlin Multiplatform 程式庫涉及在你的 Gradle 組建指令碼中進行特定配置。你可以使用 Maven 儲存庫和 `maven-publish` 外掛程式進行發佈。一旦發佈，多平台程式庫就可以作為相依性在其他跨平台專案中使用。

有關此主題的更多詳細資訊，請參閱[發佈多平台程式庫](multiplatform-publish-lib-setup.md)。

## 參考

* [Kotlin Multiplatform Gradle 外掛程式的 DSL 參考](multiplatform-dsl-reference.md)
* [Kotlin Multiplatform 相容性指南](multiplatform-compatibility-guide.md)