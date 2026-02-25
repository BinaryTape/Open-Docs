# SQLite JVM 入门

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

要在代码中使用生成的数据库，必须将 SQLDelight SQLite 驱动程序依赖项添加到项目中。

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

驱动程序的实例可以按如下方式构造。构造函数接受一个 JDBC 连接字符串，该字符串用于指定数据库文件的位置。也可以将 `IN_MEMORY` 常量传递给构造函数以创建内存数据库。

=== "磁盘"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver("jdbc:sqlite:test.db", Properties(), Database.Schema)
    ```
=== "内存中"
    ```kotlin
    val driver: SqlDriver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY, Properties(), Database.Schema)
    ```

{% include 'common/index_queries.md' %}