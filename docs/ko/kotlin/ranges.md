[//]: # (title: 범위와 수열)

범위(Range)와 수열(Progression)은 코틀린에서 값의 시퀀스를 정의하며, 범위 연산자, 반복(iteration), 커스텀 step 값, 등차수열을 지원합니다.

## 범위 {id="range"}

코틀린에서는 `kotlin.ranges` 패키지의 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)와 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 함수를 사용하여 값의 범위를 쉽게 생성할 수 있습니다. 

범위는 정의된 시작점과 끝점이 있는 정렬된 값의 집합을 나타냅니다. 기본적으로 각 단계(step)마다 1씩 증가합니다. 예를 들어, `1..4`는 숫자 1, 2, 3, 4를 나타냅니다.

범위를 생성하는 방법은 다음과 같습니다:

* 닫힌 범위(closed-ended range)를 만들려면 `..` 연산자와 함께 `.rangeTo()` 함수를 호출합니다. 이는 시작값과 끝값을 모두 포함합니다.
* 열린 범위(open-ended range)를 만들려면 `..<` 연산자와 함께 `.rangeUntil()` 함수를 호출합니다. 이는 시작값은 포함하지만 끝값은 제외합니다.

예를 들어:

```kotlin
fun main() {
//sampleStart
    // 닫힌 범위: 1과 4를 모두 포함
    println(4 in 1..4)
    // true
    
    // 열린 범위: 1은 포함, 4는 제외
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

범위는 특히 `for` 루프에서 반복할 때 유용합니다:

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

숫자를 역순으로 반복하려면 `..` 대신 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 함수를 사용하세요.

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

또한 기본 증가값인 1 대신 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 함수를 사용하여 커스텀 step으로 숫자를 반복할 수도 있습니다:

```kotlin
fun main() {
//sampleStart
    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..<8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-step"}

## 수열

`Int`, `Long`, `Char`와 같은 정수 타입의 범위는 [등차수열(arithmetic progressions)](https://en.wikipedia.org/wiki/Arithmetic_progression)로 취급될 수 있습니다. 코틀린에서 이러한 수열은 [`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html), [`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html), [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)과 같은 특별한 타입으로 정의됩니다.

수열은 `first` 요소, `last` 요소, 그리고 0이 아닌 `step`이라는 세 가지 필수 속성을 가집니다. 첫 번째 요소는 `first`이며, 이후의 요소들은 이전 요소에 `step`을 더한 값입니다. 양수 step을 가진 수열에 대한 반복은 Java/JavaScript의 인덱스 기반 `for` 루프와 동일합니다.

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

범위를 반복하여 암시적으로 수열을 생성할 때, 이 수열의 `first`와 `last` 요소는 범위의 양 끝점이 되며 `step`은 1이 됩니다.

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

커스텀 수열 step을 정의하려면 범위에 `step` 함수를 사용하세요.

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

수열의 `last` 요소는 다음과 같이 계산됩니다:
* 양수 step인 경우: `(last - first) % step == 0`을 만족하면서 끝값보다 크지 않은 최댓값.
* 음수 step인 경우: `(last - first) % step == 0`을 만족하면서 끝값보다 작지 않은 최솟값.

따라서 `last` 요소가 항상 지정된 끝값과 동일하지는 않습니다.

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // 마지막 요소는 7입니다
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

수열은 각각 `Int`, `Long`, `Char`인 `Iterable<N>`을 구현하므로, `map`, `filter` 등 다양한 [컬렉션 함수](collection-operations.md)에서 사용할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}