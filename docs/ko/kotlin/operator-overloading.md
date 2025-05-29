[//]: # (title: 연산자 오버로딩)

Kotlin을 사용하면 타입에 대해 사전 정의된 연산자 집합에 커스텀 구현을 제공할 수 있습니다. 이러한 연산자들은 미리 정의된 기호 표현(예: `+` 또는 `*`)과 우선순위를 가집니다. 연산자를 구현하려면 해당 타입에 대해 특정 이름을 가진 [멤버 함수](functions.md#member-functions) 또는 [확장 함수](extensions.md)를 제공해야 합니다. 이 타입은 이항 연산의 좌측 피연산자 타입이 되고, 단항 연산의 인자 타입이 됩니다.

연산자를 오버로드하려면 해당 함수를 `operator` 변경자로 표시하세요.

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
[오버라이딩](inheritance.md#overriding-methods)할 때, 오버로드된 연산자의 `operator` 변경자를 생략할 수 있습니다.

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 단항 연산

### 단항 접두 연산자

| 표현식 | 번역 결과 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

이 표에 따르면 컴파일러가 예를 들어 `+a` 표현식을 처리할 때 다음 단계를 수행합니다:

*   `a`의 타입을 결정하고, 그 타입을 `T`라고 합시다.
*   리시버 `T`에 대해 `operator` 변경자가 붙고 매개변수가 없는 `unaryPlus()` 함수를 찾습니다. 이는 멤버 함수 또는 확장 함수를 의미합니다.
*   함수가 없거나 모호하면 컴파일 오류입니다.
*   함수가 존재하고 반환 타입이 `R`이면, `+a` 표현식의 타입은 `R`입니다.

> 이러한 연산자들은 다른 모든 연산자와 마찬가지로 [기본 타입](basic-types.md)에 최적화되어 있으며, 이들에 대한 함수 호출 오버헤드를 발생시키지 않습니다.
>
{style="note"}

예를 들어, 단항 마이너스 연산자를 오버로드하는 방법은 다음과 같습니다:

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // "Point(x=-10, y=-20)" 출력
}
```
{kotlin-runnable="true"}

### 증가 및 감소

| 표현식 | 번역 결과 |
|------------|---------------|
| `a++` | `a.inc()` + 아래 참조 |
| `a--` | `a.dec()` + 아래 참조 |

`inc()` 및 `dec()` 함수는 `++` 또는 `--` 연산이 사용된 변수에 할당될 값을 반환해야 합니다. 이 함수들은 `inc` 또는 `dec`가 호출된 객체를 변경해서는 안 됩니다.

컴파일러는 예를 들어 `a++`와 같은 *후위 형식*의 연산자를 해결하기 위해 다음 단계를 수행합니다:

*   `a`의 타입을 결정하고, 그 타입을 `T`라고 합시다.
*   `operator` 변경자가 붙고 매개변수가 없는 `inc()` 함수를 찾으며, 이 함수는 타입 `T`의 리시버에 적용 가능해야 합니다.
*   함수의 반환 타입이 `T`의 하위 타입인지 확인합니다.

표현식 계산의 효과는 다음과 같습니다:

*   `a`의 초기 값을 임시 저장소 `a0`에 저장합니다.
*   `a0.inc()`의 결과를 `a`에 할당합니다.
*   `a0`을 표현식의 결과로 반환합니다.

`a--`의 경우 단계는 완전히 유사합니다.

*접두 형식* `++a` 및 `--a`의 경우 해결 방식은 동일하며, 효과는 다음과 같습니다:

*   `a.inc()`의 결과를 `a`에 할당합니다.
*   `a`의 새로운 값을 표현식의 결과로 반환합니다.

## 이항 연산

### 산술 연산자

| 표현식 | 번역 결과 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

이 표의 연산자들에 대해 컴파일러는 *번역 결과* 열에 있는 표현식을 해결합니다.

아래는 주어진 값으로 시작하며 오버로드된 `+` 연산자를 사용하여 증가시킬 수 있는 `Counter` 클래스 예시입니다:

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 연산자

| 표현식 | 번역 결과 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

`in` 및 `!in`의 경우 절차는 동일하지만 인자의 순서가 뒤바뀝니다.

### 인덱스 접근 연산자

| 표현식 | 번역 결과 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

대괄호는 적절한 수의 인자를 가진 `get` 및 `set` 호출로 번역됩니다.

### invoke 연산자

| 표현식 | 번역 결과 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

괄호는 적절한 수의 인자를 가진 `invoke` 호출로 번역됩니다.

### 복합 할당

| 표현식 | 번역 결과 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

할당 연산(예: `a += b`)의 경우 컴파일러는 다음 단계를 수행합니다:

*   오른쪽 열의 함수가 사용 가능한 경우:
    *   해당 이항 함수(즉, `plusAssign()`에 대한 `plus()`)도 사용 가능하고, `a`가 가변 변수이며, `plus`의 반환 타입이 `a`의 타입의 하위 타입인 경우 오류(모호성)를 보고합니다.
    *   반환 타입이 `Unit`인지 확인하고, 그렇지 않으면 오류를 보고합니다.
    *   `a.plusAssign(b)`에 대한 코드를 생성합니다.
*   그렇지 않으면 `a = a + b`에 대한 코드를 생성하려고 시도합니다 (이것은 타입 검사: `a + b`의 타입이 `a`의 하위 타입이어야 함을 포함합니다).

> Kotlin에서 할당은 표현식이 *아닙니다*.
>
{style="note"}

### 동등 및 부등 연산자

| 표현식 | 번역 결과 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

이 연산자들은 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수와만 작동하며, 이 함수는 커스텀 동등성 검사 구현을 제공하기 위해 오버라이드될 수 있습니다. 같은 이름을 가진 다른 함수(예: `equals(other: Foo)`)는 호출되지 않습니다.

> `===` 및 `!==`(동일성 검사)는 오버로드할 수 없으므로, 이에 대한 규칙이 존재하지 않습니다.
>
{style="note"}

`==` 연산은 특별합니다. 이 연산은 `null`을 필터링하는 복잡한 표현식으로 번역됩니다.
`null == null`은 항상 true이며, null이 아닌 `x`에 대한 `x == null`은 항상 false이고 `x.equals()`를 호출하지 않습니다.

### 비교 연산자

| 표현식 | 번역 결과 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

모든 비교는 `Int`를 반환해야 하는 `compareTo` 호출로 번역됩니다.

### 프로퍼티 위임 연산자

`provideDelegate`, `getValue`, `setValue` 연산자 함수는 [위임된 프로퍼티](delegated-properties.md)에서 설명되어 있습니다.

## 이름 있는 함수를 위한 중위 호출

[중위 함수 호출](functions.md#infix-notation)을 사용하여 커스텀 중위 연산을 시뮬레이션할 수 있습니다.