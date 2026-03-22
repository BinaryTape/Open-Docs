---
title: 隔离上下文
---

# Ktor 中的隔离上下文

`KoinIsolated` 插件在隔离上下文中运行 Koin，与全局 Koin 实例分开。这对于测试、多租户应用程序以及运行多个 Koin 实例非常有用。

## 何时使用隔离上下文

- **测试** - 每个测试都有自己的隔离 Koin 实例
- **多租户应用程序** - 不同租户具有不同的配置
- **插件/模块系统** - 具有自己依赖项的独立模块
- **嵌入式 Ktor 服务器** - 同一 JVM 中的多个 Ktor 实例

## 基本设置

安装 `KoinIsolated` 而不是 `Koin`：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 全局 vs 隔离上下文

### 全局上下文 (默认)

```kotlin
// 使用 GlobalContext - 在应用程序中共享
install(Koin) {
    modules(appModule)
}

// 可以通过 GlobalContext 在任何地方访问 Koin
val service = GlobalContext.get().get<UserService>()
```

### 隔离上下文

```kotlin
// 使用隔离上下文 - 无法通过 GlobalContext 访问
install(KoinIsolated) {
    modules(appModule)
}

// GlobalContext.get() 将不会返回此 Koin 实例
// 仅在 Ktor 应用程序作用域内可访问
```

:::warning
使用 `KoinIsolated` 时，您无法通过 `GlobalContext` 访问 Koin。所有注入必须使用 `inject()` 或 `get()` 在 Ktor 应用程序作用域内进行。
:::

## 完整示例

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
    }
}

fun Application.main() {
    // 在隔离模式下安装 Koin
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // 注入在 Application 作用域内有效
    val userService by inject<UserService>()

    routing {
        get("/users/{id}") {
            val logger = call.scope.get<RequestLogger>()
            val id = call.parameters["id"]!!

            logger.log("Fetching user $id")
            val user = userService.getUser(id)

            call.respond(user)
        }
    }
}
```

## 使用 DI 桥接

隔离上下文也支持 Ktor DI 桥接：

```kotlin
fun Application.main() {
    // Ktor DI - 基础架构
    val database = Database(environment.config)
    dependencies {
        provide<Database> { database }
    }

    // 带有桥接的 Koin Isolated
    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()  // 允许 Koin 从 Ktor DI 进行解析
        }

        modules(appModule)
    }

    routing {
        userRoutes()
    }
}

val appModule = module {
    // 可以通过桥接从 Ktor DI 注入 Database
    singleOf(::UserRepository)
    singleOf(::UserService)
}
```

## 使用隔离上下文进行测试

隔离上下文对测试特别有用：

```kotlin
class UserServiceTest {
    @Test
    fun `test user endpoint`() = testApplication {
        application {
            // 每个测试都有自己的隔离 Koin 实例
            install(KoinIsolated) {
                modules(testModule)
            }
            configureRouting()
        }

        client.get("/users/123").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}

val testModule = module {
    single<UserRepository> { MockUserRepository() }
    singleOf(::UserService)
}
```

### 并行测试执行

使用隔离上下文，测试可以并行运行而互不干扰：

```kotlin
class ParallelTests {
    @Test
    fun `test A`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleA)  // 拥有自己的隔离实例
            }
        }
        // ...
    }

    @Test
    fun `test B`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleB)  // 不同的隔离实例
            }
        }
        // ...
    }
}
```

## 多个 Ktor 服务器

运行具有独立 Koin 实例的多个 Ktor 服务器：

```kotlin
fun main() {
    // 服务器 1 - 用户服务
    val userServer = embeddedServer(Netty, port = 8080) {
        install(KoinIsolated) {
            modules(userServiceModule)
        }
        userRouting()
    }

    // 服务器 2 - 订单服务 (不同的 Koin 实例)
    val orderServer = embeddedServer(Netty, port = 8081) {
        install(KoinIsolated) {
            modules(orderServiceModule)
        }
        orderRouting()
    }

    // 两个服务器都具有独立的 Koin 容器
    userServer.start(wait = false)
    orderServer.start(wait = true)
}
```

## 生命周期

隔离的 Koin 实例遵循 Ktor 应用程序生命周期：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // 监控 Koin 生命周期
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Isolated Koin started")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Isolated Koin stopped")
    }
}
```

## 访问隔离的 Koin 实例

在 Ktor 应用程序中，您可以访问隔离的 Koin 实例：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        modules(appModule)
    }

    // 从 Application 访问 Koin 实例
    val koin = getKoin()

    // 或者通过插件属性访问
    val koinApp = attributes[KoinPluginKey]
}
```

## 何时**不**使用隔离上下文

- **单个 Ktor 应用程序** - 全局上下文更简单
- **跨模块共享依赖项** - 全局上下文允许共享
- **访问 Koin 的后台作业** - 它们需要 `GlobalContext`

## 最佳做法

1. **用于测试** - 隔离上下文可防止测试干扰
2. **用于多租户** - 每个租户可以有不同的配置
3. **简单应用请避免使用** - 对于大多数用例，全局上下文更简单
4. **记录选择原因** - 明确说明为什么要使用隔离上下文

## 另请参阅

- **[Ktor 集成](/docs/reference/koin-ktor/ktor)** - 主要 Ktor 文档
- **[上下文隔离](/docs/reference/koin-core/context-isolation)** - 核心隔离概念
- **[测试](/docs/reference/koin-test/testing)** - 使用 Koin 进行测试