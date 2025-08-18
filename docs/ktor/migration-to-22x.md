[//]: # (title: 从 2.0.x 迁移到 2.2.x)

<show-structure for="chapter" depth="2"/>

本指南提供了关于如何将你的 Ktor 应用程序从 2.0.x 版本迁移到 2.2.x 版本的说明。

> 标记为 `WARNING` 弃用级别的 API 将继续工作，直到 3.0.0 版本发布。
> 关于弃用级别的更多信息，请参阅 [Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)。

## Ktor 服务器 {id="server"}

### Cookie {id="cookies"}
从 v2.2.0 开始，以下与配置[响应 cookie](server-responses.md#cookies) 相关的 API 成员已更改：
- 传递给 `append` 函数的 `maxAge` 形参类型从 `Int` 更改为 `Long`。
- `appendExpired` 函数已弃用。请改用带 `expires` 形参的 `append` 函数。

### 请求地址信息 {id="request-address-info"}

从 2.2.0 版本开始，用于获取请求所发往的主机名/端口的 `RequestConnectionPoint.host` 和 `RequestConnectionPoint.port` 属性已弃用。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

请改用 `RequestConnectionPoint.serverHost` 和 `RequestConnectionPoint.serverPort`。
我们还添加了 `localHost`/`localPort` 属性，它们返回接收请求的主机名/端口。
关于请求地址信息的更多信息，请参阅[原始请求信息](server-forward-headers.md#original-request-information)。

### 合并配置 {id="merge-configs"}
在 v2.2.0 之前，`List<ApplicationConfig>.merge()` 函数用于合并应用程序配置。
如果两个配置具有相同的键，则结果配置将采用第一个配置中的值。
在此版本中，引入了以下 API 以改进此行为：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`：此函数的工作方式与 `merge()` 相同，并采用第一个配置中的值。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`：结果配置将采用第二个配置中的值。

## Ktor 客户端 {id="client"}

### 缓存：持久化存储 {id="persistent-storage"}

从 v2.2.0 开始，以下与响应[缓存](client-caching.md)相关的 API 已弃用：
- `HttpCacheStorage` 类已替换为 `CacheStorage` 接口，后者可用于为所需平台实现持久化存储。
- `publicStorage`/`privateStorage` 属性已替换为接受 `CacheStorage` 实例的相应函数。

### 自定义插件 {id="custom-plugins"}

从 2.2.0 版本开始，Ktor 提供了一个新的 API 用于创建自定义客户端插件。
欲了解更多信息，请参阅[自定义客户端插件](client-custom-plugins.md)。

## 新内存模型 {id="new-mm"}

从 v2.2.0 开始，Ktor 使用 Kotlin 的 1.7.20 版本，其中新的 Kotlin/Native 内存模型[默认启用](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)。
这意味着你无需为[原生服务器](server-native.md)或面向 [Kotlin/Native](client-engines.md#native) 的客户端引擎显式启用它。