<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="Express에서 Ktor로 마이그레이션"
   id="migration-from-express-js" help-id="express-js;migrating-from-express-js">
<show-structure for="chapter" depth="2"/>
<link-summary>이 가이드는 간단한 Ktor 애플리케이션을 생성, 실행 및 테스트하는 방법을 보여줍니다.</link-summary>
<tldr>
    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express">migrating-express</a>
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor">migrating-express-ktor</a>
    </p>
</tldr>
<p>
    이 가이드에서는 기본적인 시나리오에서 Express 애플리케이션을 Ktor로 마이그레이션하는 방법을 살펴봅니다.
    애플리케이션 생성부터 첫 번째 애플리케이션 작성, 그리고 애플리케이션 기능을 확장하기 위한 미들웨어 생성까지 다룹니다.
</p>
<chapter title="앱 생성" id="generate">
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    새 Express 애플리케이션은 <code>express-generator</code> 도구를 사용하여 생성할 수 있습니다.
                </p>
                [object Promise]
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor는 애플리케이션 골격(skeleton)을 생성하는 다음 방법들을 제공합니다:
                </p>
                <list>
                    <li>
                        <p>
                            <a href="https://start.ktor.io/">Ktor 프로젝트 생성기</a> — 웹 기반 생성기를 사용하세요.
                        </p>
                    </li>
                    <li>
                        <p>
                            <a href="https://github.com/ktorio/ktor-cli">
                                Ktor CLI 도구
                            </a> — <code>ktor new</code> 명령어를 사용하여 명령줄 인터페이스를 통해 Ktor 프로젝트를 생성하세요:
                        </p>
                        [object Promise]
                    </li>
                    <li>
                        <p>
                            <a href="https://www.npmjs.com/package/generator-ktor">
                                Yeoman 생성기
                            </a>
                            — 프로젝트 설정을 대화형으로 구성하고 필요한 플러그인을 선택하세요:
                        </p>
                        [object Promise]
                    </li>
                    <li>
                        <p>
                            <a href="https://ktor.io/idea/">IntelliJ IDEA Ultimate</a> — 내장된 Ktor 프로젝트 마법사를 사용하세요.
                        </p>
                    </li>
                </list>
                <p>
                    자세한 지침은 <Links href="/ktor/server-create-a-new-project" summary="Ktor로 서버 애플리케이션을 열고, 실행하고, 테스트하는 방법을 알아보세요.">새 Ktor 프로젝트 생성, 열기 및 실행</Links> 튜토리얼을 참조하세요.
                </p>
            </td>
        </tr>
    </table>
</chapter>
<chapter title="Hello world" id="hello">
    <p>
        이 섹션에서는 <code>GET</code> 요청을 수락하고 미리 정의된 일반 텍스트로 응답하는 가장 간단한 서버 애플리케이션을 만드는 방법을 살펴봅니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    아래 예시는 서버를 시작하고 <control>3000</control> 포트에서 연결을 수신하는 Express 애플리케이션을 보여줍니다.
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/1_hello/app.js">1_hello</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor에서는 <a href="#embedded-server"><code>embeddedServer</code></a>
                    함수를 사용하여 코드에서 서버 매개변수를 구성하고 애플리케이션을 빠르게 실행할 수 있습니다.
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt">1_hello</a>
                    프로젝트를 참조하세요.
                </p>
                <p>
                    또한 HOCON 또는 YAML 형식을 사용하는 <a href="#engine-main">외부 설정 파일</a>에서 서버 설정을 지정할 수 있습니다.
                </p>
            </td>
        </tr>
    </table>
    <p>
        위 Express 애플리케이션은 <control>Date</control>, <control>X-Powered-By</control>, <control>ETag</control> 응답 헤더를 추가하며 다음과 같이 나타날 수 있습니다:
    </p>
    [object Promise]
    <p>
        Ktor에서 각 응답에 기본 <control>Server</control> 및 <control>Date</control> 헤더를 추가하려면
        <Links href="/ktor/server-default-headers" summary="필수 종속성: io.ktor:%artifact_name% 네이티브 서버 지원: ✅">DefaultHeaders</Links> 플러그인을 설치해야 합니다.
        <Links href="/ktor/server-conditional-headers" summary="필수 종속성: io.ktor:%artifact_name% 코드 예시: %example_name% 네이티브 서버 지원: ✅">ConditionalHeaders</Links> 플러그인은
        <control>Etag</control>
        응답 헤더를 구성하는 데 사용될 수 있습니다.
    </p>
</chapter>
<chapter title="정적 콘텐츠 제공" id="static">
    <p>
        이 섹션에서는 Express와 Ktor에서 이미지, CSS 파일, JavaScript 파일과 같은 정적 파일을 제공하는 방법을 알아봅니다.
        <Path>public</Path>
        폴더에 메인
        <Path>index.html</Path>
        페이지와 연결된 여러 에셋(asset)이 있다고 가정해 봅시다.
    </p>
    [object Promise]
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    Express에서는 폴더 이름을
                    <control>express.static</control>
                    함수에 전달합니다.
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/2_static/app.js">2_static</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor에서는 <a href="#folders"><code>staticFiles()</code></a>
                    함수를 사용하여
                    <Path>/</Path>
                    경로로 들어오는 모든 요청을 물리적 폴더인
                    <Path>public</Path>
                    에 매핑할 수 있습니다.
                    이 함수는
                    <Path>public</Path>
                    폴더의 모든 파일을 재귀적으로 제공할 수 있도록 합니다.
                </p>
                [object Promise]
                <p>
                    전체 예시는 <a
                        href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt">2_static</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
    <p>
        정적 콘텐츠를 제공할 때, Express는 다음과 같이 보이는 몇 가지 응답 헤더를 추가합니다:
    </p>
    [object Promise]
    <p>
        Ktor에서 이러한 헤더를 관리하려면 다음 플러그인을 설치해야 합니다:
    </p>
    <list>
        <li>
            <p>
                <control>Accept-Ranges</control>
                : <Links href="/ktor/server-partial-content" summary="필수 종속성: io.ktor:%artifact_name% 서버 예시: download-file, 클라이언트 예시: client-download-file-range 네이티브 서버 지원: ✅">PartialContent</Links>
            </p>
        </li>
        <li>
            <p>
                <control>Cache-Control</control>
                : <Links href="/ktor/server-caching-headers" summary="필수 종속성: io.ktor:%artifact_name% 코드 예시: %example_name% 네이티브 서버 지원: ✅">CachingHeaders</Links>
            </p>
        </li>
        <li>
            <p>
                <control>ETag</control>
                및
                <control>Last-Modified</control>
                :
                <Links href="/ktor/server-conditional-headers" summary="필수 종속성: io.ktor:%artifact_name% 코드 예시: %example_name% 네이티브 서버 지원: ✅">ConditionalHeaders</Links>
            </p>
        </li>
    </list>
</chapter>
<chapter title="라우팅" id="routing">
    <p>
        <Links href="/ktor/server-routing" summary="라우팅은 서버 애플리케이션에서 들어오는 요청을 처리하기 위한 핵심 플러그인입니다.">라우팅</Links>은(는) 특정 HTTP 요청 메서드(<code>GET</code>, <code>POST</code> 등)와 경로로 정의된 특정 엔드포인트로 들어오는 요청을 처리할 수 있도록 합니다.
        아래 예시는
        <Path>/</Path>
        경로로 들어오는 <code>GET</code> 및
        <code>POST</code> 요청을 처리하는 방법을 보여줍니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                [object Promise]
                <tip>
                    <p>
                        <code>POST</code>, <code>PUT</code> 또는
                        <code>PATCH</code> 요청의 요청 본문(request body)을 수신하는 방법을 배우려면 undefined를 참조하세요.
                    </p>
                </tip>
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
    <p>
        다음 예시들은 경로별로 라우트 핸들러를 그룹화하는 방법을 보여줍니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    Express에서는 <code>app.route()</code>를 사용하여 라우트 경로에 대한 체인 가능한 라우트 핸들러를 만들 수 있습니다.
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor는 <code>route</code> 함수를 제공하며,
                    이를 통해 경로를 정의한 다음 해당 경로에 대한 동사를 중첩 함수로 배치할 수 있습니다.
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
    <p>
        두 프레임워크 모두 관련 라우트를 단일 파일로 그룹화할 수 있습니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    Express는 마운트 가능한 라우트 핸들러를 생성하기 위해 <code>express.Router</code> 클래스를 제공합니다.
                    애플리케이션 디렉터리에
                    <Path>birds.js</Path>
                    라우터 파일이 있다고 가정해 봅시다.
                    이 라우터 모듈은
                    <Path>app.js</Path>
                    에 표시된 대로 애플리케이션에 로드될 수 있습니다:
                </p>
                <tabs>
                    <tab title="birds.js">
                        [object Promise]
                    </tab>
                    <tab title="app.js">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor에서는 실제 라우트를 정의하기 위해 <code>Routing</code> 타입에 대한 확장 함수를 사용하는 것이 일반적인 패턴입니다.
                    아래 예시(
                    <Path>Birds.kt</Path>
                    )는 <code>birdsRoutes</code> 확장 함수를 정의합니다.
                    이 함수를 <code>routing</code> 블록 내에서 호출하여 해당 라우트를 애플리케이션(
                    <Path>Application.kt</Path>
                    )에 포함할 수 있습니다:
                </p>
                <tabs>
                    <tab title="Birds.kt" id="birds-kt">
                        [object Promise]
                    </tab>
                    <tab title="Application.kt" id="application-kt">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
    <p>
        URL 경로를 문자열로 지정하는 것 외에도 Ktor는 <Links href="/ktor/server-resources" summary="Resources 플러그인을 사용하면 타입-세이프 라우팅을 구현할 수 있습니다.">타입-세이프 라우트</Links>를 구현하는 기능을 포함합니다.
    </p>
</chapter>
<chapter title="라우트 및 쿼리 파라미터" id="route-query-param">
    <p>
        이 섹션에서는 라우트 및 쿼리 파라미터에 접근하는 방법을 보여줍니다.
    </p>
    <p>
        라우트(또는 경로) 파라미터는 URL에서 특정 위치에 지정된 값을 캡처하는 데 사용되는 명명된 URL 세그먼트입니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    Express에서 라우트 파라미터에 접근하려면 <code>Request.params</code>를 사용할 수 있습니다.
                    예를 들어, 아래 코드 스니펫에서 <code>req.parameters["login"]</code>은
                    <emphasis>admin</emphasis>을(를)
                    <Path>/user/admin</Path>
                    경로에 대해 반환합니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor에서는 <code>{param}</code> 구문을 사용하여 라우트 파라미터가 정의됩니다.
                    라우트 핸들러에서 <code>call.parameters</code>를 사용하여 라우트 파라미터에 접근할 수 있습니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
    <p>
        아래 표는 쿼리 문자열의 파라미터에 접근하는 방법을 비교합니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    Express에서 라우트 파라미터에 접근하려면 <code>Request.params</code>를 사용할 수 있습니다.
                    예를 들어, 아래 코드 스니펫에서 <code>req.parameters["login"]</code>은
                    <emphasis>admin</emphasis>을(를)
                    <Path>/user/admin</Path>
                    경로에 대해 반환합니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor에서는 <code>{param}</code> 구문을 사용하여 라우트 파라미터가 정의됩니다.
                    라우트 핸들러에서 <code>call.parameters</code>를 사용하여 라우트 파라미터에 접근할 수 있습니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
</chapter>
<chapter title="응답 전송" id="send-response">
    <p>
        이전 섹션에서는 일반 텍스트 콘텐츠로 응답하는 방법을 이미 살펴보았습니다.
        이제 JSON, 파일, 리디렉션 응답을 보내는 방법을 살펴보겠습니다.
    </p>
    <chapter title="JSON" id="send-json">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express에서 적절한 콘텐츠 타입으로 JSON 응답을 보내려면,
                        <code>res.json</code> 함수를 호출합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식의 콘텐츠 직렬화/역직렬화라는 두 가지 주요 목적을 수행합니다.">ContentNegotiation</Links>
                        플러그인을 설치하고
                        JSON 직렬 변환기(serializer)를 구성해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        데이터를 JSON으로 직렬화하려면,
                        <code>@Serializable</code> 어노테이션이 있는 데이터 클래스를 생성해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        그런 다음, <code>call.respond</code>를 사용하여 이 클래스의 객체를 응답으로 보낼 수 있습니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="파일" id="send-file">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express에서 파일로 응답하려면, <code>res.sendFile</code>을 사용합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor는 클라이언트에 파일을 전송하기 위한 <code>call.respondFile</code> 함수를 제공합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
        <p>
            Express 애플리케이션은 파일로 응답할 때
            <control>Accept-Ranges</control>
            HTTP 응답 헤더를 추가합니다.
            서버는 이 헤더를 사용하여 파일 다운로드를 위한 클라이언트의 부분 요청 지원을 알립니다.
            Ktor에서는 부분 요청을 지원하기 위해 <Links href="/ktor/server-partial-content" summary="필수 종속성: io.ktor:%artifact_name% 서버 예시: download-file, 클라이언트 예시: client-download-file-range 네이티브 서버 지원: ✅">PartialContent</Links> 플러그인을 설치해야 합니다.
        </p>
    </chapter>
    <chapter title="파일 첨부" id="send-file-attachment">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        <code>res.download</code> 함수는 지정된 파일을 첨부 파일로 전송합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 파일을 첨부 파일로 전송하기 위해
                        <control>Content-Disposition</control>
                        헤더를 수동으로 구성해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="리디렉션" id="redirect">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express에서 리디렉션 응답을 생성하려면, <code>redirect</code> 함수를 호출합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 <code>respondRedirect</code>를 사용하여 리디렉션 응답을 보냅니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
</chapter>
<chapter title="템플릿" id="templates">
    <p>
        Express와 Ktor는 모두 뷰 작업을 위한 템플릿 엔진과의 연동을 지원합니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    아래와 같은 Pug 템플릿이
                    <Path>views</Path>
                    폴더에 있다고 가정해 봅시다:
                </p>
                [object Promise]
                <p>
                    이 템플릿으로 응답하려면, <code>res.render</code>를 호출합니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/6_templates/app.js">6_templates</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor는 FreeMarker, Velocity 등 여러 <Links href="/ktor/server-templating" summary="HTML/CSS 또는 JVM 템플릿 엔진으로 구축된 뷰를 사용하는 방법을 알아보세요.">JVM 템플릿 엔진</Links>을 지원합니다.
                    예를 들어, 애플리케이션 리소스에 배치된 FreeMarker 템플릿으로 응답해야 하는 경우,
                    <code>FreeMarker</code> 플러그인을 설치하고 구성한 다음
                    <code>call.respond</code>를 사용하여 템플릿을 보낼 수 있습니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt">6_templates</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
</chapter>
<chapter title="요청 수신" id="receive-request">
    <p>
        이 섹션에서는 다양한 형식의 요청 본문(request body)을 수신하는 방법을 보여줍니다.
    </p>
    <chapter title="원시 텍스트" id="receive-raw-text">
        <p>
            아래 <code>POST</code> 요청은 서버로 텍스트 데이터를 전송합니다:
        </p>
        [object Promise]
        <p>
            이 요청의 본문을 서버 측에서 일반 텍스트로 수신하는 방법을 살펴보겠습니다.
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express에서 들어오는 요청 본문을 파싱하려면, <code>body-parser</code>를 추가해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        <code>post</code> 핸들러에서는,
                        텍스트 파서(<code>bodyParser.text</code>)를 전달해야 합니다.
                        요청 본문은 <code>req.body</code> 속성에서 사용할 수 있습니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 <code>call.receiveText</code>를 사용하여 본문을 텍스트로 수신할 수 있습니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="JSON" id="receive-json">
        <p>
            이 섹션에서는 JSON 본문을 수신하는 방법을 살펴봅니다.
            아래 예시는 본문에 JSON 객체가 포함된 <code>POST</code> 요청을 보여줍니다:
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express에서 JSON을 수신하려면, <code>bodyParser.json</code>을 사용합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식의 콘텐츠 직렬화/역직렬화라는 두 가지 주요 목적을 수행합니다.">ContentNegotiation</Links>
                        플러그인을
                        설치하고 <code>Json</code> 직렬 변환기(serializer)를 구성해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        수신된 데이터를 객체로 역직렬화하려면, 데이터 클래스를 생성해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        그런 다음, 이 데이터 클래스를 파라미터로 받는 <code>receive</code> 메서드를 사용합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="URL-인코딩" id="receive-url-encoded">
        <p>
            이제 <control>application/x-www-form-urlencoded</control>
            타입을 사용하여 전송된 폼 데이터를 수신하는 방법을 살펴보겠습니다.
            아래 코드 스니펫은 폼 데이터가 포함된 샘플 <code>POST</code> 요청을 보여줍니다:
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        일반 텍스트 및 JSON과 마찬가지로, Express는 <code>body-parser</code>를 필요로 합니다.
                        파서 타입을 <code>bodyParser.urlencoded</code>로 설정해야 합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 <code>call.receiveParameters</code> 함수를 사용합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="원시 데이터" id="receive-raw-data">
        <p>
            다음 사용 사례는 바이너리 데이터 처리입니다.
            아래 요청은
            <control>application/octet-stream</control>
            타입으로 PNG 이미지를 서버로 전송합니다:
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express에서 바이너리 데이터를 처리하려면, 파서 타입을 <code>raw</code>로 설정합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor는 비동기적으로 바이트 시퀀스를 읽고/쓰기 위해 <code>ByteReadChannel</code> 및 <code>ByteWriteChannel</code>을(를) 제공합니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive
                            request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="멀티파트" id="receive-multipart">
        <p>
            마지막 섹션에서는
            <emphasis>멀티파트</emphasis>
            본문(body)을 처리하는 방법을 살펴보겠습니다.
            아래 <code>POST</code> 요청은
            <control>multipart/form-data</control>
            타입을 사용하여 설명이 포함된 PNG 이미지를 전송합니다:
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express는 멀티파트 데이터를 파싱하기 위해 별도의 모듈을 필요로 합니다.
                        아래 예시에서는,
                        <control>multer</control>
                        가 파일을 서버에 업로드하는 데 사용됩니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor에서는 멀티파트 요청의 일부로 전송된 파일을 수신해야 하는 경우,
                        <code>receiveMultipart</code> 함수를 호출한 다음 필요에 따라 각 파트(part)를 반복합니다.
                        아래 예시에서는 <code>PartData.FileItem</code>이 파일을 바이트 스트림으로 수신하는 데 사용됩니다:
                    </p>
                    [object Promise]
                    <p>
                        전체 예시는
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                        프로젝트를 참조하세요.
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
</chapter>
<chapter title="미들웨어 생성" id="middleware">
    <p>
        마지막으로 살펴볼 내용은 서버
        기능을 확장할 수 있는 미들웨어(middleware)를 생성하는 방법입니다.
        아래 예시는 Express와 Ktor를 사용하여 요청 로깅(request logging)을 구현하는 방법을 보여줍니다.
    </p>
    <table style="header-column">
        <tr>
            <td>
                <control>Express</control>
            </td>
            <td>
                <p>
                    Express에서 미들웨어는 <code>app.use</code>를 사용하여 애플리케이션에 바인딩된 함수입니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/8_middleware/app.js">8_middleware</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <control>Ktor</control>
            </td>
            <td>
                <p>
                    Ktor는 <Links href="/ktor/server-custom-plugins" summary="자신만의 커스텀 플러그인을 만드는 방법을 알아보세요.">커스텀 플러그인</Links>을(를) 사용하여 기능을 확장할 수 있도록 합니다.
                    아래 코드 예시는 요청 로깅을 구현하기 위해 <code>onCall</code>을 처리하는 방법을 보여줍니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt">8_middleware</a>
                    프로젝트를 참조하세요.
                </p>
            </td>
        </tr>
    </table>
</chapter>
<chapter title="다음 단계" id="next">
    <p>
        이 가이드에서 다루지 않은 세션 관리, 인증, 데이터베이스 통합 등 아직 많은 사용 사례가 있습니다.
        이러한 기능 대부분에 대해 Ktor는 애플리케이션에 설치하고 필요에 따라 구성할 수 있는 전용 플러그인을 제공합니다.
        Ktor 여정을 계속하려면,
        단계별 가이드와 바로 사용할 수 있는 샘플을 제공하는
        <control><a href="https://ktor.io/learn/">Learn 페이지</a></control>를 방문하세요.
    </p>
</chapter>
</topic>