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
HttpRequestRetry 插件允許您為失敗的請求配置重試策略。
</link-summary>

預設情況下，Ktor 用戶端不會重試因網路或伺服器錯誤而失敗的[請求](client-requests.md)。
您可以透過 [HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry) 插件，以多種方式配置失敗請求的重試策略：指定重試次數、配置重試請求的條件，或在重試前修改請求。

## 新增依賴項 {id="add_dependencies"}
`HttpRequestRetry` 僅需要 [ktor-client-core](client-dependencies.md) artifact，不需要任何特定的依賴項。

## 安裝 HttpRequestRetry {id="install_plugin"}

要安裝 `HttpRequestRetry`，請在[用戶端配置區塊](client-create-and-configure.md#configure-client)內將其傳遞給 `install` 函數：
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

以下[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry)展示了如何配置基本重試策略：

[object Promise]

*   `retryOnServerErrors` 函數會在從伺服器收到 `5xx` 響應時啟用請求重試，並指定重試次數。
*   `exponentialDelay` 指定了重試之間的指數延遲，該延遲使用指數退避演算法計算。

您可以從 [HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config) 了解更多關於支援的配置選項。

### 配置重試條件 {id="conditions"}

還有一些配置設定，允許您配置重試請求的條件或指定延遲邏輯：

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
    } // 在 3、6、9 等秒後重試
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