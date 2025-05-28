{% if multiplatform %}
## ネイティブ SQLite
{% else %}
# 外部キー
{% endif %}

Native SQLiteドライバーの外部キー制約は、データベース設定で有効にすることで有効にできます。

```kotlin
NativeSqliteDriver(
  schema = Database.Schema,
  onConfiguration = { config: DatabaseConfiguration ->
    config.copy(
      extendedConfig = DatabaseConfiguration.Extended(foreignKeyConstraints = true)
    )
  }
)