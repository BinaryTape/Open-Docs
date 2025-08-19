import{_ as m,C as n,c as v,o as E,G as t,ag as d,j as e,w as a,a as i}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-webjars.md","filePath":"ktor/server-webjars.md","lastUpdated":1755457140000}'),y={name:"ktor/server-webjars.md"};function f(c,s,j,_,F,w){const k=n("TopicTitle"),u=n("primary-label"),p=n("Links"),h=n("tldr"),g=n("link-summary"),r=n("code-block"),l=n("TabItem"),o=n("Tabs"),b=n("list");return E(),v("div",null,[t(k,{labelRef:"server-plugin",title:"Webjars"}),t(u,{ref:"server-plugin"},null,512),t(h,null,{default:a(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"所需依赖项"),i(": "),e("code",null,"io.ktor:ktor-server-webjars")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"代码示例"),i(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/webjars"}," webjars ")],-1)),e("p",null,[e("b",null,[t(p,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，无需额外的运行时或虚拟机即可运行服务器。"},{default:a(()=>s[0]||(s[0]=[i("原生服务器")])),_:1}),s[1]||(s[1]=i(" 支持"))]),s[2]||(s[2]=i(": ✖️ "))])]),_:1}),t(g,null,{default:a(()=>s[5]||(s[5]=[i(" Webjars 插件支持提供由 WebJars 提供的客户端库。 ")])),_:1}),s[21]||(s[21]=d("",3)),e("ul",null,[e("li",null,[s[6]||(s[6]=e("p",null,[i("添加 "),e("code",null,"ktor-server-webjars"),i(" 依赖项：")],-1)),t(o,{group:"languages"},{default:a(()=>[t(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[t(r,{lang:"Kotlin",code:'              implementation("io.ktor:ktor-server-webjars:$ktor_version")'})]),_:1}),t(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[t(r,{lang:"Groovy",code:'              implementation "io.ktor:ktor-server-webjars:$ktor_version"'})]),_:1}),t(l,{title:"Maven","group-key":"maven"},{default:a(()=>[t(r,{lang:"XML",code:`              <dependency>
                  <groupId>io.ktor</groupId>
                  <artifactId>ktor-server-webjars-jvm</artifactId>
                  <version>\${ktor_version}</version>
              </dependency>`})]),_:1})]),_:1})]),e("li",null,[s[7]||(s[7]=e("p",null,"添加所需客户端库的依赖项。下面的示例展示了如何添加一个 Bootstrap 构件：",-1)),t(o,{group:"languages"},{default:a(()=>[t(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[t(r,{lang:"Kotlin",code:'              implementation("org.webjars:bootstrap:$bootstrap_version")'})]),_:1}),t(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[t(r,{lang:"Groovy",code:'              implementation "org.webjars:bootstrap:$bootstrap_version"'})]),_:1}),t(l,{title:"Maven","group-key":"maven"},{default:a(()=>[t(r,{lang:"XML",code:`              <dependency>
                  <groupId>org.webjars</groupId>
                  <artifactId>bootstrap</artifactId>
                  <version>\${bootstrap_version}</version>
              </dependency>`})]),_:1})]),_:1}),s[8]||(s[8]=e("p",null,[i("您可以将 "),e("code",null,"$bootstrap_version"),i(" 替换为 "),e("code",null,"bootstrap"),i(" 构件的所需版本，例如 "),e("code",null,"5.2.3"),i("。")],-1))])]),s[22]||(s[22]=e("h2",{id:"install_plugin",tabindex:"-1"},[i("安装 Webjars "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 Webjars {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[10]||(s[10]=i(" 要将 ")),s[11]||(s[11]=e("code",null,"Webjars",-1)),s[12]||(s[12]=i(" 插件")),s[13]||(s[13]=e("a",{href:"#install"},"安装",-1)),s[14]||(s[14]=i("到应用程序， 请将其传递给指定 ")),t(p,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:a(()=>s[9]||(s[9]=[i("模块")])),_:1}),s[15]||(s[15]=i(" 中的 ")),s[16]||(s[16]=e("code",null,"install",-1)),s[17]||(s[17]=i(" 函数。 下面的代码片段展示了如何安装 ")),s[18]||(s[18]=e("code",null,"Webjars",-1)),s[19]||(s[19]=i(" …… "))]),t(b,null,{default:a(()=>s[20]||(s[20]=[e("li",null,[i(" ... 在 "),e("code",null,"embeddedServer"),i(" 函数调用内部。 ")],-1),e("li",null,[i(" ... 在显式定义的 "),e("code",null,"module"),i(" 中，它是 "),e("code",null,"Application"),i(" 类的扩展函数。 ")],-1)])),_:1}),t(o,null,{default:a(()=>[t(l,{title:"embeddedServer"},{default:a(()=>[t(r,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
