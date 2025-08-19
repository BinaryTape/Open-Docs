import{_ as y}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as R,a as T,b as E,c as x,d as H,e as L,f as I,g as M,h as S}from"./chunks/tutorial_routing_and_requests_iteration_6_test_2.SecfwpmD.js";import{_ as k}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as K,C as u,c as q,o as B,G as o,w as i,j as n,a as l}from"./chunks/framework.Bksy39di.js";const X=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-requests-and-responses.md","filePath":"ko/ktor/server-requests-and-responses.md","lastUpdated":1755457140000}'),O={name:"ko/ktor/server-requests-and-responses.md"};function D(N,t,G,J,U,V){const b=u("show-structure"),f=u("Links"),P=u("tldr"),w=u("link-summary"),v=u("card-summary"),A=u("web-summary"),a=u("list"),d=u("chapter"),m=u("control"),g=u("tip"),r=u("Path"),e=u("step"),s=u("code-block"),p=u("procedure"),C=u("topic");return B(),q("div",null,[o(C,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Ktor와 Kotlin을 사용하여 HTTP 요청을 처리하고 응답 생성",id:"server-requests-and-responses"},{default:i(()=>[o(b,{for:"chapter",depth:"2"}),o(P,null,{default:i(()=>[t[3]||(t[3]=n("p",null,[n("b",null,"코드 예시"),l(": "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-routing-and-requests"}," tutorial-server-routing-and-requests ")],-1)),n("p",null,[t[1]||(t[1]=n("b",null,"사용된 플러그인",-1)),t[2]||(t[2]=l(": ")),o(f,{href:"/ktor/server-routing",summary:"Routing is a core plugin for handling incoming requests in a server application."},{default:i(()=>t[0]||(t[0]=[l("라우팅")])),_:1})])]),_:1}),o(w,null,{default:i(()=>t[4]||(t[4]=[l(" Ktor와 Kotlin으로 태스크 관리 애플리케이션을 구축하여 라우팅, 요청 처리 및 파라미터의 기본 사항을 학습합니다. ")])),_:1}),o(v,null,{default:i(()=>t[5]||(t[5]=[l(" 태스크 관리 애플리케이션을 생성하여 Ktor에서 라우팅과 요청이 어떻게 작동하는지 알아봅니다. ")])),_:1}),o(A,null,{default:i(()=>t[6]||(t[6]=[l(" Kotlin과 Ktor로 생성된 서비스에 대한 유효성 검사, 오류 처리 및 단위 테스트의 기본 사항을 학습합니다. ")])),_:1}),t[184]||(t[184]=n("p",null," 이 튜토리얼에서는 Ktor와 Kotlin으로 태스크 관리 애플리케이션을 구축하여 라우팅, 요청 처리 및 파라미터의 기본 사항을 학습합니다. ",-1)),t[185]||(t[185]=n("p",null," 이 튜토리얼을 마치면 다음을 수행하는 방법을 알게 됩니다. ",-1)),o(a,{type:"bullet"},{default:i(()=>t[7]||(t[7]=[n("li",null,"GET 및 POST 요청을 처리합니다.",-1),n("li",null,"요청에서 정보를 추출합니다.",-1),n("li",null,"데이터 변환 시 오류를 처리합니다.",-1),n("li",null,"단위 테스트를 사용하여 라우팅의 유효성을 검사합니다.",-1)])),_:1}),o(d,{title:"사전 요구 사항",id:"prerequisites"},{default:i(()=>[n("p",null,[t[9]||(t[9]=l(" 이 튜토리얼은 Ktor 서버 시작하기 가이드의 두 번째 튜토리얼입니다. 이 튜토리얼을 독립적으로 수행할 수 있지만, 선행 튜토리얼을 완료하여 ")),o(f,{href:"/ktor/server-create-a-new-project",summary:"Learn how to open, run and test a server application with Ktor."},{default:i(()=>t[8]||(t[8]=[l("새 Ktor 프로젝트를 생성, 열기 및 실행")])),_:1}),t[10]||(t[10]=l("하는 방법을 배우는 것을 강력히 권장합니다. "))]),t[11]||(t[11]=n("p",null,"HTTP 요청 유형, 헤더 및 상태 코드에 대한 기본적인 이해가 있는 것도 매우 유용합니다.",-1)),t[12]||(t[12]=n("p",null,"IntelliJ IDEA 설치를 권장하지만, 원하는 다른 IDE를 사용할 수도 있습니다. ",-1))]),_:1}),o(d,{title:"태스크 관리 애플리케이션",id:"sample-application"},{default:i(()=>[t[14]||(t[14]=n("p",null,"이 튜토리얼에서는 다음 기능을 갖춘 태스크 관리 애플리케이션을 점진적으로 구축할 것입니다.",-1)),o(a,{type:"bullet"},{default:i(()=>t[13]||(t[13]=[n("li",null,"사용 가능한 모든 태스크를 HTML 테이블로 봅니다.",-1),n("li",null,"우선순위 및 이름별로 태스크를 HTML로 다시 봅니다.",-1),n("li",null,"HTML 폼을 제출하여 추가 태스크를 추가합니다.",-1)])),_:1}),t[15]||(t[15]=n("p",null," 기본 기능을 작동시키기 위해 최소한의 작업을 수행한 다음, 7번의 반복을 통해 이 기능을 개선하고 확장할 것입니다. 이 최소 기능은 일부 모델 유형, 값 목록 및 단일 경로를 포함하는 프로젝트로 구성됩니다. ",-1))]),_:1}),o(d,{title:"정적 HTML 콘텐츠 표시",id:"display-static-html"},{default:i(()=>[t[41]||(t[41]=n("p",null,"첫 번째 반복에서는 정적 HTML 콘텐츠를 반환하는 새 경로를 애플리케이션에 추가합니다.",-1)),n("p",null,[t[18]||(t[18]=n("a",{href:"https://start.ktor.io"},"Ktor 프로젝트 생성기",-1)),t[19]||(t[19]=l("를 사용하여 ")),o(m,null,{default:i(()=>t[16]||(t[16]=[l("ktor-task-app")])),_:1}),t[20]||(t[20]=l("이라는 새 프로젝트를 생성합니다. 모든 기본 옵션을 수락할 수 있지만, ")),o(m,null,{default:i(()=>t[17]||(t[17]=[l("artifact")])),_:1}),t[21]||(t[21]=l(" 이름을 변경하고 싶을 수도 있습니다. "))]),o(g,null,{default:i(()=>[t[23]||(t[23]=l(" 새 프로젝트 생성에 대한 자세한 내용은 ")),o(f,{href:"/ktor/server-create-a-new-project",summary:"Learn how to open, run and test a server application with Ktor."},{default:i(()=>t[22]||(t[22]=[l("새 Ktor 프로젝트 생성, 열기 및 실행")])),_:1}),t[24]||(t[24]=l("을 참조하세요. 최근에 해당 튜토리얼을 완료했다면, 거기서 생성된 프로젝트를 자유롭게 재사용해도 좋습니다. "))]),_:1}),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[o(r,null,{default:i(()=>t[25]||(t[25]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[27]||(t[27]=l(" 폴더 내의 ")),o(r,null,{default:i(()=>t[26]||(t[26]=[l("Routing.kt")])),_:1}),t[28]||(t[28]=l(" 파일을 엽니다. "))]),_:1}),o(e,null,{default:i(()=>[t[29]||(t[29]=n("p",null,[l("기존 "),n("code",null,"Application.configureRouting()"),l(" 함수를 아래 구현으로 바꿉니다.")],-1)),o(s,{lang:"kotlin",code:`                        fun Application.configureRouting() {
                            routing {
                                get("/tasks") {
                                    call.respondText(
                                        contentType = ContentType.parse("text/html"),
                                            text = """
                                        <h3>TODO:</h3>
                                        <ol>
                                            <li>A table of all the tasks</li>
                                            <li>A form to submit new tasks</li>
                                        </ol>
                                        """.trimIndent()
                                    )
                                }
                            }
                        }`}),t[30]||(t[30]=n("p",null,[l("이로써 URL "),n("code",null,"/tasks"),l(" 및 GET 요청 유형에 대한 새 경로를 생성했습니다. GET 요청은 HTTP에서 가장 기본적인 요청 유형입니다. 사용자가 브라우저 주소 표시줄에 입력하거나 일반 HTML 링크를 클릭할 때 트리거됩니다. ")],-1)),t[31]||(t[31]=n("p",null,[l(" 현재는 정적 콘텐츠만 반환하고 있습니다. 클라이언트에 HTML을 보낼 것임을 알리기 위해 HTTP Content Type 헤더를 "),n("code",null,'"text/html"'),l("로 설정합니다. ")],-1))]),_:1}),o(e,null,{default:i(()=>[t[32]||(t[32]=n("p",null,[n("code",null,"ContentType"),l(" 객체에 접근하기 위해 다음 임포트를 추가합니다. ")],-1)),o(s,{lang:"kotlin",code:"                    import io.ktor.http.ContentType"})]),_:1}),o(e,null,{default:i(()=>[n("p",null,[t[34]||(t[34]=l("IntelliJ IDEA에서 ")),o(r,null,{default:i(()=>t[33]||(t[33]=[l("Application.kt")])),_:1}),t[35]||(t[35]=l(" 파일의 ")),t[36]||(t[36]=n("code",null,"main()",-1)),t[37]||(t[37]=l(" 함수 옆에 있는 실행 거터 아이콘 (")),t[38]||(t[38]=n("img",{alt:"IntelliJ IDEA 애플리케이션 실행 아이콘",src:y,height:"16",width:"16"},null,-1)),t[39]||(t[39]=l(")을 클릭하여 애플리케이션을 시작합니다. "))])]),_:1}),o(e,null,{default:i(()=>t[40]||(t[40]=[n("p",null,[l(" 브라우저에서 "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("로 이동합니다. 할 일 목록이 표시되어야 합니다. ")],-1),n("img",{src:R,alt:"두 개의 항목이 있는 할 일 목록을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1}),o(d,{title:"태스크 모델 구현",id:"implement-a-task-model"},{default:i(()=>[t[73]||(t[73]=n("p",null," 이제 프로젝트를 생성하고 기본 라우팅을 설정했으니, 다음을 수행하여 애플리케이션을 확장할 것입니다. ",-1)),o(a,{type:"decimal"},{default:i(()=>t[42]||(t[42]=[n("li",null,[n("a",{href:"#create-model-types"},"태스크를 나타내는 모델 유형을 생성합니다.")],-1),n("li",null,[n("a",{href:"#create-sample-values"},"샘플 값을 포함하는 태스크 목록을 선언합니다.")],-1),n("li",null,[n("a",{href:"#add-a-route"},"이 목록을 반환하도록 경로 및 요청 핸들러를 수정합니다.")],-1),n("li",null,[n("a",{href:"#test"},"브라우저를 사용하여 새 기능이 작동하는지 테스트합니다.")],-1)])),_:1}),o(p,{title:"모델 유형 생성",id:"create-model-types"},{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[43]||(t[43]=[l("src/main/kotlin/com/example")])),_:1}),t[45]||(t[45]=l(" 내부에 ")),o(r,null,{default:i(()=>t[44]||(t[44]=[l("model")])),_:1}),t[46]||(t[46]=l("이라는 새 서브패키지를 생성합니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[47]||(t[47]=[l("model")])),_:1}),t[49]||(t[49]=l(" 디렉토리 내에 새 ")),o(r,null,{default:i(()=>t[48]||(t[48]=[l("Task.kt")])),_:1}),t[50]||(t[50]=l(" 파일을 생성합니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[51]||(t[51]=[l("Task.kt")])),_:1}),t[52]||(t[52]=l(" 파일을 열고 우선순위를 나타내는 다음 ")),t[53]||(t[53]=n("code",null,"enum",-1)),t[54]||(t[54]=l("과 태스크를 나타내는 ")),t[55]||(t[55]=n("code",null,"class",-1)),t[56]||(t[56]=l("를 추가합니다. "))]),o(s,{lang:"kotlin",code:`                    enum class Priority {
                        Low, Medium, High, Vital
                    }
                    data class Task(
                        val name: String,
                        val description: String,
                        val priority: Priority
                    )`})]),_:1}),o(e,null,{default:i(()=>[t[57]||(t[57]=n("p",null,"HTML 테이블 내에서 클라이언트에 태스크 정보를 전송할 것이므로, 다음 확장 함수도 추가합니다.",-1)),o(s,{lang:"kotlin",code:`                    fun Task.taskAsRow() = """
                        <tr>
                            <td>$name</td><td>$description</td><td>$priority</td>
                        </tr>
                        """.trimIndent()

                    fun List<Task>.tasksAsTable() = this.joinToString(
                        prefix = "<table rules=\\"all\\">",
                        postfix = "</table>",
                        separator = "
",
                        transform = Task::taskAsRow
                    )`}),t[58]||(t[58]=n("p",null,[n("code",null,"Task.taskAsRow()"),l(" 함수는 "),n("code",null,"Task"),l(" 객체를 테이블 행으로 렌더링할 수 있도록 하며, "),n("code",null,"List<Task>.tasksAsTable()"),l("은 태스크 목록을 테이블로 렌더링할 수 있도록 합니다. ")],-1))]),_:1})]),_:1}),o(p,{title:"샘플 값 생성",id:"create-sample-values"},{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[59]||(t[59]=[l("model")])),_:1}),t[61]||(t[61]=l(" 디렉토리 내에 새 ")),o(r,null,{default:i(()=>t[60]||(t[60]=[l("TaskRepository.kt")])),_:1}),t[62]||(t[62]=l(" 파일을 생성합니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[63]||(t[63]=[l("TaskRepository.kt")])),_:1}),t[64]||(t[64]=l("를 열고 태스크 목록을 정의하는 다음 코드를 추가합니다. "))]),o(s,{lang:"kotlin",code:`                    val tasks = mutableListOf(
                        Task("cleaning", "Clean the house", Priority.Low),
                        Task("gardening", "Mow the lawn", Priority.Medium),
                        Task("shopping", "Buy the groceries", Priority.High),
                        Task("painting", "Paint the fence", Priority.Medium)
                    )`})]),_:1})]),_:1}),o(p,{title:"새 경로 추가",id:"add-a-route"},{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[65]||(t[65]=[l("Routing.kt")])),_:1}),t[66]||(t[66]=l(" 파일을 열고 기존 ")),t[67]||(t[67]=n("code",null,"Application.configureRouting()",-1)),t[68]||(t[68]=l(" 함수를 아래 구현으로 바꿉니다. "))]),o(s,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        routing {
                            get("/tasks") {
                                call.respondText(
                                    contentType = ContentType.parse("text/html"),
                                    text = tasks.tasksAsTable()
                                )
                            }
                        }
                    }`}),t[69]||(t[69]=n("p",null," 이제 클라이언트에 정적 콘텐츠를 반환하는 대신 태스크 목록을 제공합니다. 목록은 네트워크를 통해 직접 보낼 수 없으므로, 클라이언트가 이해할 수 있는 형식으로 변환해야 합니다. 이 경우 태스크는 HTML 테이블로 변환됩니다. ",-1))]),_:1}),o(e,null,{default:i(()=>[t[70]||(t[70]=n("p",null,"필요한 임포트를 추가합니다.",-1)),o(s,{lang:"kotlin",code:"                    import model.*"})]),_:1})]),_:1}),o(p,{title:"새 기능 테스트",id:"test"},{default:i(()=>[o(e,null,{default:i(()=>t[71]||(t[71]=[n("p",null,[l("IntelliJ IDEA에서 다시 실행 버튼("),n("img",{alt:"IntelliJ IDEA 다시 실행 버튼 아이콘",src:k,height:"16",width:"16"}),l(")을 클릭하여 애플리케이션을 다시 시작합니다.")],-1)])),_:1}),o(e,null,{default:i(()=>t[72]||(t[72]=[n("p",null,[l("브라우저에서 "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("로 이동합니다. 태스크가 포함된 HTML 테이블이 표시되어야 합니다.")],-1),n("img",{src:T,alt:"네 개의 행이 있는 테이블을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1),n("p",null,"그렇다면 축하합니다! 애플리케이션의 기본 기능이 올바르게 작동하고 있습니다.",-1)])),_:1})]),_:1})]),_:1}),o(d,{title:"모델 리팩토링",id:"refactor-the-model"},{default:i(()=>[t[86]||(t[86]=n("p",null," 앱의 기능을 확장하기 전에, 저장소 내에 값 목록을 캡슐화하여 설계를 리팩토링해야 합니다. 이렇게 하면 데이터 관리를 중앙 집중화하고 Ktor 특정 코드에 집중할 수 있습니다. ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[74]||(t[74]=[l("TaskRepository.kt")])),_:1}),t[75]||(t[75]=l(" 파일로 돌아가서 기존 태스크 목록을 아래 코드로 바꿉니다. "))]),o(s,{lang:"kotlin",code:`package model

object TaskRepository {
    private val tasks = mutableListOf(
        Task("cleaning", "Clean the house", Priority.Low),
        Task("gardening", "Mow the lawn", Priority.Medium),
        Task("shopping", "Buy the groceries", Priority.High),
        Task("painting", "Paint the fence", Priority.Medium)
    )

    fun allTasks(): List<Task> = tasks

    fun tasksByPriority(priority: Priority) = tasks.filter {
        it.priority == priority
    }

    fun taskByName(name: String) = tasks.find {
        it.name.equals(name, ignoreCase = true)
    }

    fun addTask(task: Task) {
        if(taskByName(task.name) != null) {
            throw IllegalStateException("Cannot duplicate task names!")
        }
        tasks.add(task)
    }
}`}),t[76]||(t[76]=n("p",null," 이것은 목록을 기반으로 하는 매우 간단한 태스크 데이터 저장소를 구현합니다. 예시를 위해 태스크가 추가되는 순서가 유지되지만, 예외를 발생시켜 중복이 허용되지 않습니다.",-1)),t[77]||(t[77]=n("p",null,[l("이후 튜토리얼에서는 "),n("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed 라이브러리"),l("를 통해 관계형 데이터베이스에 연결하는 저장소를 구현하는 방법을 배울 것입니다. ")],-1)),t[78]||(t[78]=n("p",null," 지금은 경로 내에서 저장소를 활용할 것입니다. ",-1))]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[79]||(t[79]=[l("Routing.kt")])),_:1}),t[80]||(t[80]=l(" 파일을 열고 기존 ")),t[81]||(t[81]=n("code",null,"Application.configureRouting()",-1)),t[82]||(t[82]=l(" 함수를 아래 구현으로 바꿉니다. "))]),o(s,{lang:"Kotlin",code:`                    fun Application.configureRouting() {
                        routing {
                            get("/tasks") {
                                val tasks = TaskRepository.allTasks()
                                call.respondText(
                                    contentType = ContentType.parse("text/html"),
                                    text = tasks.tasksAsTable()
                                )
                            }
                        }
                    }`}),t[83]||(t[83]=n("p",null," 요청이 도착하면 저장소를 사용하여 현재 태스크 목록을 가져옵니다. 그런 다음, 이 태스크를 포함하는 HTTP 응답이 구축됩니다. ",-1))]),_:1})]),_:1}),o(p,{title:"리팩토링된 코드 테스트"},{default:i(()=>[o(e,null,{default:i(()=>t[84]||(t[84]=[n("p",null,[l("IntelliJ IDEA에서 다시 실행 버튼("),n("img",{alt:"IntelliJ IDEA 다시 실행 버튼 아이콘",src:k,height:"16",width:"16"}),l(")을 클릭하여 애플리케이션을 다시 시작합니다.")],-1)])),_:1}),o(e,null,{default:i(()=>t[85]||(t[85]=[n("p",null,[l(" 브라우저에서 "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("로 이동합니다. HTML 테이블이 표시된 채로 출력은 동일하게 유지되어야 합니다. ")],-1),n("img",{src:T,alt:"네 개의 행이 있는 테이블을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1}),o(d,{title:"파라미터 사용",id:"work-with-parameters"},{default:i(()=>[t[108]||(t[108]=n("p",null," 이번 반복에서는 사용자가 우선순위별로 태스크를 볼 수 있도록 할 것입니다. 이를 위해 애플리케이션은 다음 URL에 대한 GET 요청을 허용해야 합니다. ",-1)),o(a,{type:"bullet"},{default:i(()=>t[87]||(t[87]=[n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Low"},"/tasks/byPriority/Low")],-1),n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},"/tasks/byPriority/Medium")],-1),n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/High"},"/tasks/byPriority/High")],-1),n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Vital"},"/tasks/byPriority/Vital")],-1)])),_:1}),t[109]||(t[109]=n("p",null,[l(" 추가할 경로는 "),n("code",null,"/tasks/byPriority/{priority?}"),l("이며, 여기서 "),n("code",null,"{priority?}"),l("는 런타임에 추출해야 하는 경로 파라미터를 나타내고 물음표는 파라미터가 선택 사항임을 나타내는 데 사용됩니다. 쿼리 파라미터는 원하는 어떤 이름이든 가질 수 있지만, "),n("code",null,"priority"),l("가 가장 확실한 선택으로 보입니다. ")],-1)),t[110]||(t[110]=n("p",null," 요청을 처리하는 프로세스는 다음과 같이 요약할 수 있습니다. ",-1)),o(a,{type:"decimal"},{default:i(()=>t[88]||(t[88]=[n("li",null,[l("요청에서 "),n("code",null,"priority"),l("라는 경로 파라미터를 추출합니다.")],-1),n("li",null,[l("이 파라미터가 없으면 "),n("code",null,"400"),l(" 상태(잘못된 요청)를 반환합니다.")],-1),n("li",null,[l("파라미터의 텍스트 값을 "),n("code",null,"Priority"),l(" enum 값으로 변환합니다.")],-1),n("li",null,[l("이것이 실패하면 "),n("code",null,"400"),l(" 상태 코드와 함께 응답을 반환합니다.")],-1),n("li",null,"지정된 우선순위를 가진 모든 태스크를 찾기 위해 저장소를 사용합니다.",-1),n("li",null,[l("일치하는 태스크가 없으면 "),n("code",null,"404"),l(" 상태(찾을 수 없음)를 반환합니다.")],-1),n("li",null,"일치하는 태스크를 HTML 테이블로 포맷하여 반환합니다.",-1)])),_:1}),t[111]||(t[111]=n("p",null," 먼저 이 기능을 구현한 다음, 작동하는지 확인하는 가장 좋은 방법을 찾을 것입니다. ",-1)),o(p,{title:"새 경로 추가"},{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[89]||(t[89]=[l("Routing.kt")])),_:1}),t[90]||(t[90]=l(" 파일을 열고 아래와 같이 다음 경로를 코드에 추가합니다. "))]),o(s,{lang:"kotlin",code:`                routing {
                    get("/tasks") { ... }

                    //add the following route
                    get("/tasks/byPriority/{priority?}") {
                        val priorityAsText = call.parameters["priority"]
                        if (priorityAsText == null) {
                            call.respond(HttpStatusCode.BadRequest)
                            return@get
                        }

                        try {
                            val priority = Priority.valueOf(priorityAsText)
                            val tasks = TaskRepository.tasksByPriority(priority)

                            if (tasks.isEmpty()) {
                                call.respond(HttpStatusCode.NotFound)
                                return@get
                            }

                            call.respondText(
                                contentType = ContentType.parse("text/html"),
                                text = tasks.tasksAsTable()
                            )
                        } catch(ex: IllegalArgumentException) {
                            call.respond(HttpStatusCode.BadRequest)
                        }
                    }
                }`}),t[91]||(t[91]=n("p",null,[l(" 위에서 요약했듯이, URL "),n("code",null,"/tasks/byPriority/{priority?}"),l("에 대한 핸들러를 작성했습니다. "),n("code",null,"priority"),l(" 기호는 사용자가 추가한 경로 파라미터를 나타냅니다. 불행히도 서버에서는 이것이 해당 Kotlin 열거형의 네 가지 값 중 하나임을 보장할 방법이 없으므로 수동으로 확인해야 합니다. ")],-1)),t[92]||(t[92]=n("p",null,[l(" 경로 파라미터가 없으면 서버는 클라이언트에 "),n("code",null,"400"),l(" 상태 코드를 반환합니다. 그렇지 않으면 파라미터의 값을 추출하고 이를 열거형 멤버로 변환하려고 시도합니다. 이것이 실패하면 예외가 발생하며, 서버는 이를 catch하여 "),n("code",null,"400"),l(" 상태 코드를 반환합니다. ")],-1)),t[93]||(t[93]=n("p",null,[l(" 변환이 성공했다고 가정하면, 저장소를 사용하여 일치하는 "),n("code",null,"Tasks"),l("를 찾습니다. 지정된 우선순위의 태스크가 없으면 서버는 "),n("code",null,"404"),l(" 상태 코드를 반환하고, 그렇지 않으면 일치하는 태스크를 HTML 테이블로 다시 보냅니다. ")],-1))]),_:1}),o(p,{title:"새 경로 테스트"},{default:i(()=>[t[107]||(t[107]=n("p",null," 다양한 URL을 요청하여 브라우저에서 이 기능을 테스트할 수 있습니다. ",-1)),o(e,null,{default:i(()=>t[94]||(t[94]=[n("p",null,[l("IntelliJ IDEA에서 다시 실행 버튼("),n("img",{alt:"IntelliJ IDEA 다시 실행 버튼 아이콘",src:k,height:"16",width:"16"}),l(")을 클릭하여 애플리케이션을 다시 시작합니다.")],-1)])),_:1}),o(e,null,{default:i(()=>t[95]||(t[95]=[n("p",null,[l(" 중간 우선순위 태스크를 모두 검색하려면 "),n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),l("으로 이동합니다. ")],-1),n("img",{src:E,alt:"중간 우선순위 태스크가 포함된 테이블을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1)])),_:1}),o(e,null,{default:i(()=>t[96]||(t[96]=[n("p",null,[l(" 안타깝게도 브라우저를 통한 테스트는 오류의 경우 제한적입니다. 개발자 확장을 사용하지 않으면 브라우저는 실패한 응답의 세부 정보를 표시하지 않습니다. 더 간단한 대안은 "),n("a",{href:"https://learning.postman.com/docs/sending-requests/requests/"},"Postman"),l("과 같은 전문 도구를 사용하는 것입니다. ")],-1)])),_:1}),o(e,null,{default:i(()=>t[97]||(t[97]=[n("p",null,[l(" Postman에서 동일한 URL "),n("code",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),l("에 대한 GET 요청을 보냅니다. ")],-1),n("img",{src:x,alt:"응답 세부 정보를 보여주는 Postman의 GET 요청","border-effect":"rounded",width:"706"},null,-1),n("p",null," 이는 서버의 원시 출력과 요청 및 응답의 모든 세부 정보를 보여줍니다. ",-1)])),_:1}),o(e,null,{default:i(()=>[n("p",null,[t[99]||(t[99]=l(" 중요 태스크 요청 시 ")),t[100]||(t[100]=n("code",null,"404",-1)),t[101]||(t[101]=l(" 상태 코드가 반환되는지 확인하려면 ")),t[102]||(t[102]=n("code",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Vital",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Vital")],-1)),t[103]||(t[103]=l("로 새 GET 요청을 보냅니다. 그러면 ")),o(m,null,{default:i(()=>t[98]||(t[98]=[l("응답")])),_:1}),t[104]||(t[104]=l(" 창의 오른쪽 상단 모서리에 상태 코드가 표시됩니다. "))]),t[105]||(t[105]=n("img",{src:H,alt:"상태 코드를 보여주는 Postman의 GET 요청","border-effect":"rounded",width:"706"},null,-1))]),_:1}),o(e,null,{default:i(()=>t[106]||(t[106]=[n("p",null,[l(" 잘못된 우선순위가 지정될 때 "),n("code",null,"400"),l("이 반환되는지 확인하려면 유효하지 않은 속성으로 다른 GET 요청을 생성합니다. ")],-1),n("img",{src:L,alt:"잘못된 요청 상태 코드가 있는 Postman의 GET 요청","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1}),o(d,{title:"단위 테스트 추가",id:"add-unit-tests"},{default:i(()=>[t[131]||(t[131]=n("p",null," 지금까지 모든 태스크를 검색하는 경로 하나와 우선순위별로 태스크를 검색하는 경로 하나, 총 두 개의 경로를 추가했습니다. Postman과 같은 도구를 사용하면 이러한 경로를 완전히 테스트할 수 있지만, 수동 검사가 필요하고 Ktor 외부에서 실행됩니다. ",-1)),t[132]||(t[132]=n("p",null," 이는 프로토타이핑 및 소규모 애플리케이션에서는 허용됩니다. 그러나 이 접근 방식은 수천 개의 테스트가 빈번하게 실행되어야 하는 대규모 애플리케이션으로 확장되지 않습니다. 더 나은 해결책은 테스트를 완전히 자동화하는 것입니다. ",-1)),n("p",null,[t[113]||(t[113]=l(" Ktor는 경로의 자동화된 유효성 검사를 지원하기 위해 자체 ")),o(f,{href:"/ktor/server-testing",summary:"Learn how to test your server application using a special testing engine."},{default:i(()=>t[112]||(t[112]=[l("테스트 프레임워크")])),_:1}),t[114]||(t[114]=l("를 제공합니다. 다음으로, 앱의 기존 기능에 대한 몇 가지 테스트를 작성할 것입니다. "))]),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[115]||(t[115]=[l("src")])),_:1}),t[118]||(t[118]=l(" 내부에 ")),o(r,null,{default:i(()=>t[116]||(t[116]=[l("test")])),_:1}),t[119]||(t[119]=l("라는 새 디렉토리를 생성하고, 그 안에 ")),o(r,null,{default:i(()=>t[117]||(t[117]=[l("kotlin")])),_:1}),t[120]||(t[120]=l("이라는 하위 디렉토리를 생성합니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[121]||(t[121]=[l("src/test/kotlin")])),_:1}),t[123]||(t[123]=l(" 내부에 새 ")),o(r,null,{default:i(()=>t[122]||(t[122]=[l("ApplicationTest.kt")])),_:1}),t[124]||(t[124]=l(" 파일을 생성합니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[125]||(t[125]=[l("ApplicationTest.kt")])),_:1}),t[126]||(t[126]=l(" 파일을 열고 다음 코드를 추가합니다. "))]),o(s,{lang:"kotlin",code:`                    package com.example

                    import io.ktor.client.request.*
                    import io.ktor.client.statement.*
                    import io.ktor.http.*
                    import io.ktor.server.testing.*
                    import org.junit.Test
                    import kotlin.test.assertContains
                    import kotlin.test.assertEquals


                    class ApplicationTest {
                        @Test
                        fun tasksCanBeFoundByPriority() = testApplication {
                            application {
                                module()
                            }

                            val response = client.get("/tasks/byPriority/Medium")
                            val body = response.bodyAsText()

                            assertEquals(HttpStatusCode.OK, response.status)
                            assertContains(body, "Mow the lawn")
                            assertContains(body, "Paint the fence")
                        }

                        @Test
                        fun invalidPriorityProduces400() = testApplication {
                            application {
                                module()
                            }

                            val response = client.get("/tasks/byPriority/Invalid")
                            assertEquals(HttpStatusCode.BadRequest, response.status)
                        }

                        @Test
                        fun unusedPriorityProduces404() = testApplication {
                            application {
                                module()
                            }

                            val response = client.get("/tasks/byPriority/Vital")
                            assertEquals(HttpStatusCode.NotFound, response.status)
                        }
                    }`}),t[127]||(t[127]=n("p",null,[l(" 각 테스트에서는 Ktor의 새 인스턴스가 생성됩니다. 이는 Netty와 같은 웹 서버 대신 테스트 환경 내에서 실행됩니다. 프로젝트 생성기가 작성한 모듈이 로드되며, 이는 라우팅 함수를 호출합니다. 그런 다음 내장된 "),n("code",null,"client"),l(" 객체를 사용하여 애플리케이션에 요청을 보내고 반환되는 응답의 유효성을 검사할 수 있습니다. ")],-1)),t[128]||(t[128]=n("p",null," 테스트는 IDE 내에서 또는 CI/CD 파이프라인의 일부로 실행할 수 있습니다. ",-1))]),_:1}),o(e,null,{default:i(()=>[t[130]||(t[130]=n("p",null,[l("IntelliJ IDE 내에서 테스트를 실행하려면 각 테스트 함수 옆에 있는 거터 아이콘("),n("img",{alt:"IntelliJ IDEA 거터 아이콘",src:y,width:"16",height:"26"}),l(")을 클릭합니다.")],-1)),o(g,null,{default:i(()=>t[129]||(t[129]=[l(" IntelliJ IDE에서 단위 테스트를 실행하는 방법에 대한 자세한 내용은 "),n("a",{href:"https://www.jetbrains.com/help/idea/performing-tests.html"},"IntelliJ IDEA 문서",-1),l("를 참조하세요. ")])),_:1})]),_:1})]),_:1})]),_:1}),o(d,{title:"POST 요청 처리",id:"handle-post-requests"},{default:i(()=>[t[173]||(t[173]=n("p",null," 위에서 설명한 프로세스를 따라 GET 요청에 대한 추가 경로를 원하는 만큼 생성할 수 있습니다. 이를 통해 사용자는 원하는 검색 기준을 사용하여 태스크를 가져올 수 있습니다. 하지만 사용자들은 새 태스크를 생성할 수도 있기를 원할 것입니다. ",-1)),t[174]||(t[174]=n("p",null," 이 경우 적절한 HTTP 요청 유형은 POST입니다. POST 요청은 일반적으로 사용자가 HTML 폼을 작성하고 제출할 때 트리거됩니다. ",-1)),t[175]||(t[175]=n("p",null,[l(" GET 요청과 달리 POST 요청에는 "),n("code",null,"body"),l("가 있으며, 여기에는 폼에 있는 모든 입력 필드의 이름과 값이 포함됩니다. 이 정보는 다른 입력의 데이터를 분리하고 유효하지 않은 문자를 이스케이프하기 위해 인코딩됩니다. 브라우저와 Ktor가 이를 관리해 줄 것이므로 이 프로세스의 세부 사항에 대해 걱정할 필요가 없습니다. ")],-1)),t[176]||(t[176]=n("p",null," 다음으로, 다음 단계에 따라 기존 애플리케이션을 확장하여 새 태스크 생성을 허용할 것입니다. ",-1)),o(a,{type:"decimal"},{default:i(()=>t[133]||(t[133]=[n("li",null,[n("a",{href:"#create-static-content"},"HTML 폼을 포함하는 정적 콘텐츠 폴더를 생성합니다."),l(".")],-1),n("li",null,[n("a",{href:"#register-folder"},"Ktor가 이 폴더의 내용을 제공할 수 있도록 인식하게 합니다."),l(".")],-1),n("li",null,[n("a",{href:"#add-form-handler"},"폼 제출을 처리할 새 요청 핸들러를 추가합니다."),l(".")],-1),n("li",null,[n("a",{href:"#test-functionality"},"완성된 기능을 테스트합니다."),l(".")],-1)])),_:1}),o(p,{title:"정적 콘텐츠 생성",id:"create-static-content"},{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[134]||(t[134]=[l("src/main/resources")])),_:1}),t[136]||(t[136]=l(" 내부에 ")),o(r,null,{default:i(()=>t[135]||(t[135]=[l("task-ui")])),_:1}),t[137]||(t[137]=l("라는 새 디렉토리를 생성합니다. 이것이 정적 콘텐츠를 위한 폴더가 될 것입니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[138]||(t[138]=[l("task-ui")])),_:1}),t[140]||(t[140]=l(" 폴더 내에 새 ")),o(r,null,{default:i(()=>t[139]||(t[139]=[l("task-form.html")])),_:1}),t[141]||(t[141]=l(" 파일을 생성합니다. "))])]),_:1}),o(e,null,{default:i(()=>[n("p",null,[t[143]||(t[143]=l("새로 생성된 ")),o(r,null,{default:i(()=>t[142]||(t[142]=[l("task-form.html")])),_:1}),t[144]||(t[144]=l(" 파일을 열고 다음 내용을 추가합니다. "))]),o(s,{lang:"html",code:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Adding a new task</title>
</head>
<body>
<h1>Adding a new task</h1>
<form method="post" action="/tasks">
    <div>
        <label for="name">Name: </label>
        <input type="text" id="name" name="name" size="10">
    </div>
    <div>
        <label for="description">Description: </label>
        <input type="text" id="description" name="description" size="20">
    </div>
    <div>
        <label for="priority">Priority: </label>
        <select id="priority" name="priority">
            <option name="Low">Low</option>
            <option name="Medium">Medium</option>
            <option name="High">High</option>
            <option name="Vital">Vital</option>
        </select>
    </div>
    <input type="submit">
</form>
</body>
</html>`})]),_:1})]),_:1}),o(p,{title:"Ktor에 폴더 등록",id:"register-folder"},{default:i(()=>[o(e,null,{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[145]||(t[145]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[147]||(t[147]=l(" 내의 ")),o(r,null,{default:i(()=>t[146]||(t[146]=[l("Routing.kt")])),_:1}),t[148]||(t[148]=l(" 파일로 이동합니다. "))])]),_:1}),o(e,null,{default:i(()=>[t[149]||(t[149]=n("p",null,[n("code",null,"Application.configureRouting()"),l(" 함수에 "),n("code",null,"staticResources()"),l("에 대한 다음 호출을 추가합니다. ")],-1)),o(s,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        routing {
                            //add the following line
                            staticResources("/task-ui", "task-ui")

                            get("/tasks") { ... }

                            get("/tasks/byPriority/{priority?}") { … }
                        }
                    }`}),t[150]||(t[150]=n("p",null,"이것은 다음 임포트를 필요로 합니다.",-1)),o(s,{lang:"kotlin",code:"                    import io.ktor.server.http.content.staticResources"})]),_:1}),o(e,null,{default:i(()=>t[151]||(t[151]=[n("p",null,"애플리케이션을 다시 시작합니다. ",-1)])),_:1}),o(e,null,{default:i(()=>t[152]||(t[152]=[n("p",null,[l(" 브라우저에서 "),n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html"},[n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/task-ui/task-form.html")]),l("로 이동합니다. HTML 폼이 표시되어야 합니다. ")],-1),n("img",{src:I,alt:"HTML 폼을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1}),o(p,{title:"폼 핸들러 추가",id:"add-form-handler"},{default:i(()=>[n("p",null,[o(r,null,{default:i(()=>t[153]||(t[153]=[l("Routing.kt")])),_:1}),t[154]||(t[154]=l("에서 ")),t[155]||(t[155]=n("code",null,"configureRouting()",-1)),t[156]||(t[156]=l(" 함수에 다음 추가 경로를 추가합니다. "))]),o(s,{lang:"kotlin",code:`                fun Application.configureRouting() {
                    routing {
                        //...

                        //add the following route
                        post("/tasks") {
                            val formContent = call.receiveParameters()

                            val params = Triple(
                                formContent["name"] ?: "",
                                formContent["description"] ?: "",
                                formContent["priority"] ?: ""
                            )

                            if (params.toList().any { it.isEmpty() }) {
                                call.respond(HttpStatusCode.BadRequest)
                                return@post
                            }

                            try {
                                val priority = Priority.valueOf(params.third)
                                TaskRepository.addTask(
                                    Task(
                                        params.first,
                                        params.second,
                                        priority
                                    )
                                )

                                call.respond(HttpStatusCode.NoContent)
                            } catch (ex: IllegalArgumentException) {
                                call.respond(HttpStatusCode.BadRequest)
                            } catch (ex: IllegalStateException) {
                                call.respond(HttpStatusCode.BadRequest)
                            }
                        }
                    }
                }`}),t[157]||(t[157]=n("p",null,[l(" 보시다시피 새 경로는 GET 요청 대신 POST 요청에 매핑됩니다. Ktor는 "),n("code",null,"receiveParameters()"),l(" 호출을 통해 요청 본문을 처리합니다. 이는 요청 본문에 있던 파라미터의 컬렉션을 반환합니다. ")],-1)),t[158]||(t[158]=n("p",null,[l(" 세 개의 파라미터가 있으므로 관련 값을 "),n("a",{href:"https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/"},"Triple"),l("에 저장할 수 있습니다. 파라미터가 없으면 대신 빈 문자열이 저장됩니다. ")],-1)),t[159]||(t[159]=n("p",null,[l(" 값 중 하나라도 비어 있으면 서버는 상태 코드 "),n("code",null,"400"),l("과 함께 응답을 반환합니다. 그런 다음, 세 번째 파라미터를 "),n("code",null,"Priority"),l("로 변환하려고 시도하고, 성공하면 새 "),n("code",null,"Task"),l("의 정보가 저장소에 추가됩니다. 이 두 가지 작업 모두 예외를 발생시킬 수 있으며, 이 경우 다시 상태 코드 "),n("code",null,"400"),l("을 반환합니다. ")],-1)),t[160]||(t[160]=n("p",null,[l(" 그렇지 않고 모든 것이 성공적이면 서버는 클라이언트에 "),n("code",null,"204"),l(" 상태 코드(콘텐츠 없음)를 반환합니다. 이는 요청이 성공했지만 결과적으로 보낼 새로운 정보는 없음을 의미합니다. ")],-1))]),_:1}),o(p,{title:"완성된 기능 테스트",id:"test-functionality"},{default:i(()=>[o(e,null,{default:i(()=>t[161]||(t[161]=[n("p",null," 애플리케이션을 다시 시작합니다. ",-1)])),_:1}),o(e,null,{default:i(()=>t[162]||(t[162]=[n("p",null,[l("브라우저에서 "),n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html"},[n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/task-ui/task-form.html")]),l("로 이동합니다. ")],-1)])),_:1}),o(e,null,{default:i(()=>[n("p",null,[t[164]||(t[164]=l(" 샘플 데이터로 폼을 채우고 ")),o(m,null,{default:i(()=>t[163]||(t[163]=[l("제출")])),_:1}),t[165]||(t[165]=l("을 클릭합니다. "))]),t[166]||(t[166]=n("img",{src:M,alt:"샘플 데이터가 있는 HTML 폼을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1)),t[167]||(t[167]=n("p",null,"폼을 제출할 때 새 페이지로 이동해서는 안 됩니다.",-1))]),_:1}),o(e,null,{default:i(()=>t[168]||(t[168]=[n("p",null,[l(" URL "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("로 이동합니다. 새 태스크가 추가된 것을 확인할 수 있습니다. ")],-1),n("img",{src:S,alt:"태스크가 포함된 HTML 테이블을 표시하는 브라우저 창","border-effect":"rounded",width:"706"},null,-1)])),_:1}),o(e,null,{default:i(()=>[n("p",null,[t[170]||(t[170]=l(" 기능의 유효성을 검사하려면 ")),o(r,null,{default:i(()=>t[169]||(t[169]=[l("ApplicationTest.kt")])),_:1}),t[171]||(t[171]=l("에 다음 테스트를 추가합니다. "))]),o(s,{lang:"kotlin",code:`                    @Test
                    fun newTasksCanBeAdded() = testApplication {
                        application {
                            module()
                        }

                        val response1 = client.post("/tasks") {
                            header(
                                HttpHeaders.ContentType,
                                ContentType.Application.FormUrlEncoded.toString()
                            )
                            setBody(
                                listOf(
                                    "name" to "swimming",
                                    "description" to "Go to the beach",
                                    "priority" to "Low"
                                ).formUrlEncode()
                            )
                        }

                        assertEquals(HttpStatusCode.NoContent, response1.status)

                        val response2 = client.get("/tasks")
                        assertEquals(HttpStatusCode.OK, response2.status)
                        val body = response2.bodyAsText()

                        assertContains(body, "swimming")
                        assertContains(body, "Go to the beach")
                    }`}),t[172]||(t[172]=n("p",null,[l(" 이 테스트에서는 새 태스크를 생성하는 POST 요청과 새 태스크가 추가되었음을 확인하는 GET 요청, 두 개의 요청이 서버로 전송됩니다. 첫 번째 요청을 보낼 때 "),n("code",null,"setBody()"),l(" 메서드를 사용하여 요청 본문에 콘텐츠를 삽입합니다. 테스트 프레임워크는 컬렉션에 "),n("code",null,"formUrlEncode()"),l(" 확장 메서드를 제공하여 브라우저가 데이터를 포맷하는 프로세스를 추상화합니다. ")],-1))]),_:1})]),_:1})]),_:1}),o(d,{title:"라우팅 리팩토링",id:"refactor-the-routing"},{default:i(()=>[t[177]||(t[177]=n("p",null,[l(" 지금까지의 라우팅을 살펴보면 모든 경로가 "),n("code",null,"/tasks"),l("로 시작하는 것을 알 수 있습니다. 이를 자체 서브 경로에 배치하여 중복을 제거할 수 있습니다. ")],-1)),o(s,{lang:"kotlin",code:`            fun Application.configureRouting() {
                routing {
                    staticResources("/task-ui", "task-ui")

                    route("/tasks") {
                        get {
                            //Code remains the same
                        }

                        get("/byPriority/{priority?}") {
                            //Code remains the same
                        }

                        post {
                            //Code remains the same
                        }
                    }
            }`}),t[178]||(t[178]=n("p",null," 애플리케이션에 여러 서브 경로가 있는 단계에 도달했다면, 각 서브 경로를 자체 헬퍼 함수에 넣는 것이 적절할 것입니다. 하지만 현재는 필요하지 않습니다. ",-1)),t[179]||(t[179]=n("p",null," 경로가 더 잘 정리될수록 확장하기가 더 쉽습니다. 예를 들어, 이름으로 태스크를 찾는 경로를 추가할 수 있습니다. ",-1)),o(s,{lang:"kotlin",code:`            fun Application.configureRouting() {
                routing {
                    staticResources("/task-ui", "task-ui")

                    route("/tasks") {
                        get {
                            //Code remains the same
                        }
                        get("/byName/{taskName}") {
                            val name = call.parameters["taskName"]
                            if (name == null) {
                                call.respond(HttpStatusCode.BadRequest)
                                return@get
                            }

                            val task = TaskRepository.taskByName(name)
                            if (task == null) {
                                call.respond(HttpStatusCode.NotFound)
                                return@get
                            }

                            call.respondText(
                                contentType = ContentType.parse("text/html"),
                                text = listOf(task).tasksAsTable()
                            )
                        }

                        get("/byPriority/{priority?}") {
                            //Code remains the same
                        }

                        post {
                            //Code remains the same
                        }
                    }
                }
            }`})]),_:1}),o(d,{title:"다음 단계",id:"next-steps"},{default:i(()=>[t[183]||(t[183]=n("p",null," 이제 기본 라우팅 및 요청 처리 기능을 구현했습니다. 또한 유효성 검사, 오류 처리 및 단위 테스트에 대해 소개되었습니다. 이 모든 주제는 후속 튜토리얼에서 확장될 것입니다. ",-1)),n("p",null,[t[181]||(t[181]=l(" 태스크 관리자를 위한 JSON 파일을 생성하는 RESTful API를 만드는 방법을 배우려면 ")),o(f,{href:"/ktor/server-create-restful-apis",summary:`Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
        RESTful API that generates JSON files.`},{default:i(()=>t[180]||(t[180]=[l("다음 튜토리얼")])),_:1}),t[182]||(t[182]=l("로 계속 진행하세요. "))])]),_:1})]),_:1})])}const Y=K(O,[["render",D]]);export{X as __pageData,Y as default};
