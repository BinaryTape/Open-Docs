[//]: # (title: Kotlin/Wasm)

> Kotlin/Wasm 处于 [Alpha 版](components-stability.md)。
> 它可能随时更改。您可以在生产环境前的场景中使用它。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供反馈。
>
> [加入 Kotlin/Wasm 社区](https://slack-chats.kotlinlang.org/c/webassembly)。
>
{style="note"}

Kotlin/Wasm 能够将您的 Kotlin 代码编译成 [WebAssembly (Wasm)](https://webassembly.org/) 格式。借助 Kotlin/Wasm，您可以创建能够在支持 Wasm 并满足 Kotlin 要求的不同环境和设备上运行的应用程序。

Wasm 是一种基于栈式虚拟机的二进制指令格式。这种格式是平台无关的，因为它运行在自己的虚拟机上。Wasm 为 Kotlin 和其他语言提供了一个编译目标。

您可以在不同的目标环境中使用 Kotlin/Wasm，例如在浏览器中开发基于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 构建的 Web 应用程序，或者在浏览器之外的独立的 Wasm 虚拟机中运行。在浏览器之外的场景中，[WebAssembly 系统接口 (WASI)](https://wasi.dev/) 提供了对平台 API 的访问，您也可以加以利用。

## Kotlin/Wasm 与 Compose Multiplatform

借助 Kotlin，您可以通过 Compose Multiplatform 和 Kotlin/Wasm 在您的 Web 项目中构建应用程序并重用移动和桌面用户界面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一个基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的声明式框架，它允许您一次实现 UI 并在所有目标平台共享。

对于 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作为其编译目标。使用 Kotlin/Wasm 和 Compose Multiplatform 构建的应用程序使用 `wasm-js` 目标并在浏览器中运行。

[探索我们使用 Compose Multiplatform 和 Kotlin/Wasm 构建的应用程序在线演示](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm 演示](wasm-demo.png){width=700}

> 要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序，您需要一个支持新的垃圾回收和旧版异常处理提案的浏览器版本。要检查浏览器支持状态，请参阅 [WebAssembly 路线图](https://webassembly.org/roadmap/)。
>
{style="tip"}

此外，您可以在 Kotlin/Wasm 中开箱即用地使用最流行的 Kotlin 库。与其他 Kotlin 和多平台项目一样，您可以在构建脚本中包含依赖声明。有关更多信息，请参阅[添加多平台库依赖](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)。

您想亲自尝试一下吗？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="开始使用 Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm 与 WASI

Kotlin/Wasm 使用 [WebAssembly 系统接口 (WASI)](https://wasi.dev/) 来构建服务器端应用程序。使用 Kotlin/Wasm 和 WASI 构建的应用程序使用 Wasm-WASI 目标，使您能够调用 WASI API 并在浏览器环境之外运行应用程序。

Kotlin/Wasm 利用 WASI 来抽象化平台特定细节，使相同的 Kotlin 代码能够在不同平台运行。这扩展了 Kotlin/Wasm 的覆盖范围，使其超越了 Web 应用程序，而无需为每个运行时进行自定义处理。

WASI 提供了一个安全的标准接口，用于在不同环境中运行编译到 WebAssembly 的 Kotlin 应用程序。

> 要查看 Kotlin/Wasm 和 WASI 的实际应用，请查阅 [Kotlin/Wasm 和 WASI 入门教程](wasm-wasi.md)。
>
{style="tip"}

## Kotlin/Wasm 性能

尽管 Kotlin/Wasm 仍处于 Alpha 版，但在 Kotlin/Wasm 上运行的 Compose Multiplatform 已展现出令人鼓舞的性能特性。您可以看到其执行速度优于 JavaScript，并正接近 JVM 的性能：

![Kotlin/Wasm 性能](wasm-performance-compose.png){width=700}

我们定期对 Kotlin/Wasm 进行基准测试，这些结果来自我们在最新版 Google Chrome 中的测试。

## 浏览器 API 支持

Kotlin/Wasm 标准库提供了浏览器 API 的声明，包括 DOM API。有了这些声明，您可以直接使用 Kotlin API 来访问和利用各种浏览器功能。例如，在您的 Kotlin/Wasm 应用程序中，您可以使用 DOM 元素操作或调用 Fetch API，而无需从头定义这些声明。要了解更多信息，请参阅我们的 [Kotlin/Wasm 浏览器示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)。

浏览器 API 支持的声明是使用 JavaScript [互操作性能力](wasm-js-interop.md) 定义的。您可以使用相同的功能来定义自己的声明。此外，Kotlin/Wasm 与 JavaScript 的互操作性允许您在 JavaScript 中使用 Kotlin 代码。有关更多信息，请参阅[在 JavaScript 中使用 Kotlin 代码](wasm-js-interop.md#use-kotlin-code-in-javascript)。

## 留下反馈

### Kotlin/Wasm 反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)，并在我们的 [#webassembly](https://kotlinlang.slack.org/archives/CDFP59223) 频道中直接向开发者提供您的反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中报告任何问题。

### Compose Multiplatform 反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack: 在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公共频道中提供您的反馈。
* [在 GitHub 中报告任何问题](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放列表](https://kotl.in/wasm-pl) 中了解有关 Kotlin/Wasm 的更多信息。
* 探索我们 GitHub 仓库中的 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples)。