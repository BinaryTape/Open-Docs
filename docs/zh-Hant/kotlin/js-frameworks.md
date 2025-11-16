[//]: # (title: Kotlin/JS 框架)

利用現有的 Kotlin/JavaScript 框架，簡化網頁開發。這些框架提供了開箱即用的元件、路由、狀態管理以及其他用於建構現代網頁應用程式的工具。

以下是一些來自社群的 Kotlin/JS 網頁框架：

## Kobweb

[Kobweb](https://kobweb.varabyte.com/) 是一個 Kotlin 框架，用於使用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 建立網站和網頁應用程式。它支援即時重新載入 (live-reloading)，以實現快速開發。Kobweb 靈感來自 [Next.js](https://nextjs.org/)，提倡一種標準結構，用於新增 widget、版面配置和頁面。

開箱即用，Kobweb 提供了頁面路由、明暗模式、CSS 樣式、Markdown 支援、後端 API 等功能。它還包含 [Silk](https://silk-ui.netlify.app/)，這是一個 UI 函式庫，帶有一組用於現代使用者介面的多功能 widget。

Kobweb 還支援透過產生頁面快照來進行網站匯出，以用於 SEO 和自動搜尋索引。此外，它還能建立基於 DOM 的使用者介面，這些介面能夠有效地響應狀態變化進行更新。

如需文件和範例，請參閱 [Kobweb 文件](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb) 網站。

如需框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 頻道。

## Kilua

[Kilua](https://kilua.dev/) 是一個基於 [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime) 建構的可組合 (composable) 網頁框架，類似於 [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html) 函式庫。與 compose-html 不同，Kilua 支援 Kotlin/Wasm 和 Kotlin/JS 目標。

Kilua 提供了一個模組化 API，用於建立宣告式 UI 元件並管理它們的狀態。它還包含了一組開箱即用的元件，適用於常見的網頁應用程式使用情境。

Kilua 是 [KVision](https://kvision.io) 框架的後繼者。Kilua 旨在讓 Compose 使用者（`@Composable` 函式、狀態管理、協程/流整合）和 KVision 使用者（基於元件的 API，允許與 UI 元件進行一些命令式互動）都感到熟悉。

如需文件和範例，請參閱 GitHub 上的 [Kilua 儲存庫](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)。

如需框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) 頻道。

## Kotlin React

[React](https://react.dev/) 是一個基於元件的函式庫，廣泛用於網頁和原生使用者介面。它提供了一個龐大的元件生態系統、學習材料和活躍的社群。

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md) 是適用於 React 的 Kotlin 包裝器，將 React 生態系統與 Kotlin 的型別安全性和表達能力結合。

如需函式庫的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#react](https://kotlinlang.slack.com/messages/react) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## KVision

[KVision](https://kvision.io) 是一個物件導向的網頁框架，用於使用開箱即用的 UI 元件建構 Kotlin/JS 應用程式。這些元件可以作為應用程式使用者介面的建構區塊。

透過此框架，你可以使用響應式和命令式程式設計模型來建構你的前端。你還可以透過使用 Ktor、Spring Boot 和其他框架的連接器，將其與你的伺服器端應用程式整合。此外，你可以使用 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 共享程式碼。

如需文件、教學課程和範例，請參閱 [KVision 文件](https://kvision.io/#docs) 網站。

如需框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## fritz2

[fritz2](https://www.fritz2.dev) 是一個獨立框架，用於建構響應式網頁使用者介面。它提供了自己的型別安全 DSL，用於建構和渲染 HTML 元素，並使用 Kotlin 的協程和流來定義元件及其資料綁定。

開箱即用，fritz2 提供了狀態管理、驗證、路由等功能。它還與 Kotlin Multiplatform 專案整合。

如需文件、教學課程和範例，請參閱 [fritz2 文件](https://www.fritz2.dev/docs/) 網站。

如需框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## Doodle

[Doodle](https://nacular.github.io/doodle/) 是一個基於向量的 UI 框架，適用於 Kotlin/JS。Doodle 應用程式利用瀏覽器的圖形功能來繪製使用者介面，而不是依賴 DOM、CSS 或 JavaScript。這種方法讓你可以控制任意 UI 元素、向量形狀、漸層和自訂視覺化的渲染。

如需文件、教學課程和範例，請參閱 [Doodle 文件](https://nacular.github.io/doodle/docs/introduction/) 網站。

如需框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。