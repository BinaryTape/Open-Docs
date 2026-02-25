[//]: # (title: 컬렉션 쓰기 작업)

[가변 컬렉션(Mutable collection)](collections-overview.md#collection-types)은 요소의 추가 또는 삭제와 같이 컬렉션의 내용을 변경하는 작업을 지원합니다.
이 페이지에서는 모든 `MutableCollection` 구현체에서 사용할 수 있는 쓰기 작업을 설명합니다.
`List` 및 `Map`에서만 사용할 수 있는 특정 작업에 대해서는 각각 [리스트 관련 작업](list-operations.md) 및 [맵 관련 작업](map-operations.md)을 참조하세요.

## 요소 추가

리스트나 셋(Set)에 단일 요소를 추가하려면 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 함수를 사용합니다. 지정된 객체는 컬렉션의 끝에 추가됩니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)은 인자로 받은 객체의 모든 요소를 리스트나 셋에 추가합니다. 인자는 `Iterable`, `Sequence`, 또는 `Array`가 될 수 있습니다.
수신 객체(Receiver)와 인자의 타입은 서로 다를 수 있습니다. 예를 들어, `Set`에 있는 모든 항목을 `List`에 추가할 수 있습니다.

리스트에서 호출할 경우, `addAll()`은 인자로 받은 객체에 포함된 순서대로 새 요소를 추가합니다.
또한, 첫 번째 인자로 요소의 위치(인덱스)를 지정하여 `addAll()`을 호출할 수도 있습니다.
이 경우 인자로 받은 컬렉션의 첫 번째 요소가 해당 위치에 삽입됩니다.
인자로 받은 컬렉션의 나머지 요소들이 그 뒤를 따르며, 수신 객체의 기존 요소들은 끝으로 밀려납니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`plus` 연산자](collection-plus-minus.md)의 인플레이스(in-place) 버전인 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)을 사용하여 요소를 추가할 수도 있습니다.
가변 컬렉션에 `+=`를 적용하면, 두 번째 피연산자(단일 요소 또는 다른 컬렉션)를 컬렉션 끝에 추가합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 요소 삭제

가변 컬렉션에서 요소를 삭제하려면 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용합니다.
`remove()`는 요소의 값을 인자로 받아 해당 값과 일치하는 요소 하나를 삭제합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 첫 번째 '3'을 삭제합니다.
    println(numbers)
    numbers.remove(5)                    // 아무것도 삭제하지 않습니다.
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여러 요소를 한 번에 삭제하기 위해 다음과 같은 함수들이 제공됩니다.

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html): 인자로 전달된 컬렉션에 포함된 모든 요소를 삭제합니다. 또는 조건식(Predicate)을 인자로 호출할 수 있으며, 이 경우 조건식이 `true`를 반환하는 모든 요소를 삭제합니다.
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html): `removeAll()`과 반대로 동작합니다. 인자로 전달된 컬렉션에 포함된 요소를 제외한 모든 요소를 삭제합니다. 조건식과 함께 사용하면 조건에 일치하는 요소만 남깁니다.
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html): 리스트에서 모든 요소를 삭제하여 빈 상태로 만듭니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

컬렉션에서 요소를 삭제하는 또 다른 방법은 [`minus`](collection-plus-minus.md)의 인플레이스 버전인 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 연산자를 사용하는 것입니다.
두 번째 인자는 요소 타입의 단일 인스턴스이거나 다른 컬렉션일 수 있습니다.
우변에 단일 요소가 있는 경우, `-=`는 해당 요소의 *첫 번째* 발생 사례를 삭제합니다.
우변이 컬렉션인 경우, 해당 컬렉션에 포함된 요소들의 *모든* 발생 사례가 삭제됩니다.
예를 들어, 리스트에 중복된 요소가 포함되어 있다면 한 번에 모두 삭제됩니다.
두 번째 피연산자에는 컬렉션에 존재하지 않는 요소가 포함될 수 있으며, 이러한 요소는 작업 실행에 영향을 주지 않습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 위와 동일하게 동작합니다.
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 요소 수정

리스트와 맵은 요소를 수정하기 위한 작업도 제공합니다.
이 작업들은 [리스트 관련 작업](list-operations.md) 및 [맵 관련 작업](map-operations.md)에 설명되어 있습니다.
셋(Set)의 경우, 수정이라는 것은 실제로는 요소를 삭제하고 다른 요소를 추가하는 것이기 때문에 수정 작업이 의미가 없습니다.