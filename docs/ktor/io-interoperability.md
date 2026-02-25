[//]: # (title: I/O 互操作性)

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
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## 将 `ByteWriteChannel` 转换为 `RawSink`

要将挂起式 `ByteWriteChannel` 转换为 `RawSink`，请使用 `.asSink()` 扩展函数：

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

此适配器生成的 `RawSink` 在刷新数据时会在内部使用 `runBlocking`，因此刷新操作可能会阻塞调用线程。

## 将 `RawSink` 转换为 `ByteWriteChannel`

要将 `RawSink` 包装为挂起式 `ByteWriteChannel`，请使用 `.asByteWriteChannel()` 扩展函数：

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

这使得从挂起函数向 sink 进行异步写入成为可能。返回的通道带有缓冲区。请使用 `.flush()` 或 `.flushAndClose()` 以确保所有数据均已写入。

## 将 `OutputStream` 转换为 `ByteWriteChannel`

要将 Java `OutputStream` 转换为 `ByteWriteChannel`，请使用 `.asByteWriteChannel()` 扩展函数：

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

对 `ByteWriteChannel` 的所有操作都带有缓冲区。底层的 `OutputStream` 仅在 `ByteWriteChannel` 上调用 `.flush()` 时才会接收数据。