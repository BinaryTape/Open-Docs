[//]: # (title: 使用 HttpSend 拦截请求)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-http-send"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html) 插件允许你根据响应监控和重试 HTTP 调用。例如，你可以实现调用日志记录，或者在服务器返回错误响应（状态码为 4xx 或 5xx）时重试请求。

`HttpSend` 插件无需安装。要使用它，只需将 `HttpSend` 传递给 `HttpClient.plugin` 函数并调用 `intercept` 方法。以下示例展示了如何根据响应状态码重试请求：

```kotlin
val client = HttpClient(Apache)
client.plugin(HttpSend).intercept { request ->
    val originalCall = execute(request)
    if (originalCall.response.status.value !in 100..399) {
        execute(request)
    } else {
        originalCall
    }
}
```

你可以在此处找到完整示例：[client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send)。