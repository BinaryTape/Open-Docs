[//]: # (title: 文字與字元集)

<tip>
    本幫助主題仍在開發中，未來將會更新。
</tip>

<primary-label ref="client-plugin"/>

此插件允許您處理請求和響應中的純文字內容：它會使用已註冊的字元集填寫 `Accept` 標頭，並根據 `ContentType` 字元集編碼請求主體和解碼響應主體。

## 設定

如果在設定或 HTTP 呼叫屬性中未指定任何設定，則預設使用 `Charsets.UTF_8`。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // 允許使用 `UTF_8`。
        register(Charsets.UTF_8)

        // 允許使用品質為 0.1 的 `ISO_8859_1`。
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // 指定用於發送請求的字元集（如果請求標頭中沒有字元集）。
        sendCharset = ...

        // 指定用於接收響應的字元集（如果響應標頭中沒有字元集）。
        responseCharsetFallback = ...
    }
}
```