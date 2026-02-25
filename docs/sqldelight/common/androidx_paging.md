# AndroidX Paging

要在 SQLDelight 中使用 [Android Paging 3 库](https://developer.android.com/topic/libraries/architecture/paging/v3-overview)，请添加分页扩展构件的依赖。

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:androidx-paging3-extensions:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:androidx-paging3-extensions:{{ versions.sqldelight }}"
    }
    ```

{% include 'common/androidx_paging_usage.md' %}