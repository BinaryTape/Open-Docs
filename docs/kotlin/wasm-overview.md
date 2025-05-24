---
title: Kotlin/Wasm
---
:::note
Kotlin/Wasm 处于 [Alpha](components-stability) 阶段。
它可能随时更改。你可以在生产之前的场景中使用它。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供的反馈。

[加入 Kotlin/Wasm 社区](https://slack-chats.kotlinlang.org/c/webassembly)。

:::

Kotlin/Wasm 能够将你的 Kotlin 代码编译成 [WebAssembly (Wasm)](https://webassembly.org/) 格式。
有了 Kotlin/Wasm，你可以创建在
支持 Wasm 并满足 Kotlin 要求的不同环境和设备上运行的应用程序。

Wasm 是一种基于栈的虚拟机的二进制指令格式。
这种格式是平台无关的，因为它在自己的虚拟机上运行。Wasm 为 Kotlin 和其他语言提供了一个编译目标。

你可以在不同的目标环境中使用 Kotlin/Wasm，例如浏览器，用于开发使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 构建的 Web 应用程序，或者在独立的 Wasm 虚拟机中的浏览器之外使用。
在浏览器之外的情况下，[WebAssembly System Interface (WASI)](https://wasi.dev/) 提供了对平台 API 的访问，你也可以利用它。

## Kotlin/Wasm 和 Compose Multiplatform

借助 Kotlin，你可以构建应用程序，并通过 Compose Multiplatform 和 Kotlin/Wasm 在你的 Web 项目中重用移动和桌面用户界面 (UI)。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一个基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的声明式框架，它允许你实现一次 UI，并在你面向的所有平台上共享它。

对于 Web 平台，Compose Multiplatform 使用 Kotlin/Wasm 作为其编译目标。使用 Kotlin/Wasm 和 Compose Multiplatform 构建的应用程序使用 `wasm-js` 目标并在浏览器中运行。

[探索我们使用 Compose Multiplatform 和 Kotlin/Wasm 构建的应用程序的在线演示](https://zal.im/wasm/jetsnack/)

<img src="/img/wasm-demo.png" alt="Kotlin/Wasm demo" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序，你需要一个支持新的垃圾回收和旧版异常处理提案的浏览器版本。要检查浏览器的支持状态，请参阅 [WebAssembly
roadmap](https://webassembly.org/roadmap/)。

:::

此外，你可以直接在 Kotlin/Wasm 中使用最流行的 Kotlin 库。与其他 Kotlin 和 Multiplatform 项目一样，你可以在构建脚本中包含依赖项声明。有关更多信息，请参阅 [添加对多平台库的依赖项](multiplatform-add-dependencies)。

你想自己尝试一下吗？

<a href="wasm-get-started"><img src="/img/wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" /></a>

## Kotlin/Wasm 和 WASI

Kotlin/Wasm 使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 用于服务器端应用程序。
使用 Kotlin/Wasm 和 WASI 构建的应用程序使用 Wasm-WASI 目标，允许你调用 WASI API 并在浏览器环境之外运行应用程序。

Kotlin/Wasm 利用 WASI 来抽象出特定于平台的细节，允许相同的 Kotlin 代码在不同的平台上运行。这扩展了 Kotlin/Wasm 在 Web 应用程序之外的范围，而无需为每个运行时进行自定义处理。

WASI 为跨不同环境运行编译为 WebAssembly 的 Kotlin 应用程序提供了一个安全的标准接口。

:::tip
要了解 Kotlin/Wasm 和 WASI 的实际应用，请查看 [Kotlin/Wasm 和 WASI 入门教程](wasm-wasi)。

:::

## Kotlin/Wasm 性能

虽然 Kotlin/Wasm 仍处于 Alpha 阶段，但在 Kotlin/Wasm 上运行的 Compose Multiplatform 已经显示出令人鼓舞的性能特征。你可以看到它的执行速度超过了 JavaScript，并且接近 JVM 的速度：

<img src="/img/wasm-performance-compose.png" alt="Kotlin/Wasm performance" width="700" style={{verticalAlign: 'middle'}}/>

我们定期在 Kotlin/Wasm 上运行基准测试，这些结果来自我们在最新版本的 Google Chrome 中的测试。

## 浏览器 API 支持

Kotlin/Wasm 标准库提供了浏览器 API 的声明，包括 DOM API。
通过这些声明，你可以直接使用 Kotlin API 来访问和利用各种浏览器功能。
例如，在你的 Kotlin/Wasm 应用程序中，你可以使用 DOM 元素操作或获取 API，而无需从头开始定义这些声明。要了解更多信息，请参阅我们的 [Kotlin/Wasm 浏览器示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)。

浏览器 API 支持的声明是使用 JavaScript [互操作性功能](wasm-js-interop) 定义的。
你可以使用相同的功能来定义你自己的声明。此外，Kotlin/Wasm-JavaScript 互操作性允许你从 JavaScript 中使用 Kotlin 代码。有关更多信息，请参阅 [在 JavaScript 中使用 Kotlin 代码](wasm-js-interop#use-kotlin-code-in-javascript)。

## 留下反馈

### Kotlin/Wasm 反馈

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中直接向开发人员提供你的反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中报告任何问题。

### Compose Multiplatform 反馈

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公共频道中提供你的反馈。
* [在 GitHub 中报告任何问题](https://github.com/JetBrains/compose-multiplatform/issues)。

## 了解更多

* 在此 [YouTube 播放列表](https://kotl.in/wasm-pl) 中了解更多关于 Kotlin/Wasm 的信息。
* 在我们的 GitHub 仓库中探索 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples)。