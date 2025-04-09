---
title: "기본 구문"
---
다음은 예제가 포함된 기본 구문 요소 모음입니다. 각 섹션의 끝에는
관련 항목에 대한 자세한 설명 링크가 있습니다.

JetBrains Academy에서 제공하는 무료 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)을 통해 모든 Kotlin 필수 사항을 배울 수도 있습니다.

## 패키지 정의 및 임포트

패키지 지정은 소스 파일의 맨 위에 있어야 합니다.

```kotlin
package my.demo

import kotlin.text.*

// ...
```

디렉터리와 패키지를 일치시킬 필요는 없습니다. 소스 파일은 파일 시스템에 임의로 배치할 수 있습니다.

[패키지](packages)를 참조하세요.

## 프로그램 진입점

Kotlin 애플리케이션의 진입점은 `main` 함수입니다.

```kotlin
fun main() {
    println("Hello world!")
}
```

또 다른 형태의 `main`은 가변적인 수의 `String` 인수를 허용합니다.

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

## 표준 출력으로 인쇄

`print`는 해당 인수를 표준 출력으로 인쇄합니다.

```kotlin
fun main() {

    print("Hello ")
    print("world!")

}
```

`println`은 해당 인수를 인쇄하고 줄 바꿈을 추가하므로 다음에 인쇄하는 내용이 다음 줄에 나타납니다.

```kotlin
fun main() {

    println("Hello world!")
    println(42)

}
```

## 표준 입력에서 읽기

`readln()` 함수는 표준 입력에서 읽습니다. 이 함수는 사용자가 입력한 전체 줄을 문자열로 읽습니다.

`println()`, `readln()`, `print()` 함수를 함께 사용하여 사용자 입력을 요청하고 표시하는 메시지를 인쇄할 수 있습니다.

```kotlin
// 입력 요청 메시지 인쇄
println("Enter any word: ")

// 사용자 입력을 읽고 저장합니다. 예: Happiness
val yourWord = readln()

// 입력이 포함된 메시지 인쇄
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

자세한 내용은 [표준 입력 읽기](read-standard-input)를 참조하세요.

## 함수

두 개의 `Int` 매개변수와 `Int` 반환 형식이 있는 함수:

```kotlin

fun sum(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```

함수 본문은 식일 수 있습니다. 해당 반환 형식은 추론됩니다.

```kotlin

fun sum(a: Int, b: Int) = a + b

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```

유의미한 값을 반환하지 않는 함수:

```kotlin

fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

`Unit` 반환 형식은 생략할 수 있습니다.

```kotlin

fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

[함수](functions)를 참조하세요.

## 변수

Kotlin에서는 `val` 또는 `var` 키워드로 시작하여 변수 이름을 차례로 지정하여 변수를 선언합니다.

값을 한 번만 할당하는 변수를 선언하려면 `val` 키워드를 사용합니다. 이러한 변수는 변경 불가능한 읽기 전용 로컬 변수이므로 초기화 후 다른 값을 다시 할당할 수 없습니다.

```kotlin
fun main() {

    // 변수 x를 선언하고 값 5로 초기화합니다.
    val x: Int = 5
    // 5

    println(x)
}
```

다시 할당할 수 있는 변수를 선언하려면 `var` 키워드를 사용합니다. 이러한 변수는 변경 가능한 변수이므로 초기화 후 값을 변경할 수 있습니다.

```kotlin
fun main() {

    // 변수 x를 선언하고 값 5로 초기화합니다.
    var x: Int = 5
    // 변수 x에 새 값 6을 다시 할당합니다.
    x += 1
    // 6

    println(x)
}
```

Kotlin은 형식 추론을 지원하고 선언된 변수의 데이터 형식을 자동으로 식별합니다. 변수를 선언할 때 변수 이름 뒤에 형식을 생략할 수 있습니다.

```kotlin
fun main() {

    // 값 5로 변수 x를 선언합니다. `Int` 형식이 추론됩니다.
    val x = 5
    // 5

    println(x)
}
```

초기화한 후에만 변수를 사용할 수 있습니다. 선언 시 변수를 초기화하거나 먼저 변수를 선언하고 나중에 초기화할 수 있습니다.
두 번째 경우에는 데이터 형식을 지정해야 합니다.

```kotlin
fun main() {

    // 선언 시 변수 x를 초기화합니다. 형식이 필요하지 않습니다.
    val x = 5
    // 초기화하지 않고 변수 c를 선언합니다. 형식이 필요합니다.
    val c: Int
    // 선언 후 변수 c를 초기화합니다.
    c = 3
    // 5
    // 3

    println(x)
    println(c)
}
```

최상위 수준에서 변수를 선언할 수 있습니다.

```kotlin

val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```

속성 선언에 대한 자세한 내용은 [속성](properties)을 참조하세요.

## 클래스 및 인스턴스 만들기

클래스를 정의하려면 `class` 키워드를 사용합니다.
```kotlin
class Shape
```

클래스의 속성은 해당 선언 또는 본문에 나열할 수 있습니다.

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

클래스 선언에 나열된 매개변수가 있는 기본 생성자를 자동으로 사용할 수 있습니다.

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```

클래스 간의 상속은 콜론(`:`)으로 선언됩니다. 클래스는 기본적으로 `final`입니다. 클래스를 상속 가능하게 만들려면
`open`으로 표시합니다.

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

생성자 및 상속에 대한 자세한 내용은 [클래스](classes) 및 [객체 및 인스턴스](object-declarations)를 참조하세요.

## 주석

대부분의 최신 언어와 마찬가지로 Kotlin은 한 줄(또는 _줄 끝_) 주석과 여러 줄(_블록_) 주석을 지원합니다.

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlin의 블록 주석은 중첩될 수 있습니다.

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

문서 주석 구문에 대한 자세한 내용은 [Kotlin 코드 문서화](kotlin-doc)를 참조하세요.

## 문자열 템플릿

```kotlin
fun main() {

    var a = 1
    // 템플릿의 단순 이름:
    val s1 = "a is $a" 
    
    a = 2
    // 템플릿의 임의 식:
    val s2 = "${s1.replace("is", "was")}, but now is $a"

    println(s2)
}
```

자세한 내용은 [문자열 템플릿](strings#string-templates)을 참조하세요.

## 조건식

```kotlin

fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

Kotlin에서 `if`는 식으로도 사용할 수 있습니다.

```kotlin

fun maxOf(a: Int, b: Int) = if (a > b) a else b

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

[`if`-식](control-flow#if-expression)을 참조하세요.

## for 루프

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }

}
```

또는:

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }

}
```

[for 루프](control-flow#for-loops)를 참조하세요.

## while 루프

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }

}
```

[while 루프](control-flow#while-loops)를 참조하세요.

## when 식

```kotlin

fun describe(obj: Any): String =
    when (obj) {
        1          `->` "One"
        "Hello"    `->` "Greeting"
        is Long    `->` "Long"
        !is String `->` "Not a string"
        else       `->` "Unknown"
    }

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```

[when 식 및 문](control-flow#when-expressions-and-statements)을 참조하세요.

## 범위

`in` 연산자를 사용하여 숫자가 범위 내에 있는지 확인합니다.

```kotlin
fun main() {

    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }

}
```

숫자가 범위를 벗어났는지 확인합니다.

```kotlin
fun main() {

    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }

}
```

범위 반복:

```kotlin
fun main() {

    for (x in 1..5) {
        print(x)
    }

}
```

또는 진행 반복:

```kotlin
fun main() {

    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }

}
```

[범위 및 진행](ranges)을 참조하세요.

## 컬렉션

컬렉션 반복:

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")

    for (item in items) {
        println(item)
    }

}
```

`in` 연산자를 사용하여 컬렉션에 객체가 포함되어 있는지 확인합니다.

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")

    when {
        "orange" in items `->` println("juicy")
        "apple" in items `->` println("apple is fine too")
    }

}
```

[람다 식](lambdas)을 사용하여 컬렉션을 필터링하고 매핑합니다.

```kotlin
fun main() {

    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }

}
```

[컬렉션 개요](collections-overview)를 참조하세요.

## Nullable 값 및 null 확인

`null` 값이 가능하면 참조를 nullable로 명시적으로 표시해야 합니다. Nullable 형식 이름은 끝에 `?`가 있습니다.

`str`에 정수가 없으면 `null`을 반환합니다.

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

nullable 값을 반환하는 함수를 사용합니다.

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // `x * y`는 null 값을 가질 수 있으므로 오류가 발생합니다.
    if (x != null && y != null) {
        // x와 y는 null 확인 후 자동으로 non-nullable로 캐스팅됩니다.
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```

또는:

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // x와 y는 null 확인 후 자동으로 non-nullable로 캐스팅됩니다.
    println(x * y)

}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```

[Null-safety](null-safety)를 참조하세요.

## 형식 확인 및 자동 캐스트

`is` 연산자는 식이 특정 형식의 인스턴스인지 확인합니다.
변경 불가능한 로컬 변수 또는 속성이 특정 형식으로 확인되면 명시적으로 캐스팅할 필요가 없습니다.

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // 이 분기에서 `obj`는 자동으로 `String`으로 캐스팅됩니다.
        return obj.length
    }

    // `obj`는 형식 확인 분기 외부에서 여전히 `Any` 형식입니다.
    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

또는:

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // 이 분기에서 `obj`는 자동으로 `String`으로 캐스팅됩니다.
    return obj.length
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

또는 심지어:

```kotlin

fun getStringLength(obj: Any): Int? {
    // `obj`는 `&&`의 오른쪽에 있는 `String`으로 자동으로 캐스팅됩니다.
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```

[클래스](classes) 및 [형식 캐스트](typecasts)를 참조하세요.