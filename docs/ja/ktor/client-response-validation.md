[//]: # (title: レスポンスの検証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
ステータスコードに応じたレスポンスの検証方法を学びます。
</link-summary>

デフォルトでは、Ktor はステータスコードに応じた[レスポンス](client-responses.md)の検証を行いません。
必要に応じて、以下の検証戦略を使用できます。

- `expectSuccess` プロパティを使用して、2xx以外のレスポンスに対して例外をスローする。
- 2xxレスポンスに対してより厳格な検証を追加する。
- 2xx以外のレスポンスの検証をカスタマイズする。

## デフォルトの検証を有効にする {id="default"}

Ktorでは、`expectSuccess` プロパティを `true` に設定することで、デフォルトの検証を有効にできます。
これは、[クライアント設定](client-create-and-configure.md#configure-client)レベルで設定できます...

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

... または、[リクエスト](client-requests.md#parameters)レベルで同じプロパティを使用することもできます。
この場合、2xx以外のエラーレスポンスに対して、以下の例外がスローされます。

* [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
  3xxレスポンスの場合。
* [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
  4xxレスポンスの場合。
* [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
  5xxレスポンスの場合。

## カスタム検証 {id="custom"}

2xxレスポンスに追加の検証を追加したり、デフォルトの検証をカスタマイズしたりするには、
[HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator) プラグインを使用します。`HttpCallValidator` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で
[HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html)
関数を呼び出します。

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 2xxレスポンスの検証 {id="2xx"}

前述の通り、[デフォルトの検証](#default)は2xx以外のエラーレスポンスに対して例外をスローします。より厳格な検証を追加し、2xxレスポンスをチェックする必要がある場合は、
`HttpCallValidator` で利用可能な [validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html)
関数を使用します。

以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response)では、クライアントがエラー詳細を[JSON](client-serialization.md)形式で含む2xxレスポンスを受け取ります。
`validateResponse` は `CustomResponseException` を発生させるために使用されます。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) { json() }
    HttpResponseValidator {
        validateResponse { response ->
            val error: Error = response.body()
            if (error.code != 0) {
                throw CustomResponseException(response, "Code: ${error.code}, message: ${error.message}")
            }
        }
    }
}
```

### 2xx以外の例外を処理する {id="non-2xx"}

[デフォルトの検証](#default)をカスタマイズし、2xx以外のレスポンスに対する例外を特定の方法で処理する必要がある場合は、
[handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)を使用します。
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response)では、クライアントは404レスポンスに対して、デフォルトの `ClientRequestException` ではなく、カスタムの `MissingPageException` を発生させます。

```kotlin
val client = HttpClient(CIO) {
    expectSuccess = true
    HttpResponseValidator {
        handleResponseExceptionWithRequest { exception, request ->
            val clientException = exception as? ClientRequestException ?: return@handleResponseExceptionWithRequest
            val exceptionResponse = clientException.response
            if (exceptionResponse.status == HttpStatusCode.NotFound) {
                val exceptionResponseText = exceptionResponse.bodyAsText()
                throw MissingPageException(exceptionResponse, exceptionResponseText)
            }
        }
    }
}
```