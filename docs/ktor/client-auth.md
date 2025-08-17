[//]: # (title: Ktor 客户端中的认证与授权)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 插件用于处理客户端应用程序中的认证与授权。
</link-summary>

Ktor 提供了 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 插件，用于处理客户端应用程序中的认证与授权。典型的用法场景包括用户登录和获取特定资源的访问权限。

> 在服务器端，Ktor 提供了 [Authentication](server-auth.md) 插件用于处理认证与授权。

## 支持的认证类型 {id="supported"}

HTTP 提供了用于 [访问控制与认证的通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)。Ktor 客户端允许你使用以下 HTTP 认证方案：

* [Basic](client-basic-auth.md) - 使用 `Base64` 编码来提供用户名和密码。除非与 HTTPS 结合使用，否则通常不推荐。
* [Digest](client-digest-auth.md) - 一种认证方法，通过对用户名和密码应用散列函数，以加密形式传输用户凭据。
* [Bearer](client-bearer-auth.md) - 一种认证方案，涉及称为持有者令牌的**安全令牌**。例如，你可以将此方案作为 OAuth 流程的一部分，通过使用 Google、Facebook、Twitter 等外部提供者来授权应用程序用户。

## 添加依赖项 {id="add_dependencies"}

要启用认证，你需要在构建脚本中包含 `ktor-client-auth` artifact：

<var name="artifact_name" value="ktor-client-auth"/>
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
<p>
    你可以从 <Links href="/ktor/client-dependencies" summary="了解如何向现有项目添加客户端依赖项。">添加客户端依赖项</Links> 中了解更多关于 Ktor 客户端所需的 artifact。
</p>

## 安装 Auth {id="install_plugin"}
要安装 `Auth` 插件，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 中的 `install` 函数：

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
现在你可以[配置](#configure_authentication)所需的认证提供者。

## 配置认证 {id="configure_authentication"}

### 步骤 1：选择认证提供者 {id="choose-provider"}

要使用特定的认证提供者（[Basic](client-basic-auth.md)、[Digest](client-digest-auth.md) 或 [Bearer](client-bearer-auth.md)），你需要调用 `install` 代码块内相应的函数。例如，要使用 `basic` 认证，请调用 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函数：

```kotlin
install(Auth) {
    basic {
        // 配置 Basic 认证
    }
}
```
在该代码块内，你可以配置此提供者特有的设置。

### 步骤 2：（可选）配置域 {id="realm"}

可选地，你可以使用 `realm` 属性来配置域：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

你可以创建多个具有不同域的提供者，以访问不同的资源：

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

在这种情况下，客户端会根据 `WWW-Authenticate` 响应标头选择必要的提供者，该标头中包含域信息。

### 步骤 3：配置提供者 {id="configure-provider"}

要了解如何配置特定[提供者](#supported)的设置，请参阅相应的专题：
* [Ktor 客户端中的 Basic 认证](client-basic-auth.md)
* [Ktor 客户端中的 Digest 认证](client-digest-auth.md)
* [Ktor 客户端中的 Bearer 认证](client-bearer-auth.md)