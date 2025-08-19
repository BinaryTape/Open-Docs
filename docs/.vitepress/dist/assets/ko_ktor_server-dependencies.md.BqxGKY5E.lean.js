import{_ as K,C as a,c as G,o as b,G as n,w as t,j as o,a as l}from"./chunks/framework.Bksy39di.js";const I=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-dependencies.md","filePath":"ko/ktor/server-dependencies.md","lastUpdated":1755457140000}'),M={name:"ko/ktor/server-dependencies.md"};function j(L,e,x,_,A,C){const k=a("show-structure"),f=a("link-summary"),m=a("control"),r=a("code-block"),i=a("tab"),g=a("Path"),v=a("note"),p=a("tabs"),u=a("list"),s=a("chapter"),d=a("Links"),y=a("topic");return b(),G("div",null,[n(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"서버 종속성 추가",id:"server-dependencies","help-id":"Gradle"},{default:t(()=>[n(k,{for:"chapter",depth:"2"}),n(f,null,{default:t(()=>e[0]||(e[0]=[l("기존 Gradle/Maven 프로젝트에 Ktor 서버 종속성을 추가하는 방법을 알아봅니다.")])),_:1}),e[40]||(e[40]=o("p",null," 이 토픽에서는 기존 Gradle/Maven 프로젝트에 Ktor 서버에 필요한 종속성을 추가하는 방법을 보여드립니다. ",-1)),n(s,{title:"저장소 구성",id:"repositories"},{default:t(()=>[e[11]||(e[11]=o("p",null," Ktor 종속성을 추가하기 전에 이 프로젝트의 저장소를 구성해야 합니다: ",-1)),n(u,null,{default:t(()=>[o("li",null,[o("p",null,[n(m,null,{default:t(()=>e[1]||(e[1]=[l("프로덕션")])),_:1})]),e[7]||(e[7]=o("p",null," Ktor의 프로덕션 릴리스는 Maven 중앙 저장소에서 사용할 수 있습니다. 이 저장소는 빌드 스크립트에서 다음과 같이 선언할 수 있습니다: ",-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            repositories {
                                mavenCentral()
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            repositories {
                                mavenCentral()
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(v,null,{default:t(()=>[o("p",null,[e[3]||(e[3]=l(" 프로젝트가 ")),e[4]||(e[4]=o("a",{href:"https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom"},"Super POM",-1)),e[5]||(e[5]=l("에서 중앙 저장소를 상속하므로 ")),n(g,null,{default:t(()=>e[2]||(e[2]=[l("pom.xml")])),_:1}),e[6]||(e[6]=l(" 파일에 Maven 중앙 저장소를 추가할 필요가 없습니다. "))])]),_:1})]),_:1})]),_:1})]),o("li",null,[o("p",null,[n(m,null,{default:t(()=>e[8]||(e[8]=[l("얼리 액세스 프로그램 (EAP)")])),_:1})]),e[9]||(e[9]=o("p",null,[l(" Ktor의 "),o("a",{href:"https://ktor.io/eap/"},"EAP"),l(" 버전에 액세스하려면 "),o("a",{href:"https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/"},"Space 저장소"),l("를 참조해야 합니다: ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            repositories {
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
                            </repositories>`})]),_:1})]),_:1}),e[10]||(e[10]=o("p",null,[l(" Ktor EAP는 "),o("a",{href:"https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"},"Kotlin 개발 저장소"),l("를 필요로 할 수 있습니다: ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            repositories {
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
                            </repositories>`})]),_:1})]),_:1})])]),_:1})]),_:1}),n(s,{title:"종속성 추가",id:"add-ktor-dependencies"},{default:t(()=>[n(s,{title:"코어 종속성",id:"core-dependencies"},{default:t(()=>[e[17]||(e[17]=o("p",null," 모든 Ktor 애플리케이션은 최소한 다음 종속성을 필요로 합니다: ",-1)),n(u,null,{default:t(()=>[e[16]||(e[16]=o("li",null,[o("p",null,[o("code",null,"ktor-server-core"),l(": Ktor의 핵심 기능을 포함합니다. ")])],-1)),o("li",null,[o("p",null,[n(d,{href:"/ktor/server-engines",summary:"네트워크 요청을 처리하는 엔진에 대해 알아봅니다."},{default:t(()=>e[12]||(e[12]=[l("엔진")])),_:1}),e[13]||(e[13]=l("에 대한 종속성 (예: ")),e[14]||(e[14]=o("code",null,"ktor-server-netty",-1)),e[15]||(e[15]=l("). "))])])]),_:1}),e[18]||(e[18]=o("p",null,[l(" 다양한 플랫폼을 위해 Ktor는 "),o("code",null,"-jvm"),l("과 같은 접미사가 붙은 플랫폼별 아티팩트를 제공합니다 (예: "),o("code",null,"ktor-server-core-jvm"),l(" 또는 "),o("code",null,"ktor-server-netty-jvm"),l("). Gradle은 주어진 플랫폼에 적합한 아티팩트를 자동으로 해결하지만 Maven은 이 기능을 지원하지 않습니다. 이는 Maven의 경우 플랫폼별 접미사를 수동으로 추가해야 함을 의미합니다. 기본적인 Ktor 애플리케이션의 "),o("code",null,"dependencies"),l(" 블록은 다음과 같을 수 있습니다: ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                        dependencies {
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
                        </dependencies>`})]),_:1})]),_:1})]),_:1}),n(s,{title:"로깅 종속성",id:"logging-dependency"},{default:t(()=>e[19]||(e[19]=[o("p",null,[l(" Ktor는 다양한 로깅 프레임워크(예: Logback 또는 Log4j)의 퍼사드(facade)로 SLF4J API를 사용하며 애플리케이션 이벤트를 로깅할 수 있도록 합니다. 필요한 아티팩트를 추가하는 방법을 알아보려면 "),o("a",{href:"./server-logging#add_dependencies"},"로거 종속성 추가"),l("를 참조하세요. ")],-1)])),_:1}),n(s,{title:"플러그인 종속성",id:"plugin-dependencies"},{default:t(()=>[o("p",null,[n(d,{href:"/ktor/server-plugins",summary:"플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 공통 기능을 제공합니다."},{default:t(()=>e[20]||(e[20]=[l("플러그인")])),_:1}),e[21]||(e[21]=l("은 Ktor 기능을 확장하며 추가 종속성을 필요로 할 수 있습니다. 해당 토픽에서 더 자세히 알아볼 수 있습니다. "))])]),_:1})]),_:1}),n(s,{title:"Ktor 버전 일관성 보장",id:"ensure-version-consistency"},{default:t(()=>[n(s,{id:"using-gradle-plugin",title:"Ktor Gradle 플러그인 사용"},{default:t(()=>[e[22]||(e[22]=o("p",null,[o("a",{href:"https://github.com/ktorio/ktor-build-plugins"},"Ktor Gradle 플러그인"),l("을 적용하면 Ktor BOM 종속성이 암시적으로 추가되어 모든 Ktor 종속성이 동일한 버전을 사용하도록 보장할 수 있습니다. 이 경우 Ktor 아티팩트에 종속될 때 버전을 지정할 필요가 없습니다: ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                        plugins {
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
                        }`})]),_:1})]),_:1})]),_:1}),n(s,{id:"using-version-catalog",title:"게시된 버전 카탈로그 사용"},{default:t(()=>[e[30]||(e[30]=o("p",null," 게시된 버전 카탈로그를 사용하여 Ktor 종속성 선언을 중앙 집중화할 수도 있습니다. 이 접근 방식은 다음과 같은 이점을 제공합니다: ",-1)),n(u,{id:"published-version-catalog-benefits"},{default:t(()=>e[23]||(e[23]=[o("li",null," 자체 카탈로그에서 Ktor 버전을 수동으로 선언할 필요가 없습니다. ",-1),o("li",null," 모든 Ktor 모듈을 단일 네임스페이스 아래에 노출합니다. ",-1)])),_:1}),o("p",null,[e[25]||(e[25]=l(" 카탈로그를 선언하려면 ")),n(g,null,{default:t(()=>e[24]||(e[24]=[l("settings.gradle.kts")])),_:1}),e[26]||(e[26]=l("에서 원하는 이름으로 버전 카탈로그를 생성하세요: "))]),n(r,{lang:"kotlin",code:`                dependencyResolutionManagement {
                    versionCatalogs {
                        create("ktorLibs") {
                            from("io.ktor:ktor-version-catalog:3.2.3")
                        }
                    }
                }`}),o("p",null,[e[28]||(e[28]=l(" 그런 다음 모듈의 ")),n(g,null,{default:t(()=>e[27]||(e[27]=[l("build.gradle.kts")])),_:1}),e[29]||(e[29]=l("에 카탈로그 이름을 참조하여 종속성을 추가할 수 있습니다: "))]),n(r,{lang:"kotlin",code:`                dependencies {
                    implementation(ktorLibs.server.core)
                    // ...
                }`})]),_:1})]),_:1}),n(s,{title:"애플리케이션 실행을 위한 진입점 생성",id:"create-entry-point"},{default:t(()=>[o("p",null,[n(d,{href:"/ktor/server-run",summary:"서버 Ktor 애플리케이션을 실행하는 방법을 알아봅니다."},{default:t(()=>e[31]||(e[31]=[l("Ktor 서버를 Gradle/Maven을 사용하여 실행하는 것")])),_:1}),e[33]||(e[33]=l("은 ")),n(d,{href:"/ktor/server-create-and-configure",summary:"애플리케이션 배포 요구 사항에 따라 서버를 생성하는 방법을 알아봅니다."},{default:t(()=>e[32]||(e[32]=[l("서버를 생성하는")])),_:1}),e[34]||(e[34]=l(" 방식에 따라 달라집니다. 애플리케이션의 메인 클래스를 다음 방법 중 하나로 지정할 수 있습니다: "))]),n(u,null,{default:t(()=>[o("li",null,[e[35]||(e[35]=o("p",null,[o("a",{href:"#embedded-server"},"embeddedServer"),l("를 사용하는 경우 메인 클래스를 다음과 같이 지정합니다: ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            application {
                                mainClass.set("com.example.ApplicationKt")
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            application {
                                mainClass = "com.example.ApplicationKt"
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                            <properties>
                                <main.class>com.example.ApplicationKt</main.class>
                            </properties>`})]),_:1})]),_:1})]),o("li",null,[e[36]||(e[36]=o("p",null,[o("a",{href:"#engine-main"},"EngineMain"),l("을 사용하는 경우 이를 메인 클래스로 구성해야 합니다. Netty의 경우 다음과 같이 보일 것입니다: ")],-1)),n(p,{group:"languages"},{default:t(()=>[n(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(r,{lang:"Kotlin",code:`                            application {
                                mainClass.set("io.ktor.server.netty.EngineMain")
                            }`})]),_:1}),n(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(r,{lang:"Groovy",code:`                            application {
                                mainClass = "io.ktor.server.netty.EngineMain"
                            }`})]),_:1}),n(i,{title:"Maven","group-key":"maven"},{default:t(()=>[n(r,{lang:"XML",code:`                            <properties>
                                <main.class>io.ktor.server.netty.EngineMain</main.class>
                            </properties>`})]),_:1})]),_:1})])]),_:1}),n(v,null,{default:t(()=>[e[39]||(e[39]=o("p",null," 애플리케이션을 Fat JAR로 패키징할 경우, 해당 플러그인을 구성할 때 서버를 생성하는 방식도 고려해야 합니다. 다음 토픽에서 더 자세히 알아보세요: ",-1)),n(u,null,{default:t(()=>[o("li",null,[o("p",null,[n(d,{href:"/ktor/server-fatjar",summary:"Ktor Gradle 플러그인을 사용하여 실행 가능한 Fat JAR를 생성하고 실행하는 방법을 알아봅니다."},{default:t(()=>e[37]||(e[37]=[l("Ktor Gradle 플러그인을 사용하여 Fat JAR 생성하기")])),_:1})])]),o("li",null,[o("p",null,[n(d,{href:"/ktor/maven-assembly-plugin",summary:"샘플 프로젝트: tutorial-server-get-started-maven"},{default:t(()=>e[38]||(e[38]=[l("Maven Assembly 플러그인을 사용하여 Fat JAR 생성하기")])),_:1})])])]),_:1})]),_:1})]),_:1})]),_:1})])}const P=K(M,[["render",j]]);export{I as __pageData,P as default};
