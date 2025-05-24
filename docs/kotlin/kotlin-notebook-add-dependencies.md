---
title: "向你的 Kotlin Notebook 添加依赖"
---
:::info
<p>
   这是 <strong>Kotlin Notebook 入门</strong>教程的第三部分。在继续之前，请确保您已完成之前的步骤。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">搭建环境</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create">创建 Kotlin Notebook</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>向 Kotlin Notebook 添加依赖</strong><br/>
</p>

:::

您已经创建了您的第一个 [Kotlin Notebook](kotlin-notebook-overview)！现在让我们学习如何向库添加依赖，这对于解锁高级功能是必要的。

:::note
Kotlin 标准库可以直接使用，因此您无需导入它。

:::

您可以通过在任何代码单元中使用 Gradle 样式的语法指定坐标来从 Maven 仓库加载任何库。
但是，Kotlin Notebook 提供了一种简化的方法来加载流行的库，即使用 [`%use` 语句](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)：

```kotlin
// 将 libraryName 替换为您要添加的库依赖
%use libraryName
```

您还可以使用 Kotlin Notebook 中的自动完成功能来快速访问可用的库：

<img src="/img/autocompletion-feature-notebook.png" alt="Kotlin Notebook 中的自动完成功能" width="700" style={{verticalAlign: 'middle'}}/>

## 向您的 Kotlin Notebook 添加 Kotlin DataFrame 和 Kandy 库

让我们向您的 Kotlin Notebook 添加两个流行的 Kotlin 库依赖项：
* [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 使您能够在 Kotlin 项目中操作数据。
您可以使用它来从 [API](data-analysis-work-with-api)、[SQL 数据库](data-analysis-connect-to-db) 和 [各种文件格式](data-analysis-work-with-data-sources)（例如 CSV 或 JSON）检索数据。
* [Kandy 库](https://kotlin.github.io/kandy/welcome.html) 提供了一个强大而灵活的 DSL，用于[创建图表](data-analysis-visualization)。

要添加这些库：

1. 点击 **Add Code Cell**（添加代码单元）以创建一个新的代码单元。
2. 在代码单元中输入以下代码：

    ```kotlin
    // 确保使用最新的可用库版本
    %useLatestDescriptors
    
    // 导入 Kotlin DataFrame 库
    %use dataframe
    
    // 导入 Kotlin Kandy 库
    %use kandy
    ```

3. 运行该代码单元。

    当执行 `%use` 语句时，它会下载库依赖项并将默认导入添加到您的 notebook。

    > 确保在运行任何依赖于该库的其他代码单元之前，运行带有 `%use libraryName` 行的代码单元。
    >
    

4. 要使用 Kotlin DataFrame 库从 CSV 文件导入数据，请在新代码单元中使用 `.read()` 函数：

    ```kotlin
    // 通过从“netflix_titles.csv”文件导入数据来创建一个 DataFrame。
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 显示原始 DataFrame 数据
    rawDf
    ```

    > 您可以从 [Kotlin DataFrame 示例 GitHub 仓库](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv) 下载此示例 CSV 文件。
    > 将其添加到您的项目目录。
    > 
    

    <img src="/img/add-dataframe-dependency.png" alt="使用 DataFrame 显示数据" width="700" style={{verticalAlign: 'middle'}}/>

5. 在一个新的代码单元中，使用 `.plot` 方法以可视方式表示您的 DataFrame 中电视节目和电影的分布：

    ```kotlin
    rawDf
        // 计算名为“type”的列中每个唯一值的出现次数
        .valueCounts(sort = false) { type }
        // 在条形图中可视化数据，指定颜色
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 配置图表的布局并设置标题
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

结果图表：

<img src="/img/kandy-library.png" alt="使用 Kandy 库进行可视化" width="700" style={{verticalAlign: 'middle'}}/>

恭喜您在 Kotlin Notebook 中添加和使用这些库！
这只是 Kotlin Notebook 及其[支持的库](data-analysis-libraries) 可以实现的功能的一瞥。

## 接下来做什么

* 学习如何[分享您的 Kotlin Notebook](kotlin-notebook-share)
* 查看有关[向 Kotlin Notebook 添加依赖](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)的更多详细信息
* 有关使用 Kotlin DataFrame 库的更全面的指南，请参阅[从文件检索数据](data-analysis-work-with-data-sources)
* 有关 Kotlin 中可用于数据科学和分析的工具和资源的广泛概述，请参阅[用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries)