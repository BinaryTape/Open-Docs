---
title: "Kotlin for JavaScript"
---
Kotlin/JS 提供了将 Kotlin 代码、Kotlin 标准库和任何兼容的依赖项转换为 JavaScript 的能力。目前 Kotlin/JS 的实现目标是 [ES5](https://www.ecma-international.org/ecma-262/5.1/)。

推荐使用 `kotlin.multiplatform` Gradle 插件来使用 Kotlin/JS。它让你能够在一个地方轻松设置和控制以 JavaScript 为目标的 Kotlin 项目。这包括基本功能，例如控制应用程序的打包、直接从 npm 添加 JavaScript 依赖项等等。要了解可用选项的概述，请查看 [设置 Kotlin/JS 项目](js-project-setup)。

## Kotlin/JS IR 编译器

[Kotlin/JS IR 编译器](js-ir-compiler) 比旧的默认编译器有很多改进。例如，它通过消除无用代码来减小生成的执行文件的大小，并提供与 JavaScript 生态系统及其工具更顺畅的互操作性（interoperability）。

:::note
旧的编译器自 Kotlin 1.8.0 版本起已被弃用。

:::

通过从 Kotlin 代码生成 TypeScript 声明文件（`d.ts`），IR 编译器可以更轻松地创建混合 TypeScript 和 Kotlin 代码的“混合”应用程序，并利用 Kotlin Multiplatform 使用代码共享功能。

要了解有关 Kotlin/JS IR 编译器中可用功能的更多信息以及如何为你的项目尝试它，请访问 [Kotlin/JS IR 编译器文档页面](js-ir-compiler) 和 [迁移指南](js-ir-migration)。

## Kotlin/JS 框架

现代 Web 开发从简化 Web 应用程序构建的框架中获益匪浅。以下是一些由不同作者编写的流行的 Kotlin/JS Web 框架示例：

### Kobweb

_Kobweb_ 是一个有主见的（opinionated） Kotlin 框架，用于创建网站和 Web 应用程序。它利用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 和实时重新加载（live-reloading）来实现快速开发。受 [Next.js](https://nextjs.org/) 的启发，Kobweb 提倡用于添加小部件（widgets）、布局（layouts）和页面（pages）的标准结构。

开箱即用，Kobweb 提供页面路由（page routing）、明/暗模式、CSS 样式、Markdown 支持、后端 API 和更多功能。它还包括一个名为 Silk 的 UI 库，这是一组用于现代 UI 的通用小部件。

Kobweb 还支持站点导出，为 SEO 生成页面快照和自动搜索索引。此外，Kobweb 可以轻松创建基于 DOM 的 UI，这些 UI 可以有效地响应状态变化而更新。

访问 [Kobweb](https://kobweb.varabyte.com/) 站点以获取文档和示例。

有关该框架的更新和讨论，请加入 Kotlin Slack 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 频道。

### KVision

_KVision_ 是一个面向对象的 Web 框架，可以使用现成的组件在 Kotlin/JS 中编写应用程序，这些组件可以用作应用程序用户界面的构建块。你可以使用响应式和命令式编程模型来构建你的前端，使用 Ktor、Spring Boot 和其他框架的连接器将其与你的服务器端应用程序集成，并使用 [Kotlin Multiplatform](multiplatform-intro) 共享代码。

[访问 KVision 站点](https://kvision.io) 以获取文档、教程和示例。

有关该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

### fritz2

_fritz2_ 是一个独立的框架，用于构建响应式 Web 用户界面。它提供了自己的类型安全 DSL，用于构建和渲染 HTML 元素，并且它利用 Kotlin 的协程（coroutines）和流（flows）来表达组件及其数据绑定。它提供了状态管理、验证、路由等开箱即用的功能，并与 Kotlin Multiplatform 项目集成。

[访问 fritz2 站点](https://www.fritz2.dev) 以获取文档、教程和示例。

有关该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

### Doodle

_Doodle_ 是一个基于矢量的 Kotlin/JS UI 框架。Doodle 应用程序使用浏览器的图形功能来绘制用户界面，而不是依赖 DOM、CSS 或 Javascript。通过使用这种方法，Doodle 使你可以精确控制任意 UI 元素、矢量形状、渐变和自定义可视化的渲染。

[访问 Doodle 站点](https://nacular.github.io/doodle/) 以获取文档、教程和示例。

有关该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## 加入 Kotlin/JS 社区

你可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道，与社区和团队聊天。