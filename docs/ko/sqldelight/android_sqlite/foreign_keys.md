{% if multiplatform %}
## Android SQLite
{% else %}
# 외래 키
{% endif %}

드라이버의 `onOpen` 콜백을 통해 Android SQLite 드라이버에 대한 외래 키 제약 조건을 활성화할 수 있습니다.

```kotlin
AndroidSqliteDriver(
  schema = Database.Schema,
  callback = object : AndroidSqliteDriver.Callback(Database.Schema) {
    override fun onOpen(db: SupportSQLiteDatabase) {
      db.setForeignKeyConstraintsEnabled(true)
    }
  }
)
```