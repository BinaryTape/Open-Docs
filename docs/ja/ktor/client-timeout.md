[//]: # (title: タイムアウト)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>

</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout)プラグインを使用すると、
以下のタイムアウトを設定できます。
* __リクエストタイムアウト__ — HTTPコールを処理するために必要な時間: リクエスト送信からレスポンス受信まで。
* __接続タイムアウト__ — クライアントがサーバーとの接続を確立すべき時間。
* __ソケットタイムアウト__ — サーバーとのデータ交換における、2つのデータパケット間の最大非アクティブ時間。

これらのタイムアウトは、すべてのリクエストに対して、または特定のリクエストに対してのみ指定できます。

## 依存関係を追加する {id="add_dependencies"}
`HttpTimeout`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## HttpTimeoutをインストールする {id="install_plugin"}

`HttpTimeout`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## タイムアウトを設定する {id="configure_plugin"}

タイムアウトを設定するには、対応するプロパティを使用します。

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  は、リクエスト送信からレスポンス受信までのHTTPコール全体に対するタイムアウトを指定します。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  は、サーバーとの接続確立に対するタイムアウトを指定します。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  は、サーバーとのデータ交換時に、2つのデータパケット間の最大非アクティブ時間を指定します。

`install`ブロック内で、すべてのリクエストに対するタイムアウトを指定できます。以下のコードサンプルは、`requestTimeoutMillis`を使用してリクエストタイムアウトを設定する方法を示しています。
[object Promise]

特定のリクエストに対してのみタイムアウトを設定する必要がある場合は、[HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html)プロパティを使用します。

[object Promise]

特定のリクエストに指定されたタイムアウトは、`install`ブロックからのグローバルなタイムアウトを上書きすることに注意してください。

タイムアウトが発生した場合、Ktorは`HttpRequestTimeoutException`、`ConnectTimeoutException`、または`SocketTimeoutException`をスローします。

## 制限事項 {id="limitations"}

`HttpTimeout`には、特定の[エンジン](client-engines.md)に対するいくつかの制限があります。以下の表は、それらのエンジンがサポートするタイムアウトを示しています。

| エンジン                             | リクエストタイムアウト | 接続タイムアウト | ソケットタイムアウト |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |