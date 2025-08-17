[//]: # (title: Ktor 서버에서 WebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
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
WebSockets 플러그인을 사용하면 서버와 클라이언트 간의 다방향 통신 세션을 생성할 수 있습니다.
</link-summary>

<snippet id="websockets-description">

WebSocket은 단일 TCP 연결을 통해 사용자의 브라우저와 서버 간에 전이중 통신 세션을 제공하는 프로토콜입니다. 서버로/부터 실시간 데이터 전송이 필요한 애플리케이션을 생성하는 데 특히 유용합니다.

Ktor는 서버 및 클라이언트 측 모두에서 WebSocket 프로토콜을 지원합니다.

</snippet>

Ktor를 사용하면 다음을 수행할 수 있습니다.

*   기본 WebSocket 설정(예: 프레임 크기, 핑 주기 등)을 구성합니다.
*   서버와 클라이언트 간 메시지 교환을 위한 WebSocket 세션을 처리합니다.
*   WebSocket 확장 기능을 추가합니다. 예를 들어, [Deflate](server-websocket-deflate.md) 확장 기능을 사용하거나 [사용자 지정 확장 기능](server-websocket-extensions.md)을 구현할 수 있습니다.

> 클라이언트 측 WebSocket 지원에 대해 알아보려면 [WebSockets 클라이언트 플러그인](client-websockets.topic)을 참조하세요.

> 단방향 통신 세션의 경우 [Server-Sent Events (SSE)](server-server-sent-events.topic) 사용을 고려해 보세요. SSE는 서버가 클라이언트에 이벤트 기반 업데이트를 전송해야 하는 경우에 특히 유용합니다.
>
{style="note"}

## 의존성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## WebSockets 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구성할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요. 아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## WebSockets 구성 {id="configure"}

선택적으로, `install` 블록 내에서 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html)을(를) 전달하여 플러그인을 구성할 수 있습니다:

*   `pingPeriod` 속성을 사용하여 핑 간의 지속 시간을 지정합니다.
*   `timeout` 속성을 사용하여 연결이 닫힐 시간 초과를 설정합니다.
*   `maxFrameSize` 속성을 사용하여 수신하거나 보낼 수 있는 최대 `Frame` 크기를 설정합니다.
*   `masking` 속성을 사용하여 마스킹을 활성화할지 여부를 지정합니다.
*   `contentConverter` 속성을 사용하여 직렬화/역직렬화를 위한 컨버터를 설정합니다.

```kotlin
install(WebSockets) {
    pingPeriod = 15.seconds
    timeout = 15.seconds
    maxFrameSize = Long.MAX_VALUE
    masking = false
}
```

## WebSockets 세션 처리 {id="handle-sessions"}

### API 개요 {id="api-overview"}

`WebSockets` 플러그인을 설치하고 구성한 후 WebSocket 세션을 처리할 엔드포인트를 정의할 수 있습니다. 서버에 WebSocket 엔드포인트를 정의하려면 [라우팅](server-routing.md#define_route) 블록 내에서 `webSocket` 함수를 호출합니다:

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

이 예시에서, [기본 구성](server-configuration-file.topic)이 사용될 때 서버는 `ws://localhost:8080/echo`로 WebSocket 요청을 수락합니다.

`webSocket` 블록 내에서 WebSocket 세션에 대한 핸들러를 정의하며, 이는 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html) 클래스로 표현됩니다.
블록 내에서 다음 함수와 속성을 사용할 수 있습니다:

*   `send` 함수를 사용하여 클라이언트에 텍스트 콘텐츠를 보냅니다.
*   `incoming` 및 `outgoing` 속성을 사용하여 WebSocket 프레임을 수신하고 보내기 위한 채널에 접근합니다. 프레임은 `Frame` 클래스로 표현됩니다.
*   `close` 함수를 사용하여 지정된 이유와 함께 종료 프레임을 보냅니다.

세션을 처리할 때, 프레임 유형을 확인할 수 있습니다. 예를 들어:

*   `Frame.Text`는 텍스트 프레임입니다. 이 프레임 유형의 경우 `Frame.Text.readText()`를 사용하여 콘텐츠를 읽을 수 있습니다.
*   `Frame.Binary`는 바이너리 프레임입니다. 이 유형의 경우 `Frame.Binary.readBytes()`를 사용하여 콘텐츠를 읽을 수 있습니다.

> `incoming` 채널에는 핑/퐁 또는 종료 프레임과 같은 제어 프레임이 포함되어 있지 않습니다.
> 제어 프레임을 처리하고 분할된 프레임을 재조립하려면 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 함수를 사용하여 WebSocket 세션을 처리하세요.
>
{style="note"}

> 클라이언트에 대한 정보(예: 클라이언트의 IP 주소)를 얻으려면 `call` 속성을 사용하세요. [일반 요청 정보](server-requests.md#request_information)에 대해 알아보세요.

아래에서 이 API를 사용하는 예시를 살펴보겠습니다.

### 예시: 단일 세션 처리 {id="handle-single-session"}

아래 예시는 단일 클라이언트와의 세션을 처리하기 위해 `echo` WebSocket 엔드포인트를 생성하는 방법을 보여줍니다:

```kotlin
routing {
    webSocket("/echo") {
        send("Please enter your name")
        for (frame in incoming) {
            frame as? Frame.Text ?: continue
            val receivedText = frame.readText()
            if (receivedText.equals("bye", ignoreCase = true)) {
                close(CloseReason(CloseReason.Codes.NORMAL, "Client said BYE"))
            } else {
                send(Frame.Text("Hi, $receivedText!"))
            }
        }
    }
}
```

전체 예시는 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)를 참조하세요.

### 예시: 다중 세션 처리 {id="handle-multiple-session"}

여러 WebSocket 세션을 효율적으로 관리하고 브로드캐스팅을 처리하려면 Kotlin의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)를 활용할 수 있습니다. 이 접근 방식은 WebSocket 통신을 관리하기 위한 확장 가능하고 동시성 친화적인 방법을 제공합니다. 이 패턴을 구현하는 방법은 다음과 같습니다:

1.  메시지 브로드캐스팅을 위한 `SharedFlow`를 정의합니다:

```kotlin
val messageResponseFlow = MutableSharedFlow<MessageResponse>()
val sharedFlow = messageResponseFlow.asSharedFlow()
```

2.  WebSocket 라우트에서 브로드캐스팅 및 메시지 처리 로직을 구현합니다:

```kotlin

        webSocket("/ws") {
            send("You are connected to WebSocket!")

            val job = launch {
                sharedFlow.collect { message ->
                    send(message.message)
                }
            }

            runCatching {
                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        val receivedText = frame.readText()
                        val messageResponse = MessageResponse(receivedText)
                        messageResponseFlow.emit(messageResponse)
                    }
                }
            }.onFailure { exception ->
                println("WebSocket exception: ${exception.localizedMessage}")
            }.also {
                job.cancel()
            }
        }
```

`runCatching` 블록은 수신 메시지를 처리하고 `SharedFlow`로 내보내며, `SharedFlow`는 모든 컬렉터에게 브로드캐스팅합니다.

이 패턴을 사용하면 개별 연결을 수동으로 추적하지 않고도 여러 WebSocket 세션을 효율적으로 관리할 수 있습니다. 이 접근 방식은 동시 WebSocket 연결이 많은 애플리케이션에 잘 맞고, 메시지 브로드캐스팅을 처리하는 깔끔하고 반응적인 방법을 제공합니다.

전체 예시는 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)를 참조하세요.

## WebSocket API와 Ktor {id="websocket-api"}

[WebSocket API의 표준 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)는 Ktor에 다음과 같이 매핑됩니다:

*   `onConnect`는 블록의 시작 부분에서 발생합니다.
*   `onMessage`는 메시지를 성공적으로 읽은 후(예: `incoming.receive()` 사용) 또는 `for(frame in incoming)`과 같은 일시 중단된 반복을 사용할 때 발생합니다.
*   `onClose`는 `incoming` 채널이 닫힐 때 발생합니다. 이는 일시 중단된 반복을 완료하거나 메시지를 수신하려고 할 때 `ClosedReceiveChannelException`을 발생시킵니다.
*   `onError`는 다른 예외와 동일합니다.

`onClose`와 `onError` 모두에서 `closeReason` 속성이 설정됩니다.

다음 예시에서 무한 루프는 예외( `ClosedReceiveChannelException` 또는 다른 예외)가 발생할 때만 종료됩니다:

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