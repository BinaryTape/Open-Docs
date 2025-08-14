[//]: # (title: デフォルトリクエスト)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
DefaultRequestプラグインを使用すると、すべてのリクエストにデフォルトのパラメータを設定できます。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)プラグインを使用すると、すべての[リクエスト](client-requests.md)にデフォルトのパラメータを設定できます。具体的には、ベースURLの指定、ヘッダーの追加、クエリパラメータの設定などです。

## 依存関係を追加する {id="add_dependencies"}

`DefaultRequest`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## DefaultRequestをインストールする {id="install_plugin"}

`DefaultRequest`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

または、`defaultRequest`関数を呼び出して、必要なリクエストパラメータを[設定](#configure)します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

## DefaultRequestを設定する {id="configure"}

### ベースURL {id="url"}

`DefaultRequest`を使用すると、[リクエストURL](client-requests.md#url)とマージされるURLのベース部分を設定できます。
たとえば、以下の`url`関数はすべてのリクエストに対してベースURLを指定します。

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

上記の構成を持つクライアントを使用して以下のリクエストを行った場合、...

[object Promise]

...結果のURLは`https://ktor.io/docs/welcome.html`になります。
ベースURLとリクエストURLがどのようにマージされるかについては、[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)を参照してください。

### URLパラメータ {id="url-params"}

`url`関数は、URLコンポーネントを個別に指定することもできます。たとえば、次のとおりです。
- HTTPスキーム
- ホスト名
- ベースURLパス
- クエリパラメータ

[object Promise]

### ヘッダー {id="headers"}

各リクエストに特定のヘッダーを追加するには、`header`関数を使用します。

[object Promise]

ヘッダーの重複を避けるために、`appendIfNameAbsent`、`appendIfNameAndValueAbsent`、および`contains`関数を使用できます。

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### Unixドメインソケット

> UnixドメインソケットはCIOエンジンでのみサポートされています。
>
{style="note"}

[Unixドメインソケットを使用して個々のリクエストを構築](client-requests.md#specify-a-unix-domain-socket)することもできますが、ソケットパラメータを持つデフォルトリクエストを設定することも可能です。

そのためには、ソケットへのパスを含む`unixSocket`呼び出しを`defaultRequest`関数に渡します。例：

```kotlin
val client = HttpClient(CIO)

// Unixドメインソケットへの単一のリクエストを送信
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// そのクライアントからのすべてのリクエストに対してソケットを設定
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 例 {id="example"}

以下の例では、次の`DefaultRequest`構成を使用しています。
*   `url`関数は、HTTPスキーム、ホスト、ベースURLパス、およびクエリパラメータを定義します。
*   `header`関数は、すべてのリクエストにカスタムヘッダーを追加します。

[object Promise]

このクライアントによって行われた以下のリクエストは、後続のパスセグメントのみを指定し、`DefaultRequest`用に設定されたパラメータを自動的に適用します。

[object Promise]

完全な例はこちらで確認できます: [client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。