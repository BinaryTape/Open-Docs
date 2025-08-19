import{_ as m,C as l,c as S,o as v,G as t,ag as d,j as e,w as n,a as i}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-hsts.md","filePath":"ko/ktor/server-hsts.md","lastUpdated":1755457140000}'),c={name:"ko/ktor/server-hsts.md"};function f(E,s,T,y,b,_){const k=l("TopicTitle"),h=l("primary-label"),o=l("Links"),u=l("tldr"),a=l("code-block"),r=l("TabItem"),p=l("Tabs"),g=l("list");return v(),S("div",null,[t(k,{labelRef:"server-plugin",title:"HSTS"}),t(h,{ref:"server-plugin"},null,512),t(u,null,{default:n(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"필수 종속성"),i(": "),e("code",null,"io.ktor:ktor-server-hsts")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"코드 예시"),i(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-hsts"}," ssl-engine-main-hsts ")],-1)),e("p",null,[e("b",null,[t(o,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다."},{default:n(()=>s[0]||(s[0]=[i("네이티브 서버")])),_:1}),s[1]||(s[1]=i(" 지원"))]),s[2]||(s[2]=i(": ✅ "))])]),_:1}),s[17]||(s[17]=d("",4)),t(p,{group:"languages"},{default:n(()=>[t(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-hsts:$ktor_version")'})]),_:1}),t(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-hsts:$ktor_version"'})]),_:1}),t(r,{title:"Maven","group-key":"maven"},{default:n(()=>[t(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-hsts-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=e("h2",{id:"install_plugin",tabindex:"-1"},[i("HSTS 설치 "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "HSTS 설치 {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[6]||(s[6]=i(" 애플리케이션에 ")),s[7]||(s[7]=e("code",null,"HSTS",-1)),s[8]||(s[8]=i(" 플러그인을 ")),s[9]||(s[9]=e("a",{href:"#install"},"설치",-1)),s[10]||(s[10]=i("하려면, 지정된 ")),t(o,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다."},{default:n(()=>s[5]||(s[5]=[i("모듈")])),_:1}),s[11]||(s[11]=i("의 ")),s[12]||(s[12]=e("code",null,"install",-1)),s[13]||(s[13]=i(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[14]||(s[14]=e("code",null,"HSTS",-1)),s[15]||(s[15]=i("을(를) 설치하는 방법을 보여줍니다... "))]),t(g,null,{default:n(()=>s[16]||(s[16]=[e("li",null,[i(" ... "),e("code",null,"embeddedServer"),i(" 함수 호출 내부에서. ")],-1),e("li",null,[i(" ... "),e("code",null,"Application"),i(" 클래스의 확장 함수인 명시적으로 정의된 "),e("code",null,"module"),i(" 내부에서. ")],-1)])),_:1}),t(p,null,{default:n(()=>[t(r,{title:"embeddedServer"},{default:n(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(HSTS)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(r,{title:"module"},{default:n(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*
            // ...
            fun Application.module() {
                install(HSTS)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=d("",7))])}const F=m(c,[["render",f]]);export{C as __pageData,F as default};
