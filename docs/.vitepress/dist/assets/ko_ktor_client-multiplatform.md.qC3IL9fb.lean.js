import{_ as h,C as o,c,o as g,j as i,G as e,ag as p,a,w as t}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/client-multiplatform.md","filePath":"ko/ktor/client-multiplatform.md","lastUpdated":1755457140000}'),m={name:"ko/ktor/client-multiplatform.md"};function u(y,n,E,_,f,v){const d=o("tldr"),k=o("link-summary"),s=o("code-block"),l=o("TabItem"),r=o("Tabs");return g(),c("div",null,[n[6]||(n[6]=i("h1",{id:"멀티플랫폼",tabindex:"-1"},[a("멀티플랫폼 "),i("a",{class:"header-anchor",href:"#멀티플랫폼","aria-label":'Permalink to "멀티플랫폼"'},"​")],-1)),e(d,null,{default:t(()=>n[0]||(n[0]=[i("p",null,[a(" 코드 예시: "),i("a",{href:"https://github.com/ktorio/ktor-samples/tree/main/client-mpp"},"client-mpp")],-1)])),_:1}),e(k,null,{default:t(()=>n[1]||(n[1]=[a(" Ktor 클라이언트는 멀티플랫폼 프로젝트에서 사용할 수 있으며, Android, JavaScript, Native 플랫폼을 지원합니다. ")])),_:1}),n[7]||(n[7]=p("",4)),i("ol",null,[i("li",null,[n[2]||(n[2]=i("p",null,[a("공통 코드에서 Ktor 클라이언트를 사용하려면 "),i("code",null,"build.gradle"),a(" 또는 "),i("code",null,"build.gradle.kts"),a(" 파일의 "),i("code",null,"commonMain"),a(" 소스 세트에 "),i("code",null,"ktor-client-core"),a(" 의존성을 추가합니다.")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val commonMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-core:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               commonMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-core:$ktor_version"
                   }
               }`})]),_:1})]),_:1})]),i("li",null,[n[3]||(n[3]=i("p",null,[a("필요한 플랫폼에 대한 "),i("a",{href:"./client-engines#dependencies"},"엔진 의존성"),a("을 해당 소스 세트에 추가합니다. Android의 경우 "),i("code",null,"androidMain"),a(" 소스 세트에 "),i("a",{href:"./client-engines#android"},"Android"),a(" 엔진 의존성을 추가할 수 있습니다.")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val androidMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-android:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               androidMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-android:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[4]||(n[4]=i("p",null,[a("iOS의 경우 "),i("code",null,"iosMain"),a("에 "),i("a",{href:"./client-engines#darwin"},"Darwin"),a(" 엔진 의존성을 추가해야 합니다.")],-1)),e(r,{group:"languages"},{default:t(()=>[e(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(s,{lang:"Kotlin",code:`               val iosMain by getting {
                   dependencies {
                       implementation("io.ktor:ktor-client-darwin:$ktor_version")
                   }
               }`})]),_:1}),e(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(s,{lang:"Groovy",code:`               iosMain {
                   dependencies {
                       implementation "io.ktor:ktor-client-darwin:$ktor_version"
                   }
               }`})]),_:1})]),_:1}),n[5]||(n[5]=i("p",null,[a("각 플랫폼에서 어떤 엔진이 지원되는지 알아보려면 "),i("a",{href:"./client-engines#dependencies"},"엔진 의존성 추가"),a("를 참조하세요.")],-1))])]),n[8]||(n[8]=p("",9))])}const b=h(m,[["render",u]]);export{C as __pageData,b as default};
