[//]: # (title: 从 2.0.x 迁移到 2.2.x)

<show-structure for="chapter" depth="2"/>

本指南提供了关于如何将 Ktor 应用程序从 2.0.x 版本迁移到 2.2.x 的说明。

> 被标记为 `WARNING` 弃用级别的 API 将继续工作，直到 3.0.0 版本发布。
> 你可以从 [Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 了解更多关于弃用级别的信息。

## Ktor 服务器 {id="server"}

### Cookie {id="cookies"}
在 v2.2.0 中，以下与配置[响应 cookie](server-responses.md#cookies) 相关的 API 成员发生了变化：
- 传递给 `append` 函数的 `maxAge` 形参的类型已从 `Int` 变为 `Long`。
- `appendExpired` 函数已弃用。请改用带 `expires` 形参的 `append` 函数。

### 请求地址信息 {id="request-address-info"}

从 2.2.0 版本开始，用于获取请求所针对的主机名/端口的 `RequestConnectionPoint.host` 和 `RequestConnectionPoint.port` 属性已弃用。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

请改用 `RequestConnectionPoint.serverHost` 和 `RequestConnectionPoint.serverPort`。我们还添加了 `localHost`/`localPort` 属性，它们返回接收请求的主机名/端口。你可以从这里了解更多信息：[](server-forward-headers.md#original-request-information)。

### 合并配置 {id="merge-configs"}
在 v2.2.0 之前，`List<ApplicationConfig>.merge()` 函数用于合并应用程序配置。
如果两个配置具有相同的键，则结果配置将采用第一个配置的值。
此版本引入了以下 API 来改进此行为：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`：此函数与 `merge()` 的工作方式相同，并采用第一个配置的值。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`：结果配置采用第二个配置的值。

## Ktor 客户端 {id="client"}

### 缓存：持久存储 {id="persistent-storage"}

在 v2.2.0 中，以下与响应[缓存](client-caching.md)相关的 API 已弃用：
- `HttpCacheStorage` 类已被 `CacheStorage` 接口取代，后者可用于为所需平台实现持久存储。
- `publicStorage`/`privateStorage` 属性已被接受 `CacheStorage` 实例的相应函数取代。

### 自定义插件 {id="custom-plugins"}

从 2.2.0 版本开始，Ktor 提供了一个用于创建自定义客户端插件的新 API。
要了解更多信息，请参见 [](client-custom-plugins.md)。

## 新的内存模型 {id="new-mm"}

在 v2.2.0 中，Ktor 使用 Kotlin 的 1.7.20 版本，其中新的 Kotlin/Native 内存模型[默认启用](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)。
这意味着你无需为[原生服务器](server-native.md)或面向 [Kotlin/Native] 的客户端引擎显式启用它。