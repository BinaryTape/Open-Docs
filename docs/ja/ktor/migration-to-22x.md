[//]: # (title: 2.0.x から 2.2.x への移行)

<show-structure for="chapter" depth="2"/>

このガイドでは、Ktor アプリケーションを 2.0.x バージョンから 2.2.x に移行する方法について説明します。

> `WARNING` 非推奨（deprecation）レベルでマークされた API は、3.0.0 リリースまで引き続き動作します。
> 非推奨レベルの詳細については、[Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) を参照してください。

## Ktor サーバー {id="server"}

### クッキー {id="cookies"}
v2.2.0 以降、[レスポンスクッキー](server-responses.md#cookies)の設定に関連する以下の API メンバーが変更されました：
- `append` 関数に渡される `maxAge` パラメーターの型が `Int` から `Long` に変更されました。
- `appendExpired` 関数は非推奨になりました。代わりに `expires` パラメーターを指定した `append` 関数を使用してください。

### リクエストのアドレス情報 {id="request-address-info"}

2.2.0 バージョン以降、リクエストが行われたホスト名/ポートを取得するために使用される `RequestConnectionPoint.host` プロパティおよび `RequestConnectionPoint.port` プロパティは非推奨となりました。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

代わりに `RequestConnectionPoint.serverHost` と `RequestConnectionPoint.serverPort` を使用してください。
また、リクエストを受信したホスト名/ポートを返す `localHost`/`localPort` プロパティも追加されました。
詳細は [オリジナルのリクエスト情報](server-forward-headers.md#original-request-information) を参照してください。

### 設定の統合 {id="merge-configs"}
v2.2.0 より前では、アプリケーション設定を統合するために `List<ApplicationConfig>.merge()` 関数が使用されていました。
両方の設定に同じキーがある場合、結果の設定は最初の設定の値を取ります。
このリリースでは、この動作を改善するために以下の API が導入されました：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`: この関数は `merge()` と同様に動作し、最初の設定の値を取ります。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`: 結果の設定は 2 番目の設定の値を取ります。

## Ktor クライアント {id="client"}

### キャッシュ: 永続ストレージ {id="persistent-storage"}

v2.2.0 以降、レスポンスの[キャッシュ](client-caching.md)に関連する以下の API は非推奨になりました：
- `HttpCacheStorage` クラスは `CacheStorage` インターフェースに置き換えられました。これを使用して、必要なプラットフォーム用の永続ストレージを実装できます。
- `publicStorage`/`privateStorage` プロパティは、`CacheStorage` インスタンスを受け取る対応する関数に置き換えられました。

### カスタムプラグイン {id="custom-plugins"}

2.2.0 リリース以降、Ktor はカスタムクライアントプラグインを作成するための新しい API を提供しています。
詳細は [カスタムクライアントプラグイン](client-custom-plugins.md) を参照してください。

## 新しいメモリモデル {id="new-mm"}

v2.2.0 では、Ktor は Kotlin 1.7.20 バージョンを使用しており、このバージョンでは新しい Kotlin/Native メモリモデルが[デフォルトで有効](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)になっています。
つまり、[Native サーバー](server-native.md)や [Kotlin/Native](client-engines.md#native) をターゲットとするクライアントエンジンに対して、明示的に有効にする必要はありません。