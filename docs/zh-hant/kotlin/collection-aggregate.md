---
title: "聚合操作 (Aggregate operations)"
---
Kotlin 集合包含用於常用 *彙總操作 (aggregate operations)* 的函式 – 這些操作會根據集合內容傳回單一值。它們中的大多數都是廣為人知的，並且以與其他語言相同的方式工作：

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) 和 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html) 分別傳回最小和最大的元素。在空集合上，它們傳回 `null`。
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html) 傳回數字集合中元素的平均值。
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 傳回數字集合中元素的總和。
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 傳回集合中元素的數量。

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

還有一些函式可以通過特定的選擇器函式或自定義的 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html) 來檢索最小和最大的元素：

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) 和 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html) 接受一個選擇器函式，並傳回該函式傳回最大或最小值的元素。
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) 和 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html) 接受一個 `Comparator` 物件，並根據該 `Comparator` 傳回最大或最小的元素。
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) 和 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html) 接受一個選擇器函式，並傳回選擇器本身的最大或最小傳回值。
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) 和 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html) 接受一個 `Comparator` 物件，並根據該 `Comparator` 傳回最大或最小的選擇器傳回值。

這些函式在空集合上傳回 `null`。 還有一些替代方案 – [`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)、[`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html)、[`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html) 和 [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html) – 它們的功能與對應物相同，但在空集合上會拋出 `NoSuchElementException`。

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

除了常規的 `sum()` 之外，還有一個高級的求和函式 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)，它接受一個選擇器函式，並傳回將其應用於所有集合元素的總和。 選擇器可以傳回不同的數值類型：`Int`、`Long`、`Double`、`UInt` 和 `ULong` (在 JVM 上還有 `BigInteger` 和 `BigDecimal`)。

```kotlin

fun main() {

    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })

}
```

## Fold 和 reduce

對於更特殊的情況，有 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函式，它們將提供的操作依序應用於集合元素，並傳回累積的結果。
該操作接受兩個參數：先前累積的值和集合元素。

這兩個函式之間的區別在於，`fold()` 接受一個初始值，並在第一步將其用作累積值，而 `reduce()` 的第一步則使用第一個和第二個元素作為第一步的操作參數。

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

上面的範例顯示了差異：`fold()` 用於計算加倍元素的總和。
如果將相同的函式傳遞給 `reduce()`，它將傳回另一個結果，因為它使用列表的第一個和第二個元素作為第一步的參數，因此第一個元素將不會加倍。

若要以相反的順序將函式應用於元素，請使用函式 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)
和 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)。
它們的工作方式與 `fold()` 和 `reduce()` 類似，但從最後一個元素開始，然後繼續到前一個元素。
請注意，當向右摺疊或縮減時，操作參數會更改其順序：第一個是元素，然後是累積值。

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum `->` sum + element * 2 }
    println(sumDoubledRight)

}
```

您還可以應用將元素索引作為參數的操作。
為此，請使用函式 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)
和 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) 傳遞元素
索引作為操作的第一個參數。

最後，有一些函式可以從右到左將此類操作應用於集合元素 - [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)
和 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)。

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)

}
```

所有 reduce 操作都會在空集合上拋出例外。 若要改為接收 `null`，請使用其 `*OrNull()` 對應物：
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

對於要儲存中間累加器值的情況，可以使用函式
[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (或其同義詞 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html))
和 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)。

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

如果需要在操作參數中使用索引，請使用 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)
或 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)。