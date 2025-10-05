[//]: # (title: 從網路來源和 API 擷取資料)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供一個強大的平台，用於存取和操作來自各種網路來源和 API 的資料。它透過提供一個疊代式環境來簡化資料擷取和分析任務，該環境能將每個步驟視覺化以提高清晰度。這使得它在探索您不熟悉的 API 時特別有用。

當與 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html) 結合使用時，Kotlin Notebook 不僅讓您能夠連接並從 API 擷取 JSON 資料，還協助重塑這些資料以進行全面的分析和視覺化。

> 有關 Kotlin Notebook 範例，請參閱 [GitHub 上的 DataFrame 範例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)。
>
{style="tip"}

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設已綁定並在 IntelliJ IDEA 中啟用。

如果 Kotlin Notebook 功能不可用，請確保外掛程式已啟用。欲了解更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立一個新的 Kotlin Notebook：

1. 選取 **檔案** | **新增** | **Kotlin Notebook**。
2. 在 Kotlin Notebook 中，透過執行以下命令匯入 Kotlin DataFrame 程式庫：

   ```kotlin
   %use dataframe
   ```

## 從 API 擷取資料

透過 Kotlin Notebook 與 Kotlin DataFrame 程式庫從 API 擷取資料，是透過 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函數實現的，這與 [從檔案擷取資料](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file)（例如 CSV 或 JSON）相似。然而，當處理基於網路的來源時，您可能需要額外的格式設定，以將原始 API 資料轉換為結構化格式。

讓我們看看一個從 [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) 擷取資料的範例：

1. 開啟您的 Kotlin Notebook 檔案 (`.ipynb`)。

2. 匯入 Kotlin DataFrame 程式庫，這對於資料操作任務至關重要。這是透過在程式碼儲存格中執行以下命令來完成的：

   ```kotlin
   %use dataframe
   ```

3. 在新的程式碼儲存格中安全地新增您的 API 密鑰，這對於向 YouTube Data API 驗證請求是必要的。您可以從 [憑證分頁](https://console.cloud.google.com/apis/credentials) 取得您的 API 密鑰：

   ```kotlin
   val apiKey = "YOUR-API_KEY"
   ```

4. 建立一個 `load` 函數，它接受一個字串形式的路徑，並使用 DataFrame 的 `.read()` 函數從 YouTube Data API 擷取資料：

   ```kotlin
   fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
   ```

5. 將擷取的資料組織成行，並透過 `nextPageToken` 處理 YouTube API 的分頁。這確保您能收集多個頁面中的資料：

   ```kotlin
   fun load(path: String, maxPages: Int): AnyFrame {
       // 初始化一個可變列表來儲存資料行。
       val rows = mutableListOf<AnyRow>()

       // 設定資料載入的初始頁面路徑。
       var pagePath = path
       do {
           // 從當前頁面路徑載入資料。
           val row = load(pagePath)
           // 將載入的資料作為一行新增到列表中。
           rows.add(row)

           // 擷取下一頁的權杖（如果可用）。
           val next = row.getValueOrNull<String>("nextPageToken")
           // 更新用於下一個疊代的頁面路徑，包括新的權杖。
           pagePath = path + "&pageToken=" + next

           // 持續載入頁面，直到沒有下一頁。
       } while (next != null && rows.size < maxPages) 

       // 將所有載入的資料行串聯並作為 DataFrame 返回。
       return rows.concat() 
   }
   ```

6. 使用先前定義的 `load()` 函數，在新的程式碼儲存格中擷取資料並建立一個 DataFrame。此範例擷取資料，或者在本例中，擷取與 Kotlin 相關的影片，每頁最多 50 個結果，最多 5 頁。結果儲存在 `df` 變數中：

   ```kotlin
   val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
   df
   ```

7. 最後，從 DataFrame 中提取並串聯項目：

   ```kotlin
   val items = df.items.concat()
   items
   ```

## 清理和優化資料

清理和優化資料是準備您的資料集以進行分析的關鍵步驟。[Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html) 為這些任務提供了強大的功能。諸如 [`move`](https://kotlin.github.io/dataframe/move.html)、[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html) 和 [`join`](https://kotlin.github.io/dataframe/join.html) 等方法在組織和轉換您的資料方面發揮著重要作用。

讓我們來探討一個資料已從 [YouTube 資料 API 擷取](#fetch-data-from-an-api) 的範例。目標是清理和重組資料集，為深入分析做準備：

1. 您可以從重新組織和清理資料開始。這包括將某些欄位移至新的標題下，並為清晰度移除不必要的欄位：

   ```kotlin
   val videos = items.dropNulls { id.videoId }
       .select { id.videoId named "id" and snippet }
       .distinct()
   videos
   ```

2. 從清理後的資料中將 ID 分塊，並載入對應的影片統計資料。這涉及將資料分解成更小的批次，並擷取額外詳細資訊：

   ```kotlin
   val statPages = clean.id.chunked(50).map {
       val ids = it.joinToString("%2C")
       load("videos?part=statistics&id=$ids")
   }
   statPages
   ```

3. 串聯已擷取的統計資料並選取相關欄位：

   ```kotlin
   val stats = statPages.items.concat().select { id and statistics.all() }.parse()
   stats
   ```

4. 將現有的清理資料與新擷取的統計資料連接。這將兩組資料合併到一個全面的 DataFrame 中：

   ```kotlin
   val joined = clean.join(stats)
   joined
   ```

此範例示範如何使用 Kotlin DataFrame 的各種函數清理、重新組織和增強您的資料集。每個步驟都旨在優化資料，使其更適合 [深入分析](#analyze-data-in-kotlin-notebook)。

## 在 Kotlin Notebook 中分析資料

在您使用 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html) 的函數成功 [擷取](#fetch-data-from-an-api) 並 [清理和優化資料](#clean-and-refine-data) 後，下一步是分析這個準備好的資料集，以提取有意義的見解。

諸如用於資料分類的 [`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、用於 [摘要統計](https://kotlin.github.io/dataframe/summarystatistics.html) 的 [`sum`](https://kotlin.github.io/dataframe/sum.html) 和 [`maxBy`](https://kotlin.github.io/dataframe/maxby.html)，以及用於資料排序的 [`sortBy`](https://kotlin.github.io/dataframe/sortby.html) 等方法特別有用。這些工具讓您能夠高效地執行複雜的資料分析任務。

讓我們來看一個範例，使用 `groupBy` 按頻道分類影片，使用 `sum` 計算每個類別的總觀看次數，並使用 `maxBy` 尋找每個群組中最新或觀看次數最多的影片：

1. 透過設定引用來簡化對特定欄位的存取：

   ```kotlin
   val view by column<Int>()
   ```

2. 使用 `groupBy` 方法，根據 `channel` 欄位對資料進行分組並排序。

   ```kotlin
   val channels = joined.groupBy { channel }.sortByCount()
   ```

在結果表中，您可以互動式地探索資料。點擊與頻道對應的資料行中的 `group` 欄位，將展開該資料行以顯示有關該頻道影片的更多詳細資訊。

![展開資料行以顯示更多詳細資訊](results-of-expanding-group-data-analysis.png){width=700}

您可以點擊左下角的表格圖示，返回到分組的資料集。

![點擊左下角的表格圖示以返回](return-to-grouped-dataset.png){width=700}

3. 使用 `aggregate`、`sum`、`maxBy` 和 `flatten` 建立一個 DataFrame，摘要每個頻道的總觀看次數及其最新或觀看次數最多的影片的詳細資訊：

   ```kotlin
   val aggregated = channels.aggregate {
       viewCount.sum() into view
   
       val last = maxBy { publishedAt }
       last.title into "last title"
       last.publishedAt into "time"
       last.viewCount into "viewCount"
       // 按觀看次數將 DataFrame 降序排序，並將其轉換為平面結構。
   }.sortByDesc(view).flatten()
   aggregated
   ```

分析結果：

![分析結果](kotlin-analysis.png){width=700}

有關更進階的技術，請參閱 [Kotlin DataFrame 文件](https://kotlin.github.io/dataframe/home.html)。

## 接下來

* 探索資料視覺化，使用 [Kandy 程式庫](https://kotlin.github.io/kandy/examples.html)
* 在 [使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization.md) 中尋找更多關於資料視覺化的資訊
* 有關 Kotlin 中可用於資料科學和分析的工具和資源的廣泛概述，請參閱 [用於資料分析的 Kotlin 和 Java 程式庫](data-analysis-libraries.md)