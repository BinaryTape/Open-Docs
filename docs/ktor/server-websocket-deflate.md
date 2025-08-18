[//]: # (title: WebSocket Deflate 扩展)

Ktor 为客户端和服务器实现了 `Deflate` WebSocket 扩展 [RFC-7692](https://tools.ietf.org/html/rfc7692)。该扩展可以透明地在发送前压缩帧，并在接收后解压缩。如果你正在发送大量文本数据，启用此扩展会很有用。

## 安装

要使用该扩展，应首先安装它。为此，我们可以在 `extensions` 代码块中使用 `install` 方法：

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

#### 上下文接管

指定客户端（和服务器）是否应使用压缩窗口。启用这些参数可减少每个单一会话分配的空间量。请注意，由于 `java.util.zip.Deflater` API 的限制，窗口大小无法配置。该值固定为 `15`。

```kotlin
clientNoContextTakeOver = false

serverNoContextTakeOver = false
```

这些参数在 [RFC-7692 第 7.1.1 节](https://tools.ietf.org/html/rfc7692#section-7.1.1)中有所描述。

#### 指定压缩条件

要显式指定压缩条件，你可以使用 `compressIf` 方法。例如，仅压缩文本内容：

```kotlin
compressIf { frame -> 
    frame is Frame.Text
}
```
所有对 `compressIf` 的调用都会在压缩发生前求值。

#### 调整协议列表

可以使用 `configureProtocols` 方法根据需要编辑要发送的协议列表：

```kotlin
configureProtocols { protocols ->
    protocols.clear()
    protocols.add(...)
}