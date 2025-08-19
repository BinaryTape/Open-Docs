import{_ as w,a as C,b as N,c as R,d as J,e as I,f as H,g as j,h as q}from"./chunks/tutorial_creating_restful_apis_delete_task.BtAbUZys.js";import{_ as D}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as g}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as y}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as K,C as u,c as O,o as B,G as o,w as e,j as l,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-create-restful-apis.md","filePath":"ko/ktor/server-create-restful-apis.md","lastUpdated":1755457140000}'),L={name:"ko/ktor/server-create-restful-apis.md"};function M(z,t,G,$,U,V){const T=u("show-structure"),d=u("Links"),v=u("tldr"),S=u("card-summary"),P=u("web-summary"),E=u("link-summary"),f=u("list"),a=u("chapter"),i=u("step"),m=u("control"),s=u("Path"),p=u("procedure"),r=u("code-block"),b=u("format"),k=u("ui-path"),x=u("note"),A=u("topic");return B(),O("div",null,[o(A,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Ktor로 Kotlin에서 RESTful API를 생성하는 방법",id:"server-create-restful-apis","help-id":"create-restful-apis"},{default:e(()=>[o(T,{for:"chapter",depth:"2"}),o(v,null,{default:e(()=>[t[9]||(t[9]=l("p",null,[l("b",null,"코드 예시"),n(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-restful-api"}," tutorial-server-restful-api ")],-1)),l("p",null,[t[3]||(t[3]=l("b",null,"사용된 플러그인",-1)),t[4]||(t[4]=n(": ")),o(d,{href:"/ktor/server-routing",summary:"라우팅은 서버 애플리케이션에서 수신 요청을 처리하기 위한 핵심 플러그인입니다."},{default:e(()=>t[0]||(t[0]=[n("라우팅")])),_:1}),t[5]||(t[5]=n(",")),o(d,{href:"/ktor/server-static-content",summary:"스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요."},{default:e(()=>t[1]||(t[1]=[n("정적 콘텐츠")])),_:1}),t[6]||(t[6]=n(", ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 두 가지 주요 목적을 가지고 있습니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화."},{default:e(()=>t[2]||(t[2]=[n("콘텐츠 협상")])),_:1}),t[7]||(t[7]=n(", ")),t[8]||(t[8]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),o(S,null,{default:e(()=>t[10]||(t[10]=[n(" Ktor로 RESTful API를 빌드하는 방법을 알아보세요. 이 튜토리얼은 실제 예제를 통해 설정, 라우팅 및 테스트를 다룹니다. ")])),_:1}),o(P,null,{default:e(()=>t[11]||(t[11]=[n(" Ktor로 Kotlin RESTful API를 빌드하는 방법을 알아보세요. 이 튜토리얼은 실제 예제를 통해 설정, 라우팅 및 테스트를 다룹니다. Kotlin 백엔드 개발자를 위한 이상적인 초급 튜토리얼입니다. ")])),_:1}),o(E,null,{default:e(()=>t[12]||(t[12]=[n(" Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 알아보세요. JSON 파일을 생성하는 RESTful API의 예제를 제공합니다. ")])),_:1}),t[203]||(t[203]=l("p",null," 이 튜토리얼에서는 Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법과 JSON 파일을 생성하는 RESTful API의 예제를 설명합니다. ",-1)),l("p",null,[o(d,{href:"/ktor/server-requests-and-responses",summary:"작업 관리 애플리케이션을 구축하여 Ktor와 함께 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배우세요."},{default:e(()=>t[13]||(t[13]=[n("이전 튜토리얼")])),_:1}),t[14]||(t[14]=n("에서는 유효성 검사, 오류 처리 및 단위 테스트의 기본 사항을 소개했습니다. 이 튜토리얼에서는 작업 관리를 위한 RESTful 서비스를 생성하여 이러한 주제를 확장할 것입니다. "))]),t[204]||(t[204]=l("p",null," 다음 내용을 학습하게 됩니다: ",-1)),o(f,null,{default:e(()=>[t[17]||(t[17]=l("li",null,"JSON 직렬화를 사용하는 RESTful 서비스를 생성합니다.",-1)),l("li",null,[o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 두 가지 주요 목적을 가지고 있습니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화."},{default:e(()=>t[15]||(t[15]=[n("콘텐츠 협상")])),_:1}),t[16]||(t[16]=n(" 프로세스를 이해합니다."))]),t[18]||(t[18]=l("li",null,"Ktor 내에서 REST API를 위한 경로를 정의합니다.",-1))]),_:1}),o(a,{title:"사전 준비 사항",id:"prerequisites"},{default:e(()=>[l("p",null,[t[20]||(t[20]=n("이 튜토리얼을 독립적으로 진행할 수 있지만, ")),o(d,{href:"/ktor/server-requests-and-responses",summary:"작업 관리 애플리케이션을 구축하여 Ktor와 함께 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배우세요."},{default:e(()=>t[19]||(t[19]=[n("요청을 처리하고 응답을 생성하는")])),_:1}),t[21]||(t[21]=n(" 방법을 배우기 위해 이전 튜토리얼을 완료하는 것을 강력히 권장합니다. "))]),t[22]||(t[22]=l("p",null,[l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),n("를 설치하는 것을 권장하지만, 다른 원하는 IDE를 사용할 수도 있습니다. ")],-1))]),_:1}),o(a,{title:"Hello RESTful 작업 관리자",id:"hello-restful-task-manager"},{default:e(()=>[l("p",null,[t[24]||(t[24]=n("이 튜토리얼에서는 기존 작업 관리자를 RESTful 서비스로 재작성할 것입니다. 이를 위해 여러 Ktor ")),o(d,{href:"/ktor/server-plugins",summary:"플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 일반적인 기능을 제공합니다."},{default:e(()=>t[23]||(t[23]=[n("플러그인")])),_:1}),t[25]||(t[25]=n("을 사용합니다."))]),t[62]||(t[62]=l("p",null," 기존 프로젝트에 수동으로 추가할 수도 있지만, 새 프로젝트를 생성한 다음 이전 튜토리얼의 코드를 점진적으로 추가하는 것이 더 간단합니다. 코드를 진행하면서 모든 코드를 반복하므로 이전 프로젝트를 준비할 필요가 없습니다. ",-1)),o(p,{title:"플러그인으로 새 프로젝트 생성"},{default:e(()=>[o(i,null,{default:e(()=>t[26]||(t[26]=[l("p",null,[l("a",{href:"https://start.ktor.io/"},"Ktor 프로젝트 생성기"),n("로 이동합니다. ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[27]||(t[27]=[n("Project artifact")])),_:1}),t[29]||(t[29]=n(" 필드에 ")),o(s,null,{default:e(()=>t[28]||(t[28]=[n("com.example.ktor-rest-task-app")])),_:1}),t[30]||(t[30]=n(" 를 프로젝트 아티팩트 이름으로 입력합니다. ")),t[31]||(t[31]=l("img",{src:w,alt:"Ktor 프로젝트 생성기에서 프로젝트 아티팩트 이름 지정",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[33]||(t[33]=n(" 플러그인 섹션에서 다음 플러그인을 검색하고 ")),o(m,null,{default:e(()=>t[32]||(t[32]=[n("Add")])),_:1}),t[34]||(t[34]=n(" 버튼을 클릭하여 추가합니다. "))]),o(f,{type:"bullet"},{default:e(()=>t[35]||(t[35]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1)])),_:1}),t[36]||(t[36]=l("p",null,[l("img",{src:D,alt:"Ktor 프로젝트 생성기에서 플러그인 추가","border-effect":"line",style:{},width:"706"}),n(" 플러그인을 추가하면, 프로젝트 설정 아래에 네 개의 플러그인 모두가 나열됩니다. "),l("img",{src:C,alt:"Ktor 프로젝트 생성기의 플러그인 목록","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[37]||(t[37]=[n("Download")])),_:1}),t[38]||(t[38]=n(" 버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다. "))])]),_:1})]),_:1}),o(p,{title:"시작 코드 추가",id:"add-starter-code"},{default:e(()=>[o(i,null,{default:e(()=>t[39]||(t[39]=[l("p",null,[l("a",{href:"./server-create-a-new-project#open-explore-run"},"IntelliJ IDEA에서 Ktor 프로젝트 열기, 탐색 및 실행"),n(" 튜토리얼에서 설명한 대로 IntelliJ IDEA에서 프로젝트를 엽니다.")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[40]||(t[40]=[n("src/main/kotlin/com/example")])),_:1}),t[42]||(t[42]=n(" 로 이동하여 ")),o(s,null,{default:e(()=>t[41]||(t[41]=[n("model")])),_:1}),t[43]||(t[43]=n(" 이라는 하위 패키지를 생성합니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[44]||(t[44]=[n("model")])),_:1}),t[46]||(t[46]=n(" 패키지 안에 새 ")),o(s,null,{default:e(()=>t[45]||(t[45]=[n("Task.kt")])),_:1}),t[47]||(t[47]=n(" 파일을 생성합니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[48]||(t[48]=[n("Task.kt")])),_:1}),t[49]||(t[49]=n(" 파일을 열고 우선순위를 나타내는 ")),t[50]||(t[50]=l("code",null,"enum",-1)),t[51]||(t[51]=n("과 작업을 나타내는 ")),t[52]||(t[52]=l("code",null,"class",-1)),t[53]||(t[53]=n("를 추가합니다. "))]),o(r,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[54]||(t[54]=l("p",null,[n(" 이전 튜토리얼에서는 확장 함수를 사용하여 "),l("code",null,"Task"),n("를 HTML로 변환했습니다. 이 경우, "),l("code",null,"Task"),n(" 클래스는 "),l("code",null,"kotlinx.serialization"),n(" 라이브러리의 "),l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"},[l("code",null,"Serializable")]),n(" 타입으로 어노테이션되어 있습니다. ")],-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[55]||(t[55]=[n("Routing.kt")])),_:1}),t[56]||(t[56]=n(" 파일을 열고 기존 코드를 아래 구현으로 바꿉니다. "))]),o(r,{lang:"kotlin",code:`                    package com.example

                    import com.example.model.*
                    import io.ktor.server.application.*
                    import io.ktor.server.http.content.*
                    import io.ktor.server.response.*
                    import io.ktor.server.routing.*

                    fun Application.configureRouting() {
                        routing {
                            staticResources("static", "static")

                            get("/tasks") {
                                call.respond(
                                    listOf(
                                        Task("cleaning", "Clean the house", Priority.Low),
                                        Task("gardening", "Mow the lawn", Priority.Medium),
                                        Task("shopping", "Buy the groceries", Priority.High),
                                        Task("painting", "Paint the fence", Priority.Medium)
                                    )
                                )
                            }
                        }
                    }`}),t[57]||(t[57]=l("p",null,[n(" 이전 튜토리얼과 유사하게, "),l("code",null,"/tasks"),n(" URL에 대한 GET 요청 경로를 생성했습니다. 이번에는 작업 목록을 수동으로 변환하는 대신 단순히 목록을 반환합니다. ")],-1))]),_:1}),o(i,null,{default:e(()=>t[58]||(t[58]=[l("p",null,[n("IntelliJ IDEA에서 실행 버튼 ("),l("img",{src:g,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 실행 아이콘"}),n(") 을 클릭하여 애플리케이션을 시작합니다.")],-1)])),_:1}),o(i,null,{default:e(()=>t[59]||(t[59]=[l("p",null,[n(" 브라우저에서 "),l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("로 이동합니다. 아래와 같이 작업 목록의 JSON 버전을 볼 수 있습니다. ")],-1)])),_:1}),t[60]||(t[60]=l("img",{src:N,alt:"브라우저 화면에 표시된 JSON 데이터","border-effect":"rounded",width:"706"},null,-1)),t[61]||(t[61]=l("p",null,"확실히 많은 작업이 우리를 대신하여 수행되고 있습니다. 정확히 무슨 일이 일어나고 있는 걸까요?",-1))]),_:1})]),_:1}),o(a,{title:"콘텐츠 협상 이해하기",id:"content-negotiation"},{default:e(()=>[o(a,{title:"브라우저를 통한 콘텐츠 협상",id:"via-browser"},{default:e(()=>[l("p",null,[t[65]||(t[65]=n(" 프로젝트를 생성할 때 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 두 가지 주요 목적을 가지고 있습니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화."},{default:e(()=>t[63]||(t[63]=[n("Content Negotiation")])),_:1}),t[66]||(t[66]=n(" 플러그인을 포함했습니다. 이 플러그인은 클라이언트가 렌더링할 수 있는 콘텐츠 타입을 현재 서비스가 제공할 수 있는 콘텐츠 타입과 비교하여 일치시킵니다. 따라서 ")),o(b,{style:{}},{default:e(()=>t[64]||(t[64]=[n("콘텐츠 협상")])),_:1}),t[67]||(t[67]=n("이라는 용어가 사용됩니다. "))]),t[73]||(t[73]=l("p",null,[n(" HTTP에서 클라이언트는 "),l("code",null,"Accept"),n(" 헤더를 통해 렌더링할 수 있는 콘텐츠 타입을 신호합니다. 이 헤더의 값은 하나 이상의 콘텐츠 타입입니다. 위 경우에는 브라우저에 내장된 개발 도구를 사용하여 이 헤더의 값을 검사할 수 있습니다. ")],-1)),t[74]||(t[74]=l("p",null," 다음 예시를 고려해 보세요: ",-1)),o(r,{code:"                text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}),t[75]||(t[75]=l("p",null,[l("code",null,[l("em",null,"/")]),n("의 포함에 주목하세요. 이 헤더는 HTML, XML 또는 이미지를 허용하지만, 다른 어떤 콘텐츠 타입도 허용함을 의미합니다.")],-1)),l("p",null,[t[70]||(t[70]=n("콘텐츠 협상 플러그인은 데이터를 브라우저로 다시 보내기 위한 형식을 찾아야 합니다. 프로젝트에 생성된 코드를 살펴보면 ")),o(s,null,{default:e(()=>t[68]||(t[68]=[n("src/main/kotlin/com/example")])),_:1}),t[71]||(t[71]=n(" 안에 ")),o(s,null,{default:e(()=>t[69]||(t[69]=[n("Serialization.kt")])),_:1}),t[72]||(t[72]=n(" 라는 파일이 있으며, 여기에는 다음 내용이 포함되어 있습니다. "))]),o(r,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[76]||(t[76]=l("p",null,[n(" 이 코드는 "),l("code",null,"ContentNegotiation"),n(" 플러그인을 설치하고 "),l("code",null,"kotlinx.serialization"),n(" 플러그인도 구성합니다. 이렇게 하면 클라이언트가 요청을 보낼 때 서버는 JSON으로 직렬화된 객체를 다시 보낼 수 있습니다. ")],-1)),t[77]||(t[77]=l("p",null,[n(" 브라우저에서 온 요청의 경우, "),l("code",null,"ContentNegotiation"),n(" 플러그인은 JSON만 반환할 수 있다는 것을 알고 있으며, 브라우저는 전송된 모든 것을 표시하려고 시도할 것입니다. 따라서 요청이 성공합니다. ")],-1))]),_:1}),o(p,{title:"JavaScript를 통한 콘텐츠 협상",id:"via-javascript"},{default:e(()=>[t[91]||(t[91]=l("p",null,[n(" 프로덕션 환경에서는 JSON을 브라우저에 직접 표시하고 싶지 않을 것입니다. 대신 브라우저 내에서 JavaScript 코드가 실행되어 요청을 만들고 단일 페이지 애플리케이션(SPA)의 일부로 반환된 데이터를 표시합니다. 일반적으로 이러한 종류의 애플리케이션은 "),l("a",{href:"https://react.dev/"},"React"),n(", "),l("a",{href:"https://angular.io/"},"Angular"),n(", 또는 "),l("a",{href:"https://vuejs.org/"},"Vue.js"),n("와 같은 프레임워크를 사용하여 작성됩니다. ")],-1)),o(i,null,{default:e(()=>[l("p",null,[t[80]||(t[80]=n(" 이를 시뮬레이션하기 위해, ")),o(s,null,{default:e(()=>t[78]||(t[78]=[n("src/main/resources/static")])),_:1}),t[81]||(t[81]=n(" 안에 있는 ")),o(s,null,{default:e(()=>t[79]||(t[79]=[n("index.html")])),_:1}),t[82]||(t[82]=n(" 페이지를 열고 기본 내용을 다음으로 바꿉니다. "))]),o(r,{lang:"html",code:`<html>
<head>
    <title>A Simple SPA For Tasks</title>
    <script type="application/javascript">
        function fetchAndDisplayTasks() {
            fetchTasks()
                .then(tasks => displayTasks(tasks))
        }

        function fetchTasks() {
            return fetch(
                "/tasks",
                {
                    headers: { 'Accept': 'application/json' }
                }
            ).then(resp => resp.json());
        }

        function displayTasks(tasks) {
            const tasksTableBody = document.getElementById("tasksTableBody")
            tasks.forEach(task => {
                const newRow = taskRow(task);
                tasksTableBody.appendChild(newRow);
            });
        }

        function taskRow(task) {
            return tr([
                td(task.name),
                td(task.description),
                td(task.priority)
            ]);
        }

        function tr(children) {
            const node = document.createElement("tr");
            children.forEach(child => node.appendChild(child));
            return node;
        }

        function td(text) {
            const node = document.createElement("td");
            node.appendChild(document.createTextNode(text));
            return node;
        }
    <\/script>
</head>
<body>
<h1>Viewing Tasks Via JS</h1>
<form action="javascript:fetchAndDisplayTasks()">
    <input type="submit" value="View The Tasks">
</form>
<table>
    <thead>
    <tr><th>Name</th><th>Description</th><th>Priority</th></tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),t[83]||(t[83]=l("p",null,[n(" 이 페이지에는 HTML 폼과 비어 있는 테이블이 있습니다. 폼을 제출하면 JavaScript 이벤트 핸들러가 "),l("code",null,"/tasks"),n(" 엔드포인트로 "),l("code",null,"Accept"),n(" 헤더를 "),l("code",null,"application/json"),n("으로 설정하여 요청을 보냅니다. 반환된 데이터는 역직렬화되어 HTML 테이블에 추가됩니다. ")],-1))]),_:1}),o(i,null,{default:e(()=>t[84]||(t[84]=[l("p",null,[n(" IntelliJ IDEA에서 다시 실행 버튼("),l("img",{src:y,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 다시 실행 아이콘"}),n(")을 클릭하여 애플리케이션을 재시작합니다. ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[86]||(t[86]=n(" URL ")),t[87]||(t[87]=l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1)),t[88]||(t[88]=n("로 이동합니다. ")),o(m,null,{default:e(()=>t[85]||(t[85]=[n("View The Tasks")])),_:1}),t[89]||(t[89]=n(" 버튼을 클릭하여 데이터를 가져올 수 있어야 합니다. "))]),t[90]||(t[90]=l("img",{src:R,alt:"버튼과 HTML 테이블로 표시된 작업을 보여주는 브라우저 창","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"GET 경로 추가",id:"porting-get-routes"},{default:e(()=>[l("p",null,[t[93]||(t[93]=n(" 이제 콘텐츠 협상 프로세스에 익숙해졌으므로, ")),o(d,{href:"/ktor/server-requests-and-responses",summary:"작업 관리 애플리케이션을 구축하여 Ktor와 함께 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배우세요."},{default:e(()=>t[92]||(t[92]=[n("이전 튜토리얼")])),_:1}),t[94]||(t[94]=n("의 기능을 이 튜토리얼로 이전하는 것을 계속 진행하겠습니다. "))]),o(a,{title:"작업 리포지토리 재사용",id:"task-repository"},{default:e(()=>[t[101]||(t[101]=l("p",null," 작업을 위한 리포지토리는 수정 없이 재사용할 수 있으므로 먼저 그렇게 하겠습니다. ",-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[95]||(t[95]=[n("model")])),_:1}),t[97]||(t[97]=n(" 패키지 안에 새 ")),o(s,null,{default:e(()=>t[96]||(t[96]=[n("TaskRepository.kt")])),_:1}),t[98]||(t[98]=n(" 파일을 생성합니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[99]||(t[99]=[n("TaskRepository.kt")])),_:1}),t[100]||(t[100]=n(" 를 열고 아래 코드를 추가합니다. "))]),o(r,{lang:"kotlin",code:`package com.example.model

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
        if (taskByName(task.name) != null) {
            throw IllegalStateException("Cannot duplicate task names!")
        }
        tasks.add(task)
    }
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"GET 요청 경로 재사용",id:"get-requests"},{default:e(()=>[t[110]||(t[110]=l("p",null," 이제 리포지토리를 생성했으므로 GET 요청에 대한 경로를 구현할 수 있습니다. 이전 코드는 작업을 HTML로 변환하는 것에 대해 더 이상 걱정할 필요가 없으므로 간단해질 수 있습니다. ",-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[102]||(t[102]=[n("src/main/kotlin/com/example")])),_:1}),t[104]||(t[104]=n(" 의 ")),o(s,null,{default:e(()=>t[103]||(t[103]=[n("Routing.kt")])),_:1}),t[105]||(t[105]=n(" 파일로 이동합니다. "))])]),_:1}),o(i,null,{default:e(()=>[t[107]||(t[107]=l("p",null,[l("code",null,"Application.configureRouting()"),n(" 함수 내의 "),l("code",null,"/tasks"),n(" 경로에 대한 코드를 다음 구현으로 업데이트합니다. ")],-1)),o(r,{lang:"kotlin",code:`                    package com.example

                    import com.example.model.Priority
                    import com.example.model.TaskRepository
                    import io.ktor.http.*
                    import io.ktor.server.application.*
                    import io.ktor.server.http.content.*
                    import io.ktor.server.response.*
                    import io.ktor.server.routing.*

                    fun Application.configureRouting() {
                        routing {
                            staticResources("static", "static")

                            //updated implementation
                            route("/tasks") {
                                get {
                                    val tasks = TaskRepository.allTasks()
                                    call.respond(tasks)
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
                                    call.respond(task)
                                }
                                get("/byPriority/{priority}") {
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
                                        call.respond(tasks)
                                    } catch (ex: IllegalArgumentException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    }
                                }
                            }
                        }
                    }`}),t[108]||(t[108]=l("p",null," 이를 통해 서버는 다음 GET 요청에 응답할 수 있습니다. ",-1)),o(f,null,{default:e(()=>t[106]||(t[106]=[l("li",null,[l("code",null,"/tasks"),n("는 리포지토리의 모든 작업을 반환합니다.")],-1),l("li",null,[l("code",null,"/tasks/byName/{taskName}"),n("은 지정된 "),l("code",null,"taskName"),n("으로 필터링된 작업을 반환합니다. ")],-1),l("li",null,[l("code",null,"/tasks/byPriority/{priority}"),n("는 지정된 "),l("code",null,"priority"),n("로 필터링된 작업을 반환합니다. ")],-1)])),_:1})]),_:1}),o(i,null,{default:e(()=>t[109]||(t[109]=[l("p",null,[n(" IntelliJ IDEA에서 다시 실행 버튼("),l("img",{src:y,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 다시 실행 아이콘"}),n(")을 클릭하여 애플리케이션을 재시작합니다. ")],-1)])),_:1})]),_:1})]),_:1}),o(a,{title:"기능 테스트",id:"test-tasks-routes"},{default:e(()=>[o(p,{title:"브라우저 사용"},{default:e(()=>t[111]||(t[111]=[l("p",null,[n("브라우저에서 이 경로들을 테스트할 수 있습니다. 예를 들어, "),l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n("으로 이동하여 "),l("code",null,"Medium"),n(" 우선순위를 가진 모든 작업이 JSON 형식으로 표시되는 것을 확인하세요.")],-1),l("img",{src:J,alt:"중간 우선순위를 가진 작업이 JSON 형식으로 표시된 브라우저 창","border-effect":"rounded",width:"706"},null,-1),l("p",null,[n(" 이러한 종류의 요청은 일반적으로 JavaScript에서 오기 때문에, 더 세밀한 테스트가 선호됩니다. 이를 위해 "),l("a",{href:"https://learning.postman.com/docs/sending-requests/requests/"},"Postman"),n("과 같은 전문 도구를 사용할 수 있습니다. ")],-1)])),_:1}),o(p,{title:"Postman 사용"},{default:e(()=>[o(i,null,{default:e(()=>t[112]||(t[112]=[l("p",null,[n("Postman에서 URL "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n("으로 새 GET 요청을 생성합니다.")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(k,null,{default:e(()=>t[113]||(t[113]=[n("Headers")])),_:1}),t[115]||(t[115]=n(" 창에서 ")),o(k,null,{default:e(()=>t[114]||(t[114]=[n("Accept")])),_:1}),t[116]||(t[116]=n(" 헤더의 값을 ")),t[117]||(t[117]=l("code",null,"application/json",-1)),t[118]||(t[118]=n("으로 설정합니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[119]||(t[119]=[n("Send")])),_:1}),t[120]||(t[120]=n(" 를 클릭하여 요청을 보내고 응답 뷰어에서 응답을 확인합니다. "))]),t[121]||(t[121]=l("img",{src:I,alt:"중간 우선순위를 가진 작업이 JSON 형식으로 표시된 Postman의 GET 요청","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(p,{title:"HTTP 요청 파일 사용"},{default:e(()=>[t[132]||(t[132]=l("p",null,"IntelliJ IDEA Ultimate 내에서는 HTTP 요청 파일에서 동일한 단계를 수행할 수 있습니다.",-1)),o(i,null,{default:e(()=>[l("p",null,[t[123]||(t[123]=n(" 프로젝트 루트 디렉토리에 새 ")),o(s,null,{default:e(()=>t[122]||(t[122]=[n("REST Task Manager.http")])),_:1}),t[124]||(t[124]=n(" 파일을 생성합니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[125]||(t[125]=[n("REST Task Manager.http")])),_:1}),t[126]||(t[126]=n(" 파일을 열고 다음 GET 요청을 추가합니다. "))]),o(r,{lang:"http",code:`GET http://0.0.0.0:8080/tasks/byPriority/Medium
Accept: application/json`})]),_:1}),o(i,null,{default:e(()=>t[127]||(t[127]=[l("p",null,[n(" IntelliJ IDE 내에서 요청을 보내려면 옆에 있는 거터 아이콘 ("),l("img",{alt:"IntelliJ IDEA 거터 아이콘",src:g,width:"16",height:"26"}),n(")을 클릭합니다. ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[129]||(t[129]=n("이것은 ")),o(s,null,{default:e(()=>t[128]||(t[128]=[n("Services")])),_:1}),t[130]||(t[130]=n(" 도구 창에서 열리고 실행될 것입니다. "))]),t[131]||(t[131]=l("img",{src:H,alt:"중간 우선순위를 가진 작업이 JSON 형식으로 표시된 HTTP 파일의 GET 요청","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(x,null,{default:e(()=>t[133]||(t[133]=[n(" 경로를 테스트하는 또 다른 방법은 Kotlin Notebook 내에서 "),l("a",{href:"https://khttp.readthedocs.io/en/latest/"},"khttp",-1),n(" 라이브러리를 사용하는 것입니다. ")])),_:1})]),_:1})]),_:1}),o(a,{title:"POST 요청 경로 추가",id:"add-a-route-for-post-requests"},{default:e(()=>[t[150]||(t[150]=l("p",null,[n(" 이전 튜토리얼에서는 HTML 폼을 통해 작업을 생성했습니다. 그러나 이제 RESTful 서비스를 구축하고 있으므로 더 이상 그럴 필요가 없습니다. 대신, 대부분의 작업을 수행할 "),l("code",null,"kotlinx.serialization"),n(" 프레임워크를 사용할 것입니다. ")],-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[134]||(t[134]=[n("src/main/kotlin/com/example")])),_:1}),t[136]||(t[136]=n(" 안에 있는 ")),o(s,null,{default:e(()=>t[135]||(t[135]=[n("Routing.kt")])),_:1}),t[137]||(t[137]=n(" 파일을 엽니다. "))])]),_:1}),o(i,null,{default:e(()=>[t[138]||(t[138]=l("p",null,[l("code",null,"Application.configureRouting()"),n(" 함수에 새 POST 경로를 다음과 같이 추가합니다. ")],-1)),o(r,{lang:"kotlin",code:`                    //...

                    fun Application.configureRouting() {
                        routing {
                            //...

                            route("/tasks") {
                                //...

                                //add the following new route
                                post {
                                    try {
                                        val task = call.receive<Task>()
                                        TaskRepository.addTask(task)
                                        call.respond(HttpStatusCode.Created)
                                    } catch (ex: IllegalStateException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    } catch (ex: SerializationException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    }
                                }
                            }
                        }
                    }`}),t[139]||(t[139]=l("p",null," 다음 새 임포트를 추가합니다. ",-1)),o(r,{lang:"kotlin",code:`                    //...
                    import com.example.model.Task
                    import io.ktor.serialization.*
                    import io.ktor.server.request.*`}),t[140]||(t[140]=l("p",null,[n(" POST 요청이 "),l("code",null,"/tasks"),n("로 전송될 때 "),l("code",null,"kotlinx.serialization"),n(" 프레임워크는 요청 본문을 "),l("code",null,"Task"),n(" 객체로 변환하는 데 사용됩니다. 이 작업이 성공하면 태스크가 리포지토리에 추가됩니다. 역직렬화 프로세스가 실패하면 서버는 "),l("code",null,"SerializationException"),n("을 처리해야 하며, 작업이 중복인 경우 "),l("code",null,"IllegalStateException"),n("을 처리해야 합니다. ")],-1))]),_:1}),o(i,null,{default:e(()=>t[141]||(t[141]=[l("p",null," 애플리케이션을 재시작합니다. ",-1)])),_:1}),o(i,null,{default:e(()=>t[142]||(t[142]=[l("p",null,[n(" 이 기능을 Postman에서 테스트하려면 URL "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("로 새 POST 요청을 생성합니다. ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(k,null,{default:e(()=>t[143]||(t[143]=[n("Body")])),_:1}),t[144]||(t[144]=n(" 창에 새 작업을 나타내는 다음 JSON 문서를 추가합니다. "))]),o(r,{lang:"json",code:`{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`}),t[145]||(t[145]=l("img",{src:j,alt:"새 작업을 추가하기 위한 Postman의 POST 요청","border-effect":"line",width:"706"},null,-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[146]||(t[146]=[n("Send")])),_:1}),t[147]||(t[147]=n(" 를 클릭하여 요청을 보냅니다. "))])]),_:1}),o(i,null,{default:e(()=>t[148]||(t[148]=[l("p",null,[l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("로 GET 요청을 보내 작업을 추가했는지 확인할 수 있습니다. ")],-1)])),_:1}),o(i,null,{default:e(()=>[t[149]||(t[149]=l("p",null," IntelliJ IDEA Ultimate 내에서 HTTP 요청 파일에 다음을 추가하여 동일한 단계를 수행할 수 있습니다. ",-1)),o(r,{lang:"http",code:`###

POST http://0.0.0.0:8080/tasks
Content-Type: application/json

{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"삭제 지원 추가",id:"remove-tasks"},{default:e(()=>[t[165]||(t[165]=l("p",null," 서비스에 기본 작업을 거의 다 추가했습니다. 이들은 종종 CRUD 작업(Create, Read, Update, Delete의 약자)으로 요약됩니다. 이제 삭제 작업을 구현할 것입니다. ",-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[151]||(t[151]=[n("TaskRepository.kt")])),_:1}),t[152]||(t[152]=n(" 파일에 ")),t[153]||(t[153]=l("code",null,"TaskRepository",-1)),t[154]||(t[154]=n(" 객체 내부에 이름으로 작업을 제거하는 다음 메서드를 추가합니다. "))]),o(r,{lang:"kotlin",code:`    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }`})]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[155]||(t[155]=[n("Routing.kt")])),_:1}),t[156]||(t[156]=n(" 파일을 열고 ")),t[157]||(t[157]=l("code",null,"routing()",-1)),t[158]||(t[158]=n(" 함수에 DELETE 요청을 처리하는 엔드포인트를 추가합니다. "))]),o(r,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        //...

                        routing {
                            route("/tasks") {
                                //...
                                //add the following function
                                delete("/{taskName}") {
                                    val name = call.parameters["taskName"]
                                    if (name == null) {
                                        call.respond(HttpStatusCode.BadRequest)
                                        return@delete
                                    }

                                    if (TaskRepository.removeTask(name)) {
                                        call.respond(HttpStatusCode.NoContent)
                                    } else {
                                        call.respond(HttpStatusCode.NotFound)
                                    }
                                }
                            }
                        }
                    }`})]),_:1}),o(i,null,{default:e(()=>t[159]||(t[159]=[l("p",null," 애플리케이션을 재시작합니다. ",-1)])),_:1}),o(i,null,{default:e(()=>[t[160]||(t[160]=l("p",null," HTTP 요청 파일에 다음 DELETE 요청을 추가합니다. ",-1)),o(r,{lang:"http",code:`###

DELETE http://0.0.0.0:8080/tasks/gardening`})]),_:1}),o(i,null,{default:e(()=>t[161]||(t[161]=[l("p",null,[n(" IntelliJ IDE 내에서 DELETE 요청을 보내려면 옆에 있는 거터 아이콘 ("),l("img",{alt:"IntelliJ IDEA 거터 아이콘",src:g,width:"16",height:"26"}),n(")을 클릭합니다. ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[162]||(t[162]=[n("Services")])),_:1}),t[163]||(t[163]=n(" 도구 창에서 응답을 확인할 수 있습니다. "))]),t[164]||(t[164]=l("img",{src:q,alt:"HTTP 요청 파일의 DELETE 요청","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"Ktor 클라이언트로 단위 테스트 생성",id:"create-unit-tests"},{default:e(()=>[l("p",null,[t[167]||(t[167]=n(" 지금까지 애플리케이션을 수동으로 테스트했지만, 이미 알다시피 이 방법은 시간이 많이 걸리고 확장성이 없습니다. 대신 내장된 ")),t[168]||(t[168]=l("code",null,"client",-1)),t[169]||(t[169]=n(" 객체를 사용하여 JSON을 가져오고 역직렬화하는 ")),o(d,{href:"/ktor/server-testing",summary:"특수 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요."},{default:e(()=>t[166]||(t[166]=[n("JUnit 테스트")])),_:1}),t[170]||(t[170]=n("를 구현할 수 있습니다. "))]),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[171]||(t[171]=[n("src/test/kotlin/com/example")])),_:1}),t[173]||(t[173]=n(" 내의 ")),o(s,null,{default:e(()=>t[172]||(t[172]=[n("ApplicationTest.kt")])),_:1}),t[174]||(t[174]=n(" 파일을 엽니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[175]||(t[175]=[n("ApplicationTest.kt")])),_:1}),t[176]||(t[176]=n(" 파일의 내용을 다음으로 바꿉니다. "))]),o(r,{lang:"kotlin",code:`package com.example

import com.example.model.Priority
import com.example.model.Task
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application {
            module()
        }
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val response = client.get("/tasks/byPriority/Medium")
        val results = response.body<List<Task>>()

        assertEquals(HttpStatusCode.OK, response.status)

        val expectedTaskNames = listOf("gardening", "painting")
        val actualTaskNames = results.map(Task::name)
        assertContentEquals(expectedTaskNames, actualTaskNames)
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

    @Test
    fun newTasksCanBeAdded() = testApplication {
        application {
            module()
        }
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val task = Task("swimming", "Go to the beach", Priority.Low)
        val response1 = client.post("/tasks") {
            header(
                HttpHeaders.ContentType,
                ContentType.Application.Json
            )

            setBody(task)
        }
        assertEquals(HttpStatusCode.Created, response1.status)

        val response2 = client.get("/tasks")
        assertEquals(HttpStatusCode.OK, response2.status)

        val taskNames = response2
            .body<List<Task>>()
            .map { it.name }

        assertContains(taskNames, "swimming")
    }
}`}),t[177]||(t[177]=l("p",null,[n(" 서버에서와 동일하게 "),l("a",{href:"./client-create-and-configure#plugins"},"플러그인"),n("에 "),l("code",null,"ContentNegotiation"),n(" 및 "),l("code",null,"kotlinx.serialization"),n(" 플러그인을 설치해야 합니다. ")],-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[178]||(t[178]=[n("gradle/libs.versions.toml")])),_:1}),t[179]||(t[179]=n("에 있는 버전 카탈로그에 다음 의존성을 추가합니다. "))]),o(r,{lang:"yaml",code:`                    [libraries]
                    # ...
                    ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[181]||(t[181]=n(" 새 의존성을 ")),o(s,null,{default:e(()=>t[180]||(t[180]=[n("build.gradle.kts")])),_:1}),t[182]||(t[182]=n(" 파일에 추가합니다. "))]),o(r,{lang:"kotlin",code:"                    testImplementation(libs.ktor.client.content.negotiation)"})]),_:1})]),_:1})]),_:1}),o(a,{title:"JsonPath를 사용한 단위 테스트 생성",id:"unit-tests-via-jsonpath"},{default:e(()=>[t[197]||(t[197]=l("p",null," Ktor 클라이언트 또는 유사한 라이브러리를 사용하여 서비스를 테스트하는 것은 편리하지만, 품질 보증(QA) 관점에서 단점이 있습니다. JSON을 직접 처리하지 않는 서버는 JSON 구조에 대한 가정을 확신할 수 없습니다. ",-1)),t[198]||(t[198]=l("p",null," 예를 들어, 다음과 같은 가정입니다. ",-1)),o(f,null,{default:e(()=>t[183]||(t[183]=[l("li",null,[n("값이 실제로는 "),l("code",null,"object"),n("인데 "),l("code",null,"array"),n("에 저장되는 경우.")],-1),l("li",null,[n("속성이 실제로는 "),l("code",null,"string"),n("인데 "),l("code",null,"number"),n("로 저장되는 경우.")],-1),l("li",null,"멤버가 선언 순서대로 직렬화되지 않는 경우.",-1)])),_:1}),t[199]||(t[199]=l("p",null,[n(" 서비스가 여러 클라이언트에서 사용될 예정이라면, JSON 구조에 대한 확신을 갖는 것이 중요합니다. 이를 위해 Ktor 클라이언트를 사용하여 서버에서 텍스트를 검색한 다음 "),l("a",{href:"https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path"},"JSONPath"),n(" 라이브러리를 사용하여 이 콘텐츠를 분석합니다.")],-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[184]||(t[184]=[n("build.gradle.kts")])),_:1}),t[185]||(t[185]=n(" 파일의 ")),t[186]||(t[186]=l("code",null,"dependencies",-1)),t[187]||(t[187]=n(" 블록에 JSONPath 라이브러리를 추가합니다. "))]),o(r,{lang:"kotlin",code:'    testImplementation("com.jayway.jsonpath:json-path:2.9.0")'})]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[188]||(t[188]=[n("src/test/kotlin/com/example")])),_:1}),t[190]||(t[190]=n(" 폴더로 이동하여 새 ")),o(s,null,{default:e(()=>t[189]||(t[189]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[191]||(t[191]=n(" 파일을 생성합니다. "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[192]||(t[192]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[193]||(t[193]=n(" 파일을 열고 다음 내용을 추가합니다. "))]),o(r,{lang:"kotlin",code:`package com.example

import com.jayway.jsonpath.DocumentContext
import com.jayway.jsonpath.JsonPath
import io.ktor.client.*
import com.example.model.Priority
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*


class ApplicationJsonPathTest {
    @Test
    fun tasksCanBeFound() = testApplication {
        application {
            module()
        }
        val jsonDoc = client.getAsJsonPath("/tasks")

        val result: List<String> = jsonDoc.read("$[*].name")
        assertEquals("cleaning", result[0])
        assertEquals("gardening", result[1])
        assertEquals("shopping", result[2])
    }

    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application {
            module()
        }
        val priority = Priority.Medium
        val jsonDoc = client.getAsJsonPath("/tasks/byPriority/$priority")

        val result: List<String> =
            jsonDoc.read("$[?(@.priority == '$priority')].name")
        assertEquals(2, result.size)

        assertEquals("gardening", result[0])
        assertEquals("painting", result[1])
    }

    suspend fun HttpClient.getAsJsonPath(url: String): DocumentContext {
        val response = this.get(url) {
            accept(ContentType.Application.Json)
        }
        return JsonPath.parse(response.bodyAsText())
    }
}`}),t[195]||(t[195]=l("p",null," JsonPath 쿼리는 다음과 같이 작동합니다. ",-1)),o(f,null,{default:e(()=>t[194]||(t[194]=[l("li",null,[l("code",null,"$[*].name"),n('은 "문서를 배열로 처리하고 각 항목의 이름 속성 값을 반환하라"는 의미입니다. ')],-1),l("li",null,[l("code",null,"$[?(@.priority == '$priority')].name"),n('은 "배열에서 주어진 값과 우선순위가 같은 모든 항목의 이름 속성 값을 반환하라"는 의미입니다. ')],-1)])),_:1}),t[196]||(t[196]=l("p",null," 이러한 쿼리를 사용하여 반환된 JSON에 대한 이해를 확인할 수 있습니다. 코드를 리팩터링하고 서비스를 재배포할 때, 현재 프레임워크와의 역직렬화를 방해하지 않더라도 직렬화의 모든 변경 사항이 식별됩니다. 이를 통해 공개적으로 사용 가능한 API를 확신을 가지고 다시 게시할 수 있습니다. ",-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"다음 단계",id:"next-steps"},{default:e(()=>[t[202]||(t[202]=l("p",null," 축하합니다! 이제 작업 관리자 애플리케이션을 위한 RESTful API 서비스 생성을 완료했으며 Ktor 클라이언트 및 JsonPath를 사용한 단위 테스트의 모든 세부 사항을 학습했습니다. ",-1)),l("p",null,[o(d,{href:"/ktor/server-create-website",summary:"Kotlin과 Ktor 및 Thymeleaf 템플릿으로 웹사이트를 구축하는 방법을 알아보세요."},{default:e(()=>t[200]||(t[200]=[n("다음 튜토리얼")])),_:1}),t[201]||(t[201]=n("로 이동하여 API 서비스를 재사용하여 웹 애플리케이션을 구축하는 방법을 알아보세요. "))])]),_:1})]),_:1})])}const _=K(L,[["render",M]]);export{Z as __pageData,_ as default};
