[//]: # (title: 시퀀스)

컬렉션과 함께 코틀린 표준 라이브러리에는 또 다른 타입인 _시퀀스_([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))가 포함되어 있습니다.
컬렉션과 달리 시퀀스는 요소를 포함하지 않으며, 반복하는 동안 요소를 생성합니다.
시퀀스는 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)과 동일한 함수를 제공하지만, 다단계 컬렉션 처리에 다른 방식을 구현합니다.

`Iterable` 처리에 여러 단계가 포함될 때, 해당 단계들은 즉시(eagerly) 실행됩니다. 즉, 각 처리 단계는 완료되고 그 결과인 중간 컬렉션을 반환합니다. 다음 단계는 이 컬렉션에 대해 실행됩니다. 반면에, 시퀀스의 다단계 처리는 가능한 경우 지연(lazily) 실행됩니다. 실제 계산은 전체 처리 체인의 결과가 요청될 때만 발생합니다.

연산 실행 순서도 다릅니다. `Sequence`는 모든 처리 단계를 각 요소에 대해 하나씩 수행합니다. 반면, `Iterable`은 전체 컬렉션에 대해 각 단계를 완료한 다음 다음 단계로 진행합니다.

따라서 시퀀스는 중간 단계의 결과를 구축하는 것을 피하게 해주고, 결과적으로 전체 컬렉션 처리 체인의 성능을 향상시킵니다. 하지만 시퀀스의 지연(lazy) 특성은 약간의 오버헤드를 추가하며, 이는 작은 컬렉션을 처리하거나 간단한 계산을 수행할 때 중요할 수 있습니다. 그러므로 `Sequence`와 `Iterable`을 모두 고려하여 당신의 경우에 어떤 것이 더 적합한지 결정해야 합니다.

## 생성

### 요소로부터

시퀀스를 생성하려면 요소를 인수로 나열하여 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 함수를 호출합니다.

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### `Iterable`로부터

이미 `Iterable` 객체(예: `List` 또는 `Set`)를 가지고 있다면, [`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html)를 호출하여 시퀀스를 생성할 수 있습니다.

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 함수로부터

시퀀스를 생성하는 또 다른 방법은 요소를 계산하는 함수로 시퀀스를 구축하는 것입니다.
함수를 기반으로 시퀀스를 구축하려면 이 함수를 인수로 사용하여 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)를 호출합니다. 선택적으로, 첫 번째 요소를 명시적인 값이나 함수 호출의 결과로 지정할 수 있습니다.
제공된 함수가 `null`을 반환하면 시퀀스 생성이 중지됩니다. 따라서 아래 예시의 시퀀스는 무한합니다.

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it`은 이전 요소입니다
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 오류: 시퀀스가 무한합니다
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`generateSequence()`로 유한 시퀀스를 생성하려면, 필요한 마지막 요소 다음에 `null`을 반환하는 함수를 제공하세요.

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 청크로부터

마지막으로, 시퀀스 요소를 하나씩 또는 임의의 크기의 청크로 생성할 수 있는 함수인 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 함수가 있습니다.
이 함수는 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) 및 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 함수 호출을 포함하는 람다 표현식을 인수로 받습니다.
이 함수들은 시퀀스 컨슈머에게 요소를 반환하고, 컨슈머가 다음 요소를 요청할 때까지 `sequence()` 실행을 일시 중단합니다. `yield()`는 단일 요소를 인수로 받습니다. `yieldAll()`은 `Iterable` 객체, `Iterator` 또는 다른 `Sequence`를 받을 수 있습니다. `yieldAll()`의 `Sequence` 인수는 무한할 수 있습니다. 하지만 이러한 호출은 마지막이어야 합니다. 이후의 모든 호출은 절대 실행되지 않습니다.

```kotlin

fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 시퀀스 연산

시퀀스 연산은 상태 요구 사항에 따라 다음 그룹으로 분류할 수 있습니다:

*   _상태 비저장_ 연산은 상태를 요구하지 않고 각 요소를 독립적으로 처리합니다. 예를 들어, [`map()`](collection-transformations.md#map) 또는 [`filter()`](collection-filtering.md)와 같습니다.
    상태 비저장 연산은 요소를 처리하기 위해 작고 일정한 양의 상태를 요구할 수도 있습니다. 예를 들어, [`take()` 또는 `drop()`](collection-parts.md)과 같습니다.
*   _상태 저장_ 연산은 상당한 양의 상태를 요구하며, 일반적으로 시퀀스의 요소 수에 비례합니다.

시퀀스 연산이 지연 생성되는 다른 시퀀스를 반환하는 경우, 이를 _중간_ 연산이라고 합니다.
그렇지 않으면 이 연산은 _종단_ 연산입니다. 종단 연산의 예로는 [`toList()`](constructing-collections.md#copy) 또는 [`sum()`](collection-aggregate.md)이 있습니다. 시퀀스 요소는 종단 연산을 통해서만 검색할 수 있습니다.

시퀀스는 여러 번 반복될 수 있습니다. 하지만 일부 시퀀스 구현은 한 번만 반복되도록 제한될 수 있습니다. 이는 해당 문서에 명시적으로 언급되어 있습니다.

## 시퀀스 처리 예시

`Iterable`과 `Sequence`의 차이점을 예시를 통해 살펴보겠습니다.

### `Iterable`

단어 목록이 있다고 가정해 봅시다. 아래 코드는 세 글자보다 긴 단어를 필터링하고 그러한 단어 중 처음 네 개의 길이를 출력합니다.

```kotlin

fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이 코드를 실행하면 `filter()` 및 `map()` 함수가 코드에 나타나는 순서대로 실행되는 것을 볼 수 있습니다. 먼저 모든 요소에 대한 `filter:`를 보고, 그 다음 필터링 후 남은 요소에 대한 `length:`를 본 다음, 마지막 두 줄의 출력을 보게 됩니다.

목록 처리는 다음과 같이 진행됩니다:

![List processing](list-processing.svg)

### `Sequence`

이제 시퀀스로 동일하게 작성해 봅시다:

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    // List를 Sequence로 변환
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 종단 연산: List로 결과 얻기
    println(lengthsSequence.toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이 코드의 출력은 `filter()` 및 `map()` 함수가 결과 목록을 구축할 때만 호출된다는 것을 보여줍니다.
따라서 먼저 `"Lengths of.."` 텍스트 줄을 보고 시퀀스 처리가 시작됩니다.
필터링 후 남은 요소에 대해 다음 요소를 필터링하기 전에 맵(map)이 실행된다는 점에 유의하십시오.
결과 크기가 4에 도달하면 `take(4)`가 반환할 수 있는 최대 크기이므로 처리가 중지됩니다.

시퀀스 처리는 다음과 같이 진행됩니다:

![Sequences processing](sequence-processing.svg) {width="700"}

이 예시에서는 요소를 지연 처리하고 네 개의 항목을 찾은 후 중지함으로써 목록 접근 방식을 사용하는 것에 비해 연산 횟수가 줄어듭니다.