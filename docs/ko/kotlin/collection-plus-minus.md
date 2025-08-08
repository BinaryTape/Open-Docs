[//]: # (title: 플러스 및 마이너스 연산자)

Kotlin에서 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 및 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 연산자는 컬렉션에 대해 정의됩니다.
이 연산자들은 첫 번째 피연산자로 컬렉션을 받으며, 두 번째 피연산자는 요소 또는 다른 컬렉션이 될 수 있습니다.
반환 값은 새로운 읽기 전용 컬렉션입니다:

*   `plus` 연산의 결과는 원본 컬렉션의 요소와 두 번째 피연산자의 요소를 모두 포함합니다.
*   `minus` 연산의 결과는 두 번째 피연산자의 요소를 _제외한_ 원본 컬렉션의 요소를 포함합니다.
    두 번째 피연산자가 요소인 경우, `minus`는 해당 요소의 _첫 번째_ 발생을 제거합니다. 컬렉션인 경우, 해당 컬렉션 요소의 _모든_ 발생이 제거됩니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

맵(map)의 `plus` 및 `minus` 연산자에 대한 자세한 내용은 [맵별 연산](map-operations.md)을 참조하세요.
컬렉션에는 [복합 할당 연산자](operator-overloading.md#augmented-assignments)인 `plusAssign` (`+=`) 및 `minusAssign` (`-=`)도 정의되어 있습니다. 하지만 읽기 전용 컬렉션의 경우, 이 연산자들은 실제로는 `plus` 또는 `minus` 연산자를 사용하며 결과를 동일한 변수에 할당하려고 시도합니다. 따라서 `var`로 선언된 읽기 전용 컬렉션에서만 사용할 수 있습니다.
변경 가능한 컬렉션의 경우, `val`로 선언된 컬렉션이라도 컬렉션을 수정합니다. 더 자세한 내용은 [컬렉션 쓰기 연산](collection-write.md)을 참조하세요.