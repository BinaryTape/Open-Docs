# SQL.js Web Worker

要在你的项目中包含 SQL.js worker，首先添加对 worker 软件包的依赖项以及对 [SQL.js] 的依赖项。
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

[SQL.js] 软件包包含一个 WebAssembly 二进制文件，该文件必须复制到应用程序的输出中。
在你的项目中，添加一个[额外的 Webpack 配置文件](https://kotlinlang.org/docs/js-project-setup.html#webpack-configuration-file)
来配置将二进制文件复制到组装的项目中。

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

## 为测试配置 Karma

对于测试，还需要一些额外的 Karma 配置，以便在运行时可以找到 WebAssembly 二进制文件。将以下内容复制到你项目的 `karma.config.d` 目录中。

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

worker 脚本名为 `sqljs.worker.js`，可以在代码中像这样引用：

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

请参阅“[使用 Web Worker](index.md#using-a-web-worker)”了解更多详情。

[SQL.js]: https://github.com/sql-js/sql.js/