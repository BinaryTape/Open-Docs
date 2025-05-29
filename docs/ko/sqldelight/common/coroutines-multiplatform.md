## 플로우

쿼리를 Flow로 사용하려면 Coroutines 확장 아티팩트에 의존하고, 해당 아티팩트가 제공하는 확장 메서드를 사용하세요.

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.commonMain.dependencies {
        implementation("app.cash.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      sourceSets.commonMain.dependencies {
        implementation "app.cash.sqldelight:coroutines-extensions:{{ versions.sqldelight }}"
      }
    }
    ```

{% include 'common/coroutines-usage.md' %}