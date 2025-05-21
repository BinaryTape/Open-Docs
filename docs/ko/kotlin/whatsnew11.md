---
title: "Kotlin 1.1의 새로운 기능"
---
_릴리스 날짜: 2016년 2월 15일_

## 목차

* [코루틴](#coroutines-experimental)
* [기타 언어 기능](#other-language-features)
* [표준 라이브러리](#standard-library)
* [JVM 백엔드](#jvm-backend)
* [JavaScript 백엔드](#javascript-backend)

## JavaScript

Kotlin 1.1부터 JavaScript 대상은 더 이상 실험적인 것으로 간주되지 않습니다. 모든 언어 기능이 지원되며 프런트엔드 개발 환경과의 통합을 위한 많은 새로운 도구가 있습니다. 자세한 변경 사항 목록은 [아래](#javascript-backend)를 참조하십시오.

## 코루틴 (experimental)

Kotlin 1.1의 주요 새로운 기능은 *코루틴*으로, `async`/`await`, `yield` 및 유사한 프로그래밍 패턴을 지원합니다. Kotlin 설계의 핵심 기능은 코루틴 실행 구현이 언어가 아닌 라이브러리의 일부이므로 특정 프로그래밍 패러다임이나 동시성 라이브러리에 얽매이지 않는다는 것입니다.

코루틴은 일시 중단되었다가 나중에 다시 시작될 수 있는 경량 스레드입니다. 코루틴은 *[중단 함수](coroutines-basics#extract-function-refactoring)*를 통해 지원됩니다. 이러한 함수 호출은 코루틴을 일시 중단할 수 있으며, 새 코루틴을 시작하기 위해 일반적으로 익명 중단 함수(예: 중단 람다)를 사용합니다.

외부 라이브러리인 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines)에 구현된 `async`/`await`을 살펴보겠습니다.

```kotlin
// runs the code in the background thread pool
fun asyncOverlay() = async(CommonPool) {
    // start two async operations
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // and then apply overlay to both results
    applyOverlay(original.await(), overlay.await())
}

// launches new coroutine in UI context
launch(UI) {
    // wait for async overlay to complete
    val image = asyncOverlay().await()
    // and then show it in UI
    showImage(image)
}
```

여기서 `async { ... }`는 코루틴을 시작하고, `await()`을 사용하면 대기 중인 작업이 실행되는 동안 코루틴 실행이 일시 중단되고 대기 중인 작업이 완료되면 (아마도 다른 스레드에서) 다시 시작됩니다.

표준 라이브러리는 `yield` 및 `yieldAll` 함수를 사용하여 *지연 생성 시퀀스*를 지원하기 위해 코루틴을 사용합니다. 이러한 시퀀스에서 시퀀스 요소를 반환하는 코드 블록은 각 요소가 검색된 후 일시 중단되고 다음 요소가 요청될 때 다시 시작됩니다. 다음은 예입니다.

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // yield a square of i
          yield(i * i)
      }
      // yield a range
      yieldAll(26..28)
    }

    // print the sequence
    println(seq.toList())
}
```

위의 코드를 실행하여 결과를 확인하십시오. 자유롭게 편집하고 다시 실행하십시오!

자세한 내용은 [코루틴 설명서](coroutines-overview) 및 [튜토리얼](coroutines-and-channels)을 참조하십시오.

코루틴은 현재 **실험적 기능**으로 간주되므로 Kotlin 팀은 최종 1.1 릴리스 이후 이 기능의 이전 버전과의 호환성을 지원하지 않습니다.

## 기타 언어 기능

### 타입 별칭

타입 별칭을 사용하면 기존 타입의 대체 이름을 정의할 수 있습니다. 이는 컬렉션과 같은 제네릭 타입과 함수 타입에 가장 유용합니다. 다음은 예입니다.

```kotlin

typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"

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

자세한 내용은 [타입 별칭 설명서](type-aliases) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases)을 참조하십시오.

### 바운드 호출 가능 참조

이제 `::` 연산자를 사용하여 특정 객체 인스턴스의 메서드 또는 속성을 가리키는 [멤버 참조](reflection#function-references)를 얻을 수 있습니다. 이전에는 람다로만 표현할 수 있었습니다. 다음은 예입니다.

```kotlin

val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```

자세한 내용은 [설명서](reflection) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references)을 읽어보십시오.

### Sealed 클래스 및 Data 클래스

Kotlin 1.1은 Kotlin 1.0에 존재했던 sealed 클래스 및 data 클래스에 대한 일부 제한을 제거합니다. 이제 sealed 클래스의 중첩 클래스뿐만 아니라 동일한 파일의 최상위 수준에서 최상위 sealed 클래스의 서브클래스를 정의할 수 있습니다. Data 클래스는 이제 다른 클래스를 확장할 수 있습니다. 이를 사용하여 표현식 클래스의 계층 구조를 깔끔하게 정의할 수 있습니다.

```kotlin

sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const `->` expr.number
    is Sum `->` eval(expr.e1) + eval(expr.e2)
    NotANumber `->` Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```

자세한 내용은 [sealed 클래스 설명서](sealed-classes) 또는 KEEPs for
[sealed class](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance) 및
[data class](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance)를 참조하십시오.

### 람다의 구조 분해

이제 [구조 분해 선언](destructuring-declarations) 구문을 사용하여 람다에 전달된 인수를 압축 해제할 수 있습니다. 다음은 예입니다.

```kotlin
fun main(args: Array<String>) {

    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry `->`
      val (key, value) = entry
      "$key `->` $value!"
    })
    // now
    println(map.mapValues { (key, value) `->` "$key `->` $value!" })

}
```

자세한 내용은 [구조 분해 선언 설명서](destructuring-declarations) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters)을 참조하십시오.

### 사용되지 않는 매개변수에 대한 밑줄

매개변수가 여러 개인 람다의 경우 사용하지 않는 매개변수의 이름을 `_` 문자로 바꿀 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

    map.forEach { _, value `->` println("$value!") }

}
```

이는 [구조 분해 선언](destructuring-declarations)에서도 작동합니다.

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {

    val (_, status) = getResult()

    println("status is '$status'")
}
```

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters)을 참조하십시오.

### 숫자 리터럴의 밑줄

Java 8과 마찬가지로 Kotlin은 이제 숫자 리터럴에서 밑줄을 사용하여 숫자 그룹을 구분할 수 있습니다.

```kotlin

val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals)을 참조하십시오.

### 속성에 대한 더 짧은 구문

getter가 표현식 본문으로 정의된 속성의 경우 이제 속성 타입을 생략할 수 있습니다.

```kotlin

    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}

fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```

### 인라인 속성 접근자

속성에 지원 필드가 없는 경우 이제 `inline` 수정자로 속성 접근자를 표시할 수 있습니다. 이러한 접근자는 [인라인 함수](inline-functions)와 같은 방식으로 컴파일됩니다.

```kotlin

public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```

전체 속성을 `inline`으로 표시할 수도 있습니다. 그러면 수정자가 두 접근자에 모두 적용됩니다.

자세한 내용은 [인라인 함수 설명서](inline-functions#inline-properties) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties)을 참조하십시오.

### 로컬 위임된 속성

이제 로컬 변수와 함께 [위임된 속성](delegated-properties) 구문을 사용할 수 있습니다. 가능한 용도 중 하나는 지연 평가된 로컬 변수를 정의하는 것입니다.

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {

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

}
```

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties)을 참조하십시오.

### 위임된 속성 바인딩의 인터셉션

[위임된 속성](delegated-properties)의 경우 이제 `provideDelegate` 연산자를 사용하여 속성 바인딩에 대한 위임을 가로챌 수 있습니다. 예를 들어 바인딩하기 전에 속성 이름을 확인하려면 다음과 같이 작성할 수 있습니다.

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

`provideDelegate` 메서드는 `MyUI` 인스턴스를 만드는 동안 각 속성에 대해 호출되며 필요한 유효성 검사를 즉시 수행할 수 있습니다.

자세한 내용은 [위임된 속성 설명서](delegated-properties)를 참조하십시오.

### 제네릭 Enum 값 액세스

이제 Enum 클래스의 값을 제네릭 방식으로 열거할 수 있습니다.

```kotlin

enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```

### DSL에서 암시적 수신자에 대한 범위 제어

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 주석을 사용하면 DSL 컨텍스트에서 외부 범위의 수신자 사용을 제한할 수 있습니다. 정규 [HTML 빌더 예제](type-safe-builders)를 고려하십시오.

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

Kotlin 1.0에서 `td`에 전달된 람다의 코드는 `table`, `tr` 및 `td`에 전달된 세 개의 암시적 수신자에 액세스할 수 있습니다. 이렇게 하면 컨텍스트에서 의미가 없는 메서드, 예를 들어 `td` 내부에서 `tr`을 호출하여 `<td>`에 `<tr>` 태그를 넣을 수 있습니다.

Kotlin 1.1에서는 `td`의 암시적 수신자에 정의된 메서드만 `td`에 전달된 람다 내에서 사용할 수 있도록 제한할 수 있습니다. `@DslMarker` 메타 주석으로 표시된 주석을 정의하고 태그 클래스의 기본 클래스에 적용하면 됩니다.

자세한 내용은 [타입 안전 빌더 설명서](type-safe-builders) 및 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers)을 참조하십시오.

### rem 연산자

`mod` 연산자는 이제 더 이상 사용되지 않으며 대신 `rem`이 사용됩니다. 동기는 [이 이슈](https://youtrack.jetbrains.com/issue/KT-14650)를 참조하십시오.

## 표준 라이브러리

### String에서 숫자로 변환

잘못된 숫자에 대한 예외를 발생시키지 않고 문자열을 숫자로 변환하는 String 클래스에 대한 새로운 확장 기능이 있습니다.
`String.toIntOrNull(): Int?`, `String.toDoubleOrNull(): Double?` 등

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

또한 `Int.toString()`, `String.toInt()`, `String.toIntOrNull()`과 같은 정수 변환 함수는 각각 변환의 기본 (2에서 36)을 지정할 수 있는 `radix` 매개변수를 사용하여 오버로드를 받았습니다.

### onEach()

`onEach`는 컬렉션 및 시퀀스에 대한 작지만 유용한 확장 함수로, 작업 체인에서 컬렉션/시퀀스의 각 요소에 대해 일부 작업을 수행 할 수 있습니다. 가능한 부작용이 있습니다. 반복 가능 객체의 경우 `forEach`와 같이 동작하지만 반복 가능한 인스턴스도 추가로 반환합니다. 그리고 시퀀스에서는 요소가 반복될 때 주어진 작업을 지연 적용하는 래핑 시퀀스를 반환합니다.

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also(), takeIf() 및 takeUnless()

이들은 모든 수신기에 적용 할 수있는 세 가지 범용 확장 기능입니다.

`also`는 `apply`와 같습니다. 수신자를 가져 와서 작업을 수행하고 해당 수신자를 반환합니다.
차이점은 `apply` 내부의 블록에서 수신자를 `this`로 사용할 수있는 반면, `also` 내부의 블록에서는 `it`으로 사용할 수 있습니다 (원하는 경우 다른 이름을 지정할 수 있음).
외부 범위에서 `this`를 섀도우하고 싶지 않을 때 편리합니다.

```kotlin
class Block {
    lateinit var content: String
}

fun Block.copy() = Block().also {
    it.content = this.content
}

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

`takeIf`는 단일 값에 대한 `filter`와 같습니다. 수신자가 술어를 충족하는지 확인하고 충족되면 수신자를 반환하고 충족되지 않으면 `null`을 반환합니다.
엘비스 연산자 (?:) 및 초기 반환과 결합하면 다음과 같은 구문을 작성할 수 있습니다.

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found

    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```

`takeUnless`는 `takeIf`와 동일하지만 반전된 술어를 사용합니다. 술어를 _충족하지 않으면_ 수신자를 반환하고 그렇지 않으면 `null`을 반환합니다. 따라서 위의 예 중 하나를 `takeUnless`로 다음과 같이 다시 작성할 수 있습니다.

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

람다 대신 호출 가능 참조가있는 경우에도 사용하기에 편리합니다.

```kotlin
private fun testTakeUnless(string: String) {

    val result = string.takeUnless(String::isEmpty)

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```

### groupingBy()

이 API는 키별로 컬렉션을 그룹화하고 각 그룹을 동시에 폴딩하는 데 사용할 수 있습니다. 예를 들어 각 문자로 시작하는 단어 수를 세는 데 사용할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')

    val frequencies = words.groupingBy { it.first() }.eachCount()

    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) `->` list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```

### Map.toMap() 및 Map.toMutableMap()

이러한 함수는 맵을 쉽게 복사하는 데 사용할 수 있습니다.

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 연산자는 읽기 전용 맵에 키-값 쌍을 추가하여 새 맵을 생성하는 방법을 제공하지만 그 반대를 수행하는 간단한 방법은 없었습니다. 맵에서 키를 제거하려면 `Map.filter()` 또는 `Map.filterKeys()`와 같이 덜 간단한 방법을 사용해야합니다.
이제 `minus` 연산자가 이 간격을 채 웁니다. 단일 키, 키 컬렉션, 키 시퀀스 및 키 배열을 제거하는 데 사용할 수있는 4 개의 오버로드가 있습니다.

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    val emptyMap = map - "key"

    println("map: $map")
    println("emptyMap: $emptyMap")
}
```

### minOf() 및 maxOf()

이러한 함수는 두 개 또는 세 개의 주어진 값 중에서 가장 낮고 가장 큰 값을 찾는 데 사용할 수 있으며, 값은 기본 숫자이거나 `Comparable` 객체입니다. 객체를 직접 비교할 수없는 경우 추가 `Comparator` 인스턴스를 사용하는 각 함수의 오버로드도 있습니다.

```kotlin
fun main(args: Array<String>) {

    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })

    println("minSize = $minSize")
    println("longestList = $longestList")
}
```

### 배열과 유사한 목록 인스턴스화 함수

`Array` 생성자와 유사하게 `List` 및 `MutableList` 인스턴스를 만들고 람다를 호출하여 각 요소를 초기화하는 함수가 있습니다.

```kotlin
fun main(args: Array<String>) {

    val squares = List(10) { index `->` index * index }
    val mutable = MutableList(10) { 0 }

    println("squares: $squares")
    println("mutable: $mutable")
}
```

### Map.getValue()

`Map`에 대한이 확장은 지정된 키에 해당하는 기존 값을 반환하거나 어떤 키를 찾을 수 없는지 언급하는 예외를 발생시킵니다.
맵이 `withDefault`로 생성된 경우 이 함수는 예외를 발생시키는 대신 기본값을 반환합니다.

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k `->` k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // `<-` this will throw NoSuchElementException

    println("value is $value")
    println("value2 is $value2")
}
```

### 추상 컬렉션

이러한 추상 클래스는 Kotlin 컬렉션 클래스를 구현할 때 기본 클래스로 사용할 수 있습니다.
읽기 전용 컬렉션을 구현하기 위해 `AbstractCollection`, `AbstractList`, `AbstractSet` 및 `AbstractMap`이 있고, 변경 가능한 컬렉션에는 `AbstractMutableCollection`, `AbstractMutableList`, `AbstractMutableSet` 및 `AbstractMutableMap`이 있습니다.
JVM에서 이러한 추상적 변경 가능한 컬렉션은 JDK의 추상적 컬렉션에서 대부분의 기능을 상속합니다.

### 배열 조작 함수

표준 라이브러리는 이제 배열에 대한 요소별 연산에 대한 함수 세트를 제공합니다. 비교
(`contentEquals` 및 `contentDeepEquals`), 해시 코드 계산 (`contentHashCode` 및 `contentDeepHashCode`),
및 문자열로의 변환 (`contentToString` 및 `contentDeepToString`). JVM 모두에 대해 지원됩니다.
(여기서 `java.util.Arrays`의 해당 함수에 대한 별칭으로 작동함) 및 JS (여기서 구현은
Kotlin 표준 라이브러리에서 제공됩니다).

```kotlin
fun main(args: Array<String>) {

    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list

}
```

## JVM 백엔드

### Java 8 바이트 코드 지원

Kotlin에는 이제 Java 8 바이트 코드를 생성하는 옵션이 있습니다 (`-jvm-target 1.8` 명령줄 옵션 또는 해당 옵션
Ant/Maven/Gradle에서). 현재는 바이트 코드의 의미를 변경하지 않지만 (특히 인터페이스의 기본 메서드와 람다는 Kotlin 1.0과 정확히 동일하게 생성됨) 나중에 이를 더 활용할 계획입니다.

### Java 8 표준 라이브러리 지원

이제 Java 7과 8에서 추가된 새로운 JDK API를 지원하는 표준 라이브러리의 별도 버전이 있습니다.
새로운 API에 액세스해야하는 경우 표준 `kotlin-stdlib` 대신 `kotlin-stdlib-jre7` 및 `kotlin-stdlib-jre8` maven 아티팩트를 사용하십시오.
이러한 아티팩트는 `kotlin-stdlib` 위에 있는 작은 확장이며 프로젝트에 전이적 종속성으로 가져옵니다.

### 바이트 코드의 매개변수 이름

Kotlin은 이제 바이트 코드에 매개변수 이름을 저장하는 것을 지원합니다. 이는 `-java-parameters` 명령줄 옵션을 사용하여 활성화할 수 있습니다.

### 상수 인라인

컴파일러는 이제 `const val` 속성의 값을 사용되는 위치로 인라인합니다.

### 변경 가능한 클로저 변수

람다에서 변경 가능한 클로저 변수를 캡처하는 데 사용되는 box 클래스에는 더 이상 휘발성 필드가 없습니다. 이 변경으로 인해 성능이 향상되지만 드문 사용 시나리오에서는 새로운 경쟁 조건이 발생할 수 있습니다. 이에 영향을받는 경우 변수에 액세스하기 위해 자체 동기화를 제공해야합니다.

### javax.script 지원

Kotlin은 이제 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223)와 통합되었습니다.
API를 사용하면 런타임에 코드 스니펫을 평가할 수 있습니다.

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

API를 사용하는 더 큰 예제 프로젝트는 [여기](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)를 참조하십시오.

### kotlin.reflect.full

[Java 9 지원을 준비하기 위해](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/), `kotlin-reflect.jar` 라이브러리의 확장 함수와 속성이 이동되었습니다.
패키지 `kotlin.reflect.full`로 이동되었습니다. 이전 패키지 (`kotlin.reflect`)의 이름은 더 이상 사용되지 않으며
Kotlin 1.2에서 제거됩니다. 핵심 리플렉션 인터페이스 (`KClass` 등)는 Kotlin 표준 라이브러리의 일부입니다.
`kotlin-reflect`가 아니며 이동의 영향을 받지 않습니다.

## JavaScript 백엔드

### 통합 표준 라이브러리

이제 Kotlin 표준 라이브러리의 훨씬 더 많은 부분을 JavaScript로 컴파일된 코드에서 사용할 수 있습니다.
특히 컬렉션 (`ArrayList`, `HashMap` 등), 예외 (`IllegalArgumentException` 등) 및 몇 가지
다른 항목 (`StringBuilder`, `Comparator`)이 이제 `kotlin` 패키지에서 정의됩니다. JVM에서는 이름이 유형입니다.
해당 JDK 클래스에 대한 별칭이고 JS에서는 클래스가 Kotlin 표준 라이브러리에서 구현됩니다.

### 더 나은 코드 생성

JavaScript 백엔드는 이제 JS 코드 처리 도구에 더 친숙한 정적으로 검사 가능한 코드를 더 많이 생성합니다.
미니화기, 최적화기, 린터 등

### external 수정자

Kotlin에서 JavaScript로 구현된 클래스에 타입 안전 방식으로 액세스해야하는 경우 Kotlin을 작성할 수 있습니다.
`external` 수정자를 사용하여 선언합니다. (Kotlin 1.0에서는 `@native` 주석이 대신 사용되었습니다.)
JVM 대상과 달리 JS 대상은 클래스 및 속성과 함께 external 수정자를 사용하는 것을 허용합니다.
예를 들어 DOM `Node` 클래스를 선언하는 방법은 다음과 같습니다.

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### 향상된 가져오기 처리

이제 JavaScript 모듈에서 가져와야 하는 선언을 더 정확하게 설명할 수 있습니다.
외부 선언에 `@JsModule("<module-name>")` 주석을 추가하면 올바르게 가져옵니다.
컴파일 중에 모듈 시스템 (CommonJS 또는 AMD)으로 가져옵니다. 예를 들어 CommonJS를 사용하면 선언이
`require(...)` 함수를 통해 가져옵니다.
또한 선언을 모듈 또는 전역 JavaScript 객체로 가져오려면
`@JsNonModule` 주석을 사용할 수 있습니다.

예를 들어 JQuery를 Kotlin 모듈로 가져오는 방법은 다음과 같습니다.

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) `->` Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

이 경우 JQuery는 `jquery`라는 모듈로 가져옵니다. 또는 $-객체로 사용할 수 있습니다.
Kotlin 컴파일러가 사용하도록 구성된 모듈 시스템에 따라 달라집니다.

응용 프로그램에서 이러한 선언을 다음과 같이 사용할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}