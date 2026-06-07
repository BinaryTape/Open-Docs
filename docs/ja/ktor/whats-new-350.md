[//]: # (title: Ktor 3.5.0 の新機能)

<show-structure for="chapter,procedure" depth="2"/>

_[リリース日: 2026年5月15日](releases.md#release-details)_

Ktor 3.5.0 では、サーバーとクライアントの両方でさまざまな改善が行われました。この機能リリースの主なハイライトは以下の通りです。

* [RFC 7616 ダイジェスト認証のサポート](#rfc-7616-digest-auth)
* [ルート設定のデータクラスへのマッピング](#config-data-class-mapping)
* [変更時のみセッションクッキーを送信](#session-cookies)
* [OkHttp および Apache5 クライアントエンジンにおけるカスタム DNS リゾルバー](#custom-dns-resolvers)

## Ktor Server

### RFC 7616 ダイジェスト認証のサポート {id="rfc-7616-digest-auth"}

Ktor 3.5.0 では、[`digest` 認証プロバイダー](server-digest-auth.md)が [RFC 7616](https://datatracker.ietf.org/doc/html/rfc7616) に準拠するように更新され、セキュリティが向上し、最新のダイジェスト機能がサポートされました。

このリリースでは、以下の変更が導入されています。

* `algorithms` プロパティを使用して、複数のハッシュアルゴリズムを構成できるようになりました。複数の値が指定されている場合、Ktor は複数の `WWW-Authenticate` ヘッダーを送信し、クライアントがサポートされている最も強力なオプションを選択できるようにします。
* 文字列ベースの構成を置き換えるために、`DigestAlgorithm` および `DigestQop` 列挙型が導入されました。
* `digestProvider {}` ラムダが `algorithm` パラメータを受け取るようになり、正しいダイジェストを動的に計算できるようになりました。
* RFC 7616 に基づき、`qop` パラメータが認証チャレンジに含まれるようになりました。
* `SHA-256-sess` や `SHA-512-256-sess` などのセッションベースのアルゴリズムのサポートが追加されました。
* プライバシー保護を向上させるため、RFC 7616 のユーザー名ハッシュ化（`userhash`）のサポートが追加されました。

以下の例は、レガシーな構成から RFC 7616 準拠の API に移行する方法を示しています。

<compare type="left-right" first-title="レガシー" second-title="RFC 7616">

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        algorithmName = "MD5"  // 非推奨のプロパティ
        digestProvider { userName, realm ->
            // アルゴリズムパラメータのない古いシグネチャ
            getMd5Digest("$userName:$realm:$password")
        }
    }
}
```

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        // 最新のクライアントとレガシーなクライアントの両方をサポート
        algorithms = listOf(DigestAlgorithm.SHA_512_256, DigestAlgorithm.MD5)
        digestProvider { userName, realm, algorithm ->
            // 新しいシグネチャはアルゴリズムを受け取る
            val password = getPassword(userName) ?: return@digestProvider null
            algorithm.toDigester().digest("$userName:$realm:$password".toByteArray())
        }
    }
}
```
</compare>

既存の構成は変更なしで引き続き動作します。ただし、新しいアプリケーションでは、以下のことが推奨されます。

* `SHA-512-256` や `SHA-256` などの安全なアルゴリズムを使用する。
* 新しい `algorithms` パラメータを使用するように `digestProvider` を更新する。
* レガシーなクライアントとの互換性が必要な場合を除き、`MD5` ベースのアルゴリズムを避ける。

詳細なガイドについては、[Ktor Server でのダイジェスト認証](server-digest-auth.md)を参照してください。

### カスタムプロバイダーにおけるサスペンド `.authenticate()` オーバーロード

[カスタム認証プロバイダー](server-auth.md#custom-auth-provider)で、サスペンドバージョンの `DynamicProviderConfig.authenticate()` 関数を実装できるようになりました。`.authenticate()` 関数はサスペンドラムダを受け入れるため、認証内でコルーチン API を直接呼び出すことができます。

```kotlin
install(Authentication) {
  provider("custom") {
    authenticate { context ->
      delay(10.milliseconds)
      context.principal(null)
    }
  }
}
```

### ルート設定のデータクラスへのマッピング {id="config-data-class-mapping"}

`ApplicationConfig` で、設定全体をデータクラスにデシリアライズするための `.getAs()` 関数が提供されるようになりました。

以前は、デシリアライズは個々のプロパティに限定されており、`.property()` 関数を介してアクセスする必要がありました。ルートレベルのサポートにより、設定構造全体を単一のデータクラスに直接マッピングできます。

<compare type="top-bottom" first-title="以前" second-title="以後">

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)

val app = ApplicationConfig("application.yaml").property("app").getAs<App>()
val security = ApplicationConfig("application.yaml").property("security").getAs<Security>()
```

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)
@Serializable data class Config(val app: App, val security: Security)

val config = ApplicationConfig("application.yaml").getAs<Config>()
```

</compare>

### リクエストパラメータ取得のためのヘルパー関数

Ktor 3.5.0 では、`ApplicationCall` から必須のリクエストデータへのアクセスを簡素化する新しい拡張関数のセットが導入されました。

以前は、必須のリクエストデータの検証には、繰り返しの null チェックやラベル付きリターンが必要になることがよくありました。このワークフローを改善するために、Ktor は以下の新しい拡張関数を提供します。

* `ApplicationCall.requireQueryParameter()` — リクエスト URL から必須のクエリパラメータを取得します。パラメータが欠落している場合はスローします。
* `ApplicationCall.requireHeader()` — 必須の HTTP ヘッダー値を取得します。ヘッダーがリクエストに存在しない場合はスローします。
* `ApplicationCall.requireCookie()` — 必須のクッキー値を取得し、必要に応じて指定されたエンコーディングを使用してデコードします。クッキーが欠落している場合はスローします。
* `RoutingCall.requirePathParameter()` — ルート定義から必須のパスパラメータを取得します。パラメータがマッチしたルートに存在しない場合はスローします。

各関数は非 null 値を返すか、値が欠落している場合に `MissingRequestParameterException` をスローします。

<compare>

```kotlin
post("/checkout") {
  val userId = call.request.cookies["userId"]
    ?: return@post call.respondText(
      "Login required",
      status = HttpStatusCode.Forbidden
    )

  val amount = call.request.queryParameters["amount"]?.toLongOrNull()
    ?: return@post call.respondText(
     "Amount missing",
     status = HttpStatusCode.BadRequest
  )
  
  // ビジネスロジック
}
```

```kotlin
post("/checkout") {
    val userId = call.requireCookie("userId")
    val amount = call.requireQueryParameter("amount").toLong()

    // ビジネスロジック
}
```

</compare>

### `ktor-network` の ES モジュール互換性

ES モジュールが有効な場合に `ktor-network` およびすべての依存モジュールを使用できなくなる問題を修正しました。

将来のデグレードを防ぐため、JavaScript テストインフラストラクチャはデフォルトで ES2015 と ES モジュールの両方をターゲットにするようになりました。

> Kotlin/JS モジュールシステムと ES2015 サポートの詳細については、以下を参照してください。
> * [JavaScript modules](https://kotlinlang.org/docs/js-modules.html)
> * [Support for ES2015 features](https://kotlinlang.org/docs/js-project-setup.html#support-for-es2015-features)
>
{style="tip"}

### 変更時のみセッションクッキーを送信 {id="session-cookies"}

Ktor 3.5.0 では、[Sessions](server-sessions.md) プラグインに、セッションデータが変更された場合にのみ送信する（例：クッキーベースのセッションにおける `Set-Cookie` ヘッダー）新しいオプションが導入されました。

デフォルトでは、既存の動作を維持するためにセッションデータはすべてのレスポンスで送信されます。変更時のみ送信するには、セッションクッキー構成で `sendOnlyIfModified` フラグを有効にします。

```kotlin
install(Sessions) {
    cookie<MySession>("SESSION") {
        sendOnlyIfModified = true
    }
}
```

### カスタム SSE ハートビートイベント

このリリースでは、イベントプロバイダー関数を使用してハートビートイベントを完全にカスタマイズできる、Ktor サーバーサイド SSE サポートの新しいオプションが導入されました。

```kotlin
heartbeat {
    period = 30.milliseconds
    eventProvider = { ServerSentEvent(data = "ts=${Clock.System.now()}") }
}
```

これにより、タイムスタンプやステータス情報などのカスタムハートビートペイロードを一定の間隔で送信できるようになります。

## Ktor Client

### OkHttp および Apache5 エンジンにおけるカスタム DNS リゾルバー {id="custom-dns-resolvers"}

Ktor 3.5.0 では、OkHttp および Apache5 クライアントエンジンでカスタム DNS リゾルバーを構成するための第一級のサポートが追加されました。

以前は、OkHttp の `config {}` や Apache5 の `configureConnectionManager { setDnsResolver(...) }` など、エンジン固有の内部にアクセスしてカスタム DNS 解決を構成していました。Ktor は、一貫性があり型安全な API を提供するために、各エンジンに専用의 構成プロパティを公開するようになりました。

#### OkHttp

`OkHttpConfig.dns` プロパティを使用して、OkHttp でカスタム DNS リゾルバーを構成できるようになりました。

```kotlin
HttpClient(OkHttp) {
    engine {
        dns = Dns { hostname -> listOf(InetAddress.getByName("127.0.0.1")) }
    }
}
```

`dns` プロパティを構成しない場合、OkHttp エンジンは引き続き OkHttp デフォルトの `Dns.SYSTEM` リゾルバーを使用します。

#### Apache5

`Apache5EngineConfig.dnsResolver` プロパティを使用して、Apache5 でカスタム DNS リゾルバーを構成できるようになりました。

```kotlin
HttpClient(Apache5) {
    engine {
        dnsResolver = SystemDefaultDnsResolver.INSTANCE
    }
}
```

`dnsResolver` プロパティが構成されていない場合、Apache5 エンジンは引き続き Apache クライアントのデフォルトの DNS リゾルバーを使用します。