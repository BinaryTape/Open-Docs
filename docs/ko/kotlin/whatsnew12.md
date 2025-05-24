---
title: "Kotlin 1.2의 새로운 기능"
---
_릴리스 날짜: 2017년 11월 28일_

## 목차

* [멀티 플랫폼 프로젝트](#multiplatform-projects-experimental)
* [기타 언어 기능](#other-language-features)
* [표준 라이브러리](#standard-library)
* [JVM 백엔드](#jvm-backend)
* [JavaScript 백엔드](#javascript-backend)

## 멀티 플랫폼 프로젝트 (experimental)

멀티 플랫폼 프로젝트는 Kotlin 1.2의 새로운 **실험적** 기능으로, Kotlin에서 지원하는 대상 플랫폼인 JVM, JavaScript 및 (미래의) Native 간에 코드를 재사용할 수 있습니다. 멀티 플랫폼 프로젝트에는 세 가지 종류의 모듈이 있습니다.

* *공통* 모듈은 특정 플랫폼에 종속되지 않은 코드와 플랫폼 종속 API의 구현이 없는 선언을 포함합니다.
* *플랫폼* 모듈은 특정 플랫폼에 대한 공통 모듈의 플랫폼 종속 선언 구현과 기타 플랫폼 종속 코드를 포함합니다.
* 일반 모듈은 특정 플랫폼을 대상으로 하며 플랫폼 모듈의 종속성이거나 플랫폼 모듈에 종속될 수 있습니다.

특정 플랫폼에 대해 멀티 플랫폼 프로젝트를 컴파일하면 공통 부분과 플랫폼별 부분 모두에 대한 코드가 생성됩니다.

멀티 플랫폼 프로젝트 지원의 핵심 기능은 *expected* 및 *actual* 선언을 통해 공통 코드의 플랫폼별 부분에 대한 종속성을 표현할 수 있다는 점입니다. *expected* 선언은 API(클래스, 인터페이스, annotation, 최상위 레벨 선언 등)를 지정합니다. *actual* 선언은 API의 플랫폼 종속 구현이거나 외부 라이브러리에서 API의 기존 구현을 참조하는 type alias입니다. 다음은 예시입니다.

공통 코드:

```kotlin
// expected platform-specific API:
expect fun hello(world: String): String

fun greet() {
    // usage of the expected API:
    val greeting = hello("multiplatform world")
    println(greeting)
}

expect class URL(spec: String) {
    open fun getHost(): String
    open fun getPath(): String
}
```

JVM 플랫폼 코드:

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

자세한 내용과 멀티 플랫폼 프로젝트 빌드 단계는 [멀티 플랫폼 프로그래밍 문서](multiplatform-intro)를 참조하세요.

## 기타 언어 기능

### Annotation의 배열 리터럴

Kotlin 1.2부터 annotation에 대한 배열 인수를 `arrayOf` 함수 대신 새로운 배열 리터럴 구문으로 전달할 수 있습니다.

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

배열 리터럴 구문은 annotation 인수로 제한됩니다.

### Lateinit 최상위 레벨 속성 및 로컬 변수

이제 `lateinit` modifier를 최상위 레벨 속성 및 로컬 변수에 사용할 수 있습니다. 후자는 예를 들어 한 객체에 대한 constructor 인수로 전달된 람다가 나중에 정의해야 하는 다른 객체를 참조할 때 사용할 수 있습니다.

```kotlin
class Node<T>(val value: T, val next: () `->` Node<T>)

fun main(args: Array<String>) {
    // A cycle of three nodes:
    lateinit var third: Node<Int>

    val second = Node(2, next = { third })
    val first = Node(1, next = { second })

    third = Node(3, next = { first })

    val nodes = generateSequence(first) { it.next() }
    println("Values in the cycle: ${nodes.take(7).joinToString { it.value.toString() }}, ...")
}
```

### Lateinit var 초기화 여부 확인

이제 속성 참조에서 `isInitialized`를 사용하여 lateinit var가 초기화되었는지 확인할 수 있습니다.

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {

        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)

    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```

### 기본 functional 매개변수가 있는 Inline 함수

이제 inline 함수는 inlined functional 매개변수에 대한 기본값을 가질 수 있습니다.

```kotlin

inline fun <E> Iterable<E>.strings(transform: (E) `->` String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```

### 명시적 캐스트의 정보가 type inference에 사용됨

Kotlin 컴파일러는 이제 type inference에서 type cast의 정보를 사용할 수 있습니다. type 매개변수 `T`를 반환하는 generic 메서드를 호출하고 반환 값을 특정 type `Foo`로 캐스팅하는 경우 컴파일러는 이제 이 호출에 대한 `T`를 type `Foo`에 바인딩해야 함을 이해합니다.

이는 Android 개발자에게 특히 중요한데, 컴파일러가 이제 Android API 레벨 26에서 generic `findViewById` 호출을 올바르게 분석할 수 있기 때문입니다.

```kotlin
val button = findViewById(R.id.button) as Button
```

### Smart cast 개선

변수가 safe call 표현식에서 할당되고 null인지 확인되면 smart cast가 safe call receiver에도 적용됩니다.

```kotlin
fun countFirst(s: Any): Int {

    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>

    return -1
}

fun main(args: Array<String>) {
  val string = "abacaba"
  val countInString = countFirst(string)
  println("called on \"$string\": $countInString")

  val list = listOf(1, 2, 3, 1, 2)
  val countInList = countFirst(list)
  println("called on $list: $countInList")
}
```

또한 람다의 smart cast는 람다 전에만 수정되는 로컬 변수에 대해 허용됩니다.

```kotlin
fun main(args: Array<String>) {

    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }

}
```

### this::foo의 약식으로 ::foo 지원

이제 `this` 멤버에 대한 바운드 호출 가능 참조를 명시적 receiver 없이 `this::foo` 대신 `::foo`로 작성할 수 있습니다. 이를 통해 외부 receiver의 멤버를 참조하는 람다에서 호출 가능 참조를 더 편리하게 사용할 수 있습니다.

### 주요 변경 사항: try 블록 후의 건전한 smart cast

이전에는 Kotlin은 try 블록 내에서 수행된 할당을 블록 후의 smart cast에 사용하여 type 및 null 안전성을 손상시키고 런타임 오류를 일으킬 수 있었습니다. 이 릴리스는 이 문제를 수정하여 smart cast를 더 엄격하게 만들지만 이러한 smart cast에 의존하는 일부 코드를 손상시킵니다.

이전 smart cast 동작으로 전환하려면 fallback 플래그 `-Xlegacy-smart-cast-after-try`를 컴파일러 인수로 전달하세요. Kotlin 1.3에서는 더 이상 사용되지 않습니다.

### Deprecation: copy를 재정의하는 data 클래스

이미 동일한 시그니처로 `copy` 함수를 가지고 있는 type에서 파생된 data 클래스의 경우 data 클래스에 대해 생성된 `copy` 구현은 supertype의 기본값을 사용하여 직관에 반하는 동작을 유도하거나 supertype에 기본 매개변수가 없는 경우 런타임에 실패했습니다.

`copy` 충돌을 일으키는 상속은 Kotlin 1.2에서 경고와 함께 더 이상 사용되지 않으며 Kotlin 1.3에서는 오류가 발생합니다.

### Deprecation: enum 항목의 중첩 type

enum 항목 내부에서 `inner class`가 아닌 중첩 type을 정의하는 것은 초기화 로직의 문제로 인해 더 이상 사용되지 않습니다. 이로 인해 Kotlin 1.2에서 경고가 발생하고 Kotlin 1.3에서는 오류가 발생합니다.

### Deprecation: vararg에 대한 단일 명명된 인수

annotation의 배열 리터럴과의 일관성을 위해 명명된 형식(`foo(items = i)`)으로 vararg 매개변수에 대해 단일 항목을 전달하는 것은 더 이상 사용되지 않습니다. 해당 배열 팩토리 함수와 함께 spread operator를 사용하세요.

```kotlin
foo(items = *arrayOf(1))
```

이러한 경우 중복 배열 생성을 제거하는 최적화가 있어 성능 저하를 방지합니다. 단일 인수 형식은 Kotlin 1.2에서 경고를 생성하고 Kotlin 1.3에서는 삭제됩니다.

### Deprecation: Throwable을 확장하는 generic 클래스의 내부 클래스

`Throwable`에서 상속되는 generic type의 내부 클래스는 throw-catch 시나리오에서 type 안전성을 위반할 수 있으므로 더 이상 사용되지 않으며 Kotlin 1.2에서는 경고가 표시되고 Kotlin 1.3에서는 오류가 발생합니다.

### Deprecation: 읽기 전용 속성의 backing field 변경

사용자 지정 getter에서 `field = ...`를 할당하여 읽기 전용 속성의 backing field를 변경하는 것은 더 이상 사용되지 않으며 Kotlin 1.2에서는 경고가 표시되고 Kotlin 1.3에서는 오류가 발생합니다.

## 표준 라이브러리

### Kotlin 표준 라이브러리 아티팩트 및 분할 패키지

이제 Kotlin 표준 라이브러리는 분할 패키지(동일한 패키지에서 클래스를 선언하는 여러 jar 파일)를 금지하는 Java 9 모듈 시스템과 완전히 호환됩니다. 이를 지원하기 위해 이전의 `kotlin-stdlib-jre7` 및 `kotlin-stdlib-jre8`을 대체하는 새로운 아티팩트 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 도입되었습니다.

새로운 아티팩트의 선언은 Kotlin 관점에서 동일한 패키지 이름으로 표시되지만 Java에서는 다른 패키지 이름을 가집니다. 따라서 새로운 아티팩트로 전환해도 소스 코드를 변경할 필요가 없습니다.

새로운 모듈 시스템과의 호환성을 보장하기 위해 변경된 또 다른 사항은 `kotlin-reflect` 라이브러리에서 `kotlin.reflect` 패키지의 더 이상 사용되지 않는 선언을 제거하는 것입니다. 이러한 선언을 사용한 경우 Kotlin 1.1부터 지원되는 `kotlin.reflect.full` 패키지의 선언을 사용하도록 전환해야 합니다.

### windowed, chunked, zipWithNext

`Iterable<T>`, `Sequence<T>` 및 `CharSequence`에 대한 새로운 확장 프로그램은 버퍼링 또는 일괄 처리(`chunked`), 슬라이딩 윈도우 및 슬라이딩 평균 계산(`windowed`) 및 후속 항목 쌍 처리(`zipWithNext`)와 같은 사용 사례를 다룹니다.

```kotlin
fun main(args: Array<String>) {

    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) `->` Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b `->` b - a }

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```

### fill, replaceAll, shuffle/shuffled

목록을 조작하기 위한 확장 함수 세트가 추가되었습니다. `MutableList`의 경우 `fill`, `replaceAll` 및 `shuffle`과 읽기 전용 `List`의 경우 `shuffled`:

```kotlin
fun main(args: Array<String>) {

    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")

}
```

### kotlin-stdlib의 수학 연산

오랜 요청을 충족하기 위해 Kotlin 1.2는 JVM과 JS에 공통적인 수학 연산을 위한 `kotlin.math` API를 추가하고 다음을 포함합니다.

* 상수: `PI` 및 `E`
* 삼각 함수: `cos`, `sin`, `tan` 및 이들의 역함수: `acos`, `asin`, `atan`, `atan2`
* 쌍곡선 함수: `cosh`, `sinh`, `tanh` 및 이들의 역함수: `acosh`, `asinh`, `atanh`
* 지수화: `pow`(확장 함수), `sqrt`, `hypot`, `exp`, `expm1`
* 로그: `log`, `log2`, `log10`, `ln`, `ln1p`
* 반올림:
    * `ceil`, `floor`, `truncate`, `round`(짝수로 반올림) 함수
    * `roundToInt`, `roundToLong`(정수로 반올림) 확장 함수
* 부호 및 절대값:
    * `abs` 및 `sign` 함수
    * `absoluteValue` 및 `sign` 확장 속성
    * `withSign` 확장 함수
* 두 값의 `max` 및 `min`
* 이진 표현:
    * `ulp` 확장 속성
    * `nextUp`, `nextDown`, `nextTowards` 확장 함수
    * `toBits`, `toRawBits`, `Double.fromBits`(이들은 `kotlin` 패키지에 있음)

동일한 함수 세트(단, 상수 제외)는 `Float` 인수에도 사용할 수 있습니다.

### BigInteger 및 BigDecimal에 대한 연산자 및 변환

Kotlin 1.2는 `BigInteger` 및 `BigDecimal`을 사용하여 연산하고 다른 숫자 type에서 생성하기 위한 함수 세트를 도입합니다. 이것들은:

* `Int` 및 `Long`의 경우 `toBigInteger`
* `Int`, `Long`, `Float`, `Double` 및 `BigInteger`의 경우 `toBigDecimal`
* 산술 및 비트 연산자 함수:
    * 이항 연산자 `+`, `-`, `*`, `/`, `%` 및 infix 함수 `and`, `or`, `xor`, `shl`, `shr`
    * 단항 연산자 `-`, `++`, `--` 및 함수 `inv`

### 부동 소수점-비트 변환

`Double` 및 `Float`를 비트 표현으로 또는 그 반대로 변환하기 위해 새로운 함수가 추가되었습니다.

* `Double`의 경우 `Long`을 반환하고 `Float`의 경우 `Int`를 반환하는 `toBits` 및 `toRawBits`
* 비트 표현에서 부동 소수점 숫자를 생성하기 위한 `Double.fromBits` 및 `Float.fromBits`

### Regex는 이제 직렬화 가능

`kotlin.text.Regex` 클래스가 `Serializable`이 되었고 이제 직렬화 가능한 계층 구조에서 사용할 수 있습니다.

### Closeable.use는 사용 가능한 경우 Throwable.addSuppressed를 호출합니다.

`Closeable.use` 함수는 다른 예외 후 리소스를 닫는 동안 예외가 발생하면 `Throwable.addSuppressed`를 호출합니다.

이 동작을 활성화하려면 종속성에 `kotlin-stdlib-jdk7`이 있어야 합니다.

## JVM 백엔드

### Constructor 호출 정규화

버전 1.0 이후 Kotlin은 try-catch 표현식 및 inline 함수 호출과 같은 복잡한 제어 흐름을 가진 표현식을 지원했습니다. 이러한 코드는 Java Virtual Machine 사양에 따라 유효합니다. 불행히도 일부 bytecode 처리 도구는 이러한 표현식이 constructor 호출의 인수에 있는 경우 이러한 코드를 제대로 처리하지 못합니다.

이러한 bytecode 처리 도구 사용자를 위해 이 문제를 완화하기 위해 컴파일러에 Java와 유사한 bytecode를 생성하도록 지시하는 명령줄 컴파일러 옵션(`-Xnormalize-constructor-calls=MODE`)을 추가했습니다. 여기서 `MODE`는 다음 중 하나입니다.

* `disable`(기본값) – Kotlin 1.0 및 1.1과 동일한 방식으로 bytecode를 생성합니다.
* `enable` – constructor 호출에 대한 Java와 유사한 bytecode를 생성합니다. 클래스가 로드되고 초기화되는 순서가 변경될 수 있습니다.
* `preserve-class-initialization` – 클래스 초기화 순서가 유지되도록 constructor 호출에 대한 Java와 유사한 bytecode를 생성합니다. 이는 애플리케이션의 전체 성능에 영향을 미칠 수 있습니다. 여러 클래스 간에 공유되고 클래스 초기화 시 업데이트되는 복잡한 상태가 있는 경우에만 사용하세요.

"수동" 해결 방법은 제어 흐름이 있는 하위 표현식의 값을 호출 인수 내부에서 직접 평가하는 대신 변수에 저장하는 것입니다. `-Xnormalize-constructor-calls=enable`과 유사합니다.

### Java-default 메서드 호출

Kotlin 1.2 이전에는 JVM 1.6을 대상으로 하는 동안 Java-default 메서드를 재정의하는 인터페이스 멤버가 super 호출에 대해 경고를 생성했습니다. `Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`. Kotlin 1.2에서는 대신 **오류**가 발생하므로 이러한 코드를 JVM 대상 1.8로 컴파일해야 합니다.

### 주요 변경 사항: 플랫폼 type에 대한 x.equals(null)의 일관된 동작

Java primitive로 매핑되는 플랫폼 type(`Int!`, `Boolean!`, `Short`!, `Long!`, `Float!`, `Double!`, `Char!`)에서 `x.equals(null)`을 호출하면 `x`가 null일 때 잘못된 `true`가 반환되었습니다. Kotlin 1.2부터 플랫폼 type의 null 값에서 `x.equals(...)`를 호출하면 **NPE가 발생합니다**(하지만 `x == ...`는 발생하지 않음).

1.2 이전 동작으로 돌아가려면 컴파일러에 플래그 `-Xno-exception-on-explicit-equals-for-boxed-null`을 전달하세요.

### 주요 변경 사항: inlined 확장 receiver를 통해 플랫폼 null 이스케이프에 대한 수정 사항

플랫폼 type의 null 값에서 호출된 Inline 확장 함수는 receiver가 null인지 확인하지 않았으므로 null이 다른 코드로 이스케이프될 수 있습니다. Kotlin 1.2는 호출 사이트에서 이 검사를 강제로 수행하여 receiver가 null인 경우 예외를 발생시킵니다.

이전 동작으로 전환하려면 fallback 플래그 `-Xno-receiver-assertions`를 컴파일러에 전달하세요.

## JavaScript 백엔드

### TypedArrays 지원이 기본적으로 활성화됨

`IntArray`, `DoubleArray`와 같은 Kotlin primitive 배열을 [JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)로 변환하는 JS typed arrays 지원이 이전에 opt-in 기능이었지만 기본적으로 활성화되었습니다.

## 도구

### 경고를 오류로

이제 컴파일러는 모든 경고를 오류로 처리하는 옵션을 제공합니다. 명령줄에서 `-Werror`를 사용하거나 다음 Gradle 스니펫을 사용하세요.

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```