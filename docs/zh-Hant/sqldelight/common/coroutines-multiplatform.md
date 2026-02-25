## Flow

若要將查詢作為 Flow 取用，請加入 Coroutines 擴充功能構件（artifact）的相依性，並使用其提供的擴充方法：

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