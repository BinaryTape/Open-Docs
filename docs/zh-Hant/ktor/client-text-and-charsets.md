[//]: # (title: 文字與字元集)

<include from="lib.topic" element-id="outdated_warning"/>
<primary-label ref="client-plugin"/>

此外掛程式允許您處理請求和回應中的純文字內容：它會使用已註冊的字元集填充 `Accept` 標頭，並根據 `ContentType` 字元集編碼請求主體及解碼回應主體。

## 設定

如果在設定或 HTTP 呼叫屬性中沒有指定設定，預設會使用 `Charsets.UTF_8`。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // 允許使用 `UTF_8`。
        register(Charsets.UTF_8)

        // 允許使用品質為 0.1 的 `ISO_8859_1`。
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // 指定用於傳送請求的字元集（如果請求標頭中沒有字元集）。
        sendCharset = ...

        // 指定用於接收回應的字元集（如果回應標頭中沒有字元集）。
        responseCharsetFallback = ...
    }
}
```