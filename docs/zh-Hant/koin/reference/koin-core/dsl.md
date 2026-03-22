---
title: Koin DSL
---

Koin DSL 的快速參考。如需詳細指南，請參閱 **[Core - 定義](/docs/reference/koin-core/definitions)** 與 **[Core - 模組](/docs/reference/koin-core/modules)**。

## DSL 做法

| 做法 | 語法 | 套件 |
|----------|--------|---------|
| **經典 DSL** | `single { Class(get()) }` | `org.koin.dsl` |
| **經典 Autowire** | `singleOf(::Class)` | `org.koin.dsl` |
| **編譯器外掛程式** | `single<Class>()` | `org.koin.plugin.module.dsl` |

:::tip
**編譯器外掛程式 DSL** 提供了自動裝配 (auto-wiring) 與編譯時期安全性。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin)。
:::

## Application DSL

`KoinApplication` 執行個體代表您配置的 Koin 容器。這讓您可以設定記錄 (logging)、載入屬性並註冊模組。

### 建立 KoinApplication

可在以下兩種做法中選擇：

* `koinApplication { }` - 建立一個獨立的 `KoinApplication` 執行個體
* `startKoin { }` - 建立一個 `KoinApplication` 並將其註冊到 `GlobalContext` 中

```kotlin
// 獨立執行個體（對測試或自訂內容很有用）
val koinApp = koinApplication {
    modules(myModule)
}

// 全域執行個體（應用程式的標準做法）
startKoin {
    logger()
    modules(myModule)
}
```

### 配置函式

在 `koinApplication` 或 `startKoin` 中，您可以使用：

* `logger()` - 設定記錄層級與 Logger 實作（預設：EmptyLogger）
* `modules()` - 將模組載入到容器中（接受列表或可變參數 (vararg)）
* `properties()` - 載入屬性的 HashMap
* `fileProperties()` - 從檔案中載入屬性
* `environmentProperties()` - 從作業系統環境變數中載入屬性
* `createEagerInstances()` - 具現化所有標記為 `createdAtStart` 的定義
* `allowOverride(Boolean)` - 啟用/停用定義覆寫（自 3.1.0 起預設為 true）

### 全域與區域內容 (Context)

`koinApplication` 與 `startKoin` 之間的主要區別：

- **`startKoin`** - 在 `GlobalContext` 中註冊容器，使其可透過 `KoinComponent`、`by inject()` 以及其他全域 API 存取
- **`koinApplication`** - 建立一個由您直接控制的隔離執行個體

```kotlin
// 全域內容 - 標準用法
startKoin {
    logger()
    modules(appModule)
}

// 稍後在應用程式中的任何位置：
class MyClass : KoinComponent {
    val service: Service by inject() // 使用 GlobalContext
}
```

```kotlin
// 區域內容 - 進階用法（測試、多內容應用程式）
val customKoin = koinApplication {
    modules(testModule)
}.koin

val service = customKoin.get<Service>() // 使用特定的執行個體
```

### 啟動 Koin

一個完整的 Koin 設定範例：

```kotlin
startKoin {
    // 配置記錄
    logger(Level.INFO)

    // 載入屬性
    environmentProperties()

    // 宣告模組
    modules(
        networkModule,
        databaseModule,
        repositoryModule,
        viewModelModule
    )

    // 建立預先載入執行個體 (eager singletons)
    createEagerInstances()
}
```

## Module DSL

如需全面的模組與定義文件，請參閱：
- **[定義](/docs/reference/koin-core/definitions)** - 包含 DSL 與註解的所有定義型別
- **[模組](/docs/reference/koin-core/modules)** - 模組組織與組合
- **[定義參考](/docs/reference/koin-core/definitions)** - 快速查閱表

### 快速參考

| 定義 | 經典 Lambda | 經典 Autowire | 編譯器外掛程式 |
|------------|----------------|------------------|-----------------|
| Singleton | `single { Class(get()) }` | `singleOf(::Class)` | `single<Class>()` |
| Factory | `factory { Class(get()) }` | `factoryOf(::Class)` | `factory<Class>()` |
| Scoped | `scoped { Class(get()) }` | `scopedOf(::Class)` | `scoped<Class>()` |
| ViewModel | `viewModel { VM(get()) }` | `viewModelOf(::VM)` | `viewModel<VM>()` |

### 基本模組

```kotlin
val myModule = module {
    single<Database>()
    single<UserRepository>()
    factory<UserPresenter>()
}
```

### 模組組合

```kotlin
val appModule = module {
    includes(networkModule, databaseModule)
    single<AppConfig>()
}

startKoin {
    modules(appModule)
}
```

詳情請參閱 **[模組 - includes()](/docs/reference/koin-core/modules#module-composition-with-includes)**。