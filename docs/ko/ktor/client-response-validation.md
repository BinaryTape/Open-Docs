[//]: # (title: 응답 유효성 검사)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>코드 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
상태 코드에 따라 응답의 유효성을 검사하는 방법을 알아보세요.
</link-summary>

기본적으로 Ktor는 상태 코드에 따라 [응답](client-responses.md)의 유효성을 검사하지 않습니다.
필요한 경우, 다음 유효성 검사 전략을 사용할 수 있습니다:

- `expectSuccess` 속성을 사용하여 2xx가 아닌 응답에 대해 예외를 발생시킵니다.
- 2xx 응답에 대한 더 엄격한 유효성 검사를 추가합니다.
- 2xx가 아닌 응답에 대한 유효성 검사를 사용자 지정합니다.

## 기본 유효성 검사 활성화 {id="default"}

Ktor는 `expectSuccess` 속성을 `true`로 설정하여 기본 유효성 검사를 활성화할 수 있도록 허용합니다.
이는 [클라이언트 구성](client-create-and-configure.md#configure-client) 수준에서 수행할 수 있으며...

[object Promise]

... 또는 [요청](client-requests.md#parameters) 수준에서 동일한 속성을 사용하여 수행할 수 있습니다.
이 경우, 2xx가 아닌 오류 응답에 대해 다음 예외가 발생합니다:

* [RedirectResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)은 3xx 응답의 경우 발생합니다.
* [ClientRequestException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)은 4xx 응답의 경우 발생합니다.
* [ServerResponseException](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)은 5xx 응답의 경우 발생합니다.

## 사용자 지정 유효성 검사 {id="custom"}

2xx 응답에 대한 추가 유효성 검사를 추가하거나 [HttpCallValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 플러그인을 사용하여 기본 유효성 검사를 사용자 지정할 수 있습니다. `HttpCallValidator`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내에서 [HttpResponseValidator](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 함수를 호출하세요:

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 2xx 응답 유효성 검사 {id="2xx"}

위에서 언급했듯이, [기본 유효성 검사](#default)는 2xx가 아닌 오류 응답에 대해 예외를 발생시킵니다. 더 엄격한 유효성 검사를 추가하고 2xx 응답을 확인해야 하는 경우, `HttpCallValidator`에서 사용할 수 있는 [validateResponse](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 함수를 사용하세요.

아래 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-2xx-response)에서 클라이언트는 [JSON](client-serialization.md) 형식으로 오류 세부 정보를 포함하는 2xx 응답을 받습니다.
`validateResponse`는 `CustomResponseException`을 발생시키기 위해 사용됩니다:

[object Promise]

### 2xx가 아닌 예외 처리 {id="non-2xx"}

[기본 유효성 검사](#default)를 사용자 지정하고 2xx가 아닌 응답에 대한 예외를 특정 방식으로 처리해야 하는 경우, [handleResponseExceptionWithRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html)를 사용하세요.
아래 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-validate-non-2xx-response)에서 클라이언트는 기본 `ClientRequestException` 대신 404 응답에 대해 사용자 지정 `MissingPageException`을 발생시킵니다:

[object Promise]