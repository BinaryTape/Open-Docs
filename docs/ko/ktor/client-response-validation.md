[//]: # (title: 응답 검증)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>코드 예제</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-2xx-response">client-validate-2xx-response</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-non-2xx-response">client-validate-non-2xx-response</a>
</p>
</tldr>

<link-summary>
상태 코드에 따라 응답을 검증하는 방법을 알아봅니다.
</link-summary>

기본적으로 Ktor HTTP 클라이언트는 HTTP 상태 코드에 따라 응답을 검증하지 않습니다.
필요한 경우, 다음과 같은 전략을 사용하여 응답 검증을 활성화하고 커스텀할 수 있습니다.

* [`expectSuccess` 속성을 사용하여 2xx가 아닌 응답에 대해 예외를 발생시킵니다.](#default)
* [2xx 응답에 대해 더 엄격한 검증을 추가합니다.](#2xx)
* [2xx가 아닌 응답에 대한 검증을 커스텀합니다.](#non-2xx)

## 기본 검증 활성화 {id="default"}

Ktor에서는 `expectSuccess` 속성을 `true`로 설정하여 기본 검증을 활성화할 수 있습니다. 활성화하면 클라이언트는 성공적이지 않은 HTTP 상태 코드를 가진 모든 응답에 대해 예외를 발생시킵니다.

[클라이언트 설정](client-create-and-configure.md#configure-client)에서 이 동작을 전역적으로 활성화할 수 있습니다:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

또는 요청별로 `expectSuccess`를 활성화할 수도 있습니다. 이 경우 2xx가 아닌 에러 응답에 대해 다음과 같은 예외가 발생합니다:

* 3xx 응답의 경우 [`RedirectResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-redirect-response-exception/index.html)
* 4xx 응답의 경우 [`ClientRequestException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-client-request-exception/index.html)
* 5xx 응답의 경우 [`ServerResponseException`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-server-response-exception/index.html)

## 커스텀 검증 {id="custom"}

기본 검증 동작 외에도, [`HttpCallValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator) 플러그인을 사용하여 커스텀 응답 검증 로직을 정의할 수 있습니다. 이를 통해 성공적인(2xx) 응답을 검증하거나 2xx가 아닌 응답이 처리되는 방식을 오버라이드할 수 있습니다.

`HttpCallValidator`를 설치하려면 [클라이언트 설정 블록](client-create-and-configure.md#configure-client) 내에서 [`HttpResponseValidator`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-response-validator.html) 함수를 호출하세요:

```kotlin
val client = HttpClient(CIO) {
    HttpResponseValidator {
        // ...
    }
}
```

### 2xx 응답 검증 {id="2xx"}

기본 검증은 2xx가 아닌 응답에 대해서만 예외를 발생시킵니다. 애플리케이션에 더 엄격한 검증이 필요한 경우, [`validateResponse {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/validate-response.html) 함수를 사용하여 성공적인 응답을 검증할 수 있습니다.

다음 예제에서 서버는 에러 페이로드가 JSON 형식으로 포함된 2xx 응답을 반환합니다. `validateResponse {}` 블록은 응답 본문을 검사하고 에러가 감지되면 커스텀 예외를 발생시킵니다:

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) { json() }
    HttpResponseValidator {
        validateResponse { response ->
            val error: Error = response.body()
            if (error.code != 0) {
                throw CustomResponseException(response, "Code: ${error.code}, message: ${error.message}")
            }
        }
    }
}
```

> 전체 예제는 [client-validate-2xx-response](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-2xx-response)를 참조하세요.
> 
{style="tip"}

### 2xx가 아닌 예외 처리 {id="non-2xx"}

2xx가 아닌 응답 예외가 처리되는 방식을 커스텀하려면 [`handleResponseExceptionWithRequest {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-call-validator-config/handle-response-exception-with-request.html) 함수를 사용하세요.

다음 예제에서 클라이언트는 `404 Not Found` 응답에 대해 기본 `ClientRequestException` 대신 커스텀 `MissingPageException`을 발생시킵니다:

```kotlin
class MissingPageException(response: HttpResponse, cachedResponseText: String) :
    ResponseException(response, cachedResponseText) {
    override val message: String = "Missing page: ${response.call.request.url}. " +
            "Status: ${response.status}."
}

fun main() {
    val client = HttpClient(CIO) {
        expectSuccess = true
        HttpResponseValidator {
            handleResponseExceptionWithRequest { exception, request ->
                val clientException = exception as? ClientRequestException ?: return@handleResponseExceptionWithRequest
                val exceptionResponse = clientException.response
                if (exceptionResponse.status == HttpStatusCode.NotFound) {
                    val exceptionResponseText = exceptionResponse.bodyAsText()
                    throw MissingPageException(exceptionResponse, exceptionResponseText)
                }
            }
        }
    }

    runBlocking {
        val httpResponse: HttpResponse = try {
            client.get("https://ktor.io/docs/missing-page.html")
        } catch (cause: ResponseException) {
            println(cause)
            cause.response
        }
    }
}
```

> 전체 예제는 [client-validate-non-2xx-response](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-validate-non-2xx-response)를 참조하세요.
> 
{style="tip"}