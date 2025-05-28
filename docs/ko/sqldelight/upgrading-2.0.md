# 2.0으로 업그레이드

SQLDelight 2.0은 Gradle 플러그인 및 런타임 API에 일부 호환성(breaking) 변경 사항을 적용합니다.

이 페이지에서는 이러한 호환성 변경 사항과 새로운 2.0에서의 대응하는 내용들을 나열합니다. 새로운 기능 및 기타 변경 사항의 전체 목록은 [변경 로그](../changelog)를 참조하세요.

## 새 패키지 이름 및 아티팩트 그룹

`com.squareup.sqldelight`의 모든 인스턴스는 `app.cash.sqldelight`로 교체해야 합니다.

```diff title="Gradle Dependencies"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

For pure-Android SqlDelight 1.x projects, use android-driver and coroutine-extensions-jvm:
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

* SQLDelight 2.0은 빌드에 Java 11을, 런타임에 Java 8을 필요로 합니다.
* SQLDelight 설정 API는 이제 데이터베이스에 대해 관리되는 프로퍼티(managed properties)와 `DomainObjectCollection`을 사용합니다.

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

* `sourceFolders` 설정이 `srcDirs`로 이름이 변경되었습니다.

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

* 데이터베이스의 SQL 방언(dialect)은 이제 Gradle 종속성(dependency)을 사용하여 지정됩니다.

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              dialect("app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}")

              // Version catalogs also work!
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

              // Version catalogs also work!
              dialect libs.sqldelight.dialects.mysql
            }
          }
        }
        ```

    현재 지원되는 방언은 `mysql-dialect`, `postgresql-dialect`, `hsql-dialect`, `sqlite-3-18-dialect`, `sqlite-3-24-dialect`, `sqlite-3-25-dialect`, `sqlite-3-30-dialect`, `sqlite-3-35-dialect`, 및 `sqlite-3-38-dialect`입니다.

## 런타임 변경 사항

* 이제 기본(primitive) 타입은 `.sq` 및 `.sqm` 파일로 임포트(import)되어야 합니다.

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    이전에 지원되던 일부 타입은 이제 어댑터(adapter)를 필요로 합니다. 기본 타입용 어댑터는 `app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}` 아티팩트(artifact)에서 사용할 수 있습니다. 예: `INTEGER As kotlin.Int` 변환을 위한 `IntColumnAdapter`.

* `AfterVersionWithDriver` 타입은 이제 항상 드라이버를 포함하는 [`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version)으로 대체되었으며, `migrateWithCallbacks` 확장 함수는 이제 콜백(callback)을 허용하는 주 [`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107) 메서드로 대체되었습니다.

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

* `Schema` 타입은 더 이상 `SqlDriver`의 중첩된(nested) 타입이 아니며, 이제 [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)라고 불립니다.

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

* [paging3 확장 API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/)는 이제 개수에 대해 int 타입만 허용하도록 변경되었습니다.
* [코루틴(coroutines) 확장 API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/)는 이제 디스패처(dispatcher)를 명시적으로 전달해야 합니다.
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
* [`execute()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute), [`executeQuery()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute-query), `newTransaction()`, `endTransaction()`와 같은 일부 드라이버 메서드는 이제 [`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result) 객체를 반환합니다. 반환된 값에 접근하려면 [`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value)를 사용하세요.
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    이 변경 사항을 통해 드라이버 구현은 반환된 값에 대해 서스펜딩(suspending) [`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await) 메서드를 사용하여 접근할 수 있는 논블로킹(non-blocking) API를 기반으로 할 수 있게 됩니다.
  * `SqlCursor` 인터페이스의 [`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next) 메서드 또한 비동기 드라이버를 위한 더 나은 커서 지원을 가능하게 하기 위해 `QueryResult`를 반환하도록 변경되었습니다.
* [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) 인터페이스는 이제 제네릭(generic) `QueryResult` 타입 파라미터를 가집니다. 이는 비동기 드라이버와 함께 사용하도록 생성되었으며 동기 드라이버와 직접적으로 호환되지 않을 수 있는 스키마 런타임을 구별하는 데 사용됩니다.
  이는 JS 타겟을 가진 멀티플랫폼(multiplatform) 프로젝트와 같이 동기 및 비동기 드라이버를 동시에 사용하는 프로젝트에만 해당됩니다. 자세한 내용은 '[웹 워커 드라이버를 사용한 멀티플랫폼 설정](js_sqlite/multiplatform.md)'을 참조하세요.
* `SqlSchema.Version`의 타입이 Int에서 Long으로 변경되어 서버 환경에서 타임스탬프(timestamp)를 버전으로 활용할 수 있게 되었습니다. 기존 설정은 Int와 Long 간에 안전하게 캐스팅(cast)할 수 있으며, 버전에 대해 Int 범위를 요구하는 드라이버는 범위를 벗어난 버전의 경우 데이터베이스 생성 전에 충돌이 발생합니다.