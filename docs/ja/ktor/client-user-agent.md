[//]: # (title: ユーザーエージェント)

<primary-label ref="client-plugin"/>

`UserAgent`プラグインは、すべての[リクエスト](client-requests.md)に`User-Agent`ヘッダーを追加します。

## 依存関係の追加 {id="add_dependencies"}

`UserAgent`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は不要です。

## UserAgentのインストールと設定 {id="install_plugin"}

`UserAgent`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。次に、`agent`プロパティを使用して`User-Agent`の値を指定します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
// ...
val client = HttpClient(CIO) {
    install(UserAgent) {
        agent = "Ktor client"
    }
}
```

Ktorでは、対応する関数を使用して、ブラウザまたはcurlのような`User-Agent`値を追加することもできます。

```kotlin
val client = HttpClient(CIO) {
    BrowserUserAgent()
    // ... or
    CurlUserAgent()
}