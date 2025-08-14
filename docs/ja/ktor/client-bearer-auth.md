[//]: # (title: Ktor Clientにおけるベアラー認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

ベアラー認証は、ベアラー・トークンと呼ばれるセキュリティ・トークンを使用します。例えば、これらのトークンはOAuthフローの一部として、Google、Facebook、Twitterなどの外部プロバイダーを利用してアプリケーションのユーザーを認証するために使用できます。KtorサーバーにおけるOAuthフローの仕組みは、[OAuth承認フロー](server-oauth.md#flow)セクションで確認できます。

> サーバー側では、Ktorはベアラー認証を処理するための[Authentication](server-bearer-auth.md)プラグインを提供しています。

## ベアラー認証の設定 {id="configure"}

Ktorクライアントでは、`Bearer`スキームを使用して`Authorization`ヘッダーで送信されるトークンを設定できます。また、古いトークンが無効になった場合にトークンを更新するロジックを指定することもできます。`bearer`プロバイダーを設定するには、以下の手順に従ってください。

1. `install`ブロック内で`bearer`関数を呼び出します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // Configure bearer authentication
          }
       }
   }
   ```
   
2. `loadTokens`コールバックを使用して、初期のアクセストークンとリフレッシュトークンを取得する方法を設定します。このコールバックは、ローカルストレージからキャッシュされたトークンをロードし、それらを`BearerTokens`インスタンスとして返すことを目的としています。

   ```kotlin
   install(Auth) {
       bearer {
           loadTokens {
               // Load tokens from a local storage and return them as the 'BearerTokens' instance
               BearerTokens("abc123", "xyz111")
           }
       }
   }
   ```
   
   `abc123`アクセストークンは、`Bearer`スキームを使用して、各[リクエスト](client-requests.md)の`Authorization`ヘッダーに送信されます。
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 古いトークンが無効な場合に、`refreshTokens`を使用して新しいトークンを取得する方法を指定します。

   ```kotlin
   install(Auth) {
       bearer {
           // Load tokens ...
           refreshTokens { // this: RefreshTokensParams
               // Refresh tokens and return them as the 'BearerTokens' instance
               BearerTokens("def456", "xyz111")
           }
       }
   }
   ```
   
   このコールバックは次のように機能します。
   
   a. クライアントは無効なアクセストークンを使用して保護されたリソースにリクエストを行い、`401` (Unauthorized) レスポンスを受け取ります。
     > [複数のプロバイダー](client-auth.md#realm)がインストールされている場合、レスポンスには`WWW-Authenticate`ヘッダーが含まれるはずです。
   
   b. クライアントは新しいトークンを取得するために、`refreshTokens`を自動的に呼び出します。

   c. クライアントは今度は新しいトークンを使用して、保護されたリソースに対してもう一度自動的にリクエストを行います。

4. オプションで、`401` (Unauthorized) レスポンスを待たずに資格情報を送信する条件を指定します。例えば、指定されたホストに対してリクエストが行われたかどうかを確認できます。

   ```kotlin
   install(Auth) {
       bearer {
           // Load and refresh tokens ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

## 例: ベアラー認証を使用してGoogle APIにアクセスする {id="example-oauth-google"}

[OAuth 2.0プロトコル](https://developers.google.com/identity/protocols/oauth2)を使用して認証と認可を行うGoogle APIにアクセスするためにベアラー認証をどのように使用するかを見てみましょう。Googleのプロフィール情報を取得する[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)コンソールアプリケーションを調査します。

### クライアント認証情報の取得 {id="google-client-credentials"}
最初のステップとして、Google APIへのアクセスに必要なクライアント認証情報を取得する必要があります。
1. Googleアカウントを作成します。
2. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)を開き、`Android`アプリケーションタイプで`OAuth client ID`認証情報を作成します。このクライアントIDは、[承認グラント](#step1)を取得するために使用されます。

### OAuth承認フロー {id="oauth-flow"}

私たちのアプリケーションのOAuth承認フローは以下のようになります。

```Console
(1)  --> Authorization request                Resource owner
(2)  <-- Authorization grant (code)           Resource owner
(3)  --> Authorization grant (code)           Authorization server
(4)  <-- Access and refresh tokens            Authorization server
(5)  --> Request with valid token             Resource server
(6)  <-- Protected resource                   Resource server
⌛⌛⌛    Token expired
(7)  --> Request with expired token           Resource server
(8)  <-- 401 Unauthorized response            Resource server
(9)  --> Authorization grant (refresh token)  Authorization server
(10) <-- Access and refresh tokens            Authorization server
(11) --> Request with new token               Resource server
(12) <-- Protected resource                   Resource server
```
{disable-links="false"}

各ステップがどのように実装され、`Bearer`認証プロバイダーがAPIへのアクセスにどのように役立つかを調べてみましょう。

### (1) -> 承認リクエスト {id="step1"}

最初のステップとして、必要な権限をリクエストするために使用される承認リンクを構築する必要があります。これを行うには、指定されたクエリパラメータをURLに追加する必要があります。

[object Promise]

- `client_id`: [以前取得した](#google-client-credentials)クライアントIDは、Google APIにアクセスするために使用されます。
- `scope`: Ktorアプリケーションに必要なリソースのスコープ。この場合、アプリケーションはユーザーのプロフィールに関する情報を要求します。
- `response_type`: アクセストークンを取得するために使用されるグラントタイプ。この場合、承認コードを取得する必要があります。
- `redirect_uri`: `http://127.0.0.1:8080`の値は、承認コードを取得するために_ループバックIPアドレス_フローが使用されることを示します。
   > このURLを使用して承認コードを受信するには、アプリケーションがローカルWebサーバーでリッスンしている必要があります。
   > 例えば、[Ktorサーバー](server-create-and-configure.topic)を使用して、クエリパラメータとして承認コードを取得できます。
- `access_type`: コンソールアプリケーションはユーザーがブラウザにいないときにアクセストークンを更新する必要があるため、アクセスタイプは`offline`に設定されます。

### (2) <- 承認グラント (コード) {id="step2"}

このステップでは、ブラウザから承認コードをコピーし、コンソールに貼り付けて変数に保存します。

[object Promise]

### (3) -> 承認グラント (コード) {id="step3"}

これで、承認コードをトークンと交換する準備ができました。これを行うには、クライアントを作成し、`json`シリアライザーとともに[ContentNegotiation](client-serialization.md)プラグインをインストールする必要があります。このシリアライザーは、Google OAuthトークンエンドポイントから受信したトークンをデシリアライズするために必要です。

[object Promise]

作成したクライアントを使用して、承認コードやその他の必要なオプションを[フォームパラメータ](client-requests.md#form_parameters)としてトークンエンドポイントに安全に渡すことができます。

[object Promise]

その結果、トークンエンドポイントはJSONオブジェクトでトークンを送信し、インストールされた`json`シリアライザーを使用して`TokenInfo`クラスインスタンスにデシリアライズされます。`TokenInfo`クラスは次のようになります。

[object Promise]

### (4) <- アクセスおよびリフレッシュトークン {id="step4"}

トークンが受信されると、それらをストレージに保存できます。この例では、ストレージは`BearerTokens`インスタンスのミュータブルリストです。これは、その要素を`loadTokens`および`refreshTokens`コールバックに渡せることを意味します。

[object Promise]

> `bearerTokenStorage`はクライアント構成内で使用されるため、[クライアントの初期化](#step3)の前に作成する必要があることに注意してください。

### (5) -> 有効なトークンでのリクエスト {id="step5"}

これで有効なトークンができたので、保護されたGoogle APIにリクエストを行い、ユーザーに関する情報を取得できます。まず、クライアントの[構成](#step3)を調整する必要があります。

[object Promise]

以下の設定が指定されています。

- 既にインストールされている[ContentNegotiation](client-serialization.md)プラグインと`json`シリアライザーは、リソースサーバーから受信したユーザー情報をJSON形式でデシリアライズするために必要です。

- `bearer`プロバイダーを使用する[Auth](client-auth.md)プラグインは次のように構成されます。
   * `loadTokens`コールバックは、[ストレージ](#step4)からトークンをロードします。
   * `sendWithoutRequest`コールバックは、保護されたリソースへのアクセスを提供するホストにのみ、`401` (Unauthorized) レスポンスを待たずに資格情報を送信するように設定されます。

このクライアントは、保護されたリソースにリクエストを行うために使用できます。

[object Promise]

### (6) <- 保護されたリソース {id="step6"}

リソースサーバーは、ユーザーに関する情報をJSON形式で返します。レスポンスを`UserInfo`クラスインスタンスにデシリアライズし、パーソナルな挨拶を表示できます。

[object Promise]

`UserInfo`クラスは次のようになります。

[object Promise]

### (7) -> 期限切れトークンでのリクエスト {id="step7"}

ある時点で、クライアントは[ステップ5](#step5)と同様のリクエストを行いますが、期限切れのアクセストークンを使用します。

### (8) <- 401 Unauthorized レスポンス {id="step8"}

リソースサーバーは`401` unauthorizedレスポンスを返すため、クライアントは`refreshTokens`コールバックを呼び出す必要があります。
> `401`レスポンスはエラー詳細を含むJSONデータを返すため、レスポンスを受信する際に[このケース](#step12)を処理する必要があることに注意してください。

### (9) -> 承認グラント (リフレッシュトークン) {id="step9"}

新しいアクセストークンを取得するには、`refreshTokens`を設定し、トークンエンドポイントに別のリクエストを行う必要があります。今回は、`authorization_code`の代わりに`refresh_token`グラントタイプを使用します。

[object Promise]

`refreshTokens`コールバックはレシーバーとして`RefreshTokensParams`を使用し、以下の設定にアクセスできることに注意してください。
- `client`インスタンス。上記のコードスニペットでは、フォームパラメータを送信するためにこれを使用します。
- `oldTokens`プロパティは、リフレッシュトークンにアクセスし、トークンエンドポイントに送信するために使用されます。

> `HttpRequestBuilder`によって公開される`markAsRefreshTokenRequest`関数は、リフレッシュトークンを取得するために使用されるリクエストの特別な処理を可能にします。

### (10) <- アクセスおよびリフレッシュトークン {id="step10"}

新しいトークンを受信したら、それらを[ストレージ](#step4)に保存できるため、`refreshTokens`は次のようになります。

[object Promise]

### (11) -> 新しいトークンでのリクエスト {id="step11"}

このステップでは、保護されたリソースへのリクエストには新しいトークンが含まれており、問題なく動作するはずです。

[object Promise]

### (12) <-- 保護されたリソース {id="step12"}

[401レスポンス](#step8)がエラー詳細を含むJSONデータを返すことを考慮すると、エラー情報を`ErrorInfo`オブジェクトとして受け取るようにサンプルを更新する必要があります。

[object Promise]

`ErrorInfo`クラスは次のようになります。

[object Promise]

完全な例はこちらで確認できます: [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。