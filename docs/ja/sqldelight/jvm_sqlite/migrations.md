{% include 'common/migrations.md' %}

`JdbcSqliteDriver` を使用している場合、ドライバーの作成時にスキーマとコールバックを渡すことができます。
これは `PRAGMA user_version` を使用して、データベースにスキーマの現在のバージョンを保存します。

```kotlin
val driver: SqlDriver = JdbcSqliteDriver(
    url = "jdbc:sqlite:test.db",
    properties = Properties(),
    schema = Database.Schema,
    callbacks = arrayOf(
        AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) }
    )
)
```