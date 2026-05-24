[//]: # (title: 使用 Kotlin Toolchain 進行專案設定)

[Kotlin Toolchain](https://kotlin-toolchain.org/) 是由 JetBrains 建立的工具，旨在協助您設定專案的建置、封裝、發佈等。透過 Kotlin Toolchain，您可以花更少的時間處理建置系統，進而專注於解決真正的業務挑戰。

Kotlin Toolchain 可讓您為 Kotlin Multiplatform 應用程式建立設定檔，支援 JVM、Android、iOS、macOS、Windows 與 Linux，以及適用於所有這些受支援目標的多平台程式庫。

> Kotlin Toolchain 目前處於 [Alpha](supported-platforms.md#general-kotlin-stability-levels) 階段。
> 歡迎在您的 Kotlin Multiplatform 專案中嘗試使用。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供回饋。
>
{style="warning"}

## Kotlin Toolchain 如何運作

Kotlin Toolchain 是一款獨立的命令列應用程式，並允許使用 YAML 檔案設定您的專案。

透過 Kotlin Toolchain，您可以設定平台特定的應用程式和共用的 Kotlin 程式庫。這些內容會使用特殊的宣告式 DSL，在 `module.yaml` 指令清單檔案中宣告為模組。

此 DSL 的核心概念是 Kotlin Multiplatform。Kotlin Toolchain 讓您能快速輕鬆地設定 Kotlin Multiplatform 專案，而無需深入研究複雜的概念。Kotlin Toolchain DSL 提供了一種特殊的語法，讓您能處理多平台設定，包括相依性、設定等。

以下是一個用於 Kotlin Multiplatform 共用程式庫的 Kotlin 模組檔案範例，可用於 JVM、Android 和 iOS 應用程式：

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

* `product` 區段定義了專案類型和目標平台列表。
* `dependencies` 區段會加入 Maven 相依性，未來可能會支援平台特定的套件管理員，例如 CocoaPods 和 Swift Package Manager。
* `$compose` 命名空間是一個內建的程式庫目錄，提供對所有選用 Compose 模組的存取。
* `@platform` 限定詞標記了平台特定的區段，包括相依性和設定。

## 嘗試 Kotlin Toolchain

請參閱 Kotlin Toolchain 的[快速入門指南](https://kotlin-toolchain.org/dev/getting-started/)來親自嘗試。

歡迎隨時將您可能有的任何回饋提交到我們的[問題追蹤器](https://jb.gg/amper-issues)。您的意見將協助我們塑造 Kotlin Toolchain 的未來。

## 下一步

<!---
* Check out the [JetBrains blog](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)
  to learn more about our motivation behind creating Kotlin Toolchain, 
  its use cases, the current state of the project, and its future.
-->
* 請瀏覽 [Kotlin Toolchain 網站](https://kotlin-toolchain.org)以閱讀指南和完整文件。