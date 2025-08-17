[//]: # (title: WebSocket Deflate 擴充功能)

Ktor 實作了適用於客戶端和伺服器的 `Deflate` WebSocket 擴充功能 [RFC-7692](https://tools.ietf.org/html/rfc7692)。此擴充功能可以在傳送前透明地壓縮訊框，並在接收後解壓縮。如果您正在傳送大量文字資料，啟用此擴充功能會很有用。

## 安裝

若要使用此擴充功能，應首先安裝它。為此，我們可以在 `extensions` 區塊中使用 `install` 方法：

```kotlin
// 適用於客戶端和伺服器
install(WebSockets) {
    extensions {
        install(WebSocketDeflateExtension) {
            /**
             * 用於 [java.util.zip.Deflater] 的壓縮等級。
             */
            compressionLevel = Deflater.DEFAULT_COMPRESSION

            /**
             * 防止壓縮小型傳出訊框。
             */
            compressIfBiggerThan(bytes = 4 * 1024)
        }
    }
}
```

### 進階配置參數

#### 上下文接管

指定客戶端 (和伺服器) 是否應使用壓縮視窗。啟用這些參數可減少每個單一工作階段所分配的空間量。請注意，由於 `java.util.zip.Deflater` API 的限制，視窗大小無法配置。此值固定為 `15`。

```kotlin
clientNoContextTakeOver = false

serverNoContextTakeOver = false
```

這些參數描述於 [RFC-7692 第 7.1.1 節](https://tools.ietf.org/html/rfc7692#section-7.1.1)

#### 指定壓縮條件

若要明確指定壓縮條件，您可以使用 `compressIf` 方法。例如，僅壓縮文字：

```kotlin
compressIf { frame ->
    frame is Frame.Text
}
```
在壓縮發生之前，所有對 `compressIf` 的呼叫都將被評估。

#### 微調協定列表

要傳送的協定列表可以透過 `configureProtocols` 方法視需要編輯：

```kotlin
configureProtocols { protocols ->
    protocols.clear()
    protocols.add(...)
}