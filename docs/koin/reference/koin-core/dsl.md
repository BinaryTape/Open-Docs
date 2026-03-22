---
title: Koin DSL
---

Koin DSL 快速参考。有关详细指南，请参阅 **[核心 - 定义](/docs/reference/koin-core/definitions)** 和 **[核心 - 模块](/docs/reference/koin-core/modules)**。

## DSL 方案

| 方案 | 语法 | 软件包 |
|----------|--------|---------|
| **经典 DSL** | `single { Class(get()) }` | `org.koin.dsl` |
| **经典自动装配** | `singleOf(::Class)` | `org.koin.dsl` |
| **编译器插件** | `single<Class>()` | `org.koin.plugin.module.dsl` |

:::tip
**编译器插件 DSL** 提供自动装配和编译时安全性。请参阅 [编译器插件设置](/docs/setup/compiler-plugin)。
:::

## Application DSL

一个 `KoinApplication` 实例代表您配置好的 Koin 容器。这让您可以设置日志记录、加载属性并注册模块。

### 创建 KoinApplication

在两种方案之间进行选择：

* `koinApplication { }` - 创建一个独立的 `KoinApplication` 实例
* `startKoin { }` - 创建一个 `KoinApplication` 并将其注册到 `GlobalContext` 中

```kotlin
// 独立实例（对测试或自定义上下文很有用）
val koinApp = koinApplication {
    modules(myModule)
}

// 全局实例（应用程序的标准方式）
startKoin {
    logger()
    modules(myModule)
}
```

### 配置函数

在 `koinApplication` 或 `startKoin` 中，您可以使用：

* `logger()` - 设置日志级别和 Logger 实现（默认：EmptyLogger）
* `modules()` - 将模块加载到容器中（接受列表或可变实参）
* `properties()` - 加载属性的 HashMap
* `fileProperties()` - 从文件加载属性
* `environmentProperties()` - 从操作系统环境变量加载属性
* `createEagerInstances()` - 实例化所有标记为 `createdAtStart` 的定义
* `allowOverride(Boolean)` - 启用/禁用定义重写（自 3.1.0 起默认为 true）

### 全局 vs 本地上下文

`koinApplication` 和 `startKoin` 之间的主要区别：

- **`startKoin`** - 在 `GlobalContext` 中注册容器，使其可以通过 `KoinComponent`、`by inject()` 和其他全局 API 访问
- **`koinApplication`** - 创建一个您直接控制的隔离实例

```kotlin
// 全局上下文 - 标准用法
startKoin {
    logger()
    modules(appModule)
}

// 之后，在应用中的任何位置：
class MyClass : KoinComponent {
    val service: Service by inject() // 使用 GlobalContext
}
```

```kotlin
// 本地上下文 - 高级用法（测试、多上下文应用）
val customKoin = koinApplication {
    modules(testModule)
}.koin

val service = customKoin.get<Service>() // 使用特定实例
```

### 启动 Koin

一个完整的 Koin 设置示例：

```kotlin
startKoin {
    // 配置日志记录
    logger(Level.INFO)

    // 加载属性
    environmentProperties()

    // 声明模块
    modules(
        networkModule,
        databaseModule,
        repositoryModule,
        viewModelModule
    )

    // 创建饿汉式单例
    createEagerInstances()
}
```

## Module DSL

有关全面的模块和定义文档，请参阅：
- **[定义](/docs/reference/koin-core/definitions)** - 带有 DSL 和注解的所有定义类型
- **[模块](/docs/reference/koin-core/modules)** - 模块组织和组合
- **[定义参考](/docs/reference/koin-core/definitions)** - 快速查询表

### 快速参考

| 定义 | 经典 Lambda | 经典自动装配 | 编译器插件 |
|------------|----------------|------------------|-----------------|
| 单例 | `single { Class(get()) }` | `singleOf(::Class)` | `single<Class>()` |
| 工厂 | `factory { Class(get()) }` | `factoryOf(::Class)` | `factory<Class>()` |
| 作用域 | `scoped { Class(get()) }` | `scopedOf(::Class)` | `scoped<Class>()` |
| ViewModel | `viewModel { VM(get()) }` | `viewModelOf(::VM)` | `viewModel<VM>()` |

### 基础模块

```kotlin
val myModule = module {
    single<Database>()
    single<UserRepository>()
    factory<UserPresenter>()
}
```

### 模块组合

```kotlin
val appModule = module {
    includes(networkModule, databaseModule)
    single<AppConfig>()
}

startKoin {
    modules(appModule)
}
```

有关详细信息，请参阅 **[模块 - includes()](/docs/reference/koin-core/modules#module-composition-with-includes)**。