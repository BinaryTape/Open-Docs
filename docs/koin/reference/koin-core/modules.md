---
title: 模块
---
通过使用 Koin，你可以在模块中描述定义。在本节中，我们将了解如何声明、组织和链接你的模块。

## 什么是模块？

Koin 模块是收集 Koin 定义的“空间”。它通过 `module` 函数声明。

```kotlin
val myModule = module {
    // 你的定义 ...
}
```

## 使用多个模块

组件不必一定在同一个模块中。模块是一个逻辑空间，可以帮助你组织你的定义，并且可以依赖于其他模块中的定义。定义是延迟的（lazy），因此只有在组件请求时才会被解析。

让我们举一个例子，其中链接的组件位于不同的模块中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // Singleton ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // Singleton ComponentB with linked instance ComponentA
    single { ComponentB(get()) }
}
```

:::info
Koin 没有任何导入（import）的概念。Koin 定义是延迟的（lazy）：Koin 定义由 Koin 容器启动，但不会被实例化。只有在请求其类型时才会创建实例。
:::

我们只需要在启动 Koin 容器时声明使用的模块列表：

```kotlin
// 使用 moduleA 和 moduleB 启动 Koin
startKoin {
    modules(moduleA,moduleB)
}
```

然后，Koin 将解析来自所有给定模块的依赖项。

## 覆盖定义或模块 (3.1.0+)

新的 Koin 覆盖策略允许默认覆盖任何定义。你不再需要在模块中指定 `override = true`。

如果你在不同的模块中有 2 个具有相同映射的定义，则最后一个将覆盖当前的定义。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp 将覆盖 ServiceImp 定义
    modules(myModuleA,myModuleB)
}
```

你可以在 Koin 日志中查看有关定义映射覆盖的信息。

你可以使用 `allowOverride(false)` 指定不允许在你的 Koin 应用程序配置中进行覆盖：

```kotlin
startKoin {
    // 禁止定义覆盖
    allowOverride(false)
}
```

在禁用覆盖的情况下，Koin 将在任何覆盖尝试时抛出一个 `DefinitionOverrideException` 异常。

## 共享模块

当使用 `module { }` 函数时，Koin 会预先分配所有实例工厂。如果你需要共享一个模块，请考虑使用函数返回你的模块。

```kotlin
fun sharedModule() = module {
    // 你的定义 ...
}
```

这样，你可以共享定义并避免在一个值中预先分配工厂。

## 覆盖定义或模块 (3.1.0 之前)

Koin 不允许你重新定义已存在的定义（类型、名称、路径 ...）。如果你尝试这样做，你会得到一个错误：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// 将抛出一个 BeanOverrideException 异常
startKoin {
    modules(myModuleA,myModuleB)
}
```

要允许定义覆盖，你必须使用 `override` 参数：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 覆盖此定义
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// 允许覆盖模块中的所有定义
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
当列出模块和覆盖定义时，顺序很重要。你必须将你的覆盖定义放在模块列表的最后。
:::

## 链接模块策略

*由于模块之间的定义是延迟的（lazy）*，我们可以使用模块来实现不同的策略实现：为每个模块声明一个实现。

让我们举一个 Repository（仓库）和 Datasource（数据源）的例子。一个 Repository 需要一个 Datasource，而一个 Datasource 可以通过两种方式实现：Local（本地）或 Remote（远程）。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

我们可以在 3 个模块中声明这些组件：Repository 和每个 Datasource 实现一个模块：

```kotlin
val repositoryModule = module {
    single { Repository(get()) }
}

val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}
```

然后，我们只需要使用正确的模块组合来启动 Koin：

```kotlin
// 加载 Repository + Local Datasource 定义
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// 加载 Repository + Remote Datasource 定义
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 模块包含 (since 3.2)

`Module` 类中提供了一个新的函数 `includes()`，它允许你通过以有组织和结构化的方式包含其他模块来组成一个模块。

这个新功能的两个主要用例是：
- 将大型模块拆分为更小、更集中的模块。
- 在模块化项目中，它允许你更好地控制模块的可见性（请参见下面的示例）。

它是如何工作的？让我们获取一些模块，并将模块包含在 `parentModule` 中：

```kotlin
// `:feature` module
val childModule1 = module {
    /* 其他定义. */
}
val childModule2 = module {
    /* 其他定义. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

请注意，我们不需要显式地设置所有模块：通过包含 `parentModule`，`includes` 中声明的所有模块将自动加载（`childModule1` 和 `childModule2`）。换句话说，Koin 实际上加载了：`parentModule`、`childModule1` 和 `childModule2`。

一个需要注意的重要细节是，你可以使用 `includes` 来添加 `internal` 和 `private` 模块 - 这使你可以灵活地控制在模块化项目中公开的内容。

:::info
模块加载现在已优化为展平所有模块图，并避免模块的重复定义。
:::

最后，你可以包含多个嵌套的或重复的模块，Koin 将展平所有包含的模块并删除重复项：

```kotlin
// :feature module
val dataModule = module {
    /* 其他定义. */
}
val domainModule = module {
    /* 其他定义. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` module
startKoin { modules(featureModule1, featureModule2) }
```

请注意，所有模块将仅包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

:::info
如果在包含来自同一文件的模块时遇到任何编译问题，请在你的模块上使用 `get()` Kotlin 属性运算符，或者将每个模块分成不同的文件。请参阅 https://github.com/InsertKoinIO/koin/issues/1341 变通方法
:::