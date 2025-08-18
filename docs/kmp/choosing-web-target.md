# 为 Kotlin 多平台项目选择合适的 Web 目标

Kotlin 多平台 (KMP) 为 Web 开发提供了两种方法：

* 基于 JavaScript（使用 Kotlin/JS 编译器）
* 基于 WebAssembly（使用 Kotlin/Wasm 编译器）

这两种选项都允许你在 Web 应用程序中共享代码。然而，它们在性能、互操作性、应用程序大小和目标浏览器支持等方面存在显著差异。本指南解释了何时使用每种目标，以及如何通过合适的选择来满足你的需求。

### 快速指南

下表总结了根据用例推荐的目标：

| 用例                              | 推荐目标 | 理由                                                                                                                                                                                                                     |
|-----------------------------------| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 共享业务逻辑，但 UI 原生          | JS       | 提供与 JavaScript 的直接互操作和最小开销                                                                                                                                                                                       |
| 共享 UI 和业务逻辑                | Wasm     | 为使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 进行渲染提供更好的性能                                                                                                                       |
| 不可共享的 UI                     | JS       | 允许使用 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html) 等基于 HTML 的框架构建 UI，利用现有 JS 生态系统和工具 |

## 何时选择 Kotlin/JS

如果你的目标是以下情况，Kotlin/JS 提供了一个很好的解决方案：

* [与 JavaScript/TypeScript 代码库共享业务逻辑](#share-business-logic-with-a-javascript-typescript-codebase)
* [使用 Kotlin 构建不可共享的 Web 应用程序](#build-web-apps-with-kotlin-without-sharing-the-code)

### 与 JavaScript/TypeScript 代码库共享业务逻辑

如果你想与原生 JavaScript/TypeScript 应用程序共享一段 Kotlin 代码（例如领域或数据逻辑），JS 目标提供：

* 与 JavaScript/TypeScript 的直接互操作。
* 互操作性方面的最小开销（例如，没有不必要的数据复制）。这有助于你的代码无缝集成到你的基于 JS 的工作流中。

### 使用 Kotlin 构建不可共享的 Web 应用程序

对于希望使用 Kotlin 构建整个 Web 应用程序，但不打算将其共享到其他平台（iOS、Android 或桌面）的团队，基于 HTML 的解决方案可能是更好的选择。它提高了 SEO 和可访问性，并默认提供无缝的浏览器集成（例如“页面查找”功能或页面翻译）。在这种情况下，Kotlin/JS 提供了几种选项。你可以：

* 使用 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/) 等 Compose HTML-based 框架，使用熟悉的 Compose 多平台架构构建 UI。
* 利用基于 React 的解决方案与 Kotlin 包装器，在 Kotlin 中构建 [React 组件](https://kotlinlang.org/docs/js-react.html)。

## 何时选择 Kotlin/Wasm

### 使用 Compose 多平台构建跨平台应用

如果你想在多个平台（包括 Web）上共享逻辑和 UI，那么 Kotlin/Wasm 结合 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 是最佳选择：

* UI 体验在不同平台之间更加一致。
* 你可以利用 Wasm 改进渲染，实现流畅、响应迅速的动画。
* 对 [WasmGC](https://developer.chrome.com/blog/wasmgc) 的浏览器支持已趋于成熟，使得 Kotlin/Wasm 能够在所有主要的现代浏览器上以接近原生的性能运行。

对于需要支持旧版浏览器的项目，你可以使用 Compose 多平台的兼容模式：在 Wasm 中为现代浏览器构建 UI，但在旧版浏览器上优雅降级到 JS。你还可以在项目中共享 Wasm 和 JS 目标之间的公共逻辑。

> 仍然不确定该选择哪条路线？加入我们的 [Slack 社区](https://slack-chats.kotlinlang.org)，询问有关主要区别、性能考量和选择合适目标的最佳实践。
> 
{style="note"}