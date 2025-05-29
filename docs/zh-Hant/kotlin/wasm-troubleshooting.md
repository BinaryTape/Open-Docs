[//]: # (title: 疑難排解)

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段。它可能隨時更改。請在非生產環境場景中使用。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供回饋。
>
{style="note"}

Kotlin/Wasm 仰賴新的 [WebAssembly 提案](https://webassembly.org/roadmap/)，例如[垃圾回收](#garbage-collection-proposal)和[例外處理](#exception-handling-proposal)，以在 WebAssembly 中引入改進和新功能。

然而，為確保這些功能正常運作，您需要一個支援新提案的環境。在某些情況下，您可能需要設定環境使其與提案相容。

## 瀏覽器版本

若要在瀏覽器中執行使用 Kotlin/Wasm 建置的應用程式，您需要支援新的 [WebAssembly 垃圾回收 (WasmGC) 功能](https://github.com/WebAssembly/gc)的瀏覽器版本。請檢查瀏覽器版本是否預設支援新的 WasmGC，或者您是否需要對環境進行更改。

### Chrome

*   **對於版本 119 或更新版本：**

    預設即可運作。

*   **對於舊版本：**

    > 若要在舊版瀏覽器中執行應用程式，您需要使用 1.9.20 之前的 Kotlin 版本。
    >
    {style="note"}

    1.  在您的瀏覽器中，前往 `chrome://flags/#enable-webassembly-garbage-collection`。
    2.  啟用 **WebAssembly 垃圾回收**。
    3.  重新啟動您的瀏覽器。

### 基於 Chromium 的瀏覽器

包括基於 Chromium 的瀏覽器，例如 Edge、Brave、Opera 或 Samsung Internet。

*   **對於版本 119 或更新版本：**

    預設即可運作。

*   **對於舊版本：**

    > 若要在舊版瀏覽器中執行應用程式，您需要使用 1.9.20 之前的 Kotlin 版本。
    >
    {style="note"}

    使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

### Firefox

*   **對於版本 120 或更新版本：**

    預設即可運作。

*   **對於版本 119：**

    1.  在您的瀏覽器中，前往 `about:config`。
    2.  啟用 `javascript.options.wasm_gc` 選項。
    3.  重新整理頁面。

### Safari/WebKit

*   **對於版本 18.2 或更新版本：**

    預設即可運作。

*   **對於舊版本：**

    不支援。

> Safari 18.2 適用於 iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma 和 macOS Ventura。
> 在 iOS 和 iPadOS 上，Safari 18.2 與作業系統捆綁。要獲取它，請將您的裝置更新到 18.2 或更高版本。
>
> 欲了解更多資訊，請參閱 [Safari 版本說明](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)。
>
{style="note"}

## Wasm 提案支援

Kotlin/Wasm 的改進基於 [WebAssembly 提案](https://webassembly.org/roadmap/)。您可以在此處找到 WebAssembly 的垃圾回收和（舊版）例外處理提案支援的詳細資訊。

### 垃圾回收提案

自 Kotlin 1.9.20 起，Kotlin 工具鏈使用最新版本的 [Wasm 垃圾回收](https://github.com/WebAssembly/gc) (WasmGC) 提案。

因此，我們強烈建議您將 Wasm 專案更新到最新版本的 Kotlin。我們也建議您使用配備 Wasm 環境的最新版本瀏覽器。

### 例外處理提案

Kotlin 工具鏈預設使用[舊版例外處理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)，這允許在更廣泛的環境中執行產生的 Wasm 二進位檔。

自 Kotlin 2.0.0 起，我們在 Kotlin/Wasm 中引入了對 Wasm [例外處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)新版本的支援。

此更新確保新的例外處理提案與 Kotlin 要求一致，從而能夠在僅支援該提案最新版本的虛擬機器上使用 Kotlin/Wasm。

新的例外處理提案透過 `-Xwasm-use-new-exception-proposal` 編譯器選項啟用。它預設是關閉的。

<p>&nbsp;</p>

> 透過我們的 [Kotlin/Wasm 範例](https://github.com/Kotlin/kotlin-wasm-examples#readme)了解更多關於專案設定、使用依賴項和其他任務的資訊。
>
{style="tip"}

## 使用預設匯入

[將 Kotlin/Wasm 程式碼匯入 Javascript](wasm-js-interop.md) 已轉變為具名匯出 (named exports)，不再使用預設匯出 (default exports)。

如果您仍想使用預設匯入，請產生一個新的 JavaScript 包裝模組。建立一個包含以下程式碼片段的 `.mjs` 檔案：

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

您可以將新的 `.mjs` 檔案放置在資源資料夾中，它將在建置過程中自動放置在主 `.mjs` 檔案旁邊。

您也可以將 `.mjs` 檔案放置在自訂位置。在這種情況下，您需要手動將其移動到主 `.mjs` 檔案旁邊，或者調整匯入語句中的路徑以匹配其位置。

## Kotlin/Wasm 編譯速度緩慢

在處理 Kotlin/Wasm 專案時，您可能會遇到編譯時間緩慢的問題。這是因為 Kotlin/Wasm 工具鏈在每次進行更改時都會重新編譯整個程式碼庫。

為了緩解此問題，Kotlin/Wasm 目標支援增量編譯 (incremental compilation)，這使編譯器能夠僅重新編譯與上次編譯後所做更改相關的檔案。

使用增量編譯可縮短編譯時間。目前它能使開發速度提高一倍，並計劃在未來版本中進一步改進。

在目前的設定中，Wasm 目標的增量編譯預設是禁用的。
要啟用它，請將以下行新增到您專案的 `local.properties` 或 `gradle.properties` 檔案中：

```text
kotlin.incremental.wasm=true
```

> 試用 Kotlin/Wasm 增量編譯並[分享您的回饋](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。您的見解有助於使此功能更快地穩定並預設啟用。
>
{style="note"}