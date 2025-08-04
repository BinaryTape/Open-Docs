[//]: # (title: Kotlin 用于 JavaScript)

Kotlin/JS 提供了将 Kotlin 代码、Kotlin 标准库以及任何兼容的依赖项转译为 JavaScript 的能力。Kotlin/JS 的当前实现面向 [ES5](https://www.ecma-international.org/ecma-262/5.1/)。

推荐使用 Kotlin/JS 的方式是通过 `kotlin.multiplatform` Gradle 插件。它使你能够轻松地集中设置和控制面向 JavaScript 的 Kotlin 项目。这包括基本功能，例如控制应用程序的打包、直接从 npm 添加 JavaScript 依赖项等。要了解可用选项的概述，请参阅 [设置 Kotlin/JS 项目](js-project-setup.md)。

## Kotlin/JS IR 编译器

[Kotlin/JS IR 编译器](js-ir-compiler.md) 相对于旧的默认编译器有许多改进。例如，它通过无用代码消除来减少生成的可执行文件的大小，并提供与 JavaScript 生态系统及其工具更顺畅的互操作性。

> 旧编译器自 Kotlin 1.8.0 发布以来已弃用。
>
{style="note"}

通过从 Kotlin 代码生成 TypeScript 声明文件 (`d.ts`)，IR 编译器使得创建混合 TypeScript 和 Kotlin 代码的“混合”应用程序变得更容易，并能利用 Kotlin Multiplatform 的代码共享功能。

要了解更多关于 Kotlin/JS IR 编译器中的可用特性以及如何在项目中尝试它，请访问 [Kotlin/JS IR 编译器文档页面](js-ir-compiler.md) 和[迁移指南](js-ir-migration.md)。

## Kotlin/JS 框架

现代 Web 开发显著受益于简化 Web 应用程序构建的框架。以下是由不同作者编写的，针对 Kotlin/JS 的流行 Web 框架的一些示例：

### Kobweb

_Kobweb_ 是一个有主见的 Kotlin 框架，用于创建网站和 Web 应用。它利用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 和热重载来实现快速开发。受 [Next.js](https://nextjs.org/) 启发，Kobweb 提倡一种用于添加小部件、布局和页面的标准结构。

开箱即用，Kobweb 提供页面路由、亮/暗模式、CSS 样式、Markdown 支持、后端 API 和更多特性。它还包含一个名为 Silk 的 UI 库，这是一套用于现代 UI 的多功能小部件。

Kobweb 还支持网站导出，生成用于 SEO 和自动搜索索引的页面快照。此外，Kobweb 使得创建基于 DOM 的 UI 变得容易，这些 UI 能够高效地响应状态变化并进行更新。

访问 [Kobweb](https://kobweb.varabyte.com/) 网站，获取文档和示例。

有关该框架的更新和讨论，请加入 Kotlin Slack 中的 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 频道。

### KVision

_KVision_ 是一个面向对象的 Web 框架，它使得可以使用即用型组件在 Kotlin/JS 中编写应用程序，这些组件可以作为应用程序用户界面的构建块。你可以使用反应式和命令式编程模型来构建前端，使用 Ktor、Spring Boot 和其他框架的连接器将其与服务器端应用程序集成，并使用 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 共享代码。

访问 [KVision 网站](https://kvision.io) 获取文档、教程和示例。

有关该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#kvision](https://kotlinlang.slack.com/messages/kvision) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

### fritz2

_fritz2_ 是一个独立框架，用于构建反应式 Web 用户界面。它提供了自己的类型安全的 DSL 用于构建和渲染 HTML 元素，并利用 Kotlin 的协程和 Flow 来表达组件及其数据绑定。它提供开箱即用的状态管理、验证、路由等功能，并与 Kotlin Multiplatform 项目集成。

访问 [fritz2 网站](https://www.fritz2.dev) 获取文档、教程和示例。

有关该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

### Doodle

_Doodle_ 是一个基于矢量的 Kotlin/JS UI 框架。Doodle 应用程序利用浏览器的图形能力来绘制用户界面，而不是依赖于 DOM、CSS 或 Javascript。通过这种方法，Doodle 使你能够精确控制任意 UI 元素、矢量图形、渐变和自定义可视化效果的渲染。

访问 [Doodle 网站](https://nacular.github.io/doodle/) 获取文档、教程和示例。

有关该框架的更新和讨论，请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#doodle](https://kotlinlang.slack.com/messages/doodle) 和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道。

## 加入 Kotlin/JS 社区

你可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道，与社区和团队交流。