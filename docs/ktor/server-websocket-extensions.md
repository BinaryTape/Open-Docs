[//]: # (title: WebSocket 扩展 API)

Ktor WebSocket API 支持编写你自己的扩展（例如 [RFC-7692](https://tools.ietf.org/html/rfc7692)）或任何自定义扩展。

## 安装扩展

为了安装和配置扩展，我们提供了两种方法：`extensions` 和 `install`，可按以下方式使用：
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

## 检测扩展是否已协商

所有已安装的扩展都将经历协商过程，成功协商的扩展将在请求期间使用。
你可以使用 `WebSocketSession.extensions: List<WebSocketExtension<*>>` 属性，其中包含当前会话所使用的所有扩展的 list。

有两种方法可以检测扩展是否正在使用：`WebSocketSession.extension` 和 `WebSocketSession.extensionOrNull`：
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // will throw if `MyWebSocketExtension` is not negotiated
    // or
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // will close the session if `MyWebSocketExtension` is not negotiated
}
```

## 编写新的扩展

有两种用于实现新扩展的接口：`WebSocketExtension<ConfigType: Any>` 和 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`。
单个实现可以同时适用于客户端和服务器。

以下是一个简单的帧日志扩展如何实现的示例：

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

该插件有两组字段和方法。第一组用于扩展协商：

```kotlin
    /** 要随客户端请求发送以进行协商的协议 list **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * 此方法将针对服务器调用，并将处理来自客户端的 `requestedProtocols`。
      * 结果是，它将返回服务器同意使用的扩展 list。
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * 此方法将在客户端上调用，其中包含由 `serverNegotiation` 生成的协议 list。它将决定是否应使用这些扩展。
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("Client negotiation")
        return true
    }

```

第二组是实际帧处理的位置。方法将接收一个帧，并在必要时生成一个新的已处理帧：

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
    * 一个可以创建当前扩展实例的 factory。
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

factory 通常在伴生对象中实现（类似于常规插件）：

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* 用于发现已安装扩展实例的 Key */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 占用的 rsv 位 list。
         * 如果扩展占用了某个位，则不能在其他已安装的扩展中使用。我们使用这些位来防止插件冲突（防止安装多个压缩插件）。如果您正在使用某个 RFC 实现插件，则应在那里引用占用的 rsv 位。
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** 创建插件实例。将为每个 WebSocket 会话调用 **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}
```