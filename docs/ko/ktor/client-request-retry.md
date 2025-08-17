[//]: # (title: 실패한 요청 재시도)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-retry"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
`HttpRequestRetry` 플러그인을 사용하여 실패한 요청에 대한 재시도 정책을 구성할 수 있습니다.
</link-summary>

기본적으로 Ktor 클라이언트는 네트워크 또는 서버 오류로 인해 실패한 [요청](client-requests.md)을 재시도하지 않습니다.
[HttpRequestRetry](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry) 플러그인을 사용하여 실패한 요청에 대한 재시도 정책을 다양한 방법으로 구성할 수 있습니다. 예를 들어, 재시도 횟수를 지정하거나, 요청 재시도 조건을 구성하거나, 재시도 전에 요청을 수정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`HttpRequestRetry`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요하며 특정 의존성을 요구하지 않습니다.

## HttpRequestRetry 설치 {id="install_plugin"}

`HttpRequestRetry`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달하면 됩니다.
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpRequestRetry)
}
```

## HttpRequestRetry 구성 {id="configure_retry"}

### 기본 재시도 구성 {id="basic_config"}

아래 [실행 가능한 예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-retry)는 기본 재시도 정책을 구성하는 방법을 보여줍니다.

```kotlin
val client = HttpClient(CIO) {
    install(HttpRequestRetry) {
        retryOnServerErrors(maxRetries = 5)
        exponentialDelay()
    }
}
```

*   `retryOnServerErrors` 함수는 서버로부터 `5xx` 응답을 받은 경우 요청 재시도를 활성화하며 재시도 횟수를 지정합니다.
*   `exponentialDelay`는 재시도 간에 지수적 지연을 지정하며, 이는 지수 백오프(Exponential backoff) 알고리즘을 사용하여 계산됩니다.

지원되는 구성 옵션에 대한 자세한 내용은 [HttpRequestRetryConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-request-retry-config)에서 확인할 수 있습니다.

### 재시도 조건 구성 {id="conditions"}

요청 재시도 조건을 구성하거나 지연 로직을 지정할 수 있는 구성 설정도 있습니다.

```kotlin
install(HttpRequestRetry) {
    maxRetries = 5
    retryIf { request, response ->
        !response.status.isSuccess()
    }
    retryOnExceptionIf { request, cause -> 
        cause is NetworkError 
    }
    delayMillis { retry -> 
        retry * 3000L 
    } // 3, 6, 9 등 초 단위로 재시도
}
```

### 재시도 전에 요청 수정 {id="modify"}

재시도 전에 요청을 수정해야 하는 경우 `modifyRequest`를 사용하십시오.

```kotlin
install(HttpRequestRetry) {
    // 재시도 조건
    modifyRequest { request ->
        request.headers.append("x-retry-count", retryCount.toString())
    }
}