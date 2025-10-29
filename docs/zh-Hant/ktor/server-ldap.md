[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不額外執行環境或虛擬機器下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

LDAP 是一種用於處理各種目錄服務的協定，這些服務可以儲存使用者資訊。Ktor 允許您使用 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form-based](server-form-based-auth.md) 驗證方案來驗證 LDAP 使用者。

> 您可以在 [Ktor 伺服器中的驗證與授權](server-auth.md)章節中取得關於 Ktor 中驗證和授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `LDAP` 驗證，您需要在建構指令稿 (build script) 中包含 `ktor-server-auth` 和 `ktor-server-auth-ldap` 構件 (artifact)：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="範例" code="            implementation(&quot;io.ktor:ktor-server-auth:$ktor_version&quot;)&#10;            implementation(&quot;io.ktor:ktor-server-auth-ldap:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="範例" code="            implementation &quot;io.ktor:ktor-server-auth:$ktor_version&quot;&#10;            implementation &quot;io.ktor:ktor-server-auth-ldap:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" title="範例" code="&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;&#10;&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-ldap&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;"/>
   </TabItem>
</Tabs>

## 設定 LDAP {id="configure"}

### 步驟 1: 選擇驗證提供者 {id="choose-auth"}

若要驗證 LDAP 使用者，您首先需要選擇一個用於使用者名稱和密碼驗證的驗證提供者。在 Ktor 中，[basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form-based](server-form-based-auth.md) 提供者都可以用於此目的。例如，要使用 `basic` 驗證提供者，請在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/basic.html) 函數。

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

`validate` 函數將用於檢查使用者憑證。
 

### 步驟 2: 驗證 LDAP 使用者 {id="authenticate"}

若要驗證 LDAP 使用者，您需要呼叫 [ldapAuthenticate](https://api.ktor.io/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函數。此函數接受 [UserPasswordCredential](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 並根據指定的 LDAP 伺服器進行驗證。

```kotlin
install(Authentication) {
    basic("auth-ldap") {
        validate { credentials ->
            ldapAuthenticate(credentials, "ldap://0.0.0.0:389", "cn=%s,dc=ktor,dc=io")
        }
    }
}
```

`validate` 函數在成功驗證的情況下會傳回一個 [UserIdPrincipal](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，如果驗證失敗則傳回 `null`。

您可以選擇性地為已驗證的使用者新增額外的驗證。

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

### 步驟 3: 保護特定資源 {id="authenticate-route"}

設定 LDAP 後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數來保護應用程式中的特定資源。在成功驗證的情況下，您可以使用 `call.principal` 函數在路由處理器 (route handler) 內部擷取 (retrieve) 已驗證的 [UserIdPrincipal](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已驗證使用者的名稱。

```kotlin
routing {
    authenticate("auth-ldap") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

您可以在此處找到完整的可執行範例：[auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)。

> 請注意，目前的 LDAP 實作是同步的。