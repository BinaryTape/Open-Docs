[//]: # (title: 使用 Kotlin Toolchain 進行專案配置)

[Kotlin Toolchain](https://kotlin-toolchain.org/) 是由 JetBrains 開發的工具，旨在協助您配置專案以進行建置、封裝、發布等作業。透過 Kotlin Toolchain，您可以減少處理建構系統的時間，進而專注於解決真正的業務挑戰。

Kotlin Toolchain 讓您能為可在 JVM、Android、iOS、macOS、Windows 與 Linux 上執行的 Kotlin 多平台應用程式建立設定檔，同時也支援適用於所有這些目標平台的多平台程式庫。

> Kotlin Toolchain 目前處於 [Alpha](supported-platforms.md#general-kotlin-stability-levels) 階段。
> 歡迎在您的 Kotlin 多平台專案中嘗試使用。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供回饋。
>
{style="warning"}

## Kotlin Toolchain 如何運作

Kotlin Toolchain 是一個獨立的 CLI 應用程式，允許您使用 YAML 檔案來配置專案。

透過 Kotlin Toolchain，您可以設定平台特定的應用程式與共用的 Kotlin 程式庫。這些內容會在 `module.yaml` 資訊清單檔案中，使用特殊的宣告式 DSL 宣告為模組。

此 DSL 的核心概念是 Kotlin 多平台。Kotlin Toolchain 讓您能快速且輕鬆地配置 Kotlin 多平台專案，而無需深入研究複雜的概念。Kotlin Toolchain DSL 提供了一種特殊的語法，讓您能處理多平台配置，包括相依性、設定等等。

以下是一個可用於 JVM、Android 與 iOS 應用程式的 Kotlin 多平台共用程式庫之 Kotlin 模組檔案範例：

```yaml
product:
  type: kmp/lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64 ]

# Shared Compose Multiplatform dependencies:
dependencies:
  - $compose.foundation: exported
  - $compose.material3: exported

# Android-only dependencies  
dependencies@android:
  # Integrate compose with activities
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose:
    enabled: true
```

* `product` 區段定義了專案型別與目標平台列表。
* `dependencies` 區段加入了 Maven 相依性，未來可能會支援平台特定的封裝管理員，例如 CocoaPods 與 Swift Package Manager。
* `$compose` 命名空間是一個內建的程式庫目錄，提供了對所有選用 Compose 模組的存取。
* `@platform` 限定詞標記了平台特定的區段，包括相依性與設定。

## 嘗試 Kotlin Toolchain

請參閱 Kotlin Toolchain 的[快速入門指南](https://kotlin-toolchain.org/dev/getting-started/)以親自嘗試。

歡迎隨時將您的任何回饋提交至我們的[問題追蹤器](https://jb.gg/amper-issues)。您的意見將協助我們塑造 Kotlin Toolchain 的未來。

## 下一步

<!---
* Check out the [JetBrains blog](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)
  to learn more about our motivation behind creating Kotlin Toolchain, 
  its use cases, the current state of the project, and its future.
-->
* 前往 [Kotlin Toolchain 網站](https://kotlin-toolchain.org)閱讀指南與完整的說明文件。