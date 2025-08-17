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
Ktorは、React、Angular、Vueなどのシングルページアプリケーションを提供する機能を提供します。
</link-summary>

Ktorは、React、Angular、Vueなどのシングルページアプリケーションを提供する機能を提供します。

## 依存関係の追加 {id="add_dependencies"}

シングルページアプリケーションを提供するには、`ktor-server-core` [依存関係](server-dependencies.topic#add-ktor-dependencies)のみが必要です。
特定の依存関係は不要です。

## アプリケーションの提供 {id="configure"}

シングルページアプリケーションを提供するには、コンテンツをどこから提供するか（ローカルファイルシステムまたはクラスパス）を定義する必要があります。
少なくとも、シングルページアプリケーションを含むフォルダ/リソースパッケージを指定する必要があります。

### フレームワーク固有のアプリケーションの提供 {id="serve-framework"}

React、Angular、Vueなどの特定のフレームワークを使用して作成されたシングルページアプリケーションのビルドを提供できます。
プロジェクトルートにReactアプリケーションを含む`react-app`フォルダがあるとします。
アプリケーションは次の構造を持ち、`index.html`ファイルがメインページです。

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

このアプリケーションを提供するには、`routing` [ブロック](server-routing.md)内で`singlePageApplication`を呼び出し、フォルダ名を`react`関数に渡します。

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

Ktorは自動的に`index.html`を検索します。
デフォルトページをカスタマイズする方法については、「[サービング設定のカスタマイズ](#serve-customize)」を参照してください。

> その他のフレームワークについては、`angular`、`vue`、`ember`などの対応する関数を使用してください。

### サービング設定のカスタマイズ {id="serve-customize"}

リソースからシングルページアプリケーションを提供する方法を説明するために、アプリケーションが次の構造を持つ`sample-web-app`リソースパッケージ内に配置されているとします。

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

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.module() {
    routing {
        singlePageApplication {
            useResources = true
            filesPath = "sample-web-app"
            defaultPage = "main.html"
            ignoreFiles { it.endsWith(".txt") }
        }
    }
}
```

- `useResources`: リソースパッケージからアプリケーションを提供することを有効にします。
- `filesPath`: アプリケーションが配置されているパスを指定します。
- `defaultPage`: `main.html`をデフォルトで提供するリソースとして指定します。
- `ignoreFiles`: 末尾に`.txt`を含むパスを無視します。

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)で確認できます。