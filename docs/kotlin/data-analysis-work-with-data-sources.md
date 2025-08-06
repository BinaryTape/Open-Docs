[//]: # (title: 从文件中检索数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 结合 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)，使你能够处理非结构化数据和结构化数据。这种组合提供了将 TXT 文件等非结构化数据转换为结构化数据集的灵活性。

对于数据转换，你可以使用 [`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) 和 [`parse`](https://kotlin.github.io/dataframe/parse.html) 等方法。此外，该工具集支持从各种结构化文件格式（包括 CSV、JSON、XLS、XLSX 和 Apache Arrow）中检索和操作数据。

在本指南中，你将通过多个示例学习如何检索、精炼和处理数据。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件默认捆绑并启用在 IntelliJ IDEA 中。

如果 Kotlin Notebook 特性不可用，请确保插件已启用。关于更多信息，请参见 [设置环境](kotlin-notebook-set-up-env.md)。

创建新的 Kotlin Notebook：

1.  选择 **File** | **New** | **Kotlin Notebook**。
2.  在 Kotlin Notebook 中，通过运行以下命令导入 Kotlin DataFrame 库：

    ```kotlin
    %use dataframe
    ```

## 从文件中检索数据

要在 Kotlin Notebook 中从文件中检索数据：

1.  打开你的 Kotlin Notebook 文件 (`.ipynb`)。
2.  通过在 Notebook 开头的代码单元格中添加 `%use dataframe` 来导入 Kotlin DataFrame 库。

    > 确保在运行任何依赖于 Kotlin DataFrame 库的其他代码单元格之前，先运行包含 `%use dataframe` 行的代码单元格。
    >
    {style="note"}

3.  使用 Kotlin DataFrame 库的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函数检索数据。例如，要读取 CSV 文件，请使用：`DataFrame.read("example.csv")`。

`.read()` 函数会根据文件扩展名和内容自动检测输入格式。你还可以添加其他实参来自定义该函数，例如使用 `delimiter = ';'` 指定分隔符。

> 关于更多文件格式和各种读取函数的全面概述，请参见 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/read.html)。
>
{style="tip"}

## 显示数据

将数据 [导入到 Notebook](#retrieve-data-from-a-file) 后，你可以轻松地将其存储到变量中，并通过在代码单元格中运行以下代码来访问它：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

这段代码显示了你选择的文件中的数据，例如 CSV、JSON、XLS、XLSX 或 Apache Arrow。

![Display data](display-data.png){width=700}

要深入了解数据的结构或 schema，请将 `.schema()` 函数应用于你的 DataFrame 变量。例如，`dfJson.schema()` 会列出 JSON 数据集中每列的类型。

![Schema example](schema-data-analysis.png){width=700}

你还可以使用 Kotlin Notebook 中的自动补全特性，快速访问和操作 DataFrame 的属性。加载数据后，只需键入 DataFrame 变量并后跟一个点，即可查看可用列及其类型的列表。

![Available properties](auto-completion-data-analysis.png){width=700}

## 精炼数据

在 Kotlin DataFrame 库中可用于精炼数据集的各种操作中，主要示例包括 [分组](https://kotlin.github.io/dataframe/group.html)、[过滤](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html) 和 [添加新列](https://kotlin.github.io/dataframe/add.html)。这些函数对于数据分析至关重要，使你能够有效地组织、清理和转换数据。

让我们看一个示例，其中数据包含电影标题及其对应的发行年份，它们位于同一个单元格中。目标是精炼此数据集，以便于分析：

1.  使用 `.read()` 函数将数据加载到 Notebook 中。此示例涉及从名为 `movies.csv` 的 CSV 文件读取数据并创建名为 `movies` 的 DataFrame：

    ```kotlin
    val movies = DataFrame.read("movies.csv")
    ```

2.  使用正则表达式从电影标题中提取发行年份，并将其添加为新列：

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

3.  通过从每个电影标题中移除发行年份来修改标题。这可以清理标题以保持一致性：

    ```kotlin
    val moviesTitle = moviesWithYear
        .update("title") {
            "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
        }
    ```

4.  使用 `filter` 方法聚焦于特定数据。在此示例中，数据集被过滤，以聚焦于 1996 年之后发行的电影：

    ```kotlin
    val moviesNew = moviesWithYear.filter { year >= 1996 }
    moviesNew
    ```

作为比较，以下是精炼前的数据集：

![Original dataset](original-dataset.png){width=700}

精炼后的数据集：

![Data refinement result](refined-data.png){width=700}

这是一个实际演示，说明了如何在 Kotlin 中使用 Kotlin DataFrame 库的 `add`、`update` 和 `filter` 等方法来有效地精炼和分析数据。

> 关于更多用例和详细示例，请参见 [Kotlin Dataframe 示例](https://github.com/Kotlin/dataframe/tree/master/examples)。
>
{style="tip"}

## 保存 DataFrame

在 Kotlin Notebook 中使用 Kotlin DataFrame 库 [精炼数据](#refine-data) 后，你可以轻松导出已处理的数据。你可以利用各种 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函数，它们支持保存为多种格式，包括 CSV、JSON、XLS、XLSX、Apache Arrow，甚至是 HTML 表格。这对于分享你的发现、创建报告或使你的数据可用于进一步分析特别有用。

以下是你如何过滤 DataFrame、移除列、将精炼后的数据保存到 JSON 文件以及在浏览器中打开 HTML 表格的方法：

1.  在 Kotlin Notebook 中，使用 `.read()` 函数将名为 `movies.csv` 的文件加载到名为 `moviesDf` 的 DataFrame 中：

    ```kotlin
    val moviesDf = DataFrame.read("movies.csv")
    ```

2.  使用 `.filter` 方法过滤 DataFrame，使其仅包含属于“动作”类型的电影：

    ```kotlin
    val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
    ```

3.  使用 `.remove` 从 DataFrame 中移除 `movieId` 列：

    ```kotlin
    val refinedMoviesDf = actionMoviesDf.remove { movieId }
    refinedMoviesDf
    ```

4.  Kotlin DataFrame 库提供各种写入函数，以不同格式保存数据。在此示例中，使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函数将修改后的 `movies.csv` 保存为 JSON 文件：

    ```kotlin
    refinedMoviesDf.writeJson("movies.json")
    ```

5.  使用 `.toStandaloneHTML()` 函数将 DataFrame 转换为独立的 HTML 表格，并在默认网页浏览器中打开它：

    ```kotlin
    refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
    ```

## 接下来

*   使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 探索数据可视化
*   在 [Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md) 中查找有关数据可视化的更多信息
*   关于 Kotlin 中可用于数据科学和分析的工具和资源的广泛概述，请参见 [Kotlin 和 Java 数据分析库](data-analysis-libraries.md)