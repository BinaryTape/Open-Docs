---
title: Kotlin向けLets-Plotによるデータ可視化
---
[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html)は、[R's ggplot2 library](https://ggplot2.tidyverse.org/)をKotlinに移植したマルチプラットフォームのプロットライブラリです。LPKは、機能豊富なggplot2 APIをKotlinエコシステムにもたらし、高度なデータ可視化機能を必要とする科学者や統計学者に適しています。

LPKは、[Kotlin notebooks](data-analysis-overview#notebooks)、[Kotlin/JS](js-overview)、[JVM's Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/)、[JavaFX](https://openjfx.io/)、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)など、さまざまなプラットフォームをターゲットにしています。
さらに、LPKは[IntelliJ](https://www.jetbrains.com/idea/)、[DataGrip](https://www.jetbrains.com/datagrip/)、[DataSpell](https://www.jetbrains.com/dataspell/)、[PyCharm](https://www.jetbrains.com/pycharm/)とシームレスに統合されています。

<img src="/img/lets-plot-overview.png" alt="Lets-Plot" width="700" style={{verticalAlign: 'middle'}}/>

このチュートリアルでは、IntelliJ IDEAのKotlin Notebookを使用して、LPKと[Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html)ライブラリでさまざまな種類のプロットを作成する方法を説明します。

## 始める前に

1. 最新バージョンの[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)をダウンロードしてインストールします。
2. IntelliJ IDEAに[Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)をインストールします。

   > または、IntelliJ IDEA内の**Settings** | **Plugins** | **Marketplace**からKotlin Notebookプラグインにアクセスします。
   >
   

3. **File** | **New** | **Kotlin Notebook**を選択して、新しいノートブックを作成します。
4. ノートブックで、次のコマンドを実行してLPKライブラリとKotlin DataFrameライブラリをインポートします。

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## データの準備

ベルリン、マドリード、カラカスの月間平均気温のシミュレーション数を格納するDataFrameを作成しましょう。

Kotlin DataFrameライブラリの[`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof)関数を使用して、DataFrameを生成します。次のコードスニペットをコピーしてKotlin Notebookで実行します。

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

DataFrameには、Month、Temperature、Cityの3つの列があることがわかります。DataFrameの最初の4行には、1月から4月までのベルリンの気温の記録が含まれています。

<img src="/img/visualization-dataframe-temperature.png" alt="Dataframe exploration" width="600" style={{verticalAlign: 'middle'}}/>

LPKライブラリを使用してプロットを作成するには、データをキーと値のペアで格納する`Map`型に変換する必要があります。[`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)関数を使用すると、DataFrameを`Map`に簡単に変換できます。

```kotlin
val data = df.toMap()
```

## 散布図の作成

LPKライブラリを使用して、Kotlin Notebookで散布図を作成しましょう。

データが`Map`形式になったら、LPKライブラリの[`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html)関数を使用して散布図を生成します。
X軸とY軸の値を指定したり、カテゴリとその色を定義したりできます。さらに、必要に応じてプロットのサイズと点の形状を[カスタマイズ](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)できます。

```kotlin
// Specifies X and Y axes, categories and their color, plot size, and plot type
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

結果は次のようになります。

<img src="/img/lets-plot-scatter.svg" alt="Scatter plot" width="600" style={{verticalAlign: 'middle'}}/>

## 箱ひげ図の作成

[データ](#prepare-the-data)を箱ひげ図で可視化しましょう。LPKライブラリの[`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html)関数を使用してプロットを生成し、[`scaleFillManual()`](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)関数で色を[カスタマイズ](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html)します。

```kotlin
// Specifies X and Y axes, categories, plot size, and plot type
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // Customizes colors        
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

結果は次のようになります。

<img src="/img/box-plot.svg" alt="Box plot" width="600" style={{verticalAlign: 'middle'}}/>

## 2D密度プロットの作成

次に、2D密度プロットを作成して、ランダムデータの分布と集中を可視化します。

### 2D密度プロットのデータの準備

1. データの処理とプロットの生成に必要な依存関係をインポートします。

   ```kotlin
   %use lets-plot

   @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
   import org.apache.commons.math3.distribution.MultivariateNormalDistribution
   ```

   > Kotlin Notebookへの依存関係のインポートの詳細については、[Kotlin Notebookドキュメント](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)を参照してください。
   > 

2. 次のコードスニペットをコピーしてKotlin Notebookで実行し、2Dデータポイントのセットを作成します。

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

   上記のコードから、`xy0`、`xy1`、`xy2`変数は2D（`x, y`）データポイントの配列を格納します。

3. データを`Map`型に変換します。

   ```kotlin
   val data = mapOf(
       "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
       "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
   )
   ```

### 2D密度プロットの生成

前の手順の`Map`を使用して、2D密度プロット（`geomDensity2D`）を、背景に散布図（`geomPoint`）とともに作成し、データポイントと外れ値をより良く可視化します。[`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html)関数を使用して、色のスケールをカスタマイズできます。

```kotlin
val densityPlot = letsPlot(data) { x = "x"; y = "y" } + ggsize(600, 300) + geomPoint(
    color = "black",
    alpha = .1
) + geomDensity2D { color = "..level.." } +
        scaleColorGradient(low = "dark_green", high = "yellow", guide = guideColorbar(barHeight = 10, barWidth = 300)) +
        theme().legendPositionBottom()
densityPlot
```

結果は次のようになります。

<img src="/img/2d-density-plot.svg" alt="2D density plot" width="600" style={{verticalAlign: 'middle'}}/>

## 次は何をしますか

* [Lets-Plot for Kotlinのドキュメント](https://lets-plot.org/kotlin/charts.html)で、より多くのプロット例をご覧ください。
* Lets-Plot for Kotlinの[APIリファレンス](https://lets-plot.org/kotlin/api-reference/)を確認してください。
* [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html)と[Kandy](https://kotlin.github.io/kandy/welcome.html)ライブラリのドキュメントで、Kotlinを使用したデータの変換と可視化について学習してください。
* [Kotlin Notebookの使用法と主な機能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)に関する追加情報を見つけてください。