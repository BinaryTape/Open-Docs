[//]: # (title: 사용자 에이전트)

<primary-label ref="client-plugin"/>

[UserAgent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-user-agent) 플러그인은 모든 [요청](client-requests.md)에 `User-Agent` 헤더를 추가합니다.

## 종속성 추가 {id="add_dependencies"}

`UserAgent`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요로 하며 어떤 특정 종속성도 필요하지 않습니다.

## UserAgent 설치 및 구성 {id="install_plugin"}

`UserAgent`를 설치하려면, [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내에서 `install` 함수에 전달하세요. 그런 다음, `agent` 프로퍼티를 사용하여 `User-Agent` 값을 지정하세요:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
// ...
val client = HttpClient(CIO) {
    install(UserAgent) {
        agent = "Ktor client"
    }
}
```

Ktor는 또한 해당 함수들을 사용하여 브라우저 또는 curl과 유사한 `User-Agent` 값을 추가할 수 있도록 허용합니다:

```kotlin
val client = HttpClient(CIO) {
    BrowserUserAgent()
    // ... or
    CurlUserAgent()
}
```