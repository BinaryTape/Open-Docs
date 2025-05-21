---
title: "Kotlin 1.3의 새로운 기능"
---
_릴리스 날짜: 2018년 10월 29일_

## 코루틴 릴리스

오랜 기간에 걸친 광범위한 배틀 테스트를 거친 후, 코루틴이 이제 릴리스됩니다! 즉, Kotlin 1.3부터 언어 지원과 API가 [완전히 안정화](components-stability)되었다는 의미입니다. 새로운 [코루틴 개요](coroutines-overview) 페이지를 확인하십시오.

Kotlin 1.3에서는 suspend 함수에 대한 callable references와 reflection API에서 코루틴 지원을 도입합니다.

## Kotlin/Native

Kotlin 1.3에서는 Native 타겟을 계속 개선하고 다듬고 있습니다. 자세한 내용은 [Kotlin/Native 개요](native-overview)를 참조하십시오.

## 멀티 플랫폼 프로젝트

1.3에서는 표현력과 유연성을 개선하고 공통 코드 공유를 용이하게 하기 위해 멀티 플랫폼 프로젝트 모델을 완전히 재작업했습니다. 또한 Kotlin/Native가 이제 타겟 중 하나로 지원됩니다!

이전 모델과의 주요 차이점은 다음과 같습니다.

  * 이전 모델에서는 공통 코드와 플랫폼별 코드를 `expectedBy` 종속성으로 연결된 별도의 모듈에 배치해야 했습니다.
    이제 공통 코드와 플랫폼별 코드를 동일한 모듈의 다른 소스 루트에 배치하여 프로젝트를 더 쉽게 구성할 수 있습니다.
  * 이제 다양한 지원 플랫폼에 대한 많은 [사전 설정된 플랫폼 구성](multiplatform-dsl-reference#targets)이 있습니다.
  * [종속성 구성](multiplatform-add-dependencies)이 변경되었습니다. 종속성은 이제 각 소스 루트에 대해 별도로 지정됩니다.
  * 이제 소스 세트를 임의의 플랫폼 하위 집합 간에 공유할 수 있습니다.
  (예를 들어 JS, Android 및 iOS를 대상으로 하는 모듈에서 Android와 iOS 간에만 공유되는 소스 세트를 가질 수 있습니다).
  * 이제 [멀티 플랫폼 라이브러리 게시](multiplatform-publish-lib)가 지원됩니다.

자세한 내용은 [멀티 플랫폼 프로그래밍 설명서](multiplatform-intro)를 참조하십시오.

## 컨트랙트

Kotlin 컴파일러는 광범위한 정적 분석을 수행하여 경고를 제공하고 상용구를 줄입니다. 가장 주목할 만한 기능 중 하나는 스마트 캐스트입니다. 수행된 유형 검사를 기반으로 자동으로 캐스트를 수행할 수 있습니다.

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 컴파일러는 자동으로 's'를 'String'으로 캐스팅합니다.
}
```

그러나 이러한 검사가 별도의 함수로 추출되는 즉시 모든 스마트 캐스트가 즉시 사라집니다.

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 스마트 캐스트 없음 :(
}
```

이러한 경우의 동작을 개선하기 위해 Kotlin 1.3에서는 *컨트랙트*라는 실험적 메커니즘을 도입합니다.

*컨트랙트*를 사용하면 함수가 컴파일러에서 이해할 수 있는 방식으로 동작을 명시적으로 설명할 수 있습니다.
현재 두 가지 광범위한 사례 클래스가 지원됩니다.

* 함수의 호출 결과와 전달된 인수 값 간의 관계를 선언하여 스마트 캐스트 분석을 개선합니다.

```kotlin
fun require(condition: Boolean) {
    // 이는 컴파일러에 다음을 알리는 구문 형식입니다.
    // "이 함수가 성공적으로 반환되면 전달된 'condition'은 참입니다."
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 그렇지 않으면 'require'가 예외를 발생시키므로 여기서 s는 'String'으로 스마트 캐스팅됩니다.
}
```

* 고차 함수가 있는 경우 변수 초기화 분석을 개선합니다.

```kotlin
fun synchronize(lock: Any?, block: () `->` Unit) {
    // 컴파일러에 다음을 알립니다.
    // "이 함수는 'block'을 여기서 지금 정확히 한 번 호출합니다."
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 컴파일러는 'synchronize'에 전달된 람다가
               // 정확히 한 번 호출되므로 재할당이 보고되지 않습니다.
    }
    println(x) // 컴파일러는 람다가 확실히 호출되어
               // 초기화를 수행한다는 것을 알고 있으므로 'x'는 여기서 초기화된 것으로 간주됩니다.
}
```

### stdlib의 컨트랙트

`stdlib`는 이미 컨트랙트를 사용하고 있으며, 이는 위에 설명된 분석의 개선으로 이어집니다.
이러한 컨트랙트 부분은 **안정적**이므로 추가 옵트인 없이 지금 바로 개선된 분석의 이점을 누릴 수 있습니다.

```kotlin

fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 예, not-null로 스마트 캐스팅됩니다!
    }
}

fun main() {
    bar(null)
    bar("42")
}
```

### 사용자 지정 컨트랙트

자체 함수에 대한 컨트랙트를 선언할 수 있지만 이 기능은 **실험적**입니다. 현재 구문은 초기 프로토타입 상태이며 변경될 가능성이 높습니다. 또한 현재 Kotlin 컴파일러는 컨트랙트를 확인하지 않으므로 정확하고 건전한 컨트랙트를 작성하는 것은 프로그래머의 책임입니다.

사용자 지정 컨트랙트는 DSL 범위를 제공하는 `contract` stdlib 함수에 대한 호출에 의해 도입됩니다.

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

구문 및 호환성 알림에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts)를 참조하십시오.

## 변수에서 when 주체 캡처

Kotlin 1.3에서는 이제 `when` 주체를 변수로 캡처할 수 있습니다.

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success `->` response.body
            is HttpError `->` throw HttpException(response.status)
        }
```

`when` 바로 전에 이 변수를 추출하는 것이 이미 가능했지만 `when`의 `val` 범위는 `when`의 본문으로 적절하게 제한되어 네임스페이스 오염을 방지합니다. [`when`에 대한 전체 설명서는 여기를 참조하십시오](control-flow#when-expressions-and-statements).

## 인터페이스 컴패니언의 @JvmStatic 및 @JvmField

Kotlin 1.3에서는 인터페이스의 `companion` 객체의 멤버를 `@JvmStatic` 및 `@JvmField` 주석으로 표시할 수 있습니다.
클래스 파일에서 이러한 멤버는 해당 인터페이스로 올려지고 `static`으로 표시됩니다.

예를 들어 다음 Kotlin 코드는 다음과 같습니다.

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

다음 Java 코드와 같습니다.

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 주석 클래스의 중첩 선언

Kotlin 1.3에서는 주석이 중첩된 클래스, 인터페이스, 객체 및 컴패니언을 가질 수 있습니다.

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

## 매개변수 없는 main

관례에 따라 Kotlin 프로그램의 진입점은 `main(args: Array<String>)`과 같은 서명이 있는 함수입니다.
여기서 `args`는 프로그램에 전달된 명령줄 인수를 나타냅니다. 그러나 모든 애플리케이션이 명령줄 인수를 지원하는 것은 아니므로
이 매개변수는 결국 사용되지 않는 경우가 많습니다.

Kotlin 1.3에서는 매개변수를 사용하지 않는 더 간단한 형태의 `main`을 도입했습니다. 이제 Kotlin의 "Hello, World"는 19자 더 짧아졌습니다!

```kotlin
fun main() {
    println("Hello, world!")
}
```

## 아리티가 큰 함수

Kotlin에서 함수형 유형은 다른 수의 매개변수를 사용하는 제네릭 클래스로 표현됩니다. `Function0<R>`,
`Function1<P0, R>`, `Function2<P0, P1, R>`, ... 이 접근 방식은 목록이 유한하고 현재 `Function22`로 끝난다는 문제가 있습니다.

Kotlin 1.3에서는 이러한 제한을 완화하고 아리티가 더 큰 함수에 대한 지원을 추가합니다.

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) `->` Any) {
    block(Any(), Any(), ..., Any())
}
```

## 프로그레시브 모드

Kotlin은 코드의 안정성과 이전 버전과의 호환성을 매우 중요하게 생각합니다. Kotlin 호환성 정책에 따르면 주요 릴리스(**1.2**, **1.3** 등)에서만 주요 변경 사항
(예: 컴파일이 잘 되던 코드를 더 이상 컴파일되지 않게 만드는 변경 사항)을 도입할 수 있습니다.

많은 사용자가 중요한 컴파일러 버그 수정 사항이 즉시 도착하여 코드를 더 안전하고 정확하게 만드는 훨씬 더 빠른 주기를 사용할 수 있다고 생각합니다.
따라서 Kotlin 1.3에서는 컴파일러에 인수 `-progressive`를 전달하여 활성화할 수 있는 *프로그레시브* 컴파일러 모드를 도입합니다.

프로그레시브 모드에서는 언어 의미 체계의 일부 수정 사항이 즉시 적용될 수 있습니다. 이러한 모든 수정 사항에는 두 가지 중요한 속성이 있습니다.

* 이전 컴파일러와의 소스 코드 이전 버전과의 호환성을 유지합니다. 즉, 프로그레시브 컴파일러에서 컴파일할 수 있는 모든 코드는
비프로그레시브 컴파일러에서 잘 컴파일됩니다.
* 어떤 의미에서 코드를 더 *안전하게* 만듭니다. 예를 들어 건전하지 않은 스마트 캐스트를 금지할 수 있고 생성된 코드의 동작이
더 예측 가능하고 안정적으로 변경될 수 있습니다.

프로그레시브 모드를 활성화하려면 코드의 일부를 다시 작성해야 할 수 있지만 너무 많지는 않아야 합니다. 모든 수정 사항은
프로그레시브에서 활성화되어 신중하게 선택되고 검토되며 도구 마이그레이션 지원이 제공됩니다.
프로그레시브 모드는 최신 언어 버전으로 빠르게 업데이트되는 적극적으로 유지 관리되는 코드베이스에 적합한 선택이 될 것으로 예상합니다.

## 인라인 클래스

:::caution
인라인 클래스는 [Alpha](components-stability)에 있습니다. 호환되지 않게 변경될 수 있으며 나중에 수동 마이그레이션이 필요할 수 있습니다.
[YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.
자세한 내용은 [참조](inline-classes)를 참조하십시오.

:::

Kotlin 1.3에서는 새로운 종류의 선언인 `inline class`를 도입합니다. 인라인 클래스는 제한된 버전으로 볼 수 있습니다.
일반 클래스 중에서도 특히 인라인 클래스는 정확히 하나의 속성을 가져야 합니다.

```kotlin
inline class Name(val s: String)
```

Kotlin 컴파일러는 이 제한을 사용하여 인라인 클래스의 런타임 표현을 적극적으로 최적화하고
가능한 경우 기본 속성 값으로 인스턴스를 대체하여 생성자 호출, GC 압력을 제거하고
다른 최적화를 활성화합니다.

```kotlin
inline class Name(val s: String)

fun main() {
    // 다음 줄에서 생성자 호출이 발생하지 않고
    // 런타임에 'name'에는 문자열 "Kotlin"만 포함됩니다.
    val name = Name("Kotlin")
    println(name.s) 
}

```

자세한 내용은 인라인 클래스에 대한 [참조](inline-classes)를 참조하십시오.

## 부호 없는 정수

:::caution
부호 없는 정수는 [베타](components-stability)에 있습니다.
구현은 거의 안정적이지만 향후 마이그레이션 단계가 필요할 수 있습니다.
변경해야 할 사항을 최소화하기 위해 최선을 다하겠습니다.

:::

Kotlin 1.3에서는 부호 없는 정수 유형을 도입합니다.

* `kotlin.UByte`: 부호 없는 8비트 정수, 범위는 0 ~ 255입니다.
* `kotlin.UShort`: 부호 없는 16비트 정수, 범위는 0 ~ 65535입니다.
* `kotlin.UInt`: 부호 없는 32비트 정수, 범위는 0 ~ 2^32 - 1입니다.
* `kotlin.ULong`: 부호 없는 64비트 정수, 범위는 0 ~ 2^64 - 1입니다.

부호 있는 유형의 대부분의 기능은 부호 없는 대응 항목에서도 지원됩니다.

```kotlin
fun main() {

// 리터럴 접미사를 사용하여 부호 없는 유형을 정의할 수 있습니다.
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// stdlib 확장을 통해 부호 있는 유형을 부호 없는 유형으로 변환하거나 그 반대로 변환할 수 있습니다.
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 부호 없는 유형은 유사한 연산자를 지원합니다.
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u

println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```

자세한 내용은 [참조](unsigned-integer-types)를 참조하십시오.

## @JvmDefault

:::caution
`@JvmDefault`는 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

:::

Kotlin은 인터페이스의 기본 메서드가 허용되지 않는 Java 6 및 Java 7을 포함한 광범위한 Java 버전을 대상으로 합니다.
편의를 위해 Kotlin 컴파일러는 해당 제한 사항을 해결하지만 이 해결 방법은 Java 8에 도입된 `default` 메서드와 호환되지 않습니다.

이것은 Java 상호 운용성에 문제가 될 수 있으므로 Kotlin 1.3에서는 `@JvmDefault` 주석을 도입합니다.
이 주석이 달린 메서드는 JVM에 대한 `default` 메서드로 생성됩니다.

```kotlin
interface Foo {
    // 'default' 메서드로 생성됩니다.
    @JvmDefault
    fun foo(): Int = 42
}
```

:::caution
경고! `@JvmDefault`로 API에 주석을 달면 이진 호환성에 심각한 영향을 미칩니다.
프로덕션에서 `@JvmDefault`를 사용하기 전에 [참조 페이지](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)를 주의 깊게 읽으십시오.

:::

## 표준 라이브러리

### 멀티 플랫폼 랜덤

Kotlin 1.3 이전에는 모든 플랫폼에서 임의의 숫자를 생성하는 균일한 방법이 없었습니다. JVM에서는 `java.util.Random`과 같은 플랫폼별 솔루션에 의존해야 했습니다. 이 릴리스에서는 모든 플랫폼에서 사용할 수 있는 클래스 `kotlin.random.Random`을 도입하여 이 문제를 해결합니다.

```kotlin
import kotlin.random.Random

fun main() {

    val number = Random.nextInt(42)  // number는 범위 [0, limit)에 있습니다.
    println(number)

}
```

### isNullOrEmpty 및 orEmpty 확장

일부 유형에 대한 `isNullOrEmpty` 및 `orEmpty` 확장은 이미 stdlib에 있습니다. 첫 번째는 수신자가 `null`이거나 비어 있으면 `true`를 반환하고 두 번째는 수신자가 `null`이면 빈 인스턴스로 대체됩니다.
Kotlin 1.3에서는 컬렉션, 맵 및 객체 배열에 대한 유사한 확장을 제공합니다.

### 기존 배열 간에 요소 복사

부호 없는 배열을 포함하여 기존 배열 유형에 대한 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 함수를 사용하면 순수 Kotlin에서 배열 기반 컨테이너를 더 쉽게 구현할 수 있습니다.

```kotlin
fun main() {

    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())

}
```

### associateWith

키 목록이 있고 각 키를 일부 값과 연결하여 맵을 빌드하려는 상황이 매우 일반적입니다.
이전에는 `associate { it to getValue(it) }` 함수를 사용하여 수행할 수 있었지만 이제 더 많은
효율적이고 쉽게 탐색할 수 있는 대안인 `keys.associateWith { getValue(it) }`를 도입합니다.

```kotlin
fun main() {

    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }

}
```

### ifEmpty 및 ifBlank 함수

컬렉션, 맵, 객체 배열, 문자 시퀀스 및 시퀀스에는 이제 수신자가 비어 있는 경우 대신 사용할 대체 값을 지정할 수 있는 `ifEmpty` 함수가 있습니다.

```kotlin
fun main() {

    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c `->` c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))

}
```

또한 문자 시퀀스 및 문자열에는 `ifEmpty`와 동일한 작업을 수행하지만
비어 있는지 확인하는 대신 문자열이 모두 공백인지 확인하는 `ifBlank` 확장이 있습니다.

```kotlin
fun main() {

    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })

}
```

### 리플렉션의 봉인된 클래스

`kotlin-reflect`에 새로운 API를 추가하여 `sealed` 클래스의 모든 직접적인 하위 유형, 즉 `KClass.sealedSubclasses`를 열거하는 데 사용할 수 있습니다.

### 더 작은 변경 사항

* 이제 `Boolean` 유형에 컴패니언이 있습니다.
* `null`에 대해 0을 반환하는 `Any?.hashCode()` 확장.
* 이제 `Char`에서 `MIN_VALUE` 및 `MAX_VALUE` 상수를 제공합니다.
* 기본 유형 컴패니언의 `SIZE_BYTES` 및 `SIZE_BITS` 상수.

## 툴링

### IDE의 코드 스타일 지원

Kotlin 1.3에서는 IntelliJ IDEA에서 [권장 코드 스타일](coding-conventions)에 대한 지원을 도입합니다.
마이그레이션 지침은 [이 페이지](code-style-migration-guide)를 확인하십시오.

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)은 Kotlin에서 객체를 (de)직렬화하기 위한 멀티 플랫폼 지원을 제공하는 라이브러리입니다. 이전에는 별도의 프로젝트였지만 Kotlin 1.3부터 다른 컴파일러 플러그인과 함께 Kotlin 컴파일러 배포와 함께 제공됩니다. 주요 차이점은 사용 중인 Kotlin IDE 플러그인 버전과 호환되는지 여부에 대해 Serialization IDE 플러그인을 수동으로 감시할 필요가 없다는 것입니다. 이제 Kotlin IDE 플러그인에 직렬화가 이미 포함되어 있습니다!

자세한 내용은 [여기](https://github.com/Kotlin/kotlinx.serialization#current-project-status)를 참조하십시오.

:::caution
kotlinx.serialization은 이제 Kotlin Compiler 배포와 함께 제공되지만 Kotlin 1.3에서는 여전히 실험적 기능으로 간주됩니다.

:::

### 스크립팅 업데이트

:::caution
스크립팅은 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

:::

Kotlin 1.3에서는 스크립팅 API를 계속 발전시키고 개선하여 외부 속성 추가, 정적 또는 동적 종속성 제공 등 스크립트 사용자 지정에 대한 일부 실험적 지원을 도입합니다.

자세한 내용은 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)를 참조하십시오.

### 스크래치 지원

Kotlin 1.3에서는 실행 가능한 Kotlin *스크래치 파일*에 대한 지원을 도입합니다. *스크래치 파일*은 실행하고 편집기에서 직접 평가 결과를 얻을 수 있는 .kts 확장이 있는 Kotlin 스크립트 파일입니다.

자세한 내용은 일반 [스크래치 설명서](https://www.jetbrains.com/help/idea/scratches.html)를 참조하십시오.