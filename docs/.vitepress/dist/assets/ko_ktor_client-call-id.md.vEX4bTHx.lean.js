import{_ as C,C as t,c as y,o as m,G as s,ag as p,j as l,w as e,a}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/client-call-id.md","filePath":"ko/ktor/client-call-id.md","lastUpdated":1755457140000}'),I={name:"ko/ktor/client-call-id.md"};function b(v,i,f,_,F,D){const r=t("TopicTitle"),k=t("show-structure"),h=t("primary-label"),c=t("tldr"),u=t("link-summary"),n=t("code-block"),o=t("TabItem"),d=t("Tabs"),g=t("Links"),E=t("list");return m(),y("div",null,[s(r,{labelRef:"client-plugin",title:"Ktor 클라이언트에서 요청 추적하기"}),s(k,{for:"chapter",depth:"2"}),s(h,{ref:"client-plugin"},null,512),s(c,null,{default:e(()=>i[0]||(i[0]=[l("p",null,[l("b",null,"필수 의존성"),a(": "),l("code",null,"io.ktor:ktor-client-call-id")],-1),l("p",null,[l("b",null,"코드 예시"),a(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-call-id"}," client-call-id ")],-1)])),_:1}),s(u,null,{default:e(()=>i[1]||(i[1]=[a(" CallId 클라이언트 플러그인을 사용하면 고유한 호출 ID를 사용하여 클라이언트 요청을 추적할 수 있습니다. ")])),_:1}),i[14]||(i[14]=p("",6)),s(d,{group:"languages"},{default:e(()=>[s(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[s(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-client-call-id:$ktor_version")'})]),_:1}),s(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[s(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-client-call-id:$ktor_version"'})]),_:1}),s(o,{title:"Maven","group-key":"maven"},{default:e(()=>[s(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-client-call-id-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[15]||(i[15]=l("h2",{id:"install_plugin",tabindex:"-1"},[a("CallId 설치 "),l("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "CallId 설치 {id="install_plugin"}"'},"​")],-1)),l("p",null,[i[3]||(i[3]=a(" 애플리케이션에 ")),i[4]||(i[4]=l("code",null,"CallId",-1)),i[5]||(i[5]=a(" 플러그인을 ")),i[6]||(i[6]=l("a",{href:"#install"},"설치",-1)),i[7]||(i[7]=a("하려면, 지정된 ")),s(g,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:e(()=>i[2]||(i[2]=[a("모듈")])),_:1}),i[8]||(i[8]=a("의 ")),i[9]||(i[9]=l("code",null,"install",-1)),i[10]||(i[10]=a(" 함수에 전달하세요. 아래 코드 스니펫은 ")),i[11]||(i[11]=l("code",null,"CallId",-1)),i[12]||(i[12]=a("을(를) 설치하는 방법을 보여줍니다... "))]),s(E,null,{default:e(()=>i[13]||(i[13]=[l("li",null,[a(" ... "),l("code",null,"embeddedServer"),a(" 함수 호출 내부에서. ")],-1),l("li",null,[a(" ... "),l("code",null,"Application"),a(" 클래스의 확장 함수인 명시적으로 정의된 "),l("code",null,"module"),a(" 내부에서. ")],-1)])),_:1}),s(d,null,{default:e(()=>[s(o,{title:"embeddedServer"},{default:e(()=>[s(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.client.plugins.callid.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallId)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(o,{title:"module"},{default:e(()=>[s(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.client.plugins.callid.*
            // ...
            fun Application.module() {
                install(CallId)
                // ...
            }`})]),_:1})]),_:1}),i[16]||(i[16]=p("",24))])}const x=C(I,[["render",b]]);export{T as __pageData,x as default};
