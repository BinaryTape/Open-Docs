[//]: # (title: Kotlin/JS 架構)

利用現有的 Kotlin/JavaScript 架構，簡化 Web 開發。
這些架構提供現成的組建、路由、狀態管理以及其他用於建置現代 Web 應用程式的工具。

以下是一些來自社群的 Kotlin/JS Web 架構：

## Kobweb

[Kobweb](https://kobweb.varabyte.com/) 是一個使用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 建立網站和 Web 應用程式的 Kotlin 架構。它支援即時重新載入以進行快速開發。受到 [Next.js](https://nextjs.org/) 的啟發，Kobweb 提倡一種用於新增小工具、配置和頁面的標準結構。

Kobweb 開箱即用，提供頁面路由、淺色/深色模式、CSS 樣式、Markdown 支援、後端 API 等功能。它還包含 [Silk](https://silk-ui.netlify.app/)，這是一個 UI 程式庫，擁有一套用於現代 UI 的多功能小工具。

Kobweb 還支援透過產生頁面快照來匯出網站，以利於 SEO 和自動搜尋索引。此外，它還能建立基於 DOM 的 UI，並能有效地針對狀態變更做出回應並更新。

有關文件和範例，請參閱 [Kobweb 文件](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb)網站。

有關該架構的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 頻道。

## Kilua

[Kilua](https://kilua.dev/) 是一個建構在 [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime) 之上的可組合 Web 架構，與 [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html) 程式庫相似。與 compose-html 不同，Kilua 同時支援 Kotlin/Wasm 和 Kotlin/JS 目標。

Kilua 提供模組化 API 來建立宣告式 UI 組建並管理其狀態。它還包含一組針對常見 Web 應用程式使用案例的現成組建。

Kilua 是 [KVision](https://kvision.io) 架構的繼任者。Kilua 的設計旨在讓 Compose 使用者（`@Composable` 函式、狀態管理、協同程式/flow 整合）和 KVision 使用者（基於組建的 API，允許與 UI 組建進行一些命令式互動）都能感到熟悉。

有關文件和範例，請參閱 GitHub 上的 [Kilua 存儲庫](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)。

有關該架構的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) 頻道。

## Kotlin React

[React](https://react.dev/) 是一個基於組建的程式庫，廣泛用於 Web 和原生使用者介面。它擁有龐大的組建生態系統、學習材料和活躍的社群。

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md) 是 React 的 Kotlin 包裝函式，將 React 生態系統與 Kotlin 的型別安全性及表達力相結合。

有關該程式庫的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#react](https://kotlinlang.slack.com/messages/react) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## KVision

[KVision](https://kvision.io) 是一個物件導向的 Web 架構，用於透過現成的 UI 組建來建置 Kotlin/JS 應用程式。這些組建可以作為您應用程式使用者介面的基礎構件。

透過此架構，您可以使用回應式和命令式程式設計模型來建置您的前端。您還可以透過使用 Ktor、Spring Boot 和其他架構的連接器，將其與您的伺服器端應用程式整合。此外，您可以使用 Kotlin Multiplatform 分享程式碼。

有關文件、教學和範例，請參閱 [KVision 文件](https://kvision.io/#docs)網站。

有關該架構的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## fritz2

[fritz2](https://www.fritz2.dev) 是一個用於建置回應式 Web 使用者介面的獨立架構。它提供自己的型別安全 DSL 用於建置和渲染 HTML 元素，並使用 Kotlin 的協同程式和 flow 來定義組建及其資料繫結。

fritz2 開箱即用，提供狀態管理、驗證、路由等功能。它還能與 Kotlin Multiplatform 專案整合。

有關文件、教學和範例，請參閱 [fritz2 文件](https://www.fritz2.dev/docs/)網站。

有關該架構的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## Doodle

[Doodle](https://nacular.github.io/doodle/) 是一個用於 Kotlin/JS 的向量式 UI 架構。Doodle 應用程式利用瀏覽器的圖形能力來繪製使用者介面，而不是依賴於 DOM、CSS 或 JavaScript。這種方法讓您能夠控制任意 UI 元素、向量形狀、漸層和自訂視覺化效果的渲染。

有關文件、教學和範例，請參閱 [Doodle 文件](https://nacular.github.io/doodle/docs/introduction/)網站。

有關該架構的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。