[//]: # (title: 連接資料庫並檢索資料)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供連接到各種類型的 SQL 資料庫（例如 MariaDB、PostgreSQL、MySQL 和 SQLite）並從中檢索資料的功能。
利用 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html)，Kotlin Notebook 可以建立與資料庫的連線、執行 SQL 查詢，並匯入結果以進行後續操作。

如需詳細範例，請參閱 [KotlinDataFrame SQL 範例 GitHub 儲存庫中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 開始之前

Kotlin Notebook 依賴 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設已在 IntelliJ IDEA 中封裝並啟用。

如果 Kotlin Notebook 功能不可用，請確保已啟用該外掛程式。如需更多資訊，請參閱[設定環境](kotlin-notebook-set-up-env.md)。

建立新的 Kotlin Notebook：

1. 選取 **File** | **New** | **Kotlin Notebook**。

2. 確保您可以存取 SQL 資料庫，例如 MariaDB 或 MySQL。

## 連接到資料庫

您可以使用 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html)中的特定函式來連接 SQL 資料庫並與其互動。
您可以使用 `DatabaseConfiguration` 建立與資料庫的連線，並使用 `getSchemaForAllSqlTables()` 檢索其中所有資料表的架構。

讓我們看一個範例：

1. 開啟您的 Kotlin Notebook 檔案 (`.ipynb`)。
2. 新增 JDBC（Java Database Connectivity）驅動程式的相依性，並指定 JDBC 驅動程式版本。
本範例使用 MariaDB：

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 匯入對於資料操作任務至關重要的 Kotlin DataFrame 程式庫，以及用於 SQL 連線和工具函式的必要 Java 程式庫：

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. 使用 `DatabaseConfiguration` 類別定義資料庫的連線參數，包括 URL、使用者名稱和密碼：

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 連線後，使用 `getSchemaForAllSqlTables()` 函式來擷取並顯示資料庫中每個資料表的架構資訊：

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 如需更多關於連接 SQL 資料庫的資訊，請參閱 [Kotlin DataFrame 文件中的從 SQL 資料庫讀取](https://kotlin.github.io/dataframe/readsqldatabases.html)。
   > 
   {style="tip"}

## 檢索並操作資料

[建立與 SQL 資料庫的連線](#連接到資料庫)後，您可以使用 Kotlin DataFrame 程式庫在 Kotlin Notebook 中檢索並操作資料。
您可以使用 `readSqlTable()` 函式來檢索資料。若要操作資料，您可以使用 [`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 和 [`convert`](https://kotlin.github.io/dataframe/convert.html) 等方法。

讓我們看一個連接到 IMDB 資料庫並檢索由 Quentin Tarantino 執導之電影資料的範例：

1. 使用 `readSqlTable()` 函式從 "movies" 資料表中檢索資料，並設定 `limit` 以將查詢限制在首 100 條記錄以提高效率：

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用 SQL 查詢來檢索與 Quentin Tarantino 執導之電影相關的特定資料集。此查詢會選取電影詳情並合併每部電影的類型：

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
   
   // 檢索 Quentin Tarantino 的電影列表，包括其名稱、年份、排名和所有類型的串接字串。
   // 結果按名稱、年份、排名分組，並按年份排序。
   
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

3. 擷取 Tarantino 電影資料集後，您可以進一步操作和篩選資料。

   ```kotlin
   val df = dfTarantinoMovies
       // 將 'year' 欄位中的任何缺失值替換為 0。
       .fillNA { year }.with { 0 }
       
       // 將 'year' 欄位轉換為整數。
       .convert { year }.toInt()
   
       // 篩選資料以僅包含 2000 年之後上映的電影。
       .filter { year > 2000 }
   df
   ```

產出的結果是一個 DataFrame，其中年份欄位的缺失值已使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替換為 0。年份欄位已透過 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法轉換為整數值，並且資料已透過 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法篩選為僅包含 2000 年以後的資料列。

## 在 Kotlin Notebook 中分析資料

[建立與 SQL 資料庫的連線](#連接到資料庫)後，您可以使用 Kotlin Notebook 配合 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html)進行深入的資料分析。這包括分組、排序和聚合資料的函式，幫助您發現並理解資料中的模式。

讓我們深入研究一個範例，該範例涉及分析電影資料庫中的演員資料，重點關注演員最常出現的名字：

1. 使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函式從 "actors" 資料表中擷取資料：

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 處理檢索到的資料以識別前 20 個最常見的演員名字。此分析涉及多個 DataFrame 方法：

   ```kotlin
   val top20ActorNames = actorDf
       // 按 first_name 欄位對資料進行分組，以便根據演員名字進行整理。
      .groupBy { first_name }
   
       // 計算每個唯一名字的出現次數，提供頻率分佈。
      .count()
   
       // 按計數降冪排序結果，以識別最常見的名字。
      .sortByDesc("count")
   
       // 選取前 20 個最頻繁的名字進行分析。
      .take(20)
   top20ActorNames
   ```

## 後續步驟

* 使用 [Kandy 程式庫](https://kotlin.github.io/kandy/examples.html)探索資料視覺化
* 在[使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization.md)中尋找關於資料視覺化的更多資訊
* 如需了解 Kotlin 中可用於資料科學和分析之工具與資源的廣泛概述，請參閱 [Kotlin 和 Java 資料分析程式庫](data-analysis-libraries.md)