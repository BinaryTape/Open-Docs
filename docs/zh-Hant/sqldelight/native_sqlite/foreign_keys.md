{% if multiplatform %}
## 原生 SQLite
{% else %}
# 外部索引鍵
{% endif %}

您可以在資料庫配置中啟用原生 SQLite 驅動程式的外部索引鍵約束。

```kotlin
NativeSqliteDriver(
  schema = Database.Schema,
  onConfiguration = { config: DatabaseConfiguration ->
    config.copy(
      extendedConfig = DatabaseConfiguration.Extended(foreignKeyConstraints = true)
    )
  }
)
```