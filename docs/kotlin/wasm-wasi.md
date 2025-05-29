[//]: # (title: Kotlin/Wasm 和 WASI 入门)

> Kotlin/Wasm 处于 [Alpha](components-stability.md) 阶段。它可能随时更改。
>
> [加入 Kotlin/Wasm 社区。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教程演示了如何在各种 WebAssembly 虚拟机中使用 [WebAssembly 系统接口 (WASI)](https://wasi.dev/) 运行一个简单的 [Kotlin/Wasm](wasm-overview.md) 应用程序。

你可以找到在 [Node.js](https://nodejs.org/en)、[Deno](https://deno.com/) 和 [WasmEdge](https://wasmedge.org/) 虚拟机上运行的应用程序示例。输出是一个使用标准 WASI API 的简单应用程序。

目前，Kotlin/Wasm 支持 WASI 0.1，也称为 Preview 1。[计划在未来版本中支持 WASI 0.2](https://youtrack.jetbrains.com/issue/KT-64568)。

> Kotlin/Wasm 工具链开箱即用地提供了 Node.js 任务 (`wasmWasiNode*`)。
> 项目中其他任务变体，例如那些利用 Deno 或 WasmEdge 的任务，都作为自定义任务包含在内。
>
{style="tip"}

## 开始之前

1.  下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

2.  在 IntelliJ IDEA 中选择 **文件 | 新建 | 从版本控制获取项目** 来克隆 [Kotlin/Wasm WASI 模板仓库](https://github.com/Kotlin/kotlin-wasm-wasi-template)。

    你也可以从命令行克隆它:

    ```bash
    git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
    ```

## 运行应用程序

1.  通过选择 **视图 | 工具窗口 | Gradle** 打开 **Gradle** 工具窗口。

    在 **Gradle** 工具窗口中，项目加载完成后，你可以在 **kotlin-wasm-wasi-example** 下找到 Gradle 任务。

    > 你需要至少 Java 11 作为 Gradle JVM，以便任务成功加载。
    >
    {style="note"}

2.  从 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** 中，选择并运行以下 Gradle 任务之一:

    *   **wasmWasiNodeRun** 在 Node.js 中运行应用程序。
    *   **wasmWasiDenoRun** 在 Deno 中运行应用程序。
    *   **wasmWasiWasmEdgeRun** 在 WasmEdge 中运行应用程序。

    > 在 Windows 平台上使用 Deno 时，请确保 `deno.exe` 已安装。更多信息请参阅 [Deno 的安装文档](https://docs.deno.com/runtime/manual/getting_started/installation)。
    >
    {style="tip"}

    ![Kotlin/Wasm 和 WASI 任务](wasm-wasi-gradle-task.png){width=600}

或者，在终端中从 `kotlin-wasm-wasi-template` 根目录运行以下命令之一:

*   在 Node.js 中运行应用程序:

    ```bash
    ./gradlew wasmWasiNodeRun
    ```

*   在 Deno 中运行应用程序:

    ```bash
    ./gradlew wasmWasiDenoRun
    ```

*   在 WasmEdge 中运行应用程序:

    ```bash
    ./gradlew wasmWasiWasmEdgeRun
    ```

应用程序成功构建后，终端会显示一条消息:

![Kotlin/Wasm 和 WASI 应用程序](wasm-wasi-app-terminal.png){width=600}

## 测试应用程序

你还可以测试 Kotlin/Wasm 应用程序在各种虚拟机上是否正常工作。

在 Gradle 工具窗口中，从 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 中运行以下 Gradle 任务之一:

*   **wasmWasiNodeTest** 在 Node.js 中测试应用程序。
*   **wasmWasiDenoTest** 在 Deno 中测试应用程序。
*   **wasmWasiWasmEdgeTest** 在 WasmEdge 中测试应用程序。

![Kotlin/Wasm 和 WASI 测试任务](wasm-wasi-testing-task.png){width=600}

或者，在终端中从 `kotlin-wasm-wasi-template` 根目录运行以下命令之一:

*   在 Node.js 中测试应用程序:

    ```bash
    ./gradlew wasmWasiNodeTest
    ```

*   在 Deno 中测试应用程序:

    ```bash
    ./gradlew wasmWasiDenoTest
    ```

*   在 WasmEdge 中测试应用程序:

    ```bash
    ./gradlew wasmWasiWasmEdgeTest
    ```

终端会显示测试结果:

![Kotlin/Wasm 和 WASI 测试](wasm-wasi-tests-results.png){width=600}

## 下一步

在 Kotlin Slack 中加入 Kotlin/Wasm 社区:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社区" style="block"/></a>

尝试更多 Kotlin/Wasm 示例:

*   [Compose 图片查看器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
*   [Jetsnack 应用程序](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
*   [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
*   [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)