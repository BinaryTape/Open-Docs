# Kotlin/Native에서 SQLDelight 시작하기

!!! info "Kotlin/Native 메모리 관리자"
    SQLDelight 2.0부터 SQLDelight Native 드라이버는 Kotlin/Native의 [새 메모리 관리자]만을 지원합니다.

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

코드에서 생성된 데이터베이스를 사용하려면 SQLDelight Native 드라이버 의존성을 프로젝트에 추가해야 합니다.

=== "Kotlin"
    ```kotlin
    kotlin {
      // or iosMain, windowsMain, etc.
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // or iosMain, windowsMain, etc.
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

드라이버 인스턴스는 아래와 같이 구성할 수 있으며, 생성된 `Schema` 객체에 대한 참조가 필요합니다.

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## 리더 연결 풀

디스크 데이터베이스는 (선택적으로) 여러 개의 리더 연결을 가질 수 있습니다. 리더 풀을 구성하려면 `maxReaderConnections` 매개변수를 `NativeSqliteDriver`의 다양한 생성자에 전달하세요:

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

리더 연결은 트랜잭션 외부에서 쿼리를 실행하는 데에만 사용됩니다. 모든 쓰기 호출과 트랜잭션 내의 모든 작업은 트랜잭션 전용으로 할당된 단일 연결을 사용합니다.

[new memory manager]: https://kotlinlang.org/docs/native-memory-manager.html