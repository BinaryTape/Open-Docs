---
title: "더하기 및 빼기 연산자"
---
Kotlin에서 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 및 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 연산자는 컬렉션에 대해 정의됩니다.
이 연산자들은 첫 번째 피연산자로 컬렉션을 취하며, 두 번째 피연산자는 요소 또는 또 다른 컬렉션이 될 수 있습니다.
반환 값은 새로운 읽기 전용 컬렉션입니다.

* `plus`의 결과에는 원본 컬렉션의 요소와 두 번째 피연산자의 요소가 _모두_ 포함됩니다.
* `minus`의 결과에는 두 번째 피연산자의 요소를 _제외한_ 원본 컬렉션의 요소가 포함됩니다.
   두 번째 피연산자가 요소인 경우 `minus`는 해당 요소의 _첫 번째_ 항목을 제거합니다. 컬렉션인 경우 해당 요소의 _모든_ 항목이 제거됩니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)

}
```

맵에 대한 `plus` 및 `minus` 연산자에 대한 자세한 내용은 [Map specific operations](map-operations)을 참조하세요.
[확대 할당 연산자](operator-overloading#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
(`+=`) 및 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)도
컬렉션에 대해 정의됩니다. 그러나 읽기 전용 컬렉션의 경우 실제로 `plus` 또는 `minus` 연산자를 사용하고
결과를 동일한 변수에 할당하려고 시도합니다. 따라서 `var` 읽기 전용 컬렉션에서만 사용할 수 있습니다.
변경 가능한 컬렉션의 경우 `val`인 경우 컬렉션을 수정합니다. 자세한 내용은 [Collection write operations](collection-write)를 참조하세요.