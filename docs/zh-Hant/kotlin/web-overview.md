[//]: # (title: 總覽)

Kotlin 透過 Kotlin Multiplatform 提供兩種網頁開發方法：

* [基於 JavaScript（使用 Kotlin/JS 編譯器）](#kotlin-js)
* [基於 WebAssembly（使用 Kotlin/Wasm 編譯器）](#kotlin-wasm)

這兩種方法都允許您在網頁應用程式中分享程式碼，但它們支援不同的使用案例。它們在技術層面也存在差異，例如目標瀏覽器支援。

## Kotlin/JS

[Kotlin/JS](js-overview.md) 透過將您的程式碼、標準函式庫以及所有受支援的依賴項轉譯為 JS，使其能夠在 JavaScript (JS) 環境中執行 Kotlin 應用程式。

使用 Kotlin/JS 進行開發時，您可以在瀏覽器或 Node.js 環境中執行應用程式。

> 有關配置 Kotlin/JS 目標的資訊，請參閱 [配置 Gradle 專案](gradle-configure-project.md#targeting-javascript) 指南。
>
{style="tip"}

### Kotlin/JS 使用案例

當您的目標是以下情況時，Kotlin/JS 是合適的：

* [與 JavaScript/TypeScript 程式碼庫分享業務邏輯](#share-business-logic-with-a-javascript-typescript-codebase)。
* [使用 Kotlin 建構不可分享的網頁應用程式](#build-web-apps-with-kotlin-without-sharing-the-code)。

#### 與 JavaScript/TypeScript 程式碼庫分享業務邏輯

如果您需要與原生 JavaScript/TypeScript 應用程式分享 Kotlin 程式碼（例如領域邏輯或資料邏輯），Kotlin/JS 目標提供：

* 與 JavaScript/TypeScript 直接互通性。
* 互通性中的最小開銷（例如，避免不必要的資料複製）。這使得共享程式碼可以順利整合到基於 JS 的工作流程中。

#### 使用 Kotlin 建構不分享程式碼的網頁應用程式

對於網頁應用程式完全以 Kotlin 實現，而不與其他平台（iOS、Android 或桌面）分享的專案，基於 HTML 的解決方案提供更好的控制。

基於 HTML 的解決方案可改善 SEO 和可存取性。它們還提供更好的瀏覽器整合，包括頁面搜尋和頁面翻譯等功能。

對於基於 HTML 的解決方案，Kotlin/JS 支援多種方法：

* 使用基於 Compose HTML 的框架，例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)，以 Compose 風格的架構建構 UI。
* 使用帶有 Kotlin 封裝器的基於 React 的解決方案，以實現 [Kotlin 中的 React 組件](https://kotlinlang.org/docs/js-react.html)。

## Kotlin/Wasm
<primary-label ref="beta"/> 

[](wasm-overview.md) 將 Kotlin 程式碼編譯為 WebAssembly (Wasm)，使應用程式能夠在支援 Wasm 的環境和裝置上執行，同時滿足 Kotlin 的要求。

在瀏覽器中，Kotlin/Wasm 允許您使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 建構網頁應用程式。在瀏覽器之外，它在獨立的 Wasm 虛擬機器中執行，使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 存取平台 API。

使用 Kotlin/Wasm 進行開發時，您可以目標設定為：

* **`wasmJs`**: 用於在瀏覽器或 Node.js 中執行。
* **`wasmWasi`**: 用於在支援 WASI 的 Wasm 環境中執行，例如 Wasmtime、WasmEdge 等。

> 有關配置 Kotlin/Wasm 目標的資訊，請參閱 [配置 Gradle 專案](gradle-configure-project.md#targeting-webassembly) 指南。
>
{style="tip"}

### Kotlin/Wasm 使用案例

如果您想在多個平台之間分享邏輯和 UI，請使用 Kotlin/Wasm。

#### 使用 Compose Multiplatform 建構跨平台應用程式

如果您想在多個平台（包括網頁）之間分享邏輯和 UI，Kotlin/Wasm 搭配 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 提供一個共享的 UI 層：

* 確保所有平台上的 UI 實作一致。
* 使用 Wasm 以改進渲染和更流暢的 UI 更新，例如響應式動畫。
* 支援最新版本的 [WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc) 提案，這使得 Kotlin/Wasm 能夠在所有主流現代瀏覽器上執行。

## 選擇您的網頁開發方法

下表總結了根據您的使用案例推薦的目標：

| 使用案例                                        | 推薦目標    | 描述                                                                                                                                                                                                               |
|-------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 分享業務邏輯，但使用網頁原生 UI             | Kotlin/JS   | 提供與 JS 的直接互通性，且開銷最小。                                                                                                                                                                                             |
| 同時分享 UI 和業務邏輯                      | Kotlin/Wasm | 透過 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 為渲染提供更好的性能。                                                                                                                                |
| 不可分享的 UI                                | Kotlin/JS   | 允許使用現有的 JS 生態系統和工具，透過 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html) 等基於 HTML 的框架建構 UI。 |

> 如果您在選擇適當的目標方面需要指導，請加入我們的 [Slack 社群](https://slack-chats.kotlinlang.org/c/multiplatform)。
> 您可以詢問關於平台差異、性能考量以及特定使用案例的建議實踐。
>
{style="note"}

## 網頁目標的相容模式

您可以為您的網頁應用程式啟用相容模式，以確保它可以在所有瀏覽器上開箱即用。在此模式下，您可以為現代瀏覽器使用 Wasm 建構 UI，而舊版瀏覽器則會退回到 JS。

相容模式是透過對 `js` 和 `wasmJs` 目標進行交叉編譯實現的。
[查看更多關於網頁相容模式以及如何啟用它的資訊](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets)。