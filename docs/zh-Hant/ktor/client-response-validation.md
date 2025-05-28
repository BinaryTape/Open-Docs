[//]: # (title: 回應驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
了解如何根據狀態碼驗證回應。
</link-summary>

Ktor 預設不會根據 [回應](client-responses.md) 的狀態碼來驗證它。
如果需要，您可以使用以下驗證策略：

- 使用 `expectSuccess` 屬性來針對非 2xx 回應拋出例外。
- 對 2xx 回應增加更嚴格的驗證。
- 自訂非 2xx 回應的驗證。

## 啟用預設驗證 {id="default"}

Ktor 允許您透過將 `expectSuccess` 屬性設為 `true` 來啟用預設驗證。
這可以在 [客戶端配置](client-create-and-configure.md#configure-client) 層級完成 ...

```kotlin
```

{src="snippets/_misc_client/BasicClientConfig.kt"}

... 或透過在 [請求](client-requests.md#parameters) 層級使用相同屬性。
在此情況下，針對非 2xx 錯誤回應將拋出以下例外：

* [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
  針對 3xx 回應。
* [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
  針對 4xx 回應。
* [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
  針對 5xx 回應。

## 自訂驗證 {id="custom"}

您可以透過使用 [HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 插件來為 2xx 回應添加額外驗證或自訂預設驗證。要安裝 `HttpCallValidator`，請在 [客戶端配置區塊](client-create-and-configure.md#configure-client) 內呼叫 [HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 函式：

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 驗證 2xx 回應 {id="2xx"}

如上所述，[預設驗證](#default) 會針對非 2xx 錯誤回應拋出例外。如果您需要添加更嚴格的驗證並檢查 2xx 回應，請使用 `HttpCallValidator` 中可用的 [validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 函式。

在下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response) 中，客戶端會收到一個包含錯誤詳細資訊的 2xx [JSON](client-serialization.md) 格式回應。
使用 `validateResponse` 來引發 `CustomResponseException`：

```kotlin
```

{src="snippets/client-validate-2xx-response/src/main/kotlin/com/example/Application.kt" include-lines="26-36"}

### 處理非 2xx 例外 {id="non-2xx"}

如果您需要自訂 [預設驗證](#default) 並以特定方式處理非 2xx 回應的例外，請使用 [handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)。
在下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response) 中，客戶端會針對 404 回應引發自訂的 `MissingPageException`，而不是預設的 `ClientRequestException`：

```kotlin
```

{src="snippets/client-validate-non-2xx-response/src/main/kotlin/com/example/Application.kt" include-lines="18-30"}