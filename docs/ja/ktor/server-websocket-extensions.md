[//]: # (title: WebSocket拡張機能API)

Ktor WebSocket API は、独自の拡張機能（[RFC-7692](https://tools.ietf.org/html/rfc7692) など）や任意のカスタム拡張機能を記述することをサポートしています。

## 拡張機能のインストール

拡張機能をインストールおよび設定するために、`extensions` と `install` の2つのメソッドが提供されており、以下のように使用できます。
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* Optional extension configuration. */ 
        }
    }
}
```

拡張機能はインストールされた順序で使用されます。

## 拡張機能がネゴシエートされているか確認する

インストールされたすべての拡張機能はネゴシエーションプロセスを経て、正常にネゴシエートされたものがリクエスト中に使用されます。
現在のセッションで使用されているすべての拡張機能のリストは、`WebSocketSession.extensions: : List<WebSocketExtension<*>>` プロパティで確認できます。

拡張機能が使用中かどうかを確認するには、`WebSocketSession.extension` と `WebSocketSession.extensionOrNull` の2つのメソッドがあります。
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // will throw if `MyWebSocketExtension` is not negotiated
    // or
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // will close the session if `MyWebSocketExtension` is not negotiated
}
```

## 新しい拡張機能を記述する

新しい拡張機能を実装するためのインターフェースは2つあります: `WebSocketExtension<ConfigType: Any>` と
`WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`。
単一の実装でクライアントとサーバーの両方に対応できます。

以下は、シンプルなフレームロギング拡張機能の実装例です。

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

このプラグインには2つのフィールドとメソッドのグループがあります。最初のグループは拡張機能のネゴシエーション用です。

```kotlin
    /** クライアント要求でネゴシエーションのために送信されるプロトコルリスト **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * このメソッドはサーバーで呼び出され、クライアントからの `requestedProtocols` を処理します。
      * その結果、サーバーが使用することに同意する拡張機能のリストを返します。
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * このメソッドは、`serverNegotiation` によって生成されたプロトコルリストと共にクライアントで呼び出されます。これらの拡張機能を使用すべきかどうかを決定します。 
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

実装の詳細として、このプラグインには `Config` と元の `factory` への参照があります。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 現在の拡張インスタンスを作成できるファクトリ。 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

ファクトリは通常、コンパニオンオブジェクト（通常のプラグインと同様）で実装されます。

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* インストールされた拡張インスタンスを検出するためのキー */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 占有されているrsvビットのリスト。
         * 拡張機能がビットを占有している場合、他のインストールされた拡張機能では使用できません。これらのビットを使用してプラグインの競合（複数の圧縮プラグインのインストール防止）を防ぎます。RFCを使用してプラグインを実装している場合、rsv占有ビットはそこで参照される必要があります。
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** プラグインインスタンスを作成します。各WebSocketセッションで呼び出されます。 **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}