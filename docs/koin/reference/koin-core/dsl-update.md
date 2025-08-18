---
title: 构造函数 DSL
---

Koin 现在提供了一种新型的 DSL 关键字，允许你直接面向类的构造函数，并避免在 lambda 表达式中定义你的类型。

对于具有以下依赖的给定类 `ClassA`：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

你现在可以直接面向`类构造函数`来声明这些组件：

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

不再需要使用 `get()` 函数在构造函数中指定依赖！🎉

:::info
确保在你的类名之前使用 `::`，以指向你的类构造函数。
:::

:::note
你的构造函数将自动填充所有的 `get()` 调用。避免使用任何默认值，因为 Koin 将尝试在当前图中查找它。
:::

:::note
如果你需要获取一个“命名”定义，你需要使用带有 lambda 和 `get()` 的标准 DSL 来指定限定符。
:::

## 可用关键字

以下关键字可用于从构造函数构建你的定义：

*   `factoryOf` - 相当于 `factory { }` - 工厂定义
*   `singleOf` - 相当于 `single { }` - 单例定义
*   `scopedOf` - 相当于 `scoped { }` - 作用域定义

:::info
确保不要在构造函数中使用任何默认值，因为 Koin 将尝试使用它填充每个参数。
:::

## DSL 选项

任何构造函数 DSL 定义，也可以在 lambda 中开启一些选项：

```kotlin
module {
    singleOf(::ClassA) { 
        // definition options
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

常用的选项和 DSL 关键字在此 lambda 中可用：

*   `named("a_qualifier")` - 为定义指定一个字符串限定符
*   `named<MyType>()` - 为定义指定一个类型限定符
*   `bind<MyInterface>()` - 为给定的 bean 定义添加要绑定的类型
*   `binds(listOf(...))` - 为给定的 bean 定义添加类型列表
*   `createdAtStart()` - 在 Koin 启动时创建单例实例

你也可以使用 `bind` 或 `binds` 操作符，无需 lambda：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入参数

采用这种声明方式，你仍然可以使用注入参数。Koin 将在注入参数和当前依赖中查找，以尝试注入你的构造函数。

如下所示：

```kotlin
class MyFactory(val id : String)
```

使用构造函数 DSL 声明：

```kotlin
module {
    factoryOf(::MyFactory)
}
```

可以这样注入：

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## 基于反射的 DSL（自 3.2 版起已弃用）

:::caution
Koin 反射 DSL 现已弃用。请使用上方的 Koin 构造函数 DSL。
:::