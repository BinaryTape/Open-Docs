[//]: # (title: 데이터베이스 연결 및 데이터 가져오기)

[Kotlin Notebook](kotlin-notebook-overview.md)은 MariaDB, PostgreSQL, MySQL, SQLite와 같은 다양한 유형의 SQL 데이터베이스에 연결하고 데이터를 가져오는 기능을 제공합니다.
[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/home.html)를 활용하면 Kotlin Notebook에서 데이터베이스 연결을 설정하고, SQL 쿼리를 실행하며, 이후 작업을 위해 결과를 가져올 수 있습니다.

자세한 예제는 [KotlinDataFrame SQL Examples GitHub 저장소의 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)을 참조하세요.

## 시작하기 전에

Kotlin Notebook은 [Kotlin Notebook 플러그인](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)에 의존하며, 이 플러그인은 IntelliJ IDEA에 기본적으로 포함되어 활성화되어 있습니다.

Kotlin Notebook 기능을 사용할 수 없는 경우 플러그인이 활성화되어 있는지 확인하세요. 자세한 내용은 [환경 설정](kotlin-notebook-set-up-env.md)을 참조하세요.

새 Kotlin Notebook을 생성합니다:

1. **File** | **New** | **Kotlin Notebook**을 선택합니다.

2. MariaDB나 MySQL과 같은 SQL 데이터베이스에 접근할 수 있는지 확인합니다.

## 데이터베이스 연결

[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/home.html)의 특정 함수를 사용하여 SQL 데이터베이스에 연결하고 상호작용할 수 있습니다.
`DatabaseConfiguration`을 사용하여 데이터베이스 연결을 설정하고, `getSchemaForAllSqlTables()`를 사용하여 데이터베이스 내의 모든 테이블 스키마(schema)를 가져올 수 있습니다.

예제를 살펴보겠습니다:

1. Kotlin Notebook 파일(`.ipynb`)을 엽니다.
2. JDBC(Java Database Connectivity) 드라이버에 대한 의존성을 추가하고 JDBC 드라이버 버전을 지정합니다.
이 예제에서는 MariaDB를 사용합니다:

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 데이터 조작 작업에 필수적인 Kotlin DataFrame 라이브러리와 SQL 연결 및 유틸리티 함수에 필요한 Java 라이브러리를 임포트(import)합니다:

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. `DatabaseConfiguration` 클래스를 사용하여 URL, 사용자 이름, 비밀번호를 포함한 데이터베이스 연결 파라미터를 정의합니다:

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 연결이 완료되면 `getSchemaForAllSqlTables()` 함수를 사용하여 데이터베이스의 각 테이블에 대한 스키마 정보를 가져와 표시합니다:

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > SQL 데이터베이스 연결에 대한 자세한 내용은 [Kotlin DataFrame 문서의 Read from SQL databases](https://kotlin.github.io/dataframe/readsqldatabases.html)를 참조하세요.
   > 
   {style="tip"}

## 데이터 가져오기 및 조작

[SQL 데이터베이스 연결을 설정](#데이터베이스-연결)한 후에는 Kotlin DataFrame 라이브러리를 사용하여 Kotlin Notebook에서 데이터를 가져오고 조작할 수 있습니다.
`readSqlTable()` 함수를 사용하여 데이터를 가져올 수 있으며, 데이터를 조작하기 위해 [`filter`](https://kotlin.github.io/dataframe/filter.html), [`groupBy`](https://kotlin.github.io/dataframe/groupby.html), [`convert`](https://kotlin.github.io/dataframe/convert.html)와 같은 메서드를 사용할 수 있습니다.

IMDB 데이터베이스에 연결하여 쿠엔틴 타란티노(Quentin Tarantino)가 감독한 영화 데이터를 가져오는 예제를 살펴보겠습니다:

1. `readSqlTable()` 함수를 사용하여 "movies" 테이블에서 데이터를 가져옵니다. 효율성을 위해 `limit`를 설정하여 쿼리 결과를 첫 100개 레코드로 제한합니다:

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. SQL 쿼리를 사용하여 쿠엔틴 타란티노가 감독한 영화와 관련된 특정 데이터셋을 가져옵니다. 이 쿼리는 영화 상세 정보를 선택하고 각 영화의 장르를 결합합니다:

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
   
   // 쿠엔틴 타란티노의 영화 목록(이름, 연도, 순위, 모든 장르가 결합된 문자열 포함)을 가져옵니다.
   // 결과는 이름, 연도, 순위별로 그룹화되고 연도순으로 정렬됩니다.
   
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
       // 'year' 컬럼의 누락된 값을 0으로 대체합니다.
       .fillNA { year }.with { 0 }
       
       // 'year' 컬럼을 정수형(Int)으로 변환합니다.
       .convert { year }.toInt()
   
       // 2000년 이후에 개봉된 영화만 포함하도록 데이터를 필터링합니다.
       .filter { year > 2000 }
   df
   ```

결과 출력은 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 메서드를 사용하여 year 컬럼의 누락된 값을 0으로 대체하고, [`convert`](https://kotlin.github.io/dataframe/convert.html) 메서드로 year 컬럼을 정수 값으로 변환하며, [`filter`](https://kotlin.github.io/dataframe/filter.html) 메서드를 사용하여 2000년 이후의 행만 포함하도록 필터링된 DataFrame입니다.

## Kotlin Notebook에서 데이터 분석

[SQL 데이터베이스 연결을 설정](#데이터베이스-연결)한 후, [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/home.html)를 활용하여 Kotlin Notebook에서 심층적인 데이터 분석을 수행할 수 있습니다. 여기에는 데이터 그룹화, 정렬, 집계 함수가 포함되어 데이터 내의 패턴을 발견하고 이해하는 데 도움을 줍니다.

영화 데이터베이스에서 배우 데이터를 분석하여 가장 자주 등장하는 배우의 이름을 찾는 예제를 살펴보겠습니다:

1. [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 함수를 사용하여 "actors" 테이블에서 데이터를 추출합니다:

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 가져온 데이터를 처리하여 가장 흔한 배우 이름 상위 20개를 식별합니다. 이 분석에는 여러 DataFrame 메서드가 사용됩니다:

   ```kotlin
   val top20ActorNames = actorDf
       // 배우 이름을 기준으로 정리하기 위해 first_name 컬럼으로 데이터를 그룹화합니다.
      .groupBy { first_name }
   
       // 각 고유한 이름의 발생 횟수를 계산하여 빈도 분포를 제공합니다.
      .count()
   
       // 가장 흔한 이름을 식별하기 위해 개수(count)를 기준으로 내림차순 정렬합니다.
      .sortByDesc("count")
   
       // 분석을 위해 상위 20개의 빈번한 이름을 선택합니다.
      .take(20)
   top20ActorNames
   ```

## 다음 단계

* [Kandy 라이브러리](https://kotlin.github.io/kandy/examples.html)를 사용한 데이터 시각화 탐색
* [Data visualization in Kotlin Notebook with Kandy](data-analysis-visualization.md)에서 데이터 시각화에 대한 추가 정보 찾기
* Kotlin에서 데이터 과학 및 분석에 사용할 수 있는 도구와 리소스에 대한 광범위한 개요는 [Kotlin and Java libraries for data analysis](data-analysis-libraries.md)를 참조하세요.