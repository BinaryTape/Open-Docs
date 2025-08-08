[//]: # (title: Kotlin for JavaScript)

Kotlin/JS 提供了將您的 Kotlin 程式碼、Kotlin 標準函式庫以及任何相容的依賴項轉譯為 JavaScript 的能力。Kotlin/JS 的當前實作目標是 [ES5](https://www.ecma-international.org/ecma-262/5.1/)。

使用 Kotlin/JS 的推薦方式是透過 `kotlin.multiplatform` Gradle 插件。它讓您能輕鬆地在一個地方設定和控制目標為 JavaScript 的 Kotlin 專案。這包括了基本功能，例如控制應用程式的捆綁、直接從 npm 添加 JavaScript 依賴項等等。要概覽可用選項，請參閱 [設定 Kotlin/JS 專案](js-project-setup.md)。

## Kotlin/JS IR 編譯器

[Kotlin/JS IR 編譯器](js-ir-compiler.md) 相較於舊版預設編譯器，帶來了許多改進。例如，它透過死碼消除減少了產生之可執行檔的大小，並提供了與 JavaScript 生態系統及其工具鏈更流暢的互通性。

> 舊版編譯器自 Kotlin 1.8.0 版本起已被棄用。
> 
{style="note"}

透過從 Kotlin 程式碼產生 TypeScript 宣告檔案 (`d.ts`)，IR 編譯器使得建立混合 TypeScript 和 Kotlin 程式碼的「混合」應用程式，以及利用 Kotlin Multiplatform 的程式碼共享功能變得更加容易。

要了解更多關於 Kotlin/JS IR 編譯器中的可用功能以及如何在您的專案中嘗試它，請造訪 [Kotlin/JS IR 編譯器文件頁面](js-ir-compiler.md) 和 [遷移指南](js-ir-migration.md)。

## Kotlin/JS 框架

現代網頁開發從簡化網頁應用程式建置的框架中獲益匪淺。以下是一些由不同作者編寫的、針對 Kotlin/JS 的流行網頁框架範例：

### Kobweb

_Kobweb_ 是一個有明確觀點的 Kotlin 框架，用於建立網站和網頁應用程式。它利用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 和即時重載來實現快速開發。受 [Next.js](https://nextjs.org/) 啟發，Kobweb 提倡一種標準結構來添加小工具、佈局和頁面。

開箱即用，Kobweb 提供了頁面路由、淺色/深色模式、CSS 樣式、Markdown 支援、後端 API 和更多功能。它還包含一個名為 Silk 的 UI 函式庫，一套用於現代 UI 的多功能小工具。

Kobweb 還支援網站匯出，為 SEO 和自動搜尋索引產生頁面快照。此外，Kobweb 使建立基於 DOM 的 UI 變得容易，這些 UI 可以有效率地響應狀態變化進行更新。

請造訪 [Kobweb](https://kobweb.varabyte.com/) 網站以獲取文件和範例。

關於該框架的更新和討論，請在 Kotlin Slack 中加入 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 頻道。

### KVision

_KVision_ 是一個物件導向的網頁框架，它使得可以使用 Kotlin/JS 編寫應用程式，並提供即用型元件，這些元件可用作應用程式使用者介面的建置塊。您可以使用反應式和指令式程式設計模型來建置前端，使用 Ktor、Spring Boot 和其他框架的連接器將其與您的伺服器端應用程式整合，並使用 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 共享程式碼。

[造訪 KVision 網站](https://kvision.io) 以獲取文件、教學課程和範例。

關於該框架的更新和討論，請在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中加入 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

### fritz2

_fritz2_ 是一個獨立框架，用於建置反應式網頁使用者介面。它提供了自己的型別安全 DSL，用於建置和渲染 HTML 元素，並利用 Kotlin 的協程和流來表達元件及其資料綁定。它開箱即用地提供了狀態管理、驗證、路由等功能，並與 Kotlin Multiplatform 專案整合。

[造訪 fritz2 網站](https://www.fritz2.dev) 以獲取文件、教學課程和範例。

關於該框架的更新和討論，請在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中加入 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

### Doodle

_Doodle_ 是一個基於向量的 Kotlin/JS UI 框架。Doodle 應用程式使用瀏覽器的圖形功能來繪製使用者介面，而不是依賴 DOM、CSS 或 Javascript。透過這種方法，Doodle 讓您能夠精確控制任意 UI 元素、向量形狀、漸層和自訂視覺化的渲染。

[造訪 Doodle 網站](https://nacular.github.io/doodle/) 以獲取文件、教學課程和範例。

關於該框架的更新和討論，請在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中加入 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## 加入 Kotlin/JS 社群

您可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道，與社群和團隊聊天。