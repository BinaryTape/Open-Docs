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
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

<link-summary>
セッションプラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。
</link-summary>

`[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html)`プラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。一般的な使用例としては、ログイン中のユーザーIDの保存、ショッピングカートの内容、またはクライアント上でのユーザー設定の保持などがあります。Ktorでは、Cookieまたはカスタムヘッダーを使用してセッションを実装し、セッションデータをサーバーに保存するかクライアントに渡すかを選択したり、セッションデータを署名・暗号化したりすることができます。

このトピックでは、`%plugin_name%`プラグインのインストール方法、構成方法、および[ルートハンドラー](server-routing.md#define_route)内でのセッションデータへのアクセス方法について説明します。

## 依存関係の追加 {id="add_dependencies"}
セッションのサポートを有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## セッションのインストール {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
    これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立つことがあります。
</p>

## セッション設定の概要 {id="configuration_overview"}
`%plugin_name%`プラグインを設定するには、以下の手順を実行する必要があります。
1. *[データクラスの作成](#data_class)*: セッションを設定する前に、セッションデータを保存するための[データクラス](https://kotlinlang.org/docs/data-classes.html)を作成する必要があります。
2. *[サーバーとクライアント間でデータを渡す方法を選択](#cookie_header)*: Cookieまたはカスタムヘッダーを使用します。CookieはプレーンなHTMLアプリケーションに適しており、カスタムヘッダーはAPI向けです。
3. *[セッションペイロードの保存場所を選択](#client_server)*: クライアントまたはサーバー。シリアライズされたセッションデータをCookie/ヘッダー値を使用してクライアントに渡すか、ペイロードをサーバーに保存しセッション識別子のみを渡すことができます。

   セッションペイロードをサーバーに保存したい場合は、*[保存方法](#storages)*を選択できます。サーバーのメモリ内、またはフォルダ内です。セッションデータを保持するためのカスタムストレージを実装することもできます。
4. *[セッションデータの保護](#protect_session)*: クライアントに渡される機密性の高いセッションデータを保護するために、セッションのペイロードを署名および暗号化する必要があります。

`%plugin_name%`の設定後、[ルートハンドラー](server-routing.md#define_route)内で[セッションデータを取得および設定](#use_sessions)できます。

## データクラスの作成 {id="data_class"}

セッションを設定する前に、セッションデータを保存するための[データクラス](https://kotlinlang.org/docs/data-classes.html)を作成する必要があります。
たとえば、以下の`UserSession`クラスはセッションIDとページビュー数を保存するために使用されます。

```kotlin
@Serializable
data class UserSession(val id: String, val count: Int)
```

複数のセッションを使用する場合は、複数のデータクラスを作成する必要があります。

## セッションデータの受け渡し: Cookie vs ヘッダー {id="cookie_header"}

### Cookie {id="cookie"}
Cookieを使用してセッションデータを渡すには、`install(Sessions)`ブロック内で、指定された名前とデータクラスを持つ`cookie`関数を呼び出します。
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
上記の例では、セッションデータは`Set-Cookie`ヘッダーに追加された`user_session`属性を使用してクライアントに渡されます。`cookie`ブロック内で他のCookie属性を渡すことで、それらを構成できます。たとえば、以下のコードスニペットは、Cookieのパスと有効期限を指定する方法を示しています。

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 10
    }
}
```

必要な属性が明示的に公開されていない場合は、`extensions`プロパティを使用します。たとえば、`SameSite`属性は次のように渡すことができます。
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
利用可能な設定の詳細については、[CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)を参照してください。

> アプリケーションを本番環境に[デプロイ](server-deployment.md)する前に、`secure`プロパティが`true`に設定されていることを確認してください。
> これにより、[安全な接続](server-ssl.md)を介したCookieの転送のみが有効になり、HTTPSダウングレード攻撃からセッションデータを保護します。
>
{type="warning"}

### ヘッダー {id="header"}
カスタムヘッダーを使用してセッションデータを渡すには、`install(Sessions)`ブロック内で、指定された名前とデータクラスを持つ`header`関数を呼び出します。

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

上記の例では、セッションデータは`cart_session`カスタムヘッダーを使用してクライアントに渡されます。
クライアント側では、セッションデータを取得するために各リクエストにこのヘッダーを追加する必要があります。

> クロスオリジンリクエストを処理するために[CORS](server-cors.md)プラグインを使用している場合は、以下のようにカスタムヘッダーを`CORS`設定に追加します。
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## セッションペイロードの保存: クライアント vs サーバー {id="client_server"}

Ktorでは、セッションデータを2つの方法で管理できます。
- _クライアントとサーバー間でセッションデータを渡す_。
   
  [cookieまたはheader](#cookie_header)関数にセッション名のみを渡す場合、セッションデータはクライアントとサーバー間で渡されます。この場合、クライアントに渡される機密性の高いセッションデータを保護するために、セッションのペイロードを[署名および暗号化](#protect_session)する必要があります。
- _セッションデータをサーバーに保存し、セッションIDのみをクライアントとサーバー間で渡す_。
   
  そのような場合、サーバー上で[ペイロードをどこに保存するか](#storages)を選択できます。たとえば、セッションデータをメモリ内、指定されたフォルダ内、または独自のカスタムストレージを実装して保存できます。

## サーバーへのセッションペイロードの保存 {id="storages"}

Ktorでは、セッションデータを[サーバーに保存](#client_server)し、セッションIDのみをサーバーとクライアント間で渡すことができます。この場合、サーバー上でペイロードをどこに保持するかを選択できます。

### インメモリストレージ {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html)を使用すると、セッションの内容をメモリに保存できます。このストレージは、サーバーの実行中にデータを保持し、サーバーが停止すると情報を破棄します。たとえば、次のようにCookieをサーバーメモリに保存できます。

```kotlin
cookie<CartSession>("cart_session", SessionStorageMemory()) {
}
```

完全な例はこちらで確認できます: [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> `SessionStorageMemory`は開発目的のみを意図しています。

### ディレクトリストレージ {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html)は、指定されたディレクトリ内のファイルにセッションデータを保存するために使用できます。たとえば、`build/.sessions`ディレクトリ内のファイルにセッションデータを保存するには、次のように`directorySessionStorage`を作成します。
```kotlin
header<CartSession>("cart_session", directorySessionStorage(File("build/.sessions"))) {
}
```

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
3つの関数はすべて[サスペンド関数](https://kotlinlang.org/docs/composing-suspending-functions.html)です。[SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt)を参考にすることができます。

## セッションデータの保護 {id="protect_session"}

### セッションデータの署名 {id="sign_session"}

セッションデータに署名することで、セッションの内容が改変されるのを防ぎますが、ユーザーはこの内容を見ることができます。
セッションに署名するには、`SessionTransportTransformerMessageAuthentication`コンストラクタに署名キーを渡し、このインスタンスを`transform`関数に渡します。

```kotlin
install(Sessions) {
    val secretSignKey = hex("6819b57a326945c1968f45236589")
    cookie<CartSession>("cart_session", SessionStorageMemory()) {
        cookie.path = "/"
        transform(SessionTransportTransformerMessageAuthentication(secretSignKey))
    }
}
```

`SessionTransportTransformerMessageAuthentication`はデフォルトの認証アルゴリズムとして`HmacSHA256`を使用しますが、これは変更可能です。

### セッションデータの署名と暗号化 {id="sign_encrypt_session"}

セッションデータを署名および暗号化することで、セッションの内容が読み取られたり、改変されたりするのを防ぎます。
セッションを署名および暗号化するには、`SessionTransportTransformerEncrypt`コンストラクタに署名/暗号化キーを渡し、このインスタンスを`transform`関数に渡します。

```kotlin
install(Sessions) {
    val secretEncryptKey = hex("00112233445566778899aabbccddeeff")
    val secretSignKey = hex("6819b57a326945c1968f45236589")
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 10
        transform(SessionTransportTransformerEncrypt(secretEncryptKey, secretSignKey))
    }
}
```

> Ktorバージョン`3.0.0`で[暗号化メソッドが更新された](migrating-3.md#session-encryption-method-update)ことに注意してください。
> 以前のバージョンから移行する場合は、既存のセッションとの互換性を確保するために、`SessionTransportTransformerEncrypt`のコンストラクタで`backwardCompatibleRead`プロパティを使用してください。
>
{style="note"}

デフォルトでは、`SessionTransportTransformerEncrypt`は`AES`と`HmacSHA256`アルゴリズムを使用しますが、これらは変更可能です。

> 署名/暗号化キーはコードで指定すべきではありません。
> 署名/暗号化キーを保存し、[環境変数](server-configuration-file.topic#environment-variables)を使用してそれらを初期化するために、[設定ファイル](server-configuration-file.topic#configuration-file-overview)でカスタムグループを使用できます。
>
{type="warning"}

## セッションコンテンツの取得と設定 {id="use_sessions"}
特定の[ルート](server-routing.md)のセッションコンテンツを設定するには、`call.sessions`プロパティを使用します。`set`メソッドを使用すると、新しいセッションインスタンスを作成できます。

```kotlin
get("/login") {
    call.sessions.set(UserSession(id = "123abc", count = 0))
    call.respondRedirect("/user")
}
```

セッションコンテンツを取得するには、登録済みのセッション型のいずれかを型パラメータとして受け取る`get`を呼び出すことができます。

```kotlin
get("/user") {
    val userSession = call.sessions.get<UserSession>()
    if (userSession != null) {
}
```

たとえば、カウンターをインクリメントするためにセッションを変更するには、データクラスの`copy`メソッドを呼び出す必要があります。

```kotlin
get("/user") {
    val userSession = call.sessions.get<UserSession>()
    if (userSession != null) {
        call.sessions.set(userSession.copy(count = userSession.count + 1))
        call.respondText("Session ID is ${userSession.id}. Reload count is ${userSession.count}.")
    } else {
        call.respondText("Session doesn't exist or is expired.")
    }
}
```

何らかの理由でセッションをクリアする必要がある場合（たとえば、ユーザーがログアウトした場合）、`clear`関数を呼び出します。

```kotlin
get("/logout") {
    call.sessions.clear<UserSession>()
    call.respondRedirect("/user")
}
```

完全な例はこちらで確認できます: [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 遅延セッション取得

デフォルトでは、Ktorはセッションを含むすべてのリクエストに対して、ルートが実際に必要としているかどうかにかかわらず、ストレージからセッションを読み取ろうとします。この動作は、特にカスタムセッションストレージを使用するアプリケーションにおいて、不要なオーバーヘッドを引き起こす可能性があります。

`io.ktor.server.sessions.deferred`システムプロパティを有効にすることで、セッションの読み込みを遅延させることができます。

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 例 {id="examples"}

以下の実行可能な例は、`%plugin_name%`プラグインの使用方法を示しています。

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)は、[署名および暗号化された](#sign_encrypt_session)セッションペイロードを[Cookie](#cookie)を使用して[クライアント](#client_server)に渡す方法を示します。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)は、セッションペイロードを[サーバーメモリ](#in_memory_storage)に保持し、[署名された](#sign_session)セッションIDを[Cookie](#cookie)を使用してクライアントに渡す方法を示します。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)は、セッションペイロードをサーバー上の[ディレクトリストレージ](#directory_storage)に保持し、[署名された](#sign_session)セッションIDを[カスタムヘッダー](#header)を使用してクライアントに渡す方法を示します。