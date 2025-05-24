---
title: "Kotlin 和 TeamCity 的持续集成"
---
在本页中，你将学习如何设置 [TeamCity](https://www.jetbrains.com/teamcity/) 来构建你的 Kotlin 项目。有关 TeamCity 的更多信息和基础知识，请查看[文档页面](https://www.jetbrains.com/teamcity/documentation/)，其中包含有关安装、基本配置等信息。

Kotlin 可以与不同的构建工具一起使用，因此，如果你使用的是 Ant、Maven 或 Gradle 等标准工具，那么设置 Kotlin 项目的过程与集成这些工具的任何其他语言或库没有什么不同。当使用 IntelliJ IDEA 的内部构建系统时，会存在一些小的要求和差异，TeamCity 也支持这种方式。

## Gradle、Maven 和 Ant

如果使用 Ant、Maven 或 Gradle，设置过程非常简单。只需定义构建步骤（Build Step）即可。例如，如果使用 Gradle，只需为运行器类型（Runner Type）定义所需的参数，例如步骤名称（Step Name）和需要执行的 Gradle 任务。

<img src="/img/teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由于 Kotlin 所需的所有依赖项都在 Gradle 文件中定义，因此无需为 Kotlin 正确运行进行任何其他特定配置。

如果使用 Ant 或 Maven，则应用相同的配置。唯一的区别是运行器类型（Runner Type）将分别是 Ant 或 Maven。

## IntelliJ IDEA 构建系统

如果将 IntelliJ IDEA 构建系统与 TeamCity 一起使用，请确保 IntelliJ IDEA 使用的 Kotlin 版本与 TeamCity 运行的版本相同。你可能需要下载特定版本的 Kotlin 插件并在 TeamCity 上安装它。

幸运的是，已经有一个元运行器（meta-runner）可以处理大部分手动工作。如果不熟悉 TeamCity 元运行器的概念，请查看[文档](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。它们是一种非常简单而强大的方式，无需编写插件即可引入自定义运行器（Runner）。

### 下载并安装元运行器（meta-runner）

Kotlin 的元运行器可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上找到。下载该元运行器并从 TeamCity 用户界面导入它

<img src="/img/teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 设置 Kotlin 编译器获取步骤

基本上，此步骤仅限于定义步骤名称（Step Name）和你需要的 Kotlin 版本。可以使用标签（Tags）。

<img src="/img/teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

运行器（runner）会将属性 `system.path.macro.KOTLIN.BUNDLED` 的值设置为基于 IntelliJ IDEA 项目的路径设置的正确值。但是，此值需要在 TeamCity 中定义（并且可以设置为任何值）。因此，你需要将其定义为系统变量。

### 设置 Kotlin 编译步骤

最后一步是定义项目的实际编译，它使用标准的 IntelliJ IDEA 运行器类型（Runner Type）。

<img src="/img/teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

这样，我们的项目现在应该可以构建并生成相应的 artifacts。

## 其他 CI 服务器

如果使用与 TeamCity 不同的持续集成工具，只要它支持任何构建工具或调用命令行工具，就应该可以编译 Kotlin 并将事情自动化作为 CI 过程的一部分。