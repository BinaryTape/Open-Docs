[//]: # (title: 连接并从数据库检索数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了连接并从各种类型的 SQL 数据库（例如 MariaDB、PostgreSQL、MySQL 和 SQLite）检索数据的功能。
利用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)，Kotlin Notebook 可以建立数据库连接、执行 SQL 查询，并导入结果以进行后续操作。

有关详细示例，请参见 [KotlinDataFrame SQL Examples GitHub 版本库中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 开始之前

Kotlin Notebook 依赖于 [Kotlin Notebook 插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件在 IntelliJ IDEA 中默认捆绑并启用。

如果 Kotlin Notebook 特性不可用，请确保该插件已启用。有关更多信息，请参见 [设置环境](kotlin-notebook-set-up-env.md)。

创建一个新的 Kotlin Notebook：

1. 选择 **文件** | **新建** | **Kotlin Notebook**。
2. 请确保您有权访问 SQL 数据库，例如 MariaDB 或 MySQL。

## 连接数据库

您可以使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 中的特定函数连接并与 SQL 数据库交互。
您可以使用 `DatabaseConfiguration` 建立与数据库的连接，并使用 `getSchemaForAllSqlTables()` 检索其中所有表的 schema。

我们来看一个示例：

1. 打开您的 Kotlin Notebook 文件 (`.ipynb`)。
2. 添加 JDBC (Java Database Connectivity) 驱动的依赖项，并指定 JDBC 驱动版本。
此示例使用 MariaDB：

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 导入 Kotlin DataFrame 库（这对于数据操作任务至关重要），以及用于 SQL 连接和工具函数的必要 Java 库：

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. 使用 `DatabaseConfiguration` 类定义您的数据库连接参数，包括 URL、用户名和密码：

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"

   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 连接后，使用 `getSchemaForAllSqlTables()` 函数获取并显示数据库中每个表的 schema 信息：

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)

   dataschemas.forEach {
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 有关连接 SQL 数据库的更多信息，请参见 [Kotlin DataFrame 文档中关于从 SQL 数据库读取数据的内容](https://kotlin.github.io/dataframe/readsqldatabases.html)。
   >
   {style="tip"}

## 检索和操作数据

在[建立与 SQL 数据库的连接](#connect-to-database)后，您可以在 Kotlin Notebook 中利用 Kotlin DataFrame 库检索和操作数据。
您可以使用 `readSqlTable()` 函数检索数据。要操作数据，您可以使用诸如 [`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 和 [`convert`](https://kotlin.github.io/dataframe/convert.html) 等方法。

我们来看一个连接 IMDB 数据库并检索由昆汀·塔伦蒂诺执导的电影数据的示例：

1. 使用 `readSqlTable()` 函数从 "movies" 表检索数据，设置 `limit` 来限制查询到前 100 条记录以提高效率：

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用 SQL 查询检索与昆汀·塔伦蒂诺执导的电影相关的特定数据集。此查询选择电影详细信息并合并每部电影的类型：

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

   // 检索昆汀·塔伦蒂诺的电影列表，包括它们的名称、年份、排名以及所有类型的连接字符串。
   // 结果按名称、年份、排名分组，并按年份排序。

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

3. 获取塔伦蒂诺电影数据集后，您可以进一步操作和筛选数据。

   ```kotlin
   val df = dfTarantinoMovies
       // 将 'year' 列中的所有缺失值替换为 0。
       .fillNA { year }.with { 0 }

       // 将 'year' 列转换为整数。
       .convert { year }.toInt()

       // 筛选数据，仅包含 2000 年之后上映的电影。
       .filter { year > 2000 }
   df
   ```

结果输出是一个 DataFrame，其中 `year` 列中的缺失值使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替换为 0。`year` 列使用 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法转换为整数值，数据使用 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法筛选为仅包含 2000 年及以后的行。

## 在 Kotlin Notebook 中分析数据

在[建立与 SQL 数据库的连接](#connect-to-database)后，您可以使用 Kotlin Notebook 进行深入的数据分析，利用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html)。这包括对数据进行分组、排序和聚合的函数，帮助您发现并理解数据中的模式。

我们深入研究一个示例，该示例涉及分析电影数据库中的演员数据，重点关注最常出现的演员名字：

1. 使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函数从 "actors" 表中提取数据：

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 处理检索到的数据，以识别出前 20 个最常见的演员名字。此分析涉及多种 DataFrame 方法：

   ```kotlin
   val top20ActorNames = actorDf
       // 按 first_name 列对数据进行分组，以便根据演员名字进行组织。
      .groupBy { first_name }

       // 计算每个唯一名字的出现次数，提供频率分布。
      .count()

       // 按计数降序排列结果，以识别最常见的名字。
      .sortByDesc("count")

       // 选择前 20 个最常出现的名称进行分析。
      .take(20)
   top20ActorNames
   ```

## 接下来

* 探索使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 在 [使用 Kandy 在 Kotlin Notebook 中进行数据可视化](data-analysis-visualization.md) 中查找有关数据可视化的更多信息
* 有关可用于 Kotlin 中的数据科学和分析的工具和资源的广泛概述，请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)