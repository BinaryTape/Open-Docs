[//]: # (title: Kotlin 針對 JavaScript)

Kotlin/JS 能夠將您的 Kotlin 程式碼、Kotlin 標準函式庫，以及任何相容的相依性轉譯為 JavaScript。Kotlin/JS 的目前實作目標為 [ES5](https://www.ecma-international.org/ecma-262/5.1/)。

使用 Kotlin/JS 的建議方式是透過 `kotlin.multiplatform` Gradle 外掛程式。它讓您能輕鬆地集中設定和控制目標為 JavaScript 的 Kotlin 專案。這包括基本功能，例如控制應用程式的打包、直接從 npm 新增 JavaScript 相依性等等。若要概覽可用選項，請參閱[設定 Kotlin/JS 專案](js-project-setup.md)。

## Kotlin/JS IR 編譯器

[Kotlin/JS IR 編譯器](js-ir-compiler.md) 相較於舊版預設編譯器帶來了許多改進。例如，它透過死碼消除減少了生成的可執行檔大小，並提供了與 JavaScript 生態系及其工具之間更流暢的互通性。

> 舊版編譯器自 Kotlin 1.8.0 版本發佈以來已棄用。
> 
{style="note"}

透過從 Kotlin 程式碼生成 TypeScript 宣告檔 (`d.ts`)，IR 編譯器使建立混合 TypeScript 和 Kotlin 程式碼的「混合式」應用程式變得更容易，並能利用 Kotlin Multiplatform 的程式碼共用功能。

若要了解更多關於 Kotlin/JS IR 編譯器中的可用功能，以及如何在您的專案中嘗試它，請造訪 [Kotlin/JS IR 編譯器文件頁面](js-ir-compiler.md)和[遷移指南](js-ir-migration.md)。

## Kotlin/JS 框架

現代網頁開發從簡化網頁應用程式建置的框架中受益匪淺。以下是一些由不同作者編寫的、針對 Kotlin/JS 的流行網頁框架範例：

### Kobweb

_Kobweb_ 是一個有明確主張的 Kotlin 框架，用於建立網站和網頁應用程式。它利用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 和即時重新載入 (live-reloading) 以實現快速開發。受 [Next.js](https://nextjs.org/) 啟發，Kobweb 推廣一種標準結構，用於新增小工具 (widgets)、版面配置 (layouts) 和頁面。

開箱即用，Kobweb 提供頁面路由、亮/暗模式、CSS 樣式設定、Markdown 支援、後端 API 及更多功能。它還包含一個名為 Silk 的 UI 函式庫，它是一組用於現代 UI 的多功能小工具。

Kobweb 也支援網站匯出，生成頁面快照以用於 SEO 和自動搜尋索引。此外，Kobweb 使建立基於 DOM 的 UI 變得容易，這些 UI 能有效率地回應狀態變更並更新。

請造訪 [Kobweb](https://kobweb.varabyte.com/) 網站以獲取文件和範例。

若要了解框架的更新和討論，請加入 Kotlin Slack 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 頻道。

### KVision

_KVision_ 是一個物件導向的網頁框架，使其能夠使用 Kotlin/JS 編寫應用程式，其中包含可直接使用的元件，這些元件可用作您應用程式使用者介面的建構塊。您可以使用響應式 (reactive) 和命令式 (imperative) 程式設計模型來建構您的前端，使用 Ktor、Spring Boot 和其他框架的連接器將其與您的伺服器端應用程式整合，並使用 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 共用程式碼。

請造訪 [KVision 網站](https://kvision.io) 以獲取文件、教學課程和範例。

若要了解框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

### fritz2

_fritz2_ 是一個獨立框架，用於建構響應式網頁使用者介面。它提供自己的型別安全的 DSL，用於建構和彩現 HTML 元素，並利用 Kotlin 的協程 (coroutines) 和流 (flows) 來表達元件及其資料綁定。它提供開箱即用的狀態管理、驗證、路由等功能，並與 Kotlin Multiplatform 專案整合。

請造訪 [fritz2 網站](https://www.fritz2.dev) 以獲取文件、教學課程和範例。

若要了解框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

### Doodle

_Doodle_ 是一個基於向量的 UI 框架，適用於 Kotlin/JS。Doodle 應用程式使用瀏覽器的繪圖能力來繪製使用者介面，而非依賴於 DOM、CSS 或 Javascript。透過這種方法，Doodle 讓您可以精確控制任意 UI 元素、向量形狀、漸層和自訂視覺化的彩現。

請造訪 [Doodle 網站](https://nacular.github.io/doodle/) 以獲取文件、教學課程和範例。

若要了解框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## 加入 Kotlin/JS 社群

您可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道，與社群和團隊交流。