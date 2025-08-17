<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin RPC の最初のステップ" id="tutorial-first-steps-with-kotlin-rpc">
    <show-structure for="chapter" depth="2"/>
    <web-summary>
        RPC の基本を学び、この包括的なガイドで RPC と REST の詳細な比較を探ります。Kotlin RPC を使用して最初のアプリケーションを作成する方法を学びましょう。
    </web-summary>
    <link-summary>
        Kotlin RPC と Ktor を使用して最初のアプリケーションを作成する方法を学びましょう。
    </link-summary>
    <card-summary>
        Kotlin RPC と Ktor を使用して最初のアプリケーションを作成する方法を学びましょう。
    </card-summary>
    <tldr>
        <var name="example_name" value="tutorial-kotlin-rpc-app"/>
        <p>
            <b>コード例</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
                %example_name%
            </a>
        </p>
        <p>
            <b>使用されているプラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">Routing</Links>,
            <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
            <a href="https://github.com/Kotlin/kotlinx-rpc">kotlinx.rpc</a>
        </p>
    </tldr>
    <p>
        Kotlin RPC (Remote Procedure Call) は、Kotlinエコシステムに加わった新しく魅力的な機能で、確立された基盤に基づいて構築されており、<code>kotlinx.rpc</code> ライブラリ上で動作します。
    </p>
    <p>
        <code>kotlinx.rpc</code> ライブラリを使用すると、通常のKotlin言語構成のみを使用してネットワーク境界を越えてプロシージャ呼び出しを行うことができます。そのため、REST と Google RPC (gRPC) の両方に対する代替手段を提供します。
    </p>
    <p>
        この記事では、Kotlin RPC のコアコンセプトを紹介し、シンプルなアプリケーションを構築します。その後、ご自身のプロジェクトでこのライブラリを評価することができます。
    </p>
    <chapter title="前提条件" id="prerequisites">
        <p>
            このチュートリアルでは、Kotlin プログラミングの基本的な理解があることを前提としています。Kotlin を初めて使用する場合は、いくつかの<a href="https://kotlinlang.org/docs/getting-started.html">入門資料</a>を確認することをお勧めします。
        </p>
        <p>最高の体験を得るために、統合開発環境 (IDE) として <a
                href="https://www.jetbrains.com/idea/download">IntelliJ
            IDEA Ultimate</a> の使用をお勧めします。これは、生産性を向上させる包括的なサポートとツールを提供するためです。
        </p>
    </chapter>
    <chapter title="RPC とは何か？" id="what-is-rpc">
        <chapter title="ローカルプロシージャ呼び出し vs. リモートプロシージャ呼び出し" id="local-vs-remote">
            <p>
                プログラミング経験がある人なら誰でも、プロシージャ呼び出しの概念に精通しているでしょう。これはあらゆるプログラミング言語における基本的な概念です。技術的には、これらは常に同じプログラム内で実行されるため、ローカルプロシージャ呼び出しです。
            </p>
            <p>
                リモートプロシージャ呼び出しとは、関数呼び出しとパラメータが何らかの形でネットワークを介して転送され、別のVM/実行可能ファイル内で実装が行われる場合を指します。戻り値は、呼び出しが行われたマシンへ逆の経路をたどって戻ります。
            </p>
            <p>
                呼び出しが行われたマシンをクライアント、実装が置かれているマシンをサーバーと考えるのが最も簡単です。しかし、必ずしもそうである必要はありません。RPC呼び出しは、ピアアーキテクチャの一部として両方向で発生する可能性があります。ただし、話を単純にするために、クライアント/サーバー展開を想定しましょう。
            </p>
        </chapter>
        <chapter title="RPCフレームワークの基本" id="rpc-framework-fundamentals">
            <p>
                どのRPCフレームワークも、特定の基本要素を提供しなければなりません。これらは、従来のITインフラストラクチャ内でリモートプロシージャ呼び出しを実装する際に不可欠です。用語は様々であり、責任分担も異なる場合がありますが、すべてのRPCフレームワークは以下を提供する必要があります。
            </p>
            <list type="decimal">
                <li>
                    リモートで呼び出されるプロシージャを宣言する方法。オブジェクト指向プログラミングでは、インターフェースが論理的な選択肢です。これは、現在の言語が提供するインターフェース構造であるか、<a
                        href="https://webidl.spec.whatwg.org/">W3Cで使われているWeb IDL</a>のような言語に依存しない標準である可能性があります。
                </li>
                <li>
                    パラメータと戻り値に使用される型を指定する手段。ここでも、言語に依存しない標準を使用できます。しかし、現在の言語で標準のデータ型宣言にアノテーションを付ける方が簡単な場合もあります。
                </li>
                <li>
                    ヘルパークラス（
                    <format style="italic">クライアントスタブ</format>
                    ）は、プロシージャ呼び出しをネットワーク経由で送信できる形式に変換し、結果の戻り値をアンパックするために使用されます。これらのスタブは、コンパイルプロセス中または実行時に動的に作成できます。
                </li>
                <li>
                    基盤となる
                    <format style="italic">RPCランタイム</format>
                    がヘルパークラスを管理し、リモートプロシージャ呼び出しのライフサイクルを監督します。サーバー側では、このランタイムは継続的にリクエストを処理できるように、何らかのサーバーに組み込む必要があります。
                </li>
                <li>
                    呼び出されるプロシージャを表現し、送信されるデータをシリアライズし、ネットワーク上で情報を変換するためのプロトコルを選択（または定義）する必要があります。過去には、ゼロから新しいプロトコルを定義した技術（CORBAのIIOP）もあれば、再利用に焦点を当てた技術（SOAPのHTTP POST）もありました。
                </li>
            </list>
        </chapter>
        <chapter title="マーシャリング vs. シリアライゼーション" id="marshaling-vs-serialization">
            <p>
                RPCフレームワークでは、「
                <format style="italic">マーシャリング</format>
                」と「
                <format style="italic">アンマーシャリング</format>
                」という言葉を使います。これは、ネットワーク経由で送信される情報をパックおよびアンパックするプロセスです。これはシリアライゼーションのスーパーセットと考えることができます。マーシャリングでは、オブジェクトをシリアライズしますが、呼び出されるプロシージャと、その呼び出しが行われたコンテキストに関する情報もパッケージ化する必要があります。
            </p>
        </chapter>
        <p>
            RPCのコアコンセプトを導入したところで、サンプルアプリケーションを構築して<code>kotlinx.rpc</code>でどのように適用されるかを見てみましょう。
        </p>
    </chapter>
    <chapter title="Hello, kotlinx.rpc" id="hello-kotlinx-rpc">
        <p>
            ネットワーク経由でピザを注文するアプリケーションを作成してみましょう。コードをできるだけシンプルに保つため、コンソールベースのクライアントを使用します。
        </p>
        <chapter title="プロジェクトを作成する" id="create-project">
            <p>まず、クライアントとサーバーの両方の実装を含むプロジェクトを作成します。</p>
            <p>
                より複雑なアプリケーションでは、クライアントとサーバーで個別のモジュールを使用するのがベストプラクティスです。ただし、このチュートリアルでは簡略化のため、両方で単一のモジュールを使用します。
            </p>
            <procedure id="create-project-procedure">
                <step>
                    <a href="https://www.jetbrains.com/idea/download">IntelliJ IDEA</a> を起動します。
                </step>
                <step>
                    <p>
                        ようこそ画面で、<control>New Project</control> をクリックします。
                    </p>
                    <p>
                        または、メインメニューから <ui-path>File | New | Project</ui-path> を選択します。
                    </p>
                </step>
                <step>
                    <control>Name</control>
                    フィールドに、プロジェクト名として
                    <Path>KotlinRpcPizzaApp</Path>
                    を入力します。
                    <img src="tutorial_kotlin_rpc_intellij_project.png" alt="IntelliJ 新規Kotlinプロジェクトウィンドウ"
                         style="block" width="706" border-effect="rounded"/>
                </step>
                <step>
                    残りのデフォルト設定はそのままにして、<control>Create</control> をクリックします。
                </step>
            </procedure>
            <p>
                通常、すぐにプロジェクトビルドファイルを構成するでしょう。しかし、それは技術の理解を深めるものではない実装の詳細であるため、そのステップには最後に立ち戻ります。
            </p>
        </chapter>
        <chapter title="共有型を追加する" id="shared-types">
            <p>
                あらゆるRPCプロジェクトの核となるのは、リモートで呼び出されるプロシージャを定義するインターフェースと、それらのプロシージャの定義に使用される型です。
            </p>
            <p>
                マルチモジュールプロジェクトでは、これらの型を共有する必要があります。しかし、この例では、このステップは不要です。
            </p>
            <procedure id="shared-types-procedure">
                <step>
                    <Path>src/main/kotlin</Path> フォルダーに移動し、<Path>model</Path> という新しいサブパッケージを作成します。
                </step>
                <step>
                    <Path>model</Path> パッケージ内に、次の実装を含む新しい <Path>PizzaShop.kt</Path> ファイルを作成します。
                    <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.coroutines.flow.Flow&#10;import kotlinx.serialization.Serializable&#10;import kotlinx.rpc.annotations.Rpc&#10;&#10;@Rpc&#10;interface PizzaShop {&#10;    suspend fun orderPizza(pizza: Pizza): Receipt&#10;}&#10;&#10;@Serializable&#10;class Pizza(val name: String)&#10;&#10;@Serializable&#10;class Receipt(val amount: Double)"/>
                    <p>
                        インターフェースには、<code>kotlinx.rpc</code> ライブラリの <code>@Rpc</code> アノテーションが必要です。
                    </p>
                    <p>
                        ネットワーク経由で情報を転送するために <a href="https://github.com/Kotlin/kotlinx.serialization"><code>kotlinx.serialization</code></a> を使用しているため、パラメータで使用される型には <code>Serializable</code> アノテーションを付ける必要があります。
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="クライアントを実装する" id="client-implementation">
            <procedure id="client-impl-procedure">
                <step>
                    <Path>src/main/kotlin</Path> に移動し、新しい <Path>Client.kt</Path> ファイルを作成します。
                </step>
                <step>
                    <Path>Client.kt</Path> を開き、次の実装を追加します。
                    <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.Pizza&#10;import com.example.model.PizzaShop&#10;import io.ktor.client.*&#10;import io.ktor.http.*&#10;import kotlinx.coroutines.runBlocking&#10;import kotlinx.rpc.withService&#10;import kotlinx.rpc.krpc.serialization.json.json&#10;import kotlinx.rpc.krpc.ktor.client.KtorRpcClient&#10;import kotlinx.rpc.krpc.ktor.client.installKrpc&#10;import kotlinx.rpc.krpc.ktor.client.rpc&#10;import kotlinx.rpc.krpc.ktor.client.rpcConfig&#10;&#10;fun main() = runBlocking {&#10;    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }&#10;&#10;    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }&#10;&#10;    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)&#10;    ktorClient.close()&#10;}"/>
                </step>
            </procedure>
            <p>
                RPC呼び出しの準備と実行には、わずか25行のコードしか必要ありません。明らかに多くのことが行われているため、コードをセクションに分けて見ていきましょう。
            </p>
            <p>
                <code>kotlinx.rpc</code> ライブラリは、クライアント側でランタイムをホストするために<Links href="/ktor/client-create-new-application" summary="リクエストを送信し、レスポンスを受信する最初のクライアントアプリケーションを作成します。">Ktor
                クライアント</Links>を使用します。ランタイムはKtorに結合されておらず、他の選択肢も可能ですが、これにより再利用が促進され、既存のKMPアプリケーションに<code>kotlinx.rpc</code>を簡単に統合できるようになります。
            </p>
            <p>
                KtorクライアントとKotlin RPCはどちらもコルーチンを中心に構築されているため、<code>runBlocking</code>を使用して最初のコルーチンを作成し、その中でクライアントの残りの部分を実行します。
            </p>
            <code-block lang="kotlin" code="fun main() = runBlocking {&#10;}"/>
            <tip>
                <code>runBlocking</code> は、本番コードではなく、スパイクやテストのために設計されていることに注意してください。
            </tip>
            <p>
                次に、Ktorクライアントのインスタンスを標準的な方法で作成します。<code>kotlinx.rpc</code>は、情報の転送に内部的に<Links href="/ktor/client-websockets" summary="WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。">WebSockets</Links>プラグインを使用します。<code>installKrpc()</code>関数を使用して、それが読み込まれていることを確認するだけで十分です。
            </p>
            <code-block lang="kotlin" code="    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }"/>
            <p>
                このKtorクライアントを作成したら、次にリモートプロシージャを呼び出すための<code>KtorRpcClient</code>オブジェクトを作成します。サーバーの場所と情報の転送に使用されるメカニズムを設定する必要があります。
            </p>
            <code-block lang="kotlin" code="    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }"/>
            <p>
                この時点で、標準的なセットアップが完了し、問題領域に特化した機能を使用する準備が整いました。クライアントを使用して、<code>PizzaShop</code>インターフェースのメソッドを実装するクライアントプロキシオブジェクトを作成できます。
            </p>
            <code-block lang="kotlin"
                        include-symbol="pizzaShop" code="package com.example&#10;&#10;import com.example.model.Pizza&#10;import com.example.model.PizzaShop&#10;import io.ktor.client.*&#10;import io.ktor.http.*&#10;import kotlinx.coroutines.runBlocking&#10;import kotlinx.rpc.withService&#10;import kotlinx.rpc.krpc.serialization.json.json&#10;import kotlinx.rpc.krpc.ktor.client.KtorRpcClient&#10;import kotlinx.rpc.krpc.ktor.client.installKrpc&#10;import kotlinx.rpc.krpc.ktor.client.rpc&#10;import kotlinx.rpc.krpc.ktor.client.rpcConfig&#10;&#10;fun main() = runBlocking {&#10;    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }&#10;&#10;    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }&#10;&#10;    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    /*&#10;    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)&#10;    */&#10;&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Pepperoni&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Hawaiian&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Calzone&quot;))&#10;&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Margherita&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Sicilian&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;California&quot;))&#10;&#10;    pizzaShop.viewOrders(&quot;AB12&quot;).collect {&#10;        println(&quot;AB12 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    pizzaShop.viewOrders(&quot;CD34&quot;).collect {&#10;        println(&quot;CD34 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    ktorClient.close()&#10;}"/>
            <p>
                その後、リモートプロシージャ呼び出しを行い、その結果を使用できます。
            </p>
            <code-block lang="kotlin" code="    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)"/>
            <p>
                この時点で、非常に多くの作業が自動的に行われていることに注意してください。呼び出しの詳細とすべてのパラメータはメッセージに変換され、ネットワーク経由で送信され、その後、戻り値が受信されてデコードされます。この透過的な処理が、初期設定の成果です。
            </p>
            <p>
                最後に、通常通りクライアントをシャットダウンする必要があります。
            </p>
            <code-block lang="kotlin" code="    ktorClient.close()"/>
        </chapter>
        <chapter title="サーバーを実装する" id="server-implementation">
            <p>
                サーバー側の実装は2つの部分に分かれます。まず、インターフェースの実装を作成する必要があり、次に、それをサーバー内でホストする必要があります。
            </p>
            <procedure id="create-interface">
                <step>
                    <Path>src/main/kotlin</Path> に移動し、新しい <Path>Server.kt</Path> ファイルを作成します。
                </step>
                <step>
                    <Path>Server.kt</Path> を開き、次のインターフェースを追加します。
                    <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.*&#10;import io.ktor.server.application.*&#10;&#10;class PizzaShopImpl : PizzaShop {&#10;    override suspend fun orderPizza(pizza: Pizza): Receipt {&#10;        return Receipt(7.89)&#10;    }&#10;}"/>
                    <p>
                        これは現実世界の実装ではありませんが、デモを動かすには十分です。
                    </p>
                    <p>
                        実装の2番目の部分はKtorに基づいています。
                    </p>
                </step>
                <step>
                    <p>
                        同じファイルに次のコードを追加します。
                    </p>
                    <code-block lang="kotlin" code="fun main() {&#10;    embeddedServer(Netty, port = 8080) {&#10;        module()&#10;        println(&quot;Server running&quot;)&#10;    }.start(wait = true)&#10;}&#10;&#10;fun Application.module() {&#10;    install(Krpc)&#10;&#10;    routing {&#10;        rpc(&quot;/pizza&quot;) {&#10;            rpcConfig {&#10;                serialization {&#10;                    json()&#10;                }&#10;            }&#10;&#10;            registerService&lt;PizzaShop&gt; { PizzaShopImpl() }&#10;        }&#10;    }&#10;}"/>
                    <p>内訳は次のとおりです。</p>
                    <p>
                        まず、構成に使用される指定された拡張関数を使用して、Ktor/Nettyのインスタンスを作成します。
                    </p>
                    <code-block lang="kotlin" code="    embeddedServer(Netty, port = 8080) {&#10;        module()&#10;        println(&quot;Server running&quot;)&#10;    }.start(wait = true)"/>
                    <p>
                        次に、Ktor Application型を拡張するセットアップ関数を宣言します。これにより、<code>kotlinx.rpc</code> プラグインがインストールされ、1つ以上のルートが宣言されます。
                    </p>
                    <code-block lang="kotlin" code="fun Application.module() {&#10;    install(Krpc)&#10;&#10;    routing {&#10;    }&#10;}"/>
                    <p>
                        ルーティングセクション内では、Ktor Routing DSLに対する<code>kotlinx.rpc</code>拡張機能を使用してエンドポイントを宣言します。クライアント側と同様に、URLを指定してシリアライゼーションを設定します。ただし、このケースでは、私たちの実装はそのURLで受信リクエストをリッスンします。
                    </p>
                    <code-block lang="kotlin" code="        rpc(&quot;/pizza&quot;) {&#10;            rpcConfig {&#10;                serialization {&#10;                    json()&#10;                }&#10;            }&#10;&#10;            registerService&lt;PizzaShop&gt; { PizzaShopImpl() }&#10;        }"/>
                    <p>
                        <code>registerService</code> を使用して、インターフェースの実装をRPCランタイムに提供することに注意してください。単一のインスタンスよりも多くが必要になる場合もありますが、それは後続の記事のトピックです。
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="依存関係を追加する" id="add-dependencies">
            <p>
                アプリケーションを実行するために必要なコードはすべて揃いましたが、現時点ではコンパイルすらできず、実行には程遠い状態です。<a href="https://start.ktor.io/p/kotlinx-rpc">kotlinx.rpc</a>プラグインと共にKtor Project Generatorを使用するか、ビルドファイルを manually で構成することもできます。これもそれほど複雑ではありません。
            </p>
            <procedure id="configure-build-files">
                <step>
                    <Path>build.gradle.kts</Path>
                    ファイルに、次のプラグインを追加します。
                    <code-block lang="kotlin" code="plugins {&#10;    kotlin(&quot;jvm&quot;) version &quot;2.2.0&quot;&#10;    kotlin(&quot;plugin.serialization&quot;) version &quot;2.2.0&quot;&#10;    id(&quot;io.ktor.plugin&quot;) version &quot;3.2.0&quot;&#10;    id(&quot;org.jetbrains.kotlinx.rpc.plugin&quot;) version &quot;0.9.1&quot;&#10;}"/>
                    <p>
                        Kotlinプラグインの理由は明らかです。その他について説明します。
                    </p>
                    <list>
                        <li>
                            <code>kotlinx.serialization</code> プラグインは、KotlinオブジェクトをJSONに変換するためのヘルパー型を生成するために必要です。<code>kotlinx.serialization</code> がリフレクションを使用しないことを覚えておいてください。
                        </li>
                        <li>
                            Ktorプラグインは、アプリケーションとそのすべての依存関係をバンドルするfat JARをビルドするために使用されます。
                        </li>
                        <li>
                            RPCプラグインは、クライアント側のスタブを生成するために必要です。
                        </li>
                    </list>
                </step>
                <step>
                    次の依存関係を追加します。
                    <code-block lang="kotlin" code="    implementation(&quot;io.ktor:ktor-client-cio-jvm&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-client:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-client:0.9.1&quot;)&#10;    implementation(&quot;io.ktor:ktor-server-netty-jvm&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-server:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-server:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-serialization-json:0.9.1&quot;)&#10;    implementation(&quot;ch.qos.logback:logback-classic:1.5.18&quot;)&#10;    testImplementation(kotlin(&quot;test&quot;))&#10;}"/>
                    <p>
                        これにより、Ktorクライアントとサーバー、<code>kotlinx.rpc</code>ランタイムのクライアント側とサーバー側の部分、および<code>kotlinx.rpc</code>と<code>kotlinx-serialization</code>を統合するためのライブラリが追加されます。
                    </p>
                    <p>
                        これにより、プロジェクトを実行してRPC呼び出しを開始できるようになります。
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="アプリケーションを実行する" id="run-application">
            <p>
                デモを実行するには、以下の手順に従ってください。
            </p>
            <procedure id="run-app-procedure">
                <step>
                    <Path>Server.kt</Path> ファイルに移動します。
                </step>
                <step>
                    <p>IntelliJ IDEA で、<code>main()</code> 関数の横にある実行ボタン
                        (<img src="intellij_idea_gutter_icon.svg"
                              style="inline" height="16" width="16"
                              alt="IntelliJ IDEA実行アイコン"/>)
                        をクリックしてアプリケーションを起動します。</p>
                    <p>
                        <control>Run</control> ツールパネルに次のような出力が表示されるはずです。
                    </p>
                    <img src="tutorial_kotlin_rpc_run_server.png" alt="IntelliJ IDEAでのサーバー実行出力"
                         style="block" width="706" border-effect="line"/>
                </step>
                <step>
                    <Path>Client.kt</Path> ファイルに移動してアプリケーションを実行します。コンソールに次の出力が表示されるはずです。
                    <code-block lang="shell" code="                        Your pizza cost 7.89&#10;&#10;                        Process finished with exit code 0"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="例を拡張する" id="extend-the-example">
        <p>
            最後に、将来の開発のための強固な基盤を確立するために、サンプルアプリケーションの複雑さを向上させましょう。
        </p>
        <procedure id="extend-server">
            <step>
                <Path>PizzaShop.kt</Path>
                ファイルで、クライアントIDを含むように<code>orderPizza</code>メソッドを拡張し、指定されたクライアントの保留中のすべての注文を返す<code>viewOrders</code>メソッドを追加します。
                <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.coroutines.flow.Flow&#10;import kotlinx.serialization.Serializable&#10;import kotlinx.rpc.annotations.Rpc&#10;&#10;@Rpc&#10;interface PizzaShop {&#10;    suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt&#10;    fun viewOrders(clientID: String): Flow&lt;Pizza&gt;&#10;}"/>
                <p>
                    <code>List</code> や <code>Set</code> ではなく <code>Flow</code> を返すことで、コルーチンライブラリの利点を活用できます。これにより、情報をクライアントにピザを1つずつストリーム配信できます。
                </p>
            </step>
            <step>
                <Path>Server.kt</Path>
                ファイルに移動し、現在の注文をリストのマップに格納することでこの機能を実装します。
                <code-block lang="kotlin" code="class PizzaShopImpl : PizzaShop {&#10;    private val openOrders = mutableMapOf&lt;String, MutableList&lt;Pizza&gt;&gt;()&#10;&#10;    override suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt {&#10;        if(openOrders.containsKey(clientID)) {&#10;            openOrders[clientID]?.add(pizza)&#10;        } else {&#10;            openOrders[clientID] = mutableListOf(pizza)&#10;        }&#10;        return Receipt(3.45)&#10;    }&#10;&#10;    override fun viewOrders(clientID: String): Flow&lt;Pizza&gt; {&#10;        val orders = openOrders[clientID]&#10;        if (orders != null) {&#10;            return flow {&#10;                for (order in orders) {&#10;                    emit(order)&#10;                    delay(1000)&#10;                }&#10;            }&#10;        }&#10;        return flow {}&#10;    }&#10;}"/>
                <p>
                    各クライアントインスタンスに対して<code>PizzaShopImpl</code>の新しいインスタンスが作成されることに注意してください。これにより、クライアントの状態を分離することでクライアント間の競合を回避します。ただし、これは単一サーバーインスタンス内のスレッドセーフティ、特に同じインスタンスが複数のサービスによって同時にアクセスされる場合の課題には対処しません。
                </p>
            </step>
            <step>
                <Path>Client.kt</Path>
                ファイルで、2つの異なるクライアントIDを使用して複数の注文を送信します。
                <code-block lang="kotlin" code="    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Pepperoni&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Hawaiian&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Calzone&quot;))&#10;&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Margherita&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Sicilian&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;California&quot;))"/>
                <p>
                    次に、<code>Coroutines</code> ライブラリと <code>collect</code> メソッドを使用して結果を反復処理します。
                </p>
                <code-block lang="kotlin" code="    pizzaShop.viewOrders(&quot;AB12&quot;).collect {&#10;        println(&quot;AB12 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    pizzaShop.viewOrders(&quot;CD34&quot;).collect {&#10;        println(&quot;CD34 ordered ${it.name}&quot;)&#10;    }"/>
            </step>
            <step>
                サーバーとクライアントを実行します。クライアントを実行すると、結果が段階的に表示されるのがわかります。
                <img src="tutorial_kotlin_rpc_run_client.gif" alt="クライアント出力が結果を段階的に表示"
                     style="block" width="706" border-effect="line"/>
            </step>
        </procedure>
        <p>
            動作する例を作成したので、次にすべてがどのように機能するかをさらに深く掘り下げてみましょう。特に、Kotlin RPCと主要な2つの代替手段であるRESTおよびgRPCを比較検討します。
        </p>
    </chapter>
    <chapter title="RPC vs. REST" id="rpc-vs-rest">
        <p>
            RPCのアイデアはRESTよりもかなり古く、<a
                href="https://en.wikipedia.org/wiki/Remote_procedure_call">少なくとも1981年に遡ります</a>。RESTと比較して、RPCベースのアプローチは統一インターフェース（HTTPリクエストタイプなど）に制約されず、コードでの扱いがはるかに簡単で、バイナリメッセージングのおかげでパフォーマンスが向上する可能性があります。
        </p>
        <p>
            しかし、RESTには3つの大きな利点があります。
        </p>
        <list type="decimal">
            <li>
                ブラウザのJavaScriptクライアントから直接使用でき、したがってシングルページアプリケーションの一部として使用できます。RPCフレームワークは生成されたスタブとバイナリメッセージングに依存するため、JavaScriptエコシステムにはうまく適合しません。
            </li>
            <li>
                RESTは、機能がネットワークに関わる場合、それを明確にします。これにより、Martin Fowlerが指摘した<a
                    href="https://martinfowler.com/articles/distributed-objects-microservices.html">分散オブジェクトのアンチパターン</a>を回避するのに役立ちます。これは、チームがローカルプロシージャ呼び出しをリモート化することによるパフォーマンスと信頼性の影響を考慮せずに、OO設計を2つ以上の部分に分割した場合に発生します。
            </li>
            <li>
                REST APIは、作成、ドキュメント化、監視、デバッグ、テストを比較的容易にする一連の規約に基づいて構築されています。これをサポートする膨大なツールエコシステムが存在します。
            </li>
        </list>
        <p>
            これらのトレードオフは、Kotlin RPCが2つのシナリオで最もよく使用されることを意味します。第一に、<a
                href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>を使用するKMPクライアントにおいて、第二に、クラウド上の連携するマイクロサービス間です。<a
                href="https://kotlinlang.org/docs/wasm-overview.html">Kotlin/Wasm</a>の将来の発展により、<code>kotlinx.rpc</code>はブラウザベースのアプリケーションにより適用可能になる可能性があります。
        </p>
    </chapter>
    <chapter title="Kotlin RPC vs. Google RPC" id="kotlin-rpc-vs-google-rpc">
        <p>
            Google RPCは、現在のソフトウェア業界で支配的なRPCテクノロジーです。Protocol Buffers (protobuf) と呼ばれる標準は、言語に依存しないインターフェース定義言語 (IDL) を使用してデータ構造とメッセージペイロードを定義するために使用されます。これらのIDL定義は、様々なプログラミング言語に変換でき、コンパクトで効率的なバイナリ形式を使用してシリアライズされます。QuarkusやMicronautのようなマイクロサービスフレームワークは、すでにgRPCをサポートしています。
        </p>
        <p>
            Kotlin RPCがgRPCと競合することは困難であり、Kotlinコミュニティにとって利益もありません。幸いにも、そのような計画はありません。むしろ、<code>kotlinx.rpc</code>がgRPCと互換性があり、相互運用可能であることが意図されています。<code>kotlinx.rpc</code>サービスがgRPCをネットワークプロトコルとして使用したり、<code>kotlinx.rpc</code>クライアントがgRPCサービスを呼び出したりすることが可能になります。<code>kotlinx.rpc</code>は、デフォルトオプションとして<a
                href="https://kotlin.github.io/kotlinx-rpc/transport.html">独自のkRPCプロトコル</a>を使用しますが（現在の例がそうであるように）、代わりにgRPCを選択することを妨げるものは何もありません。
        </p>
    </chapter>
    <chapter title="次のステップ" id="next-steps">
        <p>
            Kotlin RPCは、サービスを作成および利用するためのRESTやGraphQLに代わる選択肢を提供し、Kotlinエコシステムを新しい方向に拡張します。Ktor、コルーチン、<code>kotlinx-serialization</code>などの実績のあるライブラリとフレームワークの上に構築されています。Kotlin MultiplatformやCompose Multiplatformの利用を検討しているチームにとって、分散メッセージングのためのシンプルで効率的なオプションとなるでしょう。
        </p>
        <p>
            この紹介で興味を持たれた場合は、<a href="https://kotlin.github.io/kotlinx-rpc/get-started.html">公式の<code>kotlinx.rpc</code>ドキュメント</a>と<a
                href="https://github.com/Kotlin/kotlinx-rpc/tree/main/samples">サンプル</a>をぜひご確認ください。
        </p>
        <p>
            <code>kotlinx.rpc</code>
            ライブラリはまだ初期段階にあるため、ぜひ探索し、フィードバックを共有してください。バグや機能リクエストは<a href="https://youtrack.jetbrains.com/issues/KRPC">YouTrack</a>で、一般的な議論は<a
                href="https://kotlinlang.slack.com/archives/C072YJ3Q91V">Slack</a>（<a
                href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">アクセスリクエスト</a>）で行われています。
        </p>
    </chapter>
</topic>