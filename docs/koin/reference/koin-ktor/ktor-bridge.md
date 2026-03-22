---
title: DI 桥接
---

# Ktor DI 桥接

Koin 4.2+ 通过可配置的桥接，提供了与 **Ktor 3.4+** 内置依赖项注入系统的无缝集成。

:::info 实验性功能
Ktor DI 桥接是一项实验性功能，可实现 Koin 与 Ktor DI 之间的双向依赖项解析。
:::

## 桥接配置

使用 `bridge { }` DSL 来启用双向依赖项解析：

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()  // Ktor DI 可以解析 Koin 依赖项
            koinToKtor()  // Koin 可以解析 Ktor DI 依赖项
        }

        modules(appModule)
    }

    // Ktor DI 依赖项
    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }
}
```

## 桥接选项

| 选项 | 描述 |
|--------|-------------|
| `ktorToKoin()` | 允许 Ktor 的 `by dependencies` 委托从 Koin 中解析 |
| `koinToKtor()` | 允许 Koin 的 `inject()` 和 `get()` 从 Ktor DI 中解析 |

## 使用 ktorToKoin()

使用 Ktor 的 `by dependencies` 委托解析 Koin 依赖项：

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
            // 使用 Ktor 的委托解析 Koin 依赖项
            val helloService: HelloService by dependencies
            call.respondText(helloService.sayHello())
        }
    }
}
```

## 使用 koinToKtor()

使用 Koin 的 `inject()` 解析 Ktor DI 依赖项：

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            koinToKtor()
        }
        modules(appModule)
    }

    // 在 Ktor DI 中声明
    dependencies {
        provide<DatabaseConnection> { DatabaseConnectionImpl() }
    }

    routing {
        get("/data") {
            // 使用 Koin 解析 Ktor DI 依赖项
            val database: DatabaseConnection by inject()
            call.respondText(database.query())
        }
    }
}
```

## 完整双向示例

启用两个方向以获得最大的灵活性：

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
        // 对两者都使用 Koin 的 inject()
        get("/mixed-koin") {
            val helloService: HelloService by inject()        // 来自 Koin
            val ktorService: KtorSpecificService by inject()  // 来自 Ktor DI
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }

        // 对两者都使用 Ktor 的 dependencies 委托
        get("/mixed-ktor") {
            val helloService: HelloService by dependencies        // 来自 Koin
            val ktorService: KtorSpecificService by dependencies  // 来自 Ktor DI
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }
    }
}
```

## 架构模式

将基础架构与应用程序逻辑分离：

- **Ktor DI** - 框架级依赖项（数据库、配置、基础架构）
- **Koin** - 应用程序级依赖项（仓库、服务、用例）

```kotlin
fun Application.module() {
    // Ktor DI - 基础架构层
    val config = environment.config
    val database = Database(config)
    dependencies {
        provide<Database> { database }
        provide<ApplicationConfig> { config }
    }

    // Koin - 应用程序层
    install(Koin) {
        slf4jLogger()

        bridge {
            koinToKtor()  // Koin 可以解析基础架构依赖项
        }

        modules(appModule)
    }
}

val appModule = module {
    // 这些可以通过桥接从 Ktor DI 注入 Database
    singleOf(::CustomerRepository)
    singleOf(::OrderRepository)
    singleOf(::CustomerService)
}
```

## 最佳做法

1. **在 Ktor DI 中存放基础架构** - 数据库连接、配置、外部客户端。
2. **在 Koin 中存放业务逻辑** - 仓库、服务、用例。
3. **仅启用需要的方向** - 除非必要，否则仅使用 `koinToKtor()`，不要同时启用两者。
4. **记录边界** - 明确哪个系统拥有哪些依赖项。

## 使用隔离上下文

该桥接也适用于 `KoinIsolated`：

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

## 另请参阅

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** - 主要 Ktor 文档
- **[隔离上下文](/docs/reference/koin-ktor/ktor-isolated)** - 隔离的 Koin 实例