[//]: # (title: 向 Kotlin Notebook 添加依赖项)

<tldr>
   <p>这是 **Kotlin Notebook 入门**教程的第三部分。在继续之前，请确保您已完成之前的步骤。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">创建 Kotlin Notebook</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>向 Kotlin Notebook 添加依赖项</strong><br/>
  </p>
</tldr>

您已经创建了您的第一个 [Kotlin Notebook](kotlin-notebook-overview.md)！现在让我们学习如何向库添加依赖项，这对于解锁高级特性是必要的。

> Kotlin 标准库可以开箱即用，因此您无需导入它。
> 
{style="note"}

您可以通过在任何代码单元格中使用 Gradle 风格语法指定其坐标，从 Maven 版本库加载任何库。但是，Kotlin Notebook 有一种简化的方法来加载常用库，即 [`%use` 语句](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)：

```kotlin
// 将 libraryName 替换为您要添加的库依赖项
%use libraryName
```

您还可以使用 Kotlin Notebook 中的自动补全特性来快速访问可用库：

![Autocompletion feature in Kotlin Notebook](autocompletion-feature-notebook.png){width=700}

## 向您的 Kotlin Notebook 添加 Kotlin DataFrame 和 Kandy 库

让我们向您的 Kotlin Notebook 添加两个常用的 Kotlin 库依赖项：
* [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)使您能够操纵 Kotlin 项目中的数据。您可以使用它从 [APIs](data-analysis-work-with-api.md)、[SQL 数据库](data-analysis-connect-to-db.md)以及 [各种文件格式](data-analysis-work-with-data-sources.md)（例如 CSV 或 JSON）检索数据。
* [Kandy 库](https://kotlin.github.io/kandy/welcome.html)提供了一个强大而灵活的 DSL，用于[创建图表](data-analysis-visualization.md)。

要添加这些库：

1. 点击 **Add Code Cell** 以创建一个新的代码单元格。
2. 在代码单元格中输入以下代码：

    ```kotlin
    // 确保使用最新可用的库版本
    %useLatestDescriptors
    
    // 导入 Kotlin DataFrame 库
    %use dataframe
    
    // 导入 Kotlin Kandy 库
    %use kandy
    ```

3. 运行该代码单元格。

    当 `%use` 语句执行时，它会下载库依赖项并向您的 Notebook 添加默认导入项。

    > 请务必在运行任何其他依赖于该库的代码单元格之前，运行包含 `%use libraryName` 行的代码单元格。
    >
    {style="note"}

4. 要使用 Kotlin DataFrame 库从 CSV 文件导入数据，请在新代码单元格中使用 `.read()` 函数：

    ```kotlin
    // 通过从 "netflix_titles.csv" 文件导入数据来创建 DataFrame。
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 显示原始 DataFrame 数据
    rawDf
    ```

    > 您可以从 [Kotlin DataFrame 示例 GitHub 版本库](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv)下载此示例 CSV。
    > 将其添加到您的项目目录。
    > 
    {style="tip"}

    ![Using DataFrame to display data](add-dataframe-dependency.png){width=700}

5. 在新的代码单元格中，使用 `.plot` 方法可视化表示 DataFrame 中电视节目和电影的分布：

    ```kotlin
    rawDf
        // 统计名为 "type" 列中每个唯一值的出现次数
        .valueCounts(sort = false) { type }
        // 在条形图（指定颜色）中可视化数据
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
                title = "电视节目和电影计数"
                size = 900 to 550
            }
        }
    ```

结果图表：

![Visualization using the Kandy library](kandy-library.png){width=700}

恭喜您成功添加并利用这些库到您的 Kotlin Notebook！这只是您可以通过 Kotlin Notebook 及其[支持的库](data-analysis-libraries.md)实现的一瞥。

## 下一步

* 学习如何[共享您的 Kotlin Notebook](kotlin-notebook-share.md)
* 查看更多关于[向您的 Kotlin Notebook 添加依赖项](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)的详细信息
* 有关使用 Kotlin DataFrame 库的更详尽指南，请参见[从文件检索数据](data-analysis-work-with-data-sources.md)
* 有关 Kotlin 中可用于数据科学和分析的工具和资源的详尽概述，请参见[用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)