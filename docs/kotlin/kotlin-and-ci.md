[//]: # (title: Kotlin 与 TeamCity 持续集成)

本页面将介绍如何设置 [TeamCity](https://www.jetbrains.com/teamcity/) 来构建你的 Kotlin 项目。有关 TeamCity 的更多信息和基础知识，请查阅 [文档页面](https://www.jetbrains.com/teamcity/documentation/)，其中包含安装、基本配置等信息。

Kotlin 适用于各种构建工具，因此如果你使用 Ant、Maven 或 Gradle 等标准工具，设置 Kotlin 项目的过程与任何其他集成这些工具的语言或库并无不同。只有在使用 IntelliJ IDEA 的内部构建系统时才存在一些细微的要求和差异，该系统也受 TeamCity 支持。

## Gradle、Maven 和 Ant

如果使用 Ant、Maven 或 Gradle，设置过程非常简单。所需要做的只是定义构建步骤 (Build Step)。例如，如果使用 Gradle，只需定义所需参数，例如步骤名称 (Step Name) 和运行器类型 (Runner Type) 需要执行的 Gradle 任务。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由于 Kotlin 所需的所有依赖项都在 Gradle 文件中定义，因此无需为 Kotlin 的正确运行进行其他特定配置。

如果使用 Ant 或 Maven，相同的配置也适用。唯一的区别是运行器类型 (Runner Type) 将分别为 Ant 或 Maven。

## IntelliJ IDEA 构建系统

如果将 IntelliJ IDEA 构建系统与 TeamCity 结合使用，请确保 IntelliJ IDEA 使用的 Kotlin 版本与 TeamCity 运行的版本一致。你可能需要下载特定版本的 Kotlin 插件并将其安装在 TeamCity 上。

幸运的是，已有一个元运行器 (meta-runner) 可用，它处理了大部分手动工作。如果不熟悉 TeamCity 元运行器 (meta-runner) 的概念，请查阅 [文档](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。它们是一种非常简单且强大的方式，可以引入自定义运行器 (Runner) 而无需编写插件。

### 下载并安装元运行器

Kotlin 的元运行器 (meta-runner) 可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上获取。下载该元运行器 (meta-runner) 并从 TeamCity 用户界面导入。

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 设置 Kotlin 编译器获取步骤

基本上，此步骤仅限于定义步骤名称 (Step Name) 和你需要的 Kotlin 版本。可以使用标签。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

运行器 (Runner) 将根据 IntelliJ IDEA 项目中的路径设置，将属性 `system.path.macro.KOTLIN.BUNDLED` 的值设置为正确的值。但是，此值需要在 TeamCity 中定义（并且可以设置为任何值）。因此，你需要将其定义为系统变量。

### 设置 Kotlin 编译步骤

最后一步是定义项目的实际编译，该步骤使用标准的 IntelliJ IDEA 运行器类型 (Runner Type)。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

至此，我们的项目现在应该能够构建并生成相应的制品 (artifacts) 了。

## 其他 CI 服务器

如果使用与 TeamCity 不同的持续集成工具，只要它支持任何构建工具或调用命令行工具，那么编译 Kotlin 并将自动化作为 CI 流程的一部分就应该是可行的。