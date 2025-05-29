[//]: # (title: 從檔案擷取資料)

[Kotlin Notebook](kotlin-notebook-overview.md) 結合了 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html)，讓您能夠處理非結構化資料和結構化資料。這種組合提供了靈活性，可以將非結構化資料 (例如 TXT 檔案中的資料) 轉換為結構化資料集。

對於資料轉換，您可以使用諸如 [`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) 和 [`parse`](https://kotlin.github.io/dataframe/parse.html) 等方法。此外，這套工具還能從各種結構化檔案格式 (包括 CSV、JSON、XLS、XLSX 和 Apache Arrow) 中擷取和操作資料。

在本指南中，您將透過多個範例學習如何擷取、精煉和處理資料。

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設捆綁並啟用於 IntelliJ IDEA 中。

如果 Kotlin Notebook 功能不可用，請確保該外掛程式已啟用。如需更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1. 選擇 **檔案** | **新增** | **Kotlin Notebook**。
2. 在 Kotlin Notebook 中，執行以下命令來匯入 Kotlin DataFrame 函式庫：

   ```kotlin
   %use dataframe
   ```

## 從檔案擷取資料

若要在 Kotlin Notebook 中從檔案擷取資料：

1. 開啟您的 Kotlin Notebook 檔案 (`.ipynb`)。
2. 在 Notebook 開頭的程式碼儲存格中加入 `%use dataframe` 以匯入 Kotlin DataFrame 函式庫。
   > 請務必在執行任何其他依賴於 Kotlin DataFrame 函式庫的程式碼儲存格之前，先執行包含 `%use dataframe` 的程式碼儲存格。
   >
   {style="note"}

3. 使用 Kotlin DataFrame 函式庫中的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函數來擷取資料。例如，要讀取 CSV 檔案，請使用：`DataFrame.read("example.csv")`。

`.read()` 函數會根據檔案副檔名和內容自動偵測輸入格式。您還可以新增其他引數來自訂函數，例如使用 `delimiter = ';'` 指定分隔符號。

> 如需其他檔案格式和各種讀取函數的全面概述，請參閱 [Kotlin DataFrame 函式庫文件](https://kotlin.github.io/dataframe/read.html)。
> 
{style="tip"}

## 顯示資料

一旦您在 Notebook 中擁有資料後，您可以輕鬆地將其儲存到變數中，並透過在程式碼儲存格中執行以下內容來存取它：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

這段程式碼會顯示您選擇的檔案中的資料，例如 CSV、JSON、XLS、XLSX 或 Apache Arrow。

![顯示資料](display-data.png){width=700}

為了深入了解資料的結構或綱要 (Schema)，請在您的 DataFrame 變數上應用 `.schema()` 函數。例如，`dfJson.schema()` 會列出您的 JSON 資料集中每個欄位的類型。

![綱要範例](schema-data-analysis.png){width=700}

您還可以使用 Kotlin Notebook 中的自動完成功能，快速存取和操作 DataFrame 的屬性。載入資料後，只需輸入 DataFrame 變數，然後跟隨一個點，即可查看可用欄位及其類型列表。

![可用屬性](auto-completion-data-analysis.png){width=700}

## 精煉資料

在 Kotlin DataFrame 函式庫中用於精煉資料集的各種操作中，主要範例包括 [分組](https://kotlin.github.io/dataframe/group.html)、[過濾](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html) 和 [新增欄位](https://kotlin.github.io/dataframe/add.html)。這些函數對於資料分析至關重要，可讓您有效地組織、清理和轉換資料。

讓我們來看一個範例，其中資料包含電影標題及其對應的發行年份，兩者位於同一個儲存格中。目標是精煉此資料集以便於分析：

1. 使用 `.read()` 函數將資料載入到 Notebook 中。此範例涉及從名為 `movies.csv` 的 CSV 檔案讀取資料並建立一個名為 `movies` 的 DataFrame：

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 使用正規表達式從電影標題中提取發行年份，並將其作為新欄位新增：

   ```kotlin
   val moviesWithYear = movies
       .add("year") { 
           "\\d{4}".toRegex()
               .findAll(title)
               .lastOrNull()
               ?.value
               ?.toInt()
               ?: -1
       }
   ```

3. 透過從每個標題中移除發行年份來修改電影標題。這可以清理標題以保持一致性：

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. 使用 `filter` 方法專注於特定資料。在此情況下，資料集被過濾以專注於 1996 年之後發行的電影：

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

供比較，以下是精煉前的資料集：

![原始資料集](original-dataset.png){width=700}

精煉後的資料集：

![資料精煉結果](refined-data.png){width=700}

這實際演示了如何使用 Kotlin DataFrame 函式庫的方法，例如 `add`、`update` 和 `filter`，來有效地在 Kotlin 中精煉和分析資料。

> 如需更多使用案例和詳細範例，請參閱 [Kotlin Dataframe 範例](https://github.com/Kotlin/dataframe/tree/master/examples)。
> 
{style="tip"}

## 儲存 DataFrame

在 Kotlin Notebook 中使用 Kotlin DataFrame 函式庫 [精煉資料](#refine-data) 後，您可以輕鬆地匯出處理後的資料。為此，您可以使用各種 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函數，這些函數支援以多種格式儲存，包括 CSV、JSON、XLS、XLSX、Apache Arrow，甚至是 HTML 表格。這對於分享您的發現、建立報告或讓資料可用於進一步分析特別有用。

以下是如何過濾 DataFrame、移除欄位、將精煉後的資料儲存到 JSON 檔案以及在瀏覽器中開啟 HTML 表格的方法：

1. 在 Kotlin Notebook 中，使用 `.read()` 函數將名為 `movies.csv` 的檔案載入到名為 `moviesDf` 的 DataFrame 中：

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. 使用 `.filter` 方法過濾 DataFrame，使其僅包含屬於「動作」類型的電影：

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. 使用 `.remove` 從 DataFrame 中移除 `movieId` 欄位：

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame 函式庫提供了各種寫入函數，用於以不同格式儲存資料。在此範例中，使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函數將修改後的 `movies.csv` 儲存為 JSON 檔案：

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. 使用 `.toStandaloneHTML()` 函數將 DataFrame 轉換為獨立 HTML 表格並在您的預設網頁瀏覽器中開啟它：

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 接下來

* 使用 [Kandy 函式庫](https://kotlin.github.io/kandy/examples.html) 探索資料視覺化
* 在 [使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization.md) 中找到有關資料視覺化的更多資訊
* 如需 Kotlin 中可用於資料科學和分析的工具和資源的廣泛概述，請參閱 [用於資料分析的 Kotlin 和 Java 函式庫](data-analysis-libraries.md)