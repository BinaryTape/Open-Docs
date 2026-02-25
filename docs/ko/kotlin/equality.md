[//]: # (title: 동등성)

Kotlin에는 두 가지 유형의 동등성(Equality)이 있습니다.

* **구조적 동등성 (Structural equality)** (`==`) – `equals()` 함수를 호출하여 확인
* **참조 동일성 (Referential equality)** (`===`) – 두 참조가 동일한 객체를 가리키는지 확인

## 구조적 동등성

구조적 동등성은 두 객체의 내용이나 구조가 같은지 확인합니다. 구조적 동등성은 `==` 연산자와 그 반대인 `!=` 연산자로 확인합니다.
관례에 따라 `a == b`와 같은 표현식은 다음과 같이 변환됩니다.

```kotlin
a?.equals(b) ?: (b === null)
```

만약 `a`가 `null`이 아니면 `equals(Any?)` 함수를 호출합니다. 그렇지 않고 `a`가 `null`이면, `b`가 `null`과 참조적으로 동일한지 확인합니다.

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

`null`과 명시적으로 비교할 때 코드를 최적화할 필요가 없다는 점에 유의하세요. `a == null`은 자동으로 `a === null`로 변환됩니다.

Kotlin에서 `equals()` 함수는 모든 클래스가 `Any` 클래스로부터 상속받습니다. 기본적으로 `equals()` 함수는 [참조 동일성](#referential-equality)을 구현합니다. 하지만 Kotlin의 클래스는 사용자 정의 동등성 로직을 제공하기 위해 `equals()` 함수를 재정의(override)할 수 있으며, 이를 통해 구조적 동등성을 구현할 수 있습니다.

값 클래스(Value classes)와 데이터 클래스(Data classes)는 `equals()` 함수를 자동으로 재정의하는 두 가지 특정 Kotlin 타입입니다. 그렇기 때문에 이들은 기본적으로 구조적 동등성을 구현합니다.

하지만 데이터 클래스의 경우, 상위 클래스에서 `equals()` 함수가 `final`로 선언되어 있다면 그 동작은 변경되지 않은 채로 유지됩니다.

이와 대조적으로, 일반 클래스(`data` 수식어로 선언되지 않은 클래스)는 기본적으로 `equals()` 함수를 재정의하지 않습니다. 대신, 일반 클래스는 `Any` 클래스로부터 상속받은 참조 동일성 동작을 구현합니다. 구조적 동등성을 구현하려면 일반 클래스는 `equals()` 함수를 재정의하는 사용자 정의 동등성 로직이 필요합니다.

사용자 정의 `equals` 검사 구현을 제공하려면 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수를 재정의하세요.

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 속성의 구조적 동등성을 비교
        return this.x == other.x && this.y == other.y
    }
}
```
> `equals()` 함수를 재정의할 때는 동등성과 해싱(hashing) 사이의 일관성을 유지하고 이러한 함수들이 적절하게 동작하도록 [hashCode() 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)도 함께 재정의해야 합니다.
>
{style="note"}

이름은 같지만 시그니처가 다른 함수(예: `equals(other: Foo)`)는 `==` 및 `!=` 연산자를 사용한 동등성 검사에 영향을 주지 않습니다.

구조적 동등성은 `Comparable<...>` 인터페이스에 정의된 비교와는 무관하므로, 오직 사용자 정의 `equals(Any?)` 구현만이 해당 연산자의 동작에 영향을 줄 수 있습니다.

## 참조 동일성

참조 동일성은 두 객체의 메모리 주소를 확인하여 동일한 인스턴스인지 판단합니다.

참조 동일성은 `===` 연산자와 그 반대인 `!==` 연산자로 확인합니다. `a === b`는 `a`와 `b`가 동일한 객체를 가리키는 경우에만 true로 평가됩니다.

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

런타임에 원시 타입(primitive types)으로 표현되는 값(예: `Int`)의 경우, `===` 동등성 검사는 `==` 검사와 동일합니다.

> 참조 동일성은 Kotlin/JS에서 다르게 구현됩니다. 동등성에 대한 자세한 정보는 [Kotlin/JS](js-interop.md#equality) 문서를 참조하세요.
>
{style="tip"}

## 부동 소수점 숫자 동등성

동등성 검사의 피연산자가 정적으로 `Float` 또는 `Double`로 알려진 경우(null 허용 여부와 상관없이), 해당 검사는 [IEEE 754 부동 소수점 산술 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따릅니다.

부동 소수점 숫자로 정적 타입이 지정되지 않은 피연산자의 경우에는 동작이 다릅니다. 이 경우 구조적 동등성이 구현됩니다. 결과적으로 정적 타입이 부동 소수점 숫자가 아닌 피연산자와의 검사는 IEEE 표준과 다릅니다. 이 시나리오에서는 다음과 같습니다.

* `NaN`은 자기 자신과 같습니다.
* `NaN`은 다른 모든 요소( `POSITIVE_INFINITY` 포함)보다 큽니다.
* `-0.0`은 `0.0`과 같지 않습니다.

자세한 정보는 [부동 소수점 숫자 비교](numbers.md#floating-point-numbers-comparison)를 참조하세요.

## 배열 동등성

두 배열이 동일한 순서로 동일한 요소를 가지고 있는지 비교하려면 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)를 사용하세요.

자세한 정보는 [배열 비교](arrays.md#compare-arrays)를 참조하세요.