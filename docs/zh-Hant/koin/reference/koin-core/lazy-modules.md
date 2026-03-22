---
title: 延遲模組與背景載入
---

延遲模組（Lazy modules）支援非同步、平行的模組載入，以提升啟動效能。您可以延遲並平行化模組初始化，而不是在啟動時同步載入所有模組。

:::info
本頁面使用 **Koin 編譯器外掛程式 DSL** (`single<T>()`)。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin) 以進行配置。
:::

## 什麼是延遲模組？

延遲模組會延遲模組註冊和執行個體建立，直到明確載入為止。它們特別適用於：

- **大型應用程式** - 將初始化拆分到多個執行緒中。
- **效能最佳化** - 減少啟動時間。
- **條件式功能** - 僅在需要時載入模組。
- **背景初始化** - 非同步載入非關鍵模組。

## 定義延遲模組

使用 `lazyModule` 函式建立延遲模組：

```kotlin
// 延遲模組 - 直到明確要求時才會載入
val networkModule = lazyModule {
    single<ApiClient>()
    single<NetworkMonitor>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}
```

### 組合延遲模組

延遲模組與一般模組一樣支援 `includes()`：

```kotlin
val dataModule = lazyModule {
    single<UserRepository>()
}

val featureModule = lazyModule {
    includes(dataModule)  // 包含其他延遲模組
    single<FeatureService>()
}
```

:::info
延遲模組在透過 `lazyModules()` 函式載入之前，不會分配任何資源。
:::

## 載入延遲模組

在您的 Koin 配置中使用 `lazyModules()` 載入延遲模組。

### 基本載入

```kotlin
val analyticsModule = lazyModule {
    single<AnalyticsService>()
}

val reportingModule = lazyModule {
    single<CrashReporter>()
}

startKoin {
    // 立即載入關鍵模組
    modules(coreModule, networkModule)

    // 在背景載入非關鍵模組
    lazyModules(analyticsModule, reportingModule)
}
```

### 平行載入 (4.2.0+)

自 4.2.0 版本起，多個延遲模組會**平行**載入，每個模組都在自己的協同程式中執行：

```kotlin
val module1 = lazyModule { single<DatabaseService>() }
val module2 = lazyModule { single<NetworkService>() }
val module3 = lazyModule { single<AnalyticsService>() }

startKoin {
    // 所有三個模組同時載入！
    lazyModules(module1, module2, module3)
}
```

**效能影響：**

| 情境 | 4.2.0 之前（循序） | 4.2.0 之後（平行） |
|----------|--------------------------|------------------------|
| 1 個模組 @ 100ms | 100ms | 100ms |
| 3 個模組 @ 每個 100ms | 300ms | ~100ms |
| 10 個模組 @ 每個 100ms | 1000ms | ~100ms |

### 等待完成

#### 所有平台：`waitAllStartJobs()`

```kotlin
startKoin {
    lazyModules(module1, module2, module3)
}

val koin = KoinPlatform.getKoin()

// 阻塞直到所有延遲模組載入完成
koin.waitAllStartJobs()

// 現在可以安全地使用來自延遲模組的相依性
val service = koin.get<AnalyticsService>()
```

**平台行為：**
- **JVM/Native**：使用 `runBlocking` 進行真正的阻塞。
- **JS**：使用 `GlobalScope.promise`（非真正阻塞，會記錄警告）。

#### 僅限 JVM：`runOnKoinStarted()`

```kotlin
startKoin {
    lazyModules(analyticsModule)
}

// 僅限 JVM 的回呼
KoinPlatform.getKoin().runOnKoinStarted { koin ->
    // 在所有延遲模組完成載入後執行
    koin.get<AnalyticsService>().trackAppStart()
}
```

#### 暫停替代方案：`awaitAllStartJobs()`

適用於協同程式上下文或不支援阻塞的平台：

```kotlin
suspend fun initializeApp() {
    startKoin {
        lazyModules(module1, module2)
    }

    // 等待且不阻塞
    KoinPlatform.getKoin().awaitAllStartJobs()

    // 安全地繼續執行
    println("所有模組已載入！")
}
```

## 自訂發送器

控制在哪個發送器（dispatcher）上執行延遲模組載入：

```kotlin
import kotlinx.coroutines.Dispatchers

startKoin {
    // 在 IO 發送器上載入，而不是 Default
    lazyModules(
        databaseModule,
        networkModule,
        dispatcher = Dispatchers.IO
    )
}
```

**常見的發送器選擇：**
- `Dispatchers.Default` - CPU 密集型工作（預設）。
- `Dispatchers.IO` - I/O 操作、檔案存取、網路。
- `Dispatchers.Main` - UI 更新（Android/Desktop）。

:::info
如果未指定，預設發送器為 `Dispatchers.Default`。
:::

## 實際範例

```kotlin
// 核心模組 - 立即載入
val coreModule = module {
    single<AppConfig>()
    single<UserSession>()
}

// 功能模組 - 在背景載入
val analyticsModule = lazyModule {
    single<AnalyticsEngine>()
    single<EventTracker>()
}

val networkingModule = lazyModule {
    single<ApiClient>()
    single<WebSocketManager>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}

// Android 應用程式
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApp)

            // 關鍵模組立即載入
            modules(coreModule)

            // 非關鍵模組在背景平行載入
            lazyModules(
                analyticsModule,
                networkingModule,
                databaseModule,
                dispatcher = Dispatchers.IO
            )
        }

        // 選用：等待背景載入完成
        lifecycleScope.launch {
            KoinPlatform.getKoin().awaitAllStartJobs()
            Log.d("Koin", "所有模組已載入！")
        }
    }
}
```

## 重要限制

### 避免交叉相依

延遲模組與一般模組應保持獨立。不要建立從一般模組到延遲模組的相依性：

```kotlin
// ❌ 錯誤範例 - mainModule 依賴於延遲模組
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController(get<AnalyticsService>()) }  // 可能會失敗！
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

```kotlin
// ✅ 正確範例 - 保持相依性分離
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController() }
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

:::warning
Koin 目前不會驗證一般模組與延遲模組之間的相依性。請確保一般模組不依賴於延遲模組的定義。
:::

### 最佳實務：載入順序

1. **立即模組** - 啟動時需要的關鍵服務。
2. **延遲模組** - 非關鍵、可延後的服務。
3. **必要時等待** - 在存取延遲定義之前，使用 `waitAllStartJobs()`。

## 何時使用延遲模組

### 適合的使用案例

- **分析／追蹤** - 並非核心功能所需。
- **損毀報告** - 可以在背景初始化。
- **功能模組** - 按需載入的模組化功能。
- **資料庫／網路** - 可以延後的重量級初始化。
- **大型應用程式** - 將啟動負載拆分到不同執行緒。

### 不建議使用

- **核心服務** - 立即需要的關鍵相依性。
- **小型應用程式** - 額外開銷可能會超過其收益。
- **緊密耦合的模組** - 當模組之間有許多交叉相依時。

## API 參考

| 函式 | 平台 | 描述 |
|----------|----------|-------------|
| `lazyModules()` | 全部 | 在背景載入延遲模組 |
| `waitAllStartJobs()` | 全部 | 阻塞直到所有延遲模組載入完成 |
| `awaitAllStartJobs()` | 全部 | 暫停直到所有延遲模組載入完成 |
| `runOnKoinStarted()` | 僅限 JVM | 載入完成後的回呼 |

## 延伸閱讀

- **[模組](/docs/reference/koin-core/modules)** - 使用 `includes()` 進行模組組合
- **[定義](/docs/reference/koin-core/definitions)** - 積極 vs 延遲單例
- **[啟動 Koin](/docs/reference/koin-core/starting-koin)** - Koin 啟動配置