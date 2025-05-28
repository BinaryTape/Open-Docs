[//]: # (title: タイムアウト)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout) プラグインを使用すると、
以下のタイムアウトを設定できます。
* __リクエストタイムアウト__ — HTTP呼び出しを処理するために必要な期間：リクエストの送信からレスポンスの受信まで。
* __コネクションタイムアウト__ — クライアントがサーバーとの接続を確立すべき期間。
* __ソケットタイムアウト__ — サーバーとのデータ交換時における、2つのデータパケット間の最大非活動時間。

これらのタイムアウトは、すべてのリクエストに対して、または特定の要求のみに対して指定できます。

## 依存関係の追加 {id="add_dependencies"}
`HttpTimeout` は [ktor-client-core](client-dependencies.md) アーティファクトのみを必要とし、特定の依存関係は不要です。

## HttpTimeoutのインストール {id="install_plugin"}

`HttpTimeout` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の `install` 関数に渡します。
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

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  は、リクエストの送信からレスポンスの受信まで、HTTP呼び出し全体のタイムアウトを指定します。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  は、サーバーとの接続確立のためのタイムアウトを指定します。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  は、サーバーとのデータ交換時における、2つのデータパケット間の最大非活動時間のためのタイムアウトを指定します。

`install` ブロック内で、すべてのリクエストに対してタイムアウトを指定できます。以下のコードサンプルは、`requestTimeoutMillis` を使用してリクエストタイムアウトを設定する方法を示しています。
```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

特定のリクエストのみにタイムアウトを設定する必要がある場合は、[HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html) プロパティを使用します。

```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="24-28"}

特定のリクエストに指定されたタイムアウトは、`install` ブロックからのグローバルタイムアウトをオーバーライドすることに注意してください。

タイムアウトが発生した場合、Ktor は `HttpRequestTimeoutException`、`ConnectTimeoutException`、または `SocketTimeoutException` をスローします。

## 制限事項 {id="limitations"}

`HttpTimeout` には、特定の[エンジン](client-engines.md)に対するいくつかの制限事項があります。以下の表は、それらのエンジンでどのタイムアウトがサポートされているかを示しています。

| エンジン                             | リクエストタイムアウト | コネクトタイムアウト | ソケットタイムアウト |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |