[//]: # (title: Kotlin NotebookにおけるKandyでのデータ可視化)

Kotlinは、強力で柔軟なデータ可視化のための統合ソリューションを提供し、複雑なモデルに取り組む前にデータを提示・探索するための直感的な方法を提供します。

このチュートリアルでは、IntelliJ IDEAで[Kotlin Notebook](kotlin-notebook-overview.md)を使用し、[Kandy](https://kotlin.github.io/kandy/welcome.html)および[Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html)ライブラリを用いて、さまざまな種類のグラフを作成する方法をデモンストレーションします。

## 開始する前に

Kotlin Notebookは、デフォルトでIntelliJ IDEAにバンドルされ有効になっている[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境をセットアップする](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成します。

1.  **File** | **New** | **Kotlin Notebook**を選択します。
2.  ノートブックで、次のコマンドを実行してKandyおよびKotlin DataFrameライブラリをインポートします。

    ```kotlin
    %use kandy
    %use dataframe
    ```

## DataFrameの作成

まず、可視化するレコードを含むDataFrameを作成します。このDataFrameには、ベルリン、マドリード、カラカスの3都市における月平均気温のシミュレーション値が格納されます。

Kotlin DataFrameライブラリの`dataFrameOf()`関数を使用してDataFrameを生成します。Kotlin Notebookで次のコードスニペットを実行してください。

```kotlin
// months変数は、12ヶ月のリストを格納します
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid、tempCaracas変数は、各月の気温値をリストで格納します
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df変数は、月、気温、都市のレコードを含む3つの列を持つDataFrameを格納します
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

新しいDataFrameの構造を最初の4行を見て探索します。

```kotlin
df.head(4)
```

DataFrameには、Month、Temperature、Cityの3つの列があることがわかります。DataFrameの最初の4行には、ベルリンの1月から4月までの気温のレコードが含まれています。

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> KandyとKotlin DataFrameライブラリを組み合わせて使用する場合、列のレコードにアクセスするためのさまざまなオプションがあり、型安全性を高めるのに役立ちます。
> 詳細については、[Access APIs](https://kotlin.github.io/dataframe/apilevels.html)を参照してください。
>
{style="tip"}

## ライングラフの作成

前のセクションの`df` DataFrameを使用して、Kotlin Notebookでライングラフを作成しましょう。

Kandyライブラリの`plot()`関数を使用します。`plot()`関数内で、グラフの種類（この場合は`line`）とX軸およびY軸の値を指定します。色とサイズをカスタマイズできます。

```kotlin
df.plot {
    line {
        // X軸とY軸に使用されるDataFrameの列にアクセスします
        x(Month)
        y(Temperature)
        // カテゴリに使用されるDataFrameの列にアクセスし、これらのカテゴリの色を設定します
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // ラインのサイズをカスタマイズします
        width = 1.5
    }
    // グラフのレイアウトサイズをカスタマイズします
    layout.size = 1000 to 450
}
```

結果は次のとおりです。

![Line chart](visualization-line-chart.svg){width=600}

## ポイントグラフの作成

次に、`df` DataFrameをポイント（散布図）グラフで可視化しましょう。

`plot()`関数内で、`points`グラフの種類を指定します。X軸とY軸の値、および`df`列からのカテゴリ値を追加します。グラフに見出しを追加することもできます。

```kotlin
df.plot {
    points {
        // X軸とY軸に使用されるDataFrameの列にアクセスします
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // ポイントのサイズをカスタマイズします
        size = 5.5
        // カテゴリに使用されるDataFrameの列にアクセスし、これらのカテゴリの色を設定します
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // グラフの見出しを追加します
    layout.title = "Temperature per month"
}
```

結果は次のとおりです。

![Points chart](visualization-points-chart.svg){width=600}

## 棒グラフの作成

最後に、前のグラフと同じデータを使用して、都市ごとにグループ化された棒グラフを作成しましょう。色には16進数コードも使用できます。

```kotlin
// 都市ごとにグループ化します
df.groupBy { City }.plot {
    // グラフの見出しを追加します
    layout.title = "Temperature per month"
    bars {
        // X軸とY軸に使用されるDataFrameの列にアクセスします
        x(Month)
        y(Temperature)
        // カテゴリに使用されるDataFrameの列にアクセスし、これらのカテゴリの色を設定します
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

結果は次のとおりです。

![Bar chart](visualization-bar-chart.svg){width=600}

## 次のステップ

*   [Kandyライブラリのドキュメント](https://kotlin.github.io/kandy/examples.html)でさらに多くのグラフ例を探索する
*   [Lets-Plotライブラリのドキュメント](lets-plot.md)でより高度なプロットオプションを探索する
*   [Kotlin DataFrameライブラリのドキュメント](https://kotlin.github.io/dataframe/info.html)でデータフレームの作成、探索、管理に関する追加情報を確認する
*   この[YouTubeビデオ](https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)でKotlin Notebookでのデータ可視化についてさらに学ぶ