[//]: # (title: WebRTC 客戶端)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<var name="artifact_name" value="ktor-client-webrtc"/>
<tldr>
    <p>
        <b>必要的依賴</b>: <code>io.ktor:%artifact_name%</code>
    </p>
    <p>
        <b>支援的平台</b>: JS/Wasm, Android
    </p>   
    <p>
        <b>程式碼範例</b>: <a href="https://github.com/ktorio/ktor-chat/">ktor-chat</a>
    </p>
</tldr>
<link-summary>
    WebRTC 客戶端可在多平台專案中實現即時點對點通訊。
</link-summary>

Web 即時通訊 (WebRTC) 是一組用於瀏覽器和原生應用程式中即時、點對點通訊的標準和 API。

Ktor 中的 WebRTC 客戶端可在多平台專案中實現即時點對點通訊。透過 WebRTC，您可以建置以下功能：

- 視訊與語音通話
- 多人遊戲
- 協作應用程式 (白板、編輯器等)
- 客戶端之間低延遲的資料交換

## 新增依賴 {id="add-dependencies"}

若要使用 `WebRtcClient`，您需要在建構腳本中包含 `%artifact_name%` artifact：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 建立客戶端

建立 `WebRtcClient` 時，請根據您的目標平台選擇一個引擎：

- JS/Wasm: `JsWebRtc` – 使用瀏覽器的 `RTCPeerConnection` 和媒體設備。
- Android: `AndroidWebRtc` – 使用 `PeerConnectionFactory` 和 Android 媒體 API。

然後，您可以提供類似於 `HttpClient` 的平台特定設定。STUN/TURN 伺服器是 [ICE](#ice) 正常運作所必需的。您可以使用現有的解決方案，例如 [coturn](https://github.com/coturn/coturn)：

<Tabs group="platform" id="create-webrtc-client">
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
    context = appContext // Required: provide Android context
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>
</Tabs>

## 建立連線並協商 SDP

建立 `WebRtcClient` 後，下一步是建立對等連線。
對等連線是管理兩個客戶端之間即時通訊的核心物件。

為了建立連線，WebRTC 使用會話描述協議 (SDP)。這涉及三個步驟：

1. 一個對等端 (呼叫者) 建立一個 offer。
2. 另一個對等端 (被呼叫者) 以一個 answer 回應。
3. 兩個對等端都應用對方的描述來完成設定。

```kotlin
// Caller creates a connection and an offer
val caller = jsClient.createPeerConnection()
val offer = caller.createOffer()
caller.setLocalDescription(offer)
// send offer.sdp to the remote peer via your signaling mechanism

// Callee receives the offer and creates an answer
val callee = jsClient.createPeerConnection()
callee.setRemoteDescription(
    WebRtc.SessionDescription(WebRtc.SessionDescriptionType.OFFER, remoteOfferSdp)
)
val answer = callee.createAnswer()
callee.setLocalDescription(answer)
// send answer.sdp back to the caller via signaling

// Caller applies the answer
caller.setRemoteDescription(
    WebRtc.SessionDescription(WebRtc.SessionDescriptionType.ANSWER, remoteAnswerSdp)
)
```

## 交換 ICE 候選者 {id="ice"}

SDP 協商完成後，對等端仍需要發現如何跨網路連線。[互動式連線建立 (ICE)](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 允許對等端找到彼此的網路路徑。

- 每個對等端收集自己的 ICE 候選者。
- 這些候選者必須透過您選擇的訊號傳輸通道傳送給另一個對等端。
- 一旦兩個對等端都新增了對方的候選者，連線即可成功。

```kotlin
// Collect and send local candidates
scope.launch {
    caller.iceCandidates.collect { candidate ->
        // send candidate.candidate, candidate.sdpMid, candidate.sdpMLineIndex to remote peer
    }
}

// Receive and add remote candidates
callee.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// Optionally wait until all candidates are gathered
callee.awaitIceGatheringComplete()
```

> Ktor 不提供訊號傳輸 (Signaling)。使用 WebSockets、HTTP 或其他傳輸方式來交換 offers、answers 和 ICE candidates。
> 
{style="note"}

## 使用資料通道

WebRTC 支援資料通道，讓對等端可以交換任意訊息。這對於聊天、多人遊戲、協作工具或客戶端之間任何低延遲的訊息傳遞都很有用。

### 建立通道

若要在其中一側建立通道，請使用 `.createDataChannel()` 方法：

```kotlin
val channel = caller.createDataChannel("chat")
```

然後，您可以在另一側監聽資料通道事件：

```kotlin
scope.launch {
    callee.dataChannelEvents.collect { event ->
        when (event) {
            is DataChannelEvent.Open -> println("Channel opened: ${event.channel}")
            is DataChannelEvent.Closed -> println("Channel closed")
            else -> {}
        }
    }
}
```

### 傳送和接收訊息

通道使用類似 `Channel` 的 API，這對 Kotlin 開發人員來說很熟悉：

```kotlin
// Send a message
scope.launch { channel.send("hello") }

// Receive messages
scope.launch { println("received: " + channel.receiveText()) }
```

## 新增和觀察媒體軌

除了資料通道，WebRTC 還支援用於音訊和視訊的媒體軌。這允許您建置諸如視訊通話或螢幕分享等應用程式。

### 建立本地軌

您可以從本地設備 (麥克風、相機) 請求音訊或視訊軌：

```kotlin
val audioConstraints = WebRtcMedia.AudioTrackConstraints(
  echoCancellation = true
)
val videoConstraints = WebRtcMedia.VideoTrackConstraints(
  width = 1280,
  height = 720
)
val audio = rtcClient.createAudioTrack(audioConstraints)
val video = rtcClient.createVideoTrack(videoConstraints)

val pc = jsClient.createPeerConnection()
pc.addTrack(audio)
pc.addTrack(video)
```

在網路上，這會使用 `navigator.mediaDevices.getUserMedia`。在 Android 上，它使用 Camera2 API，您必須手動請求麥克風/相機權限。

### 接收遠端軌

您也可以監聽遠端媒體軌：

```kotlin
scope.launch {
    pc.trackEvents.collect { event ->
        when (event) {
            is TrackEvent.Add -> println("Remote track added: ${event.track.id}")
            is TrackEvent.Remove -> println("Remote track removed: ${event.track.id}")
        }
    }
}
```

## 限制

WebRTC 客戶端仍處於實驗階段，並具有以下限制：

- 訊號傳輸未包含在內。您需要實作自己的訊號傳輸 (例如，使用 WebSockets 或 HTTP)。
- 支援的平台為 JavaScript/Wasm 和 Android。iOS、JVM 桌面和 Kotlin/Native 的支援已規劃在未來版本中。
- 權限必須由您的應用程式處理。瀏覽器會提示使用者麥克風和相機的存取權，而 Android 則需要執行時權限請求。
- 目前僅支援基本的音訊和視訊軌。螢幕分享、設備選擇、simulcast 和進階 RTP 功能尚未提供。
- 連線統計資料可用，但因平台而異，且不遵循統一的架構。