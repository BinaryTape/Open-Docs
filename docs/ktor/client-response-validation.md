[//]: # (title: 响应验证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>代码示例</b>：
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
了解如何根据状态码验证响应。
</link-summary>

默认情况下，Ktor HTTP 客户端不会根据 HTTP 状态码验证响应。
如果需要，你可以使用以下策略启用并自定义响应验证：

* [使用 `expectSuccess` 属性为非 2xx 响应抛出异常](#default)。
* [为 2xx 响应添加更严格的验证](#2xx)。
* [自定义非 2xx 响应的验证](#non-2xx)。

## 启用默认验证 {id="default"}

Ktor 允许你通过将 `expectSuccess` 属性设置为 `true` 来启用默认验证。启用后，客户端将针对任何具有非成功 HTTP 状态码的响应抛出异常。

你可以在 [客户端配置](client-create-and-configure.md#configure-client) 中全局启用此行为：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

或者，你也可以按请求启用 `expectSuccess`。在这种情况下，对于非 2xx 错误响应将抛出以下异常：

* [`RedirectResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
  针对 3xx 响应。
* [`ClientRequestException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
  针对 4xx 响应。
* [`ServerResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
  针对 5xx 响应。

## 自定义验证 {id="custom"}

除了默认的验证行为外，你还可以使用 [`HttpCallValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 插件定义自定义响应验证逻辑。这允许你验证成功 (2xx) 的响应或覆盖非 2xx 响应的处理方式。

要安装 `HttpCallValidator`，请在 [客户端配置块](client-create-and-configure.md#configure-client) 内调用 [`HttpResponseValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-reponse-validator.html) 函数：

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 验证 2xx 响应 {id="2xx"}

默认验证仅对非 2xx 响应抛出异常。如果你的应用程序需要更严格的验证，可以使用 [`validateResponse {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 函数来验证成功的响应。

在以下示例中，服务器返回一个包含 JSON 格式错误负载的 2xx 响应。`validateResponse {}` 块会检查响应正文并在检测到错误时抛出自定义异常：

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

> 有关完整示例，请参阅 [client-validate-2xx-response](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-2xx-response)。
> 
{style="tip"}

### 处理非 2xx 异常 {id="non-2xx"}

要自定义处理非 2xx 响应异常的方式，请使用 [`handleResponseExceptionWithRequest {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html) 函数。

在以下示例中，客户端针对 `404 Not Found` 响应抛出自定义的 `MissingPageException`，而不是默认的 `ClientRequestException`：

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

> 有关完整示例，请参阅 [client-validate-non-2xx-response](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-non-2xx-response)。
> 
{style="tip"}