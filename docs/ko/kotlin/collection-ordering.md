[//]: # (title: 순서 지정)

요소의 순서는 특정 컬렉션 타입의 중요한 측면입니다.
예를 들어, 동일한 요소를 가진 두 리스트라도 요소의 순서가 다르면 같다고 볼 수 없습니다.

Kotlin에서는 객체의 순서를 여러 가지 방법으로 정의할 수 있습니다.

첫 번째는 *자연 순서*입니다. 이는 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 인터페이스의 구현에 대해 정의됩니다. 다른 순서가 지정되지 않은 경우, 자연 순서가 객체를 정렬하는 데 사용됩니다.

대부분의 내장 타입은 비교 가능합니다:

* 숫자 타입은 전통적인 숫자 순서를 사용합니다: `1`은 `0`보다 크고, `-3.4f`는 `-5f`보다 크며, 기타 등등입니다.
* `Char`와 `String`은 [사전식 순서](https://en.wikipedia.org/wiki/Lexicographical_order)를 사용합니다: `b`는 `a`보다 크고, `world`는 `hello`보다 큽니다.

사용자 정의 타입에 대한 자연 순서를 정의하려면, 해당 타입을 `Comparable`의 구현체로 만드세요.
이를 위해서는 `compareTo()` 함수를 구현해야 합니다. `compareTo()`는 동일한 타입의 다른 객체를 인수로 받아 어떤 객체가 더 큰지를 나타내는 정수 값을 반환해야 합니다:

* 양수 값은 수신 객체가 더 크다는 것을 나타냅니다.
* 음수 값은 인자보다 작다는 것을 나타냅니다.
* 0은 객체들이 같다는 것을 나타냅니다.

아래는 주(major) 부분과 부(minor) 부분으로 구성된 버전을 순서 지정하는 클래스입니다.

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

*사용자 정의* 순서를 사용하면 원하는 방식으로 모든 타입의 인스턴스를 정렬할 수 있습니다.
특히, 비교할 수 없는 객체에 대한 순서를 정의하거나, 비교 가능한 타입에 대해 자연 순서 외의 다른 순서를 정의할 수 있습니다.
타입에 대한 사용자 정의 순서를 정의하려면, 해당 타입에 대한 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)를 생성하세요.
`Comparator`는 `compare()` 함수를 포함합니다: 이 함수는 클래스의 두 인스턴스를 받아 그 둘 사이의 비교 결과를 정수 값으로 반환합니다.
결과는 위에서 설명한 `compareTo()`의 결과와 동일하게 해석됩니다.

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`lengthComparator`를 사용하면 기본 사전식 순서 대신 문자열을 길이로 정렬할 수 있습니다.

`Comparator`를 정의하는 더 짧은 방법은 표준 라이브러리의 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 함수를 사용하는 것입니다. `compareBy()`는 인스턴스로부터 `Comparable` 값을 생성하는 람다 함수를 받아 생성된 값의 자연 순서로 사용자 정의 순서를 정의합니다.

`compareBy()`를 사용하면 위 예제의 길이 비교기는 다음과 같습니다:

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한 여러 기준에 따라 순서를 정의할 수도 있습니다.
예를 들어, 문자열을 길이로 정렬하고, 길이가 같을 경우 알파벳 순으로 정렬하려면 다음과 같이 작성할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b -> 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 -> a.compareTo(b)
             else -> compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여러 기준에 따른 정렬은 흔한 시나리오이므로, Kotlin 표준 라이브러리는 보조 정렬 규칙을 추가하는 데 사용할 수 있는 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 함수를 제공합니다.

예를 들어, 이전 예제와 마찬가지로 `compareBy()`와 `thenBy()`를 결합하여 문자열을 먼저 길이로 정렬하고, 두 번째로 알파벳 순으로 정렬할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Kotlin 컬렉션 패키지는 자연, 사용자 정의, 심지어 무작위 순서로 컬렉션을 정렬하기 위한 함수를 제공합니다.
이 페이지에서는 [읽기 전용](collections-overview.md#collection-types) 컬렉션에 적용되는 정렬 함수를 설명합니다.
이 함수들은 요청된 순서로 원본 컬렉션의 요소를 포함하는 새 컬렉션을 결과로 반환합니다.
[가변](collections-overview.md#collection-types) 컬렉션을 제자리에서 정렬하는 함수에 대해 알아보려면 [리스트 특정 작업](list-operations.md#sort)을 참조하세요.

## 자연 순서

기본 함수인 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)와 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)는 컬렉션의 요소를 자연 순서에 따라 오름차순 및 내림차순 시퀀스로 정렬하여 반환합니다.
이 함수들은 `Comparable` 요소의 컬렉션에 적용됩니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 사용자 정의 순서
 
사용자 정의 순서로 정렬하거나 비교할 수 없는 객체를 정렬하려면 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html)와 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html) 함수가 있습니다.
이 함수들은 컬렉션 요소를 `Comparable` 값에 매핑하는 셀렉터 함수를 받아 해당 값의 자연 순서로 컬렉션을 정렬합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

컬렉션 정렬을 위한 사용자 정의 순서를 정의하려면 자신만의 `Comparator`를 제공할 수 있습니다.
이렇게 하려면 `Comparator`를 전달하여 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 함수를 호출합니다.
이 함수를 사용하면 문자열을 길이로 정렬하는 것이 다음과 같습니다:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 역순

[`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 함수를 사용하여 컬렉션을 역순으로 가져올 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()`는 요소의 사본이 있는 새 컬렉션을 반환합니다.
따라서 나중에 원본 컬렉션을 변경하더라도 이는 이전에 얻은 `reversed()`의 결과에 영향을 미치지 않습니다.

또 다른 역순 함수인 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)는 동일한 컬렉션 인스턴스의 역순 뷰를 반환하므로, 원본 리스트가 변경되지 않을 경우 `reversed()`보다 더 가볍고 선호될 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

원본 리스트가 가변적이라면, 모든 변경 사항이 역순 뷰에 반영되며 그 반대도 마찬가지입니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

그러나 리스트의 가변성이 알려지지 않았거나 소스가 아예 리스트가 아니라면, `reversed()`가 더 선호됩니다. 그 결과가 미래에 변경되지 않을 사본이기 때문입니다.

## 무작위 순서

마지막으로, 컬렉션 요소를 무작위 순서로 포함하는 새 `List`를 반환하는 함수인 [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)가 있습니다.
이 함수는 인자 없이 호출하거나 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 객체와 함께 호출할 수 있습니다.

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}