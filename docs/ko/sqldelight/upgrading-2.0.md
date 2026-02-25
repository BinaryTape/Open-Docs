# 2.0으로 업그레이드하기

SQLDelight 2.0은 Gradle 플러그인과 런타임 API에 몇 가지 브레이킹 체인지(breaking changes)를 도입했습니다.

이 페이지에서는 이러한 브레이킹 체인지와 이에 대응하는 2.0의 새로운 방식들을 나열합니다.
새로운 기능 및 기타 변경 사항에 대한 전체 목록은 [변경 로그(changelog)](../changelog)를 참조하세요.

## 새로운 패키지 이름 및 아티팩트 그룹

모든 `com.squareup.sqldelight` 인스턴스를 `app.cash.sqldelight`로 교체해야 합니다.

```diff title="Gradle Dependencies"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

순수 안드로이드(pure-Android) SQLDelight 1.x 프로젝트의 경우, android-driver 및 coroutine-extensions-jvm을 사용하세요:
dependencies {
-  implementation("com.squareup.sqldelight:android-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
-  implementation("com.squareup.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:coroutines-extensions-jvm:{{ versions.sqldelight }}")
}
```

```diff title="In Code"
-import com.squareup.sqldelight.db.SqlDriver
+import app.cash.sqldelight.db.SqlDriver
```

## Gradle 설정 변경 사항

* SQLDelight 2.0은 빌드 시 Java 11을, 런타임에는 Java 8을 요구합니다.
* SQLDelight 설정 API는 이제 데이터베이스 관리를 위해 관리형 속성(managed properties)과 `DomainObjectCollection`을 사용합니다.

    === "Kotlin"
        ```kotlin
        sqldelight {
          databases { // (1)!
            create("Database") {
              packageName.set("com.example") // (2)!
            }
          }
        }
        ```

        1. 새로운 `DomainObjectCollection` 래퍼.
        2. 이제 `Property<String>`입니다.
    === "Groovy"
        ```kotlin
        sqldelight {
          databases { // (1)!
            Database {
              packageName = "com.example"
            }
          }
        }
        ```

        1. 새로운 `DomainObjectCollection` 래퍼.

* `sourceFolders` 설정이 `srcDirs`로 변경되었습니다.

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              srcDirs.setFrom("src/main/sqldelight")
            }
          }
        }
        ```
    === "Groovy"
        ```groovy
        sqldelight {
          databases {
            MyDatabase {
              packageName = "com.example"
              srcDirs = ['src/main/sqldelight']
            }
          }
        }
        ```

* 데이터베이스의 SQL dialect는 이제 Gradle 의존성을 사용하여 지정합니다.

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              dialect("app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}")

              // Version catalogs도 작동합니다!
              dialect(libs.sqldelight.dialects.mysql)
            }
          }
        }
        ```
    === "Groovy"
        ```groovy
        sqldelight {
          databases {
            MyDatabase {
              packageName = "com.example"
              dialect "app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}"

              // Version catalogs도 작동합니다!
              dialect libs.sqldelight.dialects.mysql
            }
          }
        }
        ```

    현재 지원되는 dialect는 `mysql-dialect`, `postgresql-dialect`, `hsql-dialect`, `sqlite-3-18-dialect`, `sqlite-3-24-dialect`, `sqlite-3-25-dialect`, `sqlite-3-30-dialect`, `sqlite-3-35-dialect`, 그리고 `sqlite-3-38-dialect`입니다.

## 런타임 변경 사항

* 이제 `.sq` 및 `.sqm` 파일에 기본 타입(primitive types)을 임포트해야 합니다.

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    이전에 지원되던 일부 타입은 이제 어댑터가 필요합니다. 기본 타입용 어댑터는 `app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}` 아티팩트에서 제공됩니다.
    예를 들어, `INTEGER As kotlin.Int` 변환을 위해 `IntColumnAdapter`를 사용합니다.

* `AfterVersionWithDriver` 타입은 이제 항상 드라이버를 포함하는 [`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version)으로 대체되어 제거되었으며, `migrateWithCallbacks` 확장 함수는 이제 콜백을 허용하는 메인 [`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107) 메서드로 대체되어 제거되었습니다.

    ```diff
    Database.Schema.{++migrate++}{--WithCallbacks--}(
      driver = driver,
      oldVersion = 1,
      newVersion = Database.Schema.version,
    -  {--AfterVersionWithDriver(3) { driver ->--}
    -  {--  driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0)--}
    -  {--}--}
    +  {++AfterVersion(3) { driver ->++}
    +  {++  driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0)++}
    +  {++}++}
    )
    ```

* `Schema` 타입은 더 이상 `SqlDriver`의 중첩 타입이 아니며, 이제 [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)라고 불립니다.

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

* [paging3 확장 API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/)가 개수(count)에 정수(int) 타입만 허용하도록 변경되었습니다.
* [코루틴 확장 API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/)는 이제 디스패처(dispatcher)를 명시적으로 전달해야 합니다.
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
* [`execute()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute), [`executeQuery()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute-query), `newTransaction()`, `endTransaction()`과 같은 일부 드라이버 메서드는 이제 [`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result) 객체를 반환합니다. 반환된 값에 접근하려면 [`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value)를 사용하세요.
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    이 변경을 통해 드라이버 구현체가 비차단(non-blocking) API를 기반으로 할 수 있게 되었으며, 반환된 값은 서스펜딩(suspending) 메서드인 [`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await)를 사용하여 접근할 수 있습니다.
  * `SqlCursor` 인터페이스의 [`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next) 메서드 또한 비동기 드라이버에 대한 더 나은 커서 지원을 위해 `QueryResult`를 반환하도록 변경되었습니다.
* [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) 인터페이스는 이제 제네릭 `QueryResult` 타입 파라미터를 갖습니다. 이는 동기 드라이버와 직접 호환되지 않을 수 있는 비동기 드라이버용으로 생성된 스키마 런타임을 구분하는 데 사용됩니다.
  이 사항은 JS 타겟이 포함된 멀티플랫폼 프로젝트와 같이 동기 드라이버와 비동기 드라이버를 동시에 사용하는 프로젝트에만 해당됩니다. 자세한 내용은 "[Web Worker 드라이버를 사용한 멀티플랫폼 설정](js_sqlite/multiplatform.md)"을 참조하세요.
* 서버 환경에서 타임스탬프를 버전으로 활용할 수 있도록 `SqlSchema.Version`의 타입이 `Int`에서 `Long`으로 변경되었습니다. 기존 설정은 `Int`와 `Long` 사이에서 안전하게 캐스팅할 수 있으며, 버전으로 `Int` 범위를 요구하는 드라이버의 경우 범위 밖의 버전에 대해 데이터베이스 생성 전 에러(crash)가 발생합니다.