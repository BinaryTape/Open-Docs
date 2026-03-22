---
title: 启动 Koin 参考
---

启动 Koin 的快速参考。有关详细指南，请参阅 **[核心 - 启动 Koin](/docs/reference/koin-core/starting-koin)**。

## 启动方法

| 方法 | 用例 |
|--------|----------|
| `startKoin { }` | 标准应用 - 在 GlobalContext 中注册 |
| `koinApplication { }` | 测试、SDK - 隔离实例 |
| `koinConfiguration { }` | Compose、Ktor 的配置 |
| `startKoin<T>()` | 使用编译器插件进行类型化启动 |

## 基础启动

```kotlin
startKoin {
    modules(appModule)
}
```

## 完整配置

```kotlin
startKoin {
    logger(Level.INFO)
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))
    modules(coreModule, networkModule)
    lazyModules(analyticsModule)
    createEagerInstances()
    allowOverride(false)
}
```

## 配置选项

| 选项 | 描述 |
|--------|-------------|
| `logger()` | 设置日志级别与实现 |
| `modules()` | 立即加载模块 |
| `lazyModules()` | 在后台加载模块 |
| `properties()` | 从映射加载属性 |
| `fileProperties()` | 从 koin.properties 文件加载 |
| `environmentProperties()` | 从系统/环境加载 |
| `createEagerInstances()` | 创建所有 `createdAtStart` 单例 |
| `allowOverride()` | 启用/禁用定义重写 |

## 类型化启动 (编译器插件)

需要 [Koin 编译器插件](/docs/setup/compiler-plugin) 和 `@KoinApplication`：

```kotlin
@KoinApplication
class MyApp

// 启动
startKoin<MyApp>()

// 带有配置
startKoin<MyApp> {
    printLogger()
}
```

## 动态模块管理

```kotlin
// 启动后加载
loadKoinModules(featureModule)

// 卸载
unloadKoinModules(featureModule)
```

## 停止 Koin

```kotlin
stopKoin()  // 全局实例

// 隔离实例
koinApp.close()
```

## 日志

| 日志记录器 | 平台 | 描述 |
|--------|----------|-------------|
| `EmptyLogger` | 所有 | 不记录日志（默认） |
| `PrintLogger` | 所有 | 控制台输出 |
| `AndroidLogger` | Android | Logcat |
| `SLF4JLogger` | JVM | SLF4J |

```kotlin
startKoin {
    logger(Level.DEBUG)  // Android 平台可使用 androidLogger()
}
```

## 属性

```kotlin
startKoin {
    environmentProperties()
    fileProperties()  // koin.properties
    properties(mapOf("key" to "value"))
}

// 在模块中
single {
    ApiClient(url = getProperty("server_url"))
}
```

## 平台示例

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

### Compose

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

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 另请参阅

- **[核心 - 启动 Koin](/docs/reference/koin-core/starting-koin)** - 完整指南
- **[延时模块](/docs/reference/koin-core/lazy-modules)** - 后台加载
- **[KoinComponent](/docs/reference/koin-core/koin-component)** - 检索实例