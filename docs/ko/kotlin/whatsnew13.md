[//]: # (title: Kotlin 1.3의 새로운 기능)

_릴리스 날짜: 2018년 10월 29일_

## 코루틴 정식 출시

오랜 기간 광범위한 전투 테스트를 거쳐 코루틴이 드디어 정식 출시되었습니다! 이는 Kotlin 1.3부터 언어 지원과 API가 [완전히 안정화](components-stability.md)되었음을 의미합니다. 새로운 [코루틴 개요](coroutines-overview.md) 페이지를 확인해보세요.

Kotlin 1.3은 중단 함수(suspend-functions)에 대한 호출 가능 참조(callable references)와 리플렉션 API에서의 코루틴 지원을 도입합니다.

## Kotlin/Native

Kotlin 1.3은 Native 타겟을 지속적으로 개선하고 다듬고 있습니다. 자세한 내용은 [Kotlin/Native 개요](native-overview.md)를 참조하세요.

## 멀티플랫폼 프로젝트

1.3에서는 표현력과 유연성을 향상시키고 공통 코드 공유를 더 쉽게 하기 위해 멀티플랫폼 프로젝트 모델을 완전히 재작업했습니다. 또한, 이제 Kotlin/Native가 타겟 중 하나로 지원됩니다!

이전 모델과의 주요 차이점은 다음과 같습니다:

*   이전 모델에서는 공통 코드와 플랫폼별 코드를 별도의 모듈에 배치하고 `expectedBy` 의존성으로 연결해야 했습니다. 이제 공통 코드와 플랫폼별 코드는 동일한 모듈의 다른 소스 루트에 배치되어 프로젝트 구성이 더 쉬워졌습니다.
*   이제 지원되는 다양한 플랫폼을 위한 [사전 설정 플랫폼 구성](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)이 많이 제공됩니다.
*   [의존성 구성](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)이 변경되었습니다. 이제 각 소스 루트에 대해 의존성이 별도로 지정됩니다.
*   이제 소스 세트를 플랫폼의 임의의 하위 집합 간에 공유할 수 있습니다(예를 들어, JS, Android, iOS를 타겟으로 하는 모듈에서 Android와 iOS 간에만 공유되는 소스 세트를 가질 수 있습니다).
*   [멀티플랫폼 라이브러리 게시](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)가 이제 지원됩니다.

자세한 내용은 [멀티플랫폼 프로그래밍 문서](https://kotlinlang.org/docs/multiplatform/get-started.html)를 참조하세요.

## 계약 (Contracts)

Kotlin 컴파일러는 광범위한 정적 분석을 수행하여 경고를 제공하고 상용구 코드(boilerplate)를 줄입니다. 가장 주목할 만한 기능 중 하나는 스마트 캐스트(smartcasts)입니다. 이는 수행된 타입 검사에 따라 자동으로 캐스팅을 수행하는 기능입니다:

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 컴파일러가 's'를 'String'으로 자동 캐스팅합니다
}
```

그러나 이러한 검사가 별도의 함수로 추출되는 즉시 모든 스마트 캐스트는 사라집니다:

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 스마트 캐스트 없음 :(
}
```

이러한 경우의 동작을 개선하기 위해 Kotlin 1.3은 *계약(contracts)*이라는 실험적 메커니즘을 도입합니다.

*계약(Contracts)*은 함수가 컴파일러가 이해할 수 있는 방식으로 자신의 동작을 명시적으로 기술할 수 있도록 합니다. 현재 크게 두 가지 유형의 사례가 지원됩니다:

*   함수 호출 결과와 전달된 인자 값 간의 관계를 선언하여 스마트 캐스트 분석을 개선합니다:

    ```kotlin
    fun require(condition: Boolean) {
        // 이 구문 형식은 컴파일러에게 다음을 알립니다:
        // "이 함수가 성공적으로 반환되면 전달된 'condition'은 참이다"
        contract { returns() implies condition }
        if (!condition) throw IllegalArgumentException(...)
    }

    fun foo(s: String?) {
        require(s is String)
        // 여기서 's'는 'String'으로 스마트 캐스트됩니다. 그렇지 않으면
        // 'require'가 예외를 던졌을 것이기 때문입니다
    }
    ```

*   고차 함수(higher-order functions)가 있을 때 변수 초기화 분석을 개선합니다:

    ```kotlin
    fun synchronize(lock: Any?, block: () -> Unit) {
        // 이는 컴파일러에게 다음을 알립니다:
        // "이 함수는 'block'을 즉시 그리고 정확히 한 번 호출할 것이다"
        contract { callsInPlace(block, EXACTLY_ONCE) }
    }

    fun foo() {
        val x: Int
        synchronize(lock) {
            x = 42 // 컴파일러는 'synchronize'에 전달된 람다가 호출된다는 것을 알고 있습니다.
                   // 정확히 한 번만 호출되므로 재할당이 보고되지 않습니다.
        }
        println(x) // 컴파일러는 람다가 초기화를 수행하며 확실히 호출될 것이라는 것을 알고 있습니다.
                   // 따라서 'x'는 여기서 초기화된 것으로 간주됩니다.
    }
    ```

### stdlib의 계약

`stdlib`는 이미 계약을 활용하여 위에서 설명한 분석을 개선합니다. 계약의 이 부분은 **안정적**이므로, 추가적인 옵트인(opt-in) 없이도 지금 바로 개선된 분석의 이점을 누릴 수 있습니다:

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 야호, 널이 아닌 값으로 스마트 캐스트!
    }
}
//sampleEnd
fun main() {
    bar(null)
    bar("42")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 사용자 지정 계약

자신만의 함수에 대한 계약을 선언할 수 있지만, 현재 구문이 초기 프로토타입 단계에 있으며 변경될 가능성이 높으므로 이 기능은 **실험적**입니다. 또한 현재 Kotlin 컴파일러는 계약을 검증하지 않으므로, 올바르고 건전한 계약을 작성하는 것은 프로그래머의 책임입니다.

사용자 지정 계약은 `contract` stdlib 함수 호출을 통해 도입되며, 이는 DSL 스코프를 제공합니다:

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

구문 및 호환성 주의 사항에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)을 참조하세요.

## when 주제(subject)를 변수로 캡처하기

Kotlin 1.3에서는 이제 `when` 주제(subject)를 변수로 캡처하는 것이 가능합니다:

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

`when` 바로 앞에서 이 변수를 추출하는 것이 이미 가능했지만, `when` 내부의 `val`은 해당 `when` 본문으로 범위가 적절히 제한되어 네임스페이스 오염을 방지합니다. [`when`에 대한 전체 문서는 여기서 확인하세요](control-flow.md#when-expressions-and-statements).

## 인터페이스의 컴패니언 객체에 @JvmStatic 및 @JvmField 사용

Kotlin 1.3부터 인터페이스의 `companion` 객체 멤버에 `@JvmStatic` 및 `@JvmField` 어노테이션을 표시할 수 있습니다. 클래스 파일에서 이러한 멤버는 해당 인터페이스로 승격되어 `static`으로 표시됩니다.

예를 들어, 다음 Kotlin 코드는:

```kotlin
interface Foo {
    companion object {
        @JvmField
        val answer: Int = 42

        @JvmStatic
        fun sayHello() {
            println("Hello, world!")
        }
    }
}
```

이 Java 코드와 동일합니다:

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 어노테이션 클래스 내부의 중첩 선언

Kotlin 1.3에서는 어노테이션이 중첩 클래스, 인터페이스, 객체 및 컴패니언(companion)을 가질 수 있습니다:

```kotlin
annotation class Foo {
    enum class Direction { UP, DOWN, LEFT, RIGHT }
    
    annotation class Bar

    companion object {
        fun foo(): Int = 42
        val bar: Int = 42
    }
}
```

## 매개변수 없는 main 함수

관례상 Kotlin 프로그램의 진입점은 `main(args: Array<String>)`과 같은 시그니처를 가진 함수이며, 여기서 `args`는 프로그램에 전달된 명령줄 인자를 나타냅니다. 그러나 모든 애플리케이션이 명령줄 인자를 지원하는 것은 아니므로, 이 매개변수가 종종 사용되지 않는 경우가 많습니다.

Kotlin 1.3은 매개변수를 받지 않는 더 간단한 형태의 `main`을 도입했습니다. 이제 Kotlin의 "Hello, World"는 19자 더 짧아졌습니다!

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 큰 애리티(Arity)를 가진 함수

Kotlin에서 함수형 타입은 서로 다른 수의 매개변수를 받는 제네릭 클래스(`Function0<R>`, `Function1<P0, R>`, `Function2<P0, P1, R>`, ...)로 표현됩니다. 이 접근 방식은 이 목록이 유한하며 현재 `Function22`에서 끝난다는 문제가 있습니다.

Kotlin 1.3은 이러한 제한을 완화하고 더 큰 애리티를 가진 함수를 지원합니다:

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 점진적(Progressive) 모드

Kotlin은 코드의 안정성과 하위 호환성을 매우 중요하게 생각합니다. Kotlin 호환성 정책에 따르면, 주요 릴리스(**1.2**, **1.3** 등)에서만 호환성이 깨지는 변경 사항(예: 이전에는 잘 컴파일되던 코드가 더 이상 컴파일되지 않게 만드는 변경)을 도입할 수 있습니다.

많은 사용자가 중요한 컴파일러 버그 수정이 즉시 적용되어 코드를 더 안전하고 정확하게 만들 수 있는 훨씬 빠른 주기를 활용할 수 있다고 생각합니다. 따라서 Kotlin 1.3은 컴파일러에 `-progressive` 인자를 전달하여 활성화할 수 있는 *점진적(progressive)* 컴파일러 모드를 도입합니다.

점진적 모드에서는 언어 의미론의 일부 수정 사항이 즉시 적용될 수 있습니다. 이러한 모든 수정 사항은 두 가지 중요한 특징을 가집니다:

*   이들은 이전 컴파일러와의 소스 코드 하위 호환성을 유지합니다. 즉, 점진적 컴파일러로 컴파일 가능한 모든 코드는 비점진적 컴파일러로도 잘 컴파일됩니다.
*   이들은 어떤 면에서 코드를 *더 안전하게* 만들 뿐입니다. 예를 들어, 일부 불건전한 스마트 캐스트가 금지되거나, 생성된 코드의 동작이 더 예측 가능하거나 안정적으로 변경될 수 있습니다.

점진적 모드를 활성화하면 일부 코드를 다시 작성해야 할 수도 있지만, 그 양이 너무 많지는 않을 것입니다. 점진적 모드에서 활성화되는 모든 수정 사항은 신중하게 선별, 검토되며 도구 마이그레이션 지원이 제공됩니다. 점진적 모드는 최신 언어 버전으로 빠르게 업데이트되는 모든 활발하게 유지 관리되는 코드베이스에 좋은 선택이 될 것으로 예상합니다.

## 인라인 클래스 (Inline classes)

>인라인 클래스는 [알파(Alpha)](components-stability.md) 단계입니다. 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 귀하의 피드백에 감사드립니다. 자세한 내용은 [참조 문서](inline-classes.md)를 참조하세요.
>
{style="warning"}

Kotlin 1.3은 새로운 종류의 선언인 `inline class`를 도입합니다. 인라인 클래스는 일반 클래스의 제한된 버전으로 볼 수 있으며, 특히 인라인 클래스는 정확히 하나의 프로퍼티를 가져야 합니다:

```kotlin
inline class Name(val s: String)
```

Kotlin 컴파일러는 이 제한을 활용하여 인라인 클래스의 런타임 표현을 적극적으로 최적화하고, 가능한 경우 해당 인스턴스를 기본 프로퍼티 값으로 대체하여 생성자 호출, GC 부하를 제거하고 다른 최적화를 가능하게 합니다:

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 다음 줄에서는 생성자 호출이 발생하지 않으며,
    // 런타임에는 'name'이 단순히 문자열 "Kotlin"을 포함합니다.
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 인라인 클래스 [참조 문서](inline-classes.md)를 참조하세요.

## 부호 없는 정수 (Unsigned integers)

>부호 없는 정수(Unsigned integers)는 [베타(Beta)](components-stability.md) 단계입니다. 구현은 거의 안정적이지만, 향후 마이그레이션 단계가 필요할 수 있습니다. 저희는 여러분이 해야 할 변경 사항을 최소화하기 위해 최선을 다할 것입니다.
>
{style="warning"}

Kotlin 1.3은 부호 없는 정수 타입을 도입합니다:

*   `kotlin.UByte`: 부호 없는 8비트 정수, 범위 0~255
*   `kotlin.UShort`: 부호 없는 16비트 정수, 범위 0~65535
*   `kotlin.UInt`: 부호 없는 32비트 정수, 범위 0~2^32 - 1
*   `kotlin.ULong`: 부호 없는 64비트 정수, 범위 0~2^64 - 1

부호 있는 타입의 대부분 기능이 부호 없는 타입에서도 지원됩니다:

```kotlin
fun main() {
//sampleStart
// 리터럴 접미사를 사용하여 부호 없는 타입을 정의할 수 있습니다.
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// stdlib 확장 함수를 통해 부호 있는 타입을 부호 없는 타입으로, 그 반대로도 변환할 수 있습니다:
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 부호 없는 타입은 유사한 연산자를 지원합니다:
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u
//sampleEnd
println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [참조 문서](unsigned-integer-types.md)를 참조하세요.

## @JvmDefault

>`@JvmDefault`는 [실험적(Experimental)](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 귀하의 피드백에 감사드립니다.
>
{style="warning"}

Kotlin은 Java 6 및 Java 7을 포함한 광범위한 Java 버전을 타겟으로 하며, 이들 버전에서는 인터페이스의 기본 메서드(default methods)가 허용되지 않습니다. 사용 편의성을 위해 Kotlin 컴파일러는 해당 제한을 우회하지만, 이 해결 방법은 Java 8에 도입된 `default` 메서드와 호환되지 않습니다.

이는 Java 상호 운용성(interoperability)에 문제가 될 수 있으므로, Kotlin 1.3은 `@JvmDefault` 어노테이션을 도입합니다. 이 어노테이션이 붙은 메서드는 JVM을 위한 `default` 메서드로 생성됩니다:

```kotlin
interface Foo {
    // 'default' 메서드로 생성됩니다.
    @JvmDefault
    fun foo(): Int = 42
}
```

>경고! `@JvmDefault` 어노테이션으로 API에 주석을 달면 바이너리 호환성에 심각한 영향을 미칠 수 있습니다. 프로덕션 환경에서 `@JvmDefault`를 사용하기 전에 [참조 페이지](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)를 주의 깊게 읽으십시오.
>
{style="warning"}

## 표준 라이브러리

### 멀티플랫폼 난수 (Multiplatform random)

Kotlin 1.3 이전에는 모든 플랫폼에서 난수를 생성하는 통일된 방법이 없었으며, JVM에서는 `java.util.Random`과 같은 플랫폼별 솔루션에 의존해야 했습니다. 이번 릴리스에서는 모든 플랫폼에서 사용 가능한 `kotlin.random.Random` 클래스를 도입하여 이 문제를 해결합니다:

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 숫자는 [0, limit) 범위 내에 있습니다
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 및 orEmpty 확장 함수

일부 타입에 대한 `isNullOrEmpty` 및 `orEmpty` 확장 함수는 이미 stdlib에 존재합니다. 첫 번째 함수는 수신자가 `null`이거나 비어 있으면 `true`를 반환하고, 두 번째 함수는 수신자가 `null`인 경우 빈 인스턴스로 대체됩니다. Kotlin 1.3은 컬렉션, 맵, 객체 배열에 유사한 확장 함수를 제공합니다.

### 두 기존 배열 간에 요소 복사

부호 없는 배열을 포함한 기존 배열 타입에 대한 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 함수는 순수 Kotlin으로 배열 기반 컨테이너를 구현하는 것을 더 쉽게 만듭니다.

```kotlin
fun main() {
//sampleStart
    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### associateWith

키 목록을 가지고 각 키를 특정 값과 연결하여 맵을 구축하려는 상황은 매우 일반적입니다. 이전에는 `associate { it to getValue(it) }` 함수로 가능했지만, 이제 더 효율적이고 탐색하기 쉬운 대안인 `keys.associateWith { getValue(it) }`를 도입합니다.

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### ifEmpty 및 ifBlank 함수

컬렉션, 맵, 객체 배열, 문자 시퀀스(char sequences), 시퀀스(sequences)에 이제 `ifEmpty` 함수가 있어, 수신자가 비어 있는 경우 수신자 대신 사용될 대체 값을 지정할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c -> c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

문자 시퀀스와 문자열에는 `ifEmpty`와 동일한 기능을 수행하지만, 비어 있는지 대신 문자열이 모두 공백인지 확인하는 `ifBlank` 확장 함수도 있습니다.

```kotlin
fun main() {
//sampleStart
    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 리플렉션의 봉인 클래스 (Sealed classes in reflection)

`kotlin-reflect`에 `sealed` 클래스의 모든 직접 하위 타입을 열거하는 데 사용할 수 있는 새로운 API인 `KClass.sealedSubclasses`를 추가했습니다.

### 소규모 변경 사항

*   `Boolean` 타입에 이제 컴패니언 객체가 있습니다.
*   `null`에 대해 0을 반환하는 `Any?.hashCode()` 확장 함수.
*   `Char`에 이제 `MIN_VALUE`와 `MAX_VALUE` 상수가 제공됩니다.
*   기본 타입(primitive type) 컴패니언 객체에 `SIZE_BYTES` 및 `SIZE_BITS` 상수가 추가되었습니다.

## 툴링 (Tooling)

### IDE의 코드 스타일 지원

Kotlin 1.3은 IntelliJ IDEA에서 [권장 코드 스타일](coding-conventions.md) 지원을 도입합니다. 마이그레이션 가이드라인은 [이 페이지](code-style-migration-guide.md)를 확인하세요.

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)은 Kotlin에서 객체를 (역)직렬화하기 위한 멀티플랫폼 지원을 제공하는 라이브러리입니다. 이전에는 별도의 프로젝트였지만, Kotlin 1.3부터는 다른 컴파일러 플러그인과 동등하게 Kotlin 컴파일러 배포판과 함께 제공됩니다. 주요 차이점은 사용 중인 Kotlin IDE 플러그인 버전과 Serialization IDE 플러그인의 호환성을 수동으로 신경 쓸 필요가 없다는 것입니다. 이제 Kotlin IDE 플러그인에 이미 직렬화 기능이 포함되어 있습니다!

자세한 내용은 [여기](https://github.com/Kotlin/kotlinx.serialization#current-project-status)를 참조하세요.

> kotlinx.serialization이 이제 Kotlin 컴파일러 배포판과 함께 제공되지만, Kotlin 1.3에서는 여전히 실험적 기능으로 간주됩니다.
>
{style="warning"}

### 스크립팅 업데이트

>스크립팅은 [실험적(Experimental)](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 귀하의 피드백에 감사드립니다.
>
{style="warning"}

Kotlin 1.3은 스크립팅 API를 계속 발전시키고 개선하며, 외부 프로퍼티 추가, 정적 또는 동적 의존성 제공 등 스크립트 사용자 지정에 대한 일부 실험적 지원을 도입합니다.

자세한 내용은 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)를 참조하세요.

### 스크래치 파일 (Scratches) 지원

Kotlin 1.3은 실행 가능한 Kotlin *스크래치 파일(scratch files)*에 대한 지원을 도입합니다. *스크래치 파일(Scratch file)*은 .kts 확장자를 가진 Kotlin 스크립트 파일로, 편집기에서 직접 실행하고 평가 결과를 얻을 수 있습니다.

자세한 내용은 일반 [스크래치 문서](https://www.jetbrains.com/help/idea/scratches.html)를 참조하세요.