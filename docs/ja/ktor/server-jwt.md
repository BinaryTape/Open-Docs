[//]: # (title: JSON Web Token)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name%プラグインを使用すると、Json Web Token を使用してクライアントを認証できます。
</link-summary>

[JSON Web Token (JWT)](https://jwt.io/) は、情報を当事者間でJSONオブジェクトとして安全に送信する方法を定義するオープン標準です。この情報は、共有シークレット（`HS256`アルゴリズムを使用）または公開鍵/秘密鍵ペア（例えば、`RS256`）を使用して署名されているため、検証および信頼することができます。

Ktorは、`Authorization`ヘッダーで`Bearer`スキームを使用して渡されるJWTを処理し、以下を可能にします。
* JSON Web Tokenの署名を検証する。
* JWTペイロードに対して追加の検証を実行する。

> Ktorにおける認証と認可に関する一般情報は、[](server-auth.md)セクションで確認できます。

## 依存関係を追加 {id="add_dependencies"}
`JWT`認証を有効にするには、ビルドスクリプトに`ktor-server-auth`と`ktor-server-auth-jwt`アーティファクトを含める必要があります。

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="Sample">
            implementation("io.ktor:ktor-server-auth:$ktor_version")
            implementation("io.ktor:ktor-server-auth-jwt:$ktor_version")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="Sample">
            implementation "io.ktor:ktor-server-auth:$ktor_version"
            implementation "io.ktor:ktor-server-auth-jwt:$ktor_version"
        </code-block>
    </tab>
    <tab title="Maven" group-key="maven">
        <code-block lang="XML" title="Sample">
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-jvm&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-jwt-jvm&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
        </code-block>
   </tab>
</tabs>

## JWT認可フロー {id="flow"}
KtorにおけるJWT認可フローは以下のようになります。
1. クライアントは、サーバーアプリケーションの特定の認証[ルート](server-routing.md)に対して、認証情報を含む`POST`リクエストを行います。以下の例は、JSONで認証情報が渡される[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)の`POST`リクエストを示しています。
   ```HTTP
   ```
   {src="snippets/auth-jwt-hs256/requests.http" include-lines="2-8"}
2. 認証情報が有効な場合、サーバーはJSON Web Tokenを生成し、指定されたアルゴリズムで署名します。例えば、特定の共有シークレットを持つ`HS256`や、公開鍵/秘密鍵ペアを持つ`RS256`などです。
3. サーバーは生成されたJWTをクライアントに送信します。
4. クライアントは、`Authorization`ヘッダーで`Bearer`スキームを使用してJSON Web Tokenを渡し、保護されたリソースへのリクエストを行えるようになります。
   ```HTTP
   ```
   {src="snippets/auth-jwt-hs256/requests.http" include-lines="13-14"}
5. サーバーはリクエストを受信し、以下の検証を実行します。
   * トークンの署名を検証します。[検証方法](#configure-verifier)は、トークンの署名に使用されたアルゴリズムによって異なります。
   * JWTペイロードに対して[追加の検証](#validate-payload)を実行します。
6. 検証後、サーバーは保護されたリソースの内容で応答します。

## JWTのインストール {id="install"}
`jwt`認証プロバイダーをインストールするには、`install`ブロック内で[jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // Configure jwt authentication
    }
}
```
オプションで、[指定されたルートを認証](#authenticate-route)するために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## JWTの設定 {id="configure-jwt"}
このセクションでは、サーバーKtorアプリケーションでJSON Web Tokenを使用する方法を説明します。トークンの検証方法が若干異なるため、トークンに署名する2つのアプローチを示します。
* 指定された共有シークレットを伴う`HS256`の使用。
* 公開鍵/秘密鍵ペアを伴う`RS256`の使用。

完全なプロジェクトはこちらで確認できます: [auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)、[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### ステップ1: JWT設定の構成 {id="jwt-settings"}

JWT関連の設定を構成するには、[設定ファイル](server-configuration-file.topic)にカスタムの`jwt`グループを作成できます。例えば、`application.conf`ファイルは以下のようになります。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```
```
{style="block" src="snippets/auth-jwt-hs256/src/main/resources/application-custom.conf" include-lines="11-16"}

</tab>
<tab title="RS256" group-key="rs256">

```
```
{style="block" src="snippets/auth-jwt-rs256/src/main/resources/application.conf" include-lines="11-16"}

</tab>
</tabs>

> シークレット情報は設定ファイルに平文で保存すべきではありません。[環境変数](server-configuration-file.topic#environment-variables)を使用してこのようなパラメータを指定することを検討してください。
>
{type="warning"}

これらの設定には、以下の方法で[コードからアクセス](server-configuration-file.topic#read-configuration-in-code)できます。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="24-27"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="31-34"}

</tab>
</tabs>

### ステップ2: トークンの生成 {id="generate"}

JSON Web Tokenを生成するには、[JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)を使用できます。以下のコードスニペットは、`HS256`と`RS256`の両方のアルゴリズムでこれを行う方法を示しています。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="50-61"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="58-72"}

</tab>
</tabs>

1. `post("/login")`は、`POST`リクエストを受信するための認証[ルート](server-routing.md)を定義します。
2. `call.receive<User>()`は、JSONオブジェクトとして送信されたユーザー認証情報を[受信し](server-serialization.md#receive_data)、それを`User`クラスオブジェクトに変換します。
3. `JWT.create()`は、指定されたJWT設定でトークンを生成し、受信したユーザー名を含むカスタムクレームを追加し、指定されたアルゴリズムでトークンに署名します。
   * `HS256`の場合、共有シークレットがトークンに署名するために使用されます。
   * `RS256`の場合、公開鍵/秘密鍵ペアが使用されます。
4. `call.respond`は、トークンをJSONオブジェクトとしてクライアントに[送信します](server-serialization.md#send_data)。

### ステップ3: realmの構成 {id="realm"}
`realm`プロパティは、[保護されたルート](#authenticate-route)にアクセスする際に`WWW-Authenticate`ヘッダーに渡すrealmを設定できます。

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="27-30,46-47"}

### ステップ4: トークン検証器の構成 {id="configure-verifier"}

`verifier`関数は、トークンの形式とその署名を検証できます。
* `HS256`の場合、トークンを検証するために[JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html)インスタンスを渡す必要があります。
* `RS256`の場合、トークンを検証するために使用される公開鍵にアクセスするためのJWKSエンドポイントを指定する[JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)を渡す必要があります。このケースでは、発行者は`http://0.0.0.0:8080`であるため、JWKSエンドポイントのアドレスは`http://0.0.0.0:8080/.well-known/jwks.json`になります。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="24-35,46-47"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="32-44,55-56"}

</tab>
</tabs>

### ステップ5: JWTペイロードの検証 {id="validate-payload"}

1. `validate`関数は、JWTペイロードに対して追加の検証を実行できます。[JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)オブジェクトを表し、JWTペイロードを含む`credential`パラメータを確認します。以下の例では、カスタム`username`クレームの値がチェックされます。
   ```kotlin
   ```
   {style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="28-29,36-42,46-47"}
   
   認証が成功した場合は、[JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を返します。
2. `challenge`関数は、認証が失敗した場合に送信される応答を設定できます。
   ```kotlin
   ```
   {style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="28-29,43-47"}

### ステップ6: 特定のリソースの保護 {id="authenticate-route"}

`jwt`プロバイダーを設定した後、**[authenticate](server-auth.md#authenticate-route)**関数を使用してアプリケーションの特定のリソースを保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を取得し、JWTペイロードを取得できます。以下の例では、カスタム`username`クレームの値とトークンの有効期限が取得されます。

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="49,63-71"}