[//]: # (title: 透過 HttpSend 攔截請求)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-http-send"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html) 外掛程式允許您根據回應來監控並重試 HTTP 呼叫。例如，您可以實作呼叫記錄，或者在伺服器回傳錯誤回應（狀態碼為 4xx 或 5xx）時重試請求。

`HttpSend` 外掛程式不需要安裝。若要使用它，請將 `HttpSend` 傳遞給 `HttpClient.plugin` 函式並呼叫 `intercept` 方法。以下範例展示了如何根據回應狀態碼重試請求：

```kotlin
```
{src="snippets/client-http-send/src/main/kotlin/com/example/Application.kt" include-lines="12-20"}

您可以在此處找到完整範例：[client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send)。