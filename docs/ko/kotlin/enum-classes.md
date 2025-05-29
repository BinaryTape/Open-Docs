[//]: # (title: 열거형 클래스)

열거형 클래스의 가장 기본적인 사용 사례는 타입 안전 열거형(type-safe enum)을 구현하는 것입니다:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
각 열거형 상수는 객체입니다. 열거형 상수는 쉼표로 구분됩니다.

각 열거형은 열거형 클래스의 인스턴스이므로, 다음과 같이 초기화할 수 있습니다:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 익명 클래스

열거형 상수는 자체 익명 클래스를 선언할 수 있으며, 해당하는 메서드를 가질 수 있고 기본 메서드를 오버라이드할 수도 있습니다.

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

열거형 클래스가 멤버를 정의하는 경우, 상수 정의와 멤버 정의를 세미콜론으로 구분합니다.

## 열거형 클래스에서 인터페이스 구현하기

열거형 클래스는 인터페이스를 구현할 수 있습니다(단, 클래스를 상속받을 수는 없습니다). 이 경우 모든 엔트리에 대해 인터페이스 멤버의 공통 구현을 제공하거나, 각 엔트리의 익명 클래스 내에서 별도의 구현을 제공할 수 있습니다. 이는 구현하려는 인터페이스를 열거형 클래스 선언에 다음과 같이 추가하여 수행합니다:

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

모든 열거형 클래스는 기본적으로 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 인터페이스를 구현합니다. 열거형 클래스의 상수는 자연 순서(natural order)로 정의됩니다. 자세한 내용은 [정렬](collection-ordering.md)을 참조하세요.

## 열거형 상수 다루기

코틀린의 열거형 클래스에는 정의된 열거형 상수를 나열하고 이름으로 열거형 상수를 가져오기 위한 합성 속성 및 메서드가 있습니다. 이 메서드들의 시그니처는 다음과 같습니다 (열거형 클래스 이름이 `EnumClass`라고 가정합니다):

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

아래는 사용 예시입니다:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

`valueOf()` 메서드는 지정된 이름이 클래스에 정의된 열거형 상수 중 어떤 것과도 일치하지 않는 경우 `IllegalArgumentException`을 발생시킵니다.

코틀린 1.9.0에 `entries`가 도입되기 전에는 열거형 상수의 배열을 가져오기 위해 `values()` 함수가 사용되었습니다.

모든 열거형 상수는 또한 열거형 클래스 선언에서 이름과 위치(0부터 시작)를 얻기 위한 [`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) 및 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html) 속성을 가집니다:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

열거형 클래스의 상수는 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 및 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 함수를 사용하여 제네릭 방식으로 접근할 수 있습니다. 코틀린 2.0.0에서는 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 함수를 대체하는 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 함수가 도입되었습니다. `enumEntries<T>()` 함수는 주어진 열거형 타입 `T`에 대한 모든 열거형 엔트리의 리스트를 반환합니다.

`enumValues<T>()` 함수는 여전히 지원되지만, 성능에 미치는 영향이 적으므로 `enumEntries<T>()` 함수를 대신 사용하는 것을 권장합니다. `enumValues<T>()`를 호출할 때마다 새 배열이 생성되는 반면, `enumEntries<T>()`를 호출할 때마다 동일한 리스트가 반환되므로 훨씬 더 효율적입니다.

예시:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 인라인 함수(inline functions) 및 리파이드 타입 파라미터(reified type parameters)에 대한 자세한 내용은 [인라인 함수](inline-functions.md)를 참조하세요.
>
> {style="tip"}