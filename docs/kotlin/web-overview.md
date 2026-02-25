[//]: # (title: 概览)

Kotlin 通过 Kotlin Multiplatform 为 Web 开发提供了两种方案：

* [基于 JavaScript（使用 Kotlin/JS 编译器）](#kotlin-js)
* [基于 WebAssembly（使用 Kotlin/Wasm 编译器）](#kotlin-wasm)

这两种方案都允许您在 Web 应用中共享代码，但它们支持不同的用例。
它们在技术层面也有所不同，例如对目标浏览器的支持。

## Kotlin/JS

[Kotlin/JS](js-overview.md) 通过将您的代码、标准库以及所有受支持的依赖项转译为 JS，实现在 JavaScript (JS) 环境中运行 Kotlin 应用。

使用 Kotlin/JS 开发时，您可以在浏览器或 Node.js 环境中运行应用。

> 有关配置 Kotlin/JS 目标的详细信息，请参阅 [配置 Gradle 项目](gradle-configure-project.md#targeting-javascript) 指南。
>
{style="tip"}

### Kotlin/JS 用例

如果您的目标是执行以下操作，则 Kotlin/JS 非常适合：

* [与 JavaScript/TypeScript 代码库共享业务逻辑](#share-business-logic-with-a-javascript-typescript-codebase)。
* [使用 Kotlin 构建非共享的 Web 应用](#build-web-apps-with-kotlin-without-sharing-the-code)。

#### 与 JavaScript/TypeScript 代码库共享业务逻辑

如果您需要与原生 JavaScript/TypeScript 应用共享 Kotlin 代码（例如领域逻辑或数据逻辑），Kotlin/JS 目标提供：

* 与 JavaScript/TypeScript 的直接互操作性。
* 互操作中的开销极小（例如，避免不必要的数据复制）。
  这使得共享代码能够顺畅地集成到基于 JS 的工作流中。

#### 使用 Kotlin 构建 Web 应用而不共享代码

对于 Web 应用完全由 Kotlin 实现，且不与其他平台（iOS、Android 或桌面端）共享的项目，基于 HTML 的方案提供了更好的控制。

基于 HTML 的方案可以提升 SEO 和可访问性。
它们还提供了更好的浏览器集成，包括页面内查找和页面翻译等功能。

对于基于 HTML 的方案，Kotlin/JS 支持多种方式：

* 使用基于 HTML 的 Compose 框架，例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)，以 Compose 风格的架构构建 UI。
* 使用基于 React 的方案以及 Kotlin 包装器，在 [Kotlin 中实现 React 组件](https://kotlinlang.org/docs/js-react.html)。

## Kotlin/Wasm
<primary-label ref="beta"/> 

[](wasm-overview.md) 将 Kotlin 代码编译为 WebAssembly (Wasm)，使应用能够在支持 Wasm 且满足 Kotlin 要求的各种环境和设备上运行。

在浏览器中，Kotlin/Wasm 允许您使用 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 构建 Web 应用。
在浏览器之外，它运行在独立的 Wasm 虚拟机中，使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 访问平台 API。

使用 Kotlin/Wasm 开发时，您可以针对以下目标：

* **`wasmJs`**：用于在浏览器或 Node.js 中运行。
* **`wasmWasi`**：用于在支持 WASI 的 Wasm 环境中运行，例如 Wasmtime、WasmEdge 等。

> 有关配置 Kotlin/Wasm 目标的详细信息，请参阅 [配置 Gradle 项目](gradle-configure-project.md#targeting-webassembly) 指南。
>
{style="tip"}

### Kotlin/Wasm 用例

如果您想在多个平台之间同时共享逻辑和 UI，请使用 Kotlin/Wasm。

#### 使用 Compose Multiplatform 构建跨平台应用

如果您想在包括 Web 在内的多个平台之间同时共享逻辑和 UI，基于 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 的 Kotlin/Wasm 提供了一个共享 UI 层：

* 确保所有平台具有一致的 UI 实现。
* 利用 Wasm 提升渲染性能并实现更流畅的 UI 更新（例如响应式动画）。
* 支持最新版本的 [WebAssembly 垃圾回收 (WasmGC)](https://developer.chrome.com/blog/wasmgc) 提案，这使得 Kotlin/Wasm 可以在所有主流现代浏览器上运行。

## 选择您的 Web 方案

下表根据您的用例总结了推荐的目标：

| 用例 | 推荐目标 | 描述 |
|-------------------------------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 共享业务逻辑，但使用 Web 原生 UI | Kotlin/JS | 提供与 JS 的直接互操作且开销极小。 |
| 同时共享 UI 和业务逻辑 | Kotlin/Wasm | 通过 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 为渲染提供更好的性能。 |
| 非共享 UI | Kotlin/JS | 允许使用 [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/) 或 [React](https://kotlinlang.org/docs/js-react.html) 等基于 HTML 的框架构建 UI，利用现有的 JS 生态系统和工具链。 |

> 如果您在选择合适的目标时需要指导，请加入我们的 [Slack 社区](https://slack-chats.kotlinlang.org/c/multiplatform)。
> 您可以咨询有关平台差异、性能考量以及针对特定用例的推荐做法。
>
{style="note"}

## Web 目标的兼容性模式

您可以为您的 Web 应用启用兼容性模式，以确保其在所有浏览器上都能开箱即用。
在此模式下，您可以为现代浏览器使用 Wasm 构建 UI，而旧版浏览器则回退到 JS。 

兼容性模式通过针对 `js` 和 `wasmJs` 目标的交叉编译实现。
[详细了解 Web 兼容性模式及其启用方法](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets)。