[//]: # (title: 连接和检索数据库中的数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了连接各种 SQL 数据库并从中检索数据的功能，例如 MariaDB、PostgreSQL、MySQL 和 SQLite。利用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)，Kotlin Notebook 可以建立数据库连接、执行 SQL 查询并导入结果以进行进一步操作。

有关详细示例，请参阅 [KotlinDataFrame SQL Examples GitHub 仓库中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件默认捆绑并启用在 IntelliJ IDEA 中。

如果 Kotlin Notebook 功能不可用，请确保插件已启用。有关更多信息，请参阅 [设置环境](kotlin-notebook-set-up-env.md)。

创建新的 Kotlin Notebook：

1.  选择 **文件** | **新建** | **Kotlin Notebook**。
2.  确保你拥有一个 SQL 数据库的访问权限，例如 MariaDB 或 MySQL。

## 连接到数据库

你可以使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 中的特定函数连接到 SQL 数据库并与之交互。你可以使用 `DatabaseConfiguration` 来建立与数据库的连接，并使用 `getSchemaForAllSqlTables()` 来检索其中所有表的 schema。

我们来看一个示例：

1.  打开你的 Kotlin Notebook 文件 (`.ipynb`)。
2.  添加 JDBC (Java 数据库连接) 驱动的依赖，并指定 JDBC 驱动版本。本示例使用 MariaDB：

    ```kotlin
    USE {
       dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
    }
    ```

3.  导入 Kotlin DataFrame 库，它对数据操作任务至关重要，同时导入用于 SQL 连接和实用函数的必要 Java 库：

    ```kotlin
    %use dataframe
    import java.sql.DriverManager
    import java.util.*
    ```

4.  使用 `DatabaseConfiguration` 类定义数据库的连接参数，包括 URL、用户名和密码：

    ```kotlin
    val URL = "YOUR_URL"
    val USER_NAME = "YOUR_USERNAME"
    val PASSWORD = "YOUR_PASSWORD"
    
    val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
    ```

5.  连接成功后，使用 `getSchemaForAllSqlTables()` 函数获取并显示数据库中每个表的 schema 信息：

    ```kotlin
    val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
    
    dataschemas.forEach { 
        println("---Yet another table schema---")
        println(it)
        println()
    }
    ```

    > 有关连接到 SQL 数据库的更多信息，请参阅 [Kotlin DataFrame 文档中从 SQL 数据库读取](https://kotlin.github.io/dataframe/readsqldatabases.html)。
    > 
    {style="tip"}

## 检索和操作数据

在 [建立与 SQL 数据库的连接](#connect-to-database) 后，你可以在 Kotlin Notebook 中利用 Kotlin DataFrame 库检索和操作数据。你可以使用 `readSqlTable()` 函数来检索数据。要操作数据，你可以使用诸如 [`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 和 [`convert`](https://kotlin.github.io/dataframe/convert.html) 等方法。

我们来看一个连接到 IMDB 数据库并检索昆汀·塔伦蒂诺执导的电影数据的示例：

1.  使用 `readSqlTable()` 函数从 “movies” 表中检索数据，通过设置 `limit` 将查询限制为前 100 条记录以提高效率：

    ```kotlin
    val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
    ```

2.  使用 SQL 查询检索与昆汀·塔伦蒂诺执导电影相关的特定数据集。此查询选择电影详情并合并每部电影的流派：

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
    
    // Retrieves a list of Quentin Tarantino's movies, including their name, year, rank, and a concatenated string of all genres. 
    // The results are grouped by name, year, rank, and sorted by year.
    
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

3.  获取塔伦蒂诺电影数据集后，你可以进一步操作和筛选数据。

    ```kotlin
    val df = dfTarantinoMovies
        // Replaces any missing values in the 'year' column with 0.
        .fillNA { year }.with { 0 }
        
        // Converts the 'year' column to integers.
        .convert { year }.toInt()
    
        // Filters the data to include only movies released after the year 2000.
        .filter { year > 2000 }
    df
    ```

最终输出是一个 DataFrame，其中 'year' 列中的缺失值使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替换为 0。'year' 列使用 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法转换为整数值，数据使用 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法进行筛选，只包含 2000 年及以后的行。

## 在 Kotlin Notebook 中分析数据

在 [建立与 SQL 数据库的连接](#connect-to-database) 后，你可以使用 Kotlin Notebook 并利用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 进行深入的数据分析。这包括用于对数据进行分组、排序和聚合的函数，帮助你发现和理解数据中的模式。

我们深入研究一个示例，该示例涉及分析电影数据库中的演员数据，重点关注演员名字中出现频率最高的部分：

1.  使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函数从 “actors” 表中提取数据：

    ```kotlin
    val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
    ```

2.  处理检索到的数据以识别前 20 个最常见的演员名字。此分析涉及多种 DataFrame 方法：

    ```kotlin
    val top20ActorNames = actorDf
        // Groups the data by the first_name column to organize it based on actor first names.
       .groupBy { first_name }
    
        // Counts the occurrences of each unique first name, providing a frequency distribution.
       .count()
    
        // Sorts the results in descending order of count to identify the most common names.
       .sortByDesc("count")
    
        // Selects the top 20 most frequent names for analysis.
       .take(20)
    top20ActorNames
    ```

## 接下来

*   使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 探索数据可视化
*   在 [使用 Kandy 在 Kotlin Notebook 中进行数据可视化](data-analysis-visualization.md) 中查找有关数据可视化的更多信息
*   有关 Kotlin 中可用于数据科学和分析的工具和资源的广泛概述，请参阅 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)