[//]: # (title: Kotlin Language Server)
<primary-label ref="alpha"/>

<web-summary>Kotlin Language Server 是 JetBrains 官方為 Kotlin 提供的 LSP 實作，具備 VS Code 支援、程式碼補全、檢查、格式化以及重構功能。</web-summary>

[Kotlin Language Server](https://github.com/Kotlin/kotlin-lsp) 是 JetBrains 針對 Kotlin 官方實作的
[Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/)。

該伺服器基於 IntelliJ IDEA、IntelliJ IDEA Kotlin 外掛程式、JetBrains AIR 與 Fleet。
它旨在與任何支援 LSP 的程式碼編輯器協作。

> [IntelliJ IDEA](https://www.jetbrains.com/idea/) 與 [Android Studio](https://developer.android.com/studio)
> 提供最佳的 Kotlin 開發體驗。
>
{style="note"}

## Visual Studio Code 中的 Kotlin

Kotlin Language Server 為 [Visual Studio Code](https://code.visualstudio.com/) 提供官方的 Kotlin 語言支援。

如果您使用 Visual Studio Code 進行 Kotlin 開發，
請從 Visual Studio Marketplace 安裝官方的 [Kotlin by JetBrains](https://marketplace.visualstudio.com/items?itemName=JetBrains.kotlin-server)
擴充套件。

若要啟用 **Kotlin by JetBrains** 擴充套件，請在 Visual Studio Code 中開啟一個 Kotlin 專案，接著開啟任何 Kotlin 檔案。

## 支援的功能

Kotlin Language Server 包含核心語言功能，例如：

* 支援最新的 Kotlin 語言版本
* 由 IntelliJ 提供技術支援的程式碼補全
* 由 IntelliJ 提供技術支援的 Kotlin 與 `kotlinx.*` 程式庫檢查及快速修正
* JVM 專案的建置系統支援：Gradle、Maven 以及實驗性的 Android Gradle Plugin 支援

  > Kotlin Multiplatform 專案支援正在開發中。
  >
  {style=”tip”}

* 語意高亮
* 整理匯入
* 重新命名重構
* 程式碼格式化
* 文件導覽與懸停支援
* 呼叫階層
* 程式碼摺疊

## 回饋

Kotlin Language Server 正在積極開發中，Alpha 階段的回饋尤為寶貴。

如果您遇到問題或想建議改進，請在 [Kotlin LSP 存儲庫](https://github.com/Kotlin/kotlin-lsp)中提交。

## 下一步

* 探索 [GitHub 上的 Kotlin Language Server 存儲庫](https://github.com/Kotlin/kotlin-lsp)