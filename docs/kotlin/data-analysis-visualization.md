---
title: "在 Kotlin Notebook 中使用 Kandy 进行数据可视化"
---
Kotlin 提供了一个一体化的解决方案，用于强大而灵活的数据可视化，提供了一种直观的方式来呈现和探索数据，然后再深入研究复杂的模型。

本教程演示了如何使用 [Kandy](https://kotlin.github.io/kandy/welcome.html) 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库，在 IntelliJ IDEA 中使用 [Kotlin Notebook](kotlin-notebook-overview) 创建不同的图表类型。

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)。
2. 在 IntelliJ IDEA 中安装 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)。
   
    > 或者，从 IntelliJ IDEA 中的 **Settings** | **Plugins** | **Marketplace** 访问 Kotlin Notebook 插件。
    >
    

3. 通过选择 **File** | **New** | **Kotlin Notebook** 创建一个新的 Notebook。
4. 在您的 Notebook 中，通过运行以下命令导入 Kandy 和 Kotlin DataFrame 库：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 创建 DataFrame

首先创建包含要可视化的记录的 DataFrame。此 DataFrame 存储模拟的三个城市的月平均温度数值：柏林、马德里和加拉加斯。

使用 Kotlin DataFrame 库中的 `dataFrameOf()` 函数来生成 DataFrame。在 Kotlin Notebook 中运行以下代码片段：

```kotlin
// months 变量存储包含一年 12 个月的列表
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid 和 tempCaracas 变量存储每个月的温度值列表
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df 变量存储一个包含三列的 DataFrame，其中包括月份、温度和城市的记录
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

通过查看前四行来探索新 DataFrame 的结构：

```kotlin
df.head(4)
```

您可以看到 DataFrame 有三列：Month（月份）、Temperature（温度）和 City（城市）。DataFrame 的前四行包含从一月到四月的柏林温度记录：

<img src="/img/visualization-dataframe-temperature.png" alt="Dataframe exploration" width="600" style={{verticalAlign: 'middle'}}/>
:::tip
有不同的选项可以访问列的记录，这可以帮助您在使用 Kandy 和 Kotlin DataFrame 库时提高类型安全性。
有关更多信息，请参见 [Access APIs](https://kotlin.github.io/dataframe/apilevels.html)。

:::

## 创建折线图

让我们使用上一节中的 `df` DataFrame 在 Kotlin Notebook 中创建一个折线图。

使用 Kandy 库中的 `plot()` 函数。在 `plot()` 函数中，指定图表的类型（在本例中为 `line`）以及 X 轴和 Y 轴的值。您可以自定义颜色和大小：

```kotlin
df.plot {
    line {
        // 访问用于 X 轴和 Y 轴的 DataFrame 的列
        x(Month)
        y(Temperature)
        // 访问用于类别的 DataFrame 的列，并为这些类别设置颜色
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // 自定义线条的大小
        width = 1.5
    }
    // 自定义图表的布局大小
    layout.size = 1000 to 450
}
```

这是结果：

<img src="/img/visualization-line-chart.svg" alt="Line chart" width="600" style={{verticalAlign: 'middle'}}/>

## 创建散点图

现在，让我们在散点图中可视化 `df` DataFrame。

在 `plot()` 函数中，指定 `points` 图表类型。添加 X 轴和 Y 轴的值以及 `df` 列中的分类值。您还可以为图表添加标题：

```kotlin
df.plot {
    points {
        // 访问用于 X 轴和 Y 轴的 DataFrame 的列
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // 自定义点的大小
        size = 5.5
        // 访问用于类别的 DataFrame 的列，并为这些类别设置颜色
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // 添加图表标题
    layout.title = "Temperature per month"
}
```

这是结果：

<img src="/img/visualization-points-chart.svg" alt="Points chart" width="600" style={{verticalAlign: 'middle'}}/>

## 创建柱状图

最后，让我们使用与前几个图表相同的数据创建一个按城市分组的柱状图。对于颜色，您还可以使用十六进制代码：

```kotlin
// 按城市分组
df.groupBy { City }.plot {
    // 添加图表标题
    layout.title = "Temperature per month"
    bars {
        // 访问用于 X 轴和 Y 轴的 DataFrame 的列
        x(Month)
        y(Temperature)
        // 访问用于类别的 DataFrame 的列，并为这些类别设置颜色
        fillColor(City) {
            scale = categorical(
                "Berlin" to Color.hex("#6F4E37"),
                "Madrid" to Color.hex("#C2D4AB"),
                "Caracas" to Color.hex("#B5651D")
            )
        }
    }
}
```

这是结果：

<img src="/img/visualization-bar-chart.svg" alt="Bar chart" width="600" style={{verticalAlign: 'middle'}}/>

## 接下来做什么

* 在 [Kandy 库文档](https://kotlin.github.io/kandy/examples.html) 中探索更多图表示例
* 在 [Lets-Plot 库文档](lets-plot) 中探索更高级的绘图选项
* 在 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/info.html) 中查找有关创建、探索和管理数据帧的其他信息
* 在此 [YouTube 视频]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s) 中了解有关 Kotlin Notebook 中的数据可视化的更多信息