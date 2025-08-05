# 为 Kotlin Multiplatform 项目选择合适的 Web 目标平台

Kotlin Multiplatform (KMP) 为 Web 开发提供了两种方法：

*   基于 JavaScript（使用 Kotlin/JS 编译器）
*   基于 WebAssembly（使用 Kotlin/Wasm 编译器）

这两种选项都允许你在 Web 应用程序中使用共享代码。然而，它们在多个重要方面有所不同，包括性能、互操作性、应用程序大小和目标浏览器支持。本指南将解释何时使用每种目标平台，以及如何通过适当的选择来满足你的要求。

### 快速指南

下表总结了根据你的用例推荐的目标平台：

| 用例                                  | 推荐的目标平台 | 理由                                                                                                                                                                                                  |
| :------------------------------------ | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 共享业务逻辑，但原生 UI               | JS             | 提供与 JavaScript 的直接互操作性，开销极小                                                                                                                                                            |
| 同时共享 UI 和业务逻辑                | Wasm           | 提供更好的性能，以便使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 进行渲染                                                                                           |
| 不可共享的 UI                         | JS             | 允许使用 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html) 等基于 HTML 的框架构建 UI，利用现有 JS 生态系统和工具 |

## 何时选择 Kotlin/JS

如果你的目标是以下情况，Kotlin/JS 提供了一个绝佳解决方案：

*   [与 JavaScript/TypeScript 代码库共享业务逻辑](#share-business-logic-with-a-javascript-typescript-codebase)
*   [使用 Kotlin 构建不可共享的 Web 应用程序](#build-web-apps-with-kotlin-without-sharing-the-code)

### 与 JavaScript/TypeScript 代码库共享业务逻辑

如果你想将一段 Kotlin 代码（例如领域逻辑或数据逻辑）与基于原生 JavaScript/TypeScript 的应用程序共享，JS 目标平台提供：

*   与 JavaScript/TypeScript 的直接互操作性。
*   互操作性方面的开销极小（例如，无需不必要的数据复制）。这有助于你的代码无缝集成到基于 JS 的工作流中。

### 使用 Kotlin 构建不可共享的 Web 应用程序

对于希望使用 Kotlin 构建整个 Web 应用程序的团队，如果无意将其共享到其他平台（iOS、Android 或 Desktop），那么基于 HTML 的解决方案可能是更好的选择。它能提高 SEO 和可访问性，并默认提供无缝的浏览器集成（例如“在页面中查找”功能或页面翻译）。在这种情况下，Kotlin/JS 提供了多种选项。你可以：

*   使用 Compose HTML-based 框架，例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)，以熟悉的 Compose Multiplatform 架构构建 UI。
*   利用带有 Kotlin 包装器的基于 React 的解决方案，在 Kotlin 中构建 [React 组件](https://kotlinlang.org/docs/js-react.html)。

## 何时选择 Kotlin/Wasm

### 使用 Compose Multiplatform 构建跨平台应用程序

如果你想在多个平台（包括 Web）上同时共享逻辑和 UI，结合 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 的 Kotlin/Wasm 是可行的途径：

*   UI 体验在不同平台之间更加一致。
*   你可以利用 Wasm 改进渲染，实现流畅、响应式的动画。
*   浏览器对 [WasmGC](https://developer.chrome.com/blog/wasmgc) 的支持已趋成熟，使 Kotlin/Wasm 能够在所有主流现代浏览器上以接近原生（near-native）的性能运行。

对于对旧版浏览器支持有要求的项目，你可以为 Compose Multiplatform 使用兼容模式：为现代浏览器在 Wasm 中构建 UI，但在旧版浏览器上优雅地回退到 JS。你也可以在你的项目中共享 Wasm 和 JS 目标平台之间的公共逻辑。

> 仍然不确定该选择哪条路径？加入我们的 [Slack 社区](https://slack-chats.kotlinlang.org)，咨询关键差异、性能考量以及选择正确目标平台的最佳实践。
> 
{style="note"}