import{_ as y,C as t,c as F,o as v,G as e,ag as r,j as i,w as n,a}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-sessions.md","filePath":"ko/ktor/server-sessions.md","lastUpdated":1755457140000}'),m={name:"ko/ktor/server-sessions.md"};function b(C,s,f,q,_,S){const o=t("TopicTitle"),d=t("show-structure"),E=t("primary-label"),p=t("Links"),g=t("tldr"),c=t("link-summary"),l=t("code-block"),h=t("TabItem"),k=t("Tabs"),u=t("list");return v(),F("div",null,[e(o,{labelRef:"server-plugin",title:"세션"}),e(d,{for:"chapter",depth:"2"}),e(E,{ref:"server-plugin"},null,512),e(g,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"필수 의존성"),a(": "),i("code",null,"io.ktor:ktor-server-sessions")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"코드 예시"),a(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-cookie-client"},"session-cookie-client"),a(", "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-cookie-server"},"session-cookie-server"),a(", "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-header-server"},"session-header-server")],-1)),i("p",null,[i("b",null,[e(p,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있게 해줍니다."},{default:n(()=>s[0]||(s[0]=[a("네이티브 서버")])),_:1}),s[1]||(s[1]=a(" 지원"))]),s[2]||(s[2]=a(": ✅ "))])]),_:1}),e(c,null,{default:n(()=>s[5]||(s[5]=[a(" 세션 플러그인은 다른 HTTP 요청 간에 데이터를 지속시키는 메커니즘을 제공합니다. ")])),_:1}),s[18]||(s[18]=r("",4)),e(k,{group:"languages"},{default:n(()=>[e(h,{title:"Gradle (코틀린)","group-key":"kotlin"},{default:n(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-sessions:$ktor_version")'})]),_:1}),e(h,{title:"Gradle (그루비)","group-key":"groovy"},{default:n(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-sessions:$ktor_version"'})]),_:1}),e(h,{title:"Maven","group-key":"maven"},{default:n(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-sessions-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[a("세션 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "세션 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=a(" 애플리케이션에 ")),s[8]||(s[8]=i("code",null,"Sessions",-1)),s[9]||(s[9]=a(" 플러그인을 ")),s[10]||(s[10]=i("a",{href:"#install"},"설치",-1)),s[11]||(s[11]=a("하려면, 지정된 ")),e(p,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다."},{default:n(()=>s[6]||(s[6]=[a("모듈")])),_:1}),s[12]||(s[12]=a(" 내의 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=a(" 함수에 전달하면 됩니다. 아래 코드 스니펫은 ")),s[15]||(s[15]=i("code",null,"Sessions",-1)),s[16]||(s[16]=a("을 설치하는 방법을 보여줍니다... "))]),e(u,null,{default:n(()=>s[17]||(s[17]=[i("li",null,[a(" ... "),i("code",null,"embeddedServer"),a(" 함수 호출 내에서. ")],-1),i("li",null,[a(" ... "),i("code",null,"Application"),a(" 클래스의 확장 함수인 명시적으로 정의된 "),i("code",null,"module"),a(" 내에서. ")],-1)])),_:1}),e(k,null,{default:n(()=>[e(h,{title:"embeddedServer"},{default:n(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.sessions.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Sessions)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(h,{title:"module"},{default:n(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.sessions.*
            // ...
            fun Application.module() {
                install(Sessions)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=r("",70))])}const x=y(m,[["render",b]]);export{A as __pageData,x as default};
