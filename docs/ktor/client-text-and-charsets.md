[//]: # (title: 文本和字符集)

<include from="lib.topic" element-id="outdated_warning"/>
<primary-label ref="client-plugin"/>

这个插件允许你处理请求和响应中的纯文本内容：它会使用注册的字符集填充 `Accept` 头，并根据 `ContentType` 字符集编码请求体和解码响应体。

## 配置

如果在配置或 HTTP 调用属性中没有指定任何配置，则默认使用 `Charsets.UTF_8`。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // 允许使用 `UTF_8`。
        register(Charsets.UTF_8)

        // 允许使用质量为 0.1 的 `ISO_8859_1`。
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // 指定发送请求时使用的字符集（如果请求头中没有字符集）。
        sendCharset = ...

        // 指定接收响应时使用的字符集（如果响应头中没有字符集）。
        responseCharsetFallback = ...
    }
}