[//]: # (title: Kotlin/JS 框架)

利用可用的 Kotlin/JavaScript 框架来简化 Web 开发。这些框架提供了即用型组件、路由、状态管理以及其他用于构建现代 Web 应用程序的工具。

以下是社区中的一些 Kotlin/JS Web 框架：

## Kobweb

[Kobweb](https://kobweb.varabyte.com/) 是一个 Kotlin 框架，用于通过 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 创建网站和 Web 应用程序。它支持热重载，以实现快速开发。受 [Next.js](https://nextjs.org/) 的启发，Kobweb 推崇一种标准结构，用于添加小部件、布局和页面。

Kobweb 开箱即用，提供页面路由、明暗模式、CSS 样式、Markdown 支持、后端 API 等。它还包括 [Silk](https://silk-ui.netlify.app/)，这是一个 UI 库，带有一组用于现代 UI 的多功能小部件。

Kobweb 还通过生成页面快照来支持网站导出，以实现 SEO 和自动搜索索引。此外，它还能够创建基于 DOM 的 UI，这些 UI 可以响应状态变化而高效更新。

关于文档和示例，请参见 [Kobweb 文档](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb)网站。

关于该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 频道。

## Kilua

[Kilua](https://kilua.dev/) 是一个基于 [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime) 构建的可组合 Web 框架，类似于 [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html) 库。与 compose-html 不同，Kilua 支持 Kotlin/Wasm 和 Kotlin/JS 目标平台。

Kilua 提供了一个模块化 API，用于创建声明式 UI 组件并管理其状态。它还包括一组用于常见 Web 应用程序用例的即用型组件。

Kilua 是 [KVision](https://kvision.io) 框架的后继者。Kilua 的设计旨在让 Compose 用户（`@Composable` 函数、状态管理、协程/流集成）和 KVision 用户（允许与 UI 组件进行某些命令式交互的基于组件的 API）都感到熟悉。

关于文档和示例，请参见 GitHub 上的 [Kilua 版本库](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)。

关于该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) 频道。

## Kotlin React

[React](https://react.dev/) 是一个基于组件的库，广泛用于 Web 和原生用户界面。它提供了庞大的组件生态系统、学习资料和一个活跃的社区。

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md) 是 React 的 Kotlin 包装器，它将 React 生态系统与 Kotlin 的类型安全和表达性相结合。

关于该库的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#react](https://kotlinlang.slack.com/messages/react) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## KVision

[KVision](https://kvision.io) 是一个面向对象的 Web 框架，用于使用即用型 UI 组件构建 Kotlin/JS 应用程序。这些组件可以成为您的应用程序用户界面的构建块。

借助此框架，您可以使用反应式和命令式编程模型来构建前端。您还可以通过使用 Ktor、Spring Boot 和其他框架的连接器，将其与您的服务器端应用程序集成。此外，您还可以使用 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 共享代码。

关于文档、教程和示例，请参见 [KVision 文档](https://kvision.io/#docs)网站。

关于该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## fritz2

[fritz2](https://www.fritz2.dev) 是一个用于构建反应式 Web 用户界面的独立框架。它提供了自己的类型安全 DSL，用于构建和渲染 HTML 元素，并利用 Kotlin 的协程和流来定义组件及其数据绑定。

fritz2 开箱即用，提供状态管理、验证、路由等功能。它还与 Kotlin Multiplatform 项目集成。

关于文档、教程和示例，请参见 [fritz2 文档](https://www.fritz2.dev/docs/)网站。

关于该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## Doodle

[Doodle](https://nacular.github.io/doodle/) 是一个基于矢量的 Kotlin/JS UI 框架。Doodle 应用程序利用浏览器的图形能力来绘制用户界面，而不是依赖 DOM、CSS 或 JavaScript。这种方法使您能够控制任意 UI 元素、矢量图形、渐变和自定义可视化效果的渲染。

关于文档、教程和示例，请参见 [Doodle 文档](https://nacular.github.io/doodle/docs/introduction/)网站。

关于该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。