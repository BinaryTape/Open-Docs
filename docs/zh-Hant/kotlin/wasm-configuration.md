[//]: # (title: 支援的版本與組態)

<primary-label ref="beta"/> 

本頁提供有關 [WebAssembly 提案](https://webassembly.org/roadmap/)、支援的瀏覽器，以及使用 Kotlin/Wasm 進行高效開發的組態建議詳細資訊。

## 瀏覽器版本

Kotlin/Wasm 依賴最新的 WebAssembly 提案，例如 [垃圾回收 (WasmGC)](#garbage-collection-proposal) 和 [異常處理](#exception-handling-proposal)，以在 WebAssembly 內部引入改進和新功能。

為確保這些功能正常運作，請提供一個支援最新提案的環境。
請檢查您的瀏覽器版本是否預設支援新的 WasmGC，或者您是否需要對環境進行變更。

### Chrome 

* **針對版本 119 或更新版本：**

  預設即可運作。

* **針對舊版：**

  > 若要在較舊的瀏覽器中執行應用程式，您需要使用 1.9.20 之前的 Kotlin 版本。
  >
  {style="note"}

  1. 在您的瀏覽器中，前往 `chrome://flags/#enable-webassembly-garbage-collection`。
  2. 啟用 **WebAssembly Garbage Collection**。
  3. 重新啟動您的瀏覽器。

### 基於 Chromium 的瀏覽器

包括基於 Chromium 的瀏覽器，例如 Edge、Brave、Opera 或 Samsung Internet。

* **針對版本 119 或更新版本：**

  預設即可運作。

* **針對舊版：**

   > 若要在較舊的瀏覽器中執行應用程式，您需要使用 1.9.20 之前的 Kotlin 版本。
   >
   {style="note"}

  使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

### Firefox

* **針對版本 120 或更新版本：**

  預設即可運作。

* **針對版本 119：**

  1. 在您的瀏覽器中，前往 `about:config`。
  2. 啟用 `javascript.options.wasm_gc` 選項。
  3. 重新整理頁面。

### Safari/WebKit

* **針對版本 18.2 或更新版本：**

  預設即可運作。

* **針對舊版：**

   不支援。

> Safari 18.2 適用於 iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma 和 macOS Ventura。
> 在 iOS 和 iPadOS 上，Safari 18.2 與作業系統綑綁。若要取得它，請將您的裝置更新至版本 18.2 或更新版本。
>
> 如需更多資訊，請參閱 [Safari 發行說明](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)。
>
{style="note"}

## Wasm 提案支援

Kotlin/Wasm 的改進基於 [WebAssembly 提案](https://webassembly.org/roadmap/)。您可以在此處找到有關 WebAssembly 垃圾回收和（舊版）異常處理提案支援的詳細資訊。

### 垃圾回收提案

自 Kotlin 1.9.20 起，Kotlin 工具鏈使用最新版本的 [Wasm 垃圾回收](https://github.com/WebAssembly/gc) (WasmGC) 提案。

因此，我們強烈建議您將 Wasm 專案更新至最新版本的 Kotlin。我們也建議您在 Wasm 環境中使用最新版本的瀏覽器。

### 異常處理提案

Kotlin 工具鏈預設使用 [舊版異常處理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)，這允許在更廣泛的環境中執行所產生的 Wasm 二進位檔。

自 Kotlin 2.0.0 起，我們已在 Kotlin/Wasm 中引入對新版 Wasm [異常處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 的支援。

此更新確保新的異常處理提案符合 Kotlin 的要求，使 Kotlin/Wasm 能夠在僅支援最新版本提案的虛擬機器上使用。

新的異常處理提案透過 `-Xwasm-use-new-exception-proposal` 編譯器選項啟用。它預設為關閉。

<p>&nbsp;</p>

> 透過我們的 [Kotlin/Wasm 範例](https://github.com/Kotlin/kotlin-wasm-examples#readme)，了解更多關於專案設定、使用依賴項及其他任務的資訊。
>
{style="tip"}

## 使用預設匯入

[將 Kotlin/Wasm 程式碼匯入 Javascript](wasm-js-interop.md) 已轉變為具名匯出，不再使用預設匯出。

如果您仍然想使用預設匯入，請產生一個新的 JavaScript 包裝模組。建立一個包含以下片段的 `.mjs` 檔案：

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

您可以將新的 `.mjs` 檔案放置在資源資料夾中，它將在建構過程中自動與主 `.mjs` 檔案一同放置。

您也可以將 `.mjs` 檔案放置在自訂位置。在這種情況下，您需要手動將其移至主 `.mjs` 檔案旁邊，或者調整匯入語句中的路徑以符合其位置。

## Kotlin/Wasm 編譯緩慢

在處理 Kotlin/Wasm 專案時，您可能會遇到編譯時間緩慢的問題。這是因為 Kotlin/Wasm 工具鏈會在您每次進行變更時重新編譯整個程式碼庫。

為緩解此問題，Kotlin/Wasm 目標支援增量編譯，這使編譯器能夠僅重新編譯與上次編譯以來的變更相關的檔案。

使用增量編譯可減少編譯時間。目前它能使開發速度提高一倍，並計劃在未來版本中進一步改進。

在目前的設定中，Wasm 目標的增量編譯預設為停用。
要啟用它，請將以下行新增至您專案的 `local.properties` 或 `gradle.properties` 檔案中：

```text
kotlin.incremental.wasm=true
```

> 試用 Kotlin/Wasm 增量編譯並 [分享您的回饋](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
> 您的見解有助於讓此功能更早穩定並預設啟用。
>
{style="note"}

## 完整限定類別名稱中的診斷

在 Kotlin/Wasm 上，編譯器預設不會在產生的二進位檔中儲存類別的完整限定名稱 (FQNs)，以避免增加應用程式大小。

因此，除非您明確啟用完整限定名稱功能，否則當您在 Kotlin/Wasm 專案中呼叫 `KClass::qualifiedName` 屬性時，編譯器會報告錯誤。

此診斷預設為啟用，且錯誤會自動報告。若要停用此診斷並允許 Kotlin/Wasm 中的 `qualifiedName`，請透過將以下選項新增至您的 `build.gradle.kts` 檔案中，指示編譯器儲存所有類別的完整限定名稱：

```kotlin
// build.gradle.kts
kotlin {
   wasmJs {
       ...
       compilerOptions {
           freeCompilerArgs.add("-Xwasm-kclass-fqn")
       }
   }
}
```

請記住，啟用此選項會增加應用程式大小。

## 陣列越界存取與陷阱

在 Kotlin/Wasm 中，以超出其界限的索引存取陣列會觸發 WebAssembly 陷阱，而非常規的 Kotlin 異常。此陷阱會立即停止目前的執行堆疊。

在 JavaScript 環境中執行時，這些陷阱會顯示為 `WebAssembly.RuntimeError`，並可在 JavaScript 端被捕獲。

您可以在連結可執行檔時，透過在命令列中使用以下編譯器選項，來避免 Kotlin/Wasm 環境中的此類陷阱：

```
-Xwasm-enable-array-range-checks
```

或將其新增至您的 Gradle 建構檔案的 `compilerOptions {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

啟用此編譯器選項後，將會拋出 `IndexOutOfBoundsException`，而非陷阱。

請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-73452/K-Wasm-turning-on-range-checks-by-default) 中查看更多詳細資訊並分享您的回饋。

## 實驗性註解

Kotlin/Wasm 提供了多個用於一般 WebAssembly 互通性的實驗性註解。

[`@WasmImport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-import/) 和 [`@WasmExport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-export/) 允許您呼叫在 Kotlin/Wasm 模組外部定義的函式，並分別將 Kotlin 函式公開給主機或其他 Wasm 模組。

由於這些機制仍在演進中，所有註解都被標記為實驗性。
您必須明確地 [選用啟用才能使用它們](opt-in-requirements.md)，其設計或行為在未來的 Kotlin 版本中可能會有所變更。

## 除錯期間的重新載入

在 [現代瀏覽器](#browser-versions) 中 [除錯](wasm-debugging.md) 您的應用程式即可直接運作。
當您執行開發 Gradle 任務 (`*DevRun`) 時，Kotlin 會自動將原始碼檔案提供給瀏覽器。

然而，預設提供原始碼可能會導致 [在 Kotlin 編譯和綑綁完成之前，應用程式在瀏覽器中重複重新載入](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)。
作為一個權宜之計，請調整您的 webpack 設定以忽略 Kotlin 原始碼檔案，並停用對提供靜態檔案的監控。在專案根目錄的 `webpack.config.d` 資料夾中新增一個包含以下內容的 `.js` 檔案：

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
            return {
                directory: file,
                watch: false,
            }
        } else {
            return file
        }
    })
}
```