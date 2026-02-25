---
title: 模块
---

通过使用 Koin，您可以在模块中描述定义。在本节中，我们将了解如何声明、组织和链接您的模块。

## 什么是模块？

Koin 模块是收集 Koin 定义的一个“空间”。它使用 `module` 函数进行声明。

```kotlin
val myModule = module {
    // 您的定义 ...
}
```

## 使用多个模块

组件不一定非得在同一个模块中。模块是一个逻辑空间，可以帮助您组织定义，并且可以依赖于其他模块中的定义。定义是延迟的，只有在组件请求它们时才会被解析。

让我们来看一个例子，其中链接的组件位于不同的模块中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // 单例 ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // 具有链接实例 ComponentA 的单例 ComponentB
    single { ComponentB(get()) }
}
```

:::info 
Koin 没有任何导入概念。Koin 定义是延迟的：Koin 定义随 Koin 容器一起启动，但不会实例化。只有在对其类型发出请求时才会创建实例。
:::

我们只需要在启动 Koin 容器时声明所使用的模块列表：

```kotlin
// 使用 moduleA 和 moduleB 启动 Koin
startKoin {
    modules(moduleA,moduleB)
}
```

然后，Koin 将解析所有给定模块中的依赖项。

## 重写定义或模块 (3.1.0+)

新的 Koin 重写策略默认允许重写任何定义。您不再需要在模块中指定 `override = true`。

如果您在不同的模块中有 2 个具有相同映射的定义，则最后一个将重写当前的定义。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp 将重写 ServiceImp 定义
    modules(myModuleA,myModuleB)
}
```

您可以查看 Koin 日志，了解有关定义映射重写的信息。

您可以在 Koin 应用程序配置中使用 `allowOverride(false)` 指定不允许重写：

```kotlin
startKoin {
    // 禁止定义重写
    allowOverride(false)
}
```

在禁用重写的情况下，对于任何重写尝试，Koin 都会抛出 `DefinitionOverrideException` 异常。

## 共享模块

当使用 `module { }` 函数时，Koin 会预分配所有实例工厂。如果您需要共享模块，请考虑通过函数返回模块。 

```kotlin
fun sharedModule() = module {
    // 您的定义 ...
}
```

这样，您可以共享定义，并避免在变量中预分配工厂。

## 重写定义或模块 (3.1.0 之前)

Koin 不允许您重新定义已经存在的定义（类型、名称、路径等）。如果您尝试这样做，将会收到错误：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// 将抛出 BeanOverrideException
startKoin {
    modules(myModuleA,myModuleB)
}
```

要允许定义重写，您必须使用 `override` 参数：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 为此定义重写
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// 允许重写模块中的所有定义
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
在列出模块和重写定义时，顺序很重要。您必须将执行重写的定义放在模块列表的最后。
:::

## 链接模块的策略

*由于模块间的定义是延迟的*，我们可以使用模块来实现不同的策略：每个模块声明一个实现。

让我们以 Repository 和 Datasource 为例。Repository 需要 Datasource，而 Datasource 可以通过两种方式实现：Local 或 Remote。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

我们可以在 3 个模块中声明这些组件：Repository 模块和每个 Datasource 实现各一个模块：

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

然后我们只需要使用正确的模块组合启动 Koin：

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

## 模块包含 (自 3.2 起)

`Module` 类中提供了一个新函数 `includes()`，它可以让您以有组织且结构化的方式通过包含其他模块来组合模块。

该新功能的两个显著用例是：
- 将大型模块拆分为更小、更专注的模块。
- 在模块化项目中，它可以让您更精细地控制模块的可见性（参见下面的示例）。

它是如何工作的？让我们来看一些模块，并在 `parentModule` 中包含这些模块：

```kotlin
// `:feature` 模块
val childModule1 = module {
    /* 此处为其他定义。 */
}
val childModule2 = module {
    /* 此处为其他定义。 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 模块
startKoin { modules(parentModule) }
```

注意，我们不需要显式设置所有模块：通过包含 `parentModule`，在 `includes` 中声明的所有模块都将被自动加载（`childModule1` 和 `childModule2`）。换句话说，Koin 实际上加载了：`parentModule`、`childModule1` 和 `childModule2`。

值得注意的一个重要细节是，您也可以使用 `includes` 来添加 `internal` 和 `private` 模块——这为您在模块化项目中暴露哪些内容提供了灵活性。

:::info
模块加载现在已经过优化，可以扁平化您的所有模块图，并避免模块的重复定义。
:::

最后，您可以包含多个嵌套或重复的模块，Koin 将扁平化所有包含的模块并移除重复项：

```kotlin
// :feature 模块
val dataModule = module {
    /* 此处为其他定义。 */
}
val domainModule = module {
    /* 此处为其他定义。 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` 模块
startKoin { modules(featureModule1, featureModule2) }
```

请注意，所有模块都将仅包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

:::info
如果您在包含来自同一个文件的模块时遇到任何编译问题，请在您的模块上使用 `get()` Kotlin 属性运算符，或者将每个模块拆分到不同的文件中。请参阅 https://github.com/InsertKoinIO/koin/issues/1341 中的临时解决方法。
:::