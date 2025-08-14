[//]: # (title: シングルページアプリケーションの提供)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
Ktorは、React、Angular、Vueなどのシングルページアプリケーションを提供できます。
</link-summary>

Ktorは、React、Angular、Vueなどのシングルページアプリケーションを提供する機能を提供します。

## 依存関係の追加 {id="add_dependencies"}

シングルページアプリケーションを提供するには、[ktor-server-core](server-dependencies.topic#add-ktor-dependencies)の依存関係のみが必要です。特定の依存関係は必要ありません。

## アプリケーションの提供 {id="configure"}

シングルページアプリケーションを提供するには、コンテンツをどこから提供するか（ローカルファイルシステムまたはクラスパス）を定義する必要があります。少なくとも、シングルページアプリケーションを含むフォルダー/リソースパッケージを指定する必要があります。

### フレームワーク固有のアプリケーションの提供 {id="serve-framework"}

React、Angular、Vueなどの特定のフレームワークを使用して作成されたシングルページアプリケーションのビルドを提供できます。
プロジェクトのルートにReactアプリケーションを含む`react-app`フォルダーがあるとします。
アプリケーションは次の構造を持ち、`index.html`ファイルがメインページです。

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

このアプリケーションを提供するには、[routing](server-routing.md)ブロック内で[singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)を呼び出し、フォルダー名を`react`関数に渡します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.module() {
    routing {
        singlePageApplication {
            react("react-app")
        }
    }
}
```

Ktorは`index.html`を自動的に検索します。
デフォルトページのカスタマイズ方法については、[](#serve-customize)を参照してください。

> 他のフレームワークについては、`angular`、`vue`、`ember`などの対応する関数を使用してください。

### 提供設定のカスタマイズ {id="serve-customize"}

リソースからシングルページアプリケーションを提供する方法を示すために、アプリケーションが次の構造を持つ`sample-web-app`リソースパッケージ内に配置されていると仮定しましょう。

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

このアプリケーションを提供するには、次の設定が使用されます。

[object Promise]

- `useResources`: リソースパッケージからのアプリケーション提供を有効にします。
- `filesPath`: アプリケーションが配置されているパスを指定します。
- `defaultPage`: `main.html`をデフォルトのリソースとして提供するように指定します。
- `ignoreFiles`: 末尾に`.txt`を含むパスを無視します。

完全な例はこちらで確認できます: [single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)。