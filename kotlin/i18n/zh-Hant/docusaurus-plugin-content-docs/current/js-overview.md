---
title: "適用於 JavaScript 的 Kotlin"
---
Kotlin/JS 提供了將您的 Kotlin 程式碼、Kotlin 標準函式庫以及任何相容的依賴項轉譯為 JavaScript 的能力。目前 Kotlin/JS 的實作目標為 [ES5](https://www.ecma-international.org/ecma-262/5.1/)。

建議透過 `kotlin.multiplatform` Gradle 外掛程式來使用 Kotlin/JS。它讓您可以輕鬆地設定和控制以 JavaScript 為目標的 Kotlin 專案。這包含像是控制應用程式的捆綁 (bundling)、直接從 npm 新增 JavaScript 依賴項等重要功能。若要概觀可用的選項，請查看 [設定 Kotlin/JS 專案](js-project-setup)。

## Kotlin/JS IR 編譯器 (compiler)

相較於舊的預設編譯器，[Kotlin/JS IR 編譯器](js-ir-compiler) 具有許多改進。例如，它透過移除無用程式碼 (dead code elimination) 來減少產生的可執行檔的大小，並提供與 JavaScript 生態系統及其工具更流暢的互操作性。

:::note
舊的編譯器自 Kotlin 1.8.0 版本以來已被棄用。

:::

透過從 Kotlin 程式碼產生 TypeScript 宣告檔案 (`d.ts`)，IR 編譯器使得建立混合 TypeScript 和 Kotlin 程式碼的「混合 (hybrid)」應用程式，以及利用使用 Kotlin Multiplatform 的程式碼共享功能更加容易。

若要瞭解更多關於 Kotlin/JS IR 編譯器中可用的功能，以及如何為您的專案嘗試使用它，請造訪 [Kotlin/JS IR 編譯器文件頁面](js-ir-compiler) 和 [移轉指南](js-ir-migration)。

## Kotlin/JS 框架 (framework)

現代 Web 開發受益於簡化 Web 應用程式建構的框架。以下是由不同作者撰寫的幾個流行的 Kotlin/JS Web 框架的範例：

### Kobweb

_Kobweb_ 是一個有主見的 Kotlin 框架，用於建立網站和 Web 應用程式。它利用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 和即時重新載入 (live-reloading) 來實現快速開發。受到 [Next.js](https://nextjs.org/) 的啟發，Kobweb 提倡添加小部件 (widget)、版面配置 (layout) 和頁面的標準結構。

Kobweb 開箱即用，提供頁面路由、淺色/深色模式、CSS 樣式、Markdown 支援、後端 API 等功能。它還包括一個名為 Silk 的 UI 函式庫，這是一組用於現代 UI 的通用小部件。

Kobweb 還支援網站匯出，為 SEO 和自動搜尋索引產生頁面快照。此外，Kobweb 使建立基於 DOM 的 UI 變得容易，這些 UI 可以有效地響應狀態變化。

請造訪 [Kobweb](https://kobweb.varabyte.com/) 網站以取得文件和範例。

若要取得有關該框架的更新和討論，請加入 Kotlin Slack 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 頻道。

### KVision

_KVision_ 是一個物件導向的 Web 框架，它可以使用 Kotlin/JS 編寫應用程式，並具有可以作為應用程式使用者介面建構塊的現成元件。您可以使用反應式和命令式程式設計模型來建構您的前端，使用 Ktor、Spring Boot 和其他框架的連接器將其與您的伺服器端應用程式整合，並使用 [Kotlin Multiplatform](multiplatform-intro) 共享程式碼。

[請造訪 KVision 網站](https://kvision.io) 以取得文件、教學課程和範例。

若要取得有關該框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

### fritz2

_fritz2_ 是一個用於建構反應式 Web 使用者介面的獨立框架。它提供了自己的型別安全 DSL，用於建構和呈現 HTML 元素，並且它利用 Kotlin 的協程 (coroutine) 和流 (flow) 來表達元件及其資料繫結。它提供了開箱即用的狀態管理、驗證、路由等功能，並與 Kotlin Multiplatform 專案整合。

[請造訪 fritz2 網站](https://www.fritz2.dev) 以取得文件、教學課程和範例。

若要取得有關該框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

### Doodle

_Doodle_ 是一個基於向量的 UI 框架，用於 Kotlin/JS。Doodle 應用程式使用瀏覽器的圖形功能來繪製使用者介面，而不是依賴 DOM、CSS 或 Javascript。透過使用這種方法，Doodle 使您可以精確地控制任意 UI 元素、向量形狀、漸層和自訂視覺化的呈現。

[請造訪 Doodle 網站](https://nacular.github.io/doodle/) 以取得文件、教學課程和範例。

若要取得有關該框架的更新和討論，請加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道。

## 加入 Kotlin/JS 社群

您可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道，與社群和團隊聊天。