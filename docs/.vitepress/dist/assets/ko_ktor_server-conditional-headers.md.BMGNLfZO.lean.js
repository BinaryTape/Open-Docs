import{_ as c,C as a,c as E,o as y,G as s,ag as p,j as e,w as n,a as t}from"./chunks/framework.Bksy39di.js";const S=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-conditional-headers.md","filePath":"ko/ktor/server-conditional-headers.md","lastUpdated":1755457140000}'),m={name:"ko/ktor/server-conditional-headers.md"};function f(v,i,C,_,F,b){const k=a("TopicTitle"),h=a("primary-label"),r=a("Links"),g=a("tldr"),o=a("code-block"),l=a("TabItem"),d=a("Tabs"),u=a("list");return y(),E("div",null,[s(k,{labelRef:"server-plugin",title:"조건부 헤더"}),s(h,{ref:"server-plugin"},null,512),s(g,null,{default:n(()=>[i[3]||(i[3]=e("p",null,[e("b",null,"필수 의존성"),t(": "),e("code",null,"io.ktor:ktor-server-conditional-headers")],-1)),i[4]||(i[4]=e("p",null,[e("b",null,"코드 예시"),t(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/conditional-headers"}," conditional-headers ")],-1)),e("p",null,[e("b",null,[s(r,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:n(()=>i[0]||(i[0]=[t("네이티브 서버")])),_:1}),i[1]||(i[1]=t(" 지원"))]),i[2]||(i[2]=t(": ✅ "))])]),_:1}),i[17]||(i[17]=p("",4)),s(d,{group:"languages"},{default:n(()=>[s(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[s(o,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-conditional-headers:$ktor_version")'})]),_:1}),s(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[s(o,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-conditional-headers:$ktor_version"'})]),_:1}),s(l,{title:"Maven","group-key":"maven"},{default:n(()=>[s(o,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-conditional-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[18]||(i[18]=e("h2",{id:"install_plugin",tabindex:"-1"},[t("ConditionalHeaders 설치 "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "ConditionalHeaders 설치 {id="install_plugin"}"'},"​")],-1)),e("p",null,[i[6]||(i[6]=t(" 애플리케이션에 ")),i[7]||(i[7]=e("code",null,"ConditionalHeaders",-1)),i[8]||(i[8]=t(" 플러그인을 ")),i[9]||(i[9]=e("a",{href:"#install"},"설치",-1)),i[10]||(i[10]=t("하려면, 지정된 ")),s(r,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:n(()=>i[5]||(i[5]=[t("모듈")])),_:1}),i[11]||(i[11]=t("에서 ")),i[12]||(i[12]=e("code",null,"install",-1)),i[13]||(i[13]=t(" 함수에 전달하세요. 아래 코드 스니펫은 ")),i[14]||(i[14]=e("code",null,"ConditionalHeaders",-1)),i[15]||(i[15]=t("을(를) 설치하는 방법을 보여줍니다... "))]),s(u,null,{default:n(()=>i[16]||(i[16]=[e("li",null,[t(" ... "),e("code",null,"embeddedServer"),t(" 함수 호출 내에서. ")],-1),e("li",null,[t(" ... "),e("code",null,"Application"),t(" 클래스의 확장 함수인 명시적으로 정의된 "),e("code",null,"module"),t(" 내에서. ")],-1)])),_:1}),s(d,null,{default:n(()=>[s(l,{title:"embeddedServer"},{default:n(()=>[s(o,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.conditionalheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ConditionalHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(l,{title:"module"},{default:n(()=>[s(o,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.conditionalheaders.*
            // ...
            fun Application.module() {
                install(ConditionalHeaders)
                // ...
            }`})]),_:1})]),_:1}),i[19]||(i[19]=p("",6))])}const A=c(m,[["render",f]]);export{S as __pageData,A as default};
