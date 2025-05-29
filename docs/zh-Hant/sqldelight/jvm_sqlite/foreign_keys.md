{% if multiplatform %}
## JVM SQLite
{% else %}
# 外部索引鍵
{% endif %}
您可以透過將設定傳遞給驅動程式的屬性，為 JVM SQLite 驅動程式啟用外部索引鍵約束。

```kotlin
JdbcSqliteDriver(
  url = "...", 
  properties = Properties().apply { put("foreign_keys", "true") }
)
```