[//]: # (title: WebSocket 扩展 API)

Ktor WebSocket API 支持编写自己的扩展 (例如 [RFC-7692](https://tools.ietf.org/html/rfc7692)) 或任何自定义扩展。

## 安装扩展

要安装和配置扩展，我们提供了两种方法：`extensions` 和 `install`，可以按以下方式使用：
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* Optional extension configuration. */ 
        }
    }
}
```

扩展按安装顺序使用。

## 检查扩展是否已协商

所有已安装的扩展都会经过协商过程，成功协商的扩展将在请求期间使用。
您可以使用 `WebSocketSession.extensions: List<WebSocketExtension<*>>` 属性来获取当前会话所使用的所有扩展列表。

有两种方法可以检查扩展是否正在使用：`WebSocketSession.extension` 和 `WebSocketSession.extensionOrNull`：
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // will throw if `MyWebSocketExtension` is not negotiated
    // or
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // will close the session if `MyWebSocketExtension` is not negotiated
}
```

## 编写新扩展

有两种接口可用于实现新扩展：`WebSocketExtension<ConfigType: Any>` 和 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`。
一个实现可以同时适用于客户端和服务器。

下面是一个示例，展示了如何实现一个简单的帧日志扩展：

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

该插件有两组字段和方法。第一组用于扩展协商：

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

第二组是实际帧处理的位置。方法将接收一个帧，并在必要时生成一个新的处理过的帧：

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

还有一些实现细节：该插件具有 `Config` 和对原始 `factory` 的引用。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * A factory which can create a current extension instance. 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

工厂通常在伴生对象中实现 (类似于常规插件)：

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