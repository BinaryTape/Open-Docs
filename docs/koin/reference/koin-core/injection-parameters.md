---
title: "传递参数 - 注入参数"
---
在任何定义中，你都可以使用注入参数（injection parameters）：这些参数将被注入并被你的定义使用。

## 传递值以进行注入

给定一个定义，你可以将参数传递给该定义：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

参数通过 `parametersOf()` 函数发送到你的定义（每个值用逗号分隔）：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // 将此作为 View 值注入
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 定义一个 "注入参数"

下面是一个注入参数的例子。我们确定我们需要一个 `view` 参数来构建 `Presenter` 类。我们使用 `params` 函数参数来帮助检索我们注入的参数：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

你也可以直接使用参数对象编写注入的参数，作为解构声明：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
即使 "解构" 声明更方便和可读，但它不是类型安全的。 如果你有多个值，Kotlin 不会检测到传递的类型是否顺序正确
:::

## 按顺序解析注入参数

如果你有几个相同类型的参数，你可以使用索引来代替使用 `get()` 来解析参数，如下所示 `get(index)` (与 `[ ]` 运算符相同):

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 从依赖关系图（graph）中解析注入参数

Koin 依赖关系图解析（所有定义解析的主树）也允许你找到注入的参数。只需使用常用的 `get()` 函数：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 注入参数：索引值或集合 (`3.4.3`)

除了 `parametersOf` 之外，还可以访问以下 API：

- `parameterArrayOf`: 使用值数组，数据将按其索引使用

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 使用一组值，具有不同的种类。 不使用索引来滚动值。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

默认函数 `parametersOf` 适用于索引和值集：

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
  你可以使用 `parametersOf` 或 `parameterArrayOf` "级联" 参数注入，以根据索引使用值。 或者使用 `parametersOf` 或 `parameterSetOf` 根据类型进行级联以进行解析。 
:::