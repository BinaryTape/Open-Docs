[//]: # (title: 集合概览)

Kotlin 标准库提供了一套全面的工具来管理集合 (collection) —— 集合是数量可变（可能为零）的一组条目，这些条目对于解决问题具有重要意义，并且经常被操作。

集合对于大多数编程语言来说都是一个通用概念，因此如果你熟悉 Java 或 Python 的集合，可以跳过这段介绍并继续阅读详细章节。

集合通常包含多个相同类型（及其子类型）的对象。集合中的对象称为元素 (element) 或条目 (item)。例如，一个系的所有学生组成一个集合，可以用来计算他们的平均年龄。

以下集合类型与 Kotlin 相关：

* _List_ 是一个有序集合，可以通过索引（反映其位置的整数）访问元素。元素在 list 中可以出现多次。list 的一个例子是电话号码：它是一组数字，其顺序很重要，且数字可以重复。
* _Set_ 是唯一元素的集合。它反映了集 (set) 的数学抽象：一组没有重复的对象。通常，set 元素的顺序没有意义。例如，彩票上的数字组成一个 set：它们是唯一的，且顺序不重要。
* _Map_（或字典）是一组键值对。键是唯一的，每个键都正好映射到一个值。值可以重复。map 对于存储对象之间的逻辑联系非常有用，例如，员工的 ID 及其职位。

Kotlin 允许你操作集合，而无需关心其中存储的对象的确切类型。换句话说，你向 `String` 列表添加 `String` 的方式与处理 `Int` 或用户定义类的方式相同。因此，Kotlin 标准库提供了泛型接口、类和函数，用于创建、填充和管理任何类型的集合。

集合接口和相关函数位于 `kotlin.collections` 软件包中。让我们概览一下它的内容。

> 数组不是一种集合类型。有关更多信息，请参阅[数组](arrays.md)。
>
{style="note"}

## 集合类型

Kotlin 标准库提供了基本集合类型的实现：set、list 和 map。每种集合类型都由一对接口表示：

* 一个只读接口，提供访问集合元素的操作。
* 一个可变接口，通过写操作扩展相应的只读接口：添加、移除和更新其元素。

请注意，可变集合不一定非要赋值给 [`var`](basic-syntax.md#variables)。即使将其赋值给 `val`，仍然可以对可变集合进行写操作。将可变集合赋值给 `val` 的好处是保护指向该可变集合的引用不被修改。随着时间的推移，由于你的代码在增长且变得更加复杂，防止意外修改引用变得更加重要。尽可能多地使用 `val` 以获得更安全且更健壮的代码。如果你尝试重新为 `val` 集合赋值，将会收到编译器错误：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // 这是允许的
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // 编译错误
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

只读集合类型是[协变的](generics.md#variance)。这意味着，如果 `Rectangle` 类继承自 `Shape`，你可以在任何需要 `List<Shape>` 的地方使用 `List<Rectangle>`。换句话说，集合类型具有与元素类型相同的子类型关系。Map 在值类型上是协变的，但在键类型上不是。

反之，可变集合不是协变的；否则，这将导致运行时失败。如果 `MutableList<Rectangle>` 是 `MutableList<Shape>` 的子类型，你就可以向其中插入其他 `Shape` 的继承者（例如 `Circle`），从而违反了它的 `Rectangle` 类型形参。

下面是 Kotlin 集合接口的图示：

![集合接口层次结构](collections-diagram.png){width="500"}

让我们逐一了解这些接口及其实现。要了解 `Collection`，请阅读下面的部分。要了解 `List`、`Set` 和 `Map`，你可以阅读相应的章节，或者观看 Kotlin 技术布道师 Sebastian Aigner 的视频：

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin 集合概览"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合层次结构的根。该接口表示只读集合的共同行为：检索大小、检查条目成员资格等。`Collection` 继承自 `Iterable<T>` 接口，后者定义了迭代元素的操作。你可以将 `Collection` 用作适用于不同集合类型的函数的参数。对于更具体的情况，请使用 `Collection` 的继承者：[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)。

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

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 是具有写操作（如 `add` 和 `remove`）的 `Collection`。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // 剔除冠词
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

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 以指定顺序存储元素，并提供对它们的索引访问。索引从零（第一个元素的索引）开始，一直到 `lastIndex`，即 `(list.size - 1)`。

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

List 元素（包括 null）可以重复：一个 list 可以包含任意数量的相等对象或单个对象的多次出现。如果两个 list 的大小相同，且在相同位置具有[结构相等](equality.md#structural-equality)的元素，则认为这两个 list 相等。

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

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 是具有 list 特有写操作的 `List`，例如，在特定位置添加或移除元素。

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

如你所见，在某些方面 list 与数组非常相似。然而，有一个重要的区别：数组的大小在初始化时定义，且永远不会改变；反之，list 没有预定义的大小；list 的大小可以作为写操作（添加、更新或移除元素）的结果而改变。

在 Kotlin 中，`MutableList` 的默认实现是 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)，你可以将其视为可调大小的数组。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 存储唯一的元素；它们的顺序通常是未定义的。`null` 元素也是唯一的：一个 `Set` 只能包含一个 `null`。如果两个 set 大小相同，并且对于其中一个 set 的每个元素，在另一个 set 中都有一个相等的元素，则这两个 set 相等。

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

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 是具有来自 `MutableCollection` 的写操作的 `Set`。

`MutableSet` 的默认实现 —— [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) —— 保留了元素插入的顺序。因此，依赖于顺序的函数（如 `first()` 或 `last()`）在此类 set 上返回可预测的结果。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet 是默认实现
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一种替代实现 —— [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) —— 不对元素顺序做任何保证，因此在其上调用此类函数会返回不可预测的结果。然而，`HashSet` 存储相同数量的元素所需的内存更少。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 并不是 `Collection` 接口的继承者；但它也是一种 Kotlin 集合类型。Map 存储键值对（或条目）；键是唯一的，但不同的键可以与相等的值配对。`Map` 接口提供了特定的函数，例如通过键访问值、搜索键和值等。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // 与上一行相同
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

包含相等键值对的两个 map 无论对的顺序如何都是相等的。

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

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 是具有写操作的 `Map`，例如，你可以添加新的键值对或更新与给定键关联的值。

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

`MutableMap` 的默认实现 —— [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) —— 在迭代 map 时保留元素插入的顺序。反之，另一种实现 —— [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) —— 不对元素顺序做任何保证。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 是双端队列的实现，允许你在队列的开头或结尾添加或移除元素。因此，`ArrayDeque` 在 Kotlin 中同时充当了栈和队列数据结构的角色。在幕后，`ArrayDeque` 是使用可调大小的数组实现的，该数组会在需要时自动调整大小：

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