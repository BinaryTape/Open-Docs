---
title: "맵별 작업"
---
[maps](collections-overview#map)에서 키와 값의 타입은 모두 사용자 정의입니다.
맵 항목에 대한 키 기반 접근을 통해 키로 값을 가져오는 것부터 시작하여 키와 값의 개별적인 필터링에 이르기까지 다양한 맵 관련 처리 기능을 사용할 수 있습니다.
이 페이지에서는 표준 라이브러리의 맵 처리 함수에 대한 설명을 제공합니다.

## 키와 값 검색

맵에서 값을 검색하려면 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 함수의 인수로 해당 키를 제공해야 합니다.
단축형 `[key]` 구문도 지원됩니다. 지정된 키를 찾을 수 없으면 `null`을 반환합니다.
약간 다른 동작을 하는 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html) 함수도 있습니다.
이 함수는 맵에서 키를 찾을 수 없는 경우 예외를 발생시킵니다.
또한 키가 없는 경우를 처리할 수 있는 두 가지 옵션이 더 있습니다.

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)는 리스트와 동일한 방식으로 작동합니다. 존재하지 않는 키에 대한 값은 지정된 람다 함수에서 반환됩니다.
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html)는 키를 찾을 수 없는 경우 지정된 기본값을 반환합니다.

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!

}
```

맵의 모든 키 또는 모든 값에 대한 작업을 수행하려면 해당 속성 `keys` 및 `values`에서 검색할 수 있습니다.
`keys`는 모든 맵 키의 집합이고 `values`는 모든 맵 값의 컬렉션입니다.

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)

}
```

## 필터링

다른 컬렉션과 마찬가지로 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 함수를 사용하여 맵을 [필터링](collection-filtering)할 수 있습니다.
맵에서 `filter()`를 호출할 때 `Pair`를 인수로 사용하는 술어를 전달합니다.
이렇게 하면 필터링 술어에서 키와 값을 모두 사용할 수 있습니다.

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) `->` key.endsWith("1") && value > 10}
    println(filteredMap)

}
```

맵을 필터링하는 두 가지 특정 방법도 있습니다. 키별 필터링과 값별 필터링입니다.
각 방법에 대한 함수가 있습니다. [`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 및 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html).
둘 다 지정된 술어와 일치하는 항목의 새 맵을 반환합니다.
`filterKeys()`에 대한 술어는 요소 키만 확인하고 `filterValues()`에 대한 술어는 값만 확인합니다.

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)

}
```

## 더하기 및 빼기 연산자

요소에 대한 키 접근으로 인해 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 및 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`) 연산자는 다른 컬렉션과 다르게 맵에 대해 작동합니다.
`plus`는 양쪽 피연산자의 요소를 포함하는 `Map`을 반환합니다. 왼쪽의 `Map`과 오른쪽의 `Pair` 또는 다른 `Map`입니다.
오른쪽 피연산자에 왼쪽 `Map`에 있는 키가 있는 항목이 포함된 경우 결과 맵에는 오른쪽의 항목이 포함됩니다.

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))

}
```

`minus`는 오른쪽 피연산자의 키가 있는 항목을 제외하고 왼쪽의 `Map` 항목에서 `Map`을 만듭니다.
따라서 오른쪽 피연산자는 단일 키 또는 키 컬렉션(리스트, 세트 등)일 수 있습니다.

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))

}
```

mutable 맵에서 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 및 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`) 연산자를 사용하는 방법에 대한 자세한 내용은 아래의 [맵 쓰기 작업](#map-write-operations)을 참조하세요.

## 맵 쓰기 작업

[Mutable](collections-overview#collection-types) 맵은 맵 관련 쓰기 작업을 제공합니다.
이러한 작업을 통해 값에 대한 키 기반 접근을 사용하여 맵 콘텐츠를 변경할 수 있습니다.

맵에 대한 쓰기 작업을 정의하는 특정 규칙이 있습니다.

* 값을 업데이트할 수 있습니다. 결과적으로 키는 변경되지 않습니다. 항목을 추가하면 해당 키는 일정합니다.
* 각 키에 대해 항상 단일 값이 연결되어 있습니다. 전체 항목을 추가하고 제거할 수 있습니다.

아래는 mutable 맵에서 사용할 수 있는 쓰기 작업에 대한 표준 라이브러리 함수에 대한 설명입니다.

### 항목 추가 및 업데이트

mutable 맵에 새 키-값 쌍을 추가하려면 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)을 사용하세요.
새 항목이 `LinkedHashMap`(기본 맵 구현)에 추가되면 맵을 반복할 때 마지막에 오도록 추가됩니다. 정렬된 맵에서 새 요소의 위치는 해당 키의 순서에 따라 정의됩니다.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)

}
```

여러 항목을 한 번에 추가하려면 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)을 사용하세요.
해당 인수는 `Map` 또는 `Pair` 그룹(`Iterable`, `Sequence` 또는 `Array`)일 수 있습니다.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)

}
```

`put()`과 `putAll()`은 지정된 키가 맵에 이미 있는 경우 값을 덮어씁니다. 따라서 맵 항목의 값을 업데이트하는 데 사용할 수 있습니다.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)

}
```

단축 연산자 형식을 사용하여 맵에 새 항목을 추가할 수도 있습니다. 두 가지 방법이 있습니다.

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 연산자.
* `set()`에 대한 `[]` 연산자 별칭.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)

}
```

맵에 있는 키로 호출하면 연산자는 해당 항목의 값을 덮어씁니다.

### 항목 제거

mutable 맵에서 항목을 제거하려면 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 함수를 사용하세요.
`remove()`를 호출할 때 키 또는 전체 키-값-쌍을 전달할 수 있습니다.
키와 값을 모두 지정하면 해당 값이 두 번째 인수와 일치하는 경우에만 이 키가 있는 요소가 제거됩니다.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)

}
```

키 또는 값을 기준으로 mutable 맵에서 항목을 제거할 수도 있습니다.
이렇게 하려면 항목의 키 또는 값을 제공하여 맵의 키 또는 값에서 `remove()`를 호출합니다.
값에서 호출하면 `remove()`는 지정된 값이 있는 첫 번째 항목만 제거합니다.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)

}
```

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 연산자는
mutable 맵에도 사용할 수 있습니다.

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)

}
```