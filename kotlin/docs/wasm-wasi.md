---
title: "Kotlin/Wasm 和 WASI 入门"
---
:::note
Kotlin/Wasm 处于 [Alpha](components-stability) 阶段。它可能随时更改。

[加入 Kotlin/Wasm 社区](https://slack-chats.kotlinlang.org/c/webassembly)。

:::

本教程演示了如何在各种 WebAssembly 虚拟机中使用 [WebAssembly 系统接口 (WASI)](https://wasi.dev/) 运行一个简单的 [Kotlin/Wasm](wasm-overview) 应用程序。

你可以找到在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虚拟机上运行的应用程序示例。该输出是一个使用标准 WASI API 的简单应用程序。

目前，Kotlin/Wasm 支持 WASI 0.1，也称为 Preview 1。[对 WASI 0.2 的支持计划在未来的版本中实现](https://youtrack.jetbrains.com/issue/KT-64568)。

:::tip
Kotlin/Wasm 工具链提供了开箱即用的 Node.js 任务 (`wasmWasiNode*`)。
项目中其他任务变体（例如使用 Deno 或 WasmEdge 的任务变体）则作为自定义任务包含在内。

:::

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2. 通过在 IntelliJ IDEA 中选择 **File | New | Project from Version Control**，克隆 [Kotlin/Wasm WASI 模板存储库](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

   你也可以从命令行克隆它：

   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 运行应用程序

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 **Gradle** 工具窗口。

   在 **Gradle** 工具窗口中，项目加载后，你可以在 **kotlin-wasm-wasi-example** 下找到 Gradle 任务。

   > 你至少需要 Java 11 作为 Gradle JVM 才能成功加载这些任务。
   >

2. 从 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** 中，选择并运行以下 Gradle 任务之一：

   * **wasmWasiNodeRun** 以在 Node.js 中运行应用程序。
   * **wasmWasiDenoRun** 以在 Deno 中运行应用程序。
   * **wasmWasiWasmEdgeRun** 以在 WasmEdge 中运行应用程序。

     > 在 Windows 平台上使用 Deno 时，请确保已安装 `deno.exe`。有关更多信息，请参阅 [Deno 的安装文档](https://docs.deno.com/runtime/manual/getting_started/installation)。
     >

   <img src="/img/wasm-wasi-gradle-task.png" alt="Kotlin/Wasm and WASI tasks" width="600" style={{verticalAlign: 'middle'}}/>

或者，在终端中从 ` kotlin-wasm-wasi-template` 根目录运行以下命令之一：

* 若要在 Node.js 中运行该应用程序：

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* 若要在 Deno 中运行该应用程序：

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* 若要在 WasmEdge 中运行该应用程序：

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

当你的应用程序成功构建时，终端会显示一条消息：

<img src="/img/wasm-wasi-app-terminal.png" alt="Kotlin/Wasm and WASI app" width="600" style={{verticalAlign: 'middle'}}/>

## 测试应用程序

你还可以测试 Kotlin/Wasm 应用程序在各种虚拟机上是否正常工作。

在 Gradle 工具窗口中，从 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 运行以下 Gradle 任务之一：

* **wasmWasiNodeTest** 以在 Node.js 中测试应用程序。
* **wasmWasiDenoTest** 以在 Deno 中测试应用程序。
* **wasmWasiWasmEdgeTest** 以在 WasmEdge 中测试应用程序。

<img src="/img/wasm-wasi-testing-task.png" alt="Kotlin/Wasm and WASI test tasks" width="600" style={{verticalAlign: 'middle'}}/>

或者，在终端中从 ` kotlin-wasm-wasi-template` 根目录运行以下命令之一：

* 若要在 Node.js 中测试该应用程序：

  ```bash
  ./gradlew wasmWasiNodeTest
  ```

* 若要在 Deno 中测试该应用程序：

  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* 若要在 WasmEdge 中测试该应用程序：

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

终端显示测试结果：

<img src="/img/wasm-wasi-tests-results.png" alt="Kotlin/Wasm and WASI test" width="600" style={{verticalAlign: 'middle'}}/>

## 接下来做什么？

在 Kotlin Slack 中加入 Kotlin/Wasm 社区：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

尝试更多 Kotlin/Wasm 示例：

* [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)
  ```