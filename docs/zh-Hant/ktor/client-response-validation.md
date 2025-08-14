[//]: # (title: 響應驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
了解如何根據響應的狀態碼來驗證響應。
</link-summary>

依預設情況，Ktor 不會根據 [響應](client-responses.md) 的狀態碼進行驗證。如果需要，您可以使用以下驗證策略：

-   使用 `expectSuccess` 屬性來針對非 2xx 響應拋出例外。
-   為 2xx 響應添加更嚴格的驗證。
-   自訂非 2xx 響應的驗證。

## 啟用預設驗證 {id="default"}

Ktor 允許您透過將 `expectSuccess` 屬性設定為 `true` 來啟用預設驗證。
這可以在 [客戶端配置](client-create-and-configure.md#configure-client) 層級完成...

[object Promise]

...或透過在 [請求](client-requests.md#parameters) 層級使用相同的屬性。
在這種情況下，對於非 2xx 錯誤響應，將會拋出以下例外：

*   [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
    用於 3xx 響應。
*   [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
    用於 4xx 響應。
*   [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
    用於 5xx 響應。

## 自訂驗證 {id="custom"}

您可以透過使用 [HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator)
外掛程式為 2xx 響應添加額外的驗證或自訂預設驗證。要安裝 `HttpCallValidator`，請在
[客戶端配置區塊](client-create-and-configure.md#configure-client) 內呼叫 [HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html)
函數：

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 驗證 2xx 響應 {id="2xx"}

如上所述，[預設驗證](#default) 會針對非 2xx 錯誤響應拋出例外。如果您需要添加
更嚴格的驗證並檢查 2xx 響應，請使用 `HttpCallValidator` 中可用的
[validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html)
函數。

在下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response)
中，客戶端接收一個帶有錯誤詳細資訊的 2xx 響應，其格式為 [JSON](client-serialization.md)。
`validateResponse` 用於引發 `CustomResponseException`：

[object Promise]

### 處理非 2xx 例外 {id="non-2xx"}

如果您需要自訂 [預設驗證](#default) 並以特定方式處理非 2xx 響應的例外，
請使用 [handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)。
在下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response)
中，客戶端針對 404 響應引發自訂的 `MissingPageException`，而不是
預設的 `ClientRequestException`：

[object Promise]