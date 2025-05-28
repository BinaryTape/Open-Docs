# AndroidX 分頁

若要將 SQLDelight 與 [Android 的 Paging 3 函式庫](https://developer.android.com/topic/libraries/architecture/paging/v3-overview) 搭配使用，請新增對分頁延伸模組 (paging extension artifact) 的依賴項。

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