[//]: # (title: WebSocket 擴充功能 API)

Ktor WebSocket API 支援撰寫您自己的擴充功能 (例如 [RFC-7692](https://tools.ietf.org/html/rfc7692)) 或任何自訂擴充功能。

## 安裝擴充功能

為了安裝及設定擴充功能，我們提供兩種方法：`extensions` 與 `install`，可依以下方式使用：
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* 選用擴充功能設定。 */ 
        }
    }
}
```

擴充功能會依據安裝順序使用。

## 檢查擴充功能是否已協商

所有已安裝的擴充功能都會經過協商程序，而成功協商的擴充功能會在請求期間使用。您可以使用 `WebSocketSession.extensions: : List<WebSocketExtension<*>>` 屬性，取得當前會話 (session) 所使用的所有擴充功能清單。

有兩種方法可以檢查擴充功能是否正在使用：`WebSocketSession.extension` 與 `WebSocketSession.extensionOrNull`：
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // 如果未協商 `MyWebSocketExtension` 將會拋出錯誤
    // 或者
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // 如果未協商 `MyWebSocketExtension` 將會關閉會話
}
```

## 撰寫新的擴充功能

實作新擴充功能有兩個介面 (interface)：`WebSocketExtension<ConfigType: Any>` 與 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`。單一實作即可同時適用於用戶端 (client) 和伺服器 (server)。

以下是一個範例，說明如何實作一個簡單的幀 (frame) 記錄擴充功能：

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

該外掛程式 (plugin) 有兩組欄位 (field) 和方法 (method)。第一組用於擴充功能協商：

```kotlin
    /** 要在用戶端請求中傳送以供協商的協定清單 **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * 伺服器會呼叫此方法，並處理來自用戶端的 `requestedProtocols`。
      * 結果，它將返回伺服器同意使用的擴充功能清單。
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("伺服器協商")
        return emptyList()
    }

    /**
      * 用戶端會呼叫此方法，並帶入由 `serverNegotiation` 產生的協定清單。它將決定是否應使用這些擴充功能。 
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("用戶端協商")
        return true
    }

```

第二組是實際幀 (frame) 處理的地方。方法將接收一個幀 (frame)，並在必要時產生一個新的處理過後的幀 (frame)：

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

還有一些實作細節：該外掛程式 (plugin) 具有 `Config` 以及對原始 `factory` 的引用。

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 一個可以建立當前擴充功能實例 (instance) 的工廠 (factory)。 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

工廠 (factory) 通常會在伴生物件 (companion object) 中實作 (類似於常規外掛程式 (plugin))：

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* 用於發現已安裝擴充功能實例的鍵 */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 佔用的 rsv 位元 (bits) 清單。
         * 如果擴充功能佔用一個位元，則無法在其他已安裝的擴充功能中使用。我們使用這些位元來防止外掛程式衝突 (防止安裝多個壓縮外掛程式)。如果您正在實作一個使用某些 RFC 的外掛程式，則應在那裡參考佔用的 rsv 位元。
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** 建立外掛程式實例。將為每個 WebSocket 會話呼叫此方法 **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}
```