[//]: # (title: Kotlin Notebook 中的 Kandy 資料視覺化)

Kotlin 提供了一站式解決方案，用於強大且靈活的資料視覺化，在深入複雜模型之前，提供了一種直觀的方式來呈現和探索資料。

本教學將示範如何在 IntelliJ IDEA 中，使用 [Kotlin Notebook](kotlin-notebook-overview.md) 與 [Kandy](https://kotlin.github.io/kandy/welcome.html) 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 函式庫來建立不同類型的圖表。

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式在 IntelliJ IDEA 中預設捆綁並啟用。

如果 Kotlin Notebook 功能不可用，請確保外掛程式已啟用。如需更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1. 選擇 **File** | **New** | **Kotlin Notebook**。
2. 在您的筆記本中，執行以下命令來匯入 Kandy 和 Kotlin DataFrame 函式庫：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 建立 DataFrame

首先建立包含要視覺化記錄的 DataFrame。此 DataFrame 儲存了柏林、馬德里和卡拉卡斯這三座城市每月平均溫度的模擬數據。

使用 Kotlin DataFrame 函式庫中的 `dataFrameOf()` 函數來產生 DataFrame。在 Kotlin Notebook 中執行以下程式碼片段：

```kotlin
// months 變數儲存了包含一年 12 個月份的列表
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid 和 tempCaracas 變數儲存了每個月份的溫度值列表
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df 變數儲存了一個包含月份、溫度和城市記錄的三欄 DataFrame
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

透過檢視前四行來探索新 DataFrame 的結構：

```kotlin
df.head(4)
```

您可以看到該 DataFrame 有三欄：Month、Temperature 和 City。DataFrame 的前四行包含柏林一月到四月的溫度記錄：

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> 有多種選項可以存取欄位的記錄，這有助於您在同時使用 Kandy 和 Kotlin DataFrame 函式庫時提高類型安全。
> 如需更多資訊，請參閱 [存取 API](https://kotlin.github.io/dataframe/apilevels.html)。
>
{style="tip"}

## 建立線圖

讓我們使用上一節中的 `df` DataFrame 在 Kotlin Notebook 中建立一個線圖。

使用 Kandy 函式庫中的 `plot()` 函數。在 `plot()` 函數中，指定圖表類型（在本例中為 `line`）以及 X 和 Y 軸的值。您可以自訂顏色和大小：

```kotlin
df.plot {
    line {
        // 存取用於 X 軸和 Y 軸的 DataFrame 欄位
        x(Month)
        y(Temperature)
        // 存取用於類別的 DataFrame 欄位，並為這些類別設定顏色
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // 自訂線條大小
        width = 1.5
    }
    // 自訂圖表版面配置大小
    layout.size = 1000 to 450
}
```

以下是結果：

![Line chart](visualization-line-chart.svg){width=600}

## 建立散佈圖

現在，讓我們將 `df` DataFrame 視覺化為散佈圖（點圖）。

在 `plot()` 函數中，指定 `points` 圖表類型。加入 X 軸和 Y 軸的值以及來自 `df` 欄位的類別值。您也可以為圖表加入標題：

```kotlin
df.plot {
    points {
        // 存取用於 X 軸和 Y 軸的 DataFrame 欄位
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // 自訂點的大小
        size = 5.5
        // 存取用於類別的 DataFrame 欄位，並為這些類別設定顏色
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // 加入圖表標題
    layout.title = "Temperature per month"
}
```

以下是結果：

![Points chart](visualization-points-chart.svg){width=600}

## 建立長條圖

最後，讓我們使用與前述圖表相同的資料，建立一個按城市分組的長條圖。對於顏色，您也可以使用十六進位碼：

```kotlin
// 按城市分組
df.groupBy { City }.plot {
    // 加入圖表標題
    layout.title = "Temperature per month"
    bars {
        // 存取用於 X 軸和 Y 軸的 DataFrame 欄位
        x(Month)
        y(Temperature)
        // 存取用於類別的 DataFrame 欄位，並為這些類別設定顏色
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

以下是結果：

![Bar chart](visualization-bar-chart.svg){width=600}

## 下一步

* 在 [Kandy 函式庫文件](https://kotlin.github.io/kandy/examples.html) 中探索更多圖表示例
* 在 [Lets-Plot 函式庫文件](lets-plot.md) 中探索更多進階繪圖選項
* 在 [Kotlin DataFrame 函式庫文件](https://kotlin.github.io/dataframe/info.html) 中尋找有關建立、探索和管理資料框架的更多資訊
* 在此 [YouTube 影片]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s) 中了解更多關於 Kotlin Notebook 中的資料視覺化