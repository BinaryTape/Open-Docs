[//]: # (title: I/O 상호 운용성)

<show-structure for="chapter" depth="2"/>

<link-summary>
Ktor의 I/O 프리미티브를 외부 타입과 함께 사용하는 방법을 알아보세요.
</link-summary>

Ktor는 기본 I/O 프리미티브를 제공하는 멀티플랫폼 코틀린 라이브러리인 [`kotlinx-io`](https://github.com/Kotlin/kotlinx-io)를 기반으로 구축된 논블로킹(non-blocking), 비동기 I/O를 지원합니다. 이를 통해 HTTP 요청 및 응답 본문을 스트리밍하고, 파일을 읽거나 쓸 수 있으며, 모든 데이터를 메모리에 로드하지 않고 점진적으로 처리할 수 있습니다.

다른 I/O 모델을 사용하는 외부 라이브러리 또는 플랫폼과 작업하는 경우, 다음과 상호 운용하기 위한 어댑터 세트를 사용할 수 있습니다.

-   `RawSource` 및 `RawSink`와 같은 `kotlinx-io` 타입
-   `OutputStream`과 같은 Java I/O 타입

이 페이지에서는 Ktor의 I/O 프리미티브(
[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html),
[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html))와 이러한 외부 타입 간에 변환하는 방법을 설명합니다.

## `ByteReadChannel`을 `RawSource`로 변환

`ByteReadChannel`을 `RawSource`로 변환하려면 `.asSource()` 확장 함수를 사용하세요.

```kotlin
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## `ByteWriteChannel`을 `RawSink`로 변환

suspending `ByteWriteChannel`을 `RawSink`로 변환하려면 `.asSink()` 확장 함수를 사용하세요.

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

이 어댑터가 생성하는 `RawSink`는 데이터를 플러시할 때 내부적으로 `runBlocking`을 사용하므로, 플러시 작업이 호출 스레드를 블록(block)할 수 있습니다.

## `RawSink`를 `ByteWriteChannel`로 변환

`RawSink`를 suspending `ByteWriteChannel`로 래핑(wrap)하려면 `.asByteWriteChannel()` 확장 함수를 사용하세요.

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

이를 통해 suspending 함수에서 싱크(sink)로 비동기적으로 쓸 수 있습니다. 반환된 채널은 버퍼링됩니다. 모든 데이터가 작성되도록 하려면 `.flush()` 또는 `.flushAndClose()`를 사용하세요.

## `OutputStream`을 `ByteWriteChannel`로 변환

Java `OutputStream`을 `ByteWriteChannel`로 변환하려면 `.asByteWriteChannel()` 확장 함수를 사용하세요.

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

`ByteWriteChannel`의 모든 작업은 버퍼링됩니다. 기본 `OutputStream`은 `ByteWriteChannel`에서 `.flush()`가 호출될 때만 데이터를 받습니다.