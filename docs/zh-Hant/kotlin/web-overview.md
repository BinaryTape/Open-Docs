[//]: # (title: 總覽)

Kotlin 透過 Kotlin Multiplatform 為 Web 開發提供了兩種方法：

* [基於 JavaScript (使用 Kotlin/JS 編譯器)](#kotlin-js)
* [基於 WebAssembly (使用 Kotlin/Wasm 編譯器)](#kotlin-wasm)

這兩種方法都能讓您在 Web 應用程式中共享程式碼，但它們支援不同的使用案例。它們在技術層面（例如目標瀏覽器支援）也有所不同。

## Kotlin/JS

[Kotlin/JS](js-overview.md) 透過將您的程式碼、標準庫和所有支援的相依性編譯（transpiling）為 JS，讓 Kotlin 應用程式能在 JavaScript (JS) 環境中執行。

使用 Kotlin/JS 開發時，您可以在瀏覽器或 Node.js 環境中執行您的應用程式。

> 有關配置 Kotlin/JS 目標的資訊，請參閱 [配置 Gradle 專案](gradle-configure-project.md#targeting-javascript) 指南。
>
{style="tip"}

### Kotlin/JS 使用案例

Kotlin/JS 適用於以下目標：

* [與 JavaScript/TypeScript 程式碼庫共享業務邏輯](#share-business-logic-with-a-javascript-typescript-codebase)。
* [使用 Kotlin 建置不共享的 Web 應用程式](#build-web-apps-with-kotlin-without-sharing-the-code)。

#### 與 JavaScript/TypeScript 程式碼庫共享業務邏輯

如果您需要與原生 JavaScript/TypeScript 應用程式共享 Kotlin 程式碼（例如領域或資料邏輯），Kotlin/JS 目標提供：

* 與 JavaScript/TypeScript 的直接互通性。
* 互通性開銷極小（例如避免不必要的資料複製）。這讓共享程式碼能順暢地整合到基於 JS 的工作流中。

#### 使用 Kotlin 建置 Web 應用程式而不共享程式碼

對於 Web 應用程式完全以 Kotlin 實作、且不與其他平台（iOS、Android 或桌面端）共享的專案，基於 HTML 的解決方案可提供更好的控制能力。

基於 HTML 的解決方案可改善 SEO 和無障礙功能。它們還提供更好的瀏覽器整合，包括頁面內尋找和頁面翻譯等功能。

對於基於 HTML 的解決方案，Kotlin/JS 支援多種方法：

* 使用基於 HTML 的 Compose 架構（例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)）來建置具有 Compose 風格架構的 UI。
* 使用帶有 Kotlin 包裝函式的 React 解決方案，以 [在 Kotlin 中實作 React 組建](https://kotlinlang.org/docs/js-react.html)。

## Kotlin/Wasm
<primary-label ref="beta"/> 

[Kotlin/Wasm](wasm-overview.md) 將 Kotlin 程式碼編譯為 WebAssembly (Wasm)，使應用程式能在支援 Wasm 的環境和裝置上執行，同時滿足 Kotlin 的需求。

在瀏覽器中，Kotlin/Wasm 讓您能使用 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 建置 Web 應用程式。在瀏覽器之外，它在獨立的 Wasm 虛擬機中執行，並使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 存取平台 API。

使用 Kotlin/Wasm 開發時，您的目標可以是：

* **`wasmJs`**：用於在瀏覽器或 Node.js 中執行。
* **`wasmWasi`**：用於在支援 WASI 的 Wasm 環境中執行，例如 Wasmtime、WasmEdge 等。

> 有關配置 Kotlin/Wasm 目標的資訊，請參閱 [配置 Gradle 專案](gradle-configure-project.md#targeting-webassembly) 指南。
>
{style="tip"}

### Kotlin/Wasm 使用案例

如果您想在多個平台之間共享邏輯和 UI，請使用 Kotlin/Wasm。

#### 使用 Compose Multiplatform 建置跨平台應用程式

如果您想在包括 Web 在內的多個平台之間共享邏輯和 UI，Kotlin/Wasm 搭配 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 可提供一個共享的 UI 層：

* 確保所有平台的 UI 實作保持一致。
* 使用 Wasm 改善渲染效果並提供更流暢的 UI 更新（例如響應式動畫）。
* 支援最新版本的 [WebAssembly 垃圾收集 (WasmGC)](https://developer.chrome.com/blog/wasmgc) 提案，這讓 Kotlin/Wasm 可以在所有主要現代瀏覽器上執行。

## 選擇您的 Web 開發方法

下表根據您的使用案例總結了建議的目標：

| 使用案例 | 建議目標 | 說明 |
|-------------------------------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 共享業務邏輯，但使用 Web 原生 UI | Kotlin/JS | 提供與 JS 的直接互通性且開銷極小。 |
| 同時共享 UI 與業務邏輯 | Kotlin/Wasm | 使用 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 提供更好的渲染效能。 |
| 不共享的 UI | Kotlin/JS | 允許使用基於 HTML 的架構（如 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html)）並利用現有的 JS 生態系統和工具建置 UI。 |

> 如果您在選擇適當目標方面需要指導，請加入我們的 [Slack 社群](https://slack-chats.kotlinlang.org/c/multiplatform)。您可以詢問關於平台差異、效能考量以及特定使用案例的建議實務。
>
{style="note"}

## Web 目標的相容模式

您可以為 Web 應用程式啟用相容模式，以確保其開箱即用且支援所有瀏覽器。在此模式下，您可以針對現代瀏覽器使用 Wasm 建置 UI，而舊版瀏覽器則回退至 JS。

相容模式是透過針對 `js` 和 `wasmJs` 目標進行交叉編譯來實現的。[進一步了解關於 Web 相容模式以及如何啟用它的資訊](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets)。