[//]: # (title: Kotlin Notebookでサポートされている出力形式)

[Kotlin Notebook](kotlin-notebook-overview.md)は、テキスト、HTML、画像など、さまざまな出力タイプをサポートしています。外部ライブラリの助けを借りて、出力オプションを拡張し、チャート、スプレッドシートなどを用いてデータを可視化することができます。

各出力は、[Jupiter MIMEタイプ](https://jupyterlab.readthedocs.io/en/latest/user/file_formats.html)を何らかのデータにマッピングするJSONオブジェクトです。このマップから、Kotlin NotebookはサポートされているMIMEタイプの中から最も優先度の高いものを選択し、次のようにレンダリングします。

*   [テキスト](#texts)は`text/plain` MIMEタイプを使用します。
*   [BufferedImageクラス](#buffered-images)は、Base64文字列にマッピングされた`image/png` MIMEタイプを使用します。
*   [Imageクラス](#loaded-images)と[LaTeX形式](#math-formulas-and-equations)は、内部に`img`タグを持つ`text/html` MIMEタイプを使用します。
*   [Kotlin DataFrameテーブル](#data-frames)と[Kandyプロット](#charts)は、静的HTMLまたは画像によって支えられている独自の内部MIMEタイプを使用します。これにより、GitHub上でそれらを表示することができます。

例えば、Markdownをセル出力として使用するために、マッピングを手動で設定することができます。

```kotlin
MimeTypedResult(
    mapOf(
        "text/plain" to "123",
        "text/markdown" to "# HEADER",
        //other mime:value pairs
    )
)
```

あらゆる種類の出力を表示するには、`DISPLAY()`関数を使用します。これにより、複数の出力を組み合わせることも可能になります。

```kotlin
DISPLAY(HTML("<h2>Gaussian distribution</h2>"))
DISPLAY(LATEX("f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}"))

val experimentX = experimentData.map { it.key }
val experimentY = experimentData.map { it.value }

DISPLAY(plot {
    bars {
        x(experimentX)
        y(experimentY)
    }
})
```

![Different outputs for Gaussian distribution](gaussian-distribution-output.png){width=700}

## テキスト

### プレーンテキスト

最もシンプルな出力タイプはプレーンテキストです。これは、プリント文、変数、またはコードからのテキストベースの出力に使用されます。

```kotlin
val a1: Int = 1
val a2: Int = 2
var a3: Int? = a1 + a2

"My answer is $a3"
```

![Plain text code output](plain-text-output.png){width=300}

*   セルの結果が[レンダリング](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#rendering)され、いずれかの出力タイプとして表示できない場合、`toString()`関数を使用してプレーンテキストとして出力されます。
*   コードにエラーが含まれている場合、Kotlin Notebookはエラーメッセージとトレースバックを表示し、デバッグのための洞察を提供します。

### リッチテキスト

リッチテキストを使用するには、Markdownタイプのセルを選択します。これにより、リスト、テーブル、フォントスタイル、コードブロックなどを利用して、MarkdownとHTMLマークアップでコンテンツをフォーマットできます。HTMLにはCSSスタイルやJavaScriptを含めることができます。

```none
## Line magics

| Spell                              | Description                                                                                                      | Example                                                                               |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| <code>%use</code>                  | Injects code for supported libraries: artifact resolution, default imports, initialization code, type renderers. | <code>%use klaxon(5.5), lets-plot</code>                                              |                                         
| <code>%trackClasspath</code>       | Logs any changes of current classpath. Useful for debugging artifact resolution failures.                        | <code>%trackClasspath [on |off]</code>                                                |
| <code>%trackExecution</code>       | Logs pieces of code that are going to be executed. Useful for debugging of libraries support.                    | <code>%trackExecution [all|generated|off]</code>                                      |          
| <code>%useLatestDescriptors</code> | Use latest versions of library descriptors available. By default, bundled descriptors are used.                  | <code>%useLatestDescriptors [on|off]</code>                                           |
| <code>%output</code>               | Output capturing settings.                                                                                       | <code>%output --max-cell-size=1000 --no-stdout --max-time=100 --max-buffer=400</code> |
| <code>%logLevel</code>             | Set logging level.                                                                                               | <code>%logLevel [off|error|warn|info|debug]</code>                                    |

<ul><li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics.md">Learn more detailes about line magics</a>.</li>
<li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics.md">See the full list of supported libraries</a>.</li></ul>
```

![Rich text in Markdown cells](markdown-cells-output.png){width=700}

## HTML

Kotlin NotebookはHTMLを直接レンダリングし、スクリプトを実行したり、ウェブサイトを埋め込んだりすることもできます。

```none
HTML("""
<p>Counter: <span id="ctr">0</span> <button onclick="inc()">Increment</button></p>
<script>
    function inc() {
        let counter = document.getElementById("ctr")
        counter.innerHTML = parseInt(counter.innerHTML) + 1;
}
</script>
""")
```

![Using HTML script](direct-html-output.png){width=300}

> スクリプトを実行できるようにするには、ファイルの先頭でノートブックを**信頼済み**としてマークしてください。
>
{style="note"}

## 画像

Kotlin Notebookを使用すると、ファイルからの画像、生成されたグラフ、またはその他の視覚メディアを表示できます。静止画像は、`.png`、`jpeg`、`.svg`などの形式で表示できます。

### Buffered images

デフォルトでは、`BufferedImage`クラスを使用して画像を表示できます。

```kotlin
import java.awt.Color
import java.awt.image.BufferedImage

val width = 300
val height = width

val image = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)

val graphics = image.createGraphics()
graphics.background = Color.BLACK
graphics.clearRect(0, 0, width, height)
graphics.setRenderingHint(
    java.awt.RenderingHints.KEY_ANTIALIASING,
    java.awt.RenderingHints.VALUE_ANTIALIAS_ON
)
graphics.color = Color.WHITE
graphics.fillRect(width / 10, height * 8 / 10, width * 10 / 20, height / 10)
graphics.dispose()
```

![Using default BufferedImage to display images](bufferedimage-output.png){width=400}

### ロードされた画像

`lib-ext`ライブラリの助けを借りて、標準のJupyter機能を拡張し、ネットワークからロードされた画像を表示できます。

```none
%use lib-ext(0.11.0-398)
```

```kotlin
Image("https://kotlinlang.org/docs/images/kotlin-logo.png", embed = false).withWidth(300)
```

![Using external image links](external-images-output.png){width=400}

### 埋め込み画像

ネットワークからロードされた画像の欠点は、リンクが切れたり、ネットワーク接続が失われたりすると、画像が表示されなくなることです。この問題を回避するには、埋め込み画像を使用します。例：

```kotlin
val kotlinMascot = Image("https://blog.jetbrains.com/wp-content/uploads/2023/04/DSGN-16174-Blog-post-banner-and-promo-materials-for-post-about-Kotlin-mascot_3.png", embed = true).withWidth(400)
kotlinMascot
```

![Using embedded images](embedded-images-output.png){width=400}

## 数式と方程式

LaTeX形式（学術分野で広く使用されている組版システム）を使用して数式や方程式をレンダリングできます。

1.  Jupyterカーネルの機能を拡張する`lib-ext`ライブラリをノートブックに追加します。

    ```none
    %use lib-ext(0.11.0-398)
    ```

2.  新しいセルで、数式を実行します。

    ```none
    LATEX("c^2 = a^2 + b^2 - 2 a b \\cos\\alpha")
    ```

    ![Using LaTeX to render mathematical formulas](latex-output.png){width=300}

## データフレーム

Kotlin Notebookを使用すると、データフレームで構造化されたデータを可視化できます。

1.  ノートブックに[Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html)ライブラリを追加します。

    ```none
    %use dataframe
    ```

2.  データフレームを作成し、新しいセルで実行します。

    ```kotlin
    val months = listOf(
        "January", "February",
        "March", "April", "May",
        "June", "July", "August",
        "September", "October", "November",
        "December"
    )

    // さまざまな製品と月ごとの売上データ：
    val salesLaptop = listOf(120, 130, 150, 180, 200, 220, 240, 230, 210, 190, 160, 140)
    val salesSmartphone = listOf(90, 100, 110, 130, 150, 170, 190, 180, 160, 140, 120, 100)
    val salesTablet = listOf(60, 70, 80, 90, 100, 110, 120, 110, 100, 90, 80, 70)
     
    // 月、売上、製品の列を持つデータフレーム
    val dfSales = dataFrameOf(
        "Month" to months + months + months,
        "Sales" to salesLaptop + salesSmartphone + salesTablet,
        "Product" to List(12) { "Laptop" } + List(12) { "Smartphone" } + List(12) { "Tablet" },
    )
    ```

    このデータフレームは`dataFrameOf()`関数を使用し、12ヶ月間に販売された製品（ラップトップ、スマートフォン、タブレット）の数を含んでいます。

3.  フレーム内のデータを探索します。例えば、最も売上が高かった製品と月を見つけることができます。

    ```none
    dfSales.maxBy("Sales")
    ```

    ![Using DataFrame to visualize data](dataframe-output.png){width=500}

4.  データフレームをCSVファイルとしてエクスポートすることもできます。

    ```kotlin
    // データをCSV形式でエクスポートする
    dfSales.writeCSV("sales-stats.csv")
    ```

## チャート

Kotlin Notebookで直接様々なチャートを作成し、データを可視化できます。

1.  ノートブックに[Kandy](https://kotlin.github.io/kandy/welcome.html)プロットライブラリを追加します。

    ```none
    %use kandy
    ```

2.  同じデータフレームを使用し、新しいセルで`plot()`関数を実行します。
 
    ```kotlin
    val salesPlot = dfSales.groupBy { Product }.plot {
        bars {
            // データフレームのX軸とY軸に使用される列にアクセスする
            x(Month)
            y(Sales)
            // データフレームのカテゴリに使用される列にアクセスし、それらのカテゴリの色を設定する
            fillColor(Product) {
                scale = categorical(
                    "Laptop" to Color.PURPLE,
                    "Smartphone" to Color.ORANGE,
                    "Tablet" to Color.GREEN
                )
                legend.name = "Product types"
            }
        }
        // チャートの外観をカスタマイズする
        layout.size = 1000 to 450
        layout.title = "Yearly Gadget Sales Results"
    }

    salesPlot
    ```

    ![Using Kandy to render visualize data](kandy-output.png){width=700}

3.  プロットを`.png`、`jpeg`、`.html`、または`.svg`形式でエクスポートすることもできます。

    ```kotlin
    // プロットファイルの出力形式を指定する
    salesPlot.save("sales-chart.svg")
    ```

## 次のステップ

*   [DataFrameおよびKandyライブラリを使用したデータの可視化](data-analysis-visualization.md)
*   [Kotlin Notebookでのリッチな出力のレンダリングと表示について詳しく学ぶ](https://www.jetbrains.com/help/idea/kotlin-notebook.html#render-rich-output)
*   [CSVおよびJSONファイルからのデータ取得](data-analysis-work-with-data-sources.md)
*   [推奨ライブラリのリストを確認する](data-analysis-libraries.md)