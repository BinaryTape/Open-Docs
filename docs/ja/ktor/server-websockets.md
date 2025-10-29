[//]: # (title: KtorサーバーにおけるWebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

<link-summary>
WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。
</link-summary>

<snippet id="websockets-description">

WebSocketは、単一のTCP接続を介してユーザーのブラウザとサーバー間で全二重通信セッションを提供するプロトコルです。これは、サーバーとの間でリアルタイムのデータ転送を必要とするアプリケーションの作成に特に役立ちます。

Ktorは、サーバー側とクライアント側の両方でWebSocketプロトコルをサポートしています。

</snippet>

Ktorを使用すると、次のことができます。

*   基本的なWebSocket設定（フレームサイズ、ping期間など）を構成できます。
*   サーバーとクライアント間でメッセージを交換するためのWebSocketセッションを処理できます。
*   WebSocket拡張機能を追加できます。例えば、[Deflate](server-websocket-deflate.md)拡張機能を使用したり、[カスタム拡張機能](server-websocket-extensions.md)を実装したりできます。

> クライアント側でのWebSocketサポートについては、[WebSocketsクライアントプラグイン](client-websockets.topic)を参照してください。

> 一方向通信セッションの場合、[Server-Sent Events (SSE)](server-server-sent-events.topic)の使用を検討してください。SSEは、サーバーがクライアントにイベントベースの更新を送信する必要がある場合に特に役立ちます。
>
{style="note"}

## 依存関係を追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## WebSocketsをインストールする {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出しの内部。
    </li>
    <li>
        ... 明示的に定義された<code>module</code>（<code>Application</code>クラスの拡張関数）の内部。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## WebSocketsを構成する {id="configure"}

オプションで、[WebSocketOptions](https://api.ktor.io/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html)を渡すことで、`install`ブロック内でプラグインを構成できます。

*   `pingPeriod`プロパティを使用して、ping間の期間を指定します。
*   `timeout`プロパティを使用して、接続が閉じられるまでのタイムアウトを設定します。
*   `maxFrameSize`プロパティを使用して、送受信できる最大フレームを設定します。
*   `masking`プロパティを使用して、マスキングが有効になっているかどうかを指定します。
*   `contentConverter`プロパティを使用して、シリアライゼーション/デシリアライゼーション用のコンバーターを設定します。

```kotlin
install(WebSockets) {
    pingPeriod = 15.seconds
    timeout = 15.seconds
    maxFrameSize = Long.MAX_VALUE
    masking = false
}
```

## WebSocketセッションを処理する {id="handle-sessions"}

### APIの概要 {id="api-overview"}

`WebSockets`プラグインをインストールして構成したら、WebSocketセッションを処理するエンドポイントを定義できます。サーバー上でWebSocketエンドポイントを定義するには、[ルーティング](server-routing.md#define_route)ブロック内で`webSocket`関数を呼び出します。

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

この例では、[デフォルト構成](server-configuration-file.topic)が使用されている場合、サーバーは`ws://localhost:8080/echo`へのWebSocketリクエストを受け入れます。

`webSocket`ブロック内では、[DefaultWebSocketServerSession](https://api.ktor.io/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html)クラスで表されるWebSocketセッションのハンドラーを定義します。
ブロック内で以下の関数とプロパティを使用できます。

*   `send`関数を使用して、テキストコンテンツをクライアントに送信します。
*   `incoming`および`outgoing`プロパティを使用して、WebSocketフレームを受信および送信するためのチャネルにアクセスします。フレームは`Frame`クラスで表されます。
*   `close`関数を使用して、指定された理由でクローズフレームを送信します。

セッションを処理する際に、フレームタイプを確認できます。例えば：

*   `Frame.Text`はテキストフレームです。このフレームタイプの場合、`Frame.Text.readText()`を使用してその内容を読み取ることができます。
*   `Frame.Binary`はバイナリフレームです。このタイプの場合、`Frame.Binary.readBytes()`を使用してその内容を読み取ることができます。

> `incoming`チャネルには、ping/pongやクローズフレームなどの制御フレームは含まれていないことに注意してください。
> 制御フレームを処理し、断片化されたフレームを再構築するには、[webSocketRaw](https://api.ktor.io/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html)関数を使用してWebSocketセッションを処理します。
>
{style="note"}

> クライアントに関する情報（クライアントのIPアドレスなど）を取得するには、`call`プロパティを使用します。[一般的なリクエスト情報](server-requests.md#request_information)について学びましょう。

以下では、このAPIの使用例を見ていきます。

### 例: 単一セッションの処理 {id="handle-single-session"}

以下の例は、1つのクライアントとのセッションを処理する`echo` WebSocketエンドポイントを作成する方法を示しています。

```kotlin
routing {
    webSocket("/echo") {
        send("Please enter your name")
        for (frame in incoming) {
            frame as? Frame.Text ?: continue
            val receivedText = frame.readText()
            if (receivedText.equals("bye", ignoreCase = true)) {
                close(CloseReason(CloseReason.Codes.NORMAL, "Client said BYE"))
            } else {
                send(Frame.Text("Hi, $receivedText!"))
            }
        }
    }
}
```

完全な例については、[server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)を参照してください。

### 例: 複数セッションの処理 {id="handle-multiple-session"}

複数のWebSocketセッションを効率的に管理し、ブロードキャストを処理するには、Kotlinの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)を利用できます。このアプローチは、WebSocket通信を管理するためのスケーラブルで並行処理に適した方法を提供します。このパターンを実装する方法を以下に示します。

1.  メッセージをブロードキャストするための`SharedFlow`を定義します。

```kotlin
val messageResponseFlow = MutableSharedFlow<MessageResponse>()
val sharedFlow = messageResponseFlow.asSharedFlow()
```

2.  WebSocketルートで、ブロードキャストとメッセージ処理ロジックを実装します。

```kotlin

        webSocket("/ws") {
            send("You are connected to WebSocket!")

            val job = launch {
                sharedFlow.collect { message ->
                    send(message.message)
                }
            }

            runCatching {
                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        val receivedText = frame.readText()
                        val messageResponse = MessageResponse(receivedText)
                        messageResponseFlow.emit(messageResponse)
                    }
                }
            }.onFailure { exception ->
                println("WebSocket exception: ${exception.localizedMessage}")
            }.also {
                job.cancel()
            }
        }
```

`runCatching`ブロックは、受信メッセージを処理し、それらを`SharedFlow`に発行し、その後すべてのコレクターにブロードキャストします。

このパターンを使用することで、個々の接続を手動で追跡することなく、複数のWebSocketセッションを効率的に管理できます。このアプローチは、多数の同時WebSocket接続を持つアプリケーションでうまくスケールし、メッセージブロードキャストを処理するためのクリーンでリアクティブな方法を提供します。

完全な例については、[server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)を参照してください。

## WebSocket APIとKtor {id="websocket-api"}

[WebSocket APIの標準イベント](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)は、Ktorでは次のようにマッピングされます。

*   `onConnect`はブロックの開始時に発生します。
*   `onMessage`は、メッセージを正常に読み取った後（例: `incoming.receive()`を使用した場合）、または`for(frame in incoming)`でサスペンドされたイテレーションを使用した後に発生します。
*   `onClose`は、`incoming`チャネルが閉じられたときに発生します。これにより、サスペンドされたイテレーションが完了するか、メッセージを受信しようとしたときに`ClosedReceiveChannelException`がスローされます。
*   `onError`は他の例外と同等です。

`onClose`と`onError`の両方で、`closeReason`プロパティが設定されます。

以下の例では、無限ループは例外が発生した場合にのみ終了します（`ClosedReceiveChannelException`または他の例外）。

```kotlin
webSocket("/echo") {
    println("onConnect")
    try {
        for (frame in incoming){
            val text = (frame as Frame.Text).readText()
            println("onMessage")
            received += text
            outgoing.send(Frame.Text(text))
        }
    } catch (e: ClosedReceiveChannelException) {
        println("onClose ${closeReason.await()}")
    } catch (e: Throwable) {
        println("onError ${closeReason.await()}")
        e.printStackTrace()
    }
}