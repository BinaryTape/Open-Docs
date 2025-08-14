[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">Kotlin/Native サーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

LDAP は、ユーザーに関する情報を保存できるさまざまなディレクトリサービスと連携するためのプロトコルです。Ktor では、[Basic](server-basic-auth.md)、[Digest](server-digest-auth.md)、または[フォームベース](server-form-based-auth.md)の認証スキームを使用して LDAP ユーザーを認証できます。

> Ktor における認証と認可に関する一般的な情報は、[](server-auth.md)セクションで確認できます。

## 依存関係を追加する {id="add_dependencies"}
`LDAP` 認証を有効にするには、`ktor-server-auth` および `ktor-server-auth-ldap` アーティファクトをビルドスクリプトに含める必要があります。

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

## LDAP を設定する {id="configure"}

### ステップ 1: 認証プロバイダーを選択する {id="choose-auth"}

LDAP ユーザーを認証するには、まずユーザー名とパスワードの検証を行う認証プロバイダーを選択する必要があります。Ktor では、これに [Basic](server-basic-auth.md)、[Digest](server-digest-auth.md)、または[フォームベース](server-form-based-auth.md)のプロバイダーを使用できます。たとえば、`basic` 認証プロバイダーを使用するには、`install` ブロック内で [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 関数を呼び出します。

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

この `validate` 関数は、ユーザーの資格情報を確認するために使用されます。
 

### ステップ 2: LDAP ユーザーを認証する {id="authenticate"}

LDAP ユーザーを認証するには、[ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 関数を呼び出す必要があります。この関数は [UserPasswordCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) を受け入れ、指定された LDAP サーバーに対して検証します。

[object Promise]

この `validate` 関数は、認証が成功した場合は [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html) を返し、認証が失敗した場合は `null` を返します。

必要に応じて、認証済みユーザーに追加の検証を追加できます。

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

### ステップ 3: 特定のリソースを保護する {id="authenticate-route"}

LDAP を設定した後、**[authenticate](server-auth.md#authenticate-route)** 関数を使用して、アプリケーション内の特定のリソースを保護できます。認証が成功した場合、`call.principal` 関数を使用してルートハンドラー内で認証された [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html) を取得し、認証済みユーザーの名前を取得できます。

[object Promise]

完全な実行可能な例は、こちらで確認できます: [auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)。

> 現在の LDAP 実装は同期型であることに注意してください。