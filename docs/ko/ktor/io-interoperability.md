[//]: # (title: I/O 상호 운용성)

<tldr>
<p>
<b>코드 예제</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-io-interop">client-io-interop</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/server-io-interop">server-io-interop</a>
</p>
</tldr>

<show-structure for="chapter" depth="2"/>

<link-summary>
Ktor의 I/O 프리미티브를 외부 타입과 함께 사용하는 방법을 알아봅니다.
</link-summary>

Ktor는 기본 I/O 프리미티브를 제공하는 멀티플랫폼 Kotlin 라이브러리인 [`kotlinx-io`](https://github.com/Kotlin/kotlinx-io)를 기반으로 구축된 논블로킹(non-blocking), 비동기 I/O를 지원합니다. 이를 통해 모든 데이터를 메모리에 로드하지 않고도 HTTP 요청 및 응답 본문을 스트리밍하고, 파일을 읽거나 쓰고, 데이터를 점진적으로 처리할 수 있습니다.

다른 I/O 모델을 사용하는 외부 라이브러리나 플랫폼으로 작업하는 경우, 다음과의 상호 운용을 위해 일련의 어댑터들을 사용할 수 있습니다:

- `RawSource` 및 `RawSink`와 같은 `kotlinx-io` 타입
- `OutputStream`과 같은 Java I/O 타입

이 페이지에서는 Ktor의 I/O 프리미티브([`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html), [`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html))와 이러한 외부 타입 간에 변환하는 방법을 설명합니다.

## `ByteReadChannel`을 `RawSource`로 변환하기

`ByteReadChannel`을 `RawSource`로 변환하려면 `.asSource()` 확장 함수를 사용합니다:

```kotlin
client.prepareGet("https://httpbin.org/bytes/1024").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    val source: RawSource = channel.asSource()
    val buffered = source.buffered()
    val firstByte = buffered.readByte()
    println("Read first byte from RawSource: $firstByte")
}
```

## `ByteWriteChannel`을 `RawSink`로 변환하기

일시 중단 가능한 `ByteWriteChannel`을 `RawSink`로 변환하려면 `.asSink()` 확장 함수를 사용합니다:

```kotlin
get("/sink") {
    call.respondBytesWriter {
        val sink: RawSink = this.asSink()
        sink.buffered().use { buffered ->
            buffered.writeString("Hello from kotlinx-io Sink!")
        }
    }
}
```

이 어댑터로 생성된 `RawSink`는 데이터를 플러시(flush)할 때 내부적으로 `runBlocking`을 사용하므로, 플러시 작업이 호출 스레드를 차단(block)할 수 있습니다.

## `RawSink`를 `ByteWriteChannel`로 변환하기

`RawSink`를 일시 중단 가능한 `ByteWriteChannel`로 래핑하려면 `.asByteWriteChannel()` 확장 함수를 사용합니다:

```kotlin
get("/raw-sink") {
    val buffer = Buffer()
    val channel = buffer.asByteWriteChannel()
    channel.writeByte(42)
    channel.writeFully("Hello via RawSink".toByteArray())
    channel.flushAndClose()
    call.respondBytes(buffer.readByteArray())
}
```

이를 통해 일시 중단 함수에서 싱크(sink)로 비동기 쓰기가 가능해집니다. 반환된 채널은 버퍼링됩니다. 모든 데이터가 기록되었는지 확인하려면 `.flush()` 또는 `.flushAndClose()`를 사용하세요.

## `OutputStream`을 `ByteWriteChannel`로 변환하기

Java `OutputStream`을 `ByteWriteChannel`로 변환하려면 `.asByteWriteChannel()` 확장 함수를 사용합니다:

```kotlin
get("/output-stream") {
    val out = ByteArrayOutputStream()
    val channel = out.asByteWriteChannel()
    channel.writeFully("Hello from OutputStream-backed channel!".toByteArray())
    channel.flushAndClose()
    call.respondBytes(out.toByteArray())
}
```

`ByteWriteChannel`에서의 모든 작업은 버퍼링됩니다. 기반이 되는 `OutputStream`은 `ByteWriteChannel`에서 `.flush()`가 호출될 때만 데이터를 수신합니다.