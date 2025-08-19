import{_ as w,a as K,b}from"./chunks/tutorial_kotlin_rpc_run_client.ueSZ_fWO.js";import{_ as j}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as I,C as u,c as D,o as y,G as i,w as o,j as t,a as l}from"./chunks/framework.Bksy39di.js";const F=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/tutorial-first-steps-with-kotlin-rpc.md","filePath":"ja/ktor/tutorial-first-steps-with-kotlin-rpc.md","lastUpdated":1755457140000}'),A={name:"ja/ktor/tutorial-first-steps-with-kotlin-rpc.md"};function B(O,n,T,E,L,M){const f=u("show-structure"),P=u("web-summary"),g=u("link-summary"),S=u("card-summary"),m=u("Links"),C=u("tldr"),s=u("chapter"),a=u("format"),k=u("list"),r=u("step"),z=u("control"),x=u("ui-path"),p=u("Path"),d=u("procedure"),e=u("code-block"),R=u("tip"),v=u("topic");return y(),D("div",null,[i(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Kotlin RPC の最初のステップ",id:"tutorial-first-steps-with-kotlin-rpc"},{default:o(()=>[i(f,{for:"chapter",depth:"2"}),i(P,null,{default:o(()=>n[0]||(n[0]=[l(" RPC の基本を学び、この包括的なガイドで RPC と REST の詳細な比較を探ります。Kotlin RPC を使用して最初のアプリケーションを作成する方法を学びましょう。 ")])),_:1}),i(g,null,{default:o(()=>n[1]||(n[1]=[l(" Kotlin RPC と Ktor を使用して最初のアプリケーションを作成する方法を学びましょう。 ")])),_:1}),i(S,null,{default:o(()=>n[2]||(n[2]=[l(" Kotlin RPC と Ktor を使用して最初のアプリケーションを作成する方法を学びましょう。 ")])),_:1}),i(C,null,{default:o(()=>[n[10]||(n[10]=t("p",null,[t("b",null,"コード例"),l(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-kotlin-rpc-app"}," tutorial-kotlin-rpc-app ")],-1)),t("p",null,[n[4]||(n[4]=t("b",null,"使用されているプラグイン",-1)),n[5]||(n[5]=l(": ")),i(m,{href:"/ktor/server-routing",summary:"ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。"},{default:o(()=>n[3]||(n[3]=[l("Routing")])),_:1}),n[6]||(n[6]=l(", ")),n[7]||(n[7]=t("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1)),n[8]||(n[8]=l(", ")),n[9]||(n[9]=t("a",{href:"https://github.com/Kotlin/kotlinx-rpc"},"kotlinx.rpc",-1))])]),_:1}),n[141]||(n[141]=t("p",null,[l(" Kotlin RPC (Remote Procedure Call) は、Kotlinエコシステムに加わった新しく魅力的な機能で、確立された基盤に基づいて構築されており、"),t("code",null,"kotlinx.rpc"),l(" ライブラリ上で動作します。 ")],-1)),n[142]||(n[142]=t("p",null,[t("code",null,"kotlinx.rpc"),l(" ライブラリを使用すると、通常のKotlin言語構成のみを使用してネットワーク境界を越えてプロシージャ呼び出しを行うことができます。そのため、REST と Google RPC (gRPC) の両方に対する代替手段を提供します。 ")],-1)),n[143]||(n[143]=t("p",null," この記事では、Kotlin RPC のコアコンセプトを紹介し、シンプルなアプリケーションを構築します。その後、ご自身のプロジェクトでこのライブラリを評価することができます。 ",-1)),i(s,{title:"前提条件",id:"prerequisites"},{default:o(()=>n[11]||(n[11]=[t("p",null,[l(" このチュートリアルでは、Kotlin プログラミングの基本的な理解があることを前提としています。Kotlin を初めて使用する場合は、いくつかの"),t("a",{href:"https://kotlinlang.org/docs/getting-started.html"},"入門資料"),l("を確認することをお勧めします。 ")],-1),t("p",null,[l("最高の体験を得るために、統合開発環境 (IDE) として "),t("a",{href:"https://www.jetbrains.com/idea/download"},"IntelliJ IDEA Ultimate"),l(" の使用をお勧めします。これは、生産性を向上させる包括的なサポートとツールを提供するためです。 ")],-1)])),_:1}),i(s,{title:"RPC とは何か？",id:"what-is-rpc"},{default:o(()=>[i(s,{title:"ローカルプロシージャ呼び出し vs. リモートプロシージャ呼び出し",id:"local-vs-remote"},{default:o(()=>n[12]||(n[12]=[t("p",null," プログラミング経験がある人なら誰でも、プロシージャ呼び出しの概念に精通しているでしょう。これはあらゆるプログラミング言語における基本的な概念です。技術的には、これらは常に同じプログラム内で実行されるため、ローカルプロシージャ呼び出しです。 ",-1),t("p",null," リモートプロシージャ呼び出しとは、関数呼び出しとパラメータが何らかの形でネットワークを介して転送され、別のVM/実行可能ファイル内で実装が行われる場合を指します。戻り値は、呼び出しが行われたマシンへ逆の経路をたどって戻ります。 ",-1),t("p",null," 呼び出しが行われたマシンをクライアント、実装が置かれているマシンをサーバーと考えるのが最も簡単です。しかし、必ずしもそうである必要はありません。RPC呼び出しは、ピアアーキテクチャの一部として両方向で発生する可能性があります。ただし、話を単純にするために、クライアント/サーバー展開を想定しましょう。 ",-1)])),_:1}),i(s,{title:"RPCフレームワークの基本",id:"rpc-framework-fundamentals"},{default:o(()=>[n[22]||(n[22]=t("p",null," どのRPCフレームワークも、特定の基本要素を提供しなければなりません。これらは、従来のITインフラストラクチャ内でリモートプロシージャ呼び出しを実装する際に不可欠です。用語は様々であり、責任分担も異なる場合がありますが、すべてのRPCフレームワークは以下を提供する必要があります。 ",-1)),i(k,{type:"decimal"},{default:o(()=>[n[19]||(n[19]=t("li",null,[l(" リモートで呼び出されるプロシージャを宣言する方法。オブジェクト指向プログラミングでは、インターフェースが論理的な選択肢です。これは、現在の言語が提供するインターフェース構造であるか、"),t("a",{href:"https://webidl.spec.whatwg.org/"},"W3Cで使われているWeb IDL"),l("のような言語に依存しない標準である可能性があります。 ")],-1)),n[20]||(n[20]=t("li",null," パラメータと戻り値に使用される型を指定する手段。ここでも、言語に依存しない標準を使用できます。しかし、現在の言語で標準のデータ型宣言にアノテーションを付ける方が簡単な場合もあります。 ",-1)),t("li",null,[n[14]||(n[14]=l(" ヘルパークラス（ ")),i(a,{style:{}},{default:o(()=>n[13]||(n[13]=[l("クライアントスタブ")])),_:1}),n[15]||(n[15]=l(" ）は、プロシージャ呼び出しをネットワーク経由で送信できる形式に変換し、結果の戻り値をアンパックするために使用されます。これらのスタブは、コンパイルプロセス中または実行時に動的に作成できます。 "))]),t("li",null,[n[17]||(n[17]=l(" 基盤となる ")),i(a,{style:{}},{default:o(()=>n[16]||(n[16]=[l("RPCランタイム")])),_:1}),n[18]||(n[18]=l(" がヘルパークラスを管理し、リモートプロシージャ呼び出しのライフサイクルを監督します。サーバー側では、このランタイムは継続的にリクエストを処理できるように、何らかのサーバーに組み込む必要があります。 "))]),n[21]||(n[21]=t("li",null," 呼び出されるプロシージャを表現し、送信されるデータをシリアライズし、ネットワーク上で情報を変換するためのプロトコルを選択（または定義）する必要があります。過去には、ゼロから新しいプロトコルを定義した技術（CORBAのIIOP）もあれば、再利用に焦点を当てた技術（SOAPのHTTP POST）もありました。 ",-1))]),_:1})]),_:1}),i(s,{title:"マーシャリング vs. シリアライゼーション",id:"marshaling-vs-serialization"},{default:o(()=>[t("p",null,[n[25]||(n[25]=l(" RPCフレームワークでは、「 ")),i(a,{style:{}},{default:o(()=>n[23]||(n[23]=[l("マーシャリング")])),_:1}),n[26]||(n[26]=l(" 」と「 ")),i(a,{style:{}},{default:o(()=>n[24]||(n[24]=[l("アンマーシャリング")])),_:1}),n[27]||(n[27]=l(" 」という言葉を使います。これは、ネットワーク経由で送信される情報をパックおよびアンパックするプロセスです。これはシリアライゼーションのスーパーセットと考えることができます。マーシャリングでは、オブジェクトをシリアライズしますが、呼び出されるプロシージャと、その呼び出しが行われたコンテキストに関する情報もパッケージ化する必要があります。 "))])]),_:1}),n[28]||(n[28]=t("p",null,[l(" RPCのコアコンセプトを導入したところで、サンプルアプリケーションを構築して"),t("code",null,"kotlinx.rpc"),l("でどのように適用されるかを見てみましょう。 ")],-1))]),_:1}),i(s,{title:"Hello, kotlinx.rpc",id:"hello-kotlinx-rpc"},{default:o(()=>[n[118]||(n[118]=t("p",null," ネットワーク経由でピザを注文するアプリケーションを作成してみましょう。コードをできるだけシンプルに保つため、コンソールベースのクライアントを使用します。 ",-1)),i(s,{title:"プロジェクトを作成する",id:"create-project"},{default:o(()=>[n[44]||(n[44]=t("p",null,"まず、クライアントとサーバーの両方の実装を含むプロジェクトを作成します。",-1)),n[45]||(n[45]=t("p",null," より複雑なアプリケーションでは、クライアントとサーバーで個別のモジュールを使用するのがベストプラクティスです。ただし、このチュートリアルでは簡略化のため、両方で単一のモジュールを使用します。 ",-1)),i(d,{id:"create-project-procedure"},{default:o(()=>[i(r,null,{default:o(()=>n[29]||(n[29]=[t("a",{href:"https://www.jetbrains.com/idea/download"},"IntelliJ IDEA",-1),l(" を起動します。 ")])),_:1}),i(r,null,{default:o(()=>[t("p",null,[n[31]||(n[31]=l(" ようこそ画面で、")),i(z,null,{default:o(()=>n[30]||(n[30]=[l("New Project")])),_:1}),n[32]||(n[32]=l(" をクリックします。 "))]),t("p",null,[n[34]||(n[34]=l(" または、メインメニューから ")),i(x,null,{default:o(()=>n[33]||(n[33]=[l("File | New | Project")])),_:1}),n[35]||(n[35]=l(" を選択します。 "))])]),_:1}),i(r,null,{default:o(()=>[i(z,null,{default:o(()=>n[36]||(n[36]=[l("Name")])),_:1}),n[38]||(n[38]=l(" フィールドに、プロジェクト名として ")),i(p,null,{default:o(()=>n[37]||(n[37]=[l("KotlinRpcPizzaApp")])),_:1}),n[39]||(n[39]=l(" を入力します。 ")),n[40]||(n[40]=t("img",{src:w,alt:"IntelliJ 新規Kotlinプロジェクトウィンドウ",style:{},width:"706","border-effect":"rounded"},null,-1))]),_:1}),i(r,null,{default:o(()=>[n[42]||(n[42]=l(" 残りのデフォルト設定はそのままにして、")),i(z,null,{default:o(()=>n[41]||(n[41]=[l("Create")])),_:1}),n[43]||(n[43]=l(" をクリックします。 "))]),_:1})]),_:1}),n[46]||(n[46]=t("p",null," 通常、すぐにプロジェクトビルドファイルを構成するでしょう。しかし、それは技術の理解を深めるものではない実装の詳細であるため、そのステップには最後に立ち戻ります。 ",-1))]),_:1}),i(s,{title:"共有型を追加する",id:"shared-types"},{default:o(()=>[n[57]||(n[57]=t("p",null," あらゆるRPCプロジェクトの核となるのは、リモートで呼び出されるプロシージャを定義するインターフェースと、それらのプロシージャの定義に使用される型です。 ",-1)),n[58]||(n[58]=t("p",null," マルチモジュールプロジェクトでは、これらの型を共有する必要があります。しかし、この例では、このステップは不要です。 ",-1)),i(d,{id:"shared-types-procedure"},{default:o(()=>[i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[47]||(n[47]=[l("src/main/kotlin")])),_:1}),n[49]||(n[49]=l(" フォルダーに移動し、")),i(p,null,{default:o(()=>n[48]||(n[48]=[l("model")])),_:1}),n[50]||(n[50]=l(" という新しいサブパッケージを作成します。 "))]),_:1}),i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[51]||(n[51]=[l("model")])),_:1}),n[53]||(n[53]=l(" パッケージ内に、次の実装を含む新しい ")),i(p,null,{default:o(()=>n[52]||(n[52]=[l("PizzaShop.kt")])),_:1}),n[54]||(n[54]=l(" ファイルを作成します。 ")),i(e,{lang:"kotlin",code:`package com.example.model

import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable
import kotlinx.rpc.annotations.Rpc

@Rpc
interface PizzaShop {
    suspend fun orderPizza(pizza: Pizza): Receipt
}

@Serializable
class Pizza(val name: String)

@Serializable
class Receipt(val amount: Double)`}),n[55]||(n[55]=t("p",null,[l(" インターフェースには、"),t("code",null,"kotlinx.rpc"),l(" ライブラリの "),t("code",null,"@Rpc"),l(" アノテーションが必要です。 ")],-1)),n[56]||(n[56]=t("p",null,[l(" ネットワーク経由で情報を転送するために "),t("a",{href:"https://github.com/Kotlin/kotlinx.serialization"},[t("code",null,"kotlinx.serialization")]),l(" を使用しているため、パラメータで使用される型には "),t("code",null,"Serializable"),l(" アノテーションを付ける必要があります。 ")],-1))]),_:1})]),_:1})]),_:1}),i(s,{title:"クライアントを実装する",id:"client-implementation"},{default:o(()=>[i(d,{id:"client-impl-procedure"},{default:o(()=>[i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[59]||(n[59]=[l("src/main/kotlin")])),_:1}),n[61]||(n[61]=l(" に移動し、新しい ")),i(p,null,{default:o(()=>n[60]||(n[60]=[l("Client.kt")])),_:1}),n[62]||(n[62]=l(" ファイルを作成します。 "))]),_:1}),i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[63]||(n[63]=[l("Client.kt")])),_:1}),n[64]||(n[64]=l(" を開き、次の実装を追加します。 ")),i(e,{lang:"kotlin",code:`package com.example

import com.example.model.Pizza
import com.example.model.PizzaShop
import io.ktor.client.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlinx.rpc.withService
import kotlinx.rpc.krpc.serialization.json.json
import kotlinx.rpc.krpc.ktor.client.KtorRpcClient
import kotlinx.rpc.krpc.ktor.client.installKrpc
import kotlinx.rpc.krpc.ktor.client.rpc
import kotlinx.rpc.krpc.ktor.client.rpcConfig

fun main() = runBlocking {
    val ktorClient = HttpClient {
        installKrpc {
            waitForServices = true
        }
    }

    val client: KtorRpcClient = ktorClient.rpc {
        url {
            host = "localhost"
            port = 8080
            encodedPath = "pizza"
        }

        rpcConfig {
            serialization {
                json()
            }
        }
    }

    val pizzaShop: PizzaShop = client.withService<PizzaShop>()

    val receipt = pizzaShop.orderPizza(Pizza("Pepperoni"))
    println("Your pizza cost \${receipt.amount}")
    ktorClient.close()
}`})]),_:1})]),_:1}),n[79]||(n[79]=t("p",null," RPC呼び出しの準備と実行には、わずか25行のコードしか必要ありません。明らかに多くのことが行われているため、コードをセクションに分けて見ていきましょう。 ",-1)),t("p",null,[n[66]||(n[66]=t("code",null,"kotlinx.rpc",-1)),n[67]||(n[67]=l(" ライブラリは、クライアント側でランタイムをホストするために")),i(m,{href:"/ktor/client-create-new-application",summary:"リクエストを送信し、レスポンスを受信する最初のクライアントアプリケーションを作成します。"},{default:o(()=>n[65]||(n[65]=[l("Ktor クライアント")])),_:1}),n[68]||(n[68]=l("を使用します。ランタイムはKtorに結合されておらず、他の選択肢も可能ですが、これにより再利用が促進され、既存のKMPアプリケーションに")),n[69]||(n[69]=t("code",null,"kotlinx.rpc",-1)),n[70]||(n[70]=l("を簡単に統合できるようになります。 "))]),n[80]||(n[80]=t("p",null,[l(" KtorクライアントとKotlin RPCはどちらもコルーチンを中心に構築されているため、"),t("code",null,"runBlocking"),l("を使用して最初のコルーチンを作成し、その中でクライアントの残りの部分を実行します。 ")],-1)),i(e,{lang:"kotlin",code:`fun main() = runBlocking {
}`}),i(R,null,{default:o(()=>n[71]||(n[71]=[t("code",null,"runBlocking",-1),l(" は、本番コードではなく、スパイクやテストのために設計されていることに注意してください。 ")])),_:1}),t("p",null,[n[73]||(n[73]=l(" 次に、Ktorクライアントのインスタンスを標準的な方法で作成します。")),n[74]||(n[74]=t("code",null,"kotlinx.rpc",-1)),n[75]||(n[75]=l("は、情報の転送に内部的に")),i(m,{href:"/ktor/client-websockets",summary:"WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。"},{default:o(()=>n[72]||(n[72]=[l("WebSockets")])),_:1}),n[76]||(n[76]=l("プラグインを使用します。")),n[77]||(n[77]=t("code",null,"installKrpc()",-1)),n[78]||(n[78]=l("関数を使用して、それが読み込まれていることを確認するだけで十分です。 "))]),i(e,{lang:"kotlin",code:`    val ktorClient = HttpClient {
        installKrpc {
            waitForServices = true
        }
    }`}),n[81]||(n[81]=t("p",null,[l(" このKtorクライアントを作成したら、次にリモートプロシージャを呼び出すための"),t("code",null,"KtorRpcClient"),l("オブジェクトを作成します。サーバーの場所と情報の転送に使用されるメカニズムを設定する必要があります。 ")],-1)),i(e,{lang:"kotlin",code:`    val client: KtorRpcClient = ktorClient.rpc {
        url {
            host = "localhost"
            port = 8080
            encodedPath = "pizza"
        }

        rpcConfig {
            serialization {
                json()
            }
        }
    }`}),n[82]||(n[82]=t("p",null,[l(" この時点で、標準的なセットアップが完了し、問題領域に特化した機能を使用する準備が整いました。クライアントを使用して、"),t("code",null,"PizzaShop"),l("インターフェースのメソッドを実装するクライアントプロキシオブジェクトを作成できます。 ")],-1)),i(e,{lang:"kotlin","include-symbol":"pizzaShop",code:`package com.example

import com.example.model.Pizza
import com.example.model.PizzaShop
import io.ktor.client.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlinx.rpc.withService
import kotlinx.rpc.krpc.serialization.json.json
import kotlinx.rpc.krpc.ktor.client.KtorRpcClient
import kotlinx.rpc.krpc.ktor.client.installKrpc
import kotlinx.rpc.krpc.ktor.client.rpc
import kotlinx.rpc.krpc.ktor.client.rpcConfig

fun main() = runBlocking {
    val ktorClient = HttpClient {
        installKrpc {
            waitForServices = true
        }
    }

    val client: KtorRpcClient = ktorClient.rpc {
        url {
            host = "localhost"
            port = 8080
            encodedPath = "pizza"
        }

        rpcConfig {
            serialization {
                json()
            }
        }
    }

    val pizzaShop: PizzaShop = client.withService<PizzaShop>()

    /*
    val receipt = pizzaShop.orderPizza(Pizza("Pepperoni"))
    println("Your pizza cost \${receipt.amount}")
    */

    pizzaShop.orderPizza("AB12", Pizza("Pepperoni"))
    pizzaShop.orderPizza("AB12", Pizza("Hawaiian"))
    pizzaShop.orderPizza("AB12", Pizza("Calzone"))

    pizzaShop.orderPizza("CD34", Pizza("Margherita"))
    pizzaShop.orderPizza("CD34", Pizza("Sicilian"))
    pizzaShop.orderPizza("CD34", Pizza("California"))

    pizzaShop.viewOrders("AB12").collect {
        println("AB12 ordered \${it.name}")
    }

    pizzaShop.viewOrders("CD34").collect {
        println("CD34 ordered \${it.name}")
    }

    ktorClient.close()
}`}),n[83]||(n[83]=t("p",null," その後、リモートプロシージャ呼び出しを行い、その結果を使用できます。 ",-1)),i(e,{lang:"kotlin",code:'    val receipt = pizzaShop.orderPizza(Pizza("Pepperoni"))\n    println("Your pizza cost ${receipt.amount}")'}),n[84]||(n[84]=t("p",null," この時点で、非常に多くの作業が自動的に行われていることに注意してください。呼び出しの詳細とすべてのパラメータはメッセージに変換され、ネットワーク経由で送信され、その後、戻り値が受信されてデコードされます。この透過的な処理が、初期設定の成果です。 ",-1)),n[85]||(n[85]=t("p",null," 最後に、通常通りクライアントをシャットダウンする必要があります。 ",-1)),i(e,{lang:"kotlin",code:"    ktorClient.close()"})]),_:1}),i(s,{title:"サーバーを実装する",id:"server-implementation"},{default:o(()=>[n[100]||(n[100]=t("p",null," サーバー側の実装は2つの部分に分かれます。まず、インターフェースの実装を作成する必要があり、次に、それをサーバー内でホストする必要があります。 ",-1)),i(d,{id:"create-interface"},{default:o(()=>[i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[86]||(n[86]=[l("src/main/kotlin")])),_:1}),n[88]||(n[88]=l(" に移動し、新しい ")),i(p,null,{default:o(()=>n[87]||(n[87]=[l("Server.kt")])),_:1}),n[89]||(n[89]=l(" ファイルを作成します。 "))]),_:1}),i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[90]||(n[90]=[l("Server.kt")])),_:1}),n[91]||(n[91]=l(" を開き、次のインターフェースを追加します。 ")),i(e,{lang:"kotlin",code:`package com.example

import com.example.model.*
import io.ktor.server.application.*

class PizzaShopImpl : PizzaShop {
    override suspend fun orderPizza(pizza: Pizza): Receipt {
        return Receipt(7.89)
    }
}`}),n[92]||(n[92]=t("p",null," これは現実世界の実装ではありませんが、デモを動かすには十分です。 ",-1)),n[93]||(n[93]=t("p",null," 実装の2番目の部分はKtorに基づいています。 ",-1))]),_:1}),i(r,null,{default:o(()=>[n[94]||(n[94]=t("p",null," 同じファイルに次のコードを追加します。 ",-1)),i(e,{lang:"kotlin",code:`fun main() {
    embeddedServer(Netty, port = 8080) {
        module()
        println("Server running")
    }.start(wait = true)
}

fun Application.module() {
    install(Krpc)

    routing {
        rpc("/pizza") {
            rpcConfig {
                serialization {
                    json()
                }
            }

            registerService<PizzaShop> { PizzaShopImpl() }
        }
    }
}`}),n[95]||(n[95]=t("p",null,"内訳は次のとおりです。",-1)),n[96]||(n[96]=t("p",null," まず、構成に使用される指定された拡張関数を使用して、Ktor/Nettyのインスタンスを作成します。 ",-1)),i(e,{lang:"kotlin",code:`    embeddedServer(Netty, port = 8080) {
        module()
        println("Server running")
    }.start(wait = true)`}),n[97]||(n[97]=t("p",null,[l(" 次に、Ktor Application型を拡張するセットアップ関数を宣言します。これにより、"),t("code",null,"kotlinx.rpc"),l(" プラグインがインストールされ、1つ以上のルートが宣言されます。 ")],-1)),i(e,{lang:"kotlin",code:`fun Application.module() {
    install(Krpc)

    routing {
    }
}`}),n[98]||(n[98]=t("p",null,[l(" ルーティングセクション内では、Ktor Routing DSLに対する"),t("code",null,"kotlinx.rpc"),l("拡張機能を使用してエンドポイントを宣言します。クライアント側と同様に、URLを指定してシリアライゼーションを設定します。ただし、このケースでは、私たちの実装はそのURLで受信リクエストをリッスンします。 ")],-1)),i(e,{lang:"kotlin",code:`        rpc("/pizza") {
            rpcConfig {
                serialization {
                    json()
                }
            }

            registerService<PizzaShop> { PizzaShopImpl() }
        }`}),n[99]||(n[99]=t("p",null,[t("code",null,"registerService"),l(" を使用して、インターフェースの実装をRPCランタイムに提供することに注意してください。単一のインスタンスよりも多くが必要になる場合もありますが、それは後続の記事のトピックです。 ")],-1))]),_:1})]),_:1})]),_:1}),i(s,{title:"依存関係を追加する",id:"add-dependencies"},{default:o(()=>[n[108]||(n[108]=t("p",null,[l(" アプリケーションを実行するために必要なコードはすべて揃いましたが、現時点ではコンパイルすらできず、実行には程遠い状態です。"),t("a",{href:"https://start.ktor.io/p/kotlinx-rpc"},"kotlinx.rpc"),l("プラグインと共にKtor Project Generatorを使用するか、ビルドファイルを manually で構成することもできます。これもそれほど複雑ではありません。 ")],-1)),i(d,{id:"configure-build-files"},{default:o(()=>[i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[101]||(n[101]=[l("build.gradle.kts")])),_:1}),n[103]||(n[103]=l(" ファイルに、次のプラグインを追加します。 ")),i(e,{lang:"kotlin",code:`plugins {
    kotlin("jvm") version "2.2.0"
    kotlin("plugin.serialization") version "2.2.0"
    id("io.ktor.plugin") version "3.2.0"
    id("org.jetbrains.kotlinx.rpc.plugin") version "0.9.1"
}`}),n[104]||(n[104]=t("p",null," Kotlinプラグインの理由は明らかです。その他について説明します。 ",-1)),i(k,null,{default:o(()=>n[102]||(n[102]=[t("li",null,[t("code",null,"kotlinx.serialization"),l(" プラグインは、KotlinオブジェクトをJSONに変換するためのヘルパー型を生成するために必要です。"),t("code",null,"kotlinx.serialization"),l(" がリフレクションを使用しないことを覚えておいてください。 ")],-1),t("li",null," Ktorプラグインは、アプリケーションとそのすべての依存関係をバンドルするfat JARをビルドするために使用されます。 ",-1),t("li",null," RPCプラグインは、クライアント側のスタブを生成するために必要です。 ",-1)])),_:1})]),_:1}),i(r,null,{default:o(()=>[n[105]||(n[105]=l(" 次の依存関係を追加します。 ")),i(e,{lang:"kotlin",code:`    implementation("io.ktor:ktor-client-cio-jvm")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-client:0.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-client:0.9.1")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-server:0.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-server:0.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-serialization-json:0.9.1")
    implementation("ch.qos.logback:logback-classic:1.5.18")
    testImplementation(kotlin("test"))
}`}),n[106]||(n[106]=t("p",null,[l(" これにより、Ktorクライアントとサーバー、"),t("code",null,"kotlinx.rpc"),l("ランタイムのクライアント側とサーバー側の部分、および"),t("code",null,"kotlinx.rpc"),l("と"),t("code",null,"kotlinx-serialization"),l("を統合するためのライブラリが追加されます。 ")],-1)),n[107]||(n[107]=t("p",null," これにより、プロジェクトを実行してRPC呼び出しを開始できるようになります。 ",-1))]),_:1})]),_:1})]),_:1}),i(s,{title:"アプリケーションを実行する",id:"run-application"},{default:o(()=>[n[117]||(n[117]=t("p",null," デモを実行するには、以下の手順に従ってください。 ",-1)),i(d,{id:"run-app-procedure"},{default:o(()=>[i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[109]||(n[109]=[l("Server.kt")])),_:1}),n[110]||(n[110]=l(" ファイルに移動します。 "))]),_:1}),i(r,null,{default:o(()=>[n[113]||(n[113]=t("p",null,[l("IntelliJ IDEA で、"),t("code",null,"main()"),l(" 関数の横にある実行ボタン ("),t("img",{src:j,style:{},height:"16",width:"16",alt:"IntelliJ IDEA実行アイコン"}),l(") をクリックしてアプリケーションを起動します。")],-1)),t("p",null,[i(z,null,{default:o(()=>n[111]||(n[111]=[l("Run")])),_:1}),n[112]||(n[112]=l(" ツールパネルに次のような出力が表示されるはずです。 "))]),n[114]||(n[114]=t("img",{src:K,alt:"IntelliJ IDEAでのサーバー実行出力",style:{},width:"706","border-effect":"line"},null,-1))]),_:1}),i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[115]||(n[115]=[l("Client.kt")])),_:1}),n[116]||(n[116]=l(" ファイルに移動してアプリケーションを実行します。コンソールに次の出力が表示されるはずです。 ")),i(e,{lang:"shell",code:`                        Your pizza cost 7.89

                        Process finished with exit code 0`})]),_:1})]),_:1})]),_:1})]),_:1}),i(s,{title:"例を拡張する",id:"extend-the-example"},{default:o(()=>[n[133]||(n[133]=t("p",null," 最後に、将来の開発のための強固な基盤を確立するために、サンプルアプリケーションの複雑さを向上させましょう。 ",-1)),i(d,{id:"extend-server"},{default:o(()=>[i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[119]||(n[119]=[l("PizzaShop.kt")])),_:1}),n[120]||(n[120]=l(" ファイルで、クライアントIDを含むように")),n[121]||(n[121]=t("code",null,"orderPizza",-1)),n[122]||(n[122]=l("メソッドを拡張し、指定されたクライアントの保留中のすべての注文を返す")),n[123]||(n[123]=t("code",null,"viewOrders",-1)),n[124]||(n[124]=l("メソッドを追加します。 ")),i(e,{lang:"kotlin",code:`package com.example.model

import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable
import kotlinx.rpc.annotations.Rpc

@Rpc
interface PizzaShop {
    suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt
    fun viewOrders(clientID: String): Flow<Pizza>
}`}),n[125]||(n[125]=t("p",null,[t("code",null,"List"),l(" や "),t("code",null,"Set"),l(" ではなく "),t("code",null,"Flow"),l(" を返すことで、コルーチンライブラリの利点を活用できます。これにより、情報をクライアントにピザを1つずつストリーム配信できます。 ")],-1))]),_:1}),i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[126]||(n[126]=[l("Server.kt")])),_:1}),n[127]||(n[127]=l(" ファイルに移動し、現在の注文をリストのマップに格納することでこの機能を実装します。 ")),i(e,{lang:"kotlin",code:`class PizzaShopImpl : PizzaShop {
    private val openOrders = mutableMapOf<String, MutableList<Pizza>>()

    override suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt {
        if(openOrders.containsKey(clientID)) {
            openOrders[clientID]?.add(pizza)
        } else {
            openOrders[clientID] = mutableListOf(pizza)
        }
        return Receipt(3.45)
    }

    override fun viewOrders(clientID: String): Flow<Pizza> {
        val orders = openOrders[clientID]
        if (orders != null) {
            return flow {
                for (order in orders) {
                    emit(order)
                    delay(1000)
                }
            }
        }
        return flow {}
    }
}`}),n[128]||(n[128]=t("p",null,[l(" 各クライアントインスタンスに対して"),t("code",null,"PizzaShopImpl"),l("の新しいインスタンスが作成されることに注意してください。これにより、クライアントの状態を分離することでクライアント間の競合を回避します。ただし、これは単一サーバーインスタンス内のスレッドセーフティ、特に同じインスタンスが複数のサービスによって同時にアクセスされる場合の課題には対処しません。 ")],-1))]),_:1}),i(r,null,{default:o(()=>[i(p,null,{default:o(()=>n[129]||(n[129]=[l("Client.kt")])),_:1}),n[130]||(n[130]=l(" ファイルで、2つの異なるクライアントIDを使用して複数の注文を送信します。 ")),i(e,{lang:"kotlin",code:`    val pizzaShop: PizzaShop = client.withService<PizzaShop>()

    pizzaShop.orderPizza("AB12", Pizza("Pepperoni"))
    pizzaShop.orderPizza("AB12", Pizza("Hawaiian"))
    pizzaShop.orderPizza("AB12", Pizza("Calzone"))

    pizzaShop.orderPizza("CD34", Pizza("Margherita"))
    pizzaShop.orderPizza("CD34", Pizza("Sicilian"))
    pizzaShop.orderPizza("CD34", Pizza("California"))`}),n[131]||(n[131]=t("p",null,[l(" 次に、"),t("code",null,"Coroutines"),l(" ライブラリと "),t("code",null,"collect"),l(" メソッドを使用して結果を反復処理します。 ")],-1)),i(e,{lang:"kotlin",code:`    pizzaShop.viewOrders("AB12").collect {
        println("AB12 ordered \${it.name}")
    }

    pizzaShop.viewOrders("CD34").collect {
        println("CD34 ordered \${it.name}")
    }`})]),_:1}),i(r,null,{default:o(()=>n[132]||(n[132]=[l(" サーバーとクライアントを実行します。クライアントを実行すると、結果が段階的に表示されるのがわかります。 "),t("img",{src:b,alt:"クライアント出力が結果を段階的に表示",style:{},width:"706","border-effect":"line"},null,-1)])),_:1})]),_:1}),n[134]||(n[134]=t("p",null," 動作する例を作成したので、次にすべてがどのように機能するかをさらに深く掘り下げてみましょう。特に、Kotlin RPCと主要な2つの代替手段であるRESTおよびgRPCを比較検討します。 ",-1))]),_:1}),i(s,{title:"RPC vs. REST",id:"rpc-vs-rest"},{default:o(()=>[n[136]||(n[136]=t("p",null,[l(" RPCのアイデアはRESTよりもかなり古く、"),t("a",{href:"https://en.wikipedia.org/wiki/Remote_procedure_call"},"少なくとも1981年に遡ります"),l("。RESTと比較して、RPCベースのアプローチは統一インターフェース（HTTPリクエストタイプなど）に制約されず、コードでの扱いがはるかに簡単で、バイナリメッセージングのおかげでパフォーマンスが向上する可能性があります。 ")],-1)),n[137]||(n[137]=t("p",null," しかし、RESTには3つの大きな利点があります。 ",-1)),i(k,{type:"decimal"},{default:o(()=>n[135]||(n[135]=[t("li",null," ブラウザのJavaScriptクライアントから直接使用でき、したがってシングルページアプリケーションの一部として使用できます。RPCフレームワークは生成されたスタブとバイナリメッセージングに依存するため、JavaScriptエコシステムにはうまく適合しません。 ",-1),t("li",null,[l(" RESTは、機能がネットワークに関わる場合、それを明確にします。これにより、Martin Fowlerが指摘した"),t("a",{href:"https://martinfowler.com/articles/distributed-objects-microservices.html"},"分散オブジェクトのアンチパターン"),l("を回避するのに役立ちます。これは、チームがローカルプロシージャ呼び出しをリモート化することによるパフォーマンスと信頼性の影響を考慮せずに、OO設計を2つ以上の部分に分割した場合に発生します。 ")],-1),t("li",null," REST APIは、作成、ドキュメント化、監視、デバッグ、テストを比較的容易にする一連の規約に基づいて構築されています。これをサポートする膨大なツールエコシステムが存在します。 ",-1)])),_:1}),n[138]||(n[138]=t("p",null,[l(" これらのトレードオフは、Kotlin RPCが2つのシナリオで最もよく使用されることを意味します。第一に、"),t("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),l("を使用するKMPクライアントにおいて、第二に、クラウド上の連携するマイクロサービス間です。"),t("a",{href:"https://kotlinlang.org/docs/wasm-overview.html"},"Kotlin/Wasm"),l("の将来の発展により、"),t("code",null,"kotlinx.rpc"),l("はブラウザベースのアプリケーションにより適用可能になる可能性があります。 ")],-1))]),_:1}),i(s,{title:"Kotlin RPC vs. Google RPC",id:"kotlin-rpc-vs-google-rpc"},{default:o(()=>n[139]||(n[139]=[t("p",null," Google RPCは、現在のソフトウェア業界で支配的なRPCテクノロジーです。Protocol Buffers (protobuf) と呼ばれる標準は、言語に依存しないインターフェース定義言語 (IDL) を使用してデータ構造とメッセージペイロードを定義するために使用されます。これらのIDL定義は、様々なプログラミング言語に変換でき、コンパクトで効率的なバイナリ形式を使用してシリアライズされます。QuarkusやMicronautのようなマイクロサービスフレームワークは、すでにgRPCをサポートしています。 ",-1),t("p",null,[l(" Kotlin RPCがgRPCと競合することは困難であり、Kotlinコミュニティにとって利益もありません。幸いにも、そのような計画はありません。むしろ、"),t("code",null,"kotlinx.rpc"),l("がgRPCと互換性があり、相互運用可能であることが意図されています。"),t("code",null,"kotlinx.rpc"),l("サービスがgRPCをネットワークプロトコルとして使用したり、"),t("code",null,"kotlinx.rpc"),l("クライアントがgRPCサービスを呼び出したりすることが可能になります。"),t("code",null,"kotlinx.rpc"),l("は、デフォルトオプションとして"),t("a",{href:"https://kotlin.github.io/kotlinx-rpc/transport.html"},"独自のkRPCプロトコル"),l("を使用しますが（現在の例がそうであるように）、代わりにgRPCを選択することを妨げるものは何もありません。 ")],-1)])),_:1}),i(s,{title:"次のステップ",id:"next-steps"},{default:o(()=>n[140]||(n[140]=[t("p",null,[l(" Kotlin RPCは、サービスを作成および利用するためのRESTやGraphQLに代わる選択肢を提供し、Kotlinエコシステムを新しい方向に拡張します。Ktor、コルーチン、"),t("code",null,"kotlinx-serialization"),l("などの実績のあるライブラリとフレームワークの上に構築されています。Kotlin MultiplatformやCompose Multiplatformの利用を検討しているチームにとって、分散メッセージングのためのシンプルで効率的なオプションとなるでしょう。 ")],-1),t("p",null,[l(" この紹介で興味を持たれた場合は、"),t("a",{href:"https://kotlin.github.io/kotlinx-rpc/get-started.html"},[l("公式の"),t("code",null,"kotlinx.rpc"),l("ドキュメント")]),l("と"),t("a",{href:"https://github.com/Kotlin/kotlinx-rpc/tree/main/samples"},"サンプル"),l("をぜひご確認ください。 ")],-1),t("p",null,[t("code",null,"kotlinx.rpc"),l(" ライブラリはまだ初期段階にあるため、ぜひ探索し、フィードバックを共有してください。バグや機能リクエストは"),t("a",{href:"https://youtrack.jetbrains.com/issues/KRPC"},"YouTrack"),l("で、一般的な議論は"),t("a",{href:"https://kotlinlang.slack.com/archives/C072YJ3Q91V"},"Slack"),l("（"),t("a",{href:"https://surveys.jetbrains.com/s3/kotlin-slack-sign-up"},"アクセスリクエスト"),l("）で行われています。 ")],-1)])),_:1})]),_:1})])}const H=I(A,[["render",B]]);export{F as __pageData,H as default};
