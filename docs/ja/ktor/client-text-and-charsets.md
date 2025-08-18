[//]: # (title: テキストと文字セット)

<tip>
    このヘルプトピックは開発中であり、今後更新される予定です。
</tip>
<primary-label ref="client-plugin"/>

このプラグインを使用すると、リクエストおよびレスポンスにおけるプレーンテキストコンテンツを処理できます。具体的には、登録された文字セットで `Accept` ヘッダーを設定し、`ContentType` の文字セットに従ってリクエストボディのエンコードとレスポンスボディのデコードを行います。

## 設定

設定またはHTTPコールプロパティで構成が指定されていない場合、デフォルトで `Charsets.UTF_8` が使用されます。

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // `UTF_8` の使用を許可します。
        register(Charsets.UTF_8)

        // `ISO_8859_1` を品質 0.1 で使用することを許可します。
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // リクエストを送信する文字セットを指定します（リクエストヘッダーに文字セットがない場合）。
        sendCharset = ...

        // レスポンスを受信する文字セットを指定します（レスポンスヘッダーに文字セットがない場合）。
        responseCharsetFallback = ...
    }
}
```