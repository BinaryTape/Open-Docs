[//]: # (title: 2.0.xから2.2.xへの移行)

<show-structure for="chapter" depth="2"/>

このガイドでは、Ktorアプリケーションを2.0.xバージョンから2.2.xに移行する手順を説明します。

> `WARNING`非推奨レベルでマークされたAPIは、3.0.0リリースまで引き続き動作します。
> 非推奨レベルの詳細については、[Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)を参照してください。

## Ktorサーバー {id="server"}

### Cookie {id="cookies"}
v2.2.0では、[応答Cookie](server-responses.md#cookies)の設定に関連する以下のAPIメンバーが変更されました。
- `append`関数に渡される`maxAge`パラメーターの型が`Int`から`Long`に変更されました。
- `appendExpired`関数は非推奨になりました。代わりに`expires`パラメーターを指定して`append`関数を使用してください。

### リクエストアドレス情報 {id="request-address-info"}

2.2.0バージョンから、リクエストが行われた先のホスト名/ポートを取得するために使用されていた`RequestConnectionPoint.host`および`RequestConnectionPoint.port`プロパティは非推奨になりました。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

代わりに`RequestConnectionPoint.serverHost`と`RequestConnectionPoint.serverPort`を使用してください。
また、リクエストが受信されたホスト名/ポートを返す`localHost`/`localPort`プロパティも追加しました。
詳細については、[元のリクエスト情報](server-forward-headers.md#original-request-information)を参照してください。

### 設定のマージ {id="merge-configs"}
v2.2.0より前は、`List<ApplicationConfig>.merge()`関数がアプリケーション設定をマージするために使用されていました。
両方の設定が同じキーを持っている場合、結果の設定は最初のものから値を取得します。
このリリースでは、この動作を改善するために以下のAPIが導入されました。
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`: この関数は`merge()`と同じように動作し、最初の設定から値を取得します。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`: 結果の設定は2番目のものから値を取得します。

## Ktorクライアント {id="client"}

### キャッシュ: 永続ストレージ {id="persistent-storage"}

v2.2.0では、応答[キャッシュ](client-caching.md)に関連する以下のAPIが非推奨になりました。
- `HttpCacheStorage`クラスは`CacheStorage`インターフェースに置き換えられました。これは、必要なプラットフォーム向けに永続ストレージを実装するために使用できます。
- `publicStorage`/`privateStorage`プロパティは、`CacheStorage`インスタンスを受け入れる対応する関数に置き換えられました。

### カスタムプラグイン {id="custom-plugins"}

2.2.0リリースから、Ktorはカスタムクライアントプラグインを作成するための新しいAPIを提供します。
詳細については、[カスタムクライアントプラグイン](client-custom-plugins.md)を参照してください。

## 新しいメモリモデル {id="new-mm"}

v2.2.0では、KtorはKotlinの1.7.20バージョンを使用しており、新しいKotlin/Nativeメモリモデルが[デフォルトで有効になっています](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)。
これは、[Nativeサーバー](server-native.md)または[Kotlin/Native](client-engines.md#native)をターゲットとするクライアントエンジンに対して、明示的に有効にする必要がないことを意味します。