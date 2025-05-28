[//]: # (title: テキストと文字セット)

<include from="lib.topic" element-id="outdated_warning"/>
<primary-label ref="client-plugin"/>

このプラグインを使用すると、リクエストおよびレスポンス内のプレーンテキストコンテンツを処理できます。具体的には、登録された文字セットで`Accept`ヘッダーを設定し、`ContentType`の文字セットに従ってリクエストボディをエンコードし、レスポンスボディをデコードします。

## 設定

設定またはHTTPコールプロパティで設定が指定されていない場合、`Charsets.UTF_8`がデフォルトで使用されます。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // Allow using `UTF_8`.
        register(Charsets.UTF_8)

        // Allow using `ISO_8859_1` with quality 0.1.
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // Specify Charset to send request(if no charset in request headers).
        sendCharset = ...

        // Specify Charset to receive response(if no charset in response headers).
        responseCharsetFallback = ...
    }
}