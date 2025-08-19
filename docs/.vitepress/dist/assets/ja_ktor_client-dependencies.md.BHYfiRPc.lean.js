import{_ as E,C as l,c as y,o as m,j as t,G as i,ag as r,a as o,w as n}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"クライアントの依存関係を追加する","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/client-dependencies.md","filePath":"ja/ktor/client-dependencies.md","lastUpdated":1755457140000}'),v={name:"ja/ktor/client-dependencies.md"};function _(f,e,b,F,q,A){const h=l("show-structure"),c=l("link-summary"),d=l("control"),s=l("code-block"),a=l("TabItem"),g=l("note"),p=l("Tabs"),k=l("list"),u=l("chapter");return m(),y("div",null,[e[10]||(e[10]=t("h1",{id:"クライアントの依存関係を追加する",tabindex:"-1"},[o("クライアントの依存関係を追加する "),t("a",{class:"header-anchor",href:"#クライアントの依存関係を追加する","aria-label":'Permalink to "クライアントの依存関係を追加する"'},"​")],-1)),i(h,{for:"chapter",depth:"2"}),i(c,null,{default:n(()=>e[0]||(e[0]=[o("既存プロジェクトにクライアントの依存関係を追加する方法を学びます。")])),_:1}),e[11]||(e[11]=r("",3)),i(k,null,{default:n(()=>[t("li",null,[t("p",null,[i(d,null,{default:n(()=>e[1]||(e[1]=[o("本番環境")])),_:1})]),e[3]||(e[3]=t("p",null," Ktor の本番リリースは Maven セントラルリポジトリで入手できます。 このリポジトリは、ビルドスクリプトで次のように宣言できます。 ",-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
                        mavenCentral()
                    }`})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:`                    repositories {
                        mavenCentral()
                    }`})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(g,null,{default:n(()=>e[2]||(e[2]=[t("p",null,[o(" プロジェクトが "),t("a",{href:"https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom"},"Super POM"),o(" からセントラルリポジトリを継承しているため、"),t("path",null,"pom.xml"),o(" ファイルに Maven セントラルリポジトリを追加する必要はありません。 ")],-1)])),_:1})]),_:1})]),_:1})]),t("li",null,[t("p",null,[i(d,null,{default:n(()=>e[4]||(e[4]=[o("早期アクセスプログラム (EAP)")])),_:1})]),e[5]||(e[5]=t("p",null,[o(" Ktor の "),t("a",{href:"https://ktor.io/eap/"},"EAP"),o(" バージョンにアクセスするには、"),t("a",{href:"https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/"},"Space リポジトリ"),o("を参照する必要があります。 ")],-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
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
                    </repositories>`})]),_:1})]),_:1}),e[6]||(e[6]=t("p",null,[o(" Ktor の EAP は、"),t("a",{href:"https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev"},"Kotlin dev リポジトリ"),o("を必要とする場合があることに注意してください。 ")],-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:`                    repositories {
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
              </dependency>`})]),_:1})]),_:1}),e[15]||(e[15]=r("",5)),i(u,{title:"Ktor BOM 依存関係の使用"},{default:n(()=>[e[7]||(e[7]=t("p",null,"Ktor BOM を使用すると、各依存関係のバージョンを個別に指定することなく、すべての Ktor モジュールが同じ一貫したバージョンを使用していることを保証できます。",-1)),e[8]||(e[8]=t("p",null,"Ktor BOM 依存関係を追加するには、ビルドスクリプトで次のように宣言します。",-1)),i(p,{group:"languages"},{default:n(()=>[i(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(s,{lang:"Kotlin",code:'            implementation(platform("io.ktor:ktor-bom:$ktor_version"))'})]),_:1}),i(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(s,{lang:"Groovy",code:'            implementation platform "io.ktor:ktor-bom:$ktor_version"'})]),_:1}),i(a,{title:"Maven","group-key":"maven"},{default:n(()=>[i(s,{lang:"XML",code:`            <dependencyManagement>
              <dependencies>
                  <dependency>
                      <groupId>io.ktor</groupId>
                      <artifactId>ktor-bom</artifactId>
                      <version>3.2.3</version>
                      <type>pom</type>
                      <scope>import</scope>
                  </dependency>
              </dependencies>
          </dependencyManagement>`})]),_:1})]),_:1})]),_:1}),e[16]||(e[16]=t("p",null," 公開されたバージョンカタログを使用することで、Ktor の依存関係宣言を一元化することもできます。 このアプローチには、以下の利点があります。 ",-1)),i(k,{id:"published-version-catalog-benefits"},{default:n(()=>e[9]||(e[9]=[t("li",null," 独自のカタログで Ktor のバージョンを手動で宣言する必要がなくなります。 ",-1),t("li",null," すべての Ktor モジュールを単一のネームスペースの下で公開します。 ",-1)])),_:1}),e[17]||(e[17]=t("p",null,[o(" カタログを宣言するには、 "),t("path",null,"settings.gradle.kts"),o(" で選択した名前でバージョンカタログを作成します。 ")],-1)),i(s,{lang:"kotlin",code:`    dependencyResolutionManagement {
        versionCatalogs {
            create("ktorLibs") {
                from("io.ktor:ktor-version-catalog:3.2.3")
            }
        }
    }`}),e[18]||(e[18]=t("p",null,[o(" その後、モジュールの "),t("path",null,"build.gradle.kts"),o(" でカタログ名を参照して依存関係を追加できます。 ")],-1)),i(s,{lang:"kotlin",code:`    dependencies {
        implementation(ktorLibs.client.core)
        // ...
    }`})])}const T=E(v,[["render",_]]);export{K as __pageData,T as default};
