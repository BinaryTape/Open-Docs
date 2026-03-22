---
title: Koin for Ktor
---

`koin-ktor` 模块为 Ktor 应用程序提供依赖注入集成，可与 Ktor 内置的 DI 系统协同工作。

## 为什么在 Ktor 中使用 Koin？

Ktor 3.4+ 包含了一个内置的 DI 系统。以下是两者的对比：

| 功能 | Ktor DI | Koin |
|---------|---------|------|
| 基础注入 | 是 | 是 |
| 限定符 (`@Named`) | 是 | 是 |
| 属性注入 | 是 (`@Property`) | 是 |
| 可为 null/可选的依赖项 | 是 | 是 |
| 作用域 (请求作用域、自定义作用域) | 否 | 是 |
| 模块组织 | 否 | 是 |
| 延迟加载模块 | 否 | 是 |
| 基于注解的组件 | 否 | 是 |
| 编译器插件验证 | 否 | 是 |

### Ktor DI 的局限性

- **无作用域设置** - 不支持请求作用域或自定义作用域，仅支持带清理顺序的类单例行为。
- **无基于注解的组件** - 不支持像 Koin Annotations 那样的 `@Singleton`、`@Factory` 组件扫描。
- **无编译时验证** - 没有编译器插件可以在运行时之前验证 DI 配置。
- **受限的参数化类型** - 无法跨类型参数子类型解析参数化类型。

**何时使用 Koin：**
- 需要作用域依赖项（请求作用域、自定义作用域）
- 需要基于模块的组织方式
- 需要基于注解的组件扫描
- 需要通过编译器插件进行编译时验证

**何时 Ktor DI 就足够了：**
- 依赖项较少的简单应用程序
- 没有作用域需求
- 仅有基础的限定符需求

## 设置

添加 Koin Ktor 依赖项：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version") // 可选
}
```

## 声明依赖项

Koin 支持多种 DSL 方式。

### 编译器插件 DSL

最简单的语法：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

### 注解

类似于 Spring 且带有编译时验证：

```kotlin
@Module
@ComponentScan("com.example")
class AppModule

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserService(private val repository: UserRepository)
```

### 经典 DSL

使用构造函数引用：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)
}
```

## 安装 Koin 插件

在您的 `Application` 模块中安装 Koin：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

### 完整配置

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        fileProperties("/application.conf")
        modules(
            networkModule,
            repositoryModule,
            serviceModule
        )
        createEagerInstances()
    }
}
```

## 依赖注入

Koin 为 Ktor 的核心类型提供了扩展函数。

### 注入点

`inject()` 和 `get()` 可用于：
- `Application`
- `Route`
- `Routing`
- `ApplicationCall`（在路由处理程序内）

### 应用级

```kotlin
fun Application.main() {
    val helloService by inject<HelloService>()  // 延迟注入
    val configService = get<ConfigService>()     // 立即注入

    routing {
        get("/hello") {
            call.respondText(helloService.sayHello())
        }
    }
}
```

### 路由级

```kotlin
fun Route.customerRoutes() {
    val customerService by inject<CustomerService>()

    get("/customers") {
        call.respond(customerService.getAllCustomers())
    }

    get("/customers/{id}") {
        val id = call.parameters["id"]?.toInt()
            ?: return@get call.respond(HttpStatusCode.BadRequest)
        call.respond(customerService.getCustomer(id))
    }
}
```

### 请求处理程序

```kotlin
routing {
    get("/users/{id}") {
        val userService = get<UserService>()
        val userId = call.parameters["id"]!!
        call.respond(userService.getUser(userId))
    }
}
```

## Ktor 事件

监听 Koin 生命周期事件：

| 事件 | 描述 |
|-------|-------------|
| `KoinApplicationStarted` | Koin 容器已启动 |
| `KoinApplicationStopPreparing` | Koin 准备停止 |
| `KoinApplicationStopped` | Koin 容器已停止 |

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started")
        get<CacheWarmer>().warmUp()
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped")
    }
}
```

## 快速参考

| 函数 | 描述 |
|----------|-------------|
| `install(Koin) { }` | 安装 Koin 插件 |
| `inject<T>()` | 延迟注入 |
| `get<T>()` | 立即注入 |
| `koinModule { }` | 声明内联模块 |
| `koinModules(...)` | 加载现有模块 |

## 文档

| 主题 | 描述 |
|-------|-------------|
| **[DI 桥接](/docs/reference/koin-ktor/ktor-bridge)** | Koin ↔ Ktor DI 集成 |
| **[请求作用域](/docs/reference/koin-ktor/ktor-scopes)** | 请求作用域依赖项 |
| **[测试](/docs/reference/koin-ktor/ktor-testing)** | 使用 Koin 测试 Ktor |
| **[隔离上下文](/docs/reference/koin-ktor/ktor-isolated)** | 隔离的 Koin 实例 |

## 相关内容

- **[教程：Ktor](/docs/quickstart/ktor)** – 分步教程
- **[教程：在 Ktor 中使用注解](/docs/quickstart/ktor-annotations)** – 注解教程
- **[Koin 注解](/docs/reference/koin-annotations/start)** – 注解参考
- **[Ktor 文档](https://ktor.io/)** – Ktor 官方文档