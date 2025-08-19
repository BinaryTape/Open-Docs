import{_ as h,C as o,c,o as g,j as i,G as e,ag as p,a,w as t}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/client-multiplatform.md","filePath":"ja/ktor/client-multiplatform.md","lastUpdated":1755457140000}'),m={name:"ja/ktor/client-multiplatform.md"};function u(y,n,E,_,f,v){const d=o("tldr"),k=o("link-summary"),s=o("code-block"),l=o("TabItem"),r=o("Tabs");return g(),c("div",null,[n[6]||(n[6]=i("h1",{id:"マルチプラットフォーム",tabindex:"-1"},[a("マルチプラットフォーム "),i("a",{class:"header-anchor",href:"#マルチプラットフォーム","aria-label":'Permalink to "マルチプラットフォーム"'},"​")],-1)),e(d,null,{default:t(()=>n[0]||(n[0]=[i("p",null,[a(" コード例: "),i("a",{href:"https://github.com/ktorio/ktor-samples/tree/main/client-mpp"},"client-mpp")],-1)])),_:1}),e(k,null,{default:t(()=>n[1]||(n[1]=[a(" Ktorクライアントはマルチプラットフォームプロジェクトで使用でき、Android、JavaScript、およびNativeプラットフォームをサポートしています。 ")])),_:1}),n[7]||(n[7]=p("",4)),i("ol",null,[i("li",null,[n[2]||(n[2]=i("p",null,[i("code",null,"commonMain"),a(" ソースセットの "),i("code",null,"build.gradle"),a(" または "),i("code",null,"build.gradle.kts"),a(" ファイルに "),i("code",null,"ktor-client-core"),a(" への依存関係を追加して、共通コードでKtorクライアントを使用します。")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val commonMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-core:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               commonMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-core:$ktor_version"
                   }
               }`})]),_:1})]),_:1})]),i("li",null,[n[3]||(n[3]=i("p",null,[a("必要なプラットフォーム用の"),i("a",{href:"./client-engines#dependencies"},"エンジン依存関係"),a("を対応するソースセットに追加します。Androidの場合、"),i("code",null,"androidMain"),a(" ソースセットに"),i("a",{href:"./client-engines#android"},"Android"),a("エンジンの依存関係を追加できます。")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val androidMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-android:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               androidMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-android:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[4]||(n[4]=i("p",null,[a("iOSの場合、"),i("code",null,"iosMain"),a("に"),i("a",{href:"./client-engines#darwin"},"Darwin"),a("エンジンの依存関係を追加する必要があります。")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val iosMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-darwin:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               iosMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-darwin:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[5]||(n[5]=i("p",null,[a("各プラットフォームでサポートされているエンジンを確認するには、"),i("a",{href:"./client-engines#dependencies"},"エンジン依存関係の追加"),a("を参照してください。")],-1))])]),n[8]||(n[8]=p("",9))])}const b=h(m,[["render",u]]);export{C as __pageData,b as default};
