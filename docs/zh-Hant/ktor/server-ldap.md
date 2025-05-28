[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

LDAP 是一種用於處理各種目錄服務 (directory services) 的協定 (protocol)，這些服務可以儲存使用者資訊。Ktor 允許您使用 [基本 (basic)](server-basic-auth.md)、[摘要 (digest)](server-digest-auth.md) 或 [表單式 (form-based)](server-form-based-auth.md) 驗證方案來驗證 LDAP 使用者。

> 您可以在 [](server-auth.md) 章節中取得關於 Ktor 驗證與授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `LDAP` 驗證，您需要在建置腳本中引入 `ktor-server-auth` 和 `ktor-server-auth-ldap` 函式庫：

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="範例">
            implementation("io.ktor:ktor-server-auth:$ktor_version")
            implementation("io.ktor:ktor-server-auth-ldap:$ktor_version")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="範例">
            implementation "io.ktor:ktor-server-auth:$ktor_version"
            implementation "io.ktor:ktor-server-auth-ldap:$ktor_version"
        </code-block>
    </tab>
    <tab title="Maven" group-key="maven">
        <code-block lang="XML" title="範例">
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

## 配置 LDAP {id="configure"}

### 步驟 1: 選擇驗證提供者 {id="choose-auth"}

若要驗證 LDAP 使用者，您首先需要為使用者名稱和密碼驗證選擇一個驗證提供者。在 Ktor 中，可以使用 [基本 (basic)](server-basic-auth.md)、[摘要 (digest)](server-digest-auth.md) 或 [表單式 (form-based)](server-form-based-auth.md) 提供者來實現此目的。例如，若要使用 `basic` 驗證提供者，請在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函數。

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

此 `validate` 函數將用於檢查使用者憑證。
 

### 步驟 2: 驗證 LDAP 使用者 {id="authenticate"}

若要驗證 LDAP 使用者，您需要呼叫 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函數。此函數接受 [UserPasswordCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 並根據指定的 LDAP 伺服器進行驗證。

```kotlin
```
{src="snippets/auth-ldap/src/main/kotlin/com/example/Application.kt" include-lines="10-16"}

在驗證成功的情況下，`validate` 函數會回傳一個 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)；若驗證失敗，則回傳 `null`。

您可選地為已驗證的使用者新增額外驗證。

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

配置 LDAP 後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數來保護應用程式中的特定資源。在驗證成功的情況下，您可以在路由處理器內部使用 `call.principal` 函數取得已驗證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已驗證的使用者名稱。

```kotlin
```
{src="snippets/auth-ldap/src/main/kotlin/com/example/Application.kt" include-lines="17-23"}

您可以在此處找到完整的可執行範例：[auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)。

> 請記住，目前的 LDAP 實作是同步的。