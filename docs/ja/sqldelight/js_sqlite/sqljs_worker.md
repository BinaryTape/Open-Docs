# SQL.js Web Worker

プロジェクトに SQL.js worker を含めるには、まず worker パッケージへの依存関係と [SQL.js] への依存関係を追加します。
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

[SQL.js] パッケージには、アプリケーションの出力先にコピーする必要がある WebAssembly バイナリが含まれています。
プロジェクトに [追加の Webpack 設定ファイル](https://kotlinlang.org/docs/js-project-setup.html#webpack-configuration-file) を追加し、ビルドされたプロジェクトへのバイナリのコピーを設定します。

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

## テスト用 Karma の設定

テストでは、実行時に WebAssembly バイナリを特定できるようにするために、追加の Karma 設定も必要です。以下をプロジェクトの `karma.config.d` ディレクトリにコピーしてください。

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

## Worker の使用

worker スクリプトは `sqljs.worker.js` という名前で、以下のようにコード内で参照できます。

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

詳細については「[Web Worker の使用](index.md#using-a-web-worker)」を参照してください。

[SQL.js]: https://github.com/sql-js/sql.js/