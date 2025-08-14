[//]: # (title: 型安全なリクエスト)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-type-safe-requests"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
Resources プラグインを使用して型安全なリクエストを作成する方法を学びます。
</link-summary>

Ktor は、型安全な [リクエスト](client-requests.md) を実装できる `%plugin_name%` プラグインを提供します。これを実現するには、サーバーで利用可能なリソースを記述するクラスを作成し、`@Resource` キーワードを使用してこのクラスにアノテーションを付ける必要があります。なお、`@Resource` アノテーションには、kotlinx.serialization ライブラリによって提供される `@Serializable` の振る舞いがあります。

> Ktor サーバーは [型安全なルーティング](server-resources.md) を実装する機能を提供します。

## 依存関係を追加する {id="add_dependencies"}

### kotlinx.serialization を追加する {id="add_serialization"}

[リソースクラス](#resource_classes) は `@Serializable` の振る舞いを持つべきであるため、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup) セクションで説明されているように、Kotlin serialization プラグインを追加する必要があります。

### %plugin_name% の依存関係を追加する {id="add_plugin_dependencies"}

    <p>
        <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        Ktor クライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係を追加する</Links> を参照してください。
    </p>
    

## %plugin_name% をインストールする {id="install_plugin"}

`%plugin_name%` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client) 内の `install` 関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.resources.*
//...
val client = HttpClient(CIO) {
    install(Resources)
}
```

## リソースクラスを作成する {id="resource_classes"}

<snippet id="resource_classes_server">

各リソースクラスには `@Resource` アノテーションが必要です。
以下では、単一のパスセグメント、クエリパラメータ、パスパラメータなどを定義する、いくつかのリソースクラスの例を見ていきます。

### リソースURL {id="resource_url"}

以下の例は、`/articles` パスに応答するリソースを指定する `Articles` クラスを定義する方法を示しています。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### クエリパラメータを持つリソース {id="resource_query_param"}

以下の `Articles` クラスは、[クエリパラメータ](server-requests.md#query_parameters) として機能する `sort` 文字列プロパティを持ち、`sort` クエリパラメータを持つ以下のパスに応答するリソースを定義できます: `/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### ネストされたクラスを持つリソース {id="resource_nested"}

クラスをネストして、複数のパスセグメントを含むリソースを作成できます。この場合、ネストされたクラスは、外側のクラス型のプロパティを持つべきであることに注意してください。
以下の例は、`/articles/new` パスに応答するリソースを示しています。

```kotlin
@Resource("/articles")
class Articles() {
@Resource("new")
class New(val parent: Articles = Articles())
}
```

### パスパラメータを持つリソース {id="resource_path_param"}

以下の例は、パスセグメントに一致し、それを `id` という名前のパラメータとしてキャプチャする、[ネストされた](#resource_nested) `{id}` 整数 [パスパラメータ](server-routing.md#path_parameter) を追加する方法を示しています。

```kotlin
@Resource("/articles")
class Articles() {
@Resource("{id}")
class Id(val parent: Articles = Articles(), val id: Long)
}
```

例として、このリソースは `/articles/12` に応答するために使用できます。

</snippet>

### 例: CRUD操作のためのリソース {id="example_crud"}

上記の例をまとめて、CRUD操作のための `Articles` リソースを作成しましょう。

[object Promise]

このリソースは、すべての記事を一覧表示したり、新しい記事を投稿したり、編集したりするなどに使用できます。次のセクションでは、このリソースに [型安全なリクエストを作成する](#make_requests) 方法を見ていきます。

> 完全な例はこちらで確認できます: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 型安全なリクエストを作成する {id="make_requests"}

型付きリソースへ [リクエストを作成する](client-requests.md) には、リソースクラスのインスタンスをリクエスト関数 (`request`, `get`, `post`, `put` など) に渡す必要があります。たとえば、以下のサンプルは `/articles` パスへのリクエストを作成する方法を示しています。

```kotlin
@Resource("/articles")
class Articles()

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Resources)
            // ...
        }
        val getAllArticles = client.get(Articles())
    }
}
```

以下の例は、[](#example_crud) で作成した `Articles` リソースに型付きリクエストを作成する方法を示しています。

[object Promise]

`defaultRequest` 関数は、すべてのリクエストのデフォルトURLを指定するために使用されます。

> 完全な例はこちらで確認できます: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。