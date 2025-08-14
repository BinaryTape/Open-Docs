[//]: # (title: セッション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>サポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
セッションプラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html)プラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。一般的なユースケースとしては、ログイン中のユーザーIDの保存、ショッピングカートの内容、あるいはクライアント側のユーザー設定の保持などが挙げられます。Ktorでは、クッキーまたはカスタムヘッダーを使用してセッションを実装でき、セッションデータをサーバーに保存するか、クライアントに渡すかを選択でき、セッションデータの署名と暗号化なども行えます。

このトピックでは、`%plugin_name%`プラグインのインストール方法、設定方法、および[ルートハンドラー](server-routing.md#define_route)内でのセッションデータへのアクセス方法について説明します。

## 依存関係の追加 {id="add_dependencies"}
セッションのサポートを有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## セッションのインストール {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
        指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構築できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ...<code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ...<code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにインストール</a>することもできます。
        これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立つかもしれません。
    </p>
    

## セッション設定の概要 {id="configuration_overview"}
`%plugin_name%`プラグインを設定するには、以下の手順を実行する必要があります。
1. *[データクラスを作成する](#data_class)*: セッションを設定する前に、セッションデータを保存するための[データクラス](https://kotlinlang.org/docs/data-classes.html)を作成する必要があります。
2. *[サーバーとクライアント間でデータを渡す方法を選択する](#cookie_header)*: クッキーまたはカスタムヘッダーを使用します。クッキーは通常のHTMLアプリケーションに適しており、カスタムヘッダーはAPI向けです。
3. *[セッションペイロードの保存場所を選択する](#client_server)*: クライアントまたはサーバー上。シリアライズされたセッションデータをクッキー/ヘッダー値を使用してクライアントに渡すことも、ペイロードをサーバーに保存し、セッション識別子のみを渡すこともできます。

   セッションペイロードをサーバーに保存する場合は、その保存方法を*[選択](#storages)*できます。サーバーのメモリ内またはフォルダー内です。セッションデータを保持するためのカスタムストレージを実装することもできます。
4. *[セッションデータを保護する](#protect_session)*: クライアントに渡される機密性の高いセッションデータを保護するには、セッションのペイロードに署名し、暗号化する必要があります。

`%plugin_name%`の設定後、[ルートハンドラー](server-routing.md#define_route)内で[セッションデータを取得および設定](#use_sessions)できます。

## データクラスの作成 {id="data_class"}

セッションを設定する前に、セッションデータを保存するための[データクラス](https://kotlinlang.org/docs/data-classes.html)を作成する必要があります。
例えば、以下の`UserSession`クラスはセッションIDとページビュー数を保存するために使用されます。

[object Promise]

複数のセッションを使用する場合は、複数のデータクラスを作成する必要があります。

## セッションデータの受け渡し: Cookie vs Header {id="cookie_header"}

### Cookie {id="cookie"}
クッキーを使用してセッションデータを渡すには、`install(Sessions)`ブロック内で指定された名前とデータクラスとともに`cookie`関数を呼び出します。
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
上記の例では、`user_session`属性が`Set-Cookie`ヘッダーに追加され、それを使用してセッションデータがクライアントに渡されます。他のクッキー属性は、`cookie`ブロック内で渡すことで設定できます。例えば、以下のコードスニペットは、クッキーのパスと有効期限を指定する方法を示しています。

[object Promise]

必要な属性が明示的に公開されていない場合は、`extensions`プロパティを使用します。例えば、`SameSite`属性は次のように渡すことができます。
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
利用可能な設定の詳細については、[CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)を参照してください。

> アプリケーションを本番環境に[デプロイ](server-deployment.md)する前に、`secure`プロパティが`true`に設定されていることを確認してください。
> これにより、クッキーは[セキュアな接続](server-ssl.md)を介してのみ転送され、HTTPSダウングレード攻撃からセッションデータが保護されます。
> {type="warning"}

### Header {id="header"}
カスタムヘッダーを使用してセッションデータを渡すには、`install(Sessions)`ブロック内で指定された名前とデータクラスとともに`header`関数を呼び出します。

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

上記の例では、`cart_session`カスタムヘッダーを使用してセッションデータがクライアントに渡されます。
クライアント側では、セッションデータを取得するために、各リクエストにこのヘッダーを追加する必要があります。

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
   
  [cookieまたはheader](#cookie_header)関数にセッション名のみを渡す場合、セッションデータはクライアントとサーバー間で渡されます。この場合、クライアントに渡される機密性の高いセッションデータを保護するために、セッションのペイロードに[署名し、暗号化](#protect_session)する必要があります。
- _サーバーにセッションデータを保存し、クライアントとサーバー間でセッションIDのみを渡す_。
   
  そのような場合、サーバー上の[どこにペイロードを保存するか](#storages)を選択できます。例えば、セッションデータをメモリ内、指定されたフォルダー内、または独自のカスタムストレージを実装して保存できます。

## サーバーにセッションペイロードを保存 {id="storages"}

Ktorでは、セッションデータを[サーバーに](#client_server)保存し、サーバーとクライアント間でセッションIDのみを渡すことができます。この場合、サーバー上のどこにペイロードを保持するかを選択できます。

### インメモリストレージ {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html)は、セッションの内容をメモリに保存できるようにします。このストレージは、サーバーの実行中にデータを保持し、サーバーが停止すると情報を破棄します。例えば、次のようにサーバーメモリにクッキーを保存できます。

[object Promise]

完全な例はこちらで確認できます: [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> `SessionStorageMemory`は開発目的のみを意図していることに注意してください。

### ディレクトリストレージ {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html)は、指定されたディレクトリ下のファイルにセッションデータを保存するために使用できます。例えば、`build/.sessions`ディレクトリ下のファイルにセッションデータを保存するには、次のように`directorySessionStorage`を作成します。
[object Promise]

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
3つの関数はすべて[サスペンド関数](https://kotlinlang.org/docs/composing-suspending-functions.html)です。[SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt)を参照として使用できます。

## セッションデータの保護 {id="protect_session"}

### セッションデータへの署名 {id="sign_session"}

セッションデータに署名することで、セッションの内容が改ざんされるのを防ぎますが、ユーザーはこの内容を見ることができます。
セッションに署名するには、`SessionTransportTransformerMessageAuthentication`コンストラクタに署名キーを渡し、このインスタンスを`transform`関数に渡します。

[object Promise]

`SessionTransportTransformerMessageAuthentication`はデフォルトの認証アルゴリズムとして`HmacSHA256`を使用しますが、これは変更可能です。

### セッションデータの署名と暗号化 {id="sign_encrypt_session"}

セッションデータに署名し、暗号化することで、セッションの内容の読み取りと改ざんを防ぎます。
セッションに署名し、暗号化するには、`SessionTransportTransformerEncrypt`コンストラクタに署名/暗号化キーを渡し、このインスタンスを`transform`関数に渡します。

[object Promise]

> Ktorバージョン`3.0.0`で[暗号化メソッドが更新された](migrating-3.md#session-encryption-method-update)ことに注意してください。
> 以前のバージョンから移行する場合は、既存のセッションとの互換性を確保するために、`SessionTransportTransformerEncrypt`のコンストラクタで`backwardCompatibleRead`プロパティを使用してください。
> {style="note"}

デフォルトでは、`SessionTransportTransformerEncrypt`は`AES`と`HmacSHA256`アルゴリズムを使用しますが、これは変更可能です。

> 署名/暗号化キーはコード内で指定すべきではないことに注意してください。
> 署名/暗号化キーを保存し、[環境変数](server-configuration-file.topic#environment-variables)を使用してそれらを初期化するために、[設定ファイル](server-configuration-file.topic#configuration-file-overview)でカスタムグループを使用できます。
> {type="warning"}

## セッションコンテンツの取得と設定 {id="use_sessions"}
特定の[ルート](server-routing.md)のセッションコンテンツを設定するには、`call.sessions`プロパティを使用します。`set`メソッドを使用すると、新しいセッションインスタンスを作成できます。

[object Promise]

セッションコンテンツを取得するには、登録されたセッションタイプの一つを型パラメータとして受け取る`get`を呼び出すことができます。

[object Promise]

セッションを変更する場合、例えばカウンターをインクリメントするには、データクラスの`copy`メソッドを呼び出す必要があります。

[object Promise]

何らかの理由でセッションをクリアする必要がある場合（例えば、ユーザーがログアウトしたとき）は、`clear`関数を呼び出します。

[object Promise]

完全な例はこちらで確認できます: [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 遅延セッション取得

デフォルトでは、Ktorはセッションを含むすべてのリクエストに対して、ルートが実際に必要とするかどうかにかかわらず、ストレージからセッションを読み取ろうとします。
この動作は、特にカスタムセッションストレージを使用するアプリケーションでは、不要なオーバーヘッドを引き起こす可能性があります。

`io.ktor.server.sessions.deferred`システムプロパティを有効にすることで、セッションの読み込みを遅延させることができます。

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 例 {id="examples"}

以下の実行可能な例は、`%plugin_name%`プラグインの使用方法を示しています。

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)は、[署名され暗号化された](#sign_encrypt_session)セッションペイロードを[クライアント](#client_server)に[クッキー](#cookie)を使用して渡す方法を示しています。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)は、セッションペイロードを[サーバーメモリ](#in_memory_storage)に保持し、[署名された](#sign_session)セッションIDを[クッキー](#cookie)を使用してクライアントに渡す方法を示しています。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)は、セッションペイロードをサーバーの[ディレクトリストレージ](#directory_storage)に保持し、[署名された](#sign_session)セッションIDを[カスタムヘッダー](#header)を使用してクライアントに渡す方法を示しています。