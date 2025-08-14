[//]: # (title: Ktor Client 中的认证与授权)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 插件处理客户端应用程序中的认证与授权。
</link-summary>

Ktor 提供 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 插件，用于处理客户端应用程序中的认证与授权。典型用例场景包括用户登录和获取特定资源访问权限。

> 在服务端，Ktor 提供 [Authentication](server-auth.md) 插件来处理认证与授权。

## 支持的认证类型 {id="supported"}

HTTP 提供一个 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用于访问控制和认证。Ktor 客户端允许您使用以下 HTTP 认证方案：

*   [Basic](client-basic-auth.md) - 使用 `Base64` 编码提供用户名和密码。通常不推荐单独使用，除非与 HTTPS 结合。
*   [Digest](client-digest-auth.md) - 一种认证方法，通过对用户名和密码应用哈希函数，以加密形式传输用户凭据。
*   [Bearer](client-bearer-auth.md) - 一种认证方案，涉及名为 bearer 令牌的安全令牌。例如，您可以将此方案作为 OAuth 流程的一部分，通过使用外部提供者（例如 Google、Facebook、Twitter 等）来授权应用程序的用户。

## 添加依赖项 {id="add_dependencies"}

要启用认证，您需要在构建脚本中包含 `ktor-client-auth` artifact：

<var name="artifact_name" value="ktor-client-auth"/>

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
    

    <p>
        您可以从<Links href="/ktor/client-dependencies" summary="了解如何向现有项目添加客户端依赖项。">添加客户端依赖项</Links>了解有关 Ktor 客户端所需 artifact 的更多信息。
    </p>
    

## 安装 Auth {id="install_plugin"}
要安装 `Auth` 插件，请将其传递给 [客户端配置代码块](client-create-and-configure.md#configure-client) 中的 `install` 函数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // Configure authentication
    }
}
```
现在您可以[配置](#configure_authentication)所需的认证提供者。

## 配置认证 {id="configure_authentication"}

### 步骤 1：选择认证提供者 {id="choose-provider"}

要使用特定的认证提供者（[basic](client-basic-auth.md)、[digest](client-digest-auth.md) 或 [bearer](client-bearer-auth.md)），您需要在 `install` 代码块中调用相应的函数。例如，要使用 `basic` 认证，请调用 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函数：

```kotlin
install(Auth) {
    basic {
        // Configure basic authentication
    }
}
```
在该代码块内，您可以配置此提供者特有的设置。

### 步骤 2：（可选）配置 realm {id="realm"}

（可选）您可以使用 `realm` 属性配置 realm：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

您可以创建多个具有不同 realm 的提供者来访问不同资源：

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

在这种情况下，客户端根据包含 realm 的 `WWW-Authenticate` 响应头选择必要的提供者。

### 步骤 3：配置提供者 {id="configure-provider"}

要了解如何配置特定[提供者](#supported)的设置，请参见相应的专题：
*   [](client-basic-auth.md)
*   [](client-digest-auth.md)
*   [](client-bearer-auth.md)