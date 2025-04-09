---
title: "Kotlin Notebook"
---
[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) 是 IntelliJ IDEA 的一个动态插件，它提供了一个交互式环境来创建和编辑 Notebook，充分利用 Kotlin 的全部潜力。

:::note
Kotlin Notebook 插件需要 IntelliJ IDEA Ultimate。

:::

准备好迎接无缝的编码体验吧，您可以在 IntelliJ IDEA 生态系统中开发和实验 Kotlin 代码，接收即时输出，并将代码、视觉效果和文本集成在一起。

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebook 插件提供了[各种功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)来加速您的开发过程，例如：

* 在单元格中访问 API
* 只需点击几下即可导入和导出文件
* 使用 REPL 命令进行快速项目探索
* 获得丰富的输出格式
* 使用注解或类似 Gradle 的语法直观地管理依赖项
* 使用单行代码导入各种库，甚至向项目中添加新库
* 通过错误消息和回溯获取调试见解

Kotlin Notebook 基于我们的 [Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)，使其易于与其他 [Kotlin notebook 解决方案](data-analysis-overview#notebooks)集成。没有兼容性问题，您可以轻松地在 Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/) 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 之间共享您的工作。

借助这些功能，您可以执行各种任务，从简单的代码实验到全面的数据项目。

深入研究以下各节，了解您可以使用 Kotlin Notebook 实现哪些目标！

## 数据分析和可视化

无论您是进行初步的数据探索还是完成端到端的数据分析项目，Kotlin Notebook 都能为您提供合适的工具。

在 Kotlin Notebook 中，您可以直观地集成 [libraries](data-analysis-libraries)，以便检索、转换、绘制和建模您的数据，同时获得操作的即时输出。

对于与分析相关的任务，[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库提供了强大的解决方案。 该库有助于加载、创建、过滤和清理结构化数据。

Kotlin DataFrame 还支持与 SQL 数据库的无缝连接，并直接在 IDE 中从不同的文件格式（包括 CSV、JSON 和 TXT）读取数据。

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源 Kotlin 库，允许您创建各种类型的图表。 Kandy 的惯用、可读和类型安全的功能使您可以有效地可视化数据并获得有价值的见解。

<img src="/img/data-analysis-kandy-example.png" alt="data-analytics-and-visualization" width="700" style={{verticalAlign: 'middle'}}/>

## 原型设计 (Prototyping)

Kotlin Notebook 提供了一个交互式环境，用于以小块形式运行代码并实时查看结果。 这种实践方法可以在原型设计阶段实现快速的实验和迭代。

借助 Kotlin Notebook，您可以在构思阶段的早期测试解决方案的概念。 此外，Kotlin Notebook 还支持协作和可重现的工作，从而能够生成和评估新想法。

<img src="/img/kotlin-notebook-prototyping.png" alt="kotlin-notebook-prototyping" width="700" style={{verticalAlign: 'middle'}}/>

## 后端开发 (Backend development)

Kotlin Notebook 提供了在单元格中调用 API 以及使用 OpenAPI 等协议的能力。 它与外部服务和 API 交互的能力使其在某些后端开发场景中非常有用，例如直接在 notebook 环境中检索信息和读取 JSON 文件。

<img src="/img/kotlin-notebook-backend-development.png" alt="kotlin-notebook-backend-development" width="700" style={{verticalAlign: 'middle'}}/>

## 代码文档 (Code documentation)

在 Kotlin Notebook 中，您可以在代码单元格中包含内联注释和文本注解，以提供与代码片段相关的其他上下文、解释和说明。

您还可以用 Markdown 单元格编写文本，这些单元格支持丰富的格式选项，例如标题、列表、链接、图像等。 要呈现 Markdown 单元格并查看格式化的文本，只需像运行代码单元格一样运行它即可。

<img src="/img/kotlin-notebook-documentation.png" alt="kotlin-notebook-documenting" width="700" style={{verticalAlign: 'middle'}}/>

## 共享代码和输出

鉴于 Kotlin Notebook 遵循通用的 Jupyter 格式，因此可以在不同的 notebook 之间共享您的代码和输出。 您可以使用任何 Jupyter 客户端（例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)）打开、编辑和运行 Kotlin Notebook。

您还可以通过与任何 notebook 网络查看器共享 `.ipynb` notebook 文件来分发您的工作。 一种选择是 [GitHub](https://github.com/)，它本身可以呈现此格式。 另一种选择是 [JetBrain's Datalore](https://datalore.jetbrains.com/) 平台，该平台有助于共享、运行和编辑具有高级功能（如计划的 notebook 运行）的 notebook。

<img src="/img/kotlin-notebook-sharing-datalore.png" alt="kotlin-notebook-sharing-datalore" width="700" style={{verticalAlign: 'middle'}}/>

## 接下来

* [了解 Kotlin Notebook 的用法和主要功能。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
* [试用 Kotlin Notebook。](get-started-with-kotlin-notebooks)
* [深入了解用于数据分析的 Kotlin。](data-analysis-overview)