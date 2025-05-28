[//]: # (title: 响应验证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
了解如何根据响应状态码进行验证。
</link-summary>

默认情况下，Ktor 不会根据其状态码对[响应](client-responses.md)进行验证。如果需要，您可以使用以下验证策略：

- 使用 `expectSuccess` 属性来对非 2xx 响应抛出异常。
- 对 2xx 响应添加更严格的验证。
- 自定义非 2xx 响应的验证。

## 启用默认验证 {id="default"}

Ktor 允许您通过将 `expectSuccess` 属性设置为 `true` 来启用默认验证。这可以在[客户端配置](client-create-and-configure.md#configure-client)级别完成 ...

```kotlin
```

{src="snippets/_misc_client/BasicClientConfig.kt"}

... 或者在[请求](client-requests.md#parameters)级别使用相同的属性。在这种情况下，将为非 2xx 错误响应抛出以下异常：

* [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html) 对应 3xx 响应。
* [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html) 对应 4xx 响应。
* [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html) 对应 5xx 响应。

## 自定义验证 {id="custom"}

您可以通过使用 [HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 插件来为 2xx 响应添加额外的验证或自定义默认验证。要安装 `HttpCallValidator`，请在[客户端配置块](client-create-and-configure.md#configure-client)中调用 [HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 函数：

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 验证 2xx 响应 {id="2xx"}

如上所述，[默认验证](#default)会为非 2xx 错误响应抛出异常。如果您需要添加更严格的验证并检查 2xx 响应，请使用 `HttpCallValidator` 中可用的 [validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 函数。

在下面的[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response) 中，客户端接收到一个 2xx 响应，其中包含 [JSON](client-serialization.md) 格式的错误详细信息。`validateResponse` 用于抛出 `CustomResponseException`：

```kotlin
```

{src="snippets/client-validate-2xx-response/src/main/kotlin/com/example/Application.kt" include-lines="26-36"}

### 处理非 2xx 异常 {id="non-2xx"}

如果您需要自定义[默认验证](#default)并以特定方式处理非 2xx 响应的异常，请使用 [handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)。在下面的[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response) 中，客户端为 404 响应抛出自定义的 `MissingPageException`，而不是默认的 `ClientRequestException`：

```kotlin
```

{src="snippets/client-validate-non-2xx-response/src/main/kotlin/com/example/Application.kt" include-lines="18-30"}