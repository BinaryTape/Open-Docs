[//]: # (title: 使用 Kandy 在 Kotlin Notebook 中进行数据可视化)

Kotlin 为强大而灵活的数据可视化提供了一站式解决方案，它提供了一种直观的方式来呈现和探索数据，然后再深入复杂的模型。

本教程演示了如何在 IntelliJ IDEA 中使用 [Kotlin Notebook](kotlin-notebook-overview.md) 以及 [Kandy](https://kotlin.github.io/kandy/welcome.html) 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库创建不同类型的图表。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件默认捆绑并启用在 IntelliJ IDEA 中。

如果 Kotlin Notebook 功能不可用，请确保插件已启用。更多信息，请参阅 [设置环境](kotlin-notebook-set-up-env.md)。

创建一个新的 Kotlin Notebook：

1. 选择 **File** | **New** | **Kotlin Notebook**。
2. 在您的 Notebook 中，运行以下命令导入 Kandy 和 Kotlin DataFrame 库：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 创建 DataFrame

首先创建包含要可视化记录的 DataFrame。此 DataFrame 存储了三个城市（柏林、马德里和加拉加斯）的月平均气温模拟数据。

使用 Kotlin DataFrame 库中的 `dataFrameOf()` 函数生成 DataFrame。在 Kotlin Notebook 中运行以下代码片段：

```kotlin
// The months variable stores a list with the 12 months of the year
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// The tempBerlin, tempMadrid, and tempCaracas variables store a list with temperature values for each month
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// The df variable stores a DataFrame of three columns, including records of months, temperature, and cities
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

您可以看到该 DataFrame 有三列：Month、Temperature 和 City。DataFrame 的前四行包含柏林从一月到四月的温度记录：

![DataFrame 探索](visualization-dataframe-temperature.png){width=600}

> 存在不同的选项来访问列的记录，这有助于您在使用 Kandy 和 Kotlin DataFrame 库时提高类型安全性。
> 更多信息，请参阅 [访问 API](https://kotlin.github.io/dataframe/apilevels.html)。
>
{style="tip"}

## 创建折线图

现在，让我们使用上一节中的 `df` DataFrame 在 Kotlin Notebook 中创建一个折线图。

使用 Kandy 库中的 `plot()` 函数。在 `plot()` 函数中，指定图表类型（在本例中为 `line`）以及 X 轴和 Y 轴的值。您可以自定义颜色和大小：

```kotlin
df.plot {
    line {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // Customizes the line's size
        width = 1.5
    }
    // Customizes the chart's layout size
    layout.size = 1000 to 450
}
```

结果如下：

![折线图](visualization-line-chart.svg){width=600}

## 创建散点图（points chart）

现在，让我们在散点图（points chart）中可视化 `df` DataFrame。

在 `plot()` 函数中，指定 `points` 图表类型。添加 X 轴和 Y 轴的值以及 `df` 列中的分类值。您还可以为图表添加标题：

```kotlin
df.plot {
    points {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // Customizes the point's size
        size = 5.5
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // Adds a chart heading
    layout.title = "Temperature per month"
}
```

结果如下：

![散点图](visualization-points-chart.svg){width=600}

## 创建条形图

最后，让我们使用与之前图表相同的数据创建一个按城市分组的条形图。对于颜色，您也可以使用十六进制代码：

```kotlin
// Groups by cities  
df.groupBy { City }.plot {
    // Adds a chart heading
    layout.title = "Temperature per month"
    bars {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
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

![条形图](visualization-bar-chart.svg){width=600}

## 接下来

* 在 [Kandy 库文档](https://kotlin.github.io/kandy/examples.html) 中探索更多图表示例
* 在 [Lets-Plot 库文档](lets-plot.md) 中探索更多高级绘图选项
* 在 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/info.html) 中查找有关创建、探索和管理数据帧的更多信息
* 在此 [YouTube 视频]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s) 中了解更多关于 Kotlin Notebook 中的数据可视化知识