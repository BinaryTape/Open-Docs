{% include 'common/migrations.md' %}

如果你正在使用 `JdbcSqliteDriver`，你可以在驱动程序创建期间传入 `schema` 和 `callbacks`。
它使用 `PRAGMA user_version` 在数据库中存储当前的 `schema` 版本。

```kotlin
val driver: SqlDriver = JdbcSqliteDriver(
    url = "jdbc:sqlite:test.db",
    properties = Properties(),
    schema = Database.Schema,
    callbacks = arrayOf(
        AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) }
    )
)