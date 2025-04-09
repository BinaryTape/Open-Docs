---
title: "Koin DSL"
---
得益于 Kotlin 语言的强大功能，Koin 提供了一种 DSL（领域特定语言）来帮助你描述你的应用程序，而不是注解它或为其生成代码。凭借其 Kotlin DSL，Koin 提供了一个智能的功能 API 来实现依赖注入。

## Application & Module DSL (应用程序 & 模块 DSL)

Koin 提供了几个关键字来让你描述 Koin 应用程序的元素：

- Application DSL（应用程序 DSL），用于描述 Koin 容器配置
- Module DSL（模块 DSL），用于描述必须注入的组件

## Application DSL (应用程序 DSL)

`KoinApplication` 实例是一个 Koin 容器实例配置。这将允许你配置日志记录、属性加载和模块。

要构建一个新的 `KoinApplication`，请使用以下函数：

* `koinApplication { }` - 创建一个 `KoinApplication` 容器配置
* `startKoin { }` - 创建一个 `KoinApplication` 容器配置，并将其注册到 `GlobalContext`（全局上下文）中，以允许使用 GlobalContext API

要配置你的 `KoinApplication` 实例，你可以使用以下任何函数：

* `logger( )` - 描述要使用的级别和 Logger 实现（默认情况下使用 EmptyLogger）
* `modules( )` - 设置要在容器中加载的 Koin 模块列表（列表或可变参数列表）
* `properties()` - 将 HashMap 属性加载到 Koin 容器中
* `fileProperties( )` - 从给定文件将属性加载到 Koin 容器中
* `environmentProperties( )` - 从 OS（操作系统）环境将属性加载到 Koin 容器中
* `createEagerInstances()` - 创建预先实例化的实例（标记为 `createdAtStart` 的 Single 定义）

## KoinApplication 实例：Global vs Local (全局 vs 局部)

正如你在上面看到的，我们可以用两种方式描述 Koin 容器配置：`koinApplication` 或 `startKoin` 函数。

- `koinApplication` 描述一个 Koin 容器实例
- `startKoin` 描述一个 Koin 容器实例，并将其注册到 Koin `GlobalContext`（全局上下文）中

通过将你的容器配置注册到 `GlobalContext`（全局上下文）中，全局 API 可以直接使用它。任何 `KoinComponent` 都引用一个 `Koin` 实例。默认情况下，我们使用来自 `GlobalContext`（全局上下文）的实例。

请查看关于自定义 Koin 实例的章节以获取更多信息。

## Starting Koin (启动 Koin)

启动 Koin 意味着在 `GlobalContext`（全局上下文）中运行一个 `KoinApplication` 实例。

要使用模块启动 Koin 容器，我们可以像这样使用 `startKoin` 函数：

```kotlin
// start a KoinApplication in Global context
startKoin {
    // declare used logger
    logger()
    // declare used modules
    modules(coffeeAppModule)
}
```

## Module DSL (模块 DSL)

一个 Koin 模块收集了你将为你的应用程序注入/组合的定义。要创建一个新的模块，只需使用以下函数：

* `module { // module content }` - 创建一个 Koin 模块

要在模块中描述你的内容，你可以使用以下函数：

* `factory { //definition }` - 提供一个工厂 bean 定义
* `single { //definition  }` - 提供一个单例 bean 定义 (也别名为 `bean`)
* `get()` - 解析一个组件依赖（也可以使用名称、作用域或参数）
* `bind()` - 为给定的 bean 定义添加要绑定的类型
* `binds()` - 为给定的 bean 定义添加类型数组
* `scope { // scope group }` - 为 `scoped` 定义定义一个逻辑组
* `scoped { //definition }`- 提供一个 bean 定义，它只存在于一个作用域中

注意：`named()` 函数允许你通过字符串、枚举或类型来给出一个限定符。它用于命名你的定义。

### Writing a module (编写模块)

一个 Koin 模块是*声明所有组件的空间*。使用 `module` 函数来声明一个 Koin 模块：

```kotlin
val myModule = module {
   // your dependencies here
}
```

在这个模块中，你可以声明如下所述的组件。

### withOptions - DSL Options (since 3.2) （DSL 选项（自 3.2 起））

与新的 [Constructor DSL](./dsl-update.md) 定义一样，你可以使用 `withOptions` 运算符在“常规”定义上指定定义选项：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

在此选项 lambda 中，你可以指定以下选项：

* `named("a_qualifier")` - 给定义一个 String（字符串）限定符
* `named<MyType>()` - 给定义一个 Type（类型）限定符
* `bind<MyInterface>()` - 为给定的 bean 定义添加要绑定的类型
* `binds(arrayOf(...))` - 为给定的 bean 定义添加类型数组
* `createdAtStart()` - 在 Koin 启动时创建单个实例