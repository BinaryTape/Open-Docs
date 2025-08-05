[//]: # (title: 連接並從資料庫擷取資料)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了連接和從各種 SQL 資料庫（例如 MariaDB、PostgreSQL、MySQL 和 SQLite）擷取資料的功能。利用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html)，Kotlin Notebook 可以建立與資料庫的連接、執行 SQL 查詢，並匯入結果以進行後續操作。

如需詳細範例，請參閱 [KotlinDataFrame SQL 範例 GitHub 儲存庫中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 開始之前

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設情況下在 IntelliJ IDEA 中捆綁並啟用。

如果 Kotlin Notebook 功能不可用，請確保外掛程式已啟用。如需更多資訊，請參閱 [設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1. 選擇 **檔案** | **新增** | **Kotlin Notebook**。
2. 確保您可以存取 SQL 資料庫，例如 MariaDB 或 MySQL。

## 連接資料庫

您可以使用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 中的特定函式來連接和與 SQL 資料庫互動。您可以使用 `DatabaseConfiguration` 建立與資料庫的連接，並使用 `getSchemaForAllSqlTables()` 擷取其中所有資料表的綱要。

讓我們看一個範例：

1. 開啟您的 Kotlin Notebook 檔案 (`.ipynb`)。
2. 新增 JDBC (Java 資料庫連接) 驅動程式的依賴項，並指定 JDBC 驅動程式版本。此範例使用 MariaDB：

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 匯入 Kotlin DataFrame 函式庫，這對於資料操作任務至關重要，同時匯入 SQL 連接和實用功能所需的 Java 函式庫：

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. 使用 `DatabaseConfiguration` 類別定義資料庫的連接參數，包括 URL、使用者名稱和密碼：

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 連接後，使用 `getSchemaForAllSqlTables()` 函式擷取並顯示資料庫中每個資料表的綱要資訊：

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 如需更多關於連接 SQL 資料庫的資訊，請參閱 [Kotlin DataFrame 文件中的「從 SQL 資料庫讀取」](https://kotlin.github.io/dataframe/readsqldatabases.html)。
   > 
   {style="tip"}

## 擷取和操作資料

在 [建立與 SQL 資料庫的連接](#connect-to-database) 後，您可以使用 Kotlin Notebook 擷取和操作資料，並利用 Kotlin DataFrame 函式庫。您可以使用 `readSqlTable()` 函式擷取資料。要操作資料，您可以使用諸如 [`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 和 [`convert`](https://kotlin.github.io/dataframe/convert.html) 等方法。

讓我們看一個連接到 IMDB 資料庫並擷取昆汀·塔倫提諾導演電影資料的範例：

1. 使用 `readSqlTable()` 函式從「movies」資料表擷取資料，並設定 `limit` 以限制查詢只讀取前 100 筆記錄，以提高效率：

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用 SQL 查詢擷取與昆汀·塔倫提諾導演電影相關的特定資料集。此查詢選取電影詳細資訊並組合每部電影的類型：

   ```kotlin
   val props = Properties()
   props.setProperty("user", USER_NAME)
   props.setProperty("password", PASSWORD)
   
   val TARANTINO_FILMS_SQL_QUERY = """
       SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
       FROM movies JOIN movies_directors ON movie_id = movies.id
       JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
       WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
       GROUP BY name, year, rank
       ORDER BY year
       """
   
   // 擷取昆汀·塔倫提諾的電影列表，包括其名稱、年份、排名以及所有類型的串聯字串。結果按名稱、年份、排名分組，並按年份排序。
   
   var dfTarantinoMovies: DataFrame<*>
   
   DriverManager.getConnection(URL, props).use { connection ->
      connection.createStatement().use { st ->
         st.executeQuery(TARANTINO_FILMS_SQL_QUERY).use { rs ->
            val dfTarantinoFilmsSchema = DataFrame.getSchemaForResultSet(rs, connection)
            dfTarantinoFilmsSchema.print()
   
            dfTarantinoMovies = DataFrame.readResultSet(rs, connection)
            dfTarantinoMovies
         }
      }
   }
   ```

3. 擷取塔倫提諾電影資料集後，您可以進一步操作和篩選資料。

   ```kotlin
   val df = dfTarantinoMovies
       // 將「year」欄位中的任何缺失值替換為 0。
       .fillNA { year }.with { 0 }
       
       // 將「year」欄位轉換為整數。
       .convert { year }.toInt()
   
       // 過濾資料以僅包含 2000 年之後發行的電影。
       .filter { year > 2000 }
   df
   ```

最終輸出的結果是一個 DataFrame，其中「year」欄位中的缺失值使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替換為 0。 「year」欄位使用 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法轉換為整數值，並且資料使用 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法過濾為僅包含 2000 年及之後的資料列。

## 在 Kotlin Notebook 中分析資料

在 [建立與 SQL 資料庫的連接](#connect-to-database) 後，您可以使用 Kotlin Notebook 進行深度資料分析，並利用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html)。這包括用於分組、排序和聚合資料的函式，幫助您揭示和理解資料中的模式。

讓我們深入探討一個範例，該範例涉及分析電影資料庫中的演員資料，重點關注演員最常見的名字：

1. 使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函式從「actors」資料表擷取資料：

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 處理擷取的資料以識別前 20 個最常見的演員名字。此分析涉及多種 DataFrame 方法：

   ```kotlin
   val top20ActorNames = actorDf
       // 根據 first_name 欄位對資料進行分組，以根據演員名字進行組織。
      .groupBy { first_name }
   
       // 計算每個唯一名字的出現次數，提供頻率分佈。
      .count()
   
       // 按計數的降序對結果進行排序，以識別最常見的名稱。
      .sortByDesc("count")
   
       // 選取前 20 個最常見的名稱進行分析。
      .take(20)
   top20ActorNames
   ```

## 下一步

* 探索使用 [Kandy 函式庫](https://kotlin.github.io/kandy/examples.html) 進行資料視覺化
* 在 [使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization.md) 中找到有關資料視覺化的更多資訊
* 如需有關 Kotlin 中用於資料科學和分析的工具和資源的廣泛概述，請參閱 [Kotlin 和 Java 資料分析函式庫](data-analysis-libraries.md)