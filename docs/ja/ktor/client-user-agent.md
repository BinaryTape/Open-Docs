[//]: # (title: ユーザーエージェント)

<primary-label ref="client-plugin"/>

[UserAgent](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-user-agent)プラグインは、すべての[リクエスト](client-requests.md)に`User-Agent`ヘッダーを追加します。

## 依存関係の追加 {id="add_dependencies"}

`UserAgent`は[ktor-client-core](client-dependencies.md)アーティファクトのみ必要とし、特定の依存関係は必要ありません。

## UserAgentのインストールと設定 {id="install_plugin"}

`UserAgent`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。その後、`agent`プロパティを使用して`User-Agent`値を指定します。

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

Ktorでは、対応する関数を使用して、ブラウザライクまたはcurlライクな`User-Agent`値を追加することもできます。

```kotlin
val client = HttpClient(CIO) {
    BrowserUserAgent()
    // ... or
    CurlUserAgent()
}