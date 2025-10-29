[//]: # (title: 커스텀 플러그인 - 기본 API)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

> Ktor는 v2.0.0부터 [커스텀 플러그인 생성](server-custom-plugins.md)을 위한 새로운 간소화된 API를 제공합니다.
>
{type="note"}

Ktor는 공통 기능을 구현하고 여러 애플리케이션에서 재사용할 수 있는 커스텀 [플러그인](server-plugins.md) 개발을 위한 API를 제공합니다.
이 API를 사용하면 다양한 [파이프라인](#pipelines) 페이즈를 가로채서 요청/응답 처리에 커스텀 로직을 추가할 수 있습니다.
예를 들어, `Monitoring` 페이즈를 가로채서 들어오는 요청을 로깅하거나 메트릭을 수집할 수 있습니다.

## 플러그인 생성 {id="create"}
커스텀 플러그인을 생성하려면 다음 단계를 따르십시오:

1.  플러그인 클래스를 생성하고 다음 인터페이스 중 하나를 구현하는 [컴패니언 오브젝트를 선언합니다](#create-companion):
    -   플러그인이 애플리케이션 수준에서 작동해야 하는 경우 [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html).
    -   플러그인이 [특정 라우트에 설치될 수 있는 경우](server-plugins.md#install-route) [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html).
2.  이 컴패니언 오브젝트의 `key` 및 `install` 멤버를 [구현합니다](#implement).
3.  [플러그인 설정](#plugin-configuration)을 제공합니다.
4.  필요한 파이프라인 페이즈를 가로채서 [호출을 처리합니다](#call-handling).
5.  [플러그인을 설치합니다](#install).

### 컴패니언 오브젝트 생성 {id="create-companion"}

커스텀 플러그인 클래스에는 `BaseApplicationPlugin` 또는 `BaseRouteScopedPlugin` 인터페이스를 구현하는 컴패니언 오브젝트가 있어야 합니다.
`BaseApplicationPlugin` 인터페이스는 세 가지 타입 파라미터를 받습니다:
-   이 플러그인과 호환되는 파이프라인의 타입.
-   이 플러그인에 대한 [설정 객체 타입](#plugin-configuration).
-   플러그인 객체의 인스턴스 타입.

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 'key' 및 'install' 멤버 구현 {id="implement"}

`BaseApplicationPlugin` 인터페이스의 하위 요소로서, 컴패니언 오브젝트는 두 멤버를 구현해야 합니다:
-   `key` 프로퍼티는 플러그인을 식별하는 데 사용됩니다. Ktor는 모든 속성의 맵을 가지고 있으며, 각 플러그인은 지정된 키를 사용하여 자신을 이 맵에 추가합니다.
-   `install` 함수는 플러그인이 작동하는 방식을 설정할 수 있게 해줍니다. 여기에서 파이프라인을 가로채고 플러그인 인스턴스를 반환해야 합니다. 파이프라인을 가로채고 호출을 처리하는 방법은 [다음 챕터](#call-handling)에서 살펴보겠습니다.

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            // Intercept a pipeline ...
            return plugin
        }
    }
}
```

### 호출 처리 {id="call-handling"}

커스텀 플러그인에서 [기존 파이프라인 페이즈](#pipelines) 또는 새로 정의된 페이즈를 가로채서 요청과 응답을 처리할 수 있습니다. 예를 들어, [Authentication](server-auth.md) 플러그인은 `Authenticate` 및 `Challenge` 커스텀 페이즈를 기본 파이프라인에 추가합니다. 따라서 특정 파이프라인을 가로채면 호출의 다양한 단계에 접근할 수 있습니다. 예를 들어:

-   `ApplicationCallPipeline.Monitoring`: 이 페이즈를 가로채는 것은 요청 로깅 또는 메트릭 수집에 사용될 수 있습니다.
-   `ApplicationCallPipeline.Plugins`: 응답 파라미터를 수정하는 데 사용될 수 있으며, 예를 들어 커스텀 헤더를 추가할 수 있습니다.
-   `ApplicationReceivePipeline.Transform` 및 `ApplicationSendPipeline.Transform`: 클라이언트로부터 수신된 데이터를 얻고 [변환](#transform)하며, 데이터를 다시 보내기 전에 변환할 수 있게 해줍니다.

아래 예시는 `ApplicationCallPipeline.Plugins` 페이즈를 가로채서 각 응답에 커스텀 헤더를 추가하는 방법을 보여줍니다:

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header("X-Custom-Header", "Hello, world!")
            }
            return plugin
        }
    }
}
```

이 플러그인에서 커스텀 헤더 이름과 값이 하드코딩되어 있음에 유의하십시오. 필요한 커스텀 헤더 이름/값을 전달하기 위한 [설정](#plugin-configuration)을 제공하여 이 플러그인을 더 유연하게 만들 수 있습니다.

> 커스텀 플러그인을 사용하면 호출과 관련된 모든 값을 공유할 수 있으므로, 이 값을 해당 호출을 처리하는 모든 핸들러 내에서 접근할 수 있습니다. [호출 상태 공유](server-custom-plugins.md#call-state)에서 더 자세히 알아볼 수 있습니다.

### 플러그인 설정 제공 {id="plugin-configuration"}

[이전 챕터](#call-handling)에서는 미리 정의된 커스텀 헤더를 각 응답에 추가하는 플러그인을 생성하는 방법을 보여줍니다. 이 플러그인을 더 유용하게 만들고 필요한 커스텀 헤더 이름/값을 전달하기 위한 설정을 제공해봅시다. 먼저, 플러그인 클래스 내에 설정 클래스를 정의해야 합니다:

```kotlin
class Configuration {
    var headerName = "Custom-Header-Name"
    var headerValue = "Default value"
}
```

플러그인 설정 필드는 변경 가능(mutable)하므로, 이를 지역 변수에 저장하는 것이 좋습니다:

```kotlin
class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }
}
```

마지막으로, `install` 함수에서 이 설정을 가져와서 그 속성을 사용할 수 있습니다.

```kotlin
class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }

    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val configuration = Configuration().apply(configure)
            val plugin = CustomHeader(configuration)
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header(plugin.name, plugin.value)
            }
            return plugin
        }
    }
}
```

### 플러그인 설치 {id="install"}

애플리케이션에 커스텀 플러그인을 [설치](server-plugins.md#install)하려면 `install` 함수를 호출하고 원하는 [설정](#plugin-configuration) 파라미터를 전달하십시오:

```kotlin
install(CustomHeader) {
    headerName = "X-Custom-Header"
    headerValue = "Hello, world!"
}
```

## 예시 {id="examples"}

아래 코드 스니펫은 커스텀 플러그인의 몇 가지 예시를 보여줍니다.
실행 가능한 프로젝트는 여기에서 찾을 수 있습니다: [custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### 요청 로깅 {id="request-logging"}

아래 예시는 들어오는 요청을 로깅하기 위한 커스텀 플러그인을 생성하는 방법을 보여줍니다:

```kotlin
package com.example.plugins

import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.util.*

class RequestLogging {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, RequestLogging> {
        override val key = AttributeKey<RequestLogging>("RequestLogging")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): RequestLogging {
            val plugin = RequestLogging()
            pipeline.intercept(ApplicationCallPipeline.Monitoring) {
                call.request.origin.apply {
                    println("Request URL: $scheme://$localHost:$localPort$uri")
                }
            }
            return plugin
        }
    }
}

```

### 커스텀 헤더 {id="custom-header"}

이 예시는 각 응답에 커스텀 헤더를 추가하는 플러그인을 생성하는 방법을 보여줍니다:

```kotlin
package com.example.plugins

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.util.*

class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }

    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val configuration = Configuration().apply(configure)
            val plugin = CustomHeader(configuration)
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header(plugin.name, plugin.value)
            }
            return plugin
        }
    }
}

```

### 본문 변환 {id="transform"}

아래 예시는 다음을 보여줍니다:
-   클라이언트로부터 수신된 데이터를 변환하는 방법;
-   클라이언트로 전송될 데이터를 변환하는 방법.

```kotlin
package com.example.plugins

import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.util.*
import io.ktor.utils.io.*

class DataTransformation {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, DataTransformation> {
        override val key = AttributeKey<DataTransformation>("DataTransformation")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): DataTransformation {
            val plugin = DataTransformation()
            pipeline.receivePipeline.intercept(ApplicationReceivePipeline.Transform) { data ->
                val newValue = (data as ByteReadChannel).readUTF8Line()?.toInt()?.plus(1)
                if (newValue != null) {
                    proceedWith(newValue)
                }
            }
            pipeline.sendPipeline.intercept(ApplicationSendPipeline.Transform) { data ->
                if (subject is Int) {
                    val newValue = data.toString().toInt() + 1
                    proceedWith(newValue.toString())
                }
            }
            return plugin
        }
    }
}

```

## 파이프라인 {id="pipelines"}

Ktor의 [파이프라인](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html)은 하나 이상의 정렬된 페이즈로 그룹화된 인터셉터들의 집합입니다. 각 인터셉터는 요청을 처리하기 전과 후에 커스텀 로직을 수행할 수 있습니다.

[ApplicationCallPipeline](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html)은 애플리케이션 호출을 실행하기 위한 파이프라인입니다. 이 파이프라인은 5가지 페이즈를 정의합니다:

-   `Setup`: 호출과 해당 속성을 처리하기 위해 준비하는 데 사용되는 페이즈.
-   `Monitoring`: 호출을 추적하기 위한 페이즈입니다. 요청 로깅, 메트릭 수집, 오류 처리 등에 유용할 수 있습니다.
-   `Plugins`: [호출을 처리](#call-handling)하는 데 사용되는 페이즈입니다. 대부분의 플러그인은 이 페이즈에서 가로챕니다.
-   `Call`: 호출을 완료하는 데 사용되는 페이즈.
-   `Fallback`: 처리되지 않은 호출을 처리하기 위한 페이즈.

## 파이프라인 페이즈를 새 API 핸들러에 매핑 {id="mapping"}

Ktor는 v2.0.0부터 [커스텀 플러그인 생성](server-custom-plugins.md)을 위한 새로운 간소화된 API를 제공합니다.
일반적으로 이 API는 파이프라인, 페이즈 등과 같은 Ktor 내부 개념에 대한 이해를 요구하지 않습니다. 대신, `onCall`, `onCallReceive`, `onCallRespond` 등과 같은 다양한 핸들러를 사용하여 [요청 및 응답 처리](#call-handling)의 여러 단계에 접근할 수 있습니다.
아래 표는 파이프라인 페이즈가 새 API의 핸들러에 어떻게 매핑되는지 보여줍니다.

| 기존 API                               | 새로운 API                                                 |
|:---------------------------------------|:---------------------------------------------------------|
| before `ApplicationCallPipeline.Setup` | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| after `Authentication.ChallengePhase`  | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |