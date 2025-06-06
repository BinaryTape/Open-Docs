[//]: # (title: 使用 Kotlin 版 Lets-Plot 进行数据可视化)

[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html) 是一个多平台绘图库，它将 [R 语言的 ggplot2 库](https://ggplot2.tidyverse.org/) 移植到 Kotlin。LPK 将功能丰富的 ggplot2 API 引入 Kotlin 生态系统，使其适用于需要复杂数据可视化功能的科学家和统计学家。

LPK 面向各种平台，包括 [Kotlin notebooks](data-analysis-overview.md#notebooks)、[Kotlin/JS](js-overview.md)、[JVM 的 Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/)、[JavaFX](https://openjfx.io/) 和 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)。此外，LPK 与 [IntelliJ](https://www.jetbrains.com/idea/)、[DataGrip](https://www.jetbrains.com/datagrip/)、[DataSpell](https://www.jetbrains.com/dataspell/) 和 [PyCharm](https://www.jetbrains.com/pycharm/) 无缝集成。

![Lets-Plot](lets-plot-overview.png){width=700}

本教程演示了如何在 IntelliJ IDEA 中使用 Kotlin Notebook，借助 LPK 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库创建不同类型的图表。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件在 IntelliJ IDEA 中默认捆绑并启用。

如果 Kotlin Notebook 功能不可用，请确保该插件已启用。更多信息，请参阅 [设置环境](kotlin-notebook-set-up-env.md)。

创建新的 Kotlin Notebook 来使用 Lets-Plot：

1. 选择 **文件** | **新建** | **Kotlin Notebook**。
2. 在你的 notebook 中，运行以下命令导入 LPK 和 Kotlin DataFrame 库：

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## 准备数据

让我们创建一个 DataFrame，存储柏林、马德里和加拉加斯这三个城市每月平均气温的模拟数据。

使用 Kotlin DataFrame 库中的 [`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof) 函数生成 DataFrame。将以下代码片段粘贴并运行到你的 Kotlin Notebook 中：

```kotlin
// The months variable stores a list with 12 months of the year
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

// The df variable stores a DataFrame of three columns, including monthly records, temperature, and cities
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
df.head(4)
```

你可以看到 DataFrame 有三列：Month、Temperature 和 City。DataFrame 的前四行包含柏林从一月到四月的温度记录：

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

要使用 LPK 库创建图表，你需要将数据 (`df`) 转换为以键值对形式存储数据的 `Map` 类型。你可以使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数轻松地将 DataFrame 转换为 `Map`：

```kotlin
val data = df.toMap()
```

## 创建散点图

让我们在 Kotlin Notebook 中使用 LPK 库创建一个散点图。

将数据转换为 `Map` 格式后，使用 LPK 库中的 [`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html) 函数生成散点图。你可以指定 X 和 Y 轴的值，以及定义类别及其颜色。此外，你可以 [自定义](https://lets-plot.org/kotlin/aesthetics.html#point-shapes) 图表的大小和点形状以满足你的需求：

```kotlin
// Specifies X and Y axes, categories and their color, plot size, and plot type
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

这是结果：

![Scatter plot](lets-plot-scatter.svg){width=600}

## 创建箱线图

让我们用箱线图来可视化[数据](#准备数据)。使用 LPK 库中的 [`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html) 函数生成图表，并使用 [`scaleFillManual()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html) 函数[自定义](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)颜色：

```kotlin
// Specifies X and Y axes, categories, plot size, and plot type
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // Customizes colors        
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

这是结果：

![Box plot](box-plot.svg){width=600}

## 创建二维密度图

现在，让我们创建一个二维密度图，以可视化一些随机数据的分布和集中情况。

### 准备二维密度图的数据

1. 导入处理数据和生成图表的依赖项：

   ```kotlin
   %use lets-plot

   @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
   import org.apache.commons.math3.distribution.MultivariateNormalDistribution
   ```

   > 有关将依赖项导入 Kotlin Notebook 的更多信息，请参阅 [Kotlin Notebook 文档](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)。
   > {style="tip"}

2. 将以下代码片段粘贴并运行到你的 Kotlin Notebook 中，以创建 2D 数据点集：

   ```kotlin
   // Defines covariance matrices for three distributions
   val cov0: Array<DoubleArray> = arrayOf(
       doubleArrayOf(1.0, -.8),
       doubleArrayOf(-.8, 1.0)
   )
   
   val cov1: Array<DoubleArray> = arrayOf(
       doubleArrayOf(1.0, .8),
       doubleArrayOf(.8, 1.0)
   )
   
   val cov2: Array<DoubleArray> = arrayOf(
       doubleArrayOf(10.0, .1),
       doubleArrayOf(.1, .1)
   )
   
   // Defines the number of samples
   val n = 400
   
   // Defines means for three distributions
   val means0: DoubleArray = doubleArrayOf(-2.0, 0.0)
   val means1: DoubleArray = doubleArrayOf(2.0, 0.0)
   val means2: DoubleArray = doubleArrayOf(0.0, 1.0)
   
   // Generates random samples from three multivariate normal distributions
   val xy0 = MultivariateNormalDistribution(means0, cov0).sample(n)
   val xy1 = MultivariateNormalDistribution(means1, cov1).sample(n)
   val xy2 = MultivariateNormalDistribution(means2, cov2).sample(n)
   ```

   从上面的代码中，`xy0`、`xy1` 和 `xy2` 变量存储了包含 2D (`x, y`) 数据点的数组。

3. 将数据转换为 `Map` 类型：

   ```kotlin
   val data = mapOf(
       "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
       "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
   )
   ```

### 生成二维密度图

使用上一步中的 `Map`，创建一个带有散点图 (`geomPoint`) 作为背景的二维密度图 (`geomDensity2D`)，以便更好地可视化数据点和异常值。你可以使用 [`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html) 函数自定义颜色比例：

```kotlin
val densityPlot = letsPlot(data) { x = "x"; y = "y" } + ggsize(600, 300) + geomPoint(
    color = "black",
    alpha = .1
) + geomDensity2D { color = "..level.." } +
        scaleColorGradient(low = "dark_green", high = "yellow", guide = guideColorbar(barHeight = 10, barWidth = 300)) +
        theme().legendPositionBottom()
densityPlot
```

这是结果：

![2D density plot](2d-density-plot.svg){width=600}

## 下一步

* 浏览 [Kotlin 版 Lets-Plot 文档](https://lets-plot.org/kotlin/charts.html) 中的更多图表示例。
* 查阅 Kotlin 版 Lets-Plot 的 [API 参考](https://lets-plot.org/kotlin/api-reference/)。
* 在 [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html) 和 [Kandy](https://kotlin.github.io/kandy/welcome.html) 库文档中了解如何使用 Kotlin 转换和可视化数据。
* 查找有关 [Kotlin Notebook 使用和关键功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html) 的更多信息。