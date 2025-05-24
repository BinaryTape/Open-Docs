---
title: "Aggregate 연산"
---
Kotlin 컬렉션은 컬렉션 내용을 기반으로 단일 값을 반환하는 연산인 일반적으로 사용되는 _집계 연산_ 함수를 포함합니다. 대부분은 잘 알려져 있으며 다른 언어에서와 동일하게 작동합니다.

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) 및 [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html)은 각각 가장 작은 요소와 가장 큰 요소를 반환합니다. 빈 컬렉션에서는 `null`을 반환합니다.
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)는 숫자 컬렉션에 있는 요소의 평균값을 반환합니다.
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)은 숫자 컬렉션에 있는 요소의 합계를 반환합니다.
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)는 컬렉션에 있는 요소의 수를 반환합니다.

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

특정 선택자 함수 또는 사용자 지정 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)에 의해 가장 작거나 가장 큰 요소를 검색하는 함수도 있습니다.

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) 및 [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)은 선택자 함수를 가져와서 가장 크거나 가장 작은 값을 반환하는 요소를 반환합니다.
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) 및 [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)은 `Comparator` 객체를 가져와서 해당 `Comparator`에 따라 가장 크거나 가장 작은 요소를 반환합니다.
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html) 및 [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)은 선택자 함수를 가져와서 선택기 자체의 가장 크거나 가장 작은 반환 값을 반환합니다.
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html) 및 [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html)은 `Comparator` 객체를 가져와서 해당 `Comparator`에 따라 가장 크거나 가장 작은 선택기 반환 값을 반환합니다.

이러한 함수는 빈 컬렉션에서 `null`을 반환합니다. 대안으로 [`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html), [`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html), [`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html) 및 [`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html)도 있습니다. 이 함수들은 대응되는 함수와 동일한 작업을 수행하지만 빈 컬렉션에서 `NoSuchElementException`을 발생시킵니다.

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

일반 `sum()` 외에도 고급 합산 함수인 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)가 있습니다.
이 함수는 선택자 함수를 가져와서 모든 컬렉션 요소에 대한 적용 합계를 반환합니다. 선택자는 다양한 숫자 유형(`Int`, `Long`, `Double`, `UInt` 및 `ULong`)을 반환할 수 있습니다(JVM에서는 `BigInteger` 및 `BigDecimal`도 가능).

```kotlin

fun main() {

    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })

}
```

## Fold 및 reduce

더욱 구체적인 경우에는 제공된 연산을 컬렉션 요소에 순차적으로 적용하고 누적된 결과를 반환하는 함수인 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 및 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)가 있습니다.
이 연산은 이전에 누적된 값과 컬렉션 요소라는 두 개의 인수를 사용합니다.

두 함수의 차이점은 `fold()`는 초기값을 취하여 첫 번째 단계에서 누적된 값으로 사용하는 반면, `reduce()`의 첫 번째 단계에서는 첫 번째 및 두 번째 요소를 연산 인수로 사용합니다.

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

위의 예에서는 차이점을 보여 줍니다. `fold()`는 두 배로 된 요소의 합계를 계산하는 데 사용됩니다.
동일한 함수를 `reduce()`에 전달하면 목록의 처음과 두 번째
요소를 첫 번째 단계의 인수로 사용하므로 다른 결과를 반환합니다. 따라서 첫 번째 요소는 두 배가 되지 않습니다.

함수를 역순으로 요소에 적용하려면 함수 [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)
및 [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)를 사용합니다.
이 함수들은 `fold()` 및 `reduce()`와 유사한 방식으로 작동하지만 마지막 요소부터 시작하여 이전 요소로 계속 진행합니다.
오른쪽으로 접거나 줄일 때 연산 인수의 순서가 변경됩니다. 먼저 요소가 가고 그다음에 누적된 값이 갑니다.

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum `->` sum + element * 2 }
    println(sumDoubledRight)

}
```

요소 인덱스를 매개변수로 사용하는 연산을 적용할 수도 있습니다.
이를 위해 요소
인덱스를 연산의 첫 번째 인수로 전달하는 함수 [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)
및 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)를 사용합니다.

마지막으로, 이러한 연산을 오른쪽에서 왼쪽으로 컬렉션 요소에 적용하는 함수인 [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)
및 [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)가 있습니다.

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)

}
```

모든 reduce 연산은 빈 컬렉션에서 예외를 발생시킵니다. 대신 `null`을 받으려면 `*OrNull()` 대응 함수를 사용하세요.
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

중간 누산기 값을 저장하려는 경우 함수
[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html)(또는 동의어 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html))
및 [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)가 있습니다.

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

연산 매개변수에 인덱스가 필요한 경우 [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)
또는 [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)를 사용합니다.