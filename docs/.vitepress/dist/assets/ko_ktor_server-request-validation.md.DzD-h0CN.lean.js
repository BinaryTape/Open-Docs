import{_ as y,C as e,c as F,o as v,G as i,ag as d,j as a,w as n,a as t}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-request-validation.md","filePath":"ko/ktor/server-request-validation.md","lastUpdated":1755457140000}'),b={name:"ko/ktor/server-request-validation.md"};function m(C,s,q,f,B,V){const o=e("TopicTitle"),r=e("show-structure"),E=e("primary-label"),h=e("Links"),g=e("tldr"),c=e("link-summary"),l=e("code-block"),p=e("TabItem"),k=e("Tabs"),u=e("list");return v(),F("div",null,[i(o,{labelRef:"server-plugin",title:"요청 유효성 검사"}),i(r,{for:"chapter",depth:"2"}),i(E,{ref:"server-plugin"},null,512),i(g,null,{default:n(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"필수 의존성"),t(": "),a("code",null,"io.ktor:ktor-server-request-validation")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"코드 예시"),t(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/request-validation"}," request-validation ")],-1)),a("p",null,[a("b",null,[i(h,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다."},{default:n(()=>s[0]||(s[0]=[t("네이티브 서버")])),_:1}),s[1]||(s[1]=t(" 지원"))]),s[2]||(s[2]=t(": ✅ "))])]),_:1}),i(c,null,{default:n(()=>s[5]||(s[5]=[t(" RequestValidation는 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다. ")])),_:1}),s[18]||(s[18]=d("",3)),i(k,{group:"languages"},{default:n(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-request-validation:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-request-validation:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:n(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-request-validation-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=a("h2",{id:"install_plugin",tabindex:"-1"},[t("RequestValidation 설치 "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "RequestValidation 설치 {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=t(" 애플리케이션에 ")),s[8]||(s[8]=a("code",null,"RequestValidation",-1)),s[9]||(s[9]=t(" 플러그인을 ")),s[10]||(s[10]=a("a",{href:"#install"},"설치",-1)),s[11]||(s[11]=t("하려면, 지정된 ")),i(h,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:n(()=>s[6]||(s[6]=[t("모듈")])),_:1}),s[12]||(s[12]=t("의 ")),s[13]||(s[13]=a("code",null,"install",-1)),s[14]||(s[14]=t(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[15]||(s[15]=a("code",null,"RequestValidation",-1)),s[16]||(s[16]=t("을(를) 설치하는 방법을 보여줍니다 ... "))]),i(u,null,{default:n(()=>s[17]||(s[17]=[a("li",null,[t(" ... "),a("code",null,"embeddedServer"),t(" 함수 호출 내에서. ")],-1),a("li",null,[t(" ... "),a("code",null,"Application"),t(" 클래스의 확장 함수인 명시적으로 정의된 "),a("code",null,"module"),t(" 내에서. ")],-1)])),_:1}),i(k,null,{default:n(()=>[i(p,{title:"embeddedServer"},{default:n(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.requestvalidation.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(RequestValidation)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:n(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.requestvalidation.*
            // ...
            fun Application.module() {
                install(RequestValidation)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=d("",26))])}const _=y(b,[["render",m]]);export{A as __pageData,_ as default};
