import{_ as S}from"./chunks/tutorial_server_db_integration_manual_test.DHfnfXew.js";import{_ as D,C as l,c as w,o as R,G as r,w as n,j as e,a as t}from"./chunks/framework.Bksy39di.js";const J=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/docker-compose.md","filePath":"ja/ktor/docker-compose.md","lastUpdated":1755457140000}'),y={name:"ja/ktor/docker-compose.md"},A={href:"#configure-docker"};function x(C,o,j,O,P,E){const f=l("show-structure"),m=l("control"),k=l("tldr"),a=l("Links"),s=l("Path"),i=l("code-block"),d=l("step"),g=l("procedure"),p=l("chapter"),u=l("list"),b=l("tip"),v=l("topic");return R(),w("div",null,[r(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"docker-compose",title:"Docker Compose"},{default:n(()=>[r(f,{for:"chapter",depth:"2"}),r(k,null,{default:n(()=>[e("p",null,[r(m,null,{default:n(()=>o[0]||(o[0]=[t("初期プロジェクト")])),_:1}),o[1]||(o[1]=t(" : ")),o[2]||(o[2]=e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-db-integration"},"tutorial-server-db-integration",-1))]),e("p",null,[r(m,null,{default:n(()=>o[3]||(o[3]=[t("最終プロジェクト")])),_:1}),o[4]||(o[4]=t(" : ")),o[5]||(o[5]=e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-docker-compose"},"tutorial-server-docker-compose",-1))])]),_:1}),e("p",null,[o[7]||(o[7]=t("このトピックでは、サーバーKtorアプリケーションを")),o[8]||(o[8]=e("a",{href:"https://docs.docker.com/compose/"},"Docker Compose",-1)),o[9]||(o[9]=t("で実行する方法を説明します。")),r(a,{href:"/ktor/server-integrate-database",summary:"Learn the process of connecting Ktor services to database repositories with the Exposed SQL Library."},{default:n(()=>o[6]||(o[6]=[t("データベースを統合する")])),_:1}),o[10]||(o[10]=t("チュートリアルで作成したプロジェクトを使用します。このプロジェクトは、")),o[11]||(o[11]=e("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed",-1)),o[12]||(o[12]=t("を使用して")),o[13]||(o[13]=e("a",{href:"https://www.postgresql.org/docs/"},"PostgreSQL",-1)),o[14]||(o[14]=t("データベースに接続し、データベースとWebアプリケーションが別々に実行されるようにします。"))]),r(p,{title:"アプリケーションを準備する",id:"prepare-app"},{default:n(()=>[r(p,{title:"データベース設定の抽出",id:"extract-db-settings"},{default:n(()=>[o[44]||(o[44]=e("p",null,[e("a",{href:"./server-integrate-database#config-db-connection"},"データベース接続を設定する"),t("チュートリアルで作成されたプロジェクトは、データベース接続を確立するためにハードコードされた属性を使用しています。")],-1)),e("p",null,[o[16]||(o[16]=t(" PostgreSQLデータベースの接続設定を")),r(a,{href:"/ktor/server-configuration-file",summary:"Learn how to configure various server parameters in a configuration file."},{default:n(()=>o[15]||(o[15]=[t("カスタム構成グループ")])),_:1}),o[17]||(o[17]=t("に抽出しましょう。 "))]),r(g,null,{default:n(()=>[r(d,null,{default:n(()=>[e("p",null,[r(s,null,{default:n(()=>o[18]||(o[18]=[t("src/main/resources")])),_:1}),o[20]||(o[20]=t("の")),r(s,null,{default:n(()=>o[19]||(o[19]=[t("application.yaml")])),_:1}),o[21]||(o[21]=t("ファイルを開き、")),o[22]||(o[22]=e("code",null,"ktor",-1)),o[23]||(o[23]=t("グループの外に")),o[24]||(o[24]=e("code",null,"storage",-1)),o[25]||(o[25]=t("グループを次のように追加します。 "))]),r(i,{lang:"yaml",code:`ktor:
  application:
    modules:
      - com.example.ApplicationKt.module
  deployment:
    port: 8080
storage:
  driverClassName: "org.postgresql.Driver"
  jdbcURL: "jdbc:postgresql://localhost:5432/ktor_tutorial_db"
  user: "postgres"
  password: "password"`}),e("p",null,[o[27]||(o[27]=t("これらの設定は後で")),e("a",A,[r(s,null,{default:n(()=>o[26]||(o[26]=[t("compose.yml")])),_:1})]),o[28]||(o[28]=t("ファイルで構成されます。 "))])]),_:1}),r(d,null,{default:n(()=>[e("p",null,[r(s,null,{default:n(()=>o[29]||(o[29]=[t("src/main/kotlin/com/example/plugins/")])),_:1}),o[31]||(o[31]=t("の")),r(s,null,{default:n(()=>o[30]||(o[30]=[t("Databases.kt")])),_:1}),o[32]||(o[32]=t("ファイルを開き、構成ファイルからストレージ設定をロードするように")),o[33]||(o[33]=e("code",null,"configureDatabases()",-1)),o[34]||(o[34]=t("関数を更新します。 "))]),r(i,{lang:"kotlin",code:`fun Application.configureDatabases(config: ApplicationConfig) {
    val url = config.property("storage.jdbcURL").getString()
    val user = config.property("storage.user").getString()
    val password = config.property("storage.password").getString()

    Database.connect(
        url,
        user = user,
        password = password
    )
}`}),o[35]||(o[35]=e("p",null,[e("code",null,"configureDatabases()"),t("関数は、"),e("code",null,"ApplicationConfig"),t("を受け入れ、"),e("code",null,"config.property"),t("を使用してカスタム設定をロードするようになりました。 ")],-1))]),_:1}),r(d,null,{default:n(()=>[e("p",null,[r(s,null,{default:n(()=>o[36]||(o[36]=[t("src/main/kotlin/com/example/")])),_:1}),o[38]||(o[38]=t("の")),r(s,null,{default:n(()=>o[37]||(o[37]=[t("Application.kt")])),_:1}),o[39]||(o[39]=t("ファイルを開き、アプリケーション起動時に接続設定をロードするために")),o[40]||(o[40]=e("code",null,"environment.config",-1)),o[41]||(o[41]=t("を")),o[42]||(o[42]=e("code",null,"configureDatabases()",-1)),o[43]||(o[43]=t("に渡します。 "))]),r(i,{lang:"kotlin",code:`fun Application.module() {
    val repository = PostgresTaskRepository()

    configureSerialization(repository)
    configureDatabases(environment.config)
    configureRouting()
}`})]),_:1})]),_:1})]),_:1}),r(p,{title:"Ktorプラグインの構成",id:"configure-ktor-plugin"},{default:n(()=>[o[50]||(o[50]=e("p",null,"Dockerで実行するには、アプリケーションに必要なすべてのファイルをコンテナにデプロイする必要があります。使用しているビルドシステムに応じて、これを実現するための異なるプラグインがあります。",-1)),r(u,null,{default:n(()=>[e("li",null,[r(a,{href:"/ktor/server-fatjar",summary:"Learn how to create and run an executable fat JAR using the Ktor Gradle plugin."},{default:n(()=>o[45]||(o[45]=[t("Ktor Gradleプラグインを使用したfat JARの作成")])),_:1})]),e("li",null,[r(a,{href:"/ktor/maven-assembly-plugin",summary:"Sample project: tutorial-server-get-started-maven"},{default:n(()=>o[46]||(o[46]=[t("Maven Assemblyプラグインを使用したfat JARの作成")])),_:1})])]),_:1}),e("p",null,[o[48]||(o[48]=t("この例では、Ktorプラグインは")),r(s,null,{default:n(()=>o[47]||(o[47]=[t("build.gradle.kts")])),_:1}),o[49]||(o[49]=t("ファイルにすでに適用されています。"))]),r(i,{lang:"kotlin",code:`plugins {
    application
    kotlin("jvm")
    id("io.ktor.plugin") version "3.2.3"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.20"
}`})]),_:1})]),_:1}),r(p,{title:"Dockerの構成",id:"configure-docker"},{default:n(()=>[r(p,{title:"Dockerイメージの準備",id:"prepare-docker-image"},{default:n(()=>[e("p",null,[o[52]||(o[52]=t(" アプリケーションをDocker化するには、プロジェクトのルートディレクトリに新しい")),r(s,null,{default:n(()=>o[51]||(o[51]=[t("Dockerfile")])),_:1}),o[53]||(o[53]=t("を作成し、次のコンテンツを挿入します。 "))]),r(i,{lang:"Docker",code:`# Stage 1: Cache Gradle dependencies
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
ENTRYPOINT ["java","-jar","/app/ktor-docker-sample.jar"]`}),r(b,null,{default:n(()=>o[54]||(o[54]=[t(" このマルチステージビルドの仕組みの詳細については、"),e("a",{href:"./docker#prepare-docker"},"Dockerイメージを準備する",-1),t("を参照してください。 ")])),_:1}),o[56]||(o[56]=e("p",null," この例ではAmazon Corretto Dockerイメージを使用していますが、以下のようないくつかの適切な代替品と置き換えることができます。 ",-1)),r(u,null,{default:n(()=>o[55]||(o[55]=[e("li",null,[e("a",{href:"https://hub.docker.com/_/eclipse-temurin"},"Eclipse Temurin")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/ibm-semeru-runtimes"},"IBM Semeru")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/ibmjava"},"IBM Java")],-1),e("li",null,[e("a",{href:"https://hub.docker.com/_/sapmachine"},"SAP Machine JDK")],-1)])),_:1})]),_:1}),r(p,{title:"Docker Composeの構成",id:"configure-docker-compose"},{default:n(()=>[e("p",null,[o[58]||(o[58]=t("プロジェクトのルートディレクトリに新しい")),r(s,null,{default:n(()=>o[57]||(o[57]=[t("compose.yml")])),_:1}),o[59]||(o[59]=t("ファイルを作成し、次のコンテンツを追加します。"))]),r(i,{lang:"yaml",code:`services:
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
      interval: 1s`}),r(u,null,{default:n(()=>o[60]||(o[60]=[e("li",null,[e("code",null,"web"),t("サービスは、"),e("a",{href:"#prepare-docker-image"},"イメージ"),t("内にパッケージされたKtorアプリケーションを実行するために使用されます。 ")],-1),e("li",null,[e("code",null,"db"),t("サービスは、"),e("code",null,"postgres"),t("イメージを使用して、タスクを保存するための"),e("code",null,"ktor_tutorial_db"),t("データベースを作成します。 ")],-1)])),_:1})]),_:1})]),_:1}),r(p,{title:"サービスのビルドと実行",id:"build-run"},{default:n(()=>[r(g,null,{default:n(()=>[r(d,null,{default:n(()=>[o[61]||(o[61]=e("p",null,[t(" Ktorアプリケーションを含む"),e("a",{href:"#configure-ktor-plugin"},"fat JAR"),t("を作成するために、次のコマンドを実行します。 ")],-1)),r(i,{lang:"Bash",code:"                    ./gradlew :tutorial-server-docker-compose:buildFatJar"})]),_:1}),r(d,null,{default:n(()=>[o[62]||(o[62]=e("p",null,[t(" イメージをビルドしてコンテナを起動するために、"),e("code",null,"docker compose up"),t("コマンドを使用します。 ")],-1)),r(i,{lang:"Bash",code:"                    docker compose --project-directory snippets/tutorial-server-docker-compose up"})]),_:1}),r(d,null,{default:n(()=>o[63]||(o[63]=[t(" Docker Composeがイメージのビルドを完了するまで待ちます。 ")])),_:1}),r(d,null,{default:n(()=>o[64]||(o[64]=[e("p",null,[t(" ウェブアプリケーションを開くには、"),e("a",{href:"http://localhost:8080/static/index.html"},[e("a",{href:"http://localhost:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://localhost:8080/static/index.html")]),t("に移動します。タスクマネージャークライアントページが表示され、タスクのフィルタリングと新規追加のための3つのフォームと、タスクのテーブルが表示されるはずです。 ")],-1),e("img",{src:S,alt:"タスクマネージャークライアントを表示しているブラウザウィンドウ","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1})]),_:1})])}const K=D(y,[["render",x]]);export{J as __pageData,K as default};
