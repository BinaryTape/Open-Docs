# SQL.js Web Worker

プロジェクトにSQL.jsのワーカーを含めるには、まず[SQL.js]への依存関係と合わせて、そのワーカーパッケージへの依存関係を追加します。
=== "Kotlin"
    ```kotlin
    kotlin {
      sourceSets.jsMain.dependencies {
        implementation(npm("@cashapp/sqldelight-sqljs-worker", "{{ versions.sqldelight }}"))
        implementation(npm("sql.js", "1.8.0"))
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin { 
      sourceSets.jsMain.dependencies {
        implementation npm("@cashapp/sqldelight-sqljs-worker", "{{ versions.sqldelight }}")
        implementation npm("sql.js", "1.8.0")
      }
    }
    ```

[SQL.js]パッケージには、アプリケーションの出力にコピーする必要があるWebAssemblyバイナリが含まれています。
プロジェクトで、ビルドされたプロジェクトへバイナリのコピーを設定するために、[追加のWebpack設定ファイル](https://kotlinlang.org/docs/js-project-setup.html#webpack-configuration-file)を追加します。

```js title="webpack.config.d/sqljs-config.js"
// {project}/webpack.config.d/sqljs.js
config.resolve = {
    fallback: {
        fs: false,
        path: false,
        crypto: false,
    }
};

const CopyWebpackPlugin = require('copy-webpack-plugin');
config.plugins.push(
    new CopyWebpackPlugin({
        patterns: [
            '../../node_modules/sql.js/dist/sql-wasm.wasm'
        ]
    })
);
```

## テストのためのKarma設定

テストの場合、WebAssemblyバイナリが実行時に配置できるようにするため、いくつか追加のKarma設定が必要です。以下をプロジェクトの`karma.config.d`ディレクトリにコピーしてください。

```js title="karma.config.d/sqljs-config.js"
const path = require("path");
const os = require("os");
const dist = path.resolve("../../node_modules/sql.js/dist/")
const wasm = path.join(dist, "sql-wasm.wasm")

config.files.push({
    pattern: wasm,
    served: true,
    watched: false,
    included: false,
    nocache: false,
});

config.proxies["/sql-wasm.wasm"] = path.join("/absolute/", wasm)

// Adapted from: https://github.com/ryanclark/karma-webpack/issues/498#issuecomment-790040818
const output = {
  path: path.join(os.tmpdir(), '_karma_webpack_') + Math.floor(Math.random() * 1000000),
}
config.set({
  webpack: {...config.webpack, output}
});
config.files.push({
  pattern: `${output.path}/**/*`,
  watched: false,
  included: false,
});
```

## ワーカーの使用

そのワーカーのスクリプトは`sqljs.worker.js`と呼ばれており、コード内で次のように参照できます。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

詳細については、「[Web Workerの使用](index.md#using-a-web-worker)」を参照してください。

[SQL.js]: https://github.com/sql-js/sql.js/