# Gradle

더 세밀한 사용자 정의를 위해 Gradle DSL을 사용하여 데이터베이스를 명시적으로 선언할 수 있습니다.

## SQLDelight 설정

### `databases`

데이터베이스를 위한 컨테이너입니다. SQLDelight가 지정된 이름으로 각 데이터베이스를 생성하도록 설정합니다.

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // Database configuration here.
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // Database configuration here.
        }
      }
    }
    ```

----

### `linkSqlite`

타입: `Property<Boolean>`

네이티브 타겟을 위한 설정입니다. SQLite가 자동으로 링크되어야 하는지 여부를 나타냅니다.
이 설정은 프로젝트가 동적 프레임워크(KMP(Kotlin Multiplatform) 최신 버전의 기본값)로 컴파일될 때 SQLite 링크에 필요한 메타데이터를 추가합니다.

정적 프레임워크의 경우 이 플래그는 적용되지 않습니다.
프로젝트를 임포트하는 Xcode 빌드는 링커 플래그에 `-lsqlite3`를 추가해야 합니다.
또는 코코아팟 플러그인을 통해 [`sqlite3`](https://cocoapods.org/pods/sqlite3) 팟에 대한 [프로젝트 종속성을 추가](https://kotlinlang.org/docs/native-cocoapods-libraries.html)할 수 있습니다.
작동할 수 있는 다른 옵션은 코코아팟의 [`spec.libraries` 설정](https://guides.cocoapods.org/syntax/podspec.html#libraries)에 `sqlite3`를 추가하는 것입니다. 예: Gradle Kotlin DSL에서 `extraSpecAttributes["libraries"] = "'c++', 'sqlite3'".`

기본값은 `true`입니다.

=== "Kotlin"
    ```kotlin
    linkSqlite.set(true)
    ```
=== "Groovy"
    ```groovy
    linkSqlite = true
    ```

## 데이터베이스 설정

### `packageName`

타입: `Property<String>`

데이터베이스 클래스에 사용될 패키지 이름입니다.

=== "Kotlin"
    ```kotlin
    packageName.set("com.example.db")
    ```
=== "Groovy"
    ```groovy
    packageName = "com.example.db"
    ```

----

### `srcDirs`

타입: `ConfigurableFileCollection`

플러그인이 `.sq` 및 `.sqm` 파일을 찾아볼 폴더 컬렉션입니다.

기본값은 `src/[prefix]main/sqldelight`이며, `prefix`는 적용된 코틀린 플러그인에 따라 달라집니다(예: 멀티플랫폼의 경우 `common`).

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

플러그인이 `.sq` 및 `.sqm` 파일을 찾아볼 객체 컬렉션입니다.

=== "Kotlin"
    ```kotlin
    srcDirs("src/main/sqldelight", "main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs('src/main/sqldelight', 'main/sqldelight')
    ```

----

### `schemaOutputDirectory`

타입: `DirectoryProperty`

`.db` 스키마 파일이 저장되어야 할 디렉토리로, 프로젝트 루트에 상대적인 경로입니다.
이 파일들은 마이그레이션이 최신 스키마를 가진 데이터베이스를 생성하는지 검증하는 데 사용됩니다.

기본값은 `null`입니다.
`null`인 경우 마이그레이션 검증 작업은 생성되지 않습니다.

=== "Kotlin"
    ```kotlin
    schemaOutputDirectory.set(file("src/main/sqldelight/databases"))
    ```
=== "Groovy"
    ```groovy
    schemaOutputDirectory = file("src/main/sqldelight/databases")
    ```

----

### `dependency`

타입: `Project`

다른 Gradle 프로젝트에 대한 스키마 종속성을 선택적으로 지정할 수 있습니다. ([아래 참조)](#schema-dependencies)

=== "Kotlin"
    ```kotlin
    dependency(project(":other-project"))
    ```
=== "Groovy"
    ```groovy
    dependency project(":other-project")
    ```

----

### `dialect`

타입: `String` 또는 `Provider<MinimalExternalModuleDependency>`

타겟팅하려는 SQL 다이얼렉트입니다. 다이얼렉트는 Gradle 종속성을 사용하여 선택됩니다.
이러한 종속성은 `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}` 형식으로 지정할 수 있습니다.
사용 가능한 다이얼렉트는 아래를 참조하세요.

안드로이드 프로젝트의 경우 `minSdk`에 따라 SQLite 버전이 자동으로 선택됩니다.
그렇지 않으면 기본값은 SQLite 3.18입니다.

사용 가능한 다이얼렉트:

*   HSQL: `hsql-dialect`
*   MySQL: `mysql-dialect`
*   PostgreSQL: `postgresql-dialect`
*   SQLite 3.18: `sqlite-3-18-dialect`
*   SQLite 3.24: `sqlite-3-24-dialect`
*   SQLite 3.25: `sqlite-3-25-dialect`
*   SQLite 3.30: `sqlite-3-30-dialect`
*   SQLite 3.33: `sqlite-3-33-dialect`
*   SQLite 3.35: `sqlite-3-35-dialect`
*   SQLite 3.38: `sqlite-3-38-dialect`

=== "Kotlin"
    ```kotlin
    dialect("app.cash.sqldelight:sqlite-3-24-dialect:{{ versions.sqldelight }}")
    ```
=== "Groovy"
    ```groovy
    dialect 'app.cash.sqldelight:sqlite-3-24-dialect:{{ versions.sqldelight }}'
    ```

----

### `verifyMigrations`

타입: `Property<Boolean>`

`true`로 설정된 경우, 마이그레이션 파일에 오류가 있으면 빌드 프로세스 중에 실패합니다.

기본값은 `false`입니다.

=== "Kotlin"
    ```kotlin
    verifyMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    verifyMigrations = true
    ```

----

### `treatNullAsUnknownForEquality`

타입: `Property<Boolean>`

`true`로 설정된 경우, SQLDelight는 `IS`를 사용할 때 널러블 타입 값과의 동등 비교를 대체하지 않습니다.

기본값은 `false`입니다.

=== "Kotlin"
    ```kotlin
    treatNullAsUnknownForEquality.set(true)
    ```
=== "Groovy"
    ```groovy
    treatNullAsUnknownForEquality = true
    ```

----

### `generateAsync`

타입: `Property<Boolean>`

`true`로 설정된 경우, SQLDelight는 비동기 드라이버와 함께 사용할 suspend 쿼리 메서드를 생성합니다.

기본값은 `false`입니다.

=== "Kotlin"
    ```kotlin
    generateAsync.set(true)
    ```
=== "Groovy"
    ```groovy
    generateAsync = true
    ```

----

### `deriveSchemaFromMigrations`

타입: `Property<Boolean>`

`true`로 설정된 경우, 데이터베이스의 스키마는 각 마이그레이션이 적용된 것처럼 `.sqm` 파일로부터 파생됩니다.
`false`인 경우, 스키마는 `.sq` 파일에 정의됩니다.

기본값은 `false`입니다.

=== "Kotlin"
    ```kotlin
    deriveSchemaFromMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    deriveSchemaFromMigrations = true
    ```

{% include 'common/gradle-dependencies.md' %}