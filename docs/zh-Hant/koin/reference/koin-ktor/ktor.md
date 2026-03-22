---
title: Koin for Ktor
---

`koin-ktor` 模組為 Ktor 應用程式提供相依注入整合，可與 Ktor 內建的 DI 系統協同工作。

## 為什麼在 Ktor 中使用 Koin？

Ktor 3.4+ 包含內建的 DI 系統。以下是兩者的比較：

| 功能 | Ktor DI | Koin |
|---------|---------|------|
| 基本注入 | 是 | 是 |
| 限定詞 (`@Named`) | 是 | 是 |
| 屬性注入 | 是 (`@Property`) | 是 |
| 可 null／選用相依性 | 是 | 是 |
| 作用域 (請求、自訂) | 否 | 是 |
| 模組組織 | 否 | 是 |
| 延遲載入模組 | 否 | 是 |
| 基於註解的元件 | 否 | 是 |
| 編譯器外掛程式驗證 | 否 | 是 |

### Ktor DI 的限制

- **無作用域功能**：沒有請求或自訂作用域，僅具有帶有清理順序的類單例行為。
- **無基於註解的元件**：不像 Koin Annotations 具備 `@Singleton`、`@Factory` 元件掃描功能。
- **無編譯期驗證**：沒有編譯器外掛程式可在執行前驗證 DI 配置。
- **有限的參數化型別**：無法跨型別引數子型別解析參數化型別。

**何時使用 Koin：**
- 需要作用域相依性（請求作用域、自訂作用域）
- 基於模組的組織
- 基於註解的元件掃描
- 透過編譯器外掛程式進行編譯期驗證

**何時 Ktor DI 就足夠了：**
- 相依性較少的簡單應用程式
- 無作用域需求
- 基本的限定詞需求

## 設定

新增 Koin Ktor 相依性：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version") // 選用
}
```

## 宣告相依性

Koin 支援多種 DSL 方式。

### 編譯器外掛程式 DSL

最簡單的語法：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

### 註解

類似 Spring 且具備編譯期驗證：

```kotlin
@Module
@ComponentScan("com.example")
class AppModule

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserService(private val repository: UserRepository)
```

### 傳統 DSL

建構函式參照：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)
}
```

## 安裝 Koin 外掛程式

在您的 `Application` 模組中安裝 Koin：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

### 完整配置

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        fileProperties("/application.conf")
        modules(
            networkModule,
            repositoryModule,
            serviceModule
        )
        createEagerInstances()
    }
}
```

## 相依注入

Koin 為 Ktor 的核心型別提供擴充函式。

### 注入點

`inject()` 與 `get()` 可在以下位置使用：
- `Application`
- `Route`
- `Routing`
- `ApplicationCall`（在路由處理常式內）

### 應用程式層級

```kotlin
fun Application.main() {
    val helloService by inject<HelloService>()  // 延遲載入
    val configService = get<ConfigService>()     // 預先載入

    routing {
        get("/hello") {
            call.respondText(helloService.sayHello())
        }
    }
}
```

### 路由層級

```kotlin
fun Route.customerRoutes() {
    val customerService by inject<CustomerService>()

    get("/customers") {
        call.respond(customerService.getAllCustomers())
    }

    get("/customers/{id}") {
        val id = call.parameters["id"]?.toInt()
            ?: return@get call.respond(HttpStatusCode.BadRequest)
        call.respond(customerService.getCustomer(id))
    }
}
```

### 請求處理常式

```kotlin
routing {
    get("/users/{id}") {
        val userService = get<UserService>()
        val userId = call.parameters["id"]!!
        call.respond(userService.getUser(userId))
    }
}
```

## Ktor 事件

監聽 Koin 生命週期事件：

| 事件 | 描述 |
|-------|-------------|
| `KoinApplicationStarted` | Koin 容器已啟動 |
| `KoinApplicationStopPreparing` | Koin 正準備停止 |
| `KoinApplicationStopped` | Koin 容器已停止 |

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started")
        get<CacheWarmer>().warmUp()
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped")
    }
}
```

## 快速參考

| 函式 | 描述 |
|----------|-------------|
| `install(Koin) { }` | 安裝 Koin 外掛程式 |
| `inject<T>()` | 延遲注入 |
| `get<T>()` | 預先注入 |
| `koinModule { }` | 宣告內嵌模組 |
| `koinModules(...)` | 載入現有模組 |

## 文件

| 主題 | 描述 |
|-------|-------------|
| **[DI 橋接](/docs/reference/koin-ktor/ktor-bridge)** | Koin ↔ Ktor DI 整合 |
| **[請求作用域](/docs/reference/koin-ktor/ktor-scopes)** | 請求作用域相依性 |
| **[測試](/docs/reference/koin-ktor/ktor-testing)** | 使用 Koin 測試 Ktor |
| **[隔離內容](/docs/reference/koin-ktor/ktor-isolated)** | 隔離的 Koin 執行個體 |

## 相關內容

- **[教學：Ktor](/docs/quickstart/ktor)** – 逐步教學
- **[教學：使用註解的 Ktor](/docs/quickstart/ktor-annotations)** – 註解教學
- **[Koin Annotations](/docs/reference/koin-annotations/start)** – 註解參考
- **[Ktor 文件](https://ktor.io/)** – Ktor 官方文件