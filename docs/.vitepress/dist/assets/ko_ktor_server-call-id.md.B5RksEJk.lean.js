import{_ as y,C as t,c as v,o as m,G as a,ag as d,j as i,w as l,a as e}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-call-id.md","filePath":"ko/ktor/server-call-id.md","lastUpdated":1755457140000}'),b={name:"ko/ktor/server-call-id.md"};function C(I,s,f,F,D,q){const h=t("TopicTitle"),k=t("show-structure"),c=t("primary-label"),r=t("Links"),g=t("tldr"),u=t("link-summary"),n=t("code-block"),p=t("TabItem"),o=t("Tabs"),E=t("list");return m(),v("div",null,[a(h,{labelRef:"server-plugin",title:"Ktor 서버에서 요청 추적하기"}),a(k,{for:"chapter",depth:"2"}),a(c,{ref:"server-plugin"},null,512),a(g,null,{default:l(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"필수 의존성"),e(": "),i("code",null,"io.ktor:ktor-server-call-id")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"코드 예시"),e(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/call-id"}," call-id ")],-1)),i("p",null,[i("b",null,[a(r,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다."},{default:l(()=>s[0]||(s[0]=[e("네이티브 서버")])),_:1}),s[1]||(s[1]=e(" 지원"))]),s[2]||(s[2]=e(": ✅ "))])]),_:1}),a(u,null,{default:l(()=>s[5]||(s[5]=[e(" CallId 서버 플러그인을 사용하면 고유한 호출 ID를 사용하여 클라이언트 요청을 추적할 수 있습니다. ")])),_:1}),s[18]||(s[18]=d("",6)),a(o,{group:"languages"},{default:l(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:l(()=>[a(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-id:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:l(()=>[a(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-id:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:l(()=>[a(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-id-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[e("CallId 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "CallId 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=e(" 애플리케이션에 ")),s[8]||(s[8]=i("code",null,"CallId",-1)),s[9]||(s[9]=e(" 플러그인을 ")),s[10]||(s[10]=i("a",{href:"#install"},"설치",-1)),s[11]||(s[11]=e("하려면 지정된 ")),a(r,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다."},{default:l(()=>s[6]||(s[6]=[e("모듈")])),_:1}),s[12]||(s[12]=e("의 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=e(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[15]||(s[15]=i("code",null,"CallId",-1)),s[16]||(s[16]=e("을(를) 설치하는 방법을 보여줍니다... "))]),a(E,null,{default:l(()=>s[17]||(s[17]=[i("li",null,[e(" ... "),i("code",null,"embeddedServer"),e(" 함수 호출 내. ")],-1),i("li",null,[e(" ... 명시적으로 정의된 "),i("code",null,"module"),e(" 내. "),i("code",null,"module"),e("은 "),i("code",null,"Application"),e(" 클래스의 확장 함수입니다. ")],-1)])),_:1}),a(o,null,{default:l(()=>[a(p,{title:"embeddedServer"},{default:l(()=>[a(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.callid.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallId)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:l(()=>[a(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.callid.*
            // ...
            fun Application.module() {
                install(CallId)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=d("",36))])}const x=y(b,[["render",C]]);export{B as __pageData,x as default};
