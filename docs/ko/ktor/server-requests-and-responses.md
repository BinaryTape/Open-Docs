<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Ktor와 Kotlin을 사용하여 HTTP 요청을 처리하고 응답 생성" id="server-requests-and-responses">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-routing-and-requests"/>
    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    <p>
        <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="Routing is a core plugin for handling incoming requests in a server application.">라우팅</Links>
    </p>
</tldr>
<link-summary>
    Ktor와 Kotlin으로 태스크 관리 애플리케이션을 구축하여 라우팅, 요청 처리 및 파라미터의 기본 사항을 학습합니다.
</link-summary>
<card-summary>
    태스크 관리 애플리케이션을 생성하여 Ktor에서 라우팅과 요청이 어떻게 작동하는지 알아봅니다.
</card-summary>
<web-summary>
    Kotlin과 Ktor로 생성된 서비스에 대한 유효성 검사, 오류 처리 및 단위 테스트의 기본 사항을 학습합니다.
</web-summary>
<p>
    이 튜토리얼에서는 Ktor와 Kotlin으로 태스크 관리 애플리케이션을 구축하여 라우팅, 요청 처리 및 파라미터의 기본 사항을 학습합니다.
</p>
<p>
    이 튜토리얼을 마치면 다음을 수행하는 방법을 알게 됩니다.
</p>
<list type="bullet">
    <li>GET 및 POST 요청을 처리합니다.</li>
    <li>요청에서 정보를 추출합니다.</li>
    <li>데이터 변환 시 오류를 처리합니다.</li>
    <li>단위 테스트를 사용하여 라우팅의 유효성을 검사합니다.</li>
</list>
<chapter title="사전 요구 사항" id="prerequisites">
    <p>
        이 튜토리얼은 Ktor 서버 시작하기 가이드의 두 번째 튜토리얼입니다. 이 튜토리얼을 독립적으로 수행할 수 있지만, 선행 튜토리얼을 완료하여 <Links href="/ktor/server-create-a-new-project" summary="Learn how to open, run and test a server application with Ktor.">새 Ktor 프로젝트를 생성, 열기 및 실행</Links>하는 방법을 배우는 것을 강력히 권장합니다.
    </p>
    <p>HTTP 요청 유형, 헤더 및 상태 코드에 대한 기본적인 이해가 있는 것도 매우 유용합니다.</p>
    <p>IntelliJ IDEA 설치를 권장하지만, 원하는 다른 IDE를 사용할 수도 있습니다.
    </p>
</chapter>
<chapter title="태스크 관리 애플리케이션" id="sample-application">
    <p>이 튜토리얼에서는 다음 기능을 갖춘 태스크 관리 애플리케이션을 점진적으로 구축할 것입니다.</p>
    <list type="bullet">
        <li>사용 가능한 모든 태스크를 HTML 테이블로 봅니다.</li>
        <li>우선순위 및 이름별로 태스크를 HTML로 다시 봅니다.</li>
        <li>HTML 폼을 제출하여 추가 태스크를 추가합니다.</li>
    </list>
    <p>
        기본 기능을 작동시키기 위해 최소한의 작업을 수행한 다음, 7번의 반복을 통해 이 기능을 개선하고 확장할 것입니다. 이 최소 기능은 일부 모델 유형, 값 목록 및 단일 경로를 포함하는 프로젝트로 구성됩니다.
    </p>
</chapter>
<chapter title="정적 HTML 콘텐츠 표시" id="display-static-html">
    <p>첫 번째 반복에서는 정적 HTML 콘텐츠를 반환하는 새 경로를 애플리케이션에 추가합니다.</p>
    <p><a href="https://start.ktor.io">Ktor 프로젝트 생성기</a>를 사용하여 <control>ktor-task-app</control>이라는 새 프로젝트를 생성합니다. 모든 기본 옵션을 수락할 수 있지만, <control>artifact</control> 이름을 변경하고 싶을 수도 있습니다.
    </p>
    <tip>
        새 프로젝트 생성에 대한 자세한 내용은 <Links href="/ktor/server-create-a-new-project" summary="Learn how to open, run and test a server application with Ktor.">새 Ktor 프로젝트 생성, 열기 및 실행</Links>을 참조하세요. 최근에 해당 튜토리얼을 완료했다면, 거기서 생성된 프로젝트를 자유롭게 재사용해도 좋습니다.
    </tip>
    <procedure>
        <step>
            <Path>src/main/kotlin/com/example/plugins</Path> 폴더 내의
            <Path>Routing.kt</Path> 파일을 엽니다.
        </step>
        <step>
            <p>기존 <code>Application.configureRouting()</code> 함수를 아래 구현으로 바꿉니다.</p>
            <code-block lang="kotlin" code="                        fun Application.configureRouting() {&#10;                            routing {&#10;                                get(&quot;/tasks&quot;) {&#10;                                    call.respondText(&#10;                                        contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                            text = &quot;&quot;&quot;&#10;                                        &lt;h3&gt;TODO:&lt;/h3&gt;&#10;                                        &lt;ol&gt;&#10;                                            &lt;li&gt;A table of all the tasks&lt;/li&gt;&#10;                                            &lt;li&gt;A form to submit new tasks&lt;/li&gt;&#10;                                        &lt;/ol&gt;&#10;                                        &quot;&quot;&quot;.trimIndent()&#10;                                    )&#10;                                }&#10;                            }&#10;                        }"/>
            <p>이로써 URL <code>/tasks</code> 및 GET 요청 유형에 대한 새 경로를 생성했습니다. GET 요청은 HTTP에서 가장 기본적인 요청 유형입니다. 사용자가 브라우저 주소 표시줄에 입력하거나 일반 HTML 링크를 클릭할 때 트리거됩니다. </p>
            <p>
                현재는 정적 콘텐츠만 반환하고 있습니다. 클라이언트에 HTML을 보낼 것임을 알리기 위해 HTTP Content Type 헤더를 <code>"text/html"</code>로 설정합니다.
            </p>
        </step>
        <step>
            <p>
                <code>ContentType</code> 객체에 접근하기 위해 다음 임포트를 추가합니다.
            </p>
            <code-block lang="kotlin" code="                    import io.ktor.http.ContentType"/>
        </step>
        <step>
            <p>IntelliJ IDEA에서
                <Path>Application.kt</Path> 파일의
                <code>main()</code> 함수 옆에 있는 실행 거터 아이콘 (<img alt="IntelliJ IDEA 애플리케이션 실행 아이콘"
                                                                    src="intellij_idea_gutter_icon.svg" height="16"
                                                                    width="16"/>)을 클릭하여 애플리케이션을 시작합니다.
            </p>
        </step>
        <step>
            <p>
                브라우저에서 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 이동합니다. 할 일 목록이 표시되어야 합니다.
            </p>
            <img src="tutorial_routing_and_requests_implementation_1.png"
                 alt="두 개의 항목이 있는 할 일 목록을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="태스크 모델 구현" id="implement-a-task-model">
    <p>
        이제 프로젝트를 생성하고 기본 라우팅을 설정했으니, 다음을 수행하여 애플리케이션을 확장할 것입니다.
    </p>
    <list type="decimal">
        <li><a href="#create-model-types">태스크를 나타내는 모델 유형을 생성합니다.</a></li>
        <li><a href="#create-sample-values">샘플 값을 포함하는 태스크 목록을 선언합니다.</a></li>
        <li><a href="#add-a-route">이 목록을 반환하도록 경로 및 요청 핸들러를 수정합니다.</a></li>
        <li><a href="#test">브라우저를 사용하여 새 기능이 작동하는지 테스트합니다.</a></li>
    </list>
    <procedure title="모델 유형 생성" id="create-model-types">
        <step>
            <p>
                <Path>src/main/kotlin/com/example</Path> 내부에 <Path>model</Path>이라는 새 서브패키지를 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>model</Path> 디렉토리 내에 새 <Path>Task.kt</Path> 파일을 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>Task.kt</Path> 파일을 열고 우선순위를 나타내는 다음 <code>enum</code>과 태스크를 나타내는 <code>class</code>를 추가합니다.
            </p>
            <code-block lang="kotlin" code="                    enum class Priority {&#10;                        Low, Medium, High, Vital&#10;                    }&#10;                    data class Task(&#10;                        val name: String,&#10;                        val description: String,&#10;                        val priority: Priority&#10;                    )"/>
        </step>
        <step>
            <p>HTML 테이블 내에서 클라이언트에 태스크 정보를 전송할 것이므로, 다음 확장 함수도 추가합니다.</p>
            <code-block lang="kotlin" code="                    fun Task.taskAsRow() = &quot;&quot;&quot;&#10;                        &lt;tr&gt;&#10;                            &lt;td&gt;$name&lt;/td&gt;&lt;td&gt;$description&lt;/td&gt;&lt;td&gt;$priority&lt;/td&gt;&#10;                        &lt;/tr&gt;&#10;                        &quot;&quot;&quot;.trimIndent()&#10;&#10;                    fun List&lt;Task&gt;.tasksAsTable() = this.joinToString(&#10;                        prefix = &quot;&lt;table rules=\&quot;all\&quot;&gt;&quot;,&#10;                        postfix = &quot;&lt;/table&gt;&quot;,&#10;                        separator = &quot;
&quot;,&#10;                        transform = Task::taskAsRow&#10;                    )"/>
            <p>
                <code>Task.taskAsRow()</code> 함수는 <code>Task</code> 객체를 테이블 행으로 렌더링할 수 있도록 하며, <code>List&lt;Task&gt;.tasksAsTable()</code>은
                태스크 목록을 테이블로 렌더링할 수 있도록 합니다.
            </p>
        </step>
    </procedure>
    <procedure title="샘플 값 생성" id="create-sample-values">
        <step>
            <p>
                <Path>model</Path> 디렉토리 내에 새
                <Path>TaskRepository.kt</Path> 파일을 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>TaskRepository.kt</Path>를 열고 태스크 목록을 정의하는 다음 코드를 추가합니다.
            </p>
            <code-block lang="kotlin" code="                    val tasks = mutableListOf(&#10;                        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;                        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;                        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;                        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;                    )"/>
        </step>
    </procedure>
    <procedure title="새 경로 추가" id="add-a-route">
        <step>
            <p>
                <Path>Routing.kt</Path> 파일을 열고 기존 <code>Application.configureRouting()</code> 함수를 아래 구현으로 바꿉니다.
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                이제 클라이언트에 정적 콘텐츠를 반환하는 대신 태스크 목록을 제공합니다. 목록은 네트워크를 통해 직접 보낼 수 없으므로, 클라이언트가 이해할 수 있는 형식으로 변환해야 합니다. 이 경우 태스크는 HTML 테이블로 변환됩니다.
            </p>
        </step>
        <step>
            <p>필요한 임포트를 추가합니다.</p>
            <code-block lang="kotlin" code="                    import model.*"/>
        </step>
    </procedure>
    <procedure title="새 기능 테스트" id="test">
        <step>
            <p>IntelliJ IDEA에서 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                 src="intellij_idea_rerun_icon.svg"
                                                 height="16"
                                                 width="16"/>)을 클릭하여 애플리케이션을 다시 시작합니다.</p>
        </step>
        <step>
            <p>브라우저에서 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 이동합니다.
                태스크가 포함된 HTML 테이블이 표시되어야 합니다.</p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="네 개의 행이 있는 테이블을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
            <p>그렇다면 축하합니다! 애플리케이션의 기본 기능이 올바르게 작동하고 있습니다.</p>
        </step>
    </procedure>
</chapter>
<chapter title="모델 리팩토링" id="refactor-the-model">
    <p>
        앱의 기능을 확장하기 전에, 저장소 내에 값 목록을 캡슐화하여 설계를 리팩토링해야 합니다. 이렇게 하면 데이터 관리를 중앙 집중화하고 Ktor 특정 코드에 집중할 수 있습니다.
    </p>
    <procedure>
        <step>
            <p>
                <Path>TaskRepository.kt</Path> 파일로 돌아가서 기존 태스크 목록을 아래 코드로 바꿉니다.
            </p>
            <code-block lang="kotlin" code="package model&#10;&#10;object TaskRepository {&#10;    private val tasks = mutableListOf(&#10;        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;    )&#10;&#10;    fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;    fun tasksByPriority(priority: Priority) = tasks.filter {&#10;        it.priority == priority&#10;    }&#10;&#10;    fun taskByName(name: String) = tasks.find {&#10;        it.name.equals(name, ignoreCase = true)&#10;    }&#10;&#10;    fun addTask(task: Task) {&#10;        if(taskByName(task.name) != null) {&#10;            throw IllegalStateException(&quot;Cannot duplicate task names!&quot;)&#10;        }&#10;        tasks.add(task)&#10;    }&#10;}"/>
            <p>
                이것은 목록을 기반으로 하는 매우 간단한 태스크 데이터 저장소를 구현합니다. 예시를 위해 태스크가 추가되는 순서가 유지되지만, 예외를 발생시켜 중복이 허용되지 않습니다.</p>
            <p>이후 튜토리얼에서는 <a href="https://github.com/JetBrains/Exposed">Exposed 라이브러리</a>를 통해 관계형 데이터베이스에 연결하는 저장소를 구현하는 방법을 배울 것입니다.
            </p>
            <p>
                지금은 경로 내에서 저장소를 활용할 것입니다.
            </p>
        </step>
        <step>
            <p>
                <Path>Routing.kt</Path> 파일을 열고 기존 <code>Application.configureRouting()</code> 함수를 아래 구현으로 바꿉니다.
            </p>
            <code-block lang="Kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                val tasks = TaskRepository.allTasks()&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                요청이 도착하면 저장소를 사용하여 현재 태스크 목록을 가져옵니다. 그런 다음, 이 태스크를 포함하는 HTTP 응답이 구축됩니다.
            </p>
        </step>
    </procedure>
    <procedure title="리팩토링된 코드 테스트">
        <step>
            <p>IntelliJ IDEA에서 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                 src="intellij_idea_rerun_icon.svg" height="16"
                                                 width="16"/>)을 클릭하여 애플리케이션을 다시 시작합니다.</p>
        </step>
        <step>
            <p>
                브라우저에서 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 이동합니다. HTML 테이블이 표시된 채로 출력은 동일하게 유지되어야 합니다.
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="네 개의 행이 있는 테이블을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="파라미터 사용" id="work-with-parameters">
    <p>
        이번 반복에서는 사용자가 우선순위별로 태스크를 볼 수 있도록 할 것입니다. 이를 위해 애플리케이션은 다음 URL에 대한 GET 요청을 허용해야 합니다.
    </p>
    <list type="bullet">
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Low">/tasks/byPriority/Low</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Medium">/tasks/byPriority/Medium</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/High">/tasks/byPriority/High</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Vital">/tasks/byPriority/Vital</a></li>
    </list>
    <p>
        추가할 경로는
        <code>/tasks/byPriority/{priority?}</code>이며, 여기서 <code>{priority?}</code>는 런타임에 추출해야 하는 경로 파라미터를 나타내고 물음표는 파라미터가 선택 사항임을 나타내는 데 사용됩니다. 쿼리 파라미터는 원하는 어떤 이름이든 가질 수 있지만, <code>priority</code>가 가장 확실한 선택으로 보입니다.
    </p>
    <p>
        요청을 처리하는 프로세스는 다음과 같이 요약할 수 있습니다.
    </p>
    <list type="decimal">
        <li>요청에서 <code>priority</code>라는 경로 파라미터를 추출합니다.</li>
        <li>이 파라미터가 없으면 <code>400</code> 상태(잘못된 요청)를 반환합니다.</li>
        <li>파라미터의 텍스트 값을 <code>Priority</code> enum 값으로 변환합니다.</li>
        <li>이것이 실패하면 <code>400</code> 상태 코드와 함께 응답을 반환합니다.</li>
        <li>지정된 우선순위를 가진 모든 태스크를 찾기 위해 저장소를 사용합니다.</li>
        <li>일치하는 태스크가 없으면 <code>404</code> 상태(찾을 수 없음)를 반환합니다.</li>
        <li>일치하는 태스크를 HTML 테이블로 포맷하여 반환합니다.</li>
    </list>
    <p>
        먼저 이 기능을 구현한 다음, 작동하는지 확인하는 가장 좋은 방법을 찾을 것입니다.
    </p>
    <procedure title="새 경로 추가">
        <p>
            <Path>Routing.kt</Path> 파일을 열고 아래와 같이 다음 경로를 코드에 추가합니다.
        </p>
        <code-block lang="kotlin" code="                routing {&#10;                    get(&quot;/tasks&quot;) { ... }&#10;&#10;                    //add the following route&#10;                    get(&quot;/tasks/byPriority/{priority?}&quot;) {&#10;                        val priorityAsText = call.parameters[&quot;priority&quot;]&#10;                        if (priorityAsText == null) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                            return@get&#10;                        }&#10;&#10;                        try {&#10;                            val priority = Priority.valueOf(priorityAsText)&#10;                            val tasks = TaskRepository.tasksByPriority(priority)&#10;&#10;                            if (tasks.isEmpty()) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = tasks.tasksAsTable()&#10;                            )&#10;                        } catch(ex: IllegalArgumentException) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            위에서 요약했듯이, URL
            <code>/tasks/byPriority/{priority?}</code>에 대한 핸들러를 작성했습니다.
            <code>priority</code> 기호는 사용자가 추가한 경로 파라미터를 나타냅니다. 불행히도 서버에서는 이것이 해당 Kotlin 열거형의 네 가지 값 중 하나임을 보장할 방법이 없으므로 수동으로 확인해야 합니다.
        </p>
        <p>
            경로 파라미터가 없으면 서버는 클라이언트에 <code>400</code> 상태 코드를 반환합니다. 그렇지 않으면 파라미터의 값을 추출하고 이를 열거형 멤버로 변환하려고 시도합니다. 이것이 실패하면 예외가 발생하며, 서버는 이를 catch하여 <code>400</code> 상태 코드를 반환합니다.
        </p>
        <p>
            변환이 성공했다고 가정하면, 저장소를 사용하여 일치하는 <code>Tasks</code>를 찾습니다. 지정된 우선순위의 태스크가 없으면 서버는 <code>404</code> 상태 코드를 반환하고, 그렇지 않으면 일치하는 태스크를 HTML 테이블로 다시 보냅니다.
        </p>
    </procedure>
    <procedure title="새 경로 테스트">
        <p>
            다양한 URL을 요청하여 브라우저에서 이 기능을 테스트할 수 있습니다.
        </p>
        <step>
            <p>IntelliJ IDEA에서 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                 src="intellij_idea_rerun_icon.svg"
                                                 height="16"
                                                 width="16"/>)을 클릭하여 애플리케이션을 다시 시작합니다.</p>
        </step>
        <step>
            <p>
                중간 우선순위 태스크를 모두 검색하려면 <a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>으로 이동합니다.
            </p>
            <img src="tutorial_routing_and_requests_implementation_4.png"
                 alt="중간 우선순위 태스크가 포함된 테이블을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                안타깝게도 브라우저를 통한 테스트는 오류의 경우 제한적입니다. 개발자 확장을 사용하지 않으면 브라우저는 실패한 응답의 세부 정보를 표시하지 않습니다. 더 간단한 대안은 <a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>과 같은 전문 도구를 사용하는 것입니다.
            </p>
        </step>
        <step>
            <p>
                Postman에서 동일한 URL
                <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>에 대한 GET 요청을 보냅니다.
            </p>
            <img src="tutorial_routing_and_requests_postman.png"
                 alt="응답 세부 정보를 보여주는 Postman의 GET 요청"
                 border-effect="rounded"
                 width="706"/>
            <p>
                이는 서버의 원시 출력과 요청 및 응답의 모든 세부 정보를 보여줍니다.
            </p>
        </step>
        <step>
            <p>
                중요 태스크 요청 시 <code>404</code> 상태 코드가 반환되는지 확인하려면 <code>http://0.0.0.0:8080/tasks/byPriority/Vital</code>로 새 GET 요청을 보냅니다. 그러면 <control>응답</control> 창의 오른쪽 상단 모서리에 상태 코드가 표시됩니다.
            </p>
            <img src="tutorial_routing_and_requests_postman_vital.png"
                 alt="상태 코드를 보여주는 Postman의 GET 요청"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                잘못된 우선순위가 지정될 때 <code>400</code>이 반환되는지 확인하려면 유효하지 않은 속성으로 다른 GET 요청을 생성합니다.
            </p>
            <img src="tutorial_routing_and_requests_postman_bad_request.png"
                 alt="잘못된 요청 상태 코드가 있는 Postman의 GET 요청"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="단위 테스트 추가" id="add-unit-tests">
    <p>
        지금까지 모든 태스크를 검색하는 경로 하나와 우선순위별로 태스크를 검색하는 경로 하나, 총 두 개의 경로를 추가했습니다. Postman과 같은 도구를 사용하면 이러한 경로를 완전히 테스트할 수 있지만, 수동 검사가 필요하고 Ktor 외부에서 실행됩니다.
    </p>
    <p>
        이는 프로토타이핑 및 소규모 애플리케이션에서는 허용됩니다. 그러나 이 접근 방식은 수천 개의 테스트가 빈번하게 실행되어야 하는 대규모 애플리케이션으로 확장되지 않습니다. 더 나은 해결책은 테스트를 완전히 자동화하는 것입니다.
    </p>
    <p>
        Ktor는 경로의 자동화된 유효성 검사를 지원하기 위해 자체 <Links href="/ktor/server-testing" summary="Learn how to test your server application using a special testing engine.">테스트 프레임워크</Links>를 제공합니다.
        다음으로, 앱의 기존 기능에 대한 몇 가지 테스트를 작성할 것입니다.
    </p>
    <procedure>
        <step>
            <p>
                <Path>src</Path> 내부에 <Path>test</Path>라는 새 디렉토리를 생성하고, 그 안에
                <Path>kotlin</Path>이라는 하위 디렉토리를 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>src/test/kotlin</Path> 내부에 새
                <Path>ApplicationTest.kt</Path> 파일을 생성합니다.
            </p>
        </step>
        <step>
            <p>
                <Path>ApplicationTest.kt</Path> 파일을 열고 다음 코드를 추가합니다.
            </p>
            <code-block lang="kotlin" code="                    package com.example&#10;&#10;                    import io.ktor.client.request.*&#10;                    import io.ktor.client.statement.*&#10;                    import io.ktor.http.*&#10;                    import io.ktor.server.testing.*&#10;                    import org.junit.Test&#10;                    import kotlin.test.assertContains&#10;                    import kotlin.test.assertEquals&#10;&#10;&#10;                    class ApplicationTest {&#10;                        @Test&#10;                        fun tasksCanBeFoundByPriority() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Medium&quot;)&#10;                            val body = response.bodyAsText()&#10;&#10;                            assertEquals(HttpStatusCode.OK, response.status)&#10;                            assertContains(body, &quot;Mow the lawn&quot;)&#10;                            assertContains(body, &quot;Paint the fence&quot;)&#10;                        }&#10;&#10;                        @Test&#10;                        fun invalidPriorityProduces400() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Invalid&quot;)&#10;                            assertEquals(HttpStatusCode.BadRequest, response.status)&#10;                        }&#10;&#10;                        @Test&#10;                        fun unusedPriorityProduces404() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Vital&quot;)&#10;                            assertEquals(HttpStatusCode.NotFound, response.status)&#10;                        }&#10;                    }"/>
            <p>
                각 테스트에서는 Ktor의 새 인스턴스가 생성됩니다. 이는 Netty와 같은 웹 서버 대신 테스트 환경 내에서 실행됩니다. 프로젝트 생성기가 작성한 모듈이 로드되며, 이는 라우팅 함수를 호출합니다. 그런 다음 내장된 <code>client</code> 객체를 사용하여 애플리케이션에 요청을 보내고 반환되는 응답의 유효성을 검사할 수 있습니다.
            </p>
            <p>
                테스트는 IDE 내에서 또는 CI/CD 파이프라인의 일부로 실행할 수 있습니다.
            </p>
        </step>
        <step>
            <p>IntelliJ IDE 내에서 테스트를 실행하려면 각 테스트 함수 옆에 있는 거터 아이콘(<img
                    alt="IntelliJ IDEA 거터 아이콘"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>)을 클릭합니다.</p>
            <tip>
                IntelliJ IDE에서 단위 테스트를 실행하는 방법에 대한 자세한 내용은 <a
                    href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEA 문서</a>를 참조하세요.
            </tip>
        </step>
    </procedure>
</chapter>
<chapter title="POST 요청 처리" id="handle-post-requests">
    <p>
        위에서 설명한 프로세스를 따라 GET 요청에 대한 추가 경로를 원하는 만큼 생성할 수 있습니다. 이를 통해 사용자는 원하는 검색 기준을 사용하여 태스크를 가져올 수 있습니다. 하지만 사용자들은 새 태스크를 생성할 수도 있기를 원할 것입니다.
    </p>
    <p>
        이 경우 적절한 HTTP 요청 유형은 POST입니다. POST 요청은 일반적으로 사용자가 HTML 폼을 작성하고 제출할 때 트리거됩니다.
    </p>
    <p>
        GET 요청과 달리 POST 요청에는 <code>body</code>가 있으며, 여기에는 폼에 있는 모든 입력 필드의 이름과 값이 포함됩니다. 이 정보는 다른 입력의 데이터를 분리하고 유효하지 않은 문자를 이스케이프하기 위해 인코딩됩니다. 브라우저와 Ktor가 이를 관리해 줄 것이므로 이 프로세스의 세부 사항에 대해 걱정할 필요가 없습니다.
    </p>
    <p>
        다음으로, 다음 단계에 따라 기존 애플리케이션을 확장하여 새 태스크 생성을 허용할 것입니다.
    </p>
    <list type="decimal">
        <li><a href="#create-static-content">HTML 폼을 포함하는 정적 콘텐츠 폴더를 생성합니다.</a>.</li>
        <li><a href="#register-folder">Ktor가 이 폴더의 내용을 제공할 수 있도록 인식하게 합니다.</a>.</li>
        <li><a href="#add-form-handler">폼 제출을 처리할 새 요청 핸들러를 추가합니다.</a>.</li>
        <li><a href="#test-functionality">완성된 기능을 테스트합니다.</a>.</li>
    </list>
    <procedure title="정적 콘텐츠 생성" id="create-static-content">
        <step>
            <p>
                <Path>src/main/resources</Path> 내부에 <Path>task-ui</Path>라는 새 디렉토리를 생성합니다.
                이것이 정적 콘텐츠를 위한 폴더가 될 것입니다.
            </p>
        </step>
        <step>
            <p>
                <Path>task-ui</Path> 폴더 내에 새
                <Path>task-form.html</Path> 파일을 생성합니다.
            </p>
        </step>
        <step>
            <p>새로 생성된
                <Path>task-form.html</Path> 파일을 열고 다음 내용을 추가합니다.
            </p>
            <code-block lang="html" code="&lt;!DOCTYPE html&gt;&#10;&lt;html lang=&quot;en&quot;&gt;&#10;&lt;head&gt;&#10;    &lt;meta charset=&quot;UTF-8&quot;&gt;&#10;    &lt;title&gt;Adding a new task&lt;/title&gt;&#10;&lt;/head&gt;&#10;&lt;body&gt;&#10;&lt;h1&gt;Adding a new task&lt;/h1&gt;&#10;&lt;form method=&quot;post&quot; action=&quot;/tasks&quot;&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;name&quot;&gt;Name: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot; size=&quot;10&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;description&quot;&gt;Description: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;description&quot; name=&quot;description&quot; size=&quot;20&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;priority&quot;&gt;Priority: &lt;/label&gt;&#10;        &lt;select id=&quot;priority&quot; name=&quot;priority&quot;&gt;&#10;            &lt;option name=&quot;Low&quot;&gt;Low&lt;/option&gt;&#10;            &lt;option name=&quot;Medium&quot;&gt;Medium&lt;/option&gt;&#10;            &lt;option name=&quot;High&quot;&gt;High&lt;/option&gt;&#10;            &lt;option name=&quot;Vital&quot;&gt;Vital&lt;/option&gt;&#10;        &lt;/select&gt;&#10;    &lt;/div&gt;&#10;    &lt;input type=&quot;submit&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;/body&gt;&#10;&lt;/html&gt;"/>
        </step>
    </procedure>
    <procedure title="Ktor에 폴더 등록" id="register-folder">
        <step>
            <p>
                <Path>src/main/kotlin/com/example/plugins</Path> 내의
                <Path>Routing.kt</Path> 파일로 이동합니다.
            </p>
        </step>
        <step>
            <p>
                <code>Application.configureRouting()</code> 함수에 <code>staticResources()</code>에 대한 다음 호출을 추가합니다.
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            //add the following line&#10;                            staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                            get(&quot;/tasks&quot;) { ... }&#10;&#10;                            get(&quot;/tasks/byPriority/{priority?}&quot;) { … }&#10;                        }&#10;                    }"/>
            <p>이것은 다음 임포트를 필요로 합니다.</p>
            <code-block lang="kotlin" code="                    import io.ktor.server.http.content.staticResources"/>
        </step>
        <step>
            <p>애플리케이션을 다시 시작합니다. </p>
        </step>
        <step>
            <p>
                브라우저에서 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>로 이동합니다. HTML 폼이 표시되어야 합니다.
            </p>
            <img src="tutorial_routing_and_requests_implementation_6.png"
                 alt="HTML 폼을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
    <procedure title="폼 핸들러 추가" id="add-form-handler">
        <p>
            <Path>Routing.kt</Path>에서 <code>configureRouting()</code> 함수에 다음 추가 경로를 추가합니다.
        </p>
        <code-block lang="kotlin" code="                fun Application.configureRouting() {&#10;                    routing {&#10;                        //...&#10;&#10;                        //add the following route&#10;                        post(&quot;/tasks&quot;) {&#10;                            val formContent = call.receiveParameters()&#10;&#10;                            val params = Triple(&#10;                                formContent[&quot;name&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;description&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;priority&quot;] ?: &quot;&quot;&#10;                            )&#10;&#10;                            if (params.toList().any { it.isEmpty() }) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@post&#10;                            }&#10;&#10;                            try {&#10;                                val priority = Priority.valueOf(params.third)&#10;                                TaskRepository.addTask(&#10;                                    Task(&#10;                                        params.first,&#10;                                        params.second,&#10;                                        priority&#10;                                    )&#10;                                )&#10;&#10;                                call.respond(HttpStatusCode.NoContent)&#10;                            } catch (ex: IllegalArgumentException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            } catch (ex: IllegalStateException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            }&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            보시다시피 새 경로는 GET 요청 대신 POST 요청에 매핑됩니다. Ktor는 <code>receiveParameters()</code> 호출을 통해 요청 본문을 처리합니다. 이는 요청 본문에 있던 파라미터의 컬렉션을 반환합니다.
        </p>
        <p>
            세 개의 파라미터가 있으므로 관련 값을 <a
                href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">Triple</a>에 저장할 수 있습니다. 파라미터가 없으면 대신 빈 문자열이 저장됩니다.
        </p>
        <p>
            값 중 하나라도 비어 있으면 서버는 상태 코드 <code>400</code>과 함께 응답을 반환합니다. 그런 다음, 세 번째 파라미터를 <code>Priority</code>로 변환하려고 시도하고, 성공하면 새 <code>Task</code>의 정보가 저장소에 추가됩니다. 이 두 가지 작업 모두 예외를 발생시킬 수 있으며, 이 경우 다시 상태 코드 <code>400</code>을 반환합니다.
        </p>
        <p>
            그렇지 않고 모든 것이 성공적이면 서버는 클라이언트에 <code>204</code> 상태 코드(콘텐츠 없음)를 반환합니다. 이는 요청이 성공했지만 결과적으로 보낼 새로운 정보는 없음을 의미합니다.
        </p>
    </procedure>
    <procedure title="완성된 기능 테스트" id="test-functionality">
        <step>
            <p>
                애플리케이션을 다시 시작합니다.
            </p>
        </step>
        <step>
            <p>브라우저에서 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>로 이동합니다.
            </p>
        </step>
        <step>
            <p>
                샘플 데이터로 폼을 채우고
                <control>제출</control>을 클릭합니다.
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                 alt="샘플 데이터가 있는 HTML 폼을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
            <p>폼을 제출할 때 새 페이지로 이동해서는 안 됩니다.</p>
        </step>
        <step>
            <p>
                URL <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>로 이동합니다. 새 태스크가 추가된 것을 확인할 수 있습니다.
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                 alt="태스크가 포함된 HTML 테이블을 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                기능의 유효성을 검사하려면 <Path>ApplicationTest.kt</Path>에 다음 테스트를 추가합니다.
            </p>
            <code-block lang="kotlin" code="                    @Test&#10;                    fun newTasksCanBeAdded() = testApplication {&#10;                        application {&#10;                            module()&#10;                        }&#10;&#10;                        val response1 = client.post(&quot;/tasks&quot;) {&#10;                            header(&#10;                                HttpHeaders.ContentType,&#10;                                ContentType.Application.FormUrlEncoded.toString()&#10;                            )&#10;                            setBody(&#10;                                listOf(&#10;                                    &quot;name&quot; to &quot;swimming&quot;,&#10;                                    &quot;description&quot; to &quot;Go to the beach&quot;,&#10;                                    &quot;priority&quot; to &quot;Low&quot;&#10;                                ).formUrlEncode()&#10;                            )&#10;                        }&#10;&#10;                        assertEquals(HttpStatusCode.NoContent, response1.status)&#10;&#10;                        val response2 = client.get(&quot;/tasks&quot;)&#10;                        assertEquals(HttpStatusCode.OK, response2.status)&#10;                        val body = response2.bodyAsText()&#10;&#10;                        assertContains(body, &quot;swimming&quot;)&#10;                        assertContains(body, &quot;Go to the beach&quot;)&#10;                    }"/>
            <p>
                이 테스트에서는 새 태스크를 생성하는 POST 요청과 새 태스크가 추가되었음을 확인하는 GET 요청, 두 개의 요청이 서버로 전송됩니다. 첫 번째 요청을 보낼 때
                <code>setBody()</code> 메서드를 사용하여 요청 본문에 콘텐츠를 삽입합니다. 테스트 프레임워크는 컬렉션에 <code>formUrlEncode()</code> 확장 메서드를 제공하여 브라우저가 데이터를 포맷하는 프로세스를 추상화합니다.
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="라우팅 리팩토링" id="refactor-the-routing">
    <p>
        지금까지의 라우팅을 살펴보면 모든 경로가 <code>/tasks</code>로 시작하는 것을 알 수 있습니다. 이를 자체 서브 경로에 배치하여 중복을 제거할 수 있습니다.
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        post {&#10;                            //Code remains the same&#10;                        }&#10;                    }&#10;            }"/>
    <p>
        애플리케이션에 여러 서브 경로가 있는 단계에 도달했다면, 각 서브 경로를 자체 헬퍼 함수에 넣는 것이 적절할 것입니다. 하지만 현재는 필요하지 않습니다.
    </p>
    <p>
        경로가 더 잘 정리될수록 확장하기가 더 쉽습니다. 예를 들어, 이름으로 태스크를 찾는 경로를 추가할 수 있습니다.
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //Code remains the same&#10;                        }&#10;                        get(&quot;/byName/{taskName}&quot;) {&#10;                            val name = call.parameters[&quot;taskName&quot;]&#10;                            if (name == null) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@get&#10;                            }&#10;&#10;                            val task = TaskRepository.taskByName(name)&#10;                            if (task == null) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = listOf(task).tasksAsTable()&#10;                            )&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        post {&#10;                            //Code remains the same&#10;                        }&#10;                    }&#10;                }&#10;            }"/>
</chapter>
<chapter title="다음 단계" id="next-steps">
    <p>
        이제 기본 라우팅 및 요청 처리 기능을 구현했습니다. 또한 유효성 검사, 오류 처리 및 단위 테스트에 대해 소개되었습니다. 이 모든 주제는 후속 튜토리얼에서 확장될 것입니다.
    </p>
    <p>
        태스크 관리자를 위한 JSON 파일을 생성하는 RESTful API를 만드는 방법을 배우려면 <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
        RESTful API that generates JSON files.">다음 튜토리얼</Links>로 계속 진행하세요.
    </p>
</chapter>
</topic>