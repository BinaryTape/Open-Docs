import{_ as m}from"./chunks/forwarded-headers.CS4yn2xX.js";import{_ as f,C as d,c as v,o as y,G as t,ag as k,j as r,w as i,a as o}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-forward-headers.md","filePath":"ko/ktor/server-forward-headers.md","lastUpdated":1755457140000}'),F={name:"ko/ktor/server-forward-headers.md"};function w(b,e,E,q,H,_){const u=d("TopicTitle"),h=d("show-structure"),c=d("primary-label"),n=d("Links"),g=d("tldr"),a=d("code-block"),s=d("TabItem"),l=d("Tabs"),p=d("list");return y(),v("div",null,[t(u,{labelRef:"server-plugin",title:"포워디드 헤더"}),t(h,{for:"chapter",depth:"2"}),t(c,{ref:"server-plugin"},null,512),t(g,null,{default:i(()=>[e[3]||(e[3]=r("p",null,[r("b",null,"필수 의존성"),o(": "),r("code",null,"io.ktor:ktor-server-forwarded-header")],-1)),e[4]||(e[4]=r("p",null,[r("b",null,"코드 예시"),o(": "),r("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/forwarded-header"}," forwarded-header ")],-1)),r("p",null,[r("b",null,[t(n,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:i(()=>e[0]||(e[0]=[o("네이티브 서버")])),_:1}),e[1]||(e[1]=o(" 지원"))]),e[2]||(e[2]=o(": ✅ "))])]),_:1}),e[29]||(e[29]=k("",5)),t(l,{group:"languages"},{default:i(()=>[t(s,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:i(()=>[t(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-forwarded-header:$ktor_version")'})]),_:1}),t(s,{title:"Gradle (Groovy)","group-key":"groovy"},{default:i(()=>[t(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-forwarded-header:$ktor_version"'})]),_:1}),t(s,{title:"Maven","group-key":"maven"},{default:i(()=>[t(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-forwarded-header-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[30]||(e[30]=r("h2",{id:"install_plugin",tabindex:"-1"},[o("플러그인 설치 "),r("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "플러그인 설치 {id="install_plugin"}"'},"​")],-1)),t(l,null,{default:i(()=>[t(s,{title:"ForwardedHeader"},{default:i(()=>[r("p",null,[e[6]||(e[6]=o(" 애플리케이션에 ")),e[7]||(e[7]=r("code",null,"ForwardedHeaders",-1)),e[8]||(e[8]=o(" 플러그인을 ")),e[9]||(e[9]=r("a",{href:"#install"},"설치",-1)),e[10]||(e[10]=o("하려면, 지정된 ")),t(n,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:i(()=>e[5]||(e[5]=[o("모듈")])),_:1}),e[11]||(e[11]=o(" 내의 ")),e[12]||(e[12]=r("code",null,"install",-1)),e[13]||(e[13]=o(" 함수에 전달하세요. 아래 코드 스니펫은 ")),e[14]||(e[14]=r("code",null,"ForwardedHeaders",-1)),e[15]||(e[15]=o("을(를) 설치하는 방법을 보여줍니다... "))]),t(p,null,{default:i(()=>e[16]||(e[16]=[r("li",null,[o(" ... "),r("code",null,"embeddedServer"),o(" 함수 호출 내에서. ")],-1),r("li",null,[o(" ... "),r("code",null,"Application"),o(" 클래스의 확장 함수인 명시적으로 정의된 "),r("code",null,"module"),o(" 내에서. ")],-1)])),_:1}),t(l,null,{default:i(()=>[t(s,{title:"embeddedServer"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(s,{title:"module"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(ForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1}),t(s,{title:"XForwardedHeader"},{default:i(()=>[r("p",null,[e[18]||(e[18]=o(" 애플리케이션에 ")),e[19]||(e[19]=r("code",null,"XForwardedHeaders",-1)),e[20]||(e[20]=o(" 플러그인을 ")),e[21]||(e[21]=r("a",{href:"#install"},"설치",-1)),e[22]||(e[22]=o("하려면, 지정된 ")),t(n,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:i(()=>e[17]||(e[17]=[o("모듈")])),_:1}),e[23]||(e[23]=o(" 내의 ")),e[24]||(e[24]=r("code",null,"install",-1)),e[25]||(e[25]=o(" 함수에 전달하세요. 아래 코드 스니펫은 ")),e[26]||(e[26]=r("code",null,"XForwardedHeaders",-1)),e[27]||(e[27]=o("을(를) 설치하는 방법을 보여줍니다... "))]),t(p,null,{default:i(()=>e[28]||(e[28]=[r("li",null,[o(" ... "),r("code",null,"embeddedServer"),o(" 함수 호출 내에서. ")],-1),r("li",null,[o(" ... "),r("code",null,"Application"),o(" 클래스의 확장 함수인 명시적으로 정의된 "),r("code",null,"module"),o(" 내에서. ")],-1)])),_:1}),t(l,null,{default:i(()=>[t(s,{title:"embeddedServer"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(XForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(s,{title:"module"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(XForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1})]),_:1}),e[31]||(e[31]=k("",17))])}const X=f(F,[["render",w]]);export{P as __pageData,X as default};
