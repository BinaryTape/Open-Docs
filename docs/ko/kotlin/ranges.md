[//]: # (title: 범위와 진행)

Kotlin에서 범위와 진행은 값의 시퀀스를 정의하며, 범위 연산자, 반복, 사용자 정의 스텝 값 및 등차수열을 지원합니다.

## 범위 {id="range"}

Kotlin에서는 `kotlin.ranges` 패키지의 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 및 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 함수를 사용하여 값 범위를 쉽게 생성할 수 있습니다.

범위는 정의된 시작과 끝을 가진 정렬된 값 집합을 나타냅니다. 기본적으로 각 스텝에서 1씩 증가합니다. 예를 들어, `1..4`는 숫자 1, 2, 3, 4를 나타냅니다.

생성하려면:

*   닫힌 범위(closed-ended range)를 생성하려면 `..` 연산자와 함께 `.rangeTo()` 함수를 호출합니다. 이는 시작 값과 끝 값을 모두 포함합니다.
*   열린 범위(open-ended range)를 생성하려면 `..<` 연산자와 함께 `.rangeUntil()` 함수를 호출합니다. 이는 시작 값은 포함하지만 끝 값은 제외합니다.

예시:

```kotlin
fun main() {
//sampleStart
    // 닫힌 범위: 1과 4를 모두 포함
    println(4 in 1..4)
    // true
    
    // 열린 범위: 1은 포함하지만 4는 제외
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

범위는 `for` 루프를 통한 반복에 특히 유용합니다:

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

숫자를 역순으로 반복하려면 `..` 대신 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 함수를 사용합니다.

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

기본 1 증가 대신 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 함수를 사용하여 사용자 정의 스텝으로 숫자를 반복할 수도 있습니다:

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

## 진행

`Int`, `Long`, `Char`와 같은 정수형의 범위는 [등차수열](https://en.wikipedia.org/wiki/Arithmetic_progression)로 간주될 수 있습니다. Kotlin에서 이러한 진행은 [`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html), [`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 및 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)과 같은 특별한 유형으로 정의됩니다.

진행은 세 가지 필수 속성을 가집니다: `first` 요소, `last` 요소, 그리고 0이 아닌 `step`. 첫 번째 요소는 `first`이고, 다음 요소들은 이전 요소에 `step`을 더한 값입니다. 양의 스텝을 가진 진행에 대한 반복은 Java/JavaScript의 인덱스 `for` 루프와 동일합니다.

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

범위를 반복하여 진행을 암시적으로 생성할 때, 이 진행의 `first` 및 `last` 요소는 범위의 끝점이며, `step`은 1입니다.

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

사용자 정의 진행 스텝을 정의하려면 범위에 `step` 함수를 사용하세요.

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

진행의 `last` 요소는 다음과 같이 계산됩니다:
*   양수 스텝의 경우: `(last - first) % step == 0`을 만족하며 끝 값보다 크지 않은 최대 값.
*   음수 스텝의 경우: `(last - first) % step == 0`을 만족하며 끝 값보다 작지 않은 최소 값.

따라서 `last` 요소는 지정된 끝 값과 항상 같지는 않습니다.

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // 마지막 요소는 7입니다
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

진행은 `Iterable<N>`을 구현하며, 여기서 `N`은 각각 `Int`, `Long`, 또는 `Char`입니다. 따라서 `map`, `filter` 등 다양한 [컬렉션 함수](collection-operations.md)에서 사용할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}