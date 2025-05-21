---
title: "開始使用 Kotlin/Wasm 和 WASI"
---
:::note
Kotlin/Wasm 處於 [Alpha](components-stability) 階段。它可能隨時變更。

[加入 Kotlin/Wasm 社群。](https://slack-chats.kotlinlang.org/c/webassembly)

:::

本教學示範如何在各種 WebAssembly 虛擬機器中使用 [WebAssembly 系統介面 (WASI)](https://wasi.dev/) 執行簡單的 [Kotlin/Wasm](wasm-overview) 應用程式。

您可以找到在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虛擬機器上執行的應用程式範例。 輸出是一個使用標準 WASI API 的簡單應用程式。

目前，Kotlin/Wasm 支援 WASI 0.1，也稱為 Preview 1。
[計劃在未來版本中支援 WASI 0.2](https://youtrack.jetbrains.com/issue/KT-64568)。

:::tip
Kotlin/Wasm 工具鏈提供了開箱即用的 Node.js 任務 (`wasmWasiNode*`)。
專案中的其他任務變體（例如使用 Deno 或 WasmEdge 的變體）作為自訂任務包含在內。

:::

## 開始之前

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2. 透過在 IntelliJ IDEA 中選擇**File | New | Project from Version Control**來克隆 [Kotlin/Wasm WASI 範本儲存庫](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

   您也可以從命令行克隆它：
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 執行應用程式

1. 透過選擇 **View | Tool Windows | Gradle** 來開啟 **Gradle** 工具視窗。
   
   在 **Gradle** 工具視窗中，專案載入後，您可以在 **kotlin-wasm-wasi-example** 下找到 Gradle 任務。

   > 您至少需要 Java 11 作為 Gradle JVM 才能成功載入任務。
   >
   

2. 從 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** 中，選擇並執行以下 Gradle 任務之一：

   * **wasmWasiNodeRun** 以在 Node.js 中執行應用程式。
   * **wasmWasiDenoRun** 以在 Deno 中執行應用程式。
   * **wasmWasiWasmEdgeRun** 以在 WasmEdge 中執行應用程式。

     > 在 Windows 平台上使用 Deno 時，請確保已安裝 `deno.exe`。 如需更多資訊，
     > 請參閱 [Deno 的安裝文件](https://docs.deno.com/runtime/manual/getting_started/installation)。
     >
     

   <img src="/img/wasm-wasi-gradle-task.png" alt="Kotlin/Wasm and WASI tasks" width="600" style={{verticalAlign: 'middle'}}/>
   
或者，從 ` kotlin-wasm-wasi-template` 根目錄在終端機中執行以下指令之一：

* 若要在 Node.js 中執行應用程式：

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* 若要在 Deno 中執行應用程式：

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* 若要在 WasmEdge 中執行應用程式：

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

終端機會在您的應用程式成功建置時顯示一則訊息：

<img src="/img/wasm-wasi-app-terminal.png" alt="Kotlin/Wasm and WASI app" width="600" style={{verticalAlign: 'middle'}}/>

## 測試應用程式

您也可以測試 Kotlin/Wasm 應用程式是否能在各種虛擬機器上正常運作。

在 Gradle 工具視窗中，從 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 執行以下 Gradle 任務之一：

* **wasmWasiNodeTest** 以在 Node.js 中測試應用程式。
* **wasmWasiDenoTest** 以在 Deno 中測試應用程式。
* **wasmWasiWasmEdgeTest** 以在 WasmEdge 中測試應用程式。

<img src="/img/wasm-wasi-testing-task.png" alt="Kotlin/Wasm and WASI test tasks" width="600" style={{verticalAlign: 'middle'}}/>

或者，從 ` kotlin-wasm-wasi-template` 根目錄在終端機中執行以下指令之一：
    
* 若要在 Node.js 中測試應用程式：

  ```bash
  ./gradlew wasmWasiNodeTest
  ```
   
* 若要在 Deno 中測試應用程式：
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* 若要在 WasmEdge 中測試應用程式：

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

終端機會顯示測試結果：

<img src="/img/wasm-wasi-tests-results.png" alt="Kotlin/Wasm and WASI test" width="600" style={{verticalAlign: 'middle'}}/>

## 接下來做什麼？

在 Kotlin Slack 中加入 Kotlin/Wasm 社群：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

嘗試更多 Kotlin/Wasm 範例：

* [Compose 圖片檢視器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack 應用程式](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose 範例](https://github.com/Kotlin/kotlin-wasm-compose-template)
  ```