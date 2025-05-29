{% include 'common/migrations.md' %}

`AndroidSqliteDriver`를 사용하고 있다면 드라이버 생성 중에 이러한 콜백을 전달할 수 있습니다:

```kotlin
val driver: SqlDriver = AndroidSqliteDriver(
    schema = Database.Schema,
    context = context,
    name = "test.db",
    callback = AndroidSqliteDriver.Callback(
        schema = Database.Schema,
        AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
    )
)
```