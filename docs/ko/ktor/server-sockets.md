[//]: # (title: 소켓)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>코드 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

서버 및 클라이언트를 위한 HTTP/WebSocket 처리 외에도 Ktor는 TCP 및 UDP 원시(raw) 소켓을 지원합니다.
이는 내부적으로 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)를 사용하는 중단(suspending) API를 노출합니다.

> 소켓은 향후 업데이트에서 잠재적인 호환성 파괴 변경(breaking changes)이 발생할 수 있는 실험적 API를 사용합니다.
>
{type="note"}

## 종속성 추가 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

클라이언트에서 [보안 소켓](#secure)을 사용하려면 `io.ktor:ktor-network-tls`도 추가해야 합니다.

## 서버 {id="server"}

### 서버 소켓 생성 {id="server_create_socket"}

서버 소켓을 빌드하려면 `SelectorManager` 인스턴스를 생성하고, `SocketBuilder.tcp()` 함수를 호출한 다음, `bind`를 사용하여 특정 포트에 서버 소켓을 바인딩합니다.

[object Promise]

위 스니펫은 TCP 소켓, 즉 [ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) 인스턴스를 생성합니다.
UDP 소켓을 생성하려면 `SocketBuilder.udp()`를 사용합니다.

### 들어오는 연결 수락 {id="accepts_connection"}

서버 소켓을 생성한 후에는 소켓 연결을 수락하고 연결된 소켓([Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 인스턴스)을 반환하는 `ServerSocket.accept` 함수를 호출해야 합니다.

[object Promise]

연결된 소켓이 있으면 소켓에서 읽거나 소켓에 써서 데이터를 수신/전송할 수 있습니다.

### 데이터 수신 {id="server_receive"}

클라이언트로부터 데이터를 수신하려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을(를) 반환하는 `Socket.openReadChannel` 함수를 호출해야 합니다.

[object Promise]

`ByteReadChannel`은(는) 데이터의 비동기 읽기를 위한 API를 제공합니다.
예를 들어, `ByteReadChannel.readUTF8Line`을(를) 사용하여 UTF-8 문자의 한 줄을 읽을 수 있습니다.

[object Promise]

### 데이터 전송 {id="server_send"}

클라이언트에게 데이터를 전송하려면 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)을(를) 반환하는 `Socket.openWriteChannel` 함수를 호출합니다.

[object Promise]

`ByteWriteChannel`은(는) 바이트 시퀀스의 비동기 쓰기를 위한 API를 제공합니다.
예를 들어, `ByteWriteChannel.writeStringUtf8`을(를) 사용하여 UTF-8 문자의 한 줄을 쓸 수 있습니다.

[object Promise]

### 소켓 닫기 {id="server_close"}

[연결된 소켓](#accepts_connection)과(와) 관련된 리소스를 해제하려면 `Socket.close`를 호출합니다.

[object Promise]

### 예시 {id="server-example"}

아래 코드 샘플은 서버 측에서 소켓을 사용하는 방법을 보여줍니다.

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server).

## 클라이언트 {id="client"}

### 소켓 생성 {id="client_create_socket"}

클라이언트 소켓을 빌드하려면 `SelectorManager` 인스턴스를 생성하고, `SocketBuilder.tcp()` 함수를 호출한 다음, `connect`를 사용하여 연결을 설정하고 연결된 소켓([Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 인스턴스)을 얻습니다.

[object Promise]

연결된 소켓이 있으면 소켓에서 읽거나 소켓에 써서 데이터를 수신/전송할 수 있습니다.

### 보안 소켓 (SSL/TLS) 생성 {id="secure"}

보안 소켓을 사용하면 TLS 연결을 설정할 수 있습니다.
보안 소켓을 사용하려면 [ktor-network-tls](#add_dependencies) 종속성을 추가해야 합니다.
그런 다음, 연결된 소켓에서 `Socket.tls` 함수를 호출합니다.

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 함수를 사용하면 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)에서 제공하는 TLS 매개변수를 조정할 수 있습니다.

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls).

### 데이터 수신 {id="client_receive"}

서버로부터 데이터를 수신하려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을(를) 반환하는 `Socket.openReadChannel` 함수를 호출해야 합니다.

[object Promise]

`ByteReadChannel`은(는) 데이터의 비동기 읽기를 위한 API를 제공합니다.
예를 들어, `ByteReadChannel.readUTF8Line`을(를) 사용하여 UTF-8 문자의 한 줄을 읽을 수 있습니다.

[object Promise]

### 데이터 전송 {id="client_send"}

서버에게 데이터를 전송하려면 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)을(를) 반환하는 `Socket.openWriteChannel` 함수를 호출합니다.

[object Promise]

`ByteWriteChannel`은(는) 바이트 시퀀스의 비동기 쓰기를 위한 API를 제공합니다.
예를 들어, `ByteWriteChannel.writeStringUtf8`을(를) 사용하여 UTF-8 문자의 한 줄을 쓸 수 있습니다.

[object Promise]

### 연결 닫기 {id="client_close"}

[연결된 소켓](#client_create_socket)과(와) 관련된 리소스를 해제하려면 `Socket.close` 및 `SelectorManager.close`를 호출합니다.

[object Promise]

### 예시 {id="client-example"}

아래 코드 샘플은 클라이언트 측에서 소켓을 사용하는 방법을 보여줍니다.

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client).