{% if multiplatform %}
## Native SQLite
{% else %}
# 外键
{% endif %}

您可以通过在数据库配置中启用它们，来为 Native SQLite 驱动启用外键约束。

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