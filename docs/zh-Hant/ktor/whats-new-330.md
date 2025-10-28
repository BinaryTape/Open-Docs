[//]: # (title: Ktor 3.3.0 的新功能)

<show-structure for="chapter,procedure" depth="2"/>

_[發佈日期：2025 年 9 月 11 日](releases.md#release-details)_

Ktor 3.3.0 在伺服器、客戶端和工具方面帶來了新功能。以下是此功能版本的一些重點：

*   [靜態資源的自訂回退機制](#custom-fallback)
*   [OpenAPI 規範生成](#openapi-spec-gen)
*   [HTTP/2 明碼 (h2c) 支援](#http2-h2c-support)
*   [實驗性 WebRTC 客戶端](#webrtc-client)

## Ktor 伺服器

### 靜態資源的自訂回退機制 {id="custom-fallback"}

Ktor 3.3.0 引入了一個新的 `fallback()` 函式，用於靜態內容，讓您可以在找不到所請求的資源時定義自訂行為。

與總是提供相同回退檔案的 `default()` 不同，`fallback()` 讓您可以存取原始請求路徑和目前的 `ApplicationCall`。您可以使用它來重定向、返回自訂狀態碼，或動態提供不同的檔案。

若要定義自訂回退行為，請在 `staticFiles()`、`staticResources()`、`staticZip()` 或 `staticFileSystem()` 中使用 `fallback()` 函式：

```kotlin
staticFiles("/files", File("textFiles")) {
    fallback { requestedPath, call ->
        when {
            requestedPath.endsWith(".php") -> call.respondRedirect("/static/index.html") // absolute path
            requestedPath.endsWith(".kt") -> call.respondRedirect("Default.kt") // relative path
            requestedPath.endsWith(".xml") -> call.respond(HttpStatusCode.Gone)
            else -> call.respondFile(File("files/index.html"))
        }
    }
}
```

### 靜態內容的 LastModified 和 Etag 標頭

Ktor 3.3.0 引入了對靜態資源的 `ETag` 和 `LastModified` 標頭的支援。當安裝了 [`ConditionalHeaders`](server-conditional-headers.md) 外掛程式時，您可以處理條件式標頭，以避免在內容自上次請求以來未發生變化時發送內容主體：

```kotlin
staticFiles("/filesWithEtagAndLastModified", File("files")) {
    etag { resource -> EntityTagVersion("etag") }
    lastModified { resource -> GMTDate() }
}
```

這些值會根據每個資源動態計算並應用於回應中。

您也可以使用預定義的提供者，例如使用資源內容的 SHA‑256 雜湊來生成強 `ETag`：

```kotlin
staticFiles("/filesWithStrongGeneratedEtag", File("files")) {
    etag(ETagProvider.StrongSha256)
}
```

### 開發模式自動重新載入的限制

在 Ktor 3.2.0 中，引入的 [suspend 模組函式支援](whats-new-320.md#suspendable-module-functions) 導致了退步，使用阻塞模組引用 (blocking module references) 的應用程式自動重新載入功能停止運作。

此退步在 3.3.0 中仍然存在，自動重新載入功能僅適用於 `suspend` 函式模組和配置引用。

支援的模組宣告範例：

```kotlin
// 支援 — suspend 函式引用
embeddedServer(Netty, port = 8080, module = Application::mySuspendModule)

// 支援 — 配置引用 (application.conf / application.yaml)
ktor {
    application {
        modules = [ com.example.ApplicationKt.mySuspendModule ]
    }
}
```

我們計劃在未來的版本中恢復對阻塞函式引用的支援。在此之前，請在 `development` 模式中優先使用 `suspend` 模組或配置引用。

### HTTP/2 明碼 (h2c) 支援 {id="http2-h2c-support"}

Ktor 3.3.0 引入了 Netty 引擎對 HTTP/2 明碼 (h2c) 的支援，它允許在沒有 TLS 加密的情況下進行 HTTP/2 通訊。
這種設定通常用於受信任的環境，例如本地測試或私有網路。

若要啟用 h2c，請在引擎配置中將 `enableH2c` 標誌設置為 `true`。有關更多資訊，請參閱 [沒有 TLS 的 HTTP/2](server-http2.md#http-2-without-tls)。

## Ktor 客戶端

### SSE 回應主體緩衝區

到目前為止，在 SSE 錯誤後嘗試呼叫 `response.bodyAsText()` 會因為雙重消耗問題而失敗。

Ktor 3.3.0 引入了一個可配置的診斷緩衝區，讓您可以捕獲已處理的 SSE 資料，用於偵錯和錯誤處理。

您可以在安裝 [SSE 外掛程式](client-server-sent-events.topic) 時全域配置緩衝區：

```kotlin
install(SSE) {
    bufferPolicy = SSEBufferPolicy.LastEvents(10)
}
```

或每次呼叫時：

```kotlin
client.sse(url, { bufferPolicy(SSEBufferPolicy.All) }) {
    // …
}
```

當 SSE 串流被消耗時，客戶端會在記憶體緩衝區中維護已處理資料的快照（無需從網路重新讀取）。如果發生錯誤，您可以安全地呼叫 `response?.bodyAsText()` 進行日誌記錄或診斷。

有關更多資訊，請參閱 [回應緩衝](client-server-sent-events.topic#response-buffering)。

### WebRTC 客戶端 {id="webrtc-client"}

此版本為多平台專案引入了實驗性的 WebRTC 客戶端支援，用於點對點即時通訊。

WebRTC 支援視訊通話、多人遊戲和協作工具等應用程式。透過此版本，您現在可以使用統一的 Kotlin API 來建立對等連接 (peer connections) 並在 JavaScript/Wasm 和 Android 目標之間交換資料通道 (data channels)。未來的版本中還計劃支援其他目標，例如 iOS、JVM 桌面和 Native。

您可以透過為您的平台選擇引擎並提供配置來建立 `WebRtcClient`，類似於 `HttpClient`：

<TabItem title="JS/Wasm" group-key="js-wasm">

```kotlin
val jsClient = WebRtcClient(JsWebRtc) {
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>
<TabItem title="Android" group-key="android">

```kotlin
val androidClient = WebRtcClient(AndroidWebRtc) {
    context = appContext // 必填：提供 Android context
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>

建立後，客戶端可以使用互動式連接建立 (ICE) 建立點對點連接。協商完成後，對等端可以開啟資料通道並交換訊息。

```kotlin
val connection = client.createPeerConnection()

// 新增遠端 ICE candidate (透過您的信號通道接收)
connection.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// 等待所有本地端 candidate 收集完成
connection.awaitIceGatheringComplete()

// 監聽傳入的資料通道事件
connection.dataChannelEvents.collect { event ->
   when (event) {
     is Open -> println("Another peer opened a chanel: ${event.channel}")
     is Closed -> println("Data channel is closed")
     is Closing, is BufferedAmountLow, is Error -> println(event)
   }
}

// 建立通道並發送/接收訊息
val channel = connection.createDataChannel("chat")
channel.send("hello")
val answer = channel.receiveText()
```

有關使用方式和限制的更多詳細資訊，請參閱 [WebRTC 客戶端](client-webrtc.md) 文件。

### OkHttp 版本更新

在 Ktor 3.3.0 中，Ktor 客戶端的 `OkHttp` 引擎已升級至使用 OkHttp 5.1.0（之前為 4.12.0）。這次主要版本升級可能會對直接與 OkHttp 互動的專案引入 API 變更。這類專案應驗證相容性。

### 統一的 OkHttp SSE 會話

OkHttp 引擎現在使用 Server-Sent Events (SSE) 的標準 API，取代了之前引入的 `OkHttpSSESession`。這項變更統一了所有客戶端引擎的 SSE 處理，並解決了 OkHttp 特定實作的限制。

## Gradle 外掛程式

### OpenAPI 規範生成 {id="openapi-spec-gen"}
<secondary-label ref="experimental"/>

Ktor 3.3.0 透過 Gradle 外掛程式和編譯器外掛程式引入了一個實驗性的 OpenAPI 生成功能。這使您能夠在建構時直接從應用程式程式碼生成 OpenAPI 規範。

它提供了以下功能：
- 分析 Ktor 路由定義並合併巢狀路由、本地擴展和資源路徑。
- 解析先前的 KDoc 註解以提供 OpenAPI 元資料，包括：
    - 路徑、查詢、標頭、Cookie 和主體參數
    - 回應碼和類型
    - 安全性、描述、棄用和外部文件連結
- 從 `call.receive()` 和 `call.respond()` 推斷請求和回應主體。



#### 生成 OpenAPI 規範

若要從 Ktor 路由和 KDoc 註解生成 OpenAPI 規範檔案，請使用以下命令：

```shell
./gradlew buildOpenApi
```

#### 提供規範

若要在運行時提供生成的規範，您可以使用 [OpenAPI](server-openapi.md) 或 [SwaggerUI](server-swagger-ui.md) 外掛程式。

以下範例在 OpenAPI 端點提供生成的規範檔案：

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}
```

有關此功能的更多詳細資訊，請參閱 [OpenAPI 規範生成](openapi-spec-generation.md)。

## 共享

### Jetty 版本更新

Jetty 伺服器和客戶端引擎已升級至使用 Jetty 12。對於大多數應用程式而言，此次升級完全向後相容，但客戶端和伺服器程式碼現在在內部利用了更新的 Jetty API。

如果您的專案直接使用 Jetty API，請注意存在重大變更。有關更多詳細資訊，請參閱 [官方 Jetty 遷移指南](https://jetty.org/docs/jetty/12.1/programming-guide/migration/11-to-12.html)。