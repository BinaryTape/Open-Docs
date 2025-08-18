[//]: # (title: クライアントの作成と設定)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktorクライアントを作成および設定する方法を学びます。</link-summary>

[クライアントの依存関係](client-dependencies.md)を追加したら、[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)クラスのインスタンスを作成し、[エンジン](client-engines.md)をパラメータとして渡すことで、クライアントをインスタンス化できます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

この例では、[CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)エンジンを使用しています。
エンジンを省略することもできます。

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

この場合、クライアントは[ビルドスクリプトに追加された](client-dependencies.md#engine-dependency)アーティファクトに応じて、エンジンを自動的に選択します。クライアントがどのようにエンジンを選択するかは、[デフォルトエンジン](client-engines.md#default)のドキュメントセクションで確認できます。

## クライアントの構成 {id="configure-client"}

### 基本的な構成 {id="basic-config"}

クライアントを構成するには、クライアントコンストラクタに追加の関数型パラメータを渡すことができます。[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html)クラスは、クライアントを構成するためのベースクラスです。例えば、`expectSuccess`プロパティを使用して[レスポンス検証](client-response-validation.md)を有効にできます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

### エンジン構成 {id="engine-config"}
`engine`関数を使用してエンジンを構成できます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    engine {
        // Configure an engine
    }
}
```

詳細については、[エンジン](client-engines.md)セクションを参照してください。

### プラグイン {id="plugins"}
プラグインをインストールするには、[クライアント構成ブロック](#configure-client)内で`install`関数に渡す必要があります。例えば、[Logging](client-logging.md)プラグインをインストールすることでHTTPコールをログに記録できます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

`install`ブロック内でプラグインを構成することもできます。例えば、[Logging](client-logging.md)プラグインの場合、ロガー、ログレベル、およびログメッセージをフィルタリングする条件を指定できます。
```kotlin
val client = HttpClient(CIO) {
    install(Logging) {
        logger = Logger.DEFAULT
        level = LogLevel.HEADERS
        filter { request ->
            request.url.host.contains("ktor.io")
        }
        sanitizeHeader { header -> header == HttpHeaders.Authorization }
    }
}
```

特定のプラグインには別途[依存関係](client-dependencies.md)が必要な場合があることに注意してください。

## クライアントの使用 {id="use-client"}
必要なすべての[依存関係](client-dependencies.md)を追加し、クライアントを作成したら、それを使用して[リクエストを作成](client-requests.md)し、[レスポンスを受信](client-responses.md)できます。

## クライアントを閉じる {id="close-client"}

HTTPクライアントの操作が終了したら、リソース（スレッド、コネクション、コルーチン用の`CoroutineScope`）を解放する必要があります。これを行うには、`HttpClient.close`関数を呼び出します。

```kotlin
client.close()
```

`close`関数は新しいリクエストの作成を禁止しますが、現在アクティブなリクエストを終了させるわけではないことに注意してください。リソースは、すべてのクライアントリクエストが完了した後にのみ解放されます。

単一のリクエストで`HttpClient`を使用する必要がある場合は、コードブロックの実行後に自動的に`close`を呼び出す`use`関数を呼び出します。

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> `HttpClient`の作成は安価な操作ではないため、複数のリクエストの場合はそのインスタンスを再利用する方が良いです。