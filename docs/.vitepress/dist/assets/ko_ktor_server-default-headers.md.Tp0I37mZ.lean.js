import{_ as f,C as l,c as v,o as m,G as t,ag as p,j as a,w as i,a as s}from"./chunks/framework.Bksy39di.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-default-headers.md","filePath":"ko/ktor/server-default-headers.md","lastUpdated":1755457140000}'),E={name:"ko/ktor/server-default-headers.md"};function y(b,e,_,H,C,q){const u=l("TopicTitle"),k=l("show-structure"),h=l("primary-label"),o=l("Links"),g=l("tldr"),n=l("code-block"),r=l("TabItem"),d=l("Tabs"),c=l("list");return m(),v("div",null,[t(u,{labelRef:"server-plugin",title:"기본 헤더"}),t(k,{for:"chapter",depth:"2"}),t(h,{ref:"server-plugin"},null,512),t(g,null,{default:i(()=>[e[3]||(e[3]=a("p",null,[a("b",null,"필수 의존성"),s(": "),a("code",null,"io.ktor:ktor-server-default-headers")],-1)),a("p",null,[a("b",null,[t(o,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있도록 합니다."},{default:i(()=>e[0]||(e[0]=[s("네이티브 서버")])),_:1}),e[1]||(e[1]=s(" 지원"))]),e[2]||(e[2]=s(": ✅ "))])]),_:1}),e[16]||(e[16]=p("",3)),t(d,{group:"languages"},{default:i(()=>[t(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:i(()=>[t(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-default-headers:$ktor_version")'})]),_:1}),t(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:i(()=>[t(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-default-headers:$ktor_version"'})]),_:1}),t(r,{title:"Maven","group-key":"maven"},{default:i(()=>[t(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-default-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[17]||(e[17]=a("h2",{id:"install_plugin",tabindex:"-1"},[s("DefaultHeaders 설치 "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "DefaultHeaders 설치 {id="install_plugin"}"'},"​")],-1)),a("p",null,[e[5]||(e[5]=s(" 애플리케이션에 ")),e[6]||(e[6]=a("code",null,"DefaultHeaders",-1)),e[7]||(e[7]=s(" 플러그인을 ")),e[8]||(e[8]=a("a",{href:"#install"},"설치",-1)),e[9]||(e[9]=s("하려면, 지정된 ")),t(o,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:i(()=>e[4]||(e[4]=[s("모듈")])),_:1}),e[10]||(e[10]=s(" 내의 ")),e[11]||(e[11]=a("code",null,"install",-1)),e[12]||(e[12]=s(" 함수에 전달하십시오. 아래 코드 스니펫은 ")),e[13]||(e[13]=a("code",null,"DefaultHeaders",-1)),e[14]||(e[14]=s("을(를) 설치하는 방법을 보여줍니다... "))]),t(c,null,{default:i(()=>e[15]||(e[15]=[a("li",null,[s(" ... "),a("code",null,"embeddedServer"),s(" 함수 호출 내에서. ")],-1),a("li",null,[s(" ... "),a("code",null,"Application"),s(" 클래스의 확장 함수인 명시적으로 정의된 "),a("code",null,"module"),s(" 내에서. ")],-1)])),_:1}),t(d,null,{default:i(()=>[t(r,{title:"embeddedServer"},{default:i(()=>[t(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.defaultheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DefaultHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(r,{title:"module"},{default:i(()=>[t(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.defaultheaders.*
            // ...
            fun Application.module() {
                install(DefaultHeaders)
                // ...
            }`})]),_:1})]),_:1}),e[18]||(e[18]=p("",11))])}const T=f(E,[["render",y]]);export{D as __pageData,T as default};
