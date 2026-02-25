# SQL.js Web Worker

若要在專案中包含 SQL.js worker，請先新增 worker 套件的相依性以及對 [SQL.js] 的相依性。
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

[SQL.js] 套件包含一個 WebAssembly 二進制檔案，必須將其複製到應用程式的輸出中。
在您的專案中，新增一個[額外的 Webpack 組建組態檔案](https://kotlinlang.org/docs/js-project-setup.html#webpack-configuration-file)，以配置將二進制檔案複製到已組建專案的設定。

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

## 為測試配置 Karma

對於測試，還需要一些額外的 Karma 配置，以便在執行時期定位 WebAssembly 二進制檔案。請將以下內容複製到專案的 `karma.config.d` 目錄中。

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

## 使用 Worker

Worker 指令碼名為 `sqljs.worker.js`，可以像這樣在程式碼中引用：

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

請參閱「[使用 Web Worker](index.md#using-a-web-worker)」了解更多詳細資訊。

[SQL.js]: https://github.com/sql-js/sql.js/