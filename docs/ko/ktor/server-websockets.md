[//]: # (title: Ktor 서버의 WebSocket)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
WebSockets 플러그인을 사용하면 서버와 클라이언트 간에 양방향 통신 세션을 생성할 수 있습니다.
</link-summary>

<snippet id="websockets-description">

WebSocket은 단일 TCP 연결을 통해 사용자 브라우저와 서버 간에 전이중(full-duplex) 통신 세션을 제공하는 프로토콜입니다.
특히 서버로부터 데이터를 주고받는 실시간 데이터 전송이 필요한 애플리케이션을 만드는 데 유용합니다.

Ktor는 서버 측과 클라이언트 측 모두에서 WebSocket 프로토콜을 지원합니다.

</snippet>

Ktor를 사용하면 다음을 수행할 수 있습니다.

*   프레임 크기, 핑 주기 등 기본적인 WebSocket 설정을 구성합니다.
*   서버와 클라이언트 간 메시지 교환을 위한 WebSocket 세션을 처리합니다.
*   WebSocket 확장 기능을 추가합니다. 예를 들어, [Deflate](server-websocket-deflate.md) 확장을 사용하거나
    [사용자 지정 확장](server-websocket-extensions.md)을 구현할 수 있습니다.

> 클라이언트 측 WebSocket 지원에 대해 알아보려면 [WebSocket 클라이언트 플러그인](client-websockets.topic)을 참조하세요.

> 단방향 통신 세션의 경우 [Server-Sent Events (SSE)](server-server-sent-events.topic) 사용을 고려해 보세요. SSE는 서버가 클라이언트에 이벤트 기반 업데이트를 보내야 하는 경우에 특히 유용합니다.
>
{style="note"}

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## WebSocket 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다.">모듈</Links>에서 <code>install</code> 함수에 플러그인을 전달합니다.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다.
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부에서.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## WebSocket 구성 {id="configure"}

선택적으로 `install` 블록 내에서 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html)를
전달하여 플러그인을 구성할 수 있습니다.

*   `pingPeriod` 속성을 사용하여 핑(ping) 간격 기간을 지정합니다.
*   `timeout` 속성을 사용하여 연결이 닫히기까지의 시간 제한을 설정합니다.
*   `maxFrameSize` 속성을 사용하여 수신 또는 전송될 수 있는 최대 프레임 크기를 설정합니다.
*   `masking` 속성을 사용하여 마스킹 활성화 여부를 지정합니다.
*   `contentConverter` 속성을 사용하여 직렬화/역직렬화를 위한 컨버터를 설정합니다.

[object Promise]

## WebSocket 세션 처리 {id="handle-sessions"}

### API 개요 {id="api-overview"}

`WebSockets` 플러그인을 설치하고 구성한 후에는 WebSocket 세션을 처리할 엔드포인트를 정의할 수 있습니다. 서버에 WebSocket 엔드포인트를 정의하려면 [라우팅](server-routing.md#define_route) 블록 내에서 `webSocket` 함수를 호출합니다.

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

이 예시에서는 [기본 구성](server-configuration-file.topic)이 사용될 때 서버가 `ws://localhost:8080/echo`로 들어오는 WebSocket 요청을 수락합니다.

`webSocket` 블록 내부에서는 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html)
클래스로 표현되는 WebSocket 세션에 대한 핸들러를 정의합니다.
이 블록 내에서 다음 함수와 속성을 사용할 수 있습니다.

*   `send` 함수를 사용하여 클라이언트에 텍스트 콘텐츠를 전송합니다.
*   `incoming` 및 `outgoing` 속성을 사용하여 WebSocket 프레임 수신 및 전송 채널에 접근합니다. 프레임은 `Frame` 클래스로 표현됩니다.
*   `close` 함수를 사용하여 지정된 이유로 close 프레임을 전송합니다.

세션을 처리할 때 프레임 타입을 확인할 수 있습니다. 예를 들어:

*   `Frame.Text`는 텍스트 프레임입니다. 이 프레임 타입의 경우 `Frame.Text.readText()`를 사용하여 콘텐츠를 읽을 수 있습니다.
*   `Frame.Binary`는 바이너리 프레임입니다. 이 타입의 경우 `Frame.Binary.readBytes()`를 사용하여 콘텐츠를 읽을 수 있습니다.

> `incoming` 채널에는 핑/퐁(ping/pong) 또는 close 프레임과 같은 제어 프레임이 포함되지 않습니다. 제어 프레임을 처리하고 조각난 프레임을 재조립하려면 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 함수를 사용하여 WebSocket 세션을 처리하세요.
>
{style="note"}

> 클라이언트 정보(예: 클라이언트의 IP 주소)를 얻으려면 `call` 속성을 사용하세요. [](server-requests.md#request_information)에서 자세히 알아보세요.

아래에서는 이 API를 사용하는 예시를 살펴보겠습니다.

### 예시: 단일 세션 처리 {id="handle-single-session"}

아래 예시는 하나의 클라이언트와 세션을 처리하는 `echo` WebSocket 엔드포인트를 생성하는 방법을 보여줍니다.

[object Promise]

전체 예시는 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)를 참조하세요.

### 예시: 여러 세션 처리 {id="handle-multiple-session"}

여러 WebSocket 세션을 효율적으로 관리하고 브로드캐스팅을 처리하기 위해 Kotlin의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)를 활용할 수 있습니다. 이 접근 방식은 WebSocket 통신 관리를 위한 확장 가능하고 동시성 친화적인 방법을 제공합니다. 이 패턴을 구현하는 방법은 다음과 같습니다.

1.  메시지 브로드캐스팅을 위한 `SharedFlow`를 정의합니다.

[object Promise]

2.  WebSocket 경로에서 브로드캐스팅 및 메시지 처리 로직을 구현합니다.

[object Promise]

`runCatching` 블록은
수신 메시지를 처리하고 이를 `SharedFlow`로 전달하며, `SharedFlow`는 모든 컬렉터에게 브로드캐스트합니다.

이 패턴을 사용하면 개별 연결을 수동으로 추적하지 않고도 여러 WebSocket 세션을 효율적으로 관리할 수 있습니다. 이 접근 방식은 많은 동시 WebSocket 연결이 있는 애플리케이션에 적합하며, 메시지 브로드캐스팅을 처리하는 깔끔하고 반응적인 방법을 제공합니다.

전체 예시는 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)를 참조하세요.

## WebSocket API와 Ktor {id="websocket-api"}

[WebSocket API의 표준 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)는 다음과 같이 Ktor에 매핑됩니다.

*   `onConnect`는 블록 시작 시 발생합니다.
*   `onMessage`는 메시지를 성공적으로 읽은 후(예: `incoming.receive()` 사용) 또는 `for(frame in incoming)`을 사용하여 지연된(suspended) 반복을 수행한 후 발생합니다.
*   `onClose`는 `incoming` 채널이 닫힐 때 발생합니다. 이는 지연된(suspended) 반복을 완료하거나, 메시지를 수신하려고 할 때 `ClosedReceiveChannelException`을 발생시킬 수 있습니다.
*   `onError`는 다른 예외와 동일합니다.

`onClose`와 `onError` 둘 다에서 `closeReason` 속성이 설정됩니다.

다음 예시에서 무한 루프는 예외가 발생했을 때(즉, `ClosedReceiveChannelException` 또는 다른 예외)에만 종료됩니다.

```kotlin
webSocket("/echo") {
    println("onConnect")
    try {
        for (frame in incoming){
            val text = (frame as Frame.Text).readText()
            println("onMessage")
            received += text
            outgoing.send(Frame.Text(text))
        }
    } catch (e: ClosedReceiveChannelException) {
        println("onClose ${closeReason.await()}")
    } catch (e: Throwable) {
        println("onError ${closeReason.await()}")
        e.printStackTrace()
    }
}