[//]: # (title: レスポンスのバリデーション)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
ステータスコードに基づいてレスポンスをバリデーションする方法を学びます。
</link-summary>

デフォルトでは、Ktorはステータスコードに基づいて[レスポンス](client-responses.md)をバリデーションしません。
必要に応じて、以下のバリデーション戦略を使用できます。

- `expectSuccess` プロパティを使用して、2xx以外のレスポンスに対して例外をスローします。
- 2xxレスポンスのより厳密なバリデーションを追加します。
- 2xx以外のレスポンスのバリデーションをカスタマイズします。

## デフォルトのバリデーションを有効にする {id="default"}

Ktorでは、`expectSuccess` プロパティを `true` に設定することで、デフォルトのバリデーションを有効にできます。
これは、[クライアント設定](client-create-and-configure.md#configure-client)レベルで可能です…

```kotlin
```

{src="snippets/_misc_client/BasicClientConfig.kt"}

…または、[リクエスト](client-requests.md#parameters)レベルで同じプロパティを使用することでも可能です。
この場合、2xx以外のエラーレスポンスに対して以下の例外がスローされます。

* [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
  は3xxレスポンスの場合。
* [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
  は4xxレスポンスの場合。
* [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)
  は5xxレスポンスの場合。

## カスタムバリデーション {id="custom"}

[HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator)
プラグインを使用することで、2xxレスポンスに対する追加のバリデーションを追加したり、デフォルトのバリデーションをカスタマイズしたりできます。
`HttpCallValidator` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で
[HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html)
関数を呼び出します。

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 2xxレスポンスをバリデーションする {id="2xx"}

前述のとおり、[デフォルトのバリデーション](#default)は2xx以外のエラーレスポンスに対して例外をスローします。より厳密なバリデーションを追加し、2xxレスポンスをチェックする必要がある場合は、`HttpCallValidator` で利用可能な
[validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html)
関数を使用します。

以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response)では、クライアントは[JSON](client-serialization.md)形式でエラー詳細を含む2xxレスポンスを受け取ります。
`validateResponse` は `CustomResponseException` を発生させるために使用されます。

```kotlin
```

{src="snippets/client-validate-2xx-response/src/main/kotlin/com/example/Application.kt" include-lines="26-36"}

### 2xx以外の例外を処理する {id="non-2xx"}

[デフォルトのバリデーション](#default)をカスタマイズし、2xx以外のレスポンスに対する例外を特定の方法で処理する必要がある場合は、
[handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)を使用します。
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response)では、クライアントはデフォルトの `ClientRequestException` の代わりに、404レスポンスに対してカスタムの `MissingPageException` を発生させます。

```kotlin
```

{src="snippets/client-validate-non-2xx-response/src/main/kotlin/com/example/Application.kt" include-lines="18-30"}