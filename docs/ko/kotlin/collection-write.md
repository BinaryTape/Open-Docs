---
title: "컬렉션 쓰기 작업"
---
[가변 컬렉션](collections-overview#collection-types)은 컬렉션 콘텐츠를 변경하는 연산(예: 요소 추가 또는 제거)을 지원합니다.
이 페이지에서는 `MutableCollection`의 모든 구현에서 사용할 수 있는 쓰기 연산에 대해 설명합니다.
`List` 및 `Map`에서 사용할 수 있는 보다 구체적인 연산은 각각 [List-specific Operations](list-operations) 및 [Map Specific Operations](map-operations)를 참조하세요.

## 요소 추가

단일 요소를 리스트나 세트에 추가하려면 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 함수를 사용하세요. 지정된 객체는 컬렉션의 끝에 추가됩니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)

}
```

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)은 인자 객체의 모든 요소를 리스트나 세트에 추가합니다. 인자는 `Iterable`, `Sequence` 또는 `Array`일 수 있습니다.
수신자와 인자의 유형이 다를 수 있습니다. 예를 들어 `Set`의 모든 항목을 `List`에 추가할 수 있습니다.

리스트에서 호출될 때 `addAll()`은 인자에 들어가는 순서와 동일한 순서로 새 요소를 추가합니다.
요소 위치를 첫 번째 인자로 지정하여 `addAll()`을 호출할 수도 있습니다.
인자 컬렉션의 첫 번째 요소가 이 위치에 삽입됩니다.
인자 컬렉션의 다른 요소들이 그 뒤를 따라 수신자 요소를 끝으로 이동시킵니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)

}
```

[`plus` 연산자](collection-plus-minus)의 제자리 버전인 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)(`+=`)을 사용하여 요소를 추가할 수도 있습니다.
가변 컬렉션에 적용하면 `+=`는 두 번째 피연산자(요소 또는 다른 컬렉션)를 컬렉션의 끝에 추가합니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)

}
```

## 요소 제거

가변 컬렉션에서 요소를 제거하려면 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용하세요.
`remove()`는 요소 값을 받아 이 값의 첫 번째 항목을 제거합니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 첫 번째 `3`을 제거합니다.
    println(numbers)
    numbers.remove(5)                    // 아무것도 제거하지 않습니다.
    println(numbers)

}
```

여러 요소를 한 번에 제거하기 위해 다음과 같은 함수가 있습니다.

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html)은 인자 컬렉션에 있는 모든 요소를 제거합니다.
   또는 술어를 인자로 사용하여 호출할 수 있습니다. 이 경우 함수는 술어가 `true`를 생성하는 모든 요소를 제거합니다.
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html)은 `removeAll()`의 반대입니다. 인자 컬렉션의 요소를 제외한 모든 요소를 제거합니다.
   술어와 함께 사용하면 술어와 일치하는 요소만 남깁니다.
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html)는 리스트에서 모든 요소를 제거하고 비워둡니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)

}
```

컬렉션에서 요소를 제거하는 또 다른 방법은 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)(`-=`) 연산자, 즉 [`minus`](collection-plus-minus)의 제자리 버전을 사용하는 것입니다.
두 번째 인자는 요소 유형의 단일 인스턴스 또는 다른 컬렉션일 수 있습니다.
오른쪽에 단일 요소가 있는 경우 `-=`는 해당 요소의 _첫 번째_ 항목을 제거합니다.
반대로 컬렉션인 경우 해당 요소의 _모든_ 항목이 제거됩니다.
예를 들어 리스트에 중복 요소가 포함되어 있으면 한 번에 제거됩니다.
두 번째 피연산자는 컬렉션에 없는 요소를 포함할 수 있습니다. 이러한 요소는 연산 실행에 영향을 미치지 않습니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 위와 동일합니다.
    println(numbers)    

}
```

## 요소 업데이트

리스트와 맵은 요소 업데이트를 위한 연산도 제공합니다.
이들은 [List-specific Operations](list-operations) 및 [Map Specific Operations](map-operations)에 설명되어 있습니다.
세트의 경우 업데이트는 실제로 요소를 제거하고 다른 요소를 추가하는 것이므로 의미가 없습니다.