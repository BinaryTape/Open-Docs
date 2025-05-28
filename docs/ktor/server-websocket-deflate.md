[//]: # (title: WebSocket Deflate 扩展)

Ktor 为客户端和服务器实现了 `Deflate` WebSocket 扩展 [RFC-7692](https://tools.ietf.org/html/rfc7692)。此扩展可以在发送前透明地压缩帧，并在接收后解压缩。如果您正在发送大量文本数据，启用此扩展会很有用。

## 安装

要使用此扩展，必须先安装它。为此，我们可以在 `extensions` 块中使用 `install` 方法：

```kotlin
// 适用于客户端和服务器
install(WebSockets) {
    extensions {
        install(WebSocketDeflateExtension) {
            /**
             * 用于 [java.util.zip.Deflater] 的压缩级别。
             */
            compressionLevel = Deflater.DEFAULT_COMPRESSION

            /**
             * 防止压缩小的传出帧。
             */
            compressIfBiggerThan(bytes = 4 * 1024)
        }
    }
}
```

### 高级配置参数

#### 上下文接管 (Context takeover)

指定客户端（和服务器）是否应使用压缩窗口。启用这些参数可减少每个会话分配的空间量。请注意，由于 `java.util.zip.Deflater` API 的限制，窗口大小无法配置。该值固定为 `15`。

```kotlin
clientNoContextTakeOver = false

serverNoContextTakeOver = false
```

这些参数在 [RFC-7692 第 7.1.1 节](https://tools.ietf.org/html/rfc7692#section-7.1.1) 中有描述。

#### 指定压缩条件

要显式指定压缩条件，可以使用 `compressIf` 方法。例如，仅压缩文本：

```kotlin
compressIf { frame -> 
    frame is Frame.Text
}
```
所有对 `compressIf` 的调用都将在压缩发生之前进行评估。

#### 微调协议列表

可以使用 `configureProtocols` 方法根据需要编辑要发送的协议列表：

```kotlin
configureProtocols { protocols ->
    protocols.clear()
    protocols.add(...)
}