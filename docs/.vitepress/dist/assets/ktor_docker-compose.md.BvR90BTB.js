import{_ as D}from"./chunks/tutorial_server_db_integration_manual_test.DHfnfXew.js";import{_ as S,C as n,c as R,o as w,G as l,w as r,j as e,a as t}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/docker-compose.md","filePath":"ktor/docker-compose.md","lastUpdated":1755457140000}'),y={name:"ktor/docker-compose.md"},A={href:"#configure-docker"};function C(x,o,O,P,E,j){const f=n("show-structure"),m=n("control"),k=n("tldr"),u=n("Links"),s=n("Path"),i=n("code-block"),d=n("step"),g=n("procedure"),p=n("chapter"),a=n("list"),b=n("tip"),v=n("topic");return w(),R("div",null,[l(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"docker-compose",title:"Docker Compose"},{default:r(()=>[l(f,{for:"chapter",depth:"2"}),l(k,null,{default:r(()=>[e("p",null,[l(m,null,{default:r(()=>o[0]||(o[0]=[t("初始项目")])),_:1}),o[1]||(o[1]=t(" : ")),o[2]||(o[2]=e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-db-integration"},"tutorial-server-db-integration",-1))]),e("p",null,[l(m,null,{default:r(()=>o[3]||(o[3]=[t("最终项目")])),_:1}),o[4]||(o[4]=t(" : ")),o[5]||(o[5]=e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-docker-compose"},"tutorial-server-docker-compose",-1))])]),_:1}),e("p",null,[o[7]||(o[7]=t("在本主题中，我们将向你展示如何在 ")),o[8]||(o[8]=e("a",{href:"https://docs.docker.com/compose/"},"Docker Compose",-1)),o[9]||(o[9]=t(" 下运行 Ktor 服务器应用程序。我们将使用在 ")),l(u,{href:"/ktor/server-integrate-database",summary:"了解如何使用 Exposed SQL 库将 Ktor 服务连接到数据库仓库。"},{default:r(()=>o[6]||(o[6]=[t("集成数据库")])),_:1}),o[10]||(o[10]=t(" 教程中创建的 项目，该项目使用 ")),o[11]||(o[11]=e("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed",-1)),o[12]||(o[12]=t(" 连接到 ")),o[13]||(o[13]=e("a",{href:"https://www.postgresql.org/docs/"},"PostgreSQL",-1)),o[14]||(o[14]=t(" 数据库，其中数据库和 Web 应用程序是独立运行的。"))]),l(p,{title:"准备应用程序",id:"prepare-app"},{default:r(()=>[l(p,{title:"提取数据库设置",id:"extract-db-settings"},{default:r(()=>[o[47]||(o[47]=e("p",null,[t(" 在 "),e("a",{href:"./server-integrate-database#config-db-connection"},"配置数据库连接"),t(" 教程中创建的 项目使用硬编码属性来建立数据库连接。")],-1)),e("p",null,[o[16]||(o[16]=t(" 让我们将 PostgreSQL 数据库的连接设置提取到 ")),l(u,{href:"/ktor/server-configuration-file",summary:"了解如何通过配置文件配置各种服务器参数。"},{default:r(()=>o[15]||(o[15]=[t("自定义配置组")])),_:1}),o[17]||(o[17]=t(" 中。 "))]),l(g,null,{default:r(()=>[l(d,null,{default:r(()=>[e("p",null,[o[20]||(o[20]=t("打开位于 ")),l(s,null,{default:r(()=>o[18]||(o[18]=[t("src/main/resources")])),_:1}),o[21]||(o[21]=t(" 中的 ")),l(s,null,{default:r(()=>o[19]||(o[19]=[t("application.yaml")])),_:1}),o[22]||(o[22]=t(" 文件，并在 ")),o[23]||(o[23]=e("code",null,"ktor",-1)),o[24]||(o[24]=t(" 组之外添加 ")),o[25]||(o[25]=e("code",null,"storage",-1)),o[26]||(o[26]=t(" 组，如下所示： "))]),l(i,{lang:"yaml",code:`ktor:
  application:
    modules:
      - com.example.ApplicationKt.module
  deployment:
    port: 8080
storage:
  driverClassName: "org.postgresql.Driver"
  jdbcURL: "jdbc:postgresql://localhost:5432/ktor_tutorial_db"
  user: "postgres"
  password: "password"`}),e("p",null,[o[28]||(o[28]=t("这些设置稍后将在 ")),e("a",A,[l(s,null,{default:r(()=>o[27]||(o[27]=[t("compose.yml")])),_:1})]),o[29]||(o[29]=t(" 文件中配置。 "))])]),_:1}),l(d,null,{default:r(()=>[e("p",null,[o[32]||(o[32]=t(" 打开位于 ")),l(s,null,{default:r(()=>o[30]||(o[30]=[t("src/main/kotlin/com/example/plugins/")])),_:1}),o[33]||(o[33]=t(" 中的 ")),l(s,null,{default:r(()=>o[31]||(o[31]=[t("Databases.kt")])),_:1}),o[34]||(o[34]=t(" 文件，并更新 ")),o[35]||(o[35]=e("code",null,"configureDatabases()",-1)),o[36]||(o[36]=t(" 函数 以从配置文件加载存储设置： "))]),l(i,{lang:"kotlin",code:`fun Application.configureDatabases(config: ApplicationConfig) {
    val url = config.property("storage.jdbcURL").getString()
    val user = config.property("storage.user").getString()
    val password = config.property("storage.password").getString()

    Database.connect(
        url,
        user = user,
        password = password
    )
}`}),o[37]||(o[37]=e("p",null,[e("code",null,"configureDatabases()"),t(" 函数现在接受 "),e("code",null,"ApplicationConfig"),t(" 并 使用 "),e("code",null,"config.property"),t(" 来加载自定义设置。 ")],-1))]),_:1}),l(d,null,{default:r(()=>[e("p",null,[o[40]||(o[40]=t(" 打开位于 ")),l(s,null,{default:r(()=>o[38]||(o[38]=[t("src/main/kotlin/com/example/")])),_:1}),o[41]||(o[41]=t(" 中的 ")),l(s,null,{default:r(()=>o[39]||(o[39]=[t("Application.kt")])),_:1}),o[42]||(o[42]=t(" 文件，并将 ")),o[43]||(o[43]=e("code",null,"environment.config",-1)),o[44]||(o[44]=t(" 传递给 ")),o[45]||(o[45]=e("code",null,"configureDatabases()",-1)),o[46]||(o[46]=t(" 以便在应用程序启动时加载连接设置： "))]),l(i,{lang:"kotlin",code:`fun Application.module() {
    val repository = PostgresTaskRepository()

    configureSerialization(repository)
    configureDatabases(environment.config)
    configureRouting()
}`})]),_:1})]),_:1})]),_:1}),l(p,{title:"配置 Ktor 插件",id:"configure-ktor-plugin"},{default:r(()=>[o[53]||(o[53]=e("p",null,"为了在 Docker 上运行，应用程序需要将所有必需的文件部署到 容器中。根据你使用的构建系统， 有不同的插件可以完成此操作：",-1)),l(a,null,{default:r(()=>[e("li",null,[l(u,{href:"/ktor/server-fatjar",summary:"了解如何使用 Ktor Gradle 插件创建和运行可执行的 fat JAR。"},{default:r(()=>o[48]||(o[48]=[t("使用 Ktor Gradle 插件创建 fat JARs")])),_:1})]),e("li",null,[l(u,{href:"/ktor/maven-assembly-plugin",summary:"示例项目：tutorial-server-get-started-maven"},{default:r(()=>o[49]||(o[49]=[t("使用 Maven Assembly 插件创建 fat JARs")])),_:1})])]),_:1}),e("p",null,[o[51]||(o[51]=t("在我们的示例中，Ktor 插件已在 ")),l(s,null,{default:r(()=>o[50]||(o[50]=[t("build.gradle.kts")])),_:1}),o[52]||(o[52]=t(" 文件中应用。 "))]),l(i,{lang:"kotlin",code:`plugins {
    application
    kotlin("jvm")
    id("io.ktor.plugin") version "3.2.3"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.20"
}`})]),_:1})]),_:1}),l(p,{title:"配置 Docker",id:"configure-docker"},{default:r(()=>[l(p,{title:"准备 Docker 镜像",id:"prepare-docker-image"},{default:r(()=>[e("p",null,[o[55]||(o[55]=t(" 要将应用程序 Docker 化，请在 项目的根目录中创建一个新的 ")),l(s,null,{default:r(()=>o[54]||(o[54]=[t("Dockerfile")])),_:1}),o[56]||(o[56]=t(" 文件并插入 以下内容： "))]),l(i,{lang:"Docker",code:`# Stage 1: Cache Gradle dependencies
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
ENTRYPOINT ["java","-jar","/app/ktor-docker-sample.jar"]`}),l(b,null,{default:r(()=>o[57]||(o[57]=[t(" 有关此多阶段构建如何工作的更多信息，请参阅 "),e("a",{href:"./docker#prepare-docker"},"准备 Docker 镜像",-1),t("。 ")])),_:1}),o[59]||(o[59]=e("p",null," 此示例使用 Amazon Corretto Docker 镜像，但你可以将其替换为任何其他合适的替代方案，例如： ",-1)),l(a,null,{default:r(()=>o[58]||(o[58]=[e("li",null,[e("a",{href:"https://hub.docker.com/_/eclipse-temurin"},"Eclipse Temurin")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/ibm-semeru-runtimes"},"IBM Semeru")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/ibmjava"},"IBM Java")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/sapmachine"},"SAP Machine JDK")],-1)])),_:1})]),_:1}),l(p,{title:"配置 Docker Compose",id:"configure-docker-compose"},{default:r(()=>[e("p",null,[o[61]||(o[61]=t("在 项目的根目录中，创建一个新的 ")),l(s,null,{default:r(()=>o[60]||(o[60]=[t("compose.yml")])),_:1}),o[62]||(o[62]=t(" 文件并添加以下内容： "))]),l(i,{lang:"yaml",code:`services:
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
      interval: 1s`}),l(a,null,{default:r(()=>o[63]||(o[63]=[e("li",null,[e("code",null,"web"),t(" 服务用于运行封装在 "),e("a",{href:"#prepare-docker-image"},"镜像"),t(" 中的 Ktor 应用程序。 ")],-1),e("li",null,[e("code",null,"db"),t(" 服务使用 "),e("code",null,"postgres"),t(" 镜像来创建 "),e("code",null,"ktor_tutorial_db"),t(" 数据库，用于存储任务。 ")],-1)])),_:1})]),_:1})]),_:1}),l(p,{title:"构建并运行服务",id:"build-run"},{default:r(()=>[l(g,null,{default:r(()=>[l(d,null,{default:r(()=>[o[64]||(o[64]=e("p",null,[t(" 运行以下命令以创建包含 Ktor 应用程序的 "),e("a",{href:"#configure-ktor-plugin"},"fat JAR"),t("： ")],-1)),l(i,{lang:"Bash",code:"                    ./gradlew :tutorial-server-docker-compose:buildFatJar"})]),_:1}),l(d,null,{default:r(()=>[o[65]||(o[65]=e("p",null,[t(" 使用 "),e("code",null,"docker compose up"),t(" 命令构建镜像并启动容器： ")],-1)),l(i,{lang:"Bash",code:"                    docker compose --project-directory snippets/tutorial-server-docker-compose up"})]),_:1}),l(d,null,{default:r(()=>o[66]||(o[66]=[t(" 等待 Docker Compose 完成镜像构建。 ")])),_:1}),l(d,null,{default:r(()=>o[67]||(o[67]=[e("p",null,[t(" 导航到 "),e("a",{href:"http://localhost:8080/static/index.html"},[e("a",{href:"http://localhost:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://localhost:8080/static/index.html")]),t(" 打开 Web 应用程序。你将看到任务管理器客户端页面，其中显示了用于筛选和添加新任务的三个表单，以及一个任务表。 ")],-1),e("img",{src:D,alt:"显示任务管理器客户端的浏览器窗口","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1})]),_:1})])}const L=S(y,[["render",C]]);export{K as __pageData,L as default};
