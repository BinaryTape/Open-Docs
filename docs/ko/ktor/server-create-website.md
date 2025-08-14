<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Ktor를 사용하여 Kotlin으로 웹사이트 만들기" id="server-create-website">
<tldr>
        <var name="example_name" value="tutorial-server-web-application"/>
    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="Routing은 서버 애플리케이션에서 들어오는 요청을 처리하기 위한 핵심 플러그인입니다.">Routing</Links>,
            <Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">Static Content</Links>,
            <Links href="/ktor/server-thymeleaf" summary="필수 의존성: io.ktor:%artifact_name%
        코드 예시:
            %example_name%
        네이티브 서버 지원: ✖️">Thymeleaf</Links>
        </p>
</tldr>
<web-summary>
        Ktor와 Kotlin으로 웹사이트를 구축하는 방법을 알아보세요. 이 튜토리얼에서는 Thymeleaf 템플릿과 Ktor 라우트를 결합하여 서버 측에서 HTML 기반 사용자 인터페이스를 생성하는 방법을 보여줍니다.
</web-summary>
<card-summary>
        Ktor와 Thymeleaf 템플릿을 사용하여 Kotlin으로 웹사이트를 구축하는 방법을 알아보세요.
</card-summary>
<link-summary>
        Ktor와 Thymeleaf 템플릿을 사용하여 Kotlin으로 웹사이트를 구축하는 방법을 알아보세요.
</link-summary>
<p>
        이 튜토리얼에서는 Ktor와
        <a href="https://www.thymeleaf.org/">Thymeleaf</a> 템플릿을 사용하여 Kotlin으로 상호작용하는 웹사이트를 구축하는 방법을 보여드리겠습니다.
</p>
<p>
         <Links href="/ktor/server-create-restful-apis" summary="Kotlin 및 Ktor를 사용하여 백엔드 서비스를 구축하는 방법과 JSON 파일을 생성하는 RESTful API의 예시를 알아보세요.">이전 튜토리얼</Links>에서는 RESTful 서비스를 생성하는 방법을 다루었으며, JavaScript로 작성된 단일 페이지 애플리케이션(SPA)에서 소비될 것으로 가정했습니다. 이 아키텍처는 매우 인기가 있지만, 모든 프로젝트에 적합하지는 않습니다.
</p>
<p>
        다음과 같이 구현의 모든 부분을 서버에 두고 클라이언트에게 마크업만 보내고 싶을 수 있는 여러 가지 이유가 있습니다:
</p>
<list>
        <li>단순성 - 단일 코드베이스를 유지하기 위함.</li>
        <li>보안 - 공격자에게 정보를 제공할 수 있는 데이터나 코드를 브라우저에 배치하는 것을 방지하기 위함.
        </li>
        <li>
            지원 가능성 - 레거시 브라우저와 JavaScript가 비활성화된 브라우저를 포함하여 가능한 한 다양한 클라이언트가 사용할 수 있도록 허용하기 위함.
        </li>
</list>
<p>
        Ktor는 <Links href="/ktor/server-templating" summary="HTML/CSS 또는 JVM 템플릿 엔진으로 빌드된 뷰 작업 방법을 알아보세요.">여러 서버 페이지 기술</Links>과 통합하여 이러한 접근 방식을 지원합니다.
</p>
<chapter title="사전 요구 사항" id="prerequisites">
        <p>
            이 튜토리얼은 독립적으로 진행할 수 있지만, RESTful API를 생성하는 방법을 배우려면
            <Links href="/ktor/server-create-restful-apis" summary="Kotlin 및 Ktor를 사용하여 백엔드 서비스를 구축하는 방법과 JSON 파일을 생성하는 RESTful API의 예시를 알아보세요.">선행 튜토리얼</Links>을 완료하는 것을 강력히 권장합니다.
        </p>
        <p> <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
            IDEA</a>를 설치하는 것을 권장하지만, 다른 원하는 IDE를 사용해도 됩니다.
        </p>
</chapter>
<chapter title="Hello Task Manager 웹 애플리케이션" id="hello-task-manager">
        <p>
            이 튜토리얼에서는 <Links href="/ktor/server-create-restful-apis" summary="Kotlin 및 Ktor를 사용하여 백엔드 서비스를 구축하는 방법과 JSON 파일을 생성하는 RESTful API의 예시를 알아보세요.">이전 튜토리얼</Links>에서 빌드한 Task Manager를 웹
            애플리케이션으로 변환합니다. 이를 위해 여러 Ktor <Links href="/ktor/server-plugins" summary="플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 일반적인 기능을 제공합니다.">플러그인</Links>을 사용할 것입니다.
        </p>
        <p>
            이러한 플러그인을 기존 프로젝트에 수동으로 추가할 수도 있지만, 새 프로젝트를 생성하고 이전 튜토리얼의 코드를 점진적으로 통합하는 것이 더 쉽습니다. 필요한 모든 코드를 제공할 예정이므로, 이전 프로젝트를 가지고 있지 않아도 됩니다.
        </p>
        <procedure title="플러그인을 사용하여 초기 프로젝트 생성" id="create-project">
            <step>
    <p>
         <a href="https://start.ktor.io/">Ktor 프로젝트 생성기</a>로 이동합니다.
    </p>
            </step>
            <step>
                <p>
                    <control>Project artifact</control>
                    필드에
                    <Path>com.example.ktor-task-web-app</Path>
                    를 프로젝트 아티팩트 이름으로 입력합니다.
                    <img src="server_create_web_app_generator_project_artifact.png"
                         alt="Ktor 프로젝트 생성기 프로젝트 아티팩트 이름"
                         style="block"
                         border-effect="line" width="706"/>
                </p>
            </step>
            <step>
                <p>다음 화면에서 <control>Add</control> 버튼을 클릭하여 다음 플러그인을 검색하고 추가합니다:
                </p>
                <list>
                    <li>Routing</li>
                    <li>Static Content</li>
                    <li>Thymeleaf</li>
                </list>
                <p>
                    <img src="ktor_project_generator_add_plugins.gif"
                         alt="Ktor 프로젝트 생성기에서 플러그인 추가"
                         border-effect="line"
                         style="block"
                         width="706"/>
                    플러그인을 추가하면 프로젝트 설정 아래에 세 가지 플러그인이 모두 나열된 것을 볼 수 있습니다.
                    <img src="server_create_web_app_generator_plugins.png"
                         alt="Ktor 프로젝트 생성기 플러그인 목록"
                         style="block"
                         border-effect="line" width="706"/>
                </p>
            </step>
            <step>
    <p>
         <control>Download</control>
        버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다.
    </p>
            </step>
        </procedure>
        <procedure title="시작 코드 추가" id="add-starter-code">
            <step>
                IntelliJ IDEA 또는 다른 원하는 IDE에서 프로젝트를 엽니다.
            </step>
            <step>
                 <Path>src/main/kotlin/com/example</Path> 로 이동하여 <Path>model</Path> 이라는 하위 패키지를 생성합니다.
            </step>
            <step>
                 <Path>model</Path> 패키지 내에 새로운 <Path>Task.kt</Path> 파일을 생성합니다.
            </step>
            <step>
                <p>
                     <Path>Task.kt</Path>
                    파일에 우선순위를 나타내는 <code>enum</code>과 작업을 나타내는 <code>data class</code>를 추가합니다:
                </p>
                [object Promise]
                <p>
                    다시 한번, <code>Task</code> 객체를 생성하고 표시할 수 있는 형태로 클라이언트에게 보내고자 합니다.
                </p>
                <p>
                    다음 내용을 기억할 수도 있습니다:
                </p>
                <list>
                    <li>
                        <Links href="/ktor/server-requests-and-responses" summary="작업 관리자 애플리케이션을 구축하여 Kotlin 및 Ktor에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 알아보세요.">요청 처리 및 응답 생성</Links>
                        튜토리얼에서 작업을 HTML로 변환하는 수제 확장 함수를 추가했습니다.
                    </li>
                    <li>
                        <Links href="/ktor/server-create-restful-apis" summary="Kotlin 및 Ktor를 사용하여 백엔드 서비스를 구축하는 방법과 JSON 파일을 생성하는 RESTful API의 예시를 알아보세요.">RESTful API 생성</Links> 튜토리얼에서
                        <code>kotlinx.serialization</code> 라이브러리의 <code>Serializable</code> 타입으로
                        <code>Task</code> 클래스에 주석을 달았습니다.
                    </li>
                </list>
                <p>
                    이 경우, 우리의 목표는 작업 내용을 브라우저에 쓸 수 있는 서버 페이지를 만드는 것입니다.
                </p>
            </step>
            <step>
                 <Path>plugins</Path> 패키지 내의 <Path>Templating.kt</Path> 파일을 엽니다.
            </step>
            <step>
                <p>
                    <code>configureTemplating()</code> 메서드에 아래와 같이 <code>/tasks</code> 에 대한 라우트를 추가합니다:
                </p>
                [object Promise]
                <p>
                    서버가 <code>/tasks</code> 에 대한 요청을 받으면, 작업 목록을 생성하고 이를 Thymeleaf 템플릿에 전달합니다. <code>ThymeleafContent</code> 타입은 트리거할 템플릿의 이름과 페이지에서 접근할 수 있도록 하고 싶은 값들의 테이블을 받습니다.
                </p>
                <p>
                    메서드 상단에 있는 Thymeleaf 플러그인 초기화에서, Ktor가 서버 페이지를 위해
                    <Path>templates/thymeleaf</Path>
                    내부를 탐색한다는 것을 알 수 있습니다. 정적 콘텐츠와 마찬가지로, 이 폴더가
                    <Path>resources</Path>
                    디렉토리 내에 있을 것으로 예상합니다. 또한
                    <Path>.html</Path>
                    접미사를 예상합니다.
                </p>
                <p>
                    이 경우, 이름 <code>all-tasks</code> 는
                    <code>src/main/resources/templates/thymeleaf/all-tasks.html</code> 경로에 매핑됩니다.
                </p>
            </step>
            <step>
                 <Path>src/main/resources/templates/thymeleaf</Path> 로 이동하여 새로운
                <Path>all-tasks.html</Path>
                파일을 생성합니다.
            </step>
            <step>
                <p> <Path>all-tasks.html</Path>
                    파일을 열고 아래 내용을 추가합니다:
                </p>
                [object Promise]
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
                    브라우저에서 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a> 로 이동합니다. 아래와 같이 현재 모든 작업이 테이블에 표시되는 것을 볼 수 있습니다:
                </p>
                <img src="server_create_web_app_all_tasks.png"
                     alt="작업 목록을 표시하는 웹 브라우저 창" border-effect="rounded" width="706"/>
                <p>
                    모든 서버 페이지 프레임워크와 마찬가지로, Thymeleaf 템플릿은 정적 콘텐츠(브라우저로 전송될 내용)와 동적 콘텐츠(서버에서 실행될 내용)를 혼합합니다. <a href="https://freemarker.apache.org/">Freemarker</a>와 같은 대안 프레임워크를 선택했다면, 약간 다른 구문으로 동일한 기능을 제공할 수 있었을 것입니다.
                </p>
            </step>
        </procedure>
</chapter>
<chapter title="GET 라우트 추가" id="add-get-routes">
        <p>이제 서버 페이지를 요청하는 과정에 익숙해졌으므로, 이전 튜토리얼의 기능을 이 튜토리얼로 이전하는 작업을 계속합니다.</p>
        <p> <control>Static Content</control>
            플러그인을 포함했기 때문에, 다음 코드가
            <Path>Routing.kt</Path>
            파일에 존재할 것입니다:
        </p>
        [object Promise]
        <p>
            이는 예를 들어, <code>/static/index.html</code> 에 대한 요청이 다음 경로에서 콘텐츠를 제공받을 것임을 의미합니다:
        </p>
        <code>src/main/resources/static/index.html</code>
        <p>
            이 파일은 이미 생성된 프로젝트의 일부이므로, 추가하려는 기능의 홈페이지로 사용할 수 있습니다.
        </p>
        <procedure title="인덱스 페이지 재사용">
            <step>
                <p>
                     <Path>src/main/resources/static</Path>
                    내의
                    <Path>index.html</Path>
                    파일을 열고 그 내용을 아래 구현으로 바꿉니다:
                </p>
                [object Promise]
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
                    브라우저에서 <a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a> 로 이동합니다. 링크 버튼과 작업을 보고, 필터링하고, 생성할 수 있는 세 가지 HTML 폼이 보일 것입니다:
                </p>
                <img src="server_create_web_app_tasks_form.png"
                     alt="HTML 폼을 표시하는 웹 브라우저" border-effect="rounded" width="706"/>
                <p>
                    <code>name</code> 또는 <code>priority</code> 로 작업을 필터링할 때, GET 요청을 통해 HTML 폼을 제출하고 있다는 점에 유의하세요. 이는 매개변수가 URL 뒤에 쿼리 스트링으로 추가될 것임을 의미합니다.
                </p>
                <p>
                    예를 들어, <code>Medium</code> 우선순위의 작업을 검색하면 서버로 다음 요청이 전송됩니다:
                </p>
                <code>http://localhost:8080/tasks/byPriority?priority=Medium</code>
            </step>
        </procedure>
        <procedure title="TaskRepository 재사용" id="task-repository">
            <p>
                작업을 위한 저장소는 이전 튜토리얼의 것과 동일하게 유지될 수 있습니다.
            </p>
            <p>
                 <Path>model</Path>
                패키지 내에 새로운
                <Path>TaskRepository.kt</Path>
                파일을 생성하고 아래 코드를 추가합니다:
            </p>
            [object Promise]
        </procedure>
        <procedure title="GET 요청을 위한 라우트 재사용" id="reuse-routes">
            <p>
                이제 저장소를 생성했으므로, GET 요청을 위한 라우트를 구현할 수 있습니다.
            </p>
            <step>
                 <Path>src/main/kotlin/com/example/plugins</Path> 에 있는
                <Path>Templating.kt</Path>
                파일로 이동합니다.
            </step>
            <step>
                <p>
                    <code>configureTemplating()</code> 의 현재 버전을 아래 구현으로 바꿉니다:
                </p>
                [object Promise]
                <p>
                    위 코드는 다음과 같이 요약할 수 있습니다:
                </p>
                <list>
                    <li>
                        <code>/tasks</code> 에 대한 GET 요청 시, 서버는 저장소에서 모든 작업을 가져와서
                        <Path>all-tasks</Path>
                        템플릿을 사용하여 브라우저로 전송될 다음 뷰를 생성합니다.
                    </li>
                    <li>
                        <code>/tasks/byName</code> 에 대한 GET 요청 시, 서버는
                        <code>queryString</code> 에서
                        <code>taskName</code> 매개변수를 가져와서 일치하는 작업을 찾고,
                        <Path>single-task</Path>
                        템플릿을 사용하여 브라우저로 전송될 다음 뷰를 생성합니다.
                    </li>
                    <li>
                        <code>/tasks/byPriority</code> 에 대한 GET 요청 시, 서버는
                        <code>queryString</code> 에서
                        <code>priority</code> 매개변수를 가져와서 일치하는 작업을 찾고,
                        <Path>tasks-by-priority</Path>
                        템플릿을 사용하여 브라우저로 전송될 다음 뷰를 생성합니다.
                    </li>
                </list>
                <p>이 모든 것이 작동하려면 추가 템플릿을 추가해야 합니다.</p>
            </step>
            <step>
                 <Path>src/main/resources/templates/thymeleaf</Path> 로 이동하여 새로운
                <Path>single-task.html</Path>
                파일을 생성합니다.
            </step>
            <step>
                <p>
                     <Path>single-task.html</Path>
                    파일을 열고 다음 내용을 추가합니다:
                </p>
                [object Promise]
            </step>
            <step>
                <p>같은 폴더에
                    <Path>tasks-by-priority.html</Path>
                    이라는 새 파일을 생성합니다.
                </p>
            </step>
            <step>
                <p>
                     <Path>tasks-by-priority.html</Path>
                    파일을 열고 다음 내용을 추가합니다:
                </p>
                [object Promise]
            </step>
        </procedure>
</chapter>
<chapter title="POST 요청 지원 추가" id="add-post-requests">
        <p>
            다음으로, 다음을 수행하기 위해 <code>/tasks</code> 에 POST 요청 핸들러를 추가할 것입니다:
        </p>
        <list>
            <li>폼 매개변수에서 정보 추출.</li>
            <li>저장소를 사용하여 새 작업 추가.</li>
            <li> <control>all-tasks</control>
                템플릿을 재사용하여 작업 표시.
            </li>
        </list>
        <procedure>
            <step>
                 <Path>src/main/kotlin/com/example/plugins</Path> 에 있는
                <Path>Templating.kt</Path>
                파일로 이동합니다.
            </step>
            <step>
                <p>
                    <code>configureTemplating()</code>
                    메서드 내에 다음 <code>post</code> 요청 라우트를 추가합니다:
                </p>
                [object Promise]
            </step>
            <step>
    <p>
        IntelliJ IDEA에서 다시 실행 버튼 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여 애플리케이션을 다시 시작합니다.
    </p>
            </step>
            <step>
                브라우저에서 <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a> 로 이동합니다.
            </step>
            <step>
                <p>
                     <control>작업 생성 또는 편집</control>
                    폼에 새 작업 세부 정보를 입력합니다.
                </p>
                <img src="server_create_web_app_new_task.png"
                     alt="HTML 폼을 표시하는 웹 브라우저" border-effect="rounded" width="706"/>
            </step>
            <step>
                <p> <control>제출</control>
                    버튼을 클릭하여 폼을 제출합니다.
                    그러면 모든 작업 목록에 새 작업이 표시됩니다:
                </p>
                <img src="server_create_web_app_new_task_added.png"
                     alt="작업 목록을 표시하는 웹 브라우저" border-effect="rounded" width="706"/>
            </step>
        </procedure>
</chapter>
<chapter title="다음 단계" id="next-steps">
        <p>
            축하합니다! 이제 웹 애플리케이션으로 Task Manager 재구축을 완료했으며 Thymeleaf 템플릿 활용 방법을 배웠습니다.</p>
        <p>
            콘텐츠를 보내고 받는 데 WebSockets의 기능을 활용하는 방법을 배우려면 <Links href="/ktor/server-create-websocket-application" summary="WebSockets의 기능을 활용하여 콘텐츠를 보내고 받는 방법을 알아보세요.">다음 튜토리얼</Links>로 계속 진행하세요.
        </p>
</chapter>
</topic>