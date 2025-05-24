---
title: "집합 관련 특정 작업"
---
Kotlin 컬렉션 패키지에는 집합에 대한 일반적인 연산을 위한 확장 함수가 포함되어 있습니다. 교집합 찾기, 병합하기, 컬렉션끼리 빼기 등이 있습니다.

두 컬렉션을 하나로 병합하려면 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 함수를 사용하세요. 이 함수는 중위 표기법 `a union b` 형태로 사용할 수 있습니다. 정렬된 컬렉션의 경우 피연산자의 순서가 중요하다는 점에 유의하세요. 결과 컬렉션에서 첫 번째 피연산자의 요소는 두 번째 피연산자의 요소보다 앞에 옵니다.

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]

}
```

두 컬렉션 간의 교집합(둘 다에 있는 요소)을 찾으려면 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 함수를 사용하세요. 다른 컬렉션에 없는 컬렉션 요소를 찾으려면 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 함수를 사용하세요. 이러한 함수는 모두 중위 표기법으로 호출할 수도 있습니다. 예를 들어 `a intersect b`와 같습니다.

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")

    // same output
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]

}
```

두 컬렉션 중 하나에만 있고 교집합에는 없는 요소를 찾으려면 `union()` 함수를 사용할 수도 있습니다. 이 연산(대칭 차이라고 함)의 경우 두 컬렉션 간의 차이를 계산하고 결과를 병합합니다.

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]

}
```

`union()`, `intersect()`, `subtract()` 함수를 목록에 적용할 수도 있습니다.
그러나 결과는 _항상_ `Set`입니다. 이 결과에서 모든 중복 요소는 하나로 병합되고 인덱스 액세스는 사용할 수 없습니다.

```kotlin
fun main() {

    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result of intersecting two lists is a Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]

}
```