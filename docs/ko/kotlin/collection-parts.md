[//]: # (title: 컬렉션 부분 추출)

Kotlin 표준 라이브러리에는 컬렉션의 특정 부분을 가져오는 확장 함수가 포함되어 있습니다.
이 함수들은 결과 컬렉션에 포함될 요소를 선택하는 다양한 방법을 제공합니다. 예를 들어, 요소의 위치를 명시적으로 나열하거나 결과 크기를 지정하는 등의 방식입니다.

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html)는 주어진 인덱스에 해당하는 컬렉션 요소의 목록을 반환합니다. 인덱스는 [범위](ranges.md)로 전달되거나 정수 값 컬렉션으로 전달될 수 있습니다.

```kotlin

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Take 및 drop

첫 번째 요소부터 지정된 수의 요소를 가져오려면 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 함수를 사용합니다.
마지막 요소를 가져오려면 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)를 사용합니다.
컬렉션 크기보다 큰 숫자로 호출되면 두 함수 모두 전체 컬렉션을 반환합니다.

주어진 수의 첫 번째 또는 마지막 요소를 제외한 모든 요소를 가져오려면 각각 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html) 및 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 함수를 호출합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

요소를 가져오거나 제거할 개수를 정의하기 위해 프레디케이트(predicate)를 사용할 수도 있습니다.
위에서 설명한 함수와 유사한 네 가지 함수가 있습니다:

*   [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html)은 프레디케이트를 사용하는 `take()` 함수입니다. 프레디케이트와 일치하지 않는 첫 번째 요소를 *제외하고* 그 앞까지의 요소를 가져옵니다. 컬렉션의 첫 번째 요소가 프레디케이트와 일치하지 않으면 결과는 비어 있게 됩니다.
*   [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html)은 `takeLast()`와 유사합니다. 컬렉션의 끝에서부터 프레디케이트와 일치하는 요소의 범위를 가져옵니다. 해당 범위의 첫 번째 요소는 프레디케이트와 일치하지 않는 마지막 요소 *다음*의 요소입니다. 만약 컬렉션의 마지막 요소가 프레디케이트와 일치하지 않으면 결과는 비어 있게 됩니다.
*   [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html)은 동일한 프레디케이트를 사용하는 `takeWhile()`의 반대입니다. 프레디케이트와 일치하지 않는 첫 번째 요소부터 끝까지의 요소를 반환합니다.
*   [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html)은 동일한 프레디케이트를 사용하는 `takeLastWhile()`의 반대입니다. 시작부터 프레디케이트와 일치하지 않는 마지막 요소까지의 요소를 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Chunked

주어진 크기의 부분으로 컬렉션을 나누려면 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 함수를 사용합니다.
`chunked()`는 단일 인자(청크의 크기)를 받아 주어진 크기의 `List<List>`를 반환합니다.
첫 번째 청크는 첫 번째 요소부터 시작하여 `size`개의 요소를 포함하고, 두 번째 청크는 다음 `size`개의 요소를 포함하는 식으로 진행됩니다. 마지막 청크는 크기가 더 작을 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

반환되는 청크에 즉시 변환을 적용할 수도 있습니다.
이렇게 하려면 `chunked()`를 호출할 때 변환을 람다 함수로 제공합니다.
람다 인수는 컬렉션의 청크입니다. `chunked()`가 변환과 함께 호출될 때, 청크는 해당 람다 내에서 바로 사용되어야 하는 수명이 짧은 `List`입니다.

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed

주어진 크기의 컬렉션 요소에 대한 모든 가능한 범위를 가져올 수 있습니다.
이를 가져오는 함수는 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)라고 불립니다. 이 함수는 주어진 크기의 슬라이딩 윈도우를 통해 컬렉션을 볼 때 나타나는 요소 범위(즉, 윈도우)의 목록을 반환합니다.
`chunked()`와 달리, `windowed()`는 *각* 컬렉션 요소부터 시작하는 요소 범위(즉, 윈도우)를 반환합니다.
모든 윈도우는 단일 `List`의 요소로 반환됩니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()`는 기본값을 가진 매개변수와 관련하여 더 많은 유연성을 제공합니다:

*   `step`은 두 인접한 윈도우의 첫 번째 요소 사이의 거리를 정의합니다. 기본값은 1이므로 결과는 모든 요소부터 시작하는 윈도우를 포함합니다. `step`을 2로 늘리면 홀수 번째 요소(첫 번째, 세 번째 등)부터 시작하는 윈도우만 받게 됩니다.
*   `partialWindows`는 컬렉션 끝의 요소부터 시작하는 더 작은 크기의 윈도우를 포함합니다. 예를 들어, 세 개의 요소로 구성된 윈도우를 요청할 경우, 마지막 두 요소에 대해서는 윈도우를 만들 수 없습니다. 이 경우 `partialWindows`를 활성화하면 크기가 2와 1인 두 개의 목록이 추가로 포함됩니다.

마지막으로, 반환된 범위에 즉시 변환을 적용할 수 있습니다.
이렇게 하려면 `windowed()`를 호출할 때 변환을 람다 함수로 제공합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

두 개의 요소로 구성된 윈도우를 생성하려면 별도의 함수인 [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)가 있습니다.
이 함수는 리시버 컬렉션의 인접한 요소들의 쌍을 생성합니다.
`zipWithNext()`는 컬렉션을 쌍으로 나누지 않는다는 점에 유의하십시오. 이 함수는 마지막 요소를 제외한 *각* 요소에 대해 `Pair`를 생성하므로, `[1, 2, 3, 4]`에 대한 결과는 `[[1, 2], [2, 3], [3, 4]]`이지 `[[1, 2], [3, 4]]`가 아닙니다.
`zipWithNext()`는 변환 함수와 함께 호출될 수도 있습니다. 이 변환 함수는 리시버 컬렉션의 두 요소를 인수로 받아야 합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}