[//]: # (title: KtorサーバーでのWebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
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

WebSocketは、単一のTCP接続を介してユーザーのブラウザとサーバー間で全二重通信セッションを提供するプロトコルです。特に、サーバーとの間でリアルタイムのデータ転送を必要とするアプリケーションの作成に役立ちます。

Ktorは、サーバー側とクライアント側の両方でWebSocketプロトコルをサポートしています。

</snippet>

Ktorを使用すると、次のことができます。

*   フレームサイズ、ピング期間などの基本的なWebSocket設定を構成できます。
*   サーバーとクライアント間でメッセージを交換するためのWebSocketセッションを処理できます。
*   WebSocket拡張機能を追加できます。例えば、[Deflate](server-websocket-deflate.md)拡張機能を使用したり、[カスタム拡張機能](server-websocket-extensions.md)を実装したりできます。

> クライアント側のWebSocketサポートについては、[WebSocketsクライアントプラグイン](client-websockets.topic)を参照してください。

> 一方向通信セッションの場合、[Server-Sent Events (SSE)](server-server-sent-events.topic)の使用を検討してください。SSEは、サーバーがクライアントにイベントベースの更新を送信する必要がある場合に特に役立ちます。
>
{style="note"}

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## WebSocketsのインストール {id="install_plugin"}

    <p>
        アプリケーションに <code>%plugin_name%</code> プラグインを <a href="#install">インストール</a>するには、指定された <Links href="/ktor/server-modules" summary="モジュールを使用すると、ルーティングをグループ化してアプリケーションを構造化できます。">モジュール</Links> 内の <code>install</code> 関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 関数呼び出し内。
        </li>
        <li>
            ... <code>Application</code> クラスの拡張関数である、明示的に定義された <code>module</code> 内。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## WebSocketsの構成 {id="configure"}

オプションで、`install` ブロック内で [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html)を渡すことでプラグインを構成できます。

*   `pingPeriod` プロパティを使用して、ピング間の期間を指定します。
*   `timeout` プロパティを使用して、接続が閉じられるまでのタイムアウトを設定します。
*   `maxFrameSize` プロパティを使用して、受信または送信できる最大フレームサイズを設定します。
*   `masking` プロパティを使用して、マスキングが有効になっているかどうかを指定します。
*   `contentConverter` プロパティを使用して、シリアル化/逆シリアル化のためのコンバーターを設定します。

[object Promise]

## WebSocketセッションの処理 {id="handle-sessions"}

### APIの概要 {id="api-overview"}

`WebSockets` プラグインをインストールして構成したら、WebSocketセッションを処理するエンドポイントを定義できます。サーバー上でWebSocketエンドポイントを定義するには、[routing](server-routing.md#define_route)ブロック内で `webSocket` 関数を呼び出します。

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

この例では、[デフォルト設定](server-configuration-file.topic)が使用されている場合、サーバーは `ws://localhost:8080/echo` へのWebSocketリクエストを受け入れます。

`webSocket` ブロック内では、[DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html)クラスで表されるWebSocketセッションのハンドラーを定義します。
このブロック内で利用できる関数とプロパティは以下の通りです。

*   `send` 関数を使用して、テキストコンテンツをクライアントに送信します。
*   `incoming` プロパティと `outgoing` プロパティを使用して、WebSocketフレームの受信および送信用のチャンネルにアクセスします。フレームは `Frame` クラスで表されます。
*   `close` 関数を使用して、指定された理由でクローズフレームを送信します。

セッションを処理する際、フレームタイプを確認できます。例えば：

*   `Frame.Text` はテキストフレームです。このフレームタイプの場合、`Frame.Text.readText()` を使用してその内容を読み取ることができます。
*   `Frame.Binary` はバイナリフレームです。このタイプの場合、`Frame.Binary.readBytes()` を使用してその内容を読み取ることができます。

> `incoming` チャンネルには、ping/pongやcloseフレームなどの制御フレームは含まれないことに注意してください。
> 制御フレームを処理し、断片化されたフレームを再構築するには、[webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html)関数を使用してWebSocketセッションを処理します。
>
{style="note"}

> クライアントに関する情報（クライアントのIPアドレスなど）を取得するには、`call` プロパティを使用します。[](server-requests.md#request_information)について学びましょう。

以下では、このAPIの使用例を見ていきます。

### 例: 単一セッションの処理 {id="handle-single-session"}

以下の例は、1つのクライアントとのセッションを処理する `echo` WebSocketエンドポイントを作成する方法を示しています。

[object Promise]

完全な例は、[server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)を参照してください。

### 例: 複数セッションの処理 {id="handle-multiple-session"}

複数のWebSocketセッションを効率的に管理し、ブロードキャストを処理するには、Kotlinの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)を利用できます。このアプローチは、WebSocket通信を管理するためのスケーラブルで並行処理に適した方法を提供します。このパターンを実装する方法は次のとおりです。

1.  メッセージをブロードキャストするための `SharedFlow` を定義します。

[object Promise]

2.  WebSocketルートで、ブロードキャストとメッセージ処理ロジックを実装します。

[object Promise]

`runCatching` ブロックは、受信メッセージを処理し、それらを `SharedFlow` に発行します。`SharedFlow` は、その後、すべてのコレクターにブロードキャストします。

このパターンを使用することで、個々の接続を手動で追跡することなく、複数のWebSocketセッションを効率的に管理できます。このアプローチは、多数の同時WebSocket接続を持つアプリケーションでうまくスケールし、メッセージブロードキャストを処理するためのクリーンでリアクティブな方法を提供します。

完全な例は、[server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)を参照してください。

## WebSocket APIとKtor {id="websocket-api"}

[WebSocket APIの標準イベント](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)は、Ktorに以下のようにマッピングされます。

*   `onConnect` はブロックの開始時に発生します。
*   `onMessage` はメッセージが正常に読み取られた後（例えば、`incoming.receive()` で）、または `for(frame in incoming)` による中断されたイテレーションの使用後に発生します。
*   `onClose` は `incoming` チャンネルが閉じられたときに発生します。これにより、中断されたイテレーションが完了するか、メッセージを受信しようとしたときに `ClosedReceiveChannelException` がスローされます。
*   `onError` は他の例外と同等です。

`onClose` と `onError` の両方で、`closeReason` プロパティが設定されます。

以下の例では、無限ループは例外が発生した場合（`ClosedReceiveChannelException` または別の例外のいずれか）にのみ終了します。

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