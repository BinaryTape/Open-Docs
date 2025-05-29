## Flow

要将查询作为 Flow 消费，请依赖 Coroutines 扩展构件并使用其提供的扩展方法：

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.commonMain.dependencies {
        implementation("app.cash.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      sourceSets.commonMain.dependencies {
        implementation "app.cash.sqldelight:coroutines-extensions:{{ versions.sqldelight }}"
      }
    }
    ```

{% include 'common/coroutines-usage.md' %}