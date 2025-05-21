---
title: 连接数据库并从中检索数据
---
[Kotlin Notebook](kotlin-notebook-overview) 提供了连接和检索来自各种 SQL 数据库（例如 MariaDB、PostgreSQL、MySQL 和 SQLite）的数据的功能。通过使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)，Kotlin Notebook 可以建立与数据库的连接，执行 SQL 查询，并导入结果以进行进一步操作。

有关详细示例，请参见 [KotlinDataFrame SQL Examples GitHub 仓库中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)。
2. 在 IntelliJ IDEA 中安装 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)。

   > 或者，从 IntelliJ IDEA 中的 **Settings（设置）** | **Plugins（插件）** | **Marketplace（市场）** 访问 Kotlin Notebook 插件。
   >
   

3. 通过选择 **File（文件）** | **New（新建）** | **Kotlin Notebook** 创建一个新的 Kotlin Notebook。
4. 确保您可以访问 SQL 数据库，例如 MariaDB 或 MySQL。

## 连接到数据库

您可以使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 中的特定函数连接到 SQL 数据库并与之交互。您可以使用 `DatabaseConfiguration` 建立与数据库的连接，并使用 `getSchemaForAllSqlTables()` 检索其中所有表的 schema（模式）。

让我们看一个例子：

1. 打开您的 Kotlin Notebook 文件 (`.ipynb`)。
2. 添加 JDBC (Java Database Connectivity) driver（驱动）的 dependency（依赖项），并指定 JDBC driver（驱动）版本。此示例使用 MariaDB：

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 导入 Kotlin DataFrame 库（这对于数据操作任务至关重要），以及用于 SQL 连接和实用函数的必要 Java 库：

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. 使用 `DatabaseConfiguration` 类来定义数据库的连接参数，包括 URL、username（用户名）和 password（密码）：

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 连接后，使用 `getSchemaForAllSqlTables()` 函数来获取并显示数据库中每个表的 schema（模式）信息：

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 有关连接到 SQL 数据库的更多信息，请参见 [Kotlin DataFrame 文档中的 Read from SQL databases（从 SQL 数据库读取）](https://kotlin.github.io/dataframe/readsqldatabases.html)。
   > 
   

## 检索和操作数据

在 [建立与 SQL 数据库的连接](#connect-to-database) 之后，您可以在 Kotlin Notebook 中检索和操作数据，使用 Kotlin DataFrame 库。您可以使用 `readSqlTable()` 函数检索数据。要操作数据，您可以使用诸如 [`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 和 [`convert`](https://kotlin.github.io/dataframe/convert.html) 之类的方法。

让我们看一个连接到 IMDB 数据库并检索有关 Quentin Tarantino 导演的电影数据的示例：

1. 使用 `readSqlTable()` 函数从 "movies" table（表）检索数据，设置 `limit` 以将查询限制为前 100 条记录，以提高效率：

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用 SQL query（查询）检索与 Quentin Tarantino 导演的电影相关的特定 dataset（数据集）。此 query（查询）选择电影详细信息并合并每部电影的 genres（类型）：

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

3. 获取 Tarantino 电影 dataset（数据集）后，您可以进一步操作和筛选数据。

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

结果输出是一个 DataFrame，其中 year column（列）中的任何 missing value（缺失值）都使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替换为 0。year column（列）使用 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法转换为 integer value（整数值），并且使用 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法筛选数据以仅包含 2000 年之后的行。

## 在 Kotlin Notebook 中分析数据

在 [建立与 SQL 数据库的连接](#connect-to-database) 之后，您可以使用 Kotlin Notebook 进行深入的数据分析，利用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)。这包括用于分组、排序和聚合数据的函数，帮助您发现和理解数据中的模式。

让我们深入研究一个示例，该示例涉及分析电影数据库中的 actor（演员）数据，重点关注 actor（演员）最常出现的 first name（名字）：

1. 使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函数从 "actors" table（表）中提取数据：

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 处理检索到的数据，以识别前 20 个最常见的 actor（演员） first name（名字）。此分析涉及几个 DataFrame 方法：

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

## 接下来做什么

* 使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 探索数据可视化
* 在 [使用 Kandy 在 Kotlin Notebook 中进行数据可视化](data-analysis-visualization) 中查找有关数据可视化的更多信息
* 有关 Kotlin 中可用于数据科学和分析的工具和资源的全面概述，请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries)