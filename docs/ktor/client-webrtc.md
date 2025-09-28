[//]: # (title: WebRTC 客户端)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<var name="artifact_name" value="ktor-client-webrtc"/>
<tldr>
    <p>
        <b>必需依赖项</b>: <code>io.ktor:%artifact_name%</code>
    </p>
    <p>
        <b>支持的平台</b>: JS/Wasm, Android
    </p>   
    <p>
        <b>代码示例</b>: <a href="https://github.com/ktorio/ktor-chat/">ktor-chat</a>
    </p>
</tldr>
<link-summary>
    WebRTC 客户端支持在多平台项目中进行实时点对点通信。
</link-summary>

Web 实时通信 (WebRTC) 是一组标准和 API，用于在浏览器和原生应用中进行实时、点对点通信。

Ktor 中的 WebRTC 客户端支持在多平台项目中进行实时点对点通信。借助 WebRTC，你可以构建以下特性：

- 视频和语音通话
- 多人游戏
- 协作应用程序（白板、编辑器等）
- 客户端之间低延迟的数据交换

## 添加依赖项 {id="add-dependencies"}

要使用 `WebRtclient`，你需要将 `%artifact_name%` 构件包含在构建脚本中：

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

## 创建客户端

创建 `WebRtcClient` 时，请根据你的目标平台选择引擎：

- JS/Wasm: `JsWebRtc` – 使用浏览器 `RTCPeerConnection` 和媒体设备。
- Android: `AndroidWebRtc` – 使用 `PeerConnectionFactory` 和 Android 媒体 API。

然后，你可以提供平台特有的配置，类似于 `HttpClient`。STUN/TURN 服务器对于 [ICE](#ice) 正常工作是必需的。你可以使用现有解决方案，例如 [coturn](https://github.com/coturn/coturn)：

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

## 创建连接并协商 SDP

创建 `WebRtcClient` 后，下一步是创建对等连接。
对等连接是管理两个客户端之间实时通信的核心对象。

为了建立连接，WebRTC 使用会话描述协议 (SDP)。这涉及三个步骤：

1. 一个对等端（调用方）创建提议。
2. 另一个对等端（被调用方）响应应答。
3. 两个对等端应用彼此的描述以完成设置。

```kotlin
// 调用方创建连接和提议
val caller = jsClient.createPeerConnection()
val offer = caller.createOffer()
caller.setLocalDescription(offer)
// 通过你的信令机制将 offer.sdp 发送给远程对等端

// 被调用方接收提议并创建应答
val callee = jsClient.createPeerConnection()
callee.setRemoteDescription(
    WebRtc.SessionDescription(WebRtc.SessionDescriptionType.OFFER, remoteOfferSdp)
)
val answer = callee.createAnswer()
callee.setLocalDescription(answer)
// 通过信令将 answer.sdp 发送回调用方

// 调用方应用应答
caller.setRemoteDescription(
    WebRtc.SessionDescription(WebRtc.SessionDescriptionType.ANSWER, remoteAnswerSdp)
)
```

## 交换 ICE 候选者 {id="ice"}

一旦 SDP 协商完成，对等端仍需要发现如何跨网络连接。[交互式连接建立 (ICE)](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 允许对等端查找彼此之间的网络路径。

- 每个对等端收集自己的 ICE 候选者。
- 这些候选者必须通过你选择的信令通道发送给另一个对等端。
- 一旦两个对等端都添加了彼此的候选者，连接即可成功。

```kotlin
// 收集并发送本地候选者
scope.launch {
    caller.iceCandidates.collect { candidate ->
        // 将 candidate.candidate、candidate.sdpMid、candidate.sdpMLineIndex 发送给远程对等端
    }
}

// 接收并添加远程候选者
callee.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// （可选）等待所有候选者收集完毕
callee.awaitIceGatheringComplete()
```

> Ktor 不提供信令。请使用 WebSockets、HTTP 或其他传输方式来交换提议、应答和 ICE 候选者。
> 
{style="note"}

## 使用数据通道

WebRTC 支持数据通道，允许对等端交换任意消息。这适用于聊天、多人游戏、协作工具或客户端之间任何低延迟的消息传递。

### 创建通道

若要在一方创建通道，请使用 `.createDataChannel()` 方法：

```kotlin
val channel = caller.createDataChannel("chat")
```

然后，你可以在另一方监听数据通道事件：

```kotlin
scope.launch {
    callee.dataChannelEvents.collect { event ->
        when (event) {
            is DataChannelEvent.Open -> println("通道已打开: ${event.channel}")
            is DataChannelEvent.Closed -> println("通道已关闭")
            else -> {}
        }
    }
}
```

### 发送和接收消息

通道使用类似 `Channel` 的 API，为 Kotlin 开发者所熟悉：

```kotlin
// 发送消息
scope.launch { channel.send("hello") }

// 接收消息
scope.launch { println("已接收: " + channel.receiveText()) }
```

## 添加和观察媒体轨道

除了数据通道，WebRTC 还支持音频和视频的媒体轨道。这允许你构建视频通话或屏幕共享等应用程序。

### 创建本地轨道

你可以从本地设备（麦克风、摄像头）请求音频或视频轨道：

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

在 Web 端，这使用 `navigator.mediaDevices.getUserMedia`。在 Android 上，它使用 Camera2 API，你必须手动请求麦克风/摄像头权限。

### 接收远程轨道

你也可以监听远程媒体轨道：

```kotlin
scope.launch {
    pc.trackEvents.collect { event ->
        when (event) {
            is TrackEvent.Add -> println("已添加远程轨道: ${event.track.id}")
            is TrackEvent.Remove -> println("已移除远程轨道: ${event.track.id}")
        }
    }
}
```

## 限制

WebRTC 客户端是实验性的，并具有以下限制：

- 不包含信令。你需要实现你自己的信令（例如，使用 WebSockets 或 HTTP）。
- 支持的平台是 JavaScript/Wasm 和 Android。iOS、JVM 桌面和 Kotlin/Native 支持计划在未来版本中提供。
- 权限必须由你的应用程序处理。浏览器会提示用户授予麦克风和摄像头访问权限，而 Android 需要运行时权限请求。
- 仅支持基本的音频和视频轨道。屏幕共享、设备选择、同播和高级 RTP 特性尚未可用。
- 连接统计信息可用，但在不同平台之间有所差异，并且不遵循统一的模式。