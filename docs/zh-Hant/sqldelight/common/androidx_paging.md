# AndroidX Paging

若要將 SQLDelight 與 [Android 的 Paging 3 程式庫](https://developer.android.com/topic/libraries/architecture/paging/v3-overview)搭配使用，請新增 paging 擴充套件構件的相依性。

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