[//]: # (title: Gradle 最佳實踐)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是一個許多 Kotlin 專案用來自動化並管理構建過程的構建系統。

充分利用 Gradle 對於幫助您減少管理和等待構建的時間，並投入更多時間編碼至關重要。在這裡，我們提供了一套最佳實踐，分為兩個關鍵領域：**組織**和**優化**您的專案。

## 組織

本節重點介紹如何構建您的 Gradle 專案以提高清晰度、可維護性和可擴展性。

### 使用 Kotlin DSL

使用 Kotlin DSL 而非傳統的 Groovy DSL。您可以避免學習另一種語言，並獲得嚴格類型檢查的好處。嚴格類型檢查讓 IDE 能夠為重構和自動完成提供更好的支援，從而提高開發效率。

在 [Gradle 的 Kotlin DSL 入門](https://docs.gradle.org/current/userguide/kotlin_dsl.html)中找到更多資訊。

閱讀 Gradle 關於 Kotlin DSL 成為新 Gradle 構建預設值的[部落格](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)。

### 使用版本目錄

在 `libs.versions.toml` 檔案中使用版本目錄來集中管理依賴項。這讓您能夠在專案中一致地定義和重複使用版本、函式庫和外掛程式。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

並在您的 `build.gradle.kts` 檔案中添加以下依賴項：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

在 Gradle 關於[依賴管理基礎](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)的文檔中了解更多。

### 使用慣例外掛程式

<primary-label ref="advanced"/>

使用慣例外掛程式來封裝和重用多個構建檔案中的常見構建邏輯。將共享配置移到外掛程式中有助於簡化和模組化您的構建腳本。

儘管初始設定可能耗時，但一旦完成，維護和添加新的構建邏輯將變得容易。

在 Gradle 關於[慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)的文檔中了解更多。

## 優化

本節提供了增強 Gradle 構建性能和效率的策略。

### 使用本地構建快取

使用本地構建快取通過重用其他構建生成的輸出以節省時間。構建快取可以從您已經創建的任何早期構建中檢索輸出。

在 Gradle 關於其[構建快取](https://docs.gradle.org/current/userguide/build_cache.html)的文檔中了解更多。

### 使用配置快取

> 配置快取尚不支持所有核心 Gradle 外掛程式。有關最新資訊，請參閱 Gradle 的[支援外掛程式列表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)。
>
{style="note"}

使用配置快取通過快取配置階段的結果並在後續構建中重複使用它來顯著提高構建性能。如果 Gradle 檢測到構建配置或相關依賴項沒有變化，它會跳過配置階段。

在 Gradle 關於其[配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)的文檔中了解更多。

### 縮短多目標構建時間

當您的多平台專案包含多個目標時，像 `build` 和 `assemble` 這樣的任務可能會為每個目標多次編譯相同的程式碼，導致編譯時間更長。

如果您正在積極開發和測試特定平台，請改為運行相應的 `linkDebug*` 任務。

有關更多資訊，請參閱[提高編譯時間的提示](native-improving-compilation-time.md#gradle-configuration)。

### 從 kapt 遷移到 KSP

如果您正在使用依賴於 [kapt](kapt.md) 編譯器外掛程式的函式庫，請檢查您是否可以改為使用 [Kotlin Symbol Processing (KSP) API](ksp-overview.md)。KSP API 通過減少註解處理時間來提高構建性能。KSP 比 kapt 更快、更高效，因為它直接處理原始碼而無需生成中間 Java 存根。

有關遷移步驟的指導，請參閱 Google 的[遷移指南](https://developer.android.com/build/migrate-to-ksp)。

要了解更多關於 KSP 與 kapt 的比較，請查看[為何選擇 KSP](ksp-why-ksp.md)。

### 使用模組化

<primary-label ref="advanced"/>

> 模組化僅對中大型專案有利。它對基於微服務架構的專案沒有優勢。
>
{style="note"}

使用模組化的專案結構來提高構建速度並實現更輕鬆的平行開發。將您的專案結構化為一個根專案和一個或多個子專案。如果更改僅影響其中一個子專案，Gradle 只會重新構建該特定子專案。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

在 Gradle 關於[使用 Gradle 構建專案](https://docs.gradle.org/current/userguide/multi_project_builds.html)的文檔中了解更多。

### 設定 CI/CD
<primary-label ref="advanced"/>

設定 CI/CD 過程可以通過使用增量構建和快取依賴項來顯著減少構建時間。添加持久化儲存或使用遠端構建快取可以讓您看到這些好處。這個過程不一定耗時，因為一些提供商，例如 [GitHub](https://github.com/features/actions)，幾乎是開箱即用地提供此服務。

探索 Gradle 社區烹飪書中關於[將 Gradle 與持續整合系統結合使用](https://cookbook.gradle.org/ci/)的內容。

### 使用遠端構建快取
<primary-label ref="advanced"/>

與[本地構建快取](#use-local-build-cache)一樣，遠端構建快取通過重用其他構建的輸出幫助您節省時間。它可以從任何已運行過的構建中檢索任務輸出，而不僅僅是上一個構建。

遠端構建快取使用快取伺服器在構建之間共享任務輸出。例如，在一個帶有 CI/CD 伺服器的開發環境中，伺服器上的所有構建都會填充遠端快取。當您簽出主分支以開始新功能時，您可以立即訪問增量構建。

請記住，緩慢的網路連接可能會使傳輸快取結果比本地運行任務更慢。

在 Gradle 關於其[構建快取](https://docs.gradle.org/current/userguide/build_cache.html)的文檔中了解更多。