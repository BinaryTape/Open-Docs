{% include 'common/migrations.md' %}

如果您正在使用 `JdbcSqliteDriver`，您可以在驅動程式建立期間傳遞 schema 和回呼。
它使用 `PRAGMA user_version` 在資料庫中儲存 schema 的當前版本。

```kotlin
val driver: SqlDriver = JdbcSqliteDriver(
    url = "jdbc:sqlite:test.db",
    properties = Properties(),
    schema = Database.Schema,
    callbacks = arrayOf(
        AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) }
    )
)