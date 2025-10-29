[//]: # (title: I/O 互通性)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何將 Ktor 的 I/O 基本型別與外部類型搭配使用。
</link-summary>

Ktor 支援建構於 [`kotlinx-io`](https://github.com/Kotlin/kotlinx-io) 之上的非阻塞式、非同步 I/O，`kotlinx-io` 是一個提供基本 I/O 基本型別的多平台 Kotlin 函式庫。這讓您可以串流 HTTP 請求和回應主體、讀取或寫入檔案，並以增量方式處理資料，而無需將其全部載入記憶體中。

如果您正在使用採用不同 I/O 模型的外部函式庫或平台，可以使用一組轉接器來與其互通：

- `kotlinx-io` 類型，例如 `RawSource` 和 `RawSink`
- Java I/O 類型，例如 `OutputStream`

本頁說明如何在 Ktor 的 I/O 基本型別（[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)、[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)）與這些外部類型之間進行轉換。

## 將 `ByteReadChannel` 轉換為 `RawSource`

若要將 `ByteReadChannel` 轉換為 `RawSource`，請使用 `.asSource()` 擴充函式：

```kotlin
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## 將 `ByteWriteChannel` 轉換為 `RawSink`

若要將暫停式的 `ByteWriteChannel` 轉換為 `RawSink`，請使用 `.asSink()` 擴充函式：

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

這個轉接器產生的 `RawSink` 在清空資料時內部會使用 `runBlocking`，因此清空操作可能會阻塞呼叫執行緒。

## 將 `RawSink` 轉換為 `ByteWriteChannel`

若要將 `RawSink` 包裝為暫停式的 `ByteWriteChannel`，請使用 `.asByteWriteChannel()` 擴充函式：

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

這使得可以從暫停函式對 Sink 進行非同步寫入。回傳的通道是緩衝的。使用 `.flush()` 或 `.flushAndClose()` 以確保所有資料都已寫入。

## 將 `OutputStream` 轉換為 `ByteWriteChannel`

若要將 Java `OutputStream` 轉換為 `ByteWriteChannel`，請使用 `.asByteWriteChannel()` 擴充函式：

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

在 `ByteWriteChannel` 上的所有操作都是緩衝的。底層的 `OutputStream` 只有在 `ByteWriteChannel` 上呼叫 `.flush()` 時才會接收到資料。