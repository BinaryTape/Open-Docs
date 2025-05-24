---
title: "컬렉션 변환 작업"
---
코틀린 표준 라이브러리는 컬렉션 _변환_을 위한 확장 함수 세트를 제공합니다.
이러한 함수는 제공된 변환 규칙에 따라 기존 컬렉션에서 새로운 컬렉션을 빌드합니다.
이 페이지에서는 사용 가능한 컬렉션 변환 함수에 대한 개요를 제공합니다.

## Map

_매핑_ 변환은 다른 컬렉션의 요소에 대한 함수의 결과로부터 컬렉션을 만듭니다.
기본 매핑 함수는 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)입니다.
이 함수는 주어진 람다 함수를 각 후속 요소에 적용하고 람다 결과 목록을 반환합니다.
결과 순서는 요소의 원래 순서와 같습니다.
요소 인덱스를 인수로 추가로 사용하는 변환을 적용하려면 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)를 사용하세요.

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

변환이 특정 요소에서 `null`을 생성하는 경우, `map()` 대신 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 함수를 호출하거나, `mapIndexed()` 대신 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)를 호출하여 결과 컬렉션에서 `null`을 필터링할 수 있습니다.

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value `->` if (idx == 0) null else value * idx })

}
```

맵을 변환할 때 값을 변경하지 않고 키를 변환하거나 그 반대로 변환하는 두 가지 옵션이 있습니다.
주어진 변환을 키에 적용하려면 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)를 사용하고,
[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html)는 값을 변환합니다.
두 함수 모두 맵 항목을 인수로 사용하는 변환을 사용하므로 키와 값을 모두 조작할 수 있습니다.

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })

}
```

## Zip

_지핑_ 변환은 두 컬렉션에서 동일한 위치에 있는 요소로 쌍을 빌드합니다.
코틀린 표준 라이브러리에서는 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 확장 함수로 이를 수행합니다.

컬렉션 또는 배열에서 다른 컬렉션(또는 배열)을 인수로 호출하면 `zip()`은 `Pair` 객체의 `List`를 반환합니다. 수신자 컬렉션의 요소는 이러한 쌍의 첫 번째 요소입니다.

컬렉션의 크기가 다른 경우 `zip()`의 결과는 더 작은 크기가 됩니다. 더 큰 컬렉션의 마지막 요소는 결과에 포함되지 않습니다.

`zip()`은 인픽스 형식 `a zip b`로도 호출할 수 있습니다.

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))

}
```

수신자 요소와 인수 요소의 두 가지 매개변수를 사용하는 변환 함수로 `zip()`을 호출할 수도 있습니다. 이 경우 결과 `List`에는 동일한 위치에 있는 수신자와 인수 요소의 쌍에 대해 호출된 변환 함수의 반환 값이 포함됩니다.

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal `->` "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})

}
```

`Pair`의 `List`가 있는 경우, 이러한 쌍에서 두 개의 목록을 빌드하는 역변환인 _언지핑_을 수행할 수 있습니다.

* 첫 번째 목록에는 원래 목록에 있는 각 `Pair`의 첫 번째 요소가 포함됩니다.
* 두 번째 목록에는 두 번째 요소가 포함됩니다.

쌍 목록을 언지핑하려면 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)을 호출합니다.

```kotlin

fun main() {

    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())

}
```

## Associate

_연관_ 변환을 통해 컬렉션 요소와 관련된 특정 값에서 맵을 빌드할 수 있습니다.
다양한 연관 유형에서 요소는 연관 맵의 키 또는 값이 될 수 있습니다.

기본 연관 함수인 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html)는
원본 컬렉션의 요소가 키이고 값이 주어진 변환 함수에 의해 생성되는 `Map`을 만듭니다. 두 요소가 같으면 마지막 요소만 맵에 남습니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

컬렉션 요소를 값으로 사용하여 맵을 빌드하기 위해 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html) 함수가 있습니다.
이 함수는 요소의 값을 기반으로 키를 반환하는 함수를 사용합니다. 두 요소의 키가 같으면 마지막 요소만 맵에 남습니다.

`associateBy()`는 값 변환 함수와 함께 호출할 수도 있습니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))

}
```

키와 값이 모두 컬렉션 요소에서 생성되는 맵을 빌드하는 또 다른 방법은 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html) 함수입니다.
이 함수는 `Pair`를 반환하는 람다 함수를 사용합니다. 해당 맵 항목의 키와 값입니다.

`associate()`는 수명이 짧은 `Pair` 객체를 생성하므로 성능에 영향을 줄 수 있습니다.
따라서 `associate()`는 성능이 중요하지 않거나 다른 옵션보다 더 바람직할 때 사용해야 합니다.

후자의 예는 키와 해당 값이 요소에서 함께 생성되는 경우입니다.

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name `->` parseFullName(name).let { it.lastName to it.firstName } })  

}
```

여기서는 먼저 요소에 대해 변환 함수를 호출한 다음 해당 함수의 결과 속성에서 쌍을 빌드합니다.

## Flatten

중첩된 컬렉션을 조작하는 경우 중첩된 컬렉션 요소에 대한 플랫 액세스를 제공하는 표준 라이브러리 함수가 유용할 수 있습니다.

첫 번째 함수는 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)입니다.
컬렉션 컬렉션, 예를 들어 `Set`의 `List`에서 호출할 수 있습니다.
이 함수는 중첩된 컬렉션의 모든 요소로 구성된 단일 `List`를 반환합니다.

```kotlin

fun main() {

    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())

}
```

또 다른 함수인 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html)은
중첩된 컬렉션을 처리하는 유연한 방법을 제공합니다. 이 함수는 컬렉션 요소를 다른 컬렉션에 매핑하는 함수를 사용합니다.
결과적으로 `flatMap()`은 모든 요소에 대한 반환 값의 단일 목록을 반환합니다.
따라서 `flatMap()`은 `map()`(매핑 결과로 컬렉션 사용)과 `flatten()`을 잇따라 호출하는 것처럼 동작합니다.

```kotlin

data class StringContainer(val values: List<String>)

fun main() {

    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })

}

```

## String representation

읽을 수 있는 형식으로 컬렉션 콘텐츠를 검색해야 하는 경우 컬렉션을 문자열로 변환하는 함수인 [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 및
[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)를 사용합니다.

`joinToString()`은 제공된 인수를 기반으로 컬렉션 요소에서 단일 `String`을 빌드합니다.
`joinTo()`는 동일한 작업을 수행하지만 결과를 지정된 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 객체에 추가합니다.

기본 인수로 호출하면 함수는 컬렉션에서 `toString()`을 호출하는 것과 유사한 결과를 반환합니다.
요소의 문자열 표현이 쉼표와 공백으로 구분된 `String`입니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)

}
```

사용자 정의 문자열 표현을 빌드하려면 함수 인수 `separator`, `prefix` 및
`postfix`에서 해당 매개변수를 지정할 수 있습니다. 결과 문자열은 `prefix`로 시작하고 `postfix`로 끝납니다. `separator`는
마지막 요소를 제외한 각 요소 뒤에 옵니다.

```kotlin

fun main() \{

    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))

\}
```

더 큰 컬렉션의 경우 결과에 포함될 요소 수인 `limit`를 지정할 수 있습니다.
컬렉션 크기가 `limit`를 초과하면 다른 모든 요소는 `truncated` 인수의 단일 값으로 대체됩니다.

```kotlin

fun main() {

    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))

}
```

마지막으로 요소 자체의 표현을 사용자 정의하려면 `transform` 함수를 제공합니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})

}
```