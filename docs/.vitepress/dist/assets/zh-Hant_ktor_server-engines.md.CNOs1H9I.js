import{_ as g,C as r,c,o as E,j as i,G as t,ag as h,a as e,w as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"伺服器引擎","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-engines.md","filePath":"zh-Hant/ktor/server-engines.md","lastUpdated":1755457140000}'),y={name:"zh-Hant/ktor/server-engines.md"};function u(m,s,v,F,f,C){const p=r("show-structure"),d=r("link-summary"),l=r("code-block"),a=r("TabItem"),o=r("Tabs"),k=r("chapter");return E(),c("div",null,[s[14]||(s[14]=i("h1",{id:"伺服器引擎",tabindex:"-1"},[e("伺服器引擎 "),i("a",{class:"header-anchor",href:"#伺服器引擎","aria-label":'Permalink to "伺服器引擎"'},"​")],-1)),t(p,{for:"chapter",depth:"3"}),t(d,null,{default:n(()=>s[0]||(s[0]=[e(" 瞭解處理網路請求的引擎。 ")])),_:1}),s[15]||(s[15]=h('<p>為了執行 Ktor 伺服器應用程式，您需要先 <a href="./server-create-and-configure">建立</a> 並設定伺服器。 伺服器設定包含不同的設定：</p><ul><li>一個用於處理網路請求的 <a href="#supported-engines">引擎</a>；</li><li>用於存取伺服器的主機和連接埠值；</li><li>SSL 設定；</li><li>……等等。</li></ul><h2 id="supported-engines" tabindex="-1">支援的引擎 <a class="header-anchor" href="#supported-engines" aria-label="Permalink to &quot;支援的引擎 {id=&quot;supported-engines&quot;}&quot;">​</a></h2><p>下表列出了 Ktor 支援的引擎，以及支援的平台：</p><table tabindex="0"><thead><tr><th>Engine</th><th>Platforms</th><th>HTTP/2</th></tr></thead><tbody><tr><td><code>Netty</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>Jetty</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>Tomcat</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>CIO</code> (Coroutine-based I/O)</td><td>JVM, <a href="./server-native">Native</a>, <a href="./graalvm">GraalVM</a></td><td>✖️</td></tr><tr><td><a href="./server-war">ServletApplicationEngine</a></td><td>JVM</td><td>✅</td></tr></tbody></table><h2 id="dependencies" tabindex="-1">新增依賴項 <a class="header-anchor" href="#dependencies" aria-label="Permalink to &quot;新增依賴項 {id=&quot;dependencies&quot;}&quot;">​</a></h2><p>在使用所需的引擎之前，您需要將對應的依賴項新增到您的 <a href="./server-dependencies">建置腳本</a> 中：</p><ul><li><code>ktor-server-netty</code></li><li><code>ktor-server-jetty-jakarta</code></li><li><code>ktor-server-tomcat-jakarta</code></li><li><code>ktor-server-cio</code></li></ul><p>以下是為 Netty 新增依賴項的範例：</p>',9)),t(o,{group:"languages"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-netty:$ktor_version")'})]),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-netty:$ktor_version"'})]),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-netty-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[16]||(s[16]=h(`<h2 id="choose-create-server" tabindex="-1">選擇如何建立伺服器 <a class="header-anchor" href="#choose-create-server" aria-label="Permalink to &quot;選擇如何建立伺服器 {id=&quot;choose-create-server&quot;}&quot;">​</a></h2><p>Ktor 伺服器應用程式可以透過 <a href="./server-create-and-configure#embedded">兩種方式建立和執行</a>：使用 <a href="#embeddedServer">embeddedServer</a> 在程式碼中快速傳遞伺服器參數，或使用 <a href="#EngineMain">EngineMain</a> 從外部的 <code>application.conf</code> 或 <code>application.yaml</code> 檔案載入設定。</p><h3 id="embeddedServer" tabindex="-1">embeddedServer <a class="header-anchor" href="#embeddedServer" aria-label="Permalink to &quot;embeddedServer {id=&quot;embeddedServer&quot;}&quot;">​</a></h3><p><a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html" target="_blank" rel="noreferrer">embeddedServer</a> 函式接受一個引擎工廠，用於建立特定類型的引擎。在下面的範例中，我們傳遞 <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html" target="_blank" rel="noreferrer">Netty</a> 工廠以 Netty 引擎執行伺服器並監聽 <code>8080</code> 連接埠：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io.ktor.server.response.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="EngineMain" tabindex="-1">EngineMain <a class="header-anchor" href="#EngineMain" aria-label="Permalink to &quot;EngineMain {id=&quot;EngineMain&quot;}&quot;">​</a></h3><p><code>EngineMain</code> 代表一個用於執行伺服器的引擎。您可以使用以下引擎：</p><ul><li><code>io.ktor.server.netty.EngineMain</code></li><li><code>io.ktor.server.jetty.jakarta.EngineMain</code></li><li><code>io.ktor.server.tomcat.jakarta.EngineMain</code></li><li><code>io.ktor.server.cio.EngineMain</code></li></ul><p><code>EngineMain.main</code> 函式用於以選定的引擎啟動伺服器，並載入外部 <a href="./server-configuration-file">設定檔</a> 中指定的 <a href="./server-modules">應用程式模組</a>。在下面的範例中，我們從應用程式的 <code>main</code> 函式啟動伺服器：</p>`,9)),t(o,null,{default:n(()=>[t(a,{title:"Application.kt"},{default:n(()=>s[1]||(s[1]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"package"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," com.example")]),e(`
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
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            - "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"com.example.ApplicationKt.module")])])])],-1)])),_:1})]),_:1}),s[17]||(s[17]=i("p",null,[e("如果您需要使用建置系統任務啟動伺服器，您需要將所需的 "),i("code",null,"EngineMain"),e(" 設定為主類別：")],-1)),t(o,{group:"languages",id:"main-class-set-engine-main"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>s[4]||(s[4]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    mainClass."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"set"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"io.ktor.server.netty.EngineMain"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>s[5]||(s[5]=[i("div",{class:"language-groovy vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"groovy"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"mainClassName "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "io.ktor.server.netty.EngineMain"')])])])],-1)])),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>s[6]||(s[6]=[i("div",{class:"language-xml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"xml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    <"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">io.ktor.server.netty.EngineMain</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")])])])],-1)])),_:1})]),_:1}),s[18]||(s[18]=h('<h2 id="configure-engine" tabindex="-1">設定引擎 <a class="header-anchor" href="#configure-engine" aria-label="Permalink to &quot;設定引擎 {id=&quot;configure-engine&quot;}&quot;">​</a></h2><p>在本節中，我們將探討如何指定各種引擎特有的選項。</p><h3 id="embedded-server-configure" tabindex="-1">在程式碼中 <a class="header-anchor" href="#embedded-server-configure" aria-label="Permalink to &quot;在程式碼中 {id=&quot;embedded-server-configure&quot;}&quot;">​</a></h3><p><code>embeddedServer</code> 函式允許您使用 <code>configure</code> 參數傳遞引擎特有的選項。此參數包含所有引擎通用的選項，並由 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"> ApplicationEngine.Configuration </a> 類別公開。 </p><p> 下面的範例展示了如何使用 <code>Netty</code> 引擎設定伺服器。在 <code>configure</code> 區塊內，我們定義了一個 <code>connector</code> 來指定主機和連接埠，並自訂各種伺服器參數： </p>',5)),t(l,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),s[19]||(s[19]=i("p",null,[i("code",null,"connectors.add()"),e(" 方法定義了一個包含指定主機 ("),i("code",null,"127.0.0.1"),e(") 和連接埠 ("),i("code",null,"8080"),e(") 的連接器。 ")],-1)),s[20]||(s[20]=i("p",null,"除了這些選項之外，您還可以設定其他引擎特有的屬性。",-1)),t(k,{title:"Netty",id:"netty-code"},{default:n(()=>[s[7]||(s[7]=i("p",null,[e(" Netty 特有的選項由 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"}," NettyApplicationEngine.Configuration "),e(" 類別公開。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
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
        }`})]),_:1}),t(k,{title:"Jetty",id:"jetty-code"},{default:n(()=>[s[8]||(s[8]=i("p",null,[e(" Jetty 特有的選項由 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"}," JettyApplicationEngineBase.Configuration "),e(" 類別公開。 ")],-1)),s[9]||(s[9]=i("p",null,[e("您可以在 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"}," configureServer "),e(" 區塊內設定 Jetty 伺服器，該區塊提供了對 "),i("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},"Server"),e(" 實例的存取權限。 ")],-1)),s[10]||(s[10]=i("p",null,[e(" 使用 "),i("code",null,"idleTimeout"),e(" 屬性指定連線在關閉前可以閒置的時間長度。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
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
        }`})]),_:1}),t(k,{title:"CIO",id:"cio-code"},{default:n(()=>[s[11]||(s[11]=i("p",null,[e("CIO 特有的選項由 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"}," CIOApplicationEngine.Configuration "),e(" 類別公開。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.cio.*

        fun main() {
            embeddedServer(CIO, configure = {
                connectionIdleTimeoutSeconds = 45
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),t(k,{title:"Tomcat",id:"tomcat-code"},{default:n(()=>[s[12]||(s[12]=i("p",null,[e("如果您使用 Tomcat 作為引擎，您可以使用 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"}," configureTomcat "),e(" 屬性來設定它，該屬性提供了對 "),i("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},"Tomcat"),e(" 實例的存取權限。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.tomcat.jakarta.*

        fun main() {
            embeddedServer(Tomcat, configure = {
                configureTomcat = { // this: Tomcat -&gt;
                    // ...
                }
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),s[21]||(s[21]=i("h3",{id:"engine-main-configure",tabindex:"-1"},[e("在設定檔中 "),i("a",{class:"header-anchor",href:"#engine-main-configure","aria-label":'Permalink to "在設定檔中 {id="engine-main-configure"}"'},"​")],-1)),s[22]||(s[22]=i("p",null,[e(" 如果您使用 "),i("code",null,"EngineMain"),e("，您可以在 "),i("code",null,"ktor.deployment"),e(" 群組中指定所有引擎通用的選項。 ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:n(()=>[t(l,{lang:"shell",code:`            ktor {
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
                   shutdownTimeout: 3000`})]),_:1})]),_:1}),t(k,{title:"Netty",id:"netty-file"},{default:n(()=>[s[13]||(s[13]=i("p",null,[e(" 您也可以在設定檔中設定 Netty 特有的選項，在 "),i("code",null,"ktor.deployment"),e(" 群組中： ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:n(()=>[t(l,{lang:"shell",code:`               ktor {
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
