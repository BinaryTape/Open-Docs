[//]: # (title: 그룹화)

Kotlin 표준 라이브러리는 컬렉션 요소를 그룹화하기 위한 확장 함수를 제공합니다.
기본 함수인 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)는 람다 함수를 인자로 받아 `Map`을 반환합니다. 이 맵에서 각 키는 람다 함수의 결과이며, 해당 값은 이 결과가 반환된 요소들의 `List`입니다. 이 함수는 예를 들어, `String` 목록을 첫 글자를 기준으로 그룹화하는 데 사용될 수 있습니다.

또한 `groupBy()`를 두 번째 람다 인자인 값 변환 함수(value transformation function)와 함께 호출할 수도 있습니다.
두 개의 람다를 사용하는 `groupBy()`의 결과 맵에서는 `keySelector` 함수로 생성된 키가 원래 요소 대신 값 변환 함수의 결과에 매핑됩니다.

다음 예제는 `groupBy()` 함수를 사용하여 문자열을 첫 글자로 그룹화하고, 결과 `Map`의 그룹을 `for` 연산자로 순회하며, `valueTransform` 함수를 사용하여 값을 대문자로 변환하는 방법을 보여줍니다:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupBy()
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // {O=[one], T=[two, three], F=[four, five]}

    // Iterates through each group and prints the key and its associated values
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // Groups the strings by their first letter and transforms the values to uppercase
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

요소를 그룹화한 다음 모든 그룹에 한 번에 연산을 적용하려면 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) 함수를 사용하세요.
이 함수는 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 타입의 인스턴스를 반환합니다.
`Grouping` 인스턴스를 사용하면 모든 그룹에 지연 방식으로(lazy manner) 연산을 적용할 수 있습니다. 즉, 그룹은 연산 실행 직전에 실제로 구성됩니다.

구체적으로, `Grouping`은 다음 연산을 지원합니다:

*   [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html)는 각 그룹의 요소를 계산합니다.
*   [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 및 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)는 각 그룹에 대해 별도의 컬렉션으로 [폴드(fold) 및 리듀스(reduce)](collection-aggregate.md#fold-and-reduce) 연산을 수행하고 결과를 반환합니다.
*   [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html)는 각 그룹의 모든 요소에 주어진 연산을 순차적으로 적용하고 결과를 반환합니다.
    이는 `Grouping`에 대한 모든 연산을 수행하는 일반적인 방법입니다. fold 또는 reduce로 충분하지 않을 때 사용자 지정 연산을 구현하는 데 사용하세요.

`groupingBy()` 함수로 생성된 그룹을 순회하려면 결과 `Map`에 `for` 연산자를 사용할 수 있습니다.
이를 통해 각 키와 해당 키와 연결된 요소의 개수에 접근할 수 있습니다.

다음 예제는 `groupingBy()` 함수를 사용하여 문자열을 첫 글자로 그룹화하고, 각 그룹의 요소를 계산한 다음, 각 그룹을 순회하며 키와 요소 개수를 출력하는 방법을 보여줍니다:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupingBy() and counts the elements in each group
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // Iterates through each group and prints the key and its associated values
    for ((key, count) in grouped) {
        println("Key: $key, Count: $count")
        // Key: o, Count: 1
        // Key: t, Count: 2
        // Key: f, Count: 2
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}