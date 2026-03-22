---
title: 自动装配 DSL
---

Koin 提供了一种自动装配 DSL，允许您直接指向类构造函数并自动装配依赖项。

:::tip
如果您正在使用 **Koin 编译器插件**，请考虑使用 [编译器插件 DSL](/docs/setup/compiler-plugin)，它提供了类似的自动装配功能，并具有额外的编译时安全性。
:::

## 经典自动装配 DSL

对于具有以下依赖项的给定类 `ClassA`：

```kotlin
class ClassA(val b: ClassB, val c: ClassC)
class ClassB()
class ClassC()
```

声明指向类构造函数的组件：

```kotlin
import org.koin.dsl.*

module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

不再需要使用 `get()` 函数指定依赖项了！

:::info
请在类名前使用 `::` 以指向构造函数。
:::

:::note
您的构造函数将自动填充所有必需的依赖项。请避免使用默认值，因为 Koin 会尝试解析所有形参。
:::

## 与编译器插件 DSL 的对比

| 经典自动装配 | 编译器插件 |
|------------------|-----------------|
| `singleOf(::ClassA)` | `single<ClassA>()` |
| `factoryOf(::ClassA)` | `factory<ClassA>()` |
| `scopedOf(::ClassA)` | `scoped<ClassA>()` |
| 包：`org.koin.dsl` | 包：`org.koin.plugin.module.dsl` |

编译器插件 DSL 提供了相同的自动装配能力，并增加了额外的编译时验证。

## 可用关键字

以下自动装配关键字可用于从构造函数构建您的定义：

* `factoryOf` - 等同于 `factory { }` - 工厂定义
* `singleOf` - 等同于 `single { }` - 单例定义
* `scopedOf` - 等同于 `scoped { }` - 作用域定义

:::info
请务必不要在您的构造函数中使用任何默认值，因为 Koin 会尝试用其填充每个形参。
:::

## DSL 选项

任何自动装配 DSL 定义也可以在 lambda 中开启一些选项：

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
* `bind<MyInterface>()` - 为给定的定义添加要绑定的类型
* `binds(listOf(...))` - 为给定的定义添加类型列表
* `createdAtStart()` - 在 Koin 启动时创建单例实例

您也可以使用 `bind` 或 `binds` 运算符，无需 lambda：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入参数

使用自动装配 DSL 声明，您仍然可以使用注入参数。Koin 将在注入参数和当前依赖项中查找，以尝试注入您的构造函数。

示例如下：

```kotlin
class MyFactory(val id : String)
```

使用自动装配 DSL 声明：

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
Koin 反射 DSL 现已弃用。请使用上文中的 Koin 自动装配 DSL。
:::