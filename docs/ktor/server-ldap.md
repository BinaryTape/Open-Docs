[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links> 支持</b>: ✖️
    </p>
    
</tldr>

LDAP 是一种用于与各种目录服务交互的协议，这些服务可以存储有关用户的信息。Ktor 允许你使用 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form-based](server-form-based-auth.md) 认证方案来认证 LDAP 用户。

> 你可以在 [](server-auth.md) 章节中获取有关 Ktor 认证和授权的一般信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `LDAP` 认证，你需要在构建脚本中包含 `ktor-server-auth` 和 `ktor-server-auth-ldap` 构件：

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

### 步骤 1: 选择认证提供者 {id="choose-auth"}

要认证 LDAP 用户，你首先需要选择一个用于用户名和密码验证的认证提供者。在 Ktor 中，可以使用 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form-based](server-form-based-auth.md) 提供者。例如，要使用 `basic` 认证提供者，请在 `install` 代码块内调用 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函数。

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

`validate` 函数将用于检测用户凭据。
 

### 步骤 2: 认证 LDAP 用户 {id="authenticate"}

要认证 LDAP 用户，你需要调用 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函数。此函数接受 [UserPasswordCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 并对其与指定的 LDAP 服务器进行验证。

[object Promise]

`validate` 函数在认证成功时返回一个 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，如果认证失败则返回 `null`。

（可选地）你可以为已认证用户添加额外的验证。

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

### 步骤 3: 保护特定资源 {id="authenticate-route"}

配置 LDAP 后，你可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数来保护应用程序中的特定资源。在认证成功的情况下，你可以在路由处理程序内部使用 `call.principal` 函数检索已认证的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，并获取已认证用户的名称。

[object Promise]

你可以在此处找到完整的可运行示例：[auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap)。

> 请注意，当前的 LDAP 实现是同步的。