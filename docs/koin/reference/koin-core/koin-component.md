---
title: Koin 组件
---

Koin 是一个 DSL，用于帮助描述你的模块和定义，它是一个用于定义解析的容器。我们现在需要一个 API 来从容器外部获取我们的实例。这就是 Koin 组件的目标。

:::info
`KoinComponent` 接口旨在帮助你直接从 Koin 获取实例。请注意，这会将你的类与 Koin 容器 API 关联起来。避免在可以在 `modules` 中声明的类上使用它，并优先选择构造函数注入。
:::

## 创建 Koin 组件

要赋予一个类使用 Koin 功能的能力，我们需要使用 `KoinComponent` 接口来*标记它*。让我们看一个例子。

定义 MyService 实例的模块
```kotlin
class MyService

val myModule = module {
    // 为 MyService 定义一个单例
    single { MyService() }
}
```

在使用定义之前，我们先启动 Koin。

使用 myModule 启动 Koin

```kotlin
fun main(vararg args : String){
    // 启动 Koin
    startKoin {
        modules(myModule)
    }

    // 创建 MyComponent 实例并从 Koin 容器中注入
    MyComponent()
}
```

以下是我们如何编写 `MyComponent` 以从 Koin 容器中获取实例。

使用 get() 和 by inject() 注入 MyService 实例

```kotlin
class MyComponent : KoinComponent {

    // 延迟注入 Koin 实例
    val myService : MyService by inject()

    // 或者
    // 即时注入 Koin 实例
    val myService : MyService = get()
}
```

## 通过 KoinComponents 解锁 Koin API

一旦你将类标记为 `KoinComponent`，你就可以访问：

*   `by inject()` - 从 Koin 容器中延迟评估的实例
*   `get()` - 从 Koin 容器中即时获取实例
*   `getProperty()`/`setProperty()` - 获取/设置属性

## 使用 get 和 inject 获取定义

Koin 提供了两种从 Koin 容器中获取实例的方式：

*   `val t : T by inject()` - 延迟评估的委托实例
*   `val t : T = get()` - 即时访问实例

```kotlin
// 是延迟评估的
val myService : MyService by inject()

// 直接获取实例
val myService : MyService = get()
```

:::note
延迟注入形式更适合定义需要延迟评估的属性。
:::

## 根据名称解析实例

如果需要，你可以为 `get()` 或 `by inject()` 指定以下参数：

*   `qualifier` - 定义的名称（当你在定义中指定了名称参数时）

使用定义名称的模块示例：

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

我们可以进行以下解析：

```kotlin
// 从给定模块中获取
val a = get<ComponentA>(named("A"))
```