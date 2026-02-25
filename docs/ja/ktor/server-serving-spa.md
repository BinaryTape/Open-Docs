[//]: # (title: シングルページアプリケーションの配信)

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
Ktorは、React、Angular、Vueなどのシングルページアプリケーションを配信する機能を提供します。
</link-summary>

Ktorは、React、Angular、Vueなどのシングルページアプリケーション（SPA）を配信する機能を提供します。

## 依存関係の追加 {id="add_dependencies"}

シングルページアプリケーションを配信するには、[ktor-server-core](server-dependencies.topic#add-ktor-dependencies) の依存関係のみが必要です。
特定の依存関係は必要ありません。

## アプリケーションの配信 {id="configure"}

シングルページアプリケーションを配信するには、コンテンツをどこから配信するか（ローカルファイルシステムまたはクラスパス）を定義する必要があります。
少なくとも、シングルページアプリケーションが含まれているフォルダーまたはリソースパッケージを指定する必要があります。

### フレームワーク固有のアプリケーションの配信 {id="serve-framework"}

React、Angular、Vueなどの特定のフレームワークを使用して作成されたシングルページアプリケーションのビルドを配信できます。
プロジェクトのルートに、Reactアプリケーションを含む `react-app` フォルダーがあるとします。
このアプリケーションは以下の構造を持ち、`index.html` ファイルがメインページとなります。

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

このアプリケーションを配信するには、[routing](server-routing.md) ブロック内で [singlePageApplication](https://api.ktor.io/ktor-server-core/io.ktor.server.http.content/single-page-application.html) を呼び出し、`react` 関数にフォルダー名を渡します。

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

Ktorは自動的に `index.html` を検索します。
デフォルトページをカスタマイズする方法については、[配信設定のカスタマイズ](#serve-customize)を参照してください。

> 他のフレームワークについては、`angular`、`vue`、`ember` などの対応する関数を使用してください。

### 配信設定のカスタマイズ {id="serve-customize"}

リソースからシングルページアプリケーションを配信する方法を示すために、アプリケーションが以下の構造を持つ `sample-web-app` リソースパッケージ内に配置されていると仮定します。

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

このアプリケーションを配信するには、以下の構成を使用します。

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

- `useResources`: リソースパッケージからのアプリケーション配信を有効にします。
- `filesPath`: アプリケーションが配置されているパスを指定します。
- `defaultPage`: 配信するデフォルトのリソースとして `main.html` を指定します。
- `ignoreFiles`: 末尾が `.txt` で終わるパスを無視します。

完全な例はこちらにあります：[single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)