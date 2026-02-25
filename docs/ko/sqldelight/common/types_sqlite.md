## SQLite 타입

SQLDelight 컬럼 정의는 일반적인 SQLite 컬럼 정의와 동일하지만, 생성된 인터페이스에서 컬럼의 Kotlin 타입을 지정하는 [추가 컬럼 제약 사항(extra column constraint)](#custom-column-types)을 지원합니다.

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- DB에 INTEGER로 저장되고 Long으로 검색됨
  some_double REAL,            -- DB에 REAL로 저장되고 Double로 검색됨
  some_string TEXT,            -- DB에 TEXT로 저장되고 String으로 검색됨
  some_blob BLOB               -- DB에 BLOB으로 저장되고 ByteArray로 검색됨
);
```

## 기본 타입(Primitives)

사용자의 편의를 위해 기본 타입(primitives)을 어댑팅하는 형제 모듈입니다.

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

다음과 같은 어댑터들이 존재합니다:

- `FloatColumnAdapter` — 암시적으로 `kotlin.Double`로 저장된 SQL 타입에 대해 `kotlin.Float`을 가져옵니다.
- `IntColumnAdapter` — 암시적으로 `kotlin.Long`으로 저장된 SQL 타입에 대해 `kotlin.Int`를 가져옵니다.
- `ShortColumnAdapter` — 암시적으로 `kotlin.Long`으로 저장된 SQL 타입에 대해 `kotlin.Short`를 가져옵니다.