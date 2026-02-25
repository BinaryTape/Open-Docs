## Flow

쿼리를 Flow로 소비하려면 coroutines extensions 아티팩트를 의존성으로 추가하고 해당 아티팩트가 제공하는 확장 함수를 사용하세요:

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