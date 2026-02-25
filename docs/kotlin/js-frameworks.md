[//]: # (title: Kotlin/JS 框架)

利用现有的 Kotlin/JavaScript 框架来简化 Web 开发。
这些框架为构建现代 Web 应用程序提供了开箱即用的组件、路由、状态管理以及其他工具。

以下是来自社区的一些 Kotlin/JS Web 框架：

## Kobweb

[Kobweb](https://kobweb.varabyte.com/) 是一个用于通过 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 创建网站和 Web 应用程序的 Kotlin 框架。它支持实时重载以实现快速开发。受 [Next.js](https://nextjs.org/) 启发，Kobweb 提倡使用标准结构来添加微件、布局和页面。

Kobweb 开箱即用，提供页面路由、浅色/深色模式、CSS 样式设置、Markdown 支持、后端 API 等功能。它还包含 [Silk](https://silk-ui.netlify.app/)，这是一个包含一组用于现代 UI 的通用微件的 UI 库。

Kobweb 还支持网站导出，通过为 SEO 和自动搜索索引生成页面快照。此外，它还支持创建基于 DOM（文档对象模型） 的 UI，并能根据状态变化高效更新。

有关文档和示例，请参阅 [Kobweb 文档](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb) 网站。

有关框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 频道。

## Kilua

[Kilua](https://kilua.dev/) 是一个基于 [Compose 运行时](https://developer.android.com/jetpack/androidx/releases/compose-runtime) 构建的可组合 Web 框架，类似于 [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html) 库。与 compose-html 不同，Kilua 同时支持 Kotlin/Wasm 和 Kotlin/JS 目标。

Kilua 提供模块化 API 以创建声明式 UI 组件并管理其状态。它还包含一套适用于常见 Web 应用程序用例的开箱即用组件。

Kilua 是 [KVision](https://kvision.io) 框架的继任者。Kilua 的设计旨在让 Compose 用户（`@Composable` 函数、状态管理、协程/flow 集成）和 KVision 用户（允许与 UI 组件进行某些命令式交互的基于组件的 API）都感到熟悉。

有关文档和示例，请参阅 GitHub 上的 [Kilua 仓库](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)。

有关框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) 频道。

## Kotlin React

[React](https://react.dev/) 是一个基于组件的库，广泛用于 Web 和原生用户界面。它拥有庞大的组件生态系统、学习材料和活跃的社区。

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md) 是 React 的 Kotlin 包装器，它将 React 生态系统与 Kotlin 的类型安全性和表现力结合在一起。

有关该库的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#react](https://kotlinlang.slack.com/messages/react) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## KVision

[KVision](https://kvision.io) 是一个面向对象的 Web 框架，用于通过开箱即用的 UI 组件构建 Kotlin/JS 应用程序。这些组件可以作为应用程序用户界面的构建块。

通过该框架，您可以使用响应式和命令式编程模型来构建前端。您还可以通过使用 Ktor、Spring Boot 和其他框架的连接器将其与您的服务器端应用程序集成。此外，您还可以使用 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 共享代码。

有关文档、教程和示例，请参阅 [KVision 文档](https://kvision.io/#docs) 网站。

有关框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## fritz2

[fritz2](https://www.fritz2.dev) 是一个用于构建响应式 Web 用户界面的独立框架。它提供了自己的类型安全 DSL，用于构建和渲染 HTML 元素，并使用 Kotlin 的协程和 flow 来定义组件及其数据绑定。

fritz2 开箱即用，提供状态管理、验证、路由等功能。它还可以与 Kotlin Multiplatform 项目集成。

有关文档、教程和示例，请参阅 [fritz2 文档](https://www.fritz2.dev/docs/) 网站。

有关框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## Doodle

[Doodle](https://nacular.github.io/doodle/) 是一个用于 Kotlin/JS 的基于矢量的 UI 框架。Doodle 应用程序使用浏览器的图形功能来绘制用户界面，而不是依赖于 DOM（文档对象模型）、CSS 或 JavaScript。这种方法让您可以控制任意 UI 元素、矢量图形、渐变和自定义可视化的渲染。

有关文档、教程和示例，请参阅 [Doodle 文档](https://nacular.github.io/doodle/docs/introduction/) 网站。

有关框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。