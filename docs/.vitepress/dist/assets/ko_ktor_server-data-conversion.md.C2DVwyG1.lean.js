import{_ as u,C as t,c as v,o as y,G as a,ag as k,j as i,w as e,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-data-conversion.md","filePath":"ko/ktor/server-data-conversion.md","lastUpdated":1755457140000}'),m={name:"ko/ktor/server-data-conversion.md"};function F(C,s,D,b,f,A){const d=t("TopicTitle"),h=t("primary-label"),p=t("Links"),E=t("tldr"),g=t("link-summary"),l=t("code-block"),o=t("TabItem"),r=t("Tabs"),c=t("list");return y(),v("div",null,[a(d,{labelRef:"server-plugin",title:"데이터 변환"}),a(h,{ref:"server-plugin"},null,512),a(E,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"코드 예제"),n(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/data-conversion"}," data-conversion ")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"필수 의존성"),n(": "),i("code",null,"io.ktor:ktor-server-data-conversion")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다."},{default:e(()=>s[0]||(s[0]=[n("네이티브 서버")])),_:1}),s[1]||(s[1]=n(" 지원"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),a(g,null,{default:e(()=>s[5]||(s[5]=[n(" Ktor 서버용 DataConversion 플러그인은 값 목록을 직렬화하고 역직렬화하기 위한 사용자 지정 컨버터를 추가할 수 있도록 합니다. ")])),_:1}),s[18]||(s[18]=k("",3)),a(r,{group:"languages"},{default:e(()=>[a(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-data-conversion:$ktor_version")'})]),_:1}),a(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-data-conversion:$ktor_version"'})]),_:1}),a(o,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-data-conversion-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("DataConversion 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "DataConversion 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=n(" 애플리케이션에 ")),s[8]||(s[8]=i("code",null,"DataConversion",-1)),s[9]||(s[9]=n(" 플러그인을 ")),s[10]||(s[10]=i("a",{href:"#install"},"설치",-1)),s[11]||(s[11]=n("하려면, 지정된 ")),a(p,{href:"/ktor/server-modules",summary:"모듈은 라우트(route)를 그룹화하여 애플리케이션을 구조화할 수 있게 합니다."},{default:e(()=>s[6]||(s[6]=[n("모듈")])),_:1}),s[12]||(s[12]=n("의 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=n(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[15]||(s[15]=i("code",null,"DataConversion",-1)),s[16]||(s[16]=n("을(를) 설치하는 방법을 보여줍니다... "))]),a(c,null,{default:e(()=>s[17]||(s[17]=[i("li",null,[n(" ... "),i("code",null,"embeddedServer"),n(" 함수 호출 내에서. ")],-1),i("li",null,[n(" ... "),i("code",null,"Application"),n(" 클래스의 확장 함수인 명시적으로 정의된 "),i("code",null,"module"),n(" 내에서. ")],-1)])),_:1}),a(r,null,{default:e(()=>[a(o,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.dataconversion.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DataConversion)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(o,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.dataconversion.*
            // ...
            fun Application.module() {
                install(DataConversion)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=k("",18))])}const T=u(m,[["render",F]]);export{B as __pageData,T as default};
