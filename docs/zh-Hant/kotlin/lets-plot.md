[//]: # (title: 使用 Lets-Plot for Kotlin 進行資料視覺化)

[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html) 是一個多平台繪圖函式庫，它將 [R 語言的 ggplot2 函式庫](https://ggplot2.tidyverse.org/) 移植到 Kotlin。LPK 將功能豐富的 ggplot2 API 帶入 Kotlin 生態系統，使其適合需要複雜資料視覺化功能的科學家和統計學家。

LPK 支援多種平台，包括 [Kotlin 筆記本](data-analysis-overview.md#notebooks)、[Kotlin/JS](js-overview.md)、[JVM 的 Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/)、[JavaFX](https://openjfx.io/) 和 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)。此外，LPK 還與 [IntelliJ](https://www.jetbrains.com/idea/)、[DataGrip](https://www.jetbrains.com/datagrip/)、[DataSpell](https://www.jetbrains.com/dataspell/) 和 [PyCharm](https://www.jetbrains.com/pycharm/) 無縫整合。

![Lets-Plot](lets-plot-overview.png){width=700}

本教學課程演示如何使用 LPK 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) 函式庫在 IntelliJ IDEA 的 Kotlin 筆記本中建立不同類型的圖表。

## 開始之前

Kotlin 筆記本依賴於 [Kotlin 筆記本外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式在 IntelliJ IDEA 中預設捆綁並啟用。

如果 Kotlin 筆記本功能不可用，請確保外掛程式已啟用。更多資訊請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立一個新的 Kotlin 筆記本以使用 Lets-Plot：

1.  選擇 **檔案** | **新增** | **Kotlin 筆記本**。
2.  在您的筆記本中，執行以下指令以匯入 LPK 和 Kotlin DataFrame 函式庫：

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## 準備資料

讓我們建立一個 DataFrame，用於儲存柏林、馬德里和卡拉卡斯三座城市每月平均溫度的模擬數字。

使用 Kotlin DataFrame 函式庫中的 [`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof) 函數來生成 DataFrame。將以下程式碼片段貼上並在您的 Kotlin 筆記本中執行：

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

您可以看到此 DataFrame 有三列：Month、Temperature 和 City。DataFrame 的前四列包含柏林從一月到四月的溫度記錄：

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

要使用 LPK 函式庫建立圖表，您需要將資料 (`df`) 轉換為以鍵值對形式儲存資料的 `Map` 型別。您可以使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函數輕鬆地將 DataFrame 轉換為 `Map`：

```kotlin
val data = df.toMap()
```

## 建立散佈圖

讓我們使用 LPK 函式庫在 Kotlin 筆記本中建立一個散佈圖。

一旦您的資料為 `Map` 格式，使用 LPK 函式庫中的 [`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html) 函數來生成散佈圖。您可以指定 X 和 Y 軸的值，以及定義類別及其顏色。此外，您可以[自訂](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)圖表的大小和點的形狀以符合您的需求：

```kotlin
// Specifies X and Y axes, categories and their color, plot size, and plot type
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

結果如下：

![Scatter plot](lets-plot-scatter.svg){width=600}

## 建立箱形圖

讓我們在箱形圖中視覺化[資料](#prepare-the-data)。使用 LPK 函式庫中的 [`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html) 函數來生成圖表，並使用 [`scaleFillManual()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html) 函數[自訂](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)顏色：

```kotlin
// Specifies X and Y axes, categories, plot size, and plot type
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // Customizes colors        
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

結果如下：

![Box plot](box-plot.svg){width=600}

## 建立 2D 密度圖

現在，讓我們建立一個 2D 密度圖來視覺化一些隨機資料的分佈和集中度。

### 為 2D 密度圖準備資料

1.  匯入依賴項以處理資料並生成圖表：

    ```kotlin
    %use lets-plot

    @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
    import org.apache.commons.math3.distribution.MultivariateNormalDistribution
    ```

    > 有關匯入 Kotlin 筆記本依賴項的更多資訊，請參閱 [Kotlin 筆記本文件](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)。
    > {style="tip"}

2.  將以下程式碼片段貼上並在您的 Kotlin 筆記本中執行，以建立 2D 資料點集：

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

    從上面的程式碼中，`xy0`、`xy1` 和 `xy2` 變數儲存包含 2D (`x, y`) 資料點的陣列。

3.  將您的資料轉換為 `Map` 型別：

    ```kotlin
    val data = mapOf(
        "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
        "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
    )
    ```

### 生成 2D 密度圖

使用上一步中的 `Map`，建立一個帶有散佈圖 (`geomPoint`) 作為背景的 2D 密度圖 (`geomDensity2D`)，以便更好地視覺化資料點和離群值。您可以使用 [`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html) 函數來自訂顏色比例：

```kotlin
val densityPlot = letsPlot(data) { x = "x"; y = "y" } + ggsize(600, 300) + geomPoint(
    color = "black",
    alpha = .1
) + geomDensity2D { color = "..level.." } +
        scaleColorGradient(low = "dark_green", high = "yellow", guide = guideColorbar(barHeight = 10, barWidth = 300)) +
        theme().legendPositionBottom()
densityPlot
```

結果如下：

![2D density plot](2d-density-plot.svg){width=600}

## 接下來

*   在 [Lets-Plot for Kotlin 的文件中](https://lets-plot.org/kotlin/charts.html) 探索更多圖表示例。
*   查閱 Lets-Plot for Kotlin 的 [API 參考](https://lets-plot.org/kotlin/api-reference/)。
*   在 [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html) 和 [Kandy](https://kotlin.github.io/kandy/welcome.html) 函式庫文件中了解如何使用 Kotlin 轉換和視覺化資料。
*   查找有關 [Kotlin 筆記本使用方式和主要功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html) 的更多資訊。