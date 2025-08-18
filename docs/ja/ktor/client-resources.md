[//]: # (title: 型安全なリクエスト)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
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

Ktor は、型安全な[リクエスト](client-requests.md)を実装できる `%plugin_name%` プラグインを提供します。これを実現するには、サーバー上で利用可能なリソースを記述するクラスを作成し、そのクラスを`@Resource`キーワードでアノテーションする必要があります。なお、`@Resource`アノテーションは、kotlinx.serializationライブラリが提供する`@Serializable`の振る舞いを持つことに注意してください。

> Ktor サーバーは、[型安全なルーティング](server-resources.md)を実装する機能を提供します。

## 依存関係を追加する {id="add_dependencies"}

### kotlinx.serializationを追加する {id="add_serialization"}

[リソースクラス](#resource_classes)が`@Serializable`の振る舞いを持つべきであることを考慮すると、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlin serialization プラグインを追加する必要があります。

### %plugin_name% の依存関係を追加する {id="add_plugin_dependencies"}

<p>
    <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
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
<p>
    Ktor クライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係を追加する</Links>を参照してください。
</p>

## %plugin_name% をインストールする {id="install_plugin"}

`%plugin_name%` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で `install` 関数に渡します。
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

各リソースクラスには`@Resource`アノテーションが必要です。
以下では、単一のパスセグメント、クエリパラメーター、パスパラメーターなどを定義するリソースクラスのいくつかの例を見ていきます。

### リソースURL {id="resource_url"}

以下の例は、`/articles`パスに応答するリソースを指定する `Articles` クラスを定義する方法を示しています。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### クエリパラメーターを持つリソース {id="resource_query_param"}

以下の `Articles` クラスには、[クエリパラメーター](server-requests.md#query_parameters)として機能する `sort` 文字列プロパティがあり、`sort` クエリパラメーターを持つ以下のパスに応答するリソースを定義できます: `/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### ネストされたクラスを持つリソース {id="resource_nested"}

複数のパスセグメントを含むリソースを作成するために、クラスをネストできます。この場合、ネストされたクラスは外部クラス型のプロパティを持つ必要があることに注意してください。
以下の例は、`/articles/new`パスに応答するリソースを示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### パスパラメーターを持つリソース {id="resource_path_param"}

以下の例は、パスセグメントにマッチし、`id`という名前のパラメーターとしてキャプチャする[ネストされた](#resource_nested) `{id}` 整数[パスパラメーター](server-routing.md#path_parameter)を追加する方法を示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例として、このリソースは`/articles/12`に応答するために使用できます。

### 例: CRUD操作のためのリソース {id="example_crud"}

上記の例をまとめ、CRUD操作のための `Articles` リソースを作成しましょう。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())

    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long) {
        @Resource("edit")
        class Edit(val parent: Id)
    }
}
```

このリソースは、すべての記事をリスト表示したり、新しい記事を投稿したり、編集したりするために使用できます。このリソースへの[型安全なリクエストを作成する](#make_requests)方法については、次のセクションで説明します。

> 完全な例はこちらで見つけることができます: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 型安全なリクエストを作成する {id="make_requests"}

型付きリソースへ[リクエストを作成する](client-requests.md)には、リソースクラスのインスタンスをリクエスト関数（`request`、`get`、`post`、`put`など）に渡す必要があります。たとえば、以下のサンプルは`/articles`パスへのリクエストを作成する方法を示しています。

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

以下の例は、[例: CRUD操作のためのリソース](#example_crud)で作成された `Articles` リソースへの型付きリクエストを作成する方法を示しています。

```kotlin
fun main() {
    defaultServer(Application::module).start()
    runBlocking {
        val client = HttpClient(CIO) {
            install(Resources)
            defaultRequest {
                host = "0.0.0.0"
                port = 8080
                url { protocol = URLProtocol.HTTP }
            }
        }

        val getAllArticles = client.get(Articles())
        val newArticle = client.get(Articles.New())
        val postArticle = client.post(Articles()) { setBody("Article content") }
        val getArticle = client.get(Articles.Id(id = 12))
        val editArticlePage = client.get(Articles.Id.Edit(Articles.Id(id = 12)))
        val putArticle = client.put(Articles.Id(id = 12)) { setBody("New article content") }
        val deleteArticle = client.delete(Articles.Id(id = 12))
}
```

[defaultRequest](client-default-request.md)関数は、すべてのリクエストに対するデフォルトのURLを指定するために使用されます。

> 完全な例はこちらで見つけることができます: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。