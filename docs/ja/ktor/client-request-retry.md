[//]: # (title: 失敗したリクエストの再試行)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-retry"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpRequestRetry プラグインを使用すると、失敗したリクエストの再試行ポリシーを構成できます。
</link-summary>

デフォルトでは、Ktor クライアントはネットワークまたはサーバーのエラーにより失敗した[リクエスト](client-requests.md)を再試行しません。
[HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry) プラグインを使用すると、失敗したリクエストの再試行ポリシーをさまざまな方法で構成できます。具体的には、再試行回数の指定、リクエストを再試行する条件の構成、または再試行前のリクエストの変更が可能です。

## 依存関係の追加 {id="add_dependencies"}
`HttpRequestRetry` は [ktor-client-core](client-dependencies.md) アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## HttpRequestRetry のインストール {id="install_plugin"}

`HttpRequestRetry` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で `install` 関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpRequestRetry)
}
```

## HttpRequestRetry の構成 {id="configure_retry"}

### 基本的な再試行構成 {id="basic_config"}

下記の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry)は、基本的な再試行ポリシーを構成する方法を示しています。

```kotlin
val client = HttpClient(CIO) {
    install(HttpRequestRetry) {
        retryOnServerErrors(maxRetries = 5)
        exponentialDelay()
    }
}
```

*   `retryOnServerErrors` 関数は、サーバーから `5xx` 応答が受信された場合にリクエストの再試行を有効にし、再試行回数を指定します。
*   `exponentialDelay` は再試行間の指数関数的な遅延を指定します。この遅延は指数バックオフアルゴリズムを使用して計算されます。

サポートされている設定オプションの詳細については、[HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config) を参照してください。

### 再試行条件の構成 {id="conditions"}

リクエストを再試行する条件を構成したり、遅延ロジックを指定したりできる設定もあります。

```kotlin
install(HttpRequestRetry) {
    maxRetries = 5
    retryIf { request, response ->
        !response.status.isSuccess()
    }
    retryOnExceptionIf { request, cause -> 
        cause is NetworkError 
    }
    delayMillis { retry -> 
        retry * 3000L 
    } // retries in 3, 6, 9, etc. seconds
}
```

### 再試行前のリクエストの変更 {id="modify"}

再試行する前にリクエストを変更する必要がある場合は、`modifyRequest` を使用します。

```kotlin
install(HttpRequestRetry) {
    // Retry conditions
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}
```