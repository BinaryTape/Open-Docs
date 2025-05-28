[//]: # (title: 시간 초과)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

`HttpTimeout` 플러그인은 다음 시간 초과를 구성할 수 있도록 합니다.
* __요청 시간 초과(request timeout)__ — HTTP 호출을 처리하는 데 필요한 시간: 요청을 보내는 것부터 응답을 받는 것까지.
* __연결 시간 초과(connection timeout)__ — 클라이언트가 서버와의 연결을 설정해야 하는 시간.
* __소켓 시간 초과(socket timeout)__ — 서버와 데이터를 교환할 때 두 데이터 패킷 사이의 최대 비활성 시간.

이러한 시간 초과는 모든 요청 또는 특정 요청에 대해서만 지정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`HttpTimeout`는 `ktor-client-core` 아티팩트만 필요하며 별도의 의존성을 필요로 하지 않습니다.

## HttpTimeout 설치 {id="install_plugin"}

`HttpTimeout`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달합니다.
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## 시간 초과 구성 {id="configure_plugin"}

시간 초과를 구성하려면 다음 속성을 사용할 수 있습니다.

* `requestTimeoutMillis`는 요청을 보내는 것부터 응답을 받는 것까지 전체 HTTP 호출에 대한 시간 초과를 지정합니다.
* `connectTimeoutMillis`는 서버와의 연결을 설정하는 데 대한 시간 초과를 지정합니다.
* `socketTimeoutMillis`는 서버와 데이터를 교환할 때 두 데이터 패킷 사이의 최대 시간 초과를 지정합니다.

`install` 블록 내에서 모든 요청에 대한 시간 초과를 지정할 수 있습니다. 아래 코드 샘플은 `requestTimeoutMillis`를 사용하여 요청 시간 초과를 설정하는 방법을 보여줍니다.
```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

특정 요청에 대해서만 시간 초과를 설정해야 하는 경우 `HttpRequestBuilder.timeout` 속성을 사용합니다.

```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="24-28"}

특정 요청에 대해 지정된 시간 초과는 `install` 블록의 전역 시간 초과를 재정의합니다.

시간 초과가 발생하면 Ktor는 `HttpRequestTimeoutException`, `ConnectTimeoutException` 또는 `SocketTimeoutException`을 발생시킵니다.

## 제한 사항 {id="limitations"}

`HttpTimeout`에는 특정 [엔진](client-engines.md)에 대한 몇 가지 제한 사항이 있습니다. 아래 표는 해당 엔진에서 지원하는 시간 초과를 보여줍니다.

| 엔진                               | 요청 시간 초과 | 연결 시간 초과 | 소켓 시간 초과 |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |