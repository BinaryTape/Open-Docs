[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

LDAPは、ユーザーに関する情報を保存できるさまざまなディレクトリサービスを操作するためのプロトコルです。Ktorでは、[基本認証](server-basic-auth.md)、[ダイジェスト認証](server-digest-auth.md)、または[フォームベース認証](server-form-based-auth.md)のスキームを使用して、LDAPユーザーを認証できます。

> Ktorでの認証と認可に関する一般的な情報は、[](server-auth.md)セクションで確認できます。

## 依存関係を追加する {id="add_dependencies"}
`LDAP`認証を有効にするには、ビルドスクリプトに`ktor-server-auth`および`ktor-server-auth-ldap`アーティファクトを含める必要があります。

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="Sample">
            implementation("io.ktor:ktor-server-auth:$ktor_version")
            implementation("io.ktor:ktor-server-auth-ldap:$ktor_version")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="Sample">
            implementation "io.ktor:ktor-server-auth:$ktor_version"
            implementation "io.ktor:ktor-server-auth-ldap:$ktor_version"
        </code-block>
    </tab>
    <tab title="Maven" group-key="maven">
        <code-block lang="XML" title="Sample">
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-ldap&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
        </code-block>
   </tab>
</tabs>

## LDAPを構成する {id="configure"}

### ステップ1: 認証プロバイダーを選択する {id="choose-auth"}

LDAPユーザーを認証するには、まずユーザー名とパスワードの検証のための認証プロバイダーを選択する必要があります。Ktorでは、これに[基本認証](server-basic-auth.md)、[ダイジェスト認証](server-digest-auth.md)、または[フォームベース認証](server-form-based-auth.md)プロバイダーを使用できます。例えば、`basic`認証プロバイダーを使用するには、`install`ブロック内で[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.ldap.*
//...
install(Authentication) {
    basic {
        validate { credentials ->
            // Authenticate an LDAP user
        }
    }
}
```

`validate`関数はユーザーの資格情報をチェックするために使用されます。
 

### ステップ2: LDAPユーザーを認証する {id="authenticate"}

LDAPユーザーを認証するには、[ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html)関数を呼び出す必要があります。この関数は[UserPasswordCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)を受け入れ、指定されたLDAPサーバーに対して検証します。

```kotlin
```
{src="snippets/auth-ldap/src/main/kotlin/com/example/Application.kt" include-lines="10-16"}

`validate`関数は、認証が成功した場合は[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を返し、認証が失敗した場合は`null`を返します。

オプションとして、認証されたユーザーに対して追加の検証を追加できます。

```kotlin
install(Authentication) {
    basic("auth-ldap") {
        validate { credentials ->
            ldapAuthenticate(credentials, "ldap://localhost:389", "cn=%s,dc=ktor,dc=io") {
                if (it.name == it.password) {
                    UserIdPrincipal(it.name)
                } else {
                    null
                }
            }
        }
    }
}
```

### ステップ3: 特定のリソースを保護する {id="authenticate-route"}

LDAPを構成した後、アプリケーション内の特定のリソースを**[authenticate](server-auth.md#authenticate-route)**関数を使用して保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
```
{src="snippets/auth-ldap/src/main/kotlin/com/example/Application.kt" include-lines="17-23"}

完全な実行可能例は[auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)で確認できます。

> 現在のLDAP実装は同期であることにご留意ください。