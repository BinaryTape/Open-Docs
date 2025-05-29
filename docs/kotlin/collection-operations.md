[//]: # (title: 集合操作概览)

Kotlin 标准库提供了多种多样的函数，用于对集合执行操作。这包括简单的操作，例如获取或添加元素，以及更复杂的操作，包括搜索、排序、过滤、转换等。

## 扩展函数和成员函数

集合操作在标准库中有两种声明方式：集合接口的[成员函数](classes.md#class-members)和[扩展函数](extensions.md#extension-functions)。

成员函数定义了集合类型所必需的操作。例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) 函数用于检查其是否为空；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 用于按索引访问元素，等等。

当你创建自己的集合接口实现时，你必须实现它们的成员函数。为了更方便地创建新的实现，请使用标准库中集合接口的骨架实现：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html) 及其可变对应项。

其他集合操作则声明为扩展函数。这些包括过滤、转换、排序以及其他集合处理函数。

## 常见操作

常见操作适用于[只读集合和可变集合](collections-overview.md#collection-types)两者。常见操作分为以下几组：

*   [转换](collection-transformations.md)
*   [过滤](collection-filtering.md)
*   [`plus` 和 `minus` 运算符](collection-plus-minus.md)
*   [分组](collection-grouping.md)
*   [检索集合部分](collection-parts.md)
*   [检索单个元素](collection-elements.md)
*   [排序](collection-ordering.md)
*   [聚合操作](collection-aggregate.md)

这些页面上描述的操作返回其结果，而不影响原始集合。例如，过滤操作会生成一个包含所有匹配过滤谓词的元素_新集合_。此类操作的结果应存储在变量中，或以其他方式使用，例如作为参数传递给其他函数。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于某些集合操作，可以选择指定_目标_对象。目标是一个可变集合，函数会将结果项追加到该集合中，而不是在新对象中返回它们。为了执行带有目标的（destination）操作，存在名称中带有 `To` 后缀的独立函数，例如 [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 或 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。这些函数将目标集合作为附加参数。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // contains results of both operations
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

为了方便起见，这些函数会返回目标集合，因此你可以在函数调用的相应参数中直接创建它：

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

带有目标（destination）的函数可用于过滤、关联、分组、扁平化及其他操作。有关目标操作的完整列表，请参阅 [Kotlin 集合参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 写入操作

对于可变集合，还有改变集合状态的_写入操作_。此类操作包括添加、删除和更新元素。写入操作列在[写入操作](collection-write.md)以及[List 特有操作](list-operations.md#list-write-operations)和[Map 特有操作](map-operations.md#map-write-operations)的相应部分中。

对于某些操作，存在执行相同操作的成对函数：一个是在位应用操作，另一个则将结果作为单独的集合返回。例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) 会在位（in-place）排序可变集合，因此其状态会改变；而 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 则创建一个包含相同元素且已排序的新集合。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}