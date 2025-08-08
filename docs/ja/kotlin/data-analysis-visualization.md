[//]: # (title: Kotlin NotebookにおけるKandyでのデータ可視化)

Kotlinは、強力で柔軟なデータ可視化のためのオールインワンソリューションを提供し、複雑なモデルに深く入り込む前にデータを提示および探索する直感的な方法を提供します。

このチュートリアルでは、[Kandy](https://kotlin.github.io/kandy/welcome.html)および[Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html)ライブラリと[Kotlin Notebook](kotlin-notebook-overview.md)を使用して、IntelliJ IDEAでさまざまなグラフタイプを作成する方法を解説します。

## 開始する前に

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。このプラグインは、IntelliJ IDEAにデフォルトでバンドルされており、有効になっています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境をセットアップする](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成します。

1.  **File** | **New** | **Kotlin Notebook** を選択します。
2.  ノートブックで、次のコマンドを実行してKandyおよびKotlin DataFrameライブラリをインポートします。

    ```kotlin
    %use kandy
    %use dataframe
    ```

## DataFrameを作成する

まず、可視化するレコードを含むDataFrameを作成します。このDataFrameには、ベルリン、マドリード、カラカスの3都市における月平均気温のシミュレートされた数値が格納されます。

Kotlin DataFrameライブラリの`dataFrameOf()`関数を使用してDataFrameを生成します。Kotlin Notebookで次のコードスニペットを実行します。

```kotlin
// months変数は、1年の12ヶ月を含むリストを格納します
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin, tempMadrid, tempCaracas変数は、各月の気温値を含むリストを格納します
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df変数は、月、気温、都市のレコードを含む3列のDataFrameを格納します
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

最初の4行を見て、新しいDataFrameの構造を探索します。

```kotlin
df.head(4)
```

DataFrameには、Month、Temperature、Cityの3つの列があることがわかります。DataFrameの最初の4行には、1月から4月までのベルリンの気温のレコードが含まれています。

![DataFrameの探索](visualization-dataframe-temperature.png){width=600}

> KandyおよびKotlin DataFrameライブラリを一緒に使用する場合、型安全性を高めるのに役立つ列のレコードにアクセスするためのさまざまなオプションがあります。
> 詳細については、[Access APIs](https://kotlin.github.io/dataframe/apilevels.html)を参照してください。
>
{style="tip"}

## 折れ線グラフを作成する

前のセクションの`df` DataFrameを使用して、Kotlin Notebookで折れ線グラフを作成しましょう。

Kandyライブラリの`plot()`関数を使用します。`plot()`関数内で、グラフのタイプ（この場合は`line`）とX軸およびY軸の値を指定します。色やサイズをカスタマイズできます。

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
        // 線のサイズをカスタマイズします
        width = 1.5
    }
    // グラフのレイアウトサイズをカスタマイズします
    layout.size = 1000 to 450
}
```

結果は次のとおりです。

![折れ線グラフ](visualization-line-chart.svg){width=600}

## ポイントグラフを作成する

次に、`df` DataFrameをポイント（散布図）グラフで可視化しましょう。

`plot()`関数内で、`points`グラフタイプを指定します。X軸とY軸の値、および`df`列からのカテゴリ値を追加します。グラフに見出しを含めることもできます。

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

![ポイントグラフ](visualization-points-chart.svg){width=600}

## 棒グラフを作成する

最後に、前のグラフと同じデータを使用して、都市別にグループ化された棒グラフを作成しましょう。色には、16進コードを使用することもできます。

```kotlin
// 都市別にグループ化します  
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

![棒グラフ](visualization-bar-chart.svg){width=600}

## 次のステップ

*   [Kandyライブラリのドキュメント](https://kotlin.github.io/kandy/examples.html)でより多くのグラフ例を探索します
*   [Lets-Plotライブラリのドキュメント](lets-plot.md)でより高度なプロットオプションを探索します
*   [Kotlin DataFrameライブラリのドキュメント](https://kotlin.github.io/dataframe/info.html)で、データフレームの作成、探索、管理に関する追加情報を見つけます
*   この[YouTubeビデオ](https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)でKotlin Notebookにおけるデータ可視化についてさらに学びます