---
title: "데이터베이스에서 연결하고 데이터를 검색합니다."
---
[Kotlin Notebook](kotlin-notebook-overview)은 MariaDB, PostgreSQL, MySQL, SQLite와 같은 다양한 유형의 SQL 데이터베이스에 연결하고 데이터를 검색하는 기능을 제공합니다.
[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)를 활용하여 Kotlin Notebook은 데이터베이스에 연결하고 SQL 쿼리를 실행하며 추가 작업을 위해 결과를 가져올 수 있습니다.

자세한 예는 [KotlinDataFrame SQL Examples GitHub 저장소의 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)을 참조하세요.

## 시작하기 전에

1. 최신 버전의 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)를 다운로드하여 설치합니다.
2. IntelliJ IDEA에 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)을 설치합니다.

   > 또는 IntelliJ IDEA 내에서 **Settings** | **Plugins** | **Marketplace**에서 Kotlin Notebook plugin에 액세스합니다.
   >
   

3. **File** | **New** | **Kotlin Notebook**을 선택하여 새 Kotlin Notebook을 만듭니다.
4. MariaDB 또는 MySQL과 같은 SQL 데이터베이스에 대한 액세스 권한이 있는지 확인합니다.

## 데이터베이스에 연결

[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)의 특정 함수를 사용하여 SQL 데이터베이스에 연결하고 상호 작용할 수 있습니다.
`DatabaseConfiguration`을 사용하여 데이터베이스에 대한 연결을 설정하고 `getSchemaForAllSqlTables()`를 사용하여 데이터베이스 내의 모든 테이블의 스키마를 검색할 수 있습니다.

예제를 살펴보겠습니다.

1. Kotlin Notebook 파일(`.ipynb`)을 엽니다.
2. JDBC (Java Database Connectivity) 드라이버에 대한 종속성을 추가하고 JDBC 드라이버 버전을 지정합니다.
이 예제에서는 MariaDB를 사용합니다.

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 데이터 조작 작업에 필수적인 Kotlin DataFrame 라이브러리와 함께 SQL 연결 및 유틸리티 함수에 필요한 Java 라이브러리를 가져옵니다.

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. `DatabaseConfiguration` 클래스를 사용하여 URL, 사용자 이름 및 비밀번호를 포함하여 데이터베이스의 연결 매개변수를 정의합니다.

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 연결되면 `getSchemaForAllSqlTables()` 함수를 사용하여 데이터베이스의 각 테이블에 대한 스키마 정보를 가져와서 표시합니다.

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > SQL 데이터베이스 연결에 대한 자세한 내용은 [Kotlin DataFrame documentation의 SQL 데이터베이스에서 읽기](https://kotlin.github.io/dataframe/readsqldatabases.html)를 참조하세요.
   > 
   

## 데이터 검색 및 조작

[SQL 데이터베이스에 연결](#connect-to-database)한 후 Kotlin DataFrame 라이브러리를 활용하여 Kotlin Notebook에서 데이터를 검색하고 조작할 수 있습니다.
`readSqlTable()` 함수를 사용하여 데이터를 검색할 수 있습니다. 데이터를 조작하려면 [`filter`](https://kotlin.github.io/dataframe/filter.html), [`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 및 [`convert`](https://kotlin.github.io/dataframe/convert.html)와 같은 메서드를 사용할 수 있습니다.

IMDB 데이터베이스에 연결하고 Quentin Tarantino가 감독한 영화에 대한 데이터를 검색하는 예제를 살펴보겠습니다.

1. `readSqlTable()` 함수를 사용하여 "movies" 테이블에서 데이터를 검색하고 효율성을 위해 쿼리를 처음 100개의 레코드로 제한하도록 `limit`를 설정합니다.

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. SQL 쿼리를 사용하여 Quentin Tarantino가 감독한 영화와 관련된 특정 데이터 세트를 검색합니다.
이 쿼리는 영화 세부 정보를 선택하고 각 영화의 장르를 결합합니다.

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
   
   // Quentin Tarantino의 영화 목록을 검색합니다. 여기에는 이름, 연도, 순위 및 모든 장르의 연결된 문자열이 포함됩니다.
   // 결과는 이름, 연도, 순위별로 그룹화되고 연도별로 정렬됩니다.
   
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

3. Tarantino 영화 데이터 세트를 가져온 후 데이터를 추가로 조작하고 필터링할 수 있습니다.

   ```kotlin
   val df = dfTarantinoMovies
       // 'year' 열의 누락된 값을 0으로 바꿉니다.
       .fillNA { year }.with { 0 }
       
       // 'year' 열을 정수로 변환합니다.
       .convert { year }.toInt()
   
       // 2000년 이후에 개봉된 영화만 포함하도록 데이터를 필터링합니다.
       .filter { year > 2000 }
   df
   ```

결과 출력은 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 메서드를 사용하여 연도 열의 누락된 값이 0으로 대체된 DataFrame입니다. 연도 열은 [`convert`](https://kotlin.github.io/dataframe/convert.html) 메서드를 사용하여 정수 값으로 변환되고 데이터는 [`filter`](https://kotlin.github.io/dataframe/filter.html) 메서드를 사용하여 2000년 이후의 행만 포함하도록 필터링됩니다.

## Kotlin Notebook에서 데이터 분석

[SQL 데이터베이스에 연결](#connect-to-database)한 후 [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)를 활용하여 Kotlin Notebook을 사용하여 심층적인 데이터 분석을 수행할 수 있습니다. 여기에는 데이터를 그룹화, 정렬 및 집계하는 기능이 포함되어 있어 데이터 내에서 패턴을 발견하고 이해하는 데 도움이 됩니다.

배우의 가장 자주 발생하는 이름을 중심으로 영화 데이터베이스의 배우 데이터를 분석하는 예제를 살펴보겠습니다.

1. [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 함수를 사용하여 "actors" 테이블에서 데이터를 추출합니다.

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 검색된 데이터를 처리하여 상위 20개의 가장 일반적인 배우 이름을 식별합니다. 이 분석에는 여러 DataFrame 메서드가 포함됩니다.

   ```kotlin
   val top20ActorNames = actorDf
       // actor 이름에 따라 데이터를 구성하기 위해 first_name 열별로 데이터를 그룹화합니다.
      .groupBy { first_name }
   
       // 각 고유한 이름의 발생 횟수를 계산하여 빈도 분포를 제공합니다.
      .count()
   
       // 가장 일반적인 이름을 식별하기 위해 개수의 내림차순으로 결과를 정렬합니다.
      .sortByDesc("count")
   
       // 분석을 위해 상위 20개의 가장 빈번한 이름을 선택합니다.
      .take(20)
   top20ActorNames
   ```

## 다음 단계

* [Kandy 라이브러리](https://kotlin.github.io/kandy/examples.html)를 사용하여 데이터 시각화를 탐색합니다.
* [Kotlin Notebook에서 Kandy를 사용한 데이터 시각화](data-analysis-visualization)에서 데이터 시각화에 대한 추가 정보를 찾습니다.
* Kotlin의 데이터 과학 및 분석에 사용할 수 있는 도구 및 리소스에 대한 광범위한 개요는 [데이터 분석을 위한 Kotlin 및 Java 라이브러리](data-analysis-libraries)를 참조하세요.