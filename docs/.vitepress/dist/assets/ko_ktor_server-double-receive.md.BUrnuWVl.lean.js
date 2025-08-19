import{_ as v,C as n,c as g,o as E,G as s,ag as d,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-double-receive.md","filePath":"ko/ktor/server-double-receive.md","lastUpdated":1755457140000}'),b={name:"ko/ktor/server-double-receive.md"};function y(m,e,f,_,F,C){const k=n("TopicTitle"),u=n("primary-label"),r=n("Links"),h=n("tldr"),a=n("code-block"),o=n("TabItem"),p=n("Tabs"),c=n("list");return E(),g("div",null,[s(k,{labelRef:"server-plugin",title:"DoubleReceive"}),s(u,{ref:"server-plugin"},null,512),s(h,null,{default:t(()=>[e[3]||(e[3]=i("p",null,[i("b",null,"필수 의존성"),l(": "),i("code",null,"io.ktor:ktor-server-double-receive")],-1)),e[4]||(e[4]=i("p",null,[i("b",null,"코드 예시"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/double-receive"}," double-receive ")],-1)),i("p",null,[i("b",null,[s(r,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다."},{default:t(()=>e[0]||(e[0]=[l("네이티브 서버")])),_:1}),e[1]||(e[1]=l(" 지원"))]),e[2]||(e[2]=l(": ✅ "))])]),_:1}),e[17]||(e[17]=d("",4)),s(p,{group:"languages"},{default:t(()=>[s(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[s(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-double-receive:$ktor_version")'})]),_:1}),s(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[s(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-double-receive:$ktor_version"'})]),_:1}),s(o,{title:"Maven","group-key":"maven"},{default:t(()=>[s(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-double-receive-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[18]||(e[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("DoubleReceive 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "DoubleReceive 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[e[6]||(e[6]=l(" 애플리케이션에 ")),e[7]||(e[7]=i("code",null,"DoubleReceive",-1)),e[8]||(e[8]=l(" 플러그인을 ")),e[9]||(e[9]=i("a",{href:"#install"},"설치",-1)),e[10]||(e[10]=l("하려면, 지정된 ")),s(r,{href:"/ktor/server-modules",summary:"모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:t(()=>e[5]||(e[5]=[l("모듈")])),_:1}),e[11]||(e[11]=l("의 ")),e[12]||(e[12]=i("code",null,"install",-1)),e[13]||(e[13]=l(" 함수에 전달하세요. 아래 코드 스니펫은 ")),e[14]||(e[14]=i("code",null,"DoubleReceive",-1)),e[15]||(e[15]=l("을 설치하는 방법을 보여줍니다... "))]),s(c,null,{default:t(()=>e[16]||(e[16]=[i("li",null,[l(" ... "),i("code",null,"embeddedServer"),l(" 함수 호출 내에서. ")],-1),i("li",null,[l(" ... "),i("code",null,"Application"),l(" 클래스의 확장 함수인 명시적으로 정의된 "),i("code",null,"module"),l(" 내에서. ")],-1)])),_:1}),s(p,null,{default:t(()=>[s(o,{title:"embeddedServer"},{default:t(()=>[s(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DoubleReceive)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(o,{title:"module"},{default:t(()=>[s(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*
            // ...
            fun Application.module() {
                install(DoubleReceive)
                // ...
            }`})]),_:1})]),_:1}),e[19]||(e[19]=d("",13))])}const D=v(b,[["render",y]]);export{T as __pageData,D as default};
