[//]: # (title: I/O相互運用性)

<show-structure for="chapter" depth="2"/>

<link-summary>
KtorのI/Oプリミティブを外部型と連携して使用する方法を学びます。
</link-summary>

Ktorは、基本的なI/Oプリミティブを提供するマルチプラットフォームKotlinライブラリである[`kotlinx-io`](https://github.com/Kotlin/kotlinx-io)を基盤として構築された、非ブロッキングかつ非同期のI/Oをサポートしています。これにより、HTTPリクエストおよびレスポンスボディのストリーミング、ファイルの読み書き、およびすべてのデータをメモリにロードすることなくインクリメンタルなデータ処理が可能になります。

異なるI/Oモデルを使用する外部ライブラリやプラットフォームと連携する場合、アダプター群を使用して以下の型と相互運用できます。

- `RawSource` や `RawSink` のような `kotlinx-io` 型
- `OutputStream` のようなJava I/O型

このページでは、KtorのI/Oプリミティブ（
[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)、
[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)）とこれらの外部型との間で変換する方法を説明します。

## ByteReadChannelをRawSourceに変換する

`ByteReadChannel` を `RawSource` に変換するには、`.asSource()` 拡張関数を使用します。

```kotlin
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## ByteWriteChannelをRawSinkに変換する

サスペンディングな `ByteWriteChannel` を `RawSink` に変換するには、`.asSink()` 拡張関数を使用します。

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

このアダプターによって生成される `RawSink` は、データをフラッシュする際に内部的に `runBlocking` を使用するため、フラッシュ操作は呼び出し元のスレッドをブロックする可能性があります。

## RawSinkをByteWriteChannelに変換する

`RawSink` をサスペンディングな `ByteWriteChannel` としてラップするには、`.asByteWriteChannel()` 拡張関数を使用します。

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

これにより、サスペンディング関数からシンクへの非同期書き込みが可能になります。返されるチャネルはバッファリングされます。すべてのデータが確実に書き込まれるようにするには、`.flush()` または `.flushAndClose()` を使用してください。

## OutputStreamをByteWriteChannelに変換する

Javaの `OutputStream` を `ByteWriteChannel` に変換するには、`.asByteWriteChannel()` 拡張関数を使用します。

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

`ByteWriteChannel` でのすべての操作はバッファリングされます。基になる `OutputStream` は、`ByteWriteChannel` で `.flush()` が呼び出された場合にのみデータを受け取ります。