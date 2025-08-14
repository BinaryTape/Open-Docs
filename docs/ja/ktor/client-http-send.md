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

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html) プラグインを使用すると、レスポンスに応じて HTTP コールを監視し、再試行できます。例えば、コールロギングを実装したり、サーバーがエラーレスポンス (4xx または 5xx のステータスコード) を返した場合にリクエストを再試行したりできます。

`HttpSend` プラグインはインストールを必要としません。これを使用するには、`HttpSend` を `HttpClient.plugin` 関数に渡し、`intercept` メソッドを呼び出します。以下の例は、レスポンスのステータスコードに応じてリクエストを再試行する方法を示しています。

[object Promise]

完全なサンプルは次の場所にあります: [client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send)。