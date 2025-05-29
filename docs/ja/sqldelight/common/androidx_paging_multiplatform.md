# AndroidX Paging

SQLDelightを[AndroidのPaging 3ライブラリ](https://developer.android.com/topic/libraries/architecture/paging/v3-overview)と連携して使用するには、ページング拡張アーティファクトへの依存関係を追加します。
AndroidX Pagingのマルチプラットフォーム対応は、[Multiplatform Paging](https://github.com/cashapp/multiplatform-paging)を介して提供されます。

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