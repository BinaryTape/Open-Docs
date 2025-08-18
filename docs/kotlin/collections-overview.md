[//]: # (title: 集合概述)

Kotlin 标准库提供了一整套全面的工具来管理**集合**——这些集合是数量可变（可能为零）的条目组，它们对所解决的问题有重要意义，且通常对其进行操作。

集合是大多数编程语言的常见概念，因此，如果你熟悉例如 Java 或 Python 中的集合，可以跳过本介绍，直接阅读详细章节。

集合通常包含相同类型（及其子类型）的多个对象。集合中的对象称为**元素**或**条目**。例如，一个系的所有学生构成一个集合，可用于计算他们的平均年龄。

以下集合类型与 Kotlin 有关：

*   **List** 是一个有序集合，可以通过索引（反映元素位置的整数）访问元素。一个 List 中可以出现多次相同的元素。电话号码就是 List 的一个例子：它是一组数字，它们的顺序很重要，并且可以重复。
*   **Set** 是一个唯一元素的集合。它反映了集合的数学抽象：一组没有重复的对象。通常，Set 元素的顺序没有意义。例如，彩票上的数字构成一个 Set：它们是唯一的，且它们的顺序不重要。
*   **Map**（或**字典**）是键值对的集合。键是唯一的，且每个键都精确映射到一个值。值可以重复。Map 在存储对象之间的逻辑连接方面非常有用，例如员工 ID 及其职位。

Kotlin 允许你独立于集合中存储的对象的具体类型来操作集合。换句话说，将 `String` 添加到 `String` 的 List 中，与处理 `Int` 或用户定义类的方式相同。
因此，Kotlin 标准库提供了泛型接口、类和函数，用于创建、填充和管理任何类型的集合。

集合接口和相关函数位于 `kotlin.collections` 包中。让我们概述一下其内容。

> 数组不是一种集合类型。关于数组的更多信息，请参见 [Arrays](arrays.md)。
>
{style="note"}

## 集合类型

Kotlin 标准库为基本集合类型（Set、List 和 Map）提供了实现。每种集合类型都由一对接口表示：

*   一个**只读**接口，提供访问集合元素的操作。
*   一个**可变**接口，通过写入操作（添加、移除和更新其元素）扩展了相应的只读接口。

注意，可变集合不必赋值给 [`var`](basic-syntax.md#variables)。即使将其赋值给 `val`，对可变集合的写入操作仍然是可能的。将可变集合赋值给 `val` 的好处在于，你可以保护可变集合的引用不被修改。随着时间的推移，当你的代码变得越来越复杂时，防止对引用的无意修改变得更加重要。尽可能使用 `val` 来编写更安全、更健壮的代码。如果你尝试重新赋值一个 `val` 集合，你会得到一个编译错误：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // 这样可以
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // 编译错误
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

只读集合类型是[协变](generics.md#variance)的。这意味着，如果 `Rectangle` 类继承自 `Shape`，那么任何需要 `List<Shape>` 的地方都可以使用 `List<Rectangle>`。
换句话说，集合类型具有与元素类型相同的子类型关系。Map 在值类型上是协变的，但在键类型上不是。

反过来，可变集合不是协变的；否则，这将导致运行时失败。如果 `MutableList<Rectangle>` 是 `MutableList<Shape>` 的子类型，你就可以向其中插入其他 `Shape` 的继承者（例如 `Circle`），从而违反其 `Rectangle` 类型实参。

下面是 Kotlin 集合接口的示意图：

![集合接口层级结构](collections-diagram.png){width="500"}

让我们详细介绍这些接口及其实现。关于 `Collection`，请阅读下面一节。关于 `List`、`Set` 和 `Map`，你可以阅读相应的章节，或者观看 Kotlin 开发者推广大使 Sebastian Aigner 的视频：

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin 集合概述"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合层级结构的根。此接口代表只读集合的共同行为：获取大小、检测条目成员资格等。
`Collection` 继承自 `Iterable<T>` 接口，该接口定义了用于迭代元素的操作。你可以将 `Collection` 用作适用于不同集合类型的函数的形参。对于更具体的用例，请使用 `Collection` 的继承者：[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)。

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 是一个带有写入操作（例如 `add` 和 `remove`）的 `Collection`。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // 移除冠词
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 以指定顺序存储元素并提供索引访问。索引从零开始（第一个元素的索引）直到 `lastIndex`（即 `(list.size - 1)`）。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

List 元素（包括 null）可以重复：一个 List 可以包含任意数量的相等对象，或单个对象的多次出现。
如果两个 List 具有相同的大小并在相同位置具有[结构相等](equality.md#structural-equality)的元素，则认为它们相等。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 是一个带有 List 特有写入操作的 `List`，例如在特定位置添加或移除元素。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如你所见，在某些方面，List 与数组非常相似。
然而，一个重要的区别是：数组的大小在初始化时定义且永不改变；反之，List 没有预定义的大小；List 的大小可以作为写入操作（添加、更新或移除元素）的结果而改变。

在 Kotlin 中，`MutableList` 的默认实现是 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)，你可以将其视为一个可变大小的数组。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 存储唯一元素；它们的顺序通常是未定义的。`null` 元素也是唯一的：一个 `Set` 只能包含一个 `null`。如果两个 Set 具有相同的大小，并且对于一个 Set 中的每个元素，在另一个 Set 中都有一个相等的元素，则它们相等。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 是一个带有来自 `MutableCollection` 写入操作的 `Set`。

`MutableSet` 的默认实现——[`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)——保留了元素的插入顺序。
因此，依赖于顺序的函数（例如 `first()` 或 `last()`）在此类 Set 上返回可预测的结果。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一种实现——[`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)——不对元素顺序作任何保证，因此在其上调用此类函数会返回不可预测的结果。然而，`HashSet` 存储相同数量的元素所需的内存更少。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 不是 `Collection` 接口的继承者；然而，它也是一种 Kotlin 集合类型。一个 `Map` 存储**键值对**（或**条目**）；键是唯一的，但不同的键可以与相等的值配对。`Map` 接口提供特定函数，例如通过键访问值、搜索键和值等。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // 与前一行相同
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

两个包含相等键值对的 Map，无论键值对的顺序如何都相等。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 是一个带有 Map 写入操作的 `Map`，例如你可以添加新的键值对或更新与给定键关联的值。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`MutableMap` 的默认实现——[`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)——在迭代 Map 时保留了元素的插入顺序。
反过来，另一种实现——[`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)——不对元素顺序作任何保证。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 是双端队列的一种实现，它允许你在队列的开头或结尾添加或移除元素。因此，`ArrayDeque` 在 Kotlin 中也兼具栈（Stack）和队列（Queue）数据结构的作用。在底层，`ArrayDeque` 是使用一个可变大小的数组实现的，该数组在需要时会自动调整大小：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}