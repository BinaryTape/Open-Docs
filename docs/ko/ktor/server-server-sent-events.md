<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="server-server-sent-events" title="Ktor 서버의 Server-Sent Events (SSE)" help-id="sse_server">
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
        Server-Sent Events (SSE)는 서버가 HTTP 연결을 통해 클라이언트에 이벤트를 지속적으로 푸시할 수 있도록 하는 기술입니다. 클라이언트가 서버를 반복적으로 폴링할 필요 없이 서버가 이벤트 기반 업데이트를 전송해야 하는 경우에 특히 유용합니다.
    </p>
    <p>
        Ktor에서 지원하는 SSE 플러그인은 서버와 클라이언트 간에 단방향 연결을 생성하는 간단한 방법을 제공합니다.
    </p>
</snippet>
<tip>
    <p>클라이언트 측 지원을 위한 SSE 플러그인에 대해 자세히 알아보려면 다음을 참조하십시오:
        <Links href="/ktor/client-server-sent-events" summary="SSE 플러그인을 사용하면 클라이언트가 HTTP 연결을 통해 서버로부터 이벤트 기반 업데이트를 받을 수 있습니다.">SSE 클라이언트 플러그인</Links>
        .
    </p>
</tip>
<note>
    <p>
        양방향 통신에는 <Links href="/ktor/server-websockets" summary="Websockets 플러그인을 사용하면 서버와 클라이언트 간에 양방향 통신 세션을 생성할 수 있습니다.">WebSockets</Links> 사용을 고려하십시오. WebSockets는 Websocket 프로토콜을 사용하여 서버와 클라이언트 간에 전이중 통신을 제공합니다.
    </p>
</note>
<chapter title="제한 사항" id="limitations">
    <p>
        Ktor는 SSE 응답에 대한 데이터 압축을 지원하지 않습니다.
        만약 <Links href="/ktor/server-compression" summary="필수 의존성: io.ktor:%artifact_name% 코드 예시: %example_name% 네이티브 서버 지원: ✖️">Compression</Links> 플러그인을 사용하는 경우, 기본적으로 SSE 응답에 대한 압축을 건너뜁니다.
    </p>
</chapter>
<chapter title="의존성 추가" id="add_dependencies">
    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
    </p>
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="                    implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="                    implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </tab>
        <tab title="Maven" group-key="maven">
            <code-block lang="XML" code="                    &lt;dependency&gt;&#10;                        &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                        &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                        &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;                    &lt;/dependency&gt;"/>
        </tab>
    </tabs>
</chapter>
<chapter title="SSE 설치" id="install_plugin">
    <p>
        <code>%plugin_name%</code> 플러그인을 애플리케이션에 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하십시오. 아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부에.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부에.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            <code-block lang="kotlin" code="                    import io.ktor.server.engine.*&#10;                    import io.ktor.server.netty.*&#10;                    import io.ktor.server.application.*&#10;                    import %package_name%.*&#10;        &#10;                    fun main() {&#10;                        embeddedServer(Netty, port = 8080) {&#10;                            install(%plugin_name%)&#10;                            // ...&#10;                        }.start(wait = true)&#10;                    }"/>
        </tab>
        <tab title="module">
            <code-block lang="kotlin" code="                    import io.ktor.server.application.*&#10;                    import %package_name%.*&#10;                    // ...&#10;                    fun Application.module() {&#10;                        install(%plugin_name%)&#10;                        // ...&#10;                    }"/>
        </tab>
    </tabs>
</chapter>
<chapter title="SSE 세션 처리" id="handle-sessions">
    <p>
        <code>SSE</code> 플러그인을 설치한 후, SSE 세션을 처리할 라우트를 추가할 수 있습니다.
        이를 위해 <a href="#define_route">라우팅</a> 블록 내에서 <code>sse()</code> 함수를 호출합니다. SSE 라우트를 설정하는 두 가지 방법이 있습니다:
    </p>
    <list type="decimal">
        <li>
            <p>특정 URL 경로 사용:</p>
            <code-block lang="kotlin" code="                    routing {&#10;                        sse(&amp;quot;/events&amp;quot;) {&#10;                            // send events to clients&#10;                        }&#10;                    }"/>
        </li>
        <li>
            <p>
                경로 없음:
            </p>
            <code-block lang="kotlin" code="                    routing {&#10;                        sse {&#10;                            // send events to clients&#10;                        }&#10;                    }"/>
        </li>
    </list>
    <chapter title="SSE 세션 블록" id="session-block">
        <p>
            <code>sse</code> 블록 내에서 지정된 경로에 대한 핸들러를 정의하는데, 이는
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html">
                <code>ServerSSESession</code>
            </a>
            클래스로 표현됩니다. 이 블록 내에서 다음 함수와 속성을 사용할 수 있습니다:</p>
        <deflist>
            <def id="send">
                <title><code>send()</code></title>
                <code>ServerSentEvent</code>를 생성하여 클라이언트에 전송합니다.
            </def>
            <def id="call">
                <title><code>call</code></title>
                세션을 시작한 연결된 수신 <code>ApplicationCall</code>입니다.
            </def>
            <def id="close">
                <title><code>close()</code></title>
                세션을 닫고 클라이언트와의 연결을 종료합니다. <code>close()</code> 메서드는 모든 <code>send()</code> 작업이 완료되면 자동으로 호출됩니다.
                <note>
                    <code>close()</code> 함수를 사용하여 세션을 닫는다고 해서 클라이언트에 종료 이벤트가 전송되는 것은 아닙니다. 세션을 닫기 전에 SSE 스트림의 끝을 알리려면 <code>send()</code> 함수를 사용하여 특정 이벤트를 전송하십시오.
                </note>
            </def>
        </deflist>
    </chapter>
    <chapter title="예시: 단일 세션 처리" id="handle-single-session">
        <p>
            아래 예시는 <code>/events</code> 엔드포인트에 SSE 세션을 설정하고, 각 이벤트 사이에 1초(1000ms) 지연을 두어 SSE 채널을 통해 6개의 개별 이벤트를 전송하는 방법을 보여줍니다:
        </p>
        <code-block lang="kotlin" code="    routing {&#10;        sse(&quot;/events&quot;) {&#10;            repeat(6) {&#10;                send(ServerSentEvent(&quot;this is SSE #$it&quot;))&#10;                delay(1000)&#10;            }&#10;        }&#10;    }"/>
        <p>전체 예시는
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>를 참조하십시오.
        </p>
    </chapter>
    <chapter title="SSE 하트비트" id="heartbeat">
        <p>
            하트비트는 비활성 기간 동안 이벤트를 주기적으로 전송하여 SSE 연결이 활성 상태를 유지하도록 보장합니다. 세션이 활성 상태로 유지되는 한, 서버는 구성된 간격으로 지정된 이벤트를 전송합니다.
        </p>
        <p>
            하트비트를 활성화하고 구성하려면 SSE 라우트 핸들러 내에서
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html">
                <code>.heartbeat()</code>
            </a>
            함수를 사용하십시오:
        </p>
        <code-block lang="kotlin" code="    routing {&#10;        sse(&quot;/heartbeat&quot;) {&#10;            heartbeat {&#10;                period = 10.milliseconds&#10;                event = ServerSentEvent(&quot;heartbeat&quot;)&#10;            }&#10;            // ...&#10;        }&#10;    }"/>
        <p>
            이 예시에서는 연결을 유지하기 위해 10밀리초마다 하트비트 이벤트가 전송됩니다.
        </p>
    </chapter>
    <chapter title="직렬화" id="serialization">
        <p>
            직렬화를 활성화하려면 SSE 라우트에서 <code>serialize</code> 매개변수를 사용하여 사용자 정의 직렬화 함수를 제공하십시오. 핸들러 내에서
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html">
                <code>ServerSSESessionWithSerialization</code>
            </a>
            클래스를 사용하여 직렬화된 이벤트를 전송할 수 있습니다:
        </p>
        <code-block lang="kotlin" code="@Serializable&#10;data class Customer(val id: Int, val firstName: String, val lastName: String)&#10;&#10;@Serializable&#10;data class Product(val id: Int, val prices: List&lt;Int&gt;)&#10;&#10;fun Application.module() {&#10;    install(SSE)&#10;&#10;    routing {&#10;        // example with serialization&#10;        sse(&quot;/json&quot;, serialize = { typeInfo, it -&gt;&#10;            val serializer = Json.serializersModule.serializer(typeInfo.kotlinType!!)&#10;            Json.encodeToString(serializer, it)&#10;        }) {&#10;            send(Customer(0, &quot;Jet&quot;, &quot;Brains&quot;))&#10;            send(Product(0, listOf(100, 200)))&#10;        }&#10;    }&#10;}"/>
        <p>
            이 예시의 <code>serialize</code> 함수는 데이터 객체를 JSON으로 변환하는 역할을 하며, 변환된 JSON은 <code>ServerSentEvent</code>의 <code>data</code> 필드에 배치됩니다.
        </p>
        <p>전체 예시는
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>를 참조하십시오.
        </p>
    </chapter>
</chapter>
</topic>