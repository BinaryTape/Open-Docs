---
title: 解构声明
---
有时，将一个对象*解构（destructure）*为多个变量会很方便，例如：

```kotlin
val (name, age) = person
```

这种语法称为*解构声明（destructuring declaration）*。一个解构声明同时创建多个变量。
你已经声明了两个新的变量：`name` 和 `age`，并且可以独立地使用它们：

```kotlin
println(name)
println(age)
```

解构声明会被编译成以下代码：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函数是 Kotlin 中广泛使用的*约定原则（principle of conventions）*的另一个例子
（例如像 `+` 和 `*` 这样的操作符，以及 `for` 循环）。
只要可以调用所需数量的 `component` 函数，任何东西都可以放在解构声明的右侧。
当然，也可以有 `component3()` 和 `component4()` 等等。

:::note
`componentN()` 函数需要用 `operator` 关键字标记，以便允许在解构声明中使用它们。

:::

解构声明也适用于 `for` 循环：

```kotlin
for ((a, b) in collection) { ... }
```

变量 `a` 和 `b` 获取对集合元素调用 `component1()` 和 `component2()` 返回的值。

## 示例：从函数返回两个值

假设你需要从一个函数返回两个东西——例如，一个结果对象和一个某种类型的状态。
在 Kotlin 中实现此目的的一种简洁方法是声明一个 [数据类（data class）](data-classes) 并返回它的实例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// 现在，要使用这个函数：
val (result, status) = function(...)
```

由于数据类自动声明 `componentN()` 函数，因此解构声明在这里适用。

:::note
你也可以使用标准类 `Pair` 并让 `function()` 返回 `Pair<Int, Status>`，
但通常最好让你的数据被正确地命名。

:::

## 示例：解构声明和映射

遍历映射（map）可能最好的方式是：

```kotlin
for ((key, value) in map) {
   // 用 key 和 value 做一些事情
}
```

为了使这个工作正常，你应该：

* 通过提供一个 `iterator()` 函数将映射表示为一个值的序列。
* 通过提供函数 `component1()` 和 `component2()` 将每个元素表示为一个对。

实际上，标准库提供了这样的扩展：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以自由地在带有映射的 `for` 循环中使用解构声明（以及数据类实例或类似物的集合）。

## 未使用变量的下划线

如果你在解构声明中不需要某个变量，你可以用下划线代替它的名称：

```kotlin
val (_, status) = getResult()
```

在这种方式跳过的组件，不会调用 `componentN()` 操作符函数。

## Lambda 表达式中的解构

你可以对 lambda 表达式参数使用解构声明语法。
如果一个 lambda 表达式具有 `Pair` 类型（或 `Map.Entry`，或任何具有适当的 `componentN` 函数的类型）的参数，你可以通过将它们放在括号中来引入几个新参数来代替一个参数：

```kotlin
map.mapValues { entry `->` "${entry.value}!" }
map.mapValues { (key, value) `->` "$value!" }
```

注意声明两个参数和声明一个解构对而不是一个参数之间的区别：

```kotlin
{ a `->` ... } // 一个参数
{ a, b `->` ... } // 两个参数
{ (a, b) `->` ... } // 一个解构对
{ (a, b), c `->` ... } // 一个解构对和另一个参数
```

如果解构参数的组件未使用，你可以用下划线替换它，以避免发明它的名字：

```kotlin
map.mapValues { (_, value) `->` "$value!" }
```

你可以为整个解构参数或为特定组件分别指定类型：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> `->` "$value!" }

map.mapValues { (_, value: String) `->` "$value!" }
```