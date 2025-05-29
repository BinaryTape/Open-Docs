[//]: # (title: Kotlin/Wasm)

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段。
> 它可能隨時變動。您可以在產品發佈前的場景中使用它。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供的意見回饋。
>
> [加入 Kotlin/Wasm 社群](https://slack-chats.kotlinlang.org/c/webassembly)。
>
{style="note"}

Kotlin/Wasm 能夠將您的 Kotlin 程式碼編譯為 [WebAssembly (Wasm)](https://webassembly.org/) 格式。
透過 Kotlin/Wasm，您可以建立在支援 Wasm 並符合 Kotlin 要求的不同環境和裝置上執行的應用程式。

Wasm 是一種基於堆疊虛擬機器的二進位指令格式。這種格式是平台獨立的，因為它運行在它自己的虛擬機器上。Wasm 為 Kotlin 和其他語言提供了一個編譯目標。

您可以在不同的目標環境中使用 Kotlin/Wasm，例如瀏覽器，用於開發基於 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 的 Web 應用程式，或在瀏覽器外部的獨立 Wasm 虛擬機器中。在瀏覽器外部的情況下，[WebAssembly System Interface (WASI)](https://wasi.dev/) 提供平台 API 的存取權限，您也可以加以利用。

## Kotlin/Wasm 與 Compose Multiplatform

透過 Kotlin，您可以建立應用程式並透過 Compose Multiplatform 和 Kotlin/Wasm 在您的 Web 專案中重複使用行動和桌面使用者介面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一個基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的宣告式框架，它允許您一次實作 UI 並在您鎖定的所有平台上共用。

對於 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作為其編譯目標。使用 Kotlin/Wasm 和 Compose Multiplatform 建立的應用程式使用 `wasm-js` 目標並在瀏覽器中執行。

[探索我們使用 Compose Multiplatform 和 Kotlin/Wasm 建立的應用程式線上示範](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm 示範](wasm-demo.png){width=700}

> 若要在瀏覽器中執行使用 Kotlin/Wasm 建立的應用程式，您需要支援新垃圾收集 (garbage collection) 和舊版例外處理 (legacy exception handling) 提案的瀏覽器版本。要檢查瀏覽器支援狀態，請參閱 [WebAssembly 路線圖](https://webassembly.org/roadmap/)。
>
{style="tip"}

此外，您可以在 Kotlin/Wasm 中直接使用最受歡迎的 Kotlin 函式庫。就像在其他 Kotlin 和 Multiplatform 專案中一樣，您可以將依賴項宣告包含在建構腳本中。有關更多資訊，請參閱 [新增多平台函式庫依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)。

您想親自試試看嗎？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="開始使用 Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm 與 WASI

Kotlin/Wasm 將 [WebAssembly System Interface (WASI)](https://wasi.dev/) 用於伺服器端應用程式。使用 Kotlin/Wasm 和 WASI 建立的應用程式使用 Wasm-WASI 目標，讓您可以呼叫 WASI API 並在瀏覽器環境之外執行應用程式。

Kotlin/Wasm 利用 WASI 抽象化平台特定的細節，使相同的 Kotlin 程式碼能夠在不同平台上執行。這將 Kotlin/Wasm 的觸及範圍擴展到 Web 應用程式之外，而無需為每個執行時 (runtime) 進行自訂處理。

WASI 提供了一個安全的標準介面，用於在不同環境中執行編譯為 WebAssembly 的 Kotlin 應用程式。

> 若要查看 Kotlin/Wasm 和 WASI 的實際應用，請查看 [開始使用 Kotlin/Wasm 與 WASI 教學](wasm-wasi.md)。
>
{style="tip"}

## Kotlin/Wasm 效能

儘管 Kotlin/Wasm 仍處於 Alpha 階段，但運行在 Kotlin/Wasm 上的 Compose Multiplatform 已展現出令人鼓舞的效能特性。您可以看到其執行速度超越 JavaScript，並正接近 JVM 的水準：

![Kotlin/Wasm 效能](wasm-performance-compose.png){width=700}

我們定期對 Kotlin/Wasm 進行基準測試 (benchmarks)，這些結果來自我們在最新版 Google Chrome 瀏覽器中的測試。

## 瀏覽器 API 支援

Kotlin/Wasm 標準函式庫提供瀏覽器 API 的宣告，包括 DOM API。透過這些宣告，您可以直接使用 Kotlin API 存取和利用各種瀏覽器功能。例如，在您的 Kotlin/Wasm 應用程式中，您可以使用 DOM 元素的操作 (manipulation) 或 `fetch` API，而無需從頭定義這些宣告。要了解更多資訊，請參閱我們的 [Kotlin/Wasm 瀏覽器範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)。

瀏覽器 API 支援的宣告是使用 JavaScript [互通性功能](wasm-js-interop.md) 定義的。您可以使用相同的功能來定義自己的宣告。此外，Kotlin/Wasm-JavaScript 互通性 (interoperability) 允許您從 JavaScript 使用 Kotlin 程式碼。有關更多資訊，請參閱 [在 JavaScript 中使用 Kotlin 程式碼](wasm-js-interop.md#use-kotlin-code-in-javascript)。

## 留下意見回饋

### Kotlin/Wasm 意見回饋

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並直接在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中向開發者提供您的意見回饋。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中回報任何問題。

### Compose Multiplatform 意見回饋

* ![Slack](slack.svg){width=25}{type="joined"} Slack: 在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公開頻道中提供您的意見回饋。
* [在 GitHub 中回報任何問題](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放清單](https://kotl.in/wasm-pl) 中了解更多關於 Kotlin/Wasm 的資訊。
* 在我們的 GitHub 儲存庫中探索 [Kotlin/Wasm 範例](https://github.com/Kotlin/kotlin-wasm-examples)。