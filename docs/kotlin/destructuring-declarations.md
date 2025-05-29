[//]: # (title: 解构声明)

有时，将一个对象*解构*成多个变量会很方便，例如：

```kotlin
val (name, age) = person
```

这种语法被称为*解构声明*。解构声明可以一次性创建多个变量。
你已经声明了两个新变量：`name` 和 `age`，并且可以独立地使用它们：

 ```kotlin
println(name)
println(age)
```

解构声明会被编译为以下代码：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函数是 Kotlin 中广泛使用的*约定俗成原则*的又一个例子（参见 `+` 和 `*` 等运算符、`for` 循环作为示例）。
解构声明的右侧可以是任何东西，只要在其上可以调用所需数量的 `component` 函数。当然，也可以有 `component3()`、`component4()` 等等。

> `componentN()` 函数需要用 `operator` 关键字标记，才能允许在解构声明中使用。
>
{style="note"}

解构声明也适用于 `for` 循环：

```kotlin
for ((a, b) in collection) { ... }
```

变量 `a` 和 `b` 会获取对集合元素调用 `component1()` 和 `component2()` 所返回的值。

## 示例：从函数返回两个值

假设你需要从一个函数中返回两个值——例如，一个结果对象和某种状态。
在 Kotlin 中实现此目的的一种紧凑方式是声明一个 [数据类](data-classes.md) 并返回其实例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

由于数据类会自动声明 `componentN()` 函数，因此解构声明在这里也适用。

> 你也可以使用标准类 `Pair` 并让 `function()` 返回 `Pair<Int, Status>`，
> 但通常最好为你的数据恰当地命名。
>
{style="note"}

## 示例：解构声明与映射 (Map)

遍历映射 (Map) 的最佳方式可能是这样的：

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

为了使其工作，你应该：

* 通过提供 `iterator()` 函数，将映射 (Map) 表示为值的序列。
* 通过提供 `component1()` 和 `component2()` 函数，将每个元素表示为一对 (Pair)。

实际上，标准库提供了此类扩展：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以在 `for` 循环中自由地使用解构声明与映射 (Map)（以及数据类实例的集合或类似情况）。

## 未使用的变量使用下划线

如果你不需要解构声明中的某个变量，可以用下划线 `_` 代替其名称：

```kotlin
val (_, status) = getResult()
```

`componentN()` 运算符函数不会调用以这种方式跳过的组件。

## Lambda 表达式中的解构

你可以对 Lambda 参数使用解构声明语法。
如果 Lambda 表达式的参数是 `Pair` 类型（或 `Map.Entry`，或任何其他具有相应 `componentN` 函数的类型），你可以通过将它们放入括号中来引入多个新参数而不是一个：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

请注意声明两个参数和声明一个解构对 (Pair) 而不是一个参数之间的区别：

```kotlin
{ a -> ... } // 一个参数
{ a, b -> ... } // 两个参数
{ (a, b) -> ... } // 一个解构对 (Pair)
{ (a, b), c -> ... } // 一个解构对 (Pair) 和另一个参数
```

如果解构参数的某个组件未使用，你可以用下划线 `_` 替换它以避免为其命名：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

你可以为整个解构参数或单独为特定组件指定类型：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```