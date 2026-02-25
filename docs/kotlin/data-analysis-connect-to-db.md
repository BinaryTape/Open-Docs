[//]: # (title: 连接数据库并获取数据)

[Kotlin Notebook](kotlin-notebook-overview.md)提供了连接各种类型的SQL数据库并从中获取数据的功能，例如MariaDB、PostgreSQL、MySQL和SQLite。利用[Kotlin DataFrame库](https://kotlin.github.io/dataframe/home.html)，Kotlin Notebook可以建立数据库连接、执行SQL查询并导入结果以进行后续操作。

有关详细示例，请参阅[KotlinDataFrame SQL示例GitHub仓库中的Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)。

## 开始之前

Kotlin Notebook依赖于[Kotlin Notebook插件](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，该插件在IntelliJ IDEA中默认捆绑并启用。

如果Kotlin Notebook功能不可用，请确保已启用该插件。要了解更多信息，请参阅[设置环境](kotlin-notebook-set-up-env.md)。

创建一个新的Kotlin Notebook：

1. 选择**File** | **New** | **Kotlin Notebook**。

2. 确保您可以访问SQL数据库，例如MariaDB或MySQL。

## 连接数据库

您可以使用[Kotlin DataFrame库](https://kotlin.github.io/dataframe/home.html)中的特定函数连接SQL数据库并与之交互。您可以使用`DatabaseConfiguration`建立数据库连接，并使用`getSchemaForAllSqlTables()`获取其中所有表的架构。

让我们来看一个示例：

1. 打开您的Kotlin Notebook文件 (`.ipynb`)。
2. 添加JDBC（Java Database Connectivity）驱动程序依赖项，并指定JDBC驱动程序版本。本示例使用MariaDB：

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 导入Kotlin DataFrame库（这对于数据操作任务至关重要），以及必要的SQL连接Java库和工具函数： 

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. 使用`DatabaseConfiguration`类定义数据库的连接参数，包括URL、用户名和密码：

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 连接成功后，使用`getSchemaForAllSqlTables()`函数获取并显示数据库中每个表的架构信息：

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 有关连接SQL数据库的更多信息，请参阅[Kotlin DataFrame文档中的从SQL数据库读取](https://kotlin.github.io/dataframe/readsqldatabases.html)。
   > 
   {style="tip"}

## 获取并操作数据

在[建立数据库连接](#connect-to-database)后，您可以利用Kotlin DataFrame库在Kotlin Notebook中获取和操作数据。您可以使用`readSqlTable()`函数来获取数据。要操作数据，您可以使用[`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)和[`convert`](https://kotlin.github.io/dataframe/convert.html)等方法。 

让我们看一个连接到IMDB数据库并获取Quentin Tarantino导演的电影数据的示例：

1. 使用`readSqlTable()`函数从"movies"表中获取数据，设置`limit`以将查询限制为前100条记录以提高效率：

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用SQL查询获取与Quentin Tarantino导演的电影相关的特定数据集。此查询选择电影详细信息并合并每部电影的类型：

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
   
   // 获取Quentin Tarantino的电影列表，包括名称、年份、评分以及所有类型的串联字符串。 
   // 结果按名称、年份、评分分组，并按年份排序。
   
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

3. 获取Tarantino电影数据集后，您可以进一步操作和筛选数据。

   ```kotlin
   val df = dfTarantinoMovies
       // 将'year'列中任何缺失的值替换为0。
       .fillNA { year }.with { 0 }
       
       // 将'year'列转换为整数。
       .convert { year }.toInt()
   
       // 筛选数据以仅包含2000年以后上映的电影。
       .filter { year > 2000 }
   df
   ```

最终输出是一个DataFrame，其中使用[`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna)方法将年份列中的缺失值替换为0。年份列通过[`convert`](https://kotlin.github.io/dataframe/convert.html)方法转换为整数值，并使用[`filter`](https://kotlin.github.io/dataframe/filter.html)方法筛选数据以仅包含2000年及以后的行。

## 在Kotlin Notebook中分析数据

在[建立数据库连接](#connect-to-database)后，您可以利用[Kotlin DataFrame库](https://kotlin.github.io/dataframe/home.html)在Kotlin Notebook中进行深入的数据分析。这包括用于分组、排序和聚合数据的函数，帮助您发现并理解数据中的模式。

让我们深入研究一个涉及分析电影数据库中演员数据的示例，重点关注最常出现的演员名：

1. 使用[`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables)函数从"actors"表中提取数据：

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 处理获取的数据以识别前20个最常见的演员名。此分析涉及多个DataFrame方法：

   ```kotlin
   val top20ActorNames = actorDf
       // 按first_name列对数据进行分组，以根据演员的名字组织数据。
      .groupBy { first_name }
   
       // 计算每个唯一名字的出现次数，提供频率分布。
      .count()
   
       // 按次数降序对结果进行排序，以识别最常见的名字。
      .sortByDesc("count")
   
       // 选择出现频率最高的前20个名字进行分析。
      .take(20)
   top20ActorNames
   ```

## 下一步

* 使用[Kandy库](https://kotlin.github.io/kandy/examples.html)探索数据可视化
* 在[使用Kandy在Kotlin Notebook中进行数据可视化](data-analysis-visualization.md)中查找有关数据可视化的更多信息
* 有关Kotlin中可用于数据科学和分析的工具和资源的广泛概述，请参阅[用于数据分析的Kotlin和Java库](data-analysis-libraries.md)