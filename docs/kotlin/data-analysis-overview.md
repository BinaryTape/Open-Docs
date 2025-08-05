[//]: # (title: Kotlin 用于数据分析)

探索和分析数据也许不是你日常工作的一部分，但作为一名软件开发者，这是一项你必需的关键技能。

让我们思考一下数据分析至关重要的软件开发职责：调试时分析集合内部的实际内容、深入探查内存转储或数据库、或者在使用 REST API 时接收大量数据的 JSON 文件，等等。

借助 Kotlin 的探索性数据分析 (EDA) 工具，例如 [Kotlin notebook](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe) 和 [Kandy](#kandy)，你将拥有一套丰富的功能，可供你提升分析技能，并支持你在不同场景下的需求：

*   **以各种格式加载、转换和可视化数据：** 借助我们的 Kotlin EDA 工具，你可以执行过滤、排序和聚合数据等任务。我们的工具可以直接在 IDE 中无缝读取来自不同文件格式（包括 CSV、JSON 和 TXT）的数据。

    Kandy，我们的绘图工具，允许你创建各种图表，以可视化数据集并从中获取洞察。

*   **高效分析存储在关系型数据库中的数据：** Kotlin DataFrame 可与数据库无缝集成，并提供与 SQL 查询类似的功能。你可以直接从各种数据库中检索、操作和可视化数据。

*   **从 Web API 获取并分析实时动态数据集：** EDA 工具的灵活性允许通过诸如 OpenAPI 等协议与外部 API 集成。此特性可帮助你从 Web API 获取数据，然后清理并根据需求转换数据。

你想试试我们的 Kotlin 数据分析工具吗？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="开始使用 Kotlin notebook" style="block"/></a>

我们的 Kotlin 数据分析工具让你从头到尾流畅处理数据。你可以在 Kotlin notebook 中通过简单的拖放功能轻松检索数据。仅需几行代码即可清理、转换和可视化数据。此外，只需点击几下即可导出输出图表。

![Kotlin notebook](data-analysis-notebook.gif){width=700}

## notebook

_notebook_ 是交互式编辑器，可将代码、图形和文本集成到单一环境中。使用 notebook 时，你可以运行代码单元并立即查看输出。

Kotlin 提供不同的 notebook 解决方案，例如 [Kotlin notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore) 和 [Kotlin-Jupyter notebook](#jupyter-notebook-with-kotlin-kernel)，提供便捷特性用于数据检索、转换、探索、建模等。这些 Kotlin notebook 解决方案基于我们的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)。

你可以在 Kotlin notebook、Datalore 和 Kotlin-Jupyter notebook 之间无缝共享代码。在一个 Kotlin notebook 中创建项目，然后在另一个 notebook 中继续工作，而不会出现兼容性问题。

受益于我们强大的 Kotlin notebook 的特性以及用 Kotlin 编程的优势。Kotlin 与这些 notebook 集成，帮助你管理数据并与同事分享你的发现，同时培养你的数据科学和机器学习技能。

了解我们不同的 Kotlin notebook 解决方案的特性，并选择最符合你的项目要求的方案。

![Kotlin notebook](kotlin-notebook.png){width=700}

### Kotlin notebook

[Kotlin notebook](kotlin-notebook-overview.md) 是 IntelliJ IDEA 的一个插件，允许你在 Kotlin 中创建 notebook。它提供了我们的 IDE 体验以及所有常见的 IDE 特性，提供实时代码洞察和项目集成。

### Datalore 中的 Kotlin notebook

借助 [Datalore](https://datalore.jetbrains.com/)，你可以开箱即用地在浏览器中使用 Kotlin，无需额外安装。你还可以共享你的 notebook 并远程运行它们，与其他 Kotlin notebook 实时协作，在你编写代码时获得智能编码辅助，并通过交互式或静态报告导出结果。

### 带 Kotlin Kernel 的 Jupyter notebook

[Jupyter notebook](https://jupyter.org/) 是一个开源 Web 应用程序，允许你创建和共享包含代码、可视化内容和 Markdown 文本的文档。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一个开源项目，它为 Jupyter notebook 带来了 Kotlin 支持，以便在 Jupyter 环境中发挥 Kotlin 的强大功能。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库允许你在 Kotlin 项目中操作结构化数据。从数据创建和清理到深入分析和特性工程，这个库都能满足你的需求。

使用 Kotlin DataFrame 库，你可以处理不同的文件格式，包括 CSV、JSON、XLS 和 XLSX。该库还通过其连接 SQL 数据库或 API 的能力，简化了数据检索过程。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源 Kotlin 库，提供强大且灵活的 DSL，用于绘制各种类型图表。这个库是一个简单、惯用、可读且类型安全的工具，用于可视化数据。

Kandy 可与 Kotlin notebook、Datalore 和 Kotlin-Jupyter notebook 无缝集成。你还可以轻松结合 Kandy 和 Kotlin DataFrame 库，以完成不同的数据相关任务。

![Kandy](data-analysis-kandy-example.png){width=700}

## 后续步骤

*   [开始使用 Kotlin notebook](get-started-with-kotlin-notebooks.md)
*   [使用 Kotlin DataFrame 库检索和转换数据](data-analysis-work-with-data-sources.md)
*   [使用 Kandy 库可视化数据](data-analysis-visualization.md)
*   [了解更多关于 Kotlin 和 Java 数据分析库的信息](data-analysis-libraries.md)