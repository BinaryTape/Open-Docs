{% if multiplatform %}
## 네이티브 SQLite
{% else %}
# 외래 키
{% endif %}

데이터베이스 구성에서 외래 키 제약 조건을 활성화하여 네이티브 SQLite 드라이버에 대해 외래 키 제약 조건을 사용할 수 있습니다.

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