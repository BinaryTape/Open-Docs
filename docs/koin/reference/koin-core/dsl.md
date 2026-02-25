---
title: Koin DSL
---

感谢 Kotlin 语言的强大功能，Koin 提供了一个 DSL 来帮助您描述应用，而不是对其进行注解或为其生成代码。通过其 Kotlin DSL，Koin 提供了一个高效智能的函数式 API，用于准备您的依赖注入。

## Application 与 Module DSL

Koin 提供了几个关键字，让您描述 Koin 应用程序的元素：

- Application DSL，用于描述 Koin 容器配置
- Module DSL，用于描述必须被注入的组件

## Application DSL

一个 `KoinApplication` 实例是一个 Koin 容器实例配置。这将让您配置日志记录、属性加载和模块。

要构建一个新的 `KoinApplication`，请使用以下函数：

* `koinApplication { }` - 创建一个 `KoinApplication` 容器配置 
* `startKoin { }` - 创建一个 `KoinApplication` 容器配置，并将其注册到 `GlobalContext` 中，以允许使用 GlobalContext API

要配置您的 `KoinApplication` 实例，您可以使用以下任何函数：

* `logger( )` - 描述要使用的级别和 Logger 实现（默认使用 EmptyLogger）
* `modules( )` - 设置要在容器中加载的 Koin 模块列表（列表或可变实参列表）
* `properties()` - 将 HashMap 属性加载到 Koin 容器中
* `fileProperties( )` - 从给定文件加载属性到 Koin 容器中
* `environmentProperties( )` - 从操作系统环境变量加载属性到 Koin 容器中
* `createEagerInstances()` - 创建饿汉式实例（标记为 `createdAtStart` 的 Single 定义）

## KoinApplication 实例：全局 vs 本地

正如您在上面看到的，我们可以通过两种方式描述 Koin 容器配置：`koinApplication` 或 `startKoin` 函数。 

- `koinApplication` 描述一个 Koin 容器实例
- `startKoin` 描述一个 Koin 容器实例，并将其注册到 Koin `GlobalContext` 中

通过将您的容器配置注册到 `GlobalContext` 中，全局 API 可以直接使用它。任何 `KoinComponent` 都指向一个 `Koin` 实例。默认情况下，我们使用来自 `GlobalContext` 的实例。

有关更多信息，请查看关于自定义 Koin 实例的章节。

## 启动 Koin

启动 Koin 意味着在 `GlobalContext` 中运行一个 `KoinApplication` 实例。

要启动带有模块的 Koin 容器，我们可以像这样使用 `startKoin` 函数：

```kotlin
// 在全局上下文中启动 KoinApplication
startKoin {
    // 声明使用的 logger
    logger()
    // 声明使用的模块
    modules(coffeeAppModule)
}
```

## Module DSL

Koin 模块收集了您将为应用程序注入/组合的定义。要创建一个新模块，只需使用以下函数：

* `module { // module content }` - 创建一个 Koin 模块
* `factory { //definition }` - 提供一个工厂 Bean 定义
* `single { //definition  }` - 提供一个单例 Bean 定义（也称为 `bean`）
* `get()` - 解析组件依赖项（也可以使用名称、作用域或形参）
* `bind()` - 为给定的 Bean 定义添加要绑定的类型
* `binds()` - 为给定的 Bean 定义添加类型数组
* `scope { // scope group }` - 为 `scoped` 定义定义一个逻辑组 
* `scoped { //definition }`- 提供一个仅在作用域内存在的 Bean 定义

注意：`named()` 函数允许您通过字符串、枚举或类型提供限定符。它用于为您的定义命名。

### 编写模块

Koin 模块是 *声明所有组件的空间*。使用 `module` 函数来声明一个 Koin 模块：

```kotlin
val myModule = module {
   // 在此处定义您的依赖项
}
```

在此模块中，您可以按照如下所述声明组件。

### withOptions - DSL 选项（自 3.2 起）

与新的 [构造函数 DSL](./dsl-update.md) 定义类似，您可以使用 `withOptions` 运算符在“常规”定义上指定定义选项：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

在此选项 lambda 中，您可以指定以下选项：

* `named("a_qualifier")` - 为定义提供一个字符串限定符
* `named<MyType>()` - 为定义提供一个类型限定符
* `bind<MyInterface>()` - 为给定的 Bean 定义添加要绑定的类型
* `binds(arrayOf(...))` - 为给定的 Bean 定义添加类型数组
* `createdAtStart()` - 在 Koin 启动时创建单例实例