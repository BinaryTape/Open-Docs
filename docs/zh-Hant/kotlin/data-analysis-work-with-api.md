[//]: # (title: 從網路來源和 API 擷取資料)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了一個強大的平台，用於存取和處理來自各種網路來源和 API 的資料。它透過提供一個疊代環境來簡化資料擷取和分析任務，其中每個步驟都可以視覺化以提高清晰度。這使得它在探索您不熟悉的 API 時特別有用。

當結合 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 使用時，Kotlin Notebook 不僅讓您能夠連接並從 API 擷取 JSON 資料，還協助重塑這些資料以進行全面分析和視覺化。

> 如需 Kotlin Notebook 範例，請參閱 [GitHub 上的 DataFrame 範例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)。
>
{style="tip"}

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設捆綁並啟用在 IntelliJ IDEA 中。

如果 Kotlin Notebook 功能不可用，請確保已啟用該外掛程式。如需更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1.  依序選擇 **檔案** | **新增** | **Kotlin Notebook**。
2.  在 Kotlin Notebook 中，透過執行以下命令匯入 Kotlin DataFrame 函式庫：

    ```kotlin
    %use dataframe
    ```

## 從 API 擷取資料

透過 Kotlin Notebook 和 Kotlin DataFrame 函式庫從 API 擷取資料是透過 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函式實現的，這類似於 [從檔案擷取資料](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file)，例如 CSV 或 JSON。然而，當處理基於網路的來源時，您可能需要額外的格式化來將原始 API 資料轉換為結構化格式。

讓我們看一個從 [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) 擷取資料的範例：

1.  開啟您的 Kotlin Notebook 檔案 (`.ipynb`)。

2.  匯入 Kotlin DataFrame 函式庫，這對於資料處理任務至關重要。這是透過在程式碼儲存格中執行以下命令來完成的：

    ```kotlin
    %use dataframe
    ```

3.  在新的程式碼儲存格中安全地新增您的 API 金鑰，這對於驗證對 YouTube Data API 的請求是必要的。您可以從 [憑證分頁](https://console.cloud.google.com/apis/credentials) 取得您的 API 金鑰：

    ```kotlin
    val apiKey = "YOUR-API_KEY"
    ```

4.  建立一個載入函式，它將路徑作為字串，並使用 DataFrame 的 `.read()` 函式從 YouTube Data API 擷取資料：

    ```kotlin
    fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
    ```

5.  將擷取的資料組織成列，並透過 `nextPageToken` 處理 YouTube API 的分頁。這確保您能從多個頁面收集資料：

    ```kotlin
    fun load(path: String, maxPages: Int): AnyFrame {
    
        // 初始化一個可變列表來儲存資料列。
        val rows = mutableListOf<AnyRow>()
    
        // 設定資料載入的初始頁面路徑。
        var pagePath = path
        do {
    
            // 從目前頁面路徑載入資料。
            val row = load(pagePath)
            // 將載入的資料作為一列新增到列表中。
            rows.add(row)
           
            // 擷取下一頁的權杖，如果可用。
            val next = row.getValueOrNull<String>("nextPageToken")
            // 更新下一輪的頁面路徑，包含新的權杖。
            pagePath = path + "&pageToken=" + next
    
            // 繼續載入頁面，直到沒有下一頁。
        } while (next != null && rows.size < maxPages) 
        
        // 將所有載入的列串聯並作為 DataFrame 返回。
        return rows.concat() 
    }
    ```

6.  使用之前定義的 `load()` 函式在新的程式碼儲存格中擷取資料並建立 DataFrame。此範例擷取資料，或者在此情況下，與 Kotlin 相關的影片，每頁最多 50 個結果，最多 5 頁。結果儲存在 `df` 變數中：

    ```kotlin
    val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
    df
    ```

7.  最後，從 DataFrame 中擷取並串聯項目：

    ```kotlin
    val items = df.items.concat()
    items
    ```

## 清理並精煉資料

清理和精煉資料是準備您的資料集以供分析的關鍵步驟。[Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 為這些任務提供了強大的功能。諸如 [`move`](https://kotlin.github.io/dataframe/move.html)、[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html) 和 [`join`](https://kotlin.github.io/dataframe/join.html) 等方法對於組織和轉換您的資料至關重要。

讓我們探討一個範例，其中資料已使用 [YouTube 的資料 API 擷取](#fetch-data-from-an-api)。目標是清理和重組資料集以準備深入分析：

1.  您可以從重新組織和清理資料開始。這涉及到將某些欄位移動到新的標頭下，並移除不必要的欄位以提高清晰度：

    ```kotlin
    val videos = items.dropNulls { id.videoId }
        .select { id.videoId named "id" and snippet }
        .distinct()
    videos
    ```

2.  從清理過的資料中分塊 ID，並載入對應的影片統計數據。這涉及到將資料分成更小的批次，並擷取額外的詳細資訊：

    ```kotlin
    val statPages = clean.id.chunked(50).map {
        val ids = it.joinToString("%2C")
        load("videos?part=statistics&id=$ids")
    }
    statPages
    ```

3.  串聯擷取的統計數據，並選擇相關欄位：

    ```kotlin
    val stats = statPages.items.concat().select { id and statistics.all() }.parse()
    stats
    ```

4.  將現有的清理過資料與新擷取的統計數據結合。這將兩組資料合併成一個全面的 DataFrame：

    ```kotlin
    val joined = clean.join(stats)
    joined
    ```

此範例展示了如何使用 Kotlin DataFrame 的各種函式來清理、重新組織和增強您的資料集。每一步都旨在精煉資料，使其更適合 [深入分析](#analyze-data-in-kotlin-notebook)。

## 在 Kotlin Notebook 中分析資料

在您成功 [擷取](#fetch-data-from-an-api) 並 [清理和精煉資料](#clean-and-refine-data) 之後，使用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 中的函式，下一步是分析此準備好的資料集以提取有意義的見解。

諸如 [`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 用於分類資料，[`sum`](https://kotlin.github.io/dataframe/sum.html) 和 [`maxBy`](https://kotlin.github.io/dataframe/maxby.html) 用於 [摘要統計](https://kotlin.github.io/dataframe/summarystatistics.html)，以及 [`sortBy`](https://kotlin.github.io/dataframe/sortby.html) 用於排序資料等方法特別有用。這些工具讓您能夠高效地執行複雜的資料分析任務。

讓我們看一個範例，使用 `groupBy` 按頻道分類影片，`sum` 來計算每個類別的總觀看次數，以及 `maxBy` 來找出每個群組中最新或觀看次數最多的影片：

1.  透過設定參考來簡化對特定欄位的存取：

    ```kotlin
    val view by column<Int>()
    ```

2.  使用 `groupBy` 方法根據 `channel` 欄位分組資料並排序。

    ```kotlin
    val channels = joined.groupBy { channel }.sortByCount()
    ```

在結果表中，您可以互動式地探索資料。點擊與頻道對應的列中的 `group` 欄位，會展開該列以顯示該頻道影片的更多詳細資訊。

![展開一列以顯示更多詳細資訊](results-of-expanding-group-data-analysis.png){width=700}

您可以點擊左下角的表格圖示返回到分組後的資料集。

![點擊左下角的表格圖示返回](return-to-grouped-dataset.png){width=700}

3.  使用 `aggregate`、`sum`、`maxBy` 和 `flatten` 來建立一個 DataFrame，匯總每個頻道的總觀看次數及其最新或觀看次數最多影片的詳細資訊：

    ```kotlin
    val aggregated = channels.aggregate {
        viewCount.sum() into view
    
        val last = maxBy { publishedAt }
        last.title into "last title"
        last.publishedAt into "time"
        last.viewCount into "viewCount"
        // 按觀看次數降序排序 DataFrame，並將其轉換為平面結構。
    }.sortByDesc(view).flatten()
    aggregated
    ```

分析結果：

![分析結果](kotlin-analysis.png){width=700}

如需更進階的技術，請參閱 [Kotlin DataFrame 文件](https://kotlin.github.io/dataframe/gettingstarted.html)。

## 下一步

*   探索使用 [Kandy 函式庫](https://kotlin.github.io/kandy/examples.html) 進行資料可視化
*   在 [使用 Kandy 在 Kotlin Notebook 中進行資料可視化](data-analysis-visualization.md) 中查找有關資料可視化的其他資訊
*   如需 Kotlin 中可用於資料科學和分析的工具和資源的廣泛概述，請參閱 [用於資料分析的 Kotlin 和 Java 函式庫](data-analysis-libraries.md)