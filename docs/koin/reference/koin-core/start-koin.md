---
title: 启动 Koin
---

Koin 是一个 DSL、一个轻量级容器和一个实用 API。一旦你在 Koin 模块中声明了你的定义，你就准备好启动 Koin 容器了。

### `startKoin` 函数

`startKoin` 函数是启动 Koin 容器的主要入口点。它需要一个 *Koin 模块列表* 来运行。模块被加载后，定义就准备好被 Koin 容器解析了。

.启动 Koin
```kotlin
// start a KoinApplication in Global context
startKoin {
    // declare used modules
    modules(coffeeAppModule)
}
```

一旦 `startKoin` 被调用，Koin 将读取你的所有模块和定义。然后 Koin 就可以通过任何 `get()` 或 `by inject()` 调用来检索所需的实例了。

你的 Koin 容器可以有几个选项：

*   `logger` - 用于启用日志记录 - 参阅 [日志记录](#logging) 部分
*   `properties()`、`fileProperties()` 或 `environmentProperties()` - 用于从环境变量、koin.properties 文件、额外属性等加载属性 - 参阅 [加载属性](#loading-properties) 部分

:::info
`startKoin` 不能被调用超过一次。如果你需要多个加载模块的时机，请使用 `loadKoinModules` 函数。
:::

### 扩展 Koin 启动（有助于 KMP 及其他方面的重用）

Koin 现在支持 KoinConfiguration 的可重用和可扩展配置对象。你可以提取共享配置，以便跨平台（Android、iOS、JVM 等）使用，或根据不同环境进行定制。这可以通过 `includes()` 函数完成。下面，我们可以轻松重用一个通用配置，并对其进行扩展以添加一些 Android 环境设置：

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) //can include external configuration extension
        modules(appModule)
   }
}

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}
```

### 启动背后 - Koin 实例的幕后

当我们启动 Koin 时，我们会创建一个 `KoinApplication` 实例，它代表 Koin 容器的配置实例。一旦启动，它将根据你的模块和选项生成一个 `Koin` 实例。这个 `Koin` 实例随后由 `GlobalContext` 持有，供任何 `KoinComponent` 类使用。

`GlobalContext` 是 Koin 默认的 JVM 上下文策略。它由 `startKoin` 调用并注册到 `GlobalContext`。这将使我们能够注册不同类型的上下文，以支持 Koin 多平台 (Multiplatform)。

### 在 `startKoin` 之后加载模块

你不能调用 `startKoin` 函数超过一次。但你可以直接使用 `loadKoinModules()` 函数。

这个函数对于想要使用 Koin 的 SDK 开发者来说很有用，因为他们不需要使用 `startKoin()` 函数，而只需在他们的库启动时使用 `loadKoinModules`。

```kotlin
loadKoinModules(module1,module2 ...)
```

### 卸载模块

也可以卸载一批定义，然后使用给定函数释放它们的实例：

```kotlin
unloadKoinModules(module1,module2 ...)
```

### 停止 Koin - 关闭所有资源

你可以关闭所有 Koin 资源并丢弃实例和定义。为此，你可以从任何地方使用 `stopKoin()` 函数来停止 Koin 的 `GlobalContext`。否则，在 `KoinApplication` 实例上，只需调用 `close()`。

## 日志记录

Koin 有一个简单的日志 API，用于记录任何 Koin 活动（分配、查找等）。该日志 API 由下面的类表示：

Koin 日志器

```kotlin
abstract class Logger(var level: Level = Level.INFO) {

    abstract fun display(level: Level, msg: MESSAGE)

    fun debug(msg: MESSAGE) {
        log(Level.DEBUG, msg)
    }

    fun info(msg: MESSAGE) {
        log(Level.INFO, msg)
    }

    fun warn(msg: MESSAGE) {
        log(Level.WARNING, msg)
    }

    fun error(msg: MESSAGE) {
        log(Level.ERROR, msg)
    }
}
```

Koin 提供了一些日志实现，根据目标平台的功能：

*   `PrintLogger` - 直接输出到控制台（包含在 `koin-core` 中）
*   `EmptyLogger` - 什么都不记录（包含在 `koin-core` 中）
*   `SLF4JLogger` - 使用 SLF4J 记录日志。被 Ktor 和 Spark 使用（`koin-logger-slf4j` 项目）
*   `AndroidLogger` - 记录到 Android Logger（包含在 `koin-android` 中）

### 在启动时设置日志记录

默认情况下，Koin 使用 `EmptyLogger`。你可以直接使用 `PrintLogger`，如下所示：

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## 加载属性

你可以在启动时加载多种类型的属性：

*   环境变量 - 加载 *系统* 属性
*   koin.properties 文件 - 从 `/src/main/resources/koin.properties` 文件加载属性
*   “额外”启动属性 - 在 `startKoin` 函数中传递的值映射

### 从模块读取属性

确保在 Koin 启动时加载属性：

```kotlin
startKoin {
    // Load properties from the default location
    // (i.e. `/src/main/resources/koin.properties`)
    fileProperties()
}
```

在 Koin 模块中，你可以通过其键获取属性：

在 /src/main/resources/koin.properties 文件中
```java
// Key - value
server_url=http://service_url
```

只需使用 `getProperty` 函数加载它：

```kotlin
val myModule = module {

    // use the "server_url" key to retrieve its value
    single { MyService(getProperty("server_url")) }
}
```

## Koin 选项 - 功能标记 (4.1.0)

你的 Koin 应用程序现在可以通过一个专用的 `options` 部分激活一些实验性功能，例如：

```kotlin
startKoin {
    options(
        // activate ViewModel Scope factory feature
        viewModelScopeFactory()
    )
}
```