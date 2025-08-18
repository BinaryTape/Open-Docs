[//]: # (title: Kotlin 和 TeamCity 持续集成)

在本页面中，你将学习如何设置 [TeamCity](https://www.jetbrains.com/teamcity/) 以构建你的 Kotlin 项目。关于 TeamCity 的更多信息和基础知识，请查阅其[文档页面](https://www.jetbrains.com/teamcity/documentation/)，该页面包含安装、基本配置等信息。

Kotlin 可与多种构建工具配合使用，因此如果你正在使用 Ant、Maven 或 Gradle 等标准工具，设置 Kotlin 项目的过程与集成这些工具的任何其他语言或库并无不同。当使用 IntelliJ IDEA 的内部构建系统时，会存在一些细微的要求和差异，而此系统也受 TeamCity 支持。

## Gradle、Maven 和 Ant

如果使用 Ant、Maven 或 Gradle，设置过程非常简单。只需定义“构建步骤”（Build Step）即可。例如，如果使用 Gradle，只需定义所需的参数，例如“步骤名称”（Step Name）和针对“Runner 类型”（Runner Type）需要执行的 Gradle tasks。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由于 Kotlin 所需的所有依赖项都已在 Gradle 文件中定义，因此无需为 Kotlin 的正确运行进行其他特定配置。

如果使用 Ant 或 Maven，配置方式相同。唯一的区别是“Runner 类型”（Runner Type）将分别是 Ant 或 Maven。

## IntelliJ IDEA 构建系统

如果将 IntelliJ IDEA 构建系统与 TeamCity 结合使用，请确保 IntelliJ IDEA 使用的 Kotlin 版本与 TeamCity 运行的版本一致。你可能需要下载特定版本的 Kotlin plugin 并将其安装在 TeamCity 上。

幸运的是，已有一个可用的 meta-runner，可以处理大部分手动工作。如果你不熟悉 TeamCity meta-runner 的概念，请查阅[文档](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。它们是一种非常简单且强大的方式，无需编写 plugins 即可引入自定义 Runners。

### 下载并安装 meta-runner

Kotlin 的 meta-runner 可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上获取。下载该 meta-runner 并从 TeamCity 用户界面导入。

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 设置 Kotlin 编译器获取步骤

基本上，此步骤仅限于定义“步骤名称”（Step Name）和你所需的 Kotlin 版本。可以使用 Tags。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

Runner 将根据 IntelliJ IDEA 项目中的路径设置，将属性 `system.path.macro.KOTLIN.BUNDLED` 的值设置为正确的值。然而，此值需要在 TeamCity 中定义（并且可以设置为任何值）。因此，你需要将其定义为一个系统变量。

### 设置 Kotlin 编译步骤

最后一步是定义项目的实际编译，它使用标准的 IntelliJ IDEA Runner 类型。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

这样，我们的项目现在应该能够构建并生成相应的构件了。

## 其他 CI 服务器

如果你使用的是不同于 TeamCity 的持续集成工具，只要它支持任何构建工具或调用命令行工具，那么将 Kotlin 编译并自动化作为 CI 过程的一部分应该都是可行的。