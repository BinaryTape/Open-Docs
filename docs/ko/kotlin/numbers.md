[//]: # (title: 숫자)

## 정수 타입

코틀린은 숫자를 나타내는 일련의 내장 타입을 제공합니다.
정수의 경우, 크기와 값의 범위가 다른 네 가지 타입이 있습니다:

| 타입 | 크기 (비트) | 최솟값 | 최댓값 |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte` | 8 | -128 | 127 |
| `Short` | 16 | -32768 | 32767 |
| `Int` | 32 | -2,147,483,648 (-2<sup>31</sup>) | 2,147,483,647 (2<sup>31</sup> - 1) |
| `Long` | 64 | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 코틀린은 부호 있는(signed) 정수 타입 외에도 부호 없는(unsigned) 정수 타입을 제공합니다.
> 부호 없는 정수는 사용 사례가 다르므로 별도로 다룹니다.
> [](unsigned-integer-types.md)를 참고하세요.
> 
{style="tip"}

명시적인 타입 지정 없이 변수를 초기화하면, 컴파일러는 `Int`부터 시작하여 해당 값을 나타내기에 충분한 가장 작은 범위의 타입을 자동으로 추론합니다. `Int` 범위를 초과하지 않으면 타입은 `Int`가 됩니다. 범위를 초과하면 타입은 `Long`이 됩니다. `Long` 값을 명시적으로 지정하려면 값 뒤에 접미사 `L`을 붙입니다.
`Byte`나 `Short` 타입을 사용하려면 선언 시 타입을 명시적으로 지정해야 합니다. 명시적 타입 지정이 있으면 컴파일러는 값이 지정된 타입의 범위를 초과하지 않는지 확인합니다.

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 부동 소수점 타입

실수의 경우, 코틀린은 [IEEE 754 표준](https://en.wikipedia.org/wiki/IEEE_754)을 준수하는 부동 소수점 타입 `Float`와 `Double`을 제공합니다.
`Float`는 IEEE 754 *단정밀도(single precision)*를 반영하며, `Double`은 *배정밀도(double precision)*를 반영합니다.

이 타입들은 크기가 다르며 서로 다른 정밀도로 부동 소수점 숫자를 저장할 수 있습니다:

| 타입 | 크기 (비트) | 유효 비트 | 지수 비트 | 10진수 자릿수 |
|----------|-------------|------------------|---------------|----------------|
| `Float` | 32 | 24 | 8 | 6-7 |
| `Double` | 64 | 53 | 11 | 15-16 |    

`Double`과 `Float` 변수는 소수 부분이 있는 숫자로만 초기화할 수 있습니다.
정수 부분과 소수 부분은 마침표(`.`)로 구분합니다.

소수점이 있는 숫자로 초기화된 변수의 경우, 컴파일러는 `Double` 타입으로 추론합니다:

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int가 추론됨
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

값에 대해 `Float` 타입을 명시적으로 지정하려면 접미사 `f` 또는 `F`를 추가합니다.
이런 방식으로 제공된 값이 10진수 7자리를 초과하면 반올림됩니다:

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, 실제 값은 2.7182817
```

일부 다른 언어와 달리, 코틀린에서는 숫자에 대한 암시적 확장 변환(implicit widening conversions)이 없습니다.
예를 들어, `Double` 매개변수가 있는 함수는 `Double` 값으로만 호출할 수 있으며 `Float`, `Int` 또는 다른 숫자 값으로는 호출할 수 없습니다:

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

숫자 값을 다른 타입으로 변환하려면 [명시적 변환](#명시적-숫자-변환)을 사용하세요.

## 숫자 리터럴 상수

정수 값에 대한 리터럴 상수는 다음과 같은 종류가 있습니다:

* 10진수: `123`
* Long (대문자 `L`로 끝남): `123L`
* 16진수: `0x0F`
* 2진수: `0b00001011`

> 코틀린에서는 8진수 리터럴을 지원하지 않습니다.
>
{style="note"}

코틀린은 부동 소수점 숫자에 대한 전통적인 표기법도 지원합니다:

* Double (기본값, 소수 부분이 문자로 끝나지 않는 경우): `123.5`, `123.5e10`
* Float (`f` 또는 `F` 문자로 끝남): `123.5f`

밑줄(`_`)을 사용하여 숫자 상수의 가독성을 높일 수 있습니다:

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 부호 없는 정수 리터럴에 대한 특별한 접미사도 있습니다.
> [부호 없는 정수 타입의 리터럴](unsigned-integer-types.md)에 대해 자세히 알아보세요.
> 
{style="tip"}

## 자바 가상 머신(JVM)에서의 숫자 박싱 및 캐싱

JVM은 `int`, `long`, `double`과 같은 기본 타입(primitive types)을 사용하여 null이 될 수 없는(non-nullable) 숫자 값을 저장합니다.
하지만 [제네릭 타입(generic types)](generics.md)을 사용하거나 `Int?`와 같이 nullable 숫자 타입을 사용할 때, 값은 박싱되어(boxed) 객체로 표현됩니다.

JVM은 작은 숫자의 박싱된 표현을 캐싱하여 [메모리 최적화 기법](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)을 적용합니다. 결과적으로, 동일한 값을 가진 박싱된 숫자들은 [참조 동등성(referential equality)](equality.md#referential-equality)을 가질 수 있습니다.

예를 들어, JVM은 `-128`에서 `127` 사이의 범위에 있는 박싱된 `Integer` 값을 캐싱합니다. 따라서 다음 코드는 `true`를 결과로 냅니다:

```kotlin
fun main() {
//sampleStart
    val score: Int = 100
    val savedScore: Int? = score
    val displayedScore: Int? = score
    
    println(savedScore === displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

캐싱된 범위를 벗어나는 숫자의 경우, 박싱된 값들은 별개의 객체입니다. 이 경우 값이 [구조적 동등성(structural equality)](equality.md#structural-equality)을 가지더라도 참조 동등성은 성립하지 않습니다. 이러한 이유로 숫자 값을 비교할 때는 `==`를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore) // false
    println(savedScore == displayedScore)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 명시적 숫자 변환

서로 다른 표현 방식 때문에 숫자 타입들은 서로의 *하위 타입(subtype)이 아닙니다*.
결과적으로, 더 작은 타입이 더 큰 타입으로 암시적으로 변환되지 않으며 그 반대도 마찬가지입니다.
예를 들어, `Byte` 타입의 값을 `Int` 변수에 할당하려면 명시적 변환이 필요합니다:

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK, 리터럴은 정적으로 확인됨
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

모든 숫자 타입은 다른 타입으로의 변환을 지원합니다:

* `toByte(): Byte` ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 및 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html)에서는 사용 중단됨)
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

문맥에서 타입이 추론되고 산술 연산자가 자동으로 변환을 처리하도록 오버로딩되어 있으므로, 많은 경우 명시적 변환이 필요하지 않습니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 암시적 변환을 사용하지 않는 이유

코틀린은 예상치 못한 동작을 초래할 수 있기 때문에 암시적 변환을 지원하지 않습니다.

서로 다른 타입의 숫자가 암시적으로 변환된다면, 때때로 동등성(equality)과 식별성(identity)을 소리 없이 잃을 수 있습니다.
예를 들어, `Int`가 `Long`의 하위 타입이라고 가정해 보겠습니다:

```kotlin
// 가상의 코드이며 실제로 컴파일되지 않습니다:
val a: Int? = 1    // 박싱된 Int (java.lang.Integer)
val b: Long? = a   // 암시적 변환으로 박싱된 Long (java.lang.Long)이 됨
print(b == a)      // Long.equals()가 값뿐만 아니라 다른 숫자도 Long인지 확인하므로 "false"를 출력함
```

## 숫자 연산

코틀린은 숫자에 대해 표준 산술 연산 세트인 `+`, `-`, `*`, `/`, `%`를 지원합니다. 이들은 적절한 클래스의 멤버로 선언되어 있습니다:

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

커스텀 숫자 클래스에서 이러한 연산자를 오버라이드할 수 있습니다.
자세한 내용은 [연산자 오버로딩](operator-overloading.md)을 참고하세요.

### 정수 나눗셈

정수 간의 나눗셈은 항상 정수를 반환합니다. 소수 부분은 버려집니다.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // '==' 연산자를 'Int'와 'Double'에 적용할 수 없음
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

이는 임의의 두 정수 타입 간의 나눗셈에도 해당됩니다:

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // Long(x)을 Int(2)와 비교할 수 없으므로 오류 발생
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

나눗셈 결과를 소수 부분까지 포함하여 반환하려면 인수 중 하나를 부동 소수점 타입으로 명시적으로 변환하세요:

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

코틀린은 정수 숫자에 대해 일련의 *비트 연산(bitwise operations)*을 제공합니다. 이는 숫자 표현의 비트를 직접 다루는 바이너리 레벨에서 작동합니다.
비트 연산은 중위(infix) 형태로 호출할 수 있는 함수로 표현됩니다. `Int`와 `Long`에만 적용할 수 있습니다:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

비트 연산의 전체 목록은 다음과 같습니다:

* `shl(bits)` – 부호 있는 왼쪽 시프트 (signed shift left)
* `shr(bits)` – 부호 있는 오른쪽 시프트 (signed shift right)
* `ushr(bits)` – 부호 없는 오른쪽 시프트 (unsigned shift right)
* `and(bits)` – 비트 단위 **AND**
* `or(bits)` – 비트 단위 **OR**
* `xor(bits)` – 비트 단위 **XOR**
* `inv()` – 비트 단위 반전 (bitwise inversion)

### 부동 소수점 숫자 비교

이 섹션에서 다루는 부동 소수점 숫자에 대한 연산은 다음과 같습니다:

* 동등성 검사: `a == b` 및 `a != b`
* 비교 연산자: `a < b`, `a > b`, `a <= b`, `a >= b`
* 범위 생성 및 범위 검사: `a..b`, `x in a..b`, `x !in a..b`

피연산자 `a`와 `b`가 `Float` 또는 `Double`이거나 그들의 nullable 대응 타입임이 정적으로 알려진 경우(타입이 선언되었거나 추론되었거나 [스마트 캐스트](typecasts.md#smart-casts)의 결과인 경우), 숫자와 숫자가 형성하는 범위에 대한 연산은 [IEEE 754 부동 소수점 산술 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따릅니다.

하지만 제네릭 사용 사례를 지원하고 전체 순서(total ordering)를 제공하기 위해, 부동 소수점 숫자로 **정적으로 타입이 지정되지 않은** 피연산자에 대해서는 동작이 다릅니다. 예를 들어 `Any`, `Comparable<...>`, 또는 `Collection<T>` 타입이 있습니다. 이 경우 연산은 `Float`와 `Double`에 대한 `equals` 및 `compareTo` 구현을 사용합니다. 그 결과는 다음과 같습니다:

* `NaN`은 자기 자신과 같은 것으로 간주됩니다.
* `NaN`은 `POSITIVE_INFINITY`를 포함한 다른 모든 요소보다 큰 것으로 간주됩니다.
* `-0.0`은 `0.0`보다 작은 것으로 간주됩니다.

다음은 정적으로 부동 소수점 숫자로 타입이 지정된 피연산자(`Double.NaN`)와 정적으로 부동 소수점 숫자로 타입이 지정되지 않은 피연산자(`listOf(T)`) 간의 동작 차이를 보여주는 예시입니다.

```kotlin
fun main() {
    //sampleStart
    // 피연산자가 정적으로 부동 소수점 숫자로 타입 지정됨
    println(Double.NaN == Double.NaN)                 // false
    
    // 피연산자가 정적으로 부동 소수점 숫자로 타입 지정되지 않음
    // 따라서 NaN은 자기 자신과 같음
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // 피연산자가 정적으로 부동 소수점 숫자로 타입 지정됨
    println(0.0 == -0.0)                              // true
    
    // 피연산자가 정적으로 부동 소수점 숫자로 타입 지정되지 않음
    // 따라서 -0.0은 0.0보다 작음
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}