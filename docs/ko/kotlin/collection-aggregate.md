[//]: # (title: 집계 연산)

Kotlin 컬렉션에는 일반적으로 사용되는 _집계 연산_을 위한 함수가 포함되어 있습니다. 이는 컬렉션 내용에 기반하여 단일 값을 반환하는 연산입니다. 대부분의 함수는 잘 알려져 있으며 다른 언어에서와 동일한 방식으로 작동합니다.

*   [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) 및 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html)는 각각 가장 작은 요소와 가장 큰 요소를 반환합니다. 빈 컬렉션에서는 `null`을 반환합니다.
*   [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)는 숫자 컬렉션의 요소 평균값을 반환합니다.
*   [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)은 숫자 컬렉션의 요소 합계를 반환합니다.
*   [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)는 컬렉션의 요소 개수를 반환합니다.

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

특정 셀렉터 함수 또는 사용자 지정 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)를 통해 가장 작거나 가장 큰 요소를 검색하는 함수도 있습니다.

*   [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) 및 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)는 셀렉터 함수를 받아 해당 함수가 반환하는 가장 크거나 가장 작은 값을 가진 요소를 반환합니다.
*   [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) 및 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)는 `Comparator` 객체를 받아 해당 `Comparator`에 따라 가장 크거나 가장 작은 요소를 반환합니다.
*   [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) 및 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)는 셀렉터 함수를 받아 셀렉터 자체의 가장 크거나 가장 작은 반환값을 반환합니다.
*   [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) 및 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html)는 `Comparator` 객체를 받아 해당 `Comparator`에 따라 가장 크거나 가장 작은 셀렉터 반환값을 반환합니다.

이 함수들은 빈 컬렉션에서 `null`을 반환합니다. 대안으로 [`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html), [`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html), [`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html), [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html) 함수도 있습니다. 이 함수들은 해당 `*OrNull()` 함수들과 동일하게 작동하지만, 빈 컬렉션에서는 `NoSuchElementException`을 던집니다.

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

일반적인 `sum()` 외에도, 셀렉터 함수를 받아 모든 컬렉션 요소에 적용한 결과의 합계를 반환하는 고급 합계 함수 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)가 있습니다. 셀렉터는 `Int`, `Long`, `Double`, `UInt`, `ULong` 등 다양한 숫자 타입을 반환할 수 있습니다 (JVM에서는 `BigInteger`와 `BigDecimal`도 가능합니다).

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

## Fold와 Reduce

더 구체적인 경우를 위해, 컬렉션 요소에 제공된 연산을 순차적으로 적용하고 누적된 결과를 반환하는 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 및 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 함수가 있습니다. 이 연산은 두 개의 인수를 받습니다: 이전에 누적된 값과 컬렉션 요소입니다.

두 함수의 차이점은 `fold()`가 초기 값을 받아 첫 단계에서 누적 값으로 사용하는 반면, `reduce()`의 첫 단계는 첫 번째와 두 번째 요소를 연산 인수로 사용한다는 점입니다.

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

위 예시는 차이점을 보여줍니다. `fold()`는 두 배가 된 요소들의 합계를 계산하는 데 사용됩니다. 만약 동일한 함수를 `reduce()`에 전달하면, 첫 단계에서 리스트의 첫 번째와 두 번째 요소를 인수로 사용하므로 첫 번째 요소는 두 배가 되지 않아 다른 결과를 반환할 것입니다.

요소에 함수를 역순으로 적용하려면 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html) 및 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html) 함수를 사용하세요. 이 함수들은 `fold()` 및 `reduce()`와 유사하게 작동하지만, 마지막 요소부터 시작하여 이전 요소로 진행합니다. 오른쪽으로 fold 또는 reduce할 때 연산 인수의 순서가 변경된다는 점에 유의하십시오: 요소가 먼저 오고, 그 다음 누적 값이 옵니다.

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

요소 인덱스를 매개변수로 받는 연산을 적용할 수도 있습니다. 이를 위해 연산의 첫 번째 인수로 요소 인덱스를 전달하는 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html) 및 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) 함수를 사용하세요.

마지막으로, 컬렉션 요소에 그러한 연산을 오른쪽에서 왼쪽으로 적용하는 함수인 [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html) 및 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)가 있습니다.

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

모든 reduce 연산은 빈 컬렉션에서 예외를 발생시킵니다. 대신 `null`을 받으려면 해당 `*OrNull()` 함수를 사용하세요:
*   [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
*   [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
*   [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
*   [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

중간 누적 값을 저장하고 싶은 경우를 위해 [`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (또는 그 동의어인 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)) 및 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html) 함수가 있습니다.

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

연산 매개변수에 인덱스가 필요한 경우 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html) 또는 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)를 사용하세요.