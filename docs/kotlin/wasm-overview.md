[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasm 能够将您的 Kotlin 代码编译为 [WebAssembly (Wasm)](https://webassembly.org/) 格式。
借助 Kotlin/Wasm，您可以创建可在不同环境和设备上运行的应用程序，这些环境和设备支持 Wasm 并满足 Kotlin 的要求。

Wasm 是一种用于基于栈的虚拟机的二进制指令格式。
这种格式是平台无关的，因为它在其自己的虚拟机上运行。Wasm 为 Kotlin 和其他语言提供了编译目标。

您可以在不同的目标环境中使用 Kotlin/Wasm，例如在浏览器中开发使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 构建的 Web 应用程序，或在浏览器外部的独立 Wasm 虚拟机中运行。在浏览器外部的情况下，[WebAssembly System Interface (WASI)](https://wasi.dev/) 提供平台 API 访问，您也可以利用这些 API。

> 要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序，您的用户需要一个支持 WebAssembly 垃圾回收和旧式异常处理提案的 [浏览器版本](wasm-configuration.md#browser-versions)。要查看浏览器支持状态，请参阅 [WebAssembly 路线图](https://webassembly.org/roadmap/)。
>
{style="tip"}

## Kotlin/Wasm 与 Compose Multiplatform

借助 Kotlin，您能够通过 Compose Multiplatform 和 Kotlin/Wasm 构建应用程序，并在您的 Web 项目中复用移动和桌面用户界面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一个基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的声明式框架，它允许您实现一次 UI，并在您面向的所有平台上共享。

对于 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作为其编译目标。使用 Kotlin/Wasm 和 Compose Multiplatform 构建的应用程序使用 `wasm-js` 目标并在浏览器中运行。

[探索我们使用 Compose Multiplatform 和 Kotlin/Wasm 构建的应用程序在线演示](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm demo](wasm-demo.png){width=700}

此外，您可以开箱即用地在 Kotlin/Wasm 中使用最流行的 Kotlin 库。与其他 Kotlin 和多平台项目一样，您可以在构建脚本中添加依赖项声明。更多信息，请参阅 [添加多平台库依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)。

想亲自尝试吗？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="开始使用 Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm 与 WASI

Kotlin/Wasm 使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 来构建服务器端应用程序。
使用 Kotlin/Wasm 和 WASI 构建的应用程序使用 Wasm-WASI 目标，允许您调用 WASI API 并在浏览器环境外部运行应用程序。

Kotlin/Wasm 利用 WASI 抽象平台特有的细节，使相同的 Kotlin 代码能够在不同的平台上运行。这扩展了 Kotlin/Wasm 的覆盖范围到 Web 应用程序之外，而无需为每个运行时进行自定义处理。

WASI 提供了一个安全的标准接口，用于在不同环境中运行编译为 WebAssembly 的 Kotlin 应用程序。

> 要查看 Kotlin/Wasm 和 WASI 的实际应用，请查阅 [Kotlin/Wasm 和 WASI 入门教程](wasm-wasi.md)。
>
{style="tip"}

## Kotlin/Wasm 性能

尽管 Kotlin/Wasm 仍处于 Beta 阶段，但运行在 Kotlin/Wasm 上的 Compose Multiplatform 已经展现出令人鼓舞的性能特性。您可以看到其执行速度优于 JavaScript 并正在接近 JVM 的性能：

![Kotlin/Wasm performance](wasm-performance-compose.png){width=700}

我们定期运行 Kotlin/Wasm 的基准测试，这些结果来自我们在最新版 Google Chrome 中的测试。

## 浏览器 API 支持

Kotlin/Wasm 标准库提供了浏览器 API 的声明，包括 DOM API。
通过这些声明，您可以直接使用 Kotlin API 访问和利用各种浏览器功能。
例如，在您的 Kotlin/Wasm 应用程序中，您可以操作 DOM 元素或 fetch API，而无需从头定义这些声明。要了解更多信息，请参阅我们的 [Kotlin/Wasm 浏览器示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)。

浏览器 API 支持的声明是使用 JavaScript [互操作能力](wasm-js-interop.md) 定义的。
您可以使用相同的功能来定义您自己的声明。此外，Kotlin/Wasm-JavaScript 互操作性允许您从 JavaScript 中使用 Kotlin 代码。更多信息，请参阅 [在 JavaScript 中使用 Kotlin 代码](wasm-js-interop.md#use-kotlin-code-in-javascript)。

## 留下反馈

### Kotlin/Wasm 反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并直接在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中向开发者提供反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中报告任何问题。

### Compose Multiplatform 反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack：在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公共频道中提供反馈。
* [在 GitHub 中报告任何问题](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放列表](https://kotl.in/wasm-pl) 中了解更多关于 Kotlin/Wasm 的信息。
* 在我们的 GitHub 版本库中探索 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples)。