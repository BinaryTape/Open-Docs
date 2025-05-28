{% if multiplatform %}
## AndroidのSQLite
{% else %}
# 外部キー
{% endif %}

Android SQLiteドライバーでは、ドライバーの `onOpen` コールバックを介して外部キー制約を有効にできます。

```kotlin
AndroidSqliteDriver(
  schema = Database.Schema,
  callback = object : AndroidSqliteDriver.Callback(Database.Schema) {
    override fun onOpen(db: SupportSQLiteDatabase) {
      db.setForeignKeyConstraintsEnabled(true)
    }
  }
)