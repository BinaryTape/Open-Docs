---
title: 동등성
---
Kotlin에는 두 가지 유형의 동등성이 있습니다.

* _구조적_ 동등성(`==`) - `equals()` 함수에 대한 검사
* _참조적_ 동등성(`===`) - 동일한 객체를 가리키는 두 참조에 대한 검사

## 구조적 동등성

구조적 동등성은 두 객체의 내용 또는 구조가 동일한지 확인합니다. 구조적 동등성은 `==` 연산과 그 부정인 `!=`로 확인됩니다.
관례에 따라 `a == b`와 같은 표현식은 다음과 같이 변환됩니다.

```kotlin
a?.equals(b) ?: (b === null)
```

`a`가 `null`이 아니면 `equals(Any?)` 함수를 호출합니다. 그렇지 않으면(`a`가 `null`인 경우) `b`가
참조적으로 `null`과 같은지 확인합니다.

```kotlin
fun main() {
    var a = "hello"
    var b = "hello"
    var c = null
    var d = null
    var e = d

    println(a == b)
    // true
    println(a == c)
    // false
    println(c == e)
    // true
}
```

`null`과 명시적으로 비교할 때 코드를 최적화할 필요가 없습니다.
`a == null`은 자동으로 `a === null`로 변환됩니다.

Kotlin에서 `equals()` 함수는 `Any` 클래스에서 모든 클래스에 상속됩니다. 기본적으로 `equals()` 함수는
[참조적 동등성](#referential-equality)을 구현합니다. 그러나 Kotlin의 클래스는 `equals()`
함수를 재정의하여 사용자 지정 동등성 로직을 제공하고 이러한 방식으로 구조적 동등성을 구현할 수 있습니다.

값 클래스와 데이터 클래스는 `equals()` 함수를 자동으로 재정의하는 두 가지 특정 Kotlin 유형입니다.
그렇기 때문에 기본적으로 구조적 동등성을 구현합니다.

그러나 데이터 클래스의 경우 `equals()` 함수가 상위 클래스에서 `final`로 표시되면 동작이 변경되지 않습니다.

분명히, 비 데이터 클래스( `data` 수정자로 선언되지 않은 클래스)는 기본적으로
`equals()` 함수를 재정의하지 않습니다. 대신, 비 데이터 클래스는 `Any` 클래스에서 상속된 참조적 동등성 동작을 구현합니다.
구조적 동등성을 구현하려면 비 데이터 클래스에 `equals()` 함수를 재정의하는 사용자 지정 동등성 로직이 필요합니다.

사용자 지정 equals 검사 구현을 제공하려면
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수를 재정의하십시오.

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 구조적 동등성을 위해 속성을 비교합니다.
        return this.x == other.x && this.y == other.y
    }
}
``` 
:::note
equals() 함수를 재정의할 때 [hashCode() 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)도 재정의해야 합니다.
동등성과 해싱 간의 일관성을 유지하고 이러한 함수의 적절한 동작을 보장합니다.

:::

이름이 같고 다른 시그니처(예: `equals(other: Foo)`)를 가진 함수는
`==` 및 `!=` 연산자를 사용한 동등성 검사에 영향을 주지 않습니다.

구조적 동등성은 `Comparable<...>` 인터페이스에 의해 정의된 비교와 아무 관련이 없으므로 사용자 지정
`equals(Any?)` 구현만 연산자의 동작에 영향을 줄 수 있습니다.

## 참조적 동등성

참조적 동등성은 두 객체의 메모리 주소를 확인하여 동일한 인스턴스인지 확인합니다.

참조적 동등성은 `===` 연산과 그 부정인 `!==`로 확인됩니다. `a === b`는
`a`와 `b`가 동일한 객체를 가리키는 경우에만 true로 평가됩니다.

```kotlin
fun main() {
    var a = "Hello"
    var b = a
    var c = "world"
    var d = "world"

    println(a === b)
    // true
    println(a === c)
    // false
    println(c === d)
    // true

}
```

런타임 시 기본 유형으로 표현되는 값(예: `Int`)의 경우
`===` 동등성 검사는 `==` 검사와 같습니다.

:::tip
참조적 동등성은 Kotlin/JS에서 다르게 구현됩니다. 동등성에 대한 자세한 내용은 [Kotlin/JS](js-interop#equality) 문서를 참조하십시오.

:::

## 부동 소수점 숫자 동등성

동등성 검사의 피연산자가 정적으로 `Float` 또는 `Double`(nullable 여부)인 것으로 알려진 경우 검사는
[IEEE 754 부동 소수점 산술 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따릅니다.

동작은 부동 소수점 숫자로 정적으로 입력되지 않은 피연산자에 대해 다릅니다. 이러한 경우
구조적 동등성이 구현됩니다. 결과적으로 부동 소수점 숫자로 정적으로 입력되지 않은 피연산자를 사용한 검사는
IEEE 표준과 다릅니다. 이 시나리오에서는 다음이 적용됩니다.

* `NaN`은 그 자체와 같습니다.
* `NaN`은 다른 모든 요소보다 큽니다(`POSITIVE_INFINITY` 포함).
* `-0.0`은 `0.0`과 같지 않습니다.

자세한 내용은 [부동 소수점 숫자 비교](numbers#floating-point-numbers-comparison)를 참조하십시오.

## 배열 동등성

두 배열이 동일한 순서로 동일한 요소를 가지고 있는지 비교하려면 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)를 사용하십시오.

자세한 내용은 [배열 비교](arrays#compare-arrays)를 참조하십시오.