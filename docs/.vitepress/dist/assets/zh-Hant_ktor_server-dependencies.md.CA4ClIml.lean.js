import{_ as K,C as a,c as G,o as b,G as t,w as n,j as o,a as r}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-dependencies.md","filePath":"zh-Hant/ktor/server-dependencies.md","lastUpdated":1755457140000}'),M={name:"zh-Hant/ktor/server-dependencies.md"};function j(L,e,x,A,C,w){const k=a("show-structure"),f=a("link-summary"),m=a("control"),l=a("code-block"),i=a("tab"),g=a("Path"),v=a("note"),p=a("tabs"),u=a("list"),s=a("chapter"),d=a("Links"),y=a("topic");return b(),G("div",null,[t(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"新增伺服器依賴項",id:"server-dependencies","help-id":"Gradle"},{default:n(()=>[t(k,{for:"chapter",depth:"2"}),t(f,null,{default:n(()=>e[0]||(e[0]=[r("學習如何將 Ktor 伺服器依賴項新增至現有的 Gradle/Maven 專案。")])),_:1}),e[43]||(e[43]=o("p",null," 在本主題中，我們將向您展示如何將 Ktor 伺服器所需的依賴項新增至現有的 Gradle/Maven 專案。 ",-1)),t(s,{title:"配置儲存庫",id:"repositories"},{default:n(()=>[e[11]||(e[11]=o("p",null," 在新增 Ktor 依賴項之前，您需要為此專案配置儲存庫： ",-1)),t(u,null,{default:n(()=>[o("li",null,[o("p",null,[t(m,null,{default:n(()=>e[1]||(e[1]=[r("生產版本")])),_:1})]),e[7]||(e[7]=o("p",null," Ktor 的生產版本可在 Maven 中央儲存庫中找到。 您可以在建置腳本中如此聲明此儲存庫： ",-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                            repositories {
                                mavenCentral()
                            }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                            repositories {
                                mavenCentral()
                            }`})]),_:1}),t(i,{title:"Maven","group-key":"maven"},{default:n(()=>[t(v,null,{default:n(()=>[o("p",null,[e[3]||(e[3]=r(" 您無需在 ")),t(g,null,{default:n(()=>e[2]||(e[2]=[r("pom.xml")])),_:1}),e[4]||(e[4]=r(" 檔案中新增 Maven 中央儲存庫，因為您的專案會從 ")),e[5]||(e[5]=o("a",{href:"https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom"},"Super POM",-1)),e[6]||(e[6]=r(" 繼承中央儲存庫。 "))])]),_:1})]),_:1})]),_:1})]),o("li",null,[o("p",null,[t(m,null,{default:n(()=>e[8]||(e[8]=[r("搶先體驗計畫 (EAP)")])),_:1})]),e[9]||(e[9]=o("p",null,[r(" 若要存取 Ktor 的 "),o("a",{href:"https://ktor.io/eap/"},"EAP"),r(" 版本，您需要引用 "),o("a",{href:"https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/"},"Space 儲存庫"),r("： ")],-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                            repositories {
                                maven {
                                    url = uri("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
                                }
                            }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                            repositories {
                                maven {
                                    url "https://maven.pkg.jetbrains.space/public/p/ktor/eap"
                                }
                            }`})]),_:1}),t(i,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`                            <repositories>
                                <repository>
                                    <id>ktor-eap</id>
                                    <url>https://maven.pkg.jetbrains.space/public/p/ktor/eap</url>
                                </repository>
                            </repositories>`})]),_:1})]),_:1}),e[10]||(e[10]=o("p",null,[r(" 請注意，Ktor EAP 可能需要 "),o("a",{href:"https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"},"Kotlin 開發儲存庫"),r("： ")],-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                            repositories {
                                maven {
                                    url = uri("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev")
                                }
                            }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                            repositories {
                                maven {
                                    url "https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"
                                }
                            }`})]),_:1}),t(i,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`                            <repositories>
                                <repository>
                                    <id>ktor-eap</id>
                                    <url>https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev</url>
                                </repository>
                            </repositories>`})]),_:1})]),_:1})])]),_:1})]),_:1}),t(s,{title:"新增依賴項",id:"add-ktor-dependencies"},{default:n(()=>[t(s,{title:"核心依賴項",id:"core-dependencies"},{default:n(()=>[e[18]||(e[18]=o("p",null," 每個 Ktor 應用程式至少需要以下依賴項： ",-1)),t(u,null,{default:n(()=>[e[17]||(e[17]=o("li",null,[o("p",null,[o("code",null,"ktor-server-core"),r("：包含 Ktor 核心功能。 ")])],-1)),o("li",null,[o("p",null,[e[13]||(e[13]=r(" 一個用於")),t(d,{href:"/ktor/server-engines",summary:"了解處理網路請求的引擎。"},{default:n(()=>e[12]||(e[12]=[r("引擎")])),_:1}),e[14]||(e[14]=r("的依賴項（例如，")),e[15]||(e[15]=o("code",null,"ktor-server-netty",-1)),e[16]||(e[16]=r("）。 "))])])]),_:1}),e[19]||(e[19]=o("p",null,[r(" 針對不同的平台，Ktor 提供了帶有 "),o("code",null,"-jvm"),r(" 等字尾的平台特定構件 (artifacts)，例如 "),o("code",null,"ktor-server-core-jvm"),r(" 或 "),o("code",null,"ktor-server-netty-jvm"),r("。 請注意，Gradle 會解析適合指定平台的構件，而 Maven 不支援此功能。 這表示對於 Maven，您需要手動新增平台特定字尾。 基本 Ktor 應用程式的 "),o("code",null,"dependencies"),r(" 區塊可能如下所示： ")],-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                        dependencies {
                            implementation("io.ktor:ktor-server-core:3.2.3")
                            implementation("io.ktor:ktor-server-netty:3.2.3")
                        }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                        dependencies {
                            implementation "io.ktor:ktor-server-core:3.2.3"
                            implementation "io.ktor:ktor-server-netty:3.2.3"
                        }`})]),_:1}),t(i,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`                        <dependencies>
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
                        </dependencies>`})]),_:1})]),_:1})]),_:1}),t(s,{title:"記錄依賴項",id:"logging-dependency"},{default:n(()=>e[20]||(e[20]=[o("p",null,[r(" Ktor 使用 SLF4J API 作為各種記錄框架（例如 Logback 或 Log4j）的門面 (facade)，並允許您記錄應用程式事件。 若要了解如何新增所需的構件，請參閱"),o("a",{href:"./server-logging#add_dependencies"},"新增記錄器依賴項"),r("。 ")],-1)])),_:1}),t(s,{title:"插件依賴項",id:"plugin-dependencies"},{default:n(()=>[o("p",null,[e[22]||(e[22]=r(" 擴展 Ktor 功能的")),t(d,{href:"/ktor/server-plugins",summary:"插件提供常見功能，例如序列化、內容編碼、壓縮等等。"},{default:n(()=>e[21]||(e[21]=[r("插件")])),_:1}),e[23]||(e[23]=r("可能需要額外的依賴項。 您可以從相應的主題中了解更多資訊。 "))])]),_:1})]),_:1}),t(s,{title:"確保 Ktor 版本一致性",id:"ensure-version-consistency"},{default:n(()=>[t(s,{id:"using-gradle-plugin",title:"使用 Ktor Gradle 插件"},{default:n(()=>[e[24]||(e[24]=o("p",null,[r(" 套用 "),o("a",{href:"https://github.com/ktorio/ktor-build-plugins"},"Ktor Gradle 插件"),r(" 會隱式新增 Ktor BOM 依賴項，並讓您確保所有 Ktor 依賴項都處於 相同版本。在這種情況下，您在依賴 Ktor 構件時不再需要指定版本： ")],-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                        plugins {
                            // ...
                            id("io.ktor.plugin") version "3.2.3"
                        }
                        dependencies {
                            implementation("io.ktor:ktor-server-core")
                            // ...
                        }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                        plugins {
                            // ...
                            id "io.ktor.plugin" version "3.2.3"
                        }
                        dependencies {
                            implementation "io.ktor:ktor-server-core"
                            // ...
                        }`})]),_:1})]),_:1})]),_:1}),t(s,{id:"using-version-catalog",title:"使用已發佈的版本目錄"},{default:n(()=>[e[32]||(e[32]=o("p",null," 您也可以透過使用已發佈的版本目錄來集中管理 Ktor 依賴項聲明。 這種方法提供以下好處： ",-1)),t(u,{id:"published-version-catalog-benefits"},{default:n(()=>e[25]||(e[25]=[o("li",null," 無需在您自己的目錄中手動聲明 Ktor 版本。 ",-1),o("li",null," 將每個 Ktor 模組公開在單一命名空間下。 ",-1)])),_:1}),o("p",null,[e[27]||(e[27]=r(" 若要聲明此目錄，請在 ")),t(g,null,{default:n(()=>e[26]||(e[26]=[r("settings.gradle.kts")])),_:1}),e[28]||(e[28]=r(" 中建立一個您選擇名稱的版本目錄： "))]),t(l,{lang:"kotlin",code:`                dependencyResolutionManagement {
                    versionCatalogs {
                        create("ktorLibs") {
                            from("io.ktor:ktor-version-catalog:3.2.3")
                        }
                    }
                }`}),o("p",null,[e[30]||(e[30]=r(" 然後，您可以透過引用目錄名稱，在模組的 ")),t(g,null,{default:n(()=>e[29]||(e[29]=[r("build.gradle.kts")])),_:1}),e[31]||(e[31]=r(" 中新增依賴項： "))]),t(l,{lang:"kotlin",code:`                dependencies {
                    implementation(ktorLibs.server.core)
                    // ...
                }`})]),_:1})]),_:1}),t(s,{title:"建立應用程式執行入口點",id:"create-entry-point"},{default:n(()=>[o("p",null,[e[35]||(e[35]=r(" 使用 Gradle/Maven ")),t(d,{href:"/ktor/server-run",summary:"了解如何執行伺服器 Ktor 應用程式。"},{default:n(()=>e[33]||(e[33]=[r("執行")])),_:1}),e[36]||(e[36]=r(" Ktor 伺服器取決於")),t(d,{href:"/ktor/server-create-and-configure",summary:"了解如何根據您的應用程式部署需求建立伺服器。"},{default:n(()=>e[34]||(e[34]=[r("建立伺服器")])),_:1}),e[37]||(e[37]=r("的方式。 您可以透過以下方式之一指定應用程式主類別： "))]),t(u,null,{default:n(()=>[o("li",null,[e[38]||(e[38]=o("p",null,[r(" 如果您使用 "),o("a",{href:"#embedded-server"},"embeddedServer"),r("，請如此指定主類別： ")],-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                            application {
                                mainClass.set("com.example.ApplicationKt")
                            }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                            application {
                                mainClass = "com.example.ApplicationKt"
                            }`})]),_:1}),t(i,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`                            <properties>
                                <main.class>com.example.ApplicationKt</main.class>
                            </properties>`})]),_:1})]),_:1})]),o("li",null,[e[39]||(e[39]=o("p",null,[r(" 如果您使用 "),o("a",{href:"#engine-main"},"EngineMain"),r("，則需要將其配置為主類別。 對於 Netty，它將如下所示： ")],-1)),t(p,{group:"languages"},{default:n(()=>[t(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:`                            application {
                                mainClass.set("io.ktor.server.netty.EngineMain")
                            }`})]),_:1}),t(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:`                            application {
                                mainClass = "io.ktor.server.netty.EngineMain"
                            }`})]),_:1}),t(i,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`                            <properties>
                                <main.class>io.ktor.server.netty.EngineMain</main.class>
                            </properties>`})]),_:1})]),_:1})])]),_:1}),t(v,null,{default:n(()=>[e[42]||(e[42]=o("p",null," 如果您打算將應用程式打包為 Fat JAR，則在配置相應插件時，還需要考慮建立伺服器的方式。 從以下主題了解更多資訊： ",-1)),t(u,null,{default:n(()=>[o("li",null,[o("p",null,[t(d,{href:"/ktor/server-fatjar",summary:"了解如何使用 Ktor Gradle 插件建立並執行可執行 Fat JAR。"},{default:n(()=>e[40]||(e[40]=[r("使用 Ktor Gradle 插件建立 Fat JAR")])),_:1})])]),o("li",null,[o("p",null,[t(d,{href:"/ktor/maven-assembly-plugin",summary:"範例專案：tutorial-server-get-started-maven"},{default:n(()=>e[41]||(e[41]=[r("使用 Maven Assembly 插件建立 Fat JAR")])),_:1})])])]),_:1})]),_:1})]),_:1})]),_:1})])}const E=K(M,[["render",j]]);export{P as __pageData,E as default};
