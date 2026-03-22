---
title: 延迟加载模块与后台加载
---

延迟加载模块支持异步、并行模块加载，以提高启动性能。您可以推迟并并行执行模块初始化，而不是在启动时同步加载所有模块。

:::info
本页面使用 **Koin 编译器插件 DSL** (`single<T>()`)。有关配置请参阅 [编译器插件设置](/docs/setup/compiler-plugin)。
:::

## 什么是延迟加载模块？

延迟加载模块会延迟模块注册和实例创建，直到被显式加载。它们特别适用于：

- **大型应用程序** - 将初始化拆分到多个线程中
- **性能优化** - 减少启动时间
- **条件性功能** - 仅在需要时加载模块
- **后台初始化** - 异步加载非关键模块

## 定义延迟加载模块

使用 `lazyModule` 函数创建延迟加载模块：

```kotlin
// 延迟加载模块 - 除非显式请求，否则不会加载
val networkModule = lazyModule {
    single<ApiClient>()
    single<NetworkMonitor>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}
```

### 组合延迟加载模块

延迟加载模块与常规模块一样支持 `includes()`：

```kotlin
val dataModule = lazyModule {
    single<UserRepository>()
}

val featureModule = lazyModule {
    includes(dataModule)  // 包含其他延迟加载模块
    single<FeatureService>()
}
```

:::info
延迟加载模块在通过 `lazyModules()` 函数加载之前不会分配任何资源。
:::

## 加载延迟加载模块

在 Koin 配置中使用 `lazyModules()` 加载延迟加载模块。

### 基础加载

```kotlin
val analyticsModule = lazyModule {
    single<AnalyticsService>()
}

val reportingModule = lazyModule {
    single<CrashReporter>()
}

startKoin {
    // 立即加载关键模块
    modules(coreModule, networkModule)

    // 在后台加载非关键模块
    lazyModules(analyticsModule, reportingModule)
}
```

### 并行加载 (4.2.0+)

自 4.2.0 版本起，多个延迟加载模块会**并行**加载，每个模块都在自己的协程中运行：

```kotlin
val module1 = lazyModule { single<DatabaseService>() }
val module2 = lazyModule { single<NetworkService>() }
val module3 = lazyModule { single<AnalyticsService>() }

startKoin {
    // 所有三个模块同时加载！
    lazyModules(module1, module2, module3)
}
```

**性能影响：**

| 场景 | 4.2.0 之前 (顺序加载) | 4.2.0 之后 (并行加载) |
|----------|--------------------------|------------------------|
| 1 个模块 @ 100ms | 100ms | 100ms |
| 3 个模块每个 @ 100ms | 300ms | 约 100ms |
| 10 个模块每个 @ 100ms | 1000ms | 约 100ms |

### 等待完成

#### 所有平台：`waitAllStartJobs()`

```kotlin
startKoin {
    lazyModules(module1, module2, module3)
}

val koin = KoinPlatform.getKoin()

// 阻塞直到所有延迟加载模块加载完成
koin.waitAllStartJobs()

// 现在可以安全地使用延迟加载模块中的依赖项
val service = koin.get<AnalyticsService>()
```

**平台行为：**
- **JVM/Native**：使用 `runBlocking` 进行真正的阻塞
- **JS**：使用 `GlobalScope.promise`（并非真正阻塞，会记录警告日志）

#### 仅限 JVM：`runOnKoinStarted()`

```kotlin
startKoin {
    lazyModules(analyticsModule)
}

// 仅限 JVM 的回调
KoinPlatform.getKoin().runOnKoinStarted { koin ->
    // 在所有延迟加载模块完成加载后执行
    koin.get<AnalyticsService>().trackAppStart()
}
```

#### 挂起替代方案：`awaitAllStartJobs()`

适用于协程上下文或不支持阻塞的平台：

```kotlin
suspend fun initializeApp() {
    startKoin {
        lazyModules(module1, module2)
    }

    // 无阻塞等待
    KoinPlatform.getKoin().awaitAllStartJobs()

    // 可以安全继续执行
    println("所有模块已加载！")
}
```

## 自定义调度器 (Dispatchers)

控制运行延迟加载模块加载的调度器：

```kotlin
import kotlinx.coroutines.Dispatchers

startKoin {
    // 在 IO 调度器上加载，而不是使用 Default
    lazyModules(
        databaseModule,
        networkModule,
        dispatcher = Dispatchers.IO
    )
}
```

**常见的调度器选择：**
- `Dispatchers.Default` - CPU 密集型工作（默认）
- `Dispatchers.IO` - I/O 操作、文件访问、网络
- `Dispatchers.Main` - UI 更新 (Android/Desktop)

:::info
如果未指定，默认调度器为 `Dispatchers.Default`。
:::

## 实际案例

```kotlin
// 核心模块 - 立即加载
val coreModule = module {
    single<AppConfig>()
    single<UserSession>()
}

// 功能模块 - 在后台加载
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

// Android 应用程序
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApp)

            // 立即加载关键模块
            modules(coreModule)

            // 在后台并行加载非关键模块
            lazyModules(
                analyticsModule,
                networkingModule,
                databaseModule,
                dispatcher = Dispatchers.IO
            )
        }

        // 可选：等待后台加载完成
        lifecycleScope.launch {
            KoinPlatform.getKoin().awaitAllStartJobs()
            Log.d("Koin", "所有模块已加载！")
        }
    }
}
```

## 重要限制

### 避免交叉依赖

延迟加载模块和常规模块应该是独立的。不要创建常规模块对延迟加载模块的依赖：

```kotlin
// ❌ 错误做法 - mainModule 依赖于延迟加载模块
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController(get<AnalyticsService>()) }  // 可能会失败！
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

```kotlin
// ✅ 正确做法 - 保持依赖分离
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
目前 Koin 不会验证常规模块与延迟加载模块之间的依赖关系。请确保常规模块不依赖于延迟加载模块的定义。
:::

### 最佳实践：加载顺序

1. **立即加载模块** - 启动时需要的关键服务
2. **延迟加载模块** - 非关键、可延迟的服务
3. **根据需要等待** - 在访问延迟定义之前使用 `waitAllStartJobs()`

## 何时使用延迟加载模块

### 适用场景

- **分析/追踪** - 核心功能不需要
- **崩溃报告** - 可以在后台初始化
- **功能模块** - 按需加载的模块化功能
- **数据库/网络** - 可以推迟的重型初始化
- **大型应用** - 将启动负载拆分到多个线程中

### 不建议使用场景

- **核心服务** - 立即需要的关键依赖项
- **小型应用** - 开销可能超过收益
- **紧密耦合的模块** - 当模块之间存在大量交叉依赖时

## API 参考

| 函数 | 平台 | 描述 |
|----------|----------|-------------|
| `lazyModules()` | 所有 | 在后台加载延迟加载模块 |
| `waitAllStartJobs()` | 所有 | 阻塞直到所有延迟加载模块加载完成 |
| `awaitAllStartJobs()` | 所有 | 挂起直到所有延迟加载模块加载完成 |
| `runOnKoinStarted()` | 仅限 JVM | 加载完成后执行的回调 |

## 另请参阅

- **[模块](/docs/reference/koin-core/modules)** - 使用 `includes()` 进行模块组合
- **[定义](/docs/reference/koin-core/definitions)** - 立即与延迟加载的单例
- **[启动 Koin](/docs/reference/koin-core/starting-koin)** - Koin 启动配置