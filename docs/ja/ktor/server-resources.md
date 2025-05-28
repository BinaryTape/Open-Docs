[//]: # (title: 型安全なルーティング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-resources</code>
</p>
<var name="example_name" value="resource-routing"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>Resourcesプラグインを使用すると、型安全なルーティングを実装できます。</link-summary>

Ktorは、型安全な[ルーティング](server-routing.md)を実装できる[Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html)プラグインを提供します。これを実現するには、型付きルートとして機能するクラスを作成し、そのクラスを`@Resource`キーワードでアノテーションする必要があります。`@Resource`アノテーションには、`kotlinx.serialization`ライブラリによって提供される`@Serializable`の動作があることに注意してください。

> Ktorクライアントは、サーバーに対する[型付きリクエスト](client-resources.md)を行う機能を提供します。

## 依存関係を追加する {id="add_dependencies"}

### kotlinx.serializationを追加する {id="add_serialization"}

[リソースクラス](#resource_classes)が`@Serializable`の動作を持つ必要があるため、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlinシリアライゼーションプラグインを追加する必要があります。

### Resourcesの依存関係を追加する {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Resourcesをインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## リソースクラスを作成する {id="resource_classes"}

<snippet id="resource_classes_server">

各リソースクラスには`@Resource`アノテーションが必要です。以下では、リソースクラスのいくつかの例（単一のパスセグメント、クエリパラメーター、パスパラメーターなどの定義）を見ていきます。

### リソースURL {id="resource_url"}

以下の例は、`/articles`パスで応答するリソースを指定する`Articles`クラスを定義する方法を示しています。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### クエリパラメーターを持つリソース {id="resource_query_param"}

以下の`Articles`クラスには、[クエリパラメーター](server-requests.md#query_parameters)として機能する`sort`という文字列プロパティがあり、`/articles?sort=new`のような`sort`クエリパラメーターを持つパスに応答するリソースを定義できます。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### ネストされたクラスを持つリソース {id="resource_nested"}

複数のパスセグメントを含むリソースを作成するために、クラスをネストできます。この場合、ネストされたクラスは、外部クラス型のプロパティを持つ必要があることに注意してください。以下の例は、`/articles/new`パスに応答するリソースを示しています。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### パスパラメーターを持つリソース {id="resource_path_param"}

以下の例は、パスセグメントに一致し、`id`という名前のパラメーターとしてキャプチャする、[ネストされた](#resource_nested) `{id}`整数[パスパラメーター](server-routing.md#path_parameter)を追加する方法を示しています。

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

上記の例をまとめ、CRUD操作のための`Articles`リソースを作成しましょう。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="16-26"}

このリソースは、すべての記事を一覧表示したり、新しい記事を投稿したり、編集したりするために使用できます。次の章で、このリソースの[ルートハンドラーを定義する](#define_route)方法を見ていきます。

> 完全な例はこちらで確認できます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## ルートハンドラーを定義する {id="define_route"}

型付きリソースの[ルートハンドラーを定義する](server-routing.md#define_route)には、リソースクラスをverb関数（`get`、`post`、`put`など）に渡す必要があります。たとえば、以下のルートハンドラーは`/articles`パスに応答します。

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

以下の例は、[](#example_crud)で作成した`Articles`リソースのルートハンドラーを定義する方法を示しています。ルートハンドラー内で、`Article`をパラメーターとしてアクセスし、そのプロパティ値を取得できることに注意してください。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="30-60,88-89"}

各エンドポイントのリクエストを処理するためのいくつかのヒントを以下に示します。

- `get<Articles>`

   このルートハンドラーは、`sort`クエリパラメーターに従ってソートされたすべての記事を返すことになっています。たとえば、これはすべての記事を含む[HTMLページ](server-responses.md#html)や[JSONオブジェクト](server-responses.md#object)である可能性があります。

- `get<Articles.New>`

   このエンドポイントは、新しい記事を作成するためのフィールドを含む[ウェブフォーム](server-responses.md#html)で応答します。
- `post<Articles>`

   `post<Articles>`エンドポイントは、ウェブフォームを使用して送信された[パラメーター](server-requests.md#form_parameters)を受け取ることを想定しています。Ktorはまた、`ContentNegotiation`プラグインを使用してJSONデータを[オブジェクト](server-requests.md#objects)として受け取ることもできます。
- `get<Articles.Id>`

   このルートハンドラーは、指定された識別子を持つ記事を返すことになっています。これは、記事を表示する[HTMLページ](server-responses.md#html)または記事データを含む[JSONオブジェクト](server-responses.md#object)である可能性があります。
- `get<Articles.Id.Edit>`

  このエンドポイントは、既存の記事を編集するためのフィールドを含む[ウェブフォーム](server-responses.md#html)で応答します。
- `put<Articles.Id>`

   `post<Articles>`エンドポイントと同様に、`put`ハンドラーはウェブフォームを使用して送信された[フォームパラメーター](server-requests.md#form_parameters)を受け取ります。
- `delete<Articles.Id>`

   このルートハンドラーは、指定された識別子を持つ記事を削除します。

完全な例はこちらで確認できます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## リソースからリンクを構築する {id="resource_links"}

リソース定義をルーティングに使用するだけでなく、リンクの構築にも使用できます。これは_リバースルーティング_と呼ばれることもあります。[HTML DSL](server-html-dsl.md)で作成されたHTMLドキュメントにこれらのリンクを追加する必要がある場合や、[リダイレクト応答](server-responses.md#redirect)を生成する必要がある場合に、リソースからリンクを構築することが役立ちます。

`Resources`プラグインは、オーバーロードされた[href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html)メソッドで`Application`を拡張し、`Resource`からリンクを生成できるようにします。たとえば、以下のコードスニペットは、[上記で定義](#example_crud)した`Edit`リソースのリンクを作成します。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="75"}

祖先の`Articles`リソースは、デフォルト値`new`を持つ`sort`クエリパラメーターを定義しているため、`link`変数には以下が含まれます。

```
/articles/123/edit?sort=new
```

ホストとプロトコルを指定するURLを生成するには、`href`メソッドに`URLBuilder`を渡すことができます。この例に示すように、`URLBuilder`を使用して追加のクエリパラメーターも指定できます。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="79-81"}

`link`変数には、その後以下が含まれます。

```
https://ktor.io/articles?token=123
```

### 例 {id="example_build_links"}

以下の例は、リソースから構築されたリンクをHTML応答に追加する方法を示しています。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="62-87"}

完全な例はこちらで確認できます: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。