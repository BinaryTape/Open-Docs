---
async: true
---
# SQLDelight on Kotlin/JS 入门

!!! info
    同步的 `sqljs-driver`（2.0 之前版本）已被异步的 `web-worker-driver` 取代。
    这需要在您的 Gradle 构建配置中配置 `generateAsync` 设置。

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

Web Worker 驱动程序允许 SQLDelight 与运行在 [Web Worker] 中的 SQL 实现进行通信。这允许所有数据库操作都在后台进程中进行。

!!! info
    Web Worker 驱动程序仅与浏览器目标兼容。 

## 配置 Web Worker

SQLDelight 的 Web Worker 驱动程序并不绑定到特定的 Worker 实现。相反，该驱动程序使用标准消息集与 Worker 通信。SQLDelight 提供了一个使用 [SQL.js] 的 Worker 实现。

有关在项目中进行设置的详细信息，请参阅 [SQL.js Worker] 页面；有关实现自定义 Worker 的详细信息，请参阅 [Custom Workers] 页面。

## 使用 Web Worker

创建 Web Worker 驱动程序实例时，您必须传递一个对 Web Worker 的引用，该 Worker 将用于处理所有 SQL 操作。`Worker` 构造函数接受指向 Worker 脚本的 `URL` 对象。

Webpack 通过将 `import.meta.url` 作为第二个实参传递给 `URL` 构造函数，为引用已安装 NPM 软件包中的 Worker 脚本提供了特殊支持。Webpack 将在构建时自动打包来自所引用的 NPM 软件包中的 Worker 脚本。下面的示例展示了从 SQLDelight 的 [SQL.js Worker] 创建的 Worker。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    为了让 Webpack 在打包时正确解析此 URL，您必须完全在 `js()` 块内构造 `URL` 对象，如上所示，并带有 `import.meta.url` 实参。

从这里开始，您可以像使用任何其他 SQLDelight 驱动程序一样使用该驱动程序。

## 使用查询

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md