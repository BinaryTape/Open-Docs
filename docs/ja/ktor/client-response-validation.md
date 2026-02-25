[//]: # (title: レスポンスのバリデーション)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
ステータスコードに応じたレスポンスのバリデーション方法について学びます。
</link-summary>

デフォルトでは、Ktor HTTPクライアントはHTTPステータスコードに基づいたレスポンスのバリデーションを行いません。
必要に応じて、以下の戦略を使用してレスポンスのバリデーションを有効にし、カスタマイズすることができます。

* [`expectSuccess` プロパティを使用して、2xx以外のレスポンスに対して例外をスローする](#default)
* [2xxレスポンスに対してより厳格なバリデーションを追加する](#2xx)
* [2xx以外のレスポンスのバリデーションをカスタマイズする](#non-2xx)

## デフォルトのバリデーションを有効にする {id="default"}

Ktorでは、`expectSuccess` プロパティを `true` に設定することで、デフォルトのバリデーションを有効にできます。有効にすると、クライアントは成功（successful）以外のHTTPステータスコードを持つすべてのレスポンスに対して例外をスローします。

この動作は、[クライアント設定](client-create-and-configure.md#configure-client)でグローバルに有効にできます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

あるいは、リクエストごとに `expectSuccess` を有効にすることもできます。この場合、2xx以外のエラーレスポンスに対して以下の例外がスローされます。

* 3xxレスポンスの場合は [`RedirectResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
* 4xxレスポンスの場合は [`ClientRequestException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
* 5xxレスポンスの場合は [`ServerResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)

## カスタムバリデーション {id="custom"}

デフォルトのバリデーション動作に加えて、[`HttpCallValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator) プラグインを使用してカスタムのレスポンスバリデーションロジックを定義できます。これにより、成功（2xx）レスポンスを検証したり、2xx以外のレスポンスの処理方法をオーバーライドしたりできます。

`HttpCallValidator` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で [`HttpResponseValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 関数を呼び出します。

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 2xxレスポンスのバリデーション {id="2xx"}

デフォルトのバリデーションは、2xx以外のレスポンスに対してのみ例外をスローします。アプリケーションでより厳格なバリデーションが必要な場合は、[`validateResponse {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 関数を使用して成功レスポンスを検証できます。

以下の例では、サーバーはJSON形式のエラーペイロードを含む2xxレスポンスを返します。`validateResponse {}` ブロックはレスポンスボディを検査し、エラーが検出された場合にカスタム例外をスローします。

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

> 完全な例については、[client-validate-2xx-response](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response) を参照してください。
> 
{style="tip"}

### 2xx以外の例外の処理 {id="non-2xx"}

2xx以外のレスポンス例外の処理方法をカスタマイズするには、[`handleResponseExceptionWithRequest {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html) 関数を使用します。

以下の例では、クライアントは `404 Not Found` レスポンスに対して、デフォルトの `ClientRequestException` の代わりにカスタムの `MissingPageException` をスローします。

```kotlin
class MissingPageException(response: HttpResponse, cachedResponseText: String) :
    ResponseException(response, cachedResponseText) {
    override val message: String = "Missing page: ${response.call.request.url}. " +
            "Status: ${response.status}."
}

fun main() {
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

    runBlocking {
        val httpResponse: HttpResponse = try {
            client.get("https://ktor.io/docs/missing-page.html")
        } catch (cause: ResponseException) {
            println(cause)
            cause.response
        }
    }
}
```

> 完全な例については、[client-validate-non-2xx-response](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response) を参照してください。
> 
{style="tip"}