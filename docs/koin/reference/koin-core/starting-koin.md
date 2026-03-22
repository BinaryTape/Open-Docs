---
title: 启动 Koin
---

# 启动 Koin

本指南介绍了如何初始化 Koin 容器并将其配置到您的应用程序中。

## `startKoin` 函数

`startKoin` 是启动 Koin 的主要入口点。它在 `GlobalContext` 中注册容器，使其在整个应用程序中都可访问。

```kotlin
startKoin {
    modules(appModule)
}
```

一旦启动，依赖项就可以通过 `get()` 或 `by inject()` 进行解析。

### 配置选项

```kotlin
startKoin {
    // 日志
    logger(Level.INFO)

    // 属性
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))

    // 模块
    modules(
        coreModule,
        networkModule,
        dataModule
    )

    // 延迟加载模块 (后台加载)
    lazyModules(analyticsModule, reportingModule)

    // 创建饿汉式单例
    createEagerInstances()

    // 替代控制
    allowOverride(false)
}
```

| 选项 | 描述 |
|--------|-------------|
| `logger()` | 设置日志级别和实现 |
| `modules()` | 立即加载模块 |
| `lazyModules()` | 在后台加载模块 |
| `properties()` | 从 map 加载属性 |
| `fileProperties()` | 从 koin.properties 文件加载 |
| `environmentProperties()` | 从系统/环境变量加载 |
| `createEagerInstances()` | 创建所有 `createdAtStart` 单例 |
| `allowOverride()` | 启用/禁用定义重写 |

:::info
`startKoin` 只能被调用 **一次**。如需在稍后加载其他模块，请使用 `loadKoinModules()`。
:::

## 启动 Koin 容器

| 方法 | 用例 |
|--------|----------|
| `startKoin { }` | 标准应用 - 在 GlobalContext 中注册 |
| `koinApplication { }` | 测试、SDK、隔离上下文 - 本地实例 |
| `koinConfiguration { }` | 专用于 API (Compose, Ktor) 的配置持有者 |

:::tip
配合 **Koin 编译器插件**，可以使用强类型变体：`startKoin<T>()`、`koinApplication<T>()`、`koinConfiguration<T>()`。请参阅下文的[使用编译器插件启动 Koin](#starting-koin-with-compiler-plugin)。
:::

### `startKoin` - 全局实例

最常见的方法 - 全局启动 Koin：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    // 随处使用
    val service: MyService = get()
}
```

### `koinApplication` - 隔离实例

创建一个隔离的 Koin 实例（不在 GlobalContext 中）：

```kotlin
val myKoin = koinApplication {
    modules(myModule)
}.koin

// 使用隔离实例
val service: MyService = myKoin.get()
```

**用例：**
- 在隔离上下文中进行测试
- SDK 开发（避免污染宿主应用）
- 多个 Koin 实例

### `koinConfiguration` - 配置持有者

创建一个供专用 API（Compose `KoinApplication`、Ktor 插件）使用的配置：

```kotlin
val config = koinConfiguration {
    modules(appModule)
}

// 供 Compose KoinApplication、Ktor 等使用。
```

## 使用编译器插件启动 Koin

当使用带有注解的 **Koin 编译器插件** 时，您可以使用 **强类型 API** 来启动 Koin - 无需生成代码。

:::info
这需要 [Koin 编译器插件](/docs/setup/compiler-plugin)。您的应用程序类必须使用 `@KoinApplication` 进行注解。
:::

### 定义您的应用程序

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp")
class MyModule

@KoinApplication
class MyApp
```

### 强类型启动 API

| API | 描述 |
|-----|-------------|
| `startKoin<T>()` | 使用应用 T 全局启动 Koin |
| `startKoin<T> { }` | 使用应用 T 和额外配置启动 |
| `koinApplication<T>()` | 使用 T 创建隔离的 KoinApplication |
| `koinConfiguration<T>()` | 从 T 创建 KoinConfiguration (用于 Compose, Ktor) |

其中 `T` 是一个使用 `@KoinApplication` 注解的类。

### 示例

```kotlin
// 简单启动
startKoin<MyApp>()

// 带有额外配置
startKoin<MyApp> {
    printLogger()
}

// 隔离实例
val myKoin = koinApplication<MyApp>().koin

// 用于 Compose/Ktor 的配置
val config = koinConfiguration<MyApp>()
```

### 多模块项目

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@Configuration
@ComponentScan("com.myapp.feature")
class FeatureModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

// 启动 Koin
startKoin<MyApp>()
```

## 平台集成

### Android

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

**配合编译器插件：**

```kotlin
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApp> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

### Compose

将 `KoinApplication` 可组合项与 `koinConfiguration` 配合使用：

```kotlin
@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration { modules(appModule) }
    ) {
        MainScreen()
    }
}
```

**配合编译器插件：**

```kotlin
@KoinApplication
class MyApp

@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration<MyApp>()
    ) {
        MainScreen()
    }
}
```

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

**配合编译器插件：**

```kotlin
@KoinApplication
class MyApp

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        withConfiguration<MyApp>()
    }
}
```

:::info
有关更多详细信息，请参阅 [Ktor 集成](/docs/reference/koin-ktor/ktor)。
:::

### Kotlin Multiplatform

跨平台共享配置：

```kotlin
// commonMain
fun initKoin(config: KoinAppDeclaration? = null) {
    startKoin {
        config?.invoke(this)
        modules(sharedModule)
    }
}

// androidMain
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}

// iosMain
fun initKoinIos() = initKoin()
```

## 动态模块管理

### 在启动后加载模块

```kotlin
// 初始启动
startKoin {
    modules(coreModule)
}

// 稍后加载其他模块
loadKoinModules(featureModule)
```

### 卸载模块

```kotlin
unloadKoinModules(featureModule)
```

### 功能开关 (Feature Toggle) 示例

```kotlin
if (isFeatureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 稍后如果禁用
unloadKoinModules(premiumFeatureModule)
```

## 停止 Koin

关闭容器并释放资源：

```kotlin
stopKoin()
```

对于隔离实例：

```kotlin
val koinApp = koinApplication { modules(myModule) }
koinApp.close()
```

## 日志

### 启用日志

```kotlin
startKoin {
    logger(Level.INFO)  // 或 DEBUG, WARNING, ERROR, NONE
}
```

### 可用日志记录器

| 日志记录器 | 平台 | 描述 |
|--------|----------|-------------|
| `EmptyLogger` | 所有 | 无日志 (默认) |
| `PrintLogger` | 所有 | 控制台输出 |
| `AndroidLogger` | Android | Android Logcat |
| `SLF4JLogger` | JVM | SLF4J 集成 |

### 平台特定日志记录器

```kotlin
// Android
startKoin {
    androidLogger(Level.DEBUG)
}

// Ktor
install(Koin) {
    slf4jLogger()
}
```

## 属性

### 加载属性

```kotlin
startKoin {
    // 从环境
    environmentProperties()

    // 从文件 (koin.properties)
    fileProperties()

    // 从代码
    properties(mapOf(
        "server_url" to "https://api.example.com",
        "api_key" to "secret123"
    ))
}
```

### 使用属性

```kotlin
val appModule = module {
    single {
        ApiClient(
            url = getProperty("server_url"),
            key = getProperty("api_key", "default")
        )
    }
}
```

## 最佳做法

1. **只调用一次 `startKoin`** - 在应用程序入口点调用。
2. **立即加载关键模块** - 使用 `modules()`。
3. **使用延迟加载模块** - 使用 `lazyModules()` 推迟非关键模块。
4. **在开发中启用日志** - `logger(Level.DEBUG)`。
5. **在生产中使用严格模式** - `allowOverride(false)`。
6. **在测试之间停止 Koin** - 调用 `stopKoin()` 来重置状态。

## 后续步骤

- **[模块](/docs/reference/koin-core/modules)** - 组织您的定义。
- **[定义](/docs/reference/koin-core/definitions)** - 使用 DSL 或注解创建定义。
- **[注入](/docs/reference/koin-core/injection)** - 检索依赖项。