# 為 Kotlin Multiplatform 專案選擇合適的網頁目標

Kotlin Multiplatform (KMP) 提供兩種網頁開發方式：

*   基於 JavaScript (使用 Kotlin/JS 編譯器)
*   基於 WebAssembly (使用 Kotlin/Wasm 編譯器)

這兩種選項都允許您在網頁應用程式中使用共用程式碼。
然而，它們在效能、互通性、應用程式大小和目標瀏覽器支援等方面存在重要差異。
本指南將說明何時使用每個目標，以及如何透過適當的選擇來滿足您的需求。

### 快速指南

下表根據您的使用案例總結了推薦的目標：

| 使用案例                            | 推薦目標 | 理由                                                                                                                                                                                                                        |
| :---------------------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 共用業務邏輯，但使用原生 UI         | JS       | 提供與 JavaScript 直接的互通性，且開銷最小                                                                                                                                                                                     |
| 同時共用 UI 和業務邏輯              | Wasm     | 使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 渲染時提供更好的效能                                                                                                                                |
| 不可共用的 UI                       | JS       | 允許使用基於 HTML 的框架（例如 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html)）構建 UI，利用現有的 JS 生態系統和工具 |

## 何時選擇 Kotlin/JS

如果您的目標是以下情況，Kotlin/JS 將提供一個很好的解決方案：

*   [與 JavaScript/TypeScript 程式碼庫共用業務邏輯](#share-business-logic-with-a-javascript-typescript-codebase)
*   [使用 Kotlin 構建不可共用的網頁應用程式](#build-web-apps-with-kotlin-without-sharing-the-code)

### 與 JavaScript/TypeScript 程式碼庫共用業務邏輯

如果您想將 Kotlin 程式碼（例如領域或資料邏輯）與原生的 JavaScript/TypeScript 應用程式共用，
JS 目標提供：

*   與 JavaScript/TypeScript 直接的互通性。
*   互通性開銷最小（例如，沒有不必要資料複製）。這有助於您的程式碼無縫整合到基於 JS 的工作流程中。

### 使用 Kotlin 構建不可共用的網頁應用程式

對於希望使用 Kotlin 構建整個網頁應用程式的團隊，
但無意將其共用至其他平台（iOS、Android 或桌面）的情況，基於 HTML 的解決方案可能是更好的選擇。
它能改進 SEO 和無障礙性，並預設提供無縫的瀏覽器整合（例如「在頁面中尋找」功能或頁面翻譯）。
在這種情況下，Kotlin/JS 提供多種選項。您可以：

*   使用基於 Compose HTML 的框架，例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)，
    以熟悉的 Compose Multiplatform 架構構建 UI。
*   利用基於 React 的解決方案與 Kotlin 包裝器，在 [Kotlin 中構建 React 組件](https://kotlinlang.org/docs/js-react.html)。

## 何時選擇 Kotlin/Wasm

### 使用 Compose Multiplatform 構建跨平台應用程式

如果您想在多個平台（包括網頁）上共用邏輯和 UI，
結合 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 的 Kotlin/Wasm 是最佳選擇：

*   UI 體驗在不同平台之間更加一致。
*   您可以利用 Wasm 來改進渲染效果和實現流暢、響應式的動畫。
*   瀏覽器對 [WasmGC](https://developer.chrome.com/blog/wasmgc) 的支援已趨於成熟，
    允許 Kotlin/Wasm 在所有主要現代瀏覽器上以接近原生的效能運行。

對於需要支援舊瀏覽器版本的專案，您可以為 Compose Multiplatform 使用相容模式：
在 Wasm 中為現代瀏覽器構建 UI，但在舊瀏覽器上優雅地回退到 JS。
您也可以在專案中在 Wasm 和 JS 目標之間共用通用邏輯。

> 仍然不確定該選擇哪條路徑嗎？加入我們的 [Slack 社群](https://slack-chats.kotlinlang.org)
> 並詢問關於關鍵差異、效能考量以及選擇合適目標的最佳實踐。
> 
{style="note"}