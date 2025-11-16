[//]: # (title: 경쟁 프로그래밍을 위한 코틀린)

이 튜토리얼은 코틀린을 사용해본 적 없는 경쟁 프로그래머와 경쟁 프로그래밍 대회에 참가해본 적 없는 코틀린 개발자 모두를 위해 고안되었습니다. 해당 프로그래밍 기술을 갖추고 있다고 가정합니다.

[경쟁 프로그래밍(Competitive programming)](https://en.wikipedia.org/wiki/Competitive_programming)은 참가자들이 엄격한 제약 조건 내에서 정확하게 명시된 알고리즘 문제를 해결하기 위해 프로그램을 작성하는 마인드 스포츠입니다. 문제는 어떤 소프트웨어 개발자라도 해결할 수 있고 올바른 솔루션을 얻는 데 코드가 거의 필요 없는 간단한 문제부터 특수 알고리즘, 자료 구조에 대한 지식과 많은 연습이 필요한 복잡한 문제까지 다양합니다. 코틀린은 경쟁 프로그래밍을 위해 특별히 설계된 것은 아니지만, 이 분야에 우연히 잘 들어맞습니다. 프로그래머가 코드를 작성하고 읽는 데 필요한 일반적인 상용구(boilerplate) 양을 동적 타입(dynamically-typed) 스크립팅 언어가 제공하는 수준으로 거의 줄여주는 동시에, 정적 타입(statically-typed) 언어의 도구와 성능을 제공합니다.

IntelliJ IDEA에서 코틀린 프로젝트를 생성하는 방법에 대한 자세한 정보는 [콘솔 앱 생성](jvm-get-started.md) 튜토리얼을 참조하세요. 경쟁 프로그래밍에서는 일반적으로 단일 프로젝트를 생성하고 각 문제의 솔루션을 단일 소스 파일에 작성합니다.

## 간단한 예시: 도달 가능한 숫자 문제

구체적인 예시를 살펴보겠습니다.

[Codeforces](https://codeforces.com/) 라운드 555는 4월 26일에 3부 리그를 대상으로 개최되었으며, 이는 어떤 개발자라도 시도해볼 만한 문제들이 있었다는 의미입니다. [이 링크](https://codeforces.com/contest/1157)를 사용하여 문제들을 읽을 수 있습니다. 해당 세트에서 가장 간단한 문제는 [문제 A: 도달 가능한 숫자](https://codeforces.com/contest/1157/problem/A)입니다. 문제 설명에 명시된 간단한 알고리즘을 구현하도록 요청합니다.

임의의 이름으로 코틀린 소스 파일을 생성하여 문제를 풀기 시작합니다. `A.kt`가 적합할 것입니다.
먼저, 문제 설명에 명시된 함수를 다음과 같이 구현해야 합니다.

> 함수 f(x)를 다음과 같이 정의합니다: x에 1을 더한 다음, 결과 숫자에 0이 하나라도 뒤에 붙어 있는 한 해당 0을 제거합니다.

코틀린은 개발자가 어느 한쪽으로 치우치도록 강요하지 않으면서, 명령형(imperative) 및 함수형(functional) 프로그래밍 스타일을 모두 지원하는 실용적이고 비독단적인 언어입니다. `f` 함수를 함수형 스타일로 구현할 수 있으며, 코틀린의 [꼬리 재귀(tail recursion)](functions.md#tail-recursive-functions)와 같은 기능을 사용할 수 있습니다.

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

또는 전통적인 [`while` 루프](control-flow.md)와 코틀린에서 [`var`](basic-syntax.md#variables)로 표시되는 가변 변수를 사용하여 `f` 함수의 명령형 구현을 작성할 수 있습니다.

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

코틀린의 타입은 타입 추론(type-inference)의 광범위한 사용으로 인해 많은 곳에서 선택 사항이지만, 모든 선언은 컴파일 시 알려지는 잘 정의된 정적 타입을 여전히 가집니다.

이제 남은 것은 입력을 읽고 문제 설명에서 요구하는 나머지 알고리즘을 구현하는 주 함수를 작성하는 것입니다. 즉, 표준 입력으로 주어진 초기 숫자 `n`에 함수 `f`를 반복적으로 적용하면서 생성되는 서로 다른 정수의 수를 계산하는 것입니다.

기본적으로 코틀린은 JVM에서 실행되며 동적 크기 배열(`ArrayList`), 해시 기반 맵 및 세트(`HashMap`/`HashSet`), 트리 기반 정렬 맵 및 세트(`TreeMap`/`TreeSet`)와 같은 범용 컬렉션 및 자료 구조를 포함하는 풍부하고 효율적인 컬렉션 라이브러리에 직접 접근할 수 있습니다. 함수 `f`를 적용하는 동안 이미 도달한 값을 추적하기 위해 정수 해시 세트(hash-set)를 사용하면, 문제에 대한 간단한 명령형 솔루션 버전을 아래와 같이 작성할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="코틀린 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

경쟁 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 경쟁 프로그래밍에서는 입력 형식이 항상 정확하게 지정되어 있으며, 실제 입력은 문제 설명의 입력 사양에서 벗어날 수 없습니다. 그렇기 때문에 코틀린의 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수를 사용할 수 있습니다. 이 함수는 입력 문자열이 존재함을 단언하고 그렇지 않으면 예외를 발생시킵니다. 마찬가지로, [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 함수는 입력 문자열이 정수가 아닌 경우 예외를 발생시킵니다.

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

[`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 함수 호출 뒤에 코틀린의 [널 단언 연산자(null-assertion operator)](null-safety.md#not-null-assertion-operator) `!!`의 사용에 주목하세요. 코틀린의 `readLine()` 함수는 [널 허용 타입(nullable type)](null-safety.md#nullable-types-and-non-nullable-types) `String?`을 반환하도록 정의되어 있으며, 입력 끝에 `null`을 반환하여 개발자가 누락된 입력의 경우를 명시적으로 처리하도록 강제합니다.

경쟁 프로그래밍에서는 잘못된 형식의 입력을 처리할 필요가 없습니다. 경쟁 프로그래밍에서는 입력 형식이 항상 정확하게 지정되어 있으며 실제 입력은 문제 설명의 입력 사양에서 벗어날 수 없습니다. 널 단언 연산자 `!!`가 기본적으로 하는 일은 입력 문자열이 존재함을 단언하고 그렇지 않으면 예외를 발생시키는 것입니다. 마찬가지로, [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 함수도 그렇습니다.

</tab>
</tabs>

모든 온라인 경쟁 프로그래밍 대회에서는 미리 작성된 코드의 사용을 허용하므로, 실제 솔루션 코드를 다소 더 읽고 쓰기 쉽게 만들기 위해 경쟁 프로그래밍에 맞춰진 유틸리티 함수의 자체 라이브러리를 정의할 수 있습니다. 그런 다음 이 코드를 솔루션의 템플릿으로 사용할 수 있습니다. 예를 들어, 경쟁 프로그래밍에서 입력을 읽기 위한 다음 헬퍼 함수들을 정의할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="코틀린 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // string line
private fun readInt() = readStr().toInt() // single int
// similar for other types you'd use in your solutions
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // string line
private fun readInt() = readStr().toInt() // single int
// similar for other types you'd use in your solutions
```

</tab>
</tabs>

여기에서 `private` [가시성 변경자(visibility modifier)](visibility-modifiers.md)의 사용에 주목하세요. 가시성 변경자 개념은 경쟁 프로그래밍과 전혀 관련이 없지만, 동일한 템플릿을 기반으로 여러 솔루션 파일을 배치할 때 동일한 패키지 내의 공용 선언 충돌 오류를 방지할 수 있습니다.

## 함수형 연산자 예시: 긴 숫자 문제

더 복잡한 문제의 경우, 코틀린의 광범위한 컬렉션 함수형 연산 라이브러리는 상용구 코드(boilerplate)를 최소화하고 코드를 선형적이고 위에서 아래로, 왼쪽에서 오른쪽으로 흐르는 유연한 데이터 변환 파이프라인으로 만드는 데 유용합니다. 예를 들어, [문제 B: 긴 숫자](https://codeforces.com/contest/1157/problem/B)는 간단한 그리디 알고리즘(greedy algorithm)을 구현하며, 단 하나의 가변 변수(mutable variable)도 없이 이 스타일로 작성할 수 있습니다.

<tabs group="kotlin-versions">
<tab title="코틀린 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
fun main() {
    // read input
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
fun main() {
    // read input
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

이 밀집된 코드에서는 컬렉션 변환 외에도 로컬 함수(local functions) 및 [엘비스 연산자(elvis operator)](null-safety.md#elvis-operator) `?:`와 같은 편리한 코틀린 기능을 볼 수 있습니다. 이러한 기능은 `.takeIf { it >= 0 } ?: s.length`와 같은 간결하고 읽기 쉬운 표현으로 "값이 양수이면 사용하고, 그렇지 않으면 길이를 사용한다"와 같은 [관용구(idioms)](idioms.md)를 표현할 수 있게 합니다. 그러나 코틀린에서는 추가 가변 변수를 생성하여 동일한 코드를 명령형 스타일로 표현하는 것도 전혀 문제 없습니다.

이와 같은 경쟁 프로그래밍 작업에서 입력을 더 간결하게 읽기 위해, 다음과 같은 헬퍼 입력 읽기 함수 목록을 가질 수 있습니다.

<tabs group="kotlin-versions">
<tab title="코틀린 1.6.0 이상" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // string line
private fun readInt() = readStr().toInt() // single int
private fun readStrings() = readStr().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

</tab>
<tab title="이전 버전" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // string line
private fun readInt() = readStr().toInt() // single int
private fun readStrings() = readStr().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

</tab>
</tabs>

이러한 헬퍼 함수들을 사용하면 입력을 읽는 코드 부분이 더 간단해지며, 문제 설명의 입력 사양을 한 줄씩 밀접하게 따르게 됩니다.

```kotlin
// read input
val n = readInt()
val s = readStr()
val fl = readInts()
```

경쟁 프로그래밍에서는 코드가 한 번만 작성되고 그 이후에는 유지 보수되지 않으므로, 일반적인 산업 프로그래밍 관행보다 변수에 짧은 이름을 부여하는 것이 일반적입니다. 그러나 이러한 이름은 일반적으로 여전히 기억하기 쉽게 만들어집니다. 예를 들어 배열에는 `a`, 인덱스에는 `i`, `j` 등, 테이블의 행 및 열 번호에는 `r` 및 `c`, 좌표에는 `x` 및 `y` 등이 사용됩니다. 입력 데이터에 대해 문제 설명에 주어진 이름과 동일하게 유지하는 것이 더 쉽습니다. 그러나 더 복잡한 문제는 더 많은 코드를 필요로 하며, 이는 더 길고 자명한 변수 및 함수 이름을 사용하게 합니다.

## 추가 팁과 요령

경쟁 프로그래밍 문제는 종종 다음과 같은 입력을 가집니다.

The first line of the input contains two integers `n` and `k`

코틀린에서는 정수 리스트에서 [구조 분해 선언(destructuring declaration)](destructuring-declarations.md)을 사용하여 다음 문장으로 이 줄을 간결하게 파싱할 수 있습니다.

```kotlin
val (n, k) = readInts()
```

덜 구조화된 입력 형식을 파싱하기 위해 JVM의 `java.util.Scanner` 클래스를 사용하는 것이 유혹적일 수 있습니다. 코틀린은 JVM 라이브러리와 잘 상호 운용되도록 설계되어, 코틀린에서 이들을 사용하는 것이 매우 자연스럽게 느껴집니다. 그러나 `java.util.Scanner`는 극도로 느리다는 점에 유의하십시오. 사실 너무 느려서 10<sup>5</sup>개 이상의 정수를 파싱하는 데 일반적인 2초 시간 제한을 맞추지 못할 수 있지만, 간단한 코틀린의 `split(" ").map { it.toInt() }`는 이를 처리할 수 있습니다.

코틀린에서 출력을 작성하는 것은 일반적으로 [`println(...)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 호출과 코틀린의 [문자열 템플릿(string templates)](strings.md#string-templates)을 사용하여 간단합니다. 그러나 출력이 10<sup>5</sup>줄 이상인 경우 주의해야 합니다. 코틀린에서는 각 줄마다 출력이 자동으로 플러시(flush)되므로, 그렇게 많은 `println` 호출을 발행하는 것은 너무 느립니다. 배열 또는 리스트에서 여러 줄을 더 빠르게 작성하는 방법은 `"
"`을 구분자로 사용하여 [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 함수를 사용하는 것입니다.

```kotlin
println(a.joinToString("
")) // each element of array/list of a separate line
```

## 코틀린 학습하기

코틀린은 배우기 쉽습니다. 특히 자바를 이미 아는 사람들에게는 더욱 그렇습니다. 소프트웨어 개발자를 위한 코틀린 기본 문법에 대한 짧은 소개는 웹사이트의 참조 섹션에서 [기본 문법](basic-syntax.md)부터 직접 찾아볼 수 있습니다.

IDEA는 내장된 [자바-코틀린 변환기(Java-to-Kotlin converter)](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)를 가지고 있습니다. 이는 자바에 익숙한 사람들이 해당 코틀린 구문 구성을 배우는 데 사용될 수 있지만, 완벽하지 않으므로 코틀린에 익숙해지고 [코틀린 관용구(Kotlin idioms)](idioms.md)를 배우는 것이 여전히 가치가 있습니다.

코틀린 문법과 코틀린 표준 라이브러리 API를 학습하기 위한 훌륭한 자료는 [Kotlin Koans](koans.md)입니다.