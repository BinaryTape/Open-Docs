[//]: # (title: 疑難排解)

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段。它可能隨時變更。請在非生產環境場景下使用。
> 我們很樂意收到您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中的回饋。
>
{style="note"}

Kotlin/Wasm 依賴於新的 [WebAssembly 提案](https://webassembly.org/roadmap/)，例如 [垃圾回收](#garbage-collection-proposal) 和 [例外處理](#exception-handling-proposal)，以引入 WebAssembly 中的改進和新功能。

然而，為了確保這些功能正常運作，您需要一個支援這些新提案的環境。在某些情況下，您可能需要設定環境以使其與提案相容。

## 瀏覽器版本

要在瀏覽器中執行使用 Kotlin/Wasm 建置的應用程式，您需要一個支援新的 [WebAssembly 垃圾回收 (WasmGC) 功能](https://github.com/WebAssembly/gc) 的瀏覽器版本。請檢查您的瀏覽器版本是否預設支援新的 WasmGC，或者您是否需要對環境進行更改。

### Chrome

* **對於版本 119 或更高版本：**

  預設情況下即可運作。

* **對於舊版本：**

  > 若要在較舊的瀏覽器中執行應用程式，您需要使用 1.9.20 之前的 Kotlin 版本。
  >
  {style="note"}

  1. 在瀏覽器中，前往 `chrome://flags/#enable-webassembly-garbage-collection`。
  2. 啟用 **WebAssembly 垃圾回收**。
  3. 重新啟動瀏覽器。

### 基於 Chromium 的瀏覽器

包括基於 Chromium 的瀏覽器，例如 Edge、Brave、Opera 或 Samsung Internet。

* **對於版本 119 或更高版本：**

  預設情況下即可運作。

* **對於舊版本：**

   > 若要在較舊的瀏覽器中執行應用程式，您需要使用 1.9.20 之前的 Kotlin 版本。
   >
   {style="note"}

  使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

### Firefox

* **對於版本 120 或更高版本：**

  預設情況下即可運作。

* **對於版本 119：**

  1. 在瀏覽器中，前往 `about:config`。
  2. 啟用 `javascript.options.wasm_gc` 選項。
  3. 重新整理頁面。

### Safari/WebKit

* **對於版本 18.2 或更高版本：**

  預設情況下即可運作。

* **對於舊版本：**

   不支援。

> Safari 18.2 適用於 iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma 和 macOS Ventura。
> 在 iOS 和 iPadOS 上，Safari 18.2 隨作業系統綑綁。若要取得它，請將您的裝置更新至版本 18.2 或更高版本。
>
> 更多資訊請參閱 [Safari 發行說明](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)。
>
{style="note"}

## Wasm 提案支援

Kotlin/Wasm 的改進基於 [WebAssembly 提案](https://webassembly.org/roadmap/)。您可以在此處找到有關 WebAssembly 垃圾回收和 (傳統) 例外處理提案支援的詳細資訊。

### 垃圾回收提案

自 Kotlin 1.9.20 起，Kotlin 工具鏈使用最新版本的 [Wasm 垃圾回收](https://github.com/WebAssembly/gc) (WasmGC) 提案。

因此，我們強烈建議您將 Wasm 專案更新到最新版本的 Kotlin。我們也建議您使用搭配 Wasm 環境的最新版本瀏覽器。

### 例外處理提案

Kotlin 工具鏈預設使用 [傳統例外處理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)，這允許在更廣泛的環境中執行生成的 Wasm 二進位檔。

自 Kotlin 2.0.0 起，我們在 Kotlin/Wasm 中引入了對新版本 Wasm [例外處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 的支援。

此更新確保新的例外處理提案與 Kotlin 要求保持一致，使得能夠在僅支援該提案最新版本的虛擬機器上使用 Kotlin/Wasm。

新的例外處理提案使用 `-Xwasm-use-new-exception-proposal` 編譯器選項啟用。它預設為關閉狀態。

<p>&nbsp;</p>

> 透過我們的 [Kotlin/Wasm 範例](https://github.com/Kotlin/kotlin-wasm-examples#readme) 了解更多關於專案設定、使用依賴項和其他任務的資訊。
>
{style="tip"}

## 使用預設導入

[將 Kotlin/Wasm 程式碼導入 JavaScript](wasm-js-interop.md) 已轉向具名匯出，不再使用預設匯出。

如果您仍然想使用預設導入，請生成一個新的 JavaScript 包裝模組。建立一個 `.mjs` 檔案，其中包含以下程式碼片段：

```Javascript
// 指定主 .mjs 檔案的路徑
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

您可以將新的 `.mjs` 檔案放置在資源資料夾中，它將在建置過程中自動放置在主 `.mjs` 檔案旁。

您也可以將 `.mjs` 檔案放置在自訂位置。在這種情況下，您需要手動將其移動到主 `.mjs` 檔案旁，或調整導入陳述式中的路徑以匹配其位置。

## Kotlin/Wasm 編譯速度緩慢

在處理 Kotlin/Wasm 專案時，您可能會遇到編譯時間緩慢的問題。這是因為 Kotlin/Wasm 工具鏈會在您每次進行更改時重新編譯整個程式碼庫。

為了緩解這個問題，Kotlin/Wasm 目標支援增量編譯，這使編譯器能夠僅重新編譯與上次編譯以來的更改相關的檔案。

使用增量編譯縮短了編譯時間。它目前將開發速度提高了一倍，並計劃在未來版本中進一步改進。

在目前設定中，Wasm 目標的增量編譯預設是停用的。
若要啟用它，請將以下行新增到您的專案的 `local.properties` 或 `gradle.properties` 檔案中：

```text
kotlin.incremental.wasm=true
```

> 試用 Kotlin/Wasm 增量編譯並 [分享您的回饋](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。您的見解有助於使該功能更穩定並更快地預設啟用。
>
{style="note"}