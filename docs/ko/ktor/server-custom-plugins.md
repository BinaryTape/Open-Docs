[//]: # (title: 커스텀 서버 플러그인)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
나만의 커스텀 플러그인을 만드는 방법을 알아보세요.
</link-summary>

v2.0.0부터 Ktor는 커스텀 [플러그인](server-plugins.md) 생성을 위한 새로운 API를 제공합니다. 일반적으로 이 API는 파이프라인, 페이즈(phase) 등 Ktor의 내부 개념을 이해할 필요가 없습니다. 대신, `onCall`, `onCallReceive`, `onCallRespond` 핸들러를 사용하여 [요청 및 응답 처리](#call-handling)의 다양한 단계에 접근할 수 있습니다.

> 이 토픽에서 설명하는 API는 v2.0.0 이상 버전부터 적용됩니다. 이전 버전의 경우, [기본 API](server-custom-plugins-base-api.md)를 사용할 수 있습니다.

## 첫 번째 플러그인 생성 및 설치 {id="first-plugin"}

이 섹션에서는 첫 번째 플러그인을 생성하고 설치하는 방법을 보여드립니다. [새 Ktor 프로젝트 생성, 열기 및 실행](server-create-a-new-project.topic) 튜토리얼에서 생성된 애플리케이션을 시작 프로젝트로 사용할 수 있습니다.

1.  플러그인을 생성하려면, [createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html) 함수를 호출하고 플러그인 이름을 전달합니다:
    ```kotlin
    import io.ktor.server.application.*
    
    val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
        println("SimplePlugin is installed!")
    }
    ```

    이 함수는 다음 단계에서 플러그인을 설치하는 데 사용될 `ApplicationPlugin` 인스턴스를 반환합니다.
    > [특정 라우트에 설치](server-plugins.md#install-route)할 수 있는 플러그인을 생성할 수 있는 [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html) 함수도 있습니다.
2.  [플러그인을 설치](server-plugins.md#install)하려면, 생성된 `ApplicationPlugin` 인스턴스를 애플리케이션의 초기화 코드에 있는 `install` 함수에 전달합니다:
    ```kotlin
    fun Application.module() {
        install(SimplePlugin)
    }
    ```
3.  마지막으로, 애플리케이션을 [실행](server-run.md)하여 콘솔 출력에서 플러그인의 환영 메시지를 확인하세요:
    ```Bash
    2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
    SimplePlugin is installed!
    2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```

전체 예시는 다음에서 찾을 수 있습니다: [SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt). 다음 섹션에서는 다양한 단계에서 호출을 처리하는 방법과 플러그인 구성을 제공하는 방법을 살펴보겠습니다.

## 호출 처리 {id="call-handling"}

커스텀 플러그인에서 호출의 다양한 단계에 접근을 제공하는 핸들러 세트를 사용하여 [요청](server-requests.md)과 [응답](server-responses.md)을 처리할 수 있습니다:

*   [`onCall`](#on-call)을 사용하면 요청/응답 정보를 가져오고 응답 매개변수(예: 커스텀 헤더 추가) 등을 수정할 수 있습니다.
*   [`onCallReceive`](#on-call-receive)를 사용하면 클라이언트로부터 수신된 데이터를 얻고 변환할 수 있습니다.
*   [`onCallRespond`](#on-call-respond)를 사용하면 클라이언트에 데이터를 보내기 전에 데이터를 변환할 수 있습니다.
*   [`on(...)`](#other)을 사용하면 호출의 다른 단계 또는 호출 중 발생한 예외를 처리하는 데 유용할 수 있는 특정 훅(hook)을 호출할 수 있습니다.
*   필요한 경우 `call.attributes`를 사용하여 다른 핸들러 간에 [호출 상태](#call-state)를 공유할 수 있습니다.

### onCall {id="on-call"}

`onCall` 핸들러는 `ApplicationCall`을 람다 인수로 받습니다. 이를 통해 요청/응답 정보에 접근하고 응답 매개변수(예: [커스텀 헤더 추가](#custom-header))를 수정할 수 있습니다. 요청/응답 바디를 변환해야 하는 경우, [`onCallReceive`](#on-call-receive)/[`onCallRespond`](#on-call-respond)를 사용하세요.

#### 예시 1: 요청 로깅 {id="request-logging"}

아래 예시는 `onCall`을 사용하여 수신 요청을 로깅하기 위한 커스텀 플러그인을 생성하는 방법을 보여줍니다:

```kotlin
val RequestLoggingPlugin = createApplicationPlugin(name = "RequestLoggingPlugin") {
    onCall { call ->
        call.request.origin.apply {
            println("Request URL: $scheme://$localHost:$localPort$uri")
        }
    }
}
```

이 플러그인을 설치하면 애플리케이션이 요청된 URL을 콘솔에 표시합니다. 예시는 다음과 같습니다:

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 예시 2: 커스텀 헤더 {id="custom-header"}

이 예시는 각 응답에 커스텀 헤더를 추가하는 플러그인을 생성하는 방법을 보여줍니다:

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

결과적으로, 모든 응답에 커스텀 헤더가 추가됩니다:

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

이 플러그인의 커스텀 헤더 이름과 값은 하드코딩되어 있습니다. 필요한 커스텀 헤더 이름/값을 전달하기 위한 [구성](#plugin-configuration)을 제공하여 이 플러그인을 더 유연하게 만들 수 있습니다.

### onCallReceive {id="on-call-receive"}

`onCallReceive` 핸들러는 `transformBody` 함수를 제공하며 클라이언트로부터 수신된 데이터를 변환할 수 있도록 합니다. 클라이언트가 바디에 `text/plain`으로 `10`을 포함하는 샘플 `POST` 요청을 한다고 가정해 봅시다:

```HTTP
POST http://localhost:8080/transform-data
Content-Type: text/plain

10

```

이 바디를 정수 값으로 [수신](server-requests.md#objects)하려면, `POST` 요청을 위한 라우트 핸들러를 생성하고 `Int` 매개변수로 `call.receive`를 호출해야 합니다:

```kotlin
post("/transform-data") {
    val data = call.receive<Int>()
}
```

이제 정수 값으로 바디를 수신하고 거기에 `1`을 더하는 플러그인을 만들어 봅시다. 이를 위해 `onCallReceive` 내에서 `transformBody`를 다음과 같이 처리해야 합니다:

```kotlin
val DataTransformationPlugin = createApplicationPlugin(name = "DataTransformationPlugin") {
    onCallReceive { call ->
        transformBody { data ->
            if (requestedType?.type == Int::class) {
                val line = data.readUTF8Line() ?: "1"
                line.toInt() + 1
            } else {
                data
            }
        }
    }
}
```

위 코드 스니펫의 `transformBody`는 다음과 같이 작동합니다:

1.  `TransformBodyContext`는 현재 요청에 대한 타입 정보를 포함하는 [람다 리시버](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)입니다. 위 예시에서는 `TransformBodyContext.requestedType` 속성이 요청된 데이터 타입을 확인하는 데 사용됩니다.
2.  `data`는 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)로 요청 바디를 수신하고 필요한 타입으로 변환할 수 있도록 하는 람다 인수입니다. 위 예시에서는 `ByteReadChannel.readUTF8Line`이 요청 바디를 읽는 데 사용됩니다.
3.  마지막으로, 데이터를 변환하여 반환해야 합니다. 이 예시에서는 수신된 정수 값에 `1`이 추가됩니다.

전체 예시는 다음에서 찾을 수 있습니다: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt).

### onCallRespond {id="on-call-respond"}

`onCallRespond` 또한 `transformBody` 핸들러를 제공하며 클라이언트에 보낼 데이터를 변환할 수 있도록 합니다. 이 핸들러는 라우트 핸들러에서 `call.respond` 함수가 호출될 때 실행됩니다. `POST` 요청 핸들러에서 정수 값을 수신하는 [`onCallReceive`](#on-call-receive) 예시를 계속해서 살펴보겠습니다:

```kotlin
post("/transform-data") {
    val data = call.receive<Int>()
    call.respond(data)
}
```

`call.respond`를 호출하면 `onCallRespond`가 호출되어 클라이언트에 보낼 데이터를 변환할 수 있습니다. 예를 들어, 아래 코드 스니펫은 초기 값에 `1`을 더하는 방법을 보여줍니다:

```kotlin
onCallRespond { call ->
    transformBody { data ->
        if (data is Int) {
            (data + 1).toString()
        } else {
            data
        }
    }
}
```

전체 예시는 다음에서 찾을 수 있습니다: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt).

### 기타 유용한 핸들러 {id="other"}

`onCall`, `onCallReceive`, `onCallRespond` 핸들러 외에도 Ktor는 호출의 다른 단계를 처리하는 데 유용할 수 있는 특정 훅(hook) 세트를 제공합니다. `Hook`을 매개변수로 받는 `on` 핸들러를 사용하여 이러한 훅을 처리할 수 있습니다. 이러한 훅에는 다음이 포함됩니다:

-   `CallSetup`은 호출을 처리하는 첫 번째 단계로 호출됩니다.
-   `ResponseBodyReadyForSend`는 응답 바디가 모든 변환을 거쳐 전송될 준비가 되었을 때 호출됩니다.
-   `ResponseSent`는 응답이 클라이언트에 성공적으로 전송되었을 때 호출됩니다.
-   `CallFailed`는 호출이 예외와 함께 실패할 때 호출됩니다.
-   [AuthenticationChecked](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html)는 [인증](server-auth.md) 자격 증명이 확인된 후 실행됩니다. 다음 예시는 이 훅을 사용하여 인가(authorization)를 구현하는 방법을 보여줍니다: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization).

아래 예시는 `CallSetup`을 처리하는 방법을 보여줍니다:

```kotlin
on(CallSetup) { call->
    // ...
}
```

> 애플리케이션 시작 또는 종료와 같은 [애플리케이션 이벤트 처리](#handle-app-events)를 가능하게 하는 `MonitoringEvent` 훅도 있습니다.

### 호출 상태 공유 {id="call-state"}

커스텀 플러그인을 사용하면 호출과 관련된 모든 값을 공유할 수 있으므로, 이 호출을 처리하는 모든 핸들러 내에서 해당 값에 접근할 수 있습니다. 이 값은 `call.attributes` 컬렉션에 고유한 키를 가진 속성으로 저장됩니다. 아래 예시는 요청 수신과 바디 읽기 사이의 시간을 계산하기 위해 속성을 사용하는 방법을 보여줍니다:

```kotlin
val DataTransformationBenchmarkPlugin = createApplicationPlugin(name = "DataTransformationBenchmarkPlugin") {
    val onCallTimeKey = AttributeKey<Long>("onCallTimeKey")
    onCall { call ->
        val onCallTime = System.currentTimeMillis()
        call.attributes.put(onCallTimeKey, onCallTime)
    }

    onCallReceive { call ->
        val onCallTime = call.attributes[onCallTimeKey]
        val onCallReceiveTime = System.currentTimeMillis()
        println("Read body delay (ms): ${onCallReceiveTime - onCallTime}")
    }
}
```

`POST` 요청을 하면 플러그인은 콘솔에 지연 시간을 출력합니다:

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

전체 예시는 다음에서 찾을 수 있습니다: [DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt).

> [라우트 핸들러](server-requests.md#request_information)에서도 호출 속성에 접근할 수 있습니다.

## 애플리케이션 이벤트 처리 {id="handle-app-events"}

[`on`](#other) 핸들러는 `MonitoringEvent` 훅을 사용하여 애플리케이션의 수명 주기와 관련된 이벤트를 처리할 수 있는 기능을 제공합니다. 예를 들어, 다음 [사전 정의된 이벤트](server-events.md#predefined-events)를 `on` 핸들러에 전달할 수 있습니다:

-   `ApplicationStarting`
-   `ApplicationStarted`
-   `ApplicationStopPreparing`
-   `ApplicationStopping`
-   `ApplicationStopped`

아래 코드 스니펫은 `ApplicationStopped`를 사용하여 애플리케이션 종료를 처리하는 방법을 보여줍니다:

```kotlin
package com.example.plugins

import io.ktor.events.EventDefinition
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.application.hooks.*

val ApplicationMonitoringPlugin = createApplicationPlugin(name = "ApplicationMonitoringPlugin") {
    on(MonitoringEvent(ApplicationStarted)) { application ->
        application.log.info("Server is started")
    }
    on(MonitoringEvent(ApplicationStopped)) { application ->
        application.log.info("Server is stopped")
        // Release resources and unsubscribe from events
        application.monitor.unsubscribe(ApplicationStarted) {}
        application.monitor.unsubscribe(ApplicationStopped) {}
    }
    on(ResponseSent) { call ->
        if (call.response.status() == HttpStatusCode.NotFound) {
            this@createApplicationPlugin.application.monitor.raise(NotFoundEvent, call)
        }
    }
}

val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()

```

이는 애플리케이션 리소스를 해제하는 데 유용할 수 있습니다.

## 플러그인 구성 제공 {id="plugin-configuration"}

[커스텀 헤더](#custom-header) 예시는 사전 정의된 커스텀 헤더를 각 응답에 추가하는 플러그인을 생성하는 방법을 보여줍니다. 이 플러그인을 더 유용하게 만들고 필요한 커스텀 헤더 이름/값을 전달하기 위한 구성을 제공해 봅시다.

1.  먼저 구성 클래스를 정의해야 합니다:

    ```kotlin
    class PluginConfiguration {
        var headerName: String = "Custom-Header-Name"
        var headerValue: String = "Default value"
    }
    ```

2.  플러그인에서 이 구성을 사용하려면, 구성 클래스 참조를 `createApplicationPlugin`에 전달합니다:

    ```kotlin
    val CustomHeaderPlugin = createApplicationPlugin(
        name = "CustomHeaderPlugin",
        createConfiguration = ::PluginConfiguration
    ) {
        val headerName = pluginConfig.headerName
        val headerValue = pluginConfig.headerValue
        pluginConfig.apply {
            onCall { call ->
                call.response.headers.append(headerName, headerValue)
            }
        }
    }
    ```

    플러그인 구성 필드는 변경 가능(mutable)하므로, 로컬 변수에 저장하는 것이 권장됩니다.

3.  마지막으로, 다음과 같이 플러그인을 설치하고 구성할 수 있습니다:

    ```kotlin
    install(CustomHeaderPlugin) {
        headerName = "X-Custom-Header"
        headerValue = "Hello, world!"
    }
    ```

> 전체 예시는 다음에서 찾을 수 있습니다: [CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt).

### 파일 내 구성 {id="configuration-file"}

Ktor는 [구성 파일](server-create-and-configure.topic#engine-main)에서 플러그인 설정을 지정할 수 있도록 합니다. `CustomHeaderPlugin`에 대해 이를 어떻게 구현하는지 살펴보겠습니다:

1.  먼저, 플러그인 설정을 포함하는 새 그룹을 `application.conf` 또는 `application.yaml` 파일에 추가합니다:

    <Tabs group="config">
    <TabItem title="application.conf" group-key="hocon">

    ```shell
    http {
        custom_header {
            header_name = X-Another-Custom-Header
            header_value = Some value
        }
    }
    ```

    </TabItem>
    <TabItem title="application.yaml" group-key="yaml">

    ```yaml
    http:
      custom_header:
        header_name: X-Another-Custom-Header
        header_value: Some value
    ```

    </TabItem>
    </Tabs>

    이 예시에서는 플러그인 설정이 `http.custom_header` 그룹에 저장됩니다.

2.  구성 파일 속성에 접근하려면 `ApplicationConfig`를 구성 클래스 생성자에 전달합니다. `tryGetString` 함수는 지정된 속성 값을 반환합니다:

    ```kotlin
    class CustomHeaderConfiguration(config: ApplicationConfig) {
        var headerName: String = config.tryGetString("header_name") ?: "Custom-Header-Name"
        var headerValue: String = config.tryGetString("header_value") ?: "Default value"
    }
    ```

3.  마지막으로, `http.custom_header` 값을 `createApplicationPlugin` 함수의 `configurationPath` 매개변수에 할당합니다:

    ```kotlin
    val CustomHeaderPluginConfigurable = createApplicationPlugin(
        name = "CustomHeaderPluginConfigurable",
        configurationPath = "http.custom_header",
        createConfiguration = ::CustomHeaderConfiguration
    ) {
        val headerName = pluginConfig.headerName
        val headerValue = pluginConfig.headerValue
        pluginConfig.apply {
            onCall { call ->
                call.response.headers.append(headerName, headerValue)
            }
        }
    }
    ```

> 전체 예시는 다음에서 찾을 수 있습니다: [CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt).

## 애플리케이션 설정 접근 {id="app-settings"}

### 구성 {id="config"}

[ApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-application-config/index.html) 인스턴스를 반환하는 `applicationConfig` 속성을 사용하여 서버 구성을 접근할 수 있습니다. 아래 예시는 서버에서 사용하는 호스트와 포트를 가져오는 방법을 보여줍니다:

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 환경 {id="environment"}

애플리케이션의 환경에 접근하려면 `environment` 속성을 사용합니다. 예를 들어, 이 속성을 사용하면 [개발 모드](server-development-mode.topic)가 활성화되어 있는지 확인할 수 있습니다:

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val isDevMode = environment?.developmentMode
   onCall { call ->
      if (isDevMode == true) {
         println("handling request ${call.request.uri}")
      }
   }
}
```

## 기타 {id="misc"}

### 플러그인 상태 저장 {id="plugin-state"}

플러그인의 상태를 저장하려면, 핸들러 람다에서 모든 값을 캡처할 수 있습니다. 모든 상태 값을 동시성 데이터 구조와 아토믹 데이터 타입을 사용하여 스레드 안전하게 만드는 것이 권장됩니다:

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val activeRequests = AtomicInteger(0)
   onCall {
      activeRequests.incrementAndGet()
   }
   onCallRespond {
      activeRequests.decrementAndGet()
   }
}
```

### 데이터베이스 {id="databases"}

*   suspendable 데이터베이스와 함께 커스텀 플러그인을 사용할 수 있나요?

    네, 모든 핸들러는 suspending 함수이므로 플러그인 내에서 suspendable 데이터베이스 작업을 수행할 수 있습니다. 하지만 특정 호출에 대한 리소스 할당을 해제하는 것을 잊지 마세요(예: [`on(ResponseSent)`](#other) 사용).

*   블로킹 데이터베이스와 함께 커스텀 플러그인을 사용하는 방법은 무엇인가요?

    Ktor는 코루틴과 suspending 함수를 사용하므로, 블로킹 데이터베이스에 요청을 하면 위험할 수 있습니다. 블로킹 호출을 수행하는 코루틴이 블로킹된 다음 영원히 중단될 수 있기 때문입니다. 이를 방지하려면 별도의 [코루틴 컨텍스트](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)를 생성해야 합니다:
    ```kotlin
    val databaseContext = newSingleThreadContext("DatabaseThread")
    ```
    그런 다음, 컨텍스트가 생성되면 데이터베이스에 대한 각 호출을 `withContext` 호출로 래핑합니다:
    ```kotlin
    onCall {
        withContext(databaseContext) {
            database.access(...) // some call to your database
        }
    }
    ```