# JVM에서 SQLite 시작하기

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

코드에서 생성된 데이터베이스를 사용하려면 프로젝트에 SQLDelight SQLite 드라이버 의존성을 추가해야 합니다.

=== "Kotlin"
    ```groovy
    dependencies {
      implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}"
    }
    ```

드라이버 인스턴스는 아래와 같이 구성할 수 있습니다. 생성자는 데이터베이스 파일의 위치를 지정하는 JDBC 연결 문자열을 받습니다. `IN_MEMORY` 상수를 생성자에 전달하여 인메모리 데이터베이스를 생성할 수도 있습니다.

=== "On-Disk"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver("jdbc:sqlite:test.db", Properties(), Database.Schema)
    ```
=== "In-Memory"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY, Properties(), Database.Schema)
    ```

{% include 'common/index_queries.md' %}