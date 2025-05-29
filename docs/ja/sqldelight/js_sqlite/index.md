---
async: true
---
# Kotlin/JS で SQLDelight を使い始める

!!! info
    同期版の `sqljs-driver` (2.0より前のバージョン) は、非同期版の `web-worker-driver` に置き換えられました。
    これには、Gradle設定で `generateAsync` 設定を構成する必要があります。

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

ウェブワーカードライバーを使用すると、SQLDelight は [Web Worker] で実行されている SQL 実装と通信できます。これにより、すべてのデータベース操作がバックグラウンドプロセスで実行されるようになります。

!!! info
    ウェブワーカードライバーはブラウザターゲットとのみ互換性があります。

## Web Worker の設定

SQLDelight のウェブワーカードライバーは、特定のワーカー実装に縛られていません。その代わりに、ドライバーは標準化されたメッセージセットを使用してワーカーと通信します。SQLDelight は、[SQL.js] を使用するワーカーの実装を提供します。

プロジェクトでのセットアップの詳細については、[SQL.js Worker] ページを、または独自のワーカーの実装の詳細については、[Custom Workers] ページを参照してください。

## Web Worker の使用

ウェブワーカードライバーのインスタンスを作成する際、すべての SQL 操作を処理するために使用されるウェブワーカーへの参照を渡す必要があります。`Worker` コンストラクタは、ワーカー スクリプトを参照する `URL` オブジェクトを受け取ります。

Webpack は、インストールされた NPM パッケージからワーカー スクリプトを参照するための特別なサポートを提供しており、`URL` コンストラクタに2番目の引数として `import.meta.url` を渡すことができます。Webpack はビルド時に参照された NPM パッケージからワーカー スクリプトを自動的にバンドルします。以下の例は、SQLDelight の [SQL.js Worker] から `Worker` が作成される様子を示しています。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

!!! warning
    Webpack がバンドル中にこの URL を正しく解決するためには、上記の `import.meta.url` 引数を使用した例のように、`URL` オブジェクトを `js()` ブロック内で完全に構築する必要があります。

ここから、他の SQLDelight ドライバーと同様にドライバーを使用できます。

## クエリの使用

{% include 'common/index_queries.md' %}

[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[SQL.js]: https://github.com/sql-js/sql.js/
[SQL.js Worker]: sqljs_worker.md
[Custom Workers]: custom_worker.md