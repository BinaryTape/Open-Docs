[//]: # (title: WebRTC 클라이언트)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<var name="artifact_name" value="ktor-client-webrtc"/>
<tldr>
    <p>
        <b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
    </p>
    <p>
        <b>지원 플랫폼</b>: JS/Wasm, Android
    </p>   
    <p>
        <b>코드 예시</b>: <a href="https://github.com/ktorio/ktor-chat/">ktor-chat</a>
    </p>
</tldr>
<link-summary>
    WebRTC 클라이언트는 멀티플랫폼 프로젝트에서 실시간 P2P (Peer-to-Peer) 통신을 가능하게 합니다.
</link-summary>

웹 실시간 통신 (WebRTC)은 브라우저 및 네이티브 앱에서 실시간 P2P 통신을 위한 일련의 표준 및 API입니다.

Ktor의 WebRTC 클라이언트는 멀티플랫폼 프로젝트에서 실시간 P2P 통신을 가능하게 합니다. WebRTC를 사용하면 다음과 같은 기능을 구축할 수 있습니다.

- 비디오 및 음성 통화
- 멀티플레이어 게임
- 협업 애플리케이션 (화이트보드, 에디터 등)
- 클라이언트 간 낮은 지연 시간의 데이터 교환

## 의존성 추가 {id="add-dependencies"}

`WebRtcClient`를 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

<Tabs group="languages">
    <TabItem title="Gradle (코틀린)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (그루비)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 클라이언트 생성

`WebRtcClient`를 생성할 때 대상 플랫폼에 따라 엔진을 선택하세요.

- JS/Wasm: `JsWebRtc` – 브라우저의 `RTCPeerConnection` 및 미디어 장치를 사용합니다.
- Android: `AndroidWebRtc` – `PeerConnectionFactory` 및 Android 미디어 API를 사용합니다.

그런 다음 `HttpClient`와 유사하게 플랫폼별 구성을 제공할 수 있습니다. [ICE](#ice)가 제대로 작동하려면 STUN/TURN 서버가 필요합니다. [coturn](https://github.com/coturn/coturn)과 같은 기존 솔루션을 사용할 수 있습니다.

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

## 연결 생성 및 SDP 협상

`WebRtcClient`를 생성한 후 다음 단계는 피어 연결을 생성하는 것입니다.
피어 연결은 두 클라이언트 간의 실시간 통신을 관리하는 핵심 객체입니다.

연결을 설정하기 위해 WebRTC는 세션 설명 프로토콜 (SDP)을 사용합니다. 여기에는 세 가지 단계가 포함됩니다.

1. 한 피어 (호출자)가 오퍼(offer)를 생성합니다.
2. 다른 피어 (수신자)는 응답(answer)으로 회신합니다.
3. 양쪽 피어는 서로의 설명을 적용하여 설정을 완료합니다.

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

## ICE 후보 교환 {id="ice"}

SDP 협상이 완료되면 피어는 여전히 네트워크를 통해 연결하는 방법을 찾아야 합니다. [ICE (Interactive Connectivity Establishment)](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment)는 피어들이 서로에게 연결되는 네트워크 경로를 찾을 수 있도록 합니다.

- 각 피어는 자체 ICE 후보를 수집합니다.
- 이 후보들은 선택한 시그널링 채널을 통해 다른 피어에게 전송되어야 합니다.
- 양쪽 피어가 서로의 후보를 추가하면 연결이 성공할 수 있습니다.

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

> Ktor는 시그널링을 제공하지 않습니다. WebSockets, HTTP 또는 다른 전송 방식을 사용하여 오퍼, 응답 및 ICE 후보를 교환하세요.
> 
{style="note"}

## 데이터 채널 사용

WebRTC는 피어들이 임의의 메시지를 교환할 수 있도록 데이터 채널을 지원합니다. 이는 채팅, 멀티플레이어 게임, 협업 도구 또는 클라이언트 간의 낮은 지연 시간 메시징에 유용합니다.

### 채널 생성

한쪽에서 채널을 생성하려면 `.createDataChannel()` 메서드를 사용하세요.

```kotlin
val channel = caller.createDataChannel("chat")
```

그런 다음 다른 쪽에서 데이터 채널 이벤트를 수신할 수 있습니다.

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

### 메시지 송수신

채널은 코틀린 개발자에게 익숙한 `Channel`과 유사한 API를 사용합니다.

```kotlin
// Send a message
scope.launch { channel.send("hello") }

// Receive messages
scope.launch { println("received: " + channel.receiveText()) }
```

## 미디어 트랙 추가 및 관찰

데이터 채널 외에도 WebRTC는 오디오 및 비디오용 미디어 트랙을 지원합니다. 이를 통해 영상 통화 또는 화면 공유와 같은 애플리케이션을 구축할 수 있습니다.

### 로컬 트랙 생성

로컬 장치 (마이크, 카메라)에서 오디오 또는 비디오 트랙을 요청할 수 있습니다.

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

웹에서는 `navigator.mediaDevices.getUserMedia`를 사용합니다. Android에서는 Camera2 API를 사용하며 마이크/카메라 권한을 수동으로 요청해야 합니다.

### 원격 트랙 수신

원격 미디어 트랙을 수신할 수도 있습니다.

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

## 제한 사항

WebRTC 클라이언트는 실험적이며 다음과 같은 제한 사항이 있습니다.

- 시그널링은 포함되어 있지 않습니다. 자체 시그널링을 구현해야 합니다 (예: WebSockets 또는 HTTP 사용).
- 지원 플랫폼은 JavaScript/Wasm 및 Android입니다. iOS, JVM 데스크톱 및 Kotlin/Native 지원은 향후 릴리스에서 계획되어 있습니다.
- 권한은 애플리케이션에서 처리해야 합니다. 브라우저는 사용자에게 마이크 및 카메라 액세스 권한을 요청하는 반면, Android는 런타임 권한 요청을 필요로 합니다.
- 기본 오디오 및 비디오 트랙만 지원됩니다. 화면 공유, 장치 선택, 시뮬캐스트 및 고급 RTP 기능은 아직 사용할 수 없습니다.
- 연결 통계는 사용 가능하지만 플랫폼마다 다르며 통합된 스키마를 따르지 않습니다.