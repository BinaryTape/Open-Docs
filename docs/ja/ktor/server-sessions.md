[//]: # (title: セッション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Sessionsプラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html)プラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。典型的なユースケースとしては、ログインしたユーザーのID、ショッピングカートの内容、またはクライアント上でのユーザー設定の保持などがあります。Ktorでは、クッキーまたはカスタムヘッダーを使用してセッションを実装でき、セッションデータをサーバーに保存するかクライアントに渡すかを選択し、セッションデータを署名および暗号化するなどの操作が可能です。

このトピックでは、%plugin_name%プラグインのインストール方法、設定方法、および[ルートハンドラー](server-routing.md#define_route)内でのセッションデータへのアクセス方法について説明します。

## 依存関係の追加 {id="add_dependencies"}
セッションのサポートを有効にするには、ビルドスクリプトに%artifact_name%アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## Sessionsのインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## セッション設定の概要 {id="configuration_overview"}
%plugin_name%プラグインを設定するには、以下の手順を実行する必要があります。
1. *[データクラスの作成](#data_class)*: セッションを設定する前に、セッションデータを保存するための[データクラス](https://kotlinlang.org/docs/data-classes.html)を作成する必要があります。
2. *[サーバーとクライアント間でデータを渡す方法の選択](#cookie_header)*: クッキーまたはカスタムヘッダーを使用します。クッキーは通常のHTMLアプリケーションに適しており、カスタムヘッダーはAPI向けです。
3. *[セッションペイロードの保存場所の選択](#client_server)*: クライアントまたはサーバー上です。シリアライズされたセッションデータをクッキー/ヘッダー値を使用してクライアントに渡すか、ペイロードをサーバーに保存してセッション識別子のみを渡すことができます。

   セッションペイロードをサーバーに保存したい場合は、*[保存方法を選択](#storages)*できます。サーバーメモリ内、またはフォルダー内です。セッションデータを保持するためのカスタムストレージを実装することも可能です。
4. *[セッションデータの保護](#protect_session)*: クライアントに渡される機密性の高いセッションデータを保護するには、セッションのペイロードを署名および暗号化する必要があります。

%plugin_name%を設定した後、[ルートハンドラー](server-routing.md#define_route)内で[セッションデータを取得および設定](#use_sessions)できます。

## データクラスの作成 {id="data_class"}

セッションを設定する前に、セッションデータを保存するための[データクラス](https://kotlinlang.org/docs/data-classes.html)を作成する必要があります。
例えば、以下の`UserSession`クラスは、セッションIDとページビュー数を保存するために使用されます。

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="10-11"}

複数のセッションを使用する場合は、複数のデータクラスを作成する必要があります。

## セッションデータの受け渡し: Cookie vs Header {id="cookie_header"}

### Cookie {id="cookie"}
クッキーを使用してセッションデータを渡すには、`install(Sessions)`ブロック内で指定された名前とデータクラスを指定して`cookie`関数を呼び出します。
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
上記の例では、セッションデータは`Set-Cookie`ヘッダーに追加された`user_session`属性を使用してクライアントに渡されます。他のクッキー属性は、`cookie`ブロック内で渡すことで設定できます。例えば、以下のコードスニペットは、クッキーのパスと有効期限を指定する方法を示しています。

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="14,17-19,21-22"}

必要な属性が明示的に公開されていない場合は、`extensions`プロパティを使用します。例えば、`SameSite`属性は次のように渡すことができます。
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
利用可能な設定の詳細については、[CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)を参照してください。

> アプリケーションを本番環境に[デプロイ](server-deployment.md)する前に、`secure`プロパティが`true`に設定されていることを確認してください。これにより、[セキュアな接続](server-ssl.md)を介してのみクッキーを転送できるようになり、HTTPSダウングレード攻撃からセッションデータを保護します。
>
{type="warning"}

### Header {id="header"}
カスタムヘッダーを使用してセッションデータを渡すには、`install(Sessions)`ブロック内で指定された名前とデータクラスを指定して`header`関数を呼び出します。

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

上記の例では、セッションデータは`cart_session`カスタムヘッダーを使用してクライアントに渡されます。
クライアント側では、セッションデータを取得するために、このヘッダーを各リクエストに付加する必要があります。

> [CORS](server-cors.md)プラグインを使用してクロスオリジンリクエストを処理する場合、カスタムヘッダーを`CORS`設定に次のように追加します。
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## セッションペイロードの保存: クライアント vs サーバー {id="client_server"}

Ktorでは、セッションデータを2つの方法で管理できます。
- _クライアントとサーバー間でセッションデータを渡す_。
   
  [cookieまたはheader](#cookie_header)関数にセッション名のみを渡した場合、セッションデータはクライアントとサーバー間で渡されます。この場合、クライアントに渡される機密性の高いセッションデータを保護するために、セッションのペイロードを[署名および暗号化](#protect_session)する必要があります。
- _セッションデータをサーバーに保存し、セッションIDのみをクライアントとサーバー間で渡す_。
   
  そのような場合、サーバー上のペイロードの[保存場所](#storages)を選択できます。例えば、セッションデータをメモリ内、指定されたフォルダー内、または独自のカスタムストレージを実装して保存できます。

## サーバーでのセッションペイロードの保存 {id="storages"}

Ktorでは、セッションデータを[サーバーに保存](#client_server)し、セッションIDのみをサーバーとクライアント間で渡すことができます。この場合、サーバー上でペイロードをどこに保持するかを選択できます。

### インメモリストレージ {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html)は、セッションの内容をメモリに保存できるようにします。このストレージは、サーバーの稼働中にデータを保持し、サーバーが停止すると情報を破棄します。例えば、次のようにサーバーメモリにクッキーを保存できます。

```kotlin
```
{src="snippets/session-cookie-server/src/main/kotlin/com/example/Application.kt" include-lines="16,19"}

完全な例はこちらで確認できます: [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> `SessionStorageMemory`は開発目的のみを意図していることに注意してください。

### ディレクトリストレージ {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html)は、指定されたディレクトリ下のファイルにセッションデータを保存するために使用できます。例えば、`build/.sessions`ディレクトリ下のファイルにセッションデータを保存するには、次のように`directorySessionStorage`を作成します。
```kotlin
```
{src="snippets/session-header-server/src/main/kotlin/com/example/Application.kt" include-lines="17,19"}

完全な例はこちらで確認できます: [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)。

### カスタムストレージ {id="custom_storage"}

Ktorは、カスタムストレージを実装できる[SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html)インターフェースを提供します。
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
これら3つの関数はすべて[サスペンド関数](https://kotlinlang.org/docs/composing-suspending-functions.html)です。[SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt)を参考にできます。

## セッションデータの保護 {id="protect_session"}

### セッションデータの署名 {id="sign_session"}

セッションデータを署名すると、セッションの内容が変更されるのを防ぎますが、ユーザーはこの内容を見ることができます。
セッションを署名するには、`SessionTransportTransformerMessageAuthentication`コンストラクタに署名キーを渡し、このインスタンスを`transform`関数に渡します。

```kotlin
```
{src="snippets/session-cookie-server/src/main/kotlin/com/example/Application.kt" include-lines="14-20"}

`SessionTransportTransformerMessageAuthentication`は、デフォルトの認証アルゴリズムとして`HmacSHA256`を使用しており、これは変更可能です。

### セッションデータの署名と暗号化 {id="sign_encrypt_session"}

セッションデータを署名および暗号化すると、セッションの内容が読み取られたり変更されたりするのを防ぎます。
セッションを署名および暗号化するには、`SessionTransportTransformerEncrypt`コンストラクタに署名/暗号化キーを渡し、このインスタンスを`transform`関数に渡します。

```kotlin
```

{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="14-22"}

> Ktorバージョン`3.0.0`で[暗号化方法が更新された](migrating-3.md#session-encryption-method-update)ことに注意してください。以前のバージョンから移行する場合は、既存のセッションとの互換性を確保するために、`SessionTransportTransformerEncrypt`のコンストラクタで`backwardCompatibleRead`プロパティを使用してください。
>
{style="note"}

デフォルトでは、`SessionTransportTransformerEncrypt`は`AES`と`HmacSHA256`アルゴリズムを使用しており、これらは変更可能です。

> 署名/暗号化キーはコードで指定すべきではありません。[設定ファイル](server-configuration-file.topic#configuration-file-overview)のカスタムグループを使用して署名/暗号化キーを保存し、[環境変数](server-configuration-file.topic#environment-variables)を使用してそれらを初期化できます。
>
{type="warning"}

## セッションコンテンツの取得と設定 {id="use_sessions"}
特定の[ルート](server-routing.md)のセッションコンテンツを設定するには、`call.sessions`プロパティを使用します。`set`メソッドを使用すると、新しいセッションインスタンスを作成できます。

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="24-27"}

セッションコンテンツを取得するには、登録されているセッションタイプのいずれかを型パラメータとして受け取る`get`を呼び出すことができます。

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="29-31,37"}

セッションを変更するには、例えばカウンターをインクリメントするには、データクラスの`copy`メソッドを呼び出す必要があります。

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="29-37"}

何らかの理由でセッションをクリアする必要がある場合（例えば、ユーザーがログアウトした場合）、`clear`関数を呼び出します。

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="39-42"}

完全な例はこちらで確認できます: [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 例 {id="examples"}

以下の実行可能な例は、%plugin_name%プラグインの使用方法を示しています。

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)は、[署名および暗号化された](#sign_encrypt_session)セッションペイロードを[クッキー](#cookie)を使用して[クライアント](#client_server)に渡す方法を示しています。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)は、セッションペイロードを[サーバーメモリ](#in_memory_storage)に保持し、[署名された](#sign_session)セッションIDを[クッキー](#cookie)を使用してクライアントに渡す方法を示しています。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)は、セッションペイロードをサーバーの[ディレクトリストレージ](#directory_storage)に保持し、[署名された](#sign_session)セッションIDを[カスタムヘッダー](#header)を使用してクライアントに渡す方法を示しています。