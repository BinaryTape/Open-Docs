{% if multiplatform %}
## JVM SQLite
{% else %}
# 외래 키
{% endif %}
JVM SQLite 드라이버의 경우, 드라이버 속성에 설정을 전달하여 외래 키 제약 조건을 활성화할 수 있습니다.

```kotlin
JdbcSqliteDriver(
  url = "...", 
  properties = Properties().apply { put("foreign_keys", "true") }
)