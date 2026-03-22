---
title: 隔離上下文
---

# Ktor 中的隔離上下文

`KoinIsolated` 外掛程式在隔離上下文中執行 Koin，與全域 Koin 執行個體分開。這對於測試、多租戶應用程式以及執行多個 Koin 執行個體非常有用。

## 何時使用隔離上下文

- **測試** — 每個測試都獲得自己隔離的 Koin 執行個體
- **多租戶應用程式** — 具有不同配置的不同租戶
- **外掛程式/模組系統** — 具有其自身相依性的獨立模組
- **嵌入式 Ktor 伺服器** — 在同一個 JVM 中執行多個 Ktor 執行個體

## 基本設定

安裝 `KoinIsolated` 而非 `Koin`：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 全域與隔離上下文

### 全域上下文 (預設)

```kotlin
// 使用 GlobalContext - 在應用程式中共享
install(Koin) {
    modules(appModule)
}

// 可以透過 GlobalContext 在任何地方存取 Koin
val service = GlobalContext.get().get<UserService>()
```

### 隔離上下文

```kotlin
// 使用隔離上下文 - 無法透過 GlobalContext 存取
install(KoinIsolated) {
    modules(appModule)
}

// GlobalContext.get() 將不會傳回此 Koin 執行個體
// 僅能在 Ktor 應用程式作用域內存取
```

:::warning
使用 `KoinIsolated` 時，您無法透過 `GlobalContext` 存取 Koin。所有注入都必須在 Ktor 應用程式作用域內使用 `inject()` 或 `get()` 進行。
:::

## 完整範例

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
    }
}

fun Application.main() {
    // 以隔離模式安裝 Koin
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // 在 Application 作用域內可以進行注入
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

## 配合 DI 橋接

隔離上下文也支援 Ktor DI 橋接：

```kotlin
fun Application.main() {
    // Ktor DI - 基礎結構
    val database = Database(environment.config)
    dependencies {
        provide<Database> { database }
    }

    // 帶有橋接的 Koin Isolated
    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()  // 允許 Koin 從 Ktor DI 中解析
        }

        modules(appModule)
    }

    routing {
        userRoutes()
    }
}

val appModule = module {
    // 可以透過橋接從 Ktor DI 注入 Database
    singleOf(::UserRepository)
    singleOf(::UserService)
}
```

## 使用隔離上下文進行測試

隔離上下文對於測試特別有用：

```kotlin
class UserServiceTest {
    @Test
    fun `test user endpoint`() = testApplication {
        application {
            // 每個測試獲得其專屬的隔離 Koin 執行個體
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

### 並行測試執行

使用隔離上下文，測試可以並行執行而不會互相干擾：

```kotlin
class ParallelTests {
    @Test
    fun `test A`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleA)  // 專屬的隔離執行個體
            }
        }
        // ...
    }

    @Test
    fun `test B`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleB)  // 不同的隔離執行個體
            }
        }
        // ...
    }
}
```

## 多個 Ktor 伺服器

執行具有獨立 Koin 執行個體的多個 Ktor 伺服器：

```kotlin
fun main() {
    // 伺服器 1 - 使用者服務
    val userServer = embeddedServer(Netty, port = 8080) {
        install(KoinIsolated) {
            modules(userServiceModule)
        }
        userRouting()
    }

    // 伺服器 2 - 訂單服務 (不同的 Koin 執行個體)
    val orderServer = embeddedServer(Netty, port = 8081) {
        install(KoinIsolated) {
            modules(orderServiceModule)
        }
        orderRouting()
    }

    // 兩個伺服器都有獨立的 Koin 容器
    userServer.start(wait = false)
    orderServer.start(wait = true)
}
```

## 生命週期

隔離的 Koin 執行個體遵循 Ktor 應用程式的生命週期：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // 監控 Koin 生命週期
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Isolated Koin started")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Isolated Koin stopped")
    }
}
```

## 存取隔離的 Koin 執行個體

在 Ktor 應用程式中，您可以存取隔離的 Koin 執行個體：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        modules(appModule)
    }

    // 從 Application 存取 Koin 執行個體
    val koin = getKoin()

    // 或透過外掛程式屬性
    val koinApp = attributes[KoinPluginKey]
}
```

## 何時不要使用隔離上下文

- **單一 Ktor 應用程式** — 全域上下文更簡單
- **跨模組共享相依性** — 全域上下文允許共享
- **存取 Koin 的背景工作** — 它們需要 GlobalContext

## 最佳實務

1. **用於測試** — 隔離上下文可防止測試干擾
2. **用於多租戶** — 每個租戶可以有不同的配置
3. **對於簡單應用程式，請避免使用** — 全域上下文對於大多數使用案例來說更簡單
4. **記錄選擇原因** — 明確說明為什麼使用隔離上下文

## 另請參閱

- **[Ktor 整合](/docs/reference/koin-ktor/ktor)** — 主要 Ktor 文件
- **[上下文隔離](/docs/reference/koin-core/context-isolation)** — 核心隔離概念
- **[測試](/docs/reference/koin-test/testing)** — 使用 Koin 進行測試