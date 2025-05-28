[//]: # (title: HttpSendを使用したリクエストのインターセプト)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-http-send"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html)プラグインを使用すると、レスポンスに応じてHTTPコールを監視したり、再試行したりできます。例えば、コールロギングを実装したり、サーバーがエラーレスポンス（4xxまたは5xxのステータスコードを持つ）を返した場合にリクエストを再試行したりできます。

`HttpSend`プラグインはインストールを必要としません。これを使用するには、`HttpSend`を`HttpClient.plugin`関数に渡し、`intercept`メソッドを呼び出します。以下の例は、レスポンスのステータスコードに応じてリクエストを再試行する方法を示しています。

```kotlin
```
{src="snippets/client-http-send/src/main/kotlin/com/example/Application.kt" include-lines="12-20"}

完全なサンプルはこちらで見つけることができます: [client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send)。