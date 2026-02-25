[//]: # (title: 从 2.0.x 迁移到 2.2.x)

<show-structure for="chapter" depth="2"/>

本指南介绍了如何将 Ktor 应用程序从 2.0.x 版本迁移到 2.2.x。

> 被标记为 `WARNING` 弃用级别的 API 将继续可用，直至 3.0.0 版本发布。
> 您可以从 [Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 中详细了解弃用级别。

## Ktor Server {id="server"}

### Cookies {id="cookies"}
在 v2.2.0 中，与配置 [响应 Cookie](server-responses.md#cookies) 相关的以下 API 成员发生了变化：
- 传递给 `append` 函数的 `maxAge` 参数类型从 `Int` 更改为 `Long`。
- `appendExpired` 函数已弃用。请改为使用带有 `expires` 参数的 `append` 函数。

### 请求地址信息 {id="request-address-info"}

从 2.2.0 版本开始，用于获取请求指向的主机名/端口的 `RequestConnectionPoint.host` 和 `RequestConnectionPoint.port` 属性已弃用。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

请改为使用 `RequestConnectionPoint.serverHost` 和 `RequestConnectionPoint.serverPort`。
我们还添加了 `localHost`/`localPort` 属性，它们会返回收到请求的主机名/端口。
您可以从 [原始请求信息](server-forward-headers.md#original-request-information) 中了解更多信息。

### 合并配置 {id="merge-configs"}
在 v2.2.0 之前，使用 `List<ApplicationConfig>.merge()` 函数来合并应用程序配置。
如果两个配置具有相同的键，则生成的配置将取第一个配置中的值。
在此版本中，引入了以下 API 以改进此行为：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`：该函数的工作方式与 `merge()` 相同，并从第一个配置中获取值。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`：生成的配置将从第二个配置中获取值。

## Ktor Client {id="client"}

### 缓存：持久化存储 {id="persistent-storage"}

在 v2.2.0 中，与响应 [缓存](client-caching.md) 相关的以下 API 已弃用：
- `HttpCacheStorage` 类已被 `CacheStorage` 接口取代，该接口可用于为所需平台实现持久化存储。
- `publicStorage`/`privateStorage` 属性已被接受 `CacheStorage` 实例的相应函数取代。

### 自定义插件 {id="custom-plugins"}

从 2.2.0 版本开始，Ktor 提供了一个用于创建自定义客户端插件的新 API。
要了解更多信息，请参阅 [自定义客户端插件](client-custom-plugins.md)。

## 新内存模型 {id="new-mm"}

在 v2.2.0 中，Ktor 使用了 1.7.20 版本的 Kotlin，其中新的 Kotlin/Native 内存模型是 [默认启用](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default) 的。
这意味着您不需要为针对 [Kotlin/Native](client-engines.md#native) 的 [Native 服务器](server-native.md) 或客户端引擎显式启用它。