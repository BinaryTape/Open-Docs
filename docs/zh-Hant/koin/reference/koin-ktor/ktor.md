---
title: Ktor 中的相依注入
---

`koin-ktor` 模組致力於為 Ktor 引入相依注入。

## 安裝 Koin 外掛程式

要在 Ktor 中啟動 Koin 容器，只需按照以下方式安裝 `Koin` 外掛程式：

```kotlin
fun Application.main() {
    // 安裝 Koin
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

### 相容於 Ktor 的 DI (4.1)

Koin 4.1 完全支援最新的 Ktor 3.2！

我們提取了 CoreResolver 來抽象化 Koin 的解析規則，並允許透過 ResolutionExtension 進行擴充。我們新增了 KtorDIExtension 作為 Ktor ResolutionExtension，以協助 Koin 解析 Ktor 的預設 DI 執行個體。

Koin Ktor 外掛程式會自動地設定 Ktor DI 整合。請參見下方如何從 Koin 中取用 Ktor 相依性：
```kotlin
// 讓我們定義一個 Ktor 物件
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}
```

```kotlin
// 讓我們將其注入到 Koin 定義中
class CustomerRepositoryImpl(private val database: Database) : CustomerRepository

    fun Application.customerDataModule() {
        koinModule {
            singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
        }
}
```

## 在 Ktor 中進行注入

Koin 的 `inject()` 與 `get()` 函式可在 `Application`、`Route` 及 `Routing` 類別中使用：

```kotlin
fun Application.main() {

    // 注入 HelloService
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### 從 Ktor 請求作用域中解析 (自 4.1 起)

您可以宣告組件存在於 Ktor 請求作用域的時間軸內。為此，您只需在 `requestScope` 區段中宣告您的組件。假設有一個 `ScopeComponent` 類別要在 Ktor Web 請求作用域上具現化，讓我們來宣告它：

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

接著在您的 HTTP 呼叫中，只需呼叫 `call.scope.get()` 即可解析正確的相依性：

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

這讓您的作用域相依性能夠將 `ApplicationCall` 解析為您解析作業的作用域來源。您可以直接將其注入到建構函式中：

```kotlin
class ScopeComponent(val call : ApplicationCall) {
}
```

:::note
對於每個新請求，作用域都會重新建立。這會為每個請求建立並丟棄作用域執行個體
:::

### 在 Ktor 模組中宣告 Koin 模組 (4.1)

在您的應用程式設定中直接使用 `Application.koinModule {}` 或 `Application.koinModules()`，即可在 Ktor 模組內宣告新模組：

```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```

### Ktor 事件

您可以監聽 KTor Koin 事件：

```kotlin
fun Application.main() {
    // ...

    // 安裝 Ktor 功能
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