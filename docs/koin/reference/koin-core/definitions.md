---
title: 定义
---

通过使用 Koin，您可以在模块 (module) 中描述定义。在本节中，我们将了解如何声明、组织和链接您的模块。

## 编写模块

Koin 模块是 *声明所有组件的空间*。使用 `module` 函数来声明 Koin 模块：

```kotlin
val myModule = module {
   // 此处编写您的依赖项
}
```

在此模块中，您可以按照下文所述声明组件。

## 定义 singleton

声明一个 singleton 组件意味着 Koin 容器将保留您声明组件的 *唯一实例*。在模块中使用 `single` 函数来声明 singleton：

```kotlin
class MyService()

val myModule = module {

    // 为 MyService 类声明单例实例
    single { MyService() }
}
```

## 在 lambda 中定义组件

`single`、`factory` 和 `scoped` 关键字可帮助您通过 lambda表达式 声明组件。此 lambda 描述了您构建组件的方式。通常我们通过构造函数实例化组件，但您也可以使用任何表达式。

`single { 类构造函数 // Kotlin 表达式 }`

lambda 的结果类型就是组件的主要类型。

## 定义 factory

factory 组件声明是一种定义，每当您请求此定义时，它都会为您提供一个 *新实例*（此实例不会由 Koin 容器保留，因为它稍后不会将此实例注入到其他定义中）。使用带有 lambda表达式 的 `factory` 函数来构建组件。

```kotlin
class Controller()

val myModule = module {

    // 为 Controller 类声明 factory 实例
    factory { Controller() }
}
```

:::info
 Koin 容器不保留 factory 实例，因为每次请求定义时它都会提供一个新实例。
:::

## 解析与注入依赖项

现在我们可以声明组件定义了，我们希望通过依赖注入将实例链接起来。要在 Koin 模块中 *解析实例*，只需使用 `get()` 函数来请求所需的组件实例。此 `get()` 函数通常在构造函数中使用，用于注入构造函数值。

:::info
 要使用 Koin 容器进行依赖注入，我们必须以 *构造函数注入* 风格来编写：在类构造函数中解析依赖项。这样，您的实例将使用来自 Koin 的注入实例创建。
:::

让我们看一个包含多个类的示例：

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // 将 Service 声明为单例实例
    single { Service() }
    // 将 Controller 声明为单例实例，并使用 get() 解析 View 实例
    single { Controller(get()) }
}
```

## 定义：绑定接口

`single` 或 `factory` 定义使用其给定 lambda 定义中的类型，即：`single { T }`。
该定义的匹配类型是此表达式中唯一匹配的类型。

让我们以一个类及其实现的接口为例：

```kotlin
// Service 接口
interface Service{

    fun doSomething()
}

// Service 实现
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

在 Koin 模块中，我们可以按如下方式使用 Kotlin 的 `as` 转换运算符：

```kotlin
val myModule = module {

    // 仅匹配 ServiceImp 类型
    single { ServiceImp() }

    // 仅匹配 Service 类型
    single { ServiceImp() as Service }

}
```

您也可以使用推断类型表达式：

```kotlin
val myModule = module {

    // 仅匹配 ServiceImp 类型
    single { ServiceImp() }

    // 仅匹配 Service 类型
    single<Service> { ServiceImp() }

}
```

:::note
 首选第二种样式的声明方式，本文档的其余部分将采用该方式。
:::

## 附加类型绑定

在某些情况下，我们希望从一个定义中匹配多个类型。

让我们以一个类和接口为例：

```kotlin
// Service 接口
interface Service{

    fun doSomething()
}

// Service 实现
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

要使定义绑定附加类型，我们对类使用 `bind` 运算符：

```kotlin
val myModule = module {

    // 将匹配 ServiceImp 和 Service 类型
    single { ServiceImp() } bind Service::class
}
```

请注意，在这里我们可以直接通过 `get()` 解析 `Service` 类型。但如果我们有多个绑定 `Service` 的定义，则必须使用 `bind<>()` 函数。

## 定义：命名与默认绑定

您可以为定义指定一个名称，以帮助您区分相同类型的两个定义：

只需通过名称请求您的定义：

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

如果需要，`get()` 和 `by inject()` 函数允许您指定定义名称。此名称是由 `named()` 函数生成的 `qualifier`。

默认情况下，如果类型已绑定到某个定义，Koin 将按其类型或名称绑定定义。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

那么：

- `val service : Service by inject()` 将触发 `ServiceImpl1` 定义
- `val service : Service by inject(named("test"))` 将触发 `ServiceImpl2` 定义

## 声明注入参数

在任何定义中，您都可以使用注入参数：这些参数将被注入并供您的定义使用：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

与解析的依赖项（通过 `get()` 解析）相反，注入参数是 *通过解析 API 传递的参数*。
这意味着这些参数是使用 `get()` 和 `by inject()` 配合 `parametersOf` 函数传递的值：

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

更多阅读请参阅 [注入参数部分](/docs/reference/koin-core/injection-parameters)

## 定义终止 - OnClose

您可以使用 `onClose` 函数为定义添加一个回调，该回调将在定义关闭被调用时执行：

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // 关闭回调 - 它是 Presenter }
}
```

## 使用定义标志

Koin DSL 还提供了一些标志 (flags)。

### 在启动时创建实例

定义或模块可以标记为 `CreatedAtStart`，以便在启动时（或您希望的时间）创建。首先在您的模块或定义上设置 `createdAtStart` 标志。

在定义上设置 CreatedAtStart 标志

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 为此定义启用预先创建
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

在模块上设置 CreatedAtStart 标志：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 函数将自动创建标记有 `createdAtStart` 的定义实例。

```kotlin
// 启动 Koin 模块
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
如果您需要在特殊时间加载某些定义（例如在后台线程而不是 UI 线程中），只需获取 (get)/注入 (inject) 所需的组件即可。
:::

### 处理泛型

Koin 定义不考虑泛型类型实参。例如，下面的模块尝试定义两个 List 定义：

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin 将无法启动此类定义，因为它会认为您想用一个定义覆盖另一个定义。

为了允许您使用这两个定义，您必须通过它们的名称或位置（模块）来区分它们。例如：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}