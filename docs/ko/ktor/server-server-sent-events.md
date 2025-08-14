```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   id="server-server-sent-events" title="Ktor 서버의 서버 전송 이벤트" help-id="sse_server">
<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="plugin_name" value="SSE"/>
<var name="example_name" value="server-sse"/>
<var name="package_name" value="io.ktor.server.sse"/>
<var name="artifact_name" value="ktor-server-sse"/>
<tldr>
    <p>
        <b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
    </p>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>
<link-summary>
    SSE 플러그인을 사용하면 서버가 HTTP 연결을 통해 클라이언트에 이벤트 기반 업데이트를 보낼 수 있습니다.
</link-summary>
<snippet id="sse-description">
    <p>
        Server-Sent Events (SSE)는 서버가 HTTP 연결을 통해 클라이언트에 이벤트를 지속적으로 푸시할 수 있게 해주는 기술입니다. 클라이언트가 서버를 반복적으로 폴링할 필요 없이 서버가 이벤트 기반 업데이트를 보내야 하는 경우에 특히 유용합니다.
    </p>
    <p>
        Ktor가 지원하는 SSE 플러그인은 서버와 클라이언트 간에 단방향 연결을 생성하는 간단한 방법을 제공합니다.
    </p>
</snippet>
<tip>
    <p>클라이언트 측 지원을 위한 SSE 플러그인에 대해 더 자세히 알아보려면 다음을 참조하십시오.
        <Links href="/ktor/client-server-sent-events" summary="SSE 플러그인을 사용하면 클라이언트가 HTTP 연결을 통해 서버로부터 이벤트 기반 업데이트를 받을 수 있습니다.">SSE 클라이언트 플러그인</Links>
        .
    </p>
</tip>
<note>
    <p>
        양방향 통신을 위해서는 <Links href="/ktor/server-websockets" summary="Websockets 플러그인을 사용하면 서버와 클라이언트 간에 양방향 통신 세션을 생성할 수 있습니다.">WebSockets</Links> 사용을 고려해 보세요. WebSockets는 Websocket 프로토콜을 사용하여 서버와 클라이언트 간의 전이중 통신을 제공합니다.
    </p>
</note>
<chapter title="제한 사항" id="limitations">
    <p>
        Ktor는 SSE 응답에 대한 데이터 압축을 지원하지 않습니다.
        <Links href="/ktor/server-compression" summary="필수 의존성: io.ktor:%artifact_name%
        코드 예시:
            %example_name%
        네이티브 서버 지원: ✖️">Compression</Links> 플러그인을 사용하는 경우, 기본적으로 SSE 응답에 대한 압축을 건너뜁니다.
    </p>
</chapter>
<chapter title="의존성 추가" id="add_dependencies">
<p>
    <code>%plugin_name%</code>을 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
</chapter>
<chapter title="SSE 설치" id="install_plugin">
<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
    아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
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
</chapter>
<chapter title="SSE 세션 처리" id="handle-sessions">
    <p>
        <code>SSE</code> 플러그인을 설치하고 나면 SSE 세션을 처리하는 라우트를 추가할 수 있습니다.
        이를 위해 <a href="#define_route">라우팅</a> 블록 내에서 <code>sse()</code> 함수를 호출합니다. SSE 라우트를 설정하는 방법은 두 가지입니다:
    </p>
    <list type="decimal">
        <li>
            <p>특정 URL 경로 사용:</p>
            [object Promise]
        </li>
        <li>
            <p>
                경로 없음:
            </p>
            [object Promise]
        </li>
    </list>
    <chapter title="SSE 세션 블록" id="session-block">
        <p>
            <code>sse</code> 블록 내에서,
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html">
                <code>ServerSSESession</code>
            </a>
            클래스로 표현되는 지정된 경로에 대한 핸들러를 정의합니다. 블록 내에서 다음 함수와 속성을 사용할 수 있습니다:</p>
        <deflist>
            <def id="send">
                <title><code>send()</code></title>
                <code>ServerSentEvent</code>를 생성하여 클라이언트로 보냅니다.
            </def>
            <def id="call">
                <title><code>call</code></title>
                세션을 시작한 연결된 수신 <code>ApplicationCall</code>.
            </def>
            <def id="close">
                <title><code>close()</code></title>
                세션을 닫고 클라이언트와의 연결을 종료합니다. 모든 <code>send()</code> 작업이 완료되면 <code>close()</code> 메서드가 자동으로 호출됩니다.
                <note>
                    <code>close()</code> 함수를 사용하여 세션을 닫는다고 해서 클라이언트에 종료 이벤트를 보내는 것은 아닙니다. 세션을 닫기 전에 SSE 스트림의 끝을 나타내려면 <code>send()</code> 함수를 사용하여 특정 이벤트를 보내세요.
                </note>
            </def>
        </deflist>
    </chapter>
    <chapter title="예시: 단일 세션 처리" id="handle-single-session">
        <p>
            아래 예시는 <code>/events</code> 엔드포인트에 SSE 세션을 설정하고, SSE 채널을 통해 1초(1000ms) 간격으로 6개의 개별 이벤트를 보내는 방법을 보여줍니다:
        </p>
        [object Promise]
        <p>전체 예시는
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>를 참조하십시오.
        </p>
    </chapter>
    <chapter title="SSE 하트비트" id="heartbeat">
        <p>
            하트비트는 활동이 없는 기간 동안 이벤트를 주기적으로 전송하여 SSE 연결이 활성 상태를 유지하도록 보장합니다. 세션이 활성 상태를 유지하는 한, 서버는 구성된 간격으로 지정된 이벤트를 보냅니다.
        </p>
        <p>
            하트비트를 활성화하고 구성하려면 SSE 라우트 핸들러 내에서
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html">
                <code>.heartbeat()</code>
            </a>
            함수를 사용하십시오:
        </p>
        [object Promise]
        <p>
            이 예시에서는 연결 유지를 위해 10밀리초마다 하트비트 이벤트가 전송됩니다.
        </p>
    </chapter>
    <chapter title="직렬화" id="serialization">
        <p>
            직렬화를 활성화하려면 SSE 라우트에서 <code>serialize</code> 파라미터를 사용하여 사용자 정의 직렬화 함수를 제공하십시오. 핸들러 내에서
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html">
                <code>ServerSSESessionWithSerialization</code>
            </a>
            클래스를 사용하여 직렬화된 이벤트를 보낼 수 있습니다:
        </p>
        [object Promise]
        <p>
            이 예시의 <code>serialize</code> 함수는 데이터 객체를 JSON으로 변환한 다음, <code>ServerSentEvent</code>의 <code>data</code> 필드에 배치하는 역할을 합니다.
        </p>
        <p>전체 예시는
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>를 참조하십시오.
        </p>
    </chapter>
</chapter>