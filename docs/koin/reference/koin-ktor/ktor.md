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

## 在 Ktor 中注入

Koin 的 `inject()` 和 `get()` 函数可从 `Application`、`Route`、`Routing` 类中获得：

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

### 从 Ktor 请求作用域中解析 (4.1.0 起)

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

:::note
对于每个新请求，作用域都将被重新创建。这会为每个请求创建并销毁作用域实例。
:::

### 从外部 Ktor 模块运行 Koin

对于一个 Ktor 模块，您可以加载特定的 Koin 模块。只需使用 `koin { }` 函数来声明它们：

```kotlin
fun Application.module2() {

    koin {
        // load koin modules
        modules(appModule2)
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
        log.info("Koin started.")
    }

    environment.monitor.subscribe(KoinApplicationStopPreparing) {
        log.info("Koin stopping...")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped.")
    }

    //...
}