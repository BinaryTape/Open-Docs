---
title: 传递参数 - 注入参数
---

在任何定义中，你都可以使用注入参数：这些参数将被注入并由你的定义使用。

## 传递注入值

给定一个定义，你可以向该定义传递参数：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

参数通过 `parametersOf()` 函数传递给你的定义（每个值用逗号分隔）：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // inject this as View value
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 定义一个“注入参数”

下面是注入参数的一个示例。我们已经确定需要一个 `view` 参数来构建 `Presenter` 类。我们使用 `params` 函数参数来帮助检索我们的注入参数：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

你也可以直接使用参数对象来编写注入参数，作为解构声明：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 即使“解构”声明更方便、更具可读性，但它不是类型安全的。如果你有多个值，Kotlin 将不会检测到传递的类型是否顺序正确。
:::

## 按顺序解析注入参数

如果你的同一类型参数有多个，你可以使用索引 `get(index)`（也等同于 `[ ]` 操作符），而不是使用 `get()` 来解析参数：

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 从图中解析注入参数

Koin 图解析（所有定义的解析主树）也允许你查找注入参数。只需使用常见的 `get()` 函数：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 注入参数：索引值或集合（3.4.3）

除了 `parametersOf` 之外，还可以访问以下 API：

- `parameterArrayOf`: 用于使用值数组，数据将通过其索引使用

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 用于使用值集合，其中包含不同类型。不使用索引来滚动值。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

默认函数 `parametersOf` 同时支持索引和值集合：

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
 你可以使用 `parametersOf` 或 `parameterArrayOf` 进行参数的“级联”注入，以根据索引消费值。或者使用 `parametersOf` 或 `parameterSetOf` 以根据类型级联解析。
:::