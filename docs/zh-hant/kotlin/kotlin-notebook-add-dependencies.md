---
title: "將相依性新增至您的 Kotlin Notebook"
---
:::info
<p>
   這是 <strong>Kotlin Notebook 入門</strong>教學的第三部分。在繼續之前，請確保您已完成之前的步驟。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">設定環境（Set up an environment）</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create">建立 Kotlin Notebook（Create a Kotlin Notebook）</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>向 Kotlin Notebook 新增依賴項（Add dependencies to a Kotlin Notebook）</strong><br/>
</p>

:::

您已經建立了您的第一個 [Kotlin Notebook](kotlin-notebook-overview)！現在讓我們學習如何向程式庫新增依賴項，這對於解鎖進階功能是必要的。

:::note
Kotlin 標準程式庫可以直接使用，因此您無需匯入它。

:::

您可以透過在任何程式碼儲存格中使用 Gradle 樣式的語法指定其座標，從 Maven 儲存庫載入任何程式庫。
但是，Kotlin Notebook 有一種簡化的方法，可以使用 [`%use` 語句](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)載入常用的程式庫：

```kotlin
// 將 libraryName 替換為您要新增的程式庫依賴項
%use libraryName
```

您還可以使用 Kotlin Notebook 中的自動完成功能來快速存取可用的程式庫：

<img src="/img/autocompletion-feature-notebook.png" alt="Kotlin Notebook 中的自動完成功能" width="700" style={{verticalAlign: 'middle'}}/>

## 將 Kotlin DataFrame 和 Kandy 程式庫新增到您的 Kotlin Notebook

讓我們將兩個常用的 Kotlin 程式庫依賴項新增到您的 Kotlin Notebook：
* [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 使您能夠在 Kotlin 專案中操作資料。
  您可以使用它從 [API](data-analysis-work-with-api)、[SQL 資料庫](data-analysis-connect-to-db) 和 [各種檔案格式](data-analysis-work-with-data-sources)（例如 CSV 或 JSON）中檢索資料。
* [Kandy 程式庫](https://kotlin.github.io/kandy/welcome.html) 提供了一個強大而靈活的 DSL，用於 [建立圖表](data-analysis-visualization)。

要新增這些程式庫：

1. 點擊 **Add Code Cell（新增程式碼儲存格）** 以建立一個新的程式碼儲存格。
2. 在程式碼儲存格中輸入以下程式碼：

    ```kotlin
    // 確保使用最新的可用程式庫版本
    %useLatestDescriptors
    
    // 匯入 Kotlin DataFrame 程式庫
    %use dataframe
    
    // 匯入 Kotlin Kandy 程式庫
    %use kandy
    ```

3. 執行程式碼儲存格。

    當執行 `%use` 語句時，它會下載程式庫依賴項並將預設匯入新增到您的 Notebook。

    > 請務必在執行任何其他依賴於
    > 程式庫的程式碼儲存格之前，先執行包含 `%use libraryName` 行的程式碼儲存格。
    >
    

4. 若要使用 Kotlin DataFrame 程式庫從 CSV 檔案匯入資料，請在新的程式碼儲存格中使用 `.read()` 函式：

    ```kotlin
    // 透過從 "netflix_titles.csv" 檔案匯入資料來建立 DataFrame。
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 顯示原始 DataFrame 資料
    rawDf
    ```

    > 您可以從 [Kotlin DataFrame 範例 GitHub 儲存庫](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv) 下載此 CSV 範例。
    > 將其新增到您的專案目錄。
    > 
    

    <img src="/img/add-dataframe-dependency.png" alt="使用 DataFrame 顯示資料" width="700" style={{verticalAlign: 'middle'}}/>

5. 在新的程式碼儲存格中，使用 `.plot` 方法以視覺方式呈現 DataFrame 中電視節目和電影的分布：

    ```kotlin
    rawDf
        // 計算名為 "type" 的列中每個唯一值的出現次數
        .valueCounts(sort = false) { type }
        // 在指定顏色的長條圖中視覺化資料
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 配置圖表的佈局並設定標題
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

產生的圖表：

<img src="/img/kandy-library.png" alt="使用 Kandy 程式庫進行視覺化" width="700" style={{verticalAlign: 'middle'}}/>

恭喜您在 Kotlin Notebook 中新增和使用這些程式庫！
這只是您可以使用 Kotlin Notebook 及其 [支援的程式庫](data-analysis-libraries) 實現的一瞥。

## 接下來的步驟

* 了解如何 [分享您的 Kotlin Notebook](kotlin-notebook-share)
* 查看有關 [向您的 Kotlin Notebook 新增依賴項](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies) 的更多詳細資訊
* 有關使用 Kotlin DataFrame 程式庫的更廣泛指南，請參閱 [從檔案中檢索資料](data-analysis-work-with-data-sources)
* 有關 Kotlin 中可用於資料科學和分析的工具和資源的廣泛概述，請參閱 [用於資料分析的 Kotlin 和 Java 程式庫](data-analysis-libraries)