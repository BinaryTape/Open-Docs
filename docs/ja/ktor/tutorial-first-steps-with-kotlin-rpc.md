<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin RPCの基本" id="tutorial-first-steps-with-kotlin-rpc">
<show-structure for="chapter" depth="2"/>
<web-summary>
    この包括的なガイドでRPCの基本を学び、RPCとRESTの詳細な比較を探りましょう。Kotlin RPCで最初のアプリケーションを作成する方法を学びます。
</web-summary>
<link-summary>
    Kotlin RPCとKtorを使って最初のアプリケーションを作成する方法を学びます。
</link-summary>
<card-summary>
    Kotlin RPCとKtorを使って最初のアプリケーションを作成する方法を学びます。
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
        <b>使用プラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">Routing</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
        <a href="https://github.com/Kotlin/kotlinx-rpc">kotlinx.rpc</a>
    </p>
</tldr>
<p>
    Kotlin RPC (Remote Procedure Call) は、Kotlinエコシステムへの新しくエキサイティングな追加であり、定評のある基盤の上に構築されており、<code>kotlinx.rpc</code>ライブラリで動作します。
</p>
<p>
    <code>kotlinx.rpc</code>ライブラリを使用すると、通常のKotlin言語構造のみを使用して、ネットワーク境界を越えてプロシージャコールを行うことができます。そのため、RESTとGoogle RPC (gRPC) の両方に代わるものを提供します。
</p>
<p>
    この記事では、Kotlin RPCの核となる概念を紹介し、シンプルなアプリケーションを構築します。これにより、ご自身のプロジェクトでライブラリを評価できるようになります。
</p>
<chapter title="前提条件" id="prerequisites">
    <p>
        このチュートリアルは、Kotlinプログラミングの基本的な理解があることを前提としています。Kotlinが初めての方は、いくつかの<a href="https://kotlinlang.org/docs/getting-started.html">入門資料</a>を確認することをお勧めします。
    </p>
    <p>最高の体験のために、<a
            href="https://www.jetbrains.com/idea/download">IntelliJ
        IDEA Ultimate</a>を統合開発環境（IDE）として使用することをお勧めします。これは、生産性を向上させる包括的なサポートとツールを提供するためです。
    </p>
</chapter>
<chapter title="RPCとは？" id="what-is-rpc">
    <chapter title="ローカルプロシージャコールとリモートプロシージャコール" id="local-vs-remote">
        <p>
            プログラミング経験がある方なら、プロシージャコール（procedure call）の概念には馴染みがあるでしょう。これは、あらゆるプログラミング言語における基本的な概念です。技術的には、これらは常に同じプログラム内で実行されるため、ローカルプロシージャコール（local procedure calls）と呼ばれます。
        </p>
        <p>
            リモートプロシージャコール（remote procedure call）とは、関数呼び出しとパラメータが何らかの方法でネットワーク経由で転送され、実装が別のVM/実行可能ファイル内で実行される場合を指します。戻り値は、呼び出しが行われたマシンに反対の経路を辿って戻ります。
        </p>
        <p>
            呼び出しが行われたマシンをクライアント、実装が存在するマシンをサーバーと考えると最も簡単です。ただし、必ずしもそうである必要はありません。RPC呼び出しは、ピアアーキテクチャの一部として、双方向で発生する可能性があります。しかし、物事をシンプルにするために、クライアント/サーバーデプロイメントを前提としましょう。
        </p>
    </chapter>
    <chapter title="RPCフレームワークの基本" id="rpc-framework-fundamentals">
        <p>
            あらゆるRPCフレームワークは、特定の基本機能を提供する必要があります。これらは、従来のITインフラストラクチャ内でリモートプロシージャコールを実装する際に不可欠です。用語は異なる場合があり、責任の分担方法も様々ですが、すべてのRPCフレームワークは以下のものを提供する必要があります。
        </p>
        <list type="decimal">
            <li>
                リモートで呼び出されるプロシージャを宣言する方法。オブジェクト指向プログラミングでは、インターフェースが論理的な選択肢です。これは、現在の言語が提供するインターフェース構造であるか、<a
                    href="https://webidl.spec.whatwg.org/">W3Cが使用するWeb IDL</a>のような言語に依存しない標準である場合があります。
            </li>
            <li>
                パラメータと戻り値に使用される型を指定する手段。ここでも、言語に依存しない標準を使用できます。ただし、現在の言語の標準データ型宣言にアノテーションを付加する方がシンプルかもしれません。
            </li>
            <li>
                <format style="italic">クライアントスタブ</format>と呼ばれるヘルパークラス。プロシージャの呼び出しをネットワーク経由で送信できる形式に変換し、結果の戻り値を展開するために使用されます。これらのスタブは、コンパイルプロセス中または実行時に動的に作成できます。
            </li>
            <li>
                ヘルパークラスを管理し、リモートプロシージャコールのライフサイクルを監督する基盤となる<format style="italic">RPCランタイム</format>。サーバー側では、このランタイムを何らかのサーバーに組み込む必要があり、継続的にリクエストを処理できるようにします。
            </li>
            <li>
                呼び出されるプロシージャを表し、送信されるデータをシリアライズし、ネットワーク経由で情報を変換するためのプロトコルを選択（または定義）する必要があります。過去には、一部のテクノロジーがゼロから新しいプロトコルを定義しましたが（CORBAのIIOP）、他のテクノロジーは再利用に焦点を当てました（SOAPのHTTP POST）。
            </li>
        </list>
    </chapter>
    <chapter title="マーシャリングとシリアライゼーション" id="marshaling-vs-serialization">
        <p>
            RPCフレームワークでは、<format style="italic">マーシャリング</format>と<format style="italic">アンマーシャリング</format>について語ります。これは、ネットワーク経由で送信する情報をパックおよびアンパックするプロセスです。シリアライゼーションのスーパーセットと考えることができます。マーシャリングでは、オブジェクトをシリアライズしていますが、呼び出されるプロシージャと、その呼び出しが行われたコンテキストに関する情報もパッケージ化する必要があります。
        </p>
    </chapter>
    <p>
        RPCの核となる概念を紹介しましたので、<code>kotlinx.rpc</code>でそれらがどのように適用されるかをサンプルアプリケーションを構築して見てみましょう。
    </p>
</chapter>
<chapter title="Hello, kotlinx.rpc" id="hello-kotlinx-rpc">
    <p>
        ネットワーク経由でピザを注文するアプリケーションを作成しましょう。コードをできるだけシンプルにするために、コンソールベースのクライアントを使用します。
    </p>
    <chapter title="プロジェクトを作成する" id="create-project">
        <p>まず、クライアントとサーバーの両方の実装を含むプロジェクトを作成します。</p>
        <p>
            より複雑なアプリケーションでは、クライアントとサーバーに個別のモジュールを使用するのがベストプラクティスです。しかし、このチュートリアルではシンプルにするため、両方に単一のモジュールを使用します。
        </p>
        <procedure id="create-project-procedure">
            <step>
                <a href="https://www.jetbrains.com/idea/download/">IntelliJ IDEA</a>を起動します。
            </step>
            <step>
<p>
    ようこそ画面で、<control>New Project</control>をクリックします。
</p>
<p>
    または、メインメニューから<ui-path>File | New | Project</ui-path>を選択します。
</p>
            </step>
            <step>
                <control>Name</control>フィールドに、プロジェクト名として<Path>KotlinRpcPizzaApp</Path>と入力します。
                <img src="tutorial_kotlin_rpc_intellij_project.png" alt="IntelliJ New Kotlin Project window"
                     style="block" width="706" border-effect="rounded"/>
            </step>
            <step>
                残りのデフォルト設定はそのままにして、<control>Create</control>をクリックします。
            </step>
        </procedure>
        <p>
            通常、すぐにプロジェクトのビルドファイルを構成するでしょう。しかし、それはテクノロジーの理解を深めるものではない実装の詳細なので、このステップは後回しにします。
        </p>
    </chapter>
    <chapter title="共有型を追加する" id="shared-types">
        <p>
            あらゆるRPCプロジェクトの核となるのは、リモートで呼び出されるプロシージャと、それらのプロシージャの定義で使用される型を定義するインターフェースです。
        </p>
        <p>
            マルチモジュールプロジェクトでは、これらの型は共有する必要があります。しかし、この例では、このステップは不要です。
        </p>
        <procedure id="shared-types-procedure">
            <step>
                <Path>src/main/kotlin</Path>フォルダーに移動し、<Path>model</Path>という新しいサブパッケージを作成します。
            </step>
            <step>
                <Path>model</Path>パッケージ内に、以下の実装を持つ新しい<Path>PizzaShop.kt</Path>ファイルを作成します。
                [object Promise]
                <p>
                    インターフェースには、<code>kotlinx.rpc</code>ライブラリからの<code>@Rpc</code>アノテーションが必要です。
                </p>
                <p>
                    <a href="https://github.com/Kotlin/kotlinx.serialization"><code>kotlinx.serialization</code></a>を使用してネットワーク経由で情報を転送するため、パラメータで使用される型は<code>Serializable</code>アノテーションでマークする必要があります。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="クライアントを実装する" id="client-implementation">
        <procedure id="client-impl-procedure">
            <step>
                <Path>src/main/kotlin</Path>に移動し、新しい<Path>Client.kt</Path>ファイルを作成します。
            </step>
            <step>
                <Path>Client.kt</Path>を開き、以下の実装を追加します。
                [object Promise]
            </step>
        </procedure>
        <p>
            RPC呼び出しの準備をして実行するには、25行しか必要ありません。もちろん、多くのことが行われているので、コードをセクションに分けて説明します。
        </p>
        <p>
            <code>kotlinx.rpc</code>ライブラリは、<Links href="/ktor/client-create-new-application" summary="リクエストを送信し、レスポンスを受信する最初のクライアントアプリケーションを作成します。">Ktor
            クライアント</Links>を使用して、クライアント側でそのランタイムをホストします。ランタイムはKtorに結合されておらず、他の選択肢も可能ですが、これにより再利用が促進され、既存のKMPアプリケーションに<code>kotlinx.rpc</code>を簡単に統合できます。
        </p>
        <p>
            KtorクライアントとKotlin RPCはどちらもコルーチンを中心に構築されているため、<code>runBlocking</code>を使用して初期コルーチンを作成し、その中でクライアントの残りを実行します。
        </p>
        [object Promise]
        <tip>
            <code>runBlocking</code>は、本番コードではなく、一時的な試用やテストのために設計されていることに注意してください。
        </tip>
        <p>
            次に、標準的な方法でKtorクライアントのインスタンスを作成します。<code>kotlinx.rpc</code>は、内部的に<Links href="/ktor/client-websockets" summary="Websocketsプラグインを使用すると、サーバーとクライアントの間で双方向通信セッションを作成できます。">WebSockets</Links>プラグインを使用して情報を転送します。<code>installKrpc()</code>関数を使用してそれがロードされていることを確認するだけで済みます。
        </p>
        [object Promise]
        <p>
            このKtorクライアントを作成したら、リモートプロシージャを呼び出すための<code>KtorRpcClient</code>オブジェクトを作成します。サーバーの場所と、情報の転送に使用されるメカニズムを構成する必要があります。
        </p>
        [object Promise]
        <p>
            この時点で、標準的な設定が完了し、問題領域に特化した機能を使用する準備が整いました。クライアントを使用して、<code>PizzaShop</code>インターフェースのメソッドを実装するクライアントプロキシオブジェクトを作成できます。
        </p>
        [object Promise]
        <p>
            その後、リモートプロシージャコールを行い、その結果を使用できます。
        </p>
        [object Promise]
        <p>
            この時点で、膨大な量の作業があなたのために行われていることに注意してください。呼び出しの詳細とすべてのパラメータはメッセージに変換され、ネットワーク経由で送信され、その後、戻り値が受信されてデコードされます。これが透過的に行われるという事実は、初期設定に対する見返りです。
        </p>
        <p>
            最後に、通常通りクライアントをシャットダウンする必要があります。
        </p>
        [object Promise]
    </chapter>
    <chapter title="サーバーを実装する" id="server-implementation">
        <p>
            サーバー側の実装は2つの部分に分かれます。まず、インターフェースの実装を作成する必要があり、次に、それをサーバー内でホストする必要があります。
        </p>
        <procedure id="create-interface">
            <step>
                <Path>src/main/kotlin</Path>に移動し、新しい<Path>Server.kt</Path>ファイルを作成します。
            </step>
            <step>
                <Path>Server.kt</Path>を開き、以下のインターフェースを追加します。
                [object Promise]
                <p>
                    もちろん、これは現実的な実装ではありませんが、デモを動かすには十分です。
                </p>
                <p>
                    実装の2番目の部分はKtorに基づいて構築されています。
                </p>
            </step>
            <step>
                <p>
                    以下のコードを同じファイルに追加します。
                </p>
                [object Promise]
                <p>内訳は次のとおりです。</p>
                <p>
                    まず、Ktor/Nettyのインスタンスを作成し、構成に使用する指定された拡張関数を使用します。
                </p>
                [object Promise]
                <p>
                    次に、Ktor Application型を拡張するセットアップ関数を宣言します。これにより、<code>kotlinx.rpc</code>プラグインがインストールされ、1つ以上のルートが宣言されます。
                </p>
                [object Promise]
                <p>
                    ルーティングセクション内では、<code>kotlinx.rpc</code>のKtor Routing DSLへの拡張を使用してエンドポイントを宣言します。クライアント側と同様に、URLを指定し、シリアライゼーションを構成します。しかし、この場合、私たちの実装はそのURLで受信リクエストをリッスンします。
                </p>
                [object Promise]
                <p>
                    <code>registerService</code>を使用して、インターフェースの実装をRPCランタイムに提供することに注意してください。複数のインスタンスが必要な場合もありますが、それは次の記事で説明するトピックです。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="依存関係を追加する" id="add-dependencies">
        <p>
            アプリケーションを実行するために必要なコードはすべて揃いましたが、現時点ではコンパイルすらできず、まして実行などできません。<a href="https://start.ktor.io/p/kotlinx-rpc">kotlinx.rpc</a>プラグインを備えたKtorプロジェクトジェネレーターを使用するか、ビルドファイルを手動で構成することもできます。
            これもそれほど複雑ではありません。
        </p>
        <procedure id="configure-build-files">
            <step>
                <Path>build.gradle.kts</Path>ファイルに、以下のプラグインを追加します。
                [object Promise]
                <p>
                    Kotlinプラグインの理由は明らかです。他のプラグインを説明します。
                </p>
                <list>
                    <li>
                        <code>kotlinx.serialization</code>プラグインは、KotlinオブジェクトをJSONに変換するためのヘルパー型を生成するために必要です。<code>kotlinx.serialization</code>はリフレクションを一切使用しないことを覚えておいてください。
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
                以下の依存関係を追加します。
                [object Promise]
                <p>
                    これにより、Ktorクライアントとサーバー、<code>kotlinx.rpc</code>ランタイムのクライアント側とサーバー側の部分、および<code>kotlinx.rpc</code>と<code>kotlinx-serialization</code>を統合するためのライブラリが追加されます。
                </p>
                <p>
                    これで、プロジェクトを実行し、RPC呼び出しを開始できます。
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
                <Path>Server.kt</Path>ファイルに移動します。
            </step>
            <step>
                <p>IntelliJ IDEAで、<code>main()</code>関数の横にある実行ボタン（<img src="intellij_idea_gutter_icon.svg"
                      style="inline" height="16" width="16"
                      alt="intelliJ IDEA run icon"/>）をクリックしてアプリケーションを起動します。</p>
                <p>
                    <control>Run</control>ツールパネルに以下の出力が表示されるはずです。
                </p>
                <img src="tutorial_kotlin_rpc_run_server.png" alt="Run server output in intelliJ IDEA"
                     style="block" width="706" border-effect="line"/>
            </step>
            <step>
                <Path>Client.kt</Path>ファイルに移動し、アプリケーションを実行します。コンソールに以下の出力が表示されるはずです。
                [object Promise]
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="例を拡張する" id="extend-the-example">
    <p>
        最後に、将来の発展のための強固な基盤を確立するために、サンプルアプリケーションの複雑さを高めてみましょう。
    </p>
    <procedure id="extend-server">
        <step>
            <Path>PizzaShop.kt</Path>ファイルで、<code>orderPizza</code>メソッドにクライアントのIDを含めるように拡張し、指定されたクライアントの保留中の注文をすべて返す<code>viewOrders</code>メソッドを追加します。
            [object Promise]
            <p>
                コルーチンライブラリを活用することで、<code>List</code>や<code>Set</code>ではなく<code>Flow</code>を返すことができます。これにより、情報をピザ1つずつクライアントにストリーム配信できます。
            </p>
        </step>
        <step>
            <Path>Server.kt</Path>ファイルに移動し、現在の注文をリストのマップに保存することでこの機能を実装します。
            [object Promise]
            <p>
                各クライアントインスタンスに対して<code>PizzaShopImpl</code>の新しいインスタンスが作成されることに注意してください。
                これにより、クライアントの状態を分離することで、クライアント間の競合を回避します。ただし、単一サーバーインスタンス内のスレッドセーフティ、特に同じインスタンスが複数のサービスによって同時にアクセスされる場合には対処しません。
            </p>
        </step>
        <step>
            <Path>Client.kt</Path>ファイルで、2つの異なるクライアントIDを使用して複数の注文を送信します。
            [object Promise]
            <p>
                次に、<code>Coroutines</code>ライブラリと<code>collect</code>メソッドを使用して、結果をイテレートします。
            </p>
            [object Promise]
        </step>
        <step>
            サーバーとクライアントを実行します。クライアントを実行すると、結果が段階的に表示されるのがわかります。
            <img src="tutorial_kotlin_rpc_run_client.gif" alt="Client output incrementally displaying results"
                 style="block" width="706" border-effect="line"/>
        </step>
    </procedure>
    <p>
        動作する例を作成しましたので、次にすべての仕組みを深く掘り下げてみましょう。特に、Kotlin RPCと主要な2つの代替案であるRESTとgRPCを比較検討します。
    </p>
</chapter>
<chapter title="RPC vs. REST" id="rpc-vs-rest">
    <p>
        RPCのアイデアはRESTよりもかなり古く、<a
            href="https://en.wikipedia.org/wiki/Remote_procedure_call">少なくとも1981年にまで遡ります</a>。RESTと比較して、RPCベースのアプローチは統一されたインターフェース（HTTPリクエストタイプなど）に制約されず、コードでの作業がはるかにシンプルで、バイナリメッセージングによりパフォーマンスが高いという利点があります。
    </p>
    <p>
        しかし、RESTには3つの大きな利点があります。
    </p>
    <list type="decimal">
        <li>
            ブラウザのJavaScriptクライアントによって直接使用でき、したがってシングルページアプリケーションの一部として使用できます。RPCフレームワークは生成されたスタブとバイナリメッセージングに依存するため、JavaScriptエコシステムにはうまく適合しません。
        </li>
        <li>
            RESTは、機能がネットワーキングを伴う場合に明らかになります。これにより、マーティン・ファウラーによって特定された<a
                href="https://martinfowler.com/articles/distributed-objects-microservices.html">分散オブジェクトアンチパターン</a>を回避できます。これは、チームがローカルプロシージャコールをリモート化することによるパフォーマンスと信頼性の影響を考慮せずに、OO設計を2つ以上の部分に分割した場合に発生します。
        </li>
        <li>
            REST APIは一連の規約に基づいて構築されており、作成、ドキュメント化、監視、デバッグ、テストが比較的容易です。これをサポートする膨大なツールエコシステムが存在します。
        </li>
    </list>
    <p>
        これらのトレードオフは、Kotlin RPCが2つのシナリオで最もよく使用されることを意味します。第一に、<a
            href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>を使用するKMPクライアントにおいて、第二に、クラウド内の連携するマイクロサービス間においてです。<a
            href="https://kotlinlang.org/docs/wasm-overview.html">Kotlin/Wasm</a>の将来の発展により、<code>kotlinx.rpc</code>はブラウザベースのアプリケーションにより適用可能になる可能性があります。
    </p>
</chapter>
<chapter title="Kotlin RPC vs. Google RPC" id="kotlin-rpc-vs-google-rpc">
    <p>
        Google RPCは現在、ソフトウェア業界で支配的なRPC技術です。Protocol Buffers (protobuf) と呼ばれる標準は、言語に依存しないインターフェース定義言語（IDL）を使用してデータ構造とメッセージペイロードを定義するために使用されます。これらのIDL定義は、多種多様なプログラミング言語に変換でき、コンパクトで効率的なバイナリ形式を使用してシリアライズされます。QuarkusやMicronautのようなマイクロサービスフレームワークはすでにgRPCをサポートしています。
    </p>
    <p>
        Kotlin RPCがgRPCと競合するのは難しいでしょうし、Kotlinコミュニティにとって何の利益もありません。幸いなことに、そのような計画はありません。その代わりに、kotlinx.rpcがgRPCと互換性があり、相互運用可能であること、という意図があります。kotlinx.rpcサービスがgRPCをネットワークプロトコルとして使用でき、kotlinx.rpcクライアントがgRPCサービスを呼び出せるようになります。<code>kotlinx.rpc</code>はデフォルトオプションとして<a
            href="https://kotlin.github.io/kotlinx-rpc/transport.html">独自のkRPCプロトコル</a>を使用しますが（現在の例がそうです）、代わりにgRPCを選択することを妨げるものは何もありません。
    </p>
</chapter>
<chapter title="次のステップ" id="next-steps">
    <p>
        Kotlin RPCは、サービスの作成と消費においてRESTやGraphQLに代わるものを提供し、Kotlinエコシステムを新しい方向に拡張します。これは、Ktor、コルーチン、<code>kotlinx-serialization</code>といった実績のあるライブラリとフレームワークに基づいて構築されています。Kotlin MultiplatformとCompose Multiplatformの利用を検討しているチームにとって、これは分散メッセージングのためのシンプルで効率的なオプションとなるでしょう。
    </p>
    <p>
        この紹介で興味をそそられた方は、公式の<a href="https://kotlin.github.io/kotlinx-rpc/get-started.html"><code>kotlinx.rpc</code>
        ドキュメント</a>と<a
            href="https://github.com/Kotlin/kotlinx-rpc/tree/main/samples">例</a>をぜひ確認してください。
    </p>
    <p>
        <code>kotlinx.rpc</code>
        ライブラリは初期段階にありますので、ぜひ探索してフィードバックを共有してください。
        バグと機能リクエストは<a href="https://youtrack.jetbrains.com/issues/KRPC">YouTrack</a>で、一般的な議論は<a
            href="https://kotlinlang.slack.com/archives/C072YJ3Q91V">Slack</a>（<a
            href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">アクセスをリクエスト</a>）で行われています。
    </p>
</chapter>
</topic>