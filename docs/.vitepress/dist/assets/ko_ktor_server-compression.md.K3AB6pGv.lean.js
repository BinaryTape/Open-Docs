import{_ as u,C as t,c as m,o as y,G as e,ag as d,j as i,w as a,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-compression.md","filePath":"ko/ktor/server-compression.md","lastUpdated":1755457140000}'),v={name:"ko/ktor/server-compression.md"};function b(f,s,C,_,F,q){const k=t("TopicTitle"),h=t("show-structure"),c=t("primary-label"),p=t("Links"),E=t("tldr"),l=t("code-block"),o=t("TabItem"),r=t("Tabs"),g=t("list");return y(),m("div",null,[e(k,{labelRef:"server-plugin",title:"압축"}),e(h,{for:"chapter",depth:"2"}),e(c,{ref:"server-plugin"},null,512),e(E,null,{default:a(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"필수 의존성"),n(": "),i("code",null,"io.ktor:ktor-server-compression")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"코드 예시"),n(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/compression"}," compression ")],-1)),i("p",null,[i("b",null,[e(p,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다."},{default:a(()=>s[0]||(s[0]=[n("네이티브 서버")])),_:1}),s[1]||(s[1]=n(" 지원"))]),s[2]||(s[2]=n(": ✖️ "))])]),_:1}),s[17]||(s[17]=d("",5)),e(r,{group:"languages"},{default:a(()=>[e(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-compression:$ktor_version")'})]),_:1}),e(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-compression:$ktor_version"'})]),_:1}),e(o,{title:"Maven","group-key":"maven"},{default:a(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-compression-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("Compression 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "Compression 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=n(" 애플리케이션에 ")),s[7]||(s[7]=i("code",null,"Compression",-1)),s[8]||(s[8]=n(" 플러그인을 ")),s[9]||(s[9]=i("a",{href:"#install"},"설치",-1)),s[10]||(s[10]=n("하려면, 지정된 ")),e(p,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:a(()=>s[5]||(s[5]=[n("모듈")])),_:1}),s[11]||(s[11]=n("의 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=n(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[14]||(s[14]=i("code",null,"Compression",-1)),s[15]||(s[15]=n("을 설치하는 방법을 보여줍니다... "))]),e(g,null,{default:a(()=>s[16]||(s[16]=[i("li",null,[n(" ... "),i("code",null,"embeddedServer"),n(" 함수 호출 내에서. ")],-1),i("li",null,[n(" ... "),i("code",null,"Application"),n(" 클래스의 확장 함수인 명시적으로 정의된 "),i("code",null,"module"),n(" 내에서. ")],-1)])),_:1}),e(r,null,{default:a(()=>[e(o,{title:"embeddedServer"},{default:a(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.compression.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Compression)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(o,{title:"module"},{default:a(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.compression.*
            // ...
            fun Application.module() {
                install(Compression)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=d("",24))])}const x=u(v,[["render",b]]);export{B as __pageData,x as default};
