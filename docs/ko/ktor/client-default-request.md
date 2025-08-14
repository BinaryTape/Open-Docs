[//]: # (title: 기본 요청)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
DefaultRequest 플러그인을 사용하면 모든 요청에 대한 기본 매개변수를 구성할 수 있습니다.
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 플러그인을 사용하면 모든 [요청](client-requests.md)에 대한 기본 매개변수를 구성할 수 있습니다. 예를 들어, 기본 URL을 지정하고, 헤더를 추가하고, 쿼리 매개변수를 구성하는 등의 작업을 할 수 있습니다.

## 종속성 추가 {id="add_dependencies"}

`DefaultRequest`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요하며, 특정 종속성을 요구하지 않습니다.

## DefaultRequest 설치 {id="install_plugin"}

`DefaultRequest`를 설치하려면, [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달합니다.

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

또는 `defaultRequest` 함수를 호출하고 필요한 요청 매개변수를 [구성](#configure)합니다:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

## DefaultRequest 구성 {id="configure"}

### 기본 URL {id="url"}

`DefaultRequest`를 사용하면 [요청 URL](client-requests.md#url)과 병합되는 URL의 기본 부분을 구성할 수 있습니다. 예를 들어, 아래의 `url` 함수는 모든 요청에 대한 기본 URL을 지정합니다:

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

위 구성으로 클라이언트를 사용하여 다음 요청을 수행하면, ...

[object Promise]

... 결과 URL은 `https://ktor.io/docs/welcome.html`이 됩니다. 기본 URL과 요청 URL이 어떻게 병합되는지 알아보려면 [DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)를 참조하세요.

### URL 매개변수 {id="url-params"}

`url` 함수는 또한 URL 구성 요소를 개별적으로 지정할 수 있도록 합니다. 예를 들어:
*   HTTP 스킴;
*   호스트 이름;
*   기본 URL 경로;
*   쿼리 매개변수.

[object Promise]

### 헤더 {id="headers"}

각 요청에 특정 헤더를 추가하려면 `header` 함수를 사용합니다:

[object Promise]

헤더 중복을 피하려면 `appendIfNameAbsent`, `appendIfNameAndValueAbsent`, `contains` 함수를 사용할 수 있습니다:

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### 유닉스 도메인 소켓

> 유닉스 도메인 소켓은 CIO 엔진에서만 지원됩니다.
>
{style="note"}

[유닉스 도메인 소켓으로 개별 요청을 구축](client-requests.md#specify-a-unix-domain-socket)할 수 있지만, 소켓 매개변수를 사용하여 기본 요청을 구성할 수도 있습니다.

그렇게 하려면, 소켓 경로를 포함한 `unixSocket` 호출을 `defaultRequest` 함수에 전달합니다. 예를 들어:

```kotlin
val client = HttpClient(CIO)

// Sending a single request to a Unix domain socket
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// Setting up the socket for all requests from that client
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 예시 {id="example"}

아래 예시는 다음 `DefaultRequest` 구성을 사용합니다:
*   `url` 함수는 HTTP 스킴, 호스트, 기본 URL 경로 및 쿼리 매개변수를 정의합니다.
*   `header` 함수는 모든 요청에 사용자 지정 헤더를 추가합니다.

[object Promise]

이 클라이언트가 수행하는 아래 요청은 후자 경로 세그먼트만 지정하며, `DefaultRequest`에 구성된 매개변수를 자동으로 적용합니다:

[object Promise]

전체 예시는 다음에서 확인할 수 있습니다: [client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request).