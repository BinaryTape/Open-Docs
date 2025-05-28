{% if multiplatform %}
## JVM SQLite
{% else %}
# 外部キー
{% endif %}
JVM SQLiteドライバーでは、ドライバーのプロパティに設定を渡すことで、外部キー制約を有効にできます。

```kotlin
JdbcSqliteDriver(
  url = "...", 
  properties = Properties().apply { put("foreign_keys", "true") }
)
```