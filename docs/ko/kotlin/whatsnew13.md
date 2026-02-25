[//]: # (title: Kotlin 1.3의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin 멀티플랫폼(Multiplatform), JVM, Native, JS 업데이트 및 Gradle과 Maven용 빌드 도구 지원을 포함한 Kotlin 1.3 릴리스 노트를 읽어보세요.</web-summary>

_릴리스 날짜: 2018년 10월 29일_

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## 코루틴(Coroutines) 정식 출시

길고 광범위한 실전 테스트를 거쳐 코루틴이 마침내 정식 출시되었습니다! 즉, Kotlin 1.3부터 언어 지원 및 API가 [완전히 안정화(fully stable)](components-stability.md)되었음을 의미합니다. 새로운 [코루틴 개요](coroutines-overview.md) 페이지를 확인해 보세요.

Kotlin 1.3에서는 `suspend` 함수에 대한 호출 가능 참조(callable references)와 리플렉션(reflection) API에서의 코루틴 지원이 도입되었습니다.

## Kotlin/Native

Kotlin 1.3은 Native 타겟을 지속적으로 개선하고 다듬고 있습니다. 자세한 내용은 [Kotlin/Native 개요](native-overview.md)를 참조하세요.

## 멀티플랫폼 프로젝트(Multiplatform projects)

1.3에서는 표현력과 유연성을 높이고 공통 코드(common code) 공유를 더 쉽게 만들기 위해 멀티플랫폼 프로젝트 모델을 완전히 재설계했습니다. 또한, 이제 Kotlin/Native도 지원되는 타겟 중 하나로 포함되었습니다!

이전 모델과의 주요 차이점은 다음과 같습니다:

  * 이전 모델에서는 공통 코드와 플랫폼별 코드를 별도의 모듈에 배치하고 `expectedBy` 종속성으로 연결해야 했습니다. 이제는 공통 코드와 플랫폼별 코드가 동일한 모듈의 서로 다른 소스 루트(source roots)에 배치되어 프로젝트 구성이 더 쉬워졌습니다.
  * 이제 지원되는 다양한 플랫폼에 대해 다수의 [프리셋 플랫폼 구성(preset platform configurations)](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)을 제공합니다.
  * [종속성 구성(dependencies configuration)](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)이 변경되었습니다. 이제 각 소스 루트에 대해 개별적으로 종속성을 지정합니다.
  * 이제 소스 세트(Source sets)를 플랫폼의 임의의 하위 집합 간에 공유할 수 있습니다(예를 들어, JS, Android, iOS를 타겟으로 하는 모듈에서 Android와 iOS 간에만 공유되는 소스 세트를 가질 수 있습니다).
  * [멀티플랫폼 라이브러리 배포(Publishing multiplatform libraries)](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)가 이제 지원됩니다.

더 자세한 정보는 [멀티플랫폼 프로그래밍 문서](https://kotlinlang.org/docs/multiplatform/get-started.html)를 참조하세요.

## 계약(Contracts)

Kotlin 컴파일러는 경고를 제공하고 상용구 코드(boilerplate)를 줄이기 위해 광범위한 정적 분석을 수행합니다. 가장 주목할 만한 기능 중 하나는 스마트 캐스트(smartcasts)로, 수행된 타입 검사를 기반으로 자동으로 캐스트를 수행하는 기능입니다.

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 컴파일러가 자동으로 's'를 'String'으로 캐스트함
}
```

하지만 이러한 검사를 별도의 함수로 추출하는 즉시 모든 스마트 캐스트가 사라지게 됩니다.

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 스마트 캐스트가 동작하지 않음 :(
}
```

이러한 경우의 동작을 개선하기 위해 Kotlin 1.3에서는 *계약(contracts)*이라는 실험적 메커니즘을 도입했습니다.

*계약*을 통해 함수는 자신의 동작을 컴파일러가 이해할 수 있는 방식으로 명시적으로 설명할 수 있습니다. 현재 두 가지 광범위한 사례가 지원됩니다:

* 함수의 호출 결과와 전달된 인자 값 사이의 관계를 선언하여 스마트 캐스트 분석을 개선합니다:

```kotlin
fun require(condition: Boolean) {
    // 이는 컴파일러에게 다음과 같이 알리는 구문 형태입니다:
    // "만약 이 함수가 성공적으로 반환되면, 전달된 'condition'은 true이다"
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 여기서 s는 'String'으로 스마트 캐스트됩니다.
    // 그렇지 않으면 'require'가 예외를 던졌을 것이기 때문입니다.
}
```

* 고차 함수가 있는 상황에서 변수 초기화 분석을 개선합니다:

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 컴파일러에게 다음과 같이 알립니다:
    // "이 함수는 여기서 지금 'block'을 정확히 한 번 호출할 것이다"
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 컴파일러는 'synchronize'에 전달된 람다가 정확히 한 번 호출된다는 것을 알므로,
               // 재할당(reassignment) 오류가 보고되지 않습니다.
    }
    println(x) // 컴파일러는 람다가 반드시 호출되어 초기화가 수행됨을 알므로,
               // 여기서 'x'는 초기화된 것으로 간주됩니다.
}
```

### 표준 라이브러리(stdlib)의 계약

`stdlib`은 이미 계약을 사용하고 있으며, 이는 위에 설명된 분석의 개선으로 이어집니다. 계약의 이 부분은 **안정화(stable)**되었으므로, 추가적인 옵트인(opt-in) 없이도 지금 바로 개선된 분석의 혜택을 누릴 수 있습니다:

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 와우, null이 아닌 것으로 스마트 캐스트되었습니다!
    }
}
//sampleEnd
fun main() {
    bar(null)
    bar("42")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 사용자 정의 계약

자신의 함수에 대해 계약을 선언할 수 있지만, 현재 구문은 초기 프로토타입 단계이며 변경될 가능성이 매우 높으므로 이 기능은 **실험적(experimental)**입니다. 또한 현재 Kotlin 컴파일러는 계약을 검증하지 않으므로, 올바르고 타당한 계약을 작성하는 것은 프로그래머의 책임입니다.

사용자 정의 계약은 DSL 스코프를 제공하는 `contract` stdlib 함수 호출을 통해 도입됩니다:

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

구문에 대한 자세한 내용과 호환성 공지는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)에서 확인하세요.

## when 대상을 변수로 캡처

Kotlin 1.3에서는 이제 `when`의 대상을 변수로 캡처할 수 있습니다:

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

`when` 바로 앞에서 이 변수를 추출하는 것도 가능했지만, `when` 안의 `val`은 해당 스코프를 `when` 본문으로 적절히 제한하여 네임스페이스 오염을 방지합니다. [`when`에 대한 전체 문서는 여기를 참조하세요](control-flow.md#when-expressions-and-statements).

## 인터페이스 컴패니언의 @JvmStatic 및 @JvmField

Kotlin 1.3부터 인터페이스의 `companion` 객체 멤버에 `@JvmStatic` 및 `@JvmField` 어노테이션을 사용할 수 있습니다. 클래스 파일에서 이러한 멤버는 해당 인터페이스로 끌어올려지며(lifted) `static`으로 표시됩니다.

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

다음 Java 코드와 동일합니다:

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 어노테이션 클래스 내의 중첩 선언

Kotlin 1.3에서는 어노테이션이 중첩된 클래스, 인터페이스, 객체 및 컴패니언을 가질 수 있습니다:

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

## 매개변수가 없는 main

관례적으로 Kotlin 프로그램의 진입점은 `main(args: Array<String>)`과 같은 시그니처를 가진 함수이며, 여기서 `args`는 프로그램에 전달된 커맨드 라인 인자를 나타냅니다. 하지만 모든 애플리케이션이 커맨드 라인 인자를 지원하는 것은 아니므로, 이 매개변수는 사용되지 않는 경우가 많습니다.

Kotlin 1.3에서는 매개변수를 받지 않는 더 간단한 형태의 `main`을 도입했습니다. 이제 Kotlin의 "Hello, World"가 19자 더 짧아졌습니다!

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 많은 수의 arity를 가진 함수

Kotlin에서 함수형 타입은 서로 다른 개수의 매개변수를 받는 제네릭 클래스로 표현됩니다: `Function0<R>`, `Function1<P0, R>`, `Function2<P0, P1, R>`, ... 이 접근 방식은 목록이 유한하며 현재 `Function22`에서 끝난다는 문제를 가지고 있었습니다.

Kotlin 1.3은 이 제한을 완화하고 더 많은 수의 arity(인수 개수)를 가진 함수에 대한 지원을 추가합니다:

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42개 더 */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 점진적 모드(Progressive mode)

Kotlin은 코드의 안정성과 하위 호환성을 매우 중요하게 생각합니다. Kotlin 호환성 정책에 따르면, 하위 호환성을 깨는 변경(예: 이전에 잘 컴파일되던 코드가 더 이상 컴파일되지 않게 만드는 변경)은 메이저 릴리스(**1.2**, **1.3** 등)에서만 도입될 수 있습니다.

우리는 많은 사용자가 크리티컬한 컴파일러 버그 수정이 즉시 적용되어 코드를 더 안전하고 정확하게 만들 수 있는 훨씬 빠른 주기를 사용할 수 있다고 믿습니다. 따라서 Kotlin 1.3은 컴파일러에 `-progressive` 인자를 전달하여 활성화할 수 있는 *점진적(progressive)* 컴파일러 모드를 도입합니다.

점진적 모드에서는 언어 시맨틱의 일부 수정 사항이 즉시 적용될 수 있습니다. 이러한 모든 수정 사항은 두 가지 중요한 속성을 가집니다:

* 이전 컴파일러와의 소스 코드 하위 호환성을 유지합니다. 즉, 점진적 컴파일러로 컴파일 가능한 모든 코드는 비점진적 컴파일러에서도 문제없이 컴파일됩니다.
* 어떤 의미에서는 코드를 더 *안전하게* 만들 뿐입니다. 예를 들어, 타당하지 않은 스마트 캐스트가 금지되거나, 생성된 코드의 동작이 더 예측 가능하고 안정적으로 변경되는 식입니다.

점진적 모드를 활성화하면 코드의 일부를 다시 작성해야 할 수도 있지만, 그 양이 많지는 않을 것입니다. 점진적 모드에서 활성화되는 모든 수정 사항은 신중하게 선정되고 검토되었으며 도구 기반의 마이그레이션 지원이 제공됩니다. 최신 언어 버전으로 빠르게 업데이트되는 적극적으로 유지 관리되는 코드베이스에 점진적 모드가 좋은 선택이 될 것으로 기대합니다.

## 인라인 클래스(Inline classes)

> 인라인 클래스는 [Alpha](components-stability.md) 단계입니다. 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)을 통해 이에 대한 의견을 보내주시면 감사하겠습니다. 자세한 내용은 [참조 문서](inline-classes.md)를 확인하세요.
>
{style="warning"}

Kotlin 1.3은 새로운 종류의 선언인 `inline class`를 도입합니다. 인라인 클래스는 일반 클래스의 제한된 버전으로 볼 수 있으며, 특히 인라인 클래스는 정확히 하나의 프로퍼티를 가져야 합니다:

```kotlin
inline class Name(val s: String)
```

Kotlin 컴파일러는 이 제한을 사용하여 인라인 클래스의 런타임 표현을 적극적으로 최적화하고, 생성자 호출을 제거하고 GC 압박을 줄이며 다른 최적화를 가능하게 하기 위해 가능한 경우 인라인 클래스의 인스턴스를 기본 프로퍼티 값으로 대체합니다:

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 다음 줄에서 생성자 호출이 발생하지 않으며,
    // 런타임 시 'name'은 단순히 문자열 "Kotlin"만 포함합니다.
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 인라인 클래스 [참조 문서](inline-classes.md)를 확인하세요.

## 부호 없는 정수(Unsigned integers)

> 부호 없는 정수는 [Beta](components-stability.md) 단계입니다. 구현은 거의 안정화되었지만 향후 마이그레이션 단계가 필요할 수 있습니다. 변경 사항을 최소화하기 위해 최선을 다하겠습니다.
>
{style="warning"}

Kotlin 1.3은 부호 없는 정수 타입을 도입합니다:

* `kotlin.UByte`: 부호 없는 8비트 정수, 범위는 0에서 255
* `kotlin.UShort`: 부호 없는 16비트 정수, 범위는 0에서 65535
* `kotlin.UInt`: 부호 없는 32비트 정수, 범위는 0에서 2^32 - 1
* `kotlin.ULong`: 부호 없는 64비트 정수, 범위는 0에서 2^64 - 1

부호 있는 타입의 대부분의 기능은 부호 없는 대응 타입에서도 지원됩니다:

```kotlin
fun main() {
//sampleStart
// 리터럴 접미사를 사용하여 부호 없는 타입을 정의할 수 있습니다.
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// stdlib 확장 함수를 통해 부호 있는 타입을 부호 없는 타입으로 또는 그 반대로 변환할 수 있습니다:
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

자세한 내용은 [참조 문서](unsigned-integer-types.md)를 확인하세요.

## @JvmDefault

>`@JvmDefault`는 [실험적(Experimental)](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)을 통해 이에 대한 의견을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin은 인터페이스의 기본 메서드(default methods)가 허용되지 않는 Java 6 및 Java 7을 포함하여 광범위한 Java 버전을 타겟으로 합니다. 편의를 위해 Kotlin 컴파일러는 이 제한을 우회하지만, 이 우회 방법은 Java 8에서 도입된 `default` 메서드와 호환되지 않습니다.

이는 Java 상호운용성에서 문제가 될 수 있으므로 Kotlin 1.3에서는 `@JvmDefault` 어노테이션을 도입했습니다. 이 어노테이션이 달린 메서드는 JVM용 `default` 메서드로 생성됩니다:

```kotlin
interface Foo {
    // 'default' 메서드로 생성됨
    @JvmDefault
    fun foo(): Int = 42
}
```

> 경고! API에 `@JvmDefault`를 추가하는 것은 바이너리 호환성에 심각한 영향을 미칩니다. 프로덕션에서 `@JvmDefault`를 사용하기 전에 반드시 [참조 페이지](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)를 주의 깊게 읽어보시기 바랍니다.
>
{style="warning"}

## 표준 라이브러리(Standard library)

### 멀티플랫폼 랜덤(Random)

Kotlin 1.3 이전에는 모든 플랫폼에서 난수를 생성하는 통일된 방법이 없었습니다. JVM의 `java.util.Random`과 같이 플랫폼별 솔루션에 의존해야 했습니다. 이번 릴리스에서는 모든 플랫폼에서 사용할 수 있는 `kotlin.random.Random` 클래스를 도입하여 이 문제를 해결했습니다:

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 숫자의 범위는 [0, limit)입니다.
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 및 orEmpty 확장 함수

일부 타입에 대한 `isNullOrEmpty` 및 `orEmpty` 확장 함수는 이미 stdlib에 존재했습니다. 첫 번째는 수신 객체(receiver)가 `null`이거나 비어 있으면 `true`를 반환하고, 두 번째는 수신 객체가 `null`인 경우 빈 인스턴스로 대체합니다. Kotlin 1.3은 컬렉션, 맵 및 객체 배열에 대해 유사한 확장 함수를 제공합니다.

### 기존 두 배열 간의 요소 복사

부호 없는 배열을 포함한 기존 배열 타입에 대한 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 함수는 순수 Kotlin으로 배열 기반 컨테이너를 구현하기 쉽게 만들어 줍니다.

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

키 목록을 가지고 각 키를 특정 값과 연결하여 맵을 빌드하는 것은 매우 흔한 상황입니다. 이전에는 `associate { it to getValue(it) }` 함수를 통해 이 작업을 수행할 수 있었지만, 이제 더 효율적이고 발견하기 쉬운 대안인 `keys.associateWith { getValue(it) }`를 도입합니다.

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

컬렉션, 맵, 객체 배열, 문자 시퀀스(char sequences) 및 시퀀스(sequences)에 이제 `ifEmpty` 함수가 추가되었습니다. 이 함수는 수신 객체가 비어 있는 경우 대신 사용될 대체 값을 지정할 수 있게 해줍니다:

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

문자 시퀀스와 문자열에는 추가로 `ifBlank` 확장 함수가 있습니다. 이는 `ifEmpty`와 동일한 작업을 수행하지만 비어 있는 것 대신 문자열이 모두 공백(whitespace)인지 확인합니다.

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

### 리플렉션에서의 봉인된 클래스(Sealed classes)

`sealed` 클래스의 모든 직접적인 하위 타입을 열거하는 데 사용할 수 있는 새로운 API인 `KClass.sealedSubclasses`를 `kotlin-reflect`에 추가했습니다.

### 작은 변경 사항들

* `Boolean` 타입에 이제 컴패니언 객체가 생겼습니다.
* `null`에 대해 0을 반환하는 `Any?.hashCode()` 확장 함수가 추가되었습니다.
* `Char`가 이제 `MIN_VALUE` 및 `MAX_VALUE` 상수를 제공합니다.
* 기본 타입(primitive type) 컴패니언에 `SIZE_BYTES` 및 `SIZE_BITS` 상수가 추가되었습니다.

## 도구(Tooling)

### IDE의 코드 스타일 지원

Kotlin 1.3은 IntelliJ IDEA에서 [권장 코드 스타일(recommended code style)](coding-conventions.md) 지원을 도입합니다. 마이그레이션 가이드는 [이 페이지](code-style-migration-guide.md)를 확인하세요.

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)은 Kotlin에서 객체를 직렬화/역직렬화하기 위한 멀티플랫폼 지원을 제공하는 라이브러리입니다. 이전에는 별도의 프로젝트였으나 Kotlin 1.3부터는 다른 컴파일러 플러그인과 마찬가지로 Kotlin 컴파일러 배포판과 함께 제공됩니다. 주요 차이점은 사용 중인 Kotlin IDE 플러그인 버전과 호환되는 Serialization IDE 플러그인을 수동으로 확인할 필요가 없다는 것입니다. 이제 Kotlin IDE 플러그인에 이미 serialization이 포함되어 있습니다!

자세한 내용은 [여기](https://github.com/Kotlin/kotlinx.serialization#current-project-status)를 참조하세요.

> kotlinx.serialization이 이제 Kotlin 컴파일러 배포판과 함께 제공되지만, Kotlin 1.3에서는 여전히 실험적 기능으로 간주됩니다.
>
{style="warning"}

### 스크립팅(Scripting) 업데이트

> 스크립팅은 [실험적(Experimental)](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)을 통해 이에 대한 의견을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.3은 스크립팅 API를 지속적으로 발전시키고 개선하고 있으며, 외부 속성 추가, 정적 또는 동적 종속성 제공 등과 같은 스크립트 사용자 정의에 대한 실험적 지원을 도입합니다.

추가적인 자세한 내용은 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)를 참조하세요.

### 스크래치(Scratches) 지원

Kotlin 1.3은 실행 가능한 Kotlin *스크래치 파일(scratch files)* 지원을 도입합니다. *스크래치 파일*은 에디터에서 직접 실행하고 평가 결과를 얻을 수 있는 .kts 확장자의 Kotlin 스크립트 파일입니다.

자세한 내용은 일반 [스크래치 문서](https://www.jetbrains.com/help/idea/scratches.html)를 참조하세요.