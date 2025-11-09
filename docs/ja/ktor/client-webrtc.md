[//]: # (title: WebRTCクライアント)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<var name="artifact_name" value="ktor-client-webrtc"/>
<tldr>
    <p>
        <b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
    </p>
    <p>
        <b>サポートされているプラットフォーム</b>: JS/Wasm, Android
    </p>   
    <p>
        <b>コード例</b>: <a href="https://github.com/ktorio/ktor-chat/">ktor-chat</a>
    </p>
</tldr>
<link-summary>
    WebRTCクライアントは、マルチプラットフォームプロジェクトでリアルタイムのピアツーピア通信を可能にします。
</link-summary>

Webリアルタイムコミュニケーション（WebRTC）は、ブラウザおよびネイティブアプリでのリアルタイム、ピアツーピア通信のための標準とAPIのセットです。

KtorのWebRTCクライアントは、マルチプラットフォームプロジェクトでリアルタイムのピアツーピア通信を可能にします。WebRTCを使用すると、次のような機能を構築できます。

- ビデオ通話と音声通話
- マルチプレイヤーゲーム
- 共同作業アプリケーション（ホワイトボード、エディタなど）
- クライアント間の低遅延データ交換

## 依存関係の追加 {id="add-dependencies"}

`WebRtcClient`を使用するには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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

## クライアントの作成

`WebRtcClient`を作成する際は、ターゲットプラットフォームに基づいてエンジンを選択します。

- JS/Wasm: `JsWebRtc` – ブラウザの`RTCPeerConnection`とメディアデバイスを使用します。
- Android: `AndroidWebRtc` – `PeerConnectionFactory`とAndroidメディアAPIを使用します。

その後、`HttpClient`と同様にプラットフォーム固有の設定を提供できます。[ICE](#ice)が正しく機能するには、STUN/TURNサーバーが必要です。[coturn](https://github.com/coturn/coturn)のような既存のソリューションを使用できます。

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

## 接続を作成し、SDPをネゴシエートする

`WebRtcClient`を作成したら、次のステップはピア接続を作成することです。ピア接続は、2つのクライアント間のリアルタイム通信を管理するコアオブジェクトです。

接続を確立するために、WebRTCはSession Description Protocol (SDP)を使用します。これには3つのステップがあります。

1. 一方のピア（発信者）がオファーを作成します。
2. もう一方のピア（着信者）がアンサーで応答します。
3. 両方のピアが互いの記述を適用してセットアップを完了します。

```kotlin
// Caller creates a connection and an offer
val caller = jsClient.createPeerConnection()
val offer = caller.createOffer()
caller.setLocalDescription(offer)
// オファーのSDPを、シグナリングメカニズムを介してリモートピアに送信します

// Callee receives the offer and creates an answer
val callee = jsClient.createPeerConnection()
callee.setRemoteDescription(
    WebRtc.SessionDescription(WebRtc.SessionDescriptionType.OFFER, remoteOfferSdp)
)
val answer = callee.createAnswer()
callee.setLocalDescription(answer)
// アンサーのSDPをシグナリングを介して発信者に送り返します

// Caller applies the answer
caller.setRemoteDescription(
    WebRtc.SessionDescription(WebRtc.SessionDescriptionType.ANSWER, remoteAnswerSdp)
)
```

## ICE候補の交換 {id="ice"}

SDPネゴシエーションが完了しても、ピアはネットワークを介して接続する方法を発見する必要があります。[Interactive Connectivity Establishment (ICE)](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment)により、ピアは互いへのネットワークパスを見つけることができます。

- 各ピアは自身のICE候補を収集します。
- これらの候補は、選択したシグナリングチャネルを介して他のピアに送信する必要があります。
- 両方のピアが互いの候補を追加すると、接続が成功します。

```kotlin
// ローカル候補を収集して送信する
scope.launch {
    caller.iceCandidates.collect { candidate ->
        // candidate.candidate, candidate.sdpMid, candidate.sdpMLineIndex をリモートピアに送信する
    }
}

// リモート候補を受信して追加する
callee.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// オプションで、すべての候補が収集されるまで待機する
callee.awaitIceGatheringComplete()
```

> Ktorはシグナリングを提供しません。オファー、アンサー、ICE候補を交換するには、WebSockets、HTTP、または別のトランスポートを使用してください。
> 
{style="note"}

## データチャネルの使用

WebRTCはデータチャネルをサポートしており、ピア間で任意のメッセージを交換できます。これはチャット、マルチプレイヤーゲーム、共同作業ツール、またはクライアント間の低遅延メッセージングに役立ちます。

### チャネルの作成

片側でチャネルを作成するには、`.createDataChannel()`メソッドを使用します。

```kotlin
val channel = caller.createDataChannel("chat")
```

その後、反対側でデータチャネルイベントをリッスンできます。

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

### メッセージの送受信

チャネルは、Kotlin開発者になじみのある`Channel`のようなAPIを使用します。

```kotlin
// メッセージを送信する
scope.launch { channel.send("hello") }

// メッセージを受信する
scope.launch { println("received: " + channel.receiveText()) }
```

## メディアトラックの追加と監視

データチャネルに加えて、WebRTCはオーディオおよびビデオのメディアトラックをサポートしています。これにより、ビデオ通話や画面共有などのアプリケーションを構築できます。

### ローカルトラックの作成

ローカルデバイス（マイク、カメラ）からオーディオまたはビデオトラックをリクエストできます。

```kotlin
val audio = rtcClient.createAudioTrack {
    echoCancellation = true
}
val video = rtcClient.createVideoTrack {
    width = 1280
    height = 720
}

val pc = jsClient.createPeerConnection()
pc.addTrack(audio)
pc.addTrack(video)
```

Web上では、これは`navigator.mediaDevices.getUserMedia`を使用します。Android上では、Camera2 APIを使用し、マイク/カメラのパーミッションを手動でリクエストする必要があります。iOS上では、AVFoundation APIを使用し、同様にパーミッションを手動でリクエストする必要があります。クライアントは、指定された制約に従って最適なメディアデバイスを見つけようとします。見つからない場合は`WebRtcMedia.DeviceException`をスローします。

> `WebRtcClient`、`WebRtcPeerConnection`、`WebRtcMedia.Track`およびその他のインターフェースは`AutoCloseable`です。不要になったときにリソースを解放するため、必ず`close()`メソッドを呼び出してください。
{style="note"}

### リモートトラックの受信

リモートメディアトラックをリッスンすることもできます。

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

## 制限事項

WebRTCクライアントは実験段階であり、以下の制限事項があります。

- シグナリングは含まれていません。独自のシグナリング（例えば、WebSocketsまたはHTTPを使用）を実装する必要があります。
- サポートされているプラットフォームはJavaScript/WasmとAndroidです。iOS、JVMデスクトップ、およびKotlin/Nativeのサポートは将来のリリースで計画されています。
- パーミッションはアプリケーションで処理する必要があります。ブラウザはマイクとカメラへのアクセスをユーザーに促しますが、Androidはランタイムパーミッションのリクエストが必要です。
- 基本的なオーディオおよびビデオトラックのみがサポートされています。画面共有、デバイス選択、サイマルキャスト、高度なRTP機能はまだ利用できません。
- 接続統計は利用可能ですが、プラットフォームによって異なり、統一されたスキーマには従っていません。