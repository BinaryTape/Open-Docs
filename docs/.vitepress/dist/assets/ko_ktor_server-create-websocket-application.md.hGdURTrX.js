import{_ as w,a as v,b as C,c as x,d as A}from"./chunks/tutorial_server_websockets_iteration_2_test.BE55vRda.js";import{_ as W}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as P}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as R}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as N}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as L,C as u,c as K,o as E,G as e,w as o,j as l,a as t}from"./chunks/framework.Bksy39di.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-create-websocket-application.md","filePath":"ko/ktor/server-create-websocket-application.md","lastUpdated":1755457140000}'),z={name:"ko/ktor/server-create-websocket-application.md"};function I(J,n,D,M,O,B){const f=u("show-structure"),r=u("Links"),g=u("tldr"),T=u("card-summary"),b=u("link-summary"),S=u("web-summary"),k=u("list"),d=u("chapter"),s=u("step"),p=u("control"),i=u("Path"),m=u("procedure"),a=u("code-block"),y=u("topic");return E(),K("div",null,[e(y,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Ktor를 사용하여 Kotlin에서 WebSocket 애플리케이션 생성",id:"server-create-websocket-application"},{default:o(()=>[e(f,{for:"chapter",depth:"2"}),e(g,null,{default:o(()=>[n[11]||(n[11]=l("p",null,[l("b",null,"코드 예시"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-websockets"}," tutorial-server-websockets ")],-1)),l("p",null,[n[4]||(n[4]=l("b",null,"사용된 플러그인",-1)),n[5]||(n[5]=t(": ")),e(r,{href:"/ktor/server-routing",summary:"라우팅은 서버 애플리케이션에서 들어오는 요청을 처리하기 위한 핵심 플러그인입니다."},{default:o(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[6]||(n[6]=t(",")),e(r,{href:"/ktor/server-static-content",summary:"스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요."},{default:o(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[7]||(n[7]=t(", ")),e(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 유형 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다."},{default:o(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[8]||(n[8]=t(", ")),e(r,{href:"/ktor/server-websockets",summary:"WebSockets 플러그인을 사용하면 서버와 클라이언트 간에 다중 통신 세션을 생성할 수 있습니다."},{default:o(()=>n[3]||(n[3]=[t("WebSockets in Ktor Server")])),_:1}),n[9]||(n[9]=t(", ")),n[10]||(n[10]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),e(T,null,{default:o(()=>n[12]||(n[12]=[t(" WebSocket의 강력한 기능을 활용하여 콘텐츠를 송수신하는 방법을 알아보세요. ")])),_:1}),e(b,null,{default:o(()=>n[13]||(n[13]=[t(" WebSocket의 강력한 기능을 활용하여 콘텐츠를 송수신하는 방법을 알아보세요. ")])),_:1}),e(S,null,{default:o(()=>n[14]||(n[14]=[t(" Ktor를 사용하여 Kotlin에서 WebSocket 애플리케이션을 구축하는 방법을 알아보세요. 이 튜토리얼은 WebSocket을 통해 백엔드 서비스를 클라이언트와 연결하는 과정을 안내합니다. ")])),_:1}),l("p",null,[n[16]||(n[16]=t(" 이 글은 Ktor를 사용하여 Kotlin에서 WebSocket 애플리케이션을 생성하는 과정을 안내합니다. 이 내용은 ")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하고 JSON 파일을 생성하는 RESTful API의 예시를 통해 알아보세요."},{default:o(()=>n[15]||(n[15]=[t("RESTful API 생성")])),_:1}),n[17]||(n[17]=t(" 튜토리얼에서 다룬 내용을 기반으로 합니다. "))]),n[172]||(n[172]=l("p",null,"이 글에서는 다음을 수행하는 방법을 알려드립니다:",-1)),e(k,null,{default:o(()=>n[18]||(n[18]=[l("li",null,"JSON 직렬화를 사용하는 서비스 생성.",-1),l("li",null,"WebSocket 연결을 통해 콘텐츠 송수신.",-1),l("li",null,"여러 클라이언트에 동시에 콘텐츠 브로드캐스트.",-1)])),_:1}),e(d,{title:"사전 준비",id:"prerequisites"},{default:o(()=>[l("p",null,[n[21]||(n[21]=t("이 튜토리얼은 독립적으로 수행할 수 있지만, ")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하고 JSON 파일을 생성하는 RESTful API의 예시를 통해 알아보세요."},{default:o(()=>n[19]||(n[19]=[t("RESTful API 생성")])),_:1}),n[22]||(n[22]=t(" 튜토리얼을 완료하여 ")),e(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 유형 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다."},{default:o(()=>n[20]||(n[20]=[t("Content Negotiation")])),_:1}),n[23]||(n[23]=t(" 및 REST에 익숙해지는 것을 권장합니다. "))]),n[24]||(n[24]=l("p",null,[t("IntelliJ IDEA 설치를 권장하지만, "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"원하는 다른 IDE를 사용할 수도 있습니다. ")],-1))]),_:1}),e(d,{title:"Hello WebSockets",id:"hello-websockets"},{default:o(()=>[l("p",null,[n[27]||(n[27]=t(" 이 튜토리얼에서는 ")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하고 JSON 파일을 생성하는 RESTful API의 예시를 통해 알아보세요."},{default:o(()=>n[25]||(n[25]=[t("RESTful API 생성")])),_:1}),n[28]||(n[28]=t(" 튜토리얼에서 개발된 Task Manager 서비스에 WebSocket 연결을 통해 ")),n[29]||(n[29]=l("code",null,"Task",-1)),n[30]||(n[30]=t(" 객체를 클라이언트와 교환하는 기능을 추가하여 개발을 이어나갈 것입니다. 이를 위해 ")),e(r,{href:"/ktor/server-websockets",summary:"WebSockets 플러그인을 사용하면 서버와 클라이언트 간에 다중 통신 세션을 생성할 수 있습니다."},{default:o(()=>n[26]||(n[26]=[t("WebSockets 플러그인")])),_:1}),n[31]||(n[31]=t("을 추가해야 합니다. 기존 프로젝트에 수동으로 추가할 수도 있지만, 이 튜토리얼에서는 새 프로젝트를 생성하여 처음부터 시작하겠습니다. "))]),e(d,{title:"플러그인을 사용하여 초기 프로젝트 생성",id:"create=project"},{default:o(()=>[e(m,null,{default:o(()=>[e(s,null,{default:o(()=>n[32]||(n[32]=[l("p",null,[l("a",{href:"https://start.ktor.io/"},"Ktor 프로젝트 생성기"),t("로 이동합니다. ")],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(p,null,{default:o(()=>n[33]||(n[33]=[t("프로젝트 아티팩트")])),_:1}),n[35]||(n[35]=t(" 필드에 프로젝트 아티팩트 이름으로 ")),e(i,null,{default:o(()=>n[34]||(n[34]=[t("com.example.ktor-websockets-task-app")])),_:1}),n[36]||(n[36]=t("을 입력합니다. ")),n[37]||(n[37]=l("img",{src:w,alt:"Ktor 프로젝트 생성기에서 프로젝트 아티팩트 이름 지정","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[39]||(n[39]=t(" 플러그인 섹션에서 다음 플러그인을 검색하여 ")),e(p,null,{default:o(()=>n[38]||(n[38]=[t("추가")])),_:1}),n[40]||(n[40]=t(" 버튼을 클릭하여 추가합니다: "))]),e(k,{type:"bullet"},{default:o(()=>n[41]||(n[41]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"WebSockets",-1),l("li",null,"Static Content",-1)])),_:1}),n[42]||(n[42]=l("p",null,[l("img",{src:W,alt:"Ktor 프로젝트 생성기에서 플러그인 추가","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[44]||(n[44]=t(" 플러그인을 추가한 후, 플러그인 섹션 오른쪽 상단에 있는 ")),e(p,null,{default:o(()=>n[43]||(n[43]=[t("5개 플러그인")])),_:1}),n[45]||(n[45]=t(" 버튼을 클릭하여 추가된 플러그인을 표시합니다. "))]),n[46]||(n[46]=l("p",null,[t("그러면 프로젝트에 추가될 모든 플러그인 목록이 표시됩니다: "),l("img",{src:v,alt:"Ktor 프로젝트 생성기의 플러그인 목록","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(p,null,{default:o(()=>n[47]||(n[47]=[t("다운로드")])),_:1}),n[48]||(n[48]=t(" 버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다. "))])]),_:1})]),_:1})]),_:1}),e(d,{title:"초기 코드 추가",id:"add-starter-code"},{default:o(()=>[n[100]||(n[100]=l("p",null,"다운로드가 완료되면 IntelliJ IDEA에서 프로젝트를 열고 다음 단계를 따르세요:",-1)),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[49]||(n[49]=[t("src/main/kotlin")])),_:1}),n[51]||(n[51]=t("으로 이동하여 ")),e(i,null,{default:o(()=>n[50]||(n[50]=[t("model")])),_:1}),n[52]||(n[52]=t("이라는 새 서브 패키지를 생성합니다. "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[53]||(n[53]=[t("model")])),_:1}),n[55]||(n[55]=t(" 패키지 내에 새 ")),e(i,null,{default:o(()=>n[54]||(n[54]=[t("Task.kt")])),_:1}),n[56]||(n[56]=t(" 파일을 생성합니다. "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[57]||(n[57]=[t("Task.kt")])),_:1}),n[58]||(n[58]=t(" 파일을 열고 우선순위를 나타내는 ")),n[59]||(n[59]=l("code",null,"enum",-1)),n[60]||(n[60]=t("과 작업을 나타내는 ")),n[61]||(n[61]=l("code",null,"data class",-1)),n[62]||(n[62]=t("를 추가합니다: "))]),e(a,{lang:"kotlin",code:`package model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),n[68]||(n[68]=l("p",null,[l("code",null,"Task"),t(" 클래스는 "),l("code",null,"kotlinx.serialization"),t(" 라이브러리의 "),l("code",null,"Serializable"),t(" 타입으로 어노테이션되어 있습니다. 이는 인스턴스가 JSON으로 변환되고 JSON에서 변환될 수 있음을 의미하며, 네트워크를 통해 내용을 전송할 수 있도록 합니다. ")],-1)),l("p",null,[n[65]||(n[65]=t(" WebSockets 플러그인을 포함했으므로, ")),e(i,null,{default:o(()=>n[63]||(n[63]=[t("src/main/kotlin/com/example/plugins")])),_:1}),n[66]||(n[66]=t(" 내에 ")),e(i,null,{default:o(()=>n[64]||(n[64]=[t("Sockets.kt")])),_:1}),n[67]||(n[67]=t(" 파일이 생성되었습니다. "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[69]||(n[69]=[t("Sockets.kt")])),_:1}),n[70]||(n[70]=t(" 파일을 열고 기존 ")),n[71]||(n[71]=l("code",null,"Application.configureSockets()",-1)),n[72]||(n[72]=t(" 함수를 아래 구현으로 바꿉니다: "))]),e(a,{lang:"kotlin",code:`                        fun Application.configureSockets() {
                            install(WebSockets) {
                                contentConverter = KotlinxWebsocketSerializationConverter(Json)
                                pingPeriod = 15.seconds
                                timeout = 15.seconds
                                maxFrameSize = Long.MAX_VALUE
                                masking = false
                            }

                            routing {
                                webSocket("/tasks") {
                                    val tasks = listOf(
                                        Task("cleaning", "Clean the house", Priority.Low),
                                        Task("gardening", "Mow the lawn", Priority.Medium),
                                        Task("shopping", "Buy the groceries", Priority.High),
                                        Task("painting", "Paint the fence", Priority.Medium)
                                    )

                                    for (task in tasks) {
                                        sendSerialized(task)
                                        delay(1000)
                                    }

                                    close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                                }
                            }
                        }`}),n[86]||(n[86]=l("p",null," 이 코드에서는 다음 단계가 수행됩니다: ",-1)),e(k,{type:"decimal"},{default:o(()=>n[73]||(n[73]=[l("li",null,"WebSockets 플러그인이 설치되고 표준 설정으로 구성됩니다.",-1),l("li",null,[l("code",null,"contentConverter"),t(" 속성이 설정되어 플러그인이 "),l("a",{href:"https://github.com/Kotlin/kotlinx.serialization"},"kotlinx.serialization"),t(" 라이브러리를 통해 송수신되는 객체를 직렬화할 수 있도록 합니다. ")],-1),l("li",null,[t("라우팅은 상대 URL이 "),l("code",null,"/tasks"),t("인 단일 엔드포인트로 구성됩니다. ")],-1),l("li",null,"요청을 받으면 작업 목록이 WebSocket 연결을 통해 직렬화됩니다.",-1),l("li",null,"모든 항목이 전송되면 서버는 연결을 닫습니다.",-1)])),_:1}),l("p",null,[n[76]||(n[76]=t(" 시연 목적으로, 작업을 전송하는 사이에 1초 지연이 도입됩니다. 이를 통해 클라이언트에서 작업이 점진적으로 나타나는 것을 관찰할 수 있습니다. 이 지연이 없으면 예시는 이전 글에서 개발된 ")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하고 JSON 파일을 생성하는 RESTful API의 예시를 통해 알아보세요."},{default:o(()=>n[74]||(n[74]=[t("RESTful 서비스")])),_:1}),n[77]||(n[77]=t(" 및 ")),e(r,{href:"/ktor/server-create-website",summary:"Ktor와 Thymeleaf 템플릿을 사용하여 Kotlin에서 웹사이트를 구축하는 방법을 알아보세요."},{default:o(()=>n[75]||(n[75]=[t("웹 애플리케이션")])),_:1}),n[78]||(n[78]=t("과 동일하게 보일 것입니다. "))]),l("p",null,[n[82]||(n[82]=t(" 이 반복의 마지막 단계는 이 엔드포인트에 대한 클라이언트를 생성하는 것입니다. ")),e(r,{href:"/ktor/server-static-content",summary:"스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요."},{default:o(()=>n[79]||(n[79]=[t("Static Content")])),_:1}),n[83]||(n[83]=t(" 플러그인을 포함했기 때문에, ")),e(i,null,{default:o(()=>n[80]||(n[80]=[t("src/main/resources/static")])),_:1}),n[84]||(n[84]=t(" 내에 ")),e(i,null,{default:o(()=>n[81]||(n[81]=[t("index.html")])),_:1}),n[85]||(n[85]=t(" 파일이 생성되었습니다. "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[87]||(n[87]=[t("index.html")])),_:1}),n[88]||(n[88]=t(" 파일을 열고 기존 내용을 다음으로 바꿉니다: "))]),e(a,{lang:"html",code:`<html>
<head>
    <title>Using Ktor WebSockets</title>
    <script>
        function readAndDisplayAllTasks() {
            clearTable();

            const serverURL = 'ws://0.0.0.0:8080/tasks';
            const socket = new WebSocket(serverURL);

            socket.onopen = logOpenToConsole;
            socket.onclose = logCloseToConsole;
            socket.onmessage = readAndDisplayTask;
        }

        function readAndDisplayTask(event) {
            let task = JSON.parse(event.data);
            logTaskToConsole(task);
            addTaskToTable(task);
        }

        function logTaskToConsole(task) {
            console.log(\`Received \${task.name}\`);
        }

        function logCloseToConsole() {
            console.log("Web socket connection closed");
        }

        function logOpenToConsole() {
            console.log("Web socket connection opened");
        }

        function tableBody() {
            return document.getElementById("tasksTableBody");
        }

        function clearTable() {
            tableBody().innerHTML = "";
        }

        function addTaskToTable(task) {
            tableBody().appendChild(taskRow(task));
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
<h1>Viewing Tasks Via WebSockets</h1>
<form action="javascript:readAndDisplayAllTasks()">
    <input type="submit" value="View The Tasks">
</form>
<table rules="all">
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),n[89]||(n[89]=l("p",null,[t(" 이 페이지는 모든 최신 브라우저에서 사용 가능한 "),l("a",{href:"https://websockets.spec.whatwg.org//#websocket"},"WebSocket 유형"),t("을 사용합니다. JavaScript에서 이 객체를 생성하고, 엔드포인트의 URL을 생성자에 전달합니다. 이어서 "),l("code",null,"onopen"),t(", "),l("code",null,"onclose"),t(", "),l("code",null,"onmessage"),t(" 이벤트에 대한 이벤트 핸들러를 연결합니다. "),l("code",null,"onmessage"),t(" 이벤트가 트리거되면, 문서 객체의 메서드를 사용하여 테이블에 행을 추가합니다. ")],-1))]),_:1}),e(s,null,{default:o(()=>n[90]||(n[90]=[l("p",null,[t("IntelliJ IDEA에서 실행 버튼 ("),l("img",{src:P,style:{},height:"16",width:"16",alt:"intelliJ IDEA 실행 아이콘"}),t(") 을 클릭하여 애플리케이션을 시작합니다.")],-1)])),_:1}),e(s,null,{default:o(()=>[n[96]||(n[96]=l("p",null,[l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t("으로 이동합니다. 버튼 하나와 비어 있는 테이블이 있는 폼이 표시되어야 합니다: ")],-1)),n[97]||(n[97]=l("img",{src:C,alt:"버튼 하나가 있는 HTML 폼을 표시하는 웹 브라우저 페이지","border-effect":"rounded",width:"706"},null,-1)),l("p",null,[n[93]||(n[93]=t(" 폼을 클릭하면 작업이 서버에서 로드되어 초당 하나씩 나타납니다. 결과적으로 테이블은 점진적으로 채워집니다. 브라우저의 ")),e(p,null,{default:o(()=>n[91]||(n[91]=[t("개발자 도구")])),_:1}),n[94]||(n[94]=t("에서 ")),e(p,null,{default:o(()=>n[92]||(n[92]=[t("JavaScript 콘솔")])),_:1}),n[95]||(n[95]=t("을 열어 로그 메시지를 볼 수도 있습니다. "))]),n[98]||(n[98]=l("img",{src:x,alt:"버튼 클릭 시 목록 항목을 표시하는 웹 브라우저 페이지","border-effect":"rounded",width:"706"},null,-1)),n[99]||(n[99]=l("p",null," 이로써 서비스가 예상대로 작동하고 있음을 확인할 수 있습니다. WebSocket 연결이 열리고, 항목이 클라이언트로 전송된 다음, 연결이 닫힙니다. 기본 네트워킹에는 많은 복잡성이 있지만, Ktor는 기본적으로 이 모든 것을 처리합니다. ",-1))]),_:1})]),_:1})]),_:1})]),_:1}),e(d,{title:"WebSocket 이해하기",id:"understanding-websockets"},{default:o(()=>[n[102]||(n[102]=l("p",null,[t(" 다음 반복으로 넘어가기 전에 WebSocket의 몇 가지 기본 사항을 검토하는 것이 도움이 될 수 있습니다. 이미 WebSocket에 익숙하다면, "),l("a",{href:"#improve-design"},"서비스 디자인 개선"),t("으로 계속 진행할 수 있습니다. ")],-1)),n[103]||(n[103]=l("p",null," 이전 튜토리얼에서는 클라이언트가 HTTP 요청을 보내고 HTTP 응답을 받았습니다. 이는 잘 작동하며 인터넷이 확장 가능하고 탄력적일 수 있도록 합니다. ",-1)),n[104]||(n[104]=l("p",null,"하지만 다음 시나리오에는 적합하지 않습니다:",-1)),e(k,null,{default:o(()=>n[101]||(n[101]=[l("li",null,"콘텐츠가 시간에 따라 점진적으로 생성되는 경우.",-1),l("li",null,"이벤트에 따라 콘텐츠가 자주 변경되는 경우.",-1),l("li",null,"클라이언트가 콘텐츠가 생성될 때 서버와 상호 작용해야 하는 경우.",-1),l("li",null,"한 클라이언트가 보낸 데이터가 다른 클라이언트에 빠르게 전파되어야 하는 경우.",-1)])),_:1}),n[105]||(n[105]=l("p",null," 이러한 시나리오의 예로는 주식 거래, 영화 및 콘서트 티켓 구매, 온라인 경매 입찰, 소셜 미디어의 채팅 기능 등이 있습니다. WebSocket은 이러한 상황을 처리하기 위해 개발되었습니다. ",-1)),n[106]||(n[106]=l("p",null," WebSocket 연결은 TCP를 통해 설정되며 장기간 지속될 수 있습니다. 이 연결은 '전이중 통신'을 제공하며, 클라이언트가 서버에 메시지를 보내고 동시에 서버로부터 메시지를 받을 수 있음을 의미합니다. ",-1)),n[107]||(n[107]=l("p",null,[t(" WebSocket API는 네 가지 이벤트(open, message, close, error)와 두 가지 액션(send, close)을 정의합니다. 이 기능에 접근하는 방법은 언어 및 라이브러리마다 다를 수 있습니다. 예를 들어, Kotlin에서는 들어오는 메시지 시퀀스를 "),l("a",{href:"https://kotlinlang.org/docs/flow.html"},"Flow"),t("로 사용할 수 있습니다. ")],-1))]),_:1}),e(d,{title:"디자인 개선",id:"improve-design"},{default:o(()=>[n[122]||(n[122]=l("p",null,"다음으로, 더 고급 예제를 위한 공간을 만들기 위해 기존 코드를 리팩터링할 것입니다.",-1)),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[108]||(n[108]=[t("model")])),_:1}),n[110]||(n[110]=t(" 패키지에 새 ")),e(i,null,{default:o(()=>n[109]||(n[109]=[t("TaskRepository.kt")])),_:1}),n[111]||(n[111]=t(" 파일을 생성합니다. "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[112]||(n[112]=[t("TaskRepository.kt")])),_:1}),n[113]||(n[113]=t("를 열고 ")),n[114]||(n[114]=l("code",null,"TaskRepository",-1)),n[115]||(n[115]=t(" 타입을 추가합니다: "))]),e(a,{lang:"kotlin",code:`package model

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

    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }
}`}),n[116]||(n[116]=l("p",null,"이전 튜토리얼에서 이 코드를 보셨을 수도 있습니다.",-1))]),_:1}),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[117]||(n[117]=[t("plugins")])),_:1}),n[119]||(n[119]=t(" 패키지로 이동하여 ")),e(i,null,{default:o(()=>n[118]||(n[118]=[t("Sockets.kt")])),_:1}),n[120]||(n[120]=t(" 파일을 엽니다. "))]),_:1}),e(s,null,{default:o(()=>[n[121]||(n[121]=l("p",null,[t(" 이제 "),l("code",null,"TaskRepository"),t("를 활용하여 "),l("code",null,"Application.configureSockets()"),t("의 라우팅을 단순화할 수 있습니다: ")],-1)),e(a,{lang:"kotlin",code:`                    routing {
                        webSocket("/tasks") {
                            for (task in TaskRepository.allTasks()) {
                                sendSerialized(task)
                                delay(1000)
                            }

                            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                        }
                    }`})]),_:1})]),_:1})]),_:1}),e(d,{title:"WebSocket을 통한 메시지 전송",id:"send-messages"},{default:o(()=>[n[144]||(n[144]=l("p",null," WebSocket의 강력한 기능을 보여주기 위해, 다음을 수행하는 새 엔드포인트를 생성할 것입니다: ",-1)),e(k,null,{default:o(()=>n[123]||(n[123]=[l("li",null," 클라이언트가 시작되면 모든 기존 작업을 수신합니다. ",-1),l("li",null," 클라이언트가 작업을 생성하고 전송할 수 있습니다. ",-1),l("li",null," 한 클라이언트가 작업을 보내면 다른 클라이언트에게 알림이 전송됩니다. ",-1)])),_:1}),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[124]||(n[124]=[t("Sockets.kt")])),_:1}),n[125]||(n[125]=t(" 파일에서 현재 ")),n[126]||(n[126]=l("code",null,"configureSockets()",-1)),n[127]||(n[127]=t(" 메서드를 아래 구현으로 바꿉니다: "))]),e(a,{lang:"kotlin",code:`fun Application.configureSockets() {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        val sessions =
            Collections.synchronizedList<WebSocketServerSession>(ArrayList())

        webSocket("/tasks") {
            sendAllTasks()
            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
        }

        webSocket("/tasks2") {
            sessions.add(this)
            sendAllTasks()

            while(true) {
                val newTask = receiveDeserialized<Task>()
                TaskRepository.addTask(newTask)
                for(session in sessions) {
                    session.sendSerialized(newTask)
                }
            }
        }
    }
}

private suspend fun DefaultWebSocketServerSession.sendAllTasks() {
    for (task in TaskRepository.allTasks()) {
        sendSerialized(task)
        delay(1000)
    }
}`}),n[132]||(n[132]=l("p",null,"이 코드를 통해 다음을 수행했습니다:",-1)),e(k,null,{default:o(()=>n[128]||(n[128]=[l("li",null," 모든 기존 작업을 전송하는 기능을 헬퍼 메서드로 리팩터링했습니다. ",-1),l("li",null,[l("code",null,"routing"),t(" 섹션에서 모든 클라이언트를 추적하기 위해 스레드 안전한 "),l("code",null,"session"),t(" 객체 목록을 생성했습니다. ")],-1),l("li",null,[t(" 상대 URL이 "),l("code",null,"/task2"),t("인 새 엔드포인트를 추가했습니다. 클라이언트가 이 엔드포인트에 연결하면 해당 "),l("code",null,"session"),t(" 객체가 목록에 추가됩니다. 그러면 서버는 새 작업을 수신하기 위해 무한 루프에 들어갑니다. 새 작업을 받으면 서버는 이를 리포지토리에 저장하고 현재 클라이언트를 포함한 모든 클라이언트에 복사본을 보냅니다. ")],-1)])),_:1}),l("p",null,[n[130]||(n[130]=t(" 이 기능을 테스트하기 위해 ")),e(i,null,{default:o(()=>n[129]||(n[129]=[t("index.html")])),_:1}),n[131]||(n[131]=t("의 기능을 확장하는 새 페이지를 생성할 것입니다. "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[133]||(n[133]=[t("src/main/resources/static")])),_:1}),n[135]||(n[135]=t(" 내에 ")),e(i,null,{default:o(()=>n[134]||(n[134]=[t("wsClient.html")])),_:1}),n[136]||(n[136]=t("이라는 새 HTML 파일을 생성합니다. "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[137]||(n[137]=[t("wsClient.html")])),_:1}),n[138]||(n[138]=t("을 열고 다음 내용을 추가합니다: "))]),e(a,{lang:"html",code:`<html>
<head>
    <title>WebSocket Client</title>
    <script>
        let serverURL;
        let socket;

        function setupSocket() {
            serverURL = 'ws://0.0.0.0:8080/tasks2';
            socket = new WebSocket(serverURL);

            socket.onopen = logOpenToConsole;
            socket.onclose = logCloseToConsole;
            socket.onmessage = readAndDisplayTask;
        }

        function readAndDisplayTask(event) {
            let task = JSON.parse(event.data);
            logTaskToConsole(task);
            addTaskToTable(task);
        }

        function logTaskToConsole(task) {
            console.log(\`Received \${task.name}\`);
        }

        function logCloseToConsole() {
            console.log("Web socket connection closed");
        }

        function logOpenToConsole() {
            console.log("Web socket connection opened");
        }

        function tableBody() {
            return document.getElementById("tasksTableBody");
        }

        function addTaskToTable(task) {
            tableBody().appendChild(taskRow(task));
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

        function getFormValue(name) {
            return document.forms[0][name].value
        }

        function buildTaskFromForm() {
            return {
                name: getFormValue("newTaskName"),
                description: getFormValue("newTaskDescription"),
                priority: getFormValue("newTaskPriority")
            }
        }

        function logSendingToConsole(data) {
            console.log("About to send",data);
        }

        function sendTaskViaSocket(data) {
            socket.send(JSON.stringify(data));
        }

        function sendTaskToServer() {
            let data = buildTaskFromForm();
            logSendingToConsole(data);
            sendTaskViaSocket(data);
            //prevent form submission
            return false;
        }
    <\/script>
</head>
<body onload="setupSocket()">
<h1>Viewing Tasks Via WebSockets</h1>
<table rules="all">
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
<div>
    <h3>Create a new task</h3>
    <form onsubmit="return sendTaskToServer()">
        <div>
            <label for="newTaskName">Name: </label>
            <input type="text" id="newTaskName"
                   name="newTaskName" size="10">
        </div>
        <div>
            <label for="newTaskDescription">Description: </label>
            <input type="text" id="newTaskDescription"
                   name="newTaskDescription" size="20">
        </div>
        <div>
            <label for="newTaskPriority">Priority: </label>
            <select id="newTaskPriority" name="newTaskPriority">
                <option name="Low">Low</option>
                <option name="Medium">Medium</option>
                <option name="High">High</option>
                <option name="Vital">Vital</option>
            </select>
        </div>
        <input type="submit">
    </form>
</div>
</body>
</html>`}),n[139]||(n[139]=l("p",null,[t(" 이 새 페이지는 사용자가 새 작업 정보를 입력할 수 있는 HTML 폼을 도입합니다. 폼을 제출하면 "),l("code",null,"sendTaskToServer"),t(" 이벤트 핸들러가 호출됩니다. 이 핸들러는 폼 데이터로 JavaScript 객체를 생성하고 WebSocket 객체의 "),l("code",null,"send"),t(" 메서드를 사용하여 서버로 보냅니다. ")],-1))]),_:1}),e(s,null,{default:o(()=>n[140]||(n[140]=[l("p",null,[t(" IntelliJ IDEA에서 재실행 버튼 ("),l("img",{src:R,style:{},height:"16",width:"16",alt:"intelliJ IDEA 재실행 아이콘"}),t(")을 클릭하여 애플리케이션을 다시 시작합니다. ")],-1)])),_:1}),e(s,null,{default:o(()=>[n[142]||(n[142]=l("p",null,"이 기능을 테스트하려면 두 개의 브라우저를 나란히 열고 아래 단계를 따르세요.",-1)),e(k,{type:"decimal"},{default:o(()=>n[141]||(n[141]=[l("li",null,[t(" 브라우저 A에서 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t("로 이동합니다. 기본 작업이 표시되어야 합니다. ")],-1),l("li",null," 브라우저 A에서 새 작업을 추가합니다. 새 작업이 해당 페이지의 테이블에 나타나야 합니다. ",-1),l("li",null,[t(" 브라우저 B에서 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t("로 이동합니다. 기본 작업과 브라우저 A에서 추가한 새 작업이 모두 표시되어야 합니다. ")],-1),l("li",null," 어떤 브라우저에서든 작업을 추가합니다. 새 항목이 두 페이지 모두에 나타나야 합니다. ",-1)])),_:1}),n[143]||(n[143]=l("img",{src:A,alt:"HTML 폼을 통해 새 작업을 생성하는 것을 보여주는 두 개의 웹 브라우저 페이지가 나란히 표시됨","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),e(d,{title:"자동화된 테스트 추가",id:"add-automated-tests"},{default:o(()=>[l("p",null,[n[146]||(n[146]=t(" QA 프로세스를 간소화하고 빠르고, 재현 가능하며, 수동 작업 없이 수행하기 위해 Ktor의 내장된 ")),e(r,{href:"/ktor/server-testing",summary:"특별한 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요."},{default:o(()=>n[145]||(n[145]=[t("자동화 테스트 지원")])),_:1}),n[147]||(n[147]=t("을 사용할 수 있습니다. 다음 단계를 따르세요: "))]),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[n[150]||(n[150]=t(" Ktor 클라이언트 내에서 ")),e(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 유형 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다."},{default:o(()=>n[148]||(n[148]=[t("Content Negotiation")])),_:1}),n[151]||(n[151]=t(" 지원을 구성할 수 있도록 ")),e(i,null,{default:o(()=>n[149]||(n[149]=[t("build.gradle.kts")])),_:1}),n[152]||(n[152]=t("에 다음 의존성을 추가합니다: "))]),e(a,{lang:"kotlin",code:'    testImplementation("io.ktor:ktor-client-content-negotiation-jvm:$ktor_version")'})]),_:1}),e(s,null,{default:o(()=>n[153]||(n[153]=[l("p",null,[l("p",null,[t("IntelliJ IDEA에서 편집기 오른쪽에 있는 알림 Gradle 아이콘 ("),l("img",{alt:"intelliJ IDEA Gradle 아이콘",src:N,width:"16",height:"26"}),t(") 을 클릭하여 Gradle 변경 사항을 로드합니다.")])],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[154]||(n[154]=[t("src/test/kotlin/com/example")])),_:1}),n[156]||(n[156]=t("로 이동하여 ")),e(i,null,{default:o(()=>n[155]||(n[155]=[t("ApplicationTest.kt")])),_:1}),n[157]||(n[157]=t(" 파일을 엽니다. "))])]),_:1}),e(s,null,{default:o(()=>[n[166]||(n[166]=l("p",null," 생성된 테스트 클래스를 아래 구현으로 바꿉니다: ",-1)),e(a,{lang:"kotlin",code:`package com.example

import com.example.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.websocket.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlinx.coroutines.flow.*
import kotlinx.serialization.json.Json
import model.Priority
import model.Task
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureRouting()
            configureSerialization()
            configureSockets()
        }

        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
            install(WebSockets) {
                contentConverter =
                    KotlinxWebsocketSerializationConverter(Json)
            }
        }

        val expectedTasks = listOf(
            Task("cleaning", "Clean the house", Priority.Low),
            Task("gardening", "Mow the lawn", Priority.Medium),
            Task("shopping", "Buy the groceries", Priority.High),
            Task("painting", "Paint the fence", Priority.Medium)
        )
        var actualTasks = emptyList<Task>()

        client.webSocket("/tasks") {
            consumeTasksAsFlow().collect { allTasks ->
                actualTasks = allTasks
            }
        }

        assertEquals(expectedTasks.size, actualTasks.size)
        expectedTasks.forEachIndexed { index, task ->
            assertEquals(task, actualTasks[index])
        }
    }

    private fun DefaultClientWebSocketSession.consumeTasksAsFlow() = incoming
        .consumeAsFlow()
        .map {
            converter!!.deserialize<Task>(it)
        }
        .scan(emptyList<Task>()) { list, task ->
            list + task
        }
}`}),n[167]||(n[167]=l("p",null," 이 설정을 통해 다음을 수행합니다: ",-1)),e(k,null,{default:o(()=>[n[161]||(n[161]=l("li",null," 서비스가 테스트 환경에서 실행되도록 구성하고, 라우팅, JSON 직렬화 및 WebSocket을 포함하여 프로덕션 환경에서와 동일한 기능을 활성화합니다. ",-1)),l("li",null,[n[159]||(n[159]=t(" Ktor 클라이언트 내에서 ")),e(r,{href:"/ktor/client-create-and-configure",summary:"Ktor 클라이언트를 생성하고 구성하는 방법을 알아보세요."},{default:o(()=>n[158]||(n[158]=[t("Content Negotiation")])),_:1}),n[160]||(n[160]=t(" 및 WebSocket 지원을 구성합니다. 이것이 없으면 클라이언트는 WebSocket 연결을 사용할 때 객체를 JSON으로 직렬화/역직렬화하는 방법을 알 수 없습니다. "))]),n[162]||(n[162]=l("li",null,[t(" 서비스가 다시 보낼 것으로 예상되는 "),l("code",null,"Tasks"),t(" 목록을 선언합니다. ")],-1)),n[163]||(n[163]=l("li",null,[t(" 클라이언트 객체의 "),l("code",null,"websocket"),t(" 메서드를 사용하여 "),l("code",null,"/tasks"),t("로 요청을 보냅니다. ")],-1)),n[164]||(n[164]=l("li",null,[t(" 들어오는 작업을 "),l("code",null,"flow"),t("로 사용하고, 점진적으로 목록에 추가합니다. ")],-1)),n[165]||(n[165]=l("li",null,[t(" 모든 작업이 수신되면 "),l("code",null,"expectedTasks"),t("를 "),l("code",null,"actualTasks"),t("와 일반적인 방식으로 비교합니다. ")],-1))]),_:1})]),_:1})]),_:1})]),_:1}),e(d,{title:"다음 단계",id:"next-steps"},{default:o(()=>[n[171]||(n[171]=l("p",null," 잘하셨습니다! Ktor 클라이언트와 WebSocket 통신 및 자동화된 테스트를 통합하여 Task Manager 서비스를 크게 향상시켰습니다. ",-1)),l("p",null,[n[169]||(n[169]=t(" Exposed 라이브러리를 사용하여 서비스가 관계형 데이터베이스와 원활하게 상호 작용하는 방법을 알아보려면 ")),e(r,{href:"/ktor/server-integrate-database",summary:"Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 알아보세요."},{default:o(()=>n[168]||(n[168]=[t("다음 튜토리얼")])),_:1}),n[170]||(n[170]=t("로 계속 진행하세요. "))])]),_:1})]),_:1})])}const G=L(z,[["render",I]]);export{q as __pageData,G as default};
