[//]: # (title: WebSocket 擴充功能 API)

Ktor WebSocket API 支援編寫您自己的擴充功能（例如 [RFC-7692](https://tools.ietf.org/html/rfc7692)）或任何自訂擴充功能。

## 安裝擴充功能

若要安裝和配置擴充功能，我們提供兩種方法：`extensions` 和 `install`，可按以下方式使用：
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* 選用擴充功能配置。 */ 
        }
    }
}
```

擴充功能會依照安裝順序使用。

## 檢查擴充功能是否已協商

所有已安裝的擴充功能都會經過協商程序，並且成功協商的擴充功能會在請求期間使用。
您可以使用 `WebSocketSession.extensions: : List<WebSocketExtension<*>>` 屬性來獲取目前會話使用的所有擴充功能列表。

有兩種方法可以檢查擴充功能是否正在使用中：`WebSocketSession.extension` 和 `WebSocketSession.extensionOrNull`：
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // 如果 `MyWebSocketExtension` 未經協商，則會拋出異常
    // 或
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // 如果 `MyWebSocketExtension` 未經協商，則會關閉會話
}
```

## 編寫新的擴充功能

有兩個介面用於實作新的擴充功能：`WebSocketExtension<ConfigType: Any>` 和 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`。
單一實作即可同時適用於客戶端和伺服器。

以下是一個簡單的幀日誌擴充功能如何實作的範例：

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

該外掛程式有兩組欄位和方法。第一組用於擴充功能協商：

```kotlin
    /** 用於客戶端請求中協商的協定列表 **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * 此方法將為伺服器呼叫，並處理來自客戶端的 `requestedProtocols`。
      * 結果，它將返回伺服器同意使用的擴充功能列表。
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("伺服器協商")
        return emptyList()
    }

    /**
      * 此方法將在客戶端呼叫，並帶有由 `serverNegotiation` 產生的協定列表。它將決定是否應使用這些擴充功能。 
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("客戶端協商")
        return true
    }

```

第二組是實際幀處理的地方。方法將接收一個幀，並在必要時產生一個新的處理過的幀：

```kotlin
    override fun processOutgoingFrame(frame: Frame): Frame {
        logger.log("處理傳出幀: $frame")
        return frame
    }

    override fun processIncomingFrame(frame: Frame): Frame {
        logger.log("處理傳入幀: $frame")
        return frame
    }
```

還有一些實作細節：該外掛程式具有 `Config` 和對原始 `factory` 的引用。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 可以建立目前擴充功能實例的工廠。 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

工廠通常在伴生物件中實作（類似於常規外掛程式）：

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* 用於發現已安裝擴充功能實例的鍵 */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 已佔用的 RSV 位元列表。
         * 如果擴充功能佔用了一個位元，則不能在其他已安裝的擴充功能中使用。我們使用這些位元來防止外掛程式衝突（防止安裝多個壓縮外掛程式）。如果您正在實作使用某些 RFC 的外掛程式，則應在此處參考佔用的 RSV 位元。
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