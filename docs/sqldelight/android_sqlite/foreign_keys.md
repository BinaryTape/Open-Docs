{% if multiplatform %}
## Android SQLite
{% else %}
# 外键
{% endif %}

您可以通过驱动程序的 `onOpen` 回调，为 Android SQLite 驱动程序启用外键约束。

```kotlin
AndroidSqliteDriver(
  schema = Database.Schema,
  callback = object : AndroidSqliteDriver.Callback(Database.Schema) {
    override fun onOpen(db: SupportSQLiteDatabase) {
      db.setForeignKeyConstraintsEnabled(true)
    }
  }
)