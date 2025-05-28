[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[OAuth](https://oauth.net/) はアクセス委譲のためのオープン標準です。OAuth は、Google、Facebook、Twitter などの外部プロバイダーを使用して、アプリケーションのユーザーを承認するために使用できます。

`oauth` プロバイダーは認可コードフローをサポートしています。OAuth パラメーターを一箇所で設定でき、Ktor は必要なパラメーターと共に指定された認可サーバーへ自動的にリクエストを送信します。

> Ktor における認証と認可に関する一般的な情報は、[](server-auth.md) セクションで確認できます。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## セッションプラグインをインストールする

クライアントが保護されたリソースにアクセスしようとするたびに認可を要求するのを避けるため、認可が成功した際にアクセストークンをセッションに保存できます。その後、保護されたルートのハンドラー内で現在のセッションからアクセストークンを取得し、それを使用してリソースを要求できます。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="14,25-29,101,128-129"}

## OAuth 認可フロー {id="flow"}

Ktor アプリケーションにおける OAuth 認可フローは次のようになります。

1. ユーザーが Ktor アプリケーションのログインページを開きます。
2. Ktor は特定のプロバイダーの認可ページへ自動的にリダイレクトし、必要な[パラメーター](#configure-oauth-provider)を渡します。
    * 選択されたプロバイダーの API にアクセスするために使用されるクライアント ID。
    * 認可が完了した後に開かれる Ktor アプリケーションページを指定するコールバックまたはリダイレクト URL。
    * Ktor アプリケーションに必要なサードパーティリソースのスコープ。
    * アクセストークンを取得するために使用されるグラントタイプ（認可コード）。
    * CSRF 攻撃を軽減し、ユーザーをリダイレクトするために使用される `state` パラメーター。
    * 特定のプロバイダーに固有のオプションパラメーター。
3. 認可ページには、Ktor アプリケーションに必要な権限レベルを示す同意画面が表示されます。これらの権限は、[](#configure-oauth-provider) で設定された指定されたスコープに依存します。
4. ユーザーが要求された権限を承認すると、認可サーバーは指定されたリダイレクト URL にリダイレクトし、認可コードを送信します。
5. Ktor は、以下のパラメーターを含む指定されたアクセストークン URL へもう一度自動的にリクエストを送信します。
    * 認可コード。
    * クライアント ID とクライアントシークレット。

   認可サーバーはアクセストークンを返して応答します。
6. クライアントはこのトークンを使用して、選択されたプロバイダーの必要なサービスにリクエストを送信できます。ほとんどの場合、トークンは `Bearer` スキームを使用して `Authorization` ヘッダーで送信されます。
7. サービスはトークンを検証し、そのスコープを認可に使用して、要求されたデータを返します。

## OAuth をインストールする {id="install"}

`oauth` 認証プロバイダーをインストールするには、`install` ブロック内で [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 関数を呼び出します。オプションで、[プロバイダー名を指定](server-auth.md#provider-name)できます。例えば、「auth-oauth-google」という名前で `oauth` プロバイダーをインストールする場合、次のようになります。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="9-10,25-26,31-33,54-55,101"}

## OAuth を設定する {id="configure-oauth"}

このセクションでは、Google を使用してアプリケーションのユーザーを認可するための `oauth` プロバイダーの設定方法を説明します。完全に動作する例については、[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google) を参照してください。

### 前提条件: 認可資格情報を作成する {id="authorization-credentials"}

Google API にアクセスするには、Google Cloud Console で認可資格情報を作成する必要があります。

1. Google Cloud Console で [認証情報](https://console.cloud.google.com/apis/credentials) ページを開きます。
2. **認証情報を作成**をクリックし、`OAuth クライアント ID` を選択します。
3. ドロップダウンから `ウェブアプリケーション` を選択します。
4. 次の設定を指定します。
    * **承認済みの JavaScript 生成元**: `http://localhost:8080`。
    * **承認済みのリダイレクト URI**: `http://localhost:8080/callback`。Ktor では、認可が完了したときに開かれるリダイレクトルートを指定するために、[urlProvider](#configure-oauth-provider) プロパティが使用されます。

5. **作成**をクリックします。
6. 表示されたダイアログで、`oauth` プロバイダーの設定に使用する作成されたクライアント ID とクライアントシークレットをコピーします。

### ステップ 1: HTTP クライアントを作成する {id="create-http-client"}

`oauth` プロバイダーを設定する前に、サーバーが OAuth サーバーにリクエストを送信するために使用する [HttpClient](client-create-and-configure.md) を作成する必要があります。[ContentNegotiation](client-serialization.md) クライアントプラグイン（JSON シリアライザー付き）は、[API へのリクエスト後](#request-api)に受信した JSON データを逆シリアル化するために必要です。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="20-24"}

クライアントインスタンスは、サーバー[テスト](server-testing.md)で個別のクライアントインスタンスを作成する機能を持つために、`main` [モジュール関数](server-modules.md)に渡されます。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="26,101"}

### ステップ 2: OAuth プロバイダーを設定する {id="configure-oauth-provider"}

以下のコードスニペットは、`auth-oauth-google` という名前で `oauth` プロバイダーを作成および設定する方法を示しています。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="30-54"}

* `urlProvider` は、認可が完了したときに呼び出される[リダイレクトルート](#redirect-route)を指定します。
  > このルートが[**承認済みのリダイレクト URI**](#authorization-credentials)のリストに追加されていることを確認してください。
* `providerLookup` を使用すると、必要なプロバイダーの OAuth 設定を指定できます。これらの設定は [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) クラスで表現され、Ktor が OAuth サーバーに自動的にリクエストを送信できるようにします。
* `client` プロパティは、Ktor が OAuth サーバーにリクエストを送信するために使用する[HttpClient](#create-http-client) を指定します。

### ステップ 3: ログインルートを追加する {id="login-route"}

`oauth` プロバイダーを設定した後、`authenticate` 関数内に `oauth` プロバイダーの名前を受け入れる[保護されたログインルートを作成](server-auth.md#authenticate-route)する必要があります。Ktor がこのルートへのリクエストを受信すると、[providerLookup](#configure-oauth-provider) で定義された `authorizeUrl` に自動的にリダイレクトされます。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-60,76,100"}

ユーザーには、Ktor アプリケーションに必要な権限レベルを持つ認可ページが表示されます。これらの権限は、[providerLookup](#configure-oauth-provider) で指定された `defaultScopes` に依存します。

### ステップ 4: リダイレクトルートを追加する {id="redirect-route"}

ログインルートとは別に、[](#configure-oauth-provider) で指定されているように、`urlProvider` のリダイレクトルートを作成する必要があります。

このルート内で、`call.principal` 関数を使用して [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) オブジェクトを取得できます。`OAuthAccessTokenResponse` を使用すると、OAuth サーバーから返されたトークンやその他のパラメーターにアクセスできます。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-76,100"}

この例では、トークンを受信した後、次のアクションが実行されます。

* トークンは[セッション](server-sessions.md)に保存され、その内容は他のルート内からアクセスできます。
* ユーザーは、Google API へのリクエストが行われる次のルートにリダイレクトされます。
* 要求されたルートが見つからない場合、ユーザーは `/home` ルートにリダイレクトされます。

### ステップ 5: API へリクエストを送信する {id="request-api"}

[リダイレクトルート](#redirect-route)内でトークンを受信し、セッションに保存した後、このトークンを使用して外部 API にリクエストを送信できます。以下のコードスニペットは、[HttpClient](#create-http-client) を使用してそのようなリクエストを送信し、`Authorization` ヘッダーにこのトークンを送信してユーザー情報を取得する方法を示しています。

`getPersonalGreeting` という新しい関数を作成し、リクエストを行い、レスポンスボディを返すようにします。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="103-110"}

次に、`get` ルート内でこの関数を呼び出し、ユーザー情報を取得できます。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="93-99"}

完全に動作する例については、[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google) を参照してください。