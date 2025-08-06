[//]: # (title: 집합 고유 연산)

Kotlin 컬렉션 패키지에는 집합에 대한 일반적인 연산(교집합 찾기, 병합 또는 컬렉션 간 차집합 구하기)을 위한 확장 함수가 포함되어 있습니다.

두 컬렉션을 하나로 병합하려면 `union()` 함수를 사용합니다. 이 함수는 중위(infix) 형태인 `a union b`로 사용할 수 있습니다.
정렬된 컬렉션의 경우 피연산자의 순서가 중요하다는 점에 유의하세요. 결과 컬렉션에서는 첫 번째 피연산자의 요소가 두 번째 피연산자의 요소보다 앞에 위치합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 순서에 따라 출력
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

두 컬렉션의 교집합(두 컬렉션 모두에 존재하는 요소)을 찾으려면 `intersect()` 함수를 사용합니다. 다른 컬렉션에 없는 컬렉션 요소를 찾으려면 `subtract()` 함수를 사용합니다. 이 두 함수도 중위(infix) 형태, 예를 들어 `a intersect b`로 호출할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 동일한 출력
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

두 컬렉션 중 하나에만 존재하지만, 둘의 교집합에는 없는 요소를 찾으려면 `union()` 함수를 사용할 수도 있습니다. 이 연산(대칭 차집합으로 알려져 있음)을 위해 두 컬렉션 간의 차이를 계산하고 결과를 병합합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // 차집합 병합 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`union()`, `intersect()`, `subtract()` 함수를 리스트에도 적용할 수 있습니다. 하지만 그 결과는 _항상_ `Set`입니다. 이 결과에서는 모든 중복 요소가 하나로 병합되며, 인덱스 접근은 불가능합니다.

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // 두 리스트의 교집합 결과는 Set입니다.
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // 동일한 요소는 하나로 병합됩니다.
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}