---
title: "범위 및 progression"
---
레인지와 프로그레션은 Kotlin에서 값의 시퀀스를 정의하며, 레인지 연산자, 반복, 사용자 정의 스텝 값 및 산술 프로그레션을 지원합니다.

## 레인지

Kotlin을 사용하면 `kotlin.ranges` 패키지의 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)
및 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 함수를 사용하여 값의 레인지를 쉽게 만들 수 있습니다.

레인지는 정의된 시작과 끝을 가진 정렬된 값의 집합을 나타냅니다. 기본적으로 각 스텝마다 1씩 증가합니다.
예를 들어, `1..4`는 숫자 1, 2, 3, 4를 나타냅니다.

생성 방법:

* 폐쇄형 레인지를 만들려면 `..` 연산자와 함께 `.rangeTo()` 함수를 호출합니다. 여기에는 시작 값과 끝 값이 모두 포함됩니다.
* 개방형 레인지를 만들려면 `..<` 연산자와 함께 `.rangeUntil()` 함수를 호출합니다. 여기에는 시작 값이 포함되지만 끝 값은 제외됩니다.

예를 들어:

```kotlin
fun main() {

    // 폐쇄형 레인지: 1과 4를 모두 포함
    println(4 in 1..4)
    // true
    
    // 개방형 레인지: 1은 포함, 4는 제외
    println(4 in 1..&lt;4)
    // false

}
```

레인지는 `for` 루프를 반복하는 데 특히 유용합니다.

```kotlin
fun main() {

    for (i in 1..4) print(i)
    // 1234

}
```

숫자를 역순으로 반복하려면 `..` 대신 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)
함수를 사용하세요.

```kotlin
fun main() {

    for (i in 4 downTo 1) print(i)
    // 4321

}
```

기본 증가분 1 대신 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 함수를 사용하여 사용자 정의 스텝으로 숫자를 반복할 수도 있습니다.

```kotlin
fun main() {

    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..&lt;8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420

}
```

## 프로그레션

`Int`, `Long`, `Char`와 같은 정수 타입의 레인지는
[등차수열](https://en.wikipedia.org/wiki/Arithmetic_progression)로 처리될 수 있습니다.
Kotlin에서 이러한 프로그레션은 특별한 타입인 [`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html),
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 및 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)으로 정의됩니다.

프로그레션에는 `first` 요소, `last` 요소, 0이 아닌 `step`이라는 세 가지 필수 속성이 있습니다.
첫 번째 요소는 `first`이고, 후속 요소는 이전 요소에 `step`을 더한 값입니다.
양수 스텝을 사용하는 프로그레션에 대한 반복은 Java/JavaScript의 인덱싱된 `for` 루프와 동일합니다.

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

레인지를 반복하여 프로그레션을 암시적으로 생성하면 이 프로그레션의 `first` 및 `last` 요소는
레인지의 엔드포인트이고 `step`은 1입니다.

```kotlin
fun main() {

    for (i in 1..10) print(i)
    // 12345678910

}
```

사용자 정의 프로그레션 스텝을 정의하려면 레인지에서 `step` 함수를 사용하세요.

```kotlin

fun main() {

    for (i in 1..8 step 2) print(i)
    // 1357

}
```

프로그레션의 `last` 요소는 다음과 같이 계산됩니다.
* 양수 스텝의 경우: `(last - first) % step == 0`이 되는 끝 값보다 크지 않은 최대값입니다.
* 음수 스텝의 경우: `(last - first) % step == 0`이 되는 끝 값보다 작지 않은 최소값입니다.

따라서 `last` 요소는 지정된 끝 값과 항상 같지 않습니다.

```kotlin

fun main() {

    for (i in 1..9 step 3) print(i) // last 요소는 7입니다.
    // 147

}
```

프로그레션은 `Iterable<N>`을 구현하며, 여기서 `N`은 각각 `Int`, `Long` 또는 `Char`입니다. 따라서 `map`, `filter` 및 기타 [컬렉션 함수](collection-operations)에서 사용할 수 있습니다.

```kotlin

fun main() {

    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]

}
```