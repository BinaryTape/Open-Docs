---
title: Koin DSL
---

得益于 Kotlin 语言的强大，Koin 提供了一种 DSL（领域特定语言）来帮助你描述你的应用程序，而不是通过注解或生成代码。凭借其 Kotlin DSL，Koin 提供了一个智能的函数式 API 来帮助你准备依赖注入。

## 应用程序与模块 DSL

Koin 提供了几个关键字，让你能够描述 Koin 应用程序的各个元素：

-   应用程序 DSL：用于描述 Koin 容器配置
-   模块 DSL：用于描述需要注入的组件

## 应用程序 DSL

`KoinApplication` 实例是 Koin 容器实例的配置。这允许你配置日志记录、属性加载和模块。

要构建一个新的 `KoinApplication`，请使用以下函数：

*   `koinApplication { }` - 创建一个 `KoinApplication` 容器配置
*   `startKoin { }` - 创建一个 `KoinApplication` 容器配置并将其注册到 `GlobalContext` 中，以允许使用 `GlobalContext` API

要配置你的 `KoinApplication` 实例，你可以使用以下任何函数：

*   `logger( )` - 描述要使用的级别和 `Logger` 实现（默认使用 `EmptyLogger`）
*   `modules( )` - 设置要在容器中加载的 Koin 模块列表（列表或可变参数列表）
*   `properties()` - 将 `HashMap` 属性加载到 Koin 容器中
*   `fileProperties( )` - 从给定文件加载属性到 Koin 容器中
*   `environmentProperties( )` - 从操作系统环境加载属性到 Koin 容器中
*   `createEagerInstances()` - 创建急切实例（标记为 `createdAtStart` 的 `Single` 定义）

## KoinApplication 实例：全局 vs 局部

如你所见，我们可以通过两种方式描述 Koin 容器配置：`koinApplication` 或 `startKoin` 函数。

-   `koinApplication` 描述一个 Koin 容器实例
-   `startKoin` 描述一个 Koin 容器实例并将其注册到 Koin 的 `GlobalContext` 中

通过将你的容器配置注册到 `GlobalContext` 中，全局 API 可以直接使用它。任何 `KoinComponent` 都指向一个 `Koin` 实例。默认情况下，我们使用 `GlobalContext` 中的实例。

有关更多信息，请查看有关自定义 Koin 实例的章节。

## 启动 Koin

启动 Koin 意味着在 `GlobalContext` 中运行一个 `KoinApplication` 实例。

要使用模块启动 Koin 容器，我们只需像这样使用 `startKoin` 函数：

```kotlin
// 在全局上下文启动一个 KoinApplication
startKoin {
    // 声明使用的日志记录器
    logger()
    // 声明使用的模块
    modules(coffeeAppModule)
}
```

## 模块 DSL

Koin 模块收集你将为应用程序注入/组合的定义。要创建新模块，只需使用以下函数：

*   `module { // module content }` - 创建一个 Koin 模块

要在模块中描述你的内容，你可以使用以下函数：

*   `factory { //definition }` - 提供一个 `factory` bean 定义
*   `single { //definition }` - 提供一个 `singleton` bean 定义（也别名为 `bean`）
*   `get()` - 解析组件依赖（也可以使用名称、作用域或参数）
*   `bind()` - 为给定的 bean 定义添加要绑定的类型
*   `binds()` - 为给定的 bean 定义添加类型数组
*   `scope { // scope group }` - 为 `scoped` 定义指定一个逻辑组
*   `scoped { //definition }` - 提供一个只存在于某个作用域的 `bean` 定义

注意：`named()` 函数允许你通过字符串、枚举或类型提供一个限定符。它用于为你的定义命名。

### 编写模块

Koin 模块是*声明所有组件的空间*。使用 `module` 函数声明一个 Koin 模块：

```kotlin
val myModule = module {
   // 你的依赖项在此
}
```

在此模块中，你可以声明如下所述的组件。

### withOptions - DSL 选项（自 3.2 起）

与新的 [构造函数 DSL](./dsl-update.md) 定义一样，你可以使用 `withOptions` 操作符在“常规”定义上指定定义选项：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

在此选项 `lambda` 中，你可以指定以下选项：

*   `named("a_qualifier")` - 为定义提供一个字符串限定符
*   `named<MyType>()` - 为定义提供一个类型限定符
*   `bind<MyInterface>()` - 为给定的 bean 定义添加要绑定的类型
*   `binds(arrayOf(...))` - 为给定的 bean 定义添加类型数组
*   `createdAtStart()` - 在 Koin 启动时创建 `single` 实例