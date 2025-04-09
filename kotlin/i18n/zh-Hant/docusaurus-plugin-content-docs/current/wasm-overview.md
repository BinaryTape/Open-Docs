---
title: Kotlin/Wasm
---
:::note
Kotlin/Wasm 處於 [Alpha](components-stability) 階段。
它可能隨時變更。您可以在正式環境之前的場景中使用它。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供的意見反應。

[加入 Kotlin/Wasm 社群](https://slack-chats.kotlinlang.org/c/webassembly)。

:::

Kotlin/Wasm 能夠將您的 Kotlin 程式碼編譯成 [WebAssembly (Wasm)](https://webassembly.org/) 格式。
透過 Kotlin/Wasm，您可以建立可在支援 Wasm 並滿足 Kotlin 要求的不同環境和裝置上執行的應用程式。

Wasm 是一種基於堆疊的虛擬機器的二進位指令格式。此格式與平台無關，因為它在自己的虛擬機器上執行。Wasm 為 Kotlin 和其他語言提供了一個編譯目標。

您可以在不同的目標環境中使用 Kotlin/Wasm，例如瀏覽器，用於開發使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 構建的 Web 應用程式，或在獨立的 Wasm 虛擬機器中的瀏覽器外部。在瀏覽器外部的情況下，[WebAssembly System Interface (WASI)](https://wasi.dev/) 提供了對平台 API 的存取權，您也可以利用這些 API。

## Kotlin/Wasm 和 Compose Multiplatform

借助 Kotlin，您可以建構應用程式，並透過 Compose Multiplatform 和 Kotlin/Wasm 在您的 Web 專案中重複使用行動和桌面使用者介面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一個基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的宣告式框架，可讓您實作一次 UI，並在您定位的所有平台上共享它。

對於 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作為其編譯目標。使用 Kotlin/Wasm 和 Compose Multiplatform 建構的應用程式使用 `wasm-js` 目標並在瀏覽器中執行。

[探索我們使用 Compose Multiplatform 和 Kotlin/Wasm 建構的應用程式的線上 Demo](https://zal.im/wasm/jetsnack/)

<img src="/img/wasm-demo.png" alt="Kotlin/Wasm demo" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
若要在瀏覽器中執行使用 Kotlin/Wasm 建構的應用程式，您需要一個支援新的垃圾回收和舊版例外處理提案的瀏覽器版本。若要檢查瀏覽器支援狀態，請參閱 [WebAssembly
roadmap](https://webassembly.org/roadmap/)。

:::

此外，您可以直接在 Kotlin/Wasm 中使用最流行的 Kotlin 函式庫。與其他 Kotlin 和 Multiplatform 專案一樣，您可以將相依性宣告包含在建構腳本中。如需更多資訊，請參閱 [Adding dependencies on multiplatform libraries](multiplatform-add-dependencies)。

您想自己嘗試一下嗎？

<a href="wasm-get-started"><img src="/img/wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" /></a>

## Kotlin/Wasm 和 WASI

Kotlin/Wasm 使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 用於伺服器端應用程式。
使用 Kotlin/Wasm 和 WASI 建構的應用程式使用 Wasm-WASI 目標，允許您呼叫 WASI API 並且在瀏覽器環境之外執行應用程式。

Kotlin/Wasm 利用 WASI 來抽象化特定於平台的細節，允許相同的 Kotlin 程式碼在不同的平台上執行。這擴展了 Kotlin/Wasm 超出 Web 應用程式的範圍，而無需為每個執行階段進行自訂處理。

WASI 提供了一個安全的標準介面，用於在不同環境中執行編譯為 WebAssembly 的 Kotlin 應用程式。

:::tip
若要查看 Kotlin/Wasm 和 WASI 的實際運作，請查看 [Get started with Kotlin/Wasm and WASI tutorial](wasm-wasi)。

:::

## Kotlin/Wasm 效能

雖然 Kotlin/Wasm 仍處於 Alpha 階段，但在 Kotlin/Wasm 上執行的 Compose Multiplatform 已經展現出令人鼓舞的效能特徵。您可以看到它的執行速度優於 JavaScript，並且接近 JVM：

<img src="/img/wasm-performance-compose.png" alt="Kotlin/Wasm performance" width="700" style={{verticalAlign: 'middle'}}/>

我們定期在 Kotlin/Wasm 上執行基準測試，這些結果來自我們在最新版本的 Google Chrome 中的測試。

## 瀏覽器 API 支援

Kotlin/Wasm 標準函式庫提供了瀏覽器 API 的宣告，包括 DOM API。
透過這些宣告，您可以直接使用 Kotlin API 來存取和利用各種瀏覽器功能。
例如，在您的 Kotlin/Wasm 應用程式中，您可以使用 DOM 元素的操控或提取 API，而無需從頭定義這些宣告。若要了解更多資訊，請參閱我們的 [Kotlin/Wasm browser example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)。

瀏覽器 API 支援的宣告是使用 JavaScript [互通性功能](wasm-js-interop) 定義的。
您可以使用相同的功能來定義您自己的宣告。此外，Kotlin/Wasm–JavaScript 互通性允許您從 JavaScript 使用 Kotlin 程式碼。如需更多資訊，請參閱 [Use Kotlin code in JavaScript](wasm-js-interop#use-kotlin-code-in-javascript)。

## 留下意見反應

### Kotlin/Wasm 意見反應

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中直接向開發人員提供您的意見反應。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中回報任何問題。

### Compose Multiplatform 意見反應

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公開頻道中提供您的意見反應。
* [在 GitHub 中回報任何問題](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放清單](https://kotl.in/wasm-pl) 中了解更多關於 Kotlin/Wasm 的資訊。
* 在我們的 GitHub 儲存庫中探索 [Kotlin/Wasm 範例](https://github.com/Kotlin/kotlin-wasm-examples)。