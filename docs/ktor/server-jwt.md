[//]: # (title: JSON Web 令牌)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name% 插件允许您使用 JSON Web 令牌对客户端进行身份验证。
</link-summary>

[JSON Web 令牌 (JWT)](https://jwt.io/) 是一种开放标准，它定义了一种将信息作为 JSON 对象在各方之间安全传输的方式。由于这些信息使用共享密钥（通过 `HS256` 算法）或公钥/私钥对（例如 `RS256`）进行签名，因此可以对其进行验证和信任。

Ktor 使用 `Bearer` 方案处理 `Authorization` 头中传递的 JWT，并允许您：
* 验证 JSON web 令牌的签名；
* 对 JWT 有效载荷执行额外验证。

> 您可以在 [](server-auth.md) 章节中获取有关 Ktor 中身份验证和授权的通用信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `JWT` 身份验证，您需要将 `ktor-server-auth` 和 `ktor-server-auth-jwt` 构件包含到构建脚本中：

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="示例">
            implementation("io.ktor:ktor-server-auth:$ktor_version")
            implementation("io.ktor:ktor-server-auth-jwt:$ktor_version")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="示例">
            implementation "io.ktor:ktor-server-auth:$ktor_version"
            implementation "io.ktor:ktor-server-auth-jwt:$ktor_version"
        </code-block>
    </tab>
    <tab title="Maven" group-key="maven">
        <code-block lang="XML" title="示例">
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-jvm&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-jwt-jvm&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
        </code-block>
   </tab>
</tabs>

## JWT 授权流程 {id="flow"}
Ktor 中的 JWT 授权流程可能如下所示：
1. 客户端向服务器应用程序中的特定身份验证[路由](server-routing.md)发起包含凭据的 `POST` 请求。以下示例展示了一个 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 请求，其中凭据以 JSON 格式传递：
   ```HTTP
   ```
   {src="snippets/auth-jwt-hs256/requests.http" include-lines="2-8"}
2. 如果凭据有效，服务器将生成一个 JSON web 令牌并使用指定的算法对其进行签名。例如，这可能是使用特定共享密钥的 `HS256` 或使用公钥/私钥对的 `RS256`。
3. 服务器将生成的 JWT 发送给客户端。
4. 客户端现在可以使用 `Bearer` 方案，将 JSON web 令牌传递到 `Authorization` 头中，向受保护资源发起请求。
   ```HTTP
   ```
   {src="snippets/auth-jwt-hs256/requests.http" include-lines="13-14"}
5. 服务器接收请求并执行以下验证：
   * 验证令牌的签名。请注意，[验证方式](#configure-verifier)取决于用于签署令牌的算法。
   * 对 JWT 有效载荷执行[额外验证](#validate-payload)。
6. 验证后，服务器响应受保护资源的内容。

## 安装 JWT {id="install"}
要安装 `jwt` 身份验证提供程序，请在 `install` 块中调用 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // Configure jwt authentication
    }
}
```
您可以选择指定一个[提供程序名称](server-auth.md#provider-name)，该名称可用于[认证指定路由](#authenticate-route)。

## 配置 JWT {id="configure-jwt"}
在本节中，我们将了解如何在 Ktor 服务器应用程序中使用 JSON web 令牌。我们将演示两种签署令牌的方法，因为它们需要略微不同的令牌验证方式：
* 使用 `HS256` 和指定的共享密钥。
* 使用 `RS256` 和公钥/私钥对。

您可以在这里找到完整的项目：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)，[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### 步骤 1：配置 JWT 设置 {id="jwt-settings"}

要配置 JWT 相关设置，您可以在[配置文件](server-configuration-file.topic)中创建一个自定义 `jwt` 组。例如，`application.conf` 文件可能如下所示：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```
```
{style="block" src="snippets/auth-jwt-hs256/src/main/resources/application-custom.conf" include-lines="11-16"}

</tab>
<tab title="RS256" group-key="rs256">

```
```
{style="block" src="snippets/auth-jwt-rs256/src/main/resources/application.conf" include-lines="11-16"}

</tab>
</tabs>

> 请注意，秘密信息不应以纯文本形式存储在配置文件中。考虑使用[环境变量](server-configuration-file.topic#environment-variables)来指定此类参数。
>
{type="warning"}

您可以通过以下方式[在代码中访问这些设置](server-configuration-file.topic#read-configuration-in-code)：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="24-27"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="31-34"}

</tab>
</tabs>

### 步骤 2：生成令牌 {id="generate"}

要生成 JSON web 令牌，您可以使用 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)。下面的代码片段展示了如何为 `HS256` 和 `RS256` 算法执行此操作：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="50-61"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="58-72"}

</tab>
</tabs>

1. `post("/login")` 定义了一个用于接收 `POST` 请求的身份验证[路由](server-routing.md)。
2. `call.receive<User>()` [接收](server-serialization.md#receive_data) 作为 JSON 对象发送的用户凭据，并将其转换为 `User` 类对象。
3. `JWT.create()` 使用指定的 JWT 设置生成令牌，添加一个包含接收到的用户名的自定义声明 (claim)，并使用指定的算法签署令牌：
   * 对于 `HS256`，使用共享密钥来签署令牌。
   * 对于 `RS256`，使用公钥/私钥对。
4. `call.respond` [将](server-serialization.md#send_data) 令牌作为 JSON 对象发送给客户端。

### 步骤 3：配置 realm {id="realm"}
`realm` 属性允许您设置在访问[受保护路由](#authenticate-route)时要在 `WWW-Authenticate` 头中传递的 realm。

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="27-30,46-47"}

### 步骤 4：配置令牌验证器 {id="configure-verifier"}

`verifier` 函数允许您验证令牌格式及其签名：
* 对于 `HS256`，您需要传递一个 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 实例来验证令牌。
* 对于 `RS256`，您需要传递 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)，它指定一个 JWKS 端点，用于访问验证令牌所使用的公钥。在我们的例子中，颁发者是 `http://0.0.0.0:8080`，因此 JWKS 端点地址将是 `http://0.0.0.0:8080/.well-known/jwks.json`。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="24-35,46-47"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="32-44,55-56"}

</tab>
</tabs>

### 步骤 5：验证 JWT 有效载荷 {id="validate-payload"}

1. `validate` 函数允许您对 JWT 有效载荷执行额外验证。检查 `credential` 参数，它表示一个 [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 对象并包含 JWT 有效载荷。在下面的示例中，检查了自定义 `username` 声明的值。
   ```kotlin
   ```
   {style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="28-29,36-42,46-47"}

   如果身份验证成功，则返回 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
2. `challenge` 函数允许您配置在身份验证失败时发送的响应。
   ```kotlin
   ```
   {style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="28-29,43-47"}

### 步骤 6：保护特定资源 {id="authenticate-route"}

配置 `jwt` 提供程序后，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数保护应用程序中的特定资源。如果身份验证成功，您可以使用 `call.principal` 函数在路由处理程序中检索已认证的 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)，并获取 JWT 有效载荷。在下面的示例中，检索了自定义 `username` 声明的值和令牌过期时间。

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="49,63-71"}