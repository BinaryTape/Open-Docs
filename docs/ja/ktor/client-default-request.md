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
DefaultRequestプラグインを使用すると、すべてのリクエストのデフォルトパラメーターを設定できます。
</link-summary>

[`DefaultRequest`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) プラグインを使用すると、すべての[リクエスト](client-requests.md)のデフォルトパラメーターを設定できます。ベースURLの指定、ヘッダーの追加、クエリパラメーターの設定などが可能です。

## 依存関係の追加 {id="add_dependencies"}

`DefaultRequest` は [ktor-client-core](client-dependencies.md) アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## DefaultRequestのインストール {id="install_plugin"}

`DefaultRequest` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の `install` 関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

または、`defaultRequest()` 関数を呼び出して必要なリクエストパラメーターを[設定](#configure)します。

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

### 既存の設定の置き換え {id="default_request_replace"}

`DefaultRequest` プラグインがすでにインストールされている場合は、次のいずれかの方法で既存の設定を置き換えることができます。

- `defaultRequest()` 関数の `replace` パラメーターを使用する：

```kotlin
val client = HttpClient(CIO) {
    defaultRequest(replace = true) {
        // this: DefaultRequestBuilder
    }
}
```

- ジェネリックな `installOrReplace()` 関数を使用する：

```kotlin
val client = HttpClient(CIO) {
    installOrReplace(DefaultRequest) {
        // this: DefaultRequestBuilder
    }
}
```

## DefaultRequestの設定 {id="configure"}

### ベースURL {id="url"}

`DefaultRequest` では、[リクエストURL](client-requests.md#url)とマージされるURLのベース部分を設定できます。
例えば、以下の `url` 関数は、すべてのリクエストのベースURLを指定します。

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

上記の設定を持つクライアントを使用して、次のようなリクエストを行うと...

```kotlin
val response: HttpResponse = client.get("welcome.html")
```

...結果として得られるURLは `https://ktor.io/docs/welcome.html` となります。
ベースURLとリクエストURLがどのようにマージされるかについては、[DefaultRequest](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) を参照してください。

### URLパラメーター {id="url-params"}

`url` 関数では、URLコンポーネントを個別に指定することもできます。例：
- HTTPスキーム
- ホスト名
- ベースURLパス
- クエリパラメーター

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

ヘッダーの重複を避けるために、`appendIfNameAbsent`、`appendIfNameAndValueAbsent`、`contains` 関数を使用することもできます。

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### Unixドメインソケット

> Unixドメインソケットは CIO エンジンでのみサポートされています。
>
{style="note"}

[個別のリクエストをUnixドメインソケットで構築](client-requests.md#specify-a-unix-domain-socket)することもできますが、ソケットパラメーターを使用してデフォルトリクエストを設定することも可能です。

これを行うには、`defaultRequest` 関数にソケットへのパスを指定して `unixSocket` 呼び出しを渡します。例：

```kotlin
val client = HttpClient(CIO)

// Unixドメインソケットへ単一のリクエストを送信する
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// そのクライアントからのすべてのリクエストに対してソケットを設定する
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 例 {id="example"}

以下の例では、次の `DefaultRequest` 設定を使用しています。
* `url` 関数は、HTTPスキーム、ホスト、ベースURLパス、クエリパラメーターを定義します。
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

このクライアントによる以下のリクエストは、パスの最後のセグメントのみを指定しており、`DefaultRequest` に設定されたパラメーターが自動的に適用されます。

```kotlin
val response: HttpResponse = client.get("welcome.html")
println(response.status)
```

完全な例はこちらにあります: [client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)