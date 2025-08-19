import{_ as h,C as o,c,o as g,j as i,G as e,ag as p,a,w as t}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/client-multiplatform.md","filePath":"zh-Hant/ktor/client-multiplatform.md","lastUpdated":1755457140000}'),m={name:"zh-Hant/ktor/client-multiplatform.md"};function u(y,n,E,_,f,v){const d=o("tldr"),k=o("link-summary"),s=o("code-block"),l=o("TabItem"),r=o("Tabs");return g(),c("div",null,[n[6]||(n[6]=i("h1",{id:"多平台",tabindex:"-1"},[a("多平台 "),i("a",{class:"header-anchor",href:"#多平台","aria-label":'Permalink to "多平台"'},"​")],-1)),e(d,null,{default:t(()=>n[0]||(n[0]=[i("p",null,[a(" 程式碼範例："),i("a",{href:"https://github.com/ktorio/ktor-samples/tree/main/client-mpp"},"client-mpp")],-1)])),_:1}),e(k,null,{default:t(()=>n[1]||(n[1]=[a(" Ktor 用戶端可用於多平台專案，並支援 Android、JavaScript 和 Native 平台。 ")])),_:1}),n[7]||(n[7]=p("",4)),i("ol",null,[i("li",null,[n[2]||(n[2]=i("p",null,[a("若要在通用程式碼中使用 Ktor 用戶端，請將 "),i("code",null,"ktor-client-core"),a(" 依賴項新增至 "),i("code",null,"build.gradle"),a(" 或 "),i("code",null,"build.gradle.kts"),a(" 檔案中的 "),i("code",null,"commonMain"),a(" 原始碼集：")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val commonMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-core:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               commonMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-core:$ktor_version"
                   }
               }`})]),_:1})]),_:1})]),i("li",null,[n[3]||(n[3]=i("p",null,[a("將所需平台的 "),i("a",{href:"./client-engines#dependencies"},"引擎依賴項"),a(" 新增至對應的原始碼集。對於 Android，您可以將 "),i("a",{href:"./client-engines#android"},"Android"),a(" 引擎依賴項新增至 "),i("code",null,"androidMain"),a(" 原始碼集：")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val androidMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-android:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               androidMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-android:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[4]||(n[4]=i("p",null,[a("對於 iOS，您需要將 "),i("a",{href:"./client-engines#darwin"},"Darwin"),a(" 引擎依賴項新增至 "),i("code",null,"iosMain"),a("：")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val iosMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-darwin:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               iosMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-darwin:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[5]||(n[5]=i("p",null,[a("若要了解每個平台支援哪些引擎，請參閱 "),i("a",{href:"./client-engines#dependencies"},"新增引擎依賴項"),a("。")],-1))])]),n[8]||(n[8]=p("",9))])}const b=h(m,[["render",u]]);export{C as __pageData,b as default};
