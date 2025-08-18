[//]: # (title: Ktor 服务器中的基本认证)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>代码示例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">对原生服务器的支持</Links></b>: ✅
</p>
</tldr>

基本认证方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用于访问控制和认证。在此方案中，用户凭据以使用 Base64 编码的用户名/密码对形式传输。

Ktor 允许您使用基本认证来登录用户和保护特定 [路由](server-routing.md)。您可以在 [Ktor 服务器中的认证和授权](server-auth.md) 部分获取有关 Ktor 认证的通用信息。

> 鉴于基本认证以明文形式传输用户名和密码，您需要使用 [HTTPS/TLS](server-ssl.md) 来保护敏感信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `basic` 认证，您需要在构建脚本中包含 `%artifact_name%` artifact：

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

## 基本认证流程 {id="flow"}

基本认证流程如下所示：

1.  客户端向服务器应用程序中的特定 [路由](server-routing.md) 发出不带 `Authorization` 请求头的请求。
2.  服务器以 `401` (Unauthorized) 响应状态响应客户端，并使用 `WWW-Authenticate` 响应头提供信息，表明该路由受到 basic 认证方案的保护。典型的 `WWW-Authenticate` 请求头如下所示：
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   在 Ktor 中，您可以在 [配置](#configure-provider) `basic` 认证提供者时，使用相应属性指定 `realm` 和 `charset`。

3.  通常，客户端会显示一个登录对话框，用户可以在其中输入凭据。然后，客户端发出一个包含使用 Base64 编码的用户名和密码对的 `Authorization` 请求头的请求，例如：
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4.  服务器 [验证](#configure-provider) 客户端发送的凭据，并响应请求的内容。

## 安装基本认证 {id="install"}
要安装 `basic` 认证提供者，请在 `install` 代码块中调用 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // 配置基本认证
    }
}
```

您可以可选地指定一个 [提供者名称](server-auth.md#provider-name)，该名称可用于 [认证指定路由](#authenticate-route)。

## 配置基本认证 {id="configure"}

要大致了解如何在 Ktor 中配置不同的认证提供者，请参见 [配置认证](server-auth.md#configure)。在本节中，我们将看到 `basic` 认证提供者的配置细节。

### 步骤 1：配置 basic 提供者 {id="configure-provider"}

`basic` 认证提供者通过 [BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 类暴露其设置。在以下示例中，指定了以下设置：
*   `realm` 属性设置要传递给 `WWW-Authenticate` 请求头的 `realm`。
*   `validate` 函数验证用户名和密码。

```kotlin
install(Authentication) {
    basic("auth-basic") {
        realm = "Access to the '/' path"
        validate { credentials ->
            if (credentials.name == "jetbrains" && credentials.password == "foobar") {
                UserIdPrincipal(credentials.name)
            } else {
                null
            }
        }
    }
}
```
   
`validate` 函数检测 `UserPasswordCredential`，并在认证成功的情况下返回 `UserIdPrincipal`，如果认证失败则返回 `null`。
> 您还可以使用 [UserHashedTableAuth](#validate-user-hash) 来验证存储在保存用户名和密码哈希的内存表中的用户。

### 步骤 2：保护特定资源 {id="authenticate-route"}

配置 `basic` 提供者后，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数保护应用程序中的特定资源。在认证成功的情况下，您可以使用 `call.principal` 函数在路由处理程序中检索已认证的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，并获取已认证用户的名称。

```kotlin
routing {
    authenticate("auth-basic") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

## 使用 UserHashedTableAuth 进行验证 {id="validate-user-hash"}

Ktor 允许您使用 [UserHashedTableAuth](#validate-user-hash) 来 [验证](#configure-provider) 存储在保存用户名和密码哈希的内存表中的用户。如果您的数据源被泄露，这可以防止用户密码被泄露。

要使用 `UserHashedTableAuth` 验证用户，请遵循以下步骤：

1.  使用 [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html) 函数创建具有指定算法和盐提供者的摘要函数：
   
   ```kotlin
   val digestFunction = getDigestFunction("SHA-256") { "ktor${it.length}" }
   ```

2.  初始化 `UserHashedTableAuth` 的新实例并指定以下属性：
    *   使用 `table` 属性提供用户名和哈希密码表。
    *   将摘要函数分配给 `digester` 属性。
   
   ```kotlin
   val hashedUserTable = UserHashedTableAuth(
       table = mapOf(
           "jetbrains" to digestFunction("foobar"),
           "admin" to digestFunction("password")
       ),
       digester = digestFunction
   )
   ```
   
3.  在 `validate` 函数内部，调用 [UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html) 函数来认证用户，如果凭据有效则返回 `UserIdPrincipal` 的实例：

   ```kotlin
   install(Authentication) {
       basic("auth-basic-hashed") {
           realm = "Access to the '/' path"
           validate { credentials ->
               hashedUserTable.authenticate(credentials)
           }
       }
   }
   ```