[//]: # (title: 集合操作概述)

Kotlin 标准库提供了多种多样的函数，用于对集合执行操作。这包括简单的操作，例如获取或添加元素，以及更复杂的操作，包括搜索、排序、过滤、转换等等。

## 扩展函数与成员函数

集合操作在标准库中有两种声明方式：集合接口的[成员函数](classes.md)和[扩展函数](extensions.md#extension-functions)。

成员函数定义了对集合类型至关重要的操作。例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) 函数，用于检测其是否为空；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函数，用于索引访问元素，等等。

当你创建自己的集合接口实现时，必须实现它们的成员函数。为了方便创建新实现，请使用标准库中集合接口的骨架实现：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html) 及其可变对应物。

其他集合操作被声明为扩展函数。这些是过滤、转换、排序以及其他集合处理函数。

## 常见操作

常见操作适用于[只读集合和可变集合](collections-overview.md#collection-types)。常见操作分为以下几组：

* [转换](collection-transformations.md)
* [过滤](collection-filtering.md)
* [`plus` 和 `minus` 操作符](collection-plus-minus.md)
* [分组](collection-grouping.md)
* [检索集合部分](collection-parts.md)
* [检索单个元素](collection-elements.md)
* [排序](collection-ordering.md)
* [聚合操作](collection-aggregate.md)

这些页面中描述的操作返回其结果，而不影响原始集合。例如，过滤操作会生成一个*新集合*，其中包含所有符合过滤谓词的元素。此类操作的结果应存储在变量中，或以其他方式使用，例如传递给其他函数。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // numbers 未受影响，结果丢失
    println("numbers 仍然是 $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // 结果存储在 longerThan3 中
    println("长度超过 3 个字符的 numbers 是 $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于某些集合操作，可以选择指定*目标*对象。目标是可变集合，函数会将结果项附加到其中，而不是在新对象中返回它们。为了执行带目标的操作，有单独的函数，其名称带有 `To` 后缀，例如 [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)，或者 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。这些函数将目标集合作为附加形参。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //目标对象
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // 包含两个操作的结果
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

为了方便，这些函数会返回目标集合，因此你可以直接在函数调用的相应实参中创建它：

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // 直接将数字过滤到一个新的哈希 set 中, 
    // 从而消除结果中的重复项
    val result = numbers.mapTo(HashSet()) { it.length }
    println("不同的项长度是 $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

带目标（destination）的函数可用于过滤、关联、分组、展平等操作。关于目标操作的完整列表，请参见 [Kotlin 集合参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 写入操作

对于可变集合，还有会改变集合状态的*写入操作*。此类操作包括添加、删除和更新元素。写入操作列在[写入操作](collection-write.md)以及[List 特有的操作](list-operations.md#list-write-operations)和 [Map 特有的操作](map-operations.md#map-write-operations)的相应章节中。

对于某些操作，有成对的函数用于执行相同的操作：一个原地应用操作，另一个将结果作为单独的集合返回。例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) 原地排序可变集合，因此其状态会改变；[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 则创建一个新集合，其中包含相同元素但按排序后的顺序排列。

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