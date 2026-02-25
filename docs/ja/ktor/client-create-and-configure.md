[//]: # (title: クライアントの作成と設定)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktorクライアントの作成と設定方法について学びます。</link-summary>

[クライアントの依存関係](client-dependencies.md)を追加した後、[HttpClient](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client/index.html)クラスのインスタンスを作成し、パラメータとして[エンジン](client-engines.md)を渡すことで、クライアントをインスタンス化できます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

この例では、[CIO](https://api.ktor.io/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)エンジンを使用しています。
エンジンを省略することも可能です。

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

この場合、クライアントは[ビルドスクリプトに追加された](client-dependencies.md#engine-dependency)アーティファクトに応じて自動的にエンジンを選択します。クライアントがどのようにエンジンを選択するかについては、[デフォルトエンジン](client-engines.md#default)のドキュメントセクションを参照してください。

## クライアントの設定 {id="configure-client"}

### 基本設定 {id="basic-config"}

クライアントを設定するには、クライアントのコンストラクタに追加の関数パラメータを渡すことができます。
[HttpClientConfig](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/index.html)クラスは、クライアントを設定するためのベースクラスです。
例えば、`expectSuccess`プロパティを使用して[レスポンスの検証](client-response-validation.md)を有効にできます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

### エンジンの設定 {id="engine-config"}
`engine`関数を使用してエンジンを設定できます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    engine {
        // エンジンの設定
    }
}
```

詳細については、[エンジン](client-engines.md)のセクションを参照してください。

### プラグイン {id="plugins"}
プラグインをインストールするには、[クライアント設定ブロック](#configure-client)内の`install`関数にプラグインを渡す必要があります。例えば、[Logging](client-logging.md)プラグインをインストールすることでHTTPコールをログに記録できます。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

また、`install`ブロック内でプラグインを設定することも可能です。例えば、[Logging](client-logging.md)プラグインの場合、ロガー、ログレベル、およびログメッセージをフィルタリングするための条件を指定できます。
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

特定のプラグインには個別の[依存関係](client-dependencies.md)が必要になる場合があることに注意してください。

## クライアントの使用 {id="use-client"}
必要なすべての依存関係を[追加](client-dependencies.md)し、クライアントを作成した後は、それを使用して[リクエストを送信](client-requests.md)し、[レスポンスを受信](client-responses.md)できます。

## クライアントのクローズ {id="close-client"}

HTTPクライアントでの作業を終了した後は、スレッド、コネクション、およびコルーチン用の`CoroutineScope`などのリソースを解放する必要があります。これを行うには、`HttpClient.close`関数を呼び出します。

```kotlin
client.close()
```

`close`関数は新しいリクエストの作成を禁止しますが、現在アクティブなリクエストを終了させるわけではないことに注意してください。リソースは、すべてのクライアントリクエストが完了した後にのみ解放されます。

単一のリクエストに対して`HttpClient`を使用する必要がある場合は、`use`関数を呼び出します。これにより、コードブロックの実行後に自動的に`close`が呼び出されます。

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> `HttpClient`の作成は低コストな操作ではないため、複数のリクエストを行う場合はそのインスタンスを再利用することをお勧めします。