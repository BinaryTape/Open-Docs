[//]: # (title: 重试失败的请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-retry"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
HttpRequestRetry 插件允许你为失败的请求配置重试策略。
</link-summary>

默认情况下，Ktor 客户端不会重试因网络或服务器错误而失败的[请求](client-requests.md)。你可以使用 [HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry) 插件以多种方式配置失败请求的重试策略：指定重试次数、配置重试请求的条件，或在重试前修改请求。

## 添加依赖项 {id="add_dependencies"}
`HttpRequestRetry` 只需 [ktor-client-core](client-dependencies.md) 构件，并且不需要任何特定的依赖项。

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

[object Promise]

*   `retryOnServerErrors` 函数会在从服务器接收到 `5xx` 响应时启用请求重试，并指定重试次数。
*   `exponentialDelay` 指定重试之间的指数延迟，该延迟是使用指数退避算法计算的。

你可以从 [HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config) 了解更多关于支持的配置选项。

### 配置重试条件 {id="conditions"}

还有一些配置设置允许你配置重试请求的条件或指定延迟逻辑：

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
    } // 以 3、6、9 等秒数重试
}
```

### 重试前修改请求 {id="modify"}

如果你需要在重试前修改请求，请使用 `modifyRequest`：

```kotlin
install(HttpRequestRetry) {
    // 重试条件
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}