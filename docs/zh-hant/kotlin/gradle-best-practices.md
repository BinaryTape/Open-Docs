---
title: "Gradle 最佳實踐"
---
[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是一個構建系統，許多 Kotlin 專案使用它來自動化和管理構建過程。

充分利用 Gradle 至關重要，它可以幫助您減少管理和等待構建的時間，並將更多時間花在編碼上。在這裡，我們提供了一系列最佳實踐，分為兩個主要領域：**組織 (organizing)** 和 **最佳化 (optimizing)** 您的專案。

## 組織 (Organize)

本節重點介紹如何構建 Gradle 專案，以提高清晰度、可維護性和可擴展性。

### 使用 Kotlin DSL

使用 Kotlin DSL 而不是傳統的 Groovy DSL。您可以避免學習另一種語言，並獲得強型別的好處。強型別讓 IDE 可以更好地支援重構和自動完成，從而提高開發效率。

在 [Gradle 的 Kotlin DSL 入門](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 中找到更多資訊。

閱讀 Gradle 關於 Kotlin DSL 成為 Gradle 構建預設設定的 [部落格](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)。

### 使用版本目錄 (version catalog)

在 `libs.versions.toml` 檔案中使用版本目錄 (version catalog) 來集中依賴管理。這使您能夠跨專案一致地定義和重複使用版本、程式庫和外掛程式 (plugins)。

```kotlin
[versions]
kotlinxCoroutines = "1.10.1"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

將以下依賴新增到您的 `build.gradle.kts` 檔案中：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

在 Gradle 的 [依賴管理基礎知識](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog) 文件中了解更多資訊。

### 使用慣例外掛程式 (convention plugins)

使用慣例外掛程式 (convention plugins) 來封裝和重複使用多個構建檔案中的常見構建邏輯。將共用組態移動到外掛程式中有助於簡化和模組化您的構建腳本。

雖然初始設定可能比較耗時，但完成後，維護和新增新的構建邏輯會很容易。

在 Gradle 的 [慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins) 文件中了解更多資訊。

## 最佳化 (Optimize)

本節提供了一些策略來提高 Gradle 構建的效能和效率。

### 使用本地構建快取 (local build cache)

使用本地構建快取 (local build cache) 通過重複使用其他構建產生的輸出，從而節省時間。構建快取可以從您之前建立的任何構建中檢索輸出。

在 Gradle 的 [構建快取](https://docs.gradle.org/current/userguide/build_cache.html) 文件中了解更多資訊。

### 使用組態快取 (configuration cache)

:::note
組態快取 (configuration cache) 尚不支援所有核心 Gradle 外掛程式 (plugins)。 有關最新資訊，請參閱 Gradle 的
[支援的外掛程式表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)。

:::

使用組態快取 (configuration cache)，通過快取組態階段的結果並將其重複用於後續構建，從而顯著提高構建效能。如果 Gradle 檢測到構建組態或相關依賴項沒有任何變更，它將跳過組態階段。

在 Gradle 的 [組態快取](https://docs.gradle.org/current/userguide/configuration_cache.html) 文件中了解更多資訊。

### 提高多個目標的構建時間

當您的多平台專案包含多個目標時，`build` 和 `assemble` 等任務可能會為每個目標多次編譯相同的程式碼，從而導致更長的編譯時間。

如果您正在積極開發和測試特定平台，請改為執行相應的 `linkDebug*` 任務。

有關更多資訊，請參閱 [提高編譯時間的提示](native-improving-compilation-time#gradle-configuration)。

### 從 kapt 遷移到 KSP

如果您使用的程式庫依賴於 [kapt](kapt) 編譯器外掛程式 (compiler plugin)，請檢查是否可以切換到使用 [Kotlin Symbol Processing (KSP) API](ksp-overview) 代替。 KSP API 通過減少註釋處理時間來提高構建效能。 KSP 比 kapt 更快、更有效，因為它直接處理原始碼，而無需生成中間 Java 存根。

有關遷移步驟的指導，請參閱 Google 的 [遷移指南](https://developer.android.com/build/migrate-to-ksp)。

要了解有關 KSP 與 kapt 比較的更多資訊，請查看 [為什麼選擇 KSP](ksp-why-ksp)。

### 使用模組化 (modularization)

:::note
模組化 (modularization) 僅對中型到大型專案有利。它不為基於微服務架構的專案提供優勢。

:::

使用模組化的專案結構來提高構建速度，並實現更輕鬆的並行開發。將您的專案結構化為一個根專案和一個或多個子專案。如果變更僅影響其中一個子專案，則 Gradle 只會重建該特定子專案。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

在 Gradle 的 [使用 Gradle 構建專案](https://docs.gradle.org/current/userguide/multi_project_builds.html) 文件中了解更多資訊。

### 設定 CI/CD

設定 CI/CD 流程，通過使用增量構建和快取依賴項來顯著減少構建時間。新增持久性儲存或使用遠端構建快取 (remote build cache) 即可看到這些好處。此流程不必耗時，因為某些提供商（如 [GitHub](https://github.com/features/actions)）幾乎可以開箱即用地提供此服務。

瀏覽 Gradle 社群的 [將 Gradle 與持續整合系統結合使用](https://cookbook.gradle.org/ci/) 食譜。

### 使用遠端構建快取 (remote build cache)

與 [本地構建快取 (local build cache)](#use-local-build-cache) 類似，遠端構建快取 (remote build cache) 可以通過重複使用其他構建的輸出，從而説明您節省時間。它可以從任何人已經執行的任何早期構建中檢索任務輸出，而不僅僅是上一次構建。

遠端構建快取 (remote build cache) 使用快取伺服器在構建之間共享任務輸出。例如，在使用 CI/CD 伺服器的開發環境中，伺服器上的所有構建都會填充遠端快取。當您檢出主分支以開始新功能時，您可以立即存取增量構建。

請記住，緩慢的網際網路連線可能會導致傳輸快取結果的速度慢於在本地執行任務。

在 Gradle 的 [構建快取](https://docs.gradle.org/current/userguide/build_cache.html) 文件中了解更多資訊。