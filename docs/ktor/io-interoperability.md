[//]: # (title: I/O 互操作性)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何将 Ktor 的 I/O 原语与外部类型配合使用。
</link-summary>

Ktor 支持基于 [`kotlinx-io`](https://github.com/Kotlin/kotlinx-io) 构建的非阻塞、异步 I/O，`kotlinx-io` 是一个提供基本 I/O 原语的多平台 Kotlin 库。这使你能够流式传输 HTTP 请求和响应体、读写文件，并增量处理数据而无需将其全部加载到内存中。

如果你正在使用使用不同 I/O 模型的外部库或平台，你可以使用一组适配器来与以下类型互操作：

- `kotlinx-io` 类型，例如 `RawSource` 和 `RawSink`
- Java I/O 类型，例如 `OutputStream`

本页面描述了如何在 Ktor 的 I/O 原语（[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)、[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)）与这些外部类型之间进行转换。

## 将 `ByteReadChannel` 转换为 `RawSource`

要将 `ByteReadChannel` 转换为 `RawSource`，请使用 `.asSource()` 扩展函数：

```kotlin
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## 将 `ByteWriteChannel` 转换为 `RawSink`

要将挂起的 `ByteWriteChannel` 转换为 `RawSink`，请使用 `.asSink()` 扩展函数：

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

此适配器生成的 `RawSink` 在刷新数据时内部使用 `runBlocking`，因此刷新操作可能会阻塞调用线程。

## 将 `RawSink` 转换为 `ByteWriteChannel`

要将 `RawSink` 包装为挂起的 `ByteWriteChannel`，请使用 `.asByteWriteChannel()` 扩展函数：

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

这使得能够从挂起函数中对 sink 进行异步写入。返回的 channel 是缓冲的。使用 `.flush()` 或 `.flushAndClose()` 来确保所有数据都已写入。

## 将 `OutputStream` 转换为 `ByteWriteChannel`

要将 Java `OutputStream` 转换为 `ByteWriteChannel`，请使用 `.asByteWriteChannel()` 扩展函数：

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

`ByteWriteChannel` 上的所有操作都是缓冲的。底层的 `OutputStream` 仅当在 `ByteWriteChannel` 上调用 `.flush()` 时才会接收数据。