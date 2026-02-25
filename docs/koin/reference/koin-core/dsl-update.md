---
title: 构造函数 DSL
---

Koin 现在提供了一种新型 DSL 关键字，允许您直接指向类构造函数，从而避免在 lambda 表达式中输入定义。

对于具有以下依赖项的给定类 `ClassA`：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

您现在可以直接指向 `class constructor` 来声明这些组件：

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

不再需要使用 `get()` 函数在构造函数中指定依赖项了！🎉

:::info
请务必在类名前使用 `::`，以指向您的类构造函数。
:::

:::note
您的构造函数将自动填充所有的 `get()`。请避免使用任何默认值，因为 Koin 会尝试在当前图中查找它。
:::

:::note
如果您需要获取“命名”定义，则需要使用带有 lambda 和 `get()` 的标准 DSL 来指定限定符。
:::

## 可用关键字

以下关键字可用于从构造函数构建您的定义：

* `factoryOf` - 等同于 `factory { }` - 工厂定义
* `singleOf` - 等同于 `single { }` - 单例定义
* `scopedOf` - 等同于 `scoped { }` - 作用域定义

:::info
请务必不要在您的构造函数中使用任何默认值，因为 Koin 会尝试用其填充每个形参。
:::

## DSL 选项

任何构造函数 DSL 定义也可以在 lambda 中开启一些选项：

```kotlin
module {
    singleOf(::ClassA) { 
        // 定义选项
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

常用的选项和 DSL 关键字在此 lambda 中均可用：

* `named("a_qualifier")` - 为定义提供一个字符串限定符
* `named<MyType>()` - 为定义提供一个类型限定符
* `bind<MyInterface>()` - 为给定的 bean 定义添加要绑定的类型
* `binds(listOf(...))` - 为给定的 bean 定义添加类型列表
* `createdAtStart()` - 在 Koin 启动时创建单例实例

您也可以使用 `bind` 或 `binds` 运算符，无需 lambda：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入参数

使用此类声明，您仍然可以使用注入参数。Koin 将在注入参数和当前依赖项中查找，以尝试注入您的构造函数。

示例如下：

```kotlin
class MyFactory(val id : String)
```

使用构造函数 DSL 声明：

```kotlin
module {
    factoryOf(::MyFactory)
}
```

可以像这样注入：

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## 基于反射的 DSL（自 3.2 起已弃用）

:::caution
Koin 反射 DSL 现已弃用。请使用上文中的 Koin 构造函数 DSL。
:::