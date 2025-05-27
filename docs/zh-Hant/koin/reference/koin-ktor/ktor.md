---
title: Dependency Injection 在 Ktor 中
---

`koin-ktor` 模組致力於為 Ktor 帶來依賴注入功能。

## 安裝 Koin 插件

要在 Ktor 中啟動 Koin 容器，只需依照以下方式安裝 `Koin` 插件：

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

Koin 的 `inject()` 和 `get()` 函數可從 `Application`、`Route`、`Routing` 類別中取得：

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

### 從 Ktor 請求作用域解析 (自 4.1.0 版本起)

您可以宣告元件以存在於 Ktor 請求作用域的生命週期內。為此，您只需在 `requestScope` 區塊內宣告您的元件。假設有一個 `ScopeComponent` 類別需要實例化在 Ktor 網頁請求作用域中，讓我們來宣告它：

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

然後從您的 HTTP 呼叫中，只需呼叫 `call.scope.get()` 即可解析正確的依賴項：

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

:::note
對於每個新請求，作用域將會被重新建立。這會為每個請求建立並銷毀作用域實例。
:::

### 從外部 Ktor 模組執行 Koin

對於一個 Ktor 模組，您可以載入特定的 Koin 模組。只需使用 `koin { }` 函數宣告它們：

```kotlin
fun Application.module2() {

    koin {
        // load koin modules
        modules(appModule2)
    }

}
```

### Ktor 事件

您可以監聽 Ktor Koin 事件：

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
```