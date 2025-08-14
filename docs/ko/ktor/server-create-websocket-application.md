<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Ktor를 사용하여 Kotlin으로 WebSocket 애플리케이션 생성하기" id="server-create-websocket-application">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-websockets"/>
    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="라우팅은 서버 애플리케이션에서 들어오는 요청을 처리하기 위한 핵심 플러그인입니다.">라우팅</Links>,<Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">정적 콘텐츠(Static Content)</Links>,
            <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간 미디어 유형 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화라는 두 가지 주요 목적을 제공합니다.">콘텐츠 협상(Content Negotiation)</Links>, <Links href="/ktor/server-websockets" summary="WebSockets 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.">Ktor 서버의 WebSockets</Links>,
            <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
        </p>
</tldr>
<card-summary>
        WebSocket의 기능을 활용하여 콘텐츠를 송수신하는 방법을 알아보세요.
</card-summary>
<link-summary>
        WebSocket의 기능을 활용하여 콘텐츠를 송수신하는 방법을 알아보세요.
</link-summary>
<web-summary>
        Ktor를 사용하여 Kotlin으로 WebSocket 애플리케이션을 빌드하는 방법을 알아보세요. 이 튜토리얼에서는 WebSocket을 통해 백엔드 서비스를 클라이언트와 연결하는 과정을 안내합니다.
</web-summary>
<p>
        이 문서에서는 Ktor를 사용하여 Kotlin으로 WebSocket 애플리케이션을 생성하는 과정을 안내합니다. 이 문서는
        <Links href="/ktor/server-create-restful-apis" summary="JSON 파일을 생성하는 RESTful API의 예시를 통해 Kotlin 및 Ktor를 사용하여 백엔드 서비스를 빌드하는 방법을 알아보세요.">RESTful API 생성</Links> 튜토리얼에서 다룬 내용을 기반으로 합니다.
</p>
<p>이 문서에서는 다음을 수행하는 방법을 알려드립니다.</p>
<list>
        <li>JSON 직렬화를 사용하는 서비스 생성.</li>
        <li>WebSocket 연결을 통해 콘텐츠 송수신.</li>
        <li>여러 클라이언트에 콘텐츠 동시 브로드캐스트.</li>
</list>
<chapter title="사전 요구 사항" id="prerequisites">
        <p>이 튜토리얼은 독립적으로 진행할 수 있지만, <Links href="/ktor/server-create-restful-apis" summary="JSON 파일을 생성하는 RESTful API의 예시를 통해 Kotlin 및 Ktor를 사용하여 백엔드 서비스를 빌드하는 방법을 알아보세요.">RESTful API 생성</Links> 튜토리얼을 완료하여 <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간 미디어 유형 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화라는 두 가지 주요 목적을 제공합니다.">콘텐츠 협상(Content Negotiation)</Links> 및 REST에 익숙해지는 것을 권장합니다.
        </p>
        <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a> 설치를 권장하지만, 원하는 다른 IDE를 사용할 수도 있습니다.
        </p>
</chapter>
<chapter title="WebSocket 시작하기" id="hello-websockets">
        <p>
            이 튜토리얼에서는 <Links href="/ktor/server-create-restful-apis" summary="JSON 파일을 생성하는 RESTful API의 예시를 통해 Kotlin 및 Ktor를 사용하여 백엔드 서비스를 빌드하는 방법을 알아보세요.">RESTful API 생성</Links> 튜토리얼에서 개발한 작업 관리자(Task Manager) 서비스에
            WebSocket 연결을 통해 클라이언트와 <code>Task</code> 객체를 교환하는 기능을 추가합니다. 이를 위해
            <Links href="/ktor/server-websockets" summary="WebSockets 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.">WebSockets 플러그인</Links>을 추가해야 합니다. 기존 프로젝트에 수동으로 추가할 수도 있지만, 이 튜토리얼에서는
            새 프로젝트를 생성하여 처음부터 시작합니다.
        </p>
        <chapter title="플러그인을 포함한 초기 프로젝트 생성" id="create=project">
            <procedure>
                <step>
    <p>
        <a href="https://start.ktor.io/">Ktor 프로젝트 제너레이터</a>로 이동합니다.
    </p>
                </step>
                <step>
                    <p><control>프로젝트 아티팩트</control> 필드에 프로젝트 아티팩트 이름으로
                        <Path>com.example.ktor-websockets-task-app</Path>을 입력합니다.
                        <img src="tutorial_server_websockets_project_artifact.png"
                             alt="Ktor 프로젝트 제너레이터에서 프로젝트 아티팩트 이름 지정"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        플러그인 섹션에서 다음 플러그인을 검색하여
                        <control>추가</control> 버튼을 클릭하여 추가합니다.
                    </p>
                    <list type="bullet">
                        <li>라우팅</li>
                        <li>콘텐츠 협상(Content Negotiation)</li>
                        <li>Kotlinx.serialization</li>
                        <li>WebSockets</li>
                        <li>정적 콘텐츠(Static Content)</li>
                    </list>
                    <p>
                        <img src="ktor_project_generator_add_plugins.gif"
                             alt="Ktor 프로젝트 제너레이터에서 플러그인 추가 중"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        플러그인을 추가한 후, 플러그인 섹션 오른쪽 상단에 있는
                        <control>플러그인 5개</control> 버튼을 클릭하여 추가된 플러그인을 표시합니다.
                    </p>
                    <p>그러면 프로젝트에 추가될 모든 플러그인 목록이 표시됩니다.
                        <img src="tutorial_server_websockets_project_plugins.png"
                             alt="Ktor 프로젝트 제너레이터의 플러그인 목록"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
    <p>
        <control>다운로드</control> 버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다.
    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="시작 코드 추가" id="add-starter-code">
            <p>다운로드가 완료되면 IntelliJ IDEA에서 프로젝트를 열고 다음 단계를 따릅니다.</p>
            <procedure>
                <step>
                    <Path>src/main/kotlin</Path>으로 이동하여
                    <Path>model</Path>이라는 새 서브 패키지를 생성합니다.
                </step>
                <step>
                    <p>
                        <Path>model</Path> 패키지 안에 새
                        <Path>Task.kt</Path> 파일을 생성합니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>Task.kt</Path> 파일을 열고 우선순위를 나타내는 <code>enum</code>과 작업을 나타내는 <code>data class</code>를
                        추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        <code>Task</code> 클래스는
                        <code>kotlinx.serialization</code> 라이브러리의 <code>Serializable</code> 타입으로 어노테이션되어 있습니다. 이는 인스턴스를 JSON으로 또는 JSON에서 변환할 수 있어 네트워크를 통해 콘텐츠를 전송할 수 있음을 의미합니다.
                    </p>
                    <p>
                        WebSockets 플러그인을 포함했기 때문에
                        <Path>src/main/kotlin/com/example/plugins</Path> 내부에 <Path>Sockets.kt</Path> 파일이 생성되었습니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>Sockets.kt</Path> 파일을 열고 기존 <code>Application.configureSockets()</code> 함수를
                        아래 구현으로 바꿉니다.
                    </p>
                    [object Promise]
                    <p>
                        이 코드에서는 다음 단계가 수행됩니다.
                    </p>
                    <list type="decimal">
                        <li>WebSockets 플러그인이 설치되고 표준 설정으로 구성됩니다.</li>
                        <li><code>contentConverter</code> 속성이 설정되어 플러그인이
                            <a href="https://github.com/Kotlin/kotlinx.serialization">kotlinx.serialization</a>
                            라이브러리를 통해 송수신되는 객체를 직렬화할 수 있게 합니다.
                        </li>
                        <li>라우팅은 상대 URL이 <code>/tasks</code>인 단일 엔드포인트로 구성됩니다.
                        </li>
                        <li>요청을 수신하면 작업 목록이 WebSocket 연결을 통해 직렬화됩니다.</li>
                        <li>모든 항목이 전송되면 서버는 연결을 닫습니다.</li>
                    </list>
                    <p>
                        시연 목적으로 작업을 전송하는 사이에 1초 지연이 발생합니다. 이를 통해
                        클라이언트에서 작업이 점진적으로 나타나는 것을 관찰할 수 있습니다. 이 지연이 없으면
                        예시가 이전 문서에서 개발한 <Links href="/ktor/server-create-restful-apis" summary="JSON 파일을 생성하는 RESTful API의 예시를 통해 Kotlin 및 Ktor를 사용하여 백엔드 서비스를 빌드하는 방법을 알아보세요.">RESTful 서비스</Links> 및 <Links href="/ktor/server-create-website" summary="Ktor와 Thymeleaf 템플릿으로 Kotlin 웹사이트를 빌드하는 방법을 알아보세요.">웹 애플리케이션</Links>과 동일하게 보일 것입니다.
                    </p>
                    <p>
                        이 반복의 마지막 단계는 이 엔드포인트용 클라이언트를 생성하는 것입니다.
                        <Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">정적 콘텐츠(Static Content)</Links> 플러그인을 포함했기 때문에
                        <Path>src/main/resources/static</Path> 내부에
                        <Path>index.html</Path> 파일이 생성되었습니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>index.html</Path> 파일을 열고 기존 내용을 다음으로 바꿉니다.
                    </p>
                    [object Promise]
                    <p>
                        이 페이지는 모든 최신 브라우저에서 사용할 수 있는 <a href="https://websockets.spec.whatwg.org//#websocket">WebSocket 타입</a>을 사용합니다.
                        우리는 JavaScript에서 이 객체를 생성하고, 엔드포인트의 URL을 생성자에 전달합니다. 이어서
                        <code>onopen</code>, <code>onclose</code>,
                        및 <code>onmessage</code> 이벤트에 대한 이벤트 핸들러를 연결합니다. <code>onmessage</code> 이벤트가 트리거되면, 문서 객체의 메서드를 사용하여 테이블에 행을 추가합니다.
                    </p>
                </step>
                <step>
    <p>IntelliJ IDEA에서 실행 버튼
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="intelliJ IDEA 실행 아이콘"/>)을 클릭하여 애플리케이션을 시작합니다.</p>
                </step>
                <step>
                    <p>
                        <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>로 이동합니다.
                        버튼과 빈 테이블이 있는 양식이 보여야 합니다.
                    </p>
                    <img src="tutorial_server_websockets_iteration_1.png"
                         alt="버튼 하나가 있는 HTML 양식을 표시하는 웹 브라우저 페이지"
                         border-effect="rounded"
                         width="706"/>
                    <p>
                        양식을 클릭하면 서버에서 작업이 초당 하나씩 로드되어 나타나야 합니다. 결과적으로
                        테이블은 점진적으로 채워져야 합니다. 브라우저의
                        <control>개발자 도구</control>에서
                        <control>JavaScript 콘솔</control>을 열어 로그된 메시지를 볼 수도 있습니다.
                    </p>
                    <img src="tutorial_server_websockets_iteration_1_click.gif"
                         alt="버튼 클릭 시 목록 항목을 표시하는 웹 브라우저 페이지"
                         border-effect="rounded"
                         width="706"/>
                    <p>
                        이로써 서비스가 예상대로 작동하는 것을 확인할 수 있습니다. WebSocket 연결이
                        열리고, 항목이 클라이언트로 전송된 다음 연결이 닫힙니다. 기본 네트워킹에는 많은
                        복잡성이 있지만, Ktor는 기본적으로 이 모든 것을 처리합니다.
                    </p>
                </step>
            </procedure>
        </chapter>
    </chapter>
<chapter title="WebSocket 이해하기" id="understanding-websockets">
        <p>
            다음 반복으로 이동하기 전에 WebSocket의 몇 가지 기본 사항을 검토하는 것이 도움이 될 수 있습니다.
            이미 WebSocket에 익숙하다면, <a href="#improve-design">서비스 디자인 개선</a>으로 계속 진행할 수 있습니다.
        </p>
        <p>
            이전 튜토리얼에서 클라이언트는 HTTP 요청을 보내고 HTTP 응답을 받았습니다. 이는 잘 작동하며
            인터넷이 확장 가능하고 탄력적(resilient)이도록 합니다.
        </p>
        <p>하지만 다음 시나리오에는 적합하지 않습니다.</p>
        <list>
            <li>시간이 지남에 따라 콘텐츠가 점진적으로 생성되는 경우.</li>
            <li>이벤트에 따라 콘텐츠가 자주 변경되는 경우.</li>
            <li>콘텐츠가 생성될 때 클라이언트가 서버와 상호 작용해야 하는 경우.</li>
            <li>한 클라이언트가 보낸 데이터가 다른 클라이언트에 빠르게 전파되어야 하는 경우.</li>
        </list>
        <p>
            이러한 시나리오의 예로는 주식 거래, 영화 및 콘서트 티켓 구매, 온라인 경매 입찰, 소셜 미디어의
            채팅 기능 등이 있습니다. WebSocket은 이러한 상황을 처리하기 위해 개발되었습니다.
        </p>
        <p>
            WebSocket 연결은 TCP를 통해 설정되며 장기간 지속될 수 있습니다. 이 연결은
            ‘전이중 통신(full duplex communication)’을 제공하여 클라이언트가 서버에 메시지를 보내고 서버로부터 메시지를 동시에
            받을 수 있도록 합니다.
        </p>
        <p>
            WebSocket API는 네 가지 이벤트(open, message, close, error)와 두 가지 동작(send, close)을
            정의합니다. 이 기능에 접근하는 방법은 언어와 라이브러리마다 다를 수 있습니다.
            예를 들어 Kotlin에서는 들어오는 메시지 시퀀스를 <a href="https://kotlinlang.org/docs/flow.html">Flow</a>로 사용할 수 있습니다.
        </p>
</chapter>
<chapter title="디자인 개선" id="improve-design">
        <p>다음으로, 더 고급 예시를 위한 공간을 만들기 위해 기존 코드를 리팩터링할 것입니다.</p>
        <procedure>
            <step>
                <p>
                    <Path>model</Path> 패키지에 새
                    <Path>TaskRepository.kt</Path> 파일을 생성합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>를 열고 <code>TaskRepository</code> 타입을 추가합니다.
                </p>
                [object Promise]
                <p>이 코드는 이전 튜토리얼에서 본 기억이 있을 수 있습니다.</p>
            </step>
            <step>
                <Path>plugins</Path> 패키지로 이동하여 <Path>Sockets.kt</Path> 파일을 엽니다.
            </step>
            <step>
                <p>
                    이제 <code>TaskRepository</code>를 활용하여 <code>Application.configureSockets()</code>의 라우팅을 간소화할 수 있습니다.
                </p>
                [object Promise]
            </step>
        </procedure>
</chapter>
<chapter title="WebSocket을 통한 메시지 전송" id="send-messages">
        <p>
            WebSocket의 강력한 기능을 보여주기 위해 다음 기능을 제공하는 새 엔드포인트를 생성합니다.
        </p>
        <list>
            <li>
                클라이언트가 시작될 때, 모든 기존 작업을 수신합니다.
            </li>
            <li>
                클라이언트가 작업을 생성하고 보낼 수 있습니다.
            </li>
            <li>
                한 클라이언트가 작업을 보내면 다른 클라이언트에게 알림이 전송됩니다.
            </li>
        </list>
        <procedure>
            <step>
                <p>
                    <Path>Sockets.kt</Path> 파일에서 현재 <code>configureSockets()</code> 메서드를 아래 구현으로 바꿉니다.
                </p>
                [object Promise]
                <p>이 코드를 통해 다음을 수행했습니다.</p>
                <list>
                    <li>
                        모든 기존 작업을 전송하는 기능을 헬퍼 메서드로 리팩터링했습니다.
                    </li>
                    <li>
                        <code>routing</code> 섹션에서 모든 클라이언트를 추적하기 위해 스레드 안전한 <code>session</code> 객체 목록을 생성했습니다.
                    </li>
                    <li>
                        상대 URL이 <code>/task2</code>인 새 엔드포인트를 추가했습니다. 클라이언트가 이 엔드포인트에 연결하면 해당 <code>session</code> 객체가 목록에 추가됩니다. 서버는 새 작업을 수신하기 위해 무한 루프에 진입합니다. 새 작업을 수신하면 서버는 이를 저장소에 저장하고 현재 클라이언트를 포함한 모든 클라이언트에 복사본을 보냅니다.
                    </li>
                </list>
                <p>
                    이 기능을 테스트하기 위해 <Path>index.html</Path>의 기능을 확장하는 새 페이지를 생성합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/resources/static</Path> 내부에 새 HTML 파일인
                    <Path>wsClient.html</Path>을 생성합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>wsClient.html</Path>을 열고 다음 내용을 추가합니다.
                </p>
                [object Promise]
                <p>
                    이 새 페이지는 사용자가 새 작업에 대한 정보를 입력할 수 있는 HTML 양식을 소개합니다.
                    양식을 제출하면 <code>sendTaskToServer</code> 이벤트 핸들러가 호출됩니다. 이 핸들러는 양식 데이터를 사용하여 JavaScript 객체를 구축하고 WebSocket 객체의
                    <code>send</code> 메서드를 사용하여 서버로 보냅니다.
                </p>
            </step>
            <step>
    <p>
        IntelliJ IDEA에서 다시 실행 버튼 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여 애플리케이션을 다시 시작합니다.
    </p>
            </step>
            <step>
                <p>이 기능을 테스트하려면 두 개의 브라우저를 나란히 열고 다음 단계를 따르세요.</p>
                <list type="decimal">
                    <li>
                        브라우저 A에서 <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a>로 이동합니다. 기본 작업이 표시되어야 합니다.
                    </li>
                    <li>
                        브라우저 A에서 새 작업을 추가합니다. 새 작업이 해당 페이지의 테이블에 나타나야 합니다.
                    </li>
                    <li>
                        브라우저 B에서 <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a>로 이동합니다. 기본 작업과 브라우저 A에서 추가한 모든 새 작업이 표시되어야 합니다.
                    </li>
                    <li>
                        어느 브라우저에서든 작업을 추가합니다. 새 항목이 두 페이지 모두에 나타나야 합니다.
                    </li>
                </list>
                <img src="tutorial_server_websockets_iteration_2_test.gif"
                     alt="HTML 양식을 통해 새 작업을 생성하는 과정을 시연하는 두 개의 웹 브라우저 페이지 나란히 보기"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
</chapter>
<chapter title="자동화된 테스트 추가" id="add-automated-tests">
        <p>
            QA 프로세스를 간소화하고 빠르고 재현 가능하며 수동 작업 없이 만들려면 Ktor의 내장된
            <Links href="/ktor/server-testing" summary="특수 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요.">자동화된 테스트 지원</Links>을 사용할 수 있습니다. 다음 단계를 따르세요.
        </p>
        <procedure>
            <step>
                <p>
                    Ktor 클라이언트 내에서 <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간 미디어 유형 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화라는 두 가지 주요 목적을 제공합니다.">콘텐츠 협상(Content Negotiation)</Links>
                    지원을 구성할 수 있도록
                    <Path>build.gradle.kts</Path>에 다음 종속성을 추가합니다.
                </p>
                [object Promise]
            </step>
            <step>
                <p>
    <p>IntelliJ IDEA에서 편집기 오른쪽에 있는 Gradle 알림 아이콘
        (<img alt="intelliJ IDEA Gradle 아이콘"
              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)을
        클릭하여 Gradle 변경 사항을 로드합니다.</p>
                </p>
            </step>
            <step>
                <p>
                    <Path>src/test/kotlin/com/example</Path>로 이동하여
                    <Path>ApplicationTest.kt</Path> 파일을 엽니다.
                </p>
            </step>
            <step>
                <p>
                    생성된 테스트 클래스를 아래 구현으로 바꿉니다.
                </p>
                [object Promise]
                <p>
                    이 설정으로 다음을 수행합니다.
                </p>
                <list>
                    <li>
                        테스트 환경 내에서 서비스를 실행하도록 구성하고, 라우팅, JSON 직렬화, WebSockets를 포함하여
                        프로덕션에서 사용할 수 있는 동일한 기능을 활성화합니다.
                    </li>
                    <li>
                        <Links href="/ktor/client-create-and-configure" summary="Ktor 클라이언트를 생성하고 구성하는 방법을 알아보세요.">Ktor 클라이언트</Links> 내에서 콘텐츠 협상(Content Negotiation) 및 WebSocket 지원을 구성합니다.
                        이것 없이는 클라이언트가 WebSocket 연결을 사용할 때 JSON으로 객체를 (역)직렬화하는 방법을 알 수 없습니다.
                    </li>
                    <li>
                        서비스가 반환할 것으로 예상되는 <code>Tasks</code> 목록을 선언합니다.
                    </li>
                    <li>
                        클라이언트 객체의 <code>websocket</code> 메서드를 사용하여 <code>/tasks</code>로 요청을 보냅니다.
                    </li>
                    <li>
                        들어오는 작업을 <code>flow</code>로 사용하여 점진적으로 목록에 추가합니다.
                    </li>
                    <li>
                        모든 작업이 수신되면 <code>expectedTasks</code>를 <code>actualTasks</code>와 평소와 같은 방식으로 비교합니다.
                    </li>
                </list>
            </step>
        </procedure>
</chapter>
<chapter title="다음 단계" id="next-steps">
        <p>
            잘하셨습니다! WebSocket 통신과 Ktor 클라이언트를 사용한 자동화된 테스트를 통합하여 작업 관리자(Task Manager) 서비스를 크게 향상시켰습니다.
        </p>
        <p>
            Exposed 라이브러리를 사용하여 서비스가 관계형 데이터베이스와 원활하게 상호 작용하는 방법을 알아보려면
            <Links href="/ktor/server-integrate-database" summary="Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 알아보세요.">다음 튜토리얼</Links>을 계속 진행하세요.
        </p>
</chapter>
</topic>