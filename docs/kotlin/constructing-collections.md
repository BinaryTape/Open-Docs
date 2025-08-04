[//]: # (title: 构建集合)

## 从元素构建

创建集合最常见的方式是使用标准库函数 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)。
如果你提供一个逗号分隔的集合元素列表作为实参，编译器会自动检测元素类型。创建空集合时，请显式指定类型。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

Map 也有类似的函数：[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
和 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)。Map 的
键和值作为 `Pair` 对象（通常使用 `to` 中缀函数创建）传递。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

请注意，`to` 符号会创建一个短生命周期的 `Pair` 对象，因此建议仅在性能不关键时使用它。为避免过多的内存使用，请使用其他方式。例如，你可以创建一个可变 map 并使用写入操作填充它。[`apply()`](scope-functions.md#apply) 函数在此处有助于保持初始化流畅。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合构建器函数创建

创建集合的另一种方式是调用构建器函数——
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)
或 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)。它们会创建相应类型的新可变集合，
使用[写入操作](collection-write.md)填充它，并返回一个包含相同元素的只读集合：

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空集合

还有一些用于创建不包含任何元素的集合的函数：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html) 和
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。
创建空集合时，应指定集合将包含的元素的类型。

```kotlin
val empty = emptyList<String>()
```

## List 的初始化函数

对于 list，有一个类似构造函数的函数，它接受 list 大小和初始化函数，该初始化函数根据元素的索引定义元素值。

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具体类型构造函数

要创建具体类型的集合，例如 `ArrayList` 或 `LinkedList`，你可以使用这些类型可用的构造函数。`Set` 和 `Map` 的实现也有类似的构造函数。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 复制

要创建与现有集合包含相同元素的集合，你可以使用复制函数。标准库中的集合复制函数创建的是引用相同元素的_浅拷贝_集合。
因此，对集合元素所做的更改会反映在所有副本中。

集合复制函数，例如 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 等，会在特定时刻创建集合的快照。
它们的结果是包含相同元素的新集合。
如果你从原始集合中添加或移除元素，这不会影响副本。副本也可以独立于源进行更改。

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这些函数也可以用于将集合转换为其他类型，例如，从 list 构建 set，反之亦然。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，你可以创建对同一集合实例的新引用。当你使用现有集合初始化集合变量时，就会创建新引用。
因此，当集合实例通过某个引用被修改时，更改会反映在所有引用中。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

集合初始化可以用于限制可变性。例如，如果你创建了一个 `List` 引用来指向一个 `MutableList`，那么当你尝试通过此引用修改集合时，编译器会报错。

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 对其他集合调用函数

集合可以通过对其他集合进行各种操作而创建。例如，[过滤](collection-filtering.md)
一个 list 会创建一个与过滤器匹配的新 list：

```kotlin
fun main() {
//sampleStart 
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[映射](collection-transformations.md#map) 从转换结果中生成 list：

```kotlin
fun main() {
//sampleStart 
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[关联](collection-transformations.md#associate) 生成 map：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有关 Kotlin 中集合操作的更多信息，请参阅 [集合操作概述](collection-operations.md)。