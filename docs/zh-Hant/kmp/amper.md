[//]: # (title: 使用 Amper 進行專案配置)

[Amper](https://github.com/JetBrains/amper/tree/HEAD) 是 JetBrains 創建的一個新工具，旨在協助您配置專案以進行建置、打包、發佈等。透過 Amper，您可以花費更少的時間處理建置系統，而將重心放在解決實際的業務挑戰上。

Amper 允許您為 Kotlin 多平台應用程式建立配置檔案，這些應用程式可在 JVM、Android、iOS、macOS 和 Linux 上運行，也可用於支援所有這些目標平台的多平台函式庫。

> Amper 目前為 [實驗性質](supported-platforms.md#general-kotlin-stability-levels)。
> 歡迎您在 Kotlin 多平台專案中嘗試使用它。
> 我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供回饋。
>
{style="warning"}

## Amper 的運作方式

Amper 目前使用 Gradle 作為後端，並使用 YAML 作為定義專案配置的前端。它透過 Gradle 互通性支援自訂任務、CocoaPods、將函式庫發佈到 Maven，以及打包桌面應用程式。

透過 Amper，您可以為特定平台應用程式和共享 Kotlin 函式庫設定配置。它們被宣告為 `.yaml` 模組清單檔案中的模組，使用特殊的宣告式 DSL。

此 DSL 的核心概念是 Kotlin Multiplatform。Amper 允許您快速輕鬆地配置 Kotlin 多平台專案，而無需深入複雜的 Gradle 概念。Amper DSL 提供一種特殊語法，讓您可以處理多平台配置，包括依賴項、設定等。

以下是一個 Amper 清單檔案的範例，用於 Kotlin 多平台共享函式庫，可與 JVM、Android 和 iOS 應用程式搭配使用：

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# 共享 Compose 多平台依賴項:
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# 僅限 Android 的依賴項  
dependencies@android:
  # 將 Compose 與活動整合
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

# 僅限 iOS 的依賴項，並依賴 CocoaPod
# 請注意，CocoaPods 依賴項尚未在原型中實作
dependencies@ios:
  - pod: 'FirebaseCore'
    version: '~> 6.6'

settings:
  # 啟用 Kotlin 序列化
  kotlin:
    serialization: json

  # 啟用 Compose 多平台框架
  compose: enabled
```

* `product` 部分定義了專案類型和目標平台列表。
* `dependencies` 部分不僅添加了 Kotlin 和 Maven 依賴項，還添加了特定平台的套件管理器，例如 CocoaPods 和 Swift Package Manager。
* `@platform` 限定符標記了特定平台的部分，包括依賴項和設定。

## 試用 Amper

您可以透過以下方式之一試用 Amper：

* 在 JVM 和 Android 專案中（從建置版本 233.11555 開始）使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3 及更高版本。
* 使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 從命令列或您的 CI/CD 工具建置 Amper 專案。

依照 [本教學課程](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md) 建立您的第一個 Kotlin 多平台專案。探索 [說明文件](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md) 以了解更多關於 Amper 的功能和設計。

歡迎隨時向我們的 [問題追蹤器](https://youtrack.jetbrains.com/issues/AMPER) 提交任何回饋。您的意見將幫助我們塑造 Amper 的未來。

## 下一步

* 查看 [JetBrains 部落格](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience) 以了解更多關於我們創建 Amper 的動機、其使用案例、專案的當前狀態及其未來。
* 查看 [Amper 常見問題](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md) 以尋找最常見問題的答案。
* 閱讀 [Amper 說明文件](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)，其中涵蓋了 Amper 功能和設計的不同方面。