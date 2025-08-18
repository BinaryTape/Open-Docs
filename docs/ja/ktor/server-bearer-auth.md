[//]: # (title: Ktorサーバーでのベアラー認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

ベアラー認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームには、ベアラー・トークンと呼ばれるセキュリティトークンが関与します。ベアラー認証スキームは[OAuth](server-oauth.md)または[JWT](server-jwt.md)の一部として使用されますが、ベアラー・トークンを認可するためのカスタムロジックを提供することもできます。

Ktorでの認証に関する一般的な情報は、[Ktorサーバーでの認証と認可](server-auth.md)のセクションで確認できます。

> ベアラー認証は[HTTPS/TLS](server-ssl.md)経由でのみ使用すべきです。

## 依存関係の追加 {id="add_dependencies"}
`bearer`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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

## ベアラー認証フロー {id="flow"}

一般的に、ベアラー認証フローは次のようになります。

1.  ユーザーが認証とアクセス認可に成功した後、サーバーはクライアントにアクセストークンを返します。
2.  クライアントは`Bearer`スキームを使用して`Authorization`ヘッダーでトークンを渡して、保護されたリソースにリクエストを行うことができます。
    ```HTTP
    GET http://localhost:8080/
    Authorization: Bearer abc123
    
    
    ```
3.  サーバーはリクエストを受信し、トークンを[検証](#configure)します。
4.  検証後、サーバーは保護されたリソースの内容を応答します。

## ベアラー認証のインストール {id="install"}
`bearer`認証プロバイダーをインストールするには、`install`ブロック内で[bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Configure bearer authentication
    }
}
```

オプションで、[指定されたルートを認証](#authenticate-route)するために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## ベアラー認証の構成 {id="configure"}

Ktorでさまざまな認証プロバイダーを構成する方法の一般的なアイデアを得るには、[認証の構成](server-auth.md#configure)を参照してください。このセクションでは、`bearer`認証プロバイダーの構成の詳細について説明します。

### ステップ1：ベアラープロバイダーの構成 {id="configure-provider"}

`bearer`認証プロバイダーは、その設定を[BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html)クラスを介して公開します。以下の例では、次の設定が指定されています。
*   `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
*   `authenticate`関数は、クライアントによって送信されたトークンをチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。

```kotlin
install(Authentication) {
    bearer("auth-bearer") {
        realm = "Access to the '/' path"
        authenticate { tokenCredential ->
            if (tokenCredential.token == "abc123") {
                UserIdPrincipal("jetbrains")
            } else {
                null
            }
        }
    }
}
```

### ステップ2：特定のリソースを保護 {id="authenticate-route"}

`bearer`プロバイダーを構成した後、**[authenticate](server-auth.md#authenticate-route)**関数を使用してアプリケーション内の特定のリソースを保護できます。認証が成功した場合、`call.principal`関数を使用してルートハンドラー内で認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
routing {
    authenticate("auth-bearer") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}