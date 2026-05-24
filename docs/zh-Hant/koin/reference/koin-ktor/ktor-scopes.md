---
title: Request Scopes
---

# Ktor 中的 Request Scopes

Request scopes 會在單次 HTTP 請求期間建立執行個體，這非常適合處理特定請求的資料與程序。

## 宣告 Request-Scoped 組件

使用 `requestScope` 來宣告繫結至請求生命週期的組件：

```kotlin
val appModule = module {
    // Singleton - 在所有請求之間共用
    single { UserRepository() }

    // Request scope - 每個請求建立新的執行個體
    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics)
        scopedOf(::UserSessionHandler)
    }
}
```

## 存取 Request-Scoped 組件

使用 `call.scope.get()` 來解析 request-scoped 相依性：

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

Request-scoped 組件可以自動注入 `ApplicationCall`：

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

## Scope 生命周期回呼

將 `onClose` 回呼附加至 `scoped` 定義，以便在 request scope 關閉時執行清理作業。`onClose` 是該定義上的中置函式（infix function）（而非 `requestScope { }` 內部的區塊），且其執行個體參數為可 null (`T?`)：

```kotlin
requestScope {
    scoped { RequestContext() } onClose { context ->
        val duration = System.currentTimeMillis() - (context?.startTime ?: 0L)
        println("Request completed in ${duration}ms")
    }
}
```

您也可以使用 `withOptions { onClose { ... } }`：

```kotlin
requestScope {
    scoped { RequestContext() } withOptions {
        onClose { context ->
            context?.cleanup()
        }
    }
}
```

:::note
Koin 的 scope DSL 為每個定義公開了 `onClose`；但沒有 `onCreate` 回呼。初始化應在 `scoped { }` 建構函式區塊中進行。
:::

:::note
Request scopes 會為 **每個 HTTP 請求建立並銷毀**。執行個體不會在請求之間共用，以確保執行緒安全並防止狀態洩漏。
:::

## 在 Ktor 中宣告模組

Koin 提供了便利的函式，可以直接在您的 Ktor 應用程式中宣告模組。

### 使用 koinModule

內嵌宣告模組：

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

載入多個現有的模組：

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

## 模組化應用程式結構

依功能組織您的 Ktor 應用程式：

```kotlin
// 功能 1：客戶管理
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

// 功能 2：訂單管理
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

// 主應用程式
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(coreModule)
    }

    customerModule()
    orderModule()
}
```

## 配合註解使用 Request Scope

對 request-scoped 組件使用註解：

```kotlin
@Scope(RequestScope::class)
class RequestLogger(private val call: ApplicationCall) {
    fun log(message: String) {
        println("[${call.request.path()}] $message")
    }
}
```

## 完整範例

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics) onClose { metrics ->
            metrics?.recordDuration()
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

## API 參考

| 函式 | 描述 |
|----------|-------------|
| `requestScope { }` | 宣告 request-scoped 組件 |
| `call.scope.get<T>()` | 取得 request-scoped 執行個體 |
| `scoped { } onClose { }` | 每個定義的清理回呼（執行個體為可 null） |
| `koinModule { }` | 宣告內嵌模組 |
| `koinModules(...)` | 載入現有模組 |

## 另請參閱

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** – 主要 Ktor 文件
- **[Scopes](/docs/reference/koin-core/scopes)** – 核心 Scope 概念