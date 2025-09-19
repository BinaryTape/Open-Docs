[//]: # (title: Kotlin/Wasm 和 WASI 入门)

<primary-label ref="beta"/> 

本教程演示了如何在各种 WebAssembly 虚拟机中使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 运行一个简单的 [Kotlin/Wasm](wasm-overview.md) 应用程序。

你可以找到在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虚拟机上运行的应用程序示例。输出是一个使用标准 WASI API 的简单应用程序。

目前，Kotlin/Wasm 支持 WASI 0.1，也称为 Preview 1。
[WASI 0.2 的支持计划在未来版本中提供](https://youtrack.jetbrains.com/issue/KT-64568)。

> Kotlin/Wasm 工具链开箱即用地提供了 Node.js 任务 (`wasmWasiNode*`)。
> 项目中的其他任务变体，例如利用 Deno 或 WasmEdge 的任务，则作为自定义任务包含在内。
>
{style="tip"}

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2. 通过在 IntelliJ IDEA 中选择 **File | New | Project from Version Control**，克隆 [Kotlin/Wasm WASI 模板版本库](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

   你也可以从命令行克隆它：
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 运行应用程序

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 **Gradle** 工具窗口。 
   
   项目加载后，你可以在 **Gradle** 工具窗口的 **kotlin-wasm-wasi-example** 下找到 Gradle 任务。

   > 你需要至少 Java 11 作为 Gradle JVM，任务才能成功加载。
   >
   {style="note"}

2. 在 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** 下，选择并运行以下 Gradle 任务之一：

   * **wasmWasiNodeRun**：在 Node.js 中运行应用程序。
   * **wasmWasiDenoRun**：在 Deno 中运行应用程序。
   * **wasmWasiWasmEdgeRun**：在 WasmEdge 中运行应用程序。

     > 在 Windows 平台使用 Deno 时，请确保已安装 `deno.exe`。关于更多信息，
     > 请参见 [Deno 的安装文档](https://docs.deno.com/runtime/manual/getting_started/installation)。
     >
     {style="tip"}

   ![Kotlin/Wasm 和 WASI 任务](wasm-wasi-gradle-task.png){width=600}
   
或者，从 ` kotlin-wasm-wasi-template` 根目录的终端中运行以下命令之一：

* 在 Node.js 中运行应用程序：

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* 在 Deno 中运行应用程序：

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* 在 WasmEdge 中运行应用程序：

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

当你的应用程序成功构建时，终端会显示一条消息：

![Kotlin/Wasm 和 WASI 应用程序](wasm-wasi-app-terminal.png){width=600}

## 测试应用程序

你也可以测试 Kotlin/Wasm 应用程序是否在各种虚拟机上正常工作。

在 Gradle 工具窗口中，从 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 下运行以下 Gradle 任务之一：

* **wasmWasiNodeTest**：在 Node.js 中测试应用程序。
* **wasmWasiDenoTest**：在 Deno 中测试应用程序。
* **wasmWasiWasmEdgeTest**：在 WasmEdge 中测试应用程序。

![Kotlin/Wasm 和 WASI 测试任务](wasm-wasi-testing-task.png){width=600}

或者，从 ` kotlin-wasm-wasi-template` 根目录的终端中运行以下命令之一：
    
* 在 Node.js 中测试应用程序：

  ```bash
  ./gradlew wasmWasiNodeTest
  ```
   
* 在 Deno 中测试应用程序：
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* 在 WasmEdge 中测试应用程序：

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

终端会显示测试结果：

![Kotlin/Wasm 和 WASI 测试](wasm-wasi-tests-results.png){width=600}

## 接下来做什么？

加入 Kotlin Slack 上的 Kotlin/Wasm 社区：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社区" style="block"/></a>

尝试更多 Kotlin/Wasm 示例：

* [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)