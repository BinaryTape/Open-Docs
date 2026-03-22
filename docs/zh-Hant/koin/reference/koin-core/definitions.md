---
title: 定義
---

# 定義

定義宣告了 Koin 如何建立與管理您的相依性。本指南涵蓋了使用 DSL 和註解 (Annotation) 的所有定義型別。

## 定義型別

| 型別 | DSL | 註解 | 生命週期 | 使用案例 |
|------|-----|------------|-----------|----------|
| Singleton | `single()` | `@Singleton` | 在應用程式生命週期內僅有一個執行個體 | Service、存儲庫 (repository)、資料庫 |
| Factory | `factory()` | `@Factory` | 每次請求時建立新執行個體 | Presenter、使用案例 (use case)、具狀態的物件 |
| Scoped | `scoped()` | `@Scoped` | 每個作用域 (scope) 一個執行個體 | 繫結至 Activity 或工作階段 (session) 的物件 |
| ViewModel | `viewModel()` | `@KoinViewModel` | Android ViewModel 生命週期 | ViewModel |

## 宣告定義

### 編譯器外掛程式 DSL（推薦）

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // Singleton
    single<Database>()
    single<UserRepository>()

    // Factory - 每次請求時建立新執行個體
    factory<UserPresenter>()

    // ViewModel
    viewModel<UserViewModel>()
}
```

### 註解

```kotlin
@Singleton  // 或 @Single
class Database

@Singleton
class UserRepository(private val database: Database)

@Factory
class UserPresenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 經典 DSL

```kotlin
val appModule = module {
    // 使用建構函式參照（自動裝配）
    singleOf(::Database)
    singleOf(::UserRepository)
    factoryOf(::UserPresenter)
    viewModelOf(::UserViewModel)

    // 使用 Lambda（手動裝配）
    single { Database() }
    single { UserRepository(get()) }
    factory { UserPresenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## 定義比較

| 概念 | 編譯器外掛程式 DSL | 經典 DSL | 註解 |
|---------|---------------------|-------------|------------|
| Singleton | `single<MyClass>()` | `singleOf(::MyClass)` | `@Singleton` / `@Single` |
| Factory | `factory<MyClass>()` | `factoryOf(::MyClass)` | `@Factory` |
| Scoped | `scoped<MyClass>()` | `scopedOf(::MyClass)` | `@Scoped` |
| ViewModel | `viewModel<MyVM>()` | `viewModelOf(::MyVM)` | `@KoinViewModel` |
| Worker | `worker<MyWorker>()` | `workerOf(::MyWorker)` | `@KoinWorker` |

:::info
編譯器外掛程式正在分析您的類別和函式參數，以產生對 Koin 的正確呼叫並使用 `get()` 函式，您不再需要手動撰寫。
:::

## Single (Singleton)

建立一個在整個應用程式中重複使用的執行個體：

```kotlin
// DSL
single<DatabaseHelper>()

// 註解
@Singleton
class DatabaseHelper
```

兩者產生的結果相同：一個在所有取用者之間共用的單一執行個體。

## Factory

每次都建立一個新執行個體：

```kotlin
// DSL
factory<UserPresenter>()

// 註解
@Factory
class UserPresenter(private val repository: UserRepository)
```

## Scoped

每個作用域建立一個執行個體：

```kotlin
// DSL
scope<MyActivity> {
    scoped<ActivityPresenter>()
}

// 註解
@Scoped(MyActivityScope::class)
class ActivityPresenter
```

## ViewModel

具備適當生命週期的 Android ViewModel：

```kotlin
// DSL
viewModel<UserViewModel>()

// 註解
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## 介面繫結

### 編譯器外掛程式 DSL

```kotlin
single<UserRepositoryImpl>() bind UserRepository::class

// 多重繫結
single<MyServiceImpl>() binds arrayOf(ServiceA::class, ServiceB::class)
```

### 經典 DSL

```kotlin
singleOf(::UserRepositoryImpl) bind UserRepository::class

// 或使用 Lambda
single<UserRepository> { UserRepositoryImpl(get()) }
```

### 註解

當您的類別實作介面時，**介面繫結是自動進行的**：

```kotlin
@Singleton
class UserRepositoryImpl(
    private val database: Database
) : UserRepository  // 自動繫結至 UserRepository
```

對於明確繫結：

```kotlin
@Singleton
@Binds(UserRepository::class)
class UserRepositoryImpl : UserRepository
```

## 限定詞（命名定義）

當您有相同型別的多個定義時。有關檢索方式，請參閱 [使用限定詞進行注入](/docs/reference/koin-core/injection#injection-with-qualifiers)。

### 編譯器外掛程式 DSL

使用編譯器外掛程式 DSL 時，您需要使用 `@Named` 進行註解以使用字串限定詞（就像您之前使用 `named()` 一樣）

```kotlin
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)

single<LocalDatabase>()
single<RemoteDatabase>()
single<UserRepository>()

// 用法
val localDb: Database = get(named("local"))
```

### 經典 DSL

```kotlin
single<Database>(named("local")) { LocalDatabase() }
single<Database>(named("remote")) { RemoteDatabase() }

// 用法
val localDb: Database = get(named("local"))
```

### 註解

```kotlin
@Singleton
@Named("local")
class LocalDatabase : Database

@Singleton
@Named("remote")
class RemoteDatabase : Database

// 在取用者中
@Singleton
class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)
```

## 注入參數

在注入時傳遞參數：

### 編譯器外掛程式 DSL

使用 `@InjectedParam` 來表示參數將由注入參數提供。

```kotlin
class UserPresenter(
    @InjectedParam userId : String,
    repository : UserRepository
)

factory<UserPresenter>()
```

### 經典 DSL

```kotlin
class UserPresenter(
    userId : String,
    repository : UserRepository
)

factory { params ->
    UserPresenter(
        userId = params.get(),
        repository = get()
    )
}
```

### 註解

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository  // 自動注入
)

// 用法
val presenter: UserPresenter = get { parametersOf("user123") }
```

## 選用相依性

### 編譯器外掛程式 DSL

```kotlin
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // 使用 getOrNull() 解析
)

single<MyService>()
```

### 經典 DSL

```kotlin
single {
    MyService(
        required = get(),
        optional = getOrNull()
    )
}
```

### 註解

可為 null 的參數會自動處理：

```kotlin
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // 使用 getOrNull() 解析
)
```

## 延遲注入

推遲執行個體建立：

### 編譯器外掛程式 DSL

```kotlin
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 延遲建立
)

single<MyService>()
```

### 經典 DSL

```kotlin
single {
    MyService(
        lazyDep = inject()  // Lazy<Dependency>
    )
}
```

### 註解

```kotlin
@Singleton
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 延遲建立
)
```

## 屬性

注入組態值：

### 編譯器外掛程式 DSL

```kotlin
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)

single<ApiClient>()
```

### 經典 DSL

```kotlin
single {
    ApiClient(
        url = getProperty("api_url"),
        key = getProperty("api_key", "default")
    )
}
```

### 註解

```kotlin
@Singleton
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)
```

## 回呼

### onClose 回呼

執行個體釋放時執行程式碼：

```kotlin
single {
    Database()
} onClose {
    it?.close()  // 當 Koin 停止或作用域關閉時呼叫
}
```

### createdAtStart

在啟動時積極地建立執行個體：

```kotlin
// 編譯器外掛程式 DSL
single<ConfigManager>() withOptions {
    createdAtStart()
}

// 經典 DSL
single(createdAtStart = true) {
    ConfigManager()
}
```

## 定義覆寫

### 預設：最後一個勝出

```kotlin
val prodModule = module {
    single<ApiService> { ProductionApi() }
}

val testModule = module {
    single<ApiService> { MockApi() }  // 覆寫生產環境
}

startKoin {
    modules(prodModule, testModule)
}
```

### 明確覆寫

在嚴格模式下，請明確標記覆寫：

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()
}

startKoin {
    allowOverride(false)
    modules(prodModule, testModule)
}
```

## 最佳實務

1. **偏好建構函式注入** – 讓程式碼在不依賴 Koin 的情況下即可進行測試
2. **對無狀態 Service 使用 `single`** – 存儲庫、用戶端、幫助程式 (helper)
3. **對具狀態物件使用 `factory`** – Presenter、具狀態的使用案例
4. **對生命週期繫結物件使用 `scoped`** – Activity、Fragment、工作階段
5. **盡量減少限定詞的使用** – 可行時改用不同的介面
6. **繫結至介面** – 依賴於抽象而非實作
7. **對外部程式庫使用 `create(::builder)`** – 更安全的相依性解析

## 後續步驟

- **[注入](/docs/reference/koin-core/injection)** – 檢索相依性
- **[限定詞](/docs/reference/koin-core/qualifiers)** – 命名與具型別的限定詞
- **[進階模式](/docs/reference/koin-core/advanced-patterns)** – 集合、裝飾器、外部程式庫
- **[作用域](/docs/reference/koin-core/scopes)** – 管理生命週期