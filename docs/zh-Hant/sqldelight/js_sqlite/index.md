---
async: true
---
# 在 Kotlin/JS 上開始使用 SQLDelight

!!! info
    同步的 `sqljs-driver`（2.0 之前的版本）已被非同步的 `web-worker-driver` 取代。
    這需要在 Gradle 組建組態中設定 `generateAsync`。

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

Web worker 驅動程式允許 SQLDelight 與在 [Web Worker] 中執行的 SQL 實作進行通訊。這讓所有資料庫操作都能在背景處理序中進行。

!!! info
    Web worker 驅動程式僅與瀏覽器目標相容。 

## 設定 Web Worker

SQLDelight 的 Web worker 驅動程式並不繫結至特定背景工作執行緒的實作。相反地，此驅動程式使用一組標準化的訊息與背景工作執行緒通訊。SQLDelight 提供了一個使用 [SQL.js] 的背景工作執行緒實作。

請參閱 [SQL.js Worker] 頁面了解為專案進行設定的細節，或參閱 [Custom Workers] 頁面了解有關實作自訂背景工作執行緒的細節。

## 使用 Web Worker

建立 Web worker 驅動程式的執行個體時，必須傳遞一個 Web worker 參照，該背景工作執行緒將用於處理所有 SQL 操作。`Worker` 建構函式接受指向背景工作執行緒指令碼的 `URL` 物件。

Webpack 具有特殊支援，可透過將 `import.meta.url` 作為第二個引數傳遞給 `URL` 建構函式，來參照已安裝 NPM 軟件包中的背景工作執行緒指令碼。Webpack 會在組建階段自動從參照的 NPM 軟件包中打包背景工作執行緒指令碼。下方的範例顯示了從 SQLDelight 的 [SQL.js Worker] 建立的 Worker。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    為了讓 Webpack 在打包時能正確解析此 URL，您必須完全在 `js()` 區塊內建構 `URL` 物件，如上方帶有 `import.meta.url` 引數的範例所示。

從這裡開始，您可以像使用任何其他 SQLDelight 驅動程式一樣使用此驅動程式。

## 使用查詢

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md