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

### 相容於 Ktor 的 DI (4.1)

Koin 4.1 完全支援新的 Ktor 3.2！

我們提取了 `CoreResolver` 以抽象化 Koin 的解析規則，並允許透過 `ResolutionExtension` 進行擴展。我們添加了新的 `KtorDIExtension` 作為 Ktor `ResolutionExtension`，以幫助 Koin 解析 Ktor 預設的 DI 實例。

Koin Ktor 插件會自動設定 Ktor DI 整合。下面，您可以看看如何從 Koin 消費 Ktor 依賴項：
```kotlin
// let's define a Ktor object
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}
```

```kotlin
// let's inject it in a Koin definition
class CustomerRepositoryImpl(private val database: Database) : CustomerRepository

    fun Application.customerDataModule() {
        koinModule {
            singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
        }
}
```

## 在 Ktor 中注入

Koin 的 `inject()` 和 `get()` 函數可從 `Application`、`Route` 和 `Routing` 類別中取得：

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

### 從 Ktor 請求作用域解析 (自 4.1 版本起)

您可以宣告元件以存在於 Ktor 請求作用域的生命週期內。為此，您只需在 `requestScope` 區塊內宣告您的元件。假設有一個 `ScopeComponent` 類別需要在 Ktor 網頁請求作用域中實例化，讓我們來宣告它：

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

這允許您的作用域依賴項將 `ApplicationCall` 解析為作用域的解析來源。您可以直接將其注入到建構函式中：

```kotlin
class ScopeComponent(val call : ApplicationCall) {
}
```

:::note
對於每個新請求，作用域將會被重新建立。這會為每個請求建立並銷毀作用域實例。
:::

### 在 Ktor 模組中宣告 Koin 模組 (4.1)

直接在您的應用程式設定中使用 `Application.koinModule {}` 或 `Application.koinModules()`，以在 Ktor 模組中宣告新的模組：

```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
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