[//]: # (title: 타임아웃)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

`[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout)` 플러그인을 사용하면 다음 타임아웃을 구성할 수 있습니다:
*   **요청 타임아웃** — HTTP 호출을 처리하는 데 필요한 시간: 요청을 보내는 시점부터 응답을 받는 시점까지.
*   **연결 타임아웃** — 클라이언트가 서버와 연결을 설정해야 하는 시간.
*   **소켓 타임아웃** — 서버와 데이터를 교환할 때 두 데이터 패킷 간의 최대 비활성 시간.

이러한 타임아웃은 모든 요청에 대해 또는 특정 요청에 대해서만 지정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`HttpTimeout`은 `[ktor-client-core](client-dependencies.md)` 아티팩트만 필요하며, 별도의 의존성이 필요하지 않습니다.

## HttpTimeout 설치 {id="install_plugin"}

`HttpTimeout`을 설치하려면, `[클라이언트 구성 블록](client-create-and-configure.md#configure-client)` 내의 `install` 함수에 전달하세요:
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## 타임아웃 구성 {id="configure_plugin"}

타임아웃을 구성하려면 해당 속성을 사용할 수 있습니다:

*   `[requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)`는 요청을 보내는 시점부터 응답을 받는 시점까지 전체 HTTP 호출에 대한 타임아웃을 지정합니다.
*   `[connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)`는 서버와 연결을 설정하는 데 필요한 타임아웃을 지정합니다.
*   `[socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)`는 서버와 데이터를 교환할 때 두 데이터 패킷 간의 최대 비활성 시간을 위한 타임아웃을 지정합니다.

`install` 블록 내에서 모든 요청에 대한 타임아웃을 지정할 수 있습니다. 아래 코드 샘플은 `requestTimeoutMillis`를 사용하여 요청 타임아웃을 설정하는 방법을 보여줍니다:
```kotlin
val client = HttpClient(CIO) {
    install(HttpTimeout) {
        requestTimeoutMillis = 1000
    }
}
```

특정 요청에 대해서만 타임아웃을 설정해야 하는 경우, `[HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html)` 속성을 사용하세요:

```kotlin
val response: HttpResponse = client.get("http://0.0.0.0:8080/path1") {
    timeout {
        requestTimeoutMillis = 3000
    }
}
```

특정 요청에 지정된 타임아웃이 `install` 블록의 전역 타임아웃을 재정의한다는 점에 유의하세요.

타임아웃이 발생하면 Ktor는 `HttpRequestTimeoutException`, `ConnectTimeoutException`, 또는 `SocketTimeoutException`을 발생시킵니다.

## 제한사항 {id="limitations"}

`HttpTimeout`은 특정 `[엔진](client-engines.md)`에 대해 몇 가지 제한사항이 있습니다. 아래 표는 해당 엔진에서 지원되는 타임아웃을 보여줍니다:

| 엔진                             | 요청 타임아웃 | 연결 타임아웃 | 소켓 타임아웃 |
|------------------------------------|-----------------|-----------------|----------------|
| `[Darwin](client-engines.md#darwin)` | ✅️              | ✖️              | ✅️             |
| `[JavaScript](client-engines.md#js)` | ✅               | ✖️              | ✖️             |
| `[Curl](client-engines.md#curl)`     | ✅               | ✅️              | ✖️             |
| `[MockEngine](client-testing.md)`    | ✅               | ✖️              | ✅              |