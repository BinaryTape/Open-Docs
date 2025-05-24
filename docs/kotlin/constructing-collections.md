---
title: 构建集合
---
## 从元素构造

创建集合最常见的方式是使用标准库函数 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html),
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html),
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html),
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)。
如果提供一个以逗号分隔的集合元素列表作为参数，编译器会自动检测元素类型。创建空集合时，请显式指定类型。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

对于映射（maps），可以使用函数 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
和 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)。映射的
键（keys）和值（values）作为 `Pair` 对象传递（通常使用 `to` 中缀函数创建）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

请注意，`to` 符号会创建一个短生命周期的 `Pair` 对象，因此建议仅在性能不重要时使用它。为了避免过多的内存使用，请使用其他方法。例如，你可以创建一个可变映射（mutable map）并
使用写入操作填充它。 [`apply()`](scope-functions#apply) 函数可以帮助保持此处的初始化流畅。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合构建器函数创建

创建集合的另一种方法是调用构建器函数 –
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html), [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html),
或 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)。它们创建一个新的、
可变的相应类型的集合，使用[写入操作](collection-write)填充它，
并返回一个具有相同元素的只读集合：

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空集合

还有一些函数用于创建没有任何元素的集合：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html),
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html), 和
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。
创建空集合时，应指定集合将保存的元素的类型。

```kotlin
val empty = emptyList<String>()
```

## 列表的初始化器函数

对于列表，有一个类似构造函数的函数，它接受列表大小和初始化器函数，该函数根据元素的索引定义元素值。

```kotlin
fun main() {

    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)

}
```

## 具体类型构造函数

要创建具体类型集合，例如 `ArrayList` 或 `LinkedList`，可以使用这些类型的可用构造函数。类似的构造函数可用于 `Set` 和 `Map` 的实现。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 复制

要创建与现有集合具有相同元素的集合，可以使用复制函数。标准库中的集合
复制函数创建指向相同元素的_浅_复制集合。
因此，对集合元素所做的更改会反映在其所有副本中。

集合复制函数，例如 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html),
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html),
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 等，会创建一个
集合在特定时刻的快照。它们的结果是具有相同元素的新集合。
如果在原始集合中添加或删除元素，这不会影响副本。副本也可以独立于源进行更改。

```kotlin
class Person(var name: String)
fun main() {

    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")

}
```

这些函数也可以用于将集合转换为其他类型，例如，从列表构建一个集合，反之亦然。

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)

}
```

或者，您可以创建对同一集合实例的新引用。当您使用现有集合初始化集合变量时，会创建新引用。
因此，当通过引用更改集合实例时，更改会反映在其所有引用中。

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")

}
```

集合初始化可用于限制可变性。例如，如果创建对 `MutableList` 的 `List` 引用，如果您尝试通过此引用修改集合，编译器将产生错误。

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList

}
```

## 在其他集合上调用函数

可以通过对其他集合的各种操作来创建集合。例如，[过滤](collection-filtering)
列表会创建一个与过滤器匹配的元素的新列表：

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

}
```

[映射](collection-transformations#map) 从转换的结果中生成一个列表：

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

[关联](collection-transformations#associate) 生成映射：

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

有关 Kotlin 中集合操作的更多信息，请参见 [集合操作概述](collection-operations)。