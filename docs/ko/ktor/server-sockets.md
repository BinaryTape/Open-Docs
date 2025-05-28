[//]: # (title: 소켓)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>코드 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

서버 및 클라이언트의 HTTP/WebSocket 처리 외에도, Ktor는 TCP 및 UDP 원시 소켓을 지원합니다. Ktor는 내부적으로 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)를 사용하는 정지(suspending) API를 제공합니다.

> 소켓은 향후 업데이트에서 호환성이 깨지는 변경 사항이 발생할 수 있는 실험적인 API를 사용합니다.
>
{type="note"}

## 의존성 추가 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

클라이언트에서 [보안 소켓](#secure)을 사용하려면 `io.ktor:ktor-network-tls`도 추가해야 합니다.

## 서버 {id="server"}

### 서버 소켓 생성 {id="server_create_socket"}

서버 소켓을 빌드하려면 `SelectorManager` 인스턴스를 생성하고, 해당 인스턴스에서 `SocketBuilder.tcp()` 함수를 호출한 다음, `bind`를 사용하여 특정 포트에 서버 소켓을 바인딩합니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

위 스니펫은 TCP 소켓을 생성하며, 이는 [ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) 인스턴스입니다. UDP 소켓을 생성하려면 `SocketBuilder.udp()`를 사용합니다.

### 수신 연결 수락 {id="accepts_connection"}

서버 소켓을 생성한 후에는 소켓 연결을 수락하고 연결된 소켓([Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 인스턴스)을 반환하는 `ServerSocket.accept` 함수를 호출해야 합니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="14"}

연결된 소켓을 확보하면 소켓에서 읽거나 소켓에 쓰는 방식으로 데이터를 수신/송신할 수 있습니다.

### 데이터 수신 {id="server_receive"}

클라이언트로부터 데이터를 수신하려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을 반환하는 `Socket.openReadChannel` 함수를 호출해야 합니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="17"}

`ByteReadChannel`은 데이터의 비동기 읽기를 위한 API를 제공합니다. 예를 들어, `ByteReadChannel.readUTF8Line`을 사용하여 UTF-8 문자열 한 줄을 읽을 수 있습니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22"}

### 데이터 송신 {id="server_send"}

클라이언트에 데이터를 송신하려면 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)을 반환하는 `Socket.openWriteChannel` 함수를 호출해야 합니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="18"}

`ByteWriteChannel`은 바이트 시퀀스의 비동기 쓰기를 위한 API를 제공합니다. 예를 들어, `ByteWriteChannel.writeStringUtf8`을 사용하여 UTF-8 문자열 한 줄을 쓸 수 있습니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22-23"}

### 소켓 닫기 {id="server_close"}

[연결된 소켓](#accepts_connection)과 관련된 리소스를 해제하려면 `Socket.close`를 호출합니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="26"}

### 예시 {id="server-example"}

아래 코드 예제는 서버 측에서 소켓을 사용하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt"}

전체 예제는 여기에서 찾을 수 있습니다: [sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server).

## 클라이언트 {id="client"}

### 소켓 생성 {id="client_create_socket"}

클라이언트 소켓을 빌드하려면 `SelectorManager` 인스턴스를 생성하고, 해당 인스턴스에서 `SocketBuilder.tcp()` 함수를 호출한 다음, `connect`를 사용하여 연결을 설정하고 연결된 소켓([Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 인스턴스)을 가져옵니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="11-12"}

연결된 소켓을 확보하면 소켓에서 읽거나 소켓에 쓰는 방식으로 데이터를 수신/송신할 수 있습니다.

### 보안 소켓 생성 (SSL/TLS) {id="secure"}

보안 소켓은 TLS 연결을 설정할 수 있도록 합니다. 보안 소켓을 사용하려면 [ktor-network-tls](#add_dependencies) 의존성을 추가해야 합니다. 그런 다음 연결된 소켓에서 `Socket.tls` 함수를 호출합니다.

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 함수를 사용하면 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)에서 제공하는 TLS 매개변수를 조정할 수 있습니다.

```kotlin
```
{src="snippets/sockets-client-tls/src/main/kotlin/com/example/Application.kt" include-lines="14-21"}

전체 예제는 여기에서 찾을 수 있습니다: [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls).

### 데이터 수신 {id="client_receive"}

서버로부터 데이터를 수신하려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을 반환하는 `Socket.openReadChannel` 함수를 호출해야 합니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="14"}

`ByteReadChannel`은 데이터의 비동기 읽기를 위한 API를 제공합니다. 예를 들어, `ByteReadChannel.readUTF8Line`을 사용하여 UTF-8 문자열 한 줄을 읽을 수 있습니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="19"}

### 데이터 송신 {id="client_send"}

서버에 데이터를 송신하려면 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)을 반환하는 `Socket.openWriteChannel` 함수를 호출해야 합니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="15"}

`ByteWriteChannel`은 바이트 시퀀스의 비동기 쓰기를 위한 API를 제공합니다. 예를 들어, `ByteWriteChannel.writeStringUtf8`을 사용하여 UTF-8 문자열 한 줄을 쓸 수 있습니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="32-33"}

### 연결 닫기 {id="client_close"}

[연결된 소켓](#client_create_socket)과 관련된 리소스를 해제하려면 `Socket.close`와 `SelectorManager.close`를 호출합니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="24-25"}

### 예시 {id="client-example"}

아래 코드 예제는 클라이언트 측에서 소켓을 사용하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt"}

전체 예제는 여기에서 찾을 수 있습니다: [sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client).