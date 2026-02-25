---
async: true
---
# Kotlin/JS에서 SQLDelight 시작하기

!!! info
    동기식 `sqljs-driver` (2.0 이전 버전)는 비동기식 `web-worker-driver`로 대체되었습니다.
    이를 위해서는 Gradle 설정에서 `generateAsync` 설정을 구성해야 합니다.

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

웹 워커(Web Worker) 드라이버를 사용하면 SQLDelight가 [Web Worker]에서 실행 중인 SQL 구현체와 통신할 수 있습니다. 이를 통해 모든 데이터베이스 작업을 백그라운드 프로세스에서 처리할 수 있습니다.

!!! info
    웹 워커 드라이버는 브라우저 타겟(browser targets)과만 호환됩니다. 

## 웹 워커 설정하기

SQLDelight의 웹 워커 드라이버는 특정 워커 구현에 종속되지 않습니다. 대신 드라이버는 표준화된 메시지 세트를 사용하여 워커와 통신합니다. SQLDelight는 [SQL.js]를 사용하는 워커 구현체를 제공합니다.

프로젝트 설정에 대한 자세한 내용은 [SQL.js 워커](sqljs_worker.md) 페이지를, 직접 워커를 구현하는 방법에 대한 자세한 내용은 [커스텀 워커](custom_worker.md) 페이지를 참조하세요.

## 웹 워커 사용하기

웹 워커 드라이버 인스턴스를 생성할 때, 모든 SQL 작업을 처리하는 데 사용할 웹 워커에 대한 참조를 전달해야 합니다. `Worker` 생성자는 워커 스크립트를 참조하는 `URL` 객체를 인자로 받습니다.

Webpack은 `URL` 생성자의 두 번째 인자로 `import.meta.url`을 전달하여 설치된 NPM 패키지의 워커 스크립트를 참조하는 기능을 특별히 지원합니다. Webpack은 빌드 시점에 참조된 NPM 패키지에서 워커 스크립트를 자동으로 번들링합니다. 아래 예제는 SQLDelight의 [SQL.js 워커](sqljs_worker.md)를 사용하여 워커를 생성하는 방법을 보여줍니다.

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    Webpack이 번들링 중에 이 URL을 올바르게 해석하도록 하려면, 위 예시처럼 `import.meta.url` 인자와 함께 `js()` 블록 내에서 전체 `URL` 객체를 생성해야 합니다.

이 시점부터는 다른 SQLDelight 드라이버와 동일하게 드라이버를 사용할 수 있습니다.

## 쿼리 사용하기

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md