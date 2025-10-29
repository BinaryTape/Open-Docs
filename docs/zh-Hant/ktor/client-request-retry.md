[//]: # (title: 重試失敗的請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-retry"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpRequestRetry 外掛程式允許您配置針對失敗請求的重試策略。
</link-summary>

預設情況下，Ktor 客戶端不會重試因網路或伺服器錯誤而失敗的[請求](client-requests.md)。您可以透過
[HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry)
外掛程式以多種方式配置失敗請求的重試策略：指定重試次數、配置重試請求的條件，或在重試前修改請求。

## 新增依賴項 {id="add_dependencies"}
`HttpRequestRetry` 僅需要 [ktor-client-core](client-dependencies.md) 構件，且不需要任何特定的依賴項。

## 安裝 HttpRequestRetry {id="install_plugin"}

若要安裝 `HttpRequestRetry`，請將其傳遞給 `install` 函數，在[客戶端配置區塊](client-create-and-configure.md#configure-client)內：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpRequestRetry)
}
```

## 配置 HttpRequestRetry {id="configure_retry"}

### 基本重試配置 {id="basic_config"}

下方的一個[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry) 展示了如何配置基本重試策略：

```kotlin
val client = HttpClient(CIO) {
    install(HttpRequestRetry) {
        retryOnServerErrors(maxRetries = 5)
        exponentialDelay()
    }
}
```

* `retryOnServerErrors` 函數啟用請求重試，如果從伺服器收到 `5xx` 回應，並指定重試次數。
* `exponentialDelay` 指定重試之間的指數延遲，該延遲使用指數退避演算法計算。

您可以進一步瞭解來自 [HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config) 的支援配置選項。

### 配置重試條件 {id="conditions"}

也有一些配置設定允許您配置重試請求的條件，或指定延遲邏輯：

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
    } // 將在 3、6、9 等秒後重試
}
```

### 在重試前修改請求 {id="modify"}

如果您需要在重試前修改請求，請使用 `modifyRequest`：

```kotlin
install(HttpRequestRetry) {
    // 重試條件
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}
```