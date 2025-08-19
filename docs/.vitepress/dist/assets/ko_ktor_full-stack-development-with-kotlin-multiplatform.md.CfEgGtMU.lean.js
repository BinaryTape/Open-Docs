import{_ as M,a as x,b as P,c as I,d as j,e as z,f as K,g as D,h as O,i as R,j as B,k as H,l as N,m as U}from"./chunks/full_stack_development_tutorial_update_task.Cf-lbZdc.js";import{_ as E,C as u,c as L,o as J,G as l,w as i,j as o,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/full-stack-development-with-kotlin-multiplatform.md","filePath":"ko/ktor/full-stack-development-with-kotlin-multiplatform.md","lastUpdated":1755457140000}'),W={name:"ko/ktor/full-stack-development-with-kotlin-multiplatform.md"};function F(G,t,q,V,$,X){const v=u("show-structure"),T=u("web-summary"),w=u("link-summary"),C=u("card-summary"),m=u("Links"),b=u("tldr"),f=u("list"),d=u("chapter"),r=u("step"),a=u("ui-path"),g=u("control"),p=u("procedure"),e=u("Path"),s=u("code-block"),k=u("tab"),y=u("tabs"),S=u("note"),A=u("topic");return J(),L("div",null,[l(A,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Kotlin Multiplatform로 풀스택 애플리케이션 구축하기",id:"full-stack-development-with-kotlin-multiplatform"},{default:i(()=>[l(v,{for:"chapter, procedure",depth:"2"}),l(T,null,{default:i(()=>t[0]||(t[0]=[n(" Kotlin과 Ktor를 사용하여 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 배우세요. 이 튜토리얼에서는 Kotlin Multiplatform를 사용하여 안드로이드, iOS, 데스크톱용 애플리케이션을 빌드하고 Ktor를 통해 데이터를 손쉽게 처리하는 방법을 알아봅니다. ")])),_:1}),l(w,null,{default:i(()=>t[1]||(t[1]=[n(" Kotlin과 Ktor를 사용하여 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 배우세요. ")])),_:1}),l(C,null,{default:i(()=>t[2]||(t[2]=[n(" Kotlin과 Ktor를 사용하여 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 배우세요. ")])),_:1}),l(b,null,{default:i(()=>[t[14]||(t[14]=o("p",null,[o("b",null,"코드 예제"),n(": "),o("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/full-stack-task-manager"}," full-stack-task-manager ")],-1)),o("p",null,[t[5]||(t[5]=o("b",null,"사용된 플러그인",-1)),t[6]||(t[6]=n(": ")),l(m,{href:"/ktor/server-routing",summary:"라우팅은 서버 애플리케이션에서 수신 요청을 처리하기 위한 핵심 플러그인입니다."},{default:i(()=>t[3]||(t[3]=[n("Routing")])),_:1}),t[7]||(t[7]=n(", ")),t[8]||(t[8]=o("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1)),t[9]||(t[9]=n(", ")),l(m,{href:"/ktor/server-serialization",summary:"ContentNegotiation 플러그인은 클라이언트와 서버 간 미디어 타입 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다."},{default:i(()=>t[4]||(t[4]=[n("Content Negotiation")])),_:1}),t[10]||(t[10]=n(", ")),t[11]||(t[11]=o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform",-1)),t[12]||(t[12]=n(", ")),t[13]||(t[13]=o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"},"Kotlin Multiplatform",-1))])]),_:1}),t[288]||(t[288]=o("p",null," 이 문서에서는 안드로이드, iOS, 데스크톱 플랫폼에서 실행되는 Kotlin 풀스택 애플리케이션을 개발하는 방법을 Ktor를 활용하여 원활한 데이터 처리를 수행하는 방법을 배우게 됩니다. ",-1)),t[289]||(t[289]=o("p",null,"이 튜토리얼이 끝나면 다음을 수행하는 방법을 알게 될 것입니다:",-1)),l(f,null,{default:i(()=>t[15]||(t[15]=[o("li",null,[o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"}," Kotlin Multiplatform"),n("을(를) 사용하여 풀스택 애플리케이션을 생성합니다. ")],-1),o("li",null,"IntelliJ IDEA로 생성된 프로젝트를 이해합니다.",-1),o("li",null,[n("Ktor 서비스를 호출하는 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),n(" 클라이언트를 생성합니다. ")],-1),o("li",null,"설계의 다양한 계층에서 공유 타입을 재사용합니다.",-1),o("li",null,"멀티플랫폼 라이브러리를 올바르게 포함하고 구성합니다.",-1)])),_:1}),o("p",null,[t[19]||(t[19]=n(" 이전 튜토리얼에서는 작업 관리자 예제를 사용하여 ")),l(m,{href:"/ktor/server-requests-and-responses",summary:"작업 관리자 애플리케이션을 빌드하여 Ktor와 Kotlin에서 라우팅, 요청 처리 및 매개변수의 기본 사항을 배웁니다."},{default:i(()=>t[16]||(t[16]=[n("요청을 처리하고")])),_:1}),t[20]||(t[20]=n(", ")),l(m,{href:"/ktor/server-create-restful-apis",summary:"Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 배우세요. JSON 파일을 생성하는 RESTful API 예제가 포함되어 있습니다."},{default:i(()=>t[17]||(t[17]=[n("RESTful API를 생성하고")])),_:1}),t[21]||(t[21]=n(", ")),l(m,{href:"/ktor/server-integrate-database",summary:"Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리와 연결하는 프로세스를 배웁니다."},{default:i(()=>t[18]||(t[18]=[n("Exposed와 데이터베이스를 통합")])),_:1}),t[22]||(t[22]=n("했습니다. 클라이언트 애플리케이션은 Ktor의 기본 사항을 배우는 데 집중할 수 있도록 가능한 한 최소한으로 유지되었습니다. "))]),t[290]||(t[290]=o("p",null," 이 튜토리얼에서는 Ktor 서비스를 사용하여 표시될 데이터를 가져오고 안드로이드, iOS, 데스크톱 플랫폼을 대상으로 하는 클라이언트를 생성합니다. 가능한 모든 곳에서 클라이언트와 서버 간에 데이터 타입을 공유하여 개발 속도를 높이고 오류 발생 가능성을 줄일 것입니다. ",-1)),l(d,{title:"사전 요구 사항",id:"prerequisites"},{default:i(()=>t[23]||(t[23]=[o("p",null,[n(" 이전 문서와 마찬가지로 IntelliJ IDEA를 IDE로 사용할 것입니다. 환경을 설치하고 구성하려면 다음 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html"}," Kotlin Multiplatform 빠른 시작 "),n(" 가이드를 참조하세요. ")],-1),o("p",null,[n(" Compose Multiplatform를 처음 사용하는 경우, 이 튜토리얼을 시작하기 전에 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html"}," Compose Multiplatform 시작하기 "),n(" 튜토리얼을 완료하는 것이 좋습니다. 작업의 복잡성을 줄이기 위해 단일 클라이언트 플랫폼에 집중할 수 있습니다. 예를 들어, iOS를 사용해 본 적이 없다면 데스크톱 또는 안드로이드 개발에 집중하는 것이 현명할 수 있습니다. ")],-1)])),_:1}),l(d,{title:"새 프로젝트 생성",id:"create-project"},{default:i(()=>[t[52]||(t[52]=o("p",null,[n(" Ktor 프로젝트 제너레이터 대신 IntelliJ IDEA의 Kotlin Multiplatform 프로젝트 마법사를 사용하세요. 이는 클라이언트 및 서비스로 확장할 수 있는 기본 멀티플랫폼 프로젝트를 생성합니다. 클라이언트는 SwiftUI와 같은 네이티브 UI 라이브러리를 사용할 수도 있지만, 이 튜토리얼에서는 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),n("을(를) 사용하여 모든 플랫폼에 대한 공유 UI를 생성할 것입니다. ")],-1)),l(p,{id:"generate-project"},{default:i(()=>[l(r,null,{default:i(()=>t[24]||(t[24]=[n(" IntelliJ IDEA를 시작합니다. ")])),_:1}),l(r,null,{default:i(()=>[t[26]||(t[26]=n(" IntelliJ IDEA에서 ")),l(a,null,{default:i(()=>t[25]||(t[25]=[n("File | New | Project")])),_:1}),t[27]||(t[27]=n("를 선택합니다. "))]),_:1}),l(r,null,{default:i(()=>[t[29]||(t[29]=n(" 왼쪽 패널에서 ")),l(a,null,{default:i(()=>t[28]||(t[28]=[n("Kotlin Multiplatform")])),_:1}),t[30]||(t[30]=n("를 선택합니다. "))]),_:1}),l(r,null,{default:i(()=>[l(a,null,{default:i(()=>t[31]||(t[31]=[n("New Project")])),_:1}),t[36]||(t[36]=n(" 창에서 다음 필드를 지정합니다: ")),l(f,null,{default:i(()=>[o("li",null,[l(a,null,{default:i(()=>t[32]||(t[32]=[n("Name")])),_:1}),t[33]||(t[33]=n(" : full-stack-task-manager "))]),o("li",null,[l(a,null,{default:i(()=>t[34]||(t[34]=[n("Group")])),_:1}),t[35]||(t[35]=n(" : com.example.ktor "))])]),_:1})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[40]||(t[40]=n(" 대상 플랫폼으로 ")),l(a,null,{default:i(()=>t[37]||(t[37]=[n("Android")])),_:1}),t[41]||(t[41]=n(" , ")),l(a,null,{default:i(()=>t[38]||(t[38]=[n("Desktop")])),_:1}),t[42]||(t[42]=n(" , ")),l(a,null,{default:i(()=>t[39]||(t[39]=[n("Server")])),_:1}),t[43]||(t[43]=n("를 선택합니다. "))])]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[46]||(t[46]=n(" Mac을 사용 중이라면 ")),l(a,null,{default:i(()=>t[44]||(t[44]=[n("iOS")])),_:1}),t[47]||(t[47]=n("도 선택하세요. ")),l(a,null,{default:i(()=>t[45]||(t[45]=[n("Share UI")])),_:1}),t[48]||(t[48]=n(" 옵션이 선택되어 있는지 확인합니다. ")),t[49]||(t[49]=o("img",{style:{},src:M,alt:"Kotlin Multiplatform 마법사 설정",width:"706","border-effect":"rounded"},null,-1))])]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(g,null,{default:i(()=>t[50]||(t[50]=[n("Create")])),_:1}),t[51]||(t[51]=n(" 버튼을 클릭하고 IDE가 프로젝트를 생성하고 임포트할 때까지 기다립니다. "))])]),_:1})]),_:1})]),_:1}),l(d,{title:"서비스 실행",id:"run-service"},{default:i(()=>[l(p,{id:"run-service-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[l(a,null,{default:i(()=>t[53]||(t[53]=[n("Project")])),_:1}),t[56]||(t[56]=n(" 보기에서 ")),l(e,null,{default:i(()=>t[54]||(t[54]=[n("server/src/main/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[57]||(t[57]=n(" 로 이동하여 ")),l(e,null,{default:i(()=>t[55]||(t[55]=[n("Application.kt")])),_:1}),t[58]||(t[58]=n(" 파일을 엽니다. "))]),_:1}),l(r,null,{default:i(()=>[t[64]||(t[64]=n(" 애플리케이션을 시작하려면 ")),t[65]||(t[65]=o("code",null,"main()",-1)),t[66]||(t[66]=n(" 함수 옆에 있는 ")),l(a,null,{default:i(()=>t[59]||(t[59]=[n("Run")])),_:1}),t[67]||(t[67]=n(" 버튼 (")),t[68]||(t[68]=o("img",{src:x,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 실행 아이콘"},null,-1)),t[69]||(t[69]=n(")을 클릭합니다. ")),o("p",null,[l(a,null,{default:i(()=>t[60]||(t[60]=[n("Run")])),_:1}),t[61]||(t[61]=n(' 도구 창에 "Responding at ')),t[62]||(t[62]=o("a",{href:"http://0.0.0.0:8080",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080",-1)),t[63]||(t[63]=n('" 메시지로 끝나는 새 탭이 열릴 것입니다. '))])]),_:1}),l(r,null,{default:i(()=>t[70]||(t[70]=[o("p",null,[n(" 애플리케이션을 열려면 "),o("a",{href:"http://0.0.0.0:8080/"},[o("a",{href:"http://0.0.0.0:8080/",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/")]),n("로 이동합니다. 브라우저에 Ktor의 메시지가 표시될 것입니다. "),o("img",{src:P,alt:"Ktor 서버 브라우저 응답",width:"706","border-effect":"rounded",style:{}})],-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"프로젝트 검사",id:"examine-project"},{default:i(()=>[o("p",null,[l(e,null,{default:i(()=>t[71]||(t[71]=[n("server")])),_:1}),t[74]||(t[74]=n(" 폴더는 프로젝트 내 세 개의 Kotlin 모듈 중 하나입니다. 나머지 두 개는 ")),l(e,null,{default:i(()=>t[72]||(t[72]=[n("shared")])),_:1}),t[75]||(t[75]=n(" 와 ")),l(e,null,{default:i(()=>t[73]||(t[73]=[n("composeApp")])),_:1}),t[76]||(t[76]=n(" 입니다. "))]),o("p",null,[l(e,null,{default:i(()=>t[77]||(t[77]=[n("server")])),_:1}),t[78]||(t[78]=n(" 모듈의 구조는 ")),t[79]||(t[79]=o("a",{href:"https://start.ktor.io/"},"Ktor Project Generator",-1)),t[80]||(t[80]=n("로 생성된 것과 매우 유사합니다. 플러그인 및 의존성을 선언하는 전용 빌드 파일과 Ktor 서비스를 빌드하고 시작하는 코드를 포함하는 소스 세트가 있습니다: "))]),t[124]||(t[124]=o("img",{src:I,alt:"Kotlin Multiplatform 프로젝트의 서버 폴더 내용",width:"300","border-effect":"line"},null,-1)),o("p",null,[l(e,null,{default:i(()=>t[81]||(t[81]=[n("Application.kt")])),_:1}),t[82]||(t[82]=n(" 파일의 라우팅 지침을 보면 ")),t[83]||(t[83]=o("code",null,"greet()",-1)),t[84]||(t[84]=n(" 함수 호출을 볼 수 있습니다: "))]),l(s,{lang:"kotlin",code:`            fun Application.module() {
                routing {
                    get("/") {
                        call.respondText("Ktor: \${Greeting().greet()}")
                    }
                }
            }`}),o("p",null,[t[86]||(t[86]=n(" 이는 ")),t[87]||(t[87]=o("code",null,"Greeting",-1)),t[88]||(t[88]=n(" 타입의 인스턴스를 생성하고 ")),t[89]||(t[89]=o("code",null,"greet()",-1)),t[90]||(t[90]=n(" 메서드를 호출합니다. ")),t[91]||(t[91]=o("code",null,"Greeting",-1)),t[92]||(t[92]=n(" 클래스는 ")),l(e,null,{default:i(()=>t[85]||(t[85]=[n("shared")])),_:1}),t[93]||(t[93]=n(" 모듈에 정의되어 있습니다: ")),t[94]||(t[94]=o("img",{src:j,alt:"IntelliJ IDEA에서 열린 Greeting.kt 및 Platform.kt",width:"706","border-effect":"line",style:{}},null,-1))]),o("p",null,[l(e,null,{default:i(()=>t[95]||(t[95]=[n("shared")])),_:1}),t[96]||(t[96]=n(" 모듈은 다양한 대상 플랫폼에서 사용될 코드를 포함합니다. "))]),o("p",null,[l(e,null,{default:i(()=>t[97]||(t[97]=[n("shared")])),_:1}),t[99]||(t[99]=n(" 모듈 세트의 ")),l(e,null,{default:i(()=>t[98]||(t[98]=[n("commonMain")])),_:1}),t[100]||(t[100]=n(" 소스는 모든 플랫폼에서 사용될 타입을 보유합니다. 보시다시피, ")),t[101]||(t[101]=o("code",null,"Greeting",-1)),t[102]||(t[102]=n(" 타입이 정의된 곳입니다. 이것은 또한 서버와 모든 다른 클라이언트 플랫폼 간에 공유될 공통 코드를 넣을 곳이기도 합니다. "))]),o("p",null,[l(e,null,{default:i(()=>t[103]||(t[103]=[n("shared")])),_:1}),t[105]||(t[105]=n(" 모듈은 또한 클라이언트를 제공하고자 하는 각 플랫폼에 대한 소스 세트를 포함합니다. 이는 ")),l(e,null,{default:i(()=>t[104]||(t[104]=[n("commonMain")])),_:1}),t[106]||(t[106]=n(" 내에 선언된 타입이 대상 플랫폼에 따라 달라지는 기능이 필요할 수 있기 때문입니다. ")),t[107]||(t[107]=o("code",null,"Greeting",-1)),t[108]||(t[108]=n(" 타입의 경우, 플랫폼별 API를 사용하여 현재 플랫폼의 이름을 가져오려고 합니다. 이는 ")),t[109]||(t[109]=o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html"},"expect 및 actual 선언",-1)),t[110]||(t[110]=n("을 통해 달성됩니다. "))]),o("p",null,[l(e,null,{default:i(()=>t[111]||(t[111]=[n("shared")])),_:1}),t[113]||(t[113]=n(" 모듈의 ")),l(e,null,{default:i(()=>t[112]||(t[112]=[n("commonMain")])),_:1}),t[114]||(t[114]=n(" 소스 세트에서 ")),t[115]||(t[115]=o("code",null,"expect",-1)),t[116]||(t[116]=n(" 키워드로 ")),t[117]||(t[117]=o("code",null,"getPlatform()",-1)),t[118]||(t[118]=n(" 함수를 선언합니다: "))]),l(y,null,{default:i(()=>[l(k,{title:"commonMain/Platform.kt",id:"commonMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform`})]),_:1})]),_:1}),t[125]||(t[125]=o("p",null,[n("그러면 각 대상 플랫폼은 아래와 같이 "),o("code",null,"getPlatform()"),n(" 함수의 "),o("code",null,"actual"),n(" 선언을 제공해야 합니다: ")],-1)),l(y,null,{default:i(()=>[l(k,{title:"Platform.ios.kt",id:"iosMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import platform.UIKit.UIDevice

class IOSPlatform: Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}

actual fun getPlatform(): Platform = IOSPlatform()`})]),_:1}),l(k,{title:"Platform.android.kt",id:"androidMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android \${Build.VERSION.SDK_INT}"
}

actual fun getPlatform(): Platform = AndroidPlatform()`})]),_:1}),l(k,{title:"Platform.jvm.kt",id:"jvmMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

class JVMPlatform: Platform {
    override val name: String = "Java \${System.getProperty("java.version")}"
}

actual fun getPlatform(): Platform = JVMPlatform()`})]),_:1}),l(k,{title:"Platform.wasmJs.kt",id:"wasmJsMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

class WasmPlatform : Platform {
    override val name: String = "Web with Kotlin/Wasm"
}

actual fun getPlatform(): Platform = WasmPlatform()`})]),_:1})]),_:1}),o("p",null,[t[120]||(t[120]=n(" 프로젝트에는 하나의 추가 모듈인 ")),l(e,null,{default:i(()=>t[119]||(t[119]=[n("composeApp")])),_:1}),t[121]||(t[121]=n(" 모듈이 있습니다. 이는 안드로이드, iOS, 데스크톱 및 웹 클라이언트 앱의 코드를 포함합니다. 이 앱들은 현재 Ktor 서비스에 연결되어 있지 않지만, 공유된 ")),t[122]||(t[122]=o("code",null,"Greeting",-1)),t[123]||(t[123]=n(" 클래스를 사용합니다. "))])]),_:1}),l(d,{title:"클라이언트 애플리케이션 실행",id:"run-client-app"},{default:i(()=>[t[139]||(t[139]=o("p",null," 대상에 대한 실행 구성을 실행하여 클라이언트 애플리케이션을 실행할 수 있습니다. iOS 시뮬레이터에서 애플리케이션을 실행하려면 아래 단계를 따르세요: ",-1)),l(p,{id:"run-ios-app-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[t[127]||(t[127]=n(" IntelliJ IDEA에서 ")),l(e,null,{default:i(()=>t[126]||(t[126]=[n("iosApp")])),_:1}),t[128]||(t[128]=n(" 실행 구성과 시뮬레이션된 장치를 선택합니다. ")),t[129]||(t[129]=o("img",{src:z,alt:"실행 및 디버그 창",width:"400","border-effect":"line",style:{}},null,-1))]),_:1}),l(r,null,{default:i(()=>[l(a,null,{default:i(()=>t[130]||(t[130]=[n("Run")])),_:1}),t[131]||(t[131]=n(" 버튼 (")),t[132]||(t[132]=o("img",{src:x,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 실행 아이콘"},null,-1)),t[133]||(t[133]=n(")을 클릭하여 구성을 실행합니다. "))]),_:1}),l(r,null,{default:i(()=>[t[137]||(t[137]=o("p",null,[n(" iOS 앱을 실행하면 내부적으로 Xcode로 빌드되고 iOS 시뮬레이터에서 시작됩니다. 이 앱은 클릭 시 이미지를 토글하는 버튼을 표시합니다. "),o("img",{style:{},src:K,alt:"iOS 시뮬레이터에서 앱 실행",width:"300","border-effect":"rounded"})],-1)),o("p",null,[t[135]||(t[135]=n(" 버튼을 처음 누르면 현재 플랫폼의 세부 정보가 텍스트에 추가됩니다. 이를 달성하는 코드는 ")),l(e,null,{default:i(()=>t[134]||(t[134]=[n("composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt")])),_:1}),t[136]||(t[136]=n("에서 찾을 수 있습니다: "))]),l(s,{lang:"kotlin",code:`            @Composable
            fun App() {
                MaterialTheme {
                    var greetingText by remember { mutableStateOf("Hello World!") }
                    var showImage by remember { mutableStateOf(false) }
                    Column(
                        Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Button(onClick = {
                            greetingText = "Compose: \${Greeting().greet()}"
                            showImage = !showImage
                        }) {
                            Text(greetingText)
                        }
                        AnimatedVisibility(showImage) {
                            Image(
                                painterResource(Res.drawable.compose_multiplatform),
                                null
                            )
                        }
                    }
                }
            }`}),t[138]||(t[138]=o("p",null,[n(" 이는 이 문서의 뒷부분에서 수정할 컴포저블 함수입니다. 현재 중요한 것은 UI를 표시하고 공유 "),o("code",null,"Greeting"),n(" 타입을 사용하며, 이는 다시 공통 "),o("code",null,"Platform"),n(" 인터페이스를 구현하는 플랫폼별 클래스를 사용한다는 점입니다. ")],-1))]),_:1})]),_:1}),t[140]||(t[140]=o("p",null," 이제 생성된 프로젝트의 구조를 이해했으니 작업 관리자 기능을 점진적으로 추가할 수 있습니다. ",-1))]),_:1}),l(d,{title:"모델 타입 추가",id:"add-model-types"},{default:i(()=>[t[167]||(t[167]=o("p",null," 먼저 모델 타입을 추가하고 클라이언트와 서버 모두에서 접근 가능한지 확인합니다. ",-1)),l(p,{id:"add-model-types-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[141]||(t[141]=[n("shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[143]||(t[143]=n(" 로 이동하여 ")),l(e,null,{default:i(()=>t[142]||(t[142]=[n("model")])),_:1}),t[144]||(t[144]=n("이라는 새 패키지를 생성합니다. "))]),_:1}),l(r,null,{default:i(()=>[t[146]||(t[146]=n(" 새 패키지 내에 ")),l(e,null,{default:i(()=>t[145]||(t[145]=[n("Task.kt")])),_:1}),t[147]||(t[147]=n("라는 새 파일을 생성합니다. "))]),_:1}),l(r,null,{default:i(()=>[t[148]||(t[148]=o("p",null,[n(" 우선순위를 나타내는 "),o("code",null,"enum"),n("과 작업을 나타내는 "),o("code",null,"class"),n("를 추가합니다. "),o("code",null,"Task"),n(" 클래스는 "),o("code",null,"kotlinx.serialization"),n(" 라이브러리의 "),o("code",null,"Serializable"),n(" 타입으로 어노테이션됩니다: ")],-1)),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[149]||(t[149]=o("p",null,[n(" 임포트와 어노테이션 모두 컴파일되지 않는 것을 알 수 있습니다. 이는 프로젝트가 아직 "),o("code",null,"kotlinx.serialization"),n(" 라이브러리에 대한 의존성을 가지고 있지 않기 때문입니다. ")],-1))]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(e,null,{default:i(()=>t[150]||(t[150]=[n("shared/build.gradle.kts")])),_:1}),t[151]||(t[151]=n(" 로 이동하여 직렬화 플러그인을 추가합니다: "))]),l(s,{lang:"kotlin",code:`plugins {
    //...
    kotlin("plugin.serialization") version "2.1.21"
}`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[153]||(t[153]=n(" 동일한 파일에서 ")),l(e,null,{default:i(()=>t[152]||(t[152]=[n("commonMain")])),_:1}),t[154]||(t[154]=n(" 소스 세트에 새 의존성을 추가합니다: "))]),l(s,{lang:"kotlin",code:`    sourceSets {
        commonMain.dependencies {
            // put your Multiplatform dependencies here
            implementation(libs.kotlinx.serialization.json)
        }
        //...
    }`})]),_:1}),l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[155]||(t[155]=[n("gradle/libs.versions.toml")])),_:1}),t[156]||(t[156]=n(" 로 이동하여 다음을 정의합니다: ")),l(s,{lang:"toml",code:`[versions]
kotlinxSerializationJson = "1.8.1"

[libraries]
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinxSerializationJson" }`})]),_:1}),l(r,null,{default:i(()=>[t[159]||(t[159]=n(" IntelliJ IDEA에서 ")),l(a,null,{default:i(()=>t[157]||(t[157]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[160]||(t[160]=n("를 선택하여 업데이트를 적용합니다. Gradle 임포트가 완료되면 ")),l(e,null,{default:i(()=>t[158]||(t[158]=[n("Task.kt")])),_:1}),t[161]||(t[161]=n(" 파일이 성공적으로 컴파일되는 것을 확인할 수 있습니다. "))]),_:1})]),_:1}),t[168]||(t[168]=o("p",null,[n(" 직렬화 플러그인을 포함하지 않아도 코드는 컴파일되었을 수 있지만, 네트워크를 통해 "),o("code",null,"Task"),n(" 객체를 직렬화하는 데 필요한 타입은 생성되지 않았을 것입니다. 이는 서비스를 호출하려고 할 때 런타임 오류로 이어질 수 있습니다. ")],-1)),o("p",null,[t[164]||(t[164]=n(" 직렬화 플러그인을 다른 모듈(예: ")),l(e,null,{default:i(()=>t[162]||(t[162]=[n("server")])),_:1}),t[165]||(t[165]=n(" 또는 ")),l(e,null,{default:i(()=>t[163]||(t[163]=[n("composeApp")])),_:1}),t[166]||(t[166]=n(" )에 배치해도 빌드 시점에는 오류가 발생하지 않았을 것입니다. 하지만 다시 말하지만, 직렬화에 필요한 추가 타입은 생성되지 않아 런타임 오류로 이어질 것입니다. "))])]),_:1}),l(d,{title:"서버 생성",id:"create-server"},{default:i(()=>[t[199]||(t[199]=o("p",null," 다음 단계는 작업 관리자를 위한 서버 구현을 생성하는 것입니다. ",-1)),l(p,{id:"create-server-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[169]||(t[169]=[n("server/src/main/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[171]||(t[171]=n(" 폴더로 이동하여 ")),l(e,null,{default:i(()=>t[170]||(t[170]=[n("model")])),_:1}),t[172]||(t[172]=n("이라는 하위 패키지를 생성합니다. "))]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[174]||(t[174]=n(" 이 패키지 내에 새 ")),l(e,null,{default:i(()=>t[173]||(t[173]=[n("TaskRepository.kt")])),_:1}),t[175]||(t[175]=n(" 파일을 생성하고 리포지토리에 대한 다음 인터페이스를 추가합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

interface TaskRepository {
    fun allTasks(): List<Task>
    fun tasksByPriority(priority: Priority): List<Task>
    fun taskByName(name: String): Task?
    fun addOrUpdateTask(task: Task)
    fun removeTask(name: String): Boolean
}`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[177]||(t[177]=n(" 동일한 패키지에 다음 클래스를 포함하는 새 파일 ")),l(e,null,{default:i(()=>t[176]||(t[176]=[n("InMemoryTaskRepository.kt")])),_:1}),t[178]||(t[178]=n("를 생성합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

class InMemoryTaskRepository : TaskRepository {
    private var tasks = listOf(
        Task("Cleaning", "Clean the house", Priority.Low),
        Task("Gardening", "Mow the lawn", Priority.Medium),
        Task("Shopping", "Buy the groceries", Priority.High),
        Task("Painting", "Paint the fence", Priority.Low),
        Task("Cooking", "Cook the dinner", Priority.Medium),
        Task("Relaxing", "Take a walk", Priority.High),
        Task("Exercising", "Go to the gym", Priority.Low),
        Task("Learning", "Read a book", Priority.Medium),
        Task("Snoozing", "Go for a nap", Priority.High),
        Task("Socializing", "Go to a party", Priority.High)
    )

    override fun allTasks(): List<Task> = tasks

    override fun tasksByPriority(priority: Priority) = tasks.filter {
        it.priority == priority
    }

    override fun taskByName(name: String) = tasks.find {
        it.name.equals(name, ignoreCase = true)
    }

    override fun addOrUpdateTask(task: Task) {
        var notFound = true

        tasks = tasks.map {
            if (it.name == task.name) {
                notFound = false
                task
            } else {
                it
            }
        }
        if (notFound) {
            tasks = tasks.plus(task)
        }
    }

    override fun removeTask(name: String): Boolean {
        val oldTasks = tasks
        tasks = tasks.filterNot { it.name == name }
        return oldTasks.size > tasks.size
    }
}`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(e,null,{default:i(()=>t[179]||(t[179]=[n("server/src/main/kotlin/.../Application.kt")])),_:1}),t[180]||(t[180]=n(" 로 이동하여 기존 코드를 다음 구현으로 대체합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.model.InMemoryTaskRepository
import com.example.ktor.full_stack_task_manager.model.Priority
import com.example.ktor.full_stack_task_manager.model.Task
import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = SERVER_PORT, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    install(ContentNegotiation) {
        json()
    }
    install(CORS) {
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Delete)
        // For ease of demonstration we allow any connections.
        // Don't do this in production.
        anyHost()
    }
    val repository = InMemoryTaskRepository()

    routing {
        route("/tasks") {
            get {
                val tasks = repository.allTasks()
                call.respond(tasks)
            }
            get("/byName/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val task = repository.taskByName(name)
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
                    val tasks = repository.tasksByPriority(priority)


                    if (tasks.isEmpty()) {
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }
                    call.respond(tasks)
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
            post {
                try {
                    val task = call.receive<Task>()
                    repository.addOrUpdateTask(task)
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
            delete("/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }
                if (repository.removeTask(name)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}`}),t[184]||(t[184]=o("p",null,[n(" 이 구현은 이전 튜토리얼과 매우 유사하지만, 단순화를 위해 모든 라우팅 코드를 "),o("code",null,"Application.module()"),n(" 함수 내에 배치했다는 점이 다릅니다. ")],-1)),o("p",null,[t[182]||(t[182]=n(" 이 코드를 입력하고 임포트를 추가하면, 코드가 웹 클라이언트와 상호 작용하기 위한 ")),l(m,{href:"/ktor/server-cors",summary:"필수 의존성: io.ktor:%artifact_name% 코드 예제: full-stack-task-manager 네이티브 서버 지원: ✅"},{default:i(()=>t[181]||(t[181]=[n("CORS")])),_:1}),t[183]||(t[183]=n(" 플러그인을 포함하여 의존성으로 포함되어야 하는 여러 Ktor 플러그인을 사용하므로 여러 컴파일 오류가 발생할 것입니다. "))])]),_:1}),l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[185]||(t[185]=[n("gradle/libs.versions.toml")])),_:1}),t[186]||(t[186]=n(" 파일을 열고 다음 라이브러리를 정의합니다: ")),l(s,{lang:"toml",code:`[libraries]
ktor-serialization-kotlinx-json-jvm = { module = "io.ktor:ktor-serialization-kotlinx-json-jvm", version.ref = "ktor" }
ktor-server-content-negotiation-jvm = { module = "io.ktor:ktor-server-content-negotiation-jvm", version.ref = "ktor" }
ktor-server-cors-jvm = { module = "io.ktor:ktor-server-cors-jvm", version.ref = "ktor" }`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[188]||(t[188]=n(" 서버 모듈 빌드 파일( ")),l(e,null,{default:i(()=>t[187]||(t[187]=[n("server/build.gradle.kts")])),_:1}),t[189]||(t[189]=n(" )을 열고 다음 의존성을 추가합니다: "))]),l(s,{lang:"kotlin",code:`dependencies {
    //...
    implementation(libs.ktor.serialization.kotlinx.json.jvm)
    implementation(libs.ktor.server.content.negotiation.jvm)
    implementation(libs.ktor.server.cors.jvm)
}`})]),_:1}),l(r,null,{default:i(()=>[t[191]||(t[191]=n(" 다시 한번, 메인 메뉴에서 ")),l(a,null,{default:i(()=>t[190]||(t[190]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[192]||(t[192]=n("를 선택합니다. 임포트가 완료되면 ")),t[193]||(t[193]=o("code",null,"ContentNegotiation",-1)),t[194]||(t[194]=n(" 타입과 ")),t[195]||(t[195]=o("code",null,"json()",-1)),t[196]||(t[196]=n(" 함수의 임포트가 제대로 작동하는 것을 확인할 수 있습니다. "))]),_:1}),l(r,null,{default:i(()=>t[197]||(t[197]=[n(" 서버를 재실행합니다. 브라우저에서 경로에 도달할 수 있음을 확인할 수 있습니다. ")])),_:1}),l(r,null,{default:i(()=>t[198]||(t[198]=[o("p",null,[o("a",{href:"http://0.0.0.0:8080/tasks"}),n(" 와 "),o("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"}),n(" 로 이동하여 JSON 형식의 작업이 포함된 서버 응답을 확인합니다. "),o("img",{style:{},src:D,width:"707","border-effect":"rounded",alt:"브라우저의 서버 응답"})],-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"클라이언트 생성",id:"create-client"},{default:i(()=>[t[252]||(t[252]=o("p",null," 클라이언트가 서버에 접근할 수 있도록 Ktor 클라이언트를 포함해야 합니다. 여기에는 세 가지 유형의 의존성이 관련됩니다: ",-1)),l(f,null,{default:i(()=>t[200]||(t[200]=[o("li",null,"Ktor 클라이언트의 핵심 기능.",-1),o("li",null,"네트워킹을 처리하는 플랫폼별 엔진.",-1),o("li",null,"콘텐츠 협상 및 직렬화 지원.",-1)])),_:1}),l(p,{id:"create-client-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[201]||(t[201]=[n("gradle/libs.versions.toml")])),_:1}),t[202]||(t[202]=n(" 파일에 다음 라이브러리를 추가합니다: ")),l(s,{lang:"toml",code:`[libraries]
ktor-client-android = { module = "io.ktor:ktor-client-android", version.ref = "ktor" }
ktor-client-cio = { module = "io.ktor:ktor-client-cio", version.ref = "ktor" }
ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
ktor-client-wasm = { module = "io.ktor:ktor-client-js-wasm-js", version.ref = "ktor"}
ktor-serialization-kotlinx-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }`})]),_:1}),l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[203]||(t[203]=[n("composeApp/build.gradle.kts")])),_:1}),t[204]||(t[204]=n(" 로 이동하여 다음 의존성을 추가합니다: ")),l(s,{lang:"kotlin",code:`kotlin {

    //...
    sourceSets {
        val desktopMain by getting
        
        androidMain.dependencies {
            //...
            implementation(libs.ktor.client.android)
        }
        commonMain.dependencies {
            //...
            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
        }
        desktopMain.dependencies {
            //...
            implementation(libs.ktor.client.cio)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
        wasmJsMain.dependencies {
            implementation(libs.ktor.client.wasm)
        }
    }
}`}),t[205]||(t[205]=o("p",null,[n(" 이 작업이 완료되면 클라이언트가 Ktor 클라이언트를 감싸는 얇은 래퍼 역할을 할 "),o("code",null,"TaskApi"),n(" 타입을 추가할 수 있습니다. ")],-1))]),_:1}),l(r,null,{default:i(()=>[t[207]||(t[207]=n(" 빌드 파일의 변경 사항을 임포트하려면 메인 메뉴에서 ")),l(a,null,{default:i(()=>t[206]||(t[206]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[208]||(t[208]=n("를 선택합니다. "))]),_:1}),l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[209]||(t[209]=[n("composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[211]||(t[211]=n(" 로 이동하여 ")),l(e,null,{default:i(()=>t[210]||(t[210]=[n("network")])),_:1}),t[212]||(t[212]=n("라는 새 패키지를 생성합니다. "))]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[214]||(t[214]=n(" 새 패키지 내에 클라이언트 구성을 위한 새 ")),l(e,null,{default:i(()=>t[213]||(t[213]=[n("HttpClientManager.kt")])),_:1}),t[215]||(t[215]=n(" 를 생성합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.network

import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

fun createHttpClient() = HttpClient {
    install(ContentNegotiation) {
        json(Json {
            encodeDefaults = true
            isLenient = true
            coerceInputValues = true
            ignoreUnknownKeys = true
        })
    }
    defaultRequest {
        host = "1.2.3.4"
        port = 8080
    }
}`}),t[216]||(t[216]=o("p",null,[o("code",null,"1.2.3.4"),n("를 현재 머신의 IP 주소로 대체해야 합니다. 안드로이드 가상 장치(Android Virtual Device) 또는 iOS 시뮬레이터에서 실행되는 코드에서는 "),o("code",null,"0.0.0.0"),n(" 또는 "),o("code",null,"localhost"),n("로 호출할 수 없습니다. ")],-1))]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[219]||(t[219]=n(" 동일한 ")),l(e,null,{default:i(()=>t[217]||(t[217]=[n("composeApp/.../full_stack_task_manager/network")])),_:1}),t[220]||(t[220]=n(" 패키지에 다음 구현이 포함된 새 ")),l(e,null,{default:i(()=>t[218]||(t[218]=[n("TaskApi.kt")])),_:1}),t[221]||(t[221]=n(" 파일을 생성합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.network

import com.example.ktor.full_stack_task_manager.model.Task
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType

class TaskApi(private val httpClient: HttpClient) {

    suspend fun getAllTasks(): List<Task> {
        return httpClient.get("tasks").body()
    }

    suspend fun removeTask(task: Task) {
        httpClient.delete("tasks/\${task.name}")
    }

    suspend fun updateTask(task: Task) {
        httpClient.post("tasks") {
            contentType(ContentType.Application.Json)
            setBody(task)
        }
    }
}`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(e,null,{default:i(()=>t[222]||(t[222]=[n("commonMain/.../App.kt")])),_:1}),t[223]||(t[223]=n(" 로 이동하여 App 컴포저블을 아래 구현으로 대체합니다. 이는 ")),t[224]||(t[224]=o("code",null,"TaskApi",-1)),t[225]||(t[225]=n(" 타입을 사용하여 서버에서 작업 목록을 검색한 다음 각 작업의 이름을 열에 표시합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.network.TaskApi
import com.example.ktor.full_stack_task_manager.network.createHttpClient
import com.example.ktor.full_stack_task_manager.model.Task
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import kotlinx.coroutines.launch

@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        val tasks = remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()

        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = {
                scope.launch {
                    tasks.value = taskApi.getAllTasks()
                }
            }) {
                Text("Fetch Tasks")
            }
            for (task in tasks.value) {
                Text(task.name)
            }
        }
    }
}`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[227]||(t[227]=n(" 서버가 실행 중인 동안, ")),l(a,null,{default:i(()=>t[226]||(t[226]=[n("iosApp")])),_:1}),t[228]||(t[228]=n(" 실행 구성을 사용하여 iOS 애플리케이션을 테스트합니다. "))])]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(g,null,{default:i(()=>t[229]||(t[229]=[n("Fetch Tasks")])),_:1}),t[230]||(t[230]=n(" 버튼을 클릭하여 작업 목록을 표시합니다: ")),t[231]||(t[231]=o("img",{style:{},src:O,alt:"iOS에서 실행되는 앱",width:"363","border-effect":"rounded"},null,-1))]),l(S,null,{default:i(()=>t[232]||(t[232]=[n(" 이 데모에서는 명확성을 위해 프로세스를 단순화하고 있습니다. 실제 애플리케이션에서는 네트워크를 통해 암호화되지 않은 데이터를 전송하는 것을 피하는 것이 중요합니다. ")])),_:1})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[234]||(t[234]=n(" 안드로이드 플랫폼에서는 애플리케이션에 네트워킹 권한을 명시적으로 부여하고 평문(cleartext)으로 데이터를 송수신할 수 있도록 허용해야 합니다. 이러한 권한을 활성화하려면 ")),l(e,null,{default:i(()=>t[233]||(t[233]=[n("composeApp/src/androidMain/AndroidManifest.xml")])),_:1}),t[235]||(t[235]=n(" 를 열고 다음 설정을 추가합니다: "))]),l(s,{lang:"xml",code:`                    <manifest>
                        ...
                        <application
                                android:usesCleartextTraffic="true">
                        ...
                        ...
                        </application>
                        <uses-permission android:name="android.permission.INTERNET"/>
                    </manifest>`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(a,null,{default:i(()=>t[236]||(t[236]=[n("composeApp")])),_:1}),t[237]||(t[237]=n(" 실행 구성을 사용하여 안드로이드 애플리케이션을 실행합니다. 이제 안드로이드 클라이언트도 실행되는 것을 확인할 수 있습니다: ")),t[238]||(t[238]=o("img",{style:{},src:R,alt:"안드로이드에서 실행되는 앱",width:"350","border-effect":"rounded"},null,-1))])]),_:1}),l(r,null,{default:i(()=>[o("p",null,[t[240]||(t[240]=n(" 데스크톱 클라이언트의 경우, 컨테이너 창에 크기와 제목을 할당해야 합니다. ")),l(e,null,{default:i(()=>t[239]||(t[239]=[n("composeApp/src/desktopMain/.../main.kt")])),_:1}),t[241]||(t[241]=n(" 파일을 열고 ")),t[242]||(t[242]=o("code",null,"title",-1)),t[243]||(t[243]=n("을 변경하고 ")),t[244]||(t[244]=o("code",null,"state",-1)),t[245]||(t[245]=n(" 속성을 설정하여 코드를 수정합니다: "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    val state = WindowState(
        size = DpSize(400.dp, 600.dp),
        position = WindowPosition(200.dp, 100.dp)
    )
    Window(
        title = "Task Manager (Desktop)",
        state = state,
        onCloseRequest = ::exitApplication
    ) {
        App()
    }
}`})]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(a,null,{default:i(()=>t[246]||(t[246]=[n("composeApp [desktop]")])),_:1}),t[247]||(t[247]=n(" 실행 구성을 사용하여 데스크톱 애플리케이션을 실행합니다: ")),t[248]||(t[248]=o("img",{style:{},src:B,alt:"데스크톱에서 실행되는 앱",width:"400","border-effect":"rounded"},null,-1))])]),_:1}),l(r,null,{default:i(()=>[o("p",null,[l(a,null,{default:i(()=>t[249]||(t[249]=[n("composeApp [wasmJs]")])),_:1}),t[250]||(t[250]=n(" 실행 구성을 사용하여 웹 클라이언트를 실행합니다: "))]),t[251]||(t[251]=o("img",{style:{},src:H,alt:"데스크톱에서 실행되는 앱",width:"400","border-effect":"rounded"},null,-1))]),_:1})]),_:1})]),_:1}),l(d,{title:"UI 개선",id:"improve-ui"},{default:i(()=>[t[267]||(t[267]=o("p",null," 이제 클라이언트가 서버와 통신하지만, 이는 전혀 매력적인 UI가 아닙니다. ",-1)),l(p,{id:"improve-ui-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[o("p",null,[l(e,null,{default:i(()=>t[253]||(t[253]=[n("composeApp/src/commonMain/.../full_stack_task_manager")])),_:1}),t[255]||(t[255]=n(" 에 있는 ")),l(e,null,{default:i(()=>t[254]||(t[254]=[n("App.kt")])),_:1}),t[256]||(t[256]=n(" 파일을 열고 기존 ")),t[257]||(t[257]=o("code",null,"App",-1)),t[258]||(t[258]=n("을 아래의 ")),t[259]||(t[259]=o("code",null,"App",-1)),t[260]||(t[260]=n(" 및 ")),t[261]||(t[261]=o("code",null,"TaskCard",-1)),t[262]||(t[262]=n(" 컴포저블로 대체합니다: "))]),l(s,{lang:"kotlin","collapsed-title-line-number":"31",collapsible:"true",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.network.TaskApi
import com.example.ktor.full_stack_task_manager.model.Priority
import com.example.ktor.full_stack_task_manager.model.Task
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ktor.full_stack_task_manager.network.createHttpClient
import kotlinx.coroutines.launch

@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        var tasks by remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()

        LaunchedEffect(Unit) {
            tasks = taskApi.getAllTasks()
        }

        LazyColumn(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize()
        ) {
            items(tasks) { task ->
                TaskCard(
                    task,
                    onDelete = {
                        scope.launch {
                            taskApi.removeTask(it)
                            tasks = taskApi.getAllTasks()
                        }
                    },
                    onUpdate = {
                    }
                )
            }
        }
    }
}

@Composable
fun TaskCard(
    task: Task,
    onDelete: (Task) -> Unit,
    onUpdate: (Task) -> Unit
) {
    fun pickWeight(priority: Priority) = when (priority) {
        Priority.Low -> FontWeight.SemiBold
        Priority.Medium -> FontWeight.Bold
        Priority.High, Priority.Vital -> FontWeight.ExtraBold
    }

    Card(
        modifier = Modifier.fillMaxWidth().padding(4.dp),
        shape = RoundedCornerShape(CornerSize(4.dp))
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Text(
                "\${task.name}: \${task.description}",
                fontSize = 20.sp,
                fontWeight = pickWeight(task.priority)
            )

            Row {
                OutlinedButton(onClick = { onDelete(task) }) {
                    Text("Delete")
                }
                Spacer(Modifier.width(8.dp))
                OutlinedButton(onClick = { onUpdate(task) }) {
                    Text("Update")
                }
            }
        }
    }
}`}),t[263]||(t[263]=o("p",null," 이 구현으로 클라이언트는 이제 몇 가지 기본 기능을 갖게 됩니다. ",-1)),t[264]||(t[264]=o("p",null,[o("code",null,"LaunchedEffect"),n(" 타입을 사용하면 모든 작업이 시작 시 로드되며, "),o("code",null,"LazyColumn"),n(" 컴포저블을 통해 사용자는 작업을 스크롤할 수 있습니다. ")],-1)),t[265]||(t[265]=o("p",null,[n(" 마지막으로, 별도의 "),o("code",null,"TaskCard"),n(" 컴포저블이 생성되며, 이는 다시 "),o("code",null,"Card"),n("를 사용하여 각 "),o("code",null,"Task"),n("의 세부 정보를 표시합니다. 작업을 삭제하고 업데이트하기 위한 버튼이 추가되었습니다. ")],-1))]),_:1}),l(r,null,{default:i(()=>t[266]||(t[266]=[o("p",null,[n(" 클라이언트 애플리케이션을 다시 실행합니다. 예를 들어 안드로이드 앱을 실행합니다. 이제 작업을 스크롤하고, 세부 정보를 보고, 삭제할 수 있습니다: "),o("img",{style:{},src:N,alt:"개선된 UI로 안드로이드에서 실행되는 앱",width:"350","border-effect":"rounded"})],-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"업데이트 기능 추가",id:"add-update-functionality"},{default:i(()=>[t[278]||(t[278]=o("p",null," 클라이언트를 완성하려면 작업 세부 정보를 업데이트할 수 있는 기능을 통합합니다. ",-1)),l(p,{id:"add-update-func-procedure"},{default:i(()=>[l(r,null,{default:i(()=>[l(e,null,{default:i(()=>t[268]||(t[268]=[n("composeApp/src/commonMain/.../full_stack_task_manager")])),_:1}),t[270]||(t[270]=n(" 의 ")),l(e,null,{default:i(()=>t[269]||(t[269]=[n("App.kt")])),_:1}),t[271]||(t[271]=n(" 파일로 이동합니다. "))]),_:1}),l(r,null,{default:i(()=>[t[272]||(t[272]=o("p",null,[n(" 아래와 같이 "),o("code",null,"UpdateTaskDialog"),n(" 컴포저블과 필요한 임포트를 추가합니다: ")],-1)),l(s,{lang:"kotlin",code:`import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.window.Dialog

@Composable
fun UpdateTaskDialog(
    task: Task,
    onConfirm: (Task) -> Unit
) {
    var description by remember { mutableStateOf(task.description) }
    var priorityText by remember { mutableStateOf(task.priority.toString()) }
    val colors = TextFieldDefaults.colors(
        focusedTextColor = Color.Blue,
        focusedContainerColor = Color.White,
    )

    Dialog(onDismissRequest = {}) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(4.dp),
            shape = RoundedCornerShape(CornerSize(4.dp))
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Text("Update \${task.name}", fontSize = 20.sp)
                TextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description") },
                    colors = colors
                )
                TextField(
                    value = priorityText,
                    onValueChange = { priorityText = it },
                    label = { Text("Priority") },
                    colors = colors
                )
                OutlinedButton(onClick = {
                    val newTask = Task(
                        task.name,
                        description,
                        try {
                            Priority.valueOf(priorityText)
                        } catch (e: IllegalArgumentException) {
                            Priority.Low
                        }
                    )
                    onConfirm(newTask)
                }) {
                    Text("Update")
                }
            }
        }
    }
}`}),t[273]||(t[273]=o("p",null,[n(" 이는 대화 상자로 "),o("code",null,"Task"),n("의 세부 정보를 표시하는 컴포저블입니다. "),o("code",null,"description"),n(" 과 "),o("code",null,"priority"),n("는 "),o("code",null,"TextField"),n(" 컴포저블 내에 배치되어 업데이트될 수 있습니다. 사용자가 업데이트 버튼을 누르면 "),o("code",null,"onConfirm()"),n(" 콜백이 트리거됩니다. ")],-1))]),_:1}),l(r,null,{default:i(()=>[t[274]||(t[274]=o("p",null,[n(" 동일한 파일에서 "),o("code",null,"App"),n(" 컴포저블을 업데이트합니다: ")],-1)),l(s,{lang:"kotlin",code:`@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        var tasks by remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()
        var currentTask by remember { mutableStateOf<Task?>(null) }

        LaunchedEffect(Unit) {
            tasks = taskApi.getAllTasks()
        }

        if (currentTask != null) {
            UpdateTaskDialog(
                currentTask!!,
                onConfirm = {
                    scope.launch {
                        taskApi.updateTask(it)
                        tasks = taskApi.getAllTasks()
                    }
                    currentTask = null
                }
            )
        }

        LazyColumn(modifier = Modifier
            .safeContentPadding()
            .fillMaxSize()
        ) {
            items(tasks) { task ->
                TaskCard(
                    task,
                    onDelete = {
                        scope.launch {
                            taskApi.removeTask(it)
                            tasks = taskApi.getAllTasks()
                        }
                    },
                    onUpdate = {
                        currentTask = task
                    }
                )
            }
        }
    }
}`}),t[275]||(t[275]=o("p",null,[n(" 선택된 현재 작업이라는 추가적인 상태를 저장하고 있습니다. 이 값이 null이 아니면 "),o("code",null,"UpdateTaskDialog"),n(" 컴포저블을 호출하며, "),o("code",null,"onConfirm()"),n(" 콜백은 "),o("code",null,"TaskApi"),n("를 사용하여 서버에 POST 요청을 보내도록 설정됩니다. ")],-1)),t[276]||(t[276]=o("p",null,[n(" 마지막으로, "),o("code",null,"TaskCard"),n(" 컴포저블을 생성할 때 "),o("code",null,"onUpdate()"),n(" 콜백을 사용하여 "),o("code",null,"currentTask"),n(" 상태 변수를 설정합니다. ")],-1))]),_:1}),l(r,null,{default:i(()=>t[277]||(t[277]=[n(" 클라이언트 애플리케이션을 다시 실행합니다. 이제 버튼을 사용하여 각 작업의 세부 정보를 업데이트할 수 있어야 합니다. "),o("img",{style:{},src:U,alt:"안드로이드에서 작업 삭제",width:"350","border-effect":"rounded"},null,-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"다음 단계",id:"next-steps"},{default:i(()=>[t[286]||(t[286]=o("p",null," 이 문서에서는 Kotlin Multiplatform 애플리케이션의 맥락에서 Ktor를 사용했습니다. 이제 여러 서비스와 클라이언트를 포함하는 프로젝트를 생성하고 다양한 플랫폼을 대상으로 할 수 있습니다. ",-1)),o("p",null,[t[282]||(t[282]=n(" 보시다시피, 코드 중복이나 불필요한 부분 없이 기능을 구축하는 것이 가능합니다. 프로젝트의 모든 계층에 필요한 타입은 ")),l(e,null,{default:i(()=>t[279]||(t[279]=[n("shared")])),_:1}),t[283]||(t[283]=n(" 멀티플랫폼 모듈 내에 배치될 수 있습니다. 서비스에만 필요한 기능은 ")),l(e,null,{default:i(()=>t[280]||(t[280]=[n("server")])),_:1}),t[284]||(t[284]=n(" 모듈에 들어가고, 클라이언트에만 필요한 기능은 ")),l(e,null,{default:i(()=>t[281]||(t[281]=[n("composeApp")])),_:1}),t[285]||(t[285]=n(" 에 배치됩니다. "))]),t[287]||(t[287]=o("p",null,[n(" 이러한 종류의 개발은 필연적으로 클라이언트 및 서버 기술에 대한 지식을 요구합니다. 그러나 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"},"Kotlin Multiplatform"),n(" 라이브러리와 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"}," Compose Multiplatform"),n("을(를) 사용하여 배워야 할 새로운 자료의 양을 최소화할 수 있습니다. 초기에는 단일 플랫폼에만 집중하더라도, 애플리케이션 수요가 증가함에 따라 다른 플랫폼을 쉽게 추가할 수 있습니다. ")],-1))]),_:1})]),_:1})])}const _=E(W,[["render",F]]);export{Z as __pageData,_ as default};
