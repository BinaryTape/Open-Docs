[//]: # (title: Kotlin/Wasm 與 WASI 入門)

> Kotlin/Wasm 處於 [Alpha 階段](components-stability.md)。它可能隨時更改。
>
> [加入 Kotlin/Wasm 社群。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教學演示了如何在各種 WebAssembly 虛擬機器中，使用 [WebAssembly 系統介面 (WASI)](https://wasi.dev/) 執行一個簡單的 [Kotlin/Wasm](wasm-overview.md) 應用程式。

您可以找到應用程式在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虛擬機器上執行的範例。輸出是一個使用標準 WASI API 的簡單應用程式。

目前，Kotlin/Wasm 支援 WASI 0.1，又稱為預覽版 1 (Preview 1)。[WASI 0.2 的支援已計劃在未來版本中實現](https://youtrack.jetbrains.com/issue/KT-64568)。

> Kotlin/Wasm 工具鏈開箱即用提供 Node.js 任務 (`wasmWasiNode*`)。
> 專案中其他任務變體，例如利用 Deno 或 WasmEdge 的任務，則作為自訂任務包含在內。
>
{style="tip"}

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2.  在 IntelliJ IDEA 中，透過選擇 **檔案 | 新增 | 從版本控制建立專案**，複製 [Kotlin/Wasm WASI 範本儲存庫](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

    您也可以從命令列複製：

    ```bash
    git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
    ```

## 執行應用程式

1.  透過選擇 **檢視 | 工具視窗 | Gradle** 來開啟 **Gradle** 工具視窗。

    在 **Gradle** 工具視窗中，專案載入後，您可以在 **kotlin-wasm-wasi-example** 下找到 Gradle 任務。

    > 您需要至少 Java 11 作為您的 Gradle JVM，以便任務成功載入。
    >
    {style="note"}

2.  從 **kotlin-wasm-wasi-example | 任務 | kotlin node**，選擇並執行以下其中一個 Gradle 任務：

    *   **wasmWasiNodeRun**：在 Node.js 中執行應用程式。
    *   **wasmWasiDenoRun**：在 Deno 中執行應用程式。
    *   **wasmWasiWasmEdgeRun**：在 WasmEdge 中執行應用程式。

    > 在 Windows 平台上使用 Deno 時，請確保已安裝 `deno.exe`。欲了解更多資訊，
    > 請參閱 [Deno 的安裝文件](https://docs.deno.com/runtime/manual/getting_started/installation)。
    >
    {style="tip"}

    ![Kotlin/Wasm 和 WASI 任務](wasm-wasi-gradle-task.png){width=600}

或者，從 ` kotlin-wasm-wasi-template` 根目錄下的終端機中執行以下其中一個命令：

*   在 Node.js 中執行應用程式：

    ```bash
    ./gradlew wasmWasiNodeRun
    ```

*   在 Deno 中執行應用程式：

    ```bash
    ./gradlew wasmWasiDenoRun
    ```

*   在 WasmEdge 中執行應用程式：

    ```bash
    ./gradlew wasmWasiWasmEdgeRun
    ```

當您的應用程式成功建置時，終端機將顯示一則訊息：

![Kotlin/Wasm 和 WASI 應用程式](wasm-wasi-app-terminal.png){width=600}

## 測試應用程式

您也可以測試 Kotlin/Wasm 應用程式是否跨各種虛擬機器正常運作。

在 Gradle 工具視窗中，從 **kotlin-wasm-wasi-example | 任務 | verification** 執行以下其中一個 Gradle 任務：

*   **wasmWasiNodeTest**：在 Node.js 中測試應用程式。
*   **wasmWasiDenoTest**：在 Deno 中測試應用程式。
*   **wasmWasiWasmEdgeTest**：在 WasmEdge 中測試應用程式。

![Kotlin/Wasm 和 WASI 測試任務](wasm-wasi-testing-task.png){width=600}

或者，從 ` kotlin-wasm-wasi-template` 根目錄下的終端機中執行以下其中一個命令：

*   在 Node.js 中測試應用程式：

    ```bash
    ./gradlew wasmWasiNodeTest
    ```

*   在 Deno 中測試應用程式：

    ```bash
    ./gradlew wasmWasiDenoTest
    ```

*   在 WasmEdge 中測試應用程式：

    ```bash
    ./gradlew wasmWasiWasmEdgeTest
    ```

終端機將顯示測試結果：

![Kotlin/Wasm 和 WASI 測試](wasm-wasi-tests-results.png){width=600}

## 接下來是什麼？

在 Kotlin Slack 中加入 Kotlin/Wasm 社群：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社群" style="block"/></a>

嘗試更多 Kotlin/Wasm 範例：

*   [Compose 圖片檢視器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
*   [Jetsnack 應用程式](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
*   [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
*   [Compose 範例](https://github.com/Kotlin/kotlin-wasm-compose-template)