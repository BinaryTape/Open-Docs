---
title: 集合操作概览
---
Kotlin 标准库提供了多种函数来执行集合上的操作。这包括简单的操作（如获取或添加元素），以及更复杂的操作（包括搜索、排序、过滤、转换等等）。

## 扩展函数和成员函数

集合操作在标准库中以两种方式声明：集合接口的[成员函数](classes#class-members)和[扩展函数](extensions#extension-functions)。

成员函数定义了对于集合类型必不可少的操作。例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含用于检查其是否为空的函数 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含用于按索引访问元素的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)，等等。

当你创建你自己的集合接口实现时，你必须实现它们的成员函数。为了更容易地创建新的实现，可以使用标准库中集合接口的骨架实现：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html), 
[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html),
[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html),
[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)，以及它们的可变对应物。

其他集合操作被声明为扩展函数。这些是过滤、转换、排序和其他集合处理函数。

## 常用操作

常用操作对于[只读和可变集合](collections-overview#collection-types)都可用。常用操作分为以下几组：

* [转换](collection-transformations)
* [过滤](collection-filtering)
* [`plus` 和 `minus` 操作符](collection-plus-minus)
* [分组](collection-grouping)
* [检索集合部分](collection-parts)
* [检索单个元素](collection-elements)
* [排序](collection-ordering)
* [聚合操作](collection-aggregate)

这些页面上描述的操作返回它们的结果，而不会影响原始集合。例如，过滤操作产生一个_新的集合_，其中包含所有与过滤谓词匹配的元素。此类操作的结果应存储在变量中，或以其他方式使用，例如，传递给其他函数。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")

}
```

对于某些集合操作，可以选择指定_目标_对象。目标是一个可变集合，函数将其结果项追加到该集合，而不是在新对象中返回它们。为了执行带目标的操作，有一些单独的函数，它们的名称中带有 `To` 后缀，例如，
[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 
或 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。
这些函数将目标集合作为附加参数。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ `->` index == 0 }
    println(filterResults) // contains results of both operations

}

```

为了方便起见，这些函数会返回目标集合，因此你可以在函数调用的相应参数中直接创建它：

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")

    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")

}
```

带有目标的函数可用于过滤、关联、分组、展平等操作。有关目标操作的完整列表，请参阅 [Kotlin 集合参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 写入操作

对于可变集合，还有_写入操作_，它们会更改集合状态。这些操作包括添加、删除和更新元素。写入操作在[写入操作](collection-write)和[特定于列表的操作](list-operations#list-write-operations)以及[特定于 Map 的操作](map-operations#map-write-operations)的相应部分中列出。

对于某些操作，有成对的函数来执行相同的操作：一个函数就地应用操作，另一个函数将结果作为单独的集合返回。例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)
就地对可变集合进行排序，因此其状态会发生变化；[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)
创建一个新的集合，其中包含按排序顺序排列的相同元素。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true

}
```