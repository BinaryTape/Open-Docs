```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Ktor로 Kotlin에서 RESTful API를 생성하는 방법" id="server-create-restful-apis"
       help-id="create-restful-apis">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-restful-api"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="Routing은 서버 애플리케이션에서 들어오는 요청을 처리하기 위한 핵심 플러그인입니다.">Routing</Links>,<Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">Static Content</Links>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상과 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 제공합니다.">Content Negotiation</Links>, <a
            href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
    </p>
</tldr>
<card-summary>
    Ktor로 RESTful API를 구축하는 방법을 알아보세요. 이 튜토리얼은 실제 예시를 통해 설정, 라우팅 및 테스트를 다룹니다.
</card-summary>
<web-summary>
    Ktor로 Kotlin RESTful API를 구축하는 방법을 알아보세요. 이 튜토리얼은 실제 예시를 통해 설정, 라우팅 및 테스트를 다룹니다. Kotlin 백엔드 개발자를 위한 이상적인 입문 튜토리얼입니다.
</web-summary>
<link-summary>
    Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 알아보세요. JSON 파일을 생성하는 RESTful API 예시가 포함되어 있습니다.
</link-summary>
<p>
    이 튜토리얼에서는 Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 설명하며, JSON 파일을 생성하는 RESTful API의 예시를 보여드립니다.
</p>
<p>
    이전 튜토리얼에서는 유효성 검사, 오류 처리 및 단위 테스트의 기본 사항을 소개했습니다. 이 튜토리얼에서는 작업을 관리하기 위한 RESTful 서비스를 생성하여 이러한 주제를 확장할 것입니다.
</p>
<p>
    다음 방법을 배우게 됩니다:
</p>
<list>
    <li>JSON 직렬화를 사용하는 RESTful 서비스를 생성합니다.</li>
    <li>Content Negotiation (콘텐츠 협상) 프로세스를 이해합니다.</li>
    <li>Ktor 내에서 REST API의 경로를 정의합니다.</li>
</list>
<chapter title="사전 요구 사항" id="prerequisites">
    <p>이 튜토리얼은 독립적으로 진행할 수 있지만, 요청을 처리하고 응답을 생성하는 방법을 배우려면 선행 튜토리얼을 완료하는 것을 강력히 권장합니다.
    </p>
    <p>IntelliJ IDEA를 설치하는 것을 권장하지만, 원하는 다른 IDE를 사용할 수도 있습니다.
    </p>
</chapter>
<chapter title="Hello RESTful 작업 관리자" id="hello-restful-task-manager">
    <p>이 튜토리얼에서는 기존 작업 관리자(Task Manager)를 RESTful 서비스로 다시 작성할 것입니다. 이를 위해 몇 가지 Ktor 플러그인(plugins)을 사용할 것입니다.</p>
    <p>
        기존 프로젝트에 수동으로 추가할 수도 있지만, 새 프로젝트를 생성한 다음 이전 튜토리얼의 코드를 점진적으로 추가하는 것이 더 간단합니다. 코드를 진행하면서 모든 코드를 다시 작성할 것이므로 이전 프로젝트를 가지고 있을 필요는 없습니다.
    </p>
    <procedure title="플러그인으로 새 프로젝트 생성">
        <step>
<p>
    Ktor Project Generator (Ktor 프로젝트 생성기)로 이동합니다.
</p>
        </step>
        <step>
            <p>Project artifact (프로젝트 아티팩트) 필드에 프로젝트 아티팩트 이름으로
                <Path>com.example.ktor-rest-task-app</Path>
                을 입력합니다.
                <img src="tutorial_creating_restful_apis_project_artifact.png"
                     alt="Ktor Project Generator에서 프로젝트 아티팩트 이름 지정"
                     style="block"
                     border-effect="line"
                     width="706"/>
            </p>
        </step>
        <step>
            <p>
                플러그인 섹션에서 다음 플러그인들을 검색하고 추가 버튼을 클릭하여 추가합니다:
            </p>
            <list type="bullet">
                <li>Routing</li>
                <li>Content Negotiation</li>
                <li>Kotlinx.serialization</li>
                <li>Static Content</li>
            </list>
            <p>
                <img src="ktor_project_generator_add_plugins.gif" alt="Ktor Project Generator에서 플러그인 추가"
                     border-effect="line"
                     style="block"
                     width="706"/>
                플러그인을 추가하면 프로젝트 설정 아래에 네 가지 플러그인이 모두 나열된 것을 볼 수 있습니다.
                <img src="tutorial_creating_restful_apis_plugins_list.png"
                     alt="Ktor Project Generator의 플러그인 목록"
                     border-effect="line"
                     style="block"
                     width="706"/>
            </p>
        </step>
        <step>
<p>
    다운로드 버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다.
</p>
        </step>
    </procedure>
    <procedure title="시작 코드 추가" id="add-starter-code">
        <step>
            <p>이전 <a href="server-create-a-new-project.topic#open-explore-run">IntelliJ IDEA에서 Ktor 프로젝트 열고 탐색하고 실행하기</a> 튜토리얼에 설명된 대로 IntelliJ IDEA에서 프로젝트를 엽니다.</p>
        </step>
        <step>
            <p>
                <Path>src/main/kotlin/com/example</Path>
                로 이동하여
                <Path>model</Path>
                이라는 하위 패키지를 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>model</Path>
                패키지 안에 새
                <Path>Task.kt</Path>
                파일을 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>Task.kt</Path>
                파일을 열고 우선순위를 나타내는 <code>enum</code>과 작업을 나타내는 <code>class</code>를 추가합니다:
            </p>
            [object Promise]
            <p>
                이전 튜토리얼에서는 확장 함수를 사용하여 <code>Task</code>를 HTML로 변환했습니다. 이 경우 
                <code>Task</code> 클래스는 <code>kotlinx.serialization</code> 라이브러리의 <code>Serializable</code> 타입으로 어노테이션되어 있습니다.
            </p>
        </step>
        <step>
            <p>
                <Path>Routing.kt</Path>
                파일을 열고 기존 코드를 아래 구현으로 바꿉니다:
            </p>
            [object Promise]
            <p>
                이전 튜토리얼과 유사하게, <code>GET</code> 요청에 대한 URL <code>/tasks</code> 경로를 생성했습니다.
                이번에는 작업 목록을 수동으로 변환하는 대신 단순히 목록을 반환합니다.
            </p>
        </step>
        <step>
<p>IntelliJ IDEA에서 실행 버튼
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="IntelliJ IDEA 실행 아이콘"/>)
    을 클릭하여 애플리케이션을 시작합니다.</p>
        </step>
        <step>
            <p>
                브라우저에서 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a> URL로 이동합니다. 아래와 같이 작업 목록의 JSON 버전을 볼 수 있을 것입니다:
            </p>
        </step>
        <img src="tutorial_creating_restful_apis_starter_code_preview.png"
             alt="브라우저 화면에 표시된 JSON 데이터"
             border-effect="rounded"
             width="706"/>
        <p>분명히 많은 작업이 우리를 대신하여 수행되고 있습니다. 정확히 무슨 일이 일어나고 있는 걸까요?</p>
    </procedure>
</chapter>
<chapter title="콘텐츠 협상 이해" id="content-negotiation">
    <chapter title="브라우저를 통한 콘텐츠 협상" id="via-browser">
        <p>
            프로젝트를 생성할 때 Content Negotiation (콘텐츠 협상) 플러그인을 포함했습니다. 이 플러그인은 클라이언트가 렌더링할 수 있는 콘텐츠 유형을 살펴보고 이를 현재 서비스가 제공할 수 있는 콘텐츠 유형과 일치시킵니다. 따라서
            <format style="italic">콘텐츠 협상</format>
            이라는 용어를 사용합니다.
        </p>
        <p>
            HTTP에서 클라이언트는 <code>Accept</code> 헤더를 통해 렌더링할 수 있는 콘텐츠 유형을 알려줍니다. 이 헤더의 값은 하나 이상의 콘텐츠 유형입니다. 위 경우 브라우저에 내장된 개발자 도구를 사용하여 이 헤더의 값을 확인할 수 있습니다.
        </p>
        <p>
            다음 예시를 고려해 보세요:
        </p>
        [object Promise]
        <p><code>*/*</code>의 포함에 주목하세요. 이 헤더는 HTML, XML 또는 이미지를 허용하지만, 다른 모든 콘텐츠 유형도 허용함을 나타냅니다.</p>
        <p>Content Negotiation 플러그인은 브라우저로 데이터를 다시 보낼 형식을 찾아야 합니다. 프로젝트의 생성된 코드를 살펴보면
            <Path>src/main/kotlin/com/example</Path>
            안에
            <Path>Serialization.kt</Path>
            라는 파일이 있는데, 여기에는 다음 내용이 포함되어 있습니다:
        </p>
        [object Promise]
        <p>
            이 코드는 <code>ContentNegotiation</code> 플러그인을 설치하고, <code>kotlinx.serialization</code> 플러그인도 구성합니다. 이를 통해 클라이언트가 요청을 보내면 서버는 JSON으로 직렬화된 객체를 다시 보낼 수 있습니다.
        </p>
        <p>
            브라우저의 요청의 경우 <code>ContentNegotiation</code> 플러그인은 JSON만 반환할 수 있다는 것을 알고 있으며, 브라우저는 전송된 모든 것을 표시하려고 시도합니다. 따라서 요청은 성공합니다.
        </p>
    </chapter>
    <procedure title="JavaScript를 통한 콘텐츠 협상" id="via-javascript">
        <p>
            프로덕션 환경에서는 JSON을 브라우저에 직접 표시하는 것을 원하지 않을 것입니다. 대신 브라우저 내에서 실행되는 JavaScript 코드가 요청을 보내고 단일 페이지 애플리케이션(SPA)의 일부로 반환된 데이터를 표시할 것입니다. 일반적으로 이러한 종류의 애플리케이션은 <a href="https://react.dev/">React</a>,
            <a href="https://angular.io/">Angular</a>,
            또는 <a href="https://vuejs.org/">Vue.js</a>와 같은 프레임워크를 사용하여 작성됩니다.
        </p>
        <step>
            <p>
                이를 시뮬레이션하기 위해
                <Path>src/main/resources/static</Path>
                안에 있는
                <Path>index.html</Path>
                페이지를 열고 기본 내용을 다음으로 바꿉니다:
            </p>
            [object Promise]
            <p>
                이 페이지에는 HTML 폼과 비어 있는 테이블이 포함되어 있습니다. 폼을 제출하면 JavaScript 이벤트 핸들러가 <code>Accept</code> 헤더를 <code>application/json</code>으로 설정하여 <code>/tasks</code> 엔드포인트로 요청을 보냅니다. 반환된 데이터는 역직렬화되어 HTML 테이블에 추가됩니다.
            </p>
        </step>
        <step>
<p>
    IntelliJ IDEA에서 다시 실행 버튼 (<img src="intellij_idea_rerun_icon.svg"
                                       style="inline" height="16" width="16"
                                       alt="IntelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여 애플리케이션을 다시 시작합니다.
</p>
        </step>
        <step>
            <p>
                <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a> URL로 이동합니다. View The Tasks (작업 보기) 버튼을 클릭하여 데이터를 가져올 수 있어야 합니다:
            </p>
            <img src="tutorial_creating_restful_apis_tasks_via_js.png"
                 alt="버튼과 HTML 테이블로 표시된 작업이 있는 브라우저 창"
                 border-effect="line"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="GET 경로 추가" id="porting-get-routes">
    <p>
        이제 콘텐츠 협상 프로세스에 익숙해졌으므로, 이전 튜토리얼의 기능을 이 튜토리얼로 옮기는 작업을 계속 진행합니다.
    </p>
    <chapter title="작업 저장소 재사용" id="task-repository">
        <p>
            Task Repository (작업 저장소)를 수정 없이 재사용할 수 있으므로, 먼저 그렇게 해봅시다.
        </p>
        <procedure>
            <step>
                <p>
                    <Path>model</Path>
                    패키지 안에 새
                    <Path>TaskRepository.kt</Path>
                    파일을 생성합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>
                    를 열고 아래 코드를 추가합니다:
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="GET 요청 경로 재사용" id="get-requests">
        <p>
            이제 저장소를 생성했으므로 GET 요청에 대한 경로를 구현할 수 있습니다. 작업을 HTML로 변환하는 것에 대해 더 이상 걱정할 필요가 없으므로 이전 코드를 단순화할 수 있습니다:
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example</Path>
                    에 있는
                    <Path>Routing.kt</Path>
                    파일로 이동합니다.
                </p>
            </step>
            <step>
                <p>
                    <code>Application.configureRouting()</code> 함수 내의 <code>/tasks</code> 경로에 대한 코드를 다음 구현으로 업데이트합니다:
                </p>
                [object Promise]
                <p>
                    이로써 서버는 다음 GET 요청에 응답할 수 있습니다:</p>
                <list>
                    <li><code>/tasks</code>는 저장소의 모든 작업을 반환합니다.</li>
                    <li><code>/tasks/byName/{taskName}</code>은 지정된 <code>taskName</code>으로 필터링된 작업을 반환합니다.
                    </li>
                    <li><code>/tasks/byPriority/{priority}</code>는 지정된 <code>priority</code>로 필터링된 작업을 반환합니다.
                    </li>
                </list>
            </step>
            <step>
<p>
    IntelliJ IDEA에서 다시 실행 버튼 (<img src="intellij_idea_rerun_icon.svg"
                                       style="inline" height="16" width="16"
                                       alt="IntelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여 애플리케이션을 다시 시작합니다.
</p>
            </step>
        </procedure>
    </chapter>
    <chapter title="기능 테스트" id="test-tasks-routes">
        <procedure title="브라우저 사용">
            <p>브라우저에서 이 경로들을 테스트할 수 있습니다. 예를 들어, <a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>으로 이동하여 <code>Medium</code> 우선순위를 가진 모든 작업이 JSON 형식으로 표시되는 것을 확인하세요:</p>
            <img src="tutorial_creating_restful_apis_tasks_medium_priority.png"
                 alt="JSON 형식으로 중간 우선순위 작업을 보여주는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
            <p>
                이러한 종류의 요청은 일반적으로 JavaScript에서 오기 때문에, 더 세분화된 테스트가 바람직합니다. 이를 위해 <a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>과 같은 전문 도구를 사용할 수 있습니다.
            </p>
        </procedure>
        <procedure title="Postman 사용">
            <step>
                <p>Postman에서 URL
                    <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>으로 새 GET 요청을 생성합니다.</p>
            </step>
            <step>
                <p>
                    <ui-path>Headers</ui-path>
                    창에서
                    <ui-path>Accept</ui-path>
                    헤더의 값을 <code>application/json</code>으로 설정합니다.
                </p>
            </step>
            <step>
                <p>Send (전송)를 클릭하여 요청을 보내고 응답 뷰어에서 응답을 확인합니다.
                </p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority_postman.png"
                     alt="JSON 형식으로 중간 우선순위 작업을 보여주는 Postman의 GET 요청"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
        <procedure title="HTTP 요청 파일 사용">
            <p>IntelliJ IDEA Ultimate 내에서는 HTTP 요청 파일에서 동일한 단계를 수행할 수 있습니다.</p>
            <step>
                <p>
                    프로젝트 루트 디렉토리에 새
                    <Path>REST Task Manager.http</Path>
                    파일을 생성합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>REST Task Manager.http</Path>
                    파일을 열고 다음 GET 요청을 추가합니다:
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    IntelliJ IDE 내에서 요청을 보내려면 옆에 있는 거터 아이콘 (<img
                        alt="IntelliJ IDEA 거터 아이콘"
                        src="intellij_idea_gutter_icon.svg"
                        width="16" height="26"/>)을 클릭합니다.
                </p>
            </step>
            <step>
                <p>그러면
                    <Path>Services</Path>
                    도구 창에서 열리고 실행됩니다:
                </p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority_http_file.png"
                     alt="JSON 형식으로 중간 우선순위 작업을 보여주는 HTTP 파일의 GET 요청"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
        <note>
            경로를 테스트하는 또 다른 방법은 Kotlin Notebook 내에서 <a
                href="https://khttp.readthedocs.io/en/latest/">khttp</a> 라이브러리를 사용하는 것입니다.
        </note>
    </chapter>
</chapter>
<chapter title="POST 요청 경로 추가" id="add-a-route-for-post-requests">
    <p>
        이전 튜토리얼에서는 HTML 폼을 통해 작업을 생성했습니다. 그러나 이제 RESTful 서비스를 구축하고 있으므로 더 이상 그럴 필요가 없습니다. 대신, 대부분의 힘든 작업을 수행할 <code>kotlinx.serialization</code> 프레임워크를 사용할 것입니다.
    </p>
    <procedure>
        <step>
            <p>
                <Path>src/main/kotlin/com/example</Path>
                안에 있는
                <Path>Routing.kt</Path>
                파일을 엽니다.
            </p>
        </step>
        <step>
            <p>
                <code>Application.configureRouting()</code> 함수에 다음 POST 경로를 추가합니다:
            </p>
            [object Promise]
            <p>
                다음 새 임포트를 추가합니다:
            </p>
            [object Promise]
            <p>
                POST 요청이 <code>/tasks</code>로 전송될 때, <code>kotlinx.serialization</code> 프레임워크는 요청 본문을 <code>Task</code> 객체로 변환하는 데 사용됩니다. 이 작업이 성공하면 작업이 저장소에 추가됩니다. 역직렬화 프로세스가 실패하면 서버는 <code>SerializationException</code>을 처리해야 하며, 작업이 중복된 경우 <code>IllegalStateException</code>을 처리해야 합니다.
            </p>
        </step>
        <step>
            <p>
                애플리케이션을 다시 시작합니다.
            </p>
        </step>
        <step>
            <p>
                Postman에서 이 기능을 테스트하려면 URL <code>http://0.0.0.0:8080/tasks</code>로 새 POST 요청을 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <ui-path>Body</ui-path>
                창에 새 작업을 나타내기 위해 다음 JSON 문서를 추가합니다:
            </p>
            [object Promise]
            <img src="tutorial_creating_restful_apis_add_task.png"
                 alt="새 작업을 추가하기 위한 Postman의 POST 요청"
                 border-effect="line"
                 width="706"/>
        </step>
        <step>
            <p>Send (전송)를 클릭하여 요청을 보냅니다.
            </p>
        </step>
        <step>
            <p>
                <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 GET 요청을 보내 작업을 추가했는지 확인할 수 있습니다.
            </p>
        </step>
        <step>
            <p>
                IntelliJ IDEA Ultimate 내에서는 HTTP 요청 파일에 다음을 추가하여 동일한 단계를 수행할 수 있습니다:
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="제거 지원 추가" id="remove-tasks">
    <p>
        서비스에 기본 작업을 거의 다 추가했습니다. 이러한 작업은 종종 CRUD 작업(생성, 읽기, 업데이트, 삭제의 약자)으로 요약됩니다. 이제 삭제 작업을 구현할 것입니다.
    </p>
    <procedure>
        <step>
            <p>
                <Path>TaskRepository.kt</Path>
                파일의 <code>TaskRepository</code> 객체 내에 이름으로 작업을 제거하는 다음 메서드를 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <Path>Routing.kt</Path>
                파일을 열고 <code>routing()</code> 함수에 DELETE 요청을 처리하는 엔드포인트를 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                애플리케이션을 다시 시작합니다.
            </p>
        </step>
        <step>
            <p>
                HTTP 요청 파일에 다음 DELETE 요청을 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                IntelliJ IDE 내에서 DELETE 요청을 보내려면 옆에 있는 거터 아이콘 (<img
                    alt="IntelliJ IDEA 거터 아이콘"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>)을 클릭합니다.
            </p>
        </step>
        <step>
            <p>그러면
                <Path>Services</Path>
                도구 창에서 응답을 볼 수 있습니다:
            </p>
            <img src="tutorial_creating_restful_apis_delete_task.png"
                 alt="HTTP 요청 파일의 DELETE 요청"
                 border-effect="line"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="Ktor 클라이언트로 단위 테스트 생성" id="create-unit-tests">
    <p>
        지금까지 애플리케이션을 수동으로 테스트했지만, 이미 아시다시피 이 접근 방식은 시간이 많이 걸리고 확장되지 않습니다. 대신, 내장된
        <code>client</code> 객체를 사용하여 JSON을 가져오고 역직렬화하는 <Links href="/ktor/server-testing" summary="특별한 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요.">JUnit 테스트</Links>를 구현할 수 있습니다.
    </p>
    <procedure>
        <step>
            <p>
                <Path>src/test/kotlin/com/example</Path>
                안에 있는
                <Path>ApplicationTest.kt</Path>
                파일을 엽니다.
            </p>
        </step>
        <step>
            <p>
                <Path>ApplicationTest.kt</Path>
                파일의 내용을 다음으로 바꿉니다:
            </p>
            [object Promise]
            <p>
                서버에서 했던 것과 동일한 방식으로 <code>ContentNegotiation</code> 및
                <code>kotlinx.serialization</code> 플러그인을 <a href="client-create-and-configure.md#plugins">Plugins</a>에 설치해야 합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>gradle/libs.versions.toml</Path>
                에 있는 버전 카탈로그에 다음 의존성을 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <Path>build.gradle.kts</Path>
                파일에 새 의존성을 추가합니다:
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="JsonPath로 단위 테스트 생성" id="unit-tests-via-jsonpath">
    <p>
        Ktor 클라이언트 또는 유사한 라이브러리로 서비스를 테스트하는 것은 편리하지만, 품질 보증(QA) 관점에서 단점이 있습니다. 서버는 JSON을 직접 처리하지 않으므로 JSON 구조에 대한 가정을 확신할 수 없습니다.
    </p>
    <p>
        예를 들어, 다음과 같은 가정들:
    </p>
    <list>
        <li>실제로는 <code>object</code>가 사용되는데 값이 <code>array</code>에 저장되고 있습니다.</li>
        <li>속성이 <code>string</code>인데 실제로는 <code>number</code>로 저장되고 있습니다.</li>
        <li>멤버가 선언 순서대로 직렬화되지 않고 있습니다.</li>
    </list>
    <p>
        서비스가 여러 클라이언트에서 사용되도록 의도된 경우, JSON 구조에 대한 확신을 갖는 것이 중요합니다. 이를 위해 Ktor 클라이언트를 사용하여 서버에서 텍스트를 가져온 다음 <a href="https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path">JSONPath</a> 라이브러리를 사용하여 이 콘텐츠를 분석합니다.</p>
    <procedure>
        <step>
            <p>
                <Path>build.gradle.kts</Path>
                파일의 <code>dependencies</code> 블록에 JSONPath 라이브러리를 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <Path>src/test/kotlin/com/example</Path>
                폴더로 이동하여 새
                <Path>ApplicationJsonPathTest.kt</Path>
                파일을 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>ApplicationJsonPathTest.kt</Path>
                파일을 열고 다음 내용을 추가합니다:
            </p>
            [object Promise]
            <p>
                JsonPath 쿼리는 다음과 같이 작동합니다:
            </p>
            <list>
                <li>
                    <code>$[*].name</code>은 “문서를 배열로 처리하고 각 항목의 이름 속성 값을 반환”을 의미합니다.
                </li>
                <li>
                    <code>$[?(@.priority == '$priority')].name</code>은 “제공된 값과 우선순위가 동일한 배열의 모든 항목에서 이름 속성 값을 반환”을 의미합니다.
                </li>
            </list>
            <p>
                이러한 쿼리를 사용하여 반환된 JSON에 대한 이해를 확인할 수 있습니다. 코드 리팩토링 및 서비스 재배포 시, 현재 프레임워크와의 역직렬화를 방해하지 않더라도 직렬화의 모든 수정 사항이 식별됩니다. 이를 통해 공개적으로 사용 가능한 API를 확신을 가지고 다시 게시할 수 있습니다.
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="다음 단계" id="next-steps">
    <p>
        축하합니다! 이제 Task Manager 애플리케이션을 위한 RESTful API 서비스를 생성하는 것을 완료했으며, Ktor 클라이언트와 JsonPath를 사용한 단위 테스트의 세부 사항을 모두 배웠습니다.</p>
    <p>
        다음 튜토리얼로 이동하여 API 서비스를 재사용하여 웹 애플리케이션을 구축하는 방법을 알아보세요.
    </p>
</chapter>
</topic>