[//]: # (title: 기본 요청)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
DefaultRequest 플러그인을 사용하면 모든 요청에 대한 기본 파라미터를 구성할 수 있습니다.
</link-summary>

[`DefaultRequest`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 플러그인을 사용하면 모든 [요청](client-requests.md)에 대한 기본 파라미터를 구성할 수 있습니다. 예를 들어 기본 URL 지정, 헤더 추가, 쿼리 파라미터 구성 등이 가능합니다.

## 의존성 추가 {id="add_dependencies"}

`DefaultRequest`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요하며 별도의 특정 의존성은 필요하지 않습니다.

## DefaultRequest 설치 {id="install_plugin"}

`DefaultRequest`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달하세요:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

또는 `defaultRequest()` 함수를 호출하고 필요한 요청 파라미터를 [구성](#configure)할 수 있습니다:

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

### 기존 구성 교체 {id="default_request_replace"}

`DefaultRequest` 플러그인이 이미 설치된 경우, 다음 방법 중 하나로 기존 구성을 교체할 수 있습니다:

- `defaultRequest()` 함수의 `replace` 파라미터를 사용합니다:

```kotlin
val client = HttpClient(CIO) {
    defaultRequest(replace = true) {
        // this: DefaultRequestBuilder
    }
}
```

- 제네릭 `installOrReplace()` 함수를 사용합니다:

```kotlin
val client = HttpClient(CIO) {
    installOrReplace(DefaultRequest) {
        // this: DefaultRequestBuilder
    }
}
```

## DefaultRequest 구성 {id="configure"}

### 기본 URL {id="url"}

`DefaultRequest`를 사용하면 [요청 URL](client-requests.md#url)과 병합되는 URL의 기본 부분을 구성할 수 있습니다.
예를 들어, 아래의 `url` 함수는 모든 요청에 대한 기본 URL을 지정합니다:

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

위의 구성이 적용된 클라이언트를 사용하여 다음과 같은 요청을 보내면...

```kotlin
val response: HttpResponse = client.get("welcome.html")
```

...최종 URL은 `https://ktor.io/docs/welcome.html`이 됩니다.
기본 URL과 요청 URL이 어떻게 병합되는지 자세히 알아보려면 [DefaultRequest](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)를 참조하세요.

### URL 파라미터 {id="url-params"}

`url` 함수를 사용하면 다음과 같이 URL 구성 요소를 개별적으로 지정할 수도 있습니다:
- HTTP 스킴 (scheme)
- 호스트 이름
- 기본 URL 경로
- 쿼리 파라미터

```kotlin
url {
    protocol = URLProtocol.HTTPS
    host = "ktor.io"
    path("docs/")
    parameters.append("token", "abc123")
}
```

### 헤더 {id="headers"}

각 요청에 특정 헤더를 추가하려면 `header` 함수를 사용하세요:

```kotlin
defaultRequest {
    header("X-Custom-Header", "Hello")
}
```

헤더 중복을 피하기 위해 `appendIfNameAbsent`, `appendIfNameAndValueAbsent`, `contains` 함수를 사용할 수 있습니다:

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### 유닉스 도메인 소켓 (Unix domain sockets)

> 유닉스 도메인 소켓은 CIO 엔진에서만 지원됩니다.
>
{style="note"}

[개별 요청을 유닉스 도메인 소켓으로 빌드](client-requests.md#specify-a-unix-domain-socket)할 수도 있지만, 소켓 파라미터를 사용하여 기본 요청을 구성할 수도 있습니다.

이를 위해 `defaultRequest` 함수에 소켓 경로와 함께 `unixSocket` 호출을 전달합니다. 예를 들면 다음과 같습니다:

```kotlin
val client = HttpClient(CIO)

// 유닉스 도메인 소켓으로 단일 요청 보내기
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// 해당 클라이언트의 모든 요청에 대해 소켓 설정하기
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 예제 {id="example"}

아래 예제는 다음과 같은 `DefaultRequest` 구성을 사용합니다:
* `url` 함수는 HTTP 스킴, 호스트, 기본 URL 경로 및 쿼리 파라미터를 정의합니다.
* `header` 함수는 모든 요청에 커스텀 헤더를 추가합니다.

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        url {
            protocol = URLProtocol.HTTPS
            host = "ktor.io"
            path("docs/")
            parameters.append("token", "abc123")
        }
        header("X-Custom-Header", "Hello")
    }
}
```

이 클라이언트로 수행한 아래 요청은 경로의 마지막 세그먼트만 지정하며, `DefaultRequest`에 구성된 파라미터가 자동으로 적용됩니다:

```kotlin
val response: HttpResponse = client.get("welcome.html")
println(response.status)
```

전체 예제는 여기에서 확인할 수 있습니다: [client-default-request](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-default-request).