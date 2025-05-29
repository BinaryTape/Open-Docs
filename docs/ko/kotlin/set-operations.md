[//]: # (title: 세트 관련 연산)

코틀린 컬렉션 패키지에는 세트에 대한 인기 있는 연산을 위한 확장 함수가 포함되어 있습니다. 여기에는 교집합 찾기, 병합, 한 컬렉션에서 다른 컬렉션을 빼는 연산 등이 있습니다.

두 컬렉션을 하나로 병합하려면 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 함수를 사용하세요. 이 함수는 `a union b`와 같은 중위(infix) 형식으로 사용할 수 있습니다.
정렬된 컬렉션의 경우 피연산자의 순서가 중요하다는 점에 유의하세요. 결과 컬렉션에서는 첫 번째 피연산자의 요소가 두 번째 피연산자의 요소보다 먼저 나옵니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

두 컬렉션의 교집합(두 컬렉션 모두에 존재하는 요소)을 찾으려면 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 함수를 사용하세요.
한 컬렉션에는 있지만 다른 컬렉션에는 없는 컬렉션 요소를 찾으려면 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 함수를 사용하세요.
이 두 함수 모두 `a intersect b`와 같이 중위(infix) 형식으로 호출할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // same output
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

두 컬렉션 중 하나에 있지만 교집합에는 없는 요소를 찾으려면 `union()` 함수를 사용할 수도 있습니다.
이 연산(대칭 차집합(symmetric difference)이라고도 함)을 위해서는 두 컬렉션 간의 차이점을 계산한 다음 결과를 병합하세요.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`union()`, `intersect()`, `subtract()` 함수를 리스트에도 적용할 수 있습니다.
그러나 결과는 _항상_ `Set`입니다. 이 결과에서는 모든 중복 요소가 하나로 병합되며 인덱스 접근이 불가능합니다.

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result of intersecting two lists is a Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}