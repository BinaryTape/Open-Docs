[//]: # (title: 从网络源和 API 检索数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了一个强大的平台，用于访问和处理来自各种网络源和 API 的数据。它通过提供一个迭代环境，简化了数据提取和分析任务，其中每一步都可以可视化以提高清晰度。这使得它在探索不熟悉的 API 时特别有用。

当与 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 结合使用时，Kotlin Notebook 不仅使您能够连接到 API 并获取 JSON 数据，还协助重塑这些数据以进行全面的分析和可视化。

> 有关 Kotlin Notebook 示例，请参阅 [GitHub 上的 DataFrame 示例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)。
>
{style="tip"}

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件在 IntelliJ IDEA 中默认捆绑并启用。

如果 Kotlin Notebook 功能不可用，请确保插件已启用。有关更多信息，请参阅 [设置环境](kotlin-notebook-set-up-env.md)。

创建一个新的 Kotlin Notebook：

1. 选择 **文件** | **新建** | **Kotlin Notebook**。
2. 在 Kotlin Notebook 中，通过运行以下命令导入 Kotlin DataFrame 库：

   ```kotlin
   %use dataframe
   ```

## 从 API 获取数据

使用 Kotlin Notebook 配合 Kotlin DataFrame 库从 API 获取数据是通过 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函数实现的，这类似于 [从文件（例如 CSV 或 JSON）检索数据](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file)。然而，当处理基于网络的数据源时，您可能需要额外的格式化来将原始 API 数据转换为结构化格式。

让我们看一个从 [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) 获取数据的示例：

1. 打开您的 Kotlin Notebook 文件 (`.ipynb`)。

2. 导入 Kotlin DataFrame 库，这对于数据操作任务至关重要。这是通过在代码单元格中运行以下命令来完成的：

   ```kotlin
   %use dataframe
   ```

3. 在新的代码单元格中安全地添加您的 API 密钥，这对于向 YouTube Data API 进行身份验证请求是必需的。您可以从 [凭据选项卡](https://console.cloud.com/apis/credentials) 获取您的 API 密钥：

   ```kotlin
   val apiKey = "YOUR-API_KEY"
   ```

4. 创建一个加载函数，该函数接受一个路径作为字符串，并使用 DataFrame 的 `.read()` 函数从 YouTube Data API 获取数据：

   ```kotlin
   fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
   ```

5. 将获取的数据组织成行，并通过 `nextPageToken` 处理 YouTube API 的分页。这确保您能跨多个页面收集数据：

   ```kotlin
   fun load(path: String, maxPages: Int): AnyFrame {
   
       // Initializes a mutable list to store rows of data.
       val rows = mutableListOf<AnyRow>()
   
       // Sets the initial page path for data loading.
       var pagePath = path
       do {
   
           // Loads data from the current page path.
           val row = load(pagePath)
           // Adds the loaded data as a row to the list.
           rows.add(row)
          
           // Retrieves the token for the next page, if available.
           val next = row.getValueOrNull<String>("nextPageToken")
           // Updates the page path for the next iteration, including the new token.
           pagePath = path + "&pageToken=" + next
   
           // Continues loading pages until there's no next page.
       } while (next != null && rows.size < maxPages) 
       
       // Concatenates and returns all loaded rows as a DataFrame.
       return rows.concat() 
   }
   ```

6. 使用先前定义的 `load()` 函数在新代码单元格中获取数据并创建 DataFrame。此示例获取数据，或者在这种情况下，获取与 Kotlin 相关的视频，每页最多 50 个结果，最多 5 页。结果存储在 `df` 变量中：

   ```kotlin
   val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
   df
   ```

7. 最后，从 DataFrame 中提取并连接项目：

   ```kotlin
   val items = df.items.concat()
   items
   ```

## 清理和优化数据

清理和优化数据是准备数据集进行分析的关键步骤。[Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 为这些任务提供了强大的功能。诸如 [`move`](https://kotlin.github.io/dataframe/move.html)、[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html) 和 [`join`](https://kotlin.github.io/dataframe/join.html) 之类的方法对于组织和转换您的数据至关重要。

让我们看一个数据已经 [通过 YouTube 的数据 API 获取](#fetch-data-from-an-api) 的示例。目标是清理和重构数据集，为深入分析做准备：

1. 您可以从重新组织和清理数据开始。这包括将某些列移动到新的标题下，并删除不必要的列以提高清晰度：

   ```kotlin
   val videos = items.dropNulls { id.videoId }
       .select { id.videoId named "id" and snippet }
       .distinct()
   videos
   ```

2. 从清理后的数据中分块 ID，并加载相应的视频统计数据。这涉及到将数据分解成更小的批次并获取更多细节：

   ```kotlin
   val statPages = clean.id.chunked(50).map {
       val ids = it.joinToString("%2C")
       load("videos?part=statistics&id=$ids")
   }
   statPages
   ```

3. 连接获取的统计数据并选择相关列：

   ```kotlin
   val stats = statPages.items.concat().select { id and statistics.all() }.parse()
   stats
   ```

4. 将现有的清理过的数据与新获取的统计数据连接起来。这将两组数据合并成一个全面的 DataFrame：

   ```kotlin
   val joined = clean.join(stats)
   joined
   ```

此示例展示了如何使用 Kotlin DataFrame 的各种函数来清理、重新组织和增强您的数据集。每一步都旨在优化数据，使其更适合 [深入分析](#analyze-data-in-kotlin-notebook)。

## 在 Kotlin Notebook 中分析数据

在您成功地 [获取](#fetch-data-from-an-api) 并 [清理和优化数据](#clean-and-refine-data)（使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 中的函数）之后，下一步是分析这个准备好的数据集以提取有意义的洞察。

诸如 [`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 用于数据分类，[`sum`](https://kotlin.github.io/dataframe/sum.html) 和 [`maxBy`](https://kotlin.github.io/dataframe/maxby.html) 用于 [汇总统计](https://kotlin.github.io/dataframe/summarystatistics.html)，以及 [`sortBy`](https://kotlin.github.io/dataframe/sortby.html) 用于数据排序的方法特别有用。这些工具使您能够高效地执行复杂的数据分析任务。

让我们看一个示例，使用 `groupBy` 按频道对视频进行分类，使用 `sum` 计算每个类别的总观看次数，并使用 `maxBy` 查找每个组中最新或观看次数最多的视频：

1. 通过设置引用来简化对特定列的访问：

   ```kotlin
   val view by column<Int>()
   ```

2. 使用 `groupBy` 方法按 `channel` 列对数据进行分组并排序。

   ```kotlin
   val channels = joined.groupBy { channel }.sortByCount()
   ```

在结果表中，您可以交互式地探索数据。点击与频道对应的行中的 `group` 字段会展开该行，以显示有关该频道视频的更多详细信息。

![Expanding a row to reveal more details](results-of-expanding-group-data-analysis.png){width=700}

您可以点击左下角的表格图标返回到分组后的数据集。

![Click on the table icon in the bottom left to return](return-to-grouped-dataset.png){width=700}

3. 使用 `aggregate`、`sum`、`maxBy` 和 `flatten` 创建一个 DataFrame，汇总每个频道的总观看次数及其最新或观看次数最多的视频的详细信息：

   ```kotlin
   val aggregated = channels.aggregate {
       viewCount.sum() into view
   
       val last = maxBy { publishedAt }
       last.title into "last title"
       last.publishedAt into "time"
       last.viewCount into "viewCount"
       // Sorts the DataFrame in descending order by view count and transform it into a flat structure.
   }.sortByDesc(view).flatten()
   aggregated
   ```

分析结果：

![Analysis results](kotlin-analysis.png){width=700}

有关更高级的技术，请参阅 [Kotlin DataFrame 文档](https://kotlin.github.io/dataframe/gettingstarted.html)。

## 接下来

* 探索使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 在 [使用 Kandy 在 Kotlin Notebook 中进行数据可视化](data-analysis-visualization.md) 中查找有关数据可视化的更多信息
* 有关 Kotlin 中可用于数据科学和分析的工具和资源的广泛概述，请参阅 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)