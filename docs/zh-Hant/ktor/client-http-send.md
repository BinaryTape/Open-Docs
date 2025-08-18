[//]: # (title: 使用 HttpSend 攔截請求)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-http-send"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html) 插件允許您根據響應監控並重試 HTTP 呼叫。例如，您可以實作呼叫日誌記錄，或在伺服器返回錯誤響應（狀態碼為 4xx 或 5xx）時重試請求。

HttpSend 插件無需安裝。若要使用它，請將 `HttpSend` 傳遞給 `HttpClient.plugin` 函數並呼叫 `intercept` 方法。以下範例展示了如何根據響應狀態碼重試請求：

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

您可以在此處找到完整範例：[client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send)。