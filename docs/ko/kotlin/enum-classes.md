[//]: # (title: Enum 클래스)

Enum 클래스의 가장 기본적인 사용 사례는 타입 안전한 enum(type-safe enums)의 구현입니다.

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
각 enum 상수는 객체입니다. Enum 상수는 쉼표로 구분합니다.

각 enum은 enum 클래스의 인스턴스이므로 다음과 같이 초기화할 수 있습니다:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 익명 클래스

Enum 상수는 해당 메서드와 기본 메서드를 오버라이딩하는 자체 익명 클래스를 선언할 수 있습니다.

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

만약 enum 클래스에 멤버를 정의한다면, 세미콜론으로 상수 정의와 멤버 정의를 구분하세요.

## Enum 클래스에서 인터페이스 구현

Enum 클래스는 인터페이스를 구현할 수 있지만(다른 클래스를 상속받을 수는 없음), 모든 항목에 대해 인터페이스 멤버의 공통 구현을 제공하거나, 익명 클래스 내에서 각 항목에 대한 별도의 구현을 제공할 수 있습니다.
구현하려는 인터페이스를 다음과 같이 enum 클래스 선언에 추가하면 됩니다.

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

모든 enum 클래스는 기본적으로 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 인터페이스를 구현합니다. Enum 클래스의 상수는 자연 순서(natural order)로 정의됩니다. 자세한 정보는 [정렬(Ordering)](collection-ordering.md)을 참조하세요.

## Enum 상수 작업하기

Kotlin의 enum 클래스는 정의된 enum 상수 목록을 나열하고 이름으로 enum 상수를 가져오기 위한 합성(synthetic) 프로퍼티와 메서드를 가집니다. 이 메서드들의 시그니처는 다음과 같습니다(enum 클래스의 이름을 `EnumClass`라고 가정할 때):

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // 특수화된 List<EnumClass>
```

다음은 이들이 실제로 작동하는 예시입니다:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // RED, GREEN, BLUE 출력
    println("The first color is: ${RGB.valueOf("RED")}") // "The first color is: RED" 출력
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

`valueOf()` 메서드는 지정된 이름이 클래스에 정의된 enum 상수와 일치하지 않을 경우 `IllegalArgumentException`을 던집니다.

Kotlin 1.9.0에서 `entries`가 도입되기 전에는 enum 상수의 배열을 가져오기 위해 `values()` 함수를 사용했습니다.

모든 enum 상수는 enum 클래스 선언에서의 이름과 위치(0부터 시작)를 얻기 위한 [`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)과 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html) 프로퍼티를 가집니다.

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // RED 출력
    println(RGB.RED.ordinal) // 0 출력
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

> Enum 항목으로 작업할 때 반복을 줄이려면 문맥 인식 해석(context-sensitive resolution, 현재 프리뷰 상태)을 시도해 보세요.
> 이 기능을 사용하면 `when` 표현식이나 타입이 지정된 변수에 할당할 때와 같이 예상되는 타입을 알 수 있는 경우 enum 클래스 이름을 생략할 수 있습니다.
>
> 자세한 정보는 [문맥 인식 해석 프리뷰(Preview of context-sensitive resolution)](whatsnew22.md#preview-of-context-sensitive-resolution) 또는 관련 [KEEP 제안](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)을 참조하세요.
>
{style="tip"}

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)와 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 함수를 사용하여 제네릭 방식으로 enum 클래스의 상수에 접근할 수 있습니다. Kotlin 2.0.0에서는 `enumValues<T>()` 함수를 대체하기 위해 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 함수가 도입되었습니다. `enumEntries<T>()` 함수는 지정된 enum 타입 `T`에 대한 모든 enum 항목의 리스트를 반환합니다.

`enumValues<T>()` 함수는 여전히 지원되지만, 성능 영향이 적은 `enumEntries<T>()` 함수를 사용할 것을 권장합니다. `enumValues<T>()`를 호출할 때마다 새로운 배열이 생성되는 반면, `enumEntries<T>()`를 호출하면 매번 동일한 리스트가 반환되어 훨씬 더 효율적입니다.

예를 들어:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 인라인 함수와 실체화된 타입 파라미터(reified type parameters)에 대한 자세한 정보는 [인라인 함수(Inline functions)](inline-functions.md)를 참조하세요.
>
> {style="tip"}