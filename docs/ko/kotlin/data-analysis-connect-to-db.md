[//]: # (title: 데이터베이스에 연결하고 데이터 검색하기)

[Kotlin Notebook](kotlin-notebook-overview.md)은 MariaDB, PostgreSQL, MySQL, SQLite와 같은 다양한 유형의 SQL 데이터베이스에 연결하고 데이터를 검색하는 기능을 제공합니다. [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)를 활용하여 Kotlin Notebook은 데이터베이스 연결을 설정하고, SQL 쿼리를 실행하며, 결과를 가져와 추가 작업을 수행할 수 있습니다.

자세한 예시는 [KotlinDataFrame SQL 예시 GitHub 저장소의 노트북](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)을 참조하세요.

## 시작하기 전에

Kotlin Notebook은 기본적으로 IntelliJ IDEA에 번들로 제공되며 활성화되어 있는 [Kotlin Notebook 플러그인](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)에 의존합니다.

Kotlin Notebook 기능이 제공되지 않는 경우, 플러그인이 활성화되어 있는지 확인하세요. 자세한 내용은 [환경 설정하기](kotlin-notebook-set-up-env.md)를 참조하세요.

새 Kotlin Notebook 만들기:

1. **파일** | **새로 만들기** | **Kotlin Notebook**을 선택합니다.
2. MariaDB 또는 MySQL과 같은 SQL 데이터베이스에 대한 접근 권한이 있는지 확인하세요.

## 데이터베이스에 연결

[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)의 특정 함수를 사용하여 SQL 데이터베이스에 연결하고 상호 작용할 수 있습니다. `DatabaseConfiguration`을 사용하여 데이터베이스에 연결을 설정하고 `getSchemaForAllSqlTables()`를 사용하여 그 안에 있는 모든 테이블의 스키마를 검색할 수 있습니다.

예시를 살펴보겠습니다:

1. Kotlin Notebook 파일(`.ipynb`)을 엽니다.
2. JDBC(Java Database Connectivity) 드라이버에 대한 종속성을 추가하고, JDBC 드라이버 버전을 지정합니다. 이 예시에서는 MariaDB를 사용합니다:

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 데이터 조작 작업에 필수적인 Kotlin DataFrame 라이브러리와 SQL 연결 및 유틸리티 함수에 필요한 Java 라이브러리를 함께 임포트합니다:

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. `DatabaseConfiguration` 클래스를 사용하여 URL, 사용자 이름, 비밀번호를 포함한 데이터베이스의 연결 매개변수를 정의합니다:

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 연결되면 `getSchemaForAllSqlTables()` 함수를 사용하여 데이터베이스의 각 테이블에 대한 스키마 정보를 가져와 표시합니다:

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > SQL 데이터베이스 연결에 대한 자세한 내용은 [Kotlin DataFrame 문서의 SQL 데이터베이스에서 읽기](https://kotlin.github.io/dataframe/readsqldatabases.html)를 참조하세요.
   >
   {style="tip"}

## 데이터 검색 및 조작

[SQL 데이터베이스에 연결](#connect-to-database)한 후, Kotlin DataFrame 라이브러리를 활용하여 Kotlin Notebook에서 데이터를 검색하고 조작할 수 있습니다. `readSqlTable()` 함수를 사용하여 데이터를 검색할 수 있습니다. 데이터를 조작하려면 [`filter`](https://kotlin.github.io/dataframe/filter.html), [`groupBy`](https://kotlin.github.io/dataframe/groupby.html), [`convert`](https://kotlin.github.io/dataframe/convert.html)와 같은 메서드를 사용할 수 있습니다.

IMDB 데이터베이스에 연결하고 쿠엔틴 타란티노 감독의 영화에 대한 데이터를 검색하는 예시를 살펴보겠습니다:

1. `readSqlTable()` 함수를 사용하여 "movies" 테이블에서 데이터를 검색하고, 효율성을 위해 쿼리를 처음 100개 레코드로 제한하도록 `limit`를 설정합니다:

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. SQL 쿼리를 사용하여 쿠엔틴 타란티노 감독 영화와 관련된 특정 데이터셋을 검색합니다. 이 쿼리는 영화 세부 정보를 선택하고 각 영화의 장르를 결합합니다:

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

3. 타란티노 영화 데이터셋을 가져온 후, 데이터를 추가로 조작하고 필터링할 수 있습니다.

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

결과 출력은 `year` 열의 누락된 값은 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 메서드를 사용하여 0으로 대체되고, `year` 열은 [`convert`](https://kotlin.github.io/dataframe/convert.html) 메서드를 사용하여 정수 값으로 변환되며, 데이터는 [`filter`](https://kotlin.github.io/dataframe/filter.html) 메서드를 사용하여 2000년 이후의 행만 포함하도록 필터링된 DataFrame입니다.

## Kotlin Notebook에서 데이터 분석

[SQL 데이터베이스에 연결](#connect-to-database)한 후, [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)를 활용하여 Kotlin Notebook을 심층 데이터 분석에 사용할 수 있습니다. 여기에는 데이터 그룹화, 정렬 및 집계 기능이 포함되어 데이터 내의 패턴을 발견하고 이해하는 데 도움이 됩니다.

영화 데이터베이스에서 배우 데이터를 분석하고 배우의 가장 자주 나타나는 이름에 초점을 맞추는 예시를 자세히 살펴보겠습니다:

1. [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 함수를 사용하여 "actors" 테이블에서 데이터를 추출합니다:

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 검색된 데이터를 처리하여 가장 일반적인 배우 이름 상위 20개를 식별합니다. 이 분석에는 여러 DataFrame 메서드가 포함됩니다:

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

## 다음 단계

* [Kandy 라이브러리](https://kotlin.github.io/kandy/examples.html)를 사용하여 데이터 시각화 탐색
* [Kandy를 사용한 Kotlin Notebook의 데이터 시각화](data-analysis-visualization.md)에서 데이터 시각화에 대한 추가 정보 찾기
* Kotlin에서 데이터 과학 및 분석에 사용할 수 있는 도구 및 리소스에 대한 포괄적인 개요는 [데이터 분석을 위한 Kotlin 및 Java 라이브러리](data-analysis-libraries.md)를 참조하세요.