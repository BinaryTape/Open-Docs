[//]: # (title: Kotlin/JavaScript)

Kotlin/JavaScript (Kotlin/JS) 允许你将 Kotlin 代码、Kotlin 标准库以及任何兼容的依赖项转译为 JavaScript。这样，你的 Kotlin 应用程序就可以在任何支持 JavaScript 的环境中运行。

通过 [Kotlin Multiplatform Gradle 插件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)（`kotlin.multiplatform`）使用 Kotlin/JS，可以从一个地方配置和管理面向 JavaScript 的 Kotlin 项目。

Kotlin Multiplatform Gradle 插件让你能够使用诸如控制应用程序打包以及直接从 npm 添加 JavaScript 依赖项等特性。关于可用配置选项的概览，请参见[设置 Kotlin/JS 项目](js-project-setup.md)。

> Kotlin/JS 的当前实现面向 [ES5](https://www.ecma-international.org/ecma-262/5.1/) 和 [ES2015](https://262.ecma-international.org/6.0/) 标准。
>
{style="tip"}

## Kotlin/JS 的用例

以下是使用 Kotlin/JS 的一些常见方式：

*  **在前端和 JVM 后端之间共享公共逻辑**

   如果你的后端是用 Kotlin 或其他 JVM 兼容语言编写的，你可以在 Web 应用程序和后端之间共享公共代码。这包括数据传输对象 (DTO)、验证和认证规则、REST API 端点的抽象等。

*  **在 Android、iOS 和 Web 客户端之间共享公共逻辑**

   你可以在 Web 界面以及适用于 Android 和 iOS 的移动应用程序之间共享业务逻辑，同时保持原生用户界面。这避免了重复诸如 REST API 抽象、用户认证、表单验证和领域模型等公共功能。

* **使用 Kotlin/JS 构建前端 Web 应用程序**

     使用 Kotlin 开发传统 Web 前端，同时与现有工具和库集成：

     * 如果你熟悉 Android 开发，可以使用 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/) 等基于 Compose 的框架构建 Web 应用程序。
     * 使用 JetBrains 提供的[适用于常见 JavaScript 库的 Kotlin 包装器](https://github.com/JetBrains/kotlin-wrappers)，用 Kotlin/JS 构建完全类型安全的 React 应用程序。Kotlin 包装器（`kotlin-wrappers`）为 React 和其他 JavaScript 框架提供了抽象和集成。
       
       这些包装器还支持诸如 [React Redux](https://react-redux.js.org/)、[React Router](https://reactrouter.com/) 和 [styled-components](https://styled-components.com/) 等补充库。你还可以通过与 JavaScript 生态系统的互操作性来使用第三方 React 组件和组件库。
  
     * 使用[Kotlin/JS 框架](js-frameworks.md)，它们与 Kotlin 生态系统集成，并支持简洁且富有表现力的代码。

*  **构建支持旧版浏览器的多平台应用程序**

      借助 Compose Multiplatform，你可以使用 Kotlin 构建应用程序，并在 Web 项目中重用移动和桌面用户界面。虽然 [Kotlin/Wasm](wasm-overview.md) 是此目的的主要目标，但你也可以通过面向 Kotlin/JS 来扩展对旧版浏览器的支持。

* **使用 Kotlin/JS 构建服务端和无服务器应用程序**

  Kotlin/JS 中的 Node.js 目标平台允许你在 JavaScript 运行时上为服务端或无服务器环境创建应用程序。这提供了快速启动和低内存使用的特性。[`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs) 库提供了从 Kotlin 类型安全地访问 [Node.js API](https://nodejs.org/docs/latest/api/) 的功能。

根据你的用例，Kotlin/JS 项目可以使用来自 Kotlin 生态系统的兼容库以及来自 JavaScript 和 TypeScript 生态系统的第三方库。

为了在 Kotlin 代码中使用第三方库，你可以创建自己的类型安全包装器，或使用社区维护的包装器。此外，你还可以使用 Kotlin/JS 的[动态类型](dynamic-type.md)，它允许你跳过严格类型和库包装器，但会牺牲类型安全。

Kotlin/JS 也与最常见的模块系统兼容：[ESM](https://tc39.es/ecma262/#sec-modules)、[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)、[UMD](https://github.com/umdjs/umd) 和 [AMD](https://github.com/amdjs/amdjs-api)。这允许你[生成和使用模块](js-modules.md)，并以结构化的方式与 JavaScript 生态系统集成。

### 分享你的用例

[Kotlin/JS 的用例](#use-cases-for-kotlin-js)中的列表并非详尽无遗。欢迎尝试不同的方法，并找到最适合你项目的方式。

在官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道中与 Kotlin/JS 社区分享你的用例、经验和问题。

## Kotlin/JS 入门

探索开始使用 Kotlin/JS 的基础知识和初始步骤：

* 如果你是 Kotlin 新手，请先复习[基本语法](basic-syntax.md)并探索[Kotlin 之旅](kotlin-tour-welcome.md)。
* 查看 [Kotlin/JS 示例项目](#sample-projects-for-kotlin-js)列表以寻求灵感。这些示例包含有用的代码片段和模式，可以帮助你启动你的项目。
* 如果你是 Kotlin/JS 新手，请在探索更高级的主题之前，先从[设置指南](js-project-setup.md)开始。

你想亲自尝试 Kotlin/JS 吗？

<a href="js-get-started.md"><img src="js-get-started-button.svg" width="500" alt="开始使用 Kotlin/JS" style="block"/></a>

## Kotlin/JS 示例项目

下表列出了一组示例项目，它们演示了各种 Kotlin/JS 用例、架构和代码共享策略：

| Project                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                      |
|-----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Petclinic with common code between Spring and Angular](https://github.com/Kotlin/kmp-spring-petclinic/#readme)                   | 演示了通过共享数据传输对象、验证和认证规则以及 REST API 端点的抽象，如何在企业应用程序中避免代码重复。代码在 [Spring Boot](https://spring.io/projects/spring-boot) 后端和 [Angular](https://angular.dev/) 前端之间共享。                                                                                              |
| [Fullstack Conference CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme)                                        | 展示了多种代码共享方法，范围从最简单到 [Ktor](https://ktor.io/)、[Jetpack Compose](https://developer.android.com/compose) 和 [Vue.js](https://vuejs.org/) 应用程序之间的完全代码共享。                                                                                                                                  |
| [Todo App on a Compose-HTML-based Kobweb framework](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme) | 演示了如何通过重用 Android 开发者熟悉的方法来创建待办列表应用程序。它构建了一个由 [Kobweb 框架](https://kobweb.varabyte.com/)提供支持的客户端 UI 应用程序。                                                                                                                                                           |
| [Simple logic sharing between Android, iOS, and web](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme)          | 包含一个用于构建 Kotlin 公共逻辑项目的模板，该项目被 Android ([Jetpack Compose](https://developer.android.com/compose))、iOS ([SwiftUI](https://developer.apple.com/tutorials/swiftui/)) 和 Web ([React](https://react.dev/)) 上的平台原生 UI 应用程序所使用。                                                      |
| [Full-stack collaborative to-do list](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme)                                | 演示了如何使用带有 JS 和 JVM 目标平台的 Kotlin Multiplatform 创建用于协作的待办列表应用程序。它使用 [Ktor](https://ktor.io/) 作为后端，以及 Kotlin/JS 和 React 作为前端。                                                                                                                                             |

## Kotlin/JS 框架

Kotlin/JS 框架通过提供即用型组件、路由、状态管理以及其他用于构建现代 Web 应用程序的工具来简化 Web 开发。

[查看由不同作者编写的 Kotlin/JS 可用框架](js-frameworks.md)。

## 加入 Kotlin/JS 社区

你可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道，与社区和 Kotlin/JS 团队交流。

## 接下来

* [设置 Kotlin/JS 项目](js-project-setup.md)
* [运行 Kotlin/JS 项目](running-kotlin-js.md)
* [调试 Kotlin/JS 代码](js-debugging.md)
* [在 Kotlin/JS 中运行测试](js-running-tests.md)