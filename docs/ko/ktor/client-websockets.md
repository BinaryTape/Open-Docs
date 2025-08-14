```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-websockets" title="Ktor 클라이언트의 웹소켓">
    <show-structure for="chapter" depth="3"/>
    <primary-label ref="client-plugin"/>
    <var name="example_name" value="client-websockets"/>
    <var name="artifact_name" value="ktor-client-websockets"/>
    <tldr>
        <p>
            <b>필수 의존성</b>: <code>io.ktor:ktor-client-websockets</code>
        </p>
        <p>
            <b>코드 예시</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
                %example_name%
            </a>
        </p>
    </tldr>
    <link-summary>
        웹소켓 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.
    </link-summary>
    <snippet id="websockets-description">
        웹소켓은 단일 TCP 연결을 통해 사용자 브라우저와 서버 간에 전이중 통신 세션을 제공하는 프로토콜입니다. 특히 서버와 실시간으로 데이터를 주고받아야 하는 애플리케이션을 생성하는 데 유용합니다.
        Ktor는 서버 측과 클라이언트 측 모두에서 웹소켓 프로토콜을 지원합니다.
    </snippet>
    <p>클라이언트용 웹소켓 플러그인을 사용하면 서버와 메시지를 교환하기 위한 웹소켓 세션을 처리할 수 있습니다.</p>
    <note>
        <p>모든 엔진이 웹소켓을 지원하는 것은 아닙니다. 지원되는 엔진에 대한 개요는 <a href="client-engines.md#limitations">제한 사항</a>을 참조하십시오.</p>
    </note>
    <tip>
        <p>서버 측 웹소켓 지원에 대해 알아보려면 <Links href="/ktor/server-websockets" summary="웹소켓 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.">Ktor 서버의 웹소켓</Links>을 참조하십시오.</p>
    </tip>
    <chapter title="의존성 추가" id="add_dependencies">
        <p><code>WebSockets</code>를 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.</p>
        <tabs group="languages">
            <tab title="Gradle (코틀린)" group-key="kotlin">
                [object Promise]
            </tab>
            <tab title="Gradle (그루비)" group-key="groovy">
                [object Promise]
            </tab>
            <tab title="Maven" group-key="maven">
                [object Promise]
            </tab>
        </tabs>
        <p>
            Ktor 클라이언트에 필요한 아티팩트에 대한 자세한 내용은 <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아보세요.">클라이언트 의존성 추가</Links>에서 확인할 수 있습니다.
        </p>
    </chapter>
    <chapter title="웹소켓 설치" id="install_plugin">
        <p><code>WebSockets</code> 플러그인을 설치하려면 <a href="#configure-client">클라이언트 구성 블록</a> 내의 <code>install</code> 함수에 전달하세요.</p>
        [object Promise]
    </chapter>
    <chapter title="구성" id="configure_plugin">
        <p>선택적으로 `install` 블록 내에서 <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/-web-sockets/-config/index.html">WebSockets.Config</a>의 지원되는 속성을 전달하여 플러그인을 구성할 수 있습니다.</p>
        <deflist>
            <def id="maxFrameSize">
                <title><code>maxFrameSize</code></title>
                수신하거나 보낼 수 있는 최대 <code>Frame</code> 크기를 설정합니다.
            </def>
            <def id="contentConverter">
                <title><code>contentConverter</code></title>
                직렬화/역직렬화를 위한 컨버터를 설정합니다.
            </def>
            <def id="pingIntervalMillis">
                <title><code>pingIntervalMillis</code></title>
                <code>Long</code> 형식으로 핑 간의 지속 시간을 지정합니다.
            </def>
            <def id="pingInterval">
                <title><code>pingInterval</code></title>
                <code>Duration</code> 형식으로 핑 간의 지속 시간을 지정합니다.
            </def>
        </deflist>
        <warning>
            <p><code>pingInterval</code> 및 <code>pingIntervalMillis</code> 속성은 OkHttp 엔진에 적용할 수 없습니다. OkHttp의 핑 간격을 설정하려면 <a href="#okhttp">엔진 구성</a>을 사용할 수 있습니다.</p>
            [object Promise]
        </warning>
        <p>
            다음 예시에서는 웹소켓 플러그인이 20초(<code>20_000</code> 밀리초)의 핑 간격으로 구성되어 핑 프레임을 자동으로 보내고 웹소켓 연결을 유지합니다.
        </p>
        [object Promise]
    </chapter>
    <chapter title="웹소켓 세션 작업" id="working-wtih-session">
        <p>클라이언트의 웹소켓 세션은 <a href="https://api.ktor.io/ktor-shared/ktor-websockets/io.ktor.websocket/-default-web-socket-session/index.html">DefaultClientWebSocketSession</a> 인터페이스로 표현됩니다. 이 인터페이스는 웹소켓 프레임을 보내고 받고 세션을 닫을 수 있는 API를 노출합니다.</p>
        <chapter title="웹소켓 세션 액세스" id="access-session">
            <p>
                <code>HttpClient</code>는 웹소켓 세션에 액세스하는 두 가지 주요 방법을 제공합니다.
            </p>
            <list>
                <li>
                    <p><a
                            href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket.html">webSocket()</a>
                        함수는 <code>DefaultClientWebSocketSession</code>을 블록 인수로 허용합니다.</p>
                    [object Promise]
                </li>
                <li>
                    <a
                        href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket-session.html">webSocketSession()</a>
                    함수는 <code>DefaultClientWebSocketSession</code> 인스턴스를 반환하며, <code>runBlocking</code> 또는 <code>launch</code> 스코프 외부에서 세션에 액세스할 수 있도록 합니다.
                </li>
            </list>
        </chapter>
        <chapter title="웹소켓 세션 처리" id="handle-session">
            <p>함수 블록 내에서 지정된 경로에 대한 핸들러를 정의합니다. 다음 함수와 속성을 블록 내에서 사용할 수 있습니다.</p>
            <deflist>
                <def id="send">
                    <title><code>send()</code></title>
                    <code>send()</code> 함수를 사용하여 텍스트 내용을 서버로 보냅니다.
                </def>
                <def id="outgoing">
                    <title><code>outgoing</code></title>
                    <code>outgoing</code> 속성을 사용하여 웹소켓 프레임을 보내는 채널에 액세스합니다. 프레임은 <code>Frame</code> 클래스로 표현됩니다.
                </def>
                <def id="incoming">
                    <title><code>incoming</code></title>
                    <code>incoming</code> 속성을 사용하여 웹소켓 프레임을 수신하는 채널에 액세스합니다. 프레임은 <code>Frame</code> 클래스로 표현됩니다.
                </def>
                <def id="close">
                    <title><code>close()</code></title>
                    <code>close()</code> 함수를 사용하여 지정된 이유와 함께 닫기 프레임을 보냅니다.
                </def>
            </deflist>
        </chapter>
        <chapter title="프레임 타입" id="frame-types">
            <p>
                웹소켓 프레임의 타입을 검사하고 그에 따라 처리할 수 있습니다. 일반적인 프레임 타입은 다음과 같습니다.
            </p>
            <list>
                <li><code>Frame.Text</code>는 텍스트 프레임을 나타냅니다. 내용을 읽으려면 <code>Frame.Text.readText()</code>를 사용하세요.
                </li>
                <li><code>Frame.Binary</code>는 바이너리 프레임을 나타냅니다. 내용을 읽으려면 <code>Frame.Binary.readBytes()</code>를 사용하세요.
                </li>
                <li><code>Frame.Close</code>는 닫기 프레임을 나타냅니다. 세션 종료 이유를 얻으려면 <code>Frame.Close.readReason()</code>을 사용하세요.
                </li>
            </list>
        </chapter>
        <chapter title="예시" id="example">
            <p>아래 예시는 <code>echo</code> 웹소켓 엔드포인트를 생성하고 서버와 메시지를 주고받는 방법을 보여줍니다.</p>
            [object Promise]
            <p>전체 예시는 <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets">client-websockets</a>를 참조하세요.</p>
        </chapter>
    </chapter>
</topic>