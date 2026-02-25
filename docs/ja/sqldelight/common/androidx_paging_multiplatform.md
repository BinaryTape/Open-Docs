# AndroidX Paging

SQLDelightを[AndroidのPaging 3ライブラリ](https://developer.android.com/topic/libraries/architecture/paging/v3-overview)とともに使用するには、paging extensionアーティファクトへの依存関係を追加します。
AndroidX Pagingのマルチプラットフォームサポートは、[Multiplatform Paging](https://github.com/cashapp/multiplatform-paging)を通じて提供されます。

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