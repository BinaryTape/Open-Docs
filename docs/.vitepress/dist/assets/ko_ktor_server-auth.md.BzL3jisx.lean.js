import{_ as y,C as n,c as v,o as F,G as i,ag as p,j as a,w as e,a as t}from"./chunks/framework.Bksy39di.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-auth.md","filePath":"ko/ktor/server-auth.md","lastUpdated":1755457140000}'),b={name:"ko/ktor/server-auth.md"};function m(f,s,q,A,C,B){const o=n("TopicTitle"),k=n("show-structure"),d=n("primary-label"),c=n("tldr"),u=n("link-summary"),l=n("code-block"),r=n("TabItem"),h=n("Tabs"),E=n("Links"),g=n("list");return F(),v("div",null,[i(o,{labelRef:"server-plugin",title:"Ktor Server의 인증 및 인가"}),i(k,{for:"chapter",depth:"2"}),i(d,{ref:"server-plugin"},null,512),i(c,null,{default:e(()=>s[0]||(s[0]=[a("p",null,[a("b",null,"필수 의존성"),t(": "),a("code",null,"io.ktor:ktor-server-auth")],-1)])),_:1}),i(u,null,{default:e(()=>s[1]||(s[1]=[t(" Authentication 플러그인은 Ktor에서 인증 및 인가를 처리합니다. ")])),_:1}),s[14]||(s[14]=p("",21)),i(h,{group:"languages"},{default:e(()=>[i(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-auth:$ktor_version")'})]),_:1}),i(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-auth:$ktor_version"'})]),_:1}),i(r,{title:"Maven","group-key":"maven"},{default:e(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-auth-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[15]||(s[15]=a("p",null,[t("참고로, "),a("a",{href:"./server-jwt"},"JWT"),t(" 및 "),a("a",{href:"./server-ldap"},"LDAP"),t("와 같은 일부 인증 프로바이더는 추가 아티팩트를 필요로 합니다.")],-1)),s[16]||(s[16]=a("h2",{id:"install",tabindex:"-1"},[t("Authentication 설치 "),a("a",{class:"header-anchor",href:"#install","aria-label":'Permalink to "Authentication 설치 {id="install"}"'},"​")],-1)),a("p",null,[s[3]||(s[3]=t(" 애플리케이션에 ")),s[4]||(s[4]=a("code",null,"Authentication",-1)),s[5]||(s[5]=t(" 플러그인을 ")),s[6]||(s[6]=a("a",{href:"#install"},"설치",-1)),s[7]||(s[7]=t("하려면, 지정된 ")),i(E,{href:"/ktor/server-modules",summary:"모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:e(()=>s[2]||(s[2]=[t("모듈")])),_:1}),s[8]||(s[8]=t("의 ")),s[9]||(s[9]=a("code",null,"install",-1)),s[10]||(s[10]=t(" 함수에 전달하세요. 아래 코드 스니펫은 ")),s[11]||(s[11]=a("code",null,"Authentication",-1)),s[12]||(s[12]=t("을 설치하는 방법을 보여줍니다... "))]),i(g,null,{default:e(()=>s[13]||(s[13]=[a("li",null,[t(" ... "),a("code",null,"embeddedServer"),t(" 함수 호출 내. ")],-1),a("li",null,[t(" ... "),a("code",null,"Application"),t(" 클래스의 확장 함수인 명시적으로 정의된 "),a("code",null,"module"),t(" 내. ")],-1)])),_:1}),i(h,null,{default:e(()=>[i(r,{title:"embeddedServer"},{default:e(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.auth.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Authentication)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(r,{title:"module"},{default:e(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.auth.*
            // ...
            fun Application.module() {
                install(Authentication)
                // ...
            }`})]),_:1})]),_:1}),s[17]||(s[17]=p("",30))])}const P=y(b,[["render",m]]);export{D as __pageData,P as default};
