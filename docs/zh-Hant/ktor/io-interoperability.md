[//]: # (title: I/O 互通性)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何將 Ktor 的 I/O 基本單元 (primitives) 與外部型別搭配使用。
</link-summary>

Ktor 支援建置在 [`kotlinx-io`](https://github.com/Kotlin/kotlinx-io) 之上的非阻塞、非同步 I/O，`kotlinx-io` 是一個提供基本 I/O 單元的多平台 Kotlin 程式庫。這讓您可以串流 HTTP 請求與回應主體、讀取或寫入檔案，以及增量處理資料，而無需將所有內容載入記憶體中。

如果您正在使用採用不同 I/O 模型的外部程式庫或平台，可以使用一組配接器 (adapters) 與以下內容進行互聯互通：

- `kotlinx-io` 型別，例如 `RawSource` 與 `RawSink`
- Java I/O 型別，例如 `OutputStream`

本頁面說明如何在 Ktor 的 I/O 基本單元 (
[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)、
[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)) 與這些外部型別之間進行轉換。

## 將 `ByteReadChannel` 轉換為 `RawSource`

若要將 `ByteReadChannel` 轉換為 `RawSource`，請使用 `.asSource()` 擴充函式：

```kotlin
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## 將 `ByteWriteChannel` 轉換為 `RawSink`

若要將暫止的 `ByteWriteChannel` 轉換為 `RawSink`，請使用 `.asSink()` 擴充函式：

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

此配接器產生的 `RawSink` 在排清 (flush) 資料時內部會使用 `runBlocking`，因此排清作業可能會阻塞呼叫方的執行緒。

## 將 `RawSink` 轉換為 `ByteWriteChannel`

若要將 `RawSink` 包裝為暫止的 `ByteWriteChannel`，請使用 `.asByteWriteChannel()` 擴充函式：

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

這使得從暫止函式對 sink 進行非同步寫入成為可能。傳回的通道具有緩衝。請使用 `.flush()` 或 `.flushAndClose()` 以確保所有資料皆已寫入。

## 將 `OutputStream` 轉換為 `ByteWriteChannel`

若要將 Java `OutputStream` 轉換為 `ByteWriteChannel`，請使用 `.asByteWriteChannel()` 擴充函式：

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

對 `ByteWriteChannel` 的所有操作都會經過緩衝。底層的 `OutputStream` 只有在 `ByteWriteChannel` 呼叫 `.flush()` 時才會接收到資料。