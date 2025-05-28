[//]: # (title: 重试失败的请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-retry"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpRequestRetry 插件允许您配置失败请求的重试策略。
</link-summary>

默认情况下，Ktor 客户端不会重试因网络或服务器错误而失败的[请求](client-requests.md)。
您可以使用
[HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry)
插件以各种方式配置失败请求的重试策略：指定重试次数、配置请求重试的条件或在重试前修改请求。

## 添加依赖项 {id="add_dependencies"}
`HttpRequestRetry` 只需要 [ktor-client-core](client-dependencies.md) 工件，不需要任何特定依赖项。

## 安装 HttpRequestRetry {id="install_plugin"}

要安装 `HttpRequestRetry`，请在[客户端配置块](client-create-and-configure.md#configure-client)内将其传递给 `install` 函数：
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

### 基本重试配置 {id="basic_config"}

下面的[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry)展示了如何配置基本重试策略：

```kotlin
```
{src="snippets/client-retry/src/main/kotlin/com/example/Application.kt" include-lines="17-21,23"}

* `retryOnServerErrors` 函数在从服务器接收到 `5xx` 响应时启用请求重试，并指定重试次数。
* `exponentialDelay` 指定重试之间的指数延迟，该延迟使用指数退避算法计算。

您可以从 [HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config) 中了解更多支持的配置选项。

### 配置重试条件 {id="conditions"}

还有一些配置设置允许您配置请求重试的条件或指定延迟逻辑：

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
    } // 分别在 3、6、9 等秒后重试
}
```

### 在重试前修改请求 {id="modify"}

如果需要在重试前修改请求，请使用 `modifyRequest`：

```kotlin
install(HttpRequestRetry) {
    // 重试条件
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}