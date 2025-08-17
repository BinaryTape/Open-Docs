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
DefaultRequest プラグインを使用すると、すべてのリクエストのデフォルトパラメーターを設定できます。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) プラグインを使用すると、すべての [リクエスト](client-requests.md) のデフォルトパラメーターを設定できます。ベース URL の指定、ヘッダーの追加、クエリパラメーターの設定などです。

## 依存関係の追加 {id="add_dependencies"}

`DefaultRequest` は [ktor-client-core](client-dependencies.md) アーティファクトのみを必要とし、特定の依存関係は不要です。

## DefaultRequest のインストール {id="install_plugin"}

`DefaultRequest` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client) 内の `install` 関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

または、`defaultRequest` 関数を呼び出して、必要なリクエストパラメーターを [設定](#configure) します。

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

## DefaultRequest の設定 {id="configure"}

### ベース URL {id="url"}

`DefaultRequest` を使用すると、[リクエスト URL](client-requests.md#url) とマージされる URL のベース部分を設定できます。たとえば、以下の `url` 関数は、すべてのリクエストのベース URL を指定します。

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

上記の構成のクライアントを使用して以下のリクエストを行うと、...

```kotlin
val response: HttpResponse = client.get("welcome.html")
```

... 結果の URL は `https://ktor.io/docs/welcome.html` になります。ベース URL とリクエスト URL がどのようにマージされるかについては、[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) を参照してください。

### URL パラメーター {id="url-params"}

`url` 関数では、URL コンポーネントを個別に指定することもできます。例:
- HTTP スキーム;
- ホスト名;
- ベース URL パス;
- クエリパラメーター。

```kotlin
url {
    protocol = URLProtocol.HTTPS
    host = "ktor.io"
    path("docs/")
    parameters.append("token", "abc123")
}
```

### ヘッダー {id="headers"}

各リクエストに特定のヘッダーを追加するには、`header` 関数を使用します。

```kotlin
defaultRequest {
    header("X-Custom-Header", "Hello")
}
```

ヘッダーの重複を避けるために、`appendIfNameAbsent`、`appendIfNameAndValueAbsent`、および `contains` 関数を使用できます。

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### Unix ドメインソケット

> Unix ドメインソケットは CIO エンジンでのみサポートされています。
>
{style="note"}

[Unix ドメインソケットで個々のリクエストを構築](client-requests.md#specify-a-unix-domain-socket) できますが、ソケットパラメーターを使用してデフォルトリクエストを設定することもできます。

これを行うには、ソケットへのパスを含む `unixSocket` 呼び出しを `defaultRequest` 関数に渡します。例:

```kotlin
val client = HttpClient(CIO)

// Sending a single request to a Unix domain socket
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// Setting up the socket for all requests from that client
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 例 {id="example"}

以下の例では、次の `DefaultRequest` 設定を使用します。
* `url` 関数は、HTTP スキーム、ホスト、ベース URL パス、およびクエリパラメーターを定義します。
* `header` 関数は、すべてのリクエストにカスタムヘッダーを追加します。

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        url {
            protocol = URLProtocol.HTTPS
            host = "ktor.io"
            path("docs/")
            parameters.append("token", "abc123")
        }
        header("X-Custom-Header", "Hello")
    }
}
```

このクライアントによって行われる以下のリクエストは、後続のパスセグメントのみを指定し、`DefaultRequest` 用に設定されたパラメーターを自動的に適用します。

```kotlin
val response: HttpResponse = client.get("welcome.html")
println(response.status)
```

完全な例は、こちらで確認できます: [client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。