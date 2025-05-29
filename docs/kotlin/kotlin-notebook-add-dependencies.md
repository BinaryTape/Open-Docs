[//]: # (title: 将依赖添加到 Kotlin Notebook)

<tldr>
   <p>这是 **Kotlin Notebook 入门** 教程的第三部分。在继续之前，请确保您已完成之前的步骤。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">创建 Kotlin Notebook</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>将依赖添加到 Kotlin Notebook</strong><br/>
  </p>
</tldr>

您已经创建了您的第一个 [Kotlin Notebook](kotlin-notebook-overview.md)！现在让我们学习如何向库添加依赖，这是解锁高级功能所必需的。

> Kotlin 标准库可以直接使用，因此您无需导入它。
> 
{style="note"}

您可以通过在任何代码单元格中使用 Gradle 风格的语法指定 Maven 仓库中的坐标来加载任何库。
然而，Kotlin Notebook 提供了一种简化方法来加载流行库，即 [`%use` 语句](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)：

```kotlin
// 将 libraryName 替换为您要添加的库依赖
%use libraryName
```

您还可以使用 Kotlin Notebook 中的自动补全功能快速访问可用库：

![Kotlin Notebook 中的自动补全功能](autocompletion-feature-notebook.png){width=700}

## 将 Kotlin DataFrame 和 Kandy 库添加到您的 Kotlin Notebook

让我们将两个流行的 Kotlin 库依赖添加到您的 Kotlin Notebook：
*   [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 让您能够强大地操作 Kotlin 项目中的数据。
    您可以使用它从 [API](data-analysis-work-with-api.md)、[SQL 数据库](data-analysis-connect-to-db.md) 以及 [各种文件格式](data-analysis-work-with-data-sources.md)（如 CSV 或 JSON）中检索数据。
*   [Kandy 库](https://kotlin.github.io/kandy/welcome.html) 提供了强大灵活的 DSL，用于[创建图表](data-analysis-visualization.md)。

要添加这些库：

1.  点击 **Add Code Cell**（添加代码单元格）以创建一个新的代码单元格。
2.  在代码单元格中输入以下代码：

    ```kotlin
    // 确保使用最新的可用库版本
    %useLatestDescriptors
    
    // 导入 Kotlin DataFrame 库
    %use dataframe
    
    // 导入 Kotlin Kandy 库
    %use kandy
    ```

3.  运行该代码单元格。

    当 `%use` 语句执行时，它会下载库依赖并将默认导入添加到您的 Notebook 中。

    > 在运行任何依赖于该库的其他代码单元格之前，请务必运行包含 `%use libraryName` 行的代码单元格。
    >
    {style="note"}

4.  要使用 Kotlin DataFrame 库从 CSV 文件导入数据，请在新的代码单元格中使用 `.read()` 函数：

    ```kotlin
    // 通过从 "netflix_titles.csv" 文件导入数据来创建 DataFrame。
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 显示原始 DataFrame 数据
    rawDf
    ```

    > 您可以从 [Kotlin DataFrame 示例 GitHub 仓库](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv) 下载此示例 CSV。
    > 将其添加到您的项目目录中。
    > 
    {style="tip"}

    ![使用 DataFrame 显示数据](add-dataframe-dependency.png){width=700}

5.  在新的代码单元格中，使用 `.plot` 方法以可视化方式表示 DataFrame 中电视节目和电影的分布：

    ```kotlin
    rawDf
        // 统计名为 "type" 的列中每个唯一值的出现次数
        .valueCounts(sort = false) { type }
        // 以条形图形式可视化数据并指定颜色
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 配置图表布局并设置标题
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

最终图表：

![使用 Kandy 库进行可视化](kandy-library.png){width=700}

恭喜您在 Kotlin Notebook 中添加并使用了这些库！
这仅仅是您可以通过 Kotlin Notebook 及其[支持的库](data-analysis-libraries.md)实现的一瞥。

## 下一步

*   了解如何[分享您的 Kotlin Notebook](kotlin-notebook-share.md)
*   查看有关[将依赖添加到您的 Kotlin Notebook](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies) 的更多详细信息
*   有关使用 Kotlin DataFrame 库的更详细指南，请参阅[从文件中检索数据](data-analysis-work-with-data-sources.md)
*   有关 Kotlin 中可用于数据科学和分析的工具和资源的全面概述，请参阅[用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)