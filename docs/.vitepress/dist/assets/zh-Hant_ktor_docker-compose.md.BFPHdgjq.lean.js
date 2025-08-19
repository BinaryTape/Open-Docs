import{_ as D}from"./chunks/tutorial_server_db_integration_manual_test.DHfnfXew.js";import{_ as S,C as n,c as R,o as w,G as l,w as r,j as e,a as t}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/docker-compose.md","filePath":"zh-Hant/ktor/docker-compose.md","lastUpdated":1755457140000}'),y={name:"zh-Hant/ktor/docker-compose.md"},A={href:"#configure-docker"};function C(x,o,O,P,E,j){const f=n("show-structure"),m=n("control"),k=n("tldr"),u=n("Links"),s=n("Path"),i=n("code-block"),d=n("step"),g=n("procedure"),p=n("chapter"),a=n("list"),b=n("tip"),v=n("topic");return w(),R("div",null,[l(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"docker-compose",title:"Docker Compose"},{default:r(()=>[l(f,{for:"chapter",depth:"2"}),l(k,null,{default:r(()=>[e("p",null,[l(m,null,{default:r(()=>o[0]||(o[0]=[t("初始專案")])),_:1}),o[1]||(o[1]=t(" : ")),o[2]||(o[2]=e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-db-integration"},"tutorial-server-db-integration",-1))]),e("p",null,[l(m,null,{default:r(()=>o[3]||(o[3]=[t("最終專案")])),_:1}),o[4]||(o[4]=t(" : ")),o[5]||(o[5]=e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-docker-compose"},"tutorial-server-docker-compose",-1))])]),_:1}),e("p",null,[o[7]||(o[7]=t("在本主題中，我們將向您展示如何在 ")),o[8]||(o[8]=e("a",{href:"https://docs.docker.com/compose/"},"Docker Compose",-1)),o[9]||(o[9]=t(" 下執行 Ktor 伺服器應用程式。我們將使用在 ")),l(u,{href:"/ktor/server-integrate-database",summary:"了解使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫的過程。"},{default:r(()=>o[6]||(o[6]=[t("整合資料庫")])),_:1}),o[10]||(o[10]=t(" 教學課程中建立的專案，該專案使用 ")),o[11]||(o[11]=e("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed",-1)),o[12]||(o[12]=t(" 連接到 ")),o[13]||(o[13]=e("a",{href:"https://www.postgresql.org/docs/"},"PostgreSQL",-1)),o[14]||(o[14]=t(" 資料庫，其中資料庫和網頁應用程式是分開執行的。"))]),l(p,{title:"準備應用程式",id:"prepare-app"},{default:r(()=>[l(p,{title:"提取資料庫設定",id:"extract-db-settings"},{default:r(()=>[o[47]||(o[47]=e("p",null,[t(" 在 "),e("a",{href:"./server-integrate-database#config-db-connection"},"設定資料庫連接"),t(" 教學課程中建立的專案使用硬編碼屬性來建立資料庫連接。")],-1)),e("p",null,[o[16]||(o[16]=t(" 讓我們將 PostgreSQL 資料庫的連接設定提取到 ")),l(u,{href:"/ktor/server-configuration-file",summary:"了解如何在配置檔中設定各種伺服器參數。"},{default:r(()=>o[15]||(o[15]=[t("自訂配置群組")])),_:1}),o[17]||(o[17]=t("中。 "))]),l(g,null,{default:r(()=>[l(d,null,{default:r(()=>[e("p",null,[o[20]||(o[20]=t("在 ")),l(s,null,{default:r(()=>o[18]||(o[18]=[t("src/main/resources")])),_:1}),o[21]||(o[21]=t(" 中開啟 ")),l(s,null,{default:r(()=>o[19]||(o[19]=[t("application.yaml")])),_:1}),o[22]||(o[22]=t(" 檔案，並在 ")),o[23]||(o[23]=e("code",null,"ktor",-1)),o[24]||(o[24]=t(" 群組外部新增 ")),o[25]||(o[25]=e("code",null,"storage",-1)),o[26]||(o[26]=t(" 群組，如下所示： "))]),l(i,{lang:"yaml",code:`ktor:
  application:
    modules:
      - com.example.ApplicationKt.module
  deployment:
    port: 8080
storage:
  driverClassName: "org.postgresql.Driver"
  jdbcURL: "jdbc:postgresql://localhost:5432/ktor_tutorial_db"
  user: "postgres"
  password: "password"`}),e("p",null,[o[28]||(o[28]=t("這些設定稍後將在 ")),e("a",A,[l(s,null,{default:r(()=>o[27]||(o[27]=[t("compose.yml")])),_:1})]),o[29]||(o[29]=t(" 檔案中進行配置。 "))])]),_:1}),l(d,null,{default:r(()=>[e("p",null,[o[32]||(o[32]=t(" 在 ")),l(s,null,{default:r(()=>o[30]||(o[30]=[t("src/main/kotlin/com/example/plugins/")])),_:1}),o[33]||(o[33]=t(" 中開啟 ")),l(s,null,{default:r(()=>o[31]||(o[31]=[t("Databases.kt")])),_:1}),o[34]||(o[34]=t(" 檔案，並更新 ")),o[35]||(o[35]=e("code",null,"configureDatabases()",-1)),o[36]||(o[36]=t(" 函式 以從配置檔載入儲存設定： "))]),l(i,{lang:"kotlin",code:`fun Application.configureDatabases(config: ApplicationConfig) {
    val url = config.property("storage.jdbcURL").getString()
    val user = config.property("storage.user").getString()
    val password = config.property("storage.password").getString()

    Database.connect(
        url,
        user = user,
        password = password
    )
}`}),o[37]||(o[37]=e("p",null,[e("code",null,"configureDatabases()"),t(" 函式現在接受 "),e("code",null,"ApplicationConfig"),t(" 並 使用 "),e("code",null,"config.property"),t(" 載入自訂設定。 ")],-1))]),_:1}),l(d,null,{default:r(()=>[e("p",null,[o[40]||(o[40]=t(" 在 ")),l(s,null,{default:r(()=>o[38]||(o[38]=[t("src/main/kotlin/com/example/")])),_:1}),o[41]||(o[41]=t(" 中開啟 ")),l(s,null,{default:r(()=>o[39]||(o[39]=[t("Application.kt")])),_:1}),o[42]||(o[42]=t(" 檔案，並將 ")),o[43]||(o[43]=e("code",null,"environment.config",-1)),o[44]||(o[44]=t(" 傳遞給 ")),o[45]||(o[45]=e("code",null,"configureDatabases()",-1)),o[46]||(o[46]=t(" 以在應用程式啟動時載入連接設定： "))]),l(i,{lang:"kotlin",code:`fun Application.module() {
    val repository = PostgresTaskRepository()

    configureSerialization(repository)
    configureDatabases(environment.config)
    configureRouting()
}`})]),_:1})]),_:1})]),_:1}),l(p,{title:"配置 Ktor 插件",id:"configure-ktor-plugin"},{default:r(()=>[o[53]||(o[53]=e("p",null,"為了在 Docker 上執行，應用程式需要將所有必需的檔案部署到容器中。根據您使用的建置系統， 有不同的插件可以完成此操作：",-1)),l(a,null,{default:r(()=>[e("li",null,[l(u,{href:"/ktor/server-fatjar",summary:"了解如何使用 Ktor Gradle 插件建立和執行可執行 fat JAR。"},{default:r(()=>o[48]||(o[48]=[t("使用 Ktor Gradle 插件建立 fat JAR")])),_:1})]),e("li",null,[l(u,{href:"/ktor/maven-assembly-plugin",summary:"範例專案：tutorial-server-get-started-maven"},{default:r(()=>o[49]||(o[49]=[t("使用 Maven Assembly 插件建立 fat JAR")])),_:1})])]),_:1}),e("p",null,[o[51]||(o[51]=t("在我們的範例中，Ktor 插件已在 ")),l(s,null,{default:r(()=>o[50]||(o[50]=[t("build.gradle.kts")])),_:1}),o[52]||(o[52]=t(" 檔案中應用。 "))]),l(i,{lang:"kotlin",code:`plugins {
    application
    kotlin("jvm")
    id("io.ktor.plugin") version "3.2.3"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.20"
}`})]),_:1})]),_:1}),l(p,{title:"配置 Docker",id:"configure-docker"},{default:r(()=>[l(p,{title:"準備 Docker 映像",id:"prepare-docker-image"},{default:r(()=>[e("p",null,[o[55]||(o[55]=t(" 要將應用程式 Docker 化，請在專案的根目錄中建立一個新的 ")),l(s,null,{default:r(()=>o[54]||(o[54]=[t("Dockerfile")])),_:1}),o[56]||(o[56]=t(" 並插入以下內容： "))]),l(i,{lang:"Docker",code:`# Stage 1: Cache Gradle dependencies
FROM gradle:latest AS cache
RUN mkdir -p /home/gradle/cache_home
ENV GRADLE_USER_HOME=/home/gradle/cache_home
COPY build.gradle.* gradle.properties /home/gradle/app/
COPY gradle /home/gradle/app/gradle
WORKDIR /home/gradle/app
RUN gradle clean build -i --stacktrace

# Stage 2: Build Application
FROM gradle:latest AS build
COPY --from=cache /home/gradle/cache_home /home/gradle/.gradle
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
# Build the fat JAR, Gradle also supports shadow
# and boot JAR by default.
RUN gradle buildFatJar --no-daemon

# Stage 3: Create the Runtime Image
FROM amazoncorretto:22 AS runtime
EXPOSE 8080
RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/ktor-docker-sample.jar
ENTRYPOINT ["java","-jar","/app/ktor-docker-sample.jar"]`}),l(b,null,{default:r(()=>o[57]||(o[57]=[t(" 有關此多階段建置如何運作的更多資訊，請參閱 "),e("a",{href:"./docker#prepare-docker"},"準備 Docker 映像",-1),t("。 ")])),_:1}),o[59]||(o[59]=e("p",null," 此範例使用 Amazon Corretto Docker 映像，但您可以將其替換為任何其他合適的替代方案，例如以下內容： ",-1)),l(a,null,{default:r(()=>o[58]||(o[58]=[e("li",null,[e("a",{href:"https://hub.docker.com/_/eclipse-temurin"},"Eclipse Temurin")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/ibm-semeru-runtimes"},"IBM Semeru")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/ibmjava"},"IBM Java")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/sapmachine"},"SAP Machine JDK")],-1)])),_:1})]),_:1}),l(p,{title:"配置 Docker Compose",id:"configure-docker-compose"},{default:r(()=>[e("p",null,[o[61]||(o[61]=t("在專案的根目錄中，建立一個新的 ")),l(s,null,{default:r(()=>o[60]||(o[60]=[t("compose.yml")])),_:1}),o[62]||(o[62]=t(" 檔案並新增以下內容： "))]),l(i,{lang:"yaml",code:`services:
  web:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres
    volumes:
      - ./tmp/db:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ktor_tutorial_db
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 1s`}),l(a,null,{default:r(()=>o[63]||(o[63]=[e("li",null,[e("code",null,"web"),t(" 服務用於執行封裝在 "),e("a",{href:"#prepare-docker-image"},"映像"),t("中的 Ktor 應用程式。 ")],-1),e("li",null,[e("code",null,"db"),t(" 服務使用 "),e("code",null,"postgres"),t(" 映像來建立 "),e("code",null,"ktor_tutorial_db"),t(" 資料庫以儲存任務。 ")],-1)])),_:1})]),_:1})]),_:1}),l(p,{title:"建置並執行服務",id:"build-run"},{default:r(()=>[l(g,null,{default:r(()=>[l(d,null,{default:r(()=>[o[64]||(o[64]=e("p",null,[t(" 執行以下命令以建立包含您的 Ktor 應用程式的 "),e("a",{href:"#configure-ktor-plugin"},"fat JAR"),t("： ")],-1)),l(i,{lang:"Bash",code:"                    ./gradlew :tutorial-server-docker-compose:buildFatJar"})]),_:1}),l(d,null,{default:r(()=>[o[65]||(o[65]=e("p",null,[t(" 使用 "),e("code",null,"docker compose up"),t(" 命令建置映像並啟動容器： ")],-1)),l(i,{lang:"Bash",code:"                    docker compose --project-directory snippets/tutorial-server-docker-compose up"})]),_:1}),l(d,null,{default:r(()=>o[66]||(o[66]=[t(" 等待 Docker Compose 完成映像的建置。 ")])),_:1}),l(d,null,{default:r(()=>o[67]||(o[67]=[e("p",null,[t(" 導航至 "),e("a",{href:"http://localhost:8080/static/index.html"},[e("a",{href:"http://localhost:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://localhost:8080/static/index.html")]),t(" 以開啟網頁應用程式。您應該會看到「任務管理器客戶端」頁面，顯示三個用於篩選和新增任務的表單，以及一個任務表格。 ")],-1),e("img",{src:D,alt:"一個顯示任務管理器客戶端的瀏覽器視窗","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1})]),_:1})])}const L=S(y,[["render",C]]);export{K as __pageData,L as default};
