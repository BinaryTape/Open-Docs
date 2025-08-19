import{_ as c,C as n,c as y,o as m,G as a,ag as k,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-call-logging.md","filePath":"ko/ktor/server-call-logging.md","lastUpdated":1755457140000}'),v={name:"ko/ktor/server-call-logging.md"};function F(C,s,f,b,_,q){const h=n("TopicTitle"),d=n("show-structure"),g=n("primary-label"),p=n("Links"),u=n("tldr"),e=n("code-block"),o=n("TabItem"),r=n("Tabs"),E=n("list");return m(),y("div",null,[a(h,{labelRef:"server-plugin",title:"호출 로깅"}),a(d,{for:"chapter",depth:"2"}),a(g,{ref:"server-plugin"},null,512),a(u,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"필수 의존성"),l(": "),i("code",null,"io.ktor:ktor-server-call-logging")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"코드 예시"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/logging"}," logging ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:t(()=>s[0]||(s[0]=[l("네이티브 서버")])),_:1}),s[1]||(s[1]=l(" 지원"))]),s[2]||(s[2]=l(": ✖️ "))])]),_:1}),s[17]||(s[17]=k("",4)),a(r,{group:"languages"},{default:t(()=>[a(o,{title:"그레이들 (코틀린)","group-key":"kotlin"},{default:t(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-logging:$ktor_version")'})]),_:1}),a(o,{title:"그레이들 (그루비)","group-key":"groovy"},{default:t(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-logging:$ktor_version"'})]),_:1}),a(o,{title:"메이븐","group-key":"maven"},{default:t(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-logging-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("CallLogging 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "CallLogging 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=l(" 애플리케이션에 ")),s[7]||(s[7]=i("code",null,"CallLogging",-1)),s[8]||(s[8]=l(" 플러그인을 ")),s[9]||(s[9]=i("a",{href:"#install"},"설치",-1)),s[10]||(s[10]=l("하려면, 지정된 ")),a(p,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:t(()=>s[5]||(s[5]=[l("모듈")])),_:1}),s[11]||(s[11]=l("의 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=l(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[14]||(s[14]=i("code",null,"CallLogging",-1)),s[15]||(s[15]=l("을(를) 설치하는 방법을 보여줍니다... "))]),a(E,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[l(" ... "),i("code",null,"embeddedServer"),l(" 함수 호출 내에서. ")],-1),i("li",null,[l(" ... "),i("code",null,"Application"),l(" 클래스의 확장 함수인 명시적으로 정의된 "),i("code",null,"module"),l(" 내에서. ")],-1)])),_:1}),a(r,null,{default:t(()=>[a(o,{title:"embeddedServer"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.calllogging.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallLogging)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(o,{title:"module"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.calllogging.*
            // ...
            fun Application.module() {
                install(CallLogging)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=k("",17))])}const D=c(v,[["render",F]]);export{B as __pageData,D as default};
