---
title: "연산자 오버로딩"
---
Kotlin에서는 타입에 대해 미리 정의된 연산자 집합에 대한 사용자 지정 구현을 제공할 수 있습니다. 이러한 연산자는 미리 정의된 기호 표현(`+` 또는 `*` 와(과) 같은)과(와) 우선 순위를 가집니다. 연산자를 구현하려면 해당 타입에 대한 특정 이름으로 [멤버 함수](functions#member-functions) 또는 [확장 함수](extensions)를 제공합니다. 이 타입은 이항 연산의 경우 왼쪽 피연산자 타입이 되고, 단항 연산의 경우 인자 타입이 됩니다.

연산자를 오버로드하려면 해당 함수에 `operator` modifier를 표시합니다.

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
연산자 오버로드를 [재정의](inheritance#overriding-methods)할 때 `operator`를 생략할 수 있습니다.

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 단항 연산

### 단항 접두사 연산자

| Expression | Translated to |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

이 표는 컴파일러가 예를 들어 `+a`라는 표현식을 처리할 때 다음 단계를 수행한다는 것을 나타냅니다.

* `a`의 타입을 결정하고, 이를 `T`라고 합니다.
* 수신자 `T`에 대해 `operator` modifier가 있고 매개변수가 없는 함수 `unaryPlus()`를 찾습니다. 즉, 멤버 함수 또는 확장 함수입니다.
* 함수가 없거나 모호하면 컴파일 오류입니다.
* 함수가 있고 해당 반환 타입이 `R`이면 표현식 `+a`는 타입 `R`을 가집니다.

:::note
이러한 연산은 다른 모든 연산과 마찬가지로 [기본 타입](basic-types)에 최적화되어 있으며 해당 타입에 대한 함수 호출 오버헤드를 발생시키지 않습니다.

:::

예를 들어, 다음은 단항 minus 연산자를 오버로드하는 방법입니다.

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```

### 증가 및 감소

| Expression | Translated to |
|------------|---------------|
| `a++` | `a.inc()` + 아래 참조 |
| `a--` | `a.dec()` + 아래 참조 |

`inc()` 및 `dec()` 함수는 값을 반환해야 하며, 이 값은 `++` 또는 `--` 연산이 사용된 변수에 할당됩니다. `inc` 또는 `dec`가 호출된 객체를 변경해서는 안 됩니다.

컴파일러는 *postfix* 형식(예: `a++`)으로 연산자를 확인하기 위해 다음 단계를 수행합니다.

* `a`의 타입을 결정하고, 이를 `T`라고 합니다.
* 타입 `T`의 수신자에 적용할 수 있는 `operator` modifier가 있고 매개변수가 없는 함수 `inc()`를 찾습니다.
* 함수의 반환 타입이 `T`의 하위 타입인지 확인합니다.

표현식 계산의 효과는 다음과 같습니다.

* `a`의 초기 값을 임시 저장소 `a0`에 저장합니다.
* `a0.inc()`의 결과를 `a`에 할당합니다.
* `a0`을(를) 표현식의 결과로 반환합니다.

`a--`의 경우 단계가 완전히 유사합니다.

*prefix* 형식 `++a` 및 `--a`의 경우 확인이 동일하게 작동하며 효과는 다음과 같습니다.

* `a.inc()`의 결과를 `a`에 할당합니다.
* `a`의 새 값을 표현식의 결과로 반환합니다.

## 이항 연산

### 산술 연산자

| Expression | Translated to |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

이 표의 연산에 대해 컴파일러는 *Translated to* 열의 표현식만 확인합니다.

다음은 주어진 값에서 시작하여 오버로드된 `+` 연산자를 사용하여 증가시킬 수 있는 `Counter` 클래스의 예입니다.

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 연산자

| Expression | Translated to |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

`in` 및 `!in`의 경우 절차는 동일하지만 인수의 순서가 반대입니다.

### 인덱스 접근 연산자

| Expression | Translated to |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

대괄호는 적절한 수의 인수를 사용하여 `get` 및 `set` 호출로 변환됩니다.

### invoke 연산자

| Expression | Translated to |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

괄호는 적절한 수의 인수를 사용하여 `invoke` 호출로 변환됩니다.

### Augmented assignments

| Expression | Translated to |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

할당 연산(예: `a += b`)의 경우 컴파일러는 다음 단계를 수행합니다.

* 오른쪽 열의 함수를 사용할 수 있는 경우:
  * 해당 이항 함수(즉, `plusAssign()`의 경우 `plus()`)도 사용할 수 있고, `a`가 변경 가능한 변수이며, `plus`의 반환 타입이 `a` 타입의 하위 타입인 경우 오류(모호성)를 보고합니다.
  * 해당 반환 타입이 `Unit`인지 확인하고, 그렇지 않으면 오류를 보고합니다.
  * `a.plusAssign(b)`에 대한 코드를 생성합니다.
* 그렇지 않으면 `a = a + b`에 대한 코드를 생성하려고 시도합니다(여기에는 타입 검사가 포함됩니다. `a + b`의 타입은 `a`의 하위 타입이어야 함).

:::note
할당은 Kotlin에서 표현식이 *아닙니다*.

:::

### Equality and inequality operators

| Expression | Translated to |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

이러한 연산자는 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수에서만 작동하며, 
사용자 지정 동등성 검사 구현을 제공하기 위해 재정의할 수 있습니다. 동일한 이름의 다른 함수(`equals(other: Foo)` 와(과) 같은)는 호출되지 않습니다.

:::note
`===` 및 `!==` (identity checks)는 오버로드할 수 없으므로 해당 컨벤션이 존재하지 않습니다.

:::

`==` 연산은 특별합니다. `null` 검사를 수행하는 복잡한 표현식으로 변환됩니다.
`null == null`은 항상 true이고, null이 아닌 `x`에 대한 `x == null`은 항상 false이며 `x.equals()`를 호출하지 않습니다.

### 비교 연산자

| Expression | Translated to |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

모든 비교는 `compareTo` 호출로 변환되며, `Int`를 반환해야 합니다.

### 속성 위임 연산자

`provideDelegate`, `getValue` 및 `setValue` 연산자 함수는 [Delegated properties](delegated-properties)에 설명되어 있습니다.

## 이름 있는 함수에 대한 중위 호출

[중위 함수 호출](functions#infix-notation)을 사용하여 사용자 지정 중위 연산을 시뮬레이션할 수 있습니다.