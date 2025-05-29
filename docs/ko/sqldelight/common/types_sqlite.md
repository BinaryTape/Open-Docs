## SQLite 타입

SQLDelight 컬럼 정의는 일반적인 SQLite 컬럼 정의와 동일하지만, 생성된 인터페이스에서 컬럼의 Kotlin 타입을 지정하는 [추가 컬럼 제약 조건](#custom-column-types)을 지원합니다.

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- Stored as INTEGER in db, retrieved as Long
  some_double REAL,            -- Stored as REAL in db, retrieved as Double
  some_string TEXT,            -- Stored as TEXT in db, retrieved as String
  some_blob BLOB               -- Stored as BLOB in db, retrieved as ByteArray
);
```

## 기본 타입

사용자의 편의를 위해 기본 타입(primitives)을 어댑팅하는 관련 모듈입니다.

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}"
    }
    ```

다음 어댑터들이 존재합니다:

- `FloatColumnAdapter` — 암시적으로 `kotlin.Double`로 저장되는 SQL 타입에 대해 `kotlin.Float`를 가져옵니다.
- `IntColumnAdapter` — 암시적으로 `kotlin.Long`으로 저장되는 SQL 타입에 대해 `kotlin.Int`를 가져옵니다.
- `ShortColumnAdapter` — 암시적으로 `kotlin.Long`으로 저장되는 SQL 타입에 대해 `kotlin.Short`를 가져옵니다.