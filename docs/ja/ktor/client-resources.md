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
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Resourcesプラグインを使用して型安全なリクエストを作成する方法を学びます。
</link-summary>

Ktorは、型安全な[リクエスト](client-requests.md)を実装できる`%plugin_name%`プラグインを提供します。これを達成するには、サーバーで利用可能なリソースを記述するクラスを作成し、そのクラスを`@Resource`キーワードでアノテーションする必要があります。`@Resource`アノテーションは、kotlinx.serializationライブラリによって提供される`@Serializable`の振る舞いを持つことに注意してください。

> Ktorサーバーは、[型安全なルーティング](server-resources.md)を実装する機能を提供します。

## 依存関係を追加する {id="add_dependencies"}

### kotlinx.serializationを追加する {id="add_serialization"}

[リソースクラス](#resource_classes)が`@Serializable`の振る舞いを持つべきであることを考慮すると、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlinシリアライゼーションプラグインを追加する必要があります。

### %plugin_name%の依存関係を追加する {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## %plugin_name%をインストールする {id="install_plugin"}

`%plugin_name%`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。
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

<include from="server-resources.md" element-id="resource_classes_server"/>

### 例: CRUD操作用のリソース {id="example_crud"}

上記の例を要約し、CRUD操作用の`Articles`リソースを作成しましょう。

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="18-28"}

このリソースは、すべての記事を一覧表示したり、新しい記事を投稿したり、編集したりするなどに使用できます。次のセクションで、このリソースへの[型安全なリクエストを作成する](#make_requests)方法を見ていきます。

> 完全な例はこちらで確認できます: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 型安全なリクエストを作成する {id="make_requests"}

型付きリソースに対して[リクエストを作成する](client-requests.md)には、リソースクラスのインスタンスをリクエスト関数（`request`、`get`、`post`、`put`など）に渡す必要があります。たとえば、以下のサンプルは`/articles`パスへのリクエストを作成する方法を示しています。

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

以下の例は、[](#example_crud)で作成された`Articles`リソースに対して型付きリクエストを作成する方法を示しています。

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="30-48,60"}

[defaultRequest](client-default-request.md)関数は、すべてのリクエストに対するデフォルトURLを指定するために使用されます。

> 完全な例はこちらで確認できます: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。