[//]: # (title: 聚合操作)

Kotlin 集合中包含了常用的 _聚合操作_ 函式 — 這些操作根據集合內容回傳單一值。其中大多數操作是眾所周知的，且在其他語言中的工作方式相同：

*   [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) 與 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html) 分別回傳最小及最大的元素。在空集合上，它們會回傳 `null`。
*   [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html) 回傳數字集合中元素的平均值。
*   [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 回傳數字集合中元素的總和。
*   [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 回傳集合中元素的數量。

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

也有函式可以透過特定的選擇器函式 (selector function) 或自訂的 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html) 來取得最小及最大的元素：

*   [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) 與 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html) 接受一個選擇器函式，並回傳該函式回傳最大或最小值的元素。
*   [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) 與 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html) 接受一個 `Comparator` 物件，並根據該 `Comparator` 回傳最大或最小的元素。
*   [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) 與 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html) 接受一個選擇器函式，並回傳選擇器本身的最大或最小回傳值。
*   [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) 與 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html) 接受一個 `Comparator` 物件，並根據該 `Comparator` 回傳最大或最小的選擇器回傳值。

這些函式在空集合上會回傳 `null`。也有一些替代方案 — [`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)、[`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html)、[`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html) 和 [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html) — 它們的功能與對應函式相同，但在空集合上會拋出 `NoSuchElementException`。

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

除了常規的 `sum()` 之外，還有一個進階的加總函式 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)，它接受一個選擇器函式，並回傳將該函式應用於所有集合元素後的總和。選擇器可以回傳不同的數值型別：`Int`、`Long`、`Double`、`UInt` 和 `ULong` (在 JVM 上也支援 `BigInteger` 和 `BigDecimal`)。

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

## 摺疊 (Fold) 與歸約 (Reduce)

對於更特定的情況，有 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函式，它們依序將提供的操作應用於集合元素，並回傳累積結果。該操作接受兩個引數：先前累積的值和集合元素。

這兩個函式之間的差異在於，`fold()` 接受一個初始值，並在第一步將其用作累積值，而 `reduce()` 的第一步則使用第一個和第二個元素作為操作引數。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //incorrect: the first element isn't doubled in the result
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } 
    //println(sumDoubledReduce)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

上面的範例顯示了差異：`fold()` 用於計算雙倍元素的總和。如果您將相同的函式傳遞給 `reduce()`，它將回傳另一個結果，因為它在第一步中會使用列表的第一個和第二個元素作為引數，因此第一個元素將不會被雙倍處理。

若要以相反順序將函式應用於元素，請使用 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html) 和 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html) 函式。它們的工作方式類似於 `fold()` 和 `reduce()`，但從最後一個元素開始，然後繼續處理前一個元素。請注意，在右側摺疊 (folding right) 或右側歸約 (reducing right) 時，操作引數的順序會改變：第一個是元素，然後是累積值。

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

您也可以應用接受元素索引作為參數的操作。為此，請使用 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html) 和 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) 函式，將元素索引作為操作的第一個引數傳遞。

最後，還有將此類操作從右到左應用於集合元素的函式 — [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html) 和 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)。

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

所有歸約操作在空集合上都會拋出例外。若要改為接收 `null`，請使用其 `*OrNull()` 對應函式：
*   [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
*   [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
*   [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
*   [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

對於您想儲存中間累積值的情況，有 [`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (或其同義詞 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)) 和 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html) 函式。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
//sampleEnd
    val transform = { index: Int, element: Int -> "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningReduce:
"))
    println(runningFoldSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningFold:
"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

如果您在操作參數中需要索引，請使用 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html) 或 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)。