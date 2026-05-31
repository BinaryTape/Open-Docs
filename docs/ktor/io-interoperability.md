[//]: # (title: I/O 互操作性)

<tldr>
<p>
<b>代码示例</b>： 
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-io-interop">client-io-interop</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/server-io-interop">server-io-interop</a>
</p>
</tldr>

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何配合外部类型使用 Ktor 的 I/O 原语。
</link-summary>

Ktor 支持基于 [`kotlinx-io`](https://github.com/Kotlin/kotlinx-io) 构建的非阻塞、异步 I/O，`kotlinx-io` 是一个提供基本 I/O 原语的多平台 Kotlin 库。这使您可以流式传输 HTTP 请求和响应体，读取或写入文件，以及增量处理数据，而无需将其全部加载到内存中。

如果您使用的外部库或平台采用了不同的 I/O 模型，可以使用一组适配器与以下项进行互操作：

- `kotlinx-io` 类型，例如 `RawSource` 和 `RawSink`
- Java I/O 类型，例如 `OutputStream`

本页面介绍了如何在 Ktor 的 I/O 原语（[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)、[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)）与这些外部类型之间进行转换。

## 将 `ByteReadChannel` 转换为 `RawSource`

要将 `ByteReadChannel` 转换为 `RawSource`，请使用 `.asSource()` 扩展函数：

```kotlin
client.prepareGet("https://httpbin.org/bytes/1024").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    val source: RawSource = channel.asSource()
    val buffered = source.buffered()
    val firstByte = buffered.readByte()
    println("Read first byte from RawSource: $firstByte")
}
```

## 将 `ByteWriteChannel` 转换为 `RawSink`

要将挂起式 `ByteWriteChannel` 转换为 `RawSink`，请使用 `.asSink()` 扩展函数：

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

此适配器生成的 `RawSink` 在刷新数据时会在内部使用 `runBlocking`，因此刷新操作可能会阻塞调用线程。

## 将 `RawSink` 转换为 `ByteWriteChannel`

要将 `RawSink` 包装为挂起式 `ByteWriteChannel`，请使用 `.asByteWriteChannel()` 扩展函数：

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

这使得从挂起函数向 sink 进行异步写入成为可能。返回的通道带有缓冲区。请使用 `.flush()` 或 `.flushAndClose()` 以确保所有数据均已写入。

## 将 `OutputStream` 转换为 `ByteWriteChannel`

要将 Java `OutputStream` 转换为 `ByteWriteChannel`，请使用 `.asByteWriteChannel()` 扩展函数：

```kotlin
get("/output-stream") {
    val out = ByteArrayOutputStream()
    val channel = out.asByteWriteChannel()
    channel.writeFully("Hello from OutputStream-backed channel!".toByteArray())
    channel.flushAndClose()
    call.respondBytes(out.toByteArray())
}
```

对 `ByteWriteChannel` 的所有操作都带有缓冲区。底层的 `OutputStream` 仅在 `ByteWriteChannel` 上调用 `.flush()` 时才会接收数据。