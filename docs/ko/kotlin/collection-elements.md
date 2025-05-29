[//]: # (title: 단일 요소 가져오기)

Kotlin 컬렉션은 컬렉션에서 단일 요소를 가져오는 함수 집합을 제공합니다.
이 페이지에서 설명하는 함수는 리스트와 집합 모두에 적용됩니다.

[리스트의 정의](collections-overview.md)에서 설명하듯이, 리스트는 순서 있는 컬렉션입니다.
따라서 리스트의 모든 요소는 참조에 사용할 수 있는 위치를 가집니다.
이 페이지에서 설명하는 함수 외에도, 리스트는 인덱스를 통해 요소를 가져오고 검색하는 더 다양한 방법을 제공합니다.
자세한 내용은 [리스트 전용 연산](list-operations.md)을 참조하세요.

반면에, 집합은 [정의상](collections-overview.md) 순서 있는 컬렉션이 아닙니다.
하지만 Kotlin의 `Set`은 특정 순서로 요소를 저장합니다.
이는 삽입 순서(`LinkedHashSet`의 경우), 자연 정렬 순서(`SortedSet`의 경우), 또는 다른 순서일 수 있습니다.
집합 요소의 순서가 알려지지 않은 경우도 있습니다.
이러한 경우에도 요소는 어떤 식으로든 정렬되므로, 요소 위치에 의존하는 함수들은 여전히 결과를 반환합니다.
그러나 호출자가 사용된 `Set`의 특정 구현을 알지 못하는 한, 이러한 결과는 예측 불가능합니다.

## 위치로 가져오기

특정 위치에 있는 요소를 가져오기 위해 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 함수가 있습니다.
이 함수를 정수 인자와 함께 호출하면 주어진 위치의 컬렉션 요소를 받게 됩니다.
첫 번째 요소는 `0` 위치를 가지며, 마지막 요소는 `(size - 1)`입니다.

`elementAt()`는 인덱스 접근을 제공하지 않거나, 정적으로 제공되는 것으로 알려지지 않은 컬렉션에 유용합니다.
`List`의 경우, [인덱스 접근 연산자](list-operations.md#retrieve-elements-by-index) (`get()` 또는 `[]`)를 사용하는 것이 더 관용적입니다.

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

컬렉션의 첫 번째 요소와 마지막 요소를 가져오는 데 유용한 별칭도 있습니다: [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
및 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html).

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

존재하지 않는 위치로 요소를 가져올 때 예외를 방지하려면, `elementAt()`의 안전한 변형을 사용하세요:

*   [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)은 지정된 위치가 컬렉션 범위를 벗어날 때 `null`을 반환합니다.
*   [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html)는 추가적으로 `Int` 인자를 컬렉션 요소 타입의 인스턴스에 매핑하는 람다 함수를 받습니다.
    범위를 벗어나는 위치로 호출될 때, `elementAtOrElse()`는 주어진 값에 대한 람다의 결과를 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 조건으로 검색

[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 함수는
주어진 조건자와 일치하는 요소를 컬렉션에서 검색할 수 있도록 합니다. 컬렉션 요소를 테스트하는 조건자와 함께 `first()`를 호출하면,
조건자가 `true`를 반환하는 첫 번째 요소를 받게 됩니다.
마찬가지로, 조건자와 함께 `last()`를 호출하면 일치하는 마지막 요소를 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

조건자와 일치하는 요소가 없으면 두 함수 모두 예외를 발생시킵니다.
이를 방지하려면 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
및 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)을 대신 사용하세요.
이 함수들은 일치하는 요소가 없으면 `null`을 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

다음 별칭들은 이름이 상황에 더 적합한 경우에 사용하세요:

*   `firstOrNull()` 대신 [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html)
*   `lastOrNull()` 대신 [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html)

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 선택자로 가져오기

요소를 가져오기 전에 컬렉션을 매핑해야 하는 경우, [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 함수가 있습니다.
이 함수는 두 가지 동작을 결합합니다:
-   선택자 함수로 컬렉션을 매핑합니다.
-   결과에서 첫 번째 non-null 값을 반환합니다.

`firstNotNullOf()`는 결과 컬렉션에 non-nullable 요소가 없는 경우 `NoSuchElementException`을 발생시킵니다.
이 경우 `null`을 반환하려면 대응하는 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)을 사용하세요.

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 무작위 요소

컬렉션의 임의의 요소를 가져와야 하는 경우, [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 함수를 호출하세요.
이 함수를 인자 없이 호출하거나, [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 객체를 무작위성의 원천으로 사용하여 호출할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

비어 있는 컬렉션에서 `random()`은 예외를 발생시킵니다. 대신 `null`을 받으려면 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)을 사용하세요.

## 요소 존재 여부 확인

컬렉션에 요소의 존재 여부를 확인하려면 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 함수를 사용하세요.
이 함수는 컬렉션 요소가 함수 인자와 `equals()`인 경우 `true`를 반환합니다.
`contains()`는 `in` 키워드를 사용하여 연산자 형식으로 호출할 수 있습니다.

여러 인스턴스의 존재 여부를 한 번에 확인하려면, 이 인스턴스들의 컬렉션을 인자로 하여 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)를 호출하세요.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한, [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
또는 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)를 호출하여 컬렉션에 요소가 포함되어 있는지 확인할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}