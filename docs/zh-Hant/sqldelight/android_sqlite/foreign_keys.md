{% if multiplatform %}
## Android SQLite
{% else %}
# 外部鍵
{% endif %}

您可以透過驅動程式的 `onOpen` 回呼來為 Android SQLite 驅動程式啟用外部鍵約束。

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