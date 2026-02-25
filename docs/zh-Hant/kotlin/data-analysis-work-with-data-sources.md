[//]: # (title: 從檔案獲取資料)

[Kotlin Notebook](kotlin-notebook-overview.md) 結合了 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html)，讓您能夠處理非結構化與結構化資料。這種組合提供了將非結構化資料（例如 TXT 檔案中的資料）轉換為結構化資料集的彈性。

對於資料轉換，您可以使用 [`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) 以及 [`parse`](https://kotlin.github.io/dataframe/parse.html) 等方法。此外，此工具集還能從各種結構化檔案格式中獲取並操作資料，包括 CSV、JSON、XLS、XLSX 和 Apache Arrow。

在本指南中，您可以透過多個範例學習如何獲取、調整與處理資料。

## 開始之前

Kotlin Notebook 仰賴 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設已隨附並啟用於 IntelliJ IDEA 中。

如果 Kotlin Notebook 功能不可用，請確保已啟用該外掛程式。如需更多資訊，請參閱[設定環境](kotlin-notebook-set-up-env.md)。

建立一個新的 Kotlin Notebook：

1. 選取 **File** | **New** | **Kotlin Notebook**。

2. 在 Kotlin Notebook 中，執行以下指令以匯入 Kotlin DataFrame 程式庫：

   ```kotlin
   %use dataframe
   ```

## 從檔案獲取資料

若要在 Kotlin Notebook 中從檔案獲取資料：

1. 打開您的 Kotlin Notebook 檔案 (`.ipynb`)。
2. 在筆記本開頭的程式碼資料格中加入 `%use dataframe` 以匯入 Kotlin DataFrame 程式庫。
   > 在執行任何其他依賴 Kotlin DataFrame 程式庫的程式碼資料格之前，請務必先執行包含 `%use dataframe` 這一行的程式碼資料格。
   >
   {style="note"}

3. 使用 Kotlin DataFrame 程式庫中的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函式來獲取資料。例如，若要讀取 CSV 檔案，請使用：`DataFrame.read("example.csv")`。

`.read()` 函式會根據檔案副檔名和內容自動偵測輸入格式。您還可以加入其他引數來自訂該函式，例如使用 `delimiter = ';'` 指定分隔符號。

> 如需其他檔案格式的全面概覽以及各種讀取函式，請參閱 [Kotlin DataFrame 程式庫文件](https://kotlin.github.io/dataframe/read.html)。
> 
{style="tip"}

## 顯示資料

一旦您[將資料載入筆記本中](#retrieve-data-from-a-file)，就可以輕鬆地將其儲存在變數中，並透過在程式碼資料格中執行以下內容來存取：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

這段程式碼會顯示您所選檔案（例如 CSV、JSON、XLS、XLSX 或 Apache Arrow）中的資料。

![顯示資料](display-data.png){width=700}

若要深入了解資料的結構或架構，請對您的 DataFrame 變數套用 `.schema()` 函式。例如，`dfJson.schema()` 會列出您 JSON 資料集中每個欄位的型別。

![架構範例](schema-data-analysis.png){width=700}

您還可以使用 Kotlin Notebook 中的自動補全功能，快速存取並操作 DataFrame 的屬性。載入資料後，只需輸入 DataFrame 變數後接一個點號，即可查看可用欄位及其型別的清單。

![可用屬性](auto-completion-data-analysis.png){width=700}

## 調整資料

在 Kotlin DataFrame 程式庫提供的各種調整資料集操作中，關鍵範例包括[群組](https://kotlin.github.io/dataframe/group.html)、[篩選](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html)以及[新增欄位](https://kotlin.github.io/dataframe/add.html)。這些函式對於資料分析至關重要，讓您能有效地組織、清理與轉換資料。

讓我們看一個例子，其中資料在同一個資料格中包含了電影標題及其對應的上映年份。目標是調整此資料集以便於分析：

1. 使用 `.read()` 函式將資料載入筆記本。此範例涉及讀取名為 `movies.csv` 的 CSV 檔案，並建立一個名為 `movies` 的 DataFrame：

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 使用正規表示式從電影標題中提取上映年份，並將其作為新欄位新增：

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

3. 透過從每個標題中移除上映年份來修改電影標題。這可以清理標題以保持一致性：

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. 使用 `filter` 方法來專注於特定資料。在此案例中，資料集被篩選為僅關注 1996 年之後上映的電影：

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

作為對照，這是調整前的資料集：

![原始資料集](original-dataset.png){width=700}

調整後的資料集：

![資料調整結果](refined-data.png){width=700}

這是如何使用 Kotlin DataFrame 程式庫的方法（如 `add`、`update` 和 `filter`）在 Kotlin 中有效調整與分析資料的實務演示。

> 如需更多使用案例與詳細範例，請參閱 [Kotlin Dataframe 範例](https://github.com/Kotlin/dataframe/tree/master/examples)。
> 
{style="tip"}

## 儲存 DataFrame

在 Kotlin Notebook 中使用 Kotlin DataFrame 程式庫[調整資料](#refine-data)後，您可以輕鬆地匯出處理後的資料。您可以為此目的利用各種 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函式，這些函式支援儲存為多種格式，包括 CSV、JSON、XLS、XLSX、Apache Arrow，甚至是 HTML 表格。這對於分享您的發現、建立報告或讓您的資料可用於進一步分析特別有用。

以下說明如何篩選 DataFrame、移除欄位、將調整後的資料儲存為 JSON 檔案，以及在瀏覽器中開啟 HTML 表格：

1. 在 Kotlin Notebook 中，使用 `.read()` 函式將名為 `movies.csv` 的檔案載入到名為 `moviesDf` 的 DataFrame 中：

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. 使用 `.filter` 方法篩選 DataFrame，使其僅包含屬於 "Action" 類型的電影：

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. 使用 `.remove` 從 DataFrame 中移除 `movieId` 欄位：

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame 程式庫提供各種寫入函式來以不同格式儲存資料。在此範例中，使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函式將修改後的 `movies.csv` 儲存為 JSON 檔案：

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. 使用 `.toStandaloneHTML()` 函式將 DataFrame 轉換為獨立的 HTML 表格，並在您的預設網頁瀏覽器中開啟它：

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 接續步驟

* 使用 [Kandy 程式庫](https://kotlin.github.io/kandy/examples.html)探索資料視覺化
* 在[使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization.md)中尋找有關資料視覺化的更多資訊
* 如需 Kotlin 中可用於資料科學與分析之工具與資源的廣泛概覽，請參閱 [Kotlin 與 Java 資料分析程式庫](data-analysis-libraries.md)