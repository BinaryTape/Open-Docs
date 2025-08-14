[//]: # (title: クライアントの作成と設定)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktorクライアントの作成と設定方法を学習します。</link-summary>

[クライアントの依存関係](client-dependencies.md)を追加した後、[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) クラスのインスタンスを作成し、[エンジン](client-engines.md)を引数として渡すことで、クライアントをインスタンス化できます。

[object Promise]

この例では、[CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) エンジンを使用しています。
エンジンの指定を省略することもできます。

[object Promise]

この場合、クライアントは[ビルドスクリプトで追加された](client-dependencies.md#engine-dependency)アーティファクトに応じて、エンジンを自動的に選択します。クライアントがどのようにエンジンを選択するかについては、[](client-engines.md#default) のドキュメントセクションで確認できます。

## クライアントの設定 {id="configure-client"}

### 基本設定 {id="basic-config"}

クライアントを設定するには、クライアントのコンストラクタに追加の関数型パラメータを渡すことができます。[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html) クラスは、クライアント設定のベースクラスです。例えば、`expectSuccess` プロパティを使用して[レスポンスの検証](client-response-validation.md)を有効にできます。

[object Promise]

### エンジンの設定 {id="engine-config"}
エンジンの設定は、`engine` 関数を使用して行えます。

[object Promise]

詳細については、[エンジン](client-engines.md)のセクションを参照してください。

### プラグイン {id="plugins"}
プラグインをインストールするには、[クライアント設定ブロック](#configure-client)内で`install` 関数にプラグインを渡す必要があります。例えば、[Logging](client-logging.md) プラグインをインストールすることでHTTP呼び出しをログに記録できます。

[object Promise]

また、`install` ブロック内でプラグインを設定することもできます。例えば、[Logging](client-logging.md) プラグインの場合、ロガー、ログレベル、ログメッセージをフィルタリングする条件を指定できます。
[object Promise]

特定のプラグインには別途[依存関係](client-dependencies.md)が必要となる場合があることに注意してください。

## クライアントの使用 {id="use-client"}
必要なすべての依存関係を[追加](client-dependencies.md)し、クライアントを作成した後、それを使用して[リクエストを行い](client-requests.md)、[レスポンスを受け取る](client-responses.md)ことができます。

## クライアントのクローズ {id="close-client"}

HTTPクライアントの操作が完了したら、スレッド、接続、コルーチン用の`CoroutineScope`といったリソースを解放する必要があります。これを行うには、`HttpClient.close` 関数を呼び出します。

```kotlin
client.close()
```

`close` 関数は新しいリクエストの作成を禁止しますが、現在アクティブなリクエストを終了させるわけではないことに注意してください。リソースは、すべてのクライアントリクエストが完了した後にのみ解放されます。

単一のリクエストに`HttpClient`を使用する必要がある場合は、`use` 関数を呼び出します。この関数はコードブロックの実行後に自動的に`close`を呼び出します。

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> `HttpClient` の作成はコストのかかる操作であるため、複数のリクエストを行う場合はそのインスタンスを再利用する方が良いでしょう。