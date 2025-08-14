<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-server-sent-events" title="Ktor 클라이언트의 서버 전송 이벤트" help-id="sse_client">
    <show-structure for="chapter" depth="2"/>
    <primary-label ref="client-plugin"/>
    <tldr>
        <var name="example_name" value="client-sse"/>
    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    </tldr>
    <link-summary>
        SSE 플러그인은 클라이언트가 HTTP 연결을 통해 서버로부터 이벤트 기반 업데이트를 수신할 수 있도록 합니다.
    </link-summary>
    <p>
        서버 전송 이벤트(Server-Sent Events, SSE)는 서버가 HTTP 연결을 통해 클라이언트에 이벤트를 지속적으로 푸시할 수 있도록 하는 기술입니다. 이는 클라이언트가 서버를 반복적으로 폴링할 필요 없이 서버가 이벤트 기반 업데이트를 전송해야 하는 경우에 특히 유용합니다.
    </p>
    <p>
        Ktor가 지원하는 SSE 플러그인은 서버와 클라이언트 간의 단방향 연결을 생성하는 간단한 방법을 제공합니다.
    </p>
    <tip>
        <p>서버 측 지원을 위한 SSE 플러그인에 대해 자세히 알아보려면
            <Links href="/ktor/server-server-sent-events" summary="The SSE plugin allows a server to send event-based updates to a client over an HTTP connection.">SSE 서버 플러그인</Links>을(를) 참조하십시오.
        </p>
    </tip>
    <chapter title="종속성 추가" id="add_dependencies">
        <p>
            <code>SSE</code>는 <Links href="/ktor/client-dependencies" summary="Learn how to add client dependencies to an existing project.">ktor-client-core</Links> 아티팩트만 필요하며, 특별한 종속성은 필요하지 않습니다.
        </p>
    </chapter>
    <chapter title="SSE 설치" id="install_plugin">
        <p>
            <code>SSE</code> 플러그인을 설치하려면, <a href="#configure-client">클라이언트 설정 블록</a> 내 <code>install</code> 함수에 전달합니다.
        </p>
        [object Promise]
    </chapter>
    <chapter title="SSE 플러그인 구성" id="configure">
        <p>
            `install` 블록 내에서
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-s-s-e-config/index.html">SSEConfig</a>
            클래스의 지원되는 속성을 설정하여 SSE 플러그인을 선택적으로 구성할 수 있습니다.
        </p>
        <chapter title="SSE 재연결" id="sse-reconnect">
            <tldr>
                <p>️️지원되지 않음: <code>OkHttp</code></p>
            </tldr>
            <p>
                지원되는 엔진에서 자동 재연결을 활성화하려면,
                <code>maxReconnectionAttempts</code>를 <code>0</code>보다 큰 값으로 설정합니다. <code>reconnectionTime</code>을 사용하여 시도 간의 지연 시간을 구성할 수도 있습니다.
            </p>
            [object Promise]
            <p>
                서버와의 연결이 끊어진 경우, 클라이언트는 재연결을 시도하기 전에 지정된
                <code>reconnectionTime</code> 동안 기다립니다. 연결을 다시 설정하기 위해 지정된 <code>maxReconnectionAttempts</code> 횟수만큼 시도합니다.
            </p>
        </chapter>
        <chapter title="이벤트 필터링" id="filter-events">
            <p>
                다음 예시에서 SSE 플러그인은 HTTP 클라이언트에 설치되어 들어오는(incoming) 흐름에서 주석만 포함하는 이벤트와 <code>retry</code> 필드만 포함하는 이벤트를 포함하도록 구성됩니다.
            </p>
            [object Promise]
        </chapter>
    </chapter>
    <chapter title="SSE 세션 처리" id="handle-sse-sessions">
        <p>
            클라이언트의 SSE 세션은
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html">
                <code>ClientSSESession</code>
            </a>
            인터페이스로 표현됩니다. 이 인터페이스는 서버로부터 서버 전송 이벤트를 수신할 수 있는 API를 노출합니다.
        </p>
        <chapter title="SSE 세션 접근" id="access-sse-session">
            <p><code>HttpClient</code>는 다음 방법 중 하나로 SSE 세션에 접근할 수 있도록 합니다.</p>
            <list>
                <li>
                    <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse.html">
                        <code>sse()</code>
                    </a>
                    함수는 SSE 세션을 생성하고 이를 기반으로 작업을 수행할 수 있도록 합니다.
                </li>
                <li>
                    <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse-session.html">
                        <code>sseSession()</code>
                    </a>
                    함수는 SSE 세션을 열 수 있도록 합니다.
                </li>
            </list>
            <p>URL 엔드포인트를 지정하려면 다음 두 가지 옵션 중에서 선택할 수 있습니다.</p>
            <list>
                <li><code>urlString</code> 매개변수를 사용하여 전체 URL을 문자열로 지정합니다.</li>
                <li><code>schema</code>, <code>host</code>, <code>port</code>, <code>path</code> 매개변수를 사용하여 각각 프로토콜 스킴, 도메인 이름, 포트 번호, 경로 이름을 지정합니다.
                </li>
            </list>
            [object Promise]
            <p>선택적으로, 연결을 구성할 수 있는 다음 매개변수들을 사용할 수 있습니다.</p>
            <deflist>
                <def id="reconnectionTime-param">
                    <title><code>reconnectionTime</code></title>
                    재연결 지연 시간을 설정합니다.
                </def>
                <def id="showCommentEvents-param">
                    <title><code>showCommentEvents</code></title>
                    들어오는(incoming) 흐름에서 주석만 포함하는 이벤트를 표시할지 여부를 지정합니다.
                </def>
                <def id="showRetryEvents-param">
                    <title><code>showRetryEvents</code></title>
                    들어오는(incoming) 흐름에서 <code>retry</code> 필드만 포함하는 이벤트를 표시할지 여부를 지정합니다.
                </def>
                <def id="deserialize-param">
                    <title><code>deserialize</code></title>
                    <code>TypedServerSentEvent</code>의 <code>data</code> 필드를 객체로 변환하는 역직렬화 함수입니다. 자세한 내용은 undefined를 참조하십시오.
                </def>
            </deflist>
        </chapter>
        <chapter title="SSE 세션 블록" id="sse-session-block">
            <p>
                람다 인자 내에서는
                <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html"><code>ClientSSESession</code></a>
                컨텍스트에 접근할 수 있습니다. 다음 속성들을 블록 내에서 사용할 수 있습니다.
            </p>
            <deflist>
                <def id="call">
                    <title><code>call</code></title>
                    세션을 시작한 관련 <code>HttpClientCall</code>입니다.
                </def>
                <def id="incoming">
                    <title><code>incoming</code></title>
                    들어오는(incoming) 서버 전송 이벤트 흐름입니다.
                </def>
            </deflist>
            <p>
                아래 예시는 <code>events</code> 엔드포인트로 새 SSE 세션을 생성하고,
                <code>incoming</code> 속성을 통해 이벤트를 읽어 수신된
                <a href="https://api.ktor.io/ktor-shared/ktor-sse/io.ktor.sse/-server-sent-event/index.html"><code>ServerSentEvent</code></a>를
                출력합니다.
            </p>
            [object Promise]
            <p>전체 예시는
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-sse">client-sse</a>를 참조하십시오.
            </p>
        </chapter>
        <chapter title="역직렬화" id="deserialization">
            <p>
                SSE 플러그인은 서버 전송 이벤트를 타입 안전한 코틀린 객체로 역직렬화하는 것을 지원합니다. 이 기능은 서버로부터 구조화된 데이터를 다룰 때 특히 유용합니다.
            </p>
            <p>
                역직렬화를 활성화하려면, SSE 접근 함수의 <code>deserialize</code> 매개변수를 사용하여 사용자 정의 역직렬화 함수를 제공하고
                <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session-with-deserialization/index.html">
                    <code>ClientSSESessionWithDeserialization</code>
                </a>
                클래스를 사용하여 역직렬화된 이벤트를 처리합니다.
            </p>
            <p>
                다음은 <code>kotlinx.serialization</code>을 사용하여 JSON 데이터를 역직렬화하는 예시입니다.
            </p>
            [object Promise]
            <p>전체 예시는
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-sse">client-sse</a>를 참조하십시오.
            </p>
        </chapter>
    </chapter>
</topic>