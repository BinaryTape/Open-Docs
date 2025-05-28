[//]: # (title: KtorサーバーにおけるWebSockets)

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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。
</link-summary>

<snippet id="websockets-description">

WebSocketは、単一のTCP接続を介してユーザーのブラウザとサーバー間で全二重通信セッションを提供するプロトコルです。これは、サーバーとの間でリアルタイムのデータ転送を必要とするアプリケーションの作成に特に役立ちます。

Ktorは、WebSocketプロトコルをサーバー側とクライアント側の両方でサポートしています。

</snippet>

Ktorを使用すると、次のことができます。

*   フレームサイズ、ping期間などの基本的なWebSocket設定を構成できます。
*   サーバーとクライアント間でメッセージを交換するためのWebSocketセッションを処理できます。
*   WebSocket拡張機能を追加できます。たとえば、[Deflate](server-websocket-deflate.md)拡張機能を使用したり、[カスタム拡張機能](server-websocket-extensions.md)を実装したりできます。

> クライアント側のWebSocketサポートについては、[WebSocketsクライアントプラグイン](client-websockets.topic)を参照してください。

> 一方向通信セッションの場合、[Server-Sent Events (SSE)](server-server-sent-events.topic)の使用を検討してください。SSEは、サーバーがクライアントにイベントベースの更新を送信する必要がある場合に特に役立ちます。
>
{style="note"}

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## WebSocketsのインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## WebSocketsの設定 {id="configure"}

オプションで、`install`ブロック内で[WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html)を渡すことで、プラグインを構成できます。

*   `pingPeriod`プロパティを使用して、ping間の期間を指定します。
*   `timeout`プロパティを使用して、接続が閉じられるまでのタイムアウトを設定します。
*   `maxFrameSize`プロパティを使用して、送受信可能な最大`Frame`を設定します。
*   `masking`プロパティを使用して、マスキングが有効になっているかどうかを指定します。
*   `contentConverter`プロパティを使用して、シリアライズ/デシリアライズ用のコンバーターを設定します。

```kotlin
```

{src="snippets/server-websockets/src/main/kotlin/com/example/Application.kt" include-lines="13-18"}

## WebSocketセッションの処理 {id="handle-sessions"}

### APIの概要 {id="api-overview"}

`WebSockets`プラグインをインストールして構成したら、WebSocketセッションを処理するエンドポイントを定義できます。サーバー上でWebSocketエンドポイントを定義するには、[ルーティング](server-routing.md#define_route)ブロック内で`webSocket`関数を呼び出します。

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

この例では、[デフォルト設定](server-configuration-file.topic)が使用されている場合、サーバーは`ws://localhost:8080/echo`へのWebSocketリクエストを受け入れます。

`webSocket`ブロック内では、[DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html)クラスによって表されるWebSocketセッションのハンドラーを定義します。
このブロック内で次の関数とプロパティが利用可能です。

*   `send`関数を使用して、クライアントにテキストコンテンツを送信します。
*   `incoming`および`outgoing`プロパティを使用して、WebSocketフレームの受信および送信用のチャネルにアクセスします。フレームは`Frame`クラスによって表されます。
*   `close`関数を使用して、指定された理由でクローズフレームを送信します。

セッションを処理する際、例としてフレームの型を確認できます。

*   `Frame.Text`はテキストフレームです。このフレームの型の場合、`Frame.Text.readText()`を使用してそのコンテンツを読み取ることができます。
*   `Frame.Binary`はバイナリフレームです。この型の場合、`Frame.Binary.readBytes()`を使用してそのコンテンツを読み取ることができます。

> 注意点として、`incoming`チャネルにはping/pongやクローズフレームのような制御フレームは含まれません。
> 制御フレームを処理し、断片化されたフレームを再構築するには、[webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html)関数を使用してWebSocketセッションを処理します。
>
{style="note"}

> クライアントに関する情報（クライアントのIPアドレスなど）を取得するには、`call`プロパティを使用します。詳細については、[](server-requests.md#request_information)を参照してください。

以下では、このAPIの使用例を見ていきましょう。

### 例: 単一セッションの処理 {id="handle-single-session"}

以下の例は、`echo` WebSocketエンドポイントを作成して単一クライアントとのセッションを処理する方法を示しています。

```kotlin
```

{src="snippets/server-websockets/src/main/kotlin/com/example/Application.kt" include-lines="19,24-36"}

完全な例については、[server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)を参照してください。

### 例: 複数セッションの処理 {id="handle-multiple-session"}

複数のWebSocketセッションを効率的に管理し、ブロードキャストを処理するには、Kotlinの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)を活用できます。このアプローチは、WebSocket通信を管理するためのスケーラブルで並行処理に適した方法を提供します。このパターンを実装する方法は次のとおりです。

1.  メッセージをブロードキャストするための`SharedFlow`を定義します。

```kotlin
```

{src="snippets/server-websockets-sharedflow/src/main/kotlin/com/example/plugins/Sockets.kt" include-lines="23-24"}

2.  WebSocketルートで、ブロードキャストとメッセージ処理ロジックを実装します。

```kotlin
```

{src="snippets/server-websockets-sharedflow/src/main/kotlin/com/example/plugins/Sockets.kt" include-lines="25-48"}

`runCatching`ブロックは受信メッセージを処理し、それらを`SharedFlow`に発行します。`SharedFlow`はその後、すべてのコレクターにブロードキャストします。

このパターンを使用することで、個々の接続を手動で追跡することなく、複数のWebSocketセッションを効率的に管理できます。このアプローチは、多数の並行WebSocket接続を持つアプリケーションで適切にスケーリングし、メッセージブロードキャストを処理するためのクリーンでリアクティブな方法を提供します。

完全な例については、[server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)を参照してください。

## WebSocket APIとKtor {id="websocket-api"}

[WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)の標準イベントは、Ktorでは次のように対応します。

*   `onConnect`はブロックの開始時に発生します。
*   `onMessage`は、メッセージを正常に読み取った後（たとえば、`incoming.receive()`を使用した場合）、または`for(frame in incoming)`でサスペンド反復を使用した場合に発生します。
*   `onClose`は、`incoming`チャネルが閉じられたときに発生します。これにより、サスペンド反復が完了するか、メッセージを受信しようとすると`ClosedReceiveChannelException`がスローされます。
*   `onError`は他の例外と同等です。

`onClose`と`onError`の両方で、`closeReason`プロパティが設定されます。

以下の例では、無限ループは例外が発生した場合にのみ終了します（`ClosedReceiveChannelException`または別の例外のいずれか）。

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
```