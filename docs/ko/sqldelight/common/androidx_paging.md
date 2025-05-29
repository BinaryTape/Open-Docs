# AndroidX Paging

[Android의 Paging 3 라이브러리](https://developer.android.com/topic/libraries/architecture/paging/v3-overview)와 함께 SQLDelight를 사용하려면 페이징 확장 아티팩트에 의존성을 추가하세요.

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