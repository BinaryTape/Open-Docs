# AndroidX Paging

SQLDelight를 Android의 [Paging 3 라이브러리](https://developer.android.com/topic/libraries/architecture/paging/v3-overview)와 함께 사용하려면 페이징 확장 아티팩트에 대한 의존성을 추가해야 합니다.
AndroidX Paging에 대한 멀티플랫폼 지원은 [Multiplatform Paging](https://github.com/cashapp/multiplatform-paging)을 통해 제공됩니다.

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