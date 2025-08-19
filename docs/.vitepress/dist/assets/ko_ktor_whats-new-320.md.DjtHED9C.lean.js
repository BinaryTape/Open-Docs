import{_ as o,C as p,c as E,o as g,j as s,G as n,ag as h,a,w as t}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"Ktor 3.2.0의 새로운 기능","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/whats-new-320.md","filePath":"ko/ktor/whats-new-320.md","lastUpdated":1755457140000}'),c={name:"ko/ktor/whats-new-320.md"};function y(u,i,F,b,v,C){const d=p("show-structure"),e=p("code-block"),k=p("compare"),l=p("TabItem"),r=p("Tabs");return g(),E("div",null,[i[3]||(i[3]=s("h1",{id:"ktor-3-2-0의-새로운-기능",tabindex:"-1"},[a("Ktor 3.2.0의 새로운 기능 "),s("a",{class:"header-anchor",href:"#ktor-3-2-0의-새로운-기능","aria-label":'Permalink to "Ktor 3.2.0의 새로운 기능"'},"​")],-1)),n(d,{for:"chapter,procedure",depth:"2"}),i[4]||(i[4]=h("",19)),n(k,null,{default:t(()=>[n(e,{lang:"kotlin",code:`data class DatabaseConfig(
    val url: String,
    val username: String,
    val password: String? = null,
)

fun Application.module() {
  val databaseConfig = DatabaseConfig(
    url = environment.config.property("database.url").getString(),
    username = environment.config.property("database.username").getString(),
    password = environment.config.property("database.password").getString(),
  )
  // use configuration
}`}),n(e,{lang:"kotlin",code:`@Serializable 
data class DatabaseConfig(
    val url: String,
    val username: String,
    val password: String? = null,
)

fun Application.module() {
  val databaseConfig: DatabaseConfig = property("database")
  // use configuration
}`})]),_:1}),i[5]||(i[5]=h("",7)),n(r,{group:"languages"},{default:t(()=>[n(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-di:$ktor_version")'})]),_:1}),n(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-di:$ktor_version"'})]),_:1}),n(l,{title:"Maven","group-key":"maven"},{default:t(()=>[n(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-di-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[6]||(i[6]=h("",33)),n(k,{"first-title":"Before","second-title":"After"},{default:t(()=>i[0]||(i[0]=[s("div",{class:"language-kotlin vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"kotlin"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"val"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," file "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," client."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"get"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/some-file"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") {")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    skipSavingBody"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"()")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"bodyAsChannel"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"()")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"saveFile"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(file)")])])])],-1),s("div",{class:"language-kotlin vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"kotlin"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"client."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"prepareGet"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/some-file"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"execute"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," { response "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"->")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    saveFile"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(response."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"bodyAsChannel"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"())")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),i[7]||(i[7]=h("",29)),n(r,null,{default:t(()=>[n(l,{title:"settings.gradle.kts"},{default:t(()=>i[1]||(i[1]=[s("div",{class:"language-kotlin vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"kotlin"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"dependencyResolutionManagement"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    versionCatalogs"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        create"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"ktorLibs"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") {")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"            from"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"io.ktor:ktor-version-catalog:3.2.3"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        }")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),n(l,{title:"build.gradle.kts"},{default:t(()=>i[2]||(i[2]=[s("div",{class:"language-kotlin vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"kotlin"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"dependencies"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    implementation"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(ktorLibs.client.core)")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    implementation"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(ktorLibs.client.cio)")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"    // ...")]),a(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1})]),_:1}),i[8]||(i[8]=h("",6))])}const A=o(c,[["render",y]]);export{B as __pageData,A as default};
