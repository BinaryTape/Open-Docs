[//]: # (title: Kandy を使用した Kotlin Notebook でのデータ視覚化)

Kotlin は、強力で柔軟なデータ視覚化のためのオールインワン・ソリューションを提供しており、複雑なモデルに取り組む前にデータを直感的に提示し、探索するための方法を提供します。

このチュートリアルでは、[Kotlin Notebook](kotlin-notebook-overview.md) を使用して、[Kandy](https://kotlin.github.io/kandy/welcome.html) および [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) ライブラリを利用し、IntelliJ IDEA でさまざまなチャートタイプを作成する方法を説明します。

## 始める前に

Kotlin Notebook は [Kotlin Notebook プラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。このプラグインは、デフォルトで IntelliJ IDEA にバンドルされ、有効になっています。

Kotlin Notebook 機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境のセットアップ](kotlin-notebook-set-up-env.md)を参照してください。

新しい Kotlin Notebook を作成します：

1. **File** | **New** | **Kotlin Notebook** を選択します。

2. ノートブックで、以下のコマンドを実行して Kandy と Kotlin DataFrame ライブラリをインポートします：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## DataFrame の作成

まず、視覚化するレコードを含む DataFrame を作成します。この DataFrame には、ベルリン、マドリード、カラカスの 3 都市における月間平均気温のシミュレーション数値が格納されます。

Kotlin DataFrame ライブラリの `dataFrameOf()` 関数を使用して DataFrame を生成します。Kotlin Notebook で以下のコードスニペットを実行してください：

```kotlin
// months 変数は、1 年の 12 か月を含むリストを格納します
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid、tempCaracas 変数は、各月の気温値をリストで格納します
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df 変数は、Month、Temperature、City の 3 列のレコードを含む DataFrame を格納します
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

最初の 4 行を確認して、新しい DataFrame の構造を探索します：

```kotlin
df.head(4)
```

DataFrame には Month、Temperature、City の 3 つの列があることがわかります。 
DataFrame の最初の 4 行には、1 月から 4 月までのベルリンの気温の記録が含まれています：

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> Kandy と Kotlin DataFrame ライブラリを組み合わせて使用する際、型安全性を高めるのに役立つ、カラムのレコードにアクセスするためのさまざまなオプションがあります。
> 詳細については、[Access APIs](https://kotlin.github.io/dataframe/apilevels.html) を参照してください。
>
{style="tip"}

## 折れ線グラフの作成

前のセクションの `df` DataFrame を使用して、Kotlin Notebook で折れ線グラフ（line chart）を作成しましょう。

Kandy ライブラリの `plot()` 関数を使用します。`plot()` 関数内で、チャートのタイプ（この場合は `line`）と X 軸および Y 軸の値を指定します。色やサイズをカスタマイズすることもできます：

```kotlin
df.plot {
    line {
        // X 軸と Y 軸に使用される DataFrame の列にアクセスします 
        x(Month)
        y(Temperature)
        // カテゴリに使用される DataFrame の列にアクセスし、これらのカテゴリの色を設定します 
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // ラインの太さをカスタマイズします
        width = 1.5
    }
    // チャートのレイアウトサイズをカスタマイズします
    layout.size = 1000 to 450
}
```

結果は以下の通りです：

![Line chart](visualization-line-chart.svg){width=600}

## ポイントチャートの作成

次に、`df` DataFrame をポイント（散布図）チャートで視覚化してみましょう。 

`plot()` 関数内で、`points` チャートタイプを指定します。X 軸と Y 軸の値、および `df` 列からのカテゴリ値を追加します。
チャートに見出しを含めることもできます：

```kotlin
df.plot {
    points {
        // X 軸と Y 軸に使用される DataFrame の列にアクセスします 
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // ポイントのサイズをカスタマイズします
        size = 5.5
        // カテゴリに使用される DataFrame の列にアクセスし、これらのカテゴリの色を設定します 
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // チャートの見出しを追加します
    layout.title = "Temperature per month"
}
```

結果は以下の通りです：

![Points chart](visualization-points-chart.svg){width=600}

## 棒グラフの作成

最後に、これまでのチャートと同じデータを使用して、都市ごとにグループ化された棒グラフを作成しましょう。 
色には 16 進コードを使用することもできます： 

```kotlin
// 都市ごとにグループ化します  
df.groupBy { City }.plot {
    // チャートの見出しを追加します
    layout.title = "Temperature per month"
    bars {
        // X 軸と Y 軸に使用される DataFrame の列にアクセスします 
        x(Month)
        y(Temperature)
        // カテゴリに使用される DataFrame の列にアクセスし、これらのカテゴリの色を設定します 
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

結果は以下の通りです：

![Bar chart](visualization-bar-chart.svg){width=600}

## 次のステップ

* [Kandy ライブラリのドキュメント](https://kotlin.github.io/kandy/examples.html)で、より多くのチャート例を探索する
* [Lets-Plot ライブラリのドキュメント](lets-plot.md)で、より高度なプロットオプションを探索する
* [Kotlin DataFrame ライブラリのドキュメント](https://kotlin.github.io/dataframe/info.html)で、データフレームの作成、探索、管理に関する追加情報を見つける
* この [YouTube ビデオ](https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)で、Kotlin Notebook でのデータ視覚化について詳しく学ぶ