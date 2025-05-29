[//]: # (title: 컬렉션 연산 개요)

Kotlin 표준 라이브러리는 컬렉션에 대한 다양한 연산을 수행하기 위한 광범위한 함수들을 제공합니다. 여기에는 요소를 가져오거나 추가하는 것과 같은 간단한 연산뿐만 아니라 검색, 정렬, 필터링, 변환 등과 같은 더 복잡한 연산도 포함됩니다.

## 확장 함수 및 멤버 함수

컬렉션 연산은 표준 라이브러리에 두 가지 방식으로 선언되어 있습니다: 컬렉션 인터페이스의 [멤버 함수](classes.md#class-members)와 [확장 함수](extensions.md#extension-functions).

멤버 함수는 컬렉션 타입에 필수적인 연산을 정의합니다. 예를 들어, [`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)에는 비어 있는지 확인하기 위한 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) 함수가 포함되어 있고, [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)에는 요소에 인덱스로 접근하기 위한 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 등이 포함되어 있습니다.

컬렉션 인터페이스의 자체 구현을 생성할 때는 해당 멤버 함수를 구현해야 합니다. 새로운 구현 생성을 더 쉽게 하려면 표준 라이브러리의 컬렉션 인터페이스에 대한 골격 구현(skeletal implementations)인 [`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html), [`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html), [`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html), [`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html) 및 이들의 가변(mutable) 버전을 사용하세요.

다른 컬렉션 연산은 확장 함수로 선언됩니다. 여기에는 필터링, 변환, 정렬 및 기타 컬렉션 처리 함수가 포함됩니다.

## 공통 연산

공통 연산은 [읽기 전용 컬렉션과 가변 컬렉션](collections-overview.md#collection-types) 모두에서 사용할 수 있습니다. 공통 연산은 다음 그룹으로 분류됩니다.

*   [변환](collection-transformations.md)
*   [필터링](collection-filtering.md)
*   [`plus` 및 `minus` 연산자](collection-plus-minus.md)
*   [그룹화](collection-grouping.md)
*   [컬렉션 부분 검색](collection-parts.md)
*   [단일 요소 검색](collection-elements.md)
*   [정렬](collection-ordering.md)
*   [집계 연산](collection-aggregate.md)

이 페이지에 설명된 연산은 원본 컬렉션에 영향을 주지 않고 결과를 반환합니다. 예를 들어, 필터링 연산은 필터링 조건자(predicate)와 일치하는 모든 요소를 포함하는 _새로운 컬렉션_을 생성합니다. 이러한 연산의 결과는 변수에 저장하거나 다른 함수에 전달하는 등 다른 방식으로 사용해야 합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // `numbers`에는 아무 일도 일어나지 않으며, 결과는 사라짐
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // 결과가 `longerThan3`에 저장됨
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

특정 컬렉션 연산의 경우 _대상(destination)_ 객체를 지정하는 옵션이 있습니다. 대상은 함수가 새로운 객체로 항목을 반환하는 대신 결과 항목을 추가하는 가변 컬렉션입니다. 대상을 사용하는 연산을 수행하려면, 이름에 `To` 접미사가 붙은 별도의 함수(예: [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 대신 [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 또는 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html) 대신 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html))가 있습니다. 이 함수들은 대상 컬렉션을 추가 매개변수로 받습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //대상 객체
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // 두 연산의 결과를 포함
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

편의를 위해 이 함수들은 대상 컬렉션을 다시 반환하므로 함수 호출의 해당 인자(argument)에 바로 생성할 수 있습니다.

```kotlin
fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // 숫자를 새 해시 세트로 바로 필터링하여
    // 결과에서 중복을 제거함
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

대상(destination)이 있는 함수는 필터링, 연관(association), 그룹화, 평탄화(flattening) 및 기타 연산에서 사용할 수 있습니다. 대상 연산의 전체 목록은 [Kotlin 컬렉션 레퍼런스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)를 참조하세요.

## 쓰기 연산

가변 컬렉션의 경우 컬렉션 상태를 변경하는 _쓰기 연산_도 있습니다. 이러한 연산에는 요소 추가, 제거 및 업데이트가 포함됩니다. 쓰기 연산은 [쓰기 연산](collection-write.md) 및 [List 관련 연산](list-operations.md#list-write-operations), [Map 관련 연산](map-operations.md#map-write-operations)의 해당 섹션에 나열되어 있습니다.

특정 연산의 경우 동일한 연산을 수행하는 함수 쌍이 있습니다. 하나는 연산을 제자리에서(in-place) 적용하고 다른 하나는 결과를 별도의 컬렉션으로 반환합니다. 예를 들어, [`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)는 가변 컬렉션을 제자리에서 정렬하여 상태를 변경하고, [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)는 정렬된 순서로 동일한 요소를 포함하는 새 컬렉션을 생성합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}