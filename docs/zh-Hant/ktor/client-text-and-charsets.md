[//]: # (title: 文本與字元集)

<tip>
    此說明主題正在開發中，未來會更新。
</tip>
<primary-label ref="client-plugin"/>

此外掛程式允許您處理請求和回應中的純文字內容：填寫 `Accept` 標頭時使用已註冊的字元集，並根據 `ContentType` 字元集編碼請求本文和解碼回應本文。

## 設定

如果在設定或 HTTP 呼叫屬性中未指定任何設定，則預設使用 `Charsets.UTF_8`。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // 允許使用 `UTF_8`。
        register(Charsets.UTF_8)

        // 允許使用 `ISO_8859_1`，品質為 0.1。
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // 指定用於傳送請求的字元集（如果請求標頭中沒有字元集）。
        sendCharset = ...

        // 指定用於接收回應的字元集（如果回應標頭中沒有字元集）。
        responseCharsetFallback = ...
    }
}
```