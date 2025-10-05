[//]: # (title: 從檔案擷取資料)

[Kotlin Notebook](kotlin-notebook-overview.md)，結合 [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html)，使您能夠處理非結構化和結構化資料。這種組合提供了將非結構化資料 (例如 TXT 檔案中的資料) 轉換為結構化資料集的靈活性。

對於資料轉換，您可以使用諸如 [`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) 和 [`parse`](https://kotlin.github.io/dataframe/parse.html) 等方法。此外，此工具集還能從各種結構化檔案格式 (包括 CSV、JSON、XLS、XLSX 和 Apache Arrow) 中擷取和操作資料。

在本指南中，您將透過多個範例學習如何擷取、精煉和處理資料。

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設在 IntelliJ IDEA 中捆綁並啟用。

如果 Kotlin Notebook 功能不可用，請確保外掛程式已啟用。如需更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1. 選取 **File** | **New** | **Kotlin Notebook**。
2. 在 Kotlin Notebook 中，透過執行以下命令匯入 Kotlin DataFrame library：

   ```kotlin
   %use dataframe
   ```

## 從檔案擷取資料

若要在 Kotlin Notebook 中從檔案擷取資料：

1. 開啟您的 Kotlin Notebook 檔案（`.ipynb`）。
2. 在您的筆記本開頭的程式碼儲存格中新增 `%use dataframe`，以匯入 Kotlin DataFrame library。
   > 確保在執行任何其他依賴於 Kotlin DataFrame library 的程式碼儲存格之前，先執行包含 `%use dataframe` 行的程式碼儲存格。
   >
   {style="note"}

3. 使用 Kotlin DataFrame library 的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函式來擷取資料。例如，要讀取 CSV 檔案，請使用：`DataFrame.read("example.csv")`。

`.read()` 函式會根據檔案副檔名和內容自動偵測輸入格式。您也可以新增其他引數來自訂函式，例如使用 `delimiter = ';'` 指定分隔符號。

> 如需其他檔案格式和各種讀取函式的全面概述，請參閱 [Kotlin DataFrame library 文件](https://kotlin.github.io/dataframe/read.html)。
> 
{style="tip"}

## 顯示資料

一旦您 [在您的筆記本中擁有資料](#retrieve-data-from-a-file)，您就可以輕鬆地將其儲存在變數中，並透過在程式碼儲存格中執行以下內容來存取它：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

此程式碼會顯示您選擇的檔案中的資料，例如 CSV、JSON、XLS、XLSX 或 Apache Arrow。

![顯示資料](display-data.png){width=700}

若要深入了解資料的結構或結構描述，請在您的 DataFrame 變數上套用 `.schema()` 函式。例如，`dfJson.schema()` 會列出您的 JSON 資料集中每個欄位的類型。

![結構描述範例](schema-data-analysis.png){width=700}

您還可以使用 Kotlin Notebook 中的自動補齊功能，快速存取和操作 DataFrame 的屬性。載入資料後，只需輸入 DataFrame 變數，後面接著一個點，即可查看可用欄位及其類型的列表。

![可用屬性](auto-completion-data-analysis.png){width=700}

## 精煉資料

在 Kotlin DataFrame library 中用於精煉資料集的各種操作中，主要範例包括 [分組](https://kotlin.github.io/dataframe/group.html)、[篩選](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html) 和 [新增欄位](https://kotlin.github.io/dataframe/add.html)。這些函式對於資料分析至關重要，可讓您有效地組織、清理和轉換資料。

讓我們看一個範例，其中資料包含電影標題及其對應的發行年份在同一個儲存格中。目標是精煉此資料集以便於分析：

1. 使用 `.read()` 函式將資料載入到筆記本中。此範例涉及從名為 `movies.csv` 的 CSV 檔案中讀取資料並建立一個名為 `movies` 的 DataFrame：

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 使用正規表達式從電影標題中提取發行年份，並將其新增為一個新欄位：

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

3. 透過從每個標題中移除發行年份來修改電影標題。這會清理標題以保持一致性：

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. 使用 `filter` 方法專注於特定資料。在此範例中，資料集被篩選以專注於 1996 年之後發行的電影：

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

為了比較，以下是精煉前的資料集：

![原始資料集](original-dataset.png){width=700}

精煉後的資料集：

![資料精煉結果](refined-data.png){width=700}

這是一個實際的演示，說明了您如何在 Kotlin 中使用 Kotlin DataFrame library 的方法 (例如 `add`、`update` 和 `filter`) 來有效地精煉和分析資料。

> 如需其他使用案例和詳細範例，請參閱 [Examples of Kotlin Dataframe](https://github.com/Kotlin/dataframe/tree/master/examples)。
> 
{style="tip"}

## 儲存 DataFrame

在 Kotlin Notebook 中使用 Kotlin DataFrame library [精煉資料](#refine-data) 後，您可以輕鬆地匯出您處理過的資料。為此，您可以使用各種 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函式，它們支援以多種格式儲存，包括 CSV、JSON、XLS、XLSX、Apache Arrow，甚至是 HTML 表格。這對於分享您的發現、建立報告或使您的資料可用於進一步分析特別有用。

以下是您可以如何篩選 DataFrame、移除欄位、將精煉後的資料儲存到 JSON 檔案，以及在您的瀏覽器中開啟 HTML 表格：

1. 在 Kotlin Notebook 中，使用 `.read()` 函式將名為 `movies.csv` 的檔案載入到名為 `moviesDf` 的 DataFrame 中：

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. 使用 `.filter` 方法篩選 DataFrame，使其只包含屬於「動作」類型的電影：

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. 使用 `.remove` 從 DataFrame 中移除 `movieId` 欄位：

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame library 提供了各種寫入函式，可以以不同格式儲存資料。在此範例中，使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函式將修改後的 `movies.csv` 儲存為 JSON 檔案：

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. 使用 `.toStandaloneHTML()` 函式將 DataFrame 轉換為獨立的 HTML 表格，並在您的預設網頁瀏覽器中開啟它：

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 接下來

* 使用 [Kandy library](https://kotlin.github.io/kandy/examples.html) 探索資料視覺化
* 在 [Data visualization in Kotlin Notebook with Kandy](data-analysis-visualization.md) 中尋找有關資料視覺化的更多資訊
* 如需 Kotlin 中可用於資料科學和分析的工具和資源的廣泛概述，請參閱 [Kotlin and Java libraries for data analysis](data-analysis-libraries.md)