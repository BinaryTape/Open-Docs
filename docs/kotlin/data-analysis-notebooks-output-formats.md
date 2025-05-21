---
title: "Kotlin Notebook 支持的输出格式"
---
[Kotlin Notebook](kotlin-notebook-overview) 支持多种输出类型，包括文本 (text)、HTML 和图像 (images)。借助外部库，你可以扩展输出选项，并使用图表 (charts)、电子表格等可视化你的数据。

每个输出都是一个 JSON 对象，它将 [Jupiter MIME type](https://jupyterlab.readthedocs.io/en/latest/user/file_formats.html) 映射到一些数据。Kotlin Notebook 从这个映射中选择优先级最高的受支持 MIME type，并像这样渲染它：

* [文本](#texts) 使用 `text/plain` MIME type。
* [BufferedImage 类](#buffered-images) 使用 `image/png` MIME type，该类型映射到 Base64 字符串。
* [Image 类](#loaded-images) 以及 [LaTeX 格式](#math-formulas-and-equations) 使用 `text/html` MIME type，其中包含 `img` 标签。
* [Kotlin DataFrame 表格](#data-frames) 和 [Kandy 图表](#charts) 使用它们自己的内部 MIME type，这些 MIME type 由静态 HTML 或图像支持。 这样，你就可以在 GitHub 上显示它们。

你可以手动设置映射，例如，使用 Markdown 作为单元格输出：

```kotlin
MimeTypedResult(
    mapOf(
        "text/plain" to "123",
        "text/markdown" to "# HEADER",
        //other mime:value pairs
    )
)
```

要显示任何类型的输出，请使用 `DISPLAY()` 函数。 它还支持组合多个输出：

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

## 文本

### 纯文本

最简单的输出类型是纯文本。 它用于打印语句、变量值或代码中的任何基于文本的输出：

```kotlin
val a1: Int = 1
val a2: Int = 2
var a3: Int? = a1 + a2

"My answer is $a3"
```

<img src="/img/plain-text-output.png" alt="Plain text code output" width="300" style={{verticalAlign: 'middle'}}/>

* 如果单元格的结果无法 [渲染](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#rendering) 并显示为任何输出类型，它将使用 `toString()` 函数作为纯文本打印。
* 如果你的代码包含错误，Kotlin Notebook 会显示错误消息和追溯 (traceback)，从而提供调试的见解。

### 富文本

选择 Markdown 类型的单元格以使用富文本。 这样，你可以使用 Markdown 和 HTML 标记来格式化内容，使用列表、表格、字体样式、代码块等。HTML 可以包含 CSS 样式和 JavaScript。

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

Kotlin Notebook 可以直接渲染 HTML，执行脚本甚至嵌入网站：

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
将你的 notebook 在文件顶部标记为 **Trusted** 才能执行脚本。

:::

## 图像

使用 Kotlin Notebook，你可以显示来自文件、生成的图表或任何其他视觉媒体的图像。静态图像可以用 `.png`、`jpeg` 和 `.svg` 等格式显示。

### BufferedImage 图像

默认情况下，你可以使用 `BufferedImage` 类来显示图像：

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

### 加载的图像

借助 `lib-ext` 库，你可以扩展标准的 Jupyter 功能并显示从网络加载的图像：

```none
%use lib-ext(0.11.0-398)
```

```kotlin
Image("https://kotlinlang.org/docs/images/kotlin-logo.png", embed = false).withWidth(300)
```

<img src="/img/external-images-output.png" alt="Using external image links" width="400" style={{verticalAlign: 'middle'}}/>

### 嵌入式图像

从网络加载的图像的一个缺点是，如果链接断开或者你失去网络连接，图像就会消失。 要解决这个问题，可以使用嵌入式图像，例如：

```kotlin
val kotlinMascot = Image("https://blog.jetbrains.com/wp-content/uploads/2023/04/DSGN-16174-Blog-post-banner-and-promo-materials-for-post-about-Kotlin-mascot_3.png", embed = true).withWidth(400)
kotlinMascot
```

<img src="/img/embedded-images-output.png" alt="Using embedded images" width="400" style={{verticalAlign: 'middle'}}/>

## 数学公式和方程

你可以使用 LaTeX 格式渲染数学公式和方程，LaTeX 格式是一种广泛用于学术界的排版系统：

1. 将扩展 Jupyter kernel 功能的 `lib-ext` 库添加到你的 notebook：

   ```none
   %use lib-ext(0.11.0-398)
   ```

2. 在新单元格中，运行你的公式：

   ```none
   LATEX("c^2 = a^2 + b^2 - 2 a b \\cos\\alpha")
   ```

   <img src="/img/latex-output.png" alt="Using LaTeX to render mathematical formulas" width="300" style={{verticalAlign: 'middle'}}/>

## 数据帧 (Data frames)

使用 Kotlin Notebook，你可以使用数据帧 (data frames) 可视化结构化数据：

1. 将 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库添加到你的 notebook：

   ```none
   %use dataframe
   ```

2. 创建数据帧 (data frame) 并在新单元格中运行它：

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

   数据帧 (data frame) 使用 `dataFrameOf()` 函数，并包括在 12 个月内售出的产品（笔记本电脑、智能手机和平板电脑）的数量。

3. 浏览你的帧中的数据，例如，通过查找销售额最高的产品和月份：

   ```none
   dfSales.maxBy("Sales")
   ```

   <img src="/img/dataframe-output.png" alt="Using DataFrame to visualize data" width="500" style={{verticalAlign: 'middle'}}/>

4. 你还可以将你的数据帧 (data frame) 导出为 CSV 文件：

   ```kotlin
   // Export your data to CSV format
   dfSales.writeCSV("sales-stats.csv")
   ```

## 图表 (Charts)

你可以在 Kotlin Notebook 中直接创建各种图表 (charts) 以可视化你的数据：

1. 将 [Kandy](https://kotlin.github.io/kandy/welcome.html) 绘图库添加到你的 notebook：

   ```none
   %use kandy
   ```

2. 使用相同的数据帧 (data frame) 并在新单元格中运行 `plot()` 函数：
 
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

3. 你还可以将你的图表 (plot) 导出为 `.png`、`jpeg`、`.html` 或 `.svg` 格式：

   ```kotlin
   // Specify the output format for the plot file:
   salesPlot.save("sales-chart.svg")
   ```

## 下一步

* [使用 DataFrame 和 Kandy 库可视化数据](data-analysis-visualization)
* [了解更多关于在 Kotlin Notebook 中渲染和显示富输出](https://www.jetbrains.com/help/idea/kotlin-notebook.html#render-rich-output)
* [从 CSV 和 JSON 文件中检索数据](data-analysis-work-with-data-sources)
* [查看推荐的库列表](data-analysis-libraries)