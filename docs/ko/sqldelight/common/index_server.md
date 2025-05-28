SQLDelight는 데이터베이스의 스키마를 알아야 합니다. 일반적으로 데이터베이스 스키마를 설정하는 두 가지 접근 방식이 있습니다. "Fresh Schema" 접근 방식은 빈 데이터베이스에서 시작하여 원하는 상태로 만들기 위해 필요한 모든 구문이 한 번에 모두 적용된다고 가정합니다. 반면에 "Migration Schema" 접근 방식은 이미 데이터베이스와 스키마가 설정되어 있으며(예: 기존 운영 데이터베이스), 시간이 지남에 따라 마이그레이션을 점진적으로 적용하여 데이터베이스의 스키마를 업데이트한다고 가정합니다.

SQLDelight에서 이러한 접근 방식은 "[Fresh Schema](#fresh-schema)"를 위해 `.sq` 파일에 테이블 정의를 작성하거나, "[Migration Schema](#migration-schema)"를 위해 `.sqm` 파일에 마이그레이션 구문을 작성하는 것으로 해석됩니다. 두 경우 모두 SQL _쿼리_는 `.sq` 파일에 작성됩니다([여기에서 보여주는 것처럼](#typesafe-sql)).

## Fresh Schema

{% include 'common/index_schema_sq.md' %}

동일한 `.sq` 파일에 [런타임](#typesafe-sql)에 실행될 SQL 구문을 배치하기 시작할 수 있습니다.

## Migration Schema

먼저, Gradle이 마이그레이션을 사용하여 스키마를 구성하도록 설정합니다:

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("Database") {
          ...
          srcDirs("sqldelight")
          deriveSchemaFromMigrations.set(true)
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        Database {
          ...
          srcDirs "sqldelight"
          deriveSchemaFromMigrations = true
        }
      }
    }
    ```

마이그레이션 파일은 `.sqm` 확장자를 가지며, 마이그레이션 파일이 실행되는 순서를 나타내는 숫자가 파일 이름에 포함되어야 합니다. 예를 들어, 다음 계층 구조에서:

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelight는 `v1__backend.sqm`을 적용한 다음 `v2__backend.sqm`을 적용하여 스키마를 생성합니다. 이러한 파일에 일반 SQL `CREATE`/`ALTER` 구문을 배치하세요. 다른 서비스가 (Flyway와 같이) 마이그레이션 파일을 읽는 경우, [마이그레이션](migrations)에 대한 정보와 유효한 SQL을 출력하는 방법을 반드시 읽어보세요.

## Typesafe SQL

런타임에 SQL 구문을 실행하기 전에, 데이터베이스에 연결하기 위해 `SqlDriver`를 생성해야 합니다. 가장 쉬운 방법은 Hikari 또는 다른 연결 관리자로부터 얻는 `DataSource`를 사용하는 것입니다.

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:jdbc-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:jdbc-driver:{{ versions.sqldelight }}"
    }
    ```
```kotlin
val driver: SqlDriver = dataSource.asJdbcDriver()
```

스키마를 초기 테이블 생성 구문으로 지정하든 마이그레이션을 통해 지정하든 상관없이, 런타임 SQL은 `.sq` 파일에 들어갑니다.

{% include 'common/index_queries.md' %}