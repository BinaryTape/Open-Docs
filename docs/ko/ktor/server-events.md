[//]: # (title: 애플리케이션 모니터링)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

Ktor는 이벤트를 사용하여 서버 애플리케이션을 모니터링할 수 있는 기능을 제공합니다.
애플리케이션의 수명 주기(애플리케이션 시작, 중지 등)와 관련된 사전 정의된 이벤트를 처리하거나, 커스텀 이벤트를 사용하여 특정 경우를 처리할 수 있습니다. 또한 [MonitoringEvent](server-custom-plugins.md#handle-app-events) 훅을 사용하여 커스텀 플러그인에 대한 이벤트를 처리할 수도 있습니다.

## 이벤트 정의 {id="event-definition"}

각 이벤트는 [EventDefinition](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-event-definition/index.html) 클래스 인스턴스로 표현됩니다. 이 클래스에는 이벤트에 전달되는 값의 타입을 지정하는 `T` 타입 파라미터가 있습니다. 이 값은 [이벤트 핸들러](#handle-events-application)에서 람다 인자로 액세스할 수 있습니다. 예를 들어, 대부분의 [사전 정의된 이벤트](#predefined-events)는 `Application`을 파라미터로 받아 이벤트 핸들러 내부에서 애플리케이션 속성에 액세스할 수 있도록 합니다.

[커스텀 이벤트](#custom-events)의 경우, 이 이벤트에 필요한 타입 파라미터를 전달할 수 있습니다. 아래 코드 스니펫은 `ApplicationCall` 인스턴스를 받는 커스텀 `NotFoundEvent`를 생성하는 방법을 보여줍니다.

[object Promise]

[](#custom-events) 섹션은 서버가 리소스에 대해 `404 Not Found` 상태 코드를 반환할 때 커스텀 플러그인에서 이 이벤트를 발생시키는 방법을 보여줍니다.

### 사전 정의된 애플리케이션 이벤트 {id="predefined-events"}

Ktor는 애플리케이션 수명 주기와 관련된 다음과 같은 사전 정의된 이벤트를 제공합니다.

- [ApplicationStarting](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopped.html)

예를 들어, 애플리케이션 리소스를 해제하기 위해 `ApplicationStopped` 이벤트를 구독할 수 있습니다.

## 애플리케이션에서 이벤트 처리 {id="handle-events-application"}

지정된 `Application` 인스턴스에 대한 이벤트를 처리하려면 `monitor` 속성을 사용하십시오.
이 속성은 애플리케이션 이벤트를 처리할 수 있도록 다음 함수들을 노출하는 [Events](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-events/index.html) 인스턴스에 대한 액세스를 제공합니다.

- `subscribe`: [EventDefinition](#event-definition)으로 지정된 이벤트를 구독합니다.
- `unsubscribe`: [EventDefinition](#event-definition)으로 지정된 이벤트 구독을 취소합니다.
- `raise`: [EventDefinition](#event-definition)으로 지정된 이벤트를 지정된 값과 함께 발생시킵니다.
  > [](#custom-events) 섹션은 커스텀 이벤트를 발생시키는 방법을 보여줍니다.

`subscribe` / `unsubscribe` 함수는 `EventDefinition` 인스턴스와 `T` 값을 람다 인자로 받습니다. 아래 예시는 `ApplicationStarted` 이벤트를 구독하고 이벤트 핸들러에서 메시지를 [로그](server-logging.md)하는 방법을 보여줍니다.

[object Promise]

이 예시에서는 `ApplicationStopped` 이벤트를 처리하는 방법을 볼 수 있습니다.

[object Promise]

전체 예시는 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)를 참조하십시오.

## 커스텀 플러그인에서 이벤트 처리 {id="handle-events-plugin"}

`MonitoringEvent` 훅을 사용하여 [커스텀 플러그인](server-custom-plugins.md#handle-app-events)에서 이벤트를 처리할 수 있습니다. 아래 예시는 `ApplicationMonitoringPlugin` 플러그인을 생성하고 `ApplicationStarted` 및 `ApplicationStopped` 이벤트를 처리하는 방법을 보여줍니다.

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events).

## 커스텀 이벤트 {id="custom-events"}

이 섹션에서는 서버가 리소스에 대해 `404 Not Found` 상태 코드를 반환할 때 발생되는 커스텀 이벤트를 생성하는 방법을 살펴봅니다.

1. 먼저 [이벤트 정의](#event-definition)를 생성해야 합니다.
   아래 코드 스니펫은 `ApplicationCall`을 파라미터로 받는 커스텀 `NotFoundEvent` 이벤트를 생성하는 방법을 보여줍니다.

   [object Promise]
2. 이벤트를 발생시키려면 `Events.raise` 함수를 호출하십시오. 아래 예시는 호출에 대한 상태 코드가 `404`인 경우 새로 생성된 이벤트를 발생시키기 위해 `ResponseSent` [훅](server-custom-plugins.md#other)을 처리하는 방법을 보여줍니다.

   [object Promise]
3. 애플리케이션에서 생성된 이벤트를 처리하려면 플러그인을 [설치](server-plugins.md#install)하십시오.

   [object Promise]

4. 그런 다음 `Events.subscribe`를 사용하여 이벤트를 구독하십시오.

   [object Promise]

전체 예시는 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)를 참조하십시오.