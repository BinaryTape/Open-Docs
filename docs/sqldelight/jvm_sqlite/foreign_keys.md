{% if multiplatform %}
## JVM SQLite
{% else %}
# 外键
{% endif %}
你可以通过将该设置传递给驱动的属性，来为 JVM SQLite 驱动启用外键约束。

```kotlin
JdbcSqliteDriver(
  url = "...", 
  properties = Properties().apply { put("foreign_keys", "true") }
)
```