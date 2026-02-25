{% if multiplatform %}
## Native SQLite
{% else %}
# 外部キー
{% endif %}

データベース設定で有効にすることで、ネイティブ SQLite ドライバーの外部キー制約を有効にできます。

```kotlin
NativeSqliteDriver(
  schema = Database.Schema,
  onConfiguration = { config: DatabaseConfiguration ->
    config.copy(
      extendedConfig = DatabaseConfiguration.Extended(foreignKeyConstraints = true)
    )
  }
)