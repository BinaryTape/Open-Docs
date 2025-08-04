[//]: # (title: 숫자)

## 정수 타입

Kotlin은 숫자를 나타내는 내장 타입을 제공합니다.
정수 타입은 크기와 값 범위가 다른 네 가지 타입이 있습니다.

| 타입	    | 크기 (비트) | 최솟값                                       | 최댓값                                       |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 부호 있는 정수 타입 외에도 Kotlin은 부호 없는 정수 타입을 제공합니다.
> 부호 없는 정수는 다른 용도에 맞춰져 있으므로 별도로 다룹니다.
> [](unsigned-integer-types.md)를 참조하세요.
>
{style="tip"}

변수를 명시적인 타입 지정 없이 초기화하면 컴파일러는 값을 나타내기에 충분한 가장 작은 범위를 가진 타입을 `Int`부터 추론합니다. 값이 `Int`의 범위를 초과하지 않으면 타입은 `Int`가 됩니다.
범위를 초과하면 `Long` 타입이 됩니다. `Long` 값을 명시적으로 지정하려면 값에 접미사 `L`을 추가합니다.
`Byte` 또는 `Short` 타입을 사용하려면 선언에서 명시적으로 지정해야 합니다.
명시적 타입 지정은 컴파일러가 지정된 타입의 범위를 값이 초과하지 않는지 확인하도록 트리거합니다.

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 부동 소수점 타입

실수(real numbers)의 경우 Kotlin은 [IEEE 754 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따르는 부동 소수점 타입 `Float` 및 `Double`을 제공합니다.
`Float`는 IEEE 754 _단정밀도(single precision)_를 반영하며, `Double`은 _배정밀도(double precision)_를 반영합니다.

이 타입들은 크기가 다르며, 다른 정밀도로 부동 소수점 숫자를 저장할 수 있습니다.

| 타입	    | 크기 (비트) | 유효 비트 | 지수 비트 | 10진수 자릿수 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |

`Double` 및 `Float` 변수는 소수 부분이 있는 숫자로만 초기화할 수 있습니다.
소수 부분은 마침표(`.`)로 정수 부분과 구분합니다.

소수(fractional numbers)로 초기화된 변수의 경우 컴파일러는 `Double` 타입을 추론합니다.

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

값에 대해 `Float` 타입을 명시적으로 지정하려면 접미사 `f` 또는 `F`를 추가합니다.
이 방식으로 제공된 값이 7자리 이상의 10진수 자릿수를 포함하면 반올림됩니다.

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

다른 일부 언어와 달리 Kotlin에서는 숫자에 대한 암시적 확장 변환이 없습니다.
예를 들어, `Double` 파라미터를 가진 함수는 `Double` 값에 대해서만 호출할 수 있으며, `Float`, `Int` 또는 다른 숫자 값에는 호출할 수 없습니다.

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

숫자 값을 다른 타입으로 변환하려면 [명시적 숫자 변환](#explicit-number-conversions)을 사용하세요.

## 숫자 리터럴 상수

정수 값에 대한 여러 종류의 리터럴 상수가 있습니다.

*   10진수: `123`
*   대문자 `L`로 끝나는 `Long` 타입: `123L`
*   16진수: `0x0F`
*   2진수: `0b00001011`

> 8진수 리터럴은 Kotlin에서 지원되지 않습니다.
>
{style="note"}

Kotlin은 부동 소수점 숫자에 대한 일반적인 표기법도 지원합니다.

*   `Double` (소수 부분이 문자로 끝나지 않는 경우 기본값): `123.5`, `123.5e10`
*   문자 `f` 또는 `F`로 끝나는 `Float` 타입: `123.5f`

숫자 상수를 더 읽기 쉽게 하기 위해 밑줄을 사용할 수 있습니다.

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 부호 없는 정수 리터럴에는 특별한 접미사도 있습니다.
> [부호 없는 정수 타입의 리터럴](unsigned-integer-types.md)에 대해 자세히 알아보세요.
>
{style="tip"}

## Java Virtual Machine에서 숫자의 박싱 및 캐싱

JVM이 숫자를 저장하는 방식은 작은 (바이트 크기의) 숫자에 대해 기본적으로 사용되는 캐시 때문에 코드가 직관적이지 않게 동작할 수 있습니다.

JVM은 숫자를 `int`, `double` 등과 같은 기본 타입(primitive types)으로 저장합니다.
[제네릭 타입](generics.md)을 사용하거나 `Int?`와 같은 널 허용(nullable) 숫자 참조를 생성하면 숫자는 `Integer` 또는 `Double`과 같은 Java 클래스로 박싱됩니다.

JVM은 `Integer` 및 `−128`에서 `127` 사이의 숫자를 나타내는 다른 객체에 [메모리 최적화 기법](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)을 적용합니다.
이러한 객체에 대한 모든 널 허용 참조는 동일한 캐시된 객체를 참조합니다.
예를 들어, 다음 코드의 널 허용 객체는 [참조 동등성](equality.md#referential-equality)을 가집니다.

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이 범위를 벗어나는 숫자의 경우, 널 허용 객체는 다르지만 [구조적으로 동일합니다](equality.md#structural-equality).

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이러한 이유로 Kotlin은 박싱 가능한 숫자 및 리터럴과 함께 참조 동등성을 사용하는 것에 대해 `"Identity equality for arguments of types ... and ... is prohibited."`와 같은 메시지로 경고합니다.
`Int`, `Short`, `Long`, `Byte` 타입 (및 `Char`, `Boolean` 타입)을 비교할 때는 일관된 결과를 얻기 위해 구조적 동등성 검사를 사용하세요.

## 명시적 숫자 변환

서로 다른 표현 방식 때문에 숫자 타입은 서로의 _하위 타입이 아닙니다_.
결과적으로, 작은 타입은 큰 타입으로 암시적으로 변환되지 않으며 그 반대도 마찬가지입니다.
예를 들어, `Byte` 타입의 값을 `Int` 변수에 할당하려면 명시적 변환이 필요합니다.

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

모든 숫자 타입은 다른 타입으로의 변환을 지원합니다.

*   `toByte(): Byte` ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 및 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html)의 경우 사용 중단됨)
*   `toShort(): Short`
*   `toInt(): Int`
*   `toLong(): Long`
*   `toFloat(): Float`
*   `toDouble(): Double`

많은 경우, 타입이 문맥에서 추론되고 산술 연산자가 자동 변환을 처리하도록 오버로드되어 있기 때문에 명시적 변환이 필요하지 않습니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 암시적 변환 반대 이유

Kotlin은 암시적 변환이 예상치 못한 동작으로 이어질 수 있기 때문에 이를 지원하지 않습니다.

만약 다른 타입의 숫자가 암시적으로 변환된다면, 때때로 동등성과 식별자(identity)를 알 수 없게 잃을 수 있습니다.
예를 들어, `Int`가 `Long`의 하위 타입이라고 가정해 봅시다.

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 숫자 연산

Kotlin은 `+`, `-`, `*`, `/`, `%`와 같은 표준 산술 연산을 지원합니다. 이 연산자들은 적절한 클래스의 멤버로 선언됩니다.

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

사용자 정의 숫자 클래스에서 이러한 연산자를 오버라이드할 수 있습니다.
자세한 내용은 [연산자 오버로딩](operator-overloading.md)을 참조하세요.

### 정수 나눗셈

정수 간의 나눗셈은 항상 정수를 반환합니다. 소수 부분은 버려집니다.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

이것은 어떤 두 정수 타입 간의 나눗셈에도 적용됩니다.

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

소수 부분을 포함하는 나눗셈 결과를 반환하려면 인자 중 하나를 명시적으로 부동 소수점 타입으로 변환하세요.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 비트 연산

Kotlin은 정수에 대한 _비트 연산(bitwise operations)_을 제공합니다. 이 연산은 숫자의 이진 표현 비트와 직접적으로 이진 수준에서 작동합니다.
비트 연산은 중위 형식(infix form)으로 호출할 수 있는 함수로 표현됩니다. 이 연산은 `Int`와 `Long`에만 적용될 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0
//sampleEnd
}
```

비트 연산의 전체 목록:

*   `shl(bits)` – 부호 있는 왼쪽 시프트 (signed shift left)
*   `shr(bits)` – 부호 있는 오른쪽 시프트 (signed shift right)
*   `ushr(bits)` – 부호 없는 오른쪽 시프트 (unsigned shift right)
*   `and(bits)` – 비트 AND
*   `or(bits)` – 비트 OR
*   `xor(bits)` – 비트 XOR
*   `inv()` – 비트 반전 (bitwise inversion)

### 부동 소수점 숫자 비교

이 섹션에서 다루는 부동 소수점 숫자 연산은 다음과 같습니다.

*   동등성 검사: `a == b` 및 `a != b`
*   비교 연산자: `a < b`, `a > b`, `a <= b`, `a >= b`
*   범위 인스턴스화 및 범위 검사: `a..b`, `x in a..b`, `x !in a..b`

피연산자 `a`와 `b`가 `Float` 또는 `Double`이거나 이들의 널 허용(nullable) 대응 타입(타입이 선언되거나 추론되거나 [스마트 캐스트](typecasts.md#smart-casts)의 결과인 경우)으로 정적으로 알려진 경우, 숫자 연산 및 이들이 형성하는 범위는 [IEEE 754 부동 소수점 산술 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따릅니다.

그러나 제네릭 사용 사례를 지원하고 전체 순서(total ordering)를 제공하기 위해 **정적으로 부동 소수점 타입으로 지정되지 않은** 피연산자의 경우 동작이 다릅니다. 예를 들어, `Any`, `Comparable<...>`, 또는 `Collection<T>` 타입과 같은 경우입니다. 이 경우 연산은 `Float` 및 `Double`에 대한 `equals` 및 `compareTo` 구현을 사용합니다. 그 결과:

*   `NaN`은 자신과 동일하게 간주됩니다.
*   `NaN`은 `POSITIVE_INFINITY`를 포함한 다른 모든 요소보다 큰 것으로 간주됩니다.
*   `-0.0`은 `0.0`보다 작은 것으로 간주됩니다.

다음은 정적으로 부동 소수점 타입으로 지정된 피연산자 (`Double.NaN`)와 정적으로 부동 소수점 타입으로 지정되지 않은 피연산자 (`listOf(T)`) 간의 동작 차이를 보여주는 예시입니다.

```kotlin
fun main() {
    //sampleStart
    // Operand statically typed as floating-point number
    println(Double.NaN == Double.NaN)                 // false
    
    // Operand NOT statically typed as floating-point number
    // So NaN is equal to itself
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // Operand statically typed as floating-point number
    println(0.0 == -0.0)                              // true
    
    // Operand NOT statically typed as floating-point number
    // So -0.0 is less than 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}