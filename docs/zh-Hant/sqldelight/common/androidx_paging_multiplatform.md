# AndroidX Paging

若要將 SQLDelight 與 [Android 的 Paging 3 函式庫](https://developer.android.com/topic/libraries/architecture/paging/v3-overview) 搭配使用，請新增對分頁擴展構件的依賴項。
AndroidX Paging 的多平台支援透過 [Multiplatform Paging](https://github.com/cashapp/multiplatform-paging) 提供。

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.commonMain.dependencies {
        implementation("app.cash.sqldelight:androidx-paging3-extensions:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      sourceSets.commonMain.dependencies {
        implementation "app.cash.sqldelight:androidx-paging3-extensions:{{ versions.sqldelight }}"
      }
    }
    ```

{% include 'common/androidx_paging_usage.md' %}