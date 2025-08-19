import{_ as K,C as a,c as G,o as b,G as n,w as t,j as o,a as l}from"./chunks/framework.Bksy39di.js";const I=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-dependencies.md","filePath":"ktor/server-dependencies.md","lastUpdated":1755457140000}'),M={name:"ktor/server-dependencies.md"};function j(L,e,x,A,_,C){const k=a("show-structure"),f=a("link-summary"),m=a("control"),r=a("code-block"),i=a("tab"),g=a("Path"),v=a("note"),p=a("tabs"),u=a("list"),s=a("chapter"),d=a("Links"),y=a("topic");return b(),G("div",null,[n(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"添加服务器依赖项",id:"server-dependencies","help-id":"Gradle"},{default:t(()=>[n(k,{for:"chapter",depth:"2"}),n(f,null,{default:t(()=>e[0]||(e[0]=[l("了解如何将 Ktor 服务器依赖项添加到现有 Gradle/Maven 项目中。")])),_:1}),e[41]||(e[41]=o("p",null," 在本主题中，我们将向您展示如何将 Ktor 服务器所需的依赖项添加到现有 Gradle/Maven 项目中。 ",-1)),n(s,{title:"配置版本库",id:"repositories"},{default:t(()=>[e[11]||(e[11]=o("p",null," 在添加 Ktor 依赖项之前，您需要为该项目配置版本库： ",-1)),n(u,null,{default:t(()=>[o("li",null,[o("p",null,[n(m,null,{default:t(()=>e[1]||(e[1]=[l("生产版本")])),_:1})]),e[7]||(e[7]=o("p",null," Ktor 的生产版本在 Maven 中央版本库中提供。 您可以在构建脚本中声明此版本库，如下所示： ",-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            repositories {
                                mavenCentral()
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            repositories {
                                mavenCentral()
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(v,null,{default:t(()=>[o("p",null,[e[3]||(e[3]=l(" 您无需在 ")),n(g,null,{default:t(()=>e[2]||(e[2]=[l("pom.xml")])),_:1}),e[4]||(e[4]=l(" 文件中添加 Maven 中央版本库，因为您的项目继承自 ")),e[5]||(e[5]=o("a",{href:"https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom"},"Super POM",-1)),e[6]||(e[6]=l(" 中的中央版本库。 "))])]),_:1})]),_:1})]),_:1})]),o("li",null,[o("p",null,[n(m,null,{default:t(()=>e[8]||(e[8]=[l("抢先体验计划 (EAP)")])),_:1})]),e[9]||(e[9]=o("p",null,[l(" 要访问 Ktor 的 "),o("a",{href:"https://ktor.io/eap/"},"EAP"),l(" 版本，您需要引用 "),o("a",{href:"https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/"},"Space 版本库"),l("： ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            repositories {
                                maven {
                                    url = uri("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
                                }
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            repositories {
                                maven {
                                    url "https://maven.pkg.jetbrains.space/public/p/ktor/eap"
                                }
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                            <repositories>
                                <repository>
                                    <id>ktor-eap</id>
                                    <url>https://maven.pkg.jetbrains.space/public/p/ktor/eap</url>
                                </repository>
                            </repositories>`})]),_:1})]),_:1}),e[10]||(e[10]=o("p",null,[l(" 请注意，Ktor EAP 可能需要 "),o("a",{href:"https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"},"Kotlin 开发版本库"),l("： ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            repositories {
                                maven {
                                    url = uri("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev")
                                }
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            repositories {
                                maven {
                                    url "https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"
                                }
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                            <repositories>
                                <repository>
                                    <id>ktor-eap</id>
                                    <url>https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev</url>
                                </repository>
                            </repositories>`})]),_:1})]),_:1})])]),_:1})]),_:1}),n(s,{title:"添加依赖项",id:"add-ktor-dependencies"},{default:t(()=>[n(s,{title:"核心依赖项",id:"core-dependencies"},{default:t(()=>[e[18]||(e[18]=o("p",null," 每个 Ktor 应用程序至少需要以下依赖项： ",-1)),n(u,null,{default:t(()=>[e[17]||(e[17]=o("li",null,[o("p",null,[o("code",null,"ktor-server-core"),l("：包含 Ktor 核心功能。 ")])],-1)),o("li",null,[o("p",null,[e[13]||(e[13]=l(" 一个 ")),n(d,{href:"/ktor/server-engines",summary:"了解处理网络请求的引擎。"},{default:t(()=>e[12]||(e[12]=[l("引擎")])),_:1}),e[14]||(e[14]=l(" 的依赖项（例如，")),e[15]||(e[15]=o("code",null,"ktor-server-netty",-1)),e[16]||(e[16]=l("）。 "))])])]),_:1}),e[19]||(e[19]=o("p",null,[l(" 对于不同的平台，Ktor 提供带有 "),o("code",null,"-jvm"),l(" 等后缀的平台特有的构件，例如 "),o("code",null,"ktor-server-core-jvm"),l(" 或 "),o("code",null,"ktor-server-netty-jvm"),l("。 请注意，Gradle 会解析适用于给定平台的构件，而 Maven 不支持此功能。 这意味着对于 Maven，您需要手动添加平台特有的后缀。 一个基本 Ktor 应用程序的 "),o("code",null,"dependencies"),l(" 代码块可能如下所示： ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                        dependencies {
                            implementation("io.ktor:ktor-server-core:3.2.3")
                            implementation("io.ktor:ktor-server-netty:3.2.3")
                        }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                        dependencies {
                            implementation "io.ktor:ktor-server-core:3.2.3"
                            implementation "io.ktor:ktor-server-netty:3.2.3"
                        }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                        <dependencies>
                            <dependency>
                                <groupId>io.ktor</groupId>
                                <artifactId>ktor-server-core-jvm</artifactId>
                                <version>3.2.3</version>
                            </dependency>
                            <dependency>
                                <groupId>io.ktor</groupId>
                                <artifactId>ktor-server-netty-jvm</artifactId>
                                <version>3.2.3</version>
                            </dependency>
                        </dependencies>`})]),_:1})]),_:1})]),_:1}),n(s,{title:"日志依赖项",id:"logging-dependency"},{default:t(()=>e[20]||(e[20]=[o("p",null,[l(" Ktor 使用 SLF4J API 作为各种日志框架（例如，Logback 或 Log4j）的门面，并允许您记录应用程序事件。 要了解如何添加所需的构件，请参见 "),o("a",{href:"./server-logging#add_dependencies"},"添加日志器依赖项"),l("。 ")],-1)])),_:1}),n(s,{title:"插件依赖项",id:"plugin-dependencies"},{default:t(()=>[o("p",null,[n(d,{href:"/ktor/server-plugins",summary:"插件提供常见功能，例如序列化、内容编码、压缩等。"},{default:t(()=>e[21]||(e[21]=[l("插件")])),_:1}),e[22]||(e[22]=l(" 扩展 Ktor 功能可能需要额外的依赖项。 您可以从相应主题中了解更多信息。 "))])]),_:1})]),_:1}),n(s,{title:"确保 Ktor 版本一致性",id:"ensure-version-consistency"},{default:t(()=>[n(s,{id:"using-gradle-plugin",title:"使用 Ktor Gradle 插件"},{default:t(()=>[e[23]||(e[23]=o("p",null,[l(" 应用 "),o("a",{href:"https://github.com/ktorio/ktor-build-plugins"},"Ktor Gradle 插件"),l(" 会隐式添加 Ktor BOM 依赖项，并允许您确保所有 Ktor 依赖项都处于相同版本。 在这种情况下，在依赖 Ktor 构件时，您不再需要指定版本： ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                        plugins {
                            // ...
                            id("io.ktor.plugin") version "3.2.3"
                        }
                        dependencies {
                            implementation("io.ktor:ktor-server-core")
                            // ...
                        }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                        plugins {
                            // ...
                            id "io.ktor.plugin" version "3.2.3"
                        }
                        dependencies {
                            implementation "io.ktor:ktor-server-core"
                            // ...
                        }`})]),_:1})]),_:1})]),_:1}),n(s,{id:"using-version-catalog",title:"使用已发布的版本目录"},{default:t(()=>[e[31]||(e[31]=o("p",null," 您还可以通过使用已发布的版本目录集中管理 Ktor 依赖项声明。 这种方法提供以下优势： ",-1)),n(u,{id:"published-version-catalog-benefits"},{default:t(()=>e[24]||(e[24]=[o("li",null,[o("p",null," 无需在您自己的目录中手动声明 Ktor 版本。 ")],-1),o("li",null,[o("p",null," 将每个 Ktor 模块暴露在单一命名空间下。 ")],-1)])),_:1}),o("p",null,[e[26]||(e[26]=l(" 要在 ")),n(g,null,{default:t(()=>e[25]||(e[25]=[l("settings.gradle.kts")])),_:1}),e[27]||(e[27]=l(" 中声明目录，请使用您选择的名称创建一个版本目录： "))]),n(r,{lang:"kotlin",code:`                dependencyResolutionManagement {
                    versionCatalogs {
                        create("ktorLibs") {
                            from("io.ktor:ktor-version-catalog:3.2.3")
                        }
                    }
                }`}),o("p",null,[e[29]||(e[29]=l(" 然后，您可以通过引用目录名称在模块的 ")),n(g,null,{default:t(()=>e[28]||(e[28]=[l("build.gradle.kts")])),_:1}),e[30]||(e[30]=l(" 中添加依赖项： "))]),n(r,{lang:"kotlin",code:`                dependencies {
                    implementation(ktorLibs.server.core)
                    // ...
                }`})]),_:1})]),_:1}),n(s,{title:"创建运行应用程序的入口点",id:"create-entry-point"},{default:t(()=>[o("p",null,[n(d,{href:"/ktor/server-run",summary:"了解如何运行服务器 Ktor 应用程序。"},{default:t(()=>e[32]||(e[32]=[l("运行")])),_:1}),e[34]||(e[34]=l(" Ktor 服务器时，使用 Gradle/Maven 取决于 ")),n(d,{href:"/ktor/server-create-and-configure",summary:"了解如何根据应用程序部署需求创建服务器。"},{default:t(()=>e[33]||(e[33]=[l("创建服务器")])),_:1}),e[35]||(e[35]=l(" 的方式。 您可以通过以下方式之一指定应用程序主类： "))]),n(u,null,{default:t(()=>[o("li",null,[e[36]||(e[36]=o("p",null,[l(" 如果您使用 "),o("a",{href:"#embedded-server"},"embeddedServer"),l("，请按如下方式指定主类： ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            application {
                                mainClass.set("com.example.ApplicationKt")
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            application {
                                mainClass = "com.example.ApplicationKt"
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                            <properties>
                                <main.class>com.example.ApplicationKt</main.class>
                            </properties>`})]),_:1})]),_:1})]),o("li",null,[e[37]||(e[37]=o("p",null,[l(" 如果您使用 "),o("a",{href:"#engine-main"},"EngineMain"),l("，您需要将其配置为主类。 对于 Netty，它将如下所示： ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            application {
                                mainClass.set("io.ktor.server.netty.EngineMain")
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            application {
                                mainClass = "io.ktor.server.netty.EngineMain"
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                            <properties>
                                <main.class>io.ktor.server.netty.EngineMain</main.class>
                            </properties>`})]),_:1})]),_:1})])]),_:1}),n(v,null,{default:t(()=>[e[40]||(e[40]=o("p",null," 如果您要将应用程序打包为 Fat JAR，您在配置相应插件时，还需要考虑创建服务器的方式。 从以下主题了解更多信息： ",-1)),n(u,null,{default:t(()=>[o("li",null,[o("p",null,[n(d,{href:"/ktor/server-fatjar",summary:"了解如何使用 Ktor Gradle 插件创建和运行可执行的 Fat JAR。"},{default:t(()=>e[38]||(e[38]=[l("使用 Ktor Gradle 插件创建 Fat JAR")])),_:1})])]),o("li",null,[o("p",null,[n(d,{href:"/ktor/maven-assembly-plugin",summary:"示例项目：tutorial-server-get-started-maven"},{default:t(()=>e[39]||(e[39]=[l("使用 Maven Assembly 插件创建 Fat JAR")])),_:1})])])]),_:1})]),_:1})]),_:1})]),_:1})])}const P=K(M,[["render",j]]);export{I as __pageData,P as default};
