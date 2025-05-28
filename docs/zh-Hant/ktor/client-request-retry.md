[//]: # (title: 重試失敗的請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-retry"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpRequestRetry 外掛程式允許您設定失敗請求的重試策略。
</link-summary>

預設情況下，Ktor 用戶端不會重試因網路或伺服器錯誤而失敗的[請求](client-requests.md)。
您可以使用
[HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry)
外掛程式以多種方式設定失敗請求的重試策略：指定重試次數、設定重試請求的條件，或在重試前修改請求。

## 新增依賴項 {id="add_dependencies"}
`HttpRequestRetry` 只需 [ktor-client-core](client-dependencies.md) artifact (構件) 且不需要任何特定依賴項。

## 安裝 HttpRequestRetry {id="install_plugin"}

若要安裝 `HttpRequestRetry`，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpRequestRetry)
}
```

## 設定 HttpRequestRetry {id="configure_retry"}

### 基本重試配置 {id="basic_config"}

下方[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry)展示了如何設定基本重試策略：

```kotlin
```
{src="snippets/client-retry/src/main/kotlin/com/example/Application.kt" include-lines="17-21,23"}

* `retryOnServerErrors` 函數啟用請求重試，如果從伺服器收到 `5xx` 回應並指定重試次數。
* `exponentialDelay` 指定重試之間的指數延遲，此延遲使用指數退避演算法 (Exponential backoff algorithm) 計算。

您可以從 [HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config) 了解更多關於支援的配置選項。

### 設定重試條件 {id="conditions"}

還有一些配置設定允許您設定重試請求的條件或指定延遲邏輯：

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
    } // retries in 3, 6, 9, etc. seconds
}
```

### 重試前修改請求 {id="modify"}

如果您需要在重試前修改請求，請使用 `modifyRequest`：

```kotlin
install(HttpRequestRetry) {
    // Retry conditions
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}