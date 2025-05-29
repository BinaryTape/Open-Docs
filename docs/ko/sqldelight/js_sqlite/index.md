---
async: true
---
# Kotlin/JS에서 SQLDelight 시작하기

!!! info
    동기(synchronous) 방식의 `sqljs-driver` (2.0 이전)가 비동기(asynchronous) 방식의 `web-worker-driver`로 대체되었습니다. 이를 위해 Gradle 설정에서 `generateAsync` 설정을 구성해야 합니다.

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.jsMain.dependencies {
        implementation("app.cash.sqldelight:web-worker-driver:{{ versions.sqldelight }}")
        implementation(devNpm("copy-webpack-plugin", "9.1.0"))
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      sourceSets.jsMain.dependencies {
        implementation "app.cash.sqldelight:web-worker-driver:{{ versions.sqldelight }}"
        implementation devNpm("copy-webpack-plugin", "9.1.0")
      }
    }
    ```

웹 워커 드라이버를 사용하면 SQLDelight가 [웹 워커]에서 실행되는 SQL 구현체와 통신할 수 있습니다. 이를 통해 모든 데이터베이스 작업이 백그라운드 프로세스에서 수행될 수 있습니다.

!!! info
    웹 워커 드라이버는 브라우저 타겟(browser targets)에서만 호환됩니다.

## 웹 워커 구성하기

SQLDelight의 웹 워커 드라이버는 특정 워커 구현체에 얽매이지 않습니다. 대신 드라이버는 표준화된 메시지 집합을 사용하여 워커와 통신합니다. SQLDelight는 [SQL.js]를 사용하는 워커의 구현체를 제공합니다.

프로젝트에 설정하는 방법에 대한 자세한 내용은 [SQL.js 워커] 페이지를 참조하고, 직접 구현하는 방법에 대한 자세한 내용은 [사용자 정의 워커] 페이지를 참조하세요.

## 웹 워커 사용하기

웹 워커 드라이버 인스턴스를 생성할 때, 모든 SQL 작업을 처리하는 데 사용될 웹 워커에 대한 참조를 전달해야 합니다. `Worker` 생성자는 워커 스크립트를 참조하는 `URL` 객체를 받습니다.

Webpack은 `import.meta.url`을 `URL` 생성자의 두 번째 인자로 전달하여 설치된 NPM 패키지로부터 워커 스크립트를 참조하는 특별한 기능을 지원합니다. Webpack은 빌드 시 참조된 NPM 패키지의 워커 스크립트를 자동으로 번들링합니다. 아래 예시는 SQLDelight의 [SQL.js 워커]에서 워커를 생성하는 방법을 보여줍니다.

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    Webpack이 번들링 중에 이 `URL`을 올바르게 해석하려면, 위에서 `import.meta.url` 인자와 함께 보여준 바와 같이 `URL` 객체를 `js()` 블록 내에서 완전히 구성해야 합니다.

여기에서부터 다른 SQLDelight 드라이버와 마찬가지로 드라이버를 사용할 수 있습니다.

## 쿼리 사용하기

{% include 'common/index_queries.md' %}

[웹 워커]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js 워커]: sqljs_worker.md
[사용자 정의 워커]: custom_worker.md