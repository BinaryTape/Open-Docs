[//]: # (title: WebSocket拡張機能API)

Ktor WebSocket APIは、独自の拡張機能（[RFC-7692](https://tools.ietf.org/html/rfc7692)など）や、あらゆるカスタム拡張機能を記述するのをサポートしています。

## 拡張機能の導入

拡張機能をインストールおよび設定するために、`extensions`と`install`という2つのメソッドを提供しており、これらを以下の方法で使用できます。
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* Optional extension configuration. */ 
        }
    }
}
```

拡張機能は、インストールされた順序で使用されます。

## 拡張機能がネゴシエートされているか確認する

インストールされたすべての拡張機能はネゴシエーションプロセスを経て、正常にネゴシエートされたものがリクエスト中に使用されます。
現在のセッションで使用されているすべての拡張機能のリストを含む`WebSocketSession.extensions: : List<WebSocketExtension<*>>`プロパティを使用できます。

拡張機能が使用されているか確認するには、`WebSocketSession.extension`と`WebSocketSession.extensionOrNull`の2つのメソッドがあります。
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // will throw if `MyWebSocketExtension` is not negotiated
    // or
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // will close the session if `MyWebSocketExtension` is not negotiated
}
```

## 新しい拡張機能を作成する

新しい拡張機能を実装するためのインターフェースは、`WebSocketExtension<ConfigType: Any>`と`WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`の2つです。
単一の実装でクライアントとサーバーの両方に対応できます。

以下は、シンプルなフレームロギング拡張機能の実装例です。

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

このプラグインには、2つのグループのフィールドとメソッドがあります。最初のグループは拡張機能のネゴシエーション用です。

```kotlin
    /** A list of protocols to be sent in a client request for negotiation **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * This method will be called for server and will process `requestedProtocols` from the client.
      * As a result, it will return a list of extensions that server agrees to use.
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * This method will be called on the client with a list of protocols, produced by `serverNegotiation`. It will decide if these extensions should be used. 
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

他にもいくつか実装の詳細があります。このプラグインには`Config`と、元となる`factory`への参照があります。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * A factory which can create a current extension instance. 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

ファクトリは通常、コンパニオンオブジェクト（通常のプラグインと同様）として実装されます。

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* Key to discover installed extension instance */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** List of occupied rsv bits.
         * If the extension occupies a bit, it can't be used in other installed extensions. We use these bits to prevent plugin conflicts(prevent installing multiple compression plugins). If you're implementing a plugin using some RFC, rsv occupied bits should be referenced there.
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** Create plugin instance. Will be called for each WebSocket session **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}