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

### Sessions 插件中改进的会话管理

Ktor 3.5.0 通过新的配置选项改进了 [Sessions](server-sessions.md) 插件中的会话处理，使您能够更好地控制会话生命周期、标识生成和网络行为。

#### 仅在修改时发送会话数据 {id="session-cookies"}

您现在可以将会话配置为仅在数据更改时发送。对于基于 cookie 的会话，这意味着 `Set-Cookie` 标头仅在修改时发送。此优化适用于基于 cookie 和标头的会话。

默认情况下，会话数据会在每次响应时发送，以保留现有行为。若要仅在修改时发送，请在会话 cookie 配置中启用 `sendOnlyIfModified` 选项：

```kotlin
install(Sessions) {
    cookie<MySession>("SESSION") {
        sendOnlyIfModified = true
    }
}
```

#### 从请求数据生成会话 ID

`CookieIdSessionBuilder.identity()` 函数现在接受一个 `ApplicationCall`，允许从当前应用程序调用中派生会话 ID。这支持了诸如将会话绑定到已通过身份验证的用户或请求元数据之类的用例。

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session", storage = RedisSessionStorage()) {
        identity { call ->
            call.principal<UserIdPrincipal>()?.name ?: generateSessionId()
        }
    }
}
```

以前的 `identity()` 函数已弃用，取而代之的是可感知调用的重载。

#### 按 ID 清除会话

您现在可以使用 `call.sessions.clear<UserSession>()` 和 `CurrentSession.clear()` 便捷函数通过存储 ID 使会话失效，而无需活跃调用。这两个函数都委托给 `SessionTrackerById.clearById()`。

```kotlin
post("/logout/{sessionId}") {
    val sessionId = call.requirePathParameter("sessionId")
    call.sessions.clear<UserSession>(sessionId)
    call.respond(HttpStatusCode.OK)
}
```

这对于诸如注销用户的所有设备或从后台作业使会话过期之类的场景非常有用。

### 自定义 SSE 心跳事件

此版本为 Ktor 服务器端 SSE 支持引入了一个新选项，允许您使用事件提供程序函数完全自定义心跳事件：

```kotlin
heartbeat {
    period = 30.milliseconds
    eventProvider = { ServerSentEvent(data = "ts=${Clock.System.now()}") }
}
```

这使得定期发送自定义心跳有效负载成为可能，例如时间戳和状态信息。

### Jetty 引擎中的 SNI 验证配置

此版本为 Jetty 引擎引入了一个新的 `secureRequestCustomizer` 配置选项，提供了对 Jetty 的 `SecureRequestCustomizer` 实例的直接访问。

这允许您自定义 HTTPS 请求处理，包括服务器名称指示 (SNI) 验证行为。例如，当使用自定义主机映射或自签名证书进行本地测试时，您可以禁用 SNI 主机检查和 SNI 要求：

```kotlin
embeddedServer(
      Jetty,
      configure = {
          secureRequestCustomizer = {
              isSniHostCheck = false
              isSniRequired = false
          }
      }
)
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