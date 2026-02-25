[//]: # (title: 在 Kotlin Notebook 中使用 Kandy 进行数据可视化)

Kotlin 提供了一站式的高效且灵活的数据可视化解决方案，在深入研究复杂模型之前，为您提供了一种直观的方式来展示和探索数据。

本教程演示了如何在 IntelliJ IDEA 中结合使用 [Kotlin Notebook](kotlin-notebook-overview.md) 与 [Kandy](https://kotlin.github.io/kandy/welcome.html) 及 [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) 库来创建不同的图表类型。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件在 IntelliJ IDEA 中默认内置并启用。

如果 Kotlin Notebook 功能不可用，请确保已启用该插件。欲了解更多信息，请参阅[设置环境](kotlin-notebook-set-up-env.md)。

创建一个新的 Kotlin Notebook：

1. 选择 **File** | **New** | **Kotlin Notebook**。

2. 在您的笔记本中，通过运行以下命令导入 Kandy 和 Kotlin DataFrame 库：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 创建数据帧

首先创建包含要可视化记录的数据帧（DataFrame）。此数据帧存储了三个城市（柏林、马德里和加拉加斯）月平均气温的模拟数据。

使用 Kotlin DataFrame 库中的 `dataFrameOf()` 函数来生成数据帧。在 Kotlin Notebook 中运行以下代码段：

```kotlin
// months 变量存储了一个包含一年 12 个月的列表
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid 和 tempCaracas 变量存储了每个月的温度值列表
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df 变量存储了一个包含三列的数据帧，包括月份、温度和城市的记录
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

通过查看前四行来探索新数据帧的结构：

```kotlin
df.head(4)
```

您可以看到该数据帧有三列：Month、Temperature 和 City。数据帧的前四行包含了柏林从 1 月到 4 月的温度记录：

![探索数据帧](visualization-dataframe-temperature.png){width=600}

> 使用 Kandy 和 Kotlin DataFrame 库时，有多种访问列记录的方法可以帮助您提高类型安全性。
> 欲了解更多信息，请参阅[访问 API](https://kotlin.github.io/dataframe/apilevels.html)。
>
{style="tip"}

## 创建折线图

让我们使用上一节中的 `df` 数据帧在 Kotlin Notebook 中创建一张折线图。

使用 Kandy 库中的 `plot()` 函数。在 `plot()` 函数内，指定图表类型（在本例中为 `line`）以及 X 轴和 Y 轴的值。您可以自定义颜色和大小：

```kotlin
df.plot {
    line {
        // 访问用于 X 轴和 Y 轴的数据帧列 
        x(Month)
        y(Temperature)
        // 访问用于分类的数据帧列，并为这些分类设置颜色 
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // 自定义线条粗细
        width = 1.5
    }
    // 自定义图表布局大小
    layout.size = 1000 to 450
}
```

结果如下：

![折线图](visualization-line-chart.svg){width=600}

## 创建点图

现在，让我们在点图（散点图）中可视化 `df` 数据帧。

在 `plot()` 函数内，指定 `points` 图表类型。添加 X 轴和 Y 轴的值以及来自 `df` 列的分类值。您还可以为图表添加标题：

```kotlin
df.plot {
    points {
        // 访问用于 X 轴和 Y 轴的数据帧列 
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // 自定义点的大小
        size = 5.5
        // 访问用于分类的数据帧列，并为 these 分类设置颜色 
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // 添加图表标题
    layout.title = "Temperature per month"
}
```

结果如下：

![点图](visualization-points-chart.svg){width=600}

## 创建柱状图

最后，让我们使用与之前图表相同的数据，创建一张按城市分组的柱状图。对于颜色，您也可以使用十六进制代码：

```kotlin
// 按城市分组  
df.groupBy { City }.plot {
    // 添加图表标题
    layout.title = "Temperature per month"
    bars {
        // 访问用于 X 轴和 Y 轴的数据帧列 
        x(Month)
        y(Temperature)
        // 访问用于分类的数据帧列，并为这些分类设置颜色 
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

结果如下：

![柱状图](visualization-bar-chart.svg){width=600}

## 下一步

* 在 [Kandy 库文档](https://kotlin.github.io/kandy/examples.html)中探索更多图表示例
* 在 [Lets-Plot 库文档](lets-plot.md)中探索更高级的绘图选项
* 在 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/info.html)中查找有关创建、探索和管理数据帧的更多信息
* 在此 [YouTube 视频](https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)中了解更多关于 Kotlin Notebook 数据可视化的信息