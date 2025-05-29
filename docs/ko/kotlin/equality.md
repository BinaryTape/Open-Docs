[//]: # (title: 동일성)

Kotlin에는 두 가지 유형의 동일성이 있습니다:

*   _구조적_ 동일성 (`==`) - `equals()` 함수를 통한 확인
*   _참조_ 동일성 (`===`) - 두 참조가 동일한 객체를 가리키는지 확인

## 구조적 동일성

구조적 동일성은 두 객체가 동일한 내용 또는 구조를 가지는지 확인합니다. 구조적 동일성은 `==` 연산과 그 반대인 `!=` 연산을 통해 확인됩니다.
관례적으로, `a == b`와 같은 표현식은 다음과 같이 변환됩니다:

```kotlin
a?.equals(b) ?: (b === null)
```

`a`가 `null`이 아니면 `equals(Any?)` 함수를 호출합니다. 그렇지 않으면 (`a`가 `null`이면) `b`가 `null`과 참조적으로 동일한지 확인합니다:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`null`과 명시적으로 비교할 때 코드를 최적화할 필요가 없다는 점에 유의하세요: `a == null`은 자동으로 `a === null`로 변환됩니다.

Kotlin에서 `equals()` 함수는 모든 클래스가 `Any` 클래스로부터 상속받습니다. 기본적으로 `equals()` 함수는 [참조 동일성](#referential-equality)을 구현합니다. 그러나 Kotlin의 클래스는 `equals()` 함수를 오버라이드하여 사용자 정의 동일성 로직을 제공하고, 이러한 방식으로 구조적 동일성을 구현할 수 있습니다.

값 클래스와 데이터 클래스는 `equals()` 함수를 자동으로 오버라이드하는 두 가지 특정 Kotlin 타입입니다. 이것이 기본적으로 구조적 동일성을 구현하는 이유입니다.

하지만 데이터 클래스의 경우, 부모 클래스에서 `equals()` 함수가 `final`로 선언되면 그 동작은 변경되지 않습니다.

분명히, 비데이터 클래스(`data` 한정자로 선언되지 않은 클래스)는 기본적으로 `equals()` 함수를 오버라이드하지 않습니다. 대신, 비데이터 클래스는 `Any` 클래스로부터 상속받은 참조 동일성 동작을 구현합니다.
구조적 동일성을 구현하려면 비데이터 클래스는 `equals()` 함수를 오버라이드하기 위한 사용자 정의 동일성 로직이 필요합니다.

사용자 정의 `equals` 확인 구현을 제공하려면 [\`equals(other: Any?): Boolean\`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수를 오버라이드하세요:

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // Compares properties for structural equality
        return this.x == other.x && this.y == other.y
    }
}
```
> `equals()` 함수를 오버라이드할 때는 동일성과 해싱 간의 일관성을 유지하고 이 함수들의 적절한 동작을 보장하기 위해 [hashCode() 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)도 오버라이드해야 합니다.
>
{style="note"}

동일한 이름과 다른 시그니처(예: `equals(other: Foo)`)를 가진 함수는 `==` 및 `!=` 연산자를 사용한 동일성 확인에 영향을 미치지 않습니다.

구조적 동일성은 `Comparable<...>` 인터페이스에 의해 정의된 비교와는 관련이 없으므로, 사용자 정의 `equals(Any?)` 구현만이 연산자의 동작에 영향을 미칠 수 있습니다.

## 참조 동일성

참조 동일성은 두 객체의 메모리 주소를 확인하여 동일한 인스턴스인지 여부를 판별합니다.

참조 동일성은 `===` 연산과 그 반대인 `!==` 연산을 통해 확인됩니다. `a === b`는 `a`와 `b`가 동일한 객체를 가리킬 때만 `true`로 평가됩니다:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

런타임에 기본형 타입(예: `Int`)으로 표현되는 값의 경우, `===` 동일성 확인은 `==` 확인과 동일합니다.

> Kotlin/JS에서는 참조 동일성이 다르게 구현됩니다. 동일성에 대한 자세한 내용은 [Kotlin/JS](js-interop.md#equality) 문서를 참조하세요.
>
{style="tip"}

## 부동 소수점 수 동일성

동일성 확인의 피연산자가 정적으로 `Float` 또는 `Double`(널러블 또는 비널러블)로 알려진 경우, 이 확인은 [IEEE 754 부동 소수점 연산 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따릅니다.

피연산자가 정적으로 부동 소수점 수로 타입 지정되지 않은 경우에는 동작이 다릅니다. 이 경우, 구조적 동일성이 구현됩니다. 결과적으로, 정적으로 부동 소수점 수로 타입 지정되지 않은 피연산자를 사용한 확인은 IEEE 표준과 다릅니다. 이 시나리오에서는:

*   `NaN`은 자기 자신과 동일합니다.
*   `NaN`은 다른 어떤 요소( `POSITIVE_INFINITY` 포함)보다 큽니다.
*   `-0.0`은 `0.0`과 동일하지 않습니다.

더 자세한 내용은 [부동 소수점 수 비교](numbers.md#floating-point-numbers-comparison)를 참조하세요.

## 배열 동일성

두 배열이 동일한 순서로 동일한 요소를 가지고 있는지 비교하려면 [\`contentEquals()\`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)를 사용하세요.

더 자세한 내용은 [배열 비교](arrays.md#compare-arrays)를 참조하세요.