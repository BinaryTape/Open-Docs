# 在 JVM 上開始使用 SQLite

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

若要在程式碼中使用產生的資料庫，您必須將 SQLDelight SQLite 驅動程式相依性新增至您的專案。

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

驅動程式的執行個體可以依照下方所示進行建構。該建構函式接受一個 JDBC 連線字串，用來指定資料庫檔案的位置。`IN_MEMORY` 常數也可以傳遞給建構函式，以建立記憶體內資料庫。

=== "磁碟上"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver("jdbc:sqlite:test.db", Properties(), Database.Schema)
    ```
=== "記憶體內"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY, Properties(), Database.Schema)
    ```

{% include 'common/index_queries.md' %}