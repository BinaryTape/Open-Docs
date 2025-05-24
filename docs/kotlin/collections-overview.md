---
title: 集合概览
---
Kotlin 标准库提供了一套全面的工具，用于管理 _集合 (collections)_ – 变量数量的条目（可能为零）的分组，这些条目对于要解决的问题至关重要，并且通常对其进行操作。

集合是大多数编程语言的常见概念，因此，如果您熟悉 Java 或 Python 集合等，则可以跳过此介绍，直接进入详细的部分。

集合通常包含多个相同类型（及其子类型）的对象。集合中的对象称为 _元素 (elements)_ 或 _条目 (items)_。例如，一个系里的所有学生构成一个集合，可以用来计算他们的平均年龄。

以下集合类型与 Kotlin 相关：

* _List (列表)_ 是一个有序的集合，可以通过索引（反映其位置的整数）访问元素。列表中可以多次出现相同的元素。电话号码就是一个列表的例子：它是一组数字，它们的顺序很重要，并且可以重复。
* _Set (集)_ 是一个包含唯一元素的集合。它反映了集合的数学抽象：一组没有重复的元素。通常，集合元素的顺序并不重要。例如，彩票上的数字构成一个集合：它们是唯一的，并且它们的顺序并不重要。
* _Map (映射)_（或 _字典 (dictionary)_）是一组键值对 (key-value pairs)。键 (keys) 是唯一的，并且每个键 (key) 都恰好映射到一个值 (value)。值 (values) 可以重复。映射 (maps) 对于存储对象之间的逻辑连接非常有用，例如，员工的 ID 和他们的职位。

Kotlin 允许您独立于存储在其中的对象的具体类型来操作集合。换句话说，您可以像将 `Int` 或用户定义的类添加到 `String` 列表一样，将 `String` 添加到 `String` 列表。因此，Kotlin 标准库提供了泛型接口、类和函数，用于创建、填充和管理任何类型的集合。

集合接口和相关函数位于 `kotlin.collections` 包中。让我们概览一下它的内容。

:::note
数组 (Arrays) 不是一种集合类型。有关更多信息，请参见 [数组 (Arrays)](arrays)。

:::

## 集合类型

Kotlin 标准库为基本集合类型提供了实现：集 (sets)、列表 (lists) 和映射 (maps)。
每种集合类型都有一对接口表示：

* 一个 _只读 (read-only)_ 接口，提供用于访问集合元素的操作。
* 一个 _可变 (mutable)_ 接口，它扩展了相应的只读 (read-only) 接口，并具有写入操作：添加、删除和更新其元素。

请注意，可变集合不一定要分配给 [`var`](basic-syntax#variables)。即使可变集合分配给 `val`，仍然可以进行写入操作。将可变集合分配给 `val` 的好处是，您可以保护对可变集合的引用免受修改。随着时间的推移，随着您的代码增长并变得更加复杂，防止对引用的意外修改变得更加重要。尽可能使用 `val` 来获得更安全、更健壮的代码。如果您尝试重新分配 `val` 集合，您会收到一个编译错误：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error

}
```

只读 (read-only) 集合类型是 [协变 (covariant)](generics#variance) 的。
这意味着，如果 `Rectangle` 类继承自 `Shape`，您可以在任何需要 `List<Shape>` 的地方使用 `List<Rectangle>`。
换句话说，集合类型具有与元素类型相同的子类型关系。映射 (maps) 在值 (value) 类型上是协变 (covariant) 的，但在键 (key) 类型上不是。

反过来，可变 (mutable) 集合不是协变 (covariant) 的；否则，这会导致运行时故障。如果 `MutableList<Rectangle>` 是 `MutableList<Shape>` 的子类型，您可以将其他 `Shape` 继承者（例如，`Circle`）插入其中，从而违反其 `Rectangle` 类型参数。

以下是 Kotlin 集合接口的图表：

<img src="/img/collections-diagram.png" alt="集合接口层次结构" width="500" style={{verticalAlign: 'middle'}}/>

让我们来看看这些接口及其实现。要了解 `Collection`，请阅读下面的部分。
要了解 `List`、`Set` 和 `Map`，您可以阅读相应的部分，也可以观看 Kotlin 开发倡导者 Sebastian Aigner 的视频：

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin 集合概述"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合层次结构的根。此接口表示只读 (read-only) 集合的常见行为：检索大小、检查条目成员资格等等。
`Collection` 继承自 `Iterable<T>` 接口，该接口定义了迭代元素的操作。您可以将 `Collection` 用作函数的参数，该函数适用于不同的集合类型。对于更具体的情况，请使用 `Collection` 的继承者：[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)。

```kotlin
fun printAll(strings: Collection<String>) {
    for(s in strings) print("$s ")
    println()
}
    
fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)
    
    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}
```

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 是具有写入操作（例如，`add` 和 `remove`）的 `Collection`。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // throwing away the articles
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}
```

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 以指定的顺序存储元素，并提供对它们的索引访问。索引从零开始——第一个元素的索引——并到 `lastIndex`，即 `(list.size - 1)`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")

}
```

列表元素（包括 null）可以重复：一个列表可以包含任意数量的相等对象或单个对象的出现次数。
如果两个列表具有相同的大小，并且在相同位置具有 [结构上相等 (structurally equal)](equality#structural-equality) 的元素，则认为这两个列表相等。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {

    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)

}
```

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 是具有列表特定写入操作的 `List`，例如，在特定位置添加或删除元素。

```kotlin
fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)

}
```

如您所见，在某些方面，列表与数组非常相似。
但是，有一个重要的区别：数组的大小在初始化时定义，并且永远不会更改；
反过来，列表没有预定义的大小；列表的大小可以因写入操作而改变：添加、更新或删除元素。

在 Kotlin 中，`MutableList` 的默认实现是 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)，您可以将其视为可调整大小的数组。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 存储唯一元素；
它们的顺序通常是未定义的。`null` 元素也是唯一的：一个 `Set` 只能包含一个 `null`。
如果两个集合具有相同的大小，并且对于一个集合的每个元素，在另一个集合中都有一个相等的元素，则这两个集合相等。

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")

}
```

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 是具有来自 `MutableCollection` 的写入操作的 `Set`。

`MutableSet` 的默认实现 – [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) – 保留了元素插入的顺序。
因此，依赖于顺序的函数，例如 `first()` 或 `last()`，在此类集合上返回可预测的结果。

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())

}
```

另一种实现 – [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) – 没有说明元素的顺序，因此在此类集合上调用此类函数会返回不可预测的结果。但是，`HashSet` 需要更少的内存来存储相同数量的元素。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 不是 `Collection` 接口的继承者；但是，它也是一种 Kotlin 集合类型。
`Map` 存储 _键值对 (key-value)_ （或 _条目 (entries)_）；键 (keys) 是唯一的，但是不同的键 (keys) 可以与相等的值 (values) 配对。
`Map` 接口提供了特定的函数，例如按键 (key) 访问值 (value)、搜索键 (keys) 和值 (values) 等。

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous

}
```

包含相等对的两个映射 (maps) 是相等的，而与对的顺序无关。

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")

}
```

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 是具有映射写入操作的 `Map`，例如，您可以添加新的键值对或更新与给定键相关联的值。

```kotlin
fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)

}
```

`MutableMap` 的默认实现 – [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) – 在迭代映射 (map) 时保留元素插入的顺序。
反过来，另一种实现 – [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) – 没有说明元素的顺序。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 是一个双端队列 (double-ended queue) 的实现，它允许你在队列的开头或结尾添加或删除元素。
因此，`ArrayDeque` 也在 Kotlin 中充当堆栈 (Stack) 和队列 (Queue) 数据结构的角色。在底层，`ArrayDeque` 是使用一个可调整大小的数组实现的，该数组在需要时自动调整大小：

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```