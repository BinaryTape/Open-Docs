import{_ as c,C as l,c as u,o as m,G as i,ag as r,j as a,w as t,a as n}from"./chunks/framework.Bksy39di.js";const L=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-rate-limit.md","filePath":"ko/ktor/server-rate-limit.md","lastUpdated":1755457140000}'),C={name:"ko/ktor/server-rate-limit.md"};function B(q,s,v,b,f,A){const E=l("TopicTitle"),d=l("show-structure"),o=l("primary-label"),k=l("Links"),g=l("tldr"),y=l("link-summary"),e=l("code-block"),p=l("TabItem"),h=l("Tabs"),F=l("list");return m(),u("div",null,[i(E,{labelRef:"server-plugin",title:"속도 제한"}),i(d,{for:"chapter",depth:"2"}),i(o,{ref:"server-plugin"},null,512),i(g,null,{default:t(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"필수 종속성"),n(": "),a("code",null,"io.ktor:ktor-server-rate-limit")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"코드 예제"),n(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/rate-limit"}," rate-limit ")],-1)),a("p",null,[a("b",null,[i(k,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다."},{default:t(()=>s[0]||(s[0]=[n("네이티브 서버")])),_:1}),s[1]||(s[1]=n(" 지원"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),i(y,null,{default:t(()=>s[5]||(s[5]=[n(" RateLimit은(는) 들어오는 요청의 본문을 검증하는 기능을 제공합니다. ")])),_:1}),s[18]||(s[18]=r("",4)),i(h,{group:"languages"},{default:t(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[i(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-rate-limit:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[i(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-rate-limit:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:t(()=>[i(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-rate-limit-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=a("h2",{id:"install_plugin",tabindex:"-1"},[n("RateLimit 설치 "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "RateLimit 설치 {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=n(" 애플리케이션에 ")),s[8]||(s[8]=a("code",null,"RateLimit",-1)),s[9]||(s[9]=n(" 플러그인을 ")),s[10]||(s[10]=a("a",{href:"#install"},"설치",-1)),s[11]||(s[11]=n("하려면, 지정된 ")),i(k,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:t(()=>s[6]||(s[6]=[n("모듈")])),_:1}),s[12]||(s[12]=n("의 ")),s[13]||(s[13]=a("code",null,"install",-1)),s[14]||(s[14]=n(" 함수에 플러그인을 전달합니다. 아래 코드 스니펫은 ")),s[15]||(s[15]=a("code",null,"RateLimit",-1)),s[16]||(s[16]=n("을(를) 설치하는 방법을 보여줍니다... "))]),i(F,null,{default:t(()=>s[17]||(s[17]=[a("li",null,[n(" ... "),a("code",null,"embeddedServer"),n(" 함수 호출 내에서. ")],-1),a("li",null,[n(" ... "),a("code",null,"Application"),n(" 클래스의 확장 함수인 명시적으로 정의된 "),a("code",null,"module"),n(" 내에서. ")],-1)])),_:1}),i(h,null,{default:t(()=>[i(p,{title:"embeddedServer"},{default:t(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.ratelimit.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(RateLimit)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:t(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.ratelimit.*
            // ...
            fun Application.module() {
                install(RateLimit)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=r("",20))])}const R=c(C,[["render",B]]);export{L as __pageData,R as default};
