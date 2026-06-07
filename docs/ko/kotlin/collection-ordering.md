[//]: # (title: 정렬 (Ordering))

요소의 순서는 특정 컬렉션 타입에서 중요한 측면입니다.
예를 들어, 동일한 요소를 가진 두 리스트라도 요소의 순서가 다르면 서로 같지 않습니다. 

Kotlin에서는 객체의 순서를 여러 가지 방식으로 정의할 수 있습니다.

먼저, *자연(natural)* 순서가 있습니다. 이는 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 인터페이스의 구현체에 대해 정의됩니다. 
다른 순서가 지정되지 않았을 때 정렬에 자연 순서가 사용됩니다.

대부분의 내장 타입은 비교 가능(comparable)합니다:

*   숫자 타입은 전통적인 수치 순서를 따릅니다: `1`은 `0`보다 크고, `-3.4f`는 `-5f`보다 큰 식입니다.
*   `Char`와 `String`은 [사전식 순서(lexicographical order)](https://en.wikipedia.org/wiki/Lexicographical_order)를 따릅니다: `b`는 `a`보다 크고, `world`는 `hello`보다 큽니다.

사용자 정의 타입에 자연 순서를 정의하려면 해당 타입을 `Comparable`의 구현체로 만드세요. 
이를 위해 `compareTo()` 함수를 구현해야 합니다. `compareTo()`는 동일한 타입의 다른 객체를 인자로 받아 어느 객체가 더 큰지를 나타내는 정수 값을 반환해야 합니다:

*   양수는 수신 객체(receiver object)가 더 크다는 것을 나타냅니다.
*   음수는 인자보다 작다는 것을 나타냅니다.
*   0은 객체들이 서로 같음을 나타냅니다.

아래는 메이저(major)와 마이너(minor) 부분으로 구성된 버전을 정렬하기 위한 클래스입니다.

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // 중위 형태의 compareTo() 
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

*사용자 정의(Custom)* 순서를 사용하면 어떤 타입의 인스턴스라도 원하는 방식으로 정렬할 수 있습니다. 
특히, 비교 불가능한 객체에 대해 순서를 정의하거나, 비교 가능한 타입에 대해 자연 순서가 아닌 다른 순서를 정의할 수 있습니다. 
타입에 대한 사용자 정의 순서를 정의하려면, 해당 타입에 대한 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)를 만드세요. 
`Comparator`는 `compare()` 함수를 포함하며, 클래스의 두 인스턴스를 받아 비교 결과인 정수를 반환합니다. 
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

`lengthComparator`를 사용하면 기본 사전식 순서 대신 문자열의 길이에 따라 문자열을 정렬할 수 있습니다.

`Comparator`를 정의하는 더 짧은 방법은 표준 라이브러리의 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 함수를 사용하는 것입니다. 
`compareBy()`는 인스턴스에서 `Comparable` 값을 생성하는 람다 함수를 인자로 받아, 생성된 값의 자연 순서를 기준으로 사용자 정의 순서를 정의합니다.

`compareBy()`를 사용하면 위 예제의 길이 비교기(length comparator)는 다음과 같습니다:

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여러 기준을 바탕으로 순서를 정의할 수도 있습니다. 
예를 들어, 문자열을 길이순으로 정렬하고 길이가 같을 때는 알파벳순으로 정렬하려면 다음과 같이 작성할 수 있습니다.

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

여러 기준으로 정렬하는 것은 흔한 시나리오이므로, Kotlin 표준 라이브러리는 보조 정렬 규칙을 추가할 수 있는 [`.thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 함수를 제공합니다.

예를 들어, 이전 예제와 같이 `compareBy()`와 `.thenBy()`를 조합하여 문자열을 길이순으로 먼저 정렬하고 그다음에 알파벳순으로 정렬할 수 있습니다.

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

Kotlin 컬렉션 패키지는 자연 순서, 사용자 정의 순서, 그리고 무작위 순서로 컬렉션을 정렬하는 함수를 제공합니다. 
이 페이지에서는 [읽기 전용](collections-overview.md#collection-types) 컬렉션에 적용되는 정렬 함수를 설명합니다. 
이 함수들은 원본 컬렉션의 요소를 요청된 순서대로 포함하는 새로운 컬렉션으로 결과를 반환합니다. 
[가변(mutable)](collections-overview.md#collection-types) 컬렉션을 제자리(in-place)에서 정렬하는 함수에 대해 알아보려면 [리스트 전용 연산](list-operations.md#sort)을 참조하세요.

## 자연 순서 (Natural order)

기본 함수인 [`.sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)와 [`.sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)은 자연 순서에 따라 요소를 오름차순 또는 내림차순으로 정렬하여 반환합니다. 
이 함수들은 `Comparable` 요소들로 구성된 컬렉션에 적용됩니다.

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

## 사용자 정의 순서 (Custom orders)
 
사용자 정의 순서로 정렬하거나 비교 불가능한 객체를 정렬하기 위해 [`.sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html)와 [`.sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html) 함수가 있습니다. 
이 함수들은 컬렉션 요소를 `Comparable` 값으로 매핑하는 선택자(selector) 함수를 인자로 받아, 해당 값의 자연 순서대로 컬렉션을 정렬합니다.

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

컬렉션 정렬을 위한 사용자 정의 순서를 정의하려면 자신만의 `Comparator`를 제공하면 됩니다. 
이를 위해 `Comparator`를 인자로 전달하며 [`.sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 확장 함수를 호출하세요. 
이 함수를 사용하여 문자열을 길이순으로 정렬하면 다음과 같습니다:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 정렬 순서 확인 (Check sorted order)

요소가 이미 지정된 순서를 따르고 있는지 확인하기 위해 다음과 같은 확장 함수를 사용할 수 있습니다:

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

이 확장 함수들은 요소가 지정된 순서대로 되어 있거나 요소가 두 개 미만인 경우 `true`를 반환합니다. 
순서가 맞지 않는 쌍을 찾는 즉시 `false`를 반환하고 확인을 중단합니다.

`HashSet`과 같이 반복 순서가 보장되지 않는 컬렉션의 경우, 호출할 때마다 결과가 달라질 수 있습니다. 
일관된 순서로 요소를 생성하지 않는 시퀀스(sequence)의 경우도 마찬가지입니다. 
호출 간에 동일한 결과를 얻으려면 `List`와 같이 반복 순서가 보장되는 컬렉션에서만 이 함수들을 사용하세요.

`Double` 및 `Float` 값을 확인할 때, 이 함수들은 `NaN`을 다른 어떤 값보다 큰 것으로 간주하고, `-0.0`을 `0.0`보다 작은 것으로 간주합니다. 
또한, `.isSortedBy()` 및 `.isSortedByDescending()` 함수는 `null` 선택자 결과를 null이 아닌 값보다 작은 것으로 간주합니다.

시퀀스에서 이 함수들을 호출하면 최종 연산(terminal operation)이 됩니다. 
즉, 다른 시퀀스를 반환하는 대신 시퀀스를 소비하여 `Boolean` 값을 생성합니다.

> 이러한 정렬 확인 함수들은 배열(arrays), 기본 타입 배열(primitive arrays), 부호 없는 배열(unsigned arrays)에서도 사용할 수 있습니다. 
> 부호 없는 배열과 그에 대한 연산은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계이며, `@ExperimentalUnsignedTypes` 어노테이션을 통한 명시적 동의(opt-in)가 필요합니다.
> 
{style="note"}

다음은 `.isSorted()` 및 `.isSortedBy()` 함수를 사용하여 정렬 순서를 확인하는 예입니다:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false

    val descending = listOf(4, 3, 2, 1)
    println(descending.isSortedDescending())
    // true
   
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

## 역순 (Reverse order)

[`.reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 함수를 사용하여 컬렉션을 역순으로 가져올 수 있습니다. 

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`.reversed()` 확장 함수는 요소의 복사본을 담은 새로운 컬렉션을 반환합니다. 
따라서 나중에 원본 컬렉션을 변경해도 이전에 얻은 `.reversed()` 결과에는 영향을 주지 않습니다.

또 다른 역순 함수인 [`.asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)는 동일한 컬렉션 인스턴스의 역순 뷰(view)를 반환하므로, 원본 리스트가 변경되지 않을 경우 `.reversed()`보다 가볍고 선호될 수 있습니다. 

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

원본 리스트가 가변(mutable)인 경우, 원본의 모든 변경 사항이 역순 뷰에 반영되며 그 반대도 마찬가지입니다.

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

하지만 리스트의 가변 여부를 알 수 없거나 소스가 리스트가 아닌 경우, 결과가 나중에 변경되지 않는 복사본인 `.reversed()`를 사용하는 것이 더 바람직합니다.

## 무작위 순서 (Random order)

마지막으로, 컬렉션 요소를 무작위 순서로 포함하는 새로운 `List`를 반환하는 [`.shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html) 함수가 있습니다. 
인자 없이 호출하거나 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 객체를 전달하여 호출할 수 있습니다.

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}