## Flow

若要將查詢作為 Flow 取用，請將 coroutines extensions 構件新增為相依性，並使用其提供的擴充函式：

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