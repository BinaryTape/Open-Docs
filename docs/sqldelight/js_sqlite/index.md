---
async: true
---
# 在 Kotlin/JS 上开始使用 SQLDelight

!!! info
    同步的 `sqljs-driver`（2.0 版本之前）已被异步的 `web-worker-driver` 取代。
    这需要您在 Gradle 配置中设置 `generateAsync`。

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

Web Worker 驱动允许 SQLDelight 与运行在 [Web Worker] 中的 SQL 实现进行通信。这使得所有数据库操作都能在后台进程中进行。

!!! info
    Web Worker 驱动仅兼容浏览器目标。

## 配置 Web Worker

SQLDelight 的 Web Worker 驱动不绑定于特定的工作线程实现。相反，该驱动使用一组标准化的消息与工作线程通信。SQLDelight 提供了一个使用 [SQL.js] 的工作线程实现。

请参阅 [SQL.js Worker] 页面了解如何为您的项目设置它，或参阅 [Custom Workers] 页面了解如何实现您自己的工作线程。

## 使用 Web Worker

创建 Web Worker 驱动实例时，您必须传递一个对将用于处理所有 SQL 操作的 Web Worker 的引用。`Worker` 构造函数接受一个引用工作线程脚本的 `URL` 对象。

Webpack 对从已安装的 NPM 包中引用工作线程脚本有特殊支持，通过将 `import.meta.url` 作为第二个参数传递给 `URL` 构造函数。Webpack 将在构建时自动捆绑引用 NPM 包中的工作线程脚本。以下示例展示了从 SQLDelight 的 [SQL.js Worker] 创建一个 Worker。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    为了让 Webpack 在捆绑时正确解析此 URL，您必须如上所示，将 `URL` 对象完全构造在 `js()` 块内，并带上 `import.meta.url` 参数。

从这里开始，您可以像使用任何其他 SQLDelight 驱动一样使用此驱动。

## 使用查询

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md