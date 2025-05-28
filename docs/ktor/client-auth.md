[//]: # (title: Ktor 客户端中的认证和授权)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 插件在您的客户端应用中处理认证和授权。
</link-summary>

Ktor 提供了 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 插件，用于在您的客户端应用中处理认证和授权。典型使用场景包括用户登录和获取特定资源访问权限。

> 在服务器端，Ktor 提供了 [Authentication](server-auth.md) 插件，用于处理认证和授权。

## 支持的认证类型 {id="supported"}

HTTP 提供了一个 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用于访问控制和认证。Ktor 客户端允许您使用以下 HTTP 认证方案：

* [Basic](client-basic-auth.md) - 使用 `Base64` 编码提供用户名和密码。如果不与 HTTPS 结合使用，通常不推荐。
* [Digest](client-digest-auth.md) - 一种认证方法，通过对用户名和密码应用哈希函数，以加密形式传输用户凭据。
* [Bearer](client-bearer-auth.md) - 一种涉及称为不记名令牌 (bearer tokens) 的安全令牌的认证方案。例如，您可以将此方案作为 OAuth 流程的一部分，通过使用外部提供商（如 Google、Facebook、Twitter 等）来授权您的应用程序用户。

## 添加依赖 {id="add_dependencies"}

要启用认证，您需要在构建脚本中包含 `ktor-client-auth` 工件：

<var name="artifact_name" value="ktor-client-auth"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安装 Auth {id="install_plugin"}
要安装 `Auth` 插件，请在 [客户端配置块](client-create-and-configure.md#configure-client) 内部将其传递给 `install` 函数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // 配置认证
    }
}
```
现在您可以 [配置](#configure_authentication) 所需的认证提供者 (authentication provider)。

## 配置认证 {id="configure_authentication"}

### 步骤 1: 选择一个认证提供者 (authentication provider) {id="choose-provider"}

要使用特定的认证提供者 ([basic](client-basic-auth.md)、[digest](client-digest-auth.md) 或 [bearer](client-bearer-auth.md))，您需要在 `install` 块内部调用相应的函数。例如，要使用 `basic` 认证，请调用 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函数：

```kotlin
install(Auth) {
    basic {
        // 配置 basic 认证
    }
}
```
在该块内部，您可以配置此提供者特有的设置。

### 步骤 2: (可选) 配置 realm {id="realm"}

可选地，您可以使用 `realm` 属性来配置 realm：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

您可以创建多个具有不同 realm 的提供者，以访问不同的资源：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
    basic {
        realm = "Access to the '/admin' path"
        // ...
    }
}
```

在这种情况下，客户端会根据 `WWW-Authenticate` 响应头选择必要的提供者，该头部包含 realm。

### 步骤 3: 配置提供者 {id="configure-provider"}

要了解如何为特定的 [提供者](#supported) 配置设置，请参阅相应的主题：
* [](client-basic-auth.md)
* [](client-digest-auth.md)
* [](client-bearer-auth.md)