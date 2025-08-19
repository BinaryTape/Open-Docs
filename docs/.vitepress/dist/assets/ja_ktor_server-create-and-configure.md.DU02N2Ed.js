import{_ as b,C as i,c as S,o as w,G as r,w as o,j as t,a as e}from"./chunks/framework.Bksy39di.js";const E=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-create-and-configure.md","filePath":"ja/ktor/server-create-and-configure.md","lastUpdated":1755457140000}'),C={name:"ja/ktor/server-create-and-configure.md"};function x(A,n,N,K,L,T){const f=i("show-structure"),g=i("tldr"),v=i("link-summary"),l=i("Links"),m=i("control"),a=i("list"),s=i("code-block"),d=i("chapter"),u=i("Path"),p=i("tab"),k=i("tabs"),y=i("topic");return w(),S("div",null,[r(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"サーバーの作成",id:"server-create-and-configure","help-id":"start_server;create_server"},{default:o(()=>[r(f,{for:"chapter",depth:"2"}),r(g,null,{default:o(()=>n[0]||(n[0]=[t("p",null,[t("b",null,"コード例"),e(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server"},"embedded-server"),e(", "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main"},"engine-main"),e(", "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-yaml"},"engine-main-yaml")],-1)])),_:1}),r(v,null,{default:o(()=>n[1]||(n[1]=[e(" アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。 ")])),_:1}),t("p",null,[n[3]||(n[3]=e(" Ktorアプリケーションを作成する前に、アプリケーションがどのように ")),r(l,{href:"/ktor/server-deployment",summary:"コード例: %example_name%"},{default:o(()=>n[2]||(n[2]=[e(" デプロイされる ")])),_:1}),n[4]||(n[4]=e(" かを考慮する必要があります。 "))]),r(a,null,{default:o(()=>[t("li",null,[t("p",null,[r(m,null,{default:o(()=>n[5]||(n[5]=[t("a",{href:"#embedded"},"自己完結型パッケージ",-1)])),_:1}),n[6]||(n[6]=e("として "))]),t("p",null,[n[8]||(n[8]=e(" この場合、ネットワークリクエストを処理するために使用されるアプリケーション")),r(l,{href:"/ktor/server-engines",summary:"ネットワークリクエストを処理するエンジンについて学びます。"},{default:o(()=>n[7]||(n[7]=[e("エンジン")])),_:1}),n[9]||(n[9]=e("は、アプリケーションの一部である必要があります。 アプリケーションは、エンジン設定、接続、およびSSLオプションを制御できます。 "))])]),t("li",null,[t("p",null,[r(m,null,{default:o(()=>n[10]||(n[10]=[t("a",{href:"#servlet"},"サーブレット",-1)])),_:1}),n[11]||(n[11]=e("として "))]),n[12]||(n[12]=t("p",null," この場合、Ktorアプリケーションは、アプリケーションのライフサイクルと接続設定を制御するサーブレットコンテナ（TomcatやJettyなど）内にデプロイできます。 ",-1))])]),_:1}),r(d,{title:"自己完結型パッケージ",id:"embedded"},{default:o(()=>[t("p",null,[n[14]||(n[14]=e(" Ktorサーバーアプリケーションを自己完結型パッケージとして提供するには、まずサーバーを作成する必要があります。 サーバー設定には、さまざまな設定が含まれる場合があります。 サーバー")),r(l,{href:"/ktor/server-engines",summary:"ネットワークリクエストを処理するエンジンについて学びます。"},{default:o(()=>n[13]||(n[13]=[e("エンジン")])),_:1}),n[15]||(n[15]=e("（Netty、Jettyなど）、 さまざまなエンジン固有のオプション、ホストとポートの値などです。 Ktorでサーバーを作成および実行するには、主に2つのアプローチがあります。 "))]),r(a,null,{default:o(()=>n[16]||(n[16]=[t("li",null,[t("p",null,[t("code",null,"embeddedServer"),e("関数は、 "),t("a",{href:"#embedded-server"}," コードでサーバーパラメータを設定する "),e(" 簡単な方法であり、アプリケーションを迅速に実行できます。 ")])],-1),t("li",null,[t("p",null,[t("code",null,"EngineMain"),e("は、サーバーを構成するためのより高い柔軟性を提供します。アプリケーションを 再コンパイルせずに、"),t("a",{href:"#engine-main"}," ファイルでサーバーパラメータを指定する "),e("ことができ、設定を変更できます。さらに、コマンドラインからアプリケーションを実行し、 対応するコマンドライン引数を渡すことで、必要なサーバーパラメータをオーバーライドできます。 ")])],-1)])),_:1}),r(d,{title:"コードでの設定",id:"embedded-server"},{default:o(()=>[t("p",null,[n[19]||(n[19]=t("code",null,"embeddedServer",-1)),n[20]||(n[20]=e("関数は、 ")),r(l,{href:"/ktor/server-configuration-code",summary:"コードでさまざまなサーバーパラメータを設定する方法を学びます。"},{default:o(()=>n[17]||(n[17]=[e("コード")])),_:1}),n[21]||(n[21]=e("でサーバーパラメータを設定し、アプリケーションを迅速に実行する簡単な方法です。以下のコードスニペットでは、サーバーを起動するためのパラメータとして ")),r(l,{href:"/ktor/server-engines",summary:"ネットワークリクエストを処理するエンジンについて学びます。"},{default:o(()=>n[18]||(n[18]=[e("エンジン")])),_:1}),n[22]||(n[22]=e("とポートを受け取ります。以下の例では、 ")),n[23]||(n[23]=t("code",null,"Netty",-1)),n[24]||(n[24]=e("エンジンでサーバーを実行し、")),n[25]||(n[25]=t("code",null,"8080",-1)),n[26]||(n[26]=e("ポートでリッスンします。 "))]),r(s,{lang:"kotlin",code:`package com.example

import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        println("Running basic server...")
        println("Provide the 'configured' argument to run a configured server.")
        runBasicServer()
    }

    when (args[0]) {
        "basic" -> runBasicServer()
        "configured" -> runConfiguredServer()
        else -> runServerWithCommandLineConfig(args)
    }
}

fun runBasicServer() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}

fun runConfiguredServer() {
    embeddedServer(Netty, configure = {
        connectors.add(EngineConnectorBuilder().apply {
            host = "127.0.0.1"
            port = 8080
        })
        connectionGroupSize = 2
        workerGroupSize = 5
        callGroupSize = 10
        shutdownGracePeriod = 2000
        shutdownTimeout = 3000
    }) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}

fun runServerWithCommandLineConfig(args: Array<String>) {
    embeddedServer(
        factory = Netty,
        configure = {
            val cliConfig = CommandLineConfig(args)
            takeFrom(cliConfig.engineConfig)
            loadCommonConfiguration(cliConfig.rootConfig.environment.config)
        }
    ) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}`}),n[27]||(n[27]=t("p",null,[e(" 完全な例については、 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server"}," embedded-server "),e(" を参照してください。 ")],-1))]),_:1}),r(d,{title:"ファイルでの設定",id:"engine-main"},{default:o(()=>[t("p",null,[n[33]||(n[33]=t("code",null,"EngineMain",-1)),n[34]||(n[34]=e("は、選択されたエンジンでサーバーを起動し、")),r(u,null,{default:o(()=>n[28]||(n[28]=[e("resources")])),_:1}),n[35]||(n[35]=e("ディレクトリに配置された外部")),r(l,{href:"/ktor/server-configuration-file",summary:"設定ファイルでさまざまなサーバーパラメータを設定する方法を学びます。"},{default:o(()=>n[29]||(n[29]=[e("設定ファイル")])),_:1}),n[36]||(n[36]=e("（")),r(u,null,{default:o(()=>n[30]||(n[30]=[e("application.conf")])),_:1}),n[37]||(n[37]=e("または")),r(u,null,{default:o(()=>n[31]||(n[31]=[e("application.yaml")])),_:1}),n[38]||(n[38]=e("）で指定された")),r(l,{href:"/ktor/server-modules",summary:"モジュールは、ルーティングをグループ化することでアプリケーションを構造化できます。"},{default:o(()=>n[32]||(n[32]=[e("アプリケーションモジュール")])),_:1}),n[39]||(n[39]=e("をロードします。 ロードするモジュールに加えて、設定ファイルにはさまざまなサーバーパラメータ（以下の例では ")),n[40]||(n[40]=t("code",null,"8080",-1)),n[41]||(n[41]=e("ポート）を含めることができます。 "))]),r(k,null,{default:o(()=>[r(p,{title:"Application.kt",id:"application-kt"},{default:o(()=>[r(s,{lang:"kotlin",code:`package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello, world!")
        }
    }
}`})]),_:1}),r(p,{title:"application.conf",id:"application-conf"},{default:o(()=>[r(s,{code:`ktor {
    deployment {
        port = 8080
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),r(p,{title:"application.yaml",id:"application-yaml"},{default:o(()=>[r(s,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1}),n[42]||(n[42]=t("p",null,[e(" 完全な例については、 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main"}," engine-main "),e(" および "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-yaml"}," engine-main-yaml "),e(" を参照してください。 ")],-1))]),_:1})]),_:1}),r(d,{title:"サーブレット",id:"servlet"},{default:o(()=>[t("p",null,[n[44]||(n[44]=e(" Ktorアプリケーションは、TomcatやJettyを含むサーブレットコンテナ内で実行およびデプロイできます。 サーブレットコンテナ内にデプロイするには、 ")),r(l,{href:"/ktor/server-war",summary:"WARアーカイブを使用して、Ktorアプリケーションをサーブレットコンテナ内で実行およびデプロイする方法を学びます。"},{default:o(()=>n[43]||(n[43]=[e("WAR")])),_:1}),n[45]||(n[45]=e(" アーカイブを生成し、それをWARをサポートするサーバーまたはクラウドサービスにデプロイする必要があります。 "))])]),_:1})]),_:1})])}const P=b(C,[["render",x]]);export{E as __pageData,P as default};
