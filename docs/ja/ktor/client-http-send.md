[//]: # (title: HttpSend を使用したリクエストのインターセプト)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-http-send"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html) プラグインを使用すると、応答に応じてHTTPコールを監視および再試行できます。例えば、コールロギングを実装したり、サーバーがエラー応答（4xxまたは5xxのステータスコード）を返した場合にリクエストを再試行したりできます。

`HttpSend` プラグインはインストールを必要としません。これを使用するには、`HttpSend` を `HttpClient.plugin` 関数に渡し、`intercept` メソッドを呼び出します。以下の例は、応答のステータスコードに応じてリクエストを再試行する方法を示しています。

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

完全なサンプルは、こちらで確認できます: [client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send)。