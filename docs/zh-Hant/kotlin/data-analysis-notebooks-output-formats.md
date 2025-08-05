[//]: # (title: Kotlin Notebook 支援的輸出格式)

[Kotlin Notebook](kotlin-notebook-overview.md) 支援多種輸出類型，包括文字、HTML 和影像。藉助外部函式庫，您可以擴展輸出選項，並使用圖表、試算表等來可視化您的資料。

每個輸出都是一個 JSON 物件，將 [Jupiter MIME 類型](https://jupyterlab.readthedocs.io/en/latest/user/file_formats.html)映射到某些資料。Kotlin Notebook 從此映射中選擇在其他類型中優先順序最高的支援 MIME 類型，並依此渲染：

*   [文字](#texts) 使用 `text/plain` MIME 類型。
*   [BufferedImage 類別](#buffered-images) 使用映射到 Base64 字串的 `image/png` MIME 類型。
*   [Image 類別](#loaded-images) 以及 [LaTeX 格式](#math-formulas-and-equations) 使用內含 `img` 標籤的 `text/html` MIME 類型。
*   [Kotlin DataFrame 表格](#data-frames) 和 [Kandy 圖表](#charts) 使用它們自己的內部 MIME 類型，這些類型由靜態 HTML 或影像支援。透過這種方式，您可以在 GitHub 上顯示它們。

您可以手動設定映射，例如，使用 Markdown 作為儲存格輸出：

```kotlin
MimeTypedResult(
    mapOf(
        "text/plain" to "123",
        "text/markdown" to "# HEADER",
        //other mime:value pairs
    )
)
```

要顯示任何類型的輸出，請使用 `DISPLAY()` 函式。它還支援組合多個輸出：

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

![高斯分佈的不同輸出](gaussian-distribution-output.png){width=700}

## 文字

### 純文字

最簡單的輸出類型是純文字。它用於列印陳述、變數值或程式碼中的任何文字型輸出：

```kotlin
val a1: Int = 1
val a2: Int = 2
var a3: Int? = a1 + a2

"My answer is $a3"
```

![純文字程式碼輸出](plain-text-output.png){width=300}

*   如果儲存格的結果無法被[渲染](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#rendering)並顯示為任何輸出類型，它將使用 `toString()` 函式列印為純文字。
*   如果您的程式碼包含錯誤，Kotlin Notebook 將顯示錯誤訊息和堆疊追蹤，提供除錯的深入見解。

### 富文字

選擇 Markdown 類型的儲存格來使用富文字。這樣，您可以使用 Markdown 和 HTML 標記來格式化內容，包括列表、表格、字體樣式、程式碼區塊等等。HTML 可以包含 CSS 樣式和 JavaScript。

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

![Markdown 儲存格中的富文字](markdown-cells-output.png){width=700}

## HTML

Kotlin Notebook 可以直接渲染 HTML，執行腳本甚至嵌入網站：

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

![使用 HTML 腳本](direct-html-output.png){width=300}

> 將您的筆記本在檔案頂部標記為 **信任的**，以便能夠執行腳本。
>
{style="note"}

## 影像

使用 Kotlin Notebook，您可以顯示來自檔案、生成的圖形或任何其他視覺媒體的影像。靜態影像可以以 `.png`、`jpeg` 和 `.svg` 等格式顯示。

### 緩衝影像

預設情況下，您可以使用 `BufferedImage` 類別來顯示影像：

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

![使用預設 BufferedImage 顯示影像](bufferedimage-output.png){width=400}

### 載入的影像

藉助 `lib-ext` 函式庫，您可以擴展標準 Jupyter 功能並顯示從網路載入的影像：

```none
%use lib-ext(0.11.0-398)
```

```kotlin
Image("https://kotlinlang.org/docs/images/kotlin-logo.png", embed = false).withWidth(300)
```

![使用外部影像連結](external-images-output.png){width=400}

### 嵌入式影像

從網路載入的影像的一個缺點是，如果連結斷裂或您失去網路連線，影像就會消失。為了解決這個問題，請使用嵌入式影像，例如：

```kotlin
val kotlinMascot = Image("https://blog.jetbrains.com/wp-content/uploads/2023/04/DSGN-16174-Blog-post-banner-and-promo-materials-for-post-about-Kotlin-mascot_3.png", embed = true).withWidth(400)
kotlinMascot
```

![使用嵌入式影像](embedded-images-output.png){width=400}

## 數學公式和方程式

您可以使用 LaTeX 格式渲染數學公式和方程式，這是一種廣泛應用於學術界的排版系統：

1.  將 `lib-ext` 函式庫添加到您的筆記本中，該函式庫擴展了 Jupyter 核心的功能：

    ```none
    %use lib-ext(0.11.0-398)
    ```

2.  在新儲存格中，執行您的公式：

    ```none
    LATEX("c^2 = a^2 + b^2 - 2 a b \\cos\\alpha")
    ```

    ![使用 LaTeX 渲染數學公式](latex-output.png){width=300}

## 資料框架

使用 Kotlin Notebook，您可以使用資料框架可視化結構化資料：

1.  將 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 函式庫添加到您的筆記本中：

    ```none
    %use dataframe
    ```

2.  建立資料框架並在新儲存格中執行它：

    ```kotlin
    val months = listOf(
        "January", "February",
        "March", "April", "May",
        "June", "July", "August",
        "September", "October", "November",
        "December"
    )

    // Sales data for different products and months:
    val salesLaptop = listOf(120, 130, 150, 180, 200, 220, 240, 230, 210, 190, 160, 140)
    val salesSmartphone = listOf(90, 100, 110, 130, 150, 170, 190, 180, 160, 140, 120, 100)
    val salesTablet = listOf(60, 70, 80, 90, 100, 110, 120, 110, 100, 90, 80, 70)
     
    // A data frame with columns for Month, Sales, and Product
    val dfSales = dataFrameOf(
        "Month" to months + months + months,
        "Sales" to salesLaptop + salesSmartphone + salesTablet,
        "Product" to List(12) { "Laptop" } + List(12) { "Smartphone" } + List(12) { "Tablet" },
    )
    ```

    該資料框架使用 `dataFrameOf()` 函式，並包含 12 個月期間售出的產品（筆記型電腦、智慧型手機和平板電腦）數量。

3.  探索您框架中的資料，例如，找到銷售額最高的產品和月份：

    ```none
    dfSales.maxBy("Sales")
    ```

    ![使用 DataFrame 可視化資料](dataframe-output.png){width=500}

4.  您也可以將資料框架匯出為 CSV 檔案：

    ```kotlin
    // Export your data to CSV format
    dfSales.writeCSV("sales-stats.csv")
    ```

## 圖表

您可以直接在 Kotlin Notebook 中建立各種圖表來可視化您的資料：

1.  將 [Kandy](https://kotlin.github.io/kandy/welcome.html) 繪圖函式庫添加到您的筆記本中：

    ```none
    %use kandy
    ```

2.  使用相同的資料框架並在新儲存格中執行 `plot()` 函式：
 
    ```kotlin
    val salesPlot = dfSales.groupBy { Product }.plot {
        bars {
            // Access the data frame's columns used for the X and Y axes
            x(Month)
            y(Sales)
            // Access the data frame's column used for categories and sets colors for these categories
            fillColor(Product) {
                scale = categorical(
                    "Laptop" to Color.PURPLE,
                    "Smartphone" to Color.ORANGE,
                    "Tablet" to Color.GREEN
                )
                legend.name = "Product types"
            }
        }
        // Customize the chart's appearance
        layout.size = 1000 to 450
        layout.title = "Yearly Gadget Sales Results"
    }

    salesPlot
    ```

    ![使用 Kandy 渲染可視化資料](kandy-output.png){width=700}

3.  您還可以將您的圖表匯出為 `.png`、`jpeg`、`.html` 或 `.svg` 格式：

    ```kotlin
    // Specify the output format for the plot file:
    salesPlot.save("sales-chart.svg")
    ```

## 接下來

*   [使用 DataFrame 和 Kandy 函式庫可視化資料](data-analysis-visualization.md)
*   [深入了解如何在 Kotlin Notebook 中渲染和顯示豐富的輸出](https://www.jetbrains.com/help/idea/kotlin-notebook.html#render-rich-output)
*   [從 CSV 和 JSON 檔案中擷取資料](data-analysis-work-with-data-sources.md)
*   [查看推薦函式庫列表](data-analysis-libraries.md)