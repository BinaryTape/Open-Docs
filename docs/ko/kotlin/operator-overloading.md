[//]: # (title: 연산자 오버로딩)

Kotlin은 타입에 대해 미리 정의된 연산자 세트에 커스텀 구현을 제공할 수 있도록 허용합니다. 이러한 연산자들은 미리 정의된 기호 표현(예: `+` 또는 `*`)과 우선순위를 가집니다. 연산자를 구현하려면, 해당 타입에 대해 특정 이름을 가진 [멤버 함수](functions.md#member-functions) 또는 [확장 함수](extensions.md)를 제공하세요. 이 타입은 이항 연산(binary operation)에서는 좌항(left-hand side) 타입이 되고, 단항 연산(unary operation)에서는 인자(argument) 타입이 됩니다.

연산자를 오버로딩하려면 해당 함수에 `operator` 수정자(modifier)를 붙여야 합니다.

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
연산자 오버로딩을 [오버라이딩](inheritance.md#overriding-methods)할 때는 `operator`를 생략할 수 있습니다.

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 단항 연산 (Unary operations)

### 단항 접두사 연산자 (Unary prefix operators)

| 표현식 | 다음으로 변환됨 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

이 표는 컴파일러가 예를 들어 `+a`라는 표현식을 처리할 때 다음 단계를 수행함을 나타냅니다.

* `a`의 타입을 결정합니다. 이를 `T`라고 합시다.
* 수신 객체(receiver) `T`에 대해 `operator` 수정자가 있고 매개변수가 없는 함수 `unaryPlus()`를 찾습니다. 이는 멤버 함수이거나 확장 함수일 수 있습니다.
* 함수가 없거나 모호한 경우, 컴파일 에러가 발생합니다.
* 함수가 존재하고 반환 타입이 `R`이면, 표현식 `+a`는 `R` 타입을 가집니다.

> 이러한 연산자들과 다른 모든 연산자들은 [기본 타입](types-overview.md)에 대해 최적화되어 있으며, 해당 타입들에 대해서는 함수 호출로 인한 오버헤드가 발생하지 않습니다.
>
{style="note"}

예를 들어, 다음은 단항 마이너스 연산자를 오버로딩하는 방법입니다.

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // "Point(x=-10, y=-20)" 출력
}
```
{kotlin-runnable="true"}

### 증감 연산자 (Increments and decrements)

| 표현식 | 다음으로 변환됨 |
|------------|---------------|
| `a++` | `a.inc()` + 아래 내용 참조 |
| `a--` | `a.dec()` + 아래 내용 참조 |

`inc()`와 `dec()` 함수는 반드시 값을 반환해야 하며, 이 값은 `++` 또는 `--` 연산이 사용된 변수에 할당됩니다. 이 함수들은 `inc` 또는 `dec`이 호출된 객체 자체를 직접 변경(mutate)해서는 안 됩니다.

컴파일러는 *후위(postfix)* 형식의 연산자(예: `a++`)를 해결하기 위해 다음 단계를 수행합니다.

* `a`의 타입을 결정합니다. 이를 `T`라고 합시다.
* `T` 타입의 수신 객체에 적용 가능한, `operator` 수정자가 있고 매개변수가 없는 함수 `inc()`를 찾습니다.
* 함수의 반환 타입이 `T`의 하위 타입(subtype)인지 확인합니다.

표현식을 계산한 결과는 다음과 같습니다.

* `a`의 초기 값을 임시 저장소 `a0`에 저장합니다.
* `a0.inc()`의 결과를 `a`에 할당합니다.
* 표현식의 결과로 `a0`을 반환합니다.

`a--`에 대해서도 단계는 완전히 동일합니다.

*전위(prefix)* 형식인 `++a`와 `--a`의 경우도 동일한 방식으로 해결되며, 그 결과는 다음과 같습니다.

* `a.inc()`의 결과를 `a`에 할당합니다.
* 표현식의 결과로 `a`의 새로운 값을 반환합니다.

## 이항 연산 (Binary operations)

### 산술 연산자 (Arithmetic operators)

| 표현식 | 다음으로 변환됨 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

이 표의 연산들에 대해 컴파일러는 단순히 "다음으로 변환됨" 열에 있는 표현식으로 해결합니다.

아래는 지정된 값에서 시작하여 오버로딩된 `+` 연산자를 사용하여 증가시킬 수 있는 `Counter` 클래스의 예시입니다.

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 연산자

| 표현식 | 다음으로 변환됨 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

`in`과 `!in`의 경우 절차는 동일하지만, 인자의 순서가 반대로 바뀝니다.

### 인덱스 접근 연산자 (Indexed access operator)

| 표현식 | 다음으로 변환됨 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

대괄호 `[]`는 적절한 수의 인자를 가진 `get` 및 `set` 호출로 변환됩니다.

### invoke 연산자

| 표현식 | 다음으로 변환됨 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

괄호 `()`는 적절한 수의 인자를 가진 `invoke` 호출로 변환됩니다.

### 복합 대입 연산자 (Augmented assignments)

| 표현식 | 다음으로 변환됨 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

대입 연산(예: `a += b`)의 경우 컴파일러는 다음 단계를 수행합니다.

* 오른쪽 열의 함수를 사용할 수 있는 경우:
  * 대응하는 이항 함수(즉, `plusAssign()`에 대응하는 `plus()`)도 사용할 수 있고, `a`가 가변(mutable) 변수이며, `plus`의 반환 타입이 `a` 타입의 하위 타입인 경우, 에러(모호성)를 보고합니다.
  * 함수의 반환 타입이 `Unit`인지 확인하고, 그렇지 않으면 에러를 보고합니다.
  * `a.plusAssign(b)`에 대한 코드를 생성합니다.
* 그렇지 않은 경우, `a = a + b`에 대한 코드 생성을 시도합니다(이때 `a + b`의 타입이 `a`의 하위 타입이어야 한다는 타입 검사가 포함됩니다).

> Kotlin에서 대입(Assignments)은 표현식(expressions)이 *아닙니다*.
>
{style="note"}

### 동등성 및 부등성 연산자 (Equality and inequality operators)

| 표현식 | 다음으로 변환됨 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

이 연산자들은 오직 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 함수하고만 작동하며, 커스텀 동등성 검사 구현을 제공하기 위해 이 함수를 오버라이드할 수 있습니다.
이름이 같은 다른 함수(예: `equals(other: Foo)`)는 무시됩니다.

Kotlin은 `==` 표현식에서 두 피연산자 모두 `null`과 직접 비교되지 않고 비교 대상이 두 부동 소수점 타입이 아닐 때 `.equals()`를 호출합니다.
그 외의 경우, Kotlin은 직접적인 `null` 비교를 위해 `===`를 사용하며, null이 아닌 부동 소수점 값은 수치 값으로 비교합니다.

> `===` 및 `!==` (식별성 확인, identity checks)은 오버로딩할 수 없으므로 이에 대한 관례(conventions)는 존재하지 않습니다.
>
{style="note"}

### 비교 연산자 (Comparison operators)

| 표현식 | 다음으로 변환됨 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

모든 비교는 `Int`를 반환해야 하는 `compareTo` 호출로 변환됩니다.

### 프로퍼티 위임 연산자 (Property delegation operators)

`provideDelegate`, `getValue`, `setValue` 연산자 함수는 [위임된 프로퍼티](delegated-properties.md)에서 설명합니다.

## 명명된 함수에 대한 중위 호출 (Infix calls for named functions)

[중위 함수 호출(infix function calls)](functions.md#infix-notation)을 사용하여 커스텀 중위 연산을 흉내 낼 수 있습니다.