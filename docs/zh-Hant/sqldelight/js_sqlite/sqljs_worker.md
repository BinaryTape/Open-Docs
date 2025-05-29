# SQL.js 網路工作者

若要在您的專案中包含 SQL.js 網路工作者，首先請新增對該網路工作者套件以及 [SQL.js] 的相依性。
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

[SQL.js] 套件包含一個 WebAssembly 二進位檔，該檔案必須複製到您應用程式的輸出位置。
在您的專案中，新增一個 [額外的 Webpack 設定檔](https://kotlinlang.org/docs/js-project-setup.html#webpack-configuration-file) 以配置將該二進位檔複製到您組裝好的專案中。

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

## 設定 Karma 進行測試

為了測試，還需要一些額外的 Karma 設定，以便 WebAssembly 二進位檔能在執行時被定位。將以下內容複製到您專案的 `karma.config.d` 目錄中。

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

## 使用網路工作者

該網路工作者指令碼名為 `sqljs.worker.js`，可以在程式碼中如此引用：

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

請參閱「[使用網路工作者](index.md#using-a-web-worker)」以取得更多詳細資訊。

[SQL.js]: https://github.com/sql-js/sql.js/