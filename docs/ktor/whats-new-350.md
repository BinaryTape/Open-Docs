[//]: # (title: Ktor 3.5.0 最新变化)

<show-structure for="chapter,procedure" depth="2"/>

_[发布日期：2026 年 5 月 15 日](releases.md#release-details)_

Ktor 3.5.0 在服务器和客户端方面带来了一系列改进。此功能版本的亮点包括：

* [对 RFC 7616 摘要身份验证的支持](#rfc-7616-digest-auth)
* [根配置数据类映射](#config-data-class-mapping)
* [仅在修改时发送会话 cookie](#session-cookies)
* [OkHttp 和 Apache5 客户端引擎中的自定义 DNS 解析器](#custom-dns-resolvers)

## Ktor Server

### 对 RFC 7616 摘要身份验证的支持 {id="rfc-7616-digest-auth"}

Ktor 3.5.0 更新了 [`digest` 身份验证提供程序](server-digest-auth.md)以符合 [RFC 7616](https://datatracker.ietf.org/doc/html/rfc7616)，提高了安全性并增加了对现代摘要功能的支持。

此版本引入了以下更改：

* 您现在可以使用 `algorithms` 属性配置多个哈希算法。当指定多个值时，Ktor 会发送多个 `WWW-Authenticate` 标头，以便客户端可以选择支持的最强选项。
* 引入了 `DigestAlgorithm` 和 `DigestQop` 枚举来替代基于字符串的配置。
* `digestProvider {}` lambda 现在接收一个 `algorithm` 形参，允许您动态计算正确的摘要。
* 根据 RFC 7616，`qop` 形参现在包含在身份验证质询中。
* 增加了对基于会话的算法的支持，例如 `SHA-256-sess` 和 `SHA-512-256-sess`。
* 增加了对 RFC 7616 用户名哈希 (`userhash`) 的支持，以提高隐私保护。

以下示例展示了如何从旧版配置迁移到符合 RFC 7616 标准的 API：

<compare type="left-right" first-title="旧版" second-title="RFC 7616">

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        algorithmName = "MD5"  // 已弃用的属性
        digestProvider { userName, realm ->
            // 不带 algorithm 形参的旧签名
            getMd5Digest("$userName:$realm:$password")
        }
    }
}
```

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        // 同时支持现代和旧版客户端
        algorithms = listOf(DigestAlgorithm.SHA_512_256, DigestAlgorithm.MD5)
        digestProvider { userName, realm, algorithm ->
            // 新签名接收 algorithm
            val password = getPassword(userName) ?: return@digestProvider null
            algorithm.toDigester().digest("$userName:$realm:$password".toByteArray())
        }
    }
}
```
</compare>

现有配置无需更改即可继续工作。但是，对于新应用程序，建议：

* 使用安全的算法，例如 `SHA-512-256` 或 `SHA-256`。
* 更新 `digestProvider` 以使用新的 `algorithms` 形参。
* 除非为了兼容旧版客户端，否则请避免使用基于 `MD5` 的算法。

有关完整指南，请参阅 [Ktor Server 中的摘要身份验证](server-digest-auth.md)。

### 自定义提供程序中的挂起 `.authenticate()` 重载

[自定义身份验证提供程序](server-auth.md#custom-auth-provider)现在可以实现 `DynamicProviderConfig.authenticate()` 函数的挂起版本。`.authenticate()` 函数接受一个挂起 lambda，因此您可以直接在身份验证中调用协程 API：

```kotlin
install(Authentication) {
  provider("custom") {
    authenticate { context ->
      delay(10.milliseconds)
      context.principal(null)
    }
  }
}
```

### 根配置数据类映射 {id="config-data-class-mapping"}

`ApplicationConfig` 现在提供了一个 `.getAs()` 函数，用于将整个配置反序列化为一个数据类。

以前，反序列化仅限于单个属性，需要通过 `.property()` 函数进行访问。有了根级支持，您可以直接将完整的配置结构映射到单个数据类：

<compare type="top-bottom" first-title="之前" second-title="之后">

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)

val app = ApplicationConfig("application.yaml").property("app").getAs<App>()
val security = ApplicationConfig("application.yaml").property("security").getAs<Security>()
```

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)
@Serializable data class Config(val app: App, val security: Security)

val config = ApplicationConfig("application.yaml").getAs<Config>()
```

</compare>

### 必需请求参数辅助函数

Ktor 3.5.0 引入了一组新的扩展函数，简化了从 `ApplicationCall` 访问必需请求数据的过程。

以前，验证必需的请求数据通常需要重复的 null 检查和带标签的返回。为了改进这一工作流，Ktor 现在提供了以下新的扩展函数：

* `ApplicationCall.requireQueryParameter()` —— 从请求 URL 中检索必需的查询形参。如果形参缺失则抛出异常。
* `ApplicationCall.requireHeader()` —— 检索必需的 HTTP 标头值。如果请求中不存在该标头则抛出异常。
* `ApplicationCall.requireCookie()` —— 检索必需的 cookie 值，可以选择使用指定的编码对其进行解码。如果 cookie 缺失则抛出异常。
* `RoutingCall.requirePathParameter()` —— 从路由定义中检索必需的路径形参。如果匹配的路由中不存在该形参则抛出异常。

每个函数都会返回一个非 null 值，或者在值缺失时抛出 `MissingRequestParameterException`。

<compare>

```kotlin
post("/checkout") {
  val userId = call.request.cookies["userId"]
    ?: return@post call.respondText(
      "Login required",
      status = HttpStatusCode.Forbidden
    )

  val amount = call.request.queryParameters["amount"]?.toLongOrNull()
    ?: return@post call.respondText(
     "Amount missing",
     status = HttpStatusCode.BadRequest
  )
  
  // 业务逻辑
}
```

```kotlin
post("/checkout") {
    val userId = call.requireCookie("userId")
    val amount = call.requireQueryParameter("amount").toLong()

    // 业务逻辑
}
```

</compare>

### `ktor-network` 的 ES 模块兼容性

我们修复了在启用 ES 模块时无法使用 `ktor-network` 及其所有依赖模块的问题。

为了帮助防止未来的回归，我们的 JavaScript 测试基础架构现在默认针对 ES2015 和 ES 模块。

> 有关 Kotlin/JS 模块系统和 ES2015 支持的更多信息，请参阅：
> * [JavaScript 模块](https://kotlinlang.org/docs/js-modules.html)
> * [对 ES2015 功能的支持](https://kotlinlang.org/docs/js-project-setup.html#support-for-es2015-features)
>
{style="tip"}

### 仅在修改时发送会话 cookie {id="session-cookies"}

Ktor 3.5.0 为 [Sessions](server-sessions.md) 插件引入了一个新选项，仅在会话数据发生变化时发送该数据（例如，对于基于 cookie 的会话发送 `Set-Cookie` 标头）。

默认情况下，会话数据会在每次响应时发送，以保留现有行为。若要仅在修改时发送，请在会话 cookie 配置中启用 `sendOnlyIfModified` 标志：

```kotlin
install(Sessions) {
    cookie<MySession>("SESSION") {
        sendOnlyIfModified = true
    }
}
```

## Ktor Client

### OkHttp 和 Apache5 引擎中的自定义 DNS 解析器 {id="custom-dns-resolvers"}

Ktor 3.5.0 在 OkHttp 和 Apache5 客户端引擎中增加了对配置自定义 DNS 解析器的一等支持。

以前，您需要通过访问引擎特定的内部结构来配置自定义 DNS 解析，例如 OkHttp 中的 `config {}` 或 Apache5 中的 `configureConnectionManager { setDnsResolver(...) }`。Ktor 现在在每个引擎上公开了专门的配置属性，以提供一致且类型安全的 API。

#### OkHttp

您现在可以使用 `OkHttpConfig.dns` 属性在 OkHttp 中配置自定义 DNS 解析器：

```kotlin
HttpClient(OkHttp) {
    engine {
        dns = Dns { hostname -> listOf(InetAddress.getByName("127.0.0.1")) }
    }
}
```

如果您不配置 `dns` 属性，OkHttp 引擎将继续使用 OkHttp 默认的 `Dns.SYSTEM` 解析器。

#### Apache5

您现在可以使用 `Apache5EngineConfig.dnsResolver` 属性在 Apache5 中配置自定义 DNS 解析器：

```kotlin
HttpClient(Apache5) {
    engine {
        dnsResolver = SystemDefaultDnsResolver.INSTANCE
    }
}
```

如果未配置 `dnsResolver` 属性，Apache5 引擎将继续使用 Apache 客户端默认的 DNS 解析器。