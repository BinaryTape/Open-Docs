import{_ as g,C as r,c,o as E,j as i,G as t,ag as h,a as e,w as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"服务器引擎","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-engines.md","filePath":"ktor/server-engines.md","lastUpdated":1755457140000}'),y={name:"ktor/server-engines.md"};function u(m,s,v,F,f,C){const p=r("show-structure"),d=r("link-summary"),l=r("code-block"),a=r("TabItem"),o=r("Tabs"),k=r("chapter");return E(),c("div",null,[s[14]||(s[14]=i("h1",{id:"服务器引擎",tabindex:"-1"},[e("服务器引擎 "),i("a",{class:"header-anchor",href:"#服务器引擎","aria-label":'Permalink to "服务器引擎"'},"​")],-1)),t(p,{for:"chapter",depth:"3"}),t(d,null,{default:n(()=>s[0]||(s[0]=[e(" 了解处理网络请求的引擎。 ")])),_:1}),s[15]||(s[15]=h('<p>要运行 Ktor 服务器应用程序，您需要先<a href="./server-create-and-configure">创建</a>和配置服务器。 服务器配置包括不同的设置：</p><ul><li>用于处理网络请求的<a href="#supported-engines">引擎</a>；</li><li>用于访问服务器的主机和端口值；</li><li>SSL 设置；</li><li>……等等。</li></ul><h2 id="supported-engines" tabindex="-1">支持的引擎 <a class="header-anchor" href="#supported-engines" aria-label="Permalink to &quot;支持的引擎 {id=&quot;supported-engines&quot;}&quot;">​</a></h2><p>下表列出了 Ktor 支持的引擎以及支持的平台：</p><table tabindex="0"><thead><tr><th>引擎</th><th>平台</th><th>HTTP/2</th></tr></thead><tbody><tr><td><code>Netty</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>Jetty</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>Tomcat</code></td><td>JVM</td><td>✅</td></tr><tr><td><code>CIO</code> (基于协程的 I/O)</td><td>JVM, <a href="./server-native">原生</a>, <a href="./graalvm">GraalVM</a></td><td>✖️</td></tr><tr><td><a href="./server-war">ServletApplicationEngine</a></td><td>JVM</td><td>✅</td></tr></tbody></table><h2 id="dependencies" tabindex="-1">添加依赖项 <a class="header-anchor" href="#dependencies" aria-label="Permalink to &quot;添加依赖项 {id=&quot;dependencies&quot;}&quot;">​</a></h2><p>在使用所需的引擎之前，您需要将相应的<a href="./server-dependencies">依赖项</a>添加到您的构建脚本中：</p><ul><li><code>ktor-server-netty</code></li><li><code>ktor-server-jetty-jakarta</code></li><li><code>ktor-server-tomcat-jakarta</code></li><li><code>ktor-server-cio</code></li></ul><p>以下是为 Netty 添加依赖项的示例：</p>',9)),t(o,{group:"languages"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-netty:$ktor_version")'})]),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-netty:$ktor_version"'})]),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-netty-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[16]||(s[16]=h(`<h2 id="choose-create-server" tabindex="-1">选择如何创建服务器 <a class="header-anchor" href="#choose-create-server" aria-label="Permalink to &quot;选择如何创建服务器 {id=&quot;choose-create-server&quot;}&quot;">​</a></h2><p>Ktor 服务器应用程序可以通过<a href="./server-create-and-configure#embedded">两种方式创建和运行</a>：使用<a href="#embeddedServer">embeddedServer</a> 在代码中快速传递服务器形参，或者使用<a href="#EngineMain">EngineMain</a> 从外部的 <code>application.conf</code> 或 <code>application.yaml</code> 文件加载配置。</p><h3 id="embeddedServer" tabindex="-1">embeddedServer <a class="header-anchor" href="#embeddedServer" aria-label="Permalink to &quot;embeddedServer {id=&quot;embeddedServer&quot;}&quot;">​</a></h3><p><a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html" target="_blank" rel="noreferrer">embeddedServer</a> 函数接受一个引擎工厂，用于创建特定类型的引擎。在以下示例中，我们传入 <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html" target="_blank" rel="noreferrer">Netty</a> 工厂，以 Netty 引擎运行服务器并监听 <code>8080</code> 端口：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io.ktor.server.response.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="EngineMain" tabindex="-1">EngineMain <a class="header-anchor" href="#EngineMain" aria-label="Permalink to &quot;EngineMain {id=&quot;EngineMain&quot;}&quot;">​</a></h3><p><code>EngineMain</code> 表示一个用于运行服务器的引擎。您可以使用以下引擎：</p><ul><li><code>io.ktor.server.netty.EngineMain</code></li><li><code>io.ktor.server.jetty.jakarta.EngineMain</code></li><li><code>io.ktor.server.tomcat.jakarta.EngineMain</code></li><li><code>io.ktor.server.cio.EngineMain</code></li></ul><p><code>EngineMain.main</code> 函数用于启动具有所选引擎的服务器，并加载外部<a href="./server-configuration-file">配置文件</a>中指定的<a href="./server-modules">应用程序模块</a>。在以下示例中，我们从应用程序的 <code>main</code> 函数启动服务器：</p>`,9)),t(o,null,{default:n(()=>[t(a,{title:"Application.kt"},{default:n(()=>s[1]||(s[1]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"package"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," com.example")]),e(`
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
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            - "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"com.example.ApplicationKt.module")])])])],-1)])),_:1})]),_:1}),s[17]||(s[17]=i("p",null,[e("如果您需要使用构建系统任务启动服务器，则需要将所需的 "),i("code",null,"EngineMain"),e(" 配置为主类：")],-1)),t(o,{group:"languages",id:"main-class-set-engine-main"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>s[4]||(s[4]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    mainClass."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"set"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"io.ktor.server.netty.EngineMain"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>s[5]||(s[5]=[i("div",{class:"language-groovy vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"groovy"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"mainClassName "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "io.ktor.server.netty.EngineMain"')])])])],-1)])),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>s[6]||(s[6]=[i("div",{class:"language-xml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"xml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    <"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">io.ktor.server.netty.EngineMain</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")])])])],-1)])),_:1})]),_:1}),s[18]||(s[18]=h('<h2 id="configure-engine" tabindex="-1">配置引擎 <a class="header-anchor" href="#configure-engine" aria-label="Permalink to &quot;配置引擎 {id=&quot;configure-engine&quot;}&quot;">​</a></h2><p>在本节中，我们将介绍如何指定各种引擎特有的选项。</p><h3 id="embedded-server-configure" tabindex="-1">在代码中 <a class="header-anchor" href="#embedded-server-configure" aria-label="Permalink to &quot;在代码中 {id=&quot;embedded-server-configure&quot;}&quot;">​</a></h3><p><code>embeddedServer</code> 函数允许您使用 <code>configure</code> 形参传递引擎特有的选项。此形参包含所有引擎共有的选项，并由 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"> ApplicationEngine.Configuration </a> 类公开。 </p><p> 以下示例展示了如何使用 <code>Netty</code> 引擎配置服务器。在 <code>configure</code> 代码块中，我们定义了一个 <code>connector</code> 来指定主机和端口，并自定义各种服务器形参： </p>',5)),t(l,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),s[19]||(s[19]=i("p",null,[i("code",null,"connectors.add()"),e(" 方法定义了一个具有指定主机 ("),i("code",null,"127.0.0.1"),e(") 和端口 ("),i("code",null,"8080"),e(") 的连接器。 ")],-1)),s[20]||(s[20]=i("p",null,"除了这些选项之外，您还可以配置其他引擎特有的属性。",-1)),t(k,{title:"Netty",id:"netty-code"},{default:n(()=>[s[7]||(s[7]=i("p",null,[e(" Netty 特有的选项由 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"}," NettyApplicationEngine.Configuration "),e(" 类公开。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
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
        }`})]),_:1}),t(k,{title:"Jetty",id:"jetty-code"},{default:n(()=>[s[8]||(s[8]=i("p",null,[e(" Jetty 特有的选项由 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"}," JettyApplicationEngineBase.Configuration "),e(" 类公开。 ")],-1)),s[9]||(s[9]=i("p",null,[e("您可以在 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"}," configureServer "),e(" 代码块中配置 Jetty 服务器，它提供了对 "),i("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},"Server"),e(" 实例的访问。 ")],-1)),s[10]||(s[10]=i("p",null,[e(" 使用 "),i("code",null,"idleTimeout"),e(" 属性可以指定连接在关闭之前可以保持空闲的时长。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
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
        }`})]),_:1}),t(k,{title:"CIO",id:"cio-code"},{default:n(()=>[s[11]||(s[11]=i("p",null,[e("CIO 特有的选项由 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"}," CIOApplicationEngine.Configuration "),e(" 类公开。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.cio.*

        fun main() {
            embeddedServer(CIO, configure = {
                connectionIdleTimeoutSeconds = 45
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),t(k,{title:"Tomcat",id:"tomcat-code"},{default:n(()=>[s[12]||(s[12]=i("p",null,[e("如果您使用 Tomcat 作为引擎，则可以使用 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"}," configureTomcat "),e(" 属性对其进行配置，该属性提供了对 "),i("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},"Tomcat"),e(" 实例的访问。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.tomcat.jakarta.*

        fun main() {
            embeddedServer(Tomcat, configure = {
                configureTomcat = { // this: Tomcat -&gt;
                    // ...
                }
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),s[21]||(s[21]=i("h3",{id:"engine-main-configure",tabindex:"-1"},[e("在配置文件中 "),i("a",{class:"header-anchor",href:"#engine-main-configure","aria-label":'Permalink to "在配置文件中 {id="engine-main-configure"}"'},"​")],-1)),s[22]||(s[22]=i("p",null,[e(" 如果您使用 "),i("code",null,"EngineMain"),e("，可以在 "),i("code",null,"ktor.deployment"),e(" 组中指定所有引擎共有的选项。 ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:n(()=>[t(l,{lang:"shell",code:`            ktor {
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
                   shutdownTimeout: 3000`})]),_:1})]),_:1}),t(k,{title:"Netty",id:"netty-file"},{default:n(()=>[s[13]||(s[13]=i("p",null,[e(" 您还可以在配置文件中，在 "),i("code",null,"ktor.deployment"),e(" 组内配置 Netty 特有的选项： ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:n(()=>[t(l,{lang:"shell",code:`               ktor {
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
