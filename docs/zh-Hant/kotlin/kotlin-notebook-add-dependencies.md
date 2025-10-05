[//]: # (title: 將依賴項新增至您的 Kotlin Notebook)

<tldr>
   <p>這是《<strong>Kotlin Notebook 入門指南</strong>》教學的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">設定環境</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">建立 Kotlin Notebook</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>將依賴項新增至 Kotlin Notebook</strong><br/>
  </p>
</tldr>

您已經建立您的第一個 [Kotlin Notebook](kotlin-notebook-overview.md)！現在讓我們學習如何將依賴項新增至程式庫，這對於解鎖進階功能是必要的。

> Kotlin 標準程式庫可以直接使用，因此您無需匯入它。
> 
{style="note"}

您可以透過在任何程式碼單元中，使用 Gradle 風格的語法指定程式庫的座標，從 Maven 儲存庫載入任何程式庫。 
然而，Kotlin Notebook 提供了一種簡化的方法，以 [`%use` 語句](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries) 的形式載入常用程式庫：

```kotlin
// 將 libraryName 替換為您想新增的程式庫依賴項
%use libraryName
// 如有需要，請指定版本
%use libraryName(version)
// 新增 v= 以觸發自動完成
%use libraryName(v=version)
// 範例：kotlinx.datetime:0.7.1
%use datetime(v=0.7.1)
```

您也可以使用 Kotlin Notebook 中的自動完成功能，快速存取可用的程式庫：

![Kotlin Notebook 中的自動完成功能](autocompletion-feature-notebook.png){width=700}

## 將 Kotlin DataFrame 和 Kandy 程式庫新增至您的 Kotlin Notebook

讓我們將兩個常用的 Kotlin 程式庫依賴項新增至您的 Kotlin Notebook：
* [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html) 讓您能夠在 Kotlin 專案中操控資料。 
您可以使用它從 [APIs](data-analysis-work-with-api.md)、[SQL 資料庫](data-analysis-connect-to-db.md) 和[各種檔案格式](data-analysis-work-with-data-sources.md) (例如 CSV 或 JSON) 擷取資料。
* [Kandy 程式庫](https://kotlin.github.io/kandy/welcome.html) 提供強大且靈活的 DSL，用於[建立圖表](data-analysis-visualization.md)。

若要新增這些程式庫：

1. 點擊 **Add Code Cell** 以建立新的程式碼單元。
2. 在程式碼單元中輸入以下程式碼：

    ```kotlin
    // 確保使用最新可用的程式庫版本
    %useLatestDescriptors
    
    // 匯入 Kotlin DataFrame 程式庫
    %use dataframe
    
    // 匯入 Kotlin Kandy 程式庫
    %use kandy
    ```

3. 執行程式碼單元。

    當 `%use` 語句執行時，它會下載程式庫依賴項，並將預設匯入新增至您的 Notebook。

    > 請務必在執行任何其他依賴該程式庫的程式碼單元之前，先執行包含 `%use libraryName` 行的程式碼單元。
    >
    {style="note"}

4. 若要使用 Kotlin DataFrame 程式庫從 CSV 檔案匯入資料，請在新的程式碼單元中使用 `.read()` 函數：

    ```kotlin
    // 透過從 "netflix_titles.csv" 檔案匯入資料來建立 DataFrame。
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 顯示原始 DataFrame 資料
    rawDf
    ```

    > 您可以從 [Kotlin DataFrame 範例 GitHub 儲存庫](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv) 下載此範例 CSV。
    > 將其新增至您的專案目錄。
    > 
    {style="tip"}

    ![使用 DataFrame 顯示資料](add-dataframe-dependency.png){width=700}

5. 在新的程式碼單元中，使用 `.plot` 方法以視覺化方式呈現您的 DataFrame 中電視節目和電影的分布：

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
    
            // 設定圖表的版面配置並設定標題
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

結果圖表：

![使用 Kandy 程式庫進行視覺化](kandy-library.png){width=700}

恭喜您在 Kotlin Notebook 中新增並利用這些程式庫！
這只是初步了解您可以使用 Kotlin Notebook 及其[支援的程式庫](data-analysis-libraries.md) 達成什麼。

## 下一步

* 學習如何[分享您的 Kotlin Notebook](kotlin-notebook-share.md)
* 查看有關[將依賴項新增至您的 Kotlin Notebook](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies) 的更多詳細資訊
* 如需使用 Kotlin DataFrame 程式庫的更詳盡指南，請參閱[從檔案擷取資料](data-analysis-work-with-data-sources.md)
* 如需有關可供 Kotlin 中的資料科學和分析使用的工具和資源的詳盡概述，請參閱[用於資料分析的 Kotlin 和 Java 程式庫](data-analysis-libraries.md)