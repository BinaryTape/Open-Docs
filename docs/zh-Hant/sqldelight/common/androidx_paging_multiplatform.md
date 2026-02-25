# AndroidX Paging

若要搭配 [Android Paging 3 庫](https://developer.android.com/topic/libraries/architecture/paging/v3-overview) 使用 SQLDelight，請新增對 paging 擴充構件的相依性。
AndroidX Paging 的多平台支援是透過 [Multiplatform Paging](https://github.com/cashapp/multiplatform-paging) 提供的。

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