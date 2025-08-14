[//]: # (title: 2.0.xから2.2.xへの移行)

<show-structure for="chapter" depth="2"/>

このガイドでは、Ktorアプリケーションをバージョン2.0.xから2.2.xに移行する方法について説明します。

> `WARNING`非推奨レベルでマークされたAPIは、3.0.0リリースまで引き続き動作します。
> 非推奨レベルの詳細については、[Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)を参照してください。

## Ktorサーバー {id="server"}

### Cookie {id="cookies"}
v2.2.0では、[レスポンスCookie](server-responses.md#cookies)の設定に関連する以下のAPIメンバーが変更されました。
- `append`関数に渡される`maxAge`パラメーターの型が`Int`から`Long`に変更されました。
- `appendExpired`関数は非推奨になりました。代わりに`expires`パラメーターを指定して`append`関数を使用してください。

### リクエストアドレス情報 {id="request-address-info"}

バージョン2.2.0以降、リクエストが行われたホスト名/ポートを取得するために使用される`RequestConnectionPoint.host`および`RequestConnectionPoint.port`プロパティは非推奨になりました。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

代わりに`RequestConnectionPoint.serverHost`および`RequestConnectionPoint.serverPort`を使用してください。
また、リクエストが受信されたホスト名/ポートを返す`localHost`/`localPort`プロパティも追加されました。
詳細については、[](server-forward-headers.md#original-request-information)を参照してください。

### 設定のマージ {id="merge-configs"}
v2.2.0より前は、`List<ApplicationConfig>.merge()`関数がアプリケーション設定のマージに使用されていました。
両方の設定が同じキーを持つ場合、結果の設定は最初の設定の値を取ります。
このリリースでは、この動作を改善するために以下のAPIが導入されました。
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`: この関数は`merge()`と同じように動作し、最初の設定から値を取ります。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`: 結果の設定は2番目の設定から値を取ります。

## Ktorクライアント {id="client"}

### キャッシュ: 永続ストレージ {id="persistent-storage"}

v2.2.0では、レスポンス[キャッシュ](client-caching.md)に関連する以下のAPIが非推奨になりました。
- `HttpCacheStorage`クラスは`CacheStorage`インターフェースに置き換えられました。これは、必要なプラットフォームの永続ストレージを実装するために使用できます。
- `publicStorage`/`privateStorage`プロパティは、`CacheStorage`インスタンスを受け入れる対応する関数に置き換えられました。

### カスタムプラグイン {id="custom-plugins"}

2.2.0リリース以降、Ktorはカスタムクライアントプラグインを作成するための新しいAPIを提供します。
詳細については、[](client-custom-plugins.md)を参照してください。

## 新しいメモリモデル {id="new-mm"}

v2.2.0では、KtorはKotlinのバージョン1.7.20を使用しており、そこでは新しいKotlin/Nativeメモリモデルが[デフォルトで有効になっています](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)。
これにより、[ネイティブサーバー](server-native.md)または[Kotlin/Native](client-engines.md#native)をターゲットとするクライアントエンジンに対して明示的に有効にする必要がなくなります。