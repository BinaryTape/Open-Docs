[//]: # (title: Kotlin用Lets-Plotによるデータ可視化)

[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html)は、[Rのggplot2ライブラリ](https://ggplot2.tidyverse.org/)をKotlinに移植したマルチプラットフォームプロットライブラリです。LPKは、豊富な機能を持つggplot2 APIをKotlinエコシステムにもたらし、高度なデータ可視化機能を必要とする科学者や統計学者に適しています。

LPKは、[Kotlin Notebook](data-analysis-overview.md#notebooks)、[Kotlin/JS](js-overview.md)、[JVMのSwing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/)、[JavaFX](https://openjfx.io/)、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)を含む様々なプラットフォームをターゲットとしています。さらに、LPKは[IntelliJ](https://www.jetbrains.com/idea/)、[DataGrip](https://www.jetbrains.com/datagrip/)、[DataSpell](https://www.jetbrains.com/dataspell/)、[PyCharm](https://www.jetbrains.com/pycharm/)とシームレスに統合されています。

![Lets-Plot](lets-plot-overview.png){width=700}

このチュートリアルでは、IntelliJ IDEAのKotlin NotebookでLPKと[Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html)ライブラリを使用して、さまざまなプロットタイプを作成する方法をデモンストレーションします。

## 開始する前に

Kotlin Notebookは、IntelliJ IDEAにデフォルトでバンドルされ、有効になっている[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、「[環境をセットアップする](kotlin-notebook-set-up-env.md)」を参照してください。

Lets-Plotで作業するために、新しいKotlin Notebookを作成します。

1.  **ファイル** | **新規** | **Kotlin Notebook** を選択します。
2.  Notebookで、次のコマンドを実行してLPKとKotlin DataFrameライブラリをインポートします。

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## データの準備

ベルリン、マドリード、カラカスの3都市の月平均気温のシミュレートされた数値を格納するDataFrameを作成しましょう。

Kotlin DataFrameライブラリの[`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof)関数を使用してDataFrameを生成します。次のコードスニペットをKotlin Notebookに貼り付けて実行します。

```kotlin
// months変数は1年の12ヶ月のリストを格納します
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid、tempCaracas変数は、各月の温度値のリストを格納します
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df変数は、月間記録、温度、都市の3つの列を含むDataFrameを格納します
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
df.head(4)
```

DataFrameには、Month、Temperature、Cityの3つの列があることがわかります。DataFrameの最初の4行には、1月から4月までのベルリンの気温記録が含まれています。

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

LPKライブラリを使用してプロットを作成するには、データをキーと値のペアで格納する`Map`型に変換する必要があります。[`toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)関数を使用すると、DataFrameを`Map`に簡単に変換できます。

```kotlin
val data = df.toMap()
```

## 散布図の作成

LPKライブラリを使用してKotlin Notebookで散布図を作成しましょう。

データを`Map`形式にしたら、LPKライブラリの[`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html)関数を使用して散布図を生成します。X軸とY軸の値を指定し、カテゴリとその色を定義できます。さらに、プロットのサイズと点の形状を[ニーズに合わせてカスタマイズ](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)できます。

```kotlin
// X軸とY軸、カテゴリとその色、プロットサイズ、プロットタイプを指定します
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

結果は次のとおりです。

![Scatter plot](lets-plot-scatter.svg){width=600}

## 箱ひげ図の作成

[データ](#prepare-the-data)を箱ひげ図で視覚化しましょう。LPKライブラリの[`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html)関数を使用してプロットを生成し、[`scaleFillManual()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html)関数で色を[カスタマイズ](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)します。

```kotlin
// X軸とY軸、カテゴリ、プロットサイズ、プロットタイプを指定します
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // 色をカスタマイズします        
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

結果は次のとおりです。

![Box plot](box-plot.svg){width=600}

## 2D密度プロットの作成

次に、いくつかのランダムなデータの分布と集中を視覚化するために、2D密度プロットを作成しましょう。

### 2D密度プロットのデータを準備する

1.  データを処理し、プロットを生成するための依存関係をインポートします。

    ```kotlin
    %use lets-plot

    @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
    import org.apache.commons.math3.distribution.MultivariateNormalDistribution
    ```

    > Kotlin Notebookへの依存関係のインポートの詳細については、[Kotlin Notebookのドキュメント](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)を参照してください。
    > {style="tip"}

2.  Kotlin Notebookに次のコードスニペットを貼り付けて実行し、2Dデータポイントのセットを作成します。

    ```kotlin
    // 3つの分布の共分散行列を定義します
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
    
    // サンプル数を定義します
    val n = 400
    
    // 3つの分布の平均を定義します
    val means0: DoubleArray = doubleArrayOf(-2.0, 0.0)
    val means1: DoubleArray = doubleArrayOf(2.0, 0.0)
    val means2: DoubleArray = doubleArrayOf(0.0, 1.0)
    
    // 3つの多変量正規分布からランダムサンプルを生成します
    val xy0 = MultivariateNormalDistribution(means0, cov0).sample(n)
    val xy1 = MultivariateNormalDistribution(means1, cov1).sample(n)
    val xy2 = MultivariateNormalDistribution(means2, cov2).sample(n)
    ```

    上記のコードから、`xy0`、`xy1`、`xy2`変数は2D (`x, y`) データポイントを含む配列を格納します。

3.  データを`Map`型に変換します。

    ```kotlin
    val data = mapOf(
        "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
        "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
    )
    ```

### 2D密度プロットを生成する

前のステップの`Map`を使用して、データポイントと外れ値をよりよく視覚化するために、背景に散布図 (`geomPoint`) を持つ2D密度プロット (`geomDensity2D`) を作成します。[`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html)関数を使用して、色のスケールをカスタマイズできます。

```kotlin
val densityPlot = letsPlot(data) { x = "x"; y = "y" } + ggsize(600, 300) + geomPoint(
    color = "black",
    alpha = .1
) + geomDensity2D { color = "..level.." } +
        scaleColorGradient(low = "dark_green", high = "yellow", guide = guideColorbar(barHeight = 10, barWidth = 300)) +
        theme().legendPositionBottom()
densityPlot
```

結果は次のとおりです。

![2D density plot](2d-density-plot.svg){width=600}

## 次のステップ

*   [Lets-Plot for Kotlinのドキュメント](https://lets-plot.org/kotlin/charts.html)でより多くのプロット例を探してください。
*   Lets-Plot for Kotlinの[APIリファレンス](https://lets-plot.org/kotlin/api-reference/)を確認してください。
*   [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html)と[Kandy](https://kotlin.github.io/kandy/welcome.html)ライブラリのドキュメントで、Kotlinでのデータの変換と視覚化について学びましょう。
*   [Kotlin Notebookの使用法と主要機能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)に関する追加情報を見つけてください。