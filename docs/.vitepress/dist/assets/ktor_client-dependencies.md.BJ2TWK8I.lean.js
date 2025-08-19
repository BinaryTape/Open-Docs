import{_ as E,C as l,c as y,o as m,j as t,G as i,ag as r,a as o,w as n}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"添加客户端依赖项","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/client-dependencies.md","filePath":"ktor/client-dependencies.md","lastUpdated":1755457140000}'),v={name:"ktor/client-dependencies.md"};function _(f,e,b,F,q,A){const h=l("show-structure"),c=l("link-summary"),d=l("control"),s=l("code-block"),a=l("TabItem"),g=l("note"),p=l("Tabs"),k=l("list"),u=l("chapter");return m(),y("div",null,[e[10]||(e[10]=t("h1",{id:"添加客户端依赖项",tabindex:"-1"},[o("添加客户端依赖项 "),t("a",{class:"header-anchor",href:"#添加客户端依赖项","aria-label":'Permalink to "添加客户端依赖项"'},"​")],-1)),i(h,{for:"chapter",depth:"2"}),i(c,null,{default:n(()=>e[0]||(e[0]=[o("了解如何向现有项目添加客户端依赖项。")])),_:1}),e[11]||(e[11]=r("",3)),i(k,null,{default:n(()=>[t("li",null,[t("p",null,[i(d,null,{default:n(()=>e[1]||(e[1]=[o("生产版本")])),_:1})]),e[3]||(e[3]=t("p",null," Ktor 的生产版本在 Maven 中央仓库中可用。 你可以在构建脚本中按如下方式声明此仓库： ",-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
                        mavenCentral()
                    }`})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:`                    repositories {
                        mavenCentral()
                    }`})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(g,null,{default:n(()=>e[2]||(e[2]=[t("p",null,[o(" 你无需在 "),t("path",null,"pom.xml"),o(" 文件中添加 Maven 中央仓库，因为你的项目会从 "),t("a",{href:"https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom"},"Super POM"),o(" 继承中央仓库。 ")],-1)])),_:1})]),_:1})]),_:1})]),t("li",null,[t("p",null,[i(d,null,{default:n(()=>e[4]||(e[4]=[o("抢先体验计划 (EAP)")])),_:1})]),e[5]||(e[5]=t("p",null,[o(" 要获取 Ktor 的 "),t("a",{href:"https://ktor.io/eap/"},"EAP"),o(" 版本，你需要引用 "),t("a",{href:"https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/"},"Space 仓库"),o("： ")],-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
                        maven {
                            url = uri("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
                        }
                    }`})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:`                    repositories {
                        maven {
                            url "https://maven.pkg.jetbrains.space/public/p/ktor/eap"
                        }
                    }`})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`                    <repositories>
                        <repository>
                            <id>ktor-eap</id>
                            <url>https://maven.pkg.jetbrains.space/public/p/ktor/eap</url>
                        </repository>
                    </repositories>`})]),_:1})]),_:1}),e[6]||(e[6]=t("p",null,[o(" 请注意，Ktor EAP 可能需要 "),t("a",{href:"https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"},"Kotlin 开发仓库"),o("： ")],-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
                        maven {
                            url = uri("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev")
                        }
                    }`})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:`                    repositories {
                        maven {
                            url "https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"
                        }
                    }`})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`                    <repositories>
                        <repository>
                            <id>ktor-eap</id>
                            <url>https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev</url>
                        </repository>
                    </repositories>`})]),_:1})]),_:1})])]),_:1}),e[12]||(e[12]=r("",4)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-client-core:$ktor_version")'})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:'            implementation "io.ktor:ktor-client-core:$ktor_version"'})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-client-core-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[13]||(e[13]=r("",8)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-client-cio:$ktor_version")'})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:'            implementation "io.ktor:ktor-client-cio:$ktor_version"'})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-client-cio-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[14]||(e[14]=r("",10)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:'              implementation("ch.qos.logback:logback-classic:$logback_version")'})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:'              implementation "ch.qos.logback:logback-classic:$logback_version"'})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`              <dependency>
                  <groupId>ch.qos.logback</groupId>
                  <artifactId>logback-classic</artifactId>
                  <version>\${logback_version}</version>
              </dependency>`})]),_:1})]),_:1}),e[15]||(e[15]=r("",5)),i(u,{title:"使用 Ktor BOM 依赖项"},{default:n(()=>[e[7]||(e[7]=t("p",null,"Ktor BOM 允许你确保所有 Ktor 模块使用相同的一致版本，而无需为每个依赖项单独指定版本。",-1)),e[8]||(e[8]=t("p",null,"要添加 Ktor BOM 依赖项，请在你的构建脚本中按如下方式声明它：",-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:'            implementation(platform("io.ktor:ktor-bom:$ktor_version"))'})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:'            implementation platform "io.ktor:ktor-bom:$ktor_version"'})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`            <dependencyManagement>
              <dependencies>
                  <dependency>
                      <groupId>io.ktor</groupId>
                      <artifactId>ktor-bom</artifactId>
                      <version>3.2.3</version>
                      <type>pom</type>
                      <scope>import</scope>
                  </dependency>
              </dependencies>
          </dependencyManagement>`})]),_:1})]),_:1})]),_:1}),e[16]||(e[16]=t("p",null," 你还可以通过使用已发布的版本目录来集中管理 Ktor 依赖项声明。 这种方法提供以下好处： ",-1)),i(k,{id:"published-version-catalog-benefits"},{default:n(()=>e[9]||(e[9]=[t("li",null," 消除了手动在你自己的目录中声明 Ktor 版本的需要。 ",-1),t("li",null," 在单个命名空间下公开每个 Ktor 模块。 ",-1)])),_:1}),e[17]||(e[17]=t("p",null,[o(" 要声明该目录，请在 "),t("path",null,"settings.gradle.kts"),o(" 文件中创建一个你所选名称的版本目录： ")],-1)),i(s,{lang:"kotlin",code:`    dependencyResolutionManagement {
        versionCatalogs {
            create("ktorLibs") {
                from("io.ktor:ktor-version-catalog:3.2.3")
            }
        }
    }`}),e[18]||(e[18]=t("p",null,[o(" 然后，你可以在模块的 "),t("path",null,"build.gradle.kts"),o(" 文件中通过引用目录名称来添加依赖项： ")],-1)),i(s,{lang:"kotlin",code:`    dependencies {
        implementation(ktorLibs.client.core)
        // ...
    }`})])}const T=E(v,[["render",_]]);export{K as __pageData,T as default};
