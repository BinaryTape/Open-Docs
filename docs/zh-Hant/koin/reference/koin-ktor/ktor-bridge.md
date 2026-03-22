---
title: DI 橋接器
---

# Ktor DI 橋接器

Koin 4.2+ 透過可配置的橋接器 (bridge)，與 **Ktor 3.4+** 內建的相依注入系統提供無縫整合。

:::info 實驗功能
Ktor DI 橋接器是一項實驗功能，可在 Koin 與 Ktor DI 之間實現雙向的相依性解析。
:::

## 橋接器配置

使用 `bridge { }` DSL 來啟用雙向相依性解析：

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()  // Ktor DI 可以解析 Koin 相依性
            koinToKtor()  // Koin 可以解析 Ktor DI 相依性
        }

        modules(appModule)
    }

    // Ktor DI 相依性
    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }
}
```

## 橋接器選項

| 選項 | 說明 |
|--------|-------------|
| `ktorToKoin()` | 允許 Ktor 的 `by dependencies` 委託從 Koin 進行解析 |
| `koinToKtor()` | 允許 Koin 的 `inject()` 與 `get()` 從 Ktor DI 進行解析 |

## 使用 ktorToKoin()

使用 Ktor 的 `by dependencies` 委託來解析 Koin 相依性：

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            ktorToKoin()
        }
        modules(module {
            single<HelloService> { HelloServiceImpl() }
        })
    }

    routing {
        get("/hello") {
            // 使用 Ktor 的委託解析 Koin 相依性
            val helloService: HelloService by dependencies
            call.respondText(helloService.sayHello())
        }
    }
}
```

## 使用 koinToKtor()

使用 Koin 的 `inject()` 來解析 Ktor DI 相依性：

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            koinToKtor()
        }
        modules(appModule)
    }

    // 在 Ktor DI 中宣告
    dependencies {
        provide<DatabaseConnection> { DatabaseConnectionImpl() }
    }

    routing {
        get("/data") {
            // 使用 Koin 解析 Ktor DI 相依性
            val database: DatabaseConnection by inject()
            call.respondText(database.query())
        }
    }
}
```

## 全雙向範例

同時啟用兩個方向以獲得最大的靈活性：

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()
            koinToKtor()
        }

        modules(module {
            single<HelloService> { HelloServiceImpl() }
        })
    }

    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }

    routing {
        // 兩者皆使用 Koin 的 inject()
        get("/mixed-koin") {
            val helloService: HelloService by inject()        // 來自 Koin
            val ktorService: KtorSpecificService by inject()  // 來自 Ktor DI
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }

        // 兩者皆使用 Ktor 的 dependencies 委託
        get("/mixed-ktor") {
            val helloService: HelloService by dependencies        // 來自 Koin
            val ktorService: KtorSpecificService by dependencies  // 來自 Ktor DI
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }
    }
}
```

## 架構模式

將基礎結構與應用程式邏輯分離：

- **Ktor DI** - 架構層級的相依性 (資料庫、配置、基礎結構)
- **Koin** - 應用程式層級的相依性 (存儲庫、服務、使用案例)

```kotlin
fun Application.module() {
    // Ktor DI - 基礎結構層
    val config = environment.config
    val database = Database(config)
    dependencies {
        provide<Database> { database }
        provide<ApplicationConfig> { config }
    }

    // Koin - 應用程式層
    install(Koin) {
        slf4jLogger()

        bridge {
            koinToKtor()  // Koin 可以解析基礎結構相依性
        }

        modules(appModule)
    }
}

val appModule = module {
    // 這些可以透過橋接器從 Ktor DI 注入 Database
    singleOf(::CustomerRepository)
    singleOf(::OrderRepository)
    singleOf(::CustomerService)
}
```

## 最佳實務

1. **Ktor DI 中的基礎結構** - 資料庫連線、配置、外部用戶端
2. **Koin 中的商業邏輯** - 存儲庫、服務、使用案例
3. **僅啟用所需的方向** - 除非必要，否則僅使用 `koinToKtor()`，不要同時使用兩者
4. **記錄邊界** - 明確標註哪個系統擁有哪些相依性

## 配合隔離上下文

此橋接器也適用於 `KoinIsolated`：

```kotlin
fun Application.module() {
    dependencies {
        provide<Database> { Database(environment.config) }
    }

    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()
        }

        modules(appModule)
    }
}
```

## 另請參閱

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** - 主要的 Ktor 文件
- **[隔離上下文](/docs/reference/koin-ktor/ktor-isolated)** - 隔離的 Koin 執行個體