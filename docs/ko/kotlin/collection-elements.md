---
title: "단일 요소 검색"
---
Kotlin 컬렉션은 컬렉션에서 단일 요소를 검색하기 위한 함수 집합을 제공합니다.
이 페이지에 설명된 함수는 리스트와 세트 모두에 적용됩니다.

[리스트 정의](collections-overview)에서 알 수 있듯이 리스트는 순서가 지정된 컬렉션입니다.
따라서 리스트의 모든 요소는 참조에 사용할 수 있는 위치를 가집니다.
이 페이지에 설명된 함수 외에도 리스트는 인덱스로 요소를 검색하고 찾는 더 광범위한 방법을 제공합니다.
자세한 내용은 [리스트 전용 연산](list-operations)을 참조하세요.

반면, 세트는 [정의](collections-overview)에 따라 순서가 지정된 컬렉션이 아닙니다.
그러나 Kotlin `Set`은 특정 순서로 요소를 저장합니다.
이는 삽입 순서(`LinkedHashSet`), 자연 정렬 순서(`SortedSet`) 또는 다른 순서일 수 있습니다.
요소 집합의 순서를 알 수 없는 경우도 있습니다.
이러한 경우에도 요소는 여전히 어떤 식으로든 정렬되므로 요소 위치에 의존하는 함수는 여전히 결과를 반환합니다.
그러나 이러한 결과는 호출자가 사용된 `Set`의 특정 구현을 알지 못하는 한 예측할 수 없습니다.

## 위치로 검색

특정 위치에서 요소를 검색하려면 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 함수를 사용합니다.
정수 숫자를 인수로 사용하여 호출하면 지정된 위치에서 컬렉션 요소를 받게 됩니다.
첫 번째 요소의 위치는 `0`이고 마지막 요소의 위치는 `(size - 1)`입니다.
 
`elementAt()`는 인덱싱된 접근 방식을 제공하지 않거나 정적으로 제공하는 것으로 알려지지 않은 컬렉션에 유용합니다.
`List`의 경우 [인덱싱된 접근 연산자](list-operations#retrieve-elements-by-index) (`get()` 또는 `[]`)를 사용하는 것이 더 관용적입니다.

```kotlin

fun main() {

    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order

}
```

컬렉션의 처음과 마지막 요소를 검색하는 데 유용한 별칭도 있습니다. [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
및 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html).

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    

}
```

존재하지 않는 위치로 요소를 검색할 때 예외가 발생하는 것을 방지하려면 `elementAt()`의 안전한 변형을 사용하세요.

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)은 지정된 위치가 컬렉션 범위를 벗어나는 경우 null을 반환합니다.
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html)는 추가적으로 `Int` 인수를 컬렉션 요소 유형의 인스턴스에 매핑하는 람다 함수를 사용합니다.
   범위를 벗어난 위치로 호출되면 `elementAtOrElse()`는 지정된 값에 대한 람다 결과를 반환합니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index `->` "The value for index $index is undefined"})

}
```

## 조건으로 검색

함수 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)를 사용하면
주어진 조건과 일치하는 요소를 컬렉션에서 검색할 수도 있습니다. 조건이
컬렉션 요소를 테스트하는 조건자로 `first()`를 호출하면 조건자가 `true`를 생성하는 첫 번째 요소를 받게 됩니다.
반대로, 조건자가 있는 `last()`는 조건과 일치하는 마지막 요소를 반환합니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })

}
```

조건자와 일치하는 요소가 없으면 두 함수 모두 예외를 발생시킵니다.
이를 방지하려면 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
및 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)을 대신 사용하세요.
일치하는 요소가 없으면 `null`을 반환합니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })

}
```

이름이 상황에 더 적합한 경우 별칭을 사용하세요.

* `firstOrNull()` 대신 [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html)
* `lastOrNull()` 대신 [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html)

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })

}
```

## 선택기로 검색

요소를 검색하기 전에 컬렉션을 매핑해야 하는 경우 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 함수가 있습니다.
다음 두 가지 작업을 결합합니다.
- 선택기 함수로 컬렉션을 매핑합니다.
- 결과에서 첫 번째 non-null 값을 반환합니다.

결과 컬렉션에 non-nullable 요소가 없으면 `firstNotNullOf()`는 `NoSuchElementException`을 발생시킵니다.
이 경우 null을 반환하려면 대응되는 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)을
사용하세요.

```kotlin
fun main() {

    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item `->` item.toString().takeIf { it.length >= 4 } }
    println(longEnough)

}
```

## 임의 요소

컬렉션의 임의 요소를 검색해야 하는 경우 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 함수를 호출합니다.
인수 없이 호출하거나 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
객체를 임의성의 소스로 사용하여 호출할 수 있습니다.

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())

}
```

빈 컬렉션에서 `random()`은 예외를 발생시킵니다. 대신 `null`을 받으려면 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)을 사용하세요.

## 요소 존재 여부 확인

컬렉션에 요소가 있는지 확인하려면 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 함수를 사용합니다.
함수 인수와 `equals()`인 컬렉션 요소가 있으면 `true`를 반환합니다.
`in` 키워드와 함께 연산자 형식으로 `contains()`를 호출할 수 있습니다.

한 번에 여러 인스턴스의 존재 여부를 함께 확인하려면 이러한 인스턴스의 컬렉션을 인수로 사용하여 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)을 호출합니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))

}
```

또한 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
또는 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)를 호출하여 컬렉션에 요소가 있는지 확인할 수 있습니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())

}
```