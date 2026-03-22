---
title: 请求作用域
---

# Ktor 中的请求作用域

请求作用域创建的实例仅在单个 HTTP 请求期间存续，非常适合处理特定于请求的数据和处理过程。

## 声明请求作用域组件

使用 `requestScope` 声明绑定到请求生命周期的组件：

```kotlin
val appModule = module {
    // 单例 - 在所有请求之间共享
    single { UserRepository() }

    // 请求作用域 - 每个请求一个新实例
    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics)
        scopedOf(::UserSessionHandler)
    }
}
```

## 访问请求作用域组件

使用 `call.scope.get()` 来解析请求作用域的依赖项：

```kotlin
routing {
    get("/users/{id}") {
        val requestLogger = call.scope.get<RequestLogger>()
        val metrics = call.scope.get<RequestMetrics>()

        metrics.start()
        requestLogger.log("Processing user request")

        val userId = call.parameters["id"]!!
        val userService = get<UserService>()
        val user = userService.getUser(userId)

        requestLogger.log("Request completed")
        metrics.end()

        call.respond(user)
    }
}
```

## 注入 ApplicationCall

请求作用域组件可以自动注入 `ApplicationCall`：

```kotlin
class RequestLogger(private val call: ApplicationCall) {
    fun log(message: String) {
        val requestPath = call.request.path()
        val method = call.request.httpMethod.value
        println("[$method $requestPath] $message")
    }
}

class UserSessionHandler(private val call: ApplicationCall) {
    fun getUserId(): String? {
        return call.request.headers["X-User-ID"]
    }

    fun isAuthenticated(): Boolean {
        return call.request.headers["Authorization"] != null
    }
}
```

## 作用域生命周期回调

```kotlin
requestScope {
    scoped { RequestContext(get()) }

    // onCreate 回调
    onCreate { requestContext ->
        requestContext.startTime = System.currentTimeMillis()
    }

    // onClose 回调
    onClose { requestContext ->
        val duration = System.currentTimeMillis() - requestContext.startTime
        println("Request completed in ${duration} ms")
    }
}
```

:::note
请求作用域会**为每个 HTTP 请求创建并销毁**。实例不会在请求之间共享，从而确保线程安全并防止状态泄漏。
:::

## 在 Ktor 中声明模块

Koin 提供了便捷的函数，可以直接在 Ktor 应用程序中声明模块。

### 使用 koinModule

内联声明模块：

```kotlin
fun Application.configureRouting() {
    koinModule {
        singleOf(::CustomerRepository)
        singleOf(::CustomerService)
    }

    routing {
        customerRoutes()
    }
}
```

### 使用 koinModules

加载多个现有模块：

```kotlin
fun Application.configureCustomerFeature() {
    koinModules(
        customerRepositoryModule,
        customerServiceModule,
        customerRoutesModule
    )

    routing {
        customerRoutes()
    }
}
```

## 模块化应用程序结构

按功能组织您的 Ktor 应用：

```kotlin
// 功能 1：客户管理
fun Application.customerModule() {
    koinModule {
        singleOf(::CustomerRepository)
        singleOf(::CustomerService)
    }

    routing {
        route("/api/customers") {
            customerRoutes()
        }
    }
}

// 功能 2：订单管理
fun Application.orderModule() {
    koinModule {
        singleOf(::OrderRepository)
        singleOf(::OrderService)
    }

    routing {
        route("/api/orders") {
            orderRoutes()
        }
    }
}

// 主应用程序
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(coreModule)
    }

    customerModule()
    orderModule()
}
```

## 在请求作用域中使用注解

为请求作用域组件使用注解：

```kotlin
@Scope(RequestScope::class)
class RequestLogger(private val call: ApplicationCall) {
    fun log(message: String) {
        println("[${call.request.path()}] $message")
    }
}
```

## 完整示例

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics)

        onCreate { metrics: RequestMetrics ->
            metrics.start()
        }

        onClose { metrics: RequestMetrics ->
            metrics.recordDuration()
        }
    }
}

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    routing {
        get("/api/users/{id}") {
            val logger = call.scope.get<RequestLogger>()
            val userService = get<UserService>()

            logger.log("Fetching user")
            val user = userService.getUser(call.parameters["id"]!!)

            call.respond(user)
        }
    }
}
```

## API 参考

| 函数 | 描述 |
|----------|-------------|
| `requestScope { }` | 声明请求作用域组件 |
| `call.scope.get<T>()` | 获取请求作用域实例 |
| `onCreate { }` | 作用域创建时的回调 |
| `onClose { }` | 作用域关闭时的回调 |
| `koinModule { }` | 声明内联模块 |
| `koinModules(...)` | 加载现有模块 |

## 另请参阅

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** - Ktor 主文档
- **[作用域](/docs/reference/koin-core/scopes)** - 核心作用域概念