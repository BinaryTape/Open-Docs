import{_ as g,C as r,c,o as E,j as i,G as t,ag as h,a as e,w as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"서버 엔진","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-engines.md","filePath":"ko/ktor/server-engines.md","lastUpdated":1755457140000}'),y={name:"ko/ktor/server-engines.md"};function u(m,s,v,F,f,C){const p=r("show-structure"),d=r("link-summary"),l=r("code-block"),a=r("TabItem"),o=r("Tabs"),k=r("chapter");return E(),c("div",null,[s[14]||(s[14]=i("h1",{id:"서버-엔진",tabindex:"-1"},[e("서버 엔진 "),i("a",{class:"header-anchor",href:"#서버-엔진","aria-label":'Permalink to "서버 엔진"'},"​")],-1)),t(p,{for:"chapter",depth:"3"}),t(d,null,{default:n(()=>s[0]||(s[0]=[e(" 네트워크 요청을 처리하는 엔진에 대해 알아봅니다. ")])),_:1}),s[15]||(s[15]=h('<p>Ktor 서버 애플리케이션을 실행하려면 먼저 서버를 <a href="./server-create-and-configure">생성</a>하고 구성해야 합니다. 서버 구성에는 다음과 같은 다양한 설정이 포함됩니다.</p><ul><li>네트워크 요청 처리를 위한 <a href="#supported-engines">엔진</a>;</li><li>서버에 접근하는 데 사용되는 호스트 및 포트 값;</li><li>SSL 설정;</li><li>... 등.</li></ul><h2 id="supported-engines" tabindex="-1">지원되는 엔진 <a class="header-anchor" href="#supported-engines" aria-label="Permalink to &quot;지원되는 엔진 {id=&quot;supported-engines&quot;}&quot;">​</a></h2><p>아래 표는 Ktor가 지원하는 엔진과 지원되는 플랫폼을 나열합니다.</p><table tabindex="0"><thead><tr><th>엔진</th><th>플랫폼</th><th>HTTP/2</th></tr></thead><tbody><tr><td><code>Netty</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>Jetty</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>Tomcat</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>CIO</code> (Coroutine-based I/O)</td><td>JVM, <a href="./server-native">Native</a>, <a href="./graalvm">GraalVM</a></td><td>✖️</td></tr><tr><td><a href="./server-war">ServletApplicationEngine</a></td><td>JVM</td><td>✅</td></tr></tbody></table><h2 id="dependencies" tabindex="-1">의존성 추가 <a class="header-anchor" href="#dependencies" aria-label="Permalink to &quot;의존성 추가 {id=&quot;dependencies&quot;}&quot;">​</a></h2><p>원하는 엔진을 사용하기 전에 해당 의존성을 <a href="./server-dependencies">빌드 스크립트</a>에 추가해야 합니다.</p><ul><li><code>ktor-server-netty</code></li><li><code>ktor-server-jetty-jakarta</code></li><li><code>ktor-server-tomcat-jakarta</code></li><li><code>ktor-server-cio</code></li></ul><p>아래는 Netty에 대한 의존성을 추가하는 예시입니다.</p>',9)),t(o,{group:"languages"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-netty:$ktor_version")'})]),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-netty:$ktor_version"'})]),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-netty-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[16]||(s[16]=h(`<h2 id="choose-create-server" tabindex="-1">서버 생성 방법 선택 <a class="header-anchor" href="#choose-create-server" aria-label="Permalink to &quot;서버 생성 방법 선택 {id=&quot;choose-create-server&quot;}&quot;">​</a></h2><p>Ktor 서버 애플리케이션은 <a href="./server-create-and-configure#embedded">두 가지 방법</a>으로 [생성 및 실행]할 수 있습니다. 코드에서 서버 매개변수를 빠르게 전달하는 <a href="#embeddedServer">embeddedServer</a>를 사용하거나, 외부 <code>application.conf</code> 또는 <code>application.yaml</code> 파일에서 구성을 로드하는 <a href="#EngineMain">EngineMain</a>을 사용하는 방법입니다.</p><h3 id="embeddedServer" tabindex="-1">embeddedServer <a class="header-anchor" href="#embeddedServer" aria-label="Permalink to &quot;embeddedServer {id=&quot;embeddedServer&quot;}&quot;">​</a></h3><p><a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html" target="_blank" rel="noreferrer">embeddedServer</a> 함수는 특정 유형의 엔진을 생성하는 데 사용되는 엔진 팩토리를 받습니다. 아래 예시에서는 <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html" target="_blank" rel="noreferrer">Netty</a> 팩토리를 전달하여 Netty 엔진으로 서버를 실행하고 <code>8080</code> 포트에서 수신 대기합니다.</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io.ktor.server.response.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io.ktor.server.routing.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io.ktor.server.engine.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io.ktor.server.netty.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(args: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Array</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    embeddedServer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Netty, port </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 8080</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        routing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                call.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">respondText</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Hello, world!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(wait </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="EngineMain" tabindex="-1">EngineMain <a class="header-anchor" href="#EngineMain" aria-label="Permalink to &quot;EngineMain {id=&quot;EngineMain&quot;}&quot;">​</a></h3><p><code>EngineMain</code>은 서버 실행을 위한 엔진을 나타냅니다. 다음 엔진을 사용할 수 있습니다.</p><ul><li><code>io.ktor.server.netty.EngineMain</code></li><li><code>io.ktor.server.jetty.jakarta.EngineMain</code></li><li><code>io.ktor.server.tomcat.jakarta.EngineMain</code></li><li><code>io.ktor.server.cio.EngineMain</code></li></ul><p><code>EngineMain.main</code> 함수는 선택한 엔진으로 서버를 시작하고 외부 <a href="./server-configuration-file">설정 파일</a>에 지정된 <a href="./server-modules">애플리케이션 모듈</a>을 로드하는 데 사용됩니다. 아래 예시에서는 애플리케이션의 <code>main</code> 함수에서 서버를 시작합니다.</p>`,9)),t(o,null,{default:n(()=>[t(a,{title:"Application.kt"},{default:n(()=>s[1]||(s[1]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"package"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," com.example")]),e(`
`),i("span",{class:"line"}),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," io.ktor.server.application."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," io.ktor.server.response."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," io.ktor.server.routing."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),e(`
`),i("span",{class:"line"}),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fun"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," main"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(args: "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Array"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"String"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">): "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Unit"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," ="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," io.ktor.server.netty.EngineMain."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"main"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(args)")]),e(`
`),i("span",{class:"line"}),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fun"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," Application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"module"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    routing"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        get"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            call."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"respondText"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"Hello, world!"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"application.conf"},{default:n(()=>s[2]||(s[2]=[i("div",{class:"language-shell vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"shell"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"ktor"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    deployment"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        port"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ="),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 8080")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    application"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        modules"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [ "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"com.example.ApplicationKt.module"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ]")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"application.yaml"},{default:n(()=>s[3]||(s[3]=[i("div",{class:"language-yaml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"yaml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"ktor"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    deployment"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        port"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"8080")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        modules"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            - "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"com.example.ApplicationKt.module")])])])],-1)])),_:1})]),_:1}),s[17]||(s[17]=i("p",null,[e("빌드 시스템 작업을 사용하여 서버를 시작해야 하는 경우, 필요한 "),i("code",null,"EngineMain"),e("을 메인 클래스로 구성해야 합니다.")],-1)),t(o,{group:"languages",id:"main-class-set-engine-main"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>s[4]||(s[4]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    mainClass."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"set"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"io.ktor.server.netty.EngineMain"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>s[5]||(s[5]=[i("div",{class:"language-groovy vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"groovy"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"mainClassName "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "io.ktor.server.netty.EngineMain"')])])])],-1)])),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>s[6]||(s[6]=[i("div",{class:"language-xml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"xml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    <"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">io.ktor.server.netty.EngineMain</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")])])])],-1)])),_:1})]),_:1}),s[18]||(s[18]=h('<h2 id="configure-engine" tabindex="-1">엔진 구성 <a class="header-anchor" href="#configure-engine" aria-label="Permalink to &quot;엔진 구성 {id=&quot;configure-engine&quot;}&quot;">​</a></h2><p>이 섹션에서는 다양한 엔진별 옵션을 지정하는 방법을 살펴봅니다.</p><h3 id="embedded-server-configure" tabindex="-1">코드에서 <a class="header-anchor" href="#embedded-server-configure" aria-label="Permalink to &quot;코드에서 {id=&quot;embedded-server-configure&quot;}&quot;">​</a></h3><p><code>embeddedServer</code> 함수는 <code>configure</code> 매개변수를 사용하여 엔진별 옵션을 전달할 수 있도록 합니다. 이 매개변수에는 모든 엔진에 공통적이며 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"> ApplicationEngine.Configuration </a> 클래스에 의해 노출되는 옵션이 포함됩니다. </p><p> 아래 예시는 <code>Netty</code> 엔진을 사용하여 서버를 구성하는 방법을 보여줍니다. <code>configure</code> 블록 내에서 호스트와 포트를 지정하기 위한 <code>connector</code>를 정의하고 다양한 서버 매개변수를 사용자 지정합니다. </p>',5)),t(l,{lang:"kotlin",code:`import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    embeddedServer(Netty, configure = {
        connectors.add(EngineConnectorBuilder().apply {
            host = "127.0.0.1"
            port = 8080
        })
        connectionGroupSize = 2
        workerGroupSize = 5
        callGroupSize = 10
        shutdownGracePeriod = 2000
        shutdownTimeout = 3000
    }) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}`}),s[19]||(s[19]=i("p",null,[i("code",null,"connectors.add()"),e(" 메서드는 지정된 호스트("),i("code",null,"127.0.0.1"),e(") 및 포트("),i("code",null,"8080"),e(")로 커넥터를 정의합니다. ")],-1)),s[20]||(s[20]=i("p",null,"이러한 옵션 외에도 다른 엔진별 속성을 구성할 수 있습니다.",-1)),t(k,{title:"Netty",id:"netty-code"},{default:n(()=>[s[7]||(s[7]=i("p",null,[e(" Netty 특정 옵션은 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"}," NettyApplicationEngine.Configuration "),e(" 클래스에 의해 노출됩니다. ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.netty.*

        fun main() {
            embeddedServer(Netty, configure = {
                requestQueueLimit = 16
                shareWorkGroup = false
                configureBootstrap = {
                    // ...
                }
                responseWriteTimeoutSeconds = 10
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),t(k,{title:"Jetty",id:"jetty-code"},{default:n(()=>[s[8]||(s[8]=i("p",null,[e(" Jetty 특정 옵션은 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"}," JettyApplicationEngineBase.Configuration "),e(" 클래스에 의해 노출됩니다. ")],-1)),s[9]||(s[9]=i("p",null,[e("Jetty 서버는 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"}," configureServer "),e(" 블록 내부에서 구성할 수 있으며, 이 블록은 "),i("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},"Server"),e(" 인스턴스에 대한 접근을 제공합니다. ")],-1)),s[10]||(s[10]=i("p",null,[i("code",null,"idleTimeout"),e(" 속성을 사용하여 연결이 닫히기 전까지 유휴 상태를 유지할 수 있는 시간을 지정합니다. ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.jetty.jakarta.*

        fun main() {
            embeddedServer(Jetty, configure = {
                configureServer = { // this: Server -&gt;
                    // ...
                }
                idleTimeout = 30.seconds
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),t(k,{title:"CIO",id:"cio-code"},{default:n(()=>[s[11]||(s[11]=i("p",null,[e("CIO 특정 옵션은 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"}," CIOApplicationEngine.Configuration "),e(" 클래스에 의해 노출됩니다. ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.cio.*

        fun main() {
            embeddedServer(CIO, configure = {
                connectionIdleTimeoutSeconds = 45
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),t(k,{title:"Tomcat",id:"tomcat-code"},{default:n(()=>[s[12]||(s[12]=i("p",null,[e("Tomcat을 엔진으로 사용하는 경우 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"}," configureTomcat "),e(" 속성을 사용하여 구성할 수 있으며, 이 속성은 "),i("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},"Tomcat"),e(" 인스턴스에 대한 접근을 제공합니다. ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.tomcat.jakarta.*

        fun main() {
            embeddedServer(Tomcat, configure = {
                configureTomcat = { // this: Tomcat -&gt;
                    // ...
                }
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),s[21]||(s[21]=i("h3",{id:"engine-main-configure",tabindex:"-1"},[e("설정 파일에서 "),i("a",{class:"header-anchor",href:"#engine-main-configure","aria-label":'Permalink to "설정 파일에서 {id="engine-main-configure"}"'},"​")],-1)),s[22]||(s[22]=i("p",null,[i("code",null,"EngineMain"),e("을 사용하는 경우 "),i("code",null,"ktor.deployment"),e(" 그룹 내에서 모든 엔진에 공통적인 옵션을 지정할 수 있습니다. ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:n(()=>[t(l,{lang:"shell",code:`            ktor {
                deployment {
                    connectionGroupSize = 2
                    workerGroupSize = 5
                    callGroupSize = 10
                    shutdownGracePeriod = 2000
                    shutdownTimeout = 3000
                }
            }`})]),_:1}),t(a,{title:"application.yaml","group-key":"yaml",id:"engine-main-yaml"},{default:n(()=>[t(l,{lang:"yaml",code:`           ktor:
               deployment:
                   connectionGroupSize: 2
                   workerGroupSize: 5
                   callGroupSize: 10
                   shutdownGracePeriod: 2000
                   shutdownTimeout: 3000`})]),_:1})]),_:1}),t(k,{title:"Netty",id:"netty-file"},{default:n(()=>[s[13]||(s[13]=i("p",null,[e(" 또한 "),i("code",null,"ktor.deployment"),e(" 그룹 내의 설정 파일에서 Netty 특정 옵션을 구성할 수 있습니다. ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:n(()=>[t(l,{lang:"shell",code:`               ktor {
                   deployment {
                       maxInitialLineLength = 2048
                       maxHeaderSize = 1024
                       maxChunkSize = 42
                   }
               }`})]),_:1}),t(a,{title:"application.yaml","group-key":"yaml",id:"application-yaml-1"},{default:n(()=>[t(l,{lang:"yaml",code:`               ktor:
                   deployment:
                       maxInitialLineLength: 2048
                       maxHeaderSize: 1024
                       maxChunkSize: 42`})]),_:1})]),_:1})]),_:1})])}const S=g(y,[["render",u]]);export{B as __pageData,S as default};
