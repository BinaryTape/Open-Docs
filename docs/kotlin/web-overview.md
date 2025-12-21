[//]: # (title: 概述)

Kotlin 通过 Kotlin Multiplatform 为 Web 开发提供了两种方法：

*   [基于 JavaScript 的（使用 Kotlin/JS 编译器）](#kotlin-js)
*   [基于 WebAssembly 的（使用 Kotlin/Wasm 编译器）](#kotlin-wasm)

这两种方法都允许你在 Web 应用中共享代码，但它们支持不同的用例。它们在技术方面也有所不同，例如目标浏览器支持。

## Kotlin/JS

[Kotlin/JS](js-overview.md) 通过将你的代码、标准库以及所有支持的依赖项转译为 JS，使 Kotlin 应用能够在 JavaScript (JS) 环境中运行。

使用 Kotlin/JS 进行开发时，你可以在浏览器或 Node.js 环境中运行你的应用。

> 关于配置 Kotlin/JS 目标的信息，请参见[配置 Gradle 项目](gradle-configure-project.md#targeting-javascript)指南。
>
{style="tip"}

### Kotlin/JS 用例

如果你的目标是以下情况，Kotlin/JS 是合适的选择：

*   [与 JavaScript/TypeScript 代码库共享业务逻辑](#share-business-logic-with-a-javascript-typescript-codebase)。
*   [使用 Kotlin 构建 Web 应用而不共享代码](#build-web-apps-with-kotlin-without-sharing-the-code)。

#### 与 JavaScript/TypeScript 代码库共享业务逻辑

如果你需要与原生 JavaScript/TypeScript 应用共享 Kotlin 代码（例如领域逻辑或数据逻辑），Kotlin/JS 目标提供：

*   直接与 JavaScript/TypeScript 互操作。
*   互操作中的最小开销（例如，避免不必要的数据复制）。
    这使得共享代码能够流畅地集成到基于 JS 的工作流中。

#### 使用 Kotlin 构建 Web 应用而不共享代码

对于完全用 Kotlin 实现 Web 应用且不与其他平台（iOS、Android 或 Desktop）共享代码的项目，基于 HTML 的解决方案提供了更好的控制。

基于 HTML 的解决方案可以提高 SEO 和可访问性。它们还提供了更好的浏览器集成，包括页面内查找和页面翻译等特性。

对于基于 HTML 的解决方案，Kotlin/JS 支持多种方法：

*   使用基于 Compose HTML 的框架，例如
    [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)，
    使用 Compose 风格的架构构建 UI。
*   使用基于 React 的解决方案和 Kotlin 封装器来[用 Kotlin 实现 React 组件](https://kotlinlang.org/docs/js-react.html)。

## Kotlin/Wasm
<primary-label ref="beta"/>

[](wasm-overview.md) 将 Kotlin 代码编译为 WebAssembly (Wasm)，使应用能够在支持 Wasm 的环境和设备上运行，同时满足 Kotlin 的要求。

在浏览器中，
Kotlin/Wasm 让你能够使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 构建 Web 应用。
在浏览器之外，它在独立的 Wasm 虚拟机中运行，
使用 [WebAssembly System Interface (WASI)](https://wasi.dev/)
访问平台 API。

当你使用 Kotlin/Wasm 进行开发时，你可以面向：

*   **`wasmJs`**: 用于在浏览器或 Node.js 中运行。
*   **`wasmWasi`**: 用于在支持 WASI 的 Wasm 环境中运行，例如 Wasmtime、WasmEdge 等。

> 关于配置 Kotlin/Wasm 目标的信息，请参见[配置 Gradle 项目](gradle-configure-project.md#targeting-webassembly)指南。
>
{style="tip"}

### Kotlin/Wasm 用例

如果你想在多个平台间共享逻辑和 UI，请使用 Kotlin/Wasm。

#### 使用 Compose Multiplatform 构建跨平台应用

如果你想在多个平台（包括 Web）间共享逻辑和 UI，结合 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 的 Kotlin/Wasm 提供了一个共享 UI 层：

*   确保所有平台上的 UI 实现一致。
*   使用 Wasm 改进渲染和更流畅的 UI 更新，例如响应式动画。
*   支持最新版本的
    [WebAssembly 垃圾回收 (WasmGC)](https://developer.chrome.com/blog/wasmgc) 提案，
    这使得 Kotlin/Wasm 能够在所有主流现代浏览器上运行。

## 选择你的 Web 开发方法

下表总结了根据你的用例推荐的目标：

| 用例                                        | 推荐目标    | 描述                                                                                                                                                                                                               |
|---------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 共享业务逻辑，但使用 Web 原生 UI            | Kotlin/JS   | 提供与 JS 直接互操作和最小开销。                                                                                                                                                                                           |
| 共享 UI 和业务逻辑                            | Kotlin/Wasm | 使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 可提供更好的渲染性能。                                                                                                                    |
| 不可共享的 UI                               | Kotlin/JS   | 允许使用基于 HTML 的框架（例如 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html)）构建 UI，并使用现有的 JS 生态系统和工具。 |

> 如果你需要关于选择合适目标的指导，
> 请加入我们的 [Slack community](https://slack-chats.kotlinlang.org/c/multiplatform)。
> 你可以询问有关平台差异、性能考量以及特定用例的推荐实践。
>
{style="note"}

## Web 目标的兼容模式

你可以为你的 Web 应用启用兼容模式，以确保它开箱即用地在所有浏览器上工作。在此模式下，你可以为现代浏览器使用 Wasm 构建 UI，而旧版浏览器则回退到 JS。

兼容模式通过针对 `js` 和 `wasmJs` 目标的交叉编译实现。
[查看更多关于 Web 兼容模式以及如何启用它的信息](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets)。