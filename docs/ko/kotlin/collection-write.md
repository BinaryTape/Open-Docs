[//]: # (title: 컬렉션 쓰기 연산)

[가변 컬렉션](collections-overview.md#collection-types)은 컬렉션 내용을 변경하는 연산(예: 요소 추가 또는 제거)을 지원합니다.
이 페이지에서는 `MutableCollection`의 모든 구현에서 사용 가능한 쓰기 연산에 대해 설명합니다.
`List` 및 `Map`에 사용할 수 있는 더 구체적인 연산에 대해서는 각각 [List 특정 연산](list-operations.md) 및 [Map 특정 연산](map-operations.md)을 참조하세요.

## 요소 추가

리스트나 세트에 단일 요소를 추가하려면 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 함수를 사용합니다. 지정된 객체는 컬렉션의 끝에 추가됩니다.

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

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)는 인자 객체의 모든 요소를 리스트나 세트에 추가합니다. 인자는 `Iterable`, `Sequence` 또는 `Array`가 될 수 있습니다.
수신자와 인자의 타입이 다를 수 있습니다. 예를 들어, `Set`의 모든 항목을 `List`에 추가할 수 있습니다.

리스트에서 호출될 때 `addAll()`는 인자에 있는 순서와 동일한 순서로 새 요소를 추가합니다.
`addAll()`를 호출할 때 첫 번째 인자로 요소 위치를 지정할 수도 있습니다.
인자 컬렉션의 첫 번째 요소가 이 위치에 삽입됩니다.
인자 컬렉션의 다른 요소들이 그 뒤를 따르며, 수신자 요소를 끝으로 이동시킵니다.

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

[`plus` 연산자](collection-plus-minus.md)의 제자리(in-place) 버전인 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)를 사용하여 요소를 추가할 수도 있습니다.
가변 컬렉션에 적용될 때 `+=`는 두 번째 피연산자(요소 또는 다른 컬렉션)를 컬렉션의 끝에 추가합니다.

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

## 요소 제거

가변 컬렉션에서 요소를 제거하려면 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용합니다.
`remove()`는 요소 값을 받아서 해당 값의 첫 번째 발생을 제거합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여러 요소를 한 번에 제거하려면 다음 함수들을 사용할 수 있습니다.

*   [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html)는 인자 컬렉션에 존재하는 모든 요소를 제거합니다.
    또는 프레디케이트(predicate)를 인자로 사용하여 호출할 수도 있습니다. 이 경우 함수는 프레디케이트가 `true`를 반환하는 모든 요소를 제거합니다.
*   [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html)는 `removeAll()`의 반대입니다. 즉, 인자 컬렉션에 있는 요소를 제외한 모든 요소를 제거합니다.
    프레디케이트와 함께 사용될 때, 일치하는 요소만 남깁니다.
*   [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html)는 리스트에서 모든 요소를 제거하고 비어있는 상태로 만듭니다.

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

컬렉션에서 요소를 제거하는 또 다른 방법은 [`minus`](collection-plus-minus.md)의 제자리(in-place) 버전인 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 연산자를 사용하는 것입니다.
두 번째 인자는 요소 타입의 단일 인스턴스이거나 다른 컬렉션이 될 수 있습니다.
우측에 단일 요소가 있을 때, `-=`는 해당 요소의 _첫 번째_ 발생을 제거합니다.
반대로, 컬렉션인 경우 해당 요소들의 _모든_ 발생이 제거됩니다.
예를 들어, 리스트에 중복 요소가 포함된 경우 한 번에 제거됩니다.
두 번째 피연산자에는 컬렉션에 존재하지 않는 요소가 포함될 수 있습니다. 이러한 요소는 연산 실행에 영향을 미치지 않습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 요소 업데이트

리스트와 맵은 요소를 업데이트하는 연산도 제공합니다.
이 내용은 [List 특정 연산](list-operations.md) 및 [Map 특정 연산](map-operations.md)에 설명되어 있습니다.
세트의 경우, 실제로는 요소를 제거하고 다른 요소를 추가하는 것이기 때문에 업데이트가 의미가 없습니다.