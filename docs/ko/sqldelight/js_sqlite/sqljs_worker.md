# SQL.js 웹 워커

프로젝트에 SQL.js 워커를 포함하려면, 우선 [SQL.js] 의존성과 함께 워커 패키지에 대한 의존성을 추가하세요.

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

[SQL.js] 패키지에는 애플리케이션의 출력물(output)로 복사되어야 하는 WebAssembly 바이너리가 포함되어 있습니다.
프로젝트에 [추가 Webpack 설정 파일](https://kotlinlang.org/docs/js-project-setup.html#webpack-configuration-file)을 추가하여 빌드된 프로젝트로 바이너리가 복사되도록 설정하세요.

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

## 테스트를 위한 Karma 설정

테스트의 경우, 런타임에 WebAssembly 바이너리를 찾을 수 있도록 몇 가지 추가 Karma 설정이 필요합니다. 다음 내용을 프로젝트의 `karma.config.d` 디렉터리에 복사하세요.

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

## 워커 사용하기

워커 스크립트의 이름은 `sqljs.worker.js`이며, 코드에서 다음과 같이 참조할 수 있습니다.

```kotlin
val driver = WebWorkerDriver(
  Worker(
    js("""new URL("@cashapp/sqldelight-sqljs-worker/sqljs.worker.js", import.meta.url)""")
  )
)
```

자세한 내용은 "[웹 워커 사용하기](index.md#using-a-web-worker)"를 참고하세요.

[SQL.js]: https://github.com/sql-js/sql.js/