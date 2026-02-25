[//]: # (title: 析构声明)

有时将一个对象*析构*为多个变量会很方便，例如：

```kotlin
val (name, age) = person 
```

这种语法被称为*析构声明*。析构声明可以一次性创建多个变量。
你已经声明了两个新变量：`name` 和 `age`，并且可以独立使用它们：

 ```kotlin
println(name)
println(age)
```

析构声明会被编译为以下代码：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函数是 Kotlin 中广泛使用的*约定原则*（principle of conventions）的另一个例子（请参阅 `+` 和 `*` 等运算符以及 `for` 循环作为示例）。
只要能在析构声明右侧的对象上调用所需数量的组件函数，该对象就可以位于右侧。当然，也可以有 `component3()` 和 `component4()` 等等。

> `componentN()` 函数需要使用 `operator` 关键字标记，才允许在析构声明中使用。
>
{style="note"}

析构声明也适用于 `for` 循环：

```kotlin
for ((a, b) in collection) { ... }
```

变量 `a` 和 `b` 会获取在集合元素上调用 `component1()` 和 `component2()` 返回的值。 

## 示例：从函数返回两个值
 
假设你需要从一个函数返回两个内容——例如，一个结果对象和某种状态。
在 Kotlin 中实现这一点的紧凑方法是声明一个[数据类](data-classes.md)并返回其实例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // 计算
    
    return Result(result, status)
}

// 现在，要使用此函数：
val (result, status) = function(...)
```

由于数据类会自动声明 `componentN()` 函数，因此析构声明在这里有效。

> 你也可以使用标准类 `Pair` 并让 `function()` 返回 `Pair<Int, Status>`，
> 但通常将数据正确命名会更好。
>
{style="note"}

## 示例：析构声明与映射 (Map)

遍历映射最优雅的方式可能就是这样：

```kotlin
for ((key, value) in map) {
   // 使用 key 和 value 进行操作
}
```

为了使此代码正常运行，你应该：

* 通过提供 `iterator()` 函数将映射表示为一系列值。
* 通过提供函数 `component1()` 和 `component2()` 将每个元素表示为一对值。
  
事实上，标准库提供了这样的扩展：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以在带有映射的 `for` 循环中自由使用析构声明（以及数据类实例的集合或类似结构）。

## 用于未使用变量的下划线

如果在析构声明中不需要某个变量，可以使用下划线代替其名称：

```kotlin
val (_, status) = getResult()
```

对于以这种方式跳过的组件，不会调用相应的 `componentN()` 运算符函数。

## 在 lambda表达式 中析构

你可以对 lambda表达式 的形参使用析构声明语法。
如果一个 lambda表达式 具有 `Pair` 类型（或 `Map.Entry`，或任何其他具有相应 `componentN` 函数的类型）的形参，你可以通过将它们放入圆括号中来引入多个新形参以代替单个形参：   

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

注意声明两个形参和声明一个析构对来代替一个形参之间的区别：  

```kotlin
{ a -> ... } // 一个形参
{ a, b -> ... } // 两个形参
{ (a, b) -> ... } // 一个析构对
{ (a, b), c -> ... } // 一个析构对和另一个形参
```

如果析构形参的某个组件未使用，可以使用下划线代替它，以避免去想变量名：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

你可以为整个析构形参指定类型，也可以为特定组件单独指定类型：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }