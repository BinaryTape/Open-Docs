[//]: # (title: 기본 문법 개요)

이 문서는 예제와 함께 정리한 기본적인 문법 요소 모음입니다. 각 섹션 끝에는 관련 주제에 대한 상세 설명 링크가 포함되어 있습니다.

JetBrains Academy의 무료 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)을 통해서도 Kotlin의 모든 필수 요소를 배울 수 있습니다.

## 패키지 정의 및 임포트

패키지 정의는 소스 파일의 가장 최상단에 위치해야 합니다.

```kotlin
package my.demo

import kotlin.text.*

// ...
```

디렉터리와 패키지를 일치시킬 필요는 없습니다. 소스 파일은 파일 시스템 내 어디에나 자유롭게 배치할 수 있습니다.

[패키지(Packages)](packages.md)를 참고하세요.

## 프로그램 진입점

Kotlin 애플리케이션의 진입점은 `main` 함수입니다.

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main` 함수의 다른 형태는 가변적인 개수의 `String` 인자를 받습니다.

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 표준 출력으로 출력

`print`는 인자를 표준 출력(standard output)으로 출력합니다.

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println`은 인자를 출력하고 줄 바꿈을 추가하여, 다음에 출력되는 내용이 다음 줄에 나타나도록 합니다.

```kotlin
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-println"}

## 표준 입력으로부터 읽기

`readln()` 함수는 표준 입력(standard input)으로부터 내용을 읽습니다. 이 함수는 사용자가 입력한 전체 줄을 문자열로 읽어옵니다.

`println()`, `readln()`, `print()` 함수를 함께 사용하여 사용자 입력을 요청하고 보여주는 메시지를 출력할 수 있습니다.

```kotlin
// 입력을 요청하는 메시지 출력
println("Enter any word: ")

// 사용자 입력을 읽고 저장합니다. 예: Happiness
val yourWord = readln()

// 입력값과 함께 메시지 출력
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

더 자세한 정보는 [표준 입력 읽기(Read standard input)](read-standard-input.md)를 참고하세요.

## 함수

두 개의 `Int` 파라미터와 `Int` 반환 타입을 가진 함수:

```kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-int"}

함수 본문은 식(expression)이 될 수 있습니다. 이 경우 반환 타입은 추론됩니다.

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

의미 있는 값을 반환하지 않는 함수:

```kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-unit"}

`Unit` 반환 타입은 생략할 수 있습니다.

```kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-omit-unit"}

[함수(Functions)](functions.md)를 참고하세요.

## 변수

Kotlin에서는 키워드 `val` 또는 `var`로 시작하고 그 뒤에 변수 이름을 붙여 변수를 선언합니다.

값이 한 번만 할당되는 변수를 선언할 때는 `val` 키워드를 사용하세요. 이들은 불변(immutable)인 읽기 전용 지역 변수로, 초기화 후에는 다른 값을 다시 할당할 수 없습니다.

```kotlin
fun main() {
//sampleStart
    // 변수 x를 선언하고 5로 초기화합니다
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

다시 할당될 수 있는 변수를 선언할 때는 `var` 키워드를 사용하세요. 이들은 가변(mutable) 변수로, 초기화 후에도 값을 변경할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    // 변수 x를 선언하고 5로 초기화합니다
    var x: Int = 5
    // 변수 x에 새로운 값 6을 다시 할당합니다
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlin은 타입 추론(type inference)을 지원하여 선언된 변수의 데이터 타입을 자동으로 식별합니다. 변수를 선언할 때 변수 이름 뒤의 타입을 생략할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    // 변수 x를 5라는 값으로 선언합니다. `Int` 타입이 추론됩니다.
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

변수는 초기화한 후에만 사용할 수 있습니다. 변수 선언 시점에 초기화하거나, 변수를 먼저 선언하고 나중에 초기화할 수 있습니다. 후자의 경우에는 반드시 데이터 타입을 명시해야 합니다.

```kotlin
fun main() {
//sampleStart
    // 선언 시점에 변수 x를 초기화합니다. 타입 명시는 필수가 아닙니다.
    val x = 5
    // 초기화 없이 변수 c를 선언합니다. 타입 명시가 필수입니다.
    val c: Int
    // 선언 후 변수 c를 초기화합니다
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

최상위(top level)에서 변수를 선언할 수 있습니다.

```kotlin
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-variable-top-level"}

속성(property) 선언에 대한 정보는 [속성(Properties)](properties.md)을 참고하세요.

## 클래스 및 인스턴스 생성

클래스를 정의하려면 `class` 키워드를 사용합니다.
```kotlin
class Shape
```

클래스의 속성(property)은 클래스 선언부나 본문에 나열될 수 있습니다.

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

클래스 선언부에 나열된 파라미터가 있는 기본 생성자는 자동으로 사용할 수 있습니다.

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-class-constructor"}

클래스 간의 상속은 콜론(`:`)으로 선언합니다. 클래스는 기본적으로 `final`입니다. 클래스를 상속 가능하게 만들려면 `open`으로 표시하세요.

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

생성자와 상속에 대한 더 자세한 정보는 [클래스(Classes)](classes.md)와 [객체 및 인스턴스(Objects and instances)](object-declarations.md)를 참고하세요.

## 주석

대부분의 현대 프로그래밍 언어와 마찬가지로, Kotlin은 단일 행(또는 줄 끝) 주석과 여러 행(블록) 주석을 지원합니다.

```kotlin
// 단일 행 주석입니다.

/* 여러 행에 걸친
   블록 주석입니다. */
```

Kotlin의 블록 주석은 중첩될 수 있습니다.

```kotlin
/* 주석이 여기서 시작되어
/* 중첩된 주석을 포함하고 */  
여기서 끝납니다. */
```

문서 주석 문법에 대한 정보는 [Kotlin 코드 문서화(Documenting Kotlin Code)](kotlin-doc.md)를 참고하세요.

## 문자열 템플릿

```kotlin
fun main() {
//sampleStart
    var a = 1
    // 템플릿 내 단순 이름 사용:
    val s1 = "a is $a" 
    
    a = 2
    // 템플릿 내 임의의 식 사용:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

자세한 내용은 [문자열 템플릿(String templates)](strings.md#string-templates)을 참고하세요.

## 조건식

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-conditional-expressions"}

Kotlin에서 `if`는 식(expression)으로도 사용될 수 있습니다.

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

[`if`-식(if-expressions)](control-flow.md#if-expression)을 참고하세요.

## for 루프

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop"}

또는 다음과 같이 사용할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop-indices"}

[for 루프(for loop)](control-flow.md#for-loops)를 참고하세요.

## while 루프

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-while-loop"}

[while 루프(while loop)](control-flow.md#while-loops)를 참고하세요.

## when 식

```kotlin
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "Greeting"
        is Long    -> "Long"
        !is String -> "Not a string"
        else       -> "Unknown"
    }
//sampleEnd

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-when-expression"}

[when 식 및 문(when expressions and statements)](control-flow.md#when-expressions-and-statements)을 참고하세요.

## 범위 (Ranges)

`in` 연산자를 사용하여 숫자가 범위 내에 있는지 확인합니다.

```kotlin
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-range-in"}

숫자가 범위를 벗어났는지 확인합니다.

```kotlin
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-out-of-range"}

범위 내에서 반복합니다.

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-range"}

또는 수열(progression)을 따라 반복합니다.

```kotlin
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-progression"}

[범위 및 수열(Ranges and progressions)](ranges.md)을 참고하세요.

## 컬렉션 (Collections)

컬렉션을 반복합니다.

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-collection"}

`in` 연산자를 사용하여 컬렉션에 객체가 포함되어 있는지 확인합니다.

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-in"}

[람다 식(lambda expressions)](lambdas.md)을 사용하여 컬렉션을 필터링하거나 변환(map)합니다.

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-filter-map"}

[컬렉션 개요(Collections overview)](collections-overview.md)를 참고하세요.

## 널 허용 값 및 널 체크

`null` 값이 가능할 때는 참조를 명시적으로 널 허용(nullable)으로 표시해야 합니다. 널 허용 타입 이름은 끝에 `?`가 붙습니다.

`str`이 정수를 포함하지 않을 경우 `null`을 반환합니다.

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

널 허용 값을 반환하는 함수를 사용하는 예:

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // `x * y`를 직접 사용하면 null을 가질 수 있어 에러가 발생합니다.
    if (x != null && y != null) {
        // 널 체크 후에 x와 y는 자동으로 널 비허용 타입으로 캐스팅됩니다.
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}
//sampleEnd

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-nullable-value"}

또는 다음과 같이 작성할 수 있습니다.

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // 널 체크 후에 x와 y는 자동으로 널 비허용 타입으로 캐스팅됩니다.
    println(x * y)
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-null-check"}

[널 안전성(Null-safety)](null-safety.md)을 참고하세요.

## 타입 체크 및 자동 캐스트

`is` 연산자는 식이 특정 타입의 인스턴스인지 확인합니다.
불변 지역 변수나 속성이 특정 타입인지 확인되었다면, 명시적으로 캐스팅할 필요가 없습니다.

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj`는 이 분기 내에서 자동으로 `String`으로 캐스팅됩니다.
        return obj.length
    }

    // 타입 체크 분기 밖에서 `obj`는 여전히 `Any` 타입입니다.
    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator"}

또는 다음과 같이 작성할 수 있습니다.

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj`는 이 분기 내에서 자동으로 `String`으로 캐스팅됩니다.
    return obj.length
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-expression"}

심지어 이렇게도 가능합니다.

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj`는 `&&`의 우항에서 자동으로 `String`으로 캐스팅됩니다.
    if (obj is String && obj.length >= 0) {
        return obj.length
    }

    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-logic"}

[클래스(Classes)](classes.md)와 [타입 캐스트(Type casts)](typecasts.md)를 참고하세요.