[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasm 有能力將您的 Kotlin 程式碼編譯為 [WebAssembly (Wasm)](https://webassembly.org/) 格式。 
透過 Kotlin/Wasm，您可以建立可在支援 Wasm 且符合 Kotlin 需求的各種環境與裝置上執行的應用程式。

Wasm 是一種用於堆疊式虛擬機的二進制指令格式。由於它在自己的虛擬機上執行，因此這種格式與平台無關。Wasm 為 Kotlin 和其他語言提供了一個編譯目標。 

您可以在不同的目標環境中使用 Kotlin/Wasm，例如在瀏覽器中使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 開發 Web 應用程式，或是於瀏覽器外在獨立的 Wasm 虛擬機中執行。在瀏覽器外的案例中，[WebAssembly System Interface (WASI)](https://wasi.dev/) 提供了可供您利用的平台 API 存取權限。

> 若要在瀏覽器中執行以 Kotlin/Wasm 建置的應用程式，您的使用者需要支援 WebAssembly 垃圾收集 (Garbage Collection) 與舊版例外處理 (Exception Handling) 提案的 [瀏覽器版本](wasm-configuration.md#browser-versions)。若要檢查瀏覽器支援狀態，請參閱 [WebAssembly 發展藍圖](https://webassembly.org/roadmap/)。
>
{style="tip"}

[//]: # (TODO KT-85415: 關於相容 Kotlin/Wasm 的獨立執行時，請參閱獨立執行時 (Standalone runtimes))。

## Kotlin/Wasm 與 Compose Multiplatform

透過 Kotlin，您有能力經由 Compose Multiplatform 與 Kotlin/Wasm，在 Web 專案中建置應用程式並重複使用行動裝置與桌面端的使用者介面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一個基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的宣告式架構，允許您實作一次 UI 後，即可在所有目標平台之間共享。 

對於 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作為其編譯目標。使用 Kotlin/Wasm 和 Compose Multiplatform 建置的應用程式使用 `wasm-js` 目標並在瀏覽器中執行。

此外，您可以開箱即用地在 Kotlin/Wasm 中使用最受歡迎的 Kotlin 程式庫。如同在其他 Kotlin 和 Multiplatform 專案中一樣，您可以在組建指令碼中包含相依性宣告。如需更多資訊，請參閱 [新增多平台程式庫的相依性](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)。

您想親自嘗試嗎？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="開始使用 Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm 與 WASI

Kotlin/Wasm 將 [WebAssembly System Interface (WASI)](https://wasi.dev/) 用於伺服器端應用程式。
使用 Kotlin/Wasm 和 WASI 建置的應用程式使用 Wasm-WASI 目標，允許您呼叫 WASI API 並在瀏覽器環境之外執行應用程式。

Kotlin/Wasm 利用 WASI 抽象化平台特定的細節，允許相同的 Kotlin 程式碼在不同平台上執行。這擴展了 Kotlin/Wasm 的觸角，使其超越 Web 應用程式，且不需要為每個執行時 (runtime) 進行自訂處理。

WASI 提供了安全、標準化的介面，用於在不同環境中執行編譯為 WebAssembly 的 Kotlin 應用程式。

> 若要查看 Kotlin/Wasm 和 WASI 的實際運作，請參閱 [開始使用 Kotlin/Wasm 和 WASI 教學](wasm-wasi.md)。
>
{style="tip"}

### WebAssembly 元件模型
<primary-label ref="experimental-general"/>

WASI 0.2 建基於 [WebAssembly 元件模型 (WebAssembly Component Model)](https://github.com/WebAssembly/component-model) 之上，該模型定義了使用標準化介面與型別從 Wasm 模組建置元件的方法。此模型允許您在應用程式或程式庫中定義與語言無關的元件。您還可以將 Wasm 模組和現有元件組合成新的元件。

若要探索 WebAssembly 元件模型與 Kotlin/Wasm 的可能性，請查看此 [使用 `wasi:http` 建置的簡單伺服器](https://github.com/Kotlin/sample-wasi-http-kotlin/) 範例。

<img src="kotlin-wasm-wasi-http.gif" alt="使用 WebAssembly 元件模型的 Kotlin/Wasm" width="600"/>

## Kotlin/Wasm 效能

雖然 Kotlin/Wasm 仍處於 Beta 階段，但在 Kotlin/Wasm 上執行的 Compose Multiplatform 已經展現出令人鼓舞的效能特性。您可以看到其執行速度超越了 JavaScript，並接近 JVM 的水準：

![Kotlin/Wasm 效能](wasm-performance-compose.png){width=700}

我們定期在 Kotlin/Wasm 上執行效能基準測試 (benchmarks)，這些結果來自我們在最近版本的 Google Chrome 中進行的測試。

## 瀏覽器 API 支援

Kotlin/Wasm 標準函式庫提供了瀏覽器 API 的宣告，包括 DOM API。
透過這些宣告，您可以直接使用 Kotlin API 來存取並利用各種瀏覽器功能。 
例如，在您的 Kotlin/Wasm 應用程式中，您可以對 DOM 元素進行操作或呼叫 fetch API，而無需從頭開始定義這些宣告。若要了解更多，請參閱我們的 [Kotlin/Wasm 瀏覽器範例](https://github.com/Kotlin/kotlin-wasm-browser-template)。

瀏覽器 API 支援的宣告是使用 JavaScript [互通性功能 (interoperability)](wasm-js-interop.md) 定義的。 
您可以使用相同的功能來定義您自己的宣告。此外，Kotlin/Wasm 與 JavaScript 的互通性允許您從 JavaScript 中使用 Kotlin 程式碼。如需更多資訊，請參閱 [在 JavaScript 中使用 Kotlin 程式碼](wasm-js-interop.md#use-kotlin-code-in-javascript)。

## 留下回饋

### Kotlin/Wasm 回饋

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中直接向開發者提供您的回饋。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中回報任何問題。

### Compose Multiplatform 回饋

* ![Slack](slack.svg){width=25}{type="joined"} Slack：在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公開頻道中提供您的回饋。
* [在 GitHub 中回報任何問題](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放清單](https://kotl.in/wasm-pl) 中了解有關 Kotlin/Wasm 的更多資訊。
* 在我們的 GitHub 存儲庫中探索 [Kotlin/Wasm 範例](https://github.com/Kotlin/kotlin-wasm-examples)。