import{_ as h,C as o,c,o as g,j as i,G as e,ag as p,a,w as t}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/client-multiplatform.md","filePath":"ktor/client-multiplatform.md","lastUpdated":1755457140000}'),m={name:"ktor/client-multiplatform.md"};function u(y,n,E,_,f,v){const d=o("tldr"),k=o("link-summary"),s=o("code-block"),l=o("TabItem"),r=o("Tabs");return g(),c("div",null,[n[6]||(n[6]=i("h1",{id:"多平台",tabindex:"-1"},[a("多平台 "),i("a",{class:"header-anchor",href:"#多平台","aria-label":'Permalink to "多平台"'},"​")],-1)),e(d,null,{default:t(()=>n[0]||(n[0]=[i("p",null,[a(" 代码示例："),i("a",{href:"https://github.com/ktorio/ktor-samples/tree/main/client-mpp"},"client-mpp")],-1)])),_:1}),e(k,null,{default:t(()=>n[1]||(n[1]=[a(" Ktor 客户端可用于多平台项目，并支持 Android、JavaScript 和 Native 平台。 ")])),_:1}),n[7]||(n[7]=p("",4)),i("ol",null,[i("li",null,[n[2]||(n[2]=i("p",null,[a("要在公共代码中使用 Ktor 客户端，请在 "),i("code",null,"build.gradle"),a(" 或 "),i("code",null,"build.gradle.kts"),a(" 文件中将 "),i("code",null,"ktor-client-core"),a(" 依赖项添加到 "),i("code",null,"commonMain"),a(" 源代码集：")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val commonMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-core:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               commonMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-core:$ktor_version"
                   }
               }`})]),_:1})]),_:1})]),i("li",null,[n[3]||(n[3]=i("p",null,[a("将所需平台的"),i("a",{href:"./client-engines#dependencies"},"引擎依赖项"),a("添加到对应的源代码集。对于 Android，你可以将 "),i("a",{href:"./client-engines#android"},"Android"),a(" 引擎依赖项添加到 "),i("code",null,"androidMain"),a(" 源代码集：")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val androidMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-android:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               androidMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-android:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[4]||(n[4]=i("p",null,[a("对于 iOS，你需要将 "),i("a",{href:"./client-engines#darwin"},"Darwin"),a(" 引擎依赖项添加到 "),i("code",null,"iosMain"),a("：")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val iosMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-darwin:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               iosMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-darwin:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[5]||(n[5]=i("p",null,[a("要了解支持哪些引擎适用于每个平台，请参见"),i("a",{href:"./client-engines#dependencies"},"添加引擎依赖项"),a("。")],-1))])]),n[8]||(n[8]=p("",9))])}const b=h(m,[["render",u]]);export{C as __pageData,b as default};
