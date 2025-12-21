[//]: # (title: Kotlin/Wasm 和 WASI 入門)

<primary-label ref="beta"/> 

本教學示範如何使用 [WebAssembly 系統介面 (WASI)](https://wasi.dev/) 在各種 WebAssembly 虛擬機器中執行一個簡單的 [Kotlin/Wasm](wasm-overview.md) 應用程式。

您可以在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虛擬機器上找到應用程式執行的範例。輸出是一個使用標準 WASI API 的簡單應用程式。

目前，Kotlin/Wasm 支援 WASI 0.1，也稱為 Preview 1。[WASI 0.2 的支援計劃在未來版本中推出](https://youtrack.jetbrains.com/issue/KT-64568)。

[`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi) 目標平台預設使用 [新的例外處理提案](wasm-configuration.md#exception-handling-proposal)，確保與現代 WebAssembly 執行環境有更好的相容性。

> Kotlin/Wasm 工具鏈提供開箱即用的 Node.js 任務 (`wasmWasiNode*`)。
> 專案中的其他任務變體，例如利用 Deno 或 WasmEdge 的那些，都作為自訂任務包含在內。
>
{style="tip"}

## 開始之前

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2. 透過在 IntelliJ IDEA 中選擇 **File | New | Project from Version Control**，複製 [Kotlin/Wasm WASI 模板儲存庫](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

   您也可以從命令列複製它：
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 執行應用程式

1. 透過選擇 **View | Tool Windows | Gradle**，打開 **Gradle** 工具視窗。
   
   在 **Gradle** 工具視窗中，您可以在專案載入後於 **kotlin-wasm-wasi-example** 下找到 Gradle 任務。

   > 您需要至少 Java 11 作為您的 Gradle JVM，才能成功載入任務。
   >
   {style="note"}

2. 從 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node**，選擇並執行以下其中一個 Gradle 任務：

   * **wasmWasiNodeRun** 以在 Node.js 中執行應用程式。
   * **wasmWasiDenoRun** 以在 Deno 中執行應用程式。
   * **wasmWasiWasmEdgeRun** 以在 WasmEdge 中執行應用程式。

     > 在 Windows 平台上使用 Deno 時，請確保已安裝 `deno.exe`。欲了解更多資訊，
     > 請參閱 [Deno 的安裝文件](https://docs.deno.com/runtime/manual/getting_started/installation)。
     >
     {style="tip"}

   ![Kotlin/Wasm and WASI tasks](wasm-wasi-gradle-task.png){width=600}
   
或者，在終端機中從 `kotlin-wasm-wasi-template` 根目錄執行以下其中一個命令：

* 在 Node.js 中執行應用程式：

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* 在 Deno 中執行應用程式：

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* 在 WasmEdge 中執行應用程式：

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

終端機在您的應用程式成功建置後會顯示一則訊息：

![Kotlin/Wasm and WASI app](wasm-wasi-app-terminal.png){width=600}

## 測試應用程式

您也可以測試 Kotlin/Wasm 應用程式是否在各種虛擬機器中正常運作。

在 Gradle 工具視窗中，從 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 執行以下其中一個 Gradle 任務：

* **wasmWasiNodeTest** 以在 Node.js 中測試應用程式。
* **wasmWasiDenoTest** 以在 Deno 中測試應用程式。
* **wasmWasiWasmEdgeTest** 以在 WasmEdge 中測試應用程式。

![Kotlin/Wasm and WASI test tasks](wasm-wasi-testing-task.png){width=600}

或者，在終端機中從 `kotlin-wasm-wasi-template` 根目錄執行以下其中一個命令：
    
* 在 Node.js 中測試應用程式：

  ```bash
  ./gradlew wasmWasiNodeTest
  ```
   
* 在 Deno 中測試應用程式：
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* 在 WasmEdge 中測試應用程式：

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

終端機顯示測試結果：

![Kotlin/Wasm and WASI test](wasm-wasi-tests-results.png){width=600}

## 接下來是什麼？

在 Kotlin Slack 中加入 Kotlin/Wasm 社群：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

嘗試更多 Kotlin/Wasm 範例：

* [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)