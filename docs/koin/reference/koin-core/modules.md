---
title: 模块
---

通过使用 Koin，您可以在模块中描述定义。在本节中，我们将了解如何声明、组织和链接您的模块。

## 什么是模块？

Koin 模块是收集 Koin 定义的“空间”。它使用 `module` 函数声明。

```kotlin
val myModule = module {
    // Your definitions ...
}
```

## 使用多个模块

组件不必都放在同一个模块中。模块是一个逻辑空间，用于帮助您组织定义，并且可以依赖于其他模块的定义。定义是惰性的，因此仅当组件请求时才解析。

让我们来看一个示例，其中链接的组件位于不同的模块中：

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
Koin 没有导入 (import) 的概念。Koin 定义是惰性的：Koin 定义随 Koin 容器启动但不会被实例化。只有当对其类型发出请求时，才会创建实例。
:::

当启动 Koin 容器时，我们只需声明所使用的模块列表即可：

```kotlin
// Start Koin with moduleA & moduleB
startKoin {
    modules(moduleA,moduleB)
}
```

Koin 随后将从所有给定模块中解析依赖项。

## 覆盖定义或模块 (3.1.0+)

新的 Koin 覆盖 (override) 策略允许默认覆盖任何定义。您不再需要在模块中指定 `override = true`。

如果您在不同模块中有两个具有相同映射的定义，则后者将覆盖当前定义。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp will override ServiceImp definition
    modules(myModuleA,myModuleB)
}
```

您可以在 Koin 日志中查看有关定义映射覆盖的信息。

您可以在 Koin 应用程序配置中通过 `allowOverride(false)` 指定不允许覆盖：

```kotlin
startKoin {
    // Forbid definition override
    allowOverride(false)
}
```

如果禁用覆盖，Koin 将在任何尝试覆盖时抛出 `DefinitionOverrideException` 异常。

## 共享模块

当使用 `module { }` 函数时，Koin 会预先分配所有实例工厂 (instance factories)。如果您需要共享模块，请考虑使用函数返回您的模块。

```kotlin
fun sharedModule() = module {
    // Your definitions ...
}
```

通过这种方式，您可以共享定义并避免在值中预先分配工厂。

## 覆盖定义或模块 (3.1.0 之前)

Koin 不允许您重新定义已存在的定义（类型、名称、路径等）。如果您尝试这样做，将会收到错误：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// Will throw an BeanOverrideException
startKoin {
    modules(myModuleA,myModuleB)
}
```

要允许定义覆盖，您必须使用 `override` 参数：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // override for this definition
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// Allow override for all definitions from module
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
 在列出模块和覆盖定义时，顺序很重要。您必须将覆盖定义放在模块列表的最后。
:::

## 链接模块策略

*由于模块之间的定义是惰性的*，我们可以使用模块来实现不同的策略实现：为每个模块声明一个实现。

让我们以 Repository 和 Datasource 为例。一个 Repository 需要一个 Datasource，而 Datasource 可以通过两种方式实现：本地 (Local) 或远程 (Remote)。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

我们可以将这些组件声明在 3 个模块中：Repository 模块和每个 Datasource 实现一个模块：

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

然后，我们只需启动 Koin 并结合正确的模块组合即可：

```kotlin
// Load Repository + Local Datasource definitions
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Load Repository + Remote Datasource definitions
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 模块包含 (Module Includes) (自 3.2 起)

`Module` 类中提供了一个新函数 `includes()`，它允许您通过以有组织和结构化的方式包含其他模块来组合一个模块。

这项新功能的两个突出用例是：
- 将大型模块拆分为更小、更专注的模块。
- 在模块化项目中，它允许您对模块可见性 (module visibility) 有更精细的控制（参见下面的示例）。

它是如何工作的？让我们来看一些模块，并将它们包含在 `parentModule` 中：

```kotlin
// `:feature` module
val childModule1 = module {
    /* Other definitions here. */
}
val childModule2 = module {
    /* Other definitions here. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

请注意，我们不需要显式设置所有模块：通过包含 `parentModule`，所有在 `includes` 中声明的模块都将自动加载（`childModule1` 和 `childModule2`）。换句话说，Koin 实际上加载了：`parentModule`、`childModule1` 和 `childModule2`。

一个重要的细节是，您还可以使用 `includes` 来添加 `internal` 和 `private` 模块——这使您在模块化项目中对要公开的内容具有更大的灵活性。

:::info
模块加载现在经过优化，可以扁平化所有模块图并避免模块定义的重复。
:::

最后，您可以包含多个嵌套或重复的模块，Koin 将扁平化所有包含的模块并删除重复项：

```kotlin
// :feature module
val dataModule = module {
    /* Other definitions here. */
}
val domainModule = module {
    /* Other definitions here. */
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

请注意，所有模块将只包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

:::info
如果您在从同一个文件包含模块时遇到任何编译问题，请在您的模块上使用 `get()` Kotlin 属性操作符，或者将每个模块分离到不同的文件中。请参阅 https://github.com/InsertKoinIO/koin/issues/1341 的解决方法 (workaround)。
:::