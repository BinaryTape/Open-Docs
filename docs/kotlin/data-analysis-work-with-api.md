[//]: # (title: 从 Web 源和 API 检索数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了一个强大的平台，用于访问和操作来自各种 Web 源和 API 的数据。
它通过提供一个迭代环境来简化数据提取和分析任务，在该环境中，每个步骤都可以可视化以提高清晰度。这使得它在探索你不熟悉的 API 时特别有用。

与 [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html) 结合使用时，Kotlin Notebook 不仅使你能够连接到 API 并从中获取 JSON 数据，还协助重塑此数据以进行全面的分析和可视化。

> 关于 Kotlin Notebook 示例，请参见 [GitHub 上的 DataFrame 示例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)。
>
{style="tip"}

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，
该插件在 IntelliJ IDEA 中默认捆绑并启用。

如果 Kotlin Notebook 特性不可用，请确保该插件已启用。关于更多信息，
请参见 [设置环境](kotlin-notebook-set-up-env.md)。

创建新的 Kotlin Notebook：

1.  选择 **文件** | **新建** | **Kotlin Notebook**。
2.  在 Kotlin Notebook 中，通过运行以下命令导入 Kotlin DataFrame 库：

    ```kotlin
    %use dataframe
    ```

## 从 API 获取数据

使用 Kotlin Notebook 和 Kotlin DataFrame 库从 API 获取数据通过 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函数实现，这类似于 [从文件](data-analysis-work-work-with-data-sources.md#retrieve-data-from-a-file)（例如 CSV 或 JSON）检索数据。
然而，在使用基于 Web 的源时，你可能需要额外的格式化来将原始 API 数据转换为结构化格式。

我们来看一个从 [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) 获取数据的示例：

1.  打开你的 Kotlin Notebook 文件 (`.ipynb`)。

2.  导入 Kotlin DataFrame 库，这对于数据操作任务至关重要。
    这通过在代码单元格中运行以下命令来完成：

    ```kotlin
    %use dataframe
    ```

3.  在一个新的代码单元格中安全地添加你的 API 密钥，这对于向 YouTube Data API 进行请求认证是必需的。
    你可以从 [凭据选项卡](https://console.cloud.google.com/apis/credentials) 获取你的 API 密钥：

    ```kotlin
    val apiKey = "YOUR-API_KEY"
    ```

4.  创建一个 `load` 函数，该函数以字符串形式的路径作为实参，并使用 DataFrame 的 `.read()` 函数从 YouTube Data API 获取数据：

    ```kotlin
    fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
    ```

5.  将获取到的数据组织成行，并通过 `nextPageToken` 处理 YouTube API 的分页。
    这确保你可以在多个页面中收集数据：

    ```kotlin
    fun load(path: String, maxPages: Int): AnyFrame {
        // 初始化一个可变 list 来存储数据行。
        val rows = mutableListOf<AnyRow>()

        // 设置数据加载的初始页面路径。
        var pagePath = path
        do {
            // 从当前页面路径加载数据。
            val row = load(pagePath)
            // 将加载的数据作为行添加到 list 中。
            rows.add(row)

            // 检索下一页的 token，如果可用。
            val next = row.getValueOrNull<String>("nextPageToken")
            // 更新下一轮迭代的页面路径，包括新的 token。
            pagePath = path + "&pageToken=" + next

            // 继续加载页面，直到没有下一页。
        } while (next != null && rows.size < maxPages) 

        // 将所有加载的行连接起来并作为 DataFrame 返回。
        return rows.concat() 
    }
    ```

6.  使用先前定义的 `load()` 函数获取数据并在新的代码单元格中创建 DataFrame。
    此示例获取与 Kotlin 相关的视频数据，每页最多 50 个结果，最多 5 页。
    结果存储在 `df` 变量中：

    ```kotlin
    val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
    df
    ```

7.  最后，从 DataFrame 中提取并连接 `items`：

    ```kotlin
    val items = df.items.concat()
    items
    ```

## 清洗和精炼数据

清洗和精炼数据是为分析准备数据集的关键步骤。 [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html)
为这些任务提供了强大的功能。[`move`](https://kotlin.github.io/dataframe/move.html)、
[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、
[`parse`](https://kotlin.github.io/dataframe/parse.html) 和 [`join`](https://kotlin.github.io/dataframe/join.html)
等方法对于组织和转换数据至关重要。

我们来看一个数据已通过 [YouTube 数据 API 获取](#fetch-data-from-an-api) 的示例。
目标是清洗和重构数据集，以便进行深入分析：

1.  你可以从重新组织和清洗数据开始。这包括将某些列移动到新的标题下，并删除不必要的列以提高清晰度：

    ```kotlin
    val videos = items.dropNulls { id.videoId }
        .select { id.videoId named "id" and snippet }
        .distinct()
    videos
    ```

2.  从清洗过的数据中分块 ID 并加载相应的视频统计信息。这包括将数据分成更小的批次并获取额外细节：

    ```kotlin
   val statPages = clean.id.chunked(50).map {
       val ids = it.joinToString("%2C")
       load("videos?part=statistics&id=$ids")
   }
   statPages
    ```

3.  连接获取到的统计信息并选择相关列：

    ```kotlin
    val stats = statPages.items.concat().select { id and statistics.all() }.parse()
    stats
    ```

4.  将现有清洗过的数据与新获取的统计信息连接起来。这会将两组数据合并到一个全面的 DataFrame 中：

    ```kotlin
    val joined = clean.join(stats)
    joined
    ```

此示例演示了如何使用 Kotlin DataFrame 的各种函数清洗、重新组织和增强数据集。
每个步骤都旨在精炼数据，使其更适合进行 [深入分析](#analyze-data-in-kotlin-notebook)。

## 在 Kotlin Notebook 中分析数据

在成功 [获取](#fetch-data-from-an-api) 并 [清洗和精炼数据](#clean-and-refine-data)
使用 [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html) 中的函数后，下一步是分析这个准备好的数据集以提取有意义的洞察。

`groupBy` 用于数据分类，`sum` 和 `maxBy` 用于 [汇总统计](https://kotlin.github.io/dataframe/summarystatistics.html)，以及 `sortBy` 用于数据排序等方法特别有用。
这些工具使你能够高效地执行复杂的数据分析任务。

我们来看一个示例，使用 `groupBy` 按频道对视频进行分类，使用 `sum` 计算每个类别的总播放量，以及使用 `maxBy` 查找每个组中最新或播放量最高的视频：

1.  通过设置引用来简化对特定列的访问：

    ```kotlin
    val view by column<Int>()
    ```

2.  使用 `groupBy` 方法按 `channel` 列对数据进行分组并排序。

    ```kotlin
    val channels = joined.groupBy { channel }.sortByCount()
    ```

在结果表中，你可以交互式地探索数据。点击与频道对应的行的 `group` 字段会展开该行，显示该频道视频的更多详细信息。

![Expanding a row to reveal more details](results-of-expanding-group-data-analysis.png){width=700}

你可以点击左下角的表格图标返回到分组数据集。

![Click on the table icon in the bottom left to return](return-to-grouped-dataset.png){width=700}

3.  使用 `aggregate`、`sum`、`maxBy` 和 `flatten` 创建一个 DataFrame，汇总每个频道的总播放量以及其最新或播放量最高的视频的详细信息：

    ```kotlin
    val aggregated = channels.aggregate {
        viewCount.sum() into view
    
        val last = maxBy { publishedAt }
        last.title into "last title"
        last.publishedAt into "time"
        last.viewCount into "viewCount"
        // 按播放量降序对 DataFrame 进行排序，并将其转换为扁平结构。
    }.sortByDesc(view).flatten()
    aggregated
    ```

分析结果：

![Analysis results](kotlin-analysis.png){width=700}

关于更高级的技术，请参见 [Kotlin DataFrame documentation](https://kotlin.github.io/dataframe/home.html)。

## 后续步骤

*   使用 [Kandy library](https://kotlin.github.io/kandy/examples.html) 探索数据可视化
*   关于数据可视化的更多信息，请参见 [使用 Kandy 在 Kotlin Notebook 中进行数据可视化](data-analysis-visualization.md)
*   关于 Kotlin 中可用于数据科学和分析的工具和资源的广泛概述，请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)