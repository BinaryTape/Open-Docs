[//]: # (title: Gradle 最佳實務)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是許多 Kotlin 專案用於自動化和管理組建程序的建構系統。

充分發揮 Gradle 的優勢至關重要，這能幫助您減少管理和等待組建的時間，並將更多時間投入到編碼中。在此，我們提供了一套最佳實務，分為兩個關鍵領域：**組織**與**優化**您的專案。

## 組織

本節重點在於建構您的 Gradle 專案，以提高清晰度、可維護性和擴充性。

### 使用 Kotlin DSL

使用 Kotlin DSL 而不是傳統的 Groovy DSL。您可以避免學習另一門語言，並獲得強型別的好處。強型別讓 IDE 能為重構與自動補全提供更好的支援，使開發更有效率。

在 [Gradle 的 Kotlin DSL 入門指南](https://docs.gradle.org/current/userguide/kotlin_dsl.html)中尋找更多資訊。

閱讀 Gradle 關於 Kotlin DSL 成為 Gradle 組建預設選項的[部落格文章](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)。

### 使用版本目錄

在 `libs.versions.toml` 檔案中使用版本目錄（version catalog）來集中管理相依性。這讓您能夠在多個專案中一致地定義和重用版本、程式庫和外掛程式。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

並在您的 `build.gradle.kts` 檔案中加入以下相依性：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

在 Gradle 關於[相依性管理基礎](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)的文件中了解更多資訊。

### 使用慣例外掛程式

<primary-label ref="advanced"/>

使用慣例外掛程式來封裝並在多個組建檔案中重用通用的建構邏輯。將共享配置移至外掛程式中有助於簡化您的建構指令碼並使其模組化。

雖然初始設定可能較為耗時，但一旦完成，維護和新增建構邏輯就會變得很容易。

在 Gradle 關於[慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)的文件中了解更多資訊。

## 優化

本節提供了增強 Gradle 組建效能與效率的策略。

### 使用本機組建快取

使用本機組建快取，透過重用其他組建產生的輸出來節省時間。組建快取可以檢索您之前已建立的任何早期組建的輸出。

在 Gradle 關於[組建快取](https://docs.gradle.org/current/userguide/build_cache.html)的文件中了解更多資訊。

### 使用配置快取

> 配置快取尚未支援所有核心 Gradle 外掛程式。如需最新資訊，請參閱 Gradle 的[支援外掛程式列表](https://docs.gradle.org/current/userguide/configuration_cache_status.html#config_cache:plugins:core)。
>
{style="note"}

使用配置快取，透過快取配置階段的結果並在後續組建中重用它，可以顯著提高組建效能。如果 Gradle 偵測到組建組態或相關相依性沒有變化，它將跳過配置階段。

配置快取還能在單一專案中並行執行獨立任務，這可以進一步提升組建效能。此外，它會隱含地啟用 `org.gradle.parallel` 屬性，允許不同專案之間的任務[並行執行](https://docs.gradle.org/current/userguide/performance.html#sec:enable_parallel_execution)。

在 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html)中進一步了解配置快取。

### 改善多目標的組建時間

當您的多平台專案包含多個目標時，像是 `build` 和 `assemble` 等任務可能會針對每個目標多次編譯相同的程式碼，導致編譯時間變長。

如果您正積極開發和測試特定平台，請改為執行相應的 `linkDebug*` 任務。

如需更多資訊，請參閱[改善編譯時間的提示](native-improving-compilation-time.md#gradle-configuration)。

### 從 kapt 遷移至 KSP

如果您使用的程式庫依賴於 [kapt](kapt.md) 編譯器外掛程式，請檢查是否可以改為使用 [Kotlin Symbol Processing (KSP) API](ksp-overview.md)。KSP API 透過減少註解處理時間來提高組建效能。KSP 比 kapt 更快且更有效率，因為它直接處理原始碼，而不需要產生中間的 Java 虛設常式。

如需遷移步驟的指導，請參閱 Google 的[遷移指南](https://developer.android.com/build/migrate-to-ksp)。

若要進一步了解 KSP 與 kapt 的比較，請查看[為什麼選擇 KSP](ksp-why-ksp.md)。

### 使用模組化

<primary-label ref="advanced"/>

> 模組化僅對中大型專案有益。對於基於微服務架構的專案，它不會提供明顯優勢。
>
{style="note"}

使用模組化的專案結構來提高組建速度並實現更輕鬆的並行開發。將您的專案結構化為一個根專案和一個或多個子專案。如果變更僅影響其中一個子專案，Gradle 只會重新組建該特定子專案。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

在 Gradle 關於[使用 Gradle 建構專案結構](https://docs.gradle.org/current/userguide/multi_project_builds.html)的文件中了解更多資訊。

### 設定 CI/CD
<primary-label ref="advanced"/>

藉由使用增量組建和快取相依性，設定 CI/CD 流程可以顯著減少組建時間。加入持久化存儲或使用遠端組建快取來獲得這些好處。這個過程不一定很耗時，因為某些供應商（如 [GitHub](https://github.com/features/actions)）幾乎提供了開箱即用的服務。

探索 Gradle 的社群指南：[在持續整合系統中使用 Gradle](https://cookbook.gradle.org/ci/)。

### 使用遠端組建快取
<primary-label ref="advanced"/>

與[本機組建快取](#use-local-build-cache)類似，遠端組建快取透過重用其他組建的輸出來幫助您節省時間。它可以檢索任何人已經執行過的任何早期組建的任務輸出，而不僅僅是最後一次。

遠端組建快取使用快取伺服器在不同組建之間共享任務輸出。例如，在具有 CI/CD 伺服器的開發環境中，伺服器上的所有組建都會填入遠端快取。當您檢出主分支以開始新功能時，您可以立即存取增量組建。

請記住，緩慢的網路連線可能會使得傳輸快取結果比在本機執行任務更慢。

在 Gradle 關於[組建快取](https://docs.gradle.org/current/userguide/build_cache.html)的文件中了解更多資訊。