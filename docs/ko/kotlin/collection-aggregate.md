[//]: # (title: 집계 연산)

Kotlin 컬렉션은 컬렉션의 내용을 바탕으로 단일 값을 반환하는 일반적인 **집계 연산(aggregate operations)** 함수들을 포함하고 있습니다. 대부분은 잘 알려져 있으며 다른 언어와 동일하게 작동합니다.

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html)과 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html)은 각각 가장 작은 요소와 가장 큰 요소를 반환합니다. 빈 컬렉션에서는 `null`을 반환합니다.
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)는 숫자 컬렉션에 있는 요소들의 평균값을 반환합니다.
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)은 숫자 컬렉션에 있는 요소들의 합을 반환합니다.
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)는 컬렉션의 요소 개수를 반환합니다.

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

특정 셀렉터(selector) 함수나 커스텀 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)를 사용하여 가장 작은 요소와 가장 큰 요소를 가져오는 함수들도 있습니다.

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html)과 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)은 셀렉터 함수를 인자로 받아, 해당 함수가 가장 크거나 작은 값을 반환하게 하는 요소를 반환합니다.
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html)과 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)은 `Comparator` 객체를 인자로 받아 해당 `Comparator`에 따라 가장 크거나 작은 요소를 반환합니다.
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html)과 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)은 셀렉터 함수를 인자로 받아 셀렉터가 반환하는 값 중 가장 크거나 작은 값을 반환합니다.
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html)과 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html)은 `Comparator` 객체를 인자로 받아 해당 `Comparator`에 따라 셀렉터가 반환하는 값 중 가장 크거나 작은 값을 반환합니다.

이 함수들은 빈 컬렉션에서 `null`을 반환합니다. 또한 [`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html), [`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html), [`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html), [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html)와 같은 대안 함수들도 있는데, 이들은 대응하는 함수들과 동일하게 작동하지만 빈 컬렉션에서 `NoSuchElementException`을 던집니다.

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

일반적인 `sum()` 외에도, 셀렉터 함수를 받아 모든 요소에 적용한 결과의 합을 반환하는 고급 합계 함수 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)가 있습니다. 셀렉터는 `Int`, `Long`, `Double`, `UInt`, `ULong`(JVM의 경우 `BigInteger`와 `BigDecimal` 포함)과 같은 다양한 숫자 타입을 반환할 수 있습니다.

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

## Fold와 reduce

더 특정한 사례를 위해, 제공된 연산을 컬렉션 요소에 순차적으로 적용하고 누적된 결과를 반환하는 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)와 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 함수가 있습니다. 연산은 이전까지 누적된 값과 컬렉션 요소라는 두 개의 인자를 받습니다.

두 함수의 차이점은 `fold()`는 초기값을 인자로 받아 첫 번째 단계에서 이를 누적값으로 사용하는 반면, `reduce()`는 첫 번째 단계에서 첫 번째와 두 번째 요소를 연산의 인자로 사용한다는 점입니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //부정확함: 결과에서 첫 번째 요소가 2배가 되지 않음
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } 
    //println(sumDoubledReduce)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

위의 예제는 그 차이점을 보여줍니다. `fold()`는 각 요소를 2배 한 값들의 합을 계산하는 데 사용됩니다. `reduce()`에 동일한 함수를 전달하면, 첫 번째 단계에서 리스트의 첫 번째와 두 번째 요소를 인자로 사용하기 때문에 첫 번째 요소는 2배가 되지 않아 다른 결과가 반환됩니다.

요소에 역순으로 함수를 적용하려면 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)와 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html) 함수를 사용하세요. 이들은 `fold()` 및 `reduce()`와 유사하게 작동하지만 마지막 요소부터 시작하여 이전 요소 방향으로 진행합니다. `foldRight`나 `reduceRight`를 할 때는 연산 인자의 순서가 바뀐다는 점에 유의하세요. 요소가 첫 번째 인자로 오고, 그 다음에 누적된 값이 옵니다.

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

요소의 인덱스를 파라미터로 받는 연산을 적용할 수도 있습니다. 이를 위해 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)와 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) 함수를 사용하며, 연산의 첫 번째 인자로 요소의 인덱스를 전달합니다.

마지막으로, 이러한 연산을 오른쪽에서 왼쪽으로 적용하는 함수인 [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)와 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)가 있습니다.

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

모든 reduce 연산은 빈 컬렉션에서 예외를 던집니다. 대신 `null`을 받으려면 `*OrNull()` 버전들을 사용하세요:
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

중간 누적 값들을 저장하고 싶은 경우에는 [`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (또는 동의어인 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html))과 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html) 함수가 있습니다.

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

연산 파라미터에 인덱스가 필요한 경우 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html) 또는 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)를 사용하세요.