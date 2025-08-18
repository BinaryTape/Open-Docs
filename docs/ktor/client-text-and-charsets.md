[//]: # (title: 文本与字符集)

<tip>
    此帮助主题正在开发中，未来会进行更新。
</tip>
<primary-label ref="client-plugin"/>

此插件允许你处理请求和响应中的纯文本内容：它会使用已注册的字符集填充 `Accept` 头部，并根据 `ContentType` 字符集编码请求体和解码响应体。

## 配置

如果在配置或 HTTP 调用属性中未指定配置，则默认使用 `Charsets.UTF_8`。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // 允许使用 `UTF_8`。
        register(Charsets.UTF_8)

        // 允许使用质量为 0.1 的 `ISO_8859_1`。
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // 指定发送请求时使用的字符集（如果请求头部中没有字符集）。
        sendCharset = ...

        // 指定接收响应时使用的字符集（如果响应头部中没有字符集）。
        responseCharsetFallback = ...
    }
}
```