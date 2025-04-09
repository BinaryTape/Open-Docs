---
title: "用于数据分析的 Kotlin"
---
探索和分析数据可能不是你每天都会做的事情，但作为一名软件开发者，这是一项至关重要的技能。

让我们想想软件开发中数据分析至关重要的任务：调试时分析集合中实际包含的内容，挖掘内存转储或数据库，或者在使用 REST API 时接收包含大量数据的 JSON 文件，等等。

借助 Kotlin 的探索性数据分析 (EDA, Exploratory Data Analysis) 工具，例如 [Kotlin notebooks](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe) 和 [Kandy](#kandy)，你可以
拥有一套丰富的功能，从而增强你的分析技能，并在不同的场景中为你提供支持：

* **加载、转换和可视化各种格式的数据：** 使用我们的 Kotlin EDA 工具，你可以执行诸如过滤、排序和聚合数据之类的任务。我们的工具可以无缝地
直接在 IDE 中从不同的文件格式（包括 CSV、JSON 和 TXT）读取数据。

    我们的绘图工具 Kandy 允许你创建各种图表，以可视化数据集并从中获得见解。

* **高效地分析存储在关系数据库中的数据：** Kotlin DataFrame 可以与数据库无缝集成，并提供类似于 SQL 查询的功能。
你可以直接从各种数据库中检索、操作和可视化数据。

* **从 Web API 获取和分析实时和动态数据集：** EDA 工具的灵活性允许通过 OpenAPI 等协议与外部 API 集成。
此功能可帮助你从 Web API 获取数据，然后根据你的需要清理和转换数据。

你想尝试我们的 Kotlin 数据分析工具吗？

<a href="get-started-with-kotlin-notebooks"><img src="/img/kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" /></a>

我们的 Kotlin 数据分析工具使你可以从头到尾顺利地处理数据。使用我们的 Kotlin Notebook 中简单的拖放功能轻松地
检索数据。只需几行代码即可清理、转换和可视化数据。
此外，只需单击几下即可导出输出图表。

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

## Notebooks

_Notebooks_ 是交互式编辑器，可在单个环境中集成代码、图形和文本。使用 notebook 时，
你可以运行代码单元格并立即查看输出。

Kotlin 提供了不同的 notebook 解决方案，例如 [Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore) 和
[Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)，从而为数据检索、转换、探索、建模等提供便捷的功能。
这些 Kotlin notebook 解决方案基于我们的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)。

你可以在 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 之间无缝共享代码。在一个 Kotlin notebook 中创建一个项目，
然后在另一个 notebook 中继续工作，而不会出现兼容性问题。

受益于我们强大的 Kotlin notebook 的功能以及使用 Kotlin 编码的优势。Kotlin 与这些 notebook 集成在一起，
可帮助你管理数据并与同事分享你的发现，同时培养你的数据科学和机器学习技能。

了解我们不同的 Kotlin notebook 解决方案的功能，然后选择最适合你的项目要求的解决方案。

<img src="/img/kotlin-notebook.png" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview) 是 IntelliJ IDEA 的一个插件，允许你用 Kotlin 创建 notebook。它提供我们的 IDE 体验以及所有常见的 IDE 功能，
提供实时的代码洞察和项目集成。

### Datalore 中的 Kotlin notebooks

使用 [Datalore](https://datalore.jetbrains.com/)，你可以直接在浏览器中使用 Kotlin，而无需额外安装。
你还可以共享你的 notebook 并远程运行它们，与其他 Kotlin notebook 实时协作，
在编写代码时获得智能编码辅助，并通过交互式或静态报告导出结果。

### 带有 Kotlin Kernel 的 Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) 是一个开源 Web 应用程序，
允许你创建和共享包含代码、
可视化效果和 Markdown 文本的文档。
[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一个开源项目，它将 Kotlin
支持引入 Jupyter Notebook，从而在 Jupyter 环境中利用 Kotlin 的强大功能。

## Kotlin DataFrame

使用 [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库，你可以在 Kotlin 项目中操作结构化数据。从数据创建和
清理到深入分析和特征工程，此库都能满足你的需求。

借助 Kotlin DataFrame 库，你可以使用不同的文件格式，包括 CSV、JSON、XLS 和 XLSX。此库还有助于数据检索过程，
因为它能够连接到 SQL 数据库或 API。

<img src="/img/data-analysis-dataframe-example.png" alt="Kotlin DataFrame" width="700" style={{verticalAlign: 'middle'}}/>

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源 Kotlin 库，它提供了一个强大而灵活的 DSL，用于绘制各种类型的图表。
这个库是一个简单、惯用、可读且类型安全的工具，用于可视化数据。

Kandy 可以与 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 无缝集成。你还可以轻松地将 Kandy 和
Kotlin DataFrame 库结合起来以完成不同的数据相关任务。

<img src="/img/data-analysis-kandy-example.png" alt="Kandy" width="700" style={{verticalAlign: 'middle'}}/>

## 接下来

* [Kotlin Notebook 入门](get-started-with-kotlin-notebooks)
* [使用 Kotlin DataFrame 库检索和转换数据](data-analysis-work-with-data-sources)
* [使用 Kandy 库可视化数据](data-analysis-visualization)
* [详细了解用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries)