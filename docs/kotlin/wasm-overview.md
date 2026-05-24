[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasm 能够将您的 Kotlin 代码编译为 [WebAssembly (Wasm)](https://webassembly.org/) 格式。 
借助 Kotlin/Wasm，您可以创建能够在支持 Wasm 且满足 Kotlin 要求的不同环境和设备上运行的应用程序。

Wasm 是一种基于栈的虚拟机的二进制指令格式。这种格式与平台无关，因为它运行在自己的虚拟机上。Wasm 为 Kotlin 和其他语言提供了一个编译目标。 

您可以在不同的目标环境中使用 Kotlin/Wasm，例如在浏览器中开发基于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 构建的 Web 应用程序，或者在浏览器之外的独立 Wasm 虚拟机中运行。在浏览器外的情况下，[WebAssembly System Interface (WASI)](https://wasi.dev/) 提供了对平台 API 的访问，您也可以利用这些 API。

> 要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序，您的用户需要使用支持 WebAssembly 垃圾回收和旧版异常处理提案的 [浏览器版本](wasm-configuration.md#browser-versions)。要检查浏览器支持状态，请参阅 [WebAssembly 路线图](https://webassembly.org/roadmap/)。
>
{style="tip"}

[//]: # (TODO KT-85415: For Kotlin/Wasm-compatible standalone runtimes, see Standalone runtimes).

## Kotlin/Wasm 与 Compose Multiplatform

通过 Kotlin，您可以利用 Compose Multiplatform 和 Kotlin/Wasm 在 Web 项目中构建应用程序并复用移动端和桌面端的界面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一个基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的声明式框架，允许您一次性实现 UI，并在您定位的所有平台上共享。 

对于 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作为其编译目标。使用 Kotlin/Wasm 和 Compose Multiplatform 构建的应用程序使用 `wasm-js` 目标并在浏览器中运行。

此外，您可以开箱即用地在 Kotlin/Wasm 中使用最流行的 Kotlin 库。与其他 Kotlin 和多平台项目一样，您可以在构建脚本中包含依赖项声明。欲了解更多信息，请参阅[添加多平台库的依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)。

想要亲自尝试吗？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Kotlin/Wasm 快速入门" style="block"/></a>

## Kotlin/Wasm 与 WASI

Kotlin/Wasm 为后端应用程序使用 [WebAssembly System Interface (WASI)](https://wasi.dev/)。使用 Kotlin/Wasm 和 WASI 构建的应用程序使用 Wasm-WASI 目标，允许您调用 WASI API 并在浏览器环境之外运行应用程序。

Kotlin/Wasm 利用 WASI 抽象掉平台特定的细节，允许相同的 Kotlin 代码在不同平台上运行。这扩展了 Kotlin/Wasm 的应用范围，使其不仅限于 Web 应用程序，且不需要为每个运行时进行自定义处理。

WASI 为在不同环境中运行编译为 WebAssembly 的 Kotlin 应用程序提供了一个安全的标准接口。

> 要查看 Kotlin/Wasm 和 WASI 的实际应用，请查看 [Kotlin/Wasm 与 WASI 快速入门教程](wasm-wasi.md)。
>
{style="tip"}

### WebAssembly 组件模型
<primary-label ref="experimental-general"/>

> 对 WebAssembly 组件模型的支持目前仅在抢先体验计划 (EAP) 版本中可用：[Kotlin %kotlinEapVersion%](whatsnew-eap.md)。
>
{style="note"}

WASI 0.2 构建于 [WebAssembly 组件模型](https://github.com/WebAssembly/component-model)之上，该模型定义了一种使用标准化接口和类型从 Wasm 模块构建组件的方法。该模型允许您在应用程序或库中定义与语言无关的组件。您还可以将 Wasm 模块和现有组件组合成新的组件。

要探索 WebAssembly 组件模型和 Kotlin/Wasm 的可能性，请查看这个[使用 `wasi:http` 构建的简单服务器](https://github.com/Kotlin/sample-wasi-http-kotlin/)演示。

<img src="kotlin-wasm-wasi-http.gif" alt="Kotlin/Wasm 与 WebAssembly 组件模型" width="600"/>

## Kotlin/Wasm 性能

虽然 Kotlin/Wasm 仍处于 Beta 阶段，但运行在 Kotlin/Wasm 上的 Compose Multiplatform 已经展现出令人鼓舞的性能特征。您可以看到它的执行速度优于 JavaScript，并接近 JVM：

![Kotlin/Wasm 性能](wasm-performance-compose.png){width=700}

我们定期在 Kotlin/Wasm 上进行基准测试，这些结果来自我们在 Google Chrome 最近版本中的测试。

## 浏览器 API 支持

Kotlin/Wasm 标准库提供了浏览器 API 的声明，包括 DOM API。利用这些声明，您可以直接使用 Kotlin API 来访问和利用各种浏览器功能。例如，在您的 Kotlin/Wasm 应用程序中，您可以操作 DOM 元素或调用 fetch API，而无需从头开始定义这些声明。要了解更多信息，请参阅我们的 [Kotlin/Wasm 浏览器示例](https://github.com/Kotlin/kotlin-wasm-browser-template)。

浏览器 API 支持的声明是使用 JavaScript [互操作性功能](wasm-js-interop.md) 定义的。您可以使用相同的功能来定义自己的声明。此外，Kotlin/Wasm 与 JavaScript 的互操作性允许您在 JavaScript 中使用 Kotlin 代码。更多信息请参阅 [在 JavaScript 中使用 Kotlin 代码](wasm-js-interop.md#use-kotlin-code-in-javascript)。

## 留下反馈

### Kotlin/Wasm 反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中直接向开发者提供反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中报告任何问题。

### Compose Multiplatform 反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack：在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公共频道中提供您的反馈。
* [在 GitHub 中报告任何问题](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放列表](https://kotl.in/wasm-pl) 中了解有关 Kotlin/Wasm 的更多信息。
* 在我们的 GitHub 仓库中探索 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples)。