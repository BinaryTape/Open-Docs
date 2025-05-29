---
async: true
---
# 在 Kotlin/JS 上開始使用 SQLDelight

!!! info
    同步的 `sqljs-driver` (2.0 之前) 已被非同步的 `web-worker-driver` 取代。
    這要求您在 Gradle 配置中設定 `generateAsync` 選項。

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

Web Worker 驅動程式允許 SQLDelight 與在 [Web Worker] 中執行的 SQL 實作進行通訊。這使得所有資料庫操作都能在背景程序中執行。

!!! info
    Web Worker 驅動程式僅與瀏覽器目標相容。

## 配置 Web Worker

SQLDelight 的 Web Worker 驅動程式並未綁定到某個特定的 Worker 實作。相反地，該驅動程式使用一套標準化的訊息與 Worker 進行通訊。SQLDelight 提供了一個使用 [SQL.js] 的 Worker 實作。

有關如何在您的專案中設定它的詳細資訊，請參閱 [SQL.js Worker] 頁面；有關如何實作您自己的 Worker，則請參閱 [Custom Workers] 頁面。

## 使用 Web Worker

建立 Web Worker 驅動程式實例時，您必須傳遞一個對 Web Worker 的參考，該 Worker 將用於處理所有 SQL 操作。`Worker` 建構式接受一個參考 Worker 腳本的 `URL` 物件。

Webpack 透過將 `import.meta.url` 作為第二個參數傳遞給 `URL` 建構式，對從已安裝的 NPM 套件中引用 Worker 腳本有特殊支援。Webpack 將在建置時自動捆綁來自所引用 NPM 套件的 Worker 腳本。下面的範例展示了從 SQLDelight 的 [SQL.js Worker] 建立一個 Worker。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    為了讓 Webpack 在捆綁時正確解析此 URL，您必須如上所示，將 `URL` 物件完全在 `js()` 區塊內建構，並帶有 `import.meta.url` 參數。

從這裡開始，您就可以像使用任何其他 SQLDelight 驅動程式一樣使用它。

## 使用查詢

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md