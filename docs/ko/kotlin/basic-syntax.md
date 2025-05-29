[//]: # (title: 기본 구문)

이 문서는 예제와 함께 기본 구문 요소를 모아 놓은 것입니다. 각 섹션의 끝에는 관련 주제에 대한 상세 설명 링크가 있습니다.

또한 JetBrains Academy에서 제공하는 무료 [Kotlin 핵심 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)을 통해 Kotlin의 모든 필수 사항을 학습할 수 있습니다.

## 패키지 정의 및 임포트

패키지 선언은 소스 파일의 맨 위에 있어야 합니다:

```kotlin
package my.demo

import kotlin.text.*

// ...
```

디렉터리와 패키지를 일치시킬 필요는 없습니다. 소스 파일은 파일 시스템의 어디에든 자유롭게 배치될 수 있습니다.

[패키지](packages.md)를 참조하세요.

## 프로그램 진입점

Kotlin 애플리케이션의 진입점은 `main` 함수입니다:

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

다른 형태의 `main` 함수는 가변 개수의 `String` 인자를 받습니다: 

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 표준 출력으로 인쇄

`print`는 인자를 표준 출력으로 인쇄합니다:

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println`은 인자를 인쇄하고 줄 바꿈을 추가하여 다음에 인쇄하는 내용이 다음 줄에 나타나도록 합니다:

```kotlin
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-println"}

## 표준 입력에서 읽기

`readln()` 함수는 표준 입력에서 읽습니다. 이 함수는 사용자가 입력한 전체 줄을 문자열로 읽습니다.

`println()`, `readln()`, `print()` 함수를 함께 사용하여 사용자 입력을 요청하고 표시하는 메시지를 인쇄할 수 있습니다:

```kotlin
// Prints a message to request input
println("Enter any word: ")

// Reads and stores the user input. For example: Happiness
val yourWord = readln()

// Prints a message with the input
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

더 많은 정보는 [표준 입력 읽기](read-standard-input.md)를 참조하세요.

## 함수

두 개의 `Int` 매개변수와 `Int` 반환 타입을 가진 함수:

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

함수 본문은 표현식이 될 수 있습니다. 이 경우 반환 타입이 추론됩니다:

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

`Unit` 반환 타입은 생략될 수 있습니다:

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

[함수](functions.md)를 참조하세요.

## 변수

Kotlin에서는 `val` 또는 `var` 키워드로 시작하여 변수 이름을 뒤따르는 방식으로 변수를 선언합니다.

`val` 키워드를 사용하여 값이 한 번만 할당되는 변수를 선언합니다. 이 변수들은 불변의 읽기 전용 로컬 변수로, 초기화 후에는 다른 값으로 재할당될 수 없습니다: 

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

`var` 키워드를 사용하여 재할당될 수 있는 변수를 선언합니다. 이 변수들은 가변 변수이며, 초기화 후 값을 변경할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    var x: Int = 5
    // Reassigns a new value of 6 to the variable x
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlin은 타입 추론을 지원하며 선언된 변수의 데이터 타입을 자동으로 식별합니다. 변수를 선언할 때 변수 이름 뒤의 타입을 생략할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    // Declares the variable x with the value of 5;`Int` type is inferred
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

변수는 초기화 후에만 사용할 수 있습니다. 변수를 선언 시점에 초기화하거나, 먼저 변수를 선언하고 나중에 초기화할 수 있습니다. 후자의 경우 데이터 타입을 명시해야 합니다:

```kotlin
fun main() {
//sampleStart
    // Initializes the variable x at the moment of declaration; type is not required
    val x = 5
    // Declares the variable c without initialization; type is required
    val c: Int
    // Initializes the variable c after declaration 
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

최상위 레벨에서 변수를 선언할 수 있습니다:

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

프로퍼티 선언에 대한 정보는 [프로퍼티](properties.md)를 참조하세요.

## 클래스 및 인스턴스 생성

클래스를 정의하려면 `class` 키워드를 사용합니다:
```kotlin
class Shape
```

클래스의 프로퍼티는 선언 또는 본문에 나열될 수 있습니다: 

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

클래스 선언에 나열된 매개변수를 가진 기본 생성자는 자동으로 제공됩니다:

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

클래스 간 상속은 콜론(`:`)으로 선언됩니다. 클래스는 기본적으로 `final`입니다. 클래스를 상속 가능하게 만들려면 `open`으로 표시합니다:

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

생성자 및 상속에 대한 자세한 정보는 [클래스](classes.md) 및 [객체 및 인스턴스](object-declarations.md)를 참조하세요.

## 주석

대부분의 최신 언어와 마찬가지로 Kotlin은 한 줄(또는 _줄 끝_) 주석과 여러 줄(_블록_) 주석을 지원합니다:

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlin의 블록 주석은 중첩될 수 있습니다:

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

문서 주석 문법에 대한 정보는 [Kotlin 코드 문서화](kotlin-doc.md)를 참조하세요.

## 문자열 템플릿

```kotlin
fun main() {
//sampleStart
    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

자세한 내용은 [문자열 템플릿](strings.md#string-templates)을 참조하세요.

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

Kotlin에서 `if`는 표현식으로도 사용될 수 있습니다:

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

[`if` 표현식](control-flow.md#if-expression)을 참조하세요.

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

또는:

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

[for 루프](control-flow.md#for-loops)를 참조하세요.

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

[while 루프](control-flow.md#while-loops)를 참조하세요.

## when 표현식

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

[when 표현식 및 문](control-flow.md#when-expressions-and-statements)을 참조하세요.

## 범위

`in` 연산자를 사용하여 숫자가 범위 내에 있는지 확인합니다:

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

숫자가 범위 밖에 있는지 확인합니다:

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

범위를 순회합니다:

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

또는 진행을 순회합니다:

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

[범위와 진행](ranges.md)을 참조하세요.

## 컬렉션

컬렉션을 순회합니다:

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

`in` 연산자를 사용하여 컬렉션에 객체가 포함되어 있는지 확인합니다:

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

[람다 표현식](lambdas.md)을 사용하여 컬렉션을 필터링하고 매핑합니다:

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

[컬렉션 개요](collections-overview.md)를 참조하세요.

## 널 가능 값과 널 검사

`null` 값이 가능할 경우 참조는 명시적으로 널 가능으로 표시되어야 합니다. 널 가능 타입 이름은 끝에 `?`를 가집니다.

`str`이 정수를 포함하지 않으면 `null`을 반환합니다:

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

널 가능 값을 반환하는 함수를 사용합니다:

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // Using `x * y` yields error because they may hold nulls.
    if (x != null && y != null) {
        // x and y are automatically cast to non-nullable after null check
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

또는:

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

    // x and y are automatically cast to non-nullable after null check
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

[널 안정성](null-safety.md)을 참조하세요.

## 타입 검사 및 자동 캐스트

`is` 연산자는 표현식이 특정 타입의 인스턴스인지 확인합니다.
불변 로컬 변수나 프로퍼티가 특정 타입으로 검사될 경우, 명시적으로 캐스팅할 필요가 없습니다:

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` is automatically cast to `String` in this branch
        return obj.length
    }

    // `obj` is still of type `Any` outside of the type-checked branch
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

또는:

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` is automatically cast to `String` in this branch
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

심지어:

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` is automatically cast to `String` on the right-hand side of `&&`
    if (obj is String && obj.length > 0) {
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

[클래스](classes.md) 및 [타입 캐스트](typecasts.md)를 참조하세요.