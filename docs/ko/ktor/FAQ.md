<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="자주 묻는 질문"
       id="FAQ">
    <chapter title="Ktor는 어떻게 발음하나요?" id="pronounce">
        <p>
            <emphasis>/keɪ-tor/</emphasis>
        </p>
    </chapter>
    <chapter title='Ktor라는 이름은 무엇을 의미하나요?' id="name-meaning">
        <p>
            Ktor라는 이름은 <code>ctor</code>(생성자)라는 약어에서 유래했으며, 첫 글자를 Kotlin의 'K'로 바꾼 것입니다.
        </p>
    </chapter>
    <chapter title="질문, 버그 보고, 문의, 기여, 피드백 등은 어떻게 하나요?" id="feedback">
        <p>
            사용 가능한 지원 채널에 대해 더 자세히 알아보려면 <a href="https://ktor.io/support/">지원</a> 페이지를 방문하세요.
            <a href="https://github.com/ktorio/ktor/blob/main/CONTRIBUTING.md">기여 방법</a> 가이드에서는 Ktor에 기여할 수 있는 방법들을 설명합니다.
        </p>
    </chapter>
    <chapter title="CIO는 무엇을 의미하나요?" id="cio">
        <p>
            CIO는
            <emphasis>Coroutine-based I/O (코루틴 기반 I/O)</emphasis>
            의 약자입니다.
            일반적으로 외부 JVM 기반 라이브러리에 의존하지 않고 Kotlin과 코루틴을 사용하여 IETF RFC 또는 다른 프로토콜을 구현하는 로직을 구현하는 엔진을 지칭합니다.
        </p>
    </chapter>
    <chapter title="해결되지 않은 (빨간색) Ktor 임포트를 어떻게 수정하나요?" id="ktor-artifact">
        <p>
            해당 <Links href="/ktor/server-dependencies" summary="기존 Gradle/Maven 프로젝트에 Ktor 서버 종속성을 추가하는 방법을 알아보세요.">Ktor 아티팩트</Links>가 빌드 스크립트에 추가되었는지 확인하세요.
        </p>
    </chapter>
    <chapter
            title="Ktor는 IPC 시그널(예: SIGTERM 또는 SIGINT)을 포착하여 서버 종료를 정상적으로 처리할 수 있는 방법을 제공하나요?"
            id="sigterm">
        <p>
            <a href="#engine-main">EngineMain</a>을 실행 중인 경우 자동으로 처리됩니다.
            그렇지 않은 경우 <a
                href="https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-cio/jvmAndNix/src/io/ktor/server/cio/EngineMain.kt#L21">수동으로 처리</a>해야 합니다.
            <code>Runtime.getRuntime().addShutdownHook</code> JVM 기능을 사용할 수 있습니다.
        </p>
    </chapter>
    <chapter title="프록시 뒤에 있는 클라이언트 IP를 어떻게 얻나요?" id="proxy-ip">
        <p>
            <code>call.request.origin</code> 속성은 프록시가 적절한 헤더를 제공하고 <Links href="/ktor/server-forward-headers" summary="필수 종속성: io.ktor:%artifact_name%
        코드 예시:
            %example_name%
        네이티브 서버 지원: ✅">ForwardedHeader</Links> 플러그인이 설치되어 있는 경우 원본 호출자(프록시)에 대한 <a href="#request_information">연결 정보</a>를 제공합니다.
        </p>
    </chapter>
    <chapter title="main 브랜치의 최신 커밋을 어떻게 테스트하나요?" id="bleeding-edge">
        <p>
            <code>jetbrains.space</code>에서 Ktor 나이틀리 빌드를 받을 수 있습니다.
            자세한 내용은 <a href="https://ktor.io/eap/">얼리 액세스 프로그램</a>에서 확인하세요.
        </p>
    </chapter>
    <chapter title="어떤 Ktor 버전을 사용하고 있는지 어떻게 확인할 수 있나요?" id="ktor-version-used">
        <p>
            <Links href="/ktor/server-default-headers" summary="필수 종속성: io.ktor:%artifact_name%
        네이티브 서버 지원: ✅">DefaultHeaders</Links> 플러그인을 사용하여 Ktor 버전이 포함된 <code>Server</code> 응답 헤더를 보낼 수 있습니다. 예를 들어:
        </p>
        [object Promise]
    </chapter>
    <chapter title="내 경로가 실행되지 않습니다. 어떻게 디버그할 수 있나요?" id="route-not-executing">
        <p>
            Ktor는 라우팅 결정 문제 해결에 도움을 주는 트레이싱 메커니즘을 제공합니다.
            <a href="#trace_routes">경로 트레이싱</a> 섹션을 확인하세요.
        </p>
    </chapter>
    <chapter title="'Response has already been sent' 오류를 어떻게 해결하나요?" id="response-already-sent">
        <p>
            이는 사용자 또는 플러그인이나 인터셉터가 이미 <code>call.respond* </code> 함수를 호출했으며, 이를 다시 호출하고 있다는 것을 의미합니다.
        </p>
    </chapter>
    <chapter title="Ktor 이벤트를 어떻게 구독하나요?" id="ktor-events">
        <p>
            자세한 내용은 <Links href="/ktor/server-events" summary="코드 예시:
            %example_name%">애플리케이션 모니터링</Links> 페이지를 참조하세요.
        </p>
    </chapter>
    <chapter title="'No configuration setting found for key ktor' 오류를 어떻게 해결하나요?" id="cannot-find-application-conf">
        <p>
            이는 Ktor가 <Links href="/ktor/server-configuration-file" summary="설정 파일에서 다양한 서버 매개변수를 구성하는 방법을 알아보세요.">설정 파일</Links>을 찾을 수 없었다는 것을 의미합니다.
            <code>resources</code> 폴더에 설정 파일이 있고, <code>resources</code> 폴더가 그렇게 표시되어 있는지 확인하세요.
            <a href="https://start.ktor.io/">Ktor 프로젝트 생성기</a> 또는
            <a href="https://plugins.jetbrains.com/plugin/16008-ktor">IntelliJ IDEA Ultimate용 Ktor 플러그인</a>을 사용하여 작동하는 프로젝트를 기반으로 삼는 것을 고려해보세요. 더 자세한 정보는 <Links href="/ktor/server-create-a-new-project" summary="Ktor로 서버 애플리케이션을 열고, 실행하고, 테스트하는 방법을 알아보세요.">새 Ktor 프로젝트 생성, 열기 및 실행</Links>을 참조하세요.
        </p>
    </chapter>
    <chapter title="Android에서 Ktor를 사용할 수 있나요?" id="android-support">
        <p>
            네, Ktor 서버 및 클라이언트는 Android 5 (API 21) 이상에서, 최소한 Netty 엔진을 사용할 경우 작동하는 것으로 알려져 있습니다.
        </p>
    </chapter>
    <chapter title="'CURL -I'가 '404 Not Found'를 반환하는 이유는 무엇인가요?" id="curl-head-not-found">
        <p>
            <code>CURL -I</code>는 <code>HEAD</code> 요청을 수행하는 <code>CURL --head</code>의 별칭입니다.
            기본적으로 Ktor는 <code>GET</code> 핸들러에 대한 <code>HEAD</code> 요청을 처리하지 않습니다.
            이 기능을 활성화하려면 <Links href="/ktor/server-autoheadresponse" summary="%plugin_name%은 GET이 정의된 모든 경로에 대해 HEAD 요청에 자동으로 응답하는 기능을 제공합니다.">AutoHeadResponse</Links> 플러그인을 설치하세요.
        </p>
    </chapter>
    <chapter title="'HttpsRedirect' 플러그인 사용 시 무한 리디렉션을 어떻게 해결하나요?" id="infinite-redirect">
        <p>
            가장 가능성이 높은 원인은 백엔드가 리버스 프록시 또는 로드 밸런서 뒤에 있으며, 이 중간자가 백엔드로 일반 HTTP 요청을 보내고, 따라서 Ktor 백엔드 내부의 <code>HttpsRedirect</code> 플러그인이 이를 일반 HTTP 요청으로 간주하고 리디렉션으로 응답한다는 것입니다.
        </p>
        <p>
            일반적으로 리버스 프록시는 원본 요청(HTTPS였는지, 원본 IP 주소 등)을 설명하는 일부 헤더를 보내며, 이러한 헤더를 파싱하여 <Links href="/ktor/server-forward-headers" summary="필수 종속성: io.ktor:%artifact_name%
        코드 예시:
            %example_name%
        네이티브 서버 지원: ✅">ForwardedHeader</Links> 플러그인이 있습니다. 이렇게 하면 <Links href="/ktor/server-https-redirect" summary="필수 종속성: io.ktor:%artifact_name%
        코드 예시:
            %example_name%
        네이티브 서버 지원: ✅">HttpsRedirect</Links> 플러그인이 원본 요청이 HTTPS였음을 알 수 있습니다.
        </p>
    </chapter>
    <chapter title="Kotlin/Native에서 해당 엔진을 사용하기 위해 Windows에 'curl'을 어떻게 설치하나요?" id="native-curl">
        <p>
            <a href="#curl">Curl</a> 클라이언트 엔진은 <code>curl</code> 라이브러리 설치가 필요합니다.
            Windows에서는 MinGW/MSYS2 <code>curl</code> 바이너리를 고려해볼 수 있습니다.
        </p>
        <procedure>
            <step>
                <p>
                    <a href="https://www.msys2.org/">MinGW/MSYS2</a>에서 설명된 대로 MinGW/MSYS2를 설치하세요.
                </p>
            </step>
            <step>
                <p>
                    다음 명령어를 사용하여 <code>libcurl</code>을 설치하세요:
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    MinGW/MSYS2를 기본 위치에 설치했다면,
                    <Path>C:\msys64\mingw64\bin\</Path>을
                    <code>PATH</code> 환경 변수에 추가하세요.
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="'NoTransformationFoundException' 오류를 어떻게 해결하나요?" id="no-transformation-found-exception">
        <p>
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.call/-no-transformation-found-exception/index.html">NoTransformationFoundException</a>은 클라이언트가 예상하는 타입으로 <emphasis>수신된 본문</emphasis>을 <b>결과 타입</b>에서 <b>예상 타입</b>으로 변환할 적절한 변환을 찾을 수 없음을 나타냅니다.
        </p>
        <procedure>
            <step>
                <p>
                    요청의 <code>Accept</code> 헤더가 원하는 콘텐츠 타입을 지정하는지, 그리고 서버 응답의 <code>Content-Type</code> 헤더가 클라이언트 측에서 예상하는 타입과 일치하는지 확인하세요.
                </p>
            </step>
            <step>
                <p>
                    작업 중인 특정 콘텐츠 타입에 대해 필요한 콘텐츠 변환을 등록하세요.
                </p>
                <p>
                    클라이언트 측에서는 <a href="https://ktor.io/docs/serialization-client.html">ContentNegotiation</a> 플러그인을 사용할 수 있습니다.
                    이 플러그인을 사용하면 다양한 콘텐츠 타입에 대해 데이터를 직렬화하고 역직렬화하는 방법을 지정할 수 있습니다.
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    필요한 모든 플러그인을 설치했는지 확인하세요. 누락되었을 수 있는 기능:
                </p>
                <list type="bullet">
                    <li>클라이언트 <a href="https://ktor.io/docs/websocket-client.html">웹소켓</a> 및
                        서버 <a href="https://ktor.io/docs/websocket.html">웹소켓</a></li>
                    <li>클라이언트 <a href="https://ktor.io/docs/serialization-client.html">콘텐츠 협상</a> 및
                        서버 <a href="https://ktor.io/docs/serialization.html">콘텐츠 협상</a></li>
                    <li><a href="https://ktor.io/docs/compression.html">압축</a></li>
                </list>
            </step>
        </procedure>
    </chapter>
</topic>