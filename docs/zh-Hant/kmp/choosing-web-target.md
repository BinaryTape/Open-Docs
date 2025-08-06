# 選擇 Kotlin 多平台專案的合適網頁目標

Kotlin 多平台 (KMP) 為網頁開發提供了兩種方法：

* 基於 JavaScript (使用 Kotlin/JS 編譯器)
* 基於 WebAssembly (使用 Kotlin/Wasm 編譯器)

這兩種選項都讓您在網頁應用程式中使用共用程式碼。然而，它們在重要方面有所不同，包括效能、互通性、應用程式大小以及目標瀏覽器支援。本指南解釋了何時使用每個目標，以及如何透過合適的選擇來滿足您的需求。

### 快速指南

下表總結了基於您的使用案例的推薦目標：

| 使用案例           | 推薦目標 | 原因                                                                                                                                                                                                                                                              |
|--------------------| ----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 共用業務邏輯，但原生 UI  | JS         | 提供與 JavaScript 直接的互通性且開銷最小                                                                                                                                                                                                                               |
| 共用 UI 和業務邏輯   | Wasm       | 為使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 進行渲染提供更好的效能                                                                                                                                                                  |
| 不可共用的 UI       | JS         | 允許使用 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html) 等基於 HTML 的框架構建 UI，利用現有的 JS 生態系統和工具 |

## 何時選擇 Kotlin/JS

如果您的目標是，Kotlin/JS 提供了一個絕佳的解決方案：

* [與 JavaScript/TypeScript 程式碼庫共用業務邏輯](#share-business-logic-with-a-javascript-typescript-codebase)
* [使用 Kotlin 構建不可共用的網頁應用程式](#build-web-apps-with-kotlin-without-sharing-the-code)

### 與 JavaScript/TypeScript 程式碼庫共用業務邏輯

如果您想與原生的 JavaScript/TypeScript 應用程式共用一段 Kotlin 程式碼 (例如領域或資料邏輯)，JS 目標提供了：

* 與 JavaScript/TypeScript 直接的互通性。
* 在互通性方面的開銷最小 (例如，沒有不必要的資料複製)。這有助於您的程式碼無縫整合到基於 JS 的工作流程中。

### 使用 Kotlin 構建不可共用的網頁應用程式

對於希望使用 Kotlin 構建整個網頁應用程式，但無意將其共用至其他平台 (iOS、Android 或桌面) 的團隊來說，基於 HTML 的解決方案可能是更好的選擇。它改善了 SEO 和可訪問性，並預設提供無縫的瀏覽器整合 (例如「在頁面中尋找」功能或翻譯頁面)。在這種情況下，Kotlin/JS 提供了多種選項。您可以：

* 使用 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/) 等 Compose 基於 HTML 的框架，以熟悉的 Compose Multiplatform 架構構建 UI。
* 利用帶有 Kotlin 包裝器的基於 React 的解決方案，在 Kotlin 中構建 [React 元件](https://kotlinlang.org/docs/js-react.html)。

## 何時選擇 Kotlin/Wasm

### 使用 Compose Multiplatform 構建跨平台應用程式

如果您想在多個平台（包括網頁）上共用邏輯和 UI，那麼 Kotlin/Wasm 結合 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 是首選方案：

* UI 體驗在不同平台之間更加一致。
* 您可以利用 Wasm 改善渲染，以及流暢、響應迅速的動畫。
* 瀏覽器對 [WasmGC](https://developer.chrome.com/blog/wasmgc) 的支援已趨於成熟，讓 Kotlin/Wasm 能夠在所有主流現代瀏覽器上以接近原生效能運行。

對於需要支援舊版瀏覽器的專案，您可以為 Compose Multiplatform 使用相容模式：在 Wasm 中構建您的 UI 以適用於現代瀏覽器，但在舊版瀏覽器上優雅地回退到 JS。您也可以在專案中於 Wasm 和 JS 目標之間共用通用邏輯。

> 仍然不確定該選擇哪條路徑？加入我們的 [Slack 社群](https://slack-chats.kotlinlang.org)，並詢問關鍵差異、效能考量以及選擇合適目標的最佳實踐。
{style="note"}