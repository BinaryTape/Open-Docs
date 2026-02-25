[//]: # (title: 在 Kotlin Notebook 中使用 Kandy 進行資料視覺化)

Kotlin 為強大且靈活的資料視覺化提供了一站式解決方案，在深入研究複雜模型之前，提供了一種直觀的方式來呈現和探索資料。

本教學示範如何使用 IntelliJ IDEA 中的 [Kotlin Notebook](kotlin-notebook-overview.md) 配合 [Kandy](https://kotlin.github.io/kandy/welcome.html) 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) 程式庫來建立不同的圖表類型。

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設在 IntelliJ IDEA 中內建並啟用。

如果 Kotlin Notebook 功能無法使用，請確保已啟用該外掛程式。若要了解更多資訊，請參閱[設定環境](kotlin-notebook-set-up-env.md)。

建立一個新的 Kotlin Notebook：

1. 選擇 **File** | **New** | **Kotlin Notebook**。

2. 在您的 notebook 中，執行以下指令來匯入 Kandy 和 Kotlin DataFrame 程式庫：

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 產生 DataFrame

首先產生包含要視覺化之記錄的 DataFrame。此 DataFrame 儲存了柏林、馬德里和卡拉卡斯三個城市每月平均氣溫的模擬數值。

使用 Kotlin DataFrame 程式庫中的 `dataFrameOf()` 函式來產生 DataFrame。在 Kotlin Notebook 中執行以下程式碼片段：

```kotlin
// months 變數儲存包含一年 12 個月的列表
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin、tempMadrid 和 tempCaracas 變數分別儲存每個城市的每月氣溫值列表
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// df 變數儲存一個包含三欄的 DataFrame，包括月份、氣溫和城市的記錄
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

透過查看前四列來探索新 DataFrame 的結構：

```kotlin
df.head(4)
```

您可以看到 DataFrame 有三欄：Month、Temperature 和 City。
DataFrame 的前四列包含柏林從一月到四月的氣溫記錄：

![DataFrame 探索](visualization-dataframe-temperature.png){width=600}

> 存取欄位記錄有不同的選項，這可以幫助您在同時使用 Kandy 和 Kotlin DataFrame 程式庫時提高型別安全性。
> 若要了解更多資訊，請參閱[存取 API](https://kotlin.github.io/dataframe/apilevels.html)。
>
{style="tip"}

## 建立折線圖

讓我們使用上一節中的 `df` DataFrame 在 Kotlin Notebook 中建立折線圖。

使用 Kandy 程式庫中的 `plot()` 函式。在 `plot()` 函式中，指定圖表類型（在本例中為 `line`）以及 X 軸和 Y 軸的值。您可以自訂顏色和大小：

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
        // 自訂線條寬度
        width = 1.5
    }
    // 自訂圖表佈局大小
    layout.size = 1000 to 450
}
```

這是結果：

![折線圖](visualization-line-chart.svg){width=600}

## 建立點狀圖

現在，讓我們在點狀（散佈）圖中視覺化 `df` DataFrame。

在 `plot()` 函式內，指定 `points` 圖表類型。加入 X 軸和 Y 軸的值以及來自 `df` 欄位的類別值。
您還可以為圖表加入標題：

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
    // 新增圖表標題
    layout.title = "Temperature per month"
}
```

這是結果：

![點狀圖](visualization-points-chart.svg){width=600}

## 建立長條圖

最後，讓我們使用與先前圖表相同的資料，建立一個依城市分組的長條圖。
對於顏色，您也可以使用十六進位代碼：

```kotlin
// 依城市分組  
df.groupBy { City }.plot {
    // 新增圖表標題
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

這是結果：

![長條圖](visualization-bar-chart.svg){width=600}

## 下一步

* 在 [Kandy 程式庫文件](https://kotlin.github.io/kandy/examples.html)中探索更多圖表範例
* 在 [Lets-Plot 程式庫文件](lets-plot.md)中探索更多進階繪圖選項
* 在 [Kotlin DataFrame 程式庫文件](https://kotlin.github.io/dataframe/info.html)中尋找有關建立、探索和管理 DataFrame 的其他資訊
* 在此 [YouTube 影片](https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)中進一步了解 Kotlin Notebook 中的資料視覺化