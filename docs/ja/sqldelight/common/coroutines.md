## Flow

クエリをFlowとして利用するには、coroutines extensionsアーティファクトを依存関係として追加し、提供されている拡張関数を使用します。

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