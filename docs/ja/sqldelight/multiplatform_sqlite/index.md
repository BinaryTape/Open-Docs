# MultiplatformでのSQLiteの開始方法

{% include 'common/index_gradle_database.md' %}

{% include 'multiplatform_sqlite/index_schema.md' %}

生成されたデータベースをコードで使用するには、プロジェクトにSQLDelightのドライバー依存関係を追加する必要があります。
各ターゲットプラットフォームには、独自のドライバー実装があります。

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.androidMain.dependencies {
        implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
      }

      // または iosMain、windowsMain など
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

      // または iosMain、windowsMain など
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }

      sourceSets.jvmMain.dependencies {
        implementation "app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}"
      }
    }
    ```

## ドライバーインスタンスの構築

`SqlDriver`インスタンスを取得するための共通のファクトリクラスまたはメソッドを作成します。

```kotlin title="src/commonMain/kotlin"
import com.example.Database

expect class DriverFactory {
  fun createDriver(): SqlDriver
}

fun createDatabase(driverFactory: DriverFactory): Database {
  val driver = driverFactory.createDriver()
  val database = Database(driver)

  // データベースを使用してさらに作業を行います（以下を参照）。
}
```

次に、ターゲットプラットフォームごとにこれを実装します。

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

Kotlin/JSでの使用については、[こちら](../js_sqlite/multiplatform)をご覧ください。

{% include 'common/index_queries.md' %}