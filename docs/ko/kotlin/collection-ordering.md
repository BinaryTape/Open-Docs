---
title: 주문
---
요소의 순서는 특정 컬렉션 타입의 중요한 측면입니다.
예를 들어, 동일한 요소를 가진 두 목록이라도 요소의 순서가 다르면 동일하지 않습니다.

Kotlin에서는 객체의 순서를 여러 가지 방법으로 정의할 수 있습니다.

첫째, _자연적_ 순서가 있습니다. 이는 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 인터페이스의 구현에 대해 정의됩니다.
자연적 순서는 다른 순서가 지정되지 않은 경우 해당 요소들을 정렬하는 데 사용됩니다.

대부분의 내장 타입은 비교 가능합니다.

* 숫자 타입은 전통적인 숫자 순서를 사용합니다. `1`은 `0`보다 크고, `-3.4f`는 `-5f`보다 큰 식입니다.
* `Char` 및 `String`은 [사전순](https://en.wikipedia.org/wiki/Lexicographical_order)을 사용합니다. `b`는 `a`보다 크고, `world`는 `hello`보다 큽니다.

사용자 정의 타입에 대한 자연적 순서를 정의하려면 해당 타입을 `Comparable`의 구현체로 만듭니다.
이렇게 하려면 `compareTo()` 함수를 구현해야 합니다. `compareTo()`는 동일한 타입의 다른 객체를 인수로 사용하고
어떤 객체가 더 큰지 나타내는 정수 값을 반환해야 합니다.

* 양수 값은 수신 객체가 더 크다는 것을 나타냅니다.
* 음수 값은 인자보다 작다는 것을 나타냅니다.
* 0은 객체가 동일함을 나타냅니다.

다음은 major 및 minor 부분으로 구성된 버전을 정렬하기 위한 클래스입니다.

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major `->` this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor `->` this.minor compareTo other.minor
        else `->` 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```

_사용자 정의_ 순서를 사용하면 원하는 방식으로 모든 타입의 인스턴스를 정렬할 수 있습니다.
특히, 비교할 수 없는 객체에 대한 순서를 정의하거나 비교 가능한 타입에 대해 자연적 순서가 아닌 다른 순서를 정의할 수 있습니다.
타입에 대한 사용자 정의 순서를 정의하려면 해당 타입에 대한 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)를 만듭니다.
`Comparator`에는 `compare()` 함수가 포함되어 있습니다. 이 함수는 클래스의 두 인스턴스를 가져와서 둘 사이의 비교 결과를 정수 값으로 반환합니다.
결과는 위에서 설명한 `compareTo()`의 결과와 동일한 방식으로 해석됩니다.

```kotlin
fun main() {

    val lengthComparator = Comparator { str1: String, str2: String `->` str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))

}
```

`lengthComparator`가 있으면 기본 사전순 대신 문자열을 길이별로 정렬할 수 있습니다.

`Comparator`를 정의하는 더 짧은 방법은 표준 라이브러리의 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)
함수입니다. `compareBy()`는 인스턴스에서 `Comparable` 값을 생성하는 람다 함수를 사용하고
생성된 값의 자연적 순서로 사용자 정의 순서를 정의합니다.

`compareBy()`를 사용하면 위의 예제에서 길이 비교기를 다음과 같이 표현할 수 있습니다.

```kotlin
fun main() {

    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))

}
```

여러 기준에 따라 순서를 정의할 수도 있습니다.
예를 들어, 문자열을 길이별로 정렬하고 길이가 같으면 알파벳순으로 정렬하려면 다음과 같이 작성할 수 있습니다.

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b `->` 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 `->` a.compareTo(b)
             else `->` compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

여러 기준으로 정렬하는 것은 일반적인 시나리오이므로 Kotlin 표준 라이브러리는 보조 정렬 규칙을 추가하는 데 사용할 수 있는 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 함수를 제공합니다.

예를 들어, `compareBy()`와 `thenBy()`를 결합하여 이전 예제와 마찬가지로 문자열을 먼저 길이별로 정렬하고 두 번째로 알파벳순으로 정렬할 수 있습니다.

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

Kotlin 컬렉션 패키지는 컬렉션을 자연적, 사용자 정의 및 임의 순서로 정렬하는 함수를 제공합니다.
이 페이지에서는 [읽기 전용](collections-overview#collection-types) 컬렉션에 적용되는 정렬 함수에 대해 설명합니다.
이러한 함수는 요청된 순서로 원래 컬렉션의 요소를 포함하는 새 컬렉션으로 결과를 반환합니다.
제자리에서 [변경 가능한](collections-overview#collection-types) 컬렉션을 정렬하는 함수에 대한 자세한 내용은 [목록 관련 작업](list-operations#sort)을 참조하세요.

## 자연적 순서

기본 함수인 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 및 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)은
컬렉션의 요소를 자연적 순서에 따라 오름차순 및 내림차순으로 정렬하여 반환합니다.
이러한 함수는 `Comparable` 요소의 컬렉션에 적용됩니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")

}
```

## 사용자 정의 순서
 
사용자 정의 순서로 정렬하거나 비교할 수 없는 객체를 정렬하기 위해 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 및 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html) 함수가 있습니다.
이 함수는 컬렉션 요소를 `Comparable` 값에 매핑하고 해당 값의 자연적 순서로 컬렉션을 정렬하는 선택기 함수를 사용합니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")

}
```

컬렉션 정렬에 대한 사용자 정의 순서를 정의하려면 고유한 `Comparator`를 제공하면 됩니다.
이렇게 하려면 `Comparator`를 전달하여 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 함수를 호출합니다.
이 함수를 사용하면 문자열을 길이별로 정렬하는 것이 다음과 같습니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")

}
```

## 역순

[`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 함수를 사용하여 역순으로 컬렉션을 검색할 수 있습니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())

}
```

`reversed()`는 요소의 복사본이 있는 새 컬렉션을 반환합니다.
따라서 나중에 원래 컬렉션을 변경하더라도 이전에 얻은 `reversed()` 결과에는 영향을 미치지 않습니다.

또 다른 반전 함수인 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
는 동일한 컬렉션 인스턴스의 반전된 뷰를 반환하므로 원래 목록이 변경되지 않을 경우 `reversed()`보다 더 가볍고 선호될 수 있습니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)

}
```

원래 목록이 변경 가능하면 모든 변경 사항이 반전된 뷰에 반영되고 그 반대도 마찬가지입니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)

}
```

그러나 목록의 변경 가능성을 알 수 없거나 소스가 목록이 아닌 경우 `reversed()`가 더 선호됩니다.
결과가 미래에 변경되지 않는 복사본이기 때문입니다.

## 임의 순서

마지막으로, 컬렉션 요소를 임의 순서로 포함하는 새 `List`를 반환하는 함수인 [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)가 있습니다.
인수 없이 또는 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 객체와 함께 호출할 수 있습니다.

```kotlin
fun main() {

     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())

}
```