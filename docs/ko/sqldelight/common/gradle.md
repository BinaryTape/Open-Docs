# Gradle

더 세부적인 커스터마이징을 위해 Gradle DSL을 사용하여 데이터베이스를 명시적으로 선언할 수 있습니다.

## SQLDelight 설정

### `databases`

데이터베이스를 위한 컨테이너입니다. 지정된 이름으로 각 데이터베이스를 생성하도록 SQLDelight를 설정합니다.

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // 여기에 데이터베이스 설정을 작성합니다.
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // 여기에 데이터베이스 설정을 작성합니다.
        }
      }
    }
    ```

----

### `linkSqlite`

타입: `Property<Boolean>`

네이티브 타겟(native targets)을 위한 설정입니다. SQLite를 자동으로 링크할지 여부를 결정합니다.
이 설정은 프로젝트가 동적 프레임워크(dynamic framework)로 컴파일될 때(최근 KMP 버전의 기본값) SQLite 링크에 필요한 메타데이터를 추가합니다.

정적 프레임워크(static framework)의 경우 이 플래그는 효과가 없음에 유의하세요.
프로젝트를 가져오는(import) Xcode 빌드에서 링커 플래그에 `-lsqlite3`를 추가해야 합니다.
또는 CocoaPods 플러그인을 통해 [sqlite3](https://cocoapods.org/pods/sqlite3) 포드(pod)에 대한 [프로젝트 의존성을 추가](https://kotlinlang.org/docs/native-cocoapods-libraries.html)하세요.
다른 방법으로는 Gradle Kotlin DSL에서 `extraSpecAttributes["libraries"] = "'c++', 'sqlite3'"`와 같이 CocoaPods [`spec.libraries` 설정](https://guides.cocoapods.org/syntax/podspec.html#libraries)에 `sqlite3`를 추가하는 방법이 있습니다.

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

플러그인이 `.sq` 및 `.sqm` 파일을 찾을 폴더 컬렉션입니다.

기본값은 `src/[prefix]main/sqldelight`이며, 접두사(prefix)는 적용된 Kotlin 플러그인에 따라 달라집니다(예: 멀티플랫폼의 경우 `common`).

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

플러그인이 `.sq` 및 `.sqm` 파일을 찾을 객체 컬렉션입니다.

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

프로젝트 루트를 기준으로 `.db` 스키마 파일이 저장될 디렉터리입니다.
이 파일들은 마이그레이션 결과가 최신 스키마를 가진 데이터베이스를 생성하는지 검증하는 데 사용됩니다.

기본값은 `null`입니다.  
`null`인 경우 마이그레이션 검증 태스크가 생성되지 않습니다.

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

선택적으로 다른 Gradle 프로젝트에 대한 스키마 의존성을 지정합니다[(아래 참고)](#schema-dependencies).

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

타겟으로 삼을 SQL 방언(dialect)입니다. 방언은 Gradle 의존성을 사용하여 선택합니다.
이러한 의존성은 `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}`와 같이 지정할 수 있습니다. 
사용 가능한 방언은 아래를 참조하세요.

Android 프로젝트의 경우, SQLite 버전은 `minSdk`를 기반으로 자동으로 선택됩니다. 그렇지 않은 경우 기본적으로 SQLite 3.18이 사용됩니다.

사용 가능한 방언:

* HSQL: `hsql-dialect`
* MySQL: `mysql-dialect`
* PostgreSQL: `postgresql-dialect`
* SQLite 3.18: `sqlite-3-18-dialect`
* SQLite 3.24: `sqlite-3-24-dialect`
* SQLite 3.25: `sqlite-3-25-dialect`
* SQLite 3.30: `sqlite-3-30-dialect`
* SQLite 3.33: `sqlite-3-33-dialect`
* SQLite 3.35: `sqlite-3-35-dialect`
* SQLite 3.38: `sqlite-3-38-dialect`

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

true로 설정하면 마이그레이션 파일에 오류가 있을 경우 빌드 과정에서 실패 처리됩니다.

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

true로 설정하면 SQLDelight는 `IS`를 사용할 때 nullable 타입 값에 대한 동등 비교를 대체하지 않습니다.

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

true로 설정하면 SQLDelight는 비동기 드라이버와 함께 사용할 수 있도록 중단(suspending) 쿼리 메서드를 생성합니다.

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

true로 설정하면 각 마이그레이션이 적용된 것처럼 `.sqm` 파일에서 데이터베이스 스키마를 도출합니다.
false인 경우, 스키마는 `.sq` 파일에 정의됩니다.

기본값은 `false`입니다.

=== "Kotlin"
    ```kotlin
    deriveSchemaFromMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    deriveSchemaFromMigrations = true
    ```

----

### `expandSelectStar`

타입: `Property<Boolean>`

true로 설정하면 SQLDelight는 `SELECT *` 문을 각 결과 컬럼을 명시적으로 참조하도록 재작성합니다.

예를 들어, 아래의 `getAll` 쿼리는
```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);

getAll:
SELECT * FROM hockey_player;
```
`SELECT hockey_player.id, hockey_player.name, hockey_player.number FROM hockey_player;` 로 재작성됩니다.

기본값은 `true`입니다.

=== "Kotlin"
    ```kotlin
    expandSelectStar.set(true)
    ```
=== "Groovy"
    ```groovy
    expandSelectStar = true
    ```

----

### `codegenExcludedColumns`

타입: `SetProperty<String>`

생성된 모델 및 확장된 `SELECT *` 프로젝션에서 제외할 `table.column` 값들의 집합입니다.
테이블 및 컬럼 이름은 SQLDelight 스키마 소스와 동일한 대소문자를 사용해야 합니다.
이는 코드 생성에만 영향을 미치며, SQL 스키마나 생성된 마이그레이션 출력은 변경하지 않습니다.

이는 후속 스키마 마이그레이션에서 컬럼을 삭제(drop)하기 전에, 생성된 Kotlin API를 업데이트하는 데 사용할 수 있습니다.
설정된 테이블이나 컬럼이 존재하지 않거나, 모델에 바인딩된 insert, `SELECT` 결과 컬럼, 또는 `RETURNING` 절이 코드 생성에서 제외된(codegen-excluded) 컬럼을 명시적으로 나열하는 경우 SQLDelight 컴파일이 실패합니다.
이것은 코드 생성에만 해당하므로, 애플리케이션은 해당 컬럼이 실제로 삭제되기 전까지 쓰기 작업에서 여전히 존재하는 제외된 컬럼을 생략할 수 있도록 보장해야 할 책임이 있습니다 (예: nullable 컬럼을 사용하거나 기본값을 설정하는 방식).

`.sq` 파일에 `CREATE TABLE` 스키마 정의가 포함되어 있다면, 실제 물리적 스키마 마이그레이션에서 해당 컬럼을 삭제할 때까지 스키마 정의에 제외된 컬럼을 유지하세요. 해당 컬럼에 대한 명시적인 쿼리 참조는 제거하되, 스키마 소스는 현재 데이터베이스의 형태를 반영하도록 두어야 합니다.

기본값은 빈 값(empty)입니다.

=== "Kotlin"
    ```kotlin
    codegenExcludedColumns.set(setOf("hockey_player.number"))
    ```
=== "Groovy"
    ```groovy
    codegenExcludedColumns = ["hockey_player.number"]
    ```

{% include 'common/gradle-dependencies.md' %}