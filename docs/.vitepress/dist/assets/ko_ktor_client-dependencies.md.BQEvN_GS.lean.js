import{_ as E,C as l,c as y,o as m,j as t,G as i,ag as r,a as o,w as n}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"클라이언트 종속성 추가","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/client-dependencies.md","filePath":"ko/ktor/client-dependencies.md","lastUpdated":1755457140000}'),v={name:"ko/ktor/client-dependencies.md"};function _(f,e,b,F,q,A){const h=l("show-structure"),c=l("link-summary"),d=l("control"),s=l("code-block"),a=l("TabItem"),g=l("note"),p=l("Tabs"),k=l("list"),u=l("chapter");return m(),y("div",null,[e[10]||(e[10]=t("h1",{id:"클라이언트-종속성-추가",tabindex:"-1"},[o("클라이언트 종속성 추가 "),t("a",{class:"header-anchor",href:"#클라이언트-종속성-추가","aria-label":'Permalink to "클라이언트 종속성 추가"'},"​")],-1)),i(h,{for:"chapter",depth:"2"}),i(c,null,{default:n(()=>e[0]||(e[0]=[o("기존 프로젝트에 클라이언트 종속성을 추가하는 방법을 알아봅니다.")])),_:1}),e[11]||(e[11]=r("",3)),i(k,null,{default:n(()=>[t("li",null,[t("p",null,[i(d,null,{default:n(()=>e[1]||(e[1]=[o("프로덕션")])),_:1})]),e[3]||(e[3]=t("p",null," Ktor의 프로덕션 릴리스는 Maven 중앙 레포지토리에서 사용할 수 있습니다. 빌드 스크립트에서 이 레포지토리를 다음과 같이 선언할 수 있습니다. ",-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
                        mavenCentral()
                    }`})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:`                    repositories {
                        mavenCentral()
                    }`})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(g,null,{default:n(()=>e[2]||(e[2]=[t("p",null,[o(" 프로젝트는 "),t("a",{href:"https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom"},"Super POM"),o("으로부터 중앙 레포지토리를 상속하므로 "),t("path",null,"pom.xml"),o(" 파일에 Maven 중앙 레포지토리를 추가할 필요가 없습니다. ")],-1)])),_:1})]),_:1})]),_:1})]),t("li",null,[t("p",null,[i(d,null,{default:n(()=>e[4]||(e[4]=[o("얼리 액세스 프로그램 (EAP)")])),_:1})]),e[5]||(e[5]=t("p",null,[o(" Ktor의 "),t("a",{href:"https://ktor.io/eap/"},"EAP"),o(" 버전에 액세스하려면 "),t("a",{href:"https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/"},"Space 레포지토리"),o("를 참조해야 합니다. ")],-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
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
                    </repositories>`})]),_:1})]),_:1}),e[6]||(e[6]=t("p",null,[o(" Ktor EAP는 "),t("a",{href:"https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"},"Kotlin 개발 레포지토리"),o("를 요구할 수 있습니다. ")],-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
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
              </dependency>`})]),_:1})]),_:1}),e[15]||(e[15]=r("",5)),i(u,{title:"Ktor BOM 종속성 사용"},{default:n(()=>[e[7]||(e[7]=t("p",null,"Ktor BOM은 각 종속성에 대해 개별적으로 버전을 지정하지 않고도 모든 Ktor 모듈이 동일하고 일관된 버전을 사용하도록 보장합니다.",-1)),e[8]||(e[8]=t("p",null,"Ktor BOM 종속성을 추가하려면 빌드 스크립트에서 다음과 같이 선언합니다.",-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:'            implementation(platform("io.ktor:ktor-bom:$ktor_version"))'})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:'            implementation platform "io.ktor:ktor-bom:$ktor_version"'})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`            <dependencyManagement>
              <dependencies>
                  <dependency>
                      <groupId>io.ktor</groupId>
                      <artifactId>ktor-bom</artifactId>
                      <version>3.2.3</version>
                      <type>pom</type>
                      <scope>import</scope>
                  </dependency>
              </dependencies>
          </dependencyManagement>`})]),_:1})]),_:1})]),_:1}),e[16]||(e[16]=t("p",null," 게시된 버전 카탈로그를 사용하여 Ktor 종속성 선언을 중앙화할 수도 있습니다. 이 접근 방식은 다음과 같은 이점을 제공합니다. ",-1)),i(k,{id:"published-version-catalog-benefits"},{default:n(()=>e[9]||(e[9]=[t("li",null," 자체 카탈로그에 Ktor 버전을 수동으로 선언할 필요가 없어집니다. ",-1),t("li",null," 모든 Ktor 모듈을 단일 네임스페이스 아래에 노출합니다. ",-1)])),_:1}),e[17]||(e[17]=t("p",null,[o(" 카탈로그를 선언하려면, "),t("path",null,"settings.gradle.kts"),o("에서 선택한 이름으로 버전 카탈로그를 생성하십시오. ")],-1)),i(s,{lang:"kotlin",code:`    dependencyResolutionManagement {
        versionCatalogs {
            create("ktorLibs") {
                from("io.ktor:ktor-version-catalog:3.2.3")
            }
        }
    }`}),e[18]||(e[18]=t("p",null,[o(" 그런 다음, 모듈의 "),t("path",null,"build.gradle.kts"),o("에서 카탈로그 이름을 참조하여 종속성을 추가할 수 있습니다. ")],-1)),i(s,{lang:"kotlin",code:`    dependencies {
        implementation(ktorLibs.client.core)
        // ...
    }`})])}const T=E(v,[["render",_]]);export{K as __pageData,T as default};
