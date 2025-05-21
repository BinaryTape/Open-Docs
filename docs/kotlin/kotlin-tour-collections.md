---
title: 集合
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本类型 (Basic types)</a><br />
        <img src="/img/icon-3.svg" width="20" alt="Third step" /> <strong>集合 (Collections)</strong><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流 (Control flow)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函数 (Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">类 (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">空安全 (Null safety)</a>
</p>

:::

在编程中，能够将数据分组到结构中以便后续处理非常有用。Kotlin 提供了集合 (collections) 正是为此目的。

Kotlin 提供了以下集合 (collections) 类型用于对条目进行分组：

| **集合类型 (Collection type)** | **描述 (Description)**                                                         |
|---------------------|-------------------------------------------------------------------------|
| 列表 (Lists)               | 条目的有序集合 (Ordered collections of items)                                            |
| 集合 (Sets)                | 唯一条目的无序集合 (Unique unordered collections of items)                                   |
| 映射 (Maps)                | 键值对的集合，其中键是唯一的，并且仅映射到一个值 (Sets of key-value pairs where keys are unique and map to only one value) |

每种集合类型可以是可变的或只读的。

## 列表 (List)

列表 (Lists) 按照添加的顺序存储条目，并允许重复条目。

要创建一个只读列表（[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/)），请使用 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 函数。

要创建一个可变列表（[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/)），请使用 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 函数。

创建列表时，Kotlin 可以推断存储的条目的类型。要显式声明类型，请在列表声明后的尖括号 `<>` 中添加类型：

```kotlin
fun main() { 

    // 只读列表 (Read only list)
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // 带有显式类型声明的可变列表 (Mutable list with explicit type declaration)
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]

}
```

:::note
为了防止不必要的修改，你可以通过将可变列表赋值给 `List` 来创建可变列表的只读视图：

```kotlin
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    val shapesLocked: List<String> = shapes
```
这也称为**类型转换 (casting)**。

列表 (Lists) 是有序的，因此要访问列表中的条目，请使用[索引访问操作符 (indexed access operator)](operator-overloading#indexed-access-operator) `[]`：

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle

}
```

要获取列表中的第一个或最后一个条目，请分别使用 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函数：

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle

}
```

[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函数是**扩展 (extension)** 函数的示例。要在对象上调用扩展 (extension) 函数，请在对象后加上句点 `.` 后写入函数名称。

有关扩展 (extension) 函数的更多信息，请参见[扩展函数 (Extension functions)](extensions#extension-functions)。就本教程而言，你只需要知道如何调用它们。

:::

要获取列表中条目的数量，请使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数：

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items

}
```

要检查某个条目是否在列表中，请使用 [`in` 运算符](operator-overloading#in-operator)：

```kotlin
fun main() {

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true

}
```

要从可变列表 (mutable list) 中添加或删除条目，请分别使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数：

```kotlin
fun main() { 

    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // 将 "pentagon" 添加到列表中 (Add "pentagon" to the list)
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // 从列表中删除第一个 "pentagon" (Remove the first "pentagon" from the list)
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]

}
```

## 集合 (Set)

列表 (lists) 是有序的并允许重复的条目，而集合 (sets) 是**无序的**，并且仅存储**唯一的**条目。

要创建一个只读集合（[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/)），请使用 [`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 函数。

要创建一个可变集合（[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/)），请使用 [`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 函数。

创建集合时，Kotlin 可以推断存储的条目的类型。要显式声明类型，请在集合声明后的尖括号 `<>` 中添加类型：

```kotlin
fun main() {

    // 只读集合 (Read-only set)
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // 带有显式类型声明的可变集合 (Mutable set with explicit type declaration)
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]

}
```

你可以在前面的示例中看到，由于集合仅包含唯一元素，因此重复的 `"cherry"` 条目被删除。

:::note
为了防止不必要的修改，你可以通过将可变集合 (mutable set) 分配给 `Set` 来创建可变集合 (mutable set) 的只读视图：

```kotlin
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    val fruitLocked: Set<String> = fruit
```

由于集合 (sets) 是**无序的**，因此无法访问特定索引处的项目。

:::

要获取集合 (set) 中条目的数量，请使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数：

```kotlin
fun main() { 

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items

}
```

要检查集合 (set) 中是否存在某个条目，请使用 [`in` 运算符](operator-overloading#in-operator)：

```kotlin
fun main() {

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true

}
```

要从可变集合 (mutable set) 中添加或删除条目，请分别使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html) 和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数：

```kotlin
fun main() { 

    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // 将 "dragonfruit" 添加到集合 (Add "dragonfruit" to the set)
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // 从集合 (set) 中删除 "dragonfruit" (Remove "dragonfruit" from the set)
    println(fruit)              // [apple, banana, cherry]

}
```

## 映射 (Map)

映射 (Maps) 将条目存储为键值对 (key-value pairs)。你可以通过引用键 (key) 来访问值 (value)。你可以将映射 (map) 想象成食物菜单。你可以通过找到你想吃的食物（键 (key)）来找到价格（值 (value)）。如果你想在不使用编号索引（如列表 (list) 中）的情况下查找值 (value)，则映射 (maps) 非常有用。

:::note
* 映射 (map) 中的每个键 (key) 都必须是唯一的，这样 Kotlin 才能理解你要获取哪个值 (value)。
* 你可以在映射 (map) 中包含重复的值 (value)。

:::

要创建一个只读映射（[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/)），请使用 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 函数。

要创建一个可变映射（[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/)），请使用 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 函数。

创建映射 (maps) 时，Kotlin 可以推断存储的条目的类型。要显式声明类型，请在映射声明后的尖括号 `<>` 中添加键 (key) 和值 (value) 的类型。例如：`MutableMap<String, Int>`。键 (keys) 的类型为 `String`，值 (values) 的类型为 `Int`。

创建映射 (maps) 最简单的方法是在每个键 (key) 及其相关值 (value) 之间使用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)：

```kotlin
fun main() {

    // 只读映射 (Read-only map)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // 带有显式类型声明的可变映射 (Mutable map with explicit type declaration)
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}

}
```

:::note
为了防止不必要的修改，你可以通过将可变映射 (mutable map) 赋值给 `Map` 来创建可变映射 (mutable map) 的只读视图：

```kotlin
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    val juiceMenuLocked: Map<String, Int> = juiceMenu
```

要访问映射 (map) 中的值 (value)，请使用带有其键 (key) 的[索引访问操作符 (indexed access operator)](operator-overloading#indexed-access-operator) `[]`：

```kotlin
fun main() {

    // 只读映射 (Read-only map)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100

}
```

如果你尝试使用映射 (map) 中不存在的键 (key) 访问键值对 (key-value pair)，你将看到一个 `null` 值 (value)：

```kotlin
fun main() {

    // 只读映射 (Read-only map)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
    // The value of pineapple juice is: null

}
```

本教程将在[空安全 (Null safety)](kotlin-tour-null-safety) 章节中稍后解释空值 (null values)。

:::

你还可以使用[索引访问操作符 (indexed access operator)](operator-overloading#indexed-access-operator) `[]` 将条目添加到可变映射 (mutable map)：

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // 将键 "coconut" 以及值 150 添加到映射 (map)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}

}
```

要从可变映射 (mutable map) 中删除条目，请使用 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数：

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // 从映射 (map) 中删除键 "orange" (Remove key "orange" from the map)
    println(juiceMenu)
    // {apple=100, kiwi=190}

}
```

要获取映射 (map) 中条目的数量，请使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数：

```kotlin
fun main() {

    // 只读映射 (Read-only map)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs

}
```

要检查映射 (map) 中是否已包含特定键 (key)，请使用 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html) 函数：

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true

}
```

要获取映射 (map) 的键 (keys) 或值 (values) 的集合 (collection)，请分别使用 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 属性：

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]

}
```

:::note
[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 是对象的**属性 (properties)** 的示例。要访问对象的属性 (property)，请在对象后附加一个句点 `.` 后写入属性 (property) 名称。

属性 (properties) 将在[类 (Classes)](kotlin-tour-classes) 章节中进行更详细的讨论。在本教程的这一点上，你只需要知道如何访问它们。

:::

要检查映射 (map) 中是否存在键 (key) 或值 (value)，请使用 [`in` 运算符](operator-overloading#in-operator)：

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // 或者，你不需要使用 keys 属性 (property)
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false

}
```

有关你可以使用集合 (collections) 执行的更多操作的信息，请参见 [集合 (Collections)](collections-overview)。

现在你已经了解了基本类型 (basic types) 以及如何管理集合 (collections)，现在是时候探索你可以在程序中使用的[控制流 (control flow)](kotlin-tour-control-flow)了。

## 练习 (Practice)

### 练习 1 (Exercise 1)

你有一个“绿色 (green)”数字列表和一个“红色 (red)”数字列表。完成代码以打印总共有多少个数字。

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // 在这里写你的代码 (Write your code here)
}
```

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```

### 练习 2 (Exercise 2)

你的服务器支持一组协议 (protocols)。用户请求使用特定协议 (protocol)。完成程序以检查是否支持所请求的协议 (protocol)（`isSupported` 必须是一个布尔值）。

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // 在这里写你的代码 (Write your code here)
    println("Support for $requested: $isSupported")
}
```

<h3>提示 (Hint)</h3>
        确保你以大写形式检查请求的协议 (protocol)。你可以使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html">`.uppercase()`</a> 函数来帮助你。
    

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```

### 练习 3 (Exercise 3)

定义一个映射 (map)，将从 1 到 3 的整数数字与其对应的拼写相关联。使用此映射 (map) 来拼写给定的数字。

|---|---|
```kotlin
fun main() {
    val number2word = // 在这里写你的代码 (Write your code here)
    val n = 2
    println("$n is spelt as '${<在这里写你的代码 (Write your code here) >}'")
}
```

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```

## 下一步 (Next step)

[控制流 (Control flow)](kotlin-tour-control-flow)