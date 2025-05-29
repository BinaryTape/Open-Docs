[//]: # (title: 聚合操作)

Kotlin 集合中包含用于常用 _聚合操作_ 的函数——这些操作根据集合内容返回单个值。其中大多数都广为人知，并以与其他语言相同的方式工作：

*   [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) 和 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html) 分别返回最小和最大的元素。对于空集合，它们返回 `null`。
*   [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html) 返回数字集合中元素的平均值。
*   [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 返回数字集合中元素的总和。
*   [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 返回集合中元素的数量。

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还有一些函数用于通过特定的选择器函数或自定义 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html) 检索最小和最大的元素：

*   [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) 和 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html) 接受一个选择器函数，并返回其返回最大或最小值的元素。
*   [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) 和 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html) 接受一个 `Comparator` 对象，并根据该 `Comparator` 返回最大或最小的元素。
*   [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) 和 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html) 接受一个选择器函数，并返回该选择器自身的最大或最小返回值。
*   [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) 和 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html) 接受一个 `Comparator` 对象，并根据该 `Comparator` 返回最大或最小的选择器返回值。

这些函数对于空集合返回 `null`。此外还有一些替代函数——[`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)、[`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html)、[`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html) 和 [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html)——它们执行与对应函数相同的功能，但在空集合上会抛出 `NoSuchElementException` 异常。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

除了常规的 `sum()`，还有一个高级求和函数 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)，它接受一个选择器函数，并返回其应用于所有集合元素的总和。选择器可以返回不同的数字类型：`Int`、`Long`、`Double`、`UInt` 和 `ULong`（在 JVM 上还支持 `BigInteger` 和 `BigDecimal`）。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## 折叠与归约

对于更特定的情况，可以使用函数 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)，它们将提供的操作顺序地应用于集合元素并返回累积结果。该操作接受两个参数：之前累积的值和集合元素。

这两个函数的区别在于 `fold()` 接受一个初始值，并在第一步中将其作为累积值使用，而 `reduce()` 的第一步则使用第一个和第二个元素作为操作参数。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //不正确：第一个元素没有被加倍
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } 
    //println(sumDoubledReduce)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

上面的示例展示了它们之间的区别：`fold()` 用于计算加倍元素的总和。如果你将相同的函数传递给 `reduce()`，它将返回不同的结果，因为它在第一步中使用列表的第一个和第二个元素作为参数，因此第一个元素将不会被加倍。

若要以相反顺序将函数应用于元素，请使用函数 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html) 和 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)。它们的工作方式类似于 `fold()` 和 `reduce()`，但从最后一个元素开始，然后继续到前一个。请注意，当进行右折叠或右归约时，操作参数的顺序会改变：先是元素，然后是累积值。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum -> sum + element * 2 }
    println(sumDoubledRight)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以应用将元素索引作为参数的操作。为此，请使用函数 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html) 和 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)，将元素索引作为操作的第一个参数传递。

最后，还有一些函数将此类操作从右到左应用于集合元素——[`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html) 和 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element -> if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum -> if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

所有归约操作在空集合上都会抛出异常。若要改为接收 `null`，请使用其 `*OrNull()` 对应的函数：
*   [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
*   [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
*   [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
*   [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

对于你想保存中间累加器值的情况，可以使用函数 [`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html)（或其同义词 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)）和 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
//sampleEnd
    val transform = { index: Int, element: Int -> "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("
", "使用 runningReduce 计算前 N 个元素的和：
"))
    println(runningFoldSum.mapIndexed(transform).joinToString("
", "使用 runningFold 计算前 N 个元素的和：
"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

如果你需要在操作参数中包含索引，请使用 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html) 或 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)。