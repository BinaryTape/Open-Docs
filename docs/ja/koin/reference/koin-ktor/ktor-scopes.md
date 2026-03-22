---
title: リクエストスコープ (Request Scopes)
---

# Ktor におけるリクエストスコープ (Request Scopes in Ktor)

リクエストスコープは、単一の HTTP リクエストの間だけ存続するインスタンスを作成します。これは、リクエスト固有のデータや処理に最適です。

## リクエストスコープのコンポーネントの宣言

`requestScope` を使用して、リクエストのライフサイクルに紐付いたコンポーネントを宣言します。

```kotlin
val appModule = module {
    // シングルトン - すべてのリクエストで共有される
    single { UserRepository() }

    // リクエストスコープ - リクエストごとに新しいインスタンス
    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics)
        scopedOf(::UserSessionHandler)
    }
}
```

## リクエストスコープのコンポーネントへのアクセス

リクエストスコープの依存関係を解決するには、`call.scope.get()` を使用します。

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

## ApplicationCall のインジェクション

リクエストスコープのコンポーネントは、`ApplicationCall` を自動的にインジェクトできます。

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

## スコープのライフサイクルコールバック

```kotlin
requestScope {
    scoped { RequestContext(get()) }

    // onCreate コールバック
    onCreate { requestContext ->
        requestContext.startTime = System.currentTimeMillis()
    }

    // onClose コールバック
    onClose { requestContext ->
        val duration = System.currentTimeMillis() - requestContext.startTime
        println("Request completed in ${duration}ms")
    }
}
```

:::note
リクエストスコープは **各 HTTP リクエストごとに作成および破棄されます**。インスタンスはリクエスト間で共有されないため、スレッドセーフが確保され、状態のリーク（state leakage）を防ぐことができます。
:::

## Ktor でのモジュールの宣言

Koin は、Ktor アプリケーション内で直接モジュールを宣言するための便利な関数を提供しています。

### koinModule の使用

モジュールをインラインで宣言します。

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

### koinModules の使用

既存の複数のモジュールをロードします。

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

## モジュール化されたアプリケーション構造

機能ごとに Ktor アプリを整理します。

```kotlin
// 機能 1: 顧客管理
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

// 機能 2: 注文管理
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

// メインアプリケーション
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(coreModule)
    }

    customerModule()
    orderModule()
}
```

## アノテーションを使用したリクエストスコープ

リクエストスコープのコンポーネントにアノテーションを使用します。

```kotlin
@Scope(RequestScope::class)
class RequestLogger(private val call: ApplicationCall) {
    fun log(message: String) {
        println("[${call.request.path()}] $message")
    }
}
```

## 完全な例

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

## API リファレンス

| 関数 | 説明 |
|----------|-------------|
| `requestScope { }` | リクエストスコープのコンポーネントを宣言する |
| `call.scope.get<T>()` | リクエストスコープのインスタンスを取得する |
| `onCreate { }` | スコープ作成時のコールバック |
| `onClose { }` | スコープ終了時のコールバック |
| `koinModule { }` | インラインモジュールを宣言する |
| `koinModules(...)` | 既存のモジュールをロードする |

## 関連項目

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** - Ktor のメインドキュメント
- **[スコープ (Scopes)](/docs/reference/koin-core/scopes)** - コアスコープの概念