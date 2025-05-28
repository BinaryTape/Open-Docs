[//]: # (title: クライアントの作成と設定)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktorクライアントの作成と設定方法を学びます。</link-summary>

[クライアントの依存関係](client-dependencies.md)を追加した後、[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)クラスのインスタンスを作成し、[エンジン](client-engines.md)をパラメータとして渡すことで、クライアントをインスタンス化できます。

```kotlin
```
{src="snippets/_misc_client/CioCreate.kt"}

この例では、[CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)エンジンを使用しています。
エンジンを省略することもできます。

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

この場合、クライアントはビルドスクリプトで[追加された](client-dependencies.md#engine-dependency)成果物に応じて、エンジンを自動的に選択します。クライアントがどのようにエンジンを選択するかは、[](client-engines.md#default)のドキュメントセクションで確認できます。

## クライアントの設定 {id="configure-client"}

### 基本設定 {id="basic-config"}

クライアントを設定するには、クライアントコンストラクタに追加の関数型パラメータを渡すことができます。
[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html)クラスは、クライアントを設定するための基底クラスです。
例えば、`expectSuccess`プロパティを使用して[レスポンス検証](client-response-validation.md)を有効にできます。

```kotlin
```
{src="snippets/_misc_client/BasicClientConfig.kt"}

### エンジン設定 {id="engine-config"}
`engine`関数を使用してエンジンを設定できます。

```kotlin
```
{src="snippets/_misc_client/BasicEngineConfig.kt"}

詳細については、[エンジン](client-engines.md)セクションを参照してください。

### プラグイン {id="plugins"}
プラグインをインストールするには、[クライアント設定ブロック](#configure-client)内で`install`関数に渡す必要があります。例えば、[Logging](client-logging.md)プラグインをインストールすることで、HTTP呼び出しをログに記録できます。

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

`install`ブロック内でプラグインを設定することもできます。例えば、[Logging](client-logging.md)プラグインでは、ロガー、ロギングレベル、ログメッセージのフィルタリング条件を指定できます。
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="13-22"}

特定のプラグインには別途[依存関係](client-dependencies.md)が必要となる場合があることに注意してください。

## クライアントの使用 {id="use-client"}
必要なすべての依存関係を[追加](client-dependencies.md)し、クライアントを作成したら、それを使用して[リクエストを送信](client-requests.md)したり、[レスポンスを受信](client-responses.md)したりできます。

## クライアントを閉じる {id="close-client"}

HTTPクライアントでの作業が完了したら、リソース（スレッド、接続、コルーチン用の`CoroutineScope`）を解放する必要があります。そのためには、`HttpClient.close`関数を呼び出します。

```kotlin
client.close()
```

`close`関数は新しいリクエストの作成を禁止しますが、現在アクティブなリクエストを終了させるものではありません。リソースは、すべてのクライアントリクエストが完了した後にのみ解放されます。

単一のリクエストのために`HttpClient`を使用する必要がある場合は、コードブロックの実行後に自動的に`close`を呼び出す`use`関数を呼び出します。

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> `HttpClient`の作成は安価な操作ではないため、複数のリクエストがある場合はそのインスタンスを再利用する方が良いことに注意してください。