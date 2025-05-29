# AndroidX ページング

SQLDelight を [AndroidのPaging 3ライブラリ](https://developer.android.com/topic/libraries/architecture/paging/v3-overview) とともに使用するには、ページング拡張アーティファクトへの依存関係を追加します。

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