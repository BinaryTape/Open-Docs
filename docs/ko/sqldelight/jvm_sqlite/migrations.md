{% include 'common/migrations.md' %}

`JdbcSqliteDriver`를 사용 중이라면 드라이버 생성 시 스키마와 콜백을 전달할 수 있습니다.
이 드라이버는 `PRAGMA user_version`를 사용하여 데이터베이스에 현재 스키마 버전을 저장합니다.

```kotlin
val driver: SqlDriver = JdbcSqliteDriver(
    url = "jdbc:sqlite:test.db",
    properties = Properties(),
    schema = Database.Schema,
    callbacks = arrayOf(
        AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) }
    )
)