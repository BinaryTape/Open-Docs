[//]: # (title: 解构声明)

有时，将对象**解构**为多个变量会很方便，例如：

```kotlin
val (name, age) = person 
```

此语法称为**解构声明**。解构声明可一次性创建多个变量。
你已声明两个新变量：`name` 和 `age`，可以独立地使用它们：

 ```kotlin
println(name)
println(age)
```

解构声明会编译为以下代码：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函数是 Kotlin 中广泛使用的**约定原则**的另一个示例（例如，参见 `+` 和 `*` 等操作符以及 `for` 循环）。任何内容都可以是解构声明的右侧，只要可以在其上调用所需数量的 component 函数即可。当然，还可以有 `component3()`、`component4()` 等等。

> `componentN()` 函数需要使用 `operator` 关键字标记，才能允许在解构声明中使用它们。
>
{style="note"}

解构声明也可用于 `for` 循环：

```kotlin
for ((a, b) in collection) { ... }
```

变量 `a` 和 `b` 获取对集合元素调用 `component1()` 和 `component2()` 返回的值。

## 示例：从函数返回两个值

假设你需要从函数返回两项内容——例如，一个结果对象和某种状态。
在 Kotlin 中实现此目标的一种紧凑方式是声明一个[数据类](data-classes.md)并返回其实例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // 计算
    
    return Result(result, status)
}

// 现在，要使用此函数：
val (result, status) = function(...)
```

由于数据类会自动声明 `componentN()` 函数，因此解构声明在这里适用。

> 你也可以使用标准类 `Pair` 并让 `function()` 返回 `Pair<Int, Status>`，但通常更好地是恰当地命名你的数据。
>
{style="note"}

## 示例：解构声明与 Map

遍历 Map 最简洁的方式可能是这样：

```kotlin
for ((key, value) in map) {
   // 对 key 和 value 执行操作
}
```

为实现这一点，你应该：

* 通过提供 `iterator()` 函数，将 Map 呈现为值序列。
* 通过提供 `component1()` 和 `component2()` 函数，将每个元素呈现为一对。

事实上，标准库提供了此类扩展：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以自由地在 `for` 循环中将解构声明与 Map（以及数据类实例的集合或类似情况）一起使用。

## 未使用的变量的下划线

如果你不需要解构声明中的变量，可以用下划线代替其名称：

```kotlin
val (_, status) = getResult()
```

`componentN()` 操作符函数不会对以这种方式跳过的组件进行调用。

## lambda 表达式中的解构

你可以将解构声明语法用于 lambda 形参。
如果 lambda 具有 `Pair` 类型（或 `Map.Entry`，或任何其他具有相应 `componentN` 函数的类型）的形参，你可以通过将它们放入圆括号来引入几个新形参，而不是一个：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

请注意声明两个形参与声明一个解构对代替形参之间的区别：

```kotlin
{ a -> ... } // 一个形参
{ a, b -> ... } // 两个形参
{ (a, b) -> ... } // 一个解构对
{ (a, b), c -> ... } // 一个解构对和另一个形参
```

如果解构形参的某个组件未使用，你可以用下划线替换它，以避免为其命名：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

你可以为整个解构形参或单独为特定组件指定类型：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }