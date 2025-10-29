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
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

<link-summary>Resourcesプラグインを使用すると、型安全なルーティングを実装できます。</link-summary>

Ktorは、型安全な[ルーティング](server-routing.md)を実装できる[Resources](https://api.ktor.io/ktor-resources/io.ktor.resources/-resources/index.html)プラグインを提供します。これを実現するには、型付きルートとして機能するクラスを作成し、このクラスに`@Resource`キーワードを使用してアノテーションを付ける必要があります。なお、`@Resource`アノテーションはkotlinx.serializationライブラリによって提供される`@Serializable`の動作を持ちます。

> Ktorクライアントは、サーバーに対して[型付けされたリクエスト](client-resources.md)を行う機能を提供します。

## 依存関係の追加 {id="add_dependencies"}

### kotlinx.serializationの追加 {id="add_serialization"}

[リソースクラス](#resource_classes)が`@Serializable`の動作を持つべきであるため、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlinシリアライゼーションプラグインを追加する必要があります。

### %plugin_name%の依存関係の追加 {id="add_plugin_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name%のインストール {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内。
    </li>
    <li>
        ... 明示的に定義された<code>module</code>内（<code>Application</code>クラスの拡張関数）。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## リソースクラスの作成 {id="resource_classes"}

<snippet id="resource_classes_server">

各リソースクラスには`@Resource`アノテーションが必要です。
以下では、単一のパスセグメント、クエリパラメーターやパスパラメーターなどを定義する、いくつかのリソースクラスの例を見ていきます。

### リソースURL {id="resource_url"}

以下の例は、`/articles`パスに応答するリソースを指定する`Articles`クラスを定義する方法を示しています。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### クエリパラメーターを持つリソース {id="resource_query_param"}

以下の`Articles`クラスは、[クエリパラメーター](server-requests.md#query_parameters)として機能する`sort`文字列プロパティを持ち、`sort`クエリパラメーターを含む次のパス(`/articles?sort=new`)に応答するリソースを定義できます。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### ネストされたクラスを持つリソース {id="resource_nested"}

クラスをネストして、複数のパスセグメントを含むリソースを作成できます。この場合、ネストされたクラスが外部クラス型のプロパティを持つ必要があることに注意してください。
以下の例は、`/articles/new`パスに応答するリソースを示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### パスパラメーターを持つリソース {id="resource_path_param"}

以下の例は、パスセグメントに一致し、`id`という名前のパラメーターとしてキャプチャする、[ネストされた](#resource_nested) `{id}` 整数[パスパラメーター](server-routing.md#path_parameter)を追加する方法を示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例として、このリソースは`/articles/12`に応答するために使用できます。

</snippet>

### 例: CRUD操作のためのリソース {id="example_crud"}

上記の例をまとめて、CRUD操作のための`Articles`リソースを作成しましょう。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new") {
    @Resource("new")
    class New(val parent: Articles = Articles())

    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long) {
        @Resource("edit")
        class Edit(val parent: Id)
    }
}
```

このリソースは、すべての記事を一覧表示したり、新しい記事を投稿したり、編集したりするために使用できます。次の章で、このリソースの[ルートハンドラーを定義](#define_route)する方法を見ていきます。

> 完全な例はこちらで見つけることができます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## ルートハンドラーの定義 {id="define_route"}

型付きリソースの[ルートハンドラーを定義](server-routing.md#define_route)するには、動詞関数（`get`、`post`、`put`など）にリソースクラスを渡す必要があります。
たとえば、以下のルートハンドラーは`/articles`パスに応答します。

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

以下の例は、[例: CRUD操作のためのリソース](#example_crud)で作成された`Articles`リソースのルートハンドラーを定義する方法を示しています。ルートハンドラー内では、`Article`にパラメーターとしてアクセスし、そのプロパティ値を取得できることに注意してください。

```kotlin
fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { article ->
            // Get all articles ...
            call.respondText("List of articles sorted starting from ${article.sort}")
        }
        get<Articles.New> {
            // Show a page with fields for creating a new article ...
            call.respondText("Create a new article")
        }
        post<Articles> {
            // Save an article ...
            call.respondText("An article is saved", status = HttpStatusCode.Created)
        }
        get<Articles.Id> { article ->
            // Show an article with id ${article.id} ...
            call.respondText("An article with id ${article.id}", status = HttpStatusCode.OK)
        }
        get<Articles.Id.Edit> { article ->
            // Show a page with fields for editing an article ...
            call.respondText("Edit an article with id ${article.parent.id}", status = HttpStatusCode.OK)
        }
        put<Articles.Id> { article ->
            // Update an article ...
            call.respondText("An article with id ${article.id} updated", status = HttpStatusCode.OK)
        }
        delete<Articles.Id> { article ->
            // Delete an article ...
            call.respondText("An article with id ${article.id} deleted", status = HttpStatusCode.OK)
        }
    }
}
```

各エンドポイントのリクエストを処理するためのいくつかのヒントを以下に示します。

- `get<Articles>`

   このルートハンドラーは、`sort`クエリパラメーターに従ってソートされたすべての記事を返すことになっています。
   たとえば、これはすべての記事を含む[HTMLページ](server-responses.md#html)または[JSONオブジェクト](server-responses.md#object)である場合があります。

- `get<Articles.New>`

   このエンドポイントは、新しい記事を作成するためのフィールドを含む[ウェブフォーム](server-responses.md#html)で応答します。
- `post<Articles>`

   `post<Articles>`エンドポイントは、ウェブフォームを使用して送信された[パラメーター](server-requests.md#form_parameters)を受け取ることになっています。
   Ktorでは、`ContentNegotiation`プラグインを使用してJSONデータを[オブジェクト](server-requests.md#objects)として受け取ることもできます。
- `get<Articles.Id>`

   このルートハンドラーは、指定された識別子を持つ記事を返すことになっています。
   これは、記事を表示する[HTMLページ](server-responses.md#html)または記事データを含む[JSONオブジェクト](server-responses.md#object)である場合があります。
- `get<Articles.Id.Edit>`

  このエンドポイントは、既存の記事を編集するためのフィールドを含む[ウェブフォーム](server-responses.md#html)で応答します。
- `put<Articles.Id>`

   `post<Articles>`エンドポイントと同様に、`put`ハンドラーはウェブフォームを使用して送信された[フォームパラメーター](server-requests.md#form_parameters)を受け取ります。
- `delete<Articles.Id>`

   このルートハンドラーは、指定された識別子を持つ記事を削除します。

完全な例はこちらで見つけることができます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## リソースからリンクを構築する {id="resource_links"}

リソース定義をルーティングに使用するだけでなく、リンクを構築するためにも使用できます。
これは_リバースルーティング_と呼ばれることもあります。
リソースからリンクを構築することは、[HTML DSL](server-html-dsl.md)で作成されたHTMLドキュメントにこれらのリンクを追加する必要がある場合や、[リダイレクト応答](server-responses.md#redirect)を生成する必要がある場合に役立ちます。

`Resources`プラグインは、`Application`をオーバーロードされた[href](https://api.ktor.io/ktor-server-resources/io.ktor.server.resources/href.html)メソッドで拡張し、`Resource`からリンクを生成できるようにします。たとえば、以下のコードスニペットは、[上記](#example_crud)で定義された`Edit`リソースのリンクを作成します。

```kotlin
val link: String = href(Articles.Id.Edit(Articles.Id(id = 123)))
```

祖先の`Articles`リソースがデフォルト値`new`を持つ`sort`クエリパラメーターを定義しているため、`link`変数には以下が含まれます。

```
/articles/123/edit?sort=new
```

ホストとプロトコルを指定するURLを生成するには、`href`メソッドに`URLBuilder`を渡すことができます。
この例で示すように、`URLBuilder`を使用して追加のクエリパラメーターを指定することもできます。

```kotlin
val urlBuilder = URLBuilder(URLProtocol.HTTPS, "ktor.io", parameters = parametersOf("token", "123"))
href(Articles(sort = null), urlBuilder)
val link: String = urlBuilder.buildString()
```

`link`変数にはその後、以下が含まれます。

```
https://ktor.io/articles?token=123
```

### 例 {id="example_build_links"}

以下の例は、リソースから構築されたリンクをHTML応答に追加する方法を示しています。

```kotlin
get {
    call.respondHtml {
        body {
            this@module.apply {
                p {
                    val link: String = href(Articles())
                    a(link) { +"Get all articles" }
                }
                p {
                    val link: String = href(Articles.New())
                    a(link) { +"Create a new article" }
                }
                p {
                    val link: String = href(Articles.Id.Edit(Articles.Id(id = 123)))
                    a(link) { +"Edit an exising article" }
                }
                p {
                    val urlBuilder = URLBuilder(URLProtocol.HTTPS, "ktor.io", parameters = parametersOf("token", "123"))
                    href(Articles(sort = null), urlBuilder)
                    val link: String = urlBuilder.buildString()
                    i { a(link) { +link } }
                }
            }
        }
    }
}
```

完全な例はこちらで見つけることができます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。