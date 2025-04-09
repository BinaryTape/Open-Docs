---
title: 聚合操作
---
Kotlin 集合包含一些常用的*聚合操作 (aggregate operations)* 的函数——这些操作基于集合的内容返回一个单一的值。它们中的大多数都是众所周知的，并且工作方式与其他语言中的一样：

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) 和 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html) 分别返回最小和最大的元素。在空集合上，它们返回 `null`。
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html) 返回数字集合中元素的平均值。
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 返回数字集合中元素的总和。
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 返回集合中元素的数量。

```kotlin

fun main() {
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.maxOrNull()}")
    println("Min: ${numbers.minOrNull()}")
    println("Average: ${numbers.average()}")
    println("Sum: ${numbers.sum()}")
}
```

还有一些函数可以通过特定的选择器函数或自定义的 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html) 来检索最小和最大的元素：

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) 和 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html) 接受一个选择器函数，并返回该函数返回最大或最小值的元素。
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) 和 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html) 接受一个 `Comparator` 对象，并根据该 `Comparator` 返回最大或最小的元素。
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) 和 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html) 接受一个选择器函数，并返回选择器本身的最大或最小返回值。
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) 和 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html) 接受一个 `Comparator` 对象，并根据该 `Comparator` 返回选择器的最大或最小返回值。

这些函数在空集合上返回 `null`。还有一些替代方案——[`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html), [`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html), [`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html), 和 [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html) ——它们的功能与它们的对应函数相同，但在空集合上会抛出一个 `NoSuchElementException` 异常。

```kotlin

fun main() {

    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)

}
```

除了常规的 `sum()` 之外，还有一个高级求和函数 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)，它接受一个选择器函数，并返回该函数应用于所有集合元素的总和。选择器可以返回不同的数值类型：`Int`、`Long`、`Double`、`UInt` 和 `ULong`（在 JVM 上还有 `BigInteger` 和 `BigDecimal`）。

```kotlin

fun main() {

    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })

}
```

## Fold 和 reduce

对于更具体的情况，可以使用函数 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)，它们将提供的操作依次应用于集合元素，并返回累积的结果。该操作接受两个参数：先前累积的值和集合元素。

这两个函数的区别在于，`fold()` 接受一个初始值，并在第一步将其用作累积值，而 `reduce()` 的第一步使用第一个和第二个元素作为操作参数。

```kotlin
fun main() {

    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element `->` sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element `->` sum + element * 2 }
    println(sumDoubled)

    //incorrect: the first element isn't doubled in the result
    //val sumDoubledReduce = numbers.reduce { sum, element `->` sum + element * 2 } 
    //println(sumDoubledReduce)

}
```

上面的示例显示了区别：`fold()` 用于计算加倍元素的总和。如果将相同的函数传递给 `reduce()`，它将返回另一个结果，因为它在第一步中使用列表的第一个和第二个元素作为参数，因此第一个元素不会加倍。

要以相反的顺序将函数应用于元素，请使用函数 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html) 和 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)。它们的工作方式类似于 `fold()` 和 `reduce()`，但从最后一个元素开始，然后继续到前一个元素。请注意，当向右折叠或归约时，操作参数会改变它们的顺序：第一个是元素，然后是累积值。

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum `->` sum + element * 2 }
    println(sumDoubledRight)

}
```

你还可以应用将元素索引作为参数的操作。为此，请使用函数 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html) 和 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)，将元素索引作为操作的第一个参数传递。

最后，还有一些函数可以将此类操作从右到左应用于集合元素 - [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html) 和 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)。

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)

}
```

所有 reduce 操作都会在空集合上抛出异常。要接收 `null` 作为替代，请使用它们的 `*OrNull()` 对应项：
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

对于要保存中间累加器值的情况，可以使用函数 [`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html)（或其同义词 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)）和 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)。

```kotlin

fun main() {

    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item `->` sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item `->` sum + item }

    val transform = { index: Int, element: Int `->` "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningReduce:
"))
    println(runningFoldSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningFold:
"))
}
```

如果操作参数中需要索引，请使用 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html) 或 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)。