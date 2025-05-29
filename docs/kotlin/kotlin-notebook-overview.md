[//]: # (title: Kotlin Notebook)

Kotlin Notebook 提供了一个交互式环境，用于创建和编辑笔记本，充分利用了 Kotlin 的全部能力。

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，
该插件默认捆绑并[在 IntelliJ IDEA 中启用](kotlin-notebook-set-up-env.md)。

准备好迎接无缝的编码体验吧，您可以在 IntelliJ IDEA 生态系统内开发和实验 Kotlin 代码，获得即时输出，并整合代码、视觉效果和文本。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebook 插件提供了[多种功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)来提升您的开发流程，例如：

*   在单元格内访问 API
*   轻松点击即可导入和导出文件
*   使用 REPL 命令快速探索项目
*   获取丰富的输出格式集
*   使用注解或类似 Gradle 的语法直观地管理依赖
*   只需一行代码即可导入各种库，甚至向项目中添加新库
*   通过错误消息和堆栈跟踪获取调试见解

Kotlin Notebook 基于我们的 [Jupyter Notebooks 的 Kotlin 内核](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)，
使其易于与[其他 Kotlin 笔记本解决方案](data-analysis-overview.md#notebooks)集成。
没有兼容性问题，您可以轻松地在 Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/) 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 之间共享您的工作。

凭借这些功能，您可以承担各种任务，从简单的代码实验到全面的数据项目。

深入了解以下部分，探索您可以使用 Kotlin Notebook 实现什么！

## 数据分析与可视化

无论您是进行初步数据探索还是完成端到端数据分析项目，Kotlin Notebook 都拥有适合您的工具。

在 Kotlin Notebook 中，您可以直观地集成[库](data-analysis-libraries.md)，让您检索、转换、绘图和建模数据，同时获得操作的即时输出。

对于分析相关任务，[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库提供了强大的解决方案。该库方便加载、创建、过滤和清洗结构化数据。

Kotlin DataFrame 还支持与 SQL 数据库无缝连接，并直接在 IDE 中读取来自不同文件格式（包括 CSV、JSON 和 TXT）的数据。

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源的 Kotlin 库，允许您创建各种类型的图表。
Kandy 惯用、可读且类型安全的特性让您有效地可视化数据并获得有价值的见解。

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## 原型设计

Kotlin Notebook 提供了一个交互式环境，用于以小块代码运行并实时查看结果。
这种实践方法可以在原型设计阶段实现快速实验和迭代。

借助 Kotlin Notebook，您可以在构思阶段早期测试解决方案的概念。此外，Kotlin Notebook 支持协作和可重现的工作，从而实现新想法的生成和评估。

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## 后端开发

Kotlin Notebook 提供了在单元格内调用 API 和使用 OpenAPI 等协议的能力。它与外部服务和 API 交互的能力使其在某些后端开发场景中非常有用，例如直接在您的笔记本环境中检索信息和读取 JSON 文件。

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## 代码文档

在 Kotlin Notebook 中，您可以在代码单元格中包含内联注释和文本注解，以提供与代码片段相关的额外上下文、解释和说明。

您还可以在 Markdown 单元格中编写文本，这些单元格支持丰富的格式选项，例如标题、列表、链接、图片等。
要渲染 Markdown 单元格并查看格式化文本，只需像运行代码单元格一样运行它。

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## 共享代码和输出

鉴于 Kotlin Notebook 遵循通用的 Jupyter 格式，因此可以在不同的笔记本之间共享您的代码和输出。
您可以使用任何 Jupyter 客户端（例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)）打开、编辑和运行您的 Kotlin Notebook。

您还可以通过与任何笔记本网络查看器共享 `.ipynb` 笔记本文件来分发您的工作。一个选项是 [GitHub](https://github.com/)，它原生渲染此格式。
另一个选项是 [JetBrain 的 Datalore](https://datalore.jetbrains.com/) 平台，它促进共享、运行和编辑笔记本，并提供高级功能，例如预定笔记本运行。

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## 下一步

*   [了解 Kotlin Notebook 的用法和主要功能。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [试用 Kotlin Notebook。](get-started-with-kotlin-notebooks.md)
*   [深入了解用于数据分析的 Kotlin。](data-analysis-overview.md)