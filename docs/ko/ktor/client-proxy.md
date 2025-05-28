[//]: # (title: 프록시)

<show-structure for="chapter" depth="2"/>

Ktor HTTP 클라이언트를 사용하면 멀티플랫폼 프로젝트에서 프록시 설정을 구성할 수 있습니다. 지원되는 프록시 유형은 [HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers)와 [SOCKS](https://en.wikipedia.org/wiki/SOCKS) 두 가지입니다.

### 지원되는 엔진 {id="supported_engines"}

아래 표는 특정 [엔진](client-engines.md)에 대한 지원되는 프록시 유형을 보여줍니다:

| 엔진     | HTTP 프록시 | SOCKS 프록시 |
|------------|------------|-------------|
| Apache     | ✅          |   ✖️         |
| Java       | ✅          |   ✖️         |
| Jetty      | ✖️          |   ✖️         |
| CIO        | ✅          |   ✖️         |
| Android    | ✅          |   ✅         |
| OkHttp     | ✅          |   ✅         |
| JavaScript | ✖️          |   ✖️         |
| Darwin     | ✅          |   ✖️          |
| Curl       | ✅          |   ✅         |

> 참고: 현재 Darwin 엔진의 HTTP 프록시를 사용하는 HTTPS 요청은 지원되지 않습니다.

## 의존성 추가 {id="add_dependencies"}

클라이언트에서 프록시를 구성하기 위해 특정 의존성을 추가할 필요는 없습니다. 필요한 의존성은 다음과 같습니다:
- [ktor-client-core](client-dependencies.md#client-dependency);
- [엔진 의존성](client-dependencies.md#engine-dependency).

## 프록시 구성 {id="configure_proxy"}

프록시 설정을 구성하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내에서 `engine` 함수를 호출한 다음 `proxy` 속성을 사용합니다. 이 속성은 [ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) 팩토리를 사용하여 생성할 수 있는 `ProxyConfig` 인스턴스를 받습니다.

```kotlin
val client = HttpClient() {
    engine {
        proxy = // Create proxy configuration
    }
}
```

### HTTP 프록시 {id="http_proxy"}

아래 예시는 `ProxyBuilder`를 사용하여 HTTP 프록시를 구성하는 방법을 보여줍니다:

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

JVM에서 `ProxyConfig`는 [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) 클래스에 매핑되므로 프록시를 다음과 같이 구성할 수 있습니다:

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS 프록시 {id="socks_proxy"}

아래 예시는 `ProxyBuilder`를 사용하여 SOCKS 프록시를 구성하는 방법을 보여줍니다:

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

HTTP 프록시와 마찬가지로 JVM에서는 `Proxy`를 사용하여 프록시 설정을 구성할 수 있습니다:

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## 프록시 인증 및 권한 부여 {id="proxy_auth"}

프록시 인증 및 권한 부여는 엔진에 따라 다르며 수동으로 처리해야 합니다. 예를 들어, 기본 인증을 사용하여 Ktor 클라이언트를 HTTP 프록시 서버에 인증하려면 [각 요청](client-default-request.md)에 `Proxy-Authorization` 헤더를 다음과 같이 추가합니다:

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

JVM의 SOCKS 프록시에 Ktor 클라이언트를 인증하려면 `java.net.socks.username` 및 `java.net.socks.password` [시스템 속성](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)을 사용할 수 있습니다.