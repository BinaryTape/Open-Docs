## Flow

要将查询作为 `Flow` 消费，请添加 `coroutines extensions` 构件作为依赖项，并使用它提供的扩展函数：

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:coroutines-extensions:{{ versions.sqldelight }}"
    }
    ```

{% include 'common/coroutines-usage.md' %}