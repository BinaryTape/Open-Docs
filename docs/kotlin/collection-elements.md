---
title: 检索单个元素
---
Kotlin 集合提供了一系列函数，用于从集合中检索单个元素。本页介绍的函数适用于列表（lists）和集（sets）。

正如[列表的定义](collections-overview)所说，列表是一个有序的集合。因此，列表中的每个元素都有其位置，你可以使用该位置进行引用。除了本页描述的函数之外，列表还提供了更广泛的方法，可以通过索引来检索和搜索元素。更多详情，请参见[列表特定操作](list-operations)。

反过来，按照[定义](collections-overview)，集不是一个有序的集合。但是，Kotlin 的 `Set` 以特定的顺序存储元素。这些顺序可以是插入顺序 (在 `LinkedHashSet` 中)、自然排序顺序 (在 `SortedSet` 中) 或其他顺序。一个集元素的顺序也可能是未知的。在这种情况下，元素仍然以某种方式排序，因此依赖于元素位置的函数仍然会返回它们的结果。但是，除非调用者知道所使用的 `Set` 的具体实现，否则这些结果是不可预测的。

## 按位置检索

要检索特定位置的元素，可以使用函数 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)。使用整数作为参数调用它，你将收到集合中给定位置的元素。第一个元素的位置是 `0`，最后一个元素的位置是 `(size - 1)`。

`elementAt()` 对于不提供索引访问或静态未知提供索引访问的集合很有用。对于 `List`，更习惯使用[索引访问操作符](list-operations#retrieve-elements-by-index) (`get()` 或 `[]`)。

```kotlin

fun main() {

    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order

}
```

还有一些有用的别名，用于检索集合的第一个和最后一个元素：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    

}
```

为了避免在检索非现有位置的元素时出现异常，请使用 `elementAt()` 的安全变体：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 当指定的位置超出集合范围时返回 null。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 另外接受一个 lambda 函数，该函数将 `Int` 参数映射到集合元素类型的实例。当使用越界位置调用时，`elementAtOrElse()` 返回给定值上 lambda 的结果。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index `->` "The value for index $index is undefined"})

}
```

## 按条件检索

函数 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 还允许你搜索集合中与给定谓词匹配的元素。当你使用测试集合元素的谓词调用 `first()` 时，你将收到谓词产生 `true` 的第一个元素。反过来，带有谓词的 `last()` 返回与其匹配的最后一个元素。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })

}
```

如果没有元素与谓词匹配，则这两个函数都会抛出异常。为了避免这些异常，请改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：如果没有找到匹配的元素，它们将返回 `null`。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })

}
```

如果它们的名称更适合你的情况，请使用别名：

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 代替 `firstOrNull()`
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 代替 `lastOrNull()`

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })

}
```

## 使用选择器检索

如果需要在检索元素之前映射集合，可以使用函数 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)。它结合了 2 个操作：
- 使用选择器函数映射集合
- 返回结果中的第一个非 null 值

如果结果集合没有非空元素，`firstNotNullOf()` 将抛出 `NoSuchElementException`。在这种情况下，使用对应的 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 返回 null。

```kotlin
fun main() {

    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item `->` item.toString().takeIf { it.length >= 4 } }
    println(longEnough)

}
```

## 随机元素

如果需要检索集合的任意元素，请调用 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函数。你可以不带参数调用它，也可以使用 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 对象作为随机源。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())

}
```

在空集合上，`random()` 抛出一个异常。要接收 `null` 代替，请使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)。

## 检查元素是否存在

要检查集合中是否存在某个元素，请使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函数。如果存在一个集合元素 `equals()` 该函数参数，则返回 `true`。你可以使用 `in` 关键字以操作符形式调用 `contains()`。

要一次性检查多个实例是否存在，请使用包含这些实例的集合作为参数调用 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))

}
```

此外，你可以通过调用 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html) 或 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 来检查集合是否包含任何元素。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())

}
```