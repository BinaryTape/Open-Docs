[//]: # (title: 构建集合)

## 从元素构建集合

创建集合最常见的方式是使用标准库函数 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 和 [`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)。如果您提供逗号分隔的集合元素列表作为参数，编译器会自动检测元素类型。创建空集合时，请明确指定类型。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

对于映射 (maps)，同样可以使用函数 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 和 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)。映射的键和值作为 `Pair` 对象传入（通常使用 `to` 中缀函数创建）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

请注意，`to` 符号会创建一个短生命周期的 `Pair` 对象，因此建议仅在性能不关键时使用。为避免过多的内存使用，请使用其他方式。例如，您可以创建一个可变映射 (mutable map) 并使用写入操作 (write operations) 填充它。[`apply()`](scope-functions.md#apply) 函数可以帮助在此处保持初始化流畅。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合构建器函数创建

创建集合的另一种方式是调用构建器函数（builder function）—— [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html) 或 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)。它们会创建一个新的、对应类型的可变集合 (mutable collection)，使用 [写入操作](collection-write.md) 填充它，并返回一个包含相同元素的只读集合 (read-only collection)：

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空集合

也有用于创建不含任何元素的集合的函数：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html) 和 [`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。创建空集合时，您应该指定集合将持有的元素的类型。

```kotlin
val empty = emptyList<String>()
```

## 列表的初始化器函数

对于列表 (lists)，有一个类似构造函数的函数，它接受列表大小和一个初始化器函数，该函数根据元素的索引定义其值。

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

要创建具体类型的集合 (collection)，例如 `ArrayList` 或 `LinkedList`，您可以使用这些类型可用的构造函数。`Set` 和 `Map` 的实现也提供了类似的构造函数。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 复制

要创建一个与现有集合包含相同元素的集合，您可以使用复制函数 (copying functions)。标准库中的集合复制函数创建的是 _浅层_ 复制 (shallow copy) 集合，其中包含对相同元素的引用。因此，对集合元素所做的更改会反映在其所有副本中。

集合复制函数，例如 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 等，会在特定时刻创建集合的快照 (snapshot)。它们的结果是一个包含相同元素的新集合。如果您从原始集合中添加或删除元素，这不会影响副本。副本也可以独立于源进行更改。

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

这些函数也可以用于将集合转换为其他类型，例如，从列表构建集合，反之亦然。

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

另外，您可以创建指向相同集合实例的新引用 (references)。当您使用现有集合初始化集合变量时，会创建新的引用。因此，当集合实例通过某个引用被修改时，这些更改会反映在其所有引用中。

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

集合初始化可用于限制可变性 (mutability)。例如，如果您创建了一个指向 `MutableList` 的 `List` 引用，当您尝试通过此引用修改集合时，编译器将报错。

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

## 在其他集合上调用函数

集合可以作为对其他集合进行各种操作的结果而创建。例如，[过滤](collection-filtering.md) 列表会创建一个与过滤器匹配的新元素列表：

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

[映射](collection-transformations.md#map) 根据转换结果生成列表：

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

[关联](collection-transformations.md#associate) 生成映射：

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