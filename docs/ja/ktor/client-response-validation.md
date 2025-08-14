[//]: # (title: レスポンスの検証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
ステータスコードに基づいてレスポンスを検証する方法について説明します。
</link-summary>

デフォルトでは、Ktor はステータスコードに応じて[レスポンス](client-responses.md)を検証しません。
必要に応じて、以下の検証戦略を使用できます。

- `expectSuccess` プロパティを使用して、2xx 以外のレスポンスに対して例外をスローします。
- 2xx レスポンスのより厳密な検証を追加します。
- 2xx 以外のレスポンスの検証をカスタマイズします。

## デフォルトの検証を有効にする {id="default"}

Ktor では、`expectSuccess` プロパティを `true` に設定することで、デフォルトの検証を有効にできます。
これは、[クライアント設定](client-create-and-configure.md#configure-client)レベルで可能です...

[object Promise]

...または、[リクエスト](client-requests.md#parameters)レベルで同じプロパティを使用することでも可能です。
この場合、2xx 以外のエラーレスポンスに対しては以下の例外がスローされます。

*   [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
    (3xx レスポンスの場合)
*   [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
    (4xx レスポンスの場合)
*   [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
    (5xx レスポンスの場合)

## カスタム検証 {id="custom"}

[HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator) プラグインを使用することで、2xx レスポンスに対する追加の検証を追加したり、デフォルトの検証をカスタマイズしたりできます。`HttpCallValidator` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で[HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 関数を呼び出します。

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 2xx レスポンスを検証する {id="2xx"}

前述のとおり、[デフォルトの検証](#default)は 2xx 以外のエラーレスポンスに対して例外をスローします。より厳密な検証を追加し、2xx レスポンスをチェックする必要がある場合は、`HttpCallValidator` で利用可能な[validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 関数を使用します。

以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response)では、クライアントが[JSON](client-serialization.md) 形式のエラー詳細を含む 2xx レスポンスを受け取ります。`validateResponse` は `CustomResponseException` を発生させるために使用されます。

[object Promise]

### 2xx 以外の例外を処理する {id="non-2xx"}

[デフォルトの検証](#default)をカスタマイズし、2xx 以外のレスポンスに対する例外を特定の方法で処理する必要がある場合は、[handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html) を使用します。
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response)では、クライアントがデフォルトの `ClientRequestException` の代わりに、404 レスポンスに対してカスタムの `MissingPageException` を発生させます。

[object Promise]