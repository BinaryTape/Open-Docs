[//]: # (title: 연산자 오버로딩)

Kotlin에서는 타입에 대해 미리 정의된 연산자 집합에 대한 사용자 지정 구현을 제공할 수 있습니다. 이러한 연산자는 미리 정의된 기호 표현(예: `+` 또는 `*`)과 우선순위를 가집니다. 연산자를 구현하려면 해당 타입에 대해 특정 이름을 가진 [멤버 함수](functions.md#member-functions) 또는 [확장 함수](extensions.md)를 제공해야 합니다. 이 타입은 이항 연산의 좌변 타입이 되고, 단항 연산의 인자 타입이 됩니다.

연산자를 오버로드하려면 해당 함수를 `operator` 변경자로 표시해야 합니다:

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
연산자 오버로드를 [오버라이드](inheritance.md#overriding-methods)할 때 `operator` 변경자를 생략할 수 있습니다:

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 단항 연산

### 단항 전위 연산자

| 표현식 | 변환 대상 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

이 표는 컴파일러가 예를 들어 `+a`와 같은 표현식을 처리할 때 다음 단계를 수행한다는 것을 의미합니다:

* `a`의 타입을 `T`라고 가정하고 결정합니다.
* 리시버 `T`에 대해 `operator` 변경자가 있고 매개변수가 없는 `unaryPlus()` 함수, 즉 멤버 함수 또는 확장 함수를 찾습니다.
* 함수가 없거나 모호하면 컴파일 오류입니다.
* 함수가 존재하고 반환 타입이 `R`이면 표현식 `+a`의 타입은 `R`입니다.

> 이 연산들은 다른 모든 연산과 마찬가지로 [기본 타입](types-overview.md)에 최적화되어 있으며, 이들에 대한 함수 호출 오버헤드를 발생시키지 않습니다.
>
{style="note"}

예를 들어, 단항 마이너스 연산자를 오버로드하는 방법은 다음과 같습니다:

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```
{kotlin-runnable="true"}

### 증감 연산

| 표현식 | 변환 대상 |
|------------|---------------|
| `a++` | `a.inc()` + 아래 참조 |
| `a--` | `a.dec()` + 아래 참조 |

`inc()` 및 `dec()` 함수는 `++` 또는 `--` 연산이 사용된 변수에 할당될 값을 반환해야 합니다. 이 함수들은 `inc` 또는 `dec`가 호출된 객체를 변경해서는 안 됩니다.

컴파일러는 예를 들어 `a++`와 같은 *후위* 형식의 연산자를 해결하기 위해 다음 단계를 수행합니다:

* `a`의 타입을 `T`라고 가정하고 결정합니다.
* `operator` 변경자가 있고 매개변수가 없으며 타입 `T`의 리시버에 적용 가능한 `inc()` 함수를 찾습니다.
* 함수의 반환 타입이 `T`의 하위 타입인지 확인합니다.

표현식을 계산하는 효과는 다음과 같습니다:

* `a`의 초기 값을 임시 저장소 `a0`에 저장합니다.
* `a0.inc()`의 결과를 `a`에 할당합니다.
* `a0`를 표현식의 결과로 반환합니다.

`a--`의 경우 단계는 완전히 동일합니다.

*전위* 형식인 `++a` 및 `--a`의 경우 해결 방식은 동일하며 효과는 다음과 같습니다:

* `a.inc()`의 결과를 `a`에 할당합니다.
* `a`의 새 값을 표현식의 결과로 반환합니다.

## 이항 연산

### 산술 연산자

| 표현식 | 변환 대상 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

이 표의 연산자에 대해 컴파일러는 *변환 대상* 열의 표현식을 해결합니다.

다음은 주어진 값에서 시작하여 오버로드된 `+` 연산자를 사용하여 증가할 수 있는 `Counter` 클래스의 예입니다:

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 연산자

| 표현식 | 변환 대상 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

`in` 및 `!in`의 경우 절차는 동일하지만 인수의 순서는 반대입니다.

### 인덱스 접근 연산자

| 표현식 | 변환 대상 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

대괄호는 적절한 수의 인수를 가진 `get` 및 `set` 호출로 변환됩니다.

### invoke 연산자

| 표현식 | 변환 대상 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

괄호는 적절한 수의 인수를 가진 `invoke` 호출로 변환됩니다.

### 복합 할당 연산

| 표현식 | 변환 대상 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

예를 들어 `a += b`와 같은 할당 연산의 경우 컴파일러는 다음 단계를 수행합니다:

* 오른쪽 열의 함수가 사용 가능한 경우:
  * 해당 이항 함수(`plusAssign()`의 경우 `plus()`)도 사용 가능하고, `a`가 가변 변수이며, `plus`의 반환 타입이 `a`의 타입의 하위 타입인 경우, 오류(모호성)를 보고합니다.
  * 반환 타입이 `Unit`인지 확인하고, 그렇지 않으면 오류를 보고합니다.
  * `a.plusAssign(b)`에 대한 코드를 생성합니다.
* 그렇지 않으면 `a = a + b`에 대한 코드를 생성하려고 시도합니다 (여기에는 타입 검사가 포함됩니다: `a + b`의 타입은 `a`의 하위 타입이어야 합니다).

> Kotlin에서 할당은 표현식이 *아닙니다*.
>
{style="note"}

### 동등 및 부등 연산자

| 표현식 | 변환 대상 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

이 연산자들은 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수와만 작동하며, 이 함수는 사용자 지정 동등성 확인 구현을 제공하기 위해 오버라이드될 수 있습니다. 동일한 이름을 가진 다른 함수(예: `equals(other: Foo)`)는 무시됩니다.

Kotlin은 `==` 표현식에서 어느 피연산자도 `null`과 직접 비교되지 않고 비교가 두 부동 소수점 타입 사이에 해당하지 않을 때 `.equals()`를 호출합니다. 그렇지 않으면 Kotlin은 직접적인 `null` 비교에 `===`를 사용하고, `null`이 아닌 부동 소수점 값은 숫자 값으로 비교합니다.

> `===` 및 `!==`(동일성 검사)는 오버로드할 수 없으므로, 이에 대한 규칙은 존재하지 않습니다.
>
{style="note"}

### 비교 연산자

| 표현식 | 변환 대상 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

모든 비교는 `Int`를 반환하도록 요구되는 `compareTo` 호출로 변환됩니다.

### 프로퍼티 위임 연산자

`provideDelegate`, `getValue` 및 `setValue` 연산자 함수는 [위임된 프로퍼티](delegated-properties.md)에서 설명합니다.

## 이름 있는 함수에 대한 중위 호출

[중위 함수 호출](functions.md#infix-notation)을 사용하여 사용자 지정 중위 연산을 시뮬레이션할 수 있습니다.