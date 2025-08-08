[//]: # (title: 맵별 연산)

[맵(map)](collections-overview.md#map)에서 키와 값의 타입은 모두 사용자 정의입니다.
맵 엔트리에 대한 키 기반 접근은 키로 값을 가져오는 것부터 키와 값을 개별적으로 필터링하는 것까지 맵별로 다양한 처리 기능을 가능하게 합니다.
이 페이지에서는 표준 라이브러리의 맵 처리 함수에 대한 설명을 제공합니다.

## 키 및 값 검색

맵에서 값을 검색하려면 해당 키를 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 함수의 인수로 제공해야 합니다.
단축형 `[key]` 구문도 지원됩니다. 지정된 키를 찾을 수 없으면 `null`을 반환합니다.
약간 다른 동작을 하는 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html) 함수도 있습니다. 이 함수는 맵에서 키를 찾을 수 없는 경우 예외를 발생시킵니다.
또한 키 부재를 처리하는 두 가지 추가 옵션이 있습니다.

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)는 리스트와 동일하게 작동합니다. 존재하지 않는 키에 대한 값은 주어진 람다 함수에서 반환됩니다.
*   [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html)는 키를 찾을 수 없는 경우 지정된 기본값을 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

맵의 모든 키 또는 모든 값에 대해 연산을 수행하려면 `keys` 및 `values` 속성에서 해당 항목을 검색할 수 있습니다.
`keys`는 모든 맵 키의 집합이며 `values`는 모든 맵 값의 컬렉션입니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 필터링

다른 컬렉션과 마찬가지로 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 함수를 사용하여 맵을 [필터링](collection-filtering.md)할 수 있습니다.
맵에서 `filter()`를 호출할 때 인수로 `Pair`를 가진 조건자를 전달하세요.
이를 통해 필터링 조건자에서 키와 값을 모두 사용할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

맵을 필터링하는 두 가지 특정 방법도 있습니다. 키별 필터링과 값별 필터링입니다.
각 방법에는 [`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 및 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html) 함수가 있습니다.
둘 다 주어진 조건자와 일치하는 엔트리의 새 맵을 반환합니다.
`filterKeys()`의 조건자는 요소 키만 확인하고, `filterValues()`의 조건자는 값만 확인합니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 플러스 및 마이너스 연산자

요소에 대한 키 접근 때문에 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 및 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 연산자는 다른 컬렉션과 다르게 맵에서 작동합니다.
`plus`는 두 피연산자의 요소를 포함하는 `Map`을 반환합니다. 왼쪽에는 `Map`이, 오른쪽에는 `Pair` 또는 다른 `Map`이 옵니다.
우측 피연산자에 좌측 `Map`에 존재하는 키를 가진 엔트리가 포함된 경우, 결과 맵에는 우측 엔트리가 포함됩니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`minus`는 좌측 `Map`의 엔트리 중에서 우측 피연산자의 키를 가진 엔트리를 제외한 `Map`을 생성합니다.
따라서 우측 피연산자는 단일 키이거나 키 컬렉션(리스트, 집합 등)일 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

가변 맵에서 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 및 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 연산자를 사용하는 방법에 대한 자세한 내용은 아래의 [맵 쓰기 연산](#map-write-operations)을 참조하세요.

## 맵 쓰기 연산

[가변(Mutable)](collections-overview.md#collection-types) 맵은 맵별 쓰기 연산을 제공합니다.
이 연산을 통해 값에 대한 키 기반 접근을 사용하여 맵 내용을 변경할 수 있습니다.

맵에 대한 쓰기 연산을 정의하는 특정 규칙이 있습니다.

*   값은 업데이트될 수 있습니다. 반면 키는 절대 변경되지 않습니다. 엔트리를 추가하면 해당 키는 상수입니다.
*   각 키에는 항상 단일 값이 연결되어 있습니다. 전체 엔트리를 추가하거나 제거할 수 있습니다.

아래는 가변 맵에서 사용할 수 있는 표준 라이브러리 쓰기 연산 함수에 대한 설명입니다.

### 엔트리 추가 및 업데이트

가변 맵에 새 키-값 쌍을 추가하려면 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)을 사용하세요.
새 엔트리가 `LinkedHashMap`(기본 맵 구현)에 삽입될 때, 맵을 이터레이션할 때 마지막에 오도록 추가됩니다. 정렬된 맵에서는 새 요소의 위치가 키의 순서에 따라 정의됩니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

한 번에 여러 엔트리를 추가하려면 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)을 사용하세요.
이 함수의 인수는 `Map` 또는 `Pair` 그룹(`Iterable`, `Sequence`, `Array`)이 될 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`put()`과 `putAll()` 모두 주어진 키가 맵에 이미 존재하는 경우 값을 덮어씁니다. 따라서 이들을 사용하여 맵 엔트리의 값을 업데이트할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

단축형 연산자 형식을 사용하여 맵에 새 엔트리를 추가할 수도 있습니다. 두 가지 방법이 있습니다.

*   [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 연산자.
*   `set()`의 `[]` 연산자 별칭.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // numbersMap.put("three", 3) 호출
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

맵에 있는 키로 호출될 때 연산자는 해당 엔트리의 값을 덮어씁니다.

### 엔트리 제거

가변 맵에서 엔트리를 제거하려면 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 함수를 사용하세요.
`remove()`를 호출할 때 키 또는 전체 키-값 쌍을 전달할 수 있습니다.
키와 값을 모두 지정하면, 해당 키를 가진 요소는 해당 값이 두 번째 인자와 일치하는 경우에만 제거됩니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //아무것도 제거하지 않음
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

맵에서 키 또는 값을 기준으로 엔트리를 제거할 수도 있습니다.
이렇게 하려면 맵의 키 또는 값에 `remove()`를 호출하여 엔트리의 키 또는 값을 제공합니다.
값에 대해 호출될 때, `remove()`는 주어진 값을 가진 첫 번째 엔트리만 제거합니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 연산자도 가변 맵에서 사용할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //아무것도 제거하지 않음
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}