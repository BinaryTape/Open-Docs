# 멀티플랫폼에서 SQLite 시작하기

{% include 'common/index_gradle_database.md' %}

{% include 'multiplatform_sqlite/index_schema.md' %}

생성된 데이터베이스를 코드에서 사용하려면 프로젝트에 SQLDelight 드라이버 의존성을 추가해야 합니다.
각 타겟 플랫폼에는 고유한 드라이버 구현체가 있습니다.

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.androidMain.dependencies {
        implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
      }

      // 또는 iosMain, windowsMain 등
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }

      sourceSets.jvmMain.dependencies {
        implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      sourceSets.androidMain.dependencies {
        implementation "app.cash.sqldelight:android-driver:{{ versions.sqldelight }}"
      }

      // 또는 iosMain, windowsMain 등
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }

      sourceSets.jvmMain.dependencies {
        implementation "app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}"
      }
    }
    ```

## 드라이버 인스턴스 생성하기

`SqlDriver` 인스턴스를 얻기 위한 공통 팩토리 클래스 또는 메서드를 생성합니다.

```kotlin title="src/commonMain/kotlin"
import com.example.Database

expect class DriverFactory {
  fun createDriver(): SqlDriver
}

fun createDatabase(driverFactory: DriverFactory): Database {
  val driver = driverFactory.createDriver()
  val database = Database(driver)

  // 데이터베이스와 관련된 추가 작업을 수행합니다(아래 참조).
}
```

그런 다음 각 타겟 플랫폼에 대해 이를 구현합니다:

=== "src/androidMain/kotlin"
    ```kotlin
    actual class DriverFactory(private val context: Context) {
      actual fun createDriver(): SqlDriver {
        return AndroidSqliteDriver(Database.Schema, context, "test.db")
      }
    }
    ```
=== "src/nativeMain/kotlin"
    ```kotlin
    actual class DriverFactory {
      actual fun createDriver(): SqlDriver {
        return NativeSqliteDriver(Database.Schema, "test.db")
      }
    }
    ```
=== "src/jvmMain/kotlin"
    ```kotlin
    actual class DriverFactory {
      actual fun createDriver(): SqlDriver {
        val driver: SqlDriver = JdbcSqliteDriver("jdbc:sqlite:test.db", Properties(), Database.Schema)
        return driver
      }
    }
    ```

Kotlin/JS에서의 사용법은 [여기](../js_sqlite/multiplatform)를 참조하세요.

{% include 'common/index_queries.md' %}