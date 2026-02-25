# 在多平台中使用 SQLite 入门

{% include 'common/index_gradle_database.md' %}

{% include 'multiplatform_sqlite/index_schema.md' %}

要在代码中使用生成的数据库，必须向项目中添加 SQLDelight 驱动程序依赖项。
每个目标平台都有其自己的驱动程序实现。

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.androidMain.dependencies {
        implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
      }

      // 或是 iosMain、windowsMain 等。
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

      // 或是 iosMain、windowsMain 等。
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }

      sourceSets.jvmMain.dependencies {
        implementation "app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}"
      }
    }
    ```

## 构造驱动程序实例

创建一个通用的工厂类或方法来获取 `SqlDriver` 实例。

```kotlin title="src/commonMain/kotlin"
import com.example.Database

expect class DriverFactory {
  fun createDriver(): SqlDriver
}

fun createDatabase(driverFactory: DriverFactory): Database {
  val driver = driverFactory.createDriver()
  val database = Database(driver)

  // 进一步处理数据库（见下文）。
}
```

然后为每个目标平台实现它：

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

对于 Kotlin/JS 的用法，[请参阅此处](../js_sqlite/multiplatform)。

{% include 'common/index_queries.md' %}