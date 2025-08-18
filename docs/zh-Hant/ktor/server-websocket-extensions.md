[//]: # (title: WebSocket 擴充功能 API)

Ktor WebSocket API 支援撰寫您自己的擴充功能（例如 [RFC-7692](https://tools.ietf.org/html/rfc7692)）或任何自訂擴充功能。

## 安裝擴充功能

若要安裝及設定擴充功能，我們提供兩種方法：`extensions` 和 `install`，可依以下方式使用：
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* 可選的擴充功能設定。 */ 
        }
    }
}
```

擴充功能依安裝順序使用。

## 檢查擴充功能是否已協商

所有已安裝的擴充功能都會經過協商程序，成功協商的擴充功能將在請求期間使用。您可以使用 `WebSocketSession.extensions: : List<WebSocketExtension<*>>` 屬性，搭配目前會話使用的所有擴充功能列表。

有兩種方法可以檢查擴充功能是否正在使用：`WebSocketSession.extension` 和 `WebSocketSession.extensionOrNull`：
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // 如果 MyWebSocketExtension 未經協商，將會拋出例外
    // 或
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // 如果 MyWebSocketExtension 未經協商，將會關閉會話
}
```

## 撰寫新的擴充功能

有兩種介面可用於實作新的擴充功能：`WebSocketExtension<ConfigType: Any>` 和 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`。單一實作可同時適用於用戶端和伺服器。

下面是一個範例，說明如何實作一個簡單的幀日誌擴充功能：

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

此外掛程式有兩組欄位和方法。第一組用於擴充功能協商：

```kotlin
    /** 一個將在用戶端請求中發送以進行協商的協定列表 **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * 此方法將為伺服器呼叫，並處理來自用戶端的 `requestedProtocols`。
      * 結果將傳回伺服器同意使用的擴充功能列表。
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * 此方法將在用戶端呼叫，帶有 `serverNegotiation` 產生的協定列表。它將決定是否應使用這些擴充功能。 
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("Client negotiation")
        return true
    }

```

第二組是實際幀處理的地方。方法將接收一個幀，並在必要時產生一個新的已處理幀：

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

還有一些實作細節：此外掛程式具有 `Config` 和對原始 `factory` 的引用。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 可建立目前擴充功能實例的工廠。 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

工廠通常在伴生物件中實作（類似於常規外掛程式）：

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* 用於發現已安裝擴充功能實例的鍵 */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 已佔用的 rsv 位元列表。
         * 如果擴充功能佔用一個位元，則不能在其他已安裝的擴充功能中使用。我們使用這些位元來防止外掛程式衝突（防止安裝多個壓縮外掛程式）。如果您正在使用某些 RFC 實作外掛程式，則應在其中引用已佔用的 rsv 位元。
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** 建立外掛程式實例。將為每個 WebSocket 會話呼叫 **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}
```