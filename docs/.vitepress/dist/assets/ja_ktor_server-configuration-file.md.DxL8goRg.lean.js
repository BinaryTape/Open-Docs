import{_ as A,C as d,c as L,o as j,G as o,w as e,j as l,a as t}from"./chunks/framework.Bksy39di.js";const $=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-configuration-file.md","filePath":"ja/ktor/server-configuration-file.md","lastUpdated":1755457140000}'),b={name:"ja/ktor/server-configuration-file.md"},K={id:"ssl"};function O(z,n,N,T,G,R){const g=d("show-structure"),v=d("link-summary"),s=d("Links"),m=d("Path"),k=d("note"),S=d("list"),i=d("code-block"),p=d("tab"),a=d("tabs"),u=d("chapter"),w=d("snippet"),P=d("warning"),f=d("emphasis"),r=d("def"),y=d("deflist"),x=d("topic");return j(),L("div",null,[o(x,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"ファイルでの設定",id:"server-configuration-file","help-id":"Configuration-file;server-configuration-in-file"},{default:e(()=>[o(g,{for:"chapter",depth:"2"}),o(v,null,{default:e(()=>n[0]||(n[0]=[t(" 設定ファイルでさまざまなサーバーパラメーターを構成する方法を学びます。 ")])),_:1}),l("p",null,[n[3]||(n[3]=t(" Ktorを使用すると、ホストアドレスやポート、 ")),o(s,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:e(()=>n[1]||(n[1]=[t("読み込むモジュール")])),_:1}),n[4]||(n[4]=t(" など、さまざまなサーバーパラメーターを構成できます。 設定は、サーバーを作成した方法、つまり ")),o(s,{href:"/ktor/server-create-and-configure",summary:"アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。"},{default:e(()=>n[2]||(n[2]=[t(" embeddedServerまたはEngineMain ")])),_:1}),n[5]||(n[5]=t(" によって異なります。 "))]),n[131]||(n[131]=l("p",null,[l("code",null,"EngineMain"),t("の場合、Ktorは "),l("a",{href:"https://github.com/lightbend/config/blob/master/HOCON.md"}," HOCON "),t(" またはYAML形式を使用する設定ファイルから構成を読み込みます。この方法により、サーバーを構成する際の柔軟性が高まり、アプリケーションを再コンパイルすることなく設定を変更できます。さらに、コマンドラインからアプリケーションを実行し、対応する "),l("a",{href:"#command-line"}," コマンドライン "),t(" 引数を渡すことで、必要なサーバーパラメーターを上書きできます。 ")],-1)),o(u,{title:"概要",id:"configuration-file-overview"},{default:e(()=>[l("p",null,[n[8]||(n[8]=l("a",{href:"#engine-main"}," EngineMain ",-1)),n[9]||(n[9]=t(" を使用してサーバーを起動する場合、Ktorは ")),o(m,null,{default:e(()=>n[6]||(n[6]=[t("resources")])),_:1}),n[10]||(n[10]=t(" ディレクトリにある ")),o(m,null,{default:e(()=>n[7]||(n[7]=[t("application.*")])),_:1}),n[11]||(n[11]=t(" というファイルから設定を自動的に読み込みます。以下の2つの設定形式がサポートされています。 "))]),o(S,null,{default:e(()=>[l("li",null,[l("p",null,[n[13]||(n[13]=t(" HOCON ( ")),o(m,null,{default:e(()=>n[12]||(n[12]=[t("application.conf")])),_:1}),n[14]||(n[14]=t(" ) "))])]),l("li",null,[l("p",null,[n[16]||(n[16]=t(" YAML ( ")),o(m,null,{default:e(()=>n[15]||(n[15]=[t("application.yaml")])),_:1}),n[17]||(n[17]=t(" ) "))]),o(k,null,{default:e(()=>[l("p",null,[n[19]||(n[19]=t(" YAML設定ファイルを使用するには、")),n[20]||(n[20]=l("code",null,"ktor-server-config-yaml",-1)),o(s,{href:"/ktor/server-dependencies",summary:"既存のGradle/MavenプロジェクトにKtor Serverの依存関係を追加する方法を学びます。"},{default:e(()=>n[18]||(n[18]=[t(" 依存関係 ")])),_:1}),n[21]||(n[21]=t(" を追加する必要があります。 "))])]),_:1})])]),_:1}),l("p",null,[n[23]||(n[23]=t(" 設定ファイルには、少なくとも")),n[24]||(n[24]=l("code",null,"ktor.application.modules",-1)),n[25]||(n[25]=t("プロパティを使用して指定された ")),o(s,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:e(()=>n[22]||(n[22]=[t(" 読み込むモジュール ")])),_:1}),n[26]||(n[26]=t(" が含まれている必要があります。例: "))]),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-2"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-2"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1}),l("p",null,[n[28]||(n[28]=t(" この場合、Ktorは以下の ")),o(m,null,{default:e(()=>n[27]||(n[27]=[t("Application.kt")])),_:1}),n[29]||(n[29]=t(" ファイル内の")),n[30]||(n[30]=l("code",null,"Application.module",-1)),n[31]||(n[31]=t("関数を呼び出します。 "))]),o(i,{lang:"kotlin",code:`package com.example

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
}`}),n[45]||(n[45]=l("p",null,[t(" 読み込むモジュール以外にも、 "),l("a",{href:"#predefined-properties"},"事前定義された"),t(" （ポートやホスト、SSL設定など）およびカスタムのさまざまなサーバー設定を構成できます。 いくつかの例を見てみましょう。 ")],-1)),o(u,{title:"基本的な構成",id:"config-basic"},{default:e(()=>[n[32]||(n[32]=l("p",null,[t(" 以下の例では、サーバーのリスニングポートが"),l("code",null,"ktor.deployment.port"),t("プロパティを使用して"),l("code",null,"8080"),t("に設定されています。 ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-3"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-3"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1})]),_:1}),o(u,{title:"エンジン構成",id:"config-engine"},{default:e(()=>[o(w,{id:"engine-main-configuration"},{default:e(()=>[n[34]||(n[34]=l("p",null,[l("code",null,"EngineMain"),t("を使用する場合、"),l("code",null,"ktor.deployment"),t("グループ内で、すべてのエンジンに共通のオプションを指定できます。 ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:e(()=>[o(i,{lang:"shell",code:`                            ktor {
                                deployment {
                                    connectionGroupSize = 2
                                    workerGroupSize = 5
                                    callGroupSize = 10
                                    shutdownGracePeriod = 2000
                                    shutdownTimeout = 3000
                                }
                            }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"engine-main-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`                           ktor:
                               deployment:
                                   connectionGroupSize: 2
                                   workerGroupSize: 5
                                   callGroupSize: 10
                                   shutdownGracePeriod: 2000
                                   shutdownTimeout: 3000`})]),_:1})]),_:1}),o(u,{title:"Netty",id:"netty-file"},{default:e(()=>[n[33]||(n[33]=l("p",null,[t(" 構成ファイル内で、"),l("code",null,"ktor.deployment"),t("グループにNetty固有のオプションを設定することもできます。 ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:e(()=>[o(i,{lang:"shell",code:`                               ktor {
                                   deployment {
                                       maxInitialLineLength = 2048
                                       maxHeaderSize = 1024
                                       maxChunkSize = 42
                                   }
                               }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-1"},{default:e(()=>[o(i,{lang:"yaml",code:`                               ktor:
                                   deployment:
                                       maxInitialLineLength: 2048
                                       maxHeaderSize: 1024
                                       maxChunkSize: 42`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),o(u,{title:"SSL構成",id:"config-ssl"},{default:e(()=>[l("p",null,[n[36]||(n[36]=t(" 以下の例では、Ktorが")),n[37]||(n[37]=l("code",null,"8443",-1)),n[38]||(n[38]=t("番のSSLポートでリッスンすることを有効にし、必要な ")),o(s,{href:"/ktor/server-ssl",summary:"必要な依存関係: io.ktor:ktor-network-tls-certificates コード例: ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[35]||(n[35]=[t(" SSL設定 ")])),_:1}),n[39]||(n[39]=t(" を個別の")),n[40]||(n[40]=l("code",null,"security",-1)),n[41]||(n[41]=t("ブロックで指定しています。 "))]),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
        sslPort = 8443
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }

    security {
        ssl {
            keyStore = keystore.jks
            keyAlias = sampleAlias
            keyStorePassword = foobar
            privateKeyPassword = foobar
        }
    }
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
        sslPort: 8443
    application:
        modules:
            - com.example.ApplicationKt.module

    security:
        ssl:
            keyStore: keystore.jks
            keyAlias: sampleAlias
            keyStorePassword: foobar
            privateKeyPassword: foobar`})]),_:1})]),_:1})]),_:1}),o(u,{title:"カスタム構成",id:"config-custom"},{default:e(()=>[n[43]||(n[43]=l("p",null,[l("a",{href:"#predefined-properties"},"事前定義されたプロパティ"),t("を指定する以外に、Ktorはカスタム設定を構成ファイルに保持することを許可します。 以下の構成ファイルには、"),l("a",{href:"#jwt-settings"},"JWT"),t("設定を保持するために使用されるカスタム"),l("code",null,"jwt"),t("グループが含まれています。 ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-4"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
    }

    application {
        modules = [ com.example.ApplicationKt.main ]
    }
}

jwt {
    secret = "secret"
    issuer = "http://0.0.0.0:8080/"
    audience = "http://0.0.0.0:8080/hello"
    realm = "Access to 'hello'"
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-4"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.main

jwt:
    secret: "secret"
    issuer: "http://0.0.0.0:8080/"
    audience: "http://0.0.0.0:8080/hello"
    realm: "Access to 'hello'"`})]),_:1})]),_:1}),n[44]||(n[44]=l("p",null,[t(" これらの設定はコードで"),l("a",{href:"#read-configuration-in-code"},"読み込んで処理"),t("できます。 ")],-1)),o(P,null,{default:e(()=>n[42]||(n[42]=[l("p",null,[t(" 機密データ（秘密鍵、データベース接続設定など）は、設定ファイルに平文で保存しないでください。 これらのパラメーターを指定するには、 "),l("a",{href:"#environment-variables"}," 環境変数 "),t(" の使用を検討してください。 ")],-1)])),_:1})]),_:1})]),_:1}),o(u,{title:"事前定義されたプロパティ",id:"predefined-properties"},{default:e(()=>[n[85]||(n[85]=l("p",null,[t(" 以下は、"),l("a",{href:"#configuration-file-overview"},"構成ファイル"),t("内で使用できる事前定義された設定のリストです。 ")],-1)),o(y,{type:"wide"},{default:e(()=>[o(r,{title:"ktor.deployment.host",id:"ktor-deployment-host"},{default:e(()=>[n[49]||(n[49]=l("p",null," ホストアドレス。 ",-1)),l("p",null,[o(f,null,{default:e(()=>n[46]||(n[46]=[t("例")])),_:1}),n[47]||(n[47]=t(" : ")),n[48]||(n[48]=l("code",null,"0.0.0.0",-1))])]),_:1}),o(r,{title:"ktor.deployment.port",id:"ktor-deployment-port"},{default:e(()=>[n[55]||(n[55]=l("p",null,[t(" リスニングポート。このプロパティを"),l("code",null,"0"),t("に設定すると、サーバーがランダムなポートで実行されます。 ")],-1)),l("p",null,[o(f,null,{default:e(()=>n[50]||(n[50]=[t("例")])),_:1}),n[51]||(n[51]=t(" : ")),n[52]||(n[52]=l("code",null,"8080",-1)),n[53]||(n[53]=t(", ")),n[54]||(n[54]=l("code",null,"0",-1))])]),_:1}),o(r,{title:"ktor.deployment.sslPort",id:"ktor-deployment-ssl-port"},{default:e(()=>[n[62]||(n[62]=l("p",null,[t(" リスニングSSLポート。このプロパティを"),l("code",null,"0"),t("に設定すると、サーバーがランダムなポートで実行されます。 ")],-1)),l("p",null,[o(f,null,{default:e(()=>n[56]||(n[56]=[t("例")])),_:1}),n[57]||(n[57]=t(" : ")),n[58]||(n[58]=l("code",null,"8443",-1)),n[59]||(n[59]=t(", ")),n[60]||(n[60]=l("code",null,"0",-1))]),o(k,null,{default:e(()=>n[61]||(n[61]=[l("p",null,[t(" SSLには、"),l("a",{href:"#ssl"},"以下にリストされている"),t("追加オプションが必要であることに注意してください。 ")],-1)])),_:1})]),_:1}),o(r,{title:"ktor.deployment.watch",id:"ktor-deployment-watch"},{default:e(()=>n[63]||(n[63]=[l("p",null,[l("a",{href:"#watch-paths"},"自動リロード"),t("に使用される監視パス。 ")],-1)])),_:1}),o(r,{title:"ktor.deployment.rootPath",id:"ktor-deployment-root-path"},{default:e(()=>[l("p",null,[o(s,{href:"/ktor/server-war",summary:"WARアーカイブを使用してサーブレットコンテナ内でKtorアプリケーションを実行およびデプロイする方法を学びます。"},{default:e(()=>n[64]||(n[64]=[t("サーブレット")])),_:1}),n[65]||(n[65]=t("コンテキストパス。 "))]),l("p",null,[o(f,null,{default:e(()=>n[66]||(n[66]=[t("例")])),_:1}),n[67]||(n[67]=t(" : ")),n[68]||(n[68]=l("code",null,"/",-1))])]),_:1}),o(r,{title:"ktor.deployment.shutdown.url",id:"ktor-deployment-shutdown-url"},{default:e(()=>[l("p",null,[n[70]||(n[70]=t(" シャットダウンURL。 このオプションは、")),o(s,{href:"/ktor/server-shutdown-url",summary:"コード例: %example_name%"},{default:e(()=>n[69]||(n[69]=[t("シャットダウンURL")])),_:1}),n[71]||(n[71]=t("プラグインを使用することに注意してください。 "))])]),_:1}),o(r,{title:"ktor.deployment.shutdownGracePeriod",id:"ktor-deployment-shutdown-grace-period"},{default:e(()=>n[72]||(n[72]=[l("p",null," サーバーが新しいリクエストの受け入れを停止するまでの最大時間（ミリ秒単位）。 ",-1)])),_:1}),o(r,{title:"ktor.deployment.shutdownTimeout",id:"ktor-deployment-shutdown-timeout"},{default:e(()=>n[73]||(n[73]=[l("p",null," サーバーが完全に停止するまで待機する最大時間（ミリ秒単位）。 ",-1)])),_:1}),o(r,{title:"ktor.deployment.callGroupSize",id:"ktor-deployment-call-group-size"},{default:e(()=>n[74]||(n[74]=[l("p",null," アプリケーション呼び出しを処理するために使用されるスレッドプールの最小サイズ。 ",-1)])),_:1}),o(r,{title:"ktor.deployment.connectionGroupSize",id:"ktor-deployment-connection-group-size"},{default:e(()=>n[75]||(n[75]=[l("p",null," 新しい接続を受け入れ、呼び出し処理を開始するために使用されるスレッドの数。 ",-1)])),_:1}),o(r,{title:"ktor.deployment.workerGroupSize",id:"ktor-deployment-worker-group-size"},{default:e(()=>n[76]||(n[76]=[l("p",null," 接続の処理、メッセージの解析、およびエンジンの内部作業を行うためのイベントグループのサイズ。 ",-1)])),_:1})]),_:1}),l("p",K,[n[78]||(n[78]=l("code",null,"ktor.deployment.sslPort",-1)),n[79]||(n[79]=t("を設定した場合、以下の ")),o(s,{href:"/ktor/server-ssl",summary:"必要な依存関係: io.ktor:ktor-network-tls-certificates コード例: ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[77]||(n[77]=[t(" SSL固有 ")])),_:1}),n[80]||(n[80]=t(" のプロパティを指定する必要があります。 "))]),o(y,{type:"wide"},{default:e(()=>[o(r,{title:"ktor.security.ssl.keyStore",id:"ktor-security-ssl-keystore"},{default:e(()=>n[81]||(n[81]=[l("p",null," SSLキーストア。 ",-1)])),_:1}),o(r,{title:"ktor.security.ssl.keyAlias",id:"ktor-security-ssl-key-alias"},{default:e(()=>n[82]||(n[82]=[l("p",null," SSLキーストアのエイリアス。 ",-1)])),_:1}),o(r,{title:"ktor.security.ssl.keyStorePassword",id:"ktor-security-ssl-keystore-password"},{default:e(()=>n[83]||(n[83]=[l("p",null," SSLキーストアのパスワード。 ",-1)])),_:1}),o(r,{title:"ktor.security.ssl.privateKeyPassword",id:"ktor-security-ssl-private-key-password"},{default:e(()=>n[84]||(n[84]=[l("p",null," SSL秘密鍵のパスワード。 ",-1)])),_:1})]),_:1})]),_:1}),o(u,{title:"環境変数",id:"environment-variables"},{default:e(()=>[n[86]||(n[86]=l("p",null,[t(" 設定ファイルでは、"),l("code",null,"${ENV}"),t(" / "),l("code",null,"$ENV"),t("構文を使用してパラメーターを環境変数に置き換えることができます。 例えば、"),l("code",null,"PORT"),t("環境変数を"),l("code",null,"ktor.deployment.port"),t("プロパティに次のように割り当てることができます。 ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"env-var-conf"},{default:e(()=>[o(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = \${PORT}
                        }
                    }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"env-var-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: $PORT`})]),_:1})]),_:1}),n[87]||(n[87]=l("p",null,[t(" この場合、環境変数の値がリスニングポートの指定に使用されます。 実行時に"),l("code",null,"PORT"),t("環境変数が存在しない場合は、次のようにデフォルトのポート値を指定できます。 ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"config-conf"},{default:e(()=>[o(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                            port = \${?PORT}
                        }
                    }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: "$PORT:8080"`})]),_:1})]),_:1})]),_:1}),o(u,{title:"コードでの設定の読み込み",id:"read-configuration-in-code"},{default:e(()=>[n[88]||(n[88]=l("p",null,[t(" Ktorでは、設定ファイル内で指定されたプロパティの値にコードからアクセスできます。 例えば、"),l("code",null,"ktor.deployment.port"),t("プロパティを指定した場合、... ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"config-conf-1"},{default:e(()=>[o(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                        }
                    }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml-1"},{default:e(()=>[o(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: 8080`})]),_:1})]),_:1}),n[89]||(n[89]=l("p",null,[t(" ...アプリケーションの設定には "),l("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html"}," ApplicationEnvironment.config "),t(" を使用してアクセスし、必要なプロパティ値は次のように取得できます。 ")],-1)),o(i,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.response.*
            import io.ktor.server.routing.*

            fun Application.module() {
                val port = environment.config.propertyOrNull("ktor.deployment.port")?.getString() ?: "8080"
                routing {
                    get {
                        call.respondText("Listening on port $port")
                    }
                }
            }`}),n[90]||(n[90]=l("p",null,[t(" これは、"),l("a",{href:"#custom-property"},"カスタム設定"),t("を設定ファイルに保持し、その値にアクセスする必要がある場合に特に役立ちます。 ")],-1))]),_:1}),o(u,{title:"コマンドライン",id:"command-line"},{default:e(()=>[l("p",null,[n[92]||(n[92]=l("a",{href:"#engine-main"},"EngineMain",-1)),n[93]||(n[93]=t("を使用してサーバーを作成する場合、コマンドラインから")),o(s,{href:"/ktor/server-fatjar",summary:"Ktor Gradleプラグインを使用して実行可能なfat JARを作成および実行する方法を学びます。"},{default:e(()=>n[91]||(n[91]=[t("パッケージ化されたアプリケーション")])),_:1}),n[94]||(n[94]=t("を実行し、対応するコマンドライン引数を渡すことで必要なサーバーパラメーターを上書きできます。例えば、設定ファイルで指定されたポートを次のように上書きできます。 "))]),o(i,{lang:"shell",code:"            java -jar sample-app.jar -port=8080"}),n[115]||(n[115]=l("p",null," 利用可能なコマンドラインオプションは以下の通りです。 ",-1)),o(y,{type:"narrow"},{default:e(()=>[o(r,{title:"-jar",id:"jar"},{default:e(()=>n[95]||(n[95]=[l("p",null," JARファイルへのパス。 ",-1)])),_:1}),o(r,{title:"-config",id:"config"},{default:e(()=>[l("p",null,[n[98]||(n[98]=t(" リソースからの ")),o(m,null,{default:e(()=>n[96]||(n[96]=[t("application.conf")])),_:1}),n[99]||(n[99]=t(" / ")),o(m,null,{default:e(()=>n[97]||(n[97]=[t("application.yaml")])),_:1}),n[100]||(n[100]=t(" の代わりに使用されるカスタム設定ファイルへのパス。 "))]),l("p",null,[o(f,null,{default:e(()=>n[101]||(n[101]=[t("例")])),_:1}),n[102]||(n[102]=t(" : ")),n[103]||(n[103]=l("code",null,"java -jar sample-app.jar -config=anotherfile.conf",-1))]),l("p",null,[o(f,null,{default:e(()=>n[104]||(n[104]=[t("注")])),_:1}),n[105]||(n[105]=t(" : 複数の値を渡すことができます。")),n[106]||(n[106]=l("code",null,"java -jar sample-app.jar -config=config-base.conf -config=config-dev.conf",-1)),n[107]||(n[107]=t("。この場合、すべての設定がマージされ、右側の設定の値が優先されます。 "))])]),_:1}),o(r,{title:"-host",id:"host"},{default:e(()=>n[108]||(n[108]=[l("p",null," ホストアドレス。 ",-1)])),_:1}),o(r,{title:"-port",id:"port"},{default:e(()=>n[109]||(n[109]=[l("p",null," リスニングポート。 ",-1)])),_:1}),o(r,{title:"-watch",id:"watch"},{default:e(()=>n[110]||(n[110]=[l("p",null,[l("a",{href:"#watch-paths"},"自動リロード"),t("に使用される監視パス。 ")],-1)])),_:1})]),_:1}),l("p",null,[o(s,{href:"/ktor/server-ssl",summary:"必要な依存関係: io.ktor:ktor-network-tls-certificates コード例: ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[111]||(n[111]=[t("SSL固有")])),_:1}),n[112]||(n[112]=t("のオプション: "))]),o(y,{type:"narrow"},{default:e(()=>[o(r,{title:"-sslPort",id:"ssl-port"},{default:e(()=>n[113]||(n[113]=[l("p",null," リスニングSSLポート。 ",-1)])),_:1}),o(r,{title:"-sslKeyStore",id:"ssl-keystore"},{default:e(()=>n[114]||(n[114]=[l("p",null," SSLキーストア。 ",-1)])),_:1})]),_:1}),n[116]||(n[116]=l("p",null,[t(" 対応するコマンドラインオプションがない"),l("a",{href:"#predefined-properties"},"事前定義されたプロパティ"),t("を上書きする必要がある場合は、"),l("code",null,"-P"),t("フラグを使用します。例: ")],-1)),o(i,{code:"            java -jar sample-app.jar -P:ktor.deployment.callGroupSize=7"}),n[117]||(n[117]=l("p",null,[l("code",null,"-P"),t("フラグを使用して、"),l("a",{href:"#config-custom"},"カスタムプロパティ"),t("を上書きすることもできます。 ")],-1))]),_:1}),o(u,{title:"例: カスタムプロパティを使用した環境の指定方法",id:"custom-property"},{default:e(()=>[l("p",null,[n[120]||(n[120]=t(" サーバーがローカルで実行されているか、本番環境で実行されているかに応じて、異なる処理を行いたい場合があります。これを実現するには、 ")),o(m,null,{default:e(()=>n[118]||(n[118]=[t("application.conf")])),_:1}),n[121]||(n[121]=t(" / ")),o(m,null,{default:e(()=>n[119]||(n[119]=[t("application.yaml")])),_:1}),n[122]||(n[122]=t(" にカスタムプロパティを追加し、サーバーがローカルで実行されているか本番環境で実行されているかに応じて値が異なる専用の")),n[123]||(n[123]=l("a",{href:"#environment-variables"},"環境変数",-1)),n[124]||(n[124]=t("で初期化します。以下の例では、")),n[125]||(n[125]=l("code",null,"KTOR_ENV",-1)),n[126]||(n[126]=t("環境変数がカスタムの")),n[127]||(n[127]=l("code",null,"ktor.environment",-1)),n[128]||(n[128]=t("プロパティに割り当てられています。 "))]),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-5"},{default:e(()=>[o(i,{code:`ktor {
    environment = \${?KTOR_ENV}
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-5"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    environment: $?KTOR_ENV`})]),_:1})]),_:1}),n[129]||(n[129]=l("p",null,[t(" 実行時に"),l("code",null,"ktor.environment"),t("の値にアクセスするには、 "),l("a",{href:"#read-configuration-in-code"}," コードで設定を読み込み "),t(" 、必要なアクションを実行します。 ")],-1)),o(i,{lang:"kotlin",code:`import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module() {
    val env = environment.config.propertyOrNull("ktor.environment")?.getString()
    routing {
        get {
            call.respondText(when (env) {
                "dev" -> "Development"
                "prod" -> "Production"
                else -> "..."
            })
        }
    }
}`}),n[130]||(n[130]=l("p",null,[t(" 完全な例はこちらで確認できます。 "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-custom-environment"}," engine-main-custom-environment "),t("。 ")],-1))]),_:1})]),_:1})])}const M=A(b,[["render",O]]);export{$ as __pageData,M as default};
