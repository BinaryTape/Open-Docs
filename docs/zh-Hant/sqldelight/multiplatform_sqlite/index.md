# 在多平台上開始使用 SQLite

{% include 'common/index_gradle_database.md' %}

{% include 'multiplatform_sqlite/index_schema.md' %}

要在程式碼中使用產生的資料庫，您必須將 SQLDelight 驅動程式相依性新增至您的專案。
每個目標平台都有自己的驅動程式實作。

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.androidMain.dependencies {
        implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
      }

      // 或 iosMain、windowsMain 等。
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

      // 或 iosMain、windowsMain 等。
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }

      sourceSets.jvmMain.dependencies {
        implementation "app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}"
      }
    }
    ```

## 建立驅動程式執行個體

建立一個共用的工廠類別或方法來取得 `SqlDriver` 執行個體。

```kotlin title="src/commonMain/kotlin"
import com.example.Database

expect class DriverFactory {
  fun createDriver(): SqlDriver
}

fun createDatabase(driverFactory: DriverFactory): Database {
  val driver = driverFactory.createDriver()
  val database = Database(driver)

  // 對資料庫進行更多操作（見下文）。
}
```

接著為每個目標平台實作此內容：

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

關於 Kotlin/JS 的用法，[請參閱此處](../js_sqlite/multiplatform)。

{% include 'common/index_queries.md' %}