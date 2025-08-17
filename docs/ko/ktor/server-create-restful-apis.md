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
        <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="라우팅은 서버 애플리케이션에서 수신 요청을 처리하기 위한 핵심 플러그인입니다.">라우팅</Links>,<Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">정적 콘텐츠</Links>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 두 가지 주요 목적을 가지고 있습니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화.">콘텐츠 협상</Links>, <a
            href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
    </p>
</tldr>
<card-summary>
    Ktor로 RESTful API를 빌드하는 방법을 알아보세요. 이 튜토리얼은 실제 예제를 통해 설정, 라우팅 및 테스트를 다룹니다.
</card-summary>
<web-summary>
    Ktor로 Kotlin RESTful API를 빌드하는 방법을 알아보세요. 이 튜토리얼은 실제 예제를 통해 설정, 라우팅 및 테스트를 다룹니다. Kotlin 백엔드 개발자를 위한 이상적인 초급 튜토리얼입니다.
</web-summary>
<link-summary>
    Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 알아보세요. JSON 파일을 생성하는 RESTful API의 예제를 제공합니다.
</link-summary>
<p>
    이 튜토리얼에서는 Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법과 JSON 파일을 생성하는 RESTful API의 예제를 설명합니다.
</p>
<p>
    <Links href="/ktor/server-requests-and-responses" summary="작업 관리 애플리케이션을 구축하여 Ktor와 함께 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배우세요.">이전 튜토리얼</Links>에서는
    유효성 검사, 오류 처리 및 단위 테스트의 기본 사항을 소개했습니다. 이 튜토리얼에서는 작업 관리를 위한 RESTful 서비스를 생성하여 이러한 주제를 확장할 것입니다.
</p>
<p>
    다음 내용을 학습하게 됩니다:
</p>
<list>
    <li>JSON 직렬화를 사용하는 RESTful 서비스를 생성합니다.</li>
    <li><Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 두 가지 주요 목적을 가지고 있습니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화.">콘텐츠 협상</Links> 프로세스를 이해합니다.</li>
    <li>Ktor 내에서 REST API를 위한 경로를 정의합니다.</li>
</list>
<chapter title="사전 준비 사항" id="prerequisites">
    <p>이 튜토리얼을 독립적으로 진행할 수 있지만,
        <Links href="/ktor/server-requests-and-responses" summary="작업 관리 애플리케이션을 구축하여 Ktor와 함께 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배우세요.">요청을 처리하고 응답을 생성하는</Links> 방법을 배우기 위해
        이전 튜토리얼을 완료하는 것을 강력히 권장합니다.
    </p>
    <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>를 설치하는 것을 권장하지만, 다른 원하는 IDE를 사용할 수도 있습니다.
    </p>
</chapter>
<chapter title="Hello RESTful 작업 관리자" id="hello-restful-task-manager">
    <p>이 튜토리얼에서는 기존 작업 관리자를 RESTful 서비스로 재작성할 것입니다. 이를 위해 여러 Ktor <Links href="/ktor/server-plugins" summary="플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 일반적인 기능을 제공합니다.">플러그인</Links>을 사용합니다.</p>
    <p>
        기존 프로젝트에 수동으로 추가할 수도 있지만, 새 프로젝트를 생성한 다음 이전 튜토리얼의 코드를 점진적으로 추가하는 것이 더 간단합니다. 코드를 진행하면서 모든 코드를 반복하므로 이전 프로젝트를 준비할 필요가 없습니다.
    </p>
    <procedure title="플러그인으로 새 프로젝트 생성">
        <step>
            <p>
                <a href="https://start.ktor.io/">Ktor 프로젝트 생성기</a>로 이동합니다.
            </p>
        </step>
        <step>
            <p>
                <control>Project artifact</control>
                필드에
                <Path>com.example.ktor-rest-task-app</Path>
                를 프로젝트 아티팩트 이름으로 입력합니다.
                <img src="tutorial_creating_restful_apis_project_artifact.png"
                     alt="Ktor 프로젝트 생성기에서 프로젝트 아티팩트 이름 지정"
                     style="block"
                     border-effect="line"
                     width="706"/>
            </p>
        </step>
        <step>
            <p>
                플러그인 섹션에서 다음 플러그인을 검색하고
                <control>Add</control>
                버튼을 클릭하여 추가합니다.
            </p>
            <list type="bullet">
                <li>Routing</li>
                <li>Content Negotiation</li>
                <li>Kotlinx.serialization</li>
                <li>Static Content</li>
            </list>
            <p>
                <img src="ktor_project_generator_add_plugins.gif" alt="Ktor 프로젝트 생성기에서 플러그인 추가"
                     border-effect="line"
                     style="block"
                     width="706"/>
                플러그인을 추가하면, 프로젝트 설정 아래에
                네 개의 플러그인 모두가 나열됩니다.
                <img src="tutorial_creating_restful_apis_plugins_list.png"
                     alt="Ktor 프로젝트 생성기의 플러그인 목록"
                     border-effect="line"
                     style="block"
                     width="706"/>
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
            <p><a href="server-create-a-new-project.topic#open-explore-run">IntelliJ IDEA에서 Ktor 프로젝트 열기, 탐색 및 실행</a> 튜토리얼에서 설명한 대로 IntelliJ IDEA에서 프로젝트를 엽니다.</p>
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
                파일을 열고 우선순위를 나타내는 <code>enum</code>과 작업을 나타내는 <code>class</code>를 추가합니다.
            </p>
            <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.serialization.Serializable&#10;&#10;enum class Priority {&#10;    Low, Medium, High, Vital&#10;}&#10;&#10;@Serializable&#10;data class Task(&#10;    val name: String,&#10;    val description: String,&#10;    val priority: Priority&#10;)"/>
            <p>
                이전 튜토리얼에서는 확장 함수를 사용하여 <code>Task</code>를 HTML로 변환했습니다. 이 경우,
                <code>Task</code> 클래스는 <code>kotlinx.serialization</code> 라이브러리의
                <a href="https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"><code>Serializable</code></a>
                타입으로 어노테이션되어 있습니다.
            </p>
        </step>
        <step>
            <p>
                <Path>Routing.kt</Path>
                파일을 열고 기존 코드를 아래 구현으로 바꿉니다.
            </p>
            <code-block lang="kotlin" code="                    package com.example&#10;&#10;                    import com.example.model.*&#10;                    import io.ktor.server.application.*&#10;                    import io.ktor.server.http.content.*&#10;                    import io.ktor.server.response.*&#10;                    import io.ktor.server.routing.*&#10;&#10;                    fun Application.configureRouting() {&#10;                        routing {&#10;                            staticResources(&quot;static&quot;, &quot;static&quot;)&#10;&#10;                            get(&quot;/tasks&quot;) {&#10;                                call.respond(&#10;                                    listOf(&#10;                                        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;                                        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;                                        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;                                        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;                                    )&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                이전 튜토리얼과 유사하게, <code>/tasks</code> URL에 대한 GET 요청 경로를 생성했습니다.
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
                브라우저에서 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 이동합니다. 아래와 같이 작업 목록의 JSON 버전을 볼 수 있습니다.
            </p>
        </step>
        <img src="tutorial_creating_restful_apis_starter_code_preview.png"
             alt="브라우저 화면에 표시된 JSON 데이터"
             border-effect="rounded"
             width="706"/>
        <p>확실히 많은 작업이 우리를 대신하여 수행되고 있습니다. 정확히 무슨 일이 일어나고 있는 걸까요?</p>
    </procedure>
</chapter>
<chapter title="콘텐츠 협상 이해하기" id="content-negotiation">
    <chapter title="브라우저를 통한 콘텐츠 협상" id="via-browser">
        <p>
            프로젝트를 생성할 때 <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 두 가지 주요 목적을 가지고 있습니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화.">Content Negotiation</Links>
            플러그인을 포함했습니다. 이 플러그인은 클라이언트가 렌더링할 수 있는 콘텐츠 타입을 현재
            서비스가 제공할 수 있는 콘텐츠 타입과 비교하여 일치시킵니다. 따라서
            <format style="italic">콘텐츠 협상</format>이라는 용어가 사용됩니다.
        </p>
        <p>
            HTTP에서 클라이언트는 <code>Accept</code> 헤더를 통해 렌더링할 수 있는 콘텐츠 타입을 신호합니다. 이 헤더의 값은 하나 이상의 콘텐츠 타입입니다. 위 경우에는 브라우저에 내장된 개발 도구를 사용하여 이 헤더의 값을 검사할 수 있습니다.
        </p>
        <p>
            다음 예시를 고려해 보세요:
        </p>
        <code-block code="                text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"/>
        <p><code>*/*</code>의 포함에 주목하세요. 이 헤더는 HTML, XML 또는 이미지를 허용하지만,
            다른 어떤 콘텐츠 타입도 허용함을 의미합니다.</p>
        <p>콘텐츠 협상 플러그인은 데이터를 브라우저로 다시 보내기 위한 형식을 찾아야 합니다. 프로젝트에 생성된 코드를 살펴보면
            <Path>src/main/kotlin/com/example</Path>
            안에
            <Path>Serialization.kt</Path>
            라는 파일이 있으며, 여기에는 다음 내용이 포함되어 있습니다.
        </p>
        <code-block lang="kotlin" code="    install(ContentNegotiation) {&#10;        json()&#10;    }"/>
        <p>
            이 코드는 <code>ContentNegotiation</code> 플러그인을 설치하고 <code>kotlinx.serialization</code>
            플러그인도 구성합니다. 이렇게 하면 클라이언트가 요청을 보낼 때 서버는 JSON으로 직렬화된 객체를 다시 보낼 수 있습니다.
        </p>
        <p>
            브라우저에서 온 요청의 경우, <code>ContentNegotiation</code> 플러그인은 JSON만 반환할 수 있다는 것을 알고 있으며, 브라우저는 전송된 모든 것을 표시하려고 시도할 것입니다. 따라서 요청이 성공합니다.
        </p>
    </chapter>
    <procedure title="JavaScript를 통한 콘텐츠 협상" id="via-javascript">
        <p>
            프로덕션 환경에서는 JSON을 브라우저에 직접 표시하고 싶지 않을 것입니다. 대신 브라우저 내에서 JavaScript 코드가 실행되어 요청을 만들고 단일 페이지 애플리케이션(SPA)의 일부로 반환된 데이터를 표시합니다. 일반적으로 이러한 종류의 애플리케이션은 <a href="https://react.dev/">React</a>,
            <a href="https://angular.io/">Angular</a>,
            또는 <a href="https://vuejs.org/">Vue.js</a>와 같은 프레임워크를 사용하여 작성됩니다.
        </p>
        <step>
            <p>
                이를 시뮬레이션하기 위해,
                <Path>src/main/resources/static</Path>
                안에 있는
                <Path>index.html</Path>
                페이지를 열고 기본 내용을 다음으로 바꿉니다.
            </p>
            <code-block lang="html" code="&lt;html&gt;&#10;&lt;head&gt;&#10;    &lt;title&gt;A Simple SPA For Tasks&lt;/title&gt;&#10;    &lt;script type=&quot;application/javascript&quot;&gt;&#10;        function fetchAndDisplayTasks() {&#10;            fetchTasks()&#10;                .then(tasks =&gt; displayTasks(tasks))&#10;        }&#10;&#10;        function fetchTasks() {&#10;            return fetch(&#10;                &quot;/tasks&quot;,&#10;                {&#10;                    headers: { 'Accept': 'application/json' }&#10;                }&#10;            ).then(resp =&gt; resp.json());&#10;        }&#10;&#10;        function displayTasks(tasks) {&#10;            const tasksTableBody = document.getElementById(&quot;tasksTableBody&quot;)&#10;            tasks.forEach(task =&gt; {&#10;                const newRow = taskRow(task);&#10;                tasksTableBody.appendChild(newRow);&#10;            });&#10;        }&#10;&#10;        function taskRow(task) {&#10;            return tr([&#10;                td(task.name),&#10;                td(task.description),&#10;                td(task.priority)&#10;            ]);&#10;        }&#10;&#10;        function tr(children) {&#10;            const node = document.createElement(&quot;tr&quot;);&#10;            children.forEach(child =&gt; node.appendChild(child));&#10;            return node;&#10;        }&#10;&#10;        function td(text) {&#10;            const node = document.createElement(&quot;td&quot;);&#10;            node.appendChild(document.createTextNode(text));&#10;            return node;&#10;        }&#10;    &lt;/script&gt;&#10;&lt;/head&gt;&#10;&lt;body&gt;&#10;&lt;h1&gt;Viewing Tasks Via JS&lt;/h1&gt;&#10;&lt;form action=&quot;javascript:fetchAndDisplayTasks()&quot;&gt;&#10;    &lt;input type=&quot;submit&quot; value=&quot;View The Tasks&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;table&gt;&#10;    &lt;thead&gt;&#10;    &lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;Priority&lt;/th&gt;&lt;/tr&gt;&#10;    &lt;/thead&gt;&#10;    &lt;tbody id=&quot;tasksTableBody&quot;&gt;&#10;    &lt;/tbody&gt;&#10;&lt;/table&gt;&#10;&lt;/body&gt;&#10;&lt;/html&gt;"/>
            <p>
                이 페이지에는 HTML 폼과 비어 있는 테이블이 있습니다. 폼을 제출하면 JavaScript 이벤트 핸들러가
                <code>/tasks</code> 엔드포인트로 <code>Accept</code> 헤더를
                <code>application/json</code>으로 설정하여 요청을 보냅니다. 반환된 데이터는 역직렬화되어 HTML 테이블에 추가됩니다.
            </p>
        </step>
        <step>
            <p>
                IntelliJ IDEA에서 다시 실행 버튼(<img src="intellij_idea_rerun_icon.svg"
                                                     style="inline" height="16" width="16"
                                                     alt="IntelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여
                애플리케이션을 재시작합니다.
            </p>
        </step>
        <step>
            <p>
                URL <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>로 이동합니다.
                <control>View The Tasks</control>
                버튼을 클릭하여 데이터를 가져올 수 있어야 합니다.
            </p>
            <img src="tutorial_creating_restful_apis_tasks_via_js.png"
                 alt="버튼과 HTML 테이블로 표시된 작업을 보여주는 브라우저 창"
                 border-effect="line"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="GET 경로 추가" id="porting-get-routes">
    <p>
        이제 콘텐츠 협상 프로세스에 익숙해졌으므로,
        <Links href="/ktor/server-requests-and-responses" summary="작업 관리 애플리케이션을 구축하여 Ktor와 함께 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배우세요.">이전 튜토리얼</Links>의
        기능을 이 튜토리얼로 이전하는 것을 계속 진행하겠습니다.
    </p>
    <chapter title="작업 리포지토리 재사용" id="task-repository">
        <p>
            작업을 위한 리포지토리는 수정 없이 재사용할 수 있으므로 먼저 그렇게 하겠습니다.
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
                    를 열고 아래 코드를 추가합니다.
                </p>
                <code-block lang="kotlin" code="package com.example.model&#10;&#10;object TaskRepository {&#10;    private val tasks = mutableListOf(&#10;        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;    )&#10;&#10;    fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;    fun tasksByPriority(priority: Priority) = tasks.filter {&#10;        it.priority == priority&#10;    }&#10;&#10;    fun taskByName(name: String) = tasks.find {&#10;        it.name.equals(name, ignoreCase = true)&#10;    }&#10;&#10;    fun addTask(task: Task) {&#10;        if (taskByName(task.name) != null) {&#10;            throw IllegalStateException(&quot;Cannot duplicate task names!&quot;)&#10;        }&#10;        tasks.add(task)&#10;    }&#10;}"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="GET 요청 경로 재사용" id="get-requests">
        <p>
            이제 리포지토리를 생성했으므로 GET 요청에 대한 경로를 구현할 수 있습니다. 이전 코드는 작업을 HTML로 변환하는 것에 대해 더 이상 걱정할 필요가 없으므로 간단해질 수 있습니다.
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example</Path>
                    의
                    <Path>Routing.kt</Path>
                    파일로 이동합니다.
                </p>
            </step>
            <step>
                <p>
                    <code>Application.configureRouting()</code> 함수 내의 <code>/tasks</code> 경로에 대한 코드를 다음 구현으로 업데이트합니다.
                </p>
                <code-block lang="kotlin" code="                    package com.example&#10;&#10;                    import com.example.model.Priority&#10;                    import com.example.model.TaskRepository&#10;                    import io.ktor.http.*&#10;                    import io.ktor.server.application.*&#10;                    import io.ktor.server.http.content.*&#10;                    import io.ktor.server.response.*&#10;                    import io.ktor.server.routing.*&#10;&#10;                    fun Application.configureRouting() {&#10;                        routing {&#10;                            staticResources(&quot;static&quot;, &quot;static&quot;)&#10;&#10;                            //updated implementation&#10;                            route(&quot;/tasks&quot;) {&#10;                                get {&#10;                                    val tasks = TaskRepository.allTasks()&#10;                                    call.respond(tasks)&#10;                                }&#10;&#10;                                get(&quot;/byName/{taskName}&quot;) {&#10;                                    val name = call.parameters[&quot;taskName&quot;]&#10;                                    if (name == null) {&#10;                                        call.respond(HttpStatusCode.BadRequest)&#10;                                        return@get&#10;                                    }&#10;&#10;                                    val task = TaskRepository.taskByName(name)&#10;                                    if (task == null) {&#10;                                        call.respond(HttpStatusCode.NotFound)&#10;                                        return@get&#10;                                    }&#10;                                    call.respond(task)&#10;                                }&#10;                                get(&quot;/byPriority/{priority}&quot;) {&#10;                                    val priorityAsText = call.parameters[&quot;priority&quot;]&#10;                                    if (priorityAsText == null) {&#10;                                        call.respond(HttpStatusCode.BadRequest)&#10;                                        return@get&#10;                                    }&#10;                                    try {&#10;                                        val priority = Priority.valueOf(priorityAsText)&#10;                                        val tasks = TaskRepository.tasksByPriority(priority)&#10;&#10;                                        if (tasks.isEmpty()) {&#10;                                            call.respond(HttpStatusCode.NotFound)&#10;                                            return@get&#10;                                        }&#10;                                        call.respond(tasks)&#10;                                    } catch (ex: IllegalArgumentException) {&#10;                                        call.respond(HttpStatusCode.BadRequest)&#10;                                    }&#10;                                }&#10;                            }&#10;                        }&#10;                    }"/>
                    <p>
                        이를 통해 서버는 다음 GET 요청에 응답할 수 있습니다.
                    </p>
                    <list>
                        <li><code>/tasks</code>는 리포지토리의 모든 작업을 반환합니다.</li>
                        <li><code>/tasks/byName/{taskName}</code>은 지정된
                            <code>taskName</code>으로 필터링된 작업을 반환합니다.
                        </li>
                        <li><code>/tasks/byPriority/{priority}</code>는 지정된
                            <code>priority</code>로 필터링된 작업을 반환합니다.
                        </li>
                    </list>
                </step>
                <step>
                    <p>
                        IntelliJ IDEA에서 다시 실행 버튼(<img src="intellij_idea_rerun_icon.svg"
                                                               style="inline" height="16" width="16"
                                                               alt="IntelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여
                        애플리케이션을 재시작합니다.
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="기능 테스트" id="test-tasks-routes">
            <procedure title="브라우저 사용">
                <p>브라우저에서 이 경로들을 테스트할 수 있습니다. 예를 들어, <a
                        href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>으로
                    이동하여 <code>Medium</code> 우선순위를 가진 모든 작업이 JSON 형식으로 표시되는 것을 확인하세요.</p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority.png"
                     alt="중간 우선순위를 가진 작업이 JSON 형식으로 표시된 브라우저 창"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    이러한 종류의 요청은 일반적으로 JavaScript에서 오기 때문에,
                    더 세밀한 테스트가 선호됩니다. 이를 위해 <a
                        href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>과
                    같은 전문 도구를 사용할 수 있습니다.
                </p>
            </procedure>
            <procedure title="Postman 사용">
                <step>
                    <p>Postman에서 URL <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>으로 새 GET 요청을 생성합니다.</p>
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
                    <p><control>Send</control>
                        를 클릭하여 요청을 보내고 응답 뷰어에서 응답을 확인합니다.
                    </p>
                    <img src="tutorial_creating_restful_apis_tasks_medium_priority_postman.png"
                         alt="중간 우선순위를 가진 작업이 JSON 형식으로 표시된 Postman의 GET 요청"
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
                        파일을 열고 다음 GET 요청을 추가합니다.
                    </p>
                    <code-block lang="http" code="GET http://0.0.0.0:8080/tasks/byPriority/Medium&#10;Accept: application/json"/>
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
                    <p>이것은
                        <Path>Services</Path>
                        도구 창에서 열리고 실행될 것입니다.
                    </p>
                    <img src="tutorial_creating_restful_apis_tasks_medium_priority_http_file.png"
                         alt="중간 우선순위를 가진 작업이 JSON 형식으로 표시된 HTTP 파일의 GET 요청"
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
            이전 튜토리얼에서는 HTML 폼을 통해 작업을 생성했습니다. 그러나 이제 RESTful 서비스를 구축하고 있으므로 더 이상 그럴 필요가 없습니다. 대신, 대부분의 작업을 수행할 <code>kotlinx.serialization</code>
            프레임워크를 사용할 것입니다.
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
                    <code>Application.configureRouting()</code> 함수에 새 POST 경로를 다음과 같이 추가합니다.
                </p>
                <code-block lang="kotlin" code="                    //...&#10;&#10;                    fun Application.configureRouting() {&#10;                        routing {&#10;                            //...&#10;&#10;                            route(&quot;/tasks&quot;) {&#10;                                //...&#10;&#10;                                //add the following new route&#10;                                post {&#10;                                    try {&#10;                                        val task = call.receive&lt;Task&gt;()&#10;                                        TaskRepository.addTask(task)&#10;                                        call.respond(HttpStatusCode.Created)&#10;                                    } catch (ex: IllegalStateException) {&#10;                                        call.respond(HttpStatusCode.BadRequest)&#10;                                    } catch (ex: SerializationException) {&#10;                                        call.respond(HttpStatusCode.BadRequest)&#10;                                    }&#10;                                }&#10;                            }&#10;                        }&#10;                    }"/>
                <p>
                    다음 새 임포트를 추가합니다.
                </p>
                <code-block lang="kotlin" code="                    //...&#10;                    import com.example.model.Task&#10;                    import io.ktor.serialization.*&#10;                    import io.ktor.server.request.*"/>
                <p>
                    POST 요청이 <code>/tasks</code>로 전송될 때 <code>kotlinx.serialization</code> 프레임워크는 요청 본문을 <code>Task</code> 객체로 변환하는 데 사용됩니다. 이 작업이 성공하면 태스크가 리포지토리에 추가됩니다. 역직렬화 프로세스가 실패하면 서버는 <code>SerializationException</code>을 처리해야 하며, 작업이 중복인 경우 <code>IllegalStateException</code>을 처리해야 합니다.
                </p>
            </step>
            <step>
                <p>
                    애플리케이션을 재시작합니다.
                </p>
            </step>
            <step>
                <p>
                    이 기능을 Postman에서 테스트하려면 URL <code>http://0.0.0.0:8080/tasks</code>로 새 POST 요청을 생성합니다.
                </p>
            </step>
            <step>
                <p>
                    <ui-path>Body</ui-path>
                    창에 새 작업을 나타내는 다음 JSON 문서를 추가합니다.
                </p>
                <code-block lang="json" code="{&#10;    &quot;name&quot;: &quot;cooking&quot;,&#10;    &quot;description&quot;: &quot;Cook the dinner&quot;,&#10;    &quot;priority&quot;: &quot;High&quot;&#10;}"/>
                <img src="tutorial_creating_restful_apis_add_task.png"
                     alt="새 작업을 추가하기 위한 Postman의 POST 요청"
                     border-effect="line"
                     width="706"/>
            </step>
            <step>
                <p><control>Send</control>
                    를 클릭하여 요청을 보냅니다.
                </p>
            </step>
            <step>
                <p>
                    <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 GET 요청을
                    보내 작업을 추가했는지 확인할 수 있습니다.
                </p>
            </step>
            <step>
                <p>
                    IntelliJ IDEA Ultimate 내에서 HTTP 요청 파일에 다음을 추가하여 동일한 단계를 수행할 수 있습니다.
                </p>
                <code-block lang="http" code="###&#10;&#10;POST http://0.0.0.0:8080/tasks&#10;Content-Type: application/json&#10;&#10;{&#10;    &quot;name&quot;: &quot;cooking&quot;,&#10;    &quot;description&quot;: &quot;Cook the dinner&quot;,&#10;    &quot;priority&quot;: &quot;High&quot;&#10;}"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="삭제 지원 추가" id="remove-tasks">
        <p>
            서비스에 기본 작업을 거의 다 추가했습니다. 이들은 종종 CRUD 작업(Create, Read, Update, Delete의 약자)으로 요약됩니다. 이제 삭제 작업을 구현할 것입니다.
        </p>
        <procedure>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>
                    파일에 <code>TaskRepository</code> 객체 내부에 이름으로 작업을 제거하는 다음 메서드를 추가합니다.
                </p>
                <code-block lang="kotlin" code="    fun removeTask(name: String): Boolean {&#10;        return tasks.removeIf { it.name == name }&#10;    }"/>
            </step>
            <step>
                <p>
                    <Path>Routing.kt</Path>
                    파일을 열고 <code>routing()</code> 함수에 DELETE 요청을 처리하는 엔드포인트를 추가합니다.
                </p>
                <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        //...&#10;&#10;                        routing {&#10;                            route(&quot;/tasks&quot;) {&#10;                                //...&#10;                                //add the following function&#10;                                delete(&quot;/{taskName}&quot;) {&#10;                                    val name = call.parameters[&quot;taskName&quot;]&#10;                                    if (name == null) {&#10;                                        call.respond(HttpStatusCode.BadRequest)&#10;                                        return@delete&#10;                                    }&#10;&#10;                                    if (TaskRepository.removeTask(name)) {&#10;                                        call.respond(HttpStatusCode.NoContent)&#10;                                    } else {&#10;                                        call.respond(HttpStatusCode.NotFound)&#10;                                    }&#10;                                }&#10;                            }&#10;                        }&#10;                    }"/>
            </step>
            <step>
                <p>
                    애플리케이션을 재시작합니다.
                </p>
            </step>
            <step>
                <p>
                    HTTP 요청 파일에 다음 DELETE 요청을 추가합니다.
                </p>
                <code-block lang="http" code="###&#10;&#10;DELETE http://0.0.0.0:8080/tasks/gardening"/>
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
                <p>
                    <Path>Services</Path>
                    도구 창에서 응답을 확인할 수 있습니다.
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
            지금까지 애플리케이션을 수동으로 테스트했지만, 이미 알다시피 이 방법은 시간이 많이 걸리고 확장성이 없습니다. 대신 내장된
            <code>client</code> 객체를 사용하여 JSON을 가져오고 역직렬화하는 <Links href="/ktor/server-testing" summary="특수 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요.">JUnit 테스트</Links>를 구현할 수 있습니다.
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/test/kotlin/com/example</Path>
                    내의
                    <Path>ApplicationTest.kt</Path>
                    파일을 엽니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>ApplicationTest.kt</Path>
                    파일의 내용을 다음으로 바꿉니다.
                </p>
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.Priority&#10;import com.example.model.Task&#10;import io.ktor.client.call.*&#10;import io.ktor.client.plugins.contentnegotiation.*&#10;import io.ktor.client.request.*&#10;import io.ktor.http.*&#10;import io.ktor.serialization.kotlinx.json.*&#10;import io.ktor.server.testing.*&#10;import kotlin.test.*&#10;&#10;class ApplicationTest {&#10;    @Test&#10;    fun tasksCanBeFoundByPriority() = testApplication {&#10;        application {&#10;            module()&#10;        }&#10;        val client = createClient {&#10;            install(ContentNegotiation) {&#10;                json()&#10;            }&#10;        }&#10;&#10;        val response = client.get(&quot;/tasks/byPriority/Medium&quot;)&#10;        val results = response.body&lt;List&lt;Task&gt;&gt;()&#10;&#10;        assertEquals(HttpStatusCode.OK, response.status)&#10;&#10;        val expectedTaskNames = listOf(&quot;gardening&quot;, &quot;painting&quot;)&#10;        val actualTaskNames = results.map(Task::name)&#10;        assertContentEquals(expectedTaskNames, actualTaskNames)&#10;    }&#10;&#10;    @Test&#10;    fun invalidPriorityProduces400() = testApplication {&#10;        application {&#10;            module()&#10;        }&#10;        val response = client.get(&quot;/tasks/byPriority/Invalid&quot;)&#10;        assertEquals(HttpStatusCode.BadRequest, response.status)&#10;    }&#10;&#10;&#10;    @Test&#10;    fun unusedPriorityProduces404() = testApplication {&#10;        application {&#10;            module()&#10;        }&#10;        val response = client.get(&quot;/tasks/byPriority/Vital&quot;)&#10;        assertEquals(HttpStatusCode.NotFound, response.status)&#10;    }&#10;&#10;    @Test&#10;    fun newTasksCanBeAdded() = testApplication {&#10;        application {&#10;            module()&#10;        }&#10;        val client = createClient {&#10;            install(ContentNegotiation) {&#10;                json()&#10;            }&#10;        }&#10;&#10;        val task = Task(&quot;swimming&quot;, &quot;Go to the beach&quot;, Priority.Low)&#10;        val response1 = client.post(&quot;/tasks&quot;) {&#10;            header(&#10;                HttpHeaders.ContentType,&#10;                ContentType.Application.Json&#10;            )&#10;&#10;            setBody(task)&#10;        }&#10;        assertEquals(HttpStatusCode.Created, response1.status)&#10;&#10;        val response2 = client.get(&quot;/tasks&quot;)&#10;        assertEquals(HttpStatusCode.OK, response2.status)&#10;&#10;        val taskNames = response2&#10;            .body&lt;List&lt;Task&gt;&gt;()&#10;            .map { it.name }&#10;&#10;        assertContains(taskNames, &quot;swimming&quot;)&#10;    }&#10;}"/>
                <p>
                    서버에서와 동일하게 <a href="client-create-and-configure.md#plugins">플러그인</a>에 <code>ContentNegotiation</code> 및
                    <code>kotlinx.serialization</code> 플러그인을 설치해야 합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>gradle/libs.versions.toml</Path>에 있는 버전 카탈로그에 다음 의존성을 추가합니다.
                </p>
                <code-block lang="yaml" code="                    [libraries]&#10;                    # ...&#10;                    ktor-client-content-negotiation = { module = &quot;io.ktor:ktor-client-content-negotiation&quot;, version.ref = &quot;ktor-version&quot; }"/>
            </step>
            <step>
                <p>
                    새 의존성을
                    <Path>build.gradle.kts</Path>
                    파일에 추가합니다.
                </p>
                <code-block lang="kotlin" code="                    testImplementation(libs.ktor.client.content.negotiation)"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="JsonPath를 사용한 단위 테스트 생성" id="unit-tests-via-jsonpath">
        <p>
            Ktor 클라이언트 또는 유사한 라이브러리를 사용하여 서비스를 테스트하는 것은 편리하지만, 품질 보증(QA) 관점에서 단점이 있습니다. JSON을 직접 처리하지 않는 서버는 JSON 구조에 대한 가정을 확신할 수 없습니다.
        </p>
        <p>
            예를 들어, 다음과 같은 가정입니다.
        </p>
        <list>
            <li>값이 실제로는 <code>object</code>인데 <code>array</code>에 저장되는 경우.</li>
            <li>속성이 실제로는 <code>string</code>인데 <code>number</code>로 저장되는 경우.</li>
            <li>멤버가 선언 순서대로 직렬화되지 않는 경우.</li>
        </list>
        <p>
            서비스가 여러 클라이언트에서 사용될 예정이라면, JSON 구조에 대한 확신을 갖는 것이 중요합니다. 이를 위해 Ktor 클라이언트를 사용하여 서버에서 텍스트를 검색한 다음 <a href="https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path">JSONPath</a>
            라이브러리를 사용하여 이 콘텐츠를 분석합니다.</p>
        <procedure>
            <step>
                <p>
                    <Path>build.gradle.kts</Path>
                    파일의 <code>dependencies</code> 블록에 JSONPath 라이브러리를 추가합니다.
                </p>
                <code-block lang="kotlin" code="    testImplementation(&quot;com.jayway.jsonpath:json-path:2.9.0&quot;)"/>
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
                    파일을 열고 다음 내용을 추가합니다.
                </p>
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.jayway.jsonpath.DocumentContext&#10;import com.jayway.jsonpath.JsonPath&#10;import io.ktor.client.*&#10;import com.example.model.Priority&#10;import io.ktor.client.request.*&#10;import io.ktor.client.statement.*&#10;import io.ktor.http.*&#10;import io.ktor.server.testing.*&#10;import kotlin.test.*&#10;&#10;&#10;class ApplicationJsonPathTest {&#10;    @Test&#10;    fun tasksCanBeFound() = testApplication {&#10;        application {&#10;            module()&#10;        }&#10;        val jsonDoc = client.getAsJsonPath(&quot;/tasks&quot;)&#10;&#10;        val result: List&lt;String&gt; = jsonDoc.read(&quot;$[*].name&quot;)&#10;        assertEquals(&quot;cleaning&quot;, result[0])&#10;        assertEquals(&quot;gardening&quot;, result[1])&#10;        assertEquals(&quot;shopping&quot;, result[2])&#10;    }&#10;&#10;    @Test&#10;    fun tasksCanBeFoundByPriority() = testApplication {&#10;        application {&#10;            module()&#10;        }&#10;        val priority = Priority.Medium&#10;        val jsonDoc = client.getAsJsonPath(&quot;/tasks/byPriority/$priority&quot;)&#10;&#10;        val result: List&lt;String&gt; =&#10;            jsonDoc.read(&quot;$[?(@.priority == '$priority')].name&quot;)&#10;        assertEquals(2, result.size)&#10;&#10;        assertEquals(&quot;gardening&quot;, result[0])&#10;        assertEquals(&quot;painting&quot;, result[1])&#10;    }&#10;&#10;    suspend fun HttpClient.getAsJsonPath(url: String): DocumentContext {&#10;        val response = this.get(url) {&#10;            accept(ContentType.Application.Json)&#10;        }&#10;        return JsonPath.parse(response.bodyAsText())&#10;    }&#10;}"/>
                <p>
                    JsonPath 쿼리는 다음과 같이 작동합니다.
                </p>
                <list>
                    <li>
                        <code>$[*].name</code>은 "문서를 배열로 처리하고 각 항목의 이름 속성 값을 반환하라"는 의미입니다.
                    </li>
                    <li>
                        <code>$[?(@.priority == '$priority')].name</code>은 "배열에서 주어진 값과 우선순위가 같은 모든 항목의 이름 속성 값을 반환하라"는 의미입니다.
                    </li>
                </list>
                <p>
                    이러한 쿼리를 사용하여 반환된 JSON에 대한 이해를 확인할 수 있습니다. 코드를 리팩터링하고 서비스를 재배포할 때, 현재 프레임워크와의 역직렬화를 방해하지 않더라도 직렬화의 모든 변경 사항이 식별됩니다. 이를 통해 공개적으로 사용 가능한 API를 확신을 가지고 다시 게시할 수 있습니다.
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="다음 단계" id="next-steps">
        <p>
            축하합니다! 이제 작업 관리자 애플리케이션을 위한 RESTful API 서비스 생성을 완료했으며 Ktor 클라이언트 및 JsonPath를 사용한 단위 테스트의 모든 세부 사항을 학습했습니다.
        </p>
        <p>
            <Links href="/ktor/server-create-website" summary="Kotlin과 Ktor 및 Thymeleaf 템플릿으로 웹사이트를 구축하는 방법을 알아보세요.">다음 튜토리얼</Links>로 이동하여 API 서비스를 재사용하여 웹 애플리케이션을 구축하는 방법을 알아보세요.
        </p>
    </chapter>
</topic>