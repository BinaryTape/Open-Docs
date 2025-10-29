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

[HttpTimeout](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout)プラグインを使用すると、以下のタイムアウトを設定できます。
* __リクエストタイムアウト__ — HTTP呼び出しの処理に必要な期間（リクエストの送信からレスポンスの受信まで）。
* __コネクションタイムアウト__ — クライアントがサーバーとの接続を確立すべき期間。
* __ソケットタイムアウト__ — サーバーとのデータ交換中に、2つのデータパケット間での最大非アクティブ時間。

これらのタイムアウトは、すべてのリクエストに対して指定することも、特定のリクエストに対してのみ指定することもできます。

## 依存関係の追加 {id="add_dependencies"}
`HttpTimeout`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## HttpTimeoutのインストール {id="install_plugin"}

`HttpTimeout`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## タイムアウトの設定 {id="configure_plugin"}

タイムアウトを設定するには、対応するプロパティを使用できます。

* [requestTimeoutMillis](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)は、HTTP呼び出し全体（リクエストの送信からレスポンスの受信まで）のタイムアウトを指定します。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)は、サーバーとの接続確立のためのタイムアウトを指定します。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)は、サーバーとのデータ交換中に、2つのデータパケット間の最大非アクティブ時間のタイムアウトを指定します。

`install`ブロック内で、すべてのリクエストに対するタイムアウトを指定できます。以下のコードサンプルは、`requestTimeoutMillis`を使用してリクエストタイムアウトを設定する方法を示しています。
```kotlin
val client = HttpClient(CIO) {
    install(HttpTimeout) {
        requestTimeoutMillis = 1000
    }
}
```

特定のリクエストに対してのみタイムアウトを設定する必要がある場合は、[HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/timeout.html)プロパティを使用します。

```kotlin
val response: HttpResponse = client.get("http://0.0.0.0:8080/path1") {
    timeout {
        requestTimeoutMillis = 3000
    }
}
```

特定のリクエストに指定されたタイムアウトは、`install`ブロックからのグローバルタイムアウトをオーバーライドすることに注意してください。

タイムアウトが発生した場合、Ktorは`HttpRequestTimeoutException`、`ConnectTimeoutException`、または`SocketTimeoutException`をスローします。

## 制限事項 {id="limitations"}

`HttpTimeout`には、特定の[エンジン](client-engines.md)にいくつかの制限があります。以下の表は、それらのエンジンがサポートするタイムアウトを示しています。

| エンジン                             | リクエストタイムアウト | コネクトタイムアウト | ソケットタイムアウト |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |