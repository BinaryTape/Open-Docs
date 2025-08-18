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

預設情況下，Ktor 不會根據其狀態碼驗證 [回應](client-responses.md)。
如果需要，您可以使用以下驗證策略：

- 使用 `expectSuccess` 屬性來針對非 2xx 回應拋出例外狀況。
- 新增更嚴格的 2xx 回應驗證。
- 自訂非 2xx 回應的驗證。

## 啟用預設驗證 {id="default"}

Ktor 允許您透過將 `expectSuccess` 屬性設定為 `true` 來啟用預設驗證。
這可以在 [用戶端配置](client-create-and-configure.md#configure-client) 層級上完成...

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

... 或透過在 [請求](client-requests.md#parameters) 層級使用相同的屬性。
在此情況下，將會針對非 2xx 錯誤回應拋出以下例外狀況：

* [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
  針對 3xx 回應。
* [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
  針對 4xx 回應。
* [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
  針對 5xx 回應。

## 自訂驗證 {id="custom"}

您可以為 2xx 回應新增額外驗證，或透過使用
[HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 插件（plugin）來自訂預設驗證。若要安裝 `HttpCallValidator`，請在 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內呼叫
[HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 函數：

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 驗證 2xx 回應 {id="2xx"}

如上所述，[預設驗證](#default) 會針對非 2xx 錯誤回應拋出例外狀況。如果您需要新增
更嚴格的驗證並檢查 2xx 回應，請使用 `HttpCallValidator` 中可用的
[validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 函數。

在下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response) 中，用戶端收到一個包含錯誤詳細資訊的 2xx 回應，其格式為 [JSON](client-serialization.md)。
`validateResponse` 用於引發 `CustomResponseException`：

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

### 處理非 2xx 例外狀況 {id="non-2xx"}

如果您需要自訂 [預設驗證](#default) 並以特定方式處理非 2xx 回應的例外狀況，
請使用 [handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)。
在下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response) 中，用戶端針對 404 回應引發自訂的 `MissingPageException` 而不是預設的 `ClientRequestException`：

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