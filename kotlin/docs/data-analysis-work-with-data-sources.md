---
title: 从文件中检索数据
---
[Kotlin Notebook](kotlin-notebook-overview) 结合 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)，使你能够处理非结构化和结构化数据。这种结合提供了将非结构化数据（例如 TXT 文件中的数据）转换为结构化数据集的灵活性。

对于数据转换，你可以使用诸如 [`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) 和 [`parse`](https://kotlin.github.io/dataframe/parse.html) 等方法。此外，此工具集还能够检索和操作来自各种结构化文件格式的数据，包括 CSV、JSON、XLS、XLSX 和 Apache Arrow。

在本指南中，你可以通过多个示例学习如何检索、优化和处理数据。

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)。
2. 在 IntelliJ IDEA 中安装 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)。

   > 或者，在 IntelliJ IDEA 中，从 **Settings（设置）** | **Plugins（插件）** | **Marketplace（市场）** 访问 Kotlin Notebook 插件。
   >

3. 选择 **File（文件）** | **New（新建）** | **Kotlin Notebook** 创建一个新的 Kotlin Notebook。
4. 在 Kotlin Notebook 中，通过运行以下命令导入 Kotlin DataFrame 库：

   ```kotlin
   %use dataframe
   ```

## 从文件中检索数据

要在 Kotlin Notebook 中从文件检索数据：

1. 打开你的 Kotlin Notebook 文件（`.ipynb`）。
2. 通过在笔记本开始处的代码单元格中添加 `%use dataframe` 来导入 Kotlin DataFrame 库。
   > 请确保在运行任何其他依赖 Kotlin DataFrame 库的代码单元格之前，先运行带有 `%use dataframe` 行的代码单元格。
   >

3. 使用 Kotlin DataFrame 库中的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函数来检索数据。例如，要读取 CSV 文件，请使用：`DataFrame.read("example.csv")`。

`.read()` 函数会根据文件扩展名和内容自动检测输入格式。你还可以添加其他参数来自定义该函数，例如使用 `delimiter = ';'` 指定分隔符。

:::tip
有关其他文件格式和各种读取函数的全面概述，请参阅 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/read.html)。

:::

## 显示数据

一旦你[将数据放入笔记本中](#retrieve-data-from-a-file)，就可以轻松地将其存储在一个变量中，并通过在代码单元格中运行以下代码来访问它：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

此代码显示来自你选择的文件（例如 CSV、JSON、XLS、XLSX 或 Apache Arrow）的数据。

<img src="/img/display-data.png" alt="Display data" width="700" style={{verticalAlign: 'middle'}}/>

要深入了解数据的结构或模式（schema），请在你的 DataFrame 变量上应用 `.schema()` 函数。例如，`dfJson.schema()` 列出 JSON 数据集中每一列的类型。

<img src="/img/schema-data-analysis.png" alt="Schema example" width="700" style={{verticalAlign: 'middle'}}/>

你还可以使用 Kotlin Notebook 中的自动完成功能来快速访问和操作 DataFrame 的属性。加载数据后，只需键入 DataFrame 变量，后跟一个点，即可查看可用列及其类型的列表。

<img src="/img/auto-completion-data-analysis.png" alt="Available properties" width="700" style={{verticalAlign: 'middle'}}/>

## 优化数据

在 Kotlin DataFrame 库中用于优化数据集的各种操作中，关键示例包括 [grouping（分组）](https://kotlin.github.io/dataframe/group.html)、[filtering（过滤）](https://kotlin.github.io/dataframe/filter.html)、[updating（更新）](https://kotlin.github.io/dataframe/update.html) 和 [adding new columns（添加新列）](https://kotlin.github.io/dataframe/add.html)。这些函数对于数据分析至关重要，使你能够有效地组织、清理和转换数据。

让我们看一个示例，其中数据包括电影标题及其对应的发行年份在同一个单元格中。目标是优化此数据集，以便更轻松地进行分析：

1. 使用 `.read()` 函数将数据加载到笔记本中。此示例涉及从名为 `movies.csv` 的 CSV 文件中读取数据，并创建一个名为 `movies` 的 DataFrame：

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 使用正则表达式从电影标题中提取发行年份，并将其添加为新列：

   ```kotlin
   val moviesWithYear = movies
       .add("year") { 
           "\\d{4}".toRegex()
               .findAll(title)
               .lastOrNull()
               ?.value
               ?.toInt()
               ?: -1
       }
   ```

3. 通过从每个标题中删除发行年份来修改电影标题。这可以清理标题以保持一致性：

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. 使用 `filter` 方法来关注特定数据。在本例中，数据集经过过滤，重点关注 1996 年之后发行的电影：

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

为了进行比较，以下是优化前的数据集：

<img src="/img/original-dataset.png" alt="Original dataset" width="700" style={{verticalAlign: 'middle'}}/>

优化后的数据集：

<img src="/img/refined-data.png" alt="Data refinement result" width="700" style={{verticalAlign: 'middle'}}/>

这是一个实际演示，说明如何使用 Kotlin DataFrame 库的方法（如 `add`、`update` 和 `filter`）来有效地优化和分析 Kotlin 中的数据。

:::tip
有关其他用例和详细示例，请参阅 [Kotlin Dataframe 示例](https://github.com/Kotlin/dataframe/tree/master/examples)。

:::

## 保存 DataFrame

在使用 Kotlin DataFrame 库在 [Kotlin Notebook 中优化数据](#refine-data) 后，你可以轻松导出已处理的数据。你可以为此目的使用各种 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函数，这些函数支持以多种格式保存，包括 CSV、JSON、XLS、XLSX、Apache Arrow，甚至 HTML 表格。这对于分享你的发现、创建报告或使你的数据可用于进一步分析特别有用。

以下是如何过滤 DataFrame、删除列、将优化后的数据保存到 JSON 文件以及在浏览器中打开 HTML 表格：

1. 在 Kotlin Notebook 中，使用 `.read()` 函数将名为 `movies.csv` 的文件加载到名为 `moviesDf` 的 DataFrame 中：

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. 使用 `.filter` 方法过滤 DataFrame，使其仅包含属于 "Action" 类型的电影：

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. 使用 `.remove` 从 DataFrame 中删除 `movieId` 列：

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame 库提供了各种写入函数，用于以不同格式保存数据。在本例中，[`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函数用于将修改后的 `movies.csv` 保存为 JSON 文件：

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. 使用 `.toStandaloneHTML()` 函数将 DataFrame 转换为独立的 HTML 表格，并在你的默认 Web 浏览器中打开它：

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 接下来做什么

* 使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 探索数据可视化
* 在 [在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization) 中查找有关数据可视化的更多信息
* 有关 Kotlin 中可用于数据科学和分析的工具和资源的广泛概述，请参阅 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries)