---
async: true
---
# Kotlin/JS で SQLDelight を使い始める

!!! info
    同期型の `sqljs-driver`（2.0 未満）は、非同期型の `web-worker-driver` に置き換えられました。
    これには、Gradle 設定で `generateAsync` 設定を構成する必要があります。

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

web worker driver を使用すると、SQLDelight は [Web Worker] 内で実行されている SQL 実装と通信できるようになります。これにより、すべてのデータベース操作をバックグラウンドプロセスで実行できます。

!!! info
    web worker driver はブラウザターゲットとのみ互換性があります。

## Web Worker の構成

SQLDelight の web worker driver は、特定のワーカー実装に固定されているわけではありません。その代わりに、ドライバーは標準化されたメッセージセットを使用してワーカーと通信します。SQLDelight は [SQL.js] を使用するワーカーの実装を提供しています。

プロジェクトでのセットアップの詳細については [SQL.js Worker] ページを、独自のワーカーを実装する方法の詳細については [Custom Workers] ページを参照してください。

## Web Worker の使用

web worker driver のインスタンスを作成する際、すべての SQL 操作を処理するために使用される Web Worker への参照を渡す必要があります。`Worker` コンストラクタは、ワーカースクリプトを参照する `URL` オブジェクトを受け取ります。

Webpack は、`URL` コンストラクタの第 2 引数として `import.meta.url` を渡すことで、インストールされた NPM パッケージからワーカースクリプトを参照するための特別なサポートを備えています。Webpack は、ビルド時に参照された NPM パッケージからワーカースクリプトを自動的にバンドルします。以下の例は、SQLDelight の [SQL.js Worker] から Worker を作成する方法を示しています。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    Webpack がバンドル中にこの URL を正しく解決できるようにするには、上記の `import.meta.url` 引数を使用した例のように、`URL` オブジェクトを完全に `js()` ブロック内で構築する必要があります。

ここからは、他の SQLDelight ドライバーと同じようにドライバーを使用できます。

## クエリの使用

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md