---
title: "Enum 클래스"
---
enum 클래스의 가장 기본적인 사용 사례는 타입 안전 [enums](https://kotlinlang.org/docs/reference/enum-classes.html) 구현입니다.

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
각 enum 상수는 객체입니다. enum 상수는 쉼표로 구분됩니다.

각 enum은 enum 클래스의 인스턴스이므로 다음과 같이 초기화할 수 있습니다.

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 익명 클래스

Enum 상수는 해당 메서드를 포함한 자체 익명 클래스를 선언할 수 있으며 기본 메서드를 재정의할 수도 있습니다.

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

enum 클래스가 멤버를 정의하는 경우 상수 정의와 멤버 정의를 세미콜론으로 구분합니다.

## enum 클래스에서 인터페이스 구현

Enum 클래스는 인터페이스를 구현할 수 있지만 클래스에서 파생될 수는 없으며, 모든 항목에 대한 인터페이스 멤버의 공통 구현 또는 익명 클래스 내의 각 항목에 대한 개별 구현을 제공합니다.
이를 위해 다음과 같이 구현할 인터페이스를 enum 클래스 선언에 추가합니다.

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```

모든 enum 클래스는 기본적으로 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 인터페이스를 구현합니다. enum 클래스의 상수는 자연스러운 순서로 정의됩니다. 자세한 내용은 [Ordering](collection-ordering)을 참조하세요.

## enum 상수 작업

Kotlin의 enum 클래스에는 정의된 enum 상수를 나열하고 이름으로 enum 상수를 가져오는 합성 속성 및 메서드가 있습니다. 이러한 메서드의 서명은 다음과 같습니다 (enum 클래스의 이름이 `EnumClass`라고 가정).

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

다음은 실제 사용 예입니다.

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```

지정된 이름이 클래스에 정의된 enum 상수와 일치하지 않으면 `valueOf()` 메서드는 `IllegalArgumentException`을 throw합니다.

Kotlin 1.9.0에서 `entries`가 도입되기 전에는 `values()` 함수가 enum 상수 배열을 검색하는 데 사용되었습니다.

모든 enum 상수에는 해당 이름과 enum 클래스 선언에서 위치 (0부터 시작)를 가져오기 위한 속성인 [`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) 및 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)도 있습니다.

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {

    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0

}
```

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 및 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 함수를 사용하여 일반적인 방법으로 enum 클래스의 상수에 액세스할 수 있습니다. 
Kotlin 2.0.0에서는 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 함수가 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 함수를 대체하는 기능으로 도입되었습니다. `enumEntries<T>()` 함수는 지정된 enum 유형 `T`에 대한 모든 enum 항목 목록을 반환합니다.

`enumValues<T>()` 함수는 여전히 지원되지만 성능에 미치는 영향이 적으므로 `enumEntries<T>()` 함수를 대신 사용하는 것이 좋습니다. `enumValues<T>()`를 호출할 때마다 새 배열이 생성되는 반면, `enumEntries<T>()`를 호출할 때마다 동일한 목록이 매번 반환되므로 훨씬 더 효율적입니다.

예를 들어 다음과 같습니다.

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 인라인 함수 및 reified 타입 매개변수에 대한 자세한 내용은 [인라인 함수](inline-functions)를 참조하십시오.
>
>