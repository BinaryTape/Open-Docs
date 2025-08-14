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
HttpRequestRetry プラグインを使用すると、失敗したリクエストの再試行ポリシーを設定できます。
</link-summary>

デフォルトでは、Ktor クライアントはネットワークまたはサーバーエラーが原因で失敗した[リクエスト](client-requests.md)を再試行しません。
HttpRequestRetry プラグインを使用して、失敗したリクエストの再試行ポリシーをさまざまな方法で設定できます。再試行回数を指定したり、リクエストを再試行する条件を設定したり、再試行する前にリクエストを変更したりできます。

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

## HttpRequestRetry の設定 {id="configure_retry"}

### 基本的な再試行設定 {id="basic_config"}

以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry)は、基本的な再試行ポリシーを設定する方法を示しています。

[object Promise]

*   `retryOnServerErrors` 関数は、サーバーから `5xx` 応答が受信された場合にリクエストの再試行を有効にし、再試行回数を指定します。
*   `exponentialDelay` は、Exponential backoff アルゴリズムを使用して計算される、再試行間の指数関数的な遅延を指定します。

サポートされている設定オプションの詳細については、[HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config)を参照してください。

### 再試行条件の設定 {id="conditions"}

リクエストを再試行する条件を設定したり、遅延ロジックを指定したりできる設定もあります。

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
    } // 3、6、9秒...と再試行
}
```

### 再試行前にリクエストを変更する {id="modify"}

再試行する前にリクエストを変更する必要がある場合は、`modifyRequest` を使用します。

```kotlin
install(HttpRequestRetry) {
    // 再試行条件
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}