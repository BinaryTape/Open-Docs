[//]: # (title: 回應驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>程式碼範例</b>：
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
了解如何根據狀態碼驗證回應。
</link-summary>

預設情況下，Ktor HTTP 用戶端不會根據其 HTTP 狀態碼驗證回應。
如果需要，您可以使用以下策略啟用並自訂回應驗證：

* [使用 `expectSuccess` 屬性對非 2xx 回應拋出例外](#default)。
* [為 2xx 回應加入更嚴格的驗證](#2xx)。
* [自訂非 2xx 回應的驗證](#non-2xx)。

## 啟用預設驗證 {id="default"}

Ktor 允許您透過將 `expectSuccess` 屬性設定為 `true` 來啟用預設驗證。啟用時，用戶端會針對任何具有非成功 HTTP 狀態碼的回應拋出例外。

您可以在 [用戶端配置](client-create-and-configure.md#configure-client) 中全域啟用此行為：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

或者，您也可以針對各別請求啟用 `expectSuccess`。在這種情況下，針對非 2xx 的錯誤回應會拋出以下例外：

* [`RedirectResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html) 針對 3xx 回應。
* [`ClientRequestException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html) 針對 4xx 回應。
* [`ServerResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html) 針對 5xx 回應。

## 自訂驗證 {id="custom"}

除了預設驗證行為外，您還可以使用 [`HttpCallValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 外掛程式來定義自訂的回應驗證邏輯。這可讓您驗證成功 (2xx) 的回應，或覆蓋非 2xx 回應的處理方式。

要安裝 `HttpCallValidator`，請在 [用戶端配置區塊](client-create-and-configure.md#configure-client) 中呼叫 [`HttpResponseValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 函式：

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 驗證 2xx 回應 {id="2xx"}

預設驗證僅針對非 2xx 回應拋出例外。如果您的應用程式需要更嚴格的驗證，可以使用 [`validateResponse {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 函式驗證成功的回應。

在以下範例中，伺服器回傳一個包含 JSON 格式錯誤負載的 2xx 回應。`validateResponse {}` 區塊會檢查回應主體，並在偵測到錯誤時拋出自訂例外：

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

> 有關完整的範例，請參閱 [client-validate-2xx-response](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response)。
> 
{style="tip"}

### 處理非 2xx 例外 {id="non-2xx"}

要自訂非 2xx 回應例外的處理方式，請使用 [`handleResponseExceptionWithRequest {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html) 函式。

在以下範例中，對於 `404 Not Found` 回應，用戶端會拋出自訂的 `MissingPageException`，而不是預設的 `ClientRequestException`：

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

> 有關完整的範例，請參閱 [client-validate-non-2xx-response](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response)。
> 
{style="tip"}