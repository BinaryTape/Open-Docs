[//]: # (title: 使用 Amper 進行專案配置)

[Amper](https://github.com/JetBrains/amper/tree/HEAD) 是 JetBrains 開發的一款新工具，旨在協助您配置專案以進行建置、打包、發佈等。透過 Amper，您可以減少處理建置系統的時間，轉而專注於解決實際的業務挑戰。

Amper 讓您可以為 Kotlin 多平台應用程式（可在 JVM、Android、iOS、macOS 和 Linux 上執行）以及多平台函式庫（可與所有這些受支援的目標配合使用）建立配置檔案。

> Amper 目前為 [實驗性](supported-platforms.md#general-kotlin-stability-levels) 狀態。
> 歡迎您在您的 Kotlin 多平台專案中試用。
> 我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供意見回饋。
>
{style="warning"}

## Amper 的運作方式

Amper 目前使用 Gradle 作為後端，並使用 YAML 作為定義專案配置的前端。它支援透過 Gradle 互通性執行自訂任務、CocoaPods、將函式庫發佈到 Maven，以及打包桌面應用程式。

透過 Amper，您可以為特定平台應用程式和共享 Kotlin 函式庫設定配置。它們在 `.yaml` 模組清單檔案中，使用特殊的宣告式 DSL 宣告為模組。

此 DSL 的核心概念是 Kotlin Multiplatform。Amper 讓您可以快速輕鬆地配置 Kotlin 多平台專案，而無需深入研究複雜的 Gradle 概念。Amper DSL 提供特殊的語法，使您能夠處理多平台配置，包括依賴項、設定等等。

以下是一個 Amper 清單檔案的範例，用於 Kotlin 多平台共享函式庫，可與 JVM、Android 和 iOS 應用程式配合使用：

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# Shared Compose Multiplatform dependencies:
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# Android-only dependencies  
dependencies@android:
  # Integration compose with activities
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

# iOS-only dependencies with a dependency on a CocoaPod
# Note that CocoaPods dependencies are not yet implemented in the prototype
dependencies@ios:
  - pod: 'FirebaseCore'
    version: '~> 6.6'

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose: enabled
```

*   `product` 部分定義了專案類型和目標平台列表。
*   `dependencies` 部分不僅新增了 Kotlin 和 Maven 依賴項，還新增了特定平台的套件管理器，例如 CocoaPods 和 Swift Package Manager。
*   `@platform` 限定詞標記了特定平台的部分，包括依賴項和設定。

## 試用 Amper

您可以透過以下其中一種方式試用 Amper：

*   針對 JVM 和 Android 專案，使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3 及更高版本（從建置版本 233.11555 開始）。
*   使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 從命令列或您的 CI/CD 工具建置 Amper 專案。

按照 [本教程](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md) 建立您的第一個 Kotlin 多平台專案。探索 [文件](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md) 以了解更多關於 Amper 的功能和設計。

歡迎將您可能有的任何意見回饋提交至我們的 [問題追蹤器](https://youtrack.jetbrains.com/issues/AMPER)。您的意見將有助於我們塑造 Amper 的未來。

## 後續步驟

*   查看 [JetBrains 部落格](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)，了解更多關於我們建立 Amper 的動機、其使用案例、專案的當前狀態及其未來。
*   參閱 [Amper FAQ](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md) 以尋找最常見問題的答案。
*   閱讀 [Amper 文件](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)，其中涵蓋了 Amper 功能和設計的不同方面。