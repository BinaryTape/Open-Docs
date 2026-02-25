## Flow

쿼리를 Flow로 사용하려면, 코루틴 확장(Coroutines extensions) 아티팩트에 대한 의존성을 추가하고 제공되는 확장 메서드를 사용하세요:

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