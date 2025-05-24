---
title: "使用 Kotlin 的 Lets-Plot 进行数据可视化"
---
[适用于 Kotlin 的 Lets-Plot (LPK)](https://lets-plot.org/kotlin/get-started.html) 是一个多平台绘图库，它将 [R 语言的 ggplot2 库](https://ggplot2.tidyverse.org/) 移植到 Kotlin。LPK 将功能丰富的 ggplot2 API 带到 Kotlin 生态系统中，使其适用于需要复杂数据可视化功能的科学家和统计学家。

LPK 适用于各种平台，包括 [Kotlin Notebooks](data-analysis-overview#notebooks)、[Kotlin/JS](js-overview)、[JVM 的 Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/)、[JavaFX](https://openjfx.io/) 和 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)。此外，LPK 还与 [IntelliJ](https://www.jetbrains.com/idea/)、[DataGrip](https://www.jetbrains.com/datagrip/)、[DataSpell](https://www.jetbrains.com/dataspell/) 和 [PyCharm](https://www.jetbrains.com/pycharm/) 无缝集成。

<img src="/img/lets-plot-overview.png" alt="Lets-Plot" width="700" style={{verticalAlign: 'middle'}}/>

本教程演示了如何使用 IntelliJ IDEA 中的 Kotlin Notebook，通过 LPK 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库创建不同的绘图类型。

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)。
2. 在 IntelliJ IDEA 中安装 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)。

   > 或者，从 IntelliJ IDEA 内的 **Settings（设置）** | **Plugins（插件）** | **Marketplace（市场）** 访问 Kotlin Notebook 插件。
   >
   

3. 通过选择 **File（文件）** | **New（新建）** | **Kotlin Notebook** 创建一个新的 Notebook。
4. 在你的 Notebook 中，通过运行以下命令导入 LPK 和 Kotlin DataFrame 库：

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## 准备数据

让我们创建一个 DataFrame，其中存储三个城市（柏林、马德里和加拉加斯）每月平均气温的模拟数字。

使用 Kotlin DataFrame 库中的 [`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof) 函数生成 DataFrame。将以下代码片段粘贴并运行在你的 Kotlin Notebook 中：

```kotlin
// months 变量存储包含一年中 12 个月的列表
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

// df 变量存储一个包含三列的 DataFrame，包括每月记录、温度和城市
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
df.head(4)
```

你可以看到 DataFrame 包含三列：Month（月份）、Temperature（温度）和 City（城市）。DataFrame 的前四行
包含 1 月至 4 月柏林的温度记录：

<img src="/img/visualization-dataframe-temperature.png" alt="Dataframe exploration" width="600" style={{verticalAlign: 'middle'}}/>

要使用 LPK 库创建绘图，你需要将你的数据 (`df`) 转换为 `Map` 类型，该类型将数据存储在键值对中。你可以使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数轻松地将 DataFrame 转换为 `Map`：

```kotlin
val data = df.toMap()
```

## 创建散点图

让我们在 Kotlin Notebook 中使用 LPK 库创建一个散点图。

一旦你的数据采用 `Map` 格式，就可以使用 LPK 库中的 [`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html) 函数来生成散点图。
你可以指定 X 轴和 Y 轴的值，以及定义类别及其颜色。此外，
你还可以[自定义](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)绘图的大小和点形状以满足你的需求：

```kotlin
// 指定 X 轴和 Y 轴、类别及其颜色、绘图大小和绘图类型
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

这是结果：

<img src="/img/lets-plot-scatter.svg" alt="Scatter plot" width="600" style={{verticalAlign: 'middle'}}/>

## 创建箱线图

让我们在箱线图中可视化[数据](#prepare-the-data)。使用 LPK 库中的 [`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html)
函数生成绘图，并使用 [`scaleFillManual()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html) 函数[自定义](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)颜色：

```kotlin
// 指定 X 轴和 Y 轴、类别、绘图大小和绘图类型
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // 自定义颜色        
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

这是结果：

<img src="/img/box-plot.svg" alt="Box plot" width="600" style={{verticalAlign: 'middle'}}/>

## 创建 2D 密度图

现在，让我们创建一个 2D 密度图，以可视化一些随机数据的分布和集中度。

### 准备 2D 密度图的数据

1. 导入依赖项以处理数据并生成绘图：

   ```kotlin
   %use lets-plot

   @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
   import org.apache.commons.math3.distribution.MultivariateNormalDistribution
   ```

   > 有关将依赖项导入 Kotlin Notebook 的更多信息，请参阅 [Kotlin Notebook 文档](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)。
   > 

2. 将以下代码片段粘贴并运行在你的 Kotlin Notebook 中以创建 2D 数据点集：

   ```kotlin
   // 定义三个分布的协方差矩阵
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
   
   // 定义样本数
   val n = 400
   
   // 定义三个分布的均值
   val means0: DoubleArray = doubleArrayOf(-2.0, 0.0)
   val means1: DoubleArray = doubleArrayOf(2.0, 0.0)
   val means2: DoubleArray = doubleArrayOf(0.0, 1.0)
   
   // 从三个多元正态分布生成随机样本
   val xy0 = MultivariateNormalDistribution(means0, cov0).sample(n)
   val xy1 = MultivariateNormalDistribution(means1, cov1).sample(n)
   val xy2 = MultivariateNormalDistribution(means2, cov2).sample(n)
   ```

   在上面的代码中，`xy0`、`xy1` 和 `xy2` 变量存储包含 2D (`x, y`) 数据点的数组。

3. 将你的数据转换为 `Map` 类型：

   ```kotlin
   val data = mapOf(
       "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
       "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
   )
   ```

### 生成 2D 密度图

使用上一步中的 `Map`，创建一个 2D 密度图 (`geomDensity2D`)，并在背景中添加一个散点图 (`geomPoint`)，以便更好地可视化
数据点和异常值。你可以使用 [`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html) 函数自定义颜色比例：

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

<img src="/img/2d-density-plot.svg" alt="2D density plot" width="600" style={{verticalAlign: 'middle'}}/>

## 接下来是什么

* 在 [适用于 Kotlin 的 Lets-Plot 文档](https://lets-plot.org/kotlin/charts.html) 中探索更多绘图示例。
* 查看适用于 Kotlin 的 Lets-Plot 的 [API 参考](https://lets-plot.org/kotlin/api-reference/)。
* 在 [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html) 和 [Kandy](https://kotlin.github.io/kandy/welcome.html) 库文档中了解有关使用 Kotlin 转换和可视化数据的信息。
* 查找有关 [Kotlin Notebook 的使用和主要功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html) 的更多信息。