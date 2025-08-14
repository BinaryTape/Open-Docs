[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在無需額外執行階段或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

LDAP 是一種用於處理各種目錄服務的協定，這些服務可以儲存有關使用者的資訊。Ktor 允許您使用 [基本 (basic)](server-basic-auth.md)、[摘要 (digest)](server-digest-auth.md) 或 [基於表單 (form-based)](server-form-based-auth.md) 驗證方案來驗證 LDAP 使用者。

> 您可以在 [](server-auth.md) 章節中取得 Ktor 中關於驗證和授權的通用資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `LDAP` 驗證，您需要在建置腳本中包含 `ktor-server-auth` 和 `ktor-server-auth-ldap` 構件：

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

## 配置 LDAP {id="configure"}

### 步驟 1：選擇驗證提供者 {id="choose-auth"}

若要驗證 LDAP 使用者，您首先需要選擇一個用於使用者名稱和密碼驗證的驗證提供者。在 Ktor 中，可以使用 [基本 (basic)](server-basic-auth.md)、[摘要 (digest)](server-digest-auth.md) 或 [基於表單 (form-based)](server-form-based-auth.md) 提供者來實現此目的。例如，若要使用 `basic` 驗證提供者，請在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函式。

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

`validate` 函式將用於檢查使用者憑證。
 

### 步驟 2：驗證 LDAP 使用者 {id="authenticate"}

若要驗證 LDAP 使用者，您需要呼叫 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函式。此函式接受 [UserPasswordCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 並針對指定的 LDAP 伺服器進行驗證。

[object Promise]

在驗證成功的情況下，`validate` 函式會回傳一個 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，若驗證失敗則回傳 `null`。

您可以選擇為已驗證的使用者新增額外的驗證。

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

### 步驟 3：保護特定資源 {id="authenticate-route"}

配置 LDAP 後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式來保護應用程式中的特定資源。在驗證成功的情況下，您可以使用 `call.principal` 函式在路由處理程式內部檢索已驗證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已驗證使用者的名稱。

[object Promise]

您可以在此處找到完整的可執行範例：[auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)。

> 請注意，目前的 LDAP 實作是同步的。