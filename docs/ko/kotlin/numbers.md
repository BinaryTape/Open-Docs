---
title: 숫자
---
## 정수형

Kotlin은 숫자를 나타내는 여러 기본 제공 타입을 제공합니다.
정수의 경우, 크기와 값의 범위가 다른 네 가지 타입이 있습니다.

| 타입	    | 크기 (비트) | 최소값                                    | 최대값                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |
:::note
Kotlin은 부호 있는 정수 타입 외에도 부호 없는 정수 타입을 제공합니다.
부호 없는 정수는 다른 사용 사례를 대상으로 하므로 별도로 다룹니다.
[](unsigned-integer-types)를 참조하세요.

명시적인 타입 지정 없이 변수를 초기화하면 컴파일러는 `Int`부터 시작하여 값을 나타내기에 충분한 가장 작은 범위의 타입을 자동으로 추론합니다. `Int`의 범위를 초과하지 않으면 타입은 `Int`입니다.
해당 범위를 초과하면 타입은 `Long`입니다. `Long` 값을 명시적으로 지정하려면 값에 접미사 `L`을 추가합니다.
`Byte` 또는 `Short` 타입을 사용하려면 선언에서 명시적으로 지정합니다.
명시적 타입 지정은 컴파일러가 값이 지정된 타입의 범위를 초과하지 않는지 확인하도록 합니다.

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 부동 소수점 타입

실수의 경우 Kotlin은 [IEEE 754 표준](https://en.wikipedia.org/wiki/IEEE_754)을 준수하는 부동 소수점 타입 `Float`과 `Double`을 제공합니다.
`Float`은 IEEE 754 _단정밀도_를 반영하고 `Double`은 _배정밀도_를 반영합니다.

이러한 타입은 크기가 다르며 정밀도가 다른 부동 소수점 숫자를 저장할 수 있습니다.

| 타입	    | 크기 (비트) | 유효 비트 | 지수 비트 | 십진수 자릿수 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

`Double` 및 `Float` 변수는 소수 부분이 있는 숫자만으로 초기화할 수 있습니다.
소수 부분은 정수 부분과 마침표(`.`)로 구분합니다.

소수 숫자로 초기화된 변수의 경우 컴파일러는 `Double` 타입을 추론합니다.

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```

값에 대해 `Float` 타입을 명시적으로 지정하려면 접미사 `f` 또는 `F`를 추가합니다.
이러한 방식으로 제공된 값이 7자리 이상의 소수 자릿수를 포함하는 경우 반올림됩니다.

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

다른 일부 언어와 달리 Kotlin에는 숫자에 대한 암시적 확장 변환이 없습니다.
예를 들어 `Double` 파라미터가 있는 함수는 `Double` 값에서만 호출할 수 있지만 `Float`, `Int` 또는 기타 숫자 값에서는 호출할 수 없습니다.

```kotlin
fun main() {

    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch

}
```

숫자 값을 다른 타입으로 변환하려면 [명시적 숫자 변환](#explicit-number-conversions)을 사용하세요.

## 숫자의 리터럴 상수

정수 값에 대한 여러 종류의 리터럴 상수가 있습니다.

* 십진수: `123`
* Long, 대문자 `L`로 끝남: `123L`
* 16진수: `0x0F`
* 2진수: `0b00001011`

8진 리터럴은 Kotlin에서 지원되지 않습니다.

:::

Kotlin은 또한 부동 소수점 숫자에 대한 기존 표기법을 지원합니다.

* Doubles (소수 부분이 문자로 끝나지 않는 경우 기본값): `123.5`, `123.5e10`
* Floats, 문자 `f` 또는 `F`로 끝남: `123.5f`

밑줄을 사용하여 숫자 상수를 더 읽기 쉽게 만들 수 있습니다.

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

:::tip
부호 없는 정수 리터럴에 대한 특수한 접미사도 있습니다.  
[부호 없는 정수 타입의 리터럴](unsigned-integer-types)에 대해 자세히 알아보세요.

:::

## Java Virtual Machine에서 숫자 박싱 및 캐싱

JVM이 숫자를 저장하는 방식은 작은(바이트 크기) 숫자에 대해 기본적으로 사용되는 캐시로 인해 코드가 직관에 어긋나게 동작하게 할 수 있습니다.

JVM은 숫자를 기본 타입인 `int`, `double` 등으로 저장합니다.
[제네릭 타입](generics)을 사용하거나 `Int?`와 같이 nullable 숫자 참조를 생성하면 숫자는 `Integer` 또는 `Double`과 같은 Java 클래스에 박싱됩니다.

JVM은 `−128`과 `127` 사이의 숫자를 나타내는 `Integer` 및 기타 객체에 [메모리 최적화 기술](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)을 적용합니다.
이러한 객체에 대한 모든 nullable 참조는 동일한 캐시된 객체를 참조합니다.
예를 들어 다음 코드의 nullable 객체는 [참조적으로 동일](equality#referential-equality)합니다.

```kotlin
fun main() {

    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true

}
```

이 범위를 벗어난 숫자의 경우 nullable 객체는 서로 다르지만 [구조적으로 동일](equality#structural-equality)합니다.

```kotlin
fun main() {

    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true

}
```

이러한 이유로 Kotlin은 박싱 가능한 숫자 및 리터럴에 대해 참조적 동일성을 사용하는 것에 대해 다음과 같은 메시지로 경고합니다. `"... 및 ... 타입의 인수에 대한 ID 동일성은 금지됩니다."`
`Int`, `Short`, `Long` 및 `Byte` 타입(및 `Char` 및 `Boolean`)을 비교할 때는 일관된 결과를 얻으려면 구조적 동일성 검사를 사용하세요.

## 명시적 숫자 변환

서로 다른 표현으로 인해 숫자 타입은 서로의 _하위 타입이 아닙니다_.
결과적으로 더 작은 타입은 더 큰 타입으로 암시적으로 변환되지 않으며 그 반대도 마찬가지입니다.
예를 들어 `Byte` 타입의 값을 `Int` 변수에 할당하려면 명시적 변환이 필요합니다.

```kotlin
fun main() {

    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)

}
```

모든 숫자 타입은 다른 타입으로의 변환을 지원합니다.

* `toByte(): Byte` ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 및 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html)의 경우 더 이상 사용되지 않음)
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

대부분의 경우 타입이 컨텍스트에서 추론되고 산술 연산자가 변환을 자동으로 처리하도록 오버로드되므로 명시적 변환이 필요하지 않습니다. 예를 들면 다음과 같습니다.

```kotlin
fun main() {

    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true

}
```

### 암시적 변환에 대한 반론

Kotlin은 예기치 않은 동작으로 이어질 수 있으므로 암시적 변환을 지원하지 않습니다.

서로 다른 타입의 숫자가 암시적으로 변환되면 때때로 동등성과 ID를 자동으로 잃을 수 있습니다.
예를 들어 `Int`가 `Long`의 하위 타입이라고 상상해 보세요.

```kotlin
// 가상 코드, 실제로 컴파일되지는 않습니다.
val a: Int? = 1    // 박싱된 Int (java.lang.Integer)
val b: Long? = a   // 암시적 변환은 박싱된 Long (java.lang.Long)을 생성합니다.
print(b == a)      // Long.equals()는 값뿐만 아니라 다른 숫자가 Long인지도 확인하므로 "false"를 출력합니다.
```

## 숫자에 대한 연산

Kotlin은 숫자에 대한 표준 산술 연산 세트인 `+`, `-`, `*`, `/`, `%`를 지원합니다. 해당 연산은 적절한 클래스의 멤버로 선언됩니다.

```kotlin
fun main() {

    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)

}
```

사용자 지정 숫자 클래스에서 이러한 연산자를 재정의할 수 있습니다.
자세한 내용은 [연산자 오버로딩](operator-overloading)을 참조하세요.

### 정수 나누기

정수 숫자 간의 나누기는 항상 정수 숫자를 반환합니다. 모든 소수 부분은 삭제됩니다.

```kotlin
fun main() {

    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true

}
```

이는 두 정수 타입 간의 나누기에 해당합니다.

```kotlin
fun main() {

    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true

}
```

소수 부분이 있는 나누기 결과를 반환하려면 인수 중 하나를 부동 소수점 타입으로 명시적으로 변환합니다.

```kotlin
fun main() {

    val x = 5 / 2.toDouble()
    println(x == 2.5)

}
```

### 비트 연산

Kotlin은 정수 숫자에 대한 _비트 연산_ 세트를 제공합니다. 이는 숫자의 표현의 비트를 사용하여 직접 이진 수준에서 작동합니다.
비트 연산은 infix 형식으로 호출할 수 있는 함수로 표현됩니다. `Int` 및 `Long`에만 적용할 수 있습니다.

```kotlin
fun main() {

    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0

}
```

비트 연산의 전체 목록:

* `shl(bits)` – 부호 있는 왼쪽 시프트
* `shr(bits)` – 부호 있는 오른쪽 시프트
* `ushr(bits)` – 부호 없는 오른쪽 시프트
* `and(bits)` – 비트 **AND**
* `or(bits)` – 비트 **OR**
* `xor(bits)` – 비트 **XOR**
* `inv()` – 비트 반전

### 부동 소수점 숫자 비교

이 섹션에서 설명하는 부동 소수점 숫자에 대한 연산은 다음과 같습니다.

* 동등성 검사: `a == b` 및 `a != b`
* 비교 연산자: `a < b`, `a > b`, `a <= b`, `a >= b`
* 범위 인스턴스화 및 범위 검사: `a..b`, `x in a..b`, `x !in a..b`

피연산자 `a`와 `b`가 정적으로 `Float` 또는 `Double`이거나 해당 nullable 대응 객체인 것으로 알려진 경우(타입이
선언되거나 추론되거나 [스마트 캐스트](typecasts#smart-casts)의 결과인 경우) 숫자에 대한 연산과 해당 숫자가 형성하는 범위는 [부동 소수점 산술에 대한 IEEE 754 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따릅니다.

그러나 제네릭 사용 사례를 지원하고 전체 순서를 제공하기 위해 동작은 정적으로 부동 소수점 숫자로 타입이 지정 **되지 않은** 피연산자와는 다릅니다. 예를 들어 `Any`, `Comparable<...>` 또는 `Collection<T>` 타입입니다. 이 경우 연산은 `Float` 및 `Double`에 대한 `equals` 및 `compareTo` 구현을 사용합니다. 결과적으로:

* `NaN`은 자체와 동일한 것으로 간주됩니다.
* `NaN`은 `POSITIVE_INFINITY`를 포함한 다른 모든 요소보다 큰 것으로 간주됩니다.
* `-0.0`은 `0.0`보다 작은 것으로 간주됩니다.

다음은 부동 소수점 숫자로 정적으로 타입이 지정된 피연산자(`Double.NaN`)와 정적으로 부동 소수점 숫자로 타입이 지정 **되지 않은** 피연산자(`listOf(T)`) 간의 동작 차이점을 보여주는 예입니다.

```kotlin
fun main() {

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

}
```