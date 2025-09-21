[//]: # (title: Kotlin 1.1의 새로운 기능)

_출시: 2016년 2월 15일_

## 목차

* [코루틴](#coroutines-experimental)
* [기타 언어 기능](#other-language-features)
* [표준 라이브러리](#standard-library)
* [JVM 백엔드](#jvm-backend)
* [JavaScript 백엔드](#javascript-backend)

## JavaScript

Kotlin 1.1부터 JavaScript 타겟은 더 이상 실험적인 기능으로 간주되지 않습니다. 모든 언어 기능이 지원되며, 프론트엔드 개발 환경과의 통합을 위한 새로운 도구들이 많이 추가되었습니다. 자세한 변경 사항 목록은 [아래](#javascript-backend)를 참조하십시오.

## 코루틴 (실험적)

Kotlin 1.1의 핵심 새 기능은 *코루틴(coroutines)*으로, `async`/`await`, `yield` 및 유사한 프로그래밍 패턴을 지원합니다. Kotlin 설계의 핵심 특징은 코루틴 실행 구현이 언어의 일부가 아닌 라이브러리의 일부이므로, 특정 프로그래밍 패러다임이나 동시성 라이브러리에 얽매이지 않는다는 것입니다.

코루틴은 효과적으로 일시 중단되었다가 나중에 다시 시작할 수 있는 경량 스레드입니다. 코루틴은 _[일시 중단 함수(suspending functions)](coroutines-basics.md)_를 통해 지원됩니다. 이러한 함수 호출은 코루틴을 잠재적으로 일시 중단할 수 있으며, 새로운 코루틴을 시작하기 위해 일반적으로 익명 일시 중단 함수(즉, 일시 중단 람다)를 사용합니다.

`async`/`await`를 살펴보겠습니다. 이는 외부 라이브러리인 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines)에 구현되어 있습니다.

```kotlin
// 백그라운드 스레드 풀에서 코드를 실행합니다.
fun asyncOverlay() = async(CommonPool) {
    // 두 개의 비동기 작업을 시작합니다.
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // 그리고 두 결과에 오버레이를 적용합니다.
    applyOverlay(original.await(), overlay.await())
}

// UI 컨텍스트에서 새 코루틴을 시작합니다.
launch(UI) {
    // 비동기 오버레이가 완료될 때까지 기다립니다.
    val image = asyncOverlay().await()
    // 그리고 UI에 표시합니다.
    showImage(image)
}
```

여기서 `async { ... }`는 코루틴을 시작하며, `await()`를 사용할 때 대기 중인 작업이 실행되는 동안 코루틴의 실행이 일시 중단되고, 대기 중인 작업이 완료되면 (다른 스레드에서일 수도 있음) 다시 시작됩니다.

표준 라이브러리는 `yield` 및 `yieldAll` 함수를 사용하여 *지연 생성 시퀀스(lazily generated sequences)*를 지원하기 위해 코루틴을 사용합니다. 이러한 시퀀스에서는 시퀀스 요소를 반환하는 코드 블록이 각 요소가 검색된 후 일시 중단되었다가 다음 요소가 요청될 때 다시 시작됩니다. 다음은 예시입니다.

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // i의 제곱을 yield
          yield(i * i)
      }
      // 범위를 yield
      yieldAll(26..28)
    }

    // 시퀀스를 출력합니다.
    println(seq.toList())
}
```

위 코드를 실행하여 결과를 확인하십시오. 자유롭게 편집하고 다시 실행해 보세요!

더 자세한 정보는 [코루틴 문서](coroutines-overview.md) 및 [튜토리얼](coroutines-and-channels.md)을 참조하십시오.

코루틴은 현재 **실험적 기능(experimental feature)**으로 간주되며, 이는 Kotlin 팀이 최종 1.1 릴리스 이후 이 기능의 하위 호환성을 지원할 의무가 없음을 의미합니다.

## 기타 언어 기능

### 타입 별칭(Type aliases)

타입 별칭을 사용하면 기존 타입에 대한 대체 이름을 정의할 수 있습니다. 이는 컬렉션과 같은 제네릭 타입뿐만 아니라 함수 타입에도 가장 유용합니다. 다음은 예시입니다.

```kotlin
//sampleStart
typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"
//sampleEnd

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (in our small example), but actually it's 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [타입 별칭 문서](type-aliases.md) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md)를 참조하십시오.

### 바운드 호출 가능 참조(Bound callable references)

이제 `::` 연산자를 사용하여 특정 객체 인스턴스의 메서드 또는 프로퍼티를 가리키는 [멤버 참조(member reference)](reflection.md#function-references)를 얻을 수 있습니다. 이전에는 람다로만 표현할 수 있었습니다. 다음은 예시입니다.

```kotlin
//sampleStart
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
//sampleEnd

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [문서](reflection.md) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md)를 참조하십시오.

### Sealed 클래스 및 Data 클래스

Kotlin 1.1에서는 Kotlin 1.0에 존재했던 sealed 클래스 및 data 클래스에 대한 일부 제한이 제거되었습니다. 이제 동일한 파일 내 최상위 수준에서 최상위 sealed 클래스의 서브클래스를 정의할 수 있으며, 더 이상 sealed 클래스의 중첩 클래스로만 정의할 필요가 없습니다. Data 클래스는 이제 다른 클래스를 확장할 수 있습니다. 이를 사용하여 표현식 클래스의 계층 구조를 깔끔하게 정의할 수 있습니다.

```kotlin
//sampleStart
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))
//sampleEnd

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [sealed 클래스 문서](sealed-classes.md) 또는 [sealed 클래스](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md) 및 [data 클래스](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md)에 대한 KEEPs를 참조하십시오.

### 람다에서의 구조 분해(Destructuring in lambdas)

이제 [구조 분해 선언(destructuring declaration)](destructuring-declarations.md) 구문을 사용하여 람다에 전달된 인수를 언팩할 수 있습니다. 다음은 예시입니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry ->
      val (key, value) = entry
      "$key -> $value!"
    })
    // now
    println(map.mapValues { (key, value) -> "$key -> $value!" })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [구조 분해 선언 문서](destructuring-declarations.md) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md)를 참조하십시오.

### 사용되지 않는 매개변수에 대한 밑줄(Underscores for unused parameters)

여러 매개변수를 가진 람다의 경우, 사용하지 않는 매개변수의 이름을 `_` 문자로 대체할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이는 [구조 분해 선언(destructuring declarations)](destructuring-declarations.md)에서도 작동합니다.

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {
//sampleStart
    val (_, status) = getResult()
//sampleEnd
    println("status is '$status'")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md)을 참조하십시오.

### 숫자 리터럴의 밑줄(Underscores in numeric literals)

Java 8과 마찬가지로, Kotlin은 이제 숫자 리터럴에서 밑줄을 사용하여 숫자 그룹을 분리할 수 있습니다.

```kotlin
//sampleStart
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
//sampleEnd

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md)를 참조하십시오.

### 프로퍼티의 단축 문법

게터(getter)가 표현식 본문으로 정의된 프로퍼티의 경우, 이제 프로퍼티 타입을 생략할 수 있습니다.

```kotlin
//sampleStart
    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}
//sampleEnd
fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 인라인 프로퍼티 접근자(Inline property accessors)

이제 프로퍼티에 배킹 필드가 없는 경우 `inline` 한정자로 프로퍼티 접근자를 표시할 수 있습니다. 이러한 접근자는 [인라인 함수(inline functions)](inline-functions.md)와 동일한 방식으로 컴파일됩니다.

```kotlin
//sampleStart
public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1
//sampleEnd

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

전체 프로퍼티를 `inline`으로 표시할 수도 있습니다. 그러면 해당 한정자가 두 접근자 모두에 적용됩니다.

자세한 내용은 [인라인 함수 문서](inline-functions.md#inline-properties) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md)를 참조하십시오.

### 지역 위임 프로퍼티(Local delegated properties)

이제 지역 변수에 [위임 프로퍼티(delegated property)](delegated-properties.md) 구문을 사용할 수 있습니다. 한 가지 가능한 용도는 지연 평가되는 지역 변수를 정의하는 것입니다.

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {
//sampleStart
    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // returns the random value
        println("The answer is $answer.")   // answer is calculated at this point
    }
    else {
        println("Sometimes no answer is the answer...")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md)를 참조하십시오.

### 위임 프로퍼티 바인딩 가로채기(Interception of delegated property binding)

[위임 프로퍼티(delegated properties)](delegated-properties.md)의 경우, 이제 `provideDelegate` 연산자를 사용하여 위임자(delegate)와 프로퍼티 바인딩을 가로챌 수 있습니다. 예를 들어, 바인딩하기 전에 프로퍼티 이름을 확인하고 싶다면 다음과 같이 작성할 수 있습니다.

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // property creation
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate` 메서드는 `MyUI` 인스턴스 생성 중에 각 프로퍼티에 대해 호출되며, 필요한 유효성 검사를 즉시 수행할 수 있습니다.

자세한 내용은 [위임 프로퍼티 문서](delegated-properties.md)를 참조하십시오.

### 제네릭 Enum 값 접근

이제 enum 클래스의 값을 제네릭 방식으로 열거할 수 있습니다.

```kotlin
//sampleStart
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}
//sampleEnd

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### DSL에서 암시적 리시버의 스코프 제어

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 어노테이션은 DSL 컨텍스트에서 외부 스코프의 리시버 사용을 제한할 수 있도록 합니다. 대표적인 [HTML 빌더 예시](type-safe-builders.md)를 살펴보겠습니다.

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

Kotlin 1.0에서는 `td`에 전달된 람다 내 코드가 `table`, `tr`, `td`에 전달된 세 가지 암시적 리시버에 접근할 수 있었습니다. 이로 인해 문맥상 의미 없는 메서드를 호출할 수 있었습니다. 예를 들어, `td` 내에서 `tr`을 호출하여 `<td>` 안에 `<tr>` 태그를 넣는 것이 가능했습니다.

Kotlin 1.1에서는 이를 제한하여 `td`에 전달된 람다 내부에서는 `td`의 암시적 리시버에 정의된 메서드만 사용할 수 있도록 할 수 있습니다. `@DslMarker` 메타 어노테이션으로 표시된 사용자 정의 어노테이션을 정의하고 이를 태그 클래스의 기본 클래스에 적용하여 수행할 수 있습니다.

자세한 내용은 [타입 안전 빌더 문서](type-safe-builders.md) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md)를 참조하십시오.

### rem 연산자

`mod` 연산자는 이제 더 이상 사용되지 않으며, 대신 `rem`이 사용됩니다. 자세한 내용은 [이 이슈](https://youtrack.jetbrains.com/issue/KT-14650)를 참조하십시오.

## 표준 라이브러리

### 문자열-숫자 변환

String 클래스에 새로운 확장 함수들이 추가되어 잘못된 숫자에 대해 예외를 발생시키지 않고 숫자로 변환할 수 있습니다. `String.toIntOrNull(): Int?`, `String.toDoubleOrNull(): Double?` 등이 있습니다.

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

또한 `Int.toString()`, `String.toInt()`, `String.toIntOrNull()`과 같은 정수 변환 함수들은 각각 `radix` 매개변수가 있는 오버로드(overload)를 가지게 되어 변환의 기저(base)를 지정할 수 있습니다 (2부터 36까지).

### onEach()

`onEach`는 컬렉션과 시퀀스를 위한 작지만 유용한 확장 함수로, 일련의 연산 체인에서 컬렉션/시퀀스의 각 요소에 대해 부수 효과(side-effects)를 가질 수 있는 어떤 작업을 수행할 수 있도록 합니다. 이터러블(iterables)에서는 `forEach`처럼 동작하지만 이터러블 인스턴스를 추가적으로 반환합니다. 시퀀스(sequences)에서는 주어진 액션을 요소가 반복되는 동안 지연적으로 적용하는 래핑 시퀀스를 반환합니다.

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also(), takeIf(), 및 takeUnless()

이들은 모든 리시버에 적용할 수 있는 세 가지 일반 목적의 확장 함수입니다.
 
`also`는 `apply`와 유사합니다. 리시버를 받아 어떤 작업을 수행한 다음 해당 리시버를 반환합니다. 차이점은 `apply` 내부 블록에서는 리시버를 `this`로 사용할 수 있지만, `also` 내부 블록에서는 `it`으로 사용할 수 있다는 것입니다(원한다면 다른 이름을 지정할 수도 있습니다). 이는 외부 스코프의 `this`를 가리고 싶지 않을 때 유용합니다.

```kotlin
class Block {
    lateinit var content: String
}

//sampleStart
fun Block.copy() = Block().also {
    it.content = this.content
}
//sampleEnd

// using 'apply' instead
fun Block.copy1() = Block().apply {
    this.content = this@copy1.content
}

fun main(args: Array<String>) {
    val block = Block().apply { content = "content" }
    val copy = block.copy()
    println("Testing the content was copied:")
    println(block.content == copy.content)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf`는 단일 값에 대한 `filter`와 같습니다. 리시버가 조건(predicate)을 만족하는지 확인하고, 만족하면 리시버를 반환하고, 그렇지 않으면 `null`을 반환합니다. 엘비스 연산자(`?:`)와 조기 반환(early returns)과 결합하여 다음과 같은 구문을 작성할 수 있습니다.

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

//sampleStart
    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found
//sampleEnd
    
    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeUnless`는 `takeIf`와 동일하지만, 역전된 조건(predicate)을 사용합니다. 이는 리시버가 조건(predicate)을 _만족하지 않을_ 때 리시버를 반환하고, 그렇지 않으면 `null`을 반환합니다. 따라서 위 예시 중 하나는 `takeUnless`를 사용하여 다음과 같이 다시 작성할 수 있습니다.

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

람다 대신 호출 가능 참조를 사용할 때도 편리합니다.

```kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//sampleEnd

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### groupingBy()

이 API는 키별로 컬렉션을 그룹화하고 각 그룹을 동시에 접는(fold) 데 사용될 수 있습니다. 예를 들어, 각 문자로 시작하는 단어의 수를 세는 데 사용할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//sampleEnd
    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.toMap() 및 Map.toMutableMap()

이 함수들은 맵을 쉽게 복사하는 데 사용될 수 있습니다.

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 연산자는 읽기 전용 맵에 키-값 쌍을 추가하여 새로운 맵을 생성하는 방법을 제공하지만, 그 반대로 맵에서 키를 제거하는 간단한 방법은 없었습니다. `Map.filter()` 또는 `Map.filterKeys()`와 같이 덜 직관적인 방법을 사용해야 했습니다. 이제 `minus` 연산자가 이 공백을 채웁니다. 단일 키 제거, 키 컬렉션 제거, 키 시퀀스 제거, 키 배열 제거를 위한 4가지 오버로드(overloads)가 제공됩니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//sampleEnd
    
    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### minOf() 및 maxOf()

이 함수들은 두 개 또는 세 개의 주어진 값(원시 숫자 또는 `Comparable` 객체) 중에서 가장 작은 값과 가장 큰 값을 찾는 데 사용될 수 있습니다. 또한 비교할 수 없는 객체를 비교하려는 경우 추가 `Comparator` 인스턴스를 받는 각 함수의 오버로드(overload)도 있습니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//sampleEnd
    
    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 배열과 유사한 List 인스턴스화 함수

`Array` 생성자와 유사하게, 이제 `List` 및 `MutableList` 인스턴스를 생성하고 람다를 호출하여 각 요소를 초기화하는 함수가 있습니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//sampleEnd

    println("squares: $squares")
    println("mutable: $mutable")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.getValue()

`Map`의 이 확장 함수는 주어진 키에 해당하는 기존 값을 반환하거나, 어떤 키를 찾지 못했는지 언급하며 예외를 발생시킵니다. 맵이 `withDefault`로 생성된 경우, 이 함수는 예외를 발생시키는 대신 기본 값을 반환합니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart    
    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k -> k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // <- this will throw NoSuchElementException
//sampleEnd
    
    println("value is $value")
    println("value2 is $value2")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 추상 컬렉션

이 추상 클래스들은 Kotlin 컬렉션 클래스를 구현할 때 기본 클래스로 사용될 수 있습니다. 읽기 전용 컬렉션을 구현하기 위해서는 `AbstractCollection`, `AbstractList`, `AbstractSet`, `AbstractMap`이 있으며, 변경 가능한(mutable) 컬렉션을 위해서는 `AbstractMutableCollection`, `AbstractMutableList`, `AbstractMutableSet`, `AbstractMutableMap`이 있습니다. JVM에서는 이 추상 변경 가능 컬렉션들이 대부분의 기능을 JDK의 추상 컬렉션으로부터 상속받습니다.

### 배열 조작 함수

표준 라이브러리는 이제 배열에 대한 요소별 연산을 위한 일련의 함수를 제공합니다. 비교(`contentEquals` 및 `contentDeepEquals`), 해시 코드 계산(`contentHashCode` 및 `contentDeepHashCode`), 그리고 문자열로 변환(`contentToString` 및 `contentDeepToString`) 함수가 있습니다. 이 함수들은 JVM(여기서는 `java.util.Arrays`의 해당 함수에 대한 별칭으로 작동)과 JS(여기서는 Kotlin 표준 라이브러리에서 구현 제공) 모두에서 지원됩니다.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## JVM 백엔드

### Java 8 바이트코드 지원

Kotlin은 이제 Java 8 바이트코드를 생성하는 옵션을 제공합니다(`-jvm-target 1.8` 명령줄 옵션 또는 Ant/Maven/Gradle의 해당 옵션). 현재로서는 이는 바이트코드의 의미를 변경하지 않지만 (특히, 인터페이스의 기본 메서드와 람다는 Kotlin 1.0과 동일하게 생성됨), 나중에 이를 더 활용할 계획입니다.

### Java 8 표준 라이브러리 지원

이제 Java 7 및 8에서 추가된 새로운 JDK API를 지원하는 표준 라이브러리의 별도 버전이 있습니다. 새로운 API에 접근해야 하는 경우, 표준 `kotlin-stdlib` 대신 `kotlin-stdlib-jre7` 및 `kotlin-stdlib-jre8` 메이븐 아티팩트를 사용하십시오. 이 아티팩트들은 `kotlin-stdlib` 위에 구축된 작은 확장 기능이며, 프로젝트에 전이적 의존성(transitive dependency)으로 가져옵니다.

### 바이트코드의 매개변수 이름

Kotlin은 이제 바이트코드에 매개변수 이름을 저장하는 것을 지원합니다. 이는 `-java-parameters` 명령줄 옵션을 사용하여 활성화할 수 있습니다.

### 상수 인라인(Constant inlining)

이제 컴파일러는 `const val` 프로퍼티의 값을 사용되는 위치에 인라인합니다.

### 변경 가능한 클로저 변수

람다에서 변경 가능한 클로저 변수를 캡처하는 데 사용되는 박스 클래스에는 더 이상 volatile 필드가 없습니다. 이 변경 사항은 성능을 향상시키지만, 일부 드문 사용 시나리오에서는 새로운 경쟁 조건(race conditions)을 초래할 수 있습니다. 이로 인해 영향을 받는 경우, 변수에 접근하기 위한 자체 동기화를 제공해야 합니다.

### javax.script 지원

Kotlin은 이제 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223)와 통합됩니다. 이 API는 런타임에 코드 스니펫을 평가할 수 있도록 합니다.

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

이 API를 사용하는 더 큰 예제 프로젝트는 [여기](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)를 참조하십시오.

### kotlin.reflect.full

[Java 9 지원을 준비하기 위해](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/), `kotlin-reflect.jar` 라이브러리의 확장 함수 및 프로퍼티가 `kotlin.reflect.full` 패키지로 이동되었습니다. 이전 패키지(`kotlin.reflect`)의 이름은 더 이상 사용되지 않으며 Kotlin 1.2에서 제거될 예정입니다. 핵심 리플렉션 인터페이스(예: `KClass`)는 `kotlin-reflect`가 아닌 Kotlin 표준 라이브러리의 일부이며, 이동의 영향을 받지 않습니다.

## JavaScript 백엔드

### 통합 표준 라이브러리

이제 JavaScript로 컴파일된 코드에서 Kotlin 표준 라이브러리의 훨씬 더 많은 부분을 사용할 수 있습니다. 특히, 컬렉션(`ArrayList`, `HashMap` 등), 예외(`IllegalArgumentException` 등) 및 몇몇 다른 클래스(`StringBuilder`, `Comparator`)와 같은 핵심 클래스들이 이제 `kotlin` 패키지 아래에 정의됩니다. JVM에서는 해당 이름이 JDK 클래스에 대한 타입 별칭이며, JS에서는 해당 클래스들이 Kotlin 표준 라이브러리에서 구현됩니다.

### 개선된 코드 생성

JavaScript 백엔드는 이제 더 정적으로 검사 가능한 코드를 생성하여, 미니파이어(minifiers), 최적화 도구(optimizers), 린터(linters) 등 JS 코드 처리 도구에 더 친화적입니다.

### external 한정자

Kotlin에서 JavaScript로 구현된 클래스에 타입 안전한 방식으로 접근해야 하는 경우, `external` 한정자를 사용하여 Kotlin 선언을 작성할 수 있습니다. (Kotlin 1.0에서는 대신 `@native` 어노테이션이 사용되었습니다.) JVM 타겟과 달리 JS 타겟은 클래스 및 프로퍼티와 함께 external 한정자를 사용할 수 있도록 허용합니다. 예를 들어, DOM `Node` 클래스를 선언하는 방법은 다음과 같습니다.

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### 개선된 임포트 처리

이제 JavaScript 모듈에서 임포트되어야 하는 선언을 더 정확하게 기술할 수 있습니다. 외부 선언에 `@JsModule("<module-name>")` 어노테이션을 추가하면 컴파일 중에 모듈 시스템(CommonJS 또는 AMD 중 하나)으로 적절히 임포트됩니다. 예를 들어, CommonJS를 사용하면 선언은 `require(...)` 함수를 통해 임포트됩니다. 또한, 선언을 모듈로 임포트하거나 전역 JavaScript 객체로 임포트하려면 `@JsNonModule` 어노테이션을 사용할 수 있습니다.

예를 들어, JQuery를 Kotlin 모듈로 임포트하는 방법은 다음과 같습니다.

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

이 경우 JQuery는 `jquery`라는 이름의 모듈로 임포트됩니다. 또는 Kotlin 컴파일러가 사용하도록 구성된 모듈 시스템에 따라 $-객체로 사용될 수도 있습니다.

애플리케이션에서 다음과 같이 이 선언들을 사용할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```