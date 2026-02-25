---
title: 启动 Koin
---

Koin 是一个领域专用语言、一个轻量级容器以及一个实用的 API。在 Koin 模块中声明定义后，即可准备启动 Koin 容器。

### startKoin 函数

`startKoin`函数是启动 Koin 容器的主要入口点。它需要一个*Koin 模块列表*来运行。
模块加载后，定义即准备好由 Koin 容器解析。

.启动 Koin
```kotlin
// 在 Global 上下文中启动 KoinApplication
startKoin {
    // 声明使用的模块
    modules(coffeeAppModule)
}
```

一旦调用了`startKoin`，Koin 将读取您所有的模块和定义。随后 Koin 即可处理任何`get()`或`by inject()`调用来检索所需的实例。

您的 Koin 容器可以有多个选项：

* `logger` - 启用日志 —— 请参阅[日志](#logging)部分
* `properties()`、`fileProperties()`或`environmentProperties()` - 用于从环境、koin.properties 文件、额外属性等加载属性 —— 请参阅[加载属性](#loading-properties)部分

:::info
 `startKoin`不能调用超过一次。如果您需要在多个位置加载模块，请使用`loadKoinModules`函数。
:::

### 扩展您的 Koin 启动（助力 KMP 等项目的复用）

Koin 现在为 KoinConfiguration 支持可复用且可扩展的配置对象。您可以提取共享配置以跨平台（Android、iOS、JVM 等）使用，或针对不同环境进行定制。这可以通过`includes()`函数完成。下面，我们可以轻松复用一个通用配置，并对其进行扩展以添加一些 Android 环境设置：

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) // 可以包含外部配置扩展
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

### 启动背后 —— 底层的 Koin 实例

当我们启动 Koin 时，会创建一个代表 Koin 容器配置实例的`KoinApplication`实例。启动后，它将根据您的模块和选项生成一个`Koin`实例。
该`Koin`实例随后由`GlobalContext`持有，供任何`KoinComponent`类使用。

`GlobalContext`是 Koin 默认的 JVM 上下文策略。它由`startKoin`调用并注册到`GlobalContext`。从 Koin Multiplatform 的角度来看，这将允许我们注册不同类型的上下文。

### 在 startKoin 之后加载模块

您不能多次调用`startKoin`函数。但您可以直接使用`loadKoinModules()`函数。

该函数对于想要使用 Koin 的 SDK 开发者非常有用，因为他们不需要使用`startKoin()`函数，只需在库启动时使用`loadKoinModules`即可。

```kotlin
loadKoinModules(module1,module2 ...)
```

### 卸载模块

也可以卸载一批定义，然后通过给定函数释放它们的实例：

```kotlin
unloadKoinModules(module1,module2 ...)
```

### 停止 Koin —— 关闭所有资源

您可以关闭所有 Koin 资源并丢弃实例与定义。为此，您可以从任何地方使用`stopKoin()`函数来停止 Koin `GlobalContext`。
或者在`KoinApplication`实例上直接调用`close()`

## 日志

Koin 有一个简单的日志 API，用于记录任何 Koin 活动（分配、查询等）。日志 API 由以下类表示：

Koin Logger

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

Koin 根据目标平台提供了一些日志实现：

* `PrintLogger` - 直接记录到控制台（包含在`koin-core`中）
* `EmptyLogger` - 不记录任何内容（包含在`koin-core`中）
* `SLF4JLogger` - 使用 SLF4J 记录。由 ktor 和 spark 使用（`koin-logger-slf4j`项目）
* `AndroidLogger` - 记录到 Android Logger（包含在`koin-android`中）

### 在启动时设置日志

默认情况下，Koin 使用`EmptyLogger`。您可以按如下方式直接使用`PrintLogger`：

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## 加载属性

您可以在启动时加载多种类型的属性：

* 环境属性 - 加载*系统*属性
* koin.properties 文件 - 从`/src/main/resources/koin.properties`文件加载属性
* “额外”启动属性 - 在`startKoin`函数中传递的键值对映射

### 从模块中读取属性

确保在 Koin 启动时加载属性：

```kotlin
startKoin {
    // 从默认位置加载属性
    // (即 `/src/main/resources/koin.properties`)
    fileProperties()
}
```

在 Koin 模块中，您可以通过键获取属性：

在 /src/main/resources/koin.properties 文件中
```java
// 键 - 值
server_url=http://service_url
```

只需使用`getProperty`函数加载它：

```kotlin
val myModule = module {

    // 使用 "server_url" 键来检索其值
    single { MyService(getProperty("server_url")) }
}
```

## Koin 选项 - 功能标志 (4.1.0)

您的 Koin 应用程序现在可以通过专用的`options`部分激活一些实验性功能，例如：

```kotlin
startKoin {
    options(
        // 激活 ViewModel Scope factory 功能 
        viewModelScopeFactory()
    )
}