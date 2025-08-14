[//]: # (title: 型安全なルーティング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="resource-routing"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

<link-summary>Resourcesプラグインを使用すると、型安全なルーティングを実装できます。</link-summary>

Ktorは、型安全な[ルーティング](server-routing.md)を実装できる[Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html)プラグインを提供します。これを実現するには、型付きルートとして機能するクラスを作成し、そのクラスを`@Resource`キーワードでアノテーションする必要があります。`@Resource`アノテーションには、kotlinx.serializationライブラリによって提供される`@Serializable`の振る舞いがあることに注意してください。

> Ktorクライアントは、サーバーに対して[型付きリクエスト](client-resources.md)を行う機能を提供します。

## 依存関係を追加する {id="add_dependencies"}

### kotlinx.serializationを追加する {id="add_serialization"}

[リソースクラス](#resource_classes)が`@Serializable`の振る舞いを持つ必要があるため、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlin serializationプラグインを追加する必要があります。

### %plugin_name%の依存関係を追加する {id="add_plugin_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
    

## %plugin_name%をインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出しの内部。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>の内部。これは<code>Application</code>クラスの拡張関数です。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## リソースクラスを作成する {id="resource_classes"}

<snippet id="resource_classes_server">

各リソースクラスには`@Resource`アノテーションが必要です。
以下では、リソースクラスのいくつかの例（単一のパスセグメントの定義、クエリおよびパスパラメータなど）を見ていきます。

### リソースURL {id="resource_url"}

以下の例は、`/articles`パスで応答するリソースを指定する`Articles`クラスを定義する方法を示しています。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### クエリパラメータを持つリソース {id="resource_query_param"}

以下の`Articles`クラスには、[クエリパラメータ](server-requests.md#query_parameters)として機能する`sort`文字列プロパティがあり、`sort`クエリパラメータを持つ次のパスで応答するリソースを定義できます: `/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### ネストされたクラスを持つリソース {id="resource_nested"}

複数のパスセグメントを含むリソースを作成するためにクラスをネストできます。この場合、ネストされたクラスは外部クラス型のプロパティを持つ必要があることに注意してください。
以下の例は、`/articles/new`パスで応答するリソースを示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### パスパラメータを持つリソース {id="resource_path_param"}

以下の例は、パスセグメントに一致し、`id`という名前のパラメータとしてキャプチャする[ネストされた](#resource_nested)`{id}`整数[パスパラメータ](server-routing.md#path_parameter)を追加する方法を示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例として、このリソースは`/articles/12`で応答するために使用できます。

</snippet>

### 例: CRUD操作のためのリソース {id="example_crud"}

上記の例をまとめ、CRUD操作のための`Articles`リソースを作成しましょう。

[object Promise]

このリソースは、すべての記事を一覧表示したり、新しい記事を投稿したり、編集したりするために使用できます。次の章で、このリソースの[ルートハンドラ](#define_route)を定義する方法を見ていきます。

> 完全な例はこちらで確認できます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## ルートハンドラを定義する {id="define_route"}

型付きリソースの[ルートハンドラ](server-routing.md#define_route)を定義するには、リソースクラスをverb関数（`get`、`post`、`put`など）に渡す必要があります。
例えば、以下のルートハンドラは`/articles`パスで応答します。

```kotlin
@Resource("/articles")
class Articles()

fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { articles ->
            // Get all articles ...
            call.respondText("List of articles: $articles")
        }
    }
}
```

以下の例は、[](#example_crud)で作成された`Articles`リソースのルートハンドラを定義する方法を示しています。ルートハンドラ内で、パラメータとして`Article`にアクセスし、そのプロパティ値を取得できることに注意してください。

[object Promise]

各エンドポイントの要求を処理するためのいくつかのヒントを次に示します。

- `get<Articles>`

   このルートハンドラは、`sort`クエリパラメータに従ってソートされたすべての記事を返すことになっています。
   例えば、これはすべての記事を含む[HTMLページ](server-responses.md#html)または[JSONオブジェクト](server-responses.md#object)であるかもしれません。

- `get<Articles.New>`

   このエンドポイントは、新しい記事を作成するためのフィールドを含む[Webフォーム](server-responses.md#html)で応答します。
- `post<Articles>`

   `post<Articles>`エンドポイントは、Webフォームを使用して送信された[パラメータ](server-requests.md#form_parameters)を受け取ることになっています。
   Ktorでは、`ContentNegotiation`プラグインを使用してJSONデータを[オブジェクト](server-requests.md#objects)として受け取ることもできます。
- `get<Articles.Id>`

   このルートハンドラは、指定された識別子を持つ記事を返すことになっています。
   これは、記事を表示する[HTMLページ](server-responses.md#html)または記事データを含む[JSONオブジェクト](server-responses.md#object)であるかもしれません。
- `get<Articles.Id.Edit>`

  このエンドポイントは、既存の記事を編集するためのフィールドを含む[Webフォーム](server-responses.md#html)で応答します。
- `put<Articles.Id>`

   `post<Articles>`エンドポイントと同様に、`put`ハンドラはWebフォームを使用して送信された[フォームパラメータ](server-requests.md#form_parameters)を受け取ります。
- `delete<Articles.Id>`

   このルートハンドラは、指定された識別子を持つ記事を削除します。

完全な例はこちらで確認できます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## リソースからリンクを構築する {id="resource_links"}

リソース定義をルーティングに使用するだけでなく、リンクの構築にも使用できます。
これは_リバースルーティング_と呼ばれることもあります。
リソースからリンクを構築することは、[HTML DSL](server-html-dsl.md)で作成されたHTMLドキュメントにこれらのリンクを追加する必要がある場合や、[リダイレクト応答](server-responses.md#redirect)を生成する必要がある場合に役立ちます。

`Resources`プラグインは、`Resource`からリンクを生成できるオーバーロードされた[href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html)メソッドで`Application`を拡張します。例えば、以下のコードスニペットは、[上記](#example_crud)で定義された`Edit`リソースのリンクを作成します。

[object Promise]

祖先である`Articles`リソースがデフォルト値`new`を持つ`sort`クエリパラメータを定義しているため、`link`変数には以下が含まれます。

```
/articles/123/edit?sort=new
```

ホストとプロトコルを指定するURLを生成するには、`href`メソッドに`URLBuilder`を提供できます。
この例に示すように、追加のクエリパラメータも`URLBuilder`を使用して指定できます。

[object Promise]

その後、`link`変数には以下が含まれます。

```
https://ktor.io/articles?token=123
```

### 例 {id="example_build_links"}

以下の例は、リソースから構築されたリンクをHTML応答に追加する方法を示しています。

[object Promise]

完全な例はこちらで確認できます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。