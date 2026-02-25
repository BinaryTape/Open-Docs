# Kotlin/Native에서 SQLDelight 시작하기

!!! info "Kotlin/Native 메모리 관리자(Memory Manager)"
    SQLDelight 2.0부터 SQLDelight Native 드라이버는 Kotlin/Native의 [새로운 메모리 관리자(new memory manager)][new memory manager]만 지원합니다.

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

코드에서 생성된 데이터베이스를 사용하려면 프로젝트에 SQLDelight Native 드라이버 의존성을 추가해야 합니다.

=== "Kotlin"
    ```kotlin
    kotlin {
      // 또는 iosMain, windowsMain 등
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // 또는 iosMain, windowsMain 등
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

드라이버 인스턴스는 아래와 같이 생성할 수 있으며, 생성된 `Schema` 객체에 대한 참조가 필요합니다.

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## Reader 커넥션 풀(Reader Connection Pools)

디스크 데이터베이스는 (선택적으로) 여러 개의 reader 커넥션을 가질 수 있습니다. reader 풀을 구성하려면 `NativeSqliteDriver`의 다양한 생성자에 `maxReaderConnections` 파라미터를 전달하세요:

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

Reader 커넥션은 트랜잭션 외부에서 쿼리를 실행할 때만 사용됩니다. 모든 쓰기 호출 및 트랜잭션 내의 모든 작업은 트랜잭션 전용 단일 커넥션을 사용합니다.

[new memory manager]: https://kotlinlang.org/docs/native-memory-manager.html