import{_ as m,C as n,c as v,o as E,G as t,ag as d,j as e,w as a,a as i}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-webjars.md","filePath":"ko/ktor/server-webjars.md","lastUpdated":1755457140000}'),y={name:"ko/ktor/server-webjars.md"};function f(c,s,j,_,F,w){const k=n("TopicTitle"),u=n("primary-label"),p=n("Links"),h=n("tldr"),g=n("link-summary"),r=n("code-block"),l=n("TabItem"),o=n("Tabs"),b=n("list");return E(),v("div",null,[t(k,{labelRef:"server-plugin",title:"Webjars"}),t(u,{ref:"server-plugin"},null,512),t(h,null,{default:a(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"필수 의존성"),i(": "),e("code",null,"io.ktor:ktor-server-webjars")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"코드 예시"),i(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/webjars"}," webjars ")],-1)),e("p",null,[e("b",null,[t(p,{href:"/ktor/server-native",summary:"Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 해줍니다."},{default:a(()=>s[0]||(s[0]=[i("네이티브 서버")])),_:1}),s[1]||(s[1]=i(" 지원"))]),s[2]||(s[2]=i(": ✖️ "))])]),_:1}),t(g,null,{default:a(()=>s[5]||(s[5]=[i(" Webjars 플러그인은 WebJars가 제공하는 클라이언트 측 라이브러리를 서빙할 수 있도록 합니다. ")])),_:1}),s[21]||(s[21]=d("",3)),e("ul",null,[e("li",null,[s[6]||(s[6]=e("p",null,[e("code",null,"ktor-server-webjars"),i(" 의존성을 추가합니다:")],-1)),t(o,{group:"languages"},{default:a(()=>[t(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[t(r,{lang:"Kotlin",code:'              implementation("io.ktor:ktor-server-webjars:$ktor_version")'})]),_:1}),t(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[t(r,{lang:"Groovy",code:'              implementation "io.ktor:ktor-server-webjars:$ktor_version"'})]),_:1}),t(l,{title:"Maven","group-key":"maven"},{default:a(()=>[t(r,{lang:"XML",code:`              <dependency>
                  <groupId>io.ktor</groupId>
                  <artifactId>ktor-server-webjars-jvm</artifactId>
                  <version>\${ktor_version}</version>
              </dependency>`})]),_:1})]),_:1})]),e("li",null,[s[7]||(s[7]=e("p",null,"필수 클라이언트 측 라이브러리에 대한 의존성을 추가합니다. 아래 예시는 Bootstrap 아티팩트를 추가하는 방법을 보여줍니다:",-1)),t(o,{group:"languages"},{default:a(()=>[t(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[t(r,{lang:"Kotlin",code:'              implementation("org.webjars:bootstrap:$bootstrap_version")'})]),_:1}),t(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[t(r,{lang:"Groovy",code:'              implementation "org.webjars:bootstrap:$bootstrap_version"'})]),_:1}),t(l,{title:"Maven","group-key":"maven"},{default:a(()=>[t(r,{lang:"XML",code:`              <dependency>
                  <groupId>org.webjars</groupId>
                  <artifactId>bootstrap</artifactId>
                  <version>\${bootstrap_version}</version>
              </dependency>`})]),_:1})]),_:1}),s[8]||(s[8]=e("p",null,[e("code",null,"$bootstrap_version"),i("을 "),e("code",null,"bootstrap"),i(" 아티팩트의 필수 버전(예: "),e("code",null,"5.2.3"),i(")으로 바꿀 수 있습니다.")],-1))])]),s[22]||(s[22]=e("h2",{id:"install_plugin",tabindex:"-1"},[i("Webjars 설치 "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "Webjars 설치 {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[10]||(s[10]=i(" 애플리케이션에 ")),s[11]||(s[11]=e("code",null,"Webjars",-1)),s[12]||(s[12]=i(" 플러그인을 ")),s[13]||(s[13]=e("a",{href:"#install"},"설치",-1)),s[14]||(s[14]=i("하려면, 지정된 ")),t(p,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:a(()=>s[9]||(s[9]=[i("모듈")])),_:1}),s[15]||(s[15]=i("의 ")),s[16]||(s[16]=e("code",null,"install",-1)),s[17]||(s[17]=i(" 함수에 전달하십시오. 아래 코드 스니펫은 ")),s[18]||(s[18]=e("code",null,"Webjars",-1)),s[19]||(s[19]=i("을(를) 설치하는 방법을 보여줍니다... "))]),t(b,null,{default:a(()=>s[20]||(s[20]=[e("li",null,[i(" ... "),e("code",null,"embeddedServer"),i(" 함수 호출 내에서. ")],-1),e("li",null,[i(" ... "),e("code",null,"Application"),i(" 클래스의 확장 함수인 명시적으로 정의된 "),e("code",null,"module"),i(" 내에서. ")],-1)])),_:1}),t(o,null,{default:a(()=>[t(l,{title:"embeddedServer"},{default:a(()=>[t(r,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.webjars.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Webjars)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(l,{title:"module"},{default:a(()=>[t(r,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.webjars.*
            // ...
            fun Application.module() {
                install(Webjars)
                // ...
            }`})]),_:1})]),_:1}),s[23]||(s[23]=d("",7))])}const W=m(y,[["render",f]]);export{T as __pageData,W as default};
