[//]: # (title: 检索单个元素)

Kotlin 集合提供了一组用于从集合中检索单个元素的函数。本页描述的函数同时适用于 list 和 set。

如 [list 的定义](collections-overview.md)所述，list 是一种有序集合。因此，list 中的每个元素都具有可用于引用的位置。除了本页描述的函数外，list 还提供了更广泛的通过索引检索和查找元素的方式。关于更多详细信息，请参见 [List 特有的操作](list-operations.md)。

反之，set 根据[定义](collections-overview.md)不是有序集合。然而，Kotlin 的 `Set` 以特定顺序存储元素。这可以是插入顺序（在 `LinkedHashSet` 中）、自然排序顺序（在 `SortedSet` 中）或其他顺序。一组元素的顺序也可能未知。在这种情况下，元素仍然以某种方式排序，因此依赖于元素位置的函数仍会返回其结果。然而，除非调用者知道所使用的 `Set` 的具体实现，否则这些结果对调用者来说是不可预测的。

## 按位置检索

对于按特定位置检索元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函数。调用它时传入整数作为实参，你将收到给定位置的集合元素。第一个元素的位置是 `0`，最后一个是 `(size - 1)`。
 
`elementAt()` 对于不提供索引访问，或者在静态上未知是否提供索引访问的集合很有用。对于 `List`，使用[索引访问操作符](list-operations.md#retrieve-elements-by-index)（`get()` 或 `[]`）更为惯用。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还有用于检索集合的第一个和最后一个元素的有用别名：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

为避免在检索不存在位置的元素时抛出异常，请使用 `elementAt()` 的安全变体：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 当指定位置超出集合边界时返回 `null`。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 另外接受一个 lambda 表达式，该表达式将 `Int` 实参映射到集合元素类型的实例。当使用越界位置调用时，`elementAtOrElse()` 返回 lambda 对给定值求值的结果。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 按条件检索

[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函数还允许你根据给定谓词搜索集合中的匹配元素。当你调用 `first()` 并传入一个测试集合元素的谓词时，你将收到谓词返回 `true` 的第一个元素。反之，`last()` 传入谓词时将返回最后一个匹配的元素。 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果没有元素匹配谓词，这两个函数都会抛出异常。为避免此情况，请改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：如果未找到匹配元素，它们将返回 `null`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果以下别名更适合你的情况，请使用它们：

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 代替 `firstOrNull()`
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 代替 `lastOrNull()`

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 带选择器检索

如果你需要在检索元素之前映射集合，可以使用 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 函数。它结合了 2 个操作：
- 使用选择器函数映射集合
- 返回结果中的第一个非空值

如果结果集合没有非空元素，`firstNotNullOf()` 将抛出 `NoSuchElementException`。在这种情况下，请使用对应的 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 来返回 `null`。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 随机元素

如果你需要检索集合中的任意元素，请调用 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函数。你可以无实参调用它，或者传入一个 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 对象作为随机性的来源。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在空集合上，`random()` 会抛出异常。若要改为接收 `null`，请使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)。

## 检测元素是否存在

要检测集合中是否存在某个元素，请使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函数。如果集合中存在与该函数实参 `equals()` 的元素，它将返回 `true`。你可以使用 `in` 关键字以操作符形式调用 `contains()`。

要一次性检测多个实例是否存在，请调用 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html) 并传入这些实例的集合作为实参。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，你可以通过调用 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html) 或 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 来检测集合是否包含任何元素。 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}