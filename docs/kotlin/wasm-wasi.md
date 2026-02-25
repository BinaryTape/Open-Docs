[//]: # (title: Kotlin/Wasm 和 WASI 入门)

<primary-label ref="beta"/> 

本教程演示如何使用 [WebAssembly 系统接口 (WASI)](https://wasi.dev/) 在各种 WebAssembly 虚拟机中运行简单的 [Kotlin/Wasm](wasm-overview.md) 应用程序。

你可以找到在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虚拟机上运行的应用程序示例。其输出是一个使用标准 WASI API 的简单应用程序。

目前，Kotlin/Wasm 支持 WASI 0.1，也称为 Preview 1。对 WASI 0.2 的支持计划在未来版本中提供。[关注此 YouTrack 问题以获取有关 WASI 0.2 支持的更新](https://youtrack.jetbrains.com/issue/KT-64568)。 

[`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi) 目标 [默认使用新的异常处理提案](wasm-configuration.md#exception-handling-proposal)，确保与现代 WebAssembly 运行时更好的兼容性。

> Kotlin/Wasm 工具链开箱即用地提供了 Node.js 任务 (`wasmWasiNode*`)。
> 项目中的其他任务变体（例如利用 Deno 或 WasmEdge 的任务）作为自定义任务包含在内。
>
{style="tip"}

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2. 在 IntelliJ IDEA 中选择 **File | New | Project from Version Control**，克隆 [Kotlin/Wasm WASI 模板仓库](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

   你也可以通过命令行克隆它：
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 运行应用程序

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 **Gradle** 工具窗口。 
   
   项目加载后，你可以在 **Gradle** 工具窗口的 **kotlin-wasm-wasi-example** 下找到 Gradle 任务。

   > 你至少需要 Java 11 作为 Gradle JVM 才能成功加载任务。
   >
   {style="note"}

2. 从 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** 中，选择并运行以下 Gradle 任务之一：

   * **wasmWasiNodeRun** 在 Node.js 中运行应用程序。
   * **wasmWasiDenoRun** 在 Deno 中运行应用程序。
   * **wasmWasiWasmEdgeRun** 在 WasmEdge 中运行应用程序。

     > 在 Windows 平台上使用 Deno 时，请确保已安装 `deno.exe`。要了解更多信息，请参阅 [Deno 的安装文档](https://docs.deno.com/runtime/manual/getting_started/installation)。
     >
     {style="tip"}

   ![Kotlin/Wasm 和 WASI 任务](wasm-wasi-gradle-task.png){width=600}
   
或者，在终端中从 `kotlin-wasm-wasi-template` 根目录运行以下命令之一：

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

应用程序构建成功后，终端会显示一条消息：

![Kotlin/Wasm 和 WASI 应用](wasm-wasi-app-terminal.png){width=600}

## 测试应用程序

你还可以测试 Kotlin/Wasm 应用程序在各种虚拟机上是否能正常运行。

在 Gradle 工具窗口中，从 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 运行以下 Gradle 任务之一：

* **wasmWasiNodeTest** 在 Node.js 中测试应用程序。
* **wasmWasiDenoTest** 在 Deno 中测试应用程序。
* **wasmWasiWasmEdgeTest** 在 WasmEdge 中测试应用程序。

![Kotlin/Wasm 和 WASI 测试任务](wasm-wasi-testing-task.png){width=600}

或者，在终端中从 `kotlin-wasm-wasi-template` 根目录运行以下命令之一：
    
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

## 下一步

加入 Kotlin Slack 中的 Kotlin/Wasm 社区：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社区" style="block"/></a>

尝试更多 Kotlin/Wasm 示例：

* [Compose 图像查看器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack 应用程序](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)