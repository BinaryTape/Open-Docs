[//]: # (title: Gradle 最佳實踐)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是一個被許多 Kotlin 專案用來自動化和管理建置流程的建置系統。

充分利用 Gradle 對於減少管理和等待建置的時間，並投入更多時間編寫程式碼至關重要。在這裡，我們提供一組最佳實踐，分為兩個關鍵領域：**組織**和**優化**您的專案。

## 組織

本節著重於如何建構您的 Gradle 專案以提高清晰度、可維護性和可擴展性。

### 使用 Kotlin DSL

使用 Kotlin DSL 而非傳統的 Groovy DSL。您可以避免學習另一種語言，並獲得嚴格型別的好處。嚴格型別讓 IDE 能夠提供更好的重構和自動完成支援，使開發更高效。

在 [Gradle 的 Kotlin DSL 入門指南](https://docs.gradle.org/current/userguide/kotlin_dsl.html)中找到更多資訊。

閱讀 Gradle 關於 Kotlin DSL 成為新 Gradle 建置預設設定的[部落格](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)。

### 使用版本目錄

在 `libs.versions.toml` 檔案中使用版本目錄來集中管理依賴項。這讓您能夠在專案中一致地定義和重用版本、函式庫和外掛程式。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

並將以下依賴項新增到您的 `build.gradle.kts` 檔案中：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

在 Gradle 關於[依賴項管理基礎](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)的文檔中了解更多資訊。

### 使用慣例外掛程式

<primary-label ref="advanced"/>

使用慣例外掛程式來封裝並重用多個建置檔案中的常見建置邏輯。將共享配置移到外掛程式中有助於簡化和模組化您的建置腳本。

儘管初始設定可能耗時，但一旦完成，維護和添加新的建置邏輯就會變得容易。

在 Gradle 關於[慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)的文檔中了解更多資訊。

## 優化

本節提供策略以提高 Gradle 建置的效能和效率。

### 使用本地建置快取

使用本地建置快取，透過重用其他建置產生的輸出，以節省時間。建置快取可以從您已建立的任何早期建置中檢索輸出。

在 Gradle 關於其[建置快取](https://docs.gradle.org/current/userguide/build_cache.html)的文檔中了解更多資訊。

### 使用配置快取

> 配置快取尚不支援所有核心 Gradle 外掛程式。有關最新資訊，請參閱 Gradle 的[支援外掛程式表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)。
>
{style="note"}

使用配置快取可以顯著提高建置效能，方法是快取配置階段的結果，並將其重用於後續建置。如果 Gradle 偵測到建置配置或相關依賴項沒有變化，它會跳過配置階段。

在 Gradle 關於其[配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)的文檔中了解更多資訊。

### 改善多目標的建置時間

當您的多平台專案包含多個目標時，諸如 `build` 和 `assemble` 等任務可能會為每個目標多次編譯相同的程式碼，導致編譯時間更長。

如果您正在積極開發和測試特定平台，請改為執行相應的 `linkDebug*` 任務。

有關更多資訊，請參閱[改善編譯時間的提示](native-improving-compilation-time.md#gradle-configuration)。

### 從 kapt 遷移到 KSP

如果您使用的函式庫依賴於 [kapt](kapt.md) 編譯器外掛程式，請檢查是否可以改用 [Kotlin Symbol Processing (KSP) API](ksp-overview.md)。KSP API 透過減少註解處理時間來提高建置效能。KSP 比 kapt 更快、更高效，因為它直接處理原始碼，無需產生中間 Java 存根。

有關遷移步驟的指南，請參閱 Google 的[遷移指南](https://developer.android.com/build/migrate-to-ksp)。

要了解 KSP 與 kapt 的比較，請查看[為什麼選擇 KSP](ksp-why-ksp.md)。

### 使用模組化

<primary-label ref="advanced"/>

> 模組化僅對中到大型專案有益。對於基於微服務架構的專案，它沒有優勢。
>
{style="note"}

使用模組化的專案結構可以提高建置速度並實現更容易的平行開發。將您的專案建構成一個根專案和一個或多個子專案。如果變更僅影響其中一個子專案，Gradle 只會重建該特定子專案。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

在 Gradle 關於[使用 Gradle 建構專案](https://docs.gradle.org/current/userguide/multi_project_builds.html)的文檔中了解更多資訊。

### 設定 CI/CD
<primary-label ref="advanced"/>

設定 CI/CD 流程可以透過使用增量建置和快取依賴項來顯著減少建置時間。新增持久儲存或使用遠端建置快取以實現這些好處。此流程不一定會耗時，因為某些供應商，例如 [GitHub](https://github.com/features/actions)，幾乎開箱即用地提供此服務。

探索 Gradle 社群關於[將 Gradle 與持續整合系統結合使用](https://cookbook.gradle.org/ci/)的實用手冊。

### 使用遠端建置快取
<primary-label ref="advanced"/>

與[本地建置快取](#use-local-build-cache)一樣，遠端建置快取透過重用其他建置的輸出幫助您節省時間。它可以從任何人已經執行過的任何早期建置中檢索任務輸出，而不僅僅是最後一個。

遠端建置快取使用快取伺服器來在建置之間共享任務輸出。例如，在具有 CI/CD 伺服器的開發環境中，伺服器上的所有建置都會填充遠端快取。當您簽出主分支以啟動新功能時，您可以立即存取增量建置。

請記住，網路連線緩慢可能會導致傳輸快取結果比本地執行任務更慢。

在 Gradle 關於其[建置快取](https://docs.gradle.org/current/userguide/build_cache.html)的文檔中了解更多資訊。