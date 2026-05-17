[//]: # (title: 連接資料庫並檢索資料)
[//]: # (description: 了解如何連接 SQL 資料庫、檢查資料表架構，以及使用 Kotlin DataFrame 檢索資料。)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供對最常用 SQL 資料庫的支援：

* [DuckDB](https://kotlin.github.io/dataframe/duckdb.html)
* [H2](https://kotlin.github.io/dataframe/h2.html)
* [MariaDB](https://kotlin.github.io/dataframe/mariadb.html)
* [Microsoft SQL Server](https://kotlin.github.io/dataframe/microsoft-sql-server.html)
* [MySQL](https://kotlin.github.io/dataframe/mysql.html)
* [PostgreSQL](https://kotlin.github.io/dataframe/postgresql.html)
* [SQLite](https://kotlin.github.io/dataframe/sqlite.html)

利用 [Kotlin DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html)，Kotlin Notebook 可以建立與資料庫的連線、執行 SQL 查詢，並匯入結果以進行後續操作。

> 如需詳細範例，請參閱 [KotlinDataFrame SQL 範例 GitHub 儲存庫中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。
>
{style="tip"}

## 開始之前

Kotlin Notebook 依賴 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，該外掛程式預設已在 IntelliJ IDEA 中封裝並啟用。

如果 Kotlin Notebook 功能不可用，請確保已啟用該外掛程式。如需更多資訊，請參閱[設定環境](kotlin-notebook-set-up-env.md)。

若要依照本教學進行：
1. 建立[新的 Kotlin Notebook](kotlin-notebook-create.md)。
2. 在 Notebook 的第一個程式碼資料格中，新增適用於您資料庫的 Java 資料庫連接 (JDBC) 驅動程式相依性。
   
   例如，若要連接到 MariaDB 資料庫，請新增：

   ```kotlin 
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```
3. 匯入 Kotlin DataFrame：

   ```kotlin
   %use dataframe
   ```

> 在執行任何其他程式碼資料格之前，請先執行包含 `%use dataframe` 行的程式碼資料格，以確保 DataFrame 程式庫及其 API 在 Notebook 中可用。
>
{style="note"}

## 連接到資料庫

若要連接到資料庫，請使用 `DbConnectionConfig()` 函式建立連線組態：

1. 匯入以下功能：
   
   ```kotlin
   import org.jetbrains.kotlinx.dataframe.io.DbConnectionConfig
   import org.jetbrains.kotlinx.dataframe.schema.DataFrameSchema
   ```

2. 使用 `DbConnectionConfig()` 函式定義連線參數（URL、使用者名稱、密碼）：

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DbConnectionConfig(URL, USER_NAME, PASSWORD)
   ```

> 如需更多關於連接 SQL 資料庫的資訊，請參閱 [Kotlin DataFrame 文件中的從 SQL 資料庫讀取](https://kotlin.github.io/dataframe/readsqldatabases.html)。
>
{style="tip"}

## 檢查資料庫架構

在載入資料之前，請檢查資料庫架構，以了解您擁有哪些資料表以及其中包含哪些欄位。您可以使用架構來決定要將哪個資料表載入到 DataFrame 中。

若要檢索資料庫中所有使用者建立之資料表的架構，請使用 `DataFrameSchema.readAllSqlTables()` 函式：

```kotlin
val dataSchemas = DataFrameSchema.readAllSqlTables(dbConfig)

dataSchemas.forEach { (tableName, schema) ->
    println("---Schema for table: $tableName---")
    println(schema)
    println()
}
```

## 載入資料

在檢查資料庫架構並選取資料後，將資料載入到 DataFrame 中。

Kotlin DataFrame 提供兩種從資料庫載入資料的方式：

* 直接從資料表載入資料。
* 載入自訂 SQL 查詢的結果。

這兩種方法都會傳回一個 DataFrame，您可以在 Kotlin Notebook 中對其進行檢查、轉換和分析。

### 從資料表載入資料

若要從資料表載入資料，請使用 [`DataFrame.readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函式。

以下範例從 `movies` 資料表中載入前 100 列：

```kotlin
val moviesDf = DataFrame.readSqlTable(
    dbConfig = dbConfig,
    tableName = "movies",
    limit = 100
)

moviesDf
```

### 使用 SQL 查詢載入資料

若要在資料庫上執行特定的 SQL 查詢，請使用 [`DataFrame.readSqlQuery()`](https://kotlin.github.io/dataframe/readsqldatabases.html#executing-sql-queries) 函式。當您需要在資料庫中載入特定欄位、聯結資料表、篩選資料列或聚合資料時，此方法非常有用。

讓我們檢索一個與 Quentin Tarantino 執導之電影相關的特定資料集。此查詢會選取電影詳情並合併每部電影的類型：

```kotlin
val TARANTINO_FILMS_SQL_QUERY = """
    SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
    FROM movies JOIN movies_directors ON movie_id = movies.id
    JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
    WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
    GROUP BY name, year, rank
    ORDER BY year
    """

val tarantinoMoviesDf = DataFrame.readSqlQuery(dbConfig, TARANTINO_FILMS_SQL_QUERY)

tarantinoMoviesDf
```

## 處理資料

將資料庫載入到 DataFrame 後，您可以使用 DataFrame 操作來處理檢索到的資料。

例如，讓我們操作上一節中的資料。以下程式碼：
1. 使用 [`.fillNA()`](https://kotlin.github.io/dataframe/fill.html#fillna) 函式替換 `year` 欄位中的缺失值。
2. 使用 [`.convert()`](https://kotlin.github.io/dataframe/convert.html) 函式將該欄位轉換為 `Int`。
3. 使用 [`.filter()`](https://kotlin.github.io/dataframe/filter.html) 函式僅保留 2000 年以後上映的電影。

```kotlin
val filteredTarantinoMovies = tarantinoMoviesDf
    .fillNA { year }.with { 0 }
    .convert { year }.toInt()
    .filter { year > 2000 }

filteredTarantinoMovies
```

## 分析資料

使用 [Kotlin Notebook](kotlin-notebook-overview.md) 和 [DataFrame 程式庫](https://kotlin.github.io/dataframe/home.html)對資料進行分組、排序和聚合，以便發現並理解資料中的模式。

例如，讓我們從 `actors` 資料表中讀取演員資料，並找出 20 個最常見的名字：

```kotlin
// 從 actors 資料表中擷取資料
val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
val top20ActorNames = actorDf
   // 按 first_name 欄位對資料進行分組
   .groupBy { first_name }
   
   // 計算每個唯一名字的出現次數
   .count()
   
    // 按計數降冪排序結果
   .sortByDesc("count")
    
   // 選取前 20 個最頻繁的名字進行分析。
   .take(20)
```

## 後續步驟

* 使用 [Kandy 程式庫](https://kotlin.github.io/kandy/examples.html)探索資料視覺化
* 在[使用 Kandy 在 Kotlin Notebook 中進行資料視覺化](data-analysis-visualization.md)中尋找關於資料視覺化的更多資訊
* 如需了解 Kotlin 中可用於資料科學和分析之工具與資源的廣泛概述，請參閱 [Kotlin 和 Java 資料分析程式庫](data-analysis-libraries.md)