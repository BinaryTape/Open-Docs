[//]: # (title: 从文件获取数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 结合 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/home.html)，使您能够处理非结构化和结构化数据。这种组合提供了将非结构化数据（例如 TXT 文件中的数据）转换为结构化数据集的灵活性。

对于数据转换，您可以使用 [`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) 和 [`parse`](https://kotlin.github.io/dataframe/parse.html) 等方法。此外，该工具集还支持从各种结构化文件格式中获取和操作数据，包括 CSV、JSON、XLS、XLSX 和 Apache Arrow。

在本指南中，您可以通过多个示例学习如何获取、精炼和处理数据。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件在 IntelliJ IDEA 中默认内置并启用。

如果 Kotlin Notebook 功能不可用，请确保已启用该插件。有关更多信息，请参阅[设置环境](kotlin-notebook-set-up-env.md)。

创建一个新的 Kotlin Notebook：

1. 选择 **File** | **New** | **Kotlin Notebook**。

2. 在 Kotlin Notebook 中，通过运行以下命令导入 Kotlin DataFrame 库：

   ```kotlin
   %use dataframe
   ```

## 从文件获取数据

要在 Kotlin Notebook 中从文件获取数据：

1. 打开您的 Kotlin Notebook 文件 (`.ipynb`)。
2. 在笔记本开头的代码单元中添加 `%use dataframe` 以导入 Kotlin DataFrame 库。
   > 在运行任何其他依赖于 Kotlin DataFrame 库的代码单元之前，请确保先运行包含 `%use dataframe` 行的代码单元。
   >
   {style="note"}

3. 使用 Kotlin DataFrame 库中的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函数来获取数据。例如，要读取 CSV 文件，请使用：`DataFrame.read("example.csv")`。

`.read()` 函数会根据文件扩展名和内容自动检测输入格式。您还可以添加其他实参来自定义函数，例如使用 `delimiter = ';'` 指定分隔符。

> 有关其他文件格式的全面概览以及各种读取函数的详细信息，请参阅 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/read.html)。
> 
{style="tip"}

## 显示数据

一旦[在笔记本中拥有数据](#从文件获取数据)，您就可以轻松地将其存储在变量中，并通过在代码单元中运行以下内容来访问它：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

此代码将显示您选择的文件（如 CSV、JSON、XLS、XLSX 或 Apache Arrow）中的数据。

![显示数据](display-data.png){width=700}

要深入了解数据的结构或架构，请对 DataFrame 变量调用 `.schema()` 函数。例如，`dfJson.schema()` 会列出 JSON 数据集中每一列的类型。

![架构示例](schema-data-analysis.png){width=700}

您还可以使用 Kotlin Notebook 中的自动补全功能来快速访问和操作 DataFrame 的属性。加载数据后，只需输入 DataFrame 变量名后跟一个点，即可查看可用列及其类型的列表。

![可用属性](auto-completion-data-analysis.png){width=700}

## 精炼数据

在 Kotlin DataFrame 库提供的用于精炼数据集的各种操作中，关键示例包括[分组](https://kotlin.github.io/dataframe/group.html)、[筛选](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html)和[添加新列](https://kotlin.github.io/dataframe/add.html)。这些函数对于数据分析至关重要，让您可以有效地组织、清洗和转换数据。

让我们看一个示例，其中的数据在同一个单元格中包含电影标题及其对应的发行年份。目标是精炼此数据集以便于分析：

1. 使用 `.read()` 函数将数据加载到笔记本中。此示例涉及从名为 `movies.csv` 的 CSV 文件读取数据并创建一个名为 `movies` 的 DataFrame：

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

3. 通过从每个标题中移除发行年份来修改电影标题。这可以清理标题以保持一致性：

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. 使用 `filter` 方法专注于特定数据。在这种情况下，对数据集进行筛选以专注于 1996 年以后发行的电影：

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

作为对比，以下是精炼前的数据集：

![原始数据集](original-dataset.png){width=700}

精炼后的数据集：

![数据精炼结果](refined-data.png){width=700}

这是如何使用 Kotlin DataFrame 库的方法（如 `add`、`update` 和 `filter`）在 Kotlin 中有效精炼和分析数据的实际演示。

> 有关更多用例和详细示例，请参阅 [Kotlin Dataframe 示例](https://github.com/Kotlin/dataframe/tree/master/examples)。
> 
{style="tip"}

## 保存 DataFrame

在使用 Kotlin DataFrame 库[在 Kotlin Notebook 中精炼数据](#精炼数据)后，您可以轻松导出处理后的数据。您可以为此使用各种 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函数，这些函数支持保存为多种格式，包括 CSV、JSON、XLS、XLSX、Apache Arrow，甚至是 HTML 表格。这对于分享您的发现、创建报告或使数据可用于进一步分析特别有用。

以下是如何筛选 DataFrame、移除列、将精炼后的数据保存到 JSON 文件以及在浏览器中打开 HTML 表格的方法：

1. 在 Kotlin Notebook 中，使用 `.read()` 函数将名为 `movies.csv` 的文件加载到名为 `moviesDf` 的 DataFrame 中：

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. 使用 `.filter` 方法筛选 DataFrame，使其仅包含属于 "Action" 类型的电影：

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. 使用 `.remove` 从 DataFrame 中移除 `movieId` 列：

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame 库提供了各种写入函数来以不同的格式保存数据。在此示例中，使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函数将修改后的 `movies.csv` 保存为 JSON 文件：

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. 使用 `.toStandaloneHTML()` 函数将 DataFrame 转换为独立的 HTML 表格，并在默认 Web 浏览器中将其打开：

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 下一步

* 探索使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html)进行数据可视化
* 在[在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md)中查找有关数据可视化的更多信息
* 有关 Kotlin 中可用于数据科学和分析的工具和资源的广泛概览，请参阅[用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)