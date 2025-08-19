import{_ as F,C as e,c as u,o as m,G as a,ag as r,j as i,w as n,a as t}from"./chunks/framework.Bksy39di.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-method-override.md","filePath":"ko/ktor/server-method-override.md","lastUpdated":1755457140000}'),c={name:"ko/ktor/server-method-override.md"};function v(C,s,B,f,T,b){const o=e("TopicTitle"),d=e("primary-label"),k=e("Links"),E=e("tldr"),g=e("link-summary"),l=e("code-block"),p=e("TabItem"),h=e("Tabs"),y=e("list");return m(),u("div",null,[a(o,{labelRef:"server-plugin",title:"XHttpMethodOverride"}),a(d,{ref:"server-plugin"},null,512),a(E,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"필수 의존성"),t(": "),i("code",null,"io.ktor:ktor-server-method-override")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"코드 예시"),t(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/json-kotlinx-method-override"}," json-kotlinx-method-override ")],-1)),i("p",null,[i("b",null,[a(k,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다."},{default:n(()=>s[0]||(s[0]=[t("네이티브 서버")])),_:1}),s[1]||(s[1]=t(" 지원"))]),s[2]||(s[2]=t(": ✅ "))])]),_:1}),a(g,null,{default:n(()=>s[5]||(s[5]=[t(" XHttpMethodOverride 플러그인은 X-HTTP-Method-Override 헤더 내에 HTTP 동사를 터널링하는 기능을 제공합니다. ")])),_:1}),s[18]||(s[18]=r("",3)),a(h,{group:"languages"},{default:n(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-method-override:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-method-override:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:n(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-method-override-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("XHttpMethodOverride 설치 "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "XHttpMethodOverride 설치 {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=t(" 애플리케이션에 ")),s[8]||(s[8]=i("code",null,"XHttpMethodOverride",-1)),s[9]||(s[9]=t(" 플러그인을 ")),s[10]||(s[10]=i("a",{href:"#install"},"설치",-1)),s[11]||(s[11]=t("하려면, 지정된 ")),a(k,{href:"/ktor/server-modules",summary:"모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:n(()=>s[6]||(s[6]=[t("모듈")])),_:1}),s[12]||(s[12]=t("의 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=t(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[15]||(s[15]=i("code",null,"XHttpMethodOverride",-1)),s[16]||(s[16]=t("을(를) 설치하는 방법을 보여줍니다... "))]),a(y,null,{default:n(()=>s[17]||(s[17]=[i("li",null,[t(" ... "),i("code",null,"embeddedServer"),t(" 함수 호출 내부. ")],-1),i("li",null,[t(" ... "),i("code",null,"Application"),t(" 클래스의 확장 함수인 명시적으로 정의된 "),i("code",null,"module"),t(" 내부. ")],-1)])),_:1}),a(h,null,{default:n(()=>[a(p,{title:"embeddedServer"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.methodoverride.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(XHttpMethodOverride)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.methodoverride.*
            // ...
            fun Application.module() {
                install(XHttpMethodOverride)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=r("",8))])}const D=F(c,[["render",v]]);export{_ as __pageData,D as default};
