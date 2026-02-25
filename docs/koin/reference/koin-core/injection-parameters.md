---
title: 传递参数 - 注入参数
---

在任何定义中，你都可以使用注入参数：这些参数将被注入并供你的定义使用。

## 传递待注入的值

给定一个定义，你可以将参数传递给该定义：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

参数通过 `parametersOf()` 函数传递给你的定义（各值之间用逗号分隔）：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // 将此注入为 View 值
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 定义“注入参数”

下面是一个注入参数的示例。我们确定需要一个 `view` 参数来构建 `Presenter` 类。我们使用 `params` 函数实参来辅助检索注入的参数：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

你也可以直接使用参数对象将注入参数编写为析构声明：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 即使“析构”声明更方便且更易读，但它不是类型安全的。如果你有多个值，Kotlin 将无法检测传递的类型顺序是否正确。
:::

## 按顺序解析注入参数

如果要解析参数，且存在多个相同类型的参数，你可以使用 `get(index)`（也等同于 `[ ]` 运算符），而不是直接使用 `get()`：

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 从图中解析注入参数

Koin 图解析（所有定义的解析主树）也允许你查找注入参数。只需使用常用的 `get()` 函数即可：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 注入参数：索引值或集合 (`3.4.3`)

除 `parametersOf` 外，还可以访问以下 API：

- `parameterArrayOf`：使用一个值数组，数据将通过其索引使用

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`：使用一组不同类型的值。不使用索引来滚动值。

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
  你可以通过 `parametersOf` 或 `parameterArrayOf` 进行“级联”参数注入，从而根据索引消耗值。或者使用 `parametersOf` 或 `parameterSetOf` 根据待解析的类型进行级联。 
:::