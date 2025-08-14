[//]: # (title: Ktor 3.2.0 新特性)

<show-structure for="chapter,procedure" depth="2"/>

_[发布日期：2025 年 6 月 12 日](releases.md#release-details)_

本次**特性**发布的主要亮点如下：

*   [版本目录](#published-version-catalog)
*   [依赖项注入](#dependency-injection)
*   [一等 HTMX 支持](#htmx-integration)
*   [可挂起模块函数](#suspendable-module-functions)

## Ktor 服务器

### 可挂起模块函数

从 Ktor 3.2.0 开始，[应用程序模块](server-modules.md)支持**可挂起函数**。

此前，在 Ktor 模块中添加异步**函数**需要使用 `runBlocking` **代码块**，这可能导致服务器创建时发生死锁：

```kotlin
fun Application.installEvents() {
    val kubernetesConnection = runBlocking {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

现在您可以使用 `suspend` 关键字，在应用程序启动时允许异步代码：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

#### 并发模块加载

您还可以通过添加 `ktor.application.startup = concurrent` Gradle 属性来选择启用并发模块加载。它会独立启动所有应用程序模块，因此当一个模块**挂起**时，其他模块不会被阻塞。这允许**依赖项注入**进行非顺序加载，在某些情况下还可以加快加载速度。

有关更多信息，请参见[并发模块加载](server-modules.md#concurrent-module-loading)。

### 配置文件反序列化

Ktor 3.2.0 引入了类型化配置加载，为 `Application` 类新增了 `.property()` **扩展**。现在您可以将结构化配置部分直接反序列化为 Kotlin 数据类。

此**特性**简化了您访问配置值的方式，并显著减少了处理嵌套或分组设置时的**样板代码**。

请考虑以下 **application.yaml** 文件：

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

此前，您必须逐个检索每个配置值。使用新的 `.property()` **扩展**，您可以一次性加载整个配置部分：

<compare>
[object Promise]
[object Promise]
</compare>

此**特性**支持 HOCON 和 YAML 配置格式，并使用 `kotlinx.serialization` 进行反序列化。

### `ApplicationTestBuilder` 拥有可配置的 `client`

从 Ktor 3.2.0 开始，`ApplicationTestBuilder` 类中的 `client` 属性是可变的。此前，它是只读的。此更改让您可以配置自己的测试 client，并在 `ApplicationTestBuilder` 类可用的任何地方重用它。**例如**，您可以从**扩展函数**内部访问 client：

```kotlin
@Test
fun testRouteAfterAuthorization() = testApplication {
    // 预配置客户端
    client = createClient {
        install(ContentNegotiation) {
            json()
        }
            
        defaultRequest { 
            contentType(ContentType.Application.Json)
        }
    }

    // 提取到扩展函数中的可重用测试步骤
    auth(token = AuthToken("swordfish"))

    val response = client.get("/route")
    assertEquals(OK, response.status)
}

private fun ApplicationTestBuilder.auth(token: AuthToken) {
    val response = client.post("/auth") {
        setBody(token)
    }
    assertEquals(OK, response.status)
}
```

### 依赖项注入

Ktor 3.2.0 引入了**依赖项注入** (DI) 支持，使您能够更轻松地直接从配置文件和**应用程序代码**中管理和连接**依赖项**。新的 DI 插件简化了**依赖项**解析，支持异步加载，提供自动清理，并与测试平滑集成。

<var name="artifact_name" value="ktor-server-di" />

要使用 DI，请在构建脚本中包含 `%artifact_name%` **artifact**：

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
    

#### 基本**依赖项注册**

您可以使用**lambda 表达式**、**函数**引用或**构造函数**引用来**注册依赖项**：

```kotlin
dependencies {
  // 基于 lambda 表达式
  provide<GreetingService> { GreetingServiceImpl() }

  // 函数引用
  provide<GreetingService>(::GreetingServiceImpl)
  provide(BankServiceImpl::class)
  provide(::createBankTeller)

  // 将 lambda 表达式注册为依赖项
  provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

#### 基于配置的**依赖项注册**

您可以使用配置文件中的类路径引用来声明式地配置**依赖项**。这支持**函数**和类引用：

```yaml
# application.yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
database:
  connectionUrl: postgres://localhost:3037/admin
```

```kotlin
// Repositories.kt
fun provideDatabase(@Property("database.connectionUrl") connectionUrl: String): Database =
  PostgresDatabase(connectionUrl)

class UserRepository(val db: Database) {
  // 实现 
}
```

**实参**通过 `@Property` 和 `@Named` 等注解自动解析。

#### **依赖项解析**与**注入**

##### **解析依赖项**

要**解析依赖项**，您可以使用属性委托或直接解析：

```kotlin
// 使用属性委托
val service: GreetingService by dependencies

// 直接解析
val service = dependencies.resolve<GreetingService>()
```

##### 异步**依赖项解析**

为了支持异步加载，您可以使用**挂起函数**：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection = dependencies.resolve() // 挂起直到提供
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 插件将自动**挂起** `resolve()` 调用，直到所有**依赖项**都准备就绪。

##### 注入到应用程序模块

您可以通过指定模块**形参**将**依赖项**直接注入到**应用程序模块**中。Ktor 将从 DI 容器中**解析**它们：

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt
    modules:
      - com.example.LoggingKt.logging
```

```kotlin
fun Application.logging(printStreamProvider: () -> PrintStream) {
    dependencies {
        provide<Logger> { SimpleLogger(printStreamProvider()) }
    }
}
```

使用 `@Named` 注入特定键的**依赖项**：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 使用名为 "mongo" 的依赖项
}
```

##### 属性和配置注入

使用 `@Property` 直接注入配置值：

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

这简化了结构化配置的使用，并支持**原生类型**的自动解析。

有关更多信息和高级用法，请参见[](server-dependency-injection.md)。

## Ktor 客户端

### `SaveBodyPlugin` 和 `HttpRequestBuilder.skipSavingBody()` 已弃用

在 Ktor 3.2.0 之前，`SaveBodyPlugin` 默认安装。它会在内存中缓存整个响应体，允许其被多次访问。为了避免保存响应体，必须**显式**禁用该插件。

从 Ktor 3.2.0 开始，`SaveBodyPlugin` 已**弃用**，并被一个新内部插件取代，该插件自动为所有非流式请求保存响应体。这改进了资源管理，并简化了 HTTP 响应生命周期。

`HttpRequestBuilder.skipSavingBody()` 也已**弃用**。如果您需要不缓存响应体来处理响应，请改用流式处理方法。

<compare first-title="之前" second-title="之后">

```kotlin
val file = client.get("/some-file") {
    skipSavingBody()
}.bodyAsChannel()
saveFile(file)
```
```kotlin
client.prepareGet("/some-file").execute { response ->
    saveFile(response.bodyAsChannel())
}
```

</compare>

此方法直接流式传输响应，阻止响应体在内存中保存。

### `.wrapWithContent()` 和 `.wrap()` 扩展函数已弃用

在 Ktor 3.2.0 中，[`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html) 和 [`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html) **扩展函数**已**弃用**，取而代之的是新的 `.replaceResponse()` **函数**。

`.wrapWithContent()` 和 `.wrap()` **函数**用只能读取一次的 `ByteReadChannel` 替换原始响应体。如果直接传递相同的通道实例，而不是传递一个返回新通道的**函数**，则多次读取响应体将失败。这可能会破坏访问响应体的不同插件之间的兼容性，因为第一个读取它的插件会消耗响应体：

```kotlin
// 将响应体替换为从 rawContent 解码一次的通道
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// 第一次调用返回响应体
decodedResponse.bodyAsText()

// 后续调用返回空字符串
decodedResponse.bodyAsText() 
```

为了避免此问题，请改用 `.replaceResponse()` **函数**。它接受一个**lambda 表达式**，该**lambda 表达式**在每次访问时返回一个新通道，从而确保与其他插件的安全**集成**：

```kotlin
// 每次访问时，将响应体替换为新的解码通道
call.replaceResponse {
    decode(response.rawContent)
}
```

### 访问解析后的 IP 地址

现在您可以在 `io.ktor.network.sockets.InetSocketAddress` 实例上使用新的 `.resolveAddress()` **函数**。此**函数**允许您获取关联主机的原始解析 IP 地址：

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

它以 `ByteArray` 形式返回解析后的 IP 地址，如果地址无法解析则返回 `null`。返回的 `ByteArray` 的大小取决于 IP 版本：IPv4 地址将包含 4 字节，IPv6 地址将包含 16 字节。在 JS 和 Wasm **平台**上，`.resolveAddress()` 总是返回 `null`。

## 共享

### HTMX **集成**

Ktor 3.2.0 引入了对 [HTMX](https://htmx.org/) 的**实验性的**支持，HTMX 是一个现代 JavaScript 库，它通过 `hx-get` 和 `hx-swap` 等 HTML 属性启用动态**交互**。Ktor 的 HTMX **集成**提供了：

*   用于基于标头处理 HTMX 请求的 HTMX 感知路由。
*   用于在 Kotlin 中生成 HTMX 属性的 HTML DSL **扩展**。
*   HTMX 标头常量和值，用于消除字符串字面量。

Ktor 的 HTMX 支持在三个**实验性的模块**中可用：

| 模块             | 描述                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定义和标头常量      |
| `ktor-htmx-html`   | 与 Kotlin HTML DSL **集成**       |
| `ktor-server-htmx` | 对 HTMX 特定请求的路由支持 |

所有 API 都标记有 `@ExperimentalKtorApi`，并通过 `@OptIn(ExperimentalKtorApi::class)` 进行选择启用。有关更多信息，请参见[](htmx-integration.md)。

## Unix 域套接字

通过 3.2.0，您可以设置 Ktor 客户端连接到 Unix 域套接字，并设置 Ktor 服务器监听此类套接字。目前，Unix 域套接字仅在 CIO 引擎中受支持。

服务器配置**示例**：

```kotlin
val server = embeddedServer(CIO, configure = {
    unixConnector("/tmp/test-unix-socket-ktor.sock")
}) {
    routing {
        get("/") {
            call.respondText("Hello, Unix socket world!")
        }
    }
}
```

使用 Ktor 客户端连接到该套接字：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您还可以在[默认请求](client-default-request.md#unix-domain-sockets)中使用 Unix 域套接字。

## 基础设施

### 已发布**版本目录**

在此版本中，您现在可以使用官方的[已发布**版本目录**](server-dependencies.topic#using-version-catalog)来从单个源管理所有 Ktor **依赖项**。这消除了在**依赖项**中手动**声明** Ktor 版本的需要。

要将**版本目录**添加到您的**项目**中，请在 **settings.gradle.kts** 中配置 Gradle 的**版本目录**，然后在其模块的 **build.gradle.kts** 文件中引用它：

<tabs>
<tab title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</tab>
<tab title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</tab>
</tabs>

## Gradle 插件

### 启用开发模式

Ktor 3.2.0 简化了开发模式的启用。此前，启用开发模式需要在 `application` **代码块**中进行**显式**配置。现在，您可以使用 `ktor.development` **属性**来启用它，无论是动态地还是**显式**地：

*   根据**项目**属性动态启用开发模式。
  ```kotlin
    ktor {
        development = project.ext.has("development")
    }
  ```
*   **显式**将开发模式设置为 true。

    ```kotlin
    ktor {
        development = true
    }
    ```

默认情况下，如果定义了 Gradle **项目**属性或系统属性 `io.ktor.development`，则 `ktor.development` 值会自动解析。这允许您使用 Gradle CLI 标志直接启用开发模式：

```bash
./gradlew run -Pio.ktor.development=true
```