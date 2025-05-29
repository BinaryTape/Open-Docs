[//]: # (title: 获取单个元素)

Kotlin 集合提供了一组用于从集合中获取单个元素的函数。本页描述的函数适用于列表和集合。

如同[列表的定义](collections-overview.md)所述，列表是一种有序集合。因此，列表的每个元素都有其位置，可用于引用。除了本页描述的函数之外，列表还提供了更广泛的通过索引检索和搜索元素的方法。更多详情请参阅[列表特有操作](list-operations.md)。

反之，根据[定义](collections-overview.md)，集合不是有序集合。然而，Kotlin 的 `Set` 以特定顺序存储元素。这些顺序可以是插入顺序（在 `LinkedHashSet` 中）、自然排序顺序（在 `SortedSet` 中）或其他顺序。集合元素的顺序也可能未知。在这种情况下，元素仍然以某种方式排序，因此依赖于元素位置的函数仍然会返回结果。然而，除非调用者知道所使用的 `Set` 的具体实现，否则这些结果是不可预测的。

## 按位置检索

为了检索特定位置的元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函数。以整数作为参数调用它，你将收到给定位置的集合元素。第一个元素的位置是 `0`，最后一个元素的位置是 `(size - 1)`。

`elementAt()` 对于不提供索引访问或不静态已知提供索引访问的集合很有用。对于 `List`，使用[索引访问操作符](list-operations.md#retrieve-elements-by-index)（`get()` 或 `[]`）更符合习惯。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // 元素按升序存储
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还有一些有用的别名用于检索集合的第一个和最后一个元素：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

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

为了避免在检索不存在位置的元素时抛出异常，请使用 `elementAt()` 的安全变体：

*   [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 在指定位置超出集合边界时返回 null。
*   [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 额外接受一个 lambda 函数，该函数将 `Int` 参数映射到集合元素类型的一个实例。当使用越界位置调用时，`elementAtOrElse()` 返回 lambda 函数在给定值上的结果。

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

函数 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 也允许你搜索集合中符合给定谓词的元素。当你使用测试集合元素的谓词调用 `first()` 时，你将收到谓词返回 `true` 的第一个元素。反之，带有谓词的 `last()` 返回匹配该谓词的最后一个元素。

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

如果没有元素匹配谓词，这两个函数都会抛出异常。为了避免异常，请改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：如果没有找到匹配的元素，它们将返回 `null`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果它们的名称更适合你的情况，请使用以下别名：

*   [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 代替 `firstOrNull()`
*   [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 代替 `lastOrNull()`

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

## 使用选择器检索

如果你需要在检索元素之前映射集合，可以使用 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 函数。它结合了 2 个操作：
- 使用选择器函数映射集合
- 返回结果中的第一个非空值

如果结果集合没有非空元素，`firstNotNullOf()` 会抛出 `NoSuchElementException`。在这种情况下，使用对应函数 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 返回 null。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 将每个元素转换为字符串，并返回第一个符合所需长度的元素
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 随机元素

如果你需要检索集合中的任意元素，请调用 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函数。你可以不带参数调用它，也可以使用 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 对象作为随机性来源。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于空集合，`random()` 会抛出异常。为了接收 `null` 而不是异常，请使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)。

## 检查元素存在性

要检查集合中是否存在某个元素，请使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函数。如果集合中存在一个元素与函数参数 `equals()`（相等），则它返回 `true`。你也可以使用 `in` 关键字以运算符形式调用 `contains()`。

要同时检查多个实例是否存在，请调用 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html) 并以这些实例的集合作为参数。

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

此外，你可以通过调用 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html) 或 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 来检查集合是否包含任何元素。

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