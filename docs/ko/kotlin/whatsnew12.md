[//]: # (title: Kotlin 1.2의 새로운 기능)

_출시일: 2017년 11월 28일_

## 목차

* [다중 플랫폼 프로젝트 (실험적 기능)](#multiplatform-projects-experimental)
* [기타 언어 기능](#other-language-features)
* [표준 라이브러리](#standard-library)
* [JVM 백엔드](#jvm-backend)
* [JavaScript 백엔드](#javascript-backend)

## 다중 플랫폼 프로젝트 (실험적 기능)

다중 플랫폼 프로젝트는 Kotlin 1.2의 새로운 **실험적** 기능으로, Kotlin이 지원하는 대상 플랫폼(JVM, JavaScript, 그리고 (향후) 네이티브) 간에 코드를 재사용할 수 있게 해줍니다. 다중 플랫폼 프로젝트에는 세 가지 종류의 모듈이 있습니다:

*   *공통* 모듈에는 어떤 플랫폼에도 특정되지 않은 코드와 플랫폼 종속적 API의 구현이 없는 선언이 포함됩니다.
*   *플랫폼* 모듈에는 특정 플랫폼에 대한 공통 모듈의 플랫폼 종속적 선언 구현과 기타 플랫폼 종속적 코드가 포함됩니다.
*   일반 모듈은 특정 플랫폼을 대상으로 하며, 플랫폼 모듈의 종속성이 될 수도 있고 플랫폼 모듈에 의존할 수도 있습니다.

특정 플랫폼용 다중 플랫폼 프로젝트를 컴파일하면 공통 및 플랫폼별 부분 모두에 대한 코드가 생성됩니다.

다중 플랫폼 프로젝트 지원의 핵심 기능은 *expected* 및 *actual* 선언을 통해 공통 코드의 플랫폼별 부분에 대한 의존성을 표현할 수 있다는 것입니다. *expected* 선언은 API(클래스, 인터페이스, 어노테이션, 최상위 선언 등)를 지정합니다. *actual* 선언은 API의 플랫폼 종속적 구현이거나 외부 라이브러리에 있는 API의 기존 구현을 참조하는 타입 별칭입니다. 다음은 예시입니다:

공통 코드에서:

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

JVM 플랫폼 코드에서:

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

다중 플랫폼 프로젝트 구축에 대한 자세한 내용과 단계는 [다중 플랫폼 프로그래밍 문서](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)를 참조하세요.

## 기타 언어 기능

### 어노테이션의 배열 리터럴

Kotlin 1.2부터 어노테이션에 대한 배열 인수는 `arrayOf` 함수 대신 새로운 배열 리터럴 문법으로 전달할 수 있습니다:

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

배열 리터럴 문법은 어노테이션 인수로 제한됩니다.

### lateinit 최상위 프로퍼티 및 지역 변수

`lateinit` 변경자는 이제 최상위 프로퍼티와 지역 변수에서 사용할 수 있습니다. 후자는 예를 들어, 한 객체의 생성자 인수로 전달된 람다가 나중에 정의되어야 하는 다른 객체를 참조할 때 사용할 수 있습니다.

```kotlin
class Node<T>(val value: T, val next: () -> Node<T>)

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### lateinit var 초기화 여부 확인

이제 프로퍼티 참조에 `isInitialized`를 사용하여 `lateinit var`가 초기화되었는지 확인할 수 있습니다.

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {
//sampleStart
        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)
//sampleEnd
    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 기본 함수 파라미터를 가진 인라인 함수

인라인 함수는 이제 인라인된 함수 파라미터에 대한 기본값을 가질 수 있습니다.

```kotlin
//sampleStart
inline fun <E> Iterable<E>.strings(transform: (E) -> String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 
//sampleEnd

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 명시적 캐스트 정보가 타입 추론에 사용됨

Kotlin 컴파일러는 이제 타입 추론에서 타입 캐스트 정보를 사용할 수 있습니다. 타입 파라미터 `T`를 반환하는 제네릭 메서드를 호출하고 반환 값을 특정 타입 `Foo`로 캐스팅하는 경우, 컴파일러는 이제 이 호출에 대한 `T`가 `Foo` 타입에 바인딩되어야 함을 이해합니다.

이는 Android API 레벨 26에서 제네릭 `findViewById` 호출을 컴파일러가 이제 올바르게 분석할 수 있기 때문에 Android 개발자에게 특히 중요합니다.

```kotlin
val button = findViewById(R.id.button) as Button
```

### 스마트 캐스트 개선 사항

변수가 안전 호출 식에서 할당되고 null 검사가 이루어질 때, 스마트 캐스트는 이제 안전 호출 리시버에도 적용됩니다.

```kotlin
fun countFirst(s: Any): Int {
//sampleStart
    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any는 CharSequence로 스마트 캐스트됩니다.

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any는 Iterable<*>로 스마트 캐스트됩니다.
//sampleEnd
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한, 람다 내부의 스마트 캐스트는 람다 이전에만 수정되는 지역 변수에 대해 허용됩니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x는 String으로 스마트 캐스트됩니다.
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `this::foo`의 축약형으로 `::foo` 지원

`this`의 멤버에 대한 바운드 호출 가능 참조는 이제 명시적 리시버 없이 `this::foo` 대신 `::foo`로 작성할 수 있습니다. 이는 또한 외부 리시버의 멤버를 참조하는 람다에서 호출 가능 참조를 더 편리하게 사용할 수 있게 합니다.

### 변경 사항: try 블록 이후의 건전한 스마트 캐스트

이전에는 Kotlin이 `try` 블록 내부에서 이루어진 할당을 블록 이후의 스마트 캐스트에 사용했는데, 이는 타입 안정성 및 null 안정성을 깨뜨리고 런타임 오류로 이어질 수 있었습니다. 이번 릴리스는 이 문제를 해결하여 스마트 캐스트를 더 엄격하게 만들었지만, 이러한 스마트 캐스트에 의존하던 일부 코드는 더 이상 작동하지 않을 수 있습니다.

이전 스마트 캐스트 동작으로 전환하려면 컴파일러 인수로 폴백 플래그 `-Xlegacy-smart-cast-after-try`를 전달하세요. Kotlin 1.3에서는 더 이상 사용되지 않습니다.

### 지원 중단: `copy`를 오버라이드하는 데이터 클래스

데이터 클래스가 동일한 시그니처를 가진 `copy` 함수를 이미 가지고 있는 타입에서 파생될 때, 데이터 클래스에 대해 생성된 `copy` 구현은 슈퍼타입의 기본값을 사용하게 되어 직관적이지 않은 동작을 유발하거나, 슈퍼타입에 기본 파라미터가 없으면 런타임에 실패할 수 있었습니다.

`copy` 충돌을 유발하는 상속은 Kotlin 1.2에서 경고와 함께 지원이 중단되었으며, Kotlin 1.3에서는 오류가 됩니다.

### 지원 중단: 열거형 항목 내의 중첩 타입

열거형 항목 내에서 `inner class`가 아닌 중첩 타입을 정의하는 것은 초기화 로직의 문제로 인해 지원이 중단되었습니다. 이는 Kotlin 1.2에서 경고를 발생시키고 Kotlin 1.3에서는 오류가 됩니다.

### 지원 중단: `vararg`의 단일 명명된 인자

어노테이션의 배열 리터럴과의 일관성을 위해, `vararg` 파라미터에 단일 항목을 명명된 형식(`foo(items = i)`)으로 전달하는 것이 지원 중단되었습니다. 해당하는 배열 팩토리 함수와 함께 스프레드 연산자를 사용하세요:

```kotlin
foo(items = *arrayOf(1))
```

이러한 경우에 불필요한 배열 생성을 제거하는 최적화가 있어 성능 저하를 방지합니다. 단일 인자 형식은 Kotlin 1.2에서 경고를 생성하며 Kotlin 1.3에서는 제거될 예정입니다.

### 지원 중단: `Throwable`을 확장하는 제네릭 클래스의 내부 클래스

`Throwable`을 상속하는 제네릭 타입의 내부 클래스는 throw-catch 시나리오에서 타입 안정성을 위반할 수 있으므로, Kotlin 1.2에서 경고와 함께 지원이 중단되었으며 Kotlin 1.3에서는 오류가 됩니다.

### 지원 중단: 읽기 전용 프로퍼티의 지원 필드 변경

사용자 정의 getter에서 `field = ...`를 할당하여 읽기 전용 프로퍼티의 지원 필드를 변경하는 것은 Kotlin 1.2에서 경고와 함께 지원이 중단되었으며 Kotlin 1.3에서는 오류가 됩니다.

## 표준 라이브러리

### Kotlin 표준 라이브러리 아티팩트 및 분할 패키지

Kotlin 표준 라이브러리는 이제 Java 9 모듈 시스템과 완벽하게 호환되며, Java 9 모듈 시스템은 분할 패키지(동일한 패키지 내 클래스를 선언하는 여러 JAR 파일)를 금지합니다. 이를 지원하기 위해 이전 `kotlin-stdlib-jre7` 및 `kotlin-stdlib-jre8`을 대체하는 새로운 아티팩트 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 도입되었습니다.

새로운 아티팩트의 선언은 Kotlin 관점에서는 동일한 패키지 이름으로 보이지만, Java의 경우 다른 패키지 이름을 가집니다. 따라서 새로운 아티팩트로 전환해도 소스 코드에 변경이 필요하지 않습니다.

새로운 모듈 시스템과의 호환성을 보장하기 위한 또 다른 변경 사항은 `kotlin-reflect` 라이브러리에서 `kotlin.reflect` 패키지의 지원 중단된 선언을 제거하는 것입니다. 만약 이를 사용하고 있었다면, Kotlin 1.1부터 지원되는 `kotlin.reflect.full` 패키지의 선언을 사용하도록 전환해야 합니다.

### `windowed`, `chunked`, `zipWithNext`

`Iterable<T>`, `Sequence<T>`, `CharSequence`를 위한 새로운 확장 함수는 버퍼링 또는 배치 처리(`chunked`), 슬라이딩 윈도우 및 슬라이딩 평균 계산(`windowed`), 연속된 항목 쌍 처리(`zipWithNext`)와 같은 사용 사례를 다룹니다:

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) -> Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b -> b - a }
//sampleEnd

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `fill`, `replaceAll`, `shuffle`/`shuffled`

리스트 조작을 위한 확장 함수 세트가 추가되었습니다: `MutableList`를 위한 `fill`, `replaceAll`, `shuffle`, 그리고 읽기 전용 `List`를 위한 `shuffled`입니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `kotlin-stdlib`의 수학 연산

오랜 요청에 부응하여 Kotlin 1.2는 JVM과 JS에 공통으로 사용되는 수학 연산을 위한 `kotlin.math` API를 추가했으며, 다음을 포함합니다:

*   상수: `PI` 및 `E`
*   삼각 함수: `cos`, `sin`, `tan` 및 역함수: `acos`, `asin`, `atan`, `atan2`
*   쌍곡선 함수: `cosh`, `sinh`, `tanh` 및 역함수: `acosh`, `asinh`, `atanh`
*   지수: `pow`(확장 함수), `sqrt`, `hypot`, `exp`, `expm1`
*   로그: `log`, `log2`, `log10`, `ln`, `ln1p`
*   반올림:
    *   `ceil`, `floor`, `truncate`, `round`(반올림) 함수
    *   `roundToInt`, `roundToLong`(정수로 반올림) 확장 함수
*   부호 및 절대값:
    *   `abs` 및 `sign` 함수
    *   `absoluteValue` 및 `sign` 확장 프로퍼티
    *   `withSign` 확장 함수
*   두 값의 `max` 및 `min`
*   이진 표현:
    *   `ulp` 확장 프로퍼티
    *   `nextUp`, `nextDown`, `nextTowards` 확장 함수
    *   `toBits`, `toRawBits`, `Double.fromBits`(이들은 `kotlin` 패키지에 있습니다)

동일한 함수 세트(상수 제외)는 `Float` 인자에 대해서도 사용 가능합니다.

### `BigInteger` 및 `BigDecimal` 연산자 및 변환

Kotlin 1.2는 `BigInteger` 및 `BigDecimal`와 연산하고 다른 숫자 타입에서 이들을 생성하기 위한 함수 세트를 도입합니다. 다음은 다음과 같습니다:

*   `Int` 및 `Long`을 위한 `toBigInteger`
*   `Int`, `Long`, `Float`, `Double`, `BigInteger`를 위한 `toBigDecimal`
*   산술 및 비트 연산자 함수:
    *   이항 연산자 `+`, `-`, `*`, `/`, `%` 및 중위 함수 `and`, `or`, `xor`, `shl`, `shr`
    *   단항 연산자 `-`, `++`, `--` 및 함수 `inv`

### 부동 소수점 비트 변환

`Double` 및 `Float`를 비트 표현으로 변환하거나 비트 표현에서 변환하는 새로운 함수가 추가되었습니다:

*   `Double`의 경우 `Long`, `Float`의 경우 `Int`를 반환하는 `toBits` 및 `toRawBits`
*   비트 표현에서 부동 소수점 숫자를 생성하기 위한 `Double.fromBits` 및 `Float.fromBits`

### `Regex`가 이제 직렬화 가능

`kotlin.text.Regex` 클래스는 `Serializable`이 되었으며 이제 직렬화 가능한 계층 구조에서 사용할 수 있습니다.

### `Closeable.use`는 가능하면 `Throwable.addSuppressed`를 호출합니다.

`Closeable.use` 함수는 다른 예외 발생 후 리소스를 닫는 도중 예외가 발생할 경우 `Throwable.addSuppressed`를 호출합니다.

이 동작을 활성화하려면 종속성에 `kotlin-stdlib-jdk7`이 있어야 합니다.

## JVM 백엔드

### 생성자 호출 정규화

Kotlin 1.0 버전부터 Kotlin은 try-catch 식 및 인라인 함수 호출과 같은 복잡한 제어 흐름을 가진 식을 지원했습니다. 이러한 코드는 Java Virtual Machine 사양에 따라 유효합니다. 불행히도, 일부 바이트코드 처리 도구는 생성자 호출의 인수에 이러한 식이 있을 때 이러한 코드를 제대로 처리하지 못합니다.

이러한 바이트코드 처리 도구 사용자들의 이 문제를 완화하기 위해, 컴파일러가 이러한 구조에 대해 더 Java와 유사한 바이트코드를 생성하도록 지시하는 명령줄 컴파일러 옵션(`-Xnormalize-constructor-calls=MODE`)을 추가했습니다. 여기서 `MODE`는 다음 중 하나입니다:

*   `disable`(기본값) – Kotlin 1.0 및 1.1과 동일한 방식으로 바이트코드 생성.
*   `enable` – 생성자 호출에 대해 Java와 유사한 바이트코드 생성. 이는 클래스 로드 및 초기화 순서를 변경할 수 있습니다.
*   `preserve-class-initialization` – 클래스 초기화 순서가 보존되도록 보장하면서 생성자 호출에 대해 Java와 유사한 바이트코드 생성. 이는 애플리케이션의 전체 성능에 영향을 미칠 수 있습니다. 여러 클래스 간에 공유되고 클래스 초기화 시 업데이트되는 복잡한 상태가 있는 경우에만 사용하십시오.

"수동" 해결 방법은 제어 흐름이 있는 하위 식의 값을 호출 인자 내에서 직접 평가하는 대신 변수에 저장하는 것입니다. 이는 `-Xnormalize-constructor-calls=enable`과 유사합니다.

### Java 기본 메서드 호출

Kotlin 1.2 이전에는 JVM 1.6을 대상으로 하면서 Java 기본 메서드를 오버라이드하는 인터페이스 멤버가 슈퍼 호출에서 `Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'` 경고를 발생시켰습니다. Kotlin 1.2에서는 대신 **오류**가 발생하므로, 해당 코드는 JVM 타겟 1.8로 컴파일해야 합니다.

### 변경 사항: 플랫폼 타입에 대한 `x.equals(null)`의 일관된 동작

Java 기본 타입(`Int!`, `Boolean!`, `Short!`, `Long!`, `Float!`, `Double!`, `Char!`)에 매핑되는 플랫폼 타입에서 `x.equals(null)`을 호출하면 `x`가 null일 때 잘못되게 `true`를 반환했습니다. Kotlin 1.2부터 플랫폼 타입의 null 값에 대해 `x.equals(...)`를 호출하면 **NPE를 발생시킵니다**(하지만 `x == ...`는 그렇지 않습니다).

1.2 이전 동작으로 돌아가려면 컴파일러에 플래그 `-Xno-exception-on-explicit-equals-for-boxed-null`을 전달하세요.

### 변경 사항: 인라인된 확장 리시버를 통한 플랫폼 null 누출 수정

플랫폼 타입의 null 값에 대해 호출된 인라인 확장 함수는 리시버의 null 검사를 하지 않았고, 따라서 null이 다른 코드로 누출되는 것을 허용했습니다. Kotlin 1.2는 호출 사이트에서 이 검사를 강제하며, 리시버가 null이면 예외를 발생시킵니다.

이전 동작으로 전환하려면 컴파일러에 폴백 플래그 `-Xno-receiver-assertions`를 전달하세요.

## JavaScript 백엔드

### TypedArrays 지원 기본 활성화

Kotlin 기본 배열(예: `IntArray`, `DoubleArray`)을 [JavaScript TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)로 변환하는 JS TypedArray 지원은 이전에 선택적 기능이었으나, 이제 기본적으로 활성화되었습니다.

## 도구

### 경고를 오류로 처리

컴파일러는 이제 모든 경고를 오류로 처리하는 옵션을 제공합니다. 명령줄에서 `-Werror`를 사용하거나 다음 Gradle 스니펫을 사용하십시오:

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```