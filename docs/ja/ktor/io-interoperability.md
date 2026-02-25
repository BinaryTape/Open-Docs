[//]: # (title: I/Oの相互運用性)

<show-structure for="chapter" depth="2"/>

<link-summary>
KtorのI/Oプリミティブを外部の型で使用する方法を学びます。
</link-summary>

Ktorは、基本的なI/Oプリミティブを提供するマルチプラットフォームKotlinライブラリである[`kotlinx-io`](https://github.com/Kotlin/kotlinx-io)をベースに構築された、ノンブロッキングで非同期なI/Oをサポートしています。これにより、HTTPリクエストとレスポンスのボディをストリーミングしたり、ファイルを読み書きしたり、データをメモリにすべてロードすることなくインクリメンタルに処理したりすることができます。

異なるI/Oモデルを使用する外部ライブラリやプラットフォームを扱う場合は、一連のアダプターを使用して以下と相互運用できます。

- `RawSource`や`RawSink`などの`kotlinx-io`の型
- `OutputStream`などのJava I/O型

このページでは、KtorのI/Oプリミティブ（[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)、[`ByteWriteChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)）とこれらの外部の型との間で変換を行う方法について説明します。

## ByteReadChannelからRawSourceへの変換

`ByteReadChannel`を`RawSource`に変換するには、`.asSource()`拡張関数を使用します。

```kotlin
val channel: ByteReadChannel = response.bodyAsChannel()
val source: RawSource = channel.asSource()
```

## ByteWriteChannelからRawSinkへの変換

中断（suspending）`ByteWriteChannel`を`RawSink`に変換するには、`.asSink()`拡張関数を使用します。

```kotlin
val channel: ByteWriteChannel = ...
val sink: RawSink = channel.asSink()
```

このアダプターによって生成された`RawSink`は、データのフラッシュ時に内部で`runBlocking`を使用するため、フラッシュ操作が呼び出し元のスレッドをブロックする可能性があります。

## RawSinkからByteWriteChannelへの変換

`RawSink`を中断`ByteWriteChannel`としてラップするには、`.asByteWriteChannel()`拡張関数を使用します。

```kotlin
val sink: RawSink = ...
val channel: ByteWriteChannel = sink.asByteWriteChannel()

channel.writeByte(42)
channel.flushAndClose()
```

これにより、中断関数からシンクへの非同期書き込みが可能になります。返されるチャネルはバッファリングされます。すべてのデータが書き込まれたことを確実にするには、`.flush()`または`.flushAndClose()`を使用してください。

## OutputStreamからByteWriteChannelへの変換

Javaの`OutputStream`を`ByteWriteChannel`に変換するには、`.asByteWriteChannel()`拡張関数を使用します。

```kotlin
val outputStream: OutputStream = FileOutputStream("output.txt")
val channel: ByteWriteChannel = outputStream.asByteWriteChannel()

channel.writeFully("Hello, World!".toByteArray())
channel.flushAndClose()
```

`ByteWriteChannel`でのすべての操作はバッファリングされます。基盤となる`OutputStream`は、`ByteWriteChannel`で`.flush()`が呼び出されたときにのみデータを受け取ります。