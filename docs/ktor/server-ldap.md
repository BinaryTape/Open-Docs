[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

LDAP 是一种用于处理各种目录服务的协议，这些服务可以存储用户信息。Ktor 允许您使用 [基本认证](server-basic-auth.md)、[摘要认证](server-digest-auth.md) 或 [基于表单的认证](server-form-based-auth.md) 方案来认证 LDAP 用户。

> 您可以在 [](server-auth.md) 部分获取有关 Ktor 中认证和授权的通用信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `LDAP` 认证，您需要在构建脚本中包含 `ktor-server-auth` 和 `ktor-server-auth-ldap` 工件：

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="示例">
            implementation("io.ktor:ktor-server-auth:$ktor_version")
            implementation("io.ktor:ktor-server-auth-ldap:$ktor_version")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="示例">
            implementation "io.ktor:ktor-server-auth:$ktor_version"
            implementation "io.ktor:ktor-server-auth-ldap:$ktor_version"
        </code-block>
    </tab>
    <tab title="Maven" group-key="maven">
        <code-block lang="XML" title="示例">
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

### 步骤 1：选择认证提供程序 {id="choose-auth"}

要认证 LDAP 用户，您首先需要选择一个用于用户名和密码验证的认证提供程序。在 Ktor 中，[基本认证](server-basic-auth.md)、[摘要认证](server-digest-auth.md) 或 [基于表单的认证](server-form-based-auth.md) 提供程序都可以用于此目的。例如，要使用 `basic` 认证提供程序，请在 `install` 块内调用 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函数。

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

`validate` 函数将用于检查用户凭据。
 

### 步骤 2：认证 LDAP 用户 {id="authenticate"}

要认证 LDAP 用户，您需要调用 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函数。此函数接受 [UserPasswordCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 并针对指定的 LDAP 服务器进行验证。

```kotlin
```
{src="snippets/auth-ldap/src/main/kotlin/com/example/Application.kt" include-lines="10-16"}

`validate` 函数在认证成功时返回一个 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，如果认证失败则返回 `null`。

您可以选择为已认证的用户添加额外的验证。

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

### 步骤 3：保护特定资源 {id="authenticate-route"}

配置 LDAP 后，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数来保护应用程序中的特定资源。如果认证成功，您可以在路由处理程序内部使用 `call.principal` 函数检索一个已认证的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，并获取已认证用户的名称。

```kotlin
```
{src="snippets/auth-ldap/src/main/kotlin/com/example/Application.kt" include-lines="17-23"}

您可以在此处找到完整的可运行示例：[auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)。

> 请注意，当前的 LDAP 实现是同步的。