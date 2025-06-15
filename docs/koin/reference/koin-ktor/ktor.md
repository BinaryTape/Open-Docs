---
title: Ktor 中的依赖注入
---

`koin-ktor` 模块致力于为 Ktor 提供依赖注入。

## 安装 Koin 插件

要在 Ktor 中启动 Koin 容器，只需按如下方式安装 `Koin` 插件：

```kotlin
fun Application.main() {
    // Install Koin
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

### 兼容 Ktor 的 DI (4.1)

Koin 4.1 完全支持新的 Ktor 3.2！

我们提取了 `CoreResolver` 来抽象 Koin 的解析规则，并允许通过 `ResolutionExtension` 进行扩展。我们添加了新的 `KtorDIExtension` 作为 Ktor 的 `ResolutionExtension`，以帮助 Koin 解析 Ktor 默认的 DI 实例。

Koin Ktor 插件会自动设置 Ktor DI 集成。下面，你可以看到如何从 Koin 中消费 Ktor 依赖项：
```kotlin
// 让我们定义一个 Ktor 对象
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}
```

```kotlin
// 让我们将其注入到 Koin 定义中
class CustomerRepositoryImpl(private val database: Database) : CustomerRepository

    fun Application.customerDataModule() {
        koinModule {
            singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
        }
}
```

## 在 Ktor 中注入

Koin 的 `inject()` 和 `get()` 函数可从 `Application`、`Route` 和 `Routing` 类中获得：

```kotlin
fun Application.main() {

    // inject HelloService
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### 从 Ktor 请求作用域中解析 (4.1 起)

您可以声明组件使其在 Ktor 请求作用域的生命周期内存在。为此，您只需在 `requestScope` 部分中声明您的组件。假设有一个要在 Ktor Web 请求作用域上实例化的 `ScopeComponent` 类，我们来声明它：

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

然后从您的 HTTP 调用中，只需调用 `call.scope.get()` 来解析正确的依赖项：

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

这允许您的作用域依赖项将 `ApplicationCall` 解析为作用域的解析源。您可以直接将其注入到构造函数中：

```kotlin
class ScopeComponent(val call : ApplicationCall) {
}
```

:::note
对于每个新请求，作用域都将被重新创建。这会为每个请求创建并销毁作用域实例。
:::

### 在 Ktor 模块中声明 Koin 模块 (4.1)

直接在您的应用设置中使用 `Application.koinModule {}` 或 `Application.koinModules()`，以在 Ktor 模块中声明新的模块：

```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```

### Ktor 事件

您可以监听 Ktor Koin 事件：

```kotlin
fun Application.main() {
    // ...

    // Install Ktor features
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin 已启动。")
    }

    environment.monitor.subscribe(KoinApplicationStopPreparing) {
        log.info("Koin 正在停止...")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin 已停止。")
    }

    //...
}
```