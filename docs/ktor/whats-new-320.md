[//]: # (title: Ktor 3.2.0 有哪些新特性)

<show-structure for="chapter,procedure" depth="2"/>

_[发布日期：2025 年 6 月 12 日](releases.md#release-details)_

本次特性发布的主要亮点如下：

*   [版本目录](#published-version-catalog)
*   [依赖项注入](#dependency-injection)
*   [一流的 HTMX 支持](#htmx-integration)
*   [可挂起模块函数](#suspendable-module-functions)

## Ktor 服务器

### 可挂起模块函数

从 Ktor 3.2.0 开始，[应用程序模块](server-modules.md)支持可挂起函数。

> 随着挂起模块支持的引入，开发模式下的自动重新加载不再适用于阻塞函数引用。关于更多信息，请参见[开发模式自动重新加载退步](#regression)。
>
{style="warning"}

以前，在 Ktor 模块内添加异步函数需要使用 `runBlocking` 代码块，这可能导致服务器创建时发生死锁：

```kotlin
fun Application.installEvents() {
    val kubernetesConnection = runBlocking {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

现在，您可以使用 `suspend` 关键字，从而允许在应用程序启动时运行异步代码：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

#### 并发模块加载

您还可以通过添加 `ktor.application.startup = concurrent` Gradle 属性来选择启用并发模块加载。它会独立启动所有应用程序模块，因此当一个模块挂起时，其他模块不会被阻塞。这允许依赖项注入的非顺序加载，在某些情况下，还能加快加载速度。

关于并发模块加载的更多信息，请参见[并发模块加载](server-modules.md#concurrent-module-loading)。

### 配置文件反序列化

Ktor 3.2.0 引入了类型化配置加载，在 `Application` 类上新增了一个 `.property()` 扩展。现在，您可以将结构化配置部分直接反序列化为 Kotlin 数据类。

此特性简化了配置值的访问方式，并显著减少了处理嵌套或分组设置时的样板代码。

请考虑以下 **application.yaml** 文件：

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

以前，您必须单独检索每个配置值。现在使用新的 `.property()` 扩展，您可以一次性加载整个配置部分：

<compare>
<code-block lang="kotlin" code="data class DatabaseConfig(&#10;    val url: String,&#10;    val username: String,&#10;    val password: String? = null,&#10;)&#10;&#10;fun Application.module() {&#10;  val databaseConfig = DatabaseConfig(&#10;    url = environment.config.property(&quot;database.url&quot;).getString(),&#10;    username = environment.config.property(&quot;database.username&quot;).getString(),&#10;    password = environment.config.property(&quot;database.password&quot;).getString(),&#10;  )&#10;  // use configuration&#10;}"/>
<code-block lang="kotlin" code="@Serializable &#10;data class DatabaseConfig(&#10;    val url: String,&#10;    val username: String,&#10;    val password: String? = null,&#10;)&#10;&#10;fun Application.module() {&#10;  val databaseConfig: DatabaseConfig = property(&quot;database&quot;)&#10;  // use configuration&#10;}"/>
</compare>

此特性支持 HOCON 和 YAML 两种配置格式，并使用 `kotlinx.serialization` 进行反序列化。

### `ApplicationTestBuilder` 的 `client` 可配置

从 Ktor 3.2.0 开始，`client` 属性在 `ApplicationTestBuilder` 类中是可变的。以前，它是只读的。此更改允许您配置自己的测试客户端，并在 `ApplicationTestBuilder` 类可用的任何地方重用它。例如，您可以从扩展函数中访问客户端：

```kotlin
@Test
fun testRouteAfterAuthorization() = testApplication {
    // Pre-configure the client
    client = createClient {
        install(ContentNegotiation) {
            json()
        }
            
        defaultRequest { 
            contentType(ContentType.Application.Json)
        }
    }

    // Reusable test step extracted into an extension-function
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

Ktor 3.2.0 引入了依赖项注入（DI）支持，使得直接从配置文件和应用程序代码管理及连接依赖项变得更加容易。新的 DI 插件简化了依赖项解析，支持异步加载，提供自动清理，并与测试无缝集成。

<var name="artifact_name" value="ktor-server-di" />

要使用 DI，请在构建脚本中包含 `%artifact_name%` 构件：

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

#### 基本依赖项注册

您可以使用 lambda 表达式、函数引用或构造函数引用来注册依赖项：

```kotlin
dependencies {
  // Lambda-based
  provide<GreetingService> { GreetingServiceImpl() }

  // Function references
  provide<GreetingService>(::GreetingServiceImpl)
  provide(BankServiceImpl::class)
  provide(::createBankTeller)

  // Registering a lambda as a dependency
  provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

#### 基于配置的依赖项注册

您可以使用配置文件中的类路径引用来声明式地配置依赖项。这支持函数和类引用：

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
  // implementation 
}
```

参数通过 `@Property` 和 `@Named` 等注解自动解析。

#### 依赖项解析与注入

##### 解析依赖项

要解析依赖项，您可以使用属性委托或直接解析：

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

##### 异步依赖项解析

为了支持异步加载，您可以使用挂起函数：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection = dependencies.resolve() // suspends until provided
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 插件将自动挂起 `resolve()` 调用，直到所有依赖项准备就绪。

##### 注入到应用程序模块

通过指定模块形参，您可以将依赖项直接注入到应用程序模块中。Ktor 将从 DI 容器中解析它们：

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

使用 `@Named` 注入特定键的依赖项：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

##### 属性与配置注入

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

这简化了结构化配置的处理，并支持基本类型的自动解析。

关于更多信息和高级用法，请参见[依赖项注入](server-dependency-injection.md)。

### 开发模式自动重新加载退步 {id="regression"}

作为对挂起函数支持的副作用，阻塞函数引用（`Application::myModule`）现在在类型转换时被包装为匿名内部类。这破坏了自动重新加载功能，因为函数名不再保留为稳定的引用。

这意味着 `development` 模式下的自动重新加载仅适用于挂起函数模块和配置引用：

```kotlin
// Suspend function reference
embeddedServer(Netty, port = 8080, module = Application::mySuspendModule)

// Configuration reference
ktor {
    application {
        modules = [ com.example.ApplicationKt.mySuspendModule ]
    }
}
```

## Ktor 客户端

### `SaveBodyPlugin` 和 `HttpRequestBuilder.skipSavingBody()` 已弃用

在 Ktor 3.2.0 之前，`SaveBodyPlugin` 默认是安装的。它会在内存中缓存整个响应体，允许其被多次访问。为了避免保存响应体，必须显式禁用该插件。

从 Ktor 3.2.0 开始，`SaveBodyPlugin` 已弃用，并由一个新的内部插件取代，该插件会自动保存所有非流式请求的响应体。这改进了资源管理并简化了 HTTP 响应生命周期。

`HttpRequestBuilder.skipSavingBody()` 也已弃用。如果您需要处理不缓存响应体的响应，请改用流式方法。

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

此方法直接流式传输响应，防止响应体被保存到内存中。

### `.wrapWithContent()` 和 `.wrap()` 扩展函数已弃用

在 Ktor 3.2.0 中，[`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html) 和 [`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html) 扩展函数已弃用，取而代之的是新的 `.replaceResponse()` 函数。

`.wrapWithContent()` 和 `.wrap()` 函数用 `ByteReadChannel` 替换原始响应体，`ByteReadChannel` 只能读取一次。如果直接传递相同的通道实例，而不是返回新实例的函数，那么多次读取响应体将会失败。这可能会破坏不同插件访问响应体时的兼容性，因为第一个读取它的插件会消耗该响应体：

```kotlin
// Replaces the body with a channel decoded once from rawContent
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// The first call returns the body
decodedResponse.bodyAsText()

// Subsequent calls return an empty string
decodedResponse.bodyAsText() 
```

为了避免此问题，请改用 `.replaceResponse()` 函数。它接受一个 lambda 表达式，该表达式在每次访问时返回一个新的通道，从而确保与其他插件的安全集成：

```kotlin
// Replaces the body with a new decoded channel on each access
call.replaceResponse {
    decode(response.rawContent)
}
```

### 访问已解析的 IP 地址

现在，您可以在 `io.ktor.network.sockets.InetSocketAddress` 实例上使用新的 `.resolveAddress()` 函数。此函数允许您获取关联主机的原始已解析 IP 地址：

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

它将已解析的 IP 地址作为 `ByteArray` 返回，如果地址无法解析，则返回 `null`。返回的 `ByteArray` 的大小取决于 IP 版本：IPv4 地址将包含 4 字节，IPv6 地址将包含 16 字节。在 JS 和 Wasm 平台，`.resolveAddress()` 将始终返回 `null`。

### HTTP 缓存清除

现在，您可以使用 [`CacheStorage`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 上的新方法来清除缓存的 HTTP 响应。

-   `.removeAll(url)` 移除所有匹配指定 URL 的缓存条目。
-   `.remove(url, varyKeys)` 移除匹配给定 URL 和 `Vary` 键的特定缓存条目。

这些方法使您能够更好地控制缓存失效，以及管理过期或特定的缓存响应。

## 共享

### HTMX 集成

Ktor 3.2.0 引入了对 [HTMX](https://htmx.org/) 的实验性支持，HTMX 是一个现代 JavaScript 库，它通过 `hx-get` 和 `hx-swap` 等 HTML 属性实现动态交互。Ktor 的 HTMX 集成提供了：

-   HTMX 感知路由，用于根据请求头处理 HTMX 请求。
-   HTML DSL 扩展，用于在 Kotlin 中生成 HTMX 属性。
-   HTMX 请求头常量和值，用于消除字符串字面量。

Ktor 的 HTMX 支持通过三个实验性的模块提供：

| 模块             | 描述                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定义和请求头常量      |
| `ktor-htmx-html`   | 与 Kotlin HTML DSL 的集成       |
| `ktor-server-htmx` | HTMX 特定请求的路由支持 |

所有 API 都标有 `@ExperimentalKtorApi`，并通过 `@OptIn(ExperimentalKtorApi::class)` 启用。关于更多信息，请参见[HTMX 集成](htmx-integration.md)。

## Unix 域套接字

在 3.2.0 中，您可以设置 Ktor 客户端连接 Unix 域套接字，并设置 Ktor 服务器监听此类套接字。目前，Unix 域套接字仅在 CIO 引擎中支持。

服务器配置示例：

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

使用 Ktor 客户端连接该套接字：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您还可以在[默认请求](client-default-request.md#unix-domain-sockets)中使用 Unix 域套接字。

## 基础设施

### 已发布的版本目录

在此发布中，您现在可以使用官方的[已发布的版本目录](server-dependencies.topic#using-version-catalog)来从单一来源管理所有 Ktor 依赖项。这消除了在依赖项中手动声明 Ktor 版本的需要。

要将目录添加到您的项目，请在 **settings.gradle.kts** 中配置 Gradle 的版本目录，然后在模块的 **build.gradle.kts** 文件中引用它：

<Tabs>
<TabItem title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</TabItem>
<TabItem title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</TabItem>
</Tabs>

## Gradle 插件

### 启用开发模式

Ktor 3.2.0 简化了开发模式的启用。以前，启用开发模式需要在 `application` 代码块中进行显式配置。现在，您可以使用 `ktor.development` 属性来启用它，无论是动态还是显式地：

*   根据项目属性动态启用开发模式。
    ```kotlin
    ktor {
        development = project.ext.has("development")
    }
    ```
*   显式将开发模式设置为 true。

    ```kotlin
    ktor {
        development = true
    }
    ```

默认情况下，如果定义了 Gradle 项目属性或系统属性 `io.ktor.development`，`ktor.development` 值将自动解析。这允许您直接使用 Gradle CLI 标志启用开发模式：

```bash
./gradlew run -Pio.ktor.development=true