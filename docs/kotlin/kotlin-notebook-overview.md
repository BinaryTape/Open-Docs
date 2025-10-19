[//]: # (title: Kotlin Notebook)

Kotlin Notebook 提供了一个交互式环境，用于创建和编辑 Notebook，充分利用了 Kotlin 的全部能力。
Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，
该插件已捆绑并[默认在 IntelliJ IDEA 中启用](kotlin-notebook-set-up-env.md)。

Notebook 是一种交互式文档，您可以在其中混合可执行的 Kotlin 代码与文本、结果和可视化内容。可以将其视为 Kotlin REPL 的扩展，它具备将代码组织成单元格、使用 Markdown 进行文档编写，并立即显示与生成代码并列的输出（从文本到图表）的能力。

准备好迎接无缝的编码体验，您可以在其中开发和实验 Kotlin 代码，接收即时输出，并将代码、可视化内容和文本集成到 IntelliJ IDEA 生态系统中。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebook 插件附带[多种特性](https://www.jetbrains.com/help/idea/kotlin-notebook.html)以提升您的开发过程，例如：

*   在单元格内访问 API
*   几次点击即可导入和导出文件
*   使用 REPL 命令进行快速项目探查
*   获得丰富的输出格式
*   使用注解或类似 Gradle 的语法直观地管理依赖项
*   通过一行代码导入各种库，甚至将新库添加到您的项目
*   通过错误消息和回溯获取调试洞察

Kotlin Notebook 基于我们的 [Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)，
这使得它易于与其他 [Kotlin Notebook 解决方案](data-analysis-overview.md#notebooks)集成。
在没有兼容性问题的情况下，您可以轻松地在 Kotlin Notebook、
[Datalore](https://datalore.jetbrains.com/) 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 之间共享您的工作。

凭借这些能力，您可以开展从简单的代码实验到综合性数据项目的广泛任务。

深入探索您可以使用 Kotlin Notebook 实现什么！

<a href="get-started-with-kotlin-notebooks.md"><img src="notebook-get-started-button.svg" width="600" alt="开始使用 Kotlin Notebook" style="block"/></a>

## 数据分析与可视化

无论您是进行初步数据探查还是完成端到端的数据分析项目，Kotlin Notebook 都为您提供了合适的工具。

在 Kotlin Notebook 中，您可以直观地集成[库](data-analysis-libraries.md)，这些库让您能够检索、转换、绘图和建模数据，同时获得操作的即时输出。

对于分析相关的任务，[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库提供了强大的解决方案。该库便于加载、创建、过滤和清洗结构化数据。

Kotlin DataFrame 还支持与 SQL 数据库的无缝连接，并可以直接在 IDE 中读取包括 CSV、JSON 和 TXT 在内的不同文件格式的数据。

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源的 Kotlin 库，它允许您创建各种类型的图表。
Kandy 惯用、可读和类型安全的特性让您能够有效地可视化数据并获得有价值的洞察。

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## 原型设计

Kotlin Notebook 提供了一个交互式环境，用于以小块运行代码并实时查看结果。这种实践方法能够在原型设计阶段实现快速实验和迭代。

借助 Kotlin Notebook，您可以在构思阶段早期测试解决方案的概念。此外，Kotlin Notebook 支持协作和可复现的工作，从而促进新想法的产生和评估。

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## 后端开发

Kotlin Notebook 提供了在单元格内调用 API 和使用 OpenAPI 等协议的能力。它与外部服务和 API 交互的能力使其在某些后端开发场景中非常有用，例如直接在 Notebook 环境中检索信息和读取 JSON 文件。

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## 代码文档

在 Kotlin Notebook 中，您可以在代码单元格内包含内联注释和文本注解，以提供与代码片段相关的额外上下文、解释和说明。

您还可以在 Markdown 单元格中编写文本，这些单元格支持丰富的格式选项，例如标题、列表、链接、图片等。要渲染 Markdown 单元格并查看格式化文本，只需像运行代码单元格一样运行它即可。

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## 共享代码和输出

鉴于 Kotlin Notebook 遵循通用的 Jupyter 格式，您可以在不同的 Notebook 之间共享代码和输出。
您可以使用任何 Jupyter 客户端（例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)）打开、编辑和运行您的 Kotlin Notebook。

您还可以通过与任何 Notebook 网络查看器共享 `.ipynb` Notebook 文件来分发您的工作。一个选择是 [GitHub](https://github.com/)，
它原生渲染此格式。另一个选择是 [JetBrain 的 Datalore](https://datalore.jetbrains.com/) 平台，
该平台通过定时 Notebook 运行等高级特性，便于共享、运行和编辑 Notebook。

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## 接下来

*   [了解 Kotlin Notebook 的用法和关键特性。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [试用 Kotlin Notebook。](get-started-with-kotlin-notebooks.md)
*   [深入探究 Kotlin 在数据分析中的应用。](data-analysis-overview.md)