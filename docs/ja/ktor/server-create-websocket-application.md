<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Ktor を使用して Kotlin で WebSocket アプリケーションを作成する" id="server-create-websocket-application">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-websockets"/>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>使用されるプラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">ルーティング</Links>、<Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">静的コンテンツ</Links>、
            <Links href="/ktor/server-serialization" summary="ContentNegotiation プラグインには、クライアントとサーバー間のメディアタイプのネゴシエーションと、特定の形式でのコンテンツのシリアル化/デシリアル化という 2 つの主要な目的があります。">コンテンツネゴシエーション</Links>、 <Links href="/ktor/server-websockets" summary="Websockets プラグインを使用すると、サーバーとクライアントの間で多方向通信セッションを作成できます。">Ktor サーバーでの WebSockets</Links>、
            <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
        </p>
</tldr>
<card-summary>
        WebSockets の能力を活用してコンテンツを送受信する方法を学びましょう。
</card-summary>
<link-summary>
        WebSockets の能力を活用してコンテンツを送受信する方法を学びましょう。
</link-summary>
<web-summary>
        Ktor を使用して Kotlin で WebSocket アプリケーションを構築する方法を学びます。このチュートリアルでは、WebSockets を介してバックエンドサービスをクライアントと接続するプロセスを順を追って説明します。
</web-summary>
<p>
        この記事では、Ktor を使用して Kotlin で WebSocket アプリケーションを作成するプロセスを順を追って説明します。これは、<Links href="/ktor/server-create-restful-apis" summary="Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学びます。JSON ファイルを生成する RESTful API の例が特徴です。">RESTful API の作成</Links> チュートリアルで説明されている内容に基づいています。
</p>
<p>この記事では、次の方法について説明します。</p>
<list>
        <li>JSON シリアル化を使用するサービスを作成する。</li>
        <li>WebSocket 接続を介してコンテンツを送受信する。</li>
        <li>複数のクライアントに同時にコンテンツをブロードキャストする。</li>
</list>
<chapter title="前提条件" id="prerequisites">
        <p>このチュートリアルは単独で行うこともできますが、<Links href="/ktor/server-create-restful-apis" summary="Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学びます。JSON ファイルを生成する RESTful API の例が特徴です。">RESTful API の作成</Links> チュートリアルを完了して、<Links href="/ktor/server-serialization" summary="ContentNegotiation プラグインには、クライアントとサーバー間のメディアタイプのネゴシエーションと、特定の形式でのコンテンツのシリアル化/デシリアル化という 2 つの主要な目的があります。">コンテンツネゴシエーション</Links>と REST に慣れることをお勧めします。
        </p>
        <p>IntelliJ IDEA のインストールをお勧めしますが、<a href="https://www.jetbrains.com/help/idea/installation-guide.html">任意の他の IDE</a> を使用することもできます。
        </p>
</chapter>
<chapter title="Hello WebSockets" id="hello-websockets">
        <p>
            このチュートリアルでは、<Links href="/ktor/server-create-restful-apis" summary="Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学びます。JSON ファイルを生成する RESTful API の例が特徴です。">RESTful API の作成</Links> チュートリアルで開発されたタスクマネージャーサービスに、WebSocket 接続を介してクライアントと <code>Task</code> オブジェクトを交換する機能を追加します。これを実現するには、<Links href="/ktor/server-websockets" summary="Websockets プラグインを使用すると、サーバーとクライアントの間で多方向通信セッションを作成できます。">WebSockets プラグイン</Links>を追加する必要があります。既存のプロジェクトに手動で追加することもできますが、このチュートリアルでは、新しいプロジェクトを作成して最初から始めます。
        </p>
        <chapter title="プラグインを使用して初期プロジェクトを作成する" id="create=project">
            <procedure>
                <step>
    <p>
        <a href="https://start.ktor.io/">Ktor Project Generator</a> に移動します。
    </p>
                </step>
                <step>
                    <p><control>プロジェクトアーティファクト</control>フィールドに、プロジェクトのアーティファクト名として<Path>com.example.ktor-websockets-task-app</Path>と入力します。
                        <img src="tutorial_server_websockets_project_artifact.png"
                             alt="Ktor Project Generator でプロジェクトアーティファクトに名前を付ける"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        プラグインセクションで、<control>追加</control>ボタンをクリックして以下のプラグインを検索して追加します:
                    </p>
                    <list type="bullet">
                        <li>Routing</li>
                        <li>Content Negotiation</li>
                        <li>Kotlinx.serialization</li>
                        <li>WebSockets</li>
                        <li>Static Content</li>
                    </list>
                    <p>
                        <img src="ktor_project_generator_add_plugins.gif"
                             alt="Ktor Project Generator でプラグインを追加する"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        プラグインを追加したら、プラグインセクションの右上にある<control>5 plugins</control>ボタンをクリックして、追加されたプラグインを表示します。
                    </p>
                    <p>すると、プロジェクトに追加されるすべてのプラグインのリストが表示されます:
                        <img src="tutorial_server_websockets_project_plugins.png"
                             alt="Ktor Project Generator のプラグインリスト"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
    <p>
        <control>ダウンロード</control>ボタンをクリックして、Ktor プロジェクトを生成してダウンロードします。
    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="スターターコードを追加する" id="add-starter-code">
            <p>ダウンロードが完了したら、IntelliJ IDEA でプロジェクトを開き、以下の手順に従ってください:</p>
            <procedure>
                <step>
                    <Path>src/main/kotlin</Path> に移動し、<Path>model</Path> という新しいサブパッケージを作成します。
                </step>
                <step>
                    <p>
                        <Path>model</Path> パッケージ内に、新しい <Path>Task.kt</Path> ファイルを作成します。
                    </p>
                </step>
                <step>
                    <p>
                        <Path>Task.kt</Path> ファイルを開き、優先度を表す <code>enum</code> とタスクを表す <code>data class</code> を追加します。
                    </p>
                    [object Promise]
                    <p>
                        <code>Task</code> クラスには <code>kotlinx.serialization</code> ライブラリの <code>Serializable</code> 型がアノテーションされていることに注意してください。これにより、インスタンスを JSON に変換してネットワーク経由でコンテンツを転送できます。
                    </p>
                    <p>
                        WebSockets プラグインを含めたため、<Path>src/main/kotlin/com/example/plugins</Path> 内に <Path>Sockets.kt</Path> ファイルが生成されています。
                    </p>
                </step>
                <step>
                    <p>
                        <Path>Sockets.kt</Path> ファイルを開き、既存の <code>Application.configureSockets()</code> 関数を以下の実装に置き換えます。
                    </p>
                    [object Promise]
                    <p>
                        このコードでは、以下の手順が実行されます:
                    </p>
                    <list type="decimal">
                        <li>WebSockets プラグインがインストールされ、標準設定で構成されています。</li>
                        <li><code>contentConverter</code> プロパティが設定され、プラグインが <a
                                    href="https://github.com/Kotlin/kotlinx.serialization">kotlinx.serialization</a>
                            ライブラリを介して送受信されるオブジェクトをシリアル化できるようになります。
                        </li>
                        <li>ルーティングが単一のエンドポイント (相対 URL は <code>/tasks</code>) で構成されています。
                        </li>
                        <li>リクエストを受信すると、タスクのリストが WebSocket 接続を介してシリアル化されます。</li>
                        <li>すべての項目が送信されると、サーバーは接続を閉じます。</li>
                    </list>
                    <p>
                        デモンストレーションの目的で、タスクの送信間に 1 秒の遅延が導入されています。これにより、タスクがクライアントに徐々に表示されるのを観察できます。この遅延がない場合、この例は以前の記事で開発された <Links href="/ktor/server-create-restful-apis" summary="Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学びます。JSON ファイルを生成する RESTful API の例が特徴です。">RESTful サービス</Links> や <Links href="/ktor/server-create-website" summary="Ktor と Thymeleaf テンプレートで Kotlin で Web サイトを構築する方法を学びましょう。">Web アプリケーション</Links> と同じように見えます。
                    </p>
                    <p>
                        このイテレーションの最後のステップは、このエンドポイントのクライアントを作成することです。<Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">静的コンテンツ</Links> プラグインを含めたため、<Path>src/main/resources/static</Path> 内に <Path>index.html</Path> ファイルが生成されています。
                    </p>
                </step>
                <step>
                    <p>
                        <Path>index.html</Path> ファイルを開き、既存のコンテンツを以下に置き換えます。
                    </p>
                    [object Promise]
                    <p>
                        このページは、すべての最新ブラウザで利用可能な <a href="https://websockets.spec.whatwg.org//#websocket">WebSocket 型</a>を使用しています。JavaScript でこのオブジェクトを作成し、エンドポイントの URL をコンストラクターに渡します。その後、<code>onopen</code>、<code>onclose</code>、および <code>onmessage</code> イベントのイベントハンドラーをアタッチします。<code>onmessage</code> イベントがトリガーされると、document オブジェクトのメソッドを使用してテーブルに行を追加します。
                    </p>
                </step>
                <step>
    <p>IntelliJ IDEA で、実行ボタン（
        <img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="intelliJ IDEA 実行アイコン"/>）をクリックしてアプリケーションを開始します。</p>
                </step>
                <step>
                    <p>
                        <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a> に移動します。ボタンと空のテーブルのあるフォームが表示されます:
                    </p>
                    <img src="tutorial_server_websockets_iteration_1.png"
                         alt="ボタンが 1 つある HTML フォームを表示する Web ブラウザページ"
                         border-effect="rounded"
                         width="706"/>
                    <p>
                        フォームをクリックすると、タスクがサーバーから 1 秒に 1 つの割合でロードされ、表示されます。その結果、テーブルは徐々に埋められていきます。ブラウザの<control>開発者ツール</control>で<control>JavaScript コンソール</control>を開くことで、ログに記録されたメッセージを表示することもできます。
                    </p>
                    <img src="tutorial_server_websockets_iteration_1_click.gif"
                         alt="ボタンクリックでリスト項目を表示する Web ブラウザページ"
                         border-effect="rounded"
                         width="706"/>
                    <p>
                        これで、サービスが期待通りに動作していることがわかります。WebSocket 接続が確立され、項目がクライアントに送信され、その後接続が閉じられます。基盤となるネットワークには多くの複雑さがありますが、Ktor はこれらすべてをデフォルトで処理します。
                    </p>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="WebSockets の理解" id="understanding-websockets">
        <p>
            次のイテレーションに進む前に、WebSockets の基本をいくつか復習しておくと役立つかもしれません。WebSockets にすでに慣れている場合は、<a href="#improve-design">サービスの設計改善</a>に進んでください。
        </p>
        <p>
            以前のチュートリアルでは、クライアントは HTTP リクエストを送信し、HTTP レスポンスを受信していました。これはうまく機能し、インターネットがスケーラブルで回復力のあるものになることを可能にします。
        </p>
        <p>ただし、以下のようなシナリオには適していません。</p>
        <list>
            <li>コンテンツが時間とともに増分的に生成される。</li>
            <li>コンテンツがイベントに応答して頻繁に変更される。</li>
            <li>コンテンツが生成される際にクライアントがサーバーと対話する必要がある。</li>
            <li>あるクライアントによって送信されたデータが、他のクライアントに迅速に伝播される必要がある。</li>
        </list>
        <p>
            これらのシナリオの例としては、株式取引、映画やコンサートチケットの購入、オンラインオークションでの入札、ソーシャルメディアでのチャット機能などがあります。WebSockets は、これらの状況を処理するために開発されました。
        </p>
        <p>
            WebSocket 接続は TCP 上に確立され、長期間持続することができます。この接続は「全二重通信」を提供します。つまり、クライアントはサーバーにメッセージを送信し、同時にサーバーからメッセージを受信することができます。
        </p>
        <p>
            WebSocket API は、4 つのイベント (open、message、close、error) と 2 つのアクション (send、close) を定義します。この機能へのアクセス方法は、言語やライブラリによって異なります。
            たとえば、Kotlin では、受信メッセージのシーケンスを <a
                href="https://kotlinlang.org/docs/flow.html">Flow</a> として消費できます。
        </p>
    </chapter>
    <chapter title="設計を改善する" id="improve-design">
        <p>次に、より高度な例のためのスペースを確保するために、既存のコードをリファクタリングします。</p>
        <procedure>
            <step>
                <p>
                    <Path>model</Path> パッケージ内に、新しい <Path>TaskRepository.kt</Path> ファイルを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path> を開き、<code>TaskRepository</code> 型を追加します。
                </p>
                [object Promise]
                <p>このコードは、以前のチュートリアルから覚えているかもしれません。</p>
            </step>
            <step>
                <Path>plugins</Path> パッケージに移動し、<Path>Sockets.kt</Path> ファイルを開きます。
            </step>
            <step>
                <p>
                    これで、<code>TaskRepository</code> を利用して <code>Application.configureSockets()</code> のルーティングを簡素化できます。
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="WebSockets を介してメッセージを送信する" id="send-messages">
        <p>
            WebSockets の能力を示すために、新しいエンドポイントを作成します。
        </p>
        <list>
            <li>
                クライアントが起動すると、既存のすべてのタスクを受信する。
            </li>
            <li>
                クライアントはタスクを作成して送信できる。
            </li>
            <li>
                あるクライアントがタスクを送信すると、他のクライアントに通知される。
            </li>
        </list>
        <procedure>
            <step>
                <p>
                    <Path>Sockets.kt</Path> ファイルで、現在の <code>configureSockets()</code> メソッドを以下の実装に置き換えます。
                </p>
                [object Promise]
                <p>このコードでは、以下のことを行いました:</p>
                <list>
                    <li>
                        既存のすべてのタスクを送信する機能をヘルパーメソッドにリファクタリングしました。
                    </li>
                    <li>
                        <code>routing</code> セクションで、すべてのクライアントを追跡するためにセッションオブジェクトのスレッドセーフなリストを作成しました。
                    </li>
                    <li>
                        相対 URL <code>/task2</code> を持つ新しいエンドポイントを追加しました。クライアントがこのエンドポイントに接続すると、対応する <code>session</code> オブジェクトがリストに追加されます。その後、サーバーは新しいタスクを受信するために無限ループに入ります。新しいタスクを受信すると、サーバーはそれをリポジトリに保存し、現在のクライアントを含むすべてのクライアントにコピーを送信します。
                    </li>
                </list>
                <p>
                    この機能をテストするために、<Path>index.html</Path> の機能を拡張する新しいページを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/resources/static</Path> 内に、<Path>wsClient.html</Path> という新しい HTML ファイルを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>wsClient.html</Path> を開き、以下のコンテンツを追加します。
                </p>
                [object Promise]
                <p>
                    この新しいページには HTML フォームが導入されており、ユーザーは新しいタスクの情報を入力できます。フォームを送信すると、<code>sendTaskToServer</code> イベントハンドラーが呼び出されます。これにより、フォームデータを含む JavaScript オブジェクトが構築され、WebSocket オブジェクトの <code>send</code> メソッドを使用してサーバーに送信されます。
                </p>
            </step>
            <step>
    <p>
        IntelliJ IDEA で、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA 再実行アイコン"/>）をクリックしてアプリケーションを再起動します。
    </p>
            </step>
            <step>
                <p>この機能をテストするには、2 つのブラウザを並べて開き、以下の手順に従ってください。</p>
                <list type="decimal">
                    <li>
                        ブラウザ A で <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a> に移動します。デフォルトのタスクが表示されるはずです。
                    </li>
                    <li>
                        ブラウザ A で新しいタスクを追加します。新しいタスクはそのページのテーブルに表示されるはずです。
                    </li>
                    <li>
                        ブラウザ B で <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a> に移動します。デフォルトのタスクに加えて、ブラウザ A で追加した新しいタスクが表示されるはずです。
                    </li>
                    <li>
                        どちらかのブラウザでタスクを追加します。新しい項目が両方のページに表示されるはずです。
                    </li>
                </list>
                <img src="tutorial_server_websockets_iteration_2_test.gif"
                     alt="HTML フォームを介した新しいタスクの作成を示す、並べられた 2 つの Web ブラウザページ"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="自動テストを追加する" id="add-automated-tests">
        <p>
            QA プロセスを効率化し、高速で再現可能かつ手動操作不要にするために、Ktor の組み込みの<Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。">自動テストサポート</Links>を使用できます。以下の手順に従ってください:
        </p>
        <procedure>
            <step>
                <p>
                    Ktor クライアント内で<Links href="/ktor/server-serialization" summary="ContentNegotiation プラグインには、クライアントとサーバー間のメディアタイプのネゴシエーションと、特定の形式でのコンテンツのシリアル化/デシリアル化という 2 つの主要な目的があります。">コンテンツネゴシエーション</Links>のサポートを構成できるように、<Path>build.gradle.kts</Path> に以下の依存関係を追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
    <p>IntelliJ IDEA で、エディターの右側にある通知 Gradle アイコン（
        <img alt="intelliJ IDEA gradle アイコン"
              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>）
        をクリックして Gradle の変更を読み込みます。</p>
                </p>
            </step>
            <step>
                <p>
                    <Path>src/test/kotlin/com/example</Path> に移動し、<Path>ApplicationTest.kt</Path> ファイルを開きます。
                </p>
            </step>
            <step>
                <p>
                    生成されたテストクラスを以下の実装に置き換えます。
                </p>
                [object Promise]
                <p>
                    この設定では、次のことを行います。
                </p>
                <list>
                    <li>
                        サービスがテスト環境内で実行されるように構成し、Routing、JSON Serialization、WebSockets など、本番環境と同じ機能を有効にします。
                    </li>
                    <li>
                        <Links href="/ktor/client-create-and-configure" summary="Ktor クライアントを作成および構成する方法を学びます。">Ktor クライアント</Links>内でコンテンツネゴシエーションと WebSocket サポートを構成します。これがなければ、クライアントは WebSocket 接続を使用する際にオブジェクトを JSON として (デ)シリアル化する方法を知りません。
                    </li>
                    <li>
                        サービスが返送すると予想される <code>Tasks</code> のリストを宣言します。
                    </li>
                    <li>
                        クライアントオブジェクトの <code>websocket</code> メソッドを使用して、<code>/tasks</code> にリクエストを送信します。
                    </li>
                    <li>
                        受信タスクを <code>flow</code> として消費し、それらをリストに増分的に追加します。
                    </li>
                    <li>
                        すべてのタスクが受信されたら、通常の方法で <code>expectedTasks</code> を <code>actualTasks</code> と比較します。
                    </li>
                </list>
            </step>
        </procedure>
    </chapter>
    <chapter title="次のステップ" id="next-steps">
        <p>
            よくできました！Ktor クライアントとの WebSocket 通信と自動テストを組み込むことで、タスクマネージャーサービスが大幅に強化されました。
        </p>
        <p>
            <Links href="/ktor/server-integrate-database" summary="Exposed SQL ライブラリを使用して Ktor サービスをデータベースリポジトリに接続するプロセスを学びます。">次のチュートリアル</Links>に進み、Exposed ライブラリを使用してサービスがリレーショナルデータベースとシームレスに連携する方法を探ります。
        </p>
    </chapter>
</topic>