[//]: # (title: 클라이언트 생성 및 구성)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktor 클라이언트를 생성하고 구성하는 방법을 알아보세요.</link-summary>

[클라이언트 의존성](client-dependencies.md)을 추가한 후, [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 클래스 인스턴스를 생성하고 [엔진](client-engines.md)을 파라미터로 전달하여 클라이언트를 인스턴스화할 수 있습니다:

```kotlin
```
{src="snippets/_misc_client/CioCreate.kt"}

이 예제에서는 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 엔진을 사용합니다.
엔진을 생략할 수도 있습니다:

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

이 경우, 클라이언트는 [빌드 스크립트에 추가된](client-dependencies.md#engine-dependency) 아티팩트에 따라 엔진을 자동으로 선택합니다. 클라이언트가 엔진을 어떻게 선택하는지는 [](client-engines.md#default) 문서 섹션에서 확인할 수 있습니다.

## 클라이언트 구성 {id="configure-client"}

### 기본 구성 {id="basic-config"}

클라이언트를 구성하려면, 클라이언트 생성자에 추가적인 함수형 파라미터를 전달할 수 있습니다.
[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html) 클래스는 클라이언트를 구성하기 위한 기본 클래스입니다.
예를 들어, `expectSuccess` 속성을 사용하여 [응답 유효성 검사](client-response-validation.md)를 활성화할 수 있습니다:

```kotlin
```
{src="snippets/_misc_client/BasicClientConfig.kt"}

### 엔진 구성 {id="engine-config"}
`engine` 함수를 사용하여 엔진을 구성할 수 있습니다:

```kotlin
```
{src="snippets/_misc_client/BasicEngineConfig.kt"}

자세한 내용은 [엔진](client-engines.md) 섹션을 참조하세요.

### 플러그인 {id="plugins"}
플러그인을 설치하려면, [클라이언트 구성 블록](#configure-client) 내에서 `install` 함수에 전달해야 합니다. 예를 들어, [Logging](client-logging.md) 플러그인을 설치하여 HTTP 호출을 로깅할 수 있습니다:

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

`install` 블록 내에서 플러그인을 구성할 수도 있습니다. 예를 들어, [Logging](client-logging.md) 플러그인의 경우, 로거, 로깅 레벨, 그리고 로그 메시지 필터링 조건을 지정할 수 있습니다:
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="13-22"}

참고로, 특정 플러그인은 별도의 [의존성](client-dependencies.md)을 필요로 할 수 있습니다.

## 클라이언트 사용 {id="use-client"}
필요한 모든 [의존성](client-dependencies.md)을 추가하고 클라이언트를 생성한 후, 이를 사용하여 [요청](client-requests.md)을 보내고 [응답](client-responses.md)을 받을 수 있습니다.

## 클라이언트 닫기 {id="close-client"}

HTTP 클라이언트 작업을 마친 후, 스레드, 연결, 그리고 코루틴을 위한 `CoroutineScope`와 같은 자원을 해제해야 합니다. 이를 위해 `HttpClient.close` 함수를 호출합니다:

```kotlin
client.close()
```

참고로, `close` 함수는 새로운 요청 생성을 금지하지만 현재 활성화된 요청을 종료하지는 않습니다. 모든 클라이언트 요청이 완료된 후에야 자원이 해제됩니다.

단일 요청에 `HttpClient`를 사용해야 하는 경우, 코드 블록 실행 후 자동으로 `close`를 호출하는 `use` 함수를 호출하세요:

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 참고로, `HttpClient`를 생성하는 것은 비용이 많이 드는 작업이며, 여러 요청의 경우 해당 인스턴스를 재사용하는 것이 좋습니다.