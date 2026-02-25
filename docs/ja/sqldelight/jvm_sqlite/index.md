# JVMでSQLiteを使用する

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

生成されたデータベースをコードで使用するには、SQLDelight SQLiteドライバの依存関係をプロジェクトに追加する必要があります。

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

ドライバのインスタンスは、以下のように作成できます。コンストラクタは、データベースファイルの場所を指定するJDBC接続文字列を受け取ります。また、`IN_MEMORY` 定数をコンストラクタに渡して、インメモリデータベースを作成することもできます。

=== "ディスク"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver("jdbc:sqlite:test.db", Properties(), Database.Schema)
    ```
=== "インメモリ"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY, Properties(), Database.Schema)
    ```

{% include 'common/index_queries.md' %}