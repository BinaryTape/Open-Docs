---
title: 連接資料庫並從中檢索資料
---
[Kotlin Notebook](kotlin-notebook-overview) 提供連接和檢索來自各種類型 SQL 資料庫（如 MariaDB、PostgreSQL、MySQL 和 SQLite）資料的功能。
透過使用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html)，Kotlin Notebook 可以建立到資料庫的連線、執行 SQL 查詢，並匯入結果以進行後續操作。

如需詳細範例，請參閱 [KotlinDataFrame SQL Examples GitHub 儲存庫中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 開始之前

1. 下載並安裝最新版本的 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)。
2. 在 IntelliJ IDEA 中安裝 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)。

   > 或者，從 IntelliJ IDEA 中的 **Settings**（設定）| **Plugins**（插件）| **Marketplace**（市場）存取 Kotlin Notebook 插件。
   >
   

3. 選擇 **File**（檔案）| **New**（新增）| **Kotlin Notebook** 來建立新的 Kotlin Notebook。
4. 確保您可以存取 SQL 資料庫，例如 MariaDB 或 MySQL。

## 連接到資料庫

您可以使用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html) 中的特定函式連接到 SQL 資料庫並與之互動。
您可以使用 `DatabaseConfiguration` 建立與資料庫的連線，並使用 `getSchemaForAllSqlTables()` 檢索其中所有資料表的結構描述 (schema)。

讓我們看一個範例：

1. 開啟您的 Kotlin Notebook 檔案 (`.ipynb`)。
2. 為 JDBC (Java Database Connectivity) 驅動程式新增依賴項，並指定 JDBC 驅動程式版本。
此範例使用 MariaDB：

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 導入 Kotlin DataFrame 函式庫，這對於資料操作任務至關重要，以及 SQL 連線和公用函式所需的 Java 函式庫：

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

5. 連線後，使用 `getSchemaForAllSqlTables()` 函式獲取並顯示資料庫中每個資料表的結構描述資訊：

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 有關連接到 SQL 資料庫的更多資訊，請參閱 [Kotlin DataFrame 文件中的從 SQL 資料庫讀取](https://kotlin.github.io/dataframe/readsqldatabases.html)。
   > 
   

## 檢索和操作資料

[建立到 SQL 資料庫的連線](#connect-to-database)後，您可以在 Kotlin Notebook 中檢索和操作資料，並使用 Kotlin DataFrame 函式庫。
您可以使用 `readSqlTable()` 函式來檢索資料。 要操作資料，您可以使用 [`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 和 [`convert`](https://kotlin.github.io/dataframe/convert.html) 等方法。

讓我們看一個連接到 IMDB 資料庫並檢索有關昆汀·塔倫提諾 (Quentin Tarantino) 執導的電影的資料範例：

1. 使用 `readSqlTable()` 函式從 "movies" 資料表中檢索資料，並設定 `limit` 以將查詢限制為前 100 條記錄，以提高效率：

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用 SQL 查詢來檢索與昆汀·塔倫提諾 (Quentin Tarantino) 執導的電影相關的特定資料集。
此查詢選擇電影詳細資訊並組合每部電影的類型 (genre)：

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
   
   // 檢索昆汀·塔倫提諾 (Quentin Tarantino) 的電影清單，包括它們的名稱、年份、排名和所有類型的串連字串。
   // 結果按名稱、年份、排名分組，並按年份排序。
   
   var dfTarantinoMovies: DataFrame<*>
   
   DriverManager.getConnection(URL, props).use { connection `->`
      connection.createStatement().use { st `->`
         st.executeQuery(TARANTINO_FILMS_SQL_QUERY).use { rs `->`
            val dfTarantinoFilmsSchema = DataFrame.getSchemaForResultSet(rs, connection)
            dfTarantinoFilmsSchema.print()
   
            dfTarantinoMovies = DataFrame.readResultSet(rs, connection)
            dfTarantinoMovies
         }
      }
   }
   ```

3. 獲取塔倫提諾 (Tarantino) 電影資料集後，您可以進一步操作和篩選資料。

   ```kotlin
   val df = dfTarantinoMovies
       // 將 'year' 欄位中的任何遺失值替換為 0。
       .fillNA { year }.with { 0 }
       
       // 將 'year' 欄位轉換為整數。
       .convert { year }.toInt()
   
       // 篩選資料以僅包含 2000 年之後發布的電影。
       .filter { year > 2000 }
   df
   ```

結果輸出是一個 DataFrame，其中 year 欄位中的遺失值會使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替換為 0。年份欄位使用 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法轉換為整數值，並且使用 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法篩選資料以僅包含 2000 年之後的列。

## 在 Kotlin Notebook 中分析資料

[建立到 SQL 資料庫的連線](#connect-to-database)後，您可以使用 Kotlin Notebook 進行深入的資料分析，並使用 [Kotlin DataFrame 函式庫](https://kotlin.github.io/dataframe/gettingstarted.html)。 這包括對資料進行分組、排序和彙總的函式，有助於您發現和理解資料中的模式。

讓我們深入研究一個範例，該範例涉及分析電影資料庫中的演員資料，重點關注演員最常出現的名字：

1. 使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函式從 "actors" 資料表中提取資料：

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 處理檢索到的資料以識別前 20 個最常見的演員名字。 此分析涉及多種 DataFrame 方法：

   ```kotlin
   val top20ActorNames = actorDf
       // 按 first_name 欄位對資料進行分組，以根據演員名字組織資料。
      .groupBy { first_name }
   
       // 計算每個唯一名字的出現次數，提供頻率分佈。
      .count()
   
       // 按計數的降序對結果進行排序，以識別最常見的名稱。
      .sortByDesc("count")
   
       // 選擇前 20 個最常見的名字以進行分析。
      .take(20)
   top20ActorNames
   ```

## 接下來

* 使用 [Kandy 函式庫](https://kotlin.github.io/kandy/examples.html) 探索資料視覺化
* 在 [使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization) 中尋找有關資料視覺化的其他資訊
* 如需 Kotlin 中可用於資料科學和分析的工具和資源的廣泛概述，請參閱 [用於資料分析的 Kotlin 和 Java 函式庫](data-analysis-libraries)