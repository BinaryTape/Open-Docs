[//]: # (title: 使用 Kandy 在 Kotlin Notebook 中進行資料視覺化)

Kotlin 提供了一站式解決方案，可實現強大且靈活的資料視覺化，在深入複雜模型之前，提供了一種直觀的方式來呈現和探索資料。

本教學課程示範如何在 IntelliJ IDEA 中，使用 [Kotlin Notebook](kotlin-notebook-overview.md) 搭配 [Kandy](https://kotlin.github.io/kandy/welcome.html) 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) 函式庫來建立不同類型的圖表。

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式在 IntelliJ IDEA 中預設已綁定並啟用。

如果 Kotlin Notebook 功能不可用，請確保外掛程式已啟用。如需更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1. 選擇 **檔案** | **新增** | **Kotlin Notebook**。

2. 在您的 Notebook 中，透過執行以下指令來匯入 Kandy 和 Kotlin DataFrame 函式庫：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 建立 DataFrame

首先建立包含要視覺化記錄的 DataFrame。此 DataFrame 儲存了柏林、馬德里和加拉加斯三個城市的月平均氣溫模擬數字。

使用 Kotlin DataFrame 函式庫中的 `dataFrameOf()` 函式來產生 DataFrame。在 Kotlin Notebook 中執行以下程式碼片段：

```kotlin
// The months variable stores a list with the 12 months of the year
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

// The df variable stores a DataFrame of three columns, including records of months, temperature, and cities
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

透過查看前四行來探索新 DataFrame 的結構：

```kotlin
df.head(4)
```

您可以看到此 DataFrame 有三列：Month、Temperature 和 City。DataFrame 的前四行包含柏林從一月到四月的氣溫記錄：

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> 有多種選項可以存取欄位的記錄，這有助於您在搭配使用 Kandy 和 Kotlin DataFrame 函式庫時提高類型安全。
> 如需更多資訊，請參閱 [Access APIs](https://kotlin.github.io/dataframe/apilevels.html)。
> {style="tip"}

## 建立折線圖

讓我們在 Kotlin Notebook 中使用上一節的 `df` DataFrame 建立一個折線圖。

使用 Kandy 函式庫中的 `plot()` 函式。在 `plot()` 函式中，指定圖表類型 (在此情況下為 `line`) 以及 X 軸和 Y 軸的值。您可以自訂顏色和大小：

```kotlin
df.plot {
    line {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // Customizes the line's size
        width = 1.5
    }
    // Customizes the chart's layout size
    layout.size = 1000 to 450
}
```

結果如下：

![Line chart](visualization-line-chart.svg){width=600}

## 建立點狀圖

現在，讓我們將 `df` DataFrame 視覺化為點狀 (散佈) 圖。

在 `plot()` 函式中，指定 `points` 圖表類型。加入 X 軸和 Y 軸的值以及來自 `df` 欄位的類別值。您也可以在圖表中加入標題：

```kotlin
df.plot {
    points {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // Customizes the point's size
        size = 5.5
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // Adds a chart heading
    layout.title = "Temperature per month"
}
```

結果如下：

![Points chart](visualization-points-chart.svg){width=600}

## 建立長條圖

最後，讓我們使用與先前圖表相同的資料建立一個按城市分組的長條圖。對於顏色，您也可以使用十六進位碼：

```kotlin
// Groups by cities  
df.groupBy { City }.plot {
    // Adds a chart heading
    layout.title = "Temperature per month"
    bars {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
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

結果如下：

![Bar chart](visualization-bar-chart.svg){width=600}

## 接下來

* 探索 [Kandy 函式庫文件](https://kotlin.github.io/kandy/examples.html) 中的更多圖表示例
* 探索 [Lets-Plot 函式庫文件](lets-plot.md) 中的更進階繪圖選項
* 在 [Kotlin DataFrame 函式庫文件](https://kotlin.github.io/dataframe/info.html) 中尋找有關建立、探索和管理資料框架的更多資訊
* 在此 [YouTube 影片]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s) 中深入了解 Kotlin Notebook 中的資料視覺化