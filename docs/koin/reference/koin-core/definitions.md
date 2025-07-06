---
title: 定义
---

通过使用 Koin，你可以在模块中描述定义。本节我们将了解如何声明、组织和链接你的模块。

## 编写模块

Koin 模块是**声明所有组件的空间**。使用 `module` 函数来声明一个 Koin 模块：

```kotlin
val myModule = module {
   // your dependencies here
}
```

在此模块中，你可以按如下方式声明组件。

## 定义单例

声明一个单例组件意味着 Koin 容器将保留你所声明组件的**唯一实例**。在模块中使用 `single` 函数来声明一个单例：

```kotlin
class MyService()

val myModule = module {

    // declare single instance for MyService class
    single { MyService() }
}
```

## 在 Lambda 表达式中定义组件

`single`、`factory` 和 `scoped` 关键字帮助你通过 lambda 表达式声明组件。此 lambda 描述了你构建组件的方式。通常我们通过组件的构造函数来实例化组件，但你也可以使用任何表达式。

`single { Class constructor // Kotlin expression }`

你的 lambda 的结果类型是你的组件的主要类型。

## 定义工厂

工厂组件声明是一种定义，它将**每次**在你请求此定义时都为你提供一个**新实例**（此实例不会被 Koin 容器保留，因为它之后不会将此实例注入到其他定义中）。使用 `factory` 函数和 lambda 表达式来构建组件。

```kotlin
class Controller()

val myModule = module {

    // declare factory instance for Controller class
    factory { Controller() }
}
```

:::info
 Koin 容器不会保留工厂实例，因为它在每次请求定义时都会提供一个新实例。
:::

## 解析和注入依赖

现在我们已经可以声明组件定义了，我们希望通过依赖注入来链接实例。要在 Koin 模块中**解析实例**，只需使用 `get()` 函数来获取请求的所需组件实例。这个 `get()` 函数通常用于构造函数中，以注入构造函数值。

:::info
 要使用 Koin 容器进行依赖注入，我们必须采用**构造函数注入 (constructor injection)** 风格：在类的构造函数中解析依赖。通过这种方式，你的实例将使用 Koin 注入的实例来创建。
:::

让我们用几个类来举例：

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // declare Service as single instance
    single { Service() }
    // declare Controller as single instance, resolving View instance with get()
    single { Controller(get()) }
}
```

## 定义：绑定接口

一个 `single` 或 `factory` 定义使用其给定 lambda 定义中的类型，即： `single { T }` 该定义匹配的类型是此表达式中唯一匹配的类型。

让我们用一个类和已实现的接口来举例：

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

在 Koin 模块中，我们可以按如下方式使用 `as` Kotlin 类型转换操作符：

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single { ServiceImp() as Service }

}
```

你也可以使用推断类型表达式：

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single<Service> { ServiceImp() }

}
```

:::note
 第二种声明风格更受推荐，并将在文档的其余部分中使用。
:::

## 额外的类型绑定

在某些情况下，我们希望从一个定义中匹配多个类型。

让我们用一个类和接口来举例：

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

为了让定义绑定额外的类型，我们与类一起使用 `bind` 操作符：

```kotlin
val myModule = module {

    // Will match types ServiceImp & Service
    single { ServiceImp() } bind Service::class
}
```

请注意，在这里我们可以直接使用 `get()` 解析 `Service` 类型。但如果我们有多个绑定 `Service` 的定义，我们就必须使用 `bind<>()` 函数。

## 定义：命名与默认绑定

你可以为你的定义指定一个名称，以帮助你区分同一类型的两个定义：

只需使用其名称请求你的定义：

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()` 和 `by inject()` 函数允许你在需要时指定一个定义名称。这个名称是由 `named()` 函数生成的**限定符 (qualifier)**。

默认情况下，如果类型已经绑定到一个定义，Koin 将通过其类型或名称来绑定定义。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

然后：

- `val service : Service by inject()` 将触发 `ServiceImpl1` 定义
- `val service : Service by inject(named("test"))` 将触发 `ServiceImpl2` 定义

## 声明注入参数

在任何定义中，你都可以使用注入参数：这些参数将由你的定义注入和使用：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

与已解析的依赖项（使用 `get()` 解析）不同，注入参数是**通过解析 API 传递的参数**。
这意味着这些参数是使用 `get()` 和 `by inject()`，并通过 `parametersOf` 函数传递的值：

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

进一步阅读请参考[注入参数章节](/docs/reference/koin-core/injection-parameters)

## 定义终止 - OnClose

你可以使用 `onClose` 函数，在定义上添加一个回调，当定义关闭时将调用此回调：

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // closing callback - it is Presenter }
}
```

## 使用定义标志

Koin DSL 还提供了一些标志。

### 启动时创建实例

一个定义或一个模块可以被标记为 `CreatedAtStart`，以便在启动时（或在你需要时）创建。首先在你的模块或定义上设置 `createdAtStart` 标志。

定义上的 CreatedAtStart 标志

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 此定义进行立即创建
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

模块上的 CreatedAtStart 标志：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 函数将自动创建带有 `createdAtStart` 标志的定义实例。

```kotlin
// 启动 Koin 模块
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
如果你需要在特定时间（例如在后台线程而不是 UI 线程中）加载某些定义，只需获取/注入所需的组件即可。
:::

### 处理泛型

Koin 定义不考虑泛型类型参数。例如，下面的模块尝试定义两个 List 的定义：

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin 不会使用这样的定义启动，它会认为你想要用一个定义覆盖另一个定义。

为了允许你使用这两个定义，你必须通过它们的名称或位置（模块）来区分它们。例如：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}
```