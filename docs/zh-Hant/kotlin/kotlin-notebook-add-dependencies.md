[//]: # (title: 為您的 Kotlin 記事本新增依賴項)

<tldr>
   <p>這是 **Kotlin 記事本入門** 教程的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
   <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="kotlin-notebook-set-up-env.md">設定環境</a><br/>
      <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="kotlin-notebook-create.md">建立 Kotlin 記事本</a><br/>
      <img src="icon-3.svg" width="20" alt="第三步"/> <strong>為 Kotlin 記事本新增依賴項</strong><br/>
  </p>
</tldr>

您已經建立您的第一個 [Kotlin 記事本](kotlin-notebook-overview.md) 了！現在，讓我們學習如何為函式庫新增依賴項，這是解鎖進階功能所必需的。

> Kotlin 標準函式庫可以開箱即用，因此您無需匯入它。
> 
{style="note"}

您可以透過在任何程式碼儲存格中，使用 Gradle 風格語法指定其座標，從 Maven 儲存庫載入任何函式庫。
然而，Kotlin 記事本提供了一種簡化的方法，可以透過 [`%use` 陳述式](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries) 來載入常用函式庫：

```kotlin
// 將 libraryName 替換為您要新增的函式庫依賴項
%use libraryName
```

您還可以使用 Kotlin 記事本中的自動補齊功能，快速存取可用的函式庫：

![Kotlin 記事本中的自動補齊功能](autocompletion-feature-notebook.png){width=700}

## 將 Kotlin DataFrame 和 Kandy 函式庫新增至您的 Kotlin 記事本

讓我們為您的 Kotlin 記事本新增兩個常用的 Kotlin 函式庫依賴項：
* [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 賦予您在 Kotlin 專案中操作資料的能力。
您可以使用它從 [API](data-analysis-work-with-api.md)、[SQL 資料庫](data-analysis-connect-to-db.md) 以及 [各種檔案格式](data-analysis-work-with-data-sources.md) (例如 CSV 或 JSON) 擷取資料。
* [Kandy 函式庫](https://kotlin.github.io/kandy/welcome.html) 提供了強大且彈性的 DSL，用於 [建立圖表](data-analysis-visualization.md)。

若要新增這些函式庫：

1. 點擊 **Add Code Cell** 以建立新的程式碼儲存格。
2. 在程式碼儲存格中輸入以下程式碼：

    ```kotlin
    // 確保使用最新可用的函式庫版本
    %useLatestDescriptors
    
    // 匯入 Kotlin DataFrame 函式庫
    %use dataframe
    
    // 匯入 Kotlin Kandy 函式庫
    %use kandy
    ```

3. 執行程式碼儲存格。

    當 `%use` 陳述式執行時，它會下載函式庫依賴項並將預設匯入新增至您的記事本。

    > 請確保在執行任何其他依賴該函式庫的程式碼儲存格之前，先執行包含 `%use libraryName` 行的程式碼儲存格。
    >
    {style="note"}

4. 若要使用 Kotlin DataFrame 函式庫從 CSV 檔案匯入資料，請在新的程式碼儲存格中使用 `.read()` 函數：

    ```kotlin
    // 透過從 "netflix_titles.csv" 檔案匯入資料來建立 DataFrame。
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 顯示原始 DataFrame 資料
    rawDf
    ```

    > 您可以從 [Kotlin DataFrame 範例 GitHub 儲存庫](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv) 下載此範例 CSV 檔案。
    > 將其新增至您的專案目錄。
    > 
    {style="tip"}

    ![使用 DataFrame 顯示資料](add-dataframe-dependency.png){width=700}

5. 在新的程式碼儲存格中，使用 `.plot` 方法視覺化呈現 DataFrame 中電視節目和電影的分佈：

    ```kotlin
    rawDf
        // 計算名為 "type" 的欄位中每個唯一值的出現次數
        .valueCounts(sort = false) { type }
        // 以長條圖視覺化資料並指定顏色
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 設定圖表的佈局並設定標題
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

結果圖表：

![使用 Kandy 函式庫進行視覺化](kandy-library.png){width=700}

恭喜您在 Kotlin 記事本中新增並利用了這些函式庫！
這只是您使用 Kotlin 記事本及其[支援的函式庫](data-analysis-libraries.md) 可以實現的一瞥。

## 接下來

* 了解如何[分享您的 Kotlin 記事本](kotlin-notebook-share.md)
* 查看有關[為您的 Kotlin 記事本新增依賴項](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies) 的更多詳細資訊
* 有關使用 Kotlin DataFrame 函式庫的更詳盡指南，請參閱[從檔案擷取資料](data-analysis-work-with-data-sources.md)
* 有關 Kotlin 中資料科學和分析可用工具和資源的詳盡概述，請參閱[用於資料分析的 Kotlin 和 Java 函式庫](data-analysis-libraries.md)