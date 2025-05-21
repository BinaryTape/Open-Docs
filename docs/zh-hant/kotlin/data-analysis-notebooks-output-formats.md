---
title: "Kotlin Notebook 支援的輸出格式"
---
[Kotlin Notebook](kotlin-notebook-overview) 支援多種輸出類型，包含文字、HTML 和圖片。藉由外部函式庫的協助，你可以擴展你的輸出選項，並用圖表、試算表等方式視覺化你的資料。

每個輸出都是一個 JSON 物件，將 [Jupiter MIME 類型](https://jupyterlab.readthedocs.io/en/latest/user/file_formats.html) 對應到某些資料。Kotlin Notebook 會從這個對應中，選取支援度最高 (priority) 的 MIME 類型，並以下列方式呈現：

* [文字 (Text)](#texts) 使用 `text/plain` MIME 類型。
* [BufferedImage 類別](#buffered-images) 使用 `image/png` MIME 類型，該類型會對應到 Base64 字串。
* [Image 類別](#loaded-images)，以及 [LaTeX 格式](#math-formulas-and-equations)，使用 `text/html` MIME 類型，並在其中包含 `img` 標籤 (tag)。
* [Kotlin DataFrame 表格](#data-frames) 和 [Kandy 圖表](#charts) 使用它們自己的內部 MIME 類型，這些類型由靜態 HTML 或圖片支援。這樣，你就可以在 GitHub 上顯示它們。

你可以手動設定對應，例如，使用 Markdown 作為儲存格 (cell) 輸出：

```kotlin
MimeTypedResult(
    mapOf(
        "text/plain" to "123",
        "text/markdown" to "# HEADER",
        //other mime:value pairs
    )
)
```

要顯示任何種類的輸出，請使用 `DISPLAY()` 函式。它也支援合併多個輸出：

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

<img src="/img/gaussian-distribution-output.png" alt="Different outputs for Gaussian distribution" width="700" style={{verticalAlign: 'middle'}}/>

## 文字 (Texts)

### 純文字 (Plain text)

最簡單的輸出類型是純文字。它用於列印的陳述式 (statement)、變數值，或來自你程式碼的任何基於文字的輸出：

```kotlin
val a1: Int = 1
val a2: Int = 2
var a3: Int? = a1 + a2

"My answer is $a3"
```

<img src="/img/plain-text-output.png" alt="Plain text code output" width="300" style={{verticalAlign: 'middle'}}/>

* 如果儲存格 (cell) 的結果無法被 [呈現](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#rendering) 並顯示為任何輸出類型，它會使用 `toString()` 函式以純文字形式列印。
* 如果你的程式碼包含錯誤，Kotlin Notebook 會顯示錯誤訊息和追蹤 (traceback)，提供偵錯的資訊。

### 豐富文字 (Rich text)

選擇 Markdown 類型的儲存格 (cell) 以使用豐富文字。這樣，你可以使用 Markdown 和 HTML 標記 (markup) 格式化內容，使用清單、表格、字型樣式、程式碼區塊等。HTML 可以包含 CSS 樣式和 JavaScript。

```none
## Line magics

| Spell                              | Description                                                                                                      | Example                                                                               |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| `%use`                  | Injects code for supported libraries: artifact resolution, default imports, initialization code, type renderers. | `%use klaxon(5.5), lets-plot`                                              |                                         
| `%trackClasspath`       | Logs any changes of current classpath. Useful for debugging artifact resolution failures.                        | `%trackClasspath [on |off]`                                                |
| `%trackExecution`       | Logs pieces of code that are going to be executed. Useful for debugging of libraries support.                    | `%trackExecution [all|generated|off]`                                      |          
| `%useLatestDescriptors` | Use latest versions of library descriptors available. By default, bundled descriptors are used.                  | `%useLatestDescriptors [on|off]`                                           |
| `%output`               | Output capturing settings.                                                                                       | `%output --max-cell-size=1000 --no-stdout --max-time=100 --max-buffer=400` |
| `%logLevel`             | Set logging level.                                                                                               | `%logLevel [off|error|warn|info|debug]`                                    |
<ul><li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics">Learn more detailes about line magics</a>.</li>
<li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics">See the full list of supported libraries</a>.</li></ul>
```

<img src="/img/markdown-cells-output.png" alt="Rich text in Markdown cells" width="700" style={{verticalAlign: 'middle'}}/>

## HTML

Kotlin Notebook 可以直接呈現 HTML，執行腳本 (script) 甚至嵌入網站：

```none
HTML("""
<p>
   Counter: <span id="ctr">0</span> <button onclick="inc()">Increment</button>
</p>
<script>
    function inc() {
        let counter = document.getElementById("ctr")
        counter.innerHTML = parseInt(counter.innerHTML) + 1;
}
</script>
""")
```

<img src="/img/direct-html-output.png" alt="Using HTML script" width="300" style={{verticalAlign: 'middle'}}/>
:::note
將你的 notebook 在檔案頂端標記為 **Trusted**，才能夠執行腳本 (script)。

:::

## 圖片 (Images)

使用 Kotlin Notebook，你可以顯示來自檔案、產生的圖表或任何其他視覺媒體的圖片。靜態圖片可以使用 `.png`、`jpeg` 和 `.svg` 等格式顯示。

### 緩衝圖片 (Buffered images)

預設情況下，你可以使用 `BufferedImage` 類別來顯示圖片：

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

<img src="/img/bufferedimage-output.png" alt="Using default BufferedImage to display images" width="400" style={{verticalAlign: 'middle'}}/>

### 載入的圖片 (Loaded images)

藉由 `lib-ext` 函式庫的協助，你可以擴展標準 Jupyter 功能，並顯示從網路載入的圖片：

```none
%use lib-ext(0.11.0-398)
```

```kotlin
Image("https://kotlinlang.org/docs/images/kotlin-logo.png", embed = false).withWidth(300)
```

<img src="/img/external-images-output.png" alt="Using external image links" width="400" style={{verticalAlign: 'middle'}}/>

### 嵌入的圖片 (Embedded images)

從網路載入圖片的一個缺點是，如果連結中斷或失去網路連線，圖片就會消失。要解決這個問題，請使用嵌入的圖片，例如：

```kotlin
val kotlinMascot = Image("https://blog.jetbrains.com/wp-content/uploads/2023/04/DSGN-16174-Blog-post-banner-and-promo-materials-for-post-about-Kotlin-mascot_3.png", embed = true).withWidth(400)
kotlinMascot
```

<img src="/img/embedded-images-output.png" alt="Using embedded images" width="400" style={{verticalAlign: 'middle'}}/>

## 數學公式和方程式 (Math formulas and equations)

你可以使用 LaTeX 格式呈現數學公式和方程式，LaTeX 格式是一種廣泛用於學術界的排版系統：

1. 將擴展 Jupyter 核心 (kernel) 功能的 `lib-ext` 函式庫新增到你的 notebook：

   ```none
   %use lib-ext(0.11.0-398)
   ```

2. 在新的儲存格 (cell) 中，執行你的公式：

   ```none
   LATEX("c^2 = a^2 + b^2 - 2 a b \\cos\\alpha")
   ```

   <img src="/img/latex-output.png" alt="Using LaTeX to render mathematical formulas" width="300" style={{verticalAlign: 'middle'}}/>

## 數據框架 (Data frames)

使用 Kotlin Notebook，你可以使用數據框架 (data frame) 可視化結構化數據：

1. 將 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 函式庫新增到你的 notebook：

   ```none
   %use dataframe
   ```

2. 建立數據框架 (data frame) 並在新的儲存格 (cell) 中執行它：

   ```kotlin
   val months = listOf(
       "January", "February",
       "March", "April", "May",
       "June", "July", "August",
       "September", "October", "November",
       "December"
   )

   // Sales data for different products and regions:
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

   數據框架 (data frame) 使用 `dataFrameOf()` 函式，並包含在 12 個月期間銷售的產品數量 (筆記型電腦、智慧型手機和平板電腦)。

3. 探索你的框架 (frame) 中的資料，例如，找到銷售額最高的產品和月份：

   ```none
   dfSales.maxBy("Sales")
   ```

   <img src="/img/dataframe-output.png" alt="Using DataFrame to visualize data" width="500" style={{verticalAlign: 'middle'}}/>

4. 你也可以將你的數據框架 (data frame) 匯出為 CSV 檔案：

   ```kotlin
   // Export your data to CSV format
   dfSales.writeCSV("sales-stats.csv")
   ```

## 圖表 (Charts)

你可以在 Kotlin Notebook 中直接建立各種圖表，以視覺化你的資料：

1. 將 [Kandy](https://kotlin.github.io/kandy/welcome.html) 繪圖函式庫新增到你的 notebook：

   ```none
   %use kandy
   ```

2. 使用相同的數據框架 (data frame) 並且在新的儲存格 (cell) 中執行 `plot()` 函式：
 
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

   <img src="/img/kandy-output.png" alt="Using Kandy to render visualize data" width="700" style={{verticalAlign: 'middle'}}/>

3. 你也可以將你的繪圖匯出為 `.png`、`jpeg`、`.html` 或 `.svg` 格式：

   ```kotlin
   // Specify the output format for the plot file:
   salesPlot.save("sales-chart.svg")
   ```

## 接下來 (What's next)

* [使用 DataFrame 和 Kandy 函式庫可視化資料](data-analysis-visualization)
* [進一步瞭解在 Kotlin Notebook 中呈現和顯示豐富輸出](https://www.jetbrains.com/help/idea/kotlin-notebook.html#render-rich-output)
* [從 CSV 和 JSON 檔案中檢索資料](data-analysis-work-with-data-sources)
* [查看建議的函式庫清單](data-analysis-libraries)