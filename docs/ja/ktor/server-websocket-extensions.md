[//]: # (title: WebSocket拡張API)

Ktor WebSocket APIは、独自の拡張機能（エクステンション）（例：[RFC-7692](https://tools.ietf.org/html/rfc7692)）や、任意のカスタム拡張機能の記述をサポートしています。

## 拡張機能のインストール

拡張機能をインストールして設定するには、2つのメソッド`extensions`と`install`が提供されており、以下のように使用できます。
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* オプションの拡張機能設定。 */ 
        }
    }
}
```

拡張機能はインストールされた順序で使用されます。

## 拡張機能がネゴシエートされているか確認する

インストールされたすべての拡張機能はネゴシエーションプロセスを経ます。そして、正常にネゴシエートされたものがリクエスト中に使用されます。
`WebSocketSession.extensions: : List<WebSocketExtension<*>>`プロパティを使用して、現在のセッションで使用されているすべての拡張機能のリストを取得できます。

拡張機能が使用中かどうかを確認するための2つのメソッドがあります。`WebSocketSession.extension`と`WebSocketSession.extensionOrNull`です。
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // `MyWebSocketExtension`がネゴシエートされていない場合、例外をスローします
    // または
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // `MyWebSocketExtension`がネゴシエートされていない場合、セッションを閉じます
}
```

## 新しい拡張機能を記述する

新しい拡張機能を実装するためのインターフェースは2つあります。`WebSocketExtension<ConfigType: Any>`と`WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`です。
単一の実装でクライアントとサーバーの両方に対応できます。

以下は、シンプルなフレームロギング拡張機能の実装例です。

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

このプラグインには、フィールドとメソッドの2つのグループがあります。最初のグループは拡張機能のネゴシエーション用です。

```kotlin
    /** ネゴシエーションのためにクライアントリクエストで送信されるプロトコルのリスト **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * このメソッドはサーバー用に呼び出され、クライアントからの`requestedProtocols`を処理します。
      * その結果、サーバーが使用することに同意する拡張機能のリストを返します。
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * このメソッドは、`serverNegotiation`によって生成されたプロトコルのリストとともにクライアントで呼び出されます。これらの拡張機能を使用すべきかどうかを決定します。 
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("Client negotiation")
        return true
    }

```

2番目のグループは、実際のフレーム処理を行う場所です。メソッドはフレームを受け取り、必要に応じて新しい処理済みフレームを生成します。

```kotlin
    override fun processOutgoingFrame(frame: Frame): Frame {
        logger.log("Process outgoing frame: $frame")
        return frame
    }

    override fun processIncomingFrame(frame: Frame): Frame {
        logger.log("Process incoming frame: $frame")
        return frame
    }
```

他にも実装の詳細がいくつかあります。プラグインには`Config`と元の`factory`への参照があります。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 現在の拡張機能インスタンスを作成できるファクトリ。 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

ファクトリは通常、コンパニオンオブジェクトに実装されます（通常のプラグインと同様に）：

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* インストールされた拡張機能インスタンスを発見するためのキー */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 占有されているrsvビットのリスト。
         * 拡張機能がビットを占有している場合、他のインストール済み拡張機能では使用できません。これらのビットを使用して、プラグインの競合（複数の圧縮プラグインのインストールを防止）を防ぎます。RFCを使用してプラグインを実装している場合、rsv占有ビットはそこで参照する必要があります。
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** プラグインインスタンスを作成します。各WebSocketセッションで呼び出されます **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}