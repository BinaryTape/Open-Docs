# AndroidX Paging

要将 SQLDelight 与 [Android 的 Paging 3 库](https://developer.android.com/topic/libraries/architecture/paging/v3-overview) 结合使用，请添加对分页扩展构件的依赖。
针对 AndroidX Paging 的多平台支持通过 [Multiplatform Paging](https://github.com/cashapp/multiplatform-paging) 提供。

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